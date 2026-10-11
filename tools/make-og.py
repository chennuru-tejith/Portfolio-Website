# Draws the link-preview images (1200 x 630) for the home page and each page.
# Run from the project folder:  python tools/make-og.py
from PIL import Image, ImageDraw, ImageFont, ImageFilter

F = "C:/Windows/Fonts/"
serif = lambda s: ImageFont.truetype(F + "BELL.TTF", s)
italic = lambda s: ImageFont.truetype(F + "BELLI.TTF", s)
mono = lambda s: ImageFont.truetype(F + "times.ttf", s)

BG, INK, INK2, INK3 = (3, 7, 30), (234, 220, 197), (201, 190, 169), (143, 135, 122)
ACC, CLAY = (181, 138, 87), (216, 195, 160)

PAGES = {
    "og": ("PORTFOLIO", "Chennuru Tejith", ["Loyalty works both ways.", "If you ask for it, be ready to give it."]),
    "og-work": ("WORK", "Work", ["Three internships, and one school", "build kept honest, step by step."]),
        "og-research": ("RESEARCH", "From SEO to GEO", ["My research on how AI search", "decides what to cite."]),
    "og-about": ("ABOUT", "About", ["Where the work happened,", "and what it earned."]),
        "og-contact": ("CONTACT", "Let's work together", ["Internships, projects,", "or a conversation."]),
}

def glow(img, xy, r, color, alpha):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x, y = xy
    d.ellipse((x - r, y - r, x + r, y + r), fill=color + (alpha,))
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(r / 2.2)))

for name, (kicker, title, lines) in PAGES.items():
    img = Image.new("RGBA", (1200, 630), BG + (255,))
    glow(img, (1150, -60), 460, (181, 138, 87), 34)
    glow(img, (-80, 700), 420, (7, 19, 59), 120)
    glow(img, (420, 300), 520, (20, 38, 100), 90)
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    o = ImageDraw.Draw(ov)  # translucent strokes go on their own layer so they blend
    o.rounded_rectangle((1047, 77, 1113, 143), radius=8, outline=(234, 220, 197, 40), width=1)
    o.line([(80, 480), (1120, 480)], fill=(234, 220, 197, 40), width=1)
    img.alpha_composite(ov)
    d = ImageDraw.Draw(img)
    # crest
    d.rounded_rectangle((1040, 70, 1120, 150), radius=12, outline=INK3 + (255,), width=1)
    d.text((1080, 106), "CT", font=serif(34), fill=INK, anchor="mm")
    d.line([(1070, 132), (1090, 132)], fill=CLAY, width=2)
    # kicker
    d.line([(80, 120), (150, 120)], fill=CLAY, width=2)
    d.text((168, 120), kicker, font=mono(20), fill=CLAY, anchor="lm")
    # title, shrunk to fit
    size = 120
    while d.textlength(title, font=serif(size)) > 900:
        size -= 4
    d.text((76, 255), title, font=serif(size), fill=INK, anchor="ls")
    for i, ln in enumerate(lines):
        d.text((80, 345 + i * 62), ln, font=italic(50), fill=CLAY if i else ACC, anchor="ls")
    d.text((80, 521), "FINANCE  ·  OPERATIONS  ·  LEADERSHIP", font=mono(21), fill=INK2, anchor="lm")
    d.text((80, 567), "Chennuru Tejith  ·  BBA + MBA, O.P. Jindal Global University", font=mono(22), fill=INK3, anchor="lm")
    img.convert("RGB").save(f"assets/{name}.png", optimize=True)
    print("assets/" + name + ".png")
