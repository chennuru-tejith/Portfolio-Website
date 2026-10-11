# Prepares the generated F1 car and night-circuit images for the site.
# Usage (from the project folder):  python tools/make-car.py car.png bg.jpg
#   car.png: the car on a plain white page (exported from Canva at 1920 x 1080)
#   bg.jpg:  the night-circuit photograph
import sys
from collections import deque
from PIL import Image, ImageFilter

car_src, bg_src = sys.argv[1], sys.argv[2]

# ---- car: crop to the car, flood-fill the white page away from every edge, keep a soft edge ----
im = Image.open(car_src).convert("RGB")
im = im.crop((72, 92, 72 + 1776, 92 + 896))
w, h = im.size
px = im.load()
def is_bg(p):
    r, g, b = p
    return min(r, g, b) > 150 and max(r, g, b) - min(r, g, b) < 24   # white page and its soft grey studio shadow
seen = bytearray(w * h)
q = deque([(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)] + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)])
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
mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
car = im.convert("RGBA"); car.putalpha(mask)
car = car.crop(car.getbbox())                                   # trim empty space around the car
car = car.resize((1600, round(1600 * car.size[1] / car.size[0])), Image.LANCZOS)
car.save("assets/f1-car.webp", "WEBP", quality=90, method=6)
print("assets/f1-car.webp", car.size)

# ---- background ----
bg = Image.open(bg_src).convert("RGB")
bg.save("assets/bg-circuit.webp", "WEBP", quality=78, method=6)
print("assets/bg-circuit.webp", bg.size)
