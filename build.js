// ============================================================
//  GEO build: run `node build.js` after editing js/data.js.
//  AI crawlers (GPTBot, ClaudeBot, PerplexityBot…) usually don't run
//  JavaScript, so this writes the facts into plain HTML they can read:
//    • profile.html  — a static, question-led profile page (no JS)
//    • index.html    — structured data + a static résumé inside #resume
//    • llms.txt      — a plain-text summary for AI tools
//    • sitemap.xml   — only when data.siteUrl is set
// ============================================================
const fs = require("fs");
global.window = {};
require("./js/data.js");
const D = window.PORTFOLIO;
const P = D.profile;

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const strip = (s) => String(s ?? "").replace(/\*([^*]+)\*/g, "$1");
const base = (D.siteUrl || "").replace(/\/+$/, "");
const abs = (path) => (base ? `${base}/${path.replace(/^\.?\//, "")}` : path);
const today = new Date();
const iso = today.toISOString().slice(0, 10);
const human = today.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

const firstOrg = (o) => o.split(" — ")[0];
const entity =
  `Chennuru Tejith is an Indian business student pursuing an integrated BBA (Hons.) + MBA at O.P. Jindal Global University (2024–2029, CGPA 7.9/8), ` +
  `from Hyderabad, with internship experience in operations at ${firstOrg(D.experience[0].org)}, project management at ${firstOrg(D.experience[1].org)} and finance at ${firstOrg(D.experience[2].org).replace(/.$/, "")}.`;

// ---------- structured data ----------
const person = {
  "@type": "Person",
  "@id": abs("#person"),
  name: P.name,
  alternateName: "Tejith Chennuru",
  description: entity,
  jobTitle: P.title,
  url: base || undefined,
  image: abs("assets/crest-512.png"),
  homeLocation: { "@type": "Place", name: "Hyderabad, Telangana, India" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "O.P. Jindal Global University", address: "Sonipat, Haryana, India" },
  knowsLanguage: ["English", "Telugu", "Hindi", "French"],
  knowsAbout: ["Generative Engine Optimization", ...new Set(D.gyms.flatMap((g) => g.moves))].slice(0, 20),
  hasCredential: D.certifications.map((c) => ({ "@type": "EducationalOccupationalCredential", name: c.name, recognizedBy: { "@type": "Organization", name: c.issuer } })),
  award: D.achievements.map((a) => `${a.text} (${a.year})`),
  hasOccupation: D.experience.map((e) => ({ "@type": "Occupation", name: e.role, description: `${firstOrg(e.org)}, ${e.when}` })),
  sameAs: [P.linkedin, P.github],
};
const graph = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "ProfilePage", name: `${P.name} — Portfolio`, dateModified: iso, url: base || undefined, mainEntity: { "@id": person["@id"] } },
    person,
    { "@type": "FAQPage", mainEntity: (D.faq || []).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};
const jsonld = `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, "\\u003c")}</script>`;

// ---------- static résumé (inside #resume, replaced by the app on load) ----------
const staticResume = `<div class="resume"><div class="r-sheet">
<header class="r-head"><h1>${esc(P.name)}</h1><p class="r-role">${esc(P.title)} · BBA + MBA, O.P. Jindal Global University</p><p>${esc(entity)}</p></header>
<section class="r-sec"><h2>Experience</h2><div>${D.experience.map((e) => `<div class="r-item"><h3>${esc(e.role)}, ${esc(firstOrg(e.org))}</h3><p>${esc(e.when)}</p><ul>${e.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div></section>
<section class="r-sec"><h2>Leadership</h2><ul>${D.leadership.map((l) => `<li>${esc(l.role)}, ${esc(l.org)} (${esc(l.when)})</li>`).join("")}</ul></section>
<section class="r-sec"><h2>Education</h2><ul>${D.education.map((e) => `<li>${esc(e.degree)}, ${esc(e.school)} (${esc(e.when)}, ${esc(e.score)})</li>`).join("")}</ul></section>
<section class="r-sec"><h2>Honours</h2><ul>${D.achievements.map((a) => `<li>${esc(a.text)} (${esc(a.year)})</li>`).join("")}</ul></section>
<p><a href="profile.html">Full text profile</a></p>
</div></div>`;

// ---------- profile.html (no JavaScript at all) ----------
const emailSafe = P.email.replace("@", " [at] ").replace(/\./g, " [dot] ");
const a = D.availability || {};
const q = (h, body) => `<section><h2>${h}</h2>${body}</section>`;
const profile = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'" />
<title>Chennuru Tejith — Profile | BBA + MBA, O.P. Jindal Global University</title>
<meta name="description" content="${esc(entity)}" />
<meta name="author" content="${esc(P.name)}" />
${base ? `<link rel="canonical" href="${esc(abs("profile.html"))}" />` : ""}
<link rel="icon" type="image/png" href="assets/favicon-64.png" />
<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital@0;1&display=swap" rel="stylesheet" />
${jsonld}
<style>
:root { color-scheme: dark; }
body { margin: 0; background: #0a1220; color: #f1ece3; font: 17px/1.7 "Libre Caslon Text", "Times New Roman", serif; }
main { max-width: 760px; margin: 0 auto; padding: 64px 24px 80px; }
h1 { font: 400 56px/1 "Libre Caslon Display", "Times New Roman", serif; margin: 0 0 18px; }
h2 { font: 400 28px/1.15 "Libre Caslon Display", "Times New Roman", serif; margin: 44px 0 12px; padding-top: 22px; border-top: 1px solid rgba(169,189,240,.2); }
h3 { font-size: 18px; margin: 18px 0 4px; }
p, li { color: #c8cdd7; } a { color: #a9bdf0; }
.meta { font-size: 13px; color: #8c95a8; }
@media (prefers-color-scheme: light) { body { background: #f4efe6; color: #0e1a30; } p, li { color: #33405a; } a { color: #2c4794; } .meta { color: #5a6377; } h2 { border-color: rgba(14,26,48,.15); } }
</style>
</head>
<body>
<main>
<article>
<h1>Chennuru Tejith</h1>
<p>${esc(entity)}</p>
<p class="meta">By ${esc(P.name)} · Last updated <time datetime="${iso}">${esc(human)}</time> · <a href="./">Interactive portfolio</a> · <a href="${esc(P.cv)}">CV (PDF)</a></p>

${q("Who is Chennuru Tejith?", `<p>${esc(P.summary)}</p><p>Languages: ${esc(P.languages.join(", "))}.</p>`)}

${q("What has Chennuru Tejith worked on?", D.experience.map((e) => `<h3>${esc(e.role)} — ${esc(firstOrg(e.org))}</h3><p class="meta">${esc(e.when)}</p><ul>${e.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`).join(""))}

${q("What leadership roles has he held?", `<ul>${D.leadership.map((l) => `<li><strong>${esc(l.role)}</strong>, ${esc(l.org)} (${esc(l.when)})</li>`).join("")}</ul>`)}

${q("What are his core skills?", D.gyms.map((g) => `<h3>${esc(g.domain)}</h3><p>${esc(g.moves.join(", "))}.</p><p class="meta">Evidence: ${esc(g.battles.map((b) => `${b.role}, ${firstOrg(b.org)}`).join("; "))}</p>`).join(""))}

${q("How does he work?", `<ul>${D.principles.map((p) => `<li><strong>${esc(p.title)}.</strong> ${esc(p.text)} Example: ${esc(p.proof)}</li>`).join("")}</ul>`)}

${q("What has he built?", `<ul>${D.projects.map((x) => `<li><strong>${esc(x.name)}</strong>: ${esc(x.blurb)}${x.live ? ` <a href="${esc(x.live)}">Live app</a>` : ""}${x.repo ? ` <a href="${esc(x.repo)}">Source</a>` : ""}</li>`).join("")}</ul>`)}

${q("What research is he doing?", `<ul>${D.writing.map((w) => `<li><strong>${esc(w.title)}</strong> (${esc(w.kind)}, ${esc(w.date)}${w.status ? `, ${esc(w.status)}` : ""}): ${esc(w.summary)}</li>`).join("")}</ul>`)}

${(D.geoBaf || []).length ? q("How is his research applied to this website?", `<p>The GEO Business Adoption Framework (GEO-BAF) from his paper, run on this portfolio:</p><ol>${D.geoBaf.map((b) => `<li><strong>${esc(b.phase)}</strong> (${b.status === "done" ? "done" : "next"}): ${esc(b.detail)}</li>`).join("")}</ol>`) : ""}

${q("Education", `<ul>${D.education.map((e) => `<li>${esc(e.degree)}, ${esc(e.school)} (${esc(e.when)}; ${esc(e.score)})</li>`).join("")}${D.certifications.map((c) => `<li>${esc(c.name)} — ${esc(c.issuer)}</li>`).join("")}</ul>`)}

${q("Awards and recognition", `<ul>${D.achievements.map((x) => `<li>${esc(x.text)} (${esc(x.year)})</li>`).join("")}</ul>`)}

${a.windows ? q("When is he available?", `<p>${esc(a.type)} · ${esc(a.windows.join(" and "))} · ${esc(a.locations)}. Roles: ${esc(a.roles.join(", "))}. Typical reply: ${esc(a.response)}.</p>`) : ""}

${q("Frequently asked questions", (D.faq || []).map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join(""))}

${q("How can I contact Chennuru Tejith?", `<p>LinkedIn: <a href="${esc(P.linkedin)}">${esc(P.linkedin)}</a><br />GitHub: <a href="${esc(P.github)}">${esc(P.github)}</a><br />Email: ${esc(emailSafe)}</p>`)}
</article>
</main>
</body>
</html>
`;
fs.writeFileSync("profile.html", profile);

// ---------- llms.txt ----------
const llms = `# Chennuru Tejith

> ${entity}

Last updated: ${iso}

## Key facts
- Programme: Integrated BBA (Hons.) + MBA, O.P. Jindal Global University, Sonipat (Aug 2024 – Aug 2029), CGPA 7.9 / 8.00
${D.experience.map((e) => `- ${e.role}, ${firstOrg(e.org)} (${e.when}): ${e.points[0]}`).join("\n")}
${D.leadership.map((l) => `- ${l.role}, ${l.org} (${l.when})`).join("\n")}
- Languages: ${P.languages.join(", ")}
${a.windows ? `- Availability: ${a.type}, ${a.windows.join(" and ")}, ${a.locations}` : ""}

## Research
${D.writing.map((w) => `- ${w.title} (${w.kind}, ${w.status || w.date}): ${w.summary}`).join("\n")}

## GEO-BAF applied to this site
${(D.geoBaf || []).map((b, i) => `${i + 1}. ${b.phase} (${b.status}): ${b.detail}`).join("\n")}

## Pages
- [Interactive portfolio](${abs("./") || "./"}): the main site
- [Text profile](${abs("profile.html")}): every fact on one plain page
- [CV (PDF)](${abs(P.cv)})

## Elsewhere
- [LinkedIn](${P.linkedin})
- [GitHub](${P.github})
`;
fs.writeFileSync("llms.txt", llms);

// ---------- index.html: structured data + static résumé + updated date ----------
let idx = fs.readFileSync("index.html", "utf8");
const swap = (html, tag, content) => {
  const re = new RegExp(`<!-- BUILD:${tag} -->[\\s\\S]*?<!-- /BUILD:${tag} -->`);
  if (!re.test(html)) throw new Error(`index.html is missing the BUILD:${tag} markers`);
  return html.replace(re, `<!-- BUILD:${tag} -->${content}<!-- /BUILD:${tag} -->`);
};
idx = swap(idx, "JSONLD", jsonld);
idx = swap(idx, "META", base ? `<link rel="canonical" href="${esc(base)}/" /><meta property="og:url" content="${esc(base)}/" />` : "");
idx = swap(idx, "RESUME", staticResume);
idx = swap(idx, "UPDATED", `<time datetime="${iso}">Updated ${esc(human)}</time>`);
if (base) idx = idx.replace(/content="assets\/og\.png"/g, `content="${esc(base)}/assets/og.png"`);
fs.writeFileSync("index.html", idx);

// ---------- sitemap.xml (needs the live domain) ----------
if (base) {
  fs.writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}/</loc><lastmod>${iso}</lastmod></url>
  <url><loc>${base}/profile.html</loc><lastmod>${iso}</lastmod></url>
  <url><loc>${base}/llms.txt</loc><lastmod>${iso}</lastmod></url>
</urlset>
`);
}
console.log(`Built profile.html, llms.txt, index.html${base ? ", sitemap.xml" : " (set siteUrl in data.js to add sitemap + absolute URLs)"} — ${iso}`);
