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
<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital@0;1&display=swap" rel="stylesheet" />
${jsonld}
<style>
:root { color-scheme: dark; }
body { margin: 0; background: #0c0d11; color: #f2ede4; font: 17px/1.7 "Libre Caslon Text", "Times New Roman", serif; }
main { max-width: 760px; margin: 0 auto; padding: 64px 24px 80px; }
h1 { font: 400 56px/1 "Libre Caslon Display", "Times New Roman", serif; margin: 0 0 18px; }
h2 { font: 400 28px/1.15 "Libre Caslon Display", "Times New Roman", serif; margin: 44px 0 12px; padding-top: 22px; border-top: 1px solid rgba(242,237,228,.16); }
h3 { font-size: 18px; margin: 18px 0 4px; }
p, li { color: #c9c4bb; } a { color: #d9bf8f; }
.meta { font-size: 13px; color: #948f86; }
@media (prefers-color-scheme: light) { body { background: #f5f0e7; color: #1a1712; } p, li { color: #403a31; } a { color: #7a5a22; } .meta { color: #625b50; } h2 { border-color: rgba(26,23,18,.15); } }
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
<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital@0;1&display=swap" rel="stylesheet" />
${pageStyle(profile).replace("</style>", `.kit { display: grid; grid-template-columns: 160px 1fr; gap: 24px; align-items: center; }
.kit img { width: 160px; height: 160px; border: 1px solid rgba(242,237,228,.2); }
blockquote, pre { margin: 0; padding: 16px 18px; border-left: 2px solid #dba595; background: rgba(242,237,228,.04); white-space: pre-wrap; font: inherit; }
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

// ---------- api/_profile.mjs: what the AI assistant knows (nothing else) ----------
const facts = [
  `Name: ${P.name} (goes by ${P.shortName}). ${P.title}. Based in ${P.location}; studies in Sonipat, Haryana.`,
  `Bio: ${bios.long || entity}`,
  `Summary: ${P.summary}`,
  `Languages: ${P.languages.join(", ")}.`,
  `Education:\n${D.education.map((e) => `- ${e.degree}, ${e.school} (${e.when}, ${e.score})`).join("\n")}\n${D.certifications.map((c) => `- Certification: ${c.name}, ${c.issuer}`).join("\n")}`,
  `Internships:\n${D.experience.map((e) => `- ${e.role}, ${e.org} (${e.when})\n${e.points.map((x) => `  - ${x}`).join("\n")}`).join("\n")}`,
  `Case studies:\n${Object.entries(D.cases || {}).map(([role, c]) => `- ${role}: ${c.context} Actions: ${c.actions.join(" ")} Outcome: ${c.outcome}`).join("\n")}`,
  `Leadership:\n${D.leadership.map((l) => `- ${l.role}, ${l.org} (${l.when})`).join("\n")}\n${D.gyms.flatMap((g) => g.battles).filter((b) => D.leadership.some((l) => l.role === b.role) && b.points).map((b) => `- ${b.role}: ${b.points.join(" ")}`).join("\n")}`,
  `Skill areas:\n${D.gyms.map((g) => `- ${g.domain}: ${g.moves.join(", ")}`).join("\n")}`,
  `Tools and skills:\n${D.skills.map((s) => `- ${s.group}: ${s.items.join(", ")}`).join("\n")}`,
  `How he works:\n${D.principles.map((p) => `- ${p.title}: ${p.text} Example: ${p.proof}`).join("\n")}`,
  `Projects:\n${D.projects.map((x) => `- ${x.name}: ${x.blurb}${x.live ? ` Live: ${x.live}` : ""}${x.repo ? ` Source: ${x.repo}` : ""}`).join("\n")}`,
  `Research:\n${D.writing.map((w) => `- ${w.title} (${w.kind}, ${w.status || w.date}, ${w.venue}): ${w.summary}`).join("\n")}\n- Stage: ${D.geoStage}`,
  `Honours:\n${D.achievements.map((x) => `- ${x.text} (${x.year})`).join("\n")}`,
  a.windows ? `Availability: ${a.type}; ${a.windows.join(" and ")}; ${a.locations}; roles: ${a.roles.join(", ")}; replies ${a.response}.` : "",
  `Interests: ${D.offClock || ""}`,
  `What he believes: ${strip(P.quote ? P.quote.text : "")}`,
  `Recruiter Q&A (his own words):\n${(D.faq || []).map((f) => `- Q: ${f.q} A: ${f.a}`).join("\n")}`,
  `Recommendations: ${D.recommendations.length ? D.recommendations.map((r) => `${r.name} (${r.role}, ${r.org}): "${r.quote}"`).join(" ") : "none published yet; referee details are shared on request."}`,
  `Contact: email ${P.email}; LinkedIn ${P.linkedin}; GitHub ${P.github}; CV on the site.`,
].filter(Boolean).join("\n\n");
fs.mkdirSync("api", { recursive: true });
fs.writeFileSync("api/_profile.mjs", `// Generated by build.js from js/data.js. Do not edit by hand.\nexport default ${JSON.stringify(facts)};\n`);

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
console.log(`Built profile.html, press.html, llms.txt, api/_profile.mjs, index.html${base ? ", sitemap.xml" : " (set siteUrl in data.js to add sitemap + absolute URLs)"}: ${iso}`);
