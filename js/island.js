// ============================================================
//  Tejith Island — an isometric scene drawn as one inline SVG.
//  No 3D engine: every shape is a projected polygon, so it stays light.
//  Colours darken for night via the CSS variables --lit / --shade.
// ============================================================
(function () {
  const W = 1200, HGT = 800;
  const S = 38, OX = 600, OY = 380, C = 0.866, HF = 0.5;
  const P = (x, y, z = 0) => [OX + (x - y) * S * C, OY + (x + y) * S * HF - z * S];
  const pts = (a) => a.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const fill = (hex) => `style="fill:color-mix(in srgb,${hex} var(--lit),var(--shade))"`;
  const stroke = (hex) => `stroke:color-mix(in srgb,${hex} var(--lit),var(--shade))`;
  const poly = (a, hex, extra = "") => `<polygon points="${pts(a)}" ${fill(hex)} ${extra}/>`;

  // shaded box: top / front-left (+y face) / front-right (+x face)
  function box(x, y, w, d, h, c, z = 0) {
    const top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)];
    const L = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)];
    const R = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)];
    return poly(L, c[1]) + poly(R, c[2]) + poly(top, c[0]);
  }
  // window panes on a face (glass colour switches day/night through --win)
  function winsL(x, y, w, d, z, h, n, rows = 1) {
    let s = "";
    const gw = w / (n * 2 + 1), gh = h / (rows * 2 + 1);
    for (let r = 0; r < rows; r++) for (let i = 0; i < n; i++) {
      const x0 = x + gw * (1 + i * 2), z0 = z + gh * (1 + r * 2);
      s += `<polygon class="win" points="${pts([P(x0, y + d, z0), P(x0 + gw, y + d, z0), P(x0 + gw, y + d, z0 + gh), P(x0, y + d, z0 + gh)])}"/>`;
    }
    return s;
  }
  function winsR(x, y, w, d, z, h, n, rows = 1) {
    let s = "";
    const gw = d / (n * 2 + 1), gh = h / (rows * 2 + 1);
    for (let r = 0; r < rows; r++) for (let i = 0; i < n; i++) {
      const y0 = y + gw * (1 + i * 2), z0 = z + gh * (1 + r * 2);
      s += `<polygon class="win" points="${pts([P(x + w, y0, z0), P(x + w, y0 + gw, z0), P(x + w, y0 + gw, z0 + gh), P(x + w, y0, z0 + gh)])}"/>`;
    }
    return s;
  }

  // island outline (organic blob in world space)
  const R0 = 10;
  const rad = (t, k = 0) => R0 * (1 + 0.06 * Math.sin(3 * t + 0.6) + 0.04 * Math.sin(5 * t + 1.9) + 0.025 * Math.sin(9 * t)) + k;
  const blob = (k, z) => { const a = []; for (let i = 0; i < 96; i++) { const t = (i / 96) * Math.PI * 2; const r = rad(t, k); a.push(P(Math.cos(t) * r, Math.sin(t) * r, z)); } return a; };

  // ---------- buildings (world x, y = footprint corner) ----------
  const B = {
    ledger: { at: [-3.9, 1.6], label: "Ledger Vault" },
    blueprint: { at: [0.9, 3.0], label: "Blueprint Site" },
    summit: { at: [-3.6, -3.6], label: "Summit Peak" },
    signal: { at: [0.9, -4.6], label: "Signal Tower" },
    circuit: { at: [2.4, -2.2], label: "Circuit Lab" },
    library: { at: [3.4, 0.9], label: "Library", target: "#writing" },
    hall: { at: [-1.2, -0.9], label: "Town Hall", target: "#references" },
    lighthouse: { at: [8.4, -2.6], label: "Lighthouse", target: "#contact" },
  };

  function ledger([x, y]) {
    const w = 2.6, d = 2.2;
    let s = box(x - 0.1, y - 0.1, w + 0.2, d + 0.2, 0.25, ["#d9e4f7", "#b8c8e6", "#9fb3da"]);
    s += box(x, y, w, d, 1.3, ["#f4f8ff", "#dbe6fa", "#c2d3f2"], 0.25);
    for (let i = 0; i < 4; i++) s += box(x + 0.2 + i * 0.68, y + d, 0.18, 0.16, 1.2, ["#ffffff", "#e9f0ff", "#cfdcf6"], 0.25);
    s += box(x - 0.15, y - 0.15, w + 0.3, d + 0.3, 0.25, ["#2a5bd7", "#1f48b3", "#183c97"], 1.55);
    s += winsR(x, y, w, d, 0.35, 1.1, 2);
    const c = P(x + w / 2, y + d / 2, 2.35);
    s += `<g class="coin" style="transform-origin:${c[0].toFixed(1)}px ${c[1].toFixed(1)}px"><ellipse cx="${c[0]}" cy="${c[1]}" rx="17" ry="17" ${fill("#ffc94a")} style="${stroke("#d99a14")};stroke-width:3"/><text x="${c[0]}" y="${c[1] + 6}" text-anchor="middle" class="coin-t">₹</text></g>`;
    return s;
  }
  function blueprint([x, y]) {
    const w = 2.4, d = 2.2;
    let s = box(x, y, w, d, 0.3, ["#c9ced8", "#aab1bf", "#959dad"]);
    [[0, 0], [w - 0.2, 0], [0, d - 0.2], [w - 0.2, d - 0.2]].forEach(([a, b]) => (s += box(x + a, y + b, 0.2, 0.2, 1.7, ["#ff9f43", "#e8832a", "#cf6f1c"], 0.3)));
    s += box(x, y, w, d * 0.55, 0.16, ["#e6e9ef", "#c7ccd6", "#b2b8c4"], 1.1);
    s += box(x + 0.3, y + d * 0.6, 0.9, 0.7, 0.5, ["#5b8def", "#4876d6", "#3a63bd"], 0.3);
    // crane
    const mx = x + w + 0.5, my = y - 0.3;
    s += box(mx, my, 0.24, 0.24, 4.4, ["#ffd23f", "#f0bd1c", "#d9a60c"]);
    const top = P(mx + 0.12, my + 0.12, 4.4), jib = P(mx - 2.6, my + 0.12, 4.4), cw = P(mx + 1.2, my + 0.12, 4.4), hook = P(mx - 1.9, my + 0.12, 2.6);
    s += `<line x1="${cw[0]}" y1="${cw[1]}" x2="${jib[0]}" y2="${jib[1]}" style="${stroke("#f0bd1c")};stroke-width:5;stroke-linecap:round"/>`;
    s += `<line x1="${top[0]}" y1="${top[1] - 22}" x2="${jib[0]}" y2="${jib[1]}" style="${stroke("#d9a60c")};stroke-width:1.5"/>`;
    s += `<line x1="${top[0]}" y1="${top[1] - 22}" x2="${cw[0]}" y2="${cw[1]}" style="${stroke("#d9a60c")};stroke-width:1.5"/>`;
    s += `<g class="hook"><line x1="${hook[0]}" y1="${P(mx - 1.9, my + 0.12, 4.4)[1]}" x2="${hook[0]}" y2="${hook[1]}" style="${stroke("#4a5160")};stroke-width:1.5"/><rect x="${hook[0] - 7}" y="${hook[1]}" width="14" height="10" rx="2" ${fill("#2a5bd7")}/></g>`;
    return s;
  }
  function summit([x, y]) {
    const r = 1.9, cx = x, cy = y, hgt = 4.2;
    const A = P(cx - r, cy - r), Bk = P(cx + r, cy - r), Cc = P(cx + r, cy + r), D = P(cx - r, cy + r), T = P(cx, cy, hgt);
    const k = 0.34, lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
    let s = poly([D, Cc, T], "#6f8f6a") + poly([Bk, Cc, T], "#55744f");
    s += poly([lerp(T, D, k), lerp(T, Cc, k), T], "#ffffff") + poly([lerp(T, Bk, k), lerp(T, Cc, k), T], "#dfe8f5");
    s += `<path d="M${lerp(T, D, k)} L${lerp(T, lerp(D, Cc, 0.3), k * 1.25)} L${lerp(T, lerp(D, Cc, 0.6), k * 0.95)} L${lerp(T, Cc, k * 1.2)}" ${fill("#ffffff")}/>`;
    // flag
    s += `<line x1="${T[0]}" y1="${T[1]}" x2="${T[0]}" y2="${T[1] - 34}" style="${stroke("#3b3f4a")};stroke-width:2"/>`;
    s += `<path class="flag" style="transform-origin:${T[0]}px ${T[1] - 34}px;fill:color-mix(in srgb,#ff5d5d var(--lit),var(--shade))" d="M${T[0]} ${T[1] - 34} l22 6 l-22 7 z"/>`;
    return s;
  }
  function signal([x, y]) {
    let s = box(x - 0.4, y - 0.4, 1.3, 1.3, 0.3, ["#d9dee8", "#b8bfcc", "#a2aab9"]);
    s += box(x, y, 0.5, 0.5, 4.2, ["#ff6b8b", "#e5506f", "#c93e5b"], 0.3);
    for (let i = 1; i < 6; i++) { const a = P(x, y + 0.5, 0.3 + i * 0.7), b = P(x + 0.5, y + 0.5, 0.3 + i * 0.7 - 0.35); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" style="stroke:rgba(255,255,255,.55);stroke-width:1.2"/>`; }
    const t = P(x + 0.25, y + 0.25, 4.6);
    s += `<ellipse cx="${t[0]}" cy="${t[1]}" rx="11" ry="6" ${fill("#f2f5fb")} style="${stroke("#9aa3b5")};stroke-width:1.5"/>`;
    s += `<circle cx="${t[0]}" cy="${t[1] - 6}" r="3.5" ${fill("#ff4d6d")}/>`;
    for (let i = 0; i < 3; i++) s += `<circle class="wave w${i}" cx="${t[0]}" cy="${t[1] - 6}" r="14" style="transform-origin:${t[0].toFixed(1)}px ${(t[1] - 6).toFixed(1)}px"/>`;
    return s;
  }
  function circuit([x, y]) {
    const w = 2.6, d = 2.0;
    let s = box(x, y, w, d, 1.25, ["#1f3b73", "#18305f", "#122650"]);
    s += winsL(x, y, w, d, 0.2, 0.9, 3);
    // garage door on the +x face
    s += `<polygon points="${pts([P(x + w, y + 0.4, 0), P(x + w, y + 1.5, 0), P(x + w, y + 1.5, 0.85), P(x + w, y + 0.4, 0.85)])}" ${fill("#2a5bd7")}/>`;
    for (let i = 1; i < 4; i++) { const a = P(x + w, y + 0.4, i * 0.21), b = P(x + w, y + 1.5, i * 0.21); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" style="stroke:rgba(255,255,255,.35);stroke-width:1"/>`; }
    // glowing chip lines on the roof
    for (let i = 1; i < 4; i++) {
      const a = P(x + (w * i) / 4, y + 0.2, 1.26), b = P(x + (w * i) / 4, y + d - 0.2, 1.26);
      const c = P(x + 0.2, y + (d * i) / 4, 1.26), e = P(x + w - 0.2, y + (d * i) / 4, 1.26);
      s += `<line class="chip" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/><line class="chip" x1="${c[0]}" y1="${c[1]}" x2="${e[0]}" y2="${e[1]}"/>`;
    }
    s += box(x + w / 2 - 0.4, y + d / 2 - 0.35, 0.8, 0.7, 0.18, ["#2ee6c6", "#1fc4a7", "#17a58c"], 1.25);
    const an = P(x + 0.3, y + 0.3, 1.25);
    s += `<line x1="${an[0]}" y1="${an[1]}" x2="${an[0]}" y2="${an[1] - 30}" style="${stroke("#9aa3b5")};stroke-width:2"/><circle class="blink" cx="${an[0]}" cy="${an[1] - 30}" r="3.5"/>`;
    return s;
  }
  function library([x, y]) {
    const w = 1.9, d = 1.5;
    let s = box(x, y, w, d, 1.0, ["#ffe7c2", "#f6d3a1", "#eabf86"]);
    const cols = ["#ff6b5b", "#2a5bd7", "#ffc94a", "#14b8a6", "#8b5cf6", "#ff6b5b", "#2a5bd7"];
    cols.forEach((c, i) => { const x0 = x + 0.15 + i * 0.24; s += poly([P(x0, y + d, 0.15), P(x0 + 0.16, y + d, 0.15), P(x0 + 0.16, y + d, 0.15 + 0.5 + (i % 3) * 0.08), P(x0, y + d, 0.15 + 0.5 + (i % 3) * 0.08)], c); });
    s += box(x - 0.12, y - 0.12, w + 0.24, d + 0.24, 0.2, ["#8a5a3c", "#734a30", "#5f3d27"], 1.0);
    s += winsR(x, y, w, d, 0.2, 0.7, 2);
    return s;
  }
  function hall([x, y]) {
    const w = 2.0, d = 1.6;
    let s = box(x, y, w, d, 1.0, ["#fff6e8", "#f1e2c8", "#e2cfb0"]);
    s += winsL(x, y, w, d, 0.15, 0.75, 3); s += winsR(x, y, w, d, 0.15, 0.75, 2);
    s += box(x + 0.65, y + 0.45, 0.7, 0.7, 1.2, ["#fff6e8", "#f1e2c8", "#e2cfb0"], 1.0);
    const tx = x + 1.0, ty = y + 0.8;
    const A = P(tx - 0.42, ty - 0.42, 2.2), Bk = P(tx + 0.42, ty - 0.42, 2.2), Cc = P(tx + 0.42, ty + 0.42, 2.2), D = P(tx - 0.42, ty + 0.42, 2.2), T = P(tx, ty, 3.0);
    s += poly([D, Cc, T], "#2a5bd7") + poly([Bk, Cc, T], "#1f48b3");
    const ck = P(x + 1.0, y + 1.15, 1.75);
    s += `<circle cx="${ck[0] - 6}" cy="${ck[1]}" r="7" ${fill("#ffffff")} style="${stroke("#2a5bd7")};stroke-width:1.5"/>`;
    return s;
  }
  function lighthouse([x, y]) {
    let s = box(x - 0.3, y - 0.3, 1.3, 1.3, 0.3, ["#c9ced8", "#aab1bf", "#959dad"]);
    const seg = [["#ffffff", "#e9edf4", "#d4dae6"], ["#ff5d5d", "#e64a4a", "#cc3b3b"]];
    for (let i = 0; i < 4; i++) s += box(x + 0.05 * i, y + 0.05 * i, 0.7 - 0.1 * i, 0.7 - 0.1 * i, 0.85, seg[i % 2], 0.3 + i * 0.85);
    const lz = 0.3 + 4 * 0.85;
    s += box(x + 0.18, y + 0.18, 0.34, 0.34, 0.35, ["#fff2b3", "#ffe17a", "#ffd23f"], lz);
    s += box(x + 0.12, y + 0.12, 0.46, 0.46, 0.12, ["#3b3f4a", "#2c3038", "#22252b"], lz + 0.35);
    const L = P(x + 0.35, y + 0.35, lz + 0.18);
    s += `<g class="beam" style="transform-origin:${L[0].toFixed(1)}px ${L[1].toFixed(1)}px"><path d="M${L[0]} ${L[1]} L${L[0] + 260} ${L[1] - 40} L${L[0] + 260} ${L[1] + 40} Z"/><path d="M${L[0]} ${L[1]} L${L[0] - 260} ${L[1] - 40} L${L[0] - 260} ${L[1] + 40} Z"/></g>`;
    return s;
  }
  function tree([x, y], k = 1) {
    const b = P(x, y, 0), t = P(x, y, 0.9 * k);
    return `<g class="tree"><rect x="${b[0] - 2.5}" y="${t[1]}" width="5" height="${b[1] - t[1]}" ${fill("#8a5a3c")}/>` +
      `<ellipse cx="${t[0]}" cy="${t[1] - 8 * k}" rx="${15 * k}" ry="${17 * k}" ${fill("#3fae5a")}/>` +
      `<ellipse cx="${t[0] - 4 * k}" cy="${t[1] - 13 * k}" rx="${8 * k}" ry="${9 * k}" ${fill("#64c978")}/></g>`;
  }
  function palm([x, y]) {
    const b = P(x, y, 0), t = P(x, y, 1.5);
    let s = `<path d="M${b[0]} ${b[1]} Q${b[0] + 8} ${(b[1] + t[1]) / 2} ${t[0] + 4} ${t[1]}" style="fill:none;${stroke("#a0703f")};stroke-width:4;stroke-linecap:round"/>`;
    [[-22, 6], [22, 6], [-14, -10], [14, -10], [0, 12]].forEach(([dx, dy]) => (s += `<path d="M${t[0] + 4} ${t[1]} q${dx / 2} ${-12} ${dx} ${dy}" style="fill:none;${stroke("#2f9e57")};stroke-width:5;stroke-linecap:round"/>`));
    return s;
  }

  // ---------- harbour + avatar (illustrated, not a photo) ----------
  function harbour() {
    let s = box(8.6, 4.4, 3.4, 0.8, 0.22, ["#c79a63", "#a87c48", "#8f6739"], -0.05);
    for (let i = 0; i < 4; i++) s += box(8.9 + i * 0.95, 5.05, 0.14, 0.14, 0.5, ["#6f4f2b", "#5c4123", "#4b351c"], -0.35);
    // boat
    const bt = P(11.4, 6.6, -0.1);
    s += `<g class="boat"><path d="M${bt[0] - 30} ${bt[1]} L${bt[0] + 30} ${bt[1]} L${bt[0] + 20} ${bt[1] + 14} L${bt[0] - 20} ${bt[1] + 14} Z" ${fill("#ffffff")}/><path d="M${bt[0] - 30} ${bt[1]} L${bt[0] + 30} ${bt[1]} L${bt[0] + 27} ${bt[1] + 5} L${bt[0] - 27} ${bt[1] + 5} Z" ${fill("#2a5bd7")}/><line x1="${bt[0]}" y1="${bt[1]}" x2="${bt[0]}" y2="${bt[1] - 52}" style="${stroke("#5c4123")};stroke-width:2.5"/><path d="M${bt[0] + 2} ${bt[1] - 50} L${bt[0] + 30} ${bt[1] - 8} L${bt[0] + 2} ${bt[1] - 8} Z" ${fill("#ff6b5b")}/><path d="M${bt[0] - 2} ${bt[1] - 44} L${bt[0] - 22} ${bt[1] - 8} L${bt[0] - 2} ${bt[1] - 8} Z" ${fill("#fff4e0")}/></g>`;
    return s;
  }
  function avatar() {
    const f = P(11.2, 4.8, 0.17);
    const x = f[0], y = f[1];
    // stylised Tejith: wavy black hair, navy shirt, dark trousers, red thread + silver watch
    return `<g class="me" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <ellipse cx="0" cy="0" rx="13" ry="4" style="fill:rgba(0,0,0,.18)"/>
      <rect x="-7" y="-26" width="6" height="26" rx="2.5" ${fill("#1b1f2a")}/><rect x="1" y="-26" width="6" height="26" rx="2.5" ${fill("#1b1f2a")}/>
      <rect x="-8.5" y="-2" width="8" height="4" rx="2" ${fill("#0f1218")}/><rect x="0.5" y="-2" width="8" height="4" rx="2" ${fill("#0f1218")}/>
      <path d="M-11 -50 Q-12 -27 -9 -24 L9 -24 Q12 -27 11 -50 Q0 -56 -11 -50 Z" ${fill("#25365f")}/>
      <path d="M-3 -52 L0 -46 L3 -52" style="fill:none;stroke:#e9eefb;stroke-width:1.2;opacity:.6"/>
      <circle cx="0" cy="-43" r="1" style="fill:#8fa3cf"/><circle cx="0" cy="-36" r="1" style="fill:#8fa3cf"/><circle cx="0" cy="-29" r="1" style="fill:#8fa3cf"/>
      <path d="M-10 -48 Q-16 -38 -14 -27" style="fill:none;${stroke("#25365f")};stroke-width:6;stroke-linecap:round"/>
      <circle cx="-14" cy="-25" r="3.2" ${fill("#a86a42")}/><rect x="-16.5" y="-30" width="5" height="2" style="fill:#e0313f"/>
      <g class="arm"><path d="M10 -48 Q20 -54 22 -66" style="fill:none;${stroke("#25365f")};stroke-width:6;stroke-linecap:round"/>
        <rect x="18.5" y="-67" width="7" height="3" rx="1" style="fill:#d3d6de"/><circle cx="22.5" cy="-71" r="4" ${fill("#a86a42")}/></g>
      <rect x="-3" y="-58" width="6" height="6" ${fill("#8a5233")}/>
      <ellipse cx="0" cy="-67" rx="9.5" ry="11" ${fill("#a86a42")}/>
      <path d="M-10.5 -68 Q-13 -82 -3 -83 Q-1 -88 5 -84 Q13 -84 11 -70 Q9 -76 4 -76 Q0 -73 -5 -76 Q-9 -74 -10.5 -68 Z" ${fill("#15121c")}/>
      <circle cx="-3.5" cy="-66" r="1.3" style="fill:#15121c"/><circle cx="3.5" cy="-66" r="1.3" style="fill:#15121c"/>
      <path d="M-3.5 -60.5 Q0 -57.5 3.5 -60.5" style="fill:none;stroke:#5a2a1c;stroke-width:1.4;stroke-linecap:round"/>
    </g>`;
  }

  // ---------- race track (F1 touch) ----------
  const TR = 7.25;
  const trackPts = (r, n = 160) => { const a = []; for (let i = 0; i <= n; i++) { const t = (i / n) * Math.PI * 2; a.push(P(Math.cos(t) * r, Math.sin(t) * r, 0.01)); } return a; };
  const pathD = (a) => "M" + a.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L") + " Z";
  function track() {
    let s = `<path d="${pathD(trackPts(TR))}" class="asphalt" style="fill:none;${stroke("#4a5160")};stroke-width:30"/>`;
    s += `<path d="${pathD(trackPts(TR + 0.5))}" style="fill:none;stroke:#fff;stroke-width:4;stroke-dasharray:9 9;opacity:.9"/>`;
    s += `<path d="${pathD(trackPts(TR + 0.5))}" style="fill:none;${stroke("#e5383b")};stroke-width:4;stroke-dasharray:9 9;stroke-dashoffset:9"/>`;
    s += `<path d="${pathD(trackPts(TR - 0.5))}" style="fill:none;stroke:#fff;stroke-width:4;stroke-dasharray:9 9;opacity:.9"/>`;
    s += `<path d="${pathD(trackPts(TR - 0.5))}" style="fill:none;${stroke("#e5383b")};stroke-width:4;stroke-dasharray:9 9;stroke-dashoffset:9"/>`;
    s += `<path d="${pathD(trackPts(TR))}" style="fill:none;stroke:rgba(255,255,255,.35);stroke-width:1.5;stroke-dasharray:14 16"/>`;
    // start/finish gantry with the five lights
    const th = 1.92, a = [Math.cos(th), Math.sin(th)];
    const i0 = [a[0] * (TR - 0.75), a[1] * (TR - 0.75)], o0 = [a[0] * (TR + 0.75), a[1] * (TR + 0.75)];
    const sl1 = P(a[0] * (TR - 0.55), a[1] * (TR - 0.55), 0.02), sl2 = P(a[0] * (TR + 0.55), a[1] * (TR + 0.55), 0.02);
    s += `<line x1="${sl1[0]}" y1="${sl1[1]}" x2="${sl2[0]}" y2="${sl2[1]}" style="stroke:#fff;stroke-width:7;stroke-dasharray:3.5 3.5"/>`;
    s += box(i0[0], i0[1], 0.14, 0.14, 1.5, ["#3b3f4a", "#2c3038", "#22252b"]) + box(o0[0], o0[1], 0.14, 0.14, 1.5, ["#3b3f4a", "#2c3038", "#22252b"]);
    const g1 = P(i0[0] + 0.07, i0[1] + 0.07, 1.5), g2 = P(o0[0] + 0.07, o0[1] + 0.07, 1.5);
    s += `<line x1="${g1[0]}" y1="${g1[1]}" x2="${g2[0]}" y2="${g2[1]}" style="${stroke("#2c3038")};stroke-width:9;stroke-linecap:round"/>`;
    for (let i = 0; i < 5; i++) { const t = (i + 1) / 6; s += `<circle class="glight" data-l="${i}" cx="${(g1[0] + (g2[0] - g1[0]) * t).toFixed(1)}" cy="${(g1[1] + (g2[1] - g1[1]) * t).toFixed(1)}" r="2.8"/>`; }
    return s;
  }
  function car() {
    return `<g id="car" class="car"><g class="car-body">
      <rect x="-13" y="-4.2" width="26" height="8.4" rx="3.5" style="fill:#1f6fff"/>
      <rect x="9" y="-7.5" width="4" height="15" rx="1" style="fill:#0b2545"/>
      <rect x="-15" y="-6.5" width="3.5" height="13" rx="1" style="fill:#ff6b5b"/>
      <rect x="-9" y="-7" width="5.5" height="2.6" rx="1" style="fill:#111"/><rect x="-9" y="4.4" width="5.5" height="2.6" rx="1" style="fill:#111"/>
      <rect x="4" y="-6.6" width="4.6" height="2.4" rx="1" style="fill:#111"/><rect x="4" y="4.2" width="4.6" height="2.4" rx="1" style="fill:#111"/>
      <circle cx="-1" cy="0" r="2.4" style="fill:#ffc94a"/></g></g>`;
  }

  // ---------- assemble ----------
  const DRAW = { ledger, blueprint, summit, signal, circuit, library, hall, lighthouse };
  const TREES = [[-6.8, -3.2, 1], [-7.6, -0.9, 0.9], [-1.1, -6.4, 1.1], [4.6, -5.6, 0.9], [-5.4, 4.4, 1], [4.7, 3.6, 0.85], [2.0, 6.1, 0.9], [-1.4, 5.4, 0.9], [-4.6, -1.4, 0.8], [1.2, -1.4, 0.7], [-8.4, 2.6, 1.05], [-3.2, -8.0, 0.95], [2.4, -8.4, 1.05], [-2.4, 3.2, 0.75]];
  const PALMS = [[6.6, 6.0], [8.2, 1.8], [-1.6, 8.8], [1.6, 8.6]];

  function build(svg) {
    let s = `<defs><linearGradient id="seaGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset="1" stop-color="#fff" stop-opacity=".25"/></linearGradient></defs>`;
    // open water around the island, so it always sits in the sea whatever the screen size
    s += `<defs><radialGradient id="sea" cx="50%" cy="50%" r="50%"><stop offset="0" style="stop-color:var(--sea1)"/><stop offset=".72" style="stop-color:var(--sea1)"/><stop offset="1" style="stop-color:var(--sea1);stop-opacity:0"/></radialGradient></defs>`;
    s += `<ellipse cx="${OX}" cy="${OY + 30}" rx="640" ry="390" fill="url(#sea)"/>`;
    // ocean rings
    [12.6, 11.4].forEach((r, i) => { const a = []; for (let j = 0; j <= 96; j++) { const t = (j / 96) * Math.PI * 2; a.push(P(Math.cos(t) * rad(t, r - R0), Math.sin(t) * rad(t, r - R0), -0.6)); } s += `<path class="ripple r${i}" d="${pathD(a)}"/>`; });
    // island body
    s += `<polygon points="${pts(blob(1.0, -1.9))}" ${fill("#8a5a3c")}/>`;
    s += `<polygon points="${pts(blob(1.0, -1.2))}" ${fill("#a8744b")}/>`;
    s += `<polygon points="${pts(blob(1.0, -0.6))}" ${fill("#c48f5d")}/>`;
    s += `<polygon class="foam" points="${pts(blob(1.35, -0.62))}"/>`;
    s += `<polygon points="${pts(blob(1.0, 0))}" ${fill("#f3dca6")}/>`;
    s += `<polygon points="${pts(blob(0, 0))}" ${fill("#7fd07e")}/>`;
    s += `<polygon points="${pts(blob(-1.6, 0))}" ${fill("#8bd88a")}/>`;
    s += track();
    s += harbour();
    s += `<g id="carLayer">${car()}</g>`;
    // depth-sort everything standing on the island
    const items = [];
    Object.entries(B).forEach(([id, b]) => items.push({ d: b.at[0] + b.at[1] + 2, html: `<g class="bld" data-id="${id}" tabindex="-1">${DRAW[id](b.at)}</g>` }));
    TREES.forEach(([x, y, k]) => items.push({ d: x + y, html: tree([x, y], k) }));
    PALMS.forEach(([x, y]) => items.push({ d: x + y, html: palm([x, y]) }));
    items.push({ d: 16, html: avatar() });
    items.sort((a, b) => a.d - b.d).forEach((it) => (s += it.html));
    svg.setAttribute("viewBox", `0 0 ${W} ${HGT}`);
    svg.innerHTML = s;
  }

  // pin anchors as % of the scene
  function anchors() {
    const H = { ledger: 2.9, blueprint: 4.9, summit: 5.0, signal: 5.6, circuit: 2.3, library: 1.8, hall: 3.4, lighthouse: 5.1 };
    const C2 = { ledger: [1.3, 1.1], blueprint: [1.4, 1.1], summit: [0, 0], signal: [0.25, 0.25], circuit: [1.3, 1.0], library: [0.95, 0.75], hall: [1.0, 0.8], lighthouse: [0.35, 0.35] };
    const out = {};
    Object.entries(B).forEach(([id, b]) => { const p = P(b.at[0] + C2[id][0], b.at[1] + C2[id][1], H[id]); out[id] = { x: (p[0] / W) * 100, y: (p[1] / HGT) * 100, label: b.label, target: b.target }; });
    const me = P(11.2, 4.8, 2.6);
    out.me = { x: (me[0] / W) * 100, y: (me[1] / HGT) * 100 };
    return out;
  }

  // ---------- the car lap (paused when hidden / off-screen / reduced motion) ----------
  let raf = 0, running = false, lapStart = 0;
  const lap = trackPts(TR - 0.22, 360);
  const segs = []; let total = 0;
  for (let i = 1; i < lap.length; i++) { const l = Math.hypot(lap[i][0] - lap[i - 1][0], lap[i][1] - lap[i - 1][1]); segs.push(l); total += l; }
  function at(dist) {
    dist = ((dist % total) + total) % total;
    for (let i = 0; i < segs.length; i++) {
      if (dist <= segs[i]) { const a = lap[i], b = lap[i + 1], t = dist / segs[i]; return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, ang: Math.atan2(b[1] - a[1], b[0] - a[0]) }; }
      dist -= segs[i];
    }
    return { x: lap[0][0], y: lap[0][1], ang: 0 };
  }
  const startDist = (() => { let best = 0, bd = 1e9; const g = P(Math.cos(1.92) * (TR - 0.22), Math.sin(1.92) * (TR - 0.22)); let acc = 0; for (let i = 0; i < segs.length; i++) { const d = Math.hypot(lap[i][0] - g[0], lap[i][1] - g[1]); if (d < bd) { bd = d; best = acc; } acc += segs[i]; } return best; })();
  let speed = 0.11; // px per ms
  function place(dist) {
    const c = document.getElementById("car"); if (!c) return;
    const p = at(dist);
    c.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${((p.ang * 180) / Math.PI).toFixed(1)}) scale(1, .82)`);
  }
  function loop(t) { if (!running) return; place(startDist + (t - lapStart) * speed); raf = requestAnimationFrame(loop); }

  window.ISLAND = {
    build, anchors,
    park() { place(startDist); },
    go() { if (running) return; running = true; lapStart = performance.now() - (this._paused || 0); raf = requestAnimationFrame(loop); },
    stop() { if (!running) return; running = false; this._paused = performance.now() - lapStart; cancelAnimationFrame(raf); },
    boost(on) { const now = performance.now(), cur = (now - lapStart) * speed; speed = on ? 0.3 : 0.11; lapStart = now - cur / speed; },
    lights(n) { document.querySelectorAll(".glight").forEach((l) => l.classList.toggle("on", +l.dataset.l < n)); },
  };
})();
