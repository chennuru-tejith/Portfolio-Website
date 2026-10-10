// ============================================================
//  GEO build: run `node build.js` after editing js/data.js.
//  AI crawlers (GPTBot, ClaudeBot, PerplexityBot…) usually don't run
//  JavaScript, so this writes the facts into plain HTML they can read:
//    • profile.html : a static, question-led profile page (no JS)
//    • index.html   : structured data + a static résumé inside #resume
//    • llms.txt     : a plain-text summary for AI tools
//    • sitemap.xml  : only when data.siteUrl is set
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

const firstOrg = (o) => o.split(", ")[0];
const entity =
  `Chennuru Tejith is an Indian business student pursuing an integrated BBA (Hons.) + MBA at O.P. Jindal Global University (2024 to 2029, CGPA 7.9/8), ` +
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
    { "@type": "ProfilePage", name: `${P.name}, Portfolio`, dateModified: iso, url: base || undefined, mainEntity: { "@id": person["@id"] } },
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
const pageStyle = (html) => html.match(/<style>[\s\S]*?<\/style>/)[0];
const profile = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'" />
<title>Chennuru Tejith | Profile | BBA + MBA, O.P. Jindal Global University</title>
<meta name="description" content="${esc(entity)}" />
<meta name="author" content="${esc(P.name)}" />
${base ? `<link rel="canonical" href="${esc(abs("profile.html"))}" />` : ""}
<link rel="icon" type="image/png" href="assets/favicon-64.png" />
<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Tinos:ital@0;1&display=swap" rel="stylesheet" />
${jsonld}
<style>
:root { color-scheme: dark; }
body { margin: 0; background: #03071e; color: #eadcc5; font: 17px/1.7 "Times New Roman", Tinos, Times, serif; }
main { max-width: 760px; margin: 0 auto; padding: 64px 24px 80px; }
h1 { font: 400 56px/1 "Bell MT", "Libre Caslon Display", "Times New Roman", serif; margin: 0 0 18px; }
h2 { font: 400 28px/1.15 "Bell MT", "Libre Caslon Display", "Times New Roman", serif; margin: 44px 0 12px; padding-top: 22px; border-top: 1px solid rgba(234, 220, 197,.16); }
h3 { font-size: 18px; margin: 18px 0 4px; }
p, li { color: #c9bea9; } a { color: #b58a57; }
.meta { font-size: 13px; color: #9c9384; }
@media (prefers-color-scheme: light) { body { background: #f4ede1; color: #03071e; } p, li { color: #1f2a4d; } a { color: #7a5530; } .meta { color: #4a5373; } h2 { border-color: rgba(3, 7, 30,.15); } }
</style>
</head>
<body>
<main>
<article>
<h1>Chennuru Tejith</h1>
<p>${esc(entity)}</p>
<p class="meta">By ${esc(P.name)} · Last updated <time datetime="${iso}">${esc(human)}</time> · <a href="./">Interactive portfolio</a> · <a href="press.html">Press kit</a> · <a href="${esc(P.cv)}">CV (PDF)</a></p>

${q("Who is Chennuru Tejith?", `<p>${esc(P.summary)}</p><p>Languages: ${esc(P.languages.join(", "))}.</p>`)}

${q("What has Chennuru Tejith worked on?", D.experience.map((e) => `<h3>${esc(e.role)}, ${esc(firstOrg(e.org))}</h3><p class="meta">${esc(e.when)}</p><ul>${e.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`).join(""))}

${q("What leadership roles has he held?", `<ul>${D.leadership.map((l) => `<li><strong>${esc(l.role)}</strong>, ${esc(l.org)} (${esc(l.when)})</li>`).join("")}</ul>`)}

${q("What are his core skills?", D.gyms.map((g) => `<h3>${esc(g.domain)}</h3><p>${esc(g.moves.join(", "))}.</p><p class="meta">Evidence: ${esc(g.battles.map((b) => `${b.role}, ${firstOrg(b.org)}`).join("; "))}</p>`).join(""))}

${q("How does he work?", `<ul>${D.principles.map((p) => `<li><strong>${esc(p.title)}.</strong> ${esc(p.text)} Example: ${esc(p.proof)}</li>`).join("")}</ul>`)}

${q("What has he built?", `<ul>${D.projects.map((x) => `<li><strong>${esc(x.name)}</strong>: ${esc(x.blurb)}${x.live ? ` <a href="${esc(x.live)}">Live app</a>` : ""}${x.repo ? ` <a href="${esc(x.repo)}">Source</a>` : ""}</li>`).join("")}</ul>`)}

${q("What research is he doing?", `<ul>${D.writing.map((w) => `<li><strong>${esc(w.title)}</strong> (${esc(w.kind)}, ${esc(w.date)}${w.status ? `, ${esc(w.status)}` : ""}): ${esc(w.summary)}</li>`).join("")}</ul>`)}

${(D.geoBaf || []).length ? q("How is his research applied to this website?", `<p>The GEO Business Adoption Framework (GEO-BAF) from his paper, run on this portfolio:</p><ol>${D.geoBaf.map((b) => `<li><strong>${esc(b.phase)}</strong> (${b.status === "done" ? "done" : "next"}): ${esc(b.detail)}</li>`).join("")}</ol>`) : ""}

${q("Education", `<ul>${D.education.map((e) => `<li>${esc(e.degree)}, ${esc(e.school)} (${esc(e.when)}; ${esc(e.score)})</li>`).join("")}${D.certifications.map((c) => `<li>${esc(c.name)}, ${esc(c.issuer)}</li>`).join("")}</ul>`)}

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

## Short bio (about 25 words)
${(D.bios || {}).short || ""}

## Long bio (about 100 words)
${(D.bios || {}).long || ""}

## Key facts
- Programme: Integrated BBA (Hons.) + MBA, O.P. Jindal Global University, Sonipat (Aug 2024 to Aug 2029), CGPA 7.9 / 8.00
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
- [Press kit](${abs("press.html")}): bios, crest and citation
- [CV (PDF)](${abs(P.cv)})

## Change log
${(D.changelog || []).map((c) => c.items.map((i) => `- ${c.month}: ${i}`).join("\n")).join("\n")}

## Elsewhere
- [LinkedIn](${P.linkedin})
- [GitHub](${P.github})
`;
fs.writeFileSync("llms.txt", llms);

// ---------- citation for the research paper (APA 7) ----------
const paper = D.writing[0];
const [given, family] = [P.name.split(" ")[1], P.name.split(" ")[0]];
const apa = paper ? `${family}, ${given[0]}. (${paper.date}). ${paper.title}${paper.status ? " [Unpublished manuscript]" : ""}. O.P. Jindal Global University.${paper.url ? " " + paper.url : ""}` : "";

// ---------- press.html (press kit, no JavaScript) ----------
const bios = D.bios || {};
const press = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'" />
<title>Chennuru Tejith | Press kit</title>
<meta name="description" content="${esc(bios.short || entity)}" />
${base ? `<link rel="canonical" href="${esc(abs("press.html"))}" />` : ""}
<link rel="icon" type="image/png" href="assets/favicon-64.png" />
<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Tinos:ital@0;1&display=swap" rel="stylesheet" />
${pageStyle(profile).replace("</style>", `.kit { display: grid; grid-template-columns: 160px 1fr; gap: 24px; align-items: center; }
.kit img { width: 160px; height: 160px; border: 1px solid rgba(234, 220, 197,.2); }
blockquote, pre { margin: 0; padding: 16px 18px; border-left: 2px solid #d8c3a0; background: rgba(234, 220, 197,.04); white-space: pre-wrap; font: inherit; }
@media (max-width: 560px) { .kit { grid-template-columns: 1fr; } }
</style>`)}
</head>
<body>
<main>
<article>
<h1>Press kit</h1>
<p>Everything you need to introduce or write about ${esc(P.name)}. Free to use with credit.</p>
<p class="meta">Last updated <time datetime="${iso}">${esc(human)}</time> · <a href="./">Portfolio</a> · <a href="profile.html">Text profile</a></p>

${q("Short bio (about 25 words)", `<blockquote>${esc(bios.short || "")}</blockquote>`)}

${q("Long bio (about 100 words)", `<blockquote>${esc(bios.long || "")}</blockquote>`)}

${q("Crest and photo", `<div class="kit"><img src="assets/crest-512.png" alt="CT crest" width="160" height="160" /><div><p><a href="assets/crest-512.png" download>Download the CT crest (PNG, 512 px)</a></p><p>Portrait photo: coming soon. Email for a high-resolution photo in the meantime.</p></div></div>`)}

${q("Quick facts", `<ul><li>Integrated BBA (Hons.) + MBA, O.P. Jindal Global University, 2024 to 2029, CGPA 7.9 / 8</li>${D.experience.map((e) => `<li>${esc(e.role)}, ${esc(firstOrg(e.org))} (${esc(e.when.split(" · ")[0])})</li>`).join("")}<li>Based in Hyderabad and Sonipat · ${esc(P.languages.map((l) => l.split(" (")[0]).join(", "))}</li></ul>`)}

${apa ? q("How to cite his research", `<pre>${esc(apa)}</pre>`) : ""}

${q("Contact", `<p>LinkedIn: <a href="${esc(P.linkedin)}">${esc(P.linkedin)}</a><br />Email: ${esc(emailSafe)}</p>`)}
</article>
</main>
</body>
</html>
`;
fs.writeFileSync("press.html", press);

// ---------- share pages: one per section, so link previews show that page's own card ----------
const SHARE = {
  work: ["Work", "Three internships, and a ₹4 Cr school build kept honest, step by step."],
  research: ["Research", "From SEO to GEO: research on how AI search decides what to cite."],
  about: ["About", "Where the work happened, a slider through the years, honours and documents."],
  contact: ["Contact", "Internships, projects, or a conversation. Replies within 48 hours."],
};
const stubCss = `body{margin:0;min-height:100vh;display:grid;place-items:center;background:#03071e;color:#eadcc5;font:17px/1.6 Georgia,"Times New Roman",serif}a{color:#b58a57}`;
for (const [slug, [name, desc]] of Object.entries(SHARE)) {
  const title = `${name} | ${P.name}`;
  fs.writeFileSync(`${slug}.html`, `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'self'; form-action 'none'" />
<meta http-equiv="refresh" content="0; url=./#${slug}" />
<meta name="robots" content="noindex, follow" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${esc(abs(`assets/og-${slug}.png`))}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
${base ? `<meta property="og:url" content="${esc(abs(`${slug}.html`))}" />\n` : ""}<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${esc(abs(`assets/og-${slug}.png`))}" />
<link rel="icon" type="image/png" href="assets/favicon-64.png" />
<style>${stubCss}</style>
</head>
<body><p><a href="./#${slug}">Continue to ${esc(name)} →</a></p></body>
</html>
`);
}

// ---------- 404.html ----------
fs.writeFileSync("404.html", `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self'; base-uri 'self'; form-action 'none'" />
<meta name="robots" content="noindex" />
<title>Page not found | ${esc(P.name)}</title>
<link rel="icon" type="image/png" href="/assets/favicon-64.png" />
<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Tinos:ital@0;1&display=swap" rel="stylesheet" />
<style>
:root { --bg: #03071e; --ink: #eadcc5; --ink2: #c9bea9; --ink4: #8f877a; --acc: #b58a57; --clay: #d8c3a0; --line: rgba(234, 220, 197,.17); color-scheme: dark; }
@media (prefers-color-scheme: light) { :root { --bg: #f4ede1; --ink: #03071e; --ink2: #1f2a4d; --ink4: #545c7c; --acc: #7a5530; --clay: #8a5a2b; --line: rgba(3, 7, 30,.18); color-scheme: light; } }
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 40px 20px; background: var(--bg); color: var(--ink); font: 17px/1.65 "Times New Roman", Tinos, Times, serif; }
main { width: min(760px, 100%); }
.crest { display: inline-grid; place-items: center; width: 56px; height: 56px; border: 1px solid var(--ink4); font: 24px "Bell MT", "Libre Caslon Display", "Times New Roman", serif; text-decoration: none; color: var(--ink); }
.k { margin: 40px 0 14px; font: 11px "Times New Roman", Tinos, Times, serif; letter-spacing: .22em; text-transform: uppercase; color: var(--clay); }
h1 { margin: 0 0 18px; font: 400 clamp(56px, 10vw, 120px)/.95 "Bell MT", "Libre Caslon Display", "Times New Roman", serif; letter-spacing: -.02em; }
h1 span { color: var(--clay); }
p { color: var(--ink2); margin: 0 0 34px; }
nav { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); border-top: 1px solid var(--line); }
nav a { padding: 16px 0; border-bottom: 1px solid var(--line); color: var(--ink); text-decoration: none; font: 400 22px "Bell MT", "Libre Caslon Display", "Times New Roman", serif; }
nav a:hover { color: var(--acc); }
</style>
</head>
<body>
<main>
<a class="crest" href="/" aria-label="Home">CT</a>
<p class="k">Error 404</p>
<h1>This page took a wrong turn<span>.</span></h1>
<p>The link may be old, or the address mistyped. Everything is still here:</p>
<nav aria-label="Pages">${["Home", ...Object.values(SHARE).map((x) => x[0])].map((n) => `<a href="/${n === "Home" ? "" : "#" + n.toLowerCase()}">${n}</a>`).join("")}</nav>
</main>
</body>
</html>
`);

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
  <url><loc>${base}/press.html</loc><lastmod>${iso}</lastmod></url>
  <url><loc>${base}/llms.txt</loc><lastmod>${iso}</lastmod></url>
</urlset>
`);
}
console.log(`Built profile.html, press.html, 404.html, share pages, llms.txt, index.html${base ? ", sitemap.xml" : " (set siteUrl in data.js to add sitemap + absolute URLs)"}: ${iso}`);
