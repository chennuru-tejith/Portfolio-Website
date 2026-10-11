# Prepares the hero portrait: removes the plain white studio background, trims the bottom edge
# (which also drops the small corner mark) and saves a web-sized cut-out.
# Usage (from the project folder):  python tools/make-portrait.py path/to/photo
import sys
from collections import deque
from PIL import Image, ImageFilter

src = Image.open(sys.argv[1]).convert("RGB")
w, h = src.size
src = src.crop((0, 0, w, int(h * 0.92)))           # trim the bottom 8%
w, h = src.size
px = src.load()

def is_bg(p):
    r, g, b = p
    return min(r, g, b) > 222 and max(r, g, b) - min(r, g, b) < 26   # near-white, unsaturated

# flood fill from the top, left and right edges only, so the white shirt (which touches the bottom) is kept
seen = bytearray(w * h)
q = deque()
for x in range(w):
    q.append((x, 0))
for y in range(h):
    q.append((0, y)); q.append((w - 1, y))
while q:
    x, y = q.popleft()
    i = y * w + x
    if seen[i] or not is_bg(px[x, y]):
        continue
    seen[i] = 1
    if x > 0: q.append((x - 1, y))
    if x < w - 1: q.append((x + 1, y))
    if y > 0: q.append((x, y - 1))
    if y < h - 1: q.append((x, y + 1))

mask = Image.frombytes("L", (w, h), bytes(0 if s else 255 for s in seen))
mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.6))   # soft, clean edge
out = src.convert("RGBA")
out.putalpha(mask)
out = out.resize((1200, int(1200 * h / w)), Image.LANCZOS)
rgb = out.convert("RGB").filter(ImageFilter.UnsharpMask(radius=1.4, percent=60, threshold=2))   # crisp, not crunchy
rgb.putalpha(out.getchannel("A")); out = rgb
out.save("assets/tejith.webp", "WEBP", quality=92, method=6)
print("assets/tejith.webp", out.size)
