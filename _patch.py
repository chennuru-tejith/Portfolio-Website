import io, re
root = r"C:\Users\Tejith\OneDrive - O. P. Jindal Global University\Portfolio Website\\"
# night navy / periwinkle / champagne  ->  obsidian / midnight / antique bronze / linen
HEX = {
    "#0a0f1f": "#03071e", "#10172b": "#050c2b", "#161f38": "#07133b", "#121a31": "#06102f",
    "#eef1f8": "#eadcc5", "#bcc4d8": "#c9bea9", "#8c96b0": "#9c9384", "#818ba6": "#8f877a",
    "#8ea2ff": "#b58a57", "#b7c3ff": "#d1ad7d", "#e2c792": "#d8c3a0", "#a9b6ff": "#c99c66", "#7dd3b0": "#a9c7a0",
    "#f5f6fb": "#f4ede1", "#eceff8": "#ede4d4", "#e3e8f5": "#e4d8c3", "#e1e6f2": "#e6dccb",
    "#343c5c": "#1f2a4d", "#4b5475": "#4a5373", "#5a6385": "#545c7c",
    "#4353d6": "#7a5530", "#2f3cb0": "#5c3f21", "#8a6a2a": "#8a5a2b", "#2a3290": "#13235c", "#157a5c": "#3f6b3f",
}
RGBA = [
    (r"rgba\(\s*180,\s*195,\s*255", "rgba(234, 220, 197"),
    (r"rgba\(\s*142,\s*162,\s*255", "rgba(181, 138, 87"),
    (r"rgba\(\s*22,\s*31,\s*56", "rgba(7, 19, 59"),
    (r"rgba\(\s*14,\s*20,\s*48", "rgba(3, 7, 30"),
    (r"rgba\(\s*67,\s*83,\s*214", "rgba(122, 85, 48"),
    (r"rgba\(\s*125,\s*211,\s*176", "rgba(169, 199, 160"),
    (r"rgba\(\s*21,\s*122,\s*92", "rgba(63, 107, 63"),
    # soft background light: indigo / blue / violet  ->  bronze / midnight
    (r"rgba\(\s*99,\s*102,\s*241", "rgba(181, 138, 87"),
    (r"rgba\(\s*56,\s*120,\s*230", "rgba(7, 19, 59"),
    (r"rgba\(\s*124,\s*92,\s*230", "rgba(20, 38, 100"),
]
for name in ["css/style.css", "build.js", "js/app.js", "index.html"]:
    p = root + name; s = io.open(p, encoding="utf-8").read()
    for o, n in HEX.items(): s = re.sub(re.escape(o), n, s, flags=re.I)
    for o, n in RGBA: s = re.sub(o, n, s)
    io.open(p, "w", encoding="utf-8", newline="").write(s)

c = io.open(root + "css/style.css", encoding="utf-8").read()
for o, n in [
    ("linear-gradient(135deg, #4f5fe6 0%, #6a4fd8 100%)", "linear-gradient(135deg, #e0bd88 0%, #b58a57 50%, #8f6639 100%)"),
    ("linear-gradient(135deg, #5d6cf0 0%, #7a5ee6 100%)", "linear-gradient(135deg, #ebcb98 0%, #c49763 50%, #9c7043 100%)"),
    ("linear-gradient(135deg, #7a5530 0%, #6a46d0 100%)", "linear-gradient(180deg, #0b1d55 0%, #07133b 100%)"),
    ("linear-gradient(135deg, #3644c4 0%, #5a38c0 100%)", "linear-gradient(180deg, #13277a 0%, #0b1d55 100%)"),
    ("linear-gradient(90deg, #6366f1, #8ea2ff)", "linear-gradient(90deg, #8f6639, #d1ad7d)"),
    ("::selection { background: #6366f1; color: #fff; }", "::selection { background: #b58a57; color: #03071e; }"),
    ("Night navy · periwinkle · champagne", "Obsidian · midnight · antique bronze · linen"),
    ("   Round 18: night navy, soft light, soft corners\n   Night #0A0F1F · Surface #10172B / #161F38 · Periwinkle #8EA2FF\n   Indigo-violet for the main action · Champagne #E2C792 for small details",
     "   Round 18: soft light, soft corners\n   Obsidian #03071E · Midnight #07133B · Antique bronze #B58A57 · Linen #EADCC5"),
]:
    assert o in c, o[:40]; c = c.replace(o, n)
# dark bronze button carries obsidian text; light keeps linen on midnight
c = c.replace("""  --brand-hi: linear-gradient(135deg, #ebcb98 0%, #c49763 50%, #9c7043 100%);
  --brand-ink: #ffffff;""", """  --brand-hi: linear-gradient(135deg, #ebcb98 0%, #c49763 50%, #9c7043 100%);
  --brand-ink: #03071e;""")
c = c.replace("""  --brand-hi: linear-gradient(180deg, #13277a 0%, #0b1d55 100%);
  --brand-ink: #ffffff;""", """  --brand-hi: linear-gradient(180deg, #13277a 0%, #0b1d55 100%);
  --brand-ink: #eadcc5;""")
io.open(root + "css/style.css", "w", encoding="utf-8", newline="").write(c)

o = io.open(root + "tools/make-og.py", encoding="utf-8").read()
for x, y in [("BG, INK, INK2, INK3 = (10, 15, 31), (238, 241, 248), (188, 196, 216), (129, 139, 166)", "BG, INK, INK2, INK3 = (3, 7, 30), (234, 220, 197), (201, 190, 169), (143, 135, 122)"),
             ("ACC, CLAY = (142, 162, 255), (226, 199, 146)", "ACC, CLAY = (181, 138, 87), (216, 195, 160)"),
             ("(99, 102, 241), 70", "(181, 138, 87), 34"), ("(124, 92, 230), 46", "(7, 19, 59), 120"), ("(56, 120, 230), 30", "(20, 38, 100), 90")]:
    assert x in o, x[:30]; o = o.replace(x, y)
o = o.replace("(180, 195, 255,", "(234, 220, 197,")
io.open(root + "tools/make-og.py", "w", encoding="utf-8").write(o)

d = io.open(root + "js/data.js", encoding="utf-8").read()
d = d.replace('"New look: night navy with periwinkle and champagne, soft light in the background and rounded corners throughout"', '"Back to midnight blue and antique bronze, now with soft light and rounded corners throughout"')
io.open(root + "js/data.js", "w", encoding="utf-8", newline="").write(d)
r = io.open(root + "README.md", encoding="utf-8").read()
r = re.sub(r"An editorial portfolio in night navy[^.]*Pinyon Script", "An editorial portfolio in midnight blue and antique bronze (obsidian #03071E, midnight #07133B, bronze #B58A57, linen #EADCC5) with soft rounded corners, set in Bell MT, Times New Roman and Pinyon Script", r)
io.open(root + "README.md", "w", encoding="utf-8", newline="").write(r)
s = io.open(root + "index.html", encoding="utf-8").read(); s = re.sub(r"\?v=\d+", "?v=270", s)
io.open(root + "index.html", "w", encoding="utf-8", newline="").write(s)
print("ok")
