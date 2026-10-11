# Turns the cut-out portrait (assets/tejith.webp) into an illustrated avatar:
# edge-preserving smoothing, a handful of flat tones, and clean ink lines, so it stays crisp at any size.
# Run from the project folder:  python tools/make-avatar.py
import cv2
import numpy as np

src = cv2.imread("assets/tejith.webp", cv2.IMREAD_UNCHANGED)          # BGRA
alpha = src[:, :, 3]
bgr = src[:, :, :3]
scale = 1100 / bgr.shape[1]
bgr = cv2.resize(bgr, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
alpha = cv2.resize(alpha, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)

# 1. smooth skin and fabric while keeping edges
smooth = bgr.copy()
for _ in range(10):
    smooth = cv2.bilateralFilter(smooth, 9, 30, 9)
smooth = cv2.edgePreservingFilter(smooth, flags=1, sigma_s=40, sigma_r=0.25)

# 2. flatten into a few tones (k-means over the visible pixels only)
mask = alpha > 128
pix = smooth[mask].reshape(-1, 3).astype(np.float32)
K = 7
_, labels, centers = cv2.kmeans(pix, K, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.5), 4, cv2.KMEANS_PP_CENTERS)
centers = np.uint8(centers)
flat = smooth.copy()
flat[mask] = centers[labels.flatten()]
flat = cv2.medianBlur(flat, 9)
# soften saturation a touch so skin reads warm, not orange
hsv0 = cv2.cvtColor(flat, cv2.COLOR_BGR2HSV).astype(np.float32)
hsv0[:, :, 1] *= 0.82
flat = cv2.cvtColor(np.clip(hsv0, 0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR)

# 3. a gentle midnight tint in the shadows, to sit in the site's palette
hsv = cv2.cvtColor(flat, cv2.COLOR_BGR2HSV).astype(np.float32)
dark = hsv[:, :, 2] < 70
navy = np.array([59, 19, 7], np.float32)                                 # #07133B in BGR
flat_f = flat.astype(np.float32)
flat_f[dark] = flat_f[dark] * 0.6 + navy * 0.4
flat = np.clip(flat_f, 0, 255).astype(np.uint8)

# 4. ink lines only on strong edges (eyes, brows, lips, lapels, hairline)
gray = cv2.cvtColor(smooth, cv2.COLOR_BGR2GRAY)
gray = cv2.GaussianBlur(gray, (5, 5), 0)
edges = cv2.Canny(gray, 40, 110)
edges = cv2.dilate(edges, np.ones((2, 2), np.uint8))
edges = cv2.GaussianBlur(edges, (3, 3), 0)
ink = np.array([40, 16, 8], np.float32)
k = (edges.astype(np.float32) / 255.0 * 0.75)[:, :, None] * mask[:, :, None]
flat = np.clip(flat.astype(np.float32) * (1 - k) + ink * k, 0, 255).astype(np.uint8)

# keep the clean alpha edge
alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
out = np.dstack([flat, alpha])
cv2.imwrite("assets/avatar.webp", out, [cv2.IMWRITE_WEBP_QUALITY, 92])
print("assets/avatar.webp", out.shape[1], "x", out.shape[0])
