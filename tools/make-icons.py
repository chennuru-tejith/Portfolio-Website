# Redraws the CT crest images: an italic linen C beside an upright bronze T, on midnight.
# Run from the project folder:  python tools/make-icons.py
from PIL import Image, ImageDraw, ImageFont

F = "C:/Windows/Fonts/"
INK, BRONZE, BG, RING = (234, 220, 197), (181, 138, 87), (3, 7, 30), (143, 135, 122)

def crest(size):
    s = size * 4                                            # draw large, then scale down for smooth edges
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, s - 1, s - 1), radius=s // 6, fill=BG + (255,))
    if size >= 128:
        d.rounded_rectangle((s * .06, s * .06, s * .94, s * .94), radius=s // 8, outline=RING + (255,), width=max(2, s // 160))
    fs = int(s * 0.5)
    c_font, t_font = ImageFont.truetype(F + "BELLI.TTF", fs), ImageFont.truetype(F + "BELL.TTF", fs)
    cw, tw = d.textlength("C", font=c_font), d.textlength("T", font=t_font)
    gap = s * 0.06
    x = (s - (cw + gap + tw)) / 2
    y = s * 0.5
    d.text((x, y), "C", font=c_font, fill=INK + (255,), anchor="lm")
    d.text((x + cw + gap, y), "T", font=t_font, fill=BRONZE + (255,), anchor="lm")
    if size >= 128:
        d.line((s * .42, s * .76, s * .58, s * .76), fill=BRONZE + (255,), width=max(2, s // 120))
    return im.resize((size, size), Image.LANCZOS)

crest(512).save("assets/crest-512.png", optimize=True)
crest(180).save("assets/apple-touch-icon.png", optimize=True)
crest(64).save("assets/favicon-64.png", optimize=True)
print("assets/crest-512.png, assets/apple-touch-icon.png, assets/favicon-64.png")
