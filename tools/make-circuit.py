# Prints the SVG path for the racing circuit drawn behind the site (an original layout, not a real track).
# Run from the project folder:  python tools/make-circuit.py
# Paste the output into the <path d="..."> elements of .circuit in index.html.

# corners of an imaginary circuit: long straight, hairpin, esses, a fast sweeper back to the line
P = [(120, 560), (520, 560), (760, 548), (880, 500), (905, 420), (850, 360), (760, 350), (700, 300),
     (720, 230), (820, 190), (880, 120), (820, 70), (640, 80), (470, 130), (380, 210), (300, 230),
     (210, 200), (140, 240), (110, 330), (150, 400), (90, 470)]

def catmull_rom_closed(pts, tension=0.5):
    n = len(pts)
    d = f"M{pts[0][0]:.0f} {pts[0][1]:.0f}"
    for i in range(n):
        p0, p1, p2, p3 = pts[(i - 1) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) * tension / 3, p1[1] + (p2[1] - p0[1]) * tension / 3)
        c2 = (p2[0] - (p3[0] - p1[0]) * tension / 3, p2[1] - (p3[1] - p1[1]) * tension / 3)
        d += f" C{c1[0]:.0f} {c1[1]:.0f} {c2[0]:.0f} {c2[1]:.0f} {p2[0]:.0f} {p2[1]:.0f}"
    return d + "Z"

print(catmull_rom_closed(P))
