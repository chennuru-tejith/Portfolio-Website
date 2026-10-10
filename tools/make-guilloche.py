# Draws the engraved guilloche rosette used behind the site (the pattern on banknotes and share certificates).
# Run from the project folder:  python tools/make-guilloche.py
import math

def rosette(R, r, d, turns, rings, phase_step, pts=520):
    paths = []
    for k in range(rings):
        ph = k * phase_step
        coords = []
        for i in range(pts + 1):
            t = 2 * math.pi * turns * i / pts
            x = (R - r) * math.cos(t + ph) + d * math.cos((R - r) / r * t - ph)
            y = (R - r) * math.sin(t + ph) - d * math.sin((R - r) / r * t - ph)
            coords.append(f"{x + 500:.1f} {y + 500:.1f}")
        paths.append("M" + " L".join(coords) + "Z")
    return paths

outer = rosette(R=420, r=60, d=70, turns=3, rings=7, phase_step=math.pi / 63)
inner = rosette(R=250, r=35, d=48, turns=7, rings=5, phase_step=math.pi / 47)
rings = "".join(f'<circle cx="500" cy="500" r="{r}"/>' for r in (470, 476, 180, 184))
svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" fill="none" stroke="#b58a57" stroke-width="0.7">'
       + "".join(f'<path d="{p}"/>' for p in outer)
       + '<g stroke-width="0.6">' + "".join(f'<path d="{p}"/>' for p in inner) + "</g>"
       + f'<g stroke-width="0.8">{rings}</g></svg>')
open("assets/guilloche.svg", "w").write(svg)
print("assets/guilloche.svg", len(svg) // 1024, "KB")
