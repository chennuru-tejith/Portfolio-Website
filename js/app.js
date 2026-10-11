// ============================================================
//  Chennuru Tejith: professional portfolio
// ============================================================
(function () {
  const D = window.PORTFOLIO, I = window.ICONS;
  const G = D.gyms; // the five disciplines
  const TAGS = D.skillTags || {}, OUT = D.outcomes || {};
  const SHORT = { ledger: "Finance", blueprint: "Operations", summit: "Leadership", signal: "Communication", circuit: "Tech" };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const firstOrg = (o) => o.split(", ")[0];
  // "?motion=1" forces full motion (used for testing; real visitors follow their system setting)
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches && !/[?&]motion=1/.test(location.search);

  // ---------- saved preferences ----------
  const KEY = "tejith-pro-v1";
  const state = Object.assign({ theme: "dark", sound: false }, (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })());
  if (state.theme !== "light" && state.theme !== "dark") state.theme = "dark";
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false;
    t.style.animation = "none"; void t.offsetWidth; t.style.animation = "";
    clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 2800);
  }
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    $("#themeBtn").innerHTML = I(t === "dark" ? "sun" : "moon", 17);
    $("#themeBtn").setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    const tc = $('meta[name="theme-color"]'); if (tc) tc.content = t === "dark" ? "#03071e" : "#f4ede1";
  }

  // ---------- views ----------
  let view = "story";
  function setView(v, push = true, animate = false) {
    if (animate && !still && v !== view) {
      const c = $("#curtain");
      c.className = "curtain in";
      setTimeout(() => { setView(v, push, false); c.className = "curtain out"; setTimeout(() => (c.className = "curtain"), 560); }, 450);
      return;
    }
    view = v;
    $("#story").hidden = v !== "story"; $("#resume").hidden = v !== "resume";
    document.body.classList.toggle("resume-mode", v === "resume");
    $("#resBtn").textContent = v === "resume" ? "Back to site" : "Résumé";
    $("#resBtn").dataset.go = v === "resume" ? "story" : "resume";
    if (push) { const u = new URL(location.href); v === "resume" ? u.searchParams.set("view", "resume") : u.searchParams.delete("view"); history.replaceState(null, "", u); }
    if (v === "story") { route(false, true); return; }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    onScroll();
  }

  // ---------- credential emblem (original SVG) ----------
  let uid = 0;
  function emblem(g, cls = "emb") {
    const id = "e" + ++uid;
    const hex = (r) => Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i - Math.PI / 2; return (50 + Math.cos(a) * r).toFixed(1) + "," + (50 + Math.sin(a) * r).toFixed(1); }).join(" ");
    const glyph = I(g.icon, 34).replace("<svg ", '<svg x="33" y="33" ').replace('stroke-width="1.7"', 'stroke-width="1.8"');
    return `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f6fc"/><stop offset=".45" stop-color="#b9c2dc"/><stop offset=".7" stop-color="#eef1fa"/><stop offset="1" stop-color="#7f89a8"/></linearGradient>
        <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g.color}"/><stop offset="1" style="stop-color:color-mix(in srgb, ${g.color} 50%, #03071e)"/></linearGradient>
        <linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
      </defs>
      <polygon points="${hex(47)}" fill="url(#${id}m)"/>
      <polygon points="${hex(39)}" fill="url(#${id}c)"/>
      <polygon points="${hex(39)}" fill="url(#${id}h)"/>
      <polygon points="${hex(33)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-dasharray="1.5 3"/>
      <g color="#fff">${glyph}</g>
    </svg>`;
  }

  // ---------- disciplines ----------
  const yearsOf = (g) => {
    const ys = g.battles.map((b) => (b.when.match(/\d{4}/g) || [])).flat().map(Number);
    if (!ys.length) return "";
    const lo = Math.min(...ys), hi = Math.max(...ys);
    return lo === hi ? String(lo) : `${lo} to ${hi}`;
  };
  function renderDisciplines() {
    $("#discTabs").innerHTML = G.map((g, i) => `
      <button class="dt" role="tab" id="dt-${g.id}" aria-controls="discPanel" aria-selected="${i === 0}" data-i="${i}" style="--c:${g.color}">
        ${emblem(g)}
        <span><b>${esc(g.domain)}</b><small>${g.battles.length} record${g.battles.length > 1 ? "s" : ""} · ${esc(yearsOf(g))}</small></span>
        <span class="no">${pad(i + 1)}</span>
      </button>`).join("");
    $$("#discTabs .dt").forEach((b) => b.addEventListener("click", () => showDisc(+b.dataset.i)));
    $("#discTabs").addEventListener("keydown", (e) => {
      if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) return;
      e.preventDefault();
      const cur = $$("#discTabs .dt").findIndex((b) => b.getAttribute("aria-selected") === "true");
      const n = (cur + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1) + G.length) % G.length;
      showDisc(n); $$("#discTabs .dt")[n].focus();
    });
    showDisc(0, false);
  }
  function showDisc(i, anim = true) {
    const g = G[i];
    $$("#discTabs .dt").forEach((b, k) => { b.setAttribute("aria-selected", k === i); b.tabIndex = k === i ? 0 : -1; });
    const p = $("#discPanel");
    p.setAttribute("aria-labelledby", "dt-" + g.id);
    p.style.setProperty("--c", g.color);
    p.innerHTML = `
      <div class="cred">
        ${emblem(g)}
        <div>
          <p class="mono">CREDENTIAL ${pad(i + 1)} OF ${pad(G.length)}</p>
          <h3>${esc(g.domain)}</h3>
          <p>${esc(g.intro)}</p>
          <div class="cred-meta"><span class="verified">✓ Backed by real work</span><span>${g.battles.length} record${g.battles.length > 1 ? "s" : ""}</span><span>${esc(yearsOf(g))}</span></div>
        </div>
      </div>
      <div class="panel-body">
        <div><h4>Evidence</h4>${g.battles.map((b) => `
          <div class="ev"><div class="ev-top"><div><h5>${esc(b.role)}</h5><span class="org">${esc(b.org)}</span></div><span class="when">${esc(b.when)}</span></div>
          ${b.points && b.points.length ? `<ul>${b.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</div>`).join("")}</div>
        <div><h4>Skills</h4><div class="chips">${g.moves.map((m) => `<span class="chip">${esc(m)}</span>`).join("")}</div></div>
        <div class="referee">${I("star", 16)}${g.referee ? `<span>Referee: <b>${esc(g.referee.name)}</b>, ${esc(g.referee.role)}${g.referee.link ? ` · <a href="${esc(g.referee.link)}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : ""}</span>` : `<span>Referee details on request. <a href="#refreq" data-ref-arena="${esc(g.id)}">Ask for a reference →</a></span>`}</div>
        ${g.next ? `<div class="next-badge">${emblem(g, "emb locked")}<div><span class="mono">Next badge</span><p>${esc(g.next)}</p></div><span class="nb-tag">In progress</span></div>` : ""}
      </div>`;
    if (anim && !still) { p.classList.remove("panel-anim"); void p.offsetWidth; p.classList.add("panel-anim"); }
  }

  // ---------- sections ----------
  function contactButtons(dark = true) {
    const p = D.profile;
    return `<a class="btn btn-primary" href="mailto:${esc(p.email)}">Email me <span aria-hidden="true">→</span></a>
      <a class="btn btn-ghost" href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a class="btn btn-ghost" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a class="btn btn-ghost" href="${esc(p.cv)}" download>Download CV</a>`;
  }
  const MON = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const startOf = (w) => { const m = w.match(/([A-Z][a-z]{2}) (\d{4})/); return m ? +m[2] * 12 + MON[m[1]] : 0; };
  const pointsFor = (role) => { for (const g of G) for (const b of g.battles) if (b.role === role && b.points) return b.points; return []; };

  function renderSections() {
    $("#cvHero").href = D.profile.cv;
    const SRC = { cv: ["CV (PDF)", D.profile.cv], linkedin: ["LinkedIn: Experience", D.profile.linkedin.replace(/\/$/, "") + "/details/experience/"] };
    $("#stats").innerHTML = D.profile.stats.map((s, i) => `<div class="metric" tabindex="0"><b data-v="${esc(s.value)}">${esc(s.value)}</b><span>${esc(s.label)}</span>
      ${s.sources ? `<button class="src-btn" aria-expanded="false" aria-controls="src${i}" title="Where this number comes from">✓ Source</button><div class="src-pop" id="src${i}" hidden>${s.story ? `<p class="src-story">${esc(s.story)}</p>` : ""}<p class="mono">Where this comes from</p><ul>${s.sources.map((k) => SRC[k] ? `<li><a href="${esc(SRC[k][1])}" target="_blank" rel="noopener noreferrer">${esc(SRC[k][0])} ↗</a></li>` : "").join("")}</ul>${s.note ? `<p>${esc(s.note)}</p>` : ""}</div>` : ""}</div>`).join("");
    $("#principleList").innerHTML = D.principles.map((p, i) => `
      <article class="principle rv"><span class="pr-no">${pad(i + 1)}</span><h3>${esc(p.title)}</h3><p class="pr-text">${esc(p.text)}</p>
      <span class="pr-where">${esc(p.where)}</span></article>`).join("");
    const q = D.profile.quote;
    if (q) { $("#quoteText").innerHTML = esc(q.text).replace(/\*([^*]+)\*/g, "<em>$1</em>"); $("#quoteBy").textContent = q.by; } else $(".pq").hidden = true;

    const items = [...D.experience.map((e) => ({ ...e, tag: "Internship" })), ...D.leadership.map((l) => ({ ...l, points: pointsFor(l.role), tag: "Leadership", lead: true }))].sort((a, b) => (a.lead ? 1 : 0) - (b.lead ? 1 : 0) || startOf(b.when) - startOf(a.when)); // internships first, then leadership
    $("#journeyList").innerHTML = items.map((s) => `
      <article class="step rv ft ${s.lead ? "lead" : ""}" data-tags="${esc((TAGS[s.role] || []).join(" "))}"><div><div class="step-when">${esc(s.when.split(" · ")[0])}</div><span class="step-tag">${s.tag}</span></div>
      <div><h3>${esc(s.role)}</h3><p class="step-org">${esc(s.org)}</p>${s.points.length ? `<ul>${s.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
      ${!s.lead && OUT[s.role] ? `<div class="ba"><div class="b"><b>Before</b>${esc(OUT[s.role].before)}</div><div class="arr" aria-hidden="true">→</div><div class="a"><b>After</b>${esc(OUT[s.role].after)}</div></div>` : ""}
      ${!s.lead && D.cases && D.cases[s.role] ? `<button class="case-btn" data-case="${esc(s.role)}">Read the case study <span aria-hidden="true">→</span></button>` : ""}</div></article>`).join("");

    $("#workList").innerHTML = D.projects.map((p, i) => {
      const links = `<div class="proj-links">${p.live ? `<a href="${esc(p.live)}" target="_blank" rel="noopener noreferrer">Visit live app ${I("external", 14)}</a>` : ""}${p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer">${I("github", 15)} Source</a>` : ""}</div>`;
      const body = `<div class="proj-top"><span class="proj-no">${pad(i + 1)}</span><span class="proj-type">${esc(p.types.join(" · "))}</span></div>
        <h3>${esc(p.name)}</h3><p>${esc(p.blurb)}</p><div class="tags">${p.moves.map((m) => `<span class="tag">${esc(m)}</span>`).join("")}</div>${links}`;
      const tg = `data-tags="${esc((TAGS[p.id] || []).join(" "))}"`;
      if (i === 0) return `<article class="proj feature rv ft" ${tg}><div class="proj-main">${body}</div>
        <div class="mock" aria-hidden="true">
          <div class="mock-row"><span class="mock-av"></span><span>Find the right people<small>Alumni, recruiters, founders</small></span><span class="mock-tag">DISCOVER</span></div>
          <div class="mock-row"><span class="mock-av" style="opacity:.75"></span><span>Write a note that sounds like you<small>Personal, not spammy</small></span><span class="mock-tag">DRAFT</span></div>
          <div class="mock-row"><span class="mock-av" style="opacity:.5"></span><span>Turn replies into referrals<small>Follow-ups that land</small></span><span class="mock-tag">CONVERT</span></div>
        </div></article>`;
      return `<article class="proj rv ft" ${tg}>${body}</article>`;
    }).join("");

    renderWriting(); renderRefs();
    $("#honourList").innerHTML = D.achievements.map((a, i) => `<li class="honour proof rv ft" data-tags="${esc(((D.achievementTags || [])[i] || []).join(" "))}">
      <span class="proof-top"><b>${esc(a.year)}</b><span class="proof-ic" aria-hidden="true">${I(a.icon || "medal", 18)}</span></span><p>${esc(a.text)}</p>
      ${a.image ? `<button class="proof-view" data-proof="${i}">View certificate <span aria-hidden="true">↗</span></button>` : `<span class="proof-req">Original on request</span>`}</li>`).join("");
    $("#school").innerHTML = `<h3>Education</h3>` + D.education.map((e) => `<div class="edu"><strong>${esc(e.degree)}</strong><span>${esc(e.school)}</span><em>${esc(e.when)} · ${esc(e.score)}</em></div>`).join("") +
      D.certifications.map((c) => `<div class="edu"><strong>${esc(c.name)}</strong><span>${esc(c.issuer)}</span><em>Certification</em>${c.verify ? `<a class="cert-verify" href="${esc(c.verify)}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : ""}</div>`).join("");
    $("#contactCta").innerHTML = contactButtons();
    $("#copyEmail .copy-text").textContent = D.profile.email;
  }
  function renderWriting(filter = "All") {
    const items = D.writing, box = $("#writingList"), bar = $("#writingFilters");
    if (!items.length) {
      bar.hidden = true;
      box.innerHTML = `<div class="empty rv"><span class="empty-ic">${I("scroll", 24)}</span><div><h3>Papers and essays will appear here.</h3>
        <p>Research papers, case studies and write-ups from my internships, starting with what monitoring a ₹4 Cr CSR build taught me about operations.</p></div>
        <a class="btn btn-ghost btn-sm" href="${esc(D.profile.linkedin)}" target="_blank" rel="noopener noreferrer">Follow on LinkedIn</a></div>`;
      return;
    }
    const kinds = ["All", ...new Set(items.map((w) => w.kind))];
    bar.hidden = kinds.length < 3;
    bar.innerHTML = kinds.map((k) => `<button role="tab" aria-selected="${k === filter}" data-kind="${esc(k)}">${esc(k)}</button>`).join("");
    $$("button", bar).forEach((b) => b.addEventListener("click", () => renderWriting(b.dataset.kind)));
    box.innerHTML = items.filter((w) => filter === "All" || w.kind === filter).map((w) => {
      const inner = `<div class="paper-top"><span>${esc(w.kind)}</span><span>${esc(w.date)}</span></div>
        <h3>${esc(w.title)}</h3><p>${esc(w.summary)}</p>
        ${w.status ? `<span class="paper-status">${esc(w.status)}</span>${geoTrack()}` : `<span class="paper-venue">${esc(w.venue)}${w.url ? " ↗" : ""}</span>`}
        ${w === D.writing[0] ? `<button class="cite-btn" data-cite>Cite this <span aria-hidden="true">“ ”</span></button>` : ""}`;
      return w.url ? `<a class="paper" href="${esc(w.url)}" target="_blank" rel="noopener noreferrer">${inner}</a>` : `<div class="paper static">${inner}</div>`;
    }).join("");
  }
  function requestLink() {
    const body = ["Hi Tejith,", "", "Here is my recommendation for your portfolio:", "", "", "", "Name:", "Role / title:", "Organisation:", "How I know you (e.g. taught you X / supervised you at Y):", "LinkedIn profile (so recruiters can verify):", "", "I give permission to publish this on your portfolio: Yes / No"].join("\n");
    return `mailto:${D.profile.email}?subject=${encodeURIComponent("Recommendation for Chennuru Tejith")}&body=${encodeURIComponent(body)}`;
  }
  const initials = (n) => n.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/, "").split(/\s+/).map((x) => x[0]).slice(0, 2).join("");
  function renderRefs() {
    const recs = D.recommendations;
    const cta = `<div class="ref-cta rv"><div><h3>Worked with me?</h3><p>If I've been your student, intern or teammate, I'd be grateful for a few honest lines. I only publish them with your permission.</p></div>
      <a class="btn btn-primary btn-sm" href="${esc(requestLink())}">Write a recommendation <span aria-hidden="true">→</span></a></div>`;
    if (!recs.length) {
      $("#references h2").textContent = "References, on request.";
      $("#references .sub").textContent = "Supervisors from each internship and club can speak to my work. Tell me what you're hiring for and I'll put you in touch.";
      $("#refList").innerHTML = "";
      return;
    }
    $("#refList").innerHTML = `<div class="ref-grid">${recs.map((r) => `<figure class="ref rv"><blockquote>“${esc(r.quote)}”</blockquote>
      <figcaption><span class="ref-init" aria-hidden="true">${esc(initials(r.name))}</span><span><b>${esc(r.name)}</b><small>${esc(r.role)} · ${esc(r.org)}</small>${r.relation ? `<small>${esc(r.relation)}</small>` : ""}</span>
      ${r.link ? `<a class="ref-verify" href="${esc(r.link)}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : ""}</figcaption></figure>`).join("")}</div>${cta}`;
  }
  function renderResume() {
    const p = D.profile;
    $("#resume").innerHTML = `<div class="resume"><div class="r-sheet">
      <header class="r-head"><h1>${esc(p.name)}</h1><p class="r-role">${esc(p.title)} · BBA + MBA, O.P. Jindal Global University</p>
        <div class="r-links"><span>${I("pin", 15)} ${esc(p.location)}</span><a href="mailto:${esc(p.email)}">${I("mail", 15)} ${esc(p.email)}</a>
        <a href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer">${I("linkedin", 15)} chennuru-tejith</a><a href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">${I("github", 15)} chennuru-tejith</a></div>
        <div class="r-actions"><a class="btn btn-primary btn-sm" href="${esc(p.cv)}" download>Download PDF</a><button class="btn btn-ghost btn-sm" data-print>Print / save</button><button class="btn btn-ghost btn-sm" data-hr>Copy summary for HR</button><a class="btn btn-ghost btn-sm" href="mailto:${esc(p.email)}">Email</a></div></header>
      <section class="r-sec"><h2>Summary</h2><p>${esc(p.summary)}</p></section>
      <section class="r-sec"><h2>Experience</h2><div>${D.experience.map((e) => `<div class="r-item"><h3>${esc(e.role)}</h3><div class="r-sub"><span>${esc(e.org)}</span><span>${esc(e.when)}</span></div><ul>${e.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div></section>
      <section class="r-sec"><h2>Leadership</h2><div>${D.leadership.map((l) => `<div class="r-item"><h3>${esc(l.role)}</h3><div class="r-sub"><span>${esc(l.org)}</span><span>${esc(l.when)}</span></div></div>`).join("")}</div></section>
      <section class="r-sec"><h2>Education</h2><div>${D.education.map((e) => `<div class="r-item"><h3>${esc(e.degree)}</h3><div class="r-sub"><span>${esc(e.school)}</span><span>${esc(e.when)} · ${esc(e.score)}</span></div></div>`).join("")}</div></section>
      <section class="r-sec"><h2>Skills</h2><div class="r-skills">${D.skills.map((s) => `<div><b>${esc(s.group)}:</b> ${esc(s.items.join(", "))}</div>`).join("")}<div><b>Languages:</b> ${esc(p.languages.join(", "))}</div><div><b>Certification:</b> ${esc(D.certifications.map((c) => `${c.name} (${c.issuer})`).join(", "))}</div></div></section>
      <section class="r-sec"><h2>Projects</h2><div>${D.projects.map((x) => `<div class="r-item"><h3><a href="${esc(x.live || x.repo)}" target="_blank" rel="noopener noreferrer">${esc(x.name)}</a></h3><div class="r-sub"><span>${esc(x.blurb)}</span></div></div>`).join("")}</div></section>
      ${D.writing.length ? `<section class="r-sec"><h2>Writing</h2><div>${D.writing.map((w) => `<div class="r-item"><h3>${w.url ? `<a href="${esc(w.url)}" target="_blank" rel="noopener noreferrer">${esc(w.title)}</a>` : esc(w.title)}</h3><div class="r-sub"><span>${esc(w.kind)} · ${esc(w.status || w.venue)}</span><span>${esc(w.date)}</span></div></div>`).join("")}</div></section>` : ""}
      ${D.recommendations.length ? `<section class="r-sec"><h2>References</h2><div>${D.recommendations.map((r) => `<div class="r-item"><h3>${esc(r.name)}</h3><div class="r-sub"><span>${esc(r.role)}, ${esc(r.org)}</span>${r.link ? `<a href="${esc(r.link)}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : ""}</div><p style="margin-top:6px">“${esc(r.quote)}”</p></div>`).join("")}</div></section>` : ""}
      <section class="r-sec"><h2>Honours</h2><div><ul style="margin:0;padding-left:18px">${D.achievements.map((a) => `<li>${esc(a.text)} (${esc(a.year)})</li>`).join("")}</ul></div></section>
    </div><div class="r-foot"><span>Want the full picture? The main site has the details behind each role.</span><button class="btn btn-ghost btn-sm" data-go="story">View full site →</button></div></div>`;
  }

  // ---------- programme progress (EXP bar) ----------
  function renderProgress() {
    const pr = D.programme; if (!pr) return;
    const YR = 31557600000, s = new Date(pr.start), e = new Date(pr.end), now = new Date();
    const p = Math.min(1, Math.max(0, (now - s) / (e - s)));
    const total = Math.round((e - s) / YR), year = Math.min(total, Math.max(1, Math.floor((now - s) / YR) + 1));
    $("#prog").innerHTML = `<div class="prog-top"><span><b>Year ${year} of ${total}</b> · ${esc(pr.name)}</span><span>Graduating ${e.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span></div>
      <div class="prog-bar" role="progressbar" aria-label="Programme progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(p * 100)}"><i style="--p:${(p * 100).toFixed(1)}%"></i></div>
      <div class="prog-ticks">${Array.from({ length: total }, (_, i) => `<span class="${i < year ? "on" : ""}">Y${i + 1} · ${s.getFullYear() + i}</span>`).join("")}</div>`;
  }

  // ---------- availability ----------
  function renderAvail() {
    const a = D.availability; if (!a) { $(".avail").hidden = true; return; }
    $("#avail").innerHTML = `<div class="av-head"><span class="dot"></span>Available</div>
      <div class="av-cell"><span>When</span><b>${a.windows.map(esc).join("<br>")}</b></div>
      <div class="av-cell"><span>Type</span><b>${esc(a.type)}</b></div>
      <div class="av-cell"><span>Roles</span><b>${a.roles.map(esc).join(", ")}</b></div>
      <div class="av-cell"><span>Location · Reply time</span><b>${esc(a.locations)}<br>${esc(a.response)}</b></div>
      <div class="av-cta"><a class="btn btn-primary btn-sm" href="mailto:${esc(D.profile.email)}?subject=${encodeURIComponent("Internship opportunity")}">Contact <span aria-hidden="true">→</span></a></div>`;
  }

  // ---------- abilities vs tools ----------
  function renderAbilities() {
    $("#abilityList").innerHTML = (D.abilities || []).map((a) => `<li class="rv"><span class="ab-ic">${I("check", 16)}</span><div><b>${esc(a.name)}</b><span>${esc(a.proof)}</span></div></li>`).join("");
    $("#moveList").innerHTML = (D.moves || []).map((m) => `<li>${esc(m.name)}${m.level ? `<small>${esc(m.level)}</small>` : ""}</li>`).join("");
  }

  // ---------- journey map: dot-matrix India (official outline, DataMeet CC-0) ----------
  function renderMap() {
    const places = D.places || [], M = window.INDIA;
    if (!places.length || !M) { $("#journey").hidden = true; return; }
    const X = (lon) => (lon - M.lon0) * M.cosf * M.k + M.pad, Y = (lat) => (M.lat1 - lat) * M.k + M.pad;
    const svg = $("#map");
    svg.setAttribute("viewBox", `0 0 ${M.w} ${M.h}`);
    let s = `<defs>
      <pattern id="dotp" class="dotp" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.35"/></pattern>
      <linearGradient id="routeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--blue)"/><stop offset="1" style="stop-color:var(--clay)"/></linearGradient>
    </defs>
    <path class="land" d="${M.d}"/><path class="land-dots" d="${M.d}"/><path class="land-edge" d="${M.d}"/>`;
    const pts = places.map((p) => ({ ...p, x: X(p.lon), y: Y(p.lat) }));
    if (pts.length >= 2) {
      const [a, b] = pts, mx = (a.x + b.x) / 2 + 120, my = (a.y + b.y) / 2;
      const R = 6371, rad = (d) => (d * Math.PI) / 180;
      const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
      const km = Math.round((2 * R * Math.asin(Math.sqrt(h))) / 10) * 10;
      s += `<path class="route" d="M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}"/>`;
      s += `<text class="km" x="${((a.x + b.x) / 2 + 70).toFixed(1)}" y="${my.toFixed(1)}">≈ ${km.toLocaleString("en-IN")} km</text>`;
    }
    pts.forEach((p, i) => {
      s += `<g class="pin" data-i="${i}" tabindex="0" role="button" aria-label="${esc(p.city)}, ${esc(p.state)}" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})">
        <circle class="halo" r="14"/><circle class="core" r="7"/>
        <text x="-16" y="5" text-anchor="end">${esc(p.city)}</text><text class="st" x="-16" y="21" text-anchor="end">${esc(p.state)}</text>${p.city === "Hyderabad" ? `<text class="home-tag" x="16" y="5">HOME</text>` : ""}</g>`;
    });
    svg.innerHTML = s;
    const pick = (i) => {
      $$("#map .pin").forEach((g) => g.classList.toggle("on", +g.dataset.i === i));
      const p = places[i];
      $("#mapSide").innerHTML = `<div class="city-tabs" role="tablist">${places.map((q, k) => `<button role="tab" aria-selected="${k === i}" data-i="${k}">${esc(q.city)}</button>`).join("")}</div>
        <div class="city"><h3>${esc(p.city)}</h3><p>${esc(p.state)}, India${p.city === "Hyderabad" ? " · Home" : ""}</p>${p.city === "Hyderabad" && D.homeNote ? `<p class="home-note">${esc(D.homeNote)}</p>` : ""}<ul>${p.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>`;
      $$("#mapSide .city-tabs button").forEach((b) => b.addEventListener("click", () => pick(+b.dataset.i)));
    };
    $$("#map .pin").forEach((g) => {
      g.addEventListener("click", () => pick(+g.dataset.i));
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(+g.dataset.i); } });
    });
    pick(Math.max(0, places.findIndex((p) => p.city === "Hyderabad")));
  }


  // ---------- recruiter Q&A ----------
  function renderFaq() {
    const f = D.faq || []; if (!f.length) { $("#qa").hidden = true; return; }
    $("#faqList").innerHTML = f.map((x, i) => `<details class="rv" ${i === 0 ? "open" : ""}><summary>${esc(x.q)}</summary><p>${esc(x.a)}</p></details>`).join("");
  }


  // ---------- motion: hero card tilt, paused off-screen ----------
  function motion() {
    const hero = $(".hero");
    new IntersectionObserver(([e]) => hero.classList.toggle("off", !e.isIntersecting)).observe(hero);
    if (still || !matchMedia("(pointer: fine)").matches) return;
    const vis = $("#heroVisual"); if (!vis) return;
    const file = $(".file", vis);
    let raf = 0, rx = 0, ry = 0;
    vis.addEventListener("pointermove", (e) => {
      const r = vis.getBoundingClientRect();
      ry = ((e.clientX - r.left) / r.width - 0.5) * 8; rx = -((e.clientY - r.top) / r.height - 0.5) * 6;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; file.style.setProperty("--rx", rx.toFixed(2) + "deg"); file.style.setProperty("--ry", ry.toFixed(2) + "deg"); });
    });
    vis.addEventListener("pointerleave", () => { file.style.setProperty("--rx", "0deg"); file.style.setProperty("--ry", "0deg"); });
  }

  // ---------- scroll & reveal ----------
  let io;
  function reveal() {
    if (still) { $$(".rv").forEach((e) => e.classList.add("in")); return; }
    io = io || new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.08 });
    $$(".rv:not(.in)").forEach((e) => io.observe(e));
  }
  function onScroll() {
    $("#nav").classList.toggle("solid", scrollY > 20);
    const max = document.documentElement.scrollHeight - innerHeight;
    $("#progress").style.setProperty("--sp", max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
  }

  // ---------- pages: one room at a time (all content stays in the HTML for crawlers) ----------
  const PAGES = ["home", "about", "work", "research", "contact"];
  const ALIAS = { arenas: "disciplines", ask: "qa", changelog: "about" }; // old links still land somewhere sensible
  const PAGE_NAME = { home: "Home", about: "About", work: "Work", research: "Research", contact: "Contact" };
  let page = "";
  function pageFor(id) {
    if (!id || id === "top") return "home";
    if (PAGES.includes(id)) return id;
    const el = document.getElementById(id), sec = el && el.closest("[data-page]");
    return sec ? sec.dataset.page : "home";
  }
  function route(animate = true, force = false) {
    const raw = decodeURIComponent(location.hash.slice(1)), id = ALIAS[raw] || raw, next = pageFor(id);
    if (view !== "story") setView("story", true);
    const changed = next !== page || force;
    if (changed) {
      page = next;
      $$("#story [data-page]").forEach((el) => el.classList.toggle("off-page", el.dataset.page !== page));
      $("#story").dataset.page = page;
      document.body.dataset.page = page; // lets the background pause its lap off the home page
      $$(".nav-links a").forEach((a) => { const on = a.getAttribute("href") === "#" + page; a.classList.toggle("on", on); on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"); });
      document.title = page === "home" ? HOME_TITLE : `${PAGE_NAME[page]} | ${D.profile.name}`;
      const i = PAGES.indexOf(page), nx = PAGES[(i + 1) % PAGES.length];
      $("#nextPage").innerHTML = page === "home" ? "" : `<a href="#${nx}"><span class="mono">Next</span><b>${esc(PAGE_NAME[nx])}</b><span aria-hidden="true">→</span></a>`;
      if (animate && !still) { const m = $("#story"); m.classList.remove("page-in"); void m.offsetWidth; m.classList.add("page-in"); }
      if (animate) wipe();
      if (animate && page === "home") launch();
      reveal();
    }
    const target = id && !PAGES.includes(id) && id !== "top" ? document.getElementById(id) : null;
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: changed || still ? "auto" : "smooth" }));
    else if (changed) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    onScroll();
  }
  const HOME_TITLE = document.title;


  // ---------- "currently" line ----------
  function renderNow() {
    const c = D.currently || {}, parts = [["Working on", c.working], ["Reading", c.reading], ["Learning", c.learning]].filter((x) => x[1]);
    if (!parts.length) return;
    $("#now").innerHTML = parts.map(([k, v]) => `<b>${esc(k)}</b><span>${esc(v)}</span>`).join("");
    $("#now").hidden = false;
  }

  // ---------- local time in Hyderabad (IST) ----------
  function clock() {
    const el = $("#clock"); if (!el) return;
    const fmt = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true });
    const tick = () => { el.innerHTML = `${fmt.format(new Date())} IST<small>Replies ${esc((D.availability && D.availability.response || "soon").toLowerCase())}</small>`; };
    tick(); setInterval(tick, 30000);
  }

  // ---------- bookshelf, documents, off the clock ----------
  function renderExtras() {
    const books = D.books || [];
    if (books.length) {
      $("#bookList").innerHTML = books.map((b) => `<li class="rv"><b>${esc(b.title)}</b><i>${esc(b.author || "")}</i><span>${esc(b.note || "")}</span></li>`).join("");
      $("#books").hidden = false;
    }
    const docs = D.documents || [];
    if (docs.length) {
      $("#docList").innerHTML = docs.map((d) => `<li class="rv"><b>${esc(d.name)}</b><span class="mono">${esc(d.type)}</span><a href="${esc(d.url)}" download>Download ↓</a></li>`).join("");
    } else $("#documents").hidden = true;
    if (D.offClock) { $("#offText").textContent = D.offClock; $("#offclock").hidden = false; }
  }

  // ---------- "summary for HR" ----------
  function hrText() {
    const p = D.profile, a = D.availability || {};
    return [
      `${p.name}, ${D.programme ? D.programme.name : "BBA + MBA"}, O.P. Jindal Global University (graduating Aug 2029)`,
      `Experience: Round Table India (Operations, ₹4 Cr CSR project), Dr. Reddy's (Project Management), Ion Exchange (Finance)`,
      a.windows ? `Available: ${a.windows.join(" & ")} · ${a.type} · ${a.locations}` : "",
      `Contact: ${p.email} · ${p.linkedin}`,
      `Portfolio: ${location.origin + location.pathname}`,
    ].filter(Boolean).join("\n");
  }
  async function copyHR() {
    try { await navigator.clipboard.writeText(hrText()); toast("Summary copied ✓"); }
    catch (err) { location.href = `mailto:?subject=${encodeURIComponent("Candidate: " + D.profile.name)}&body=${encodeURIComponent(hrText())}`; }
  }

  // ---------- case-study reader ----------
  let caseFocus = null;
  function openCase(role) {
    const c = D.cases && D.cases[role], e = D.experience.find((x) => x.role === role);
    if (!c || !e) return;
    caseFocus = document.activeElement;
    $("#caseBody").innerHTML = `<div class="cs">
      <p class="kicker cs-kick">Case study</p>
      <h2 id="caseTitle">${esc(firstOrg(e.org))}</h2>
      <p class="cs-org">${esc(e.role)} · ${esc(e.when)}</p>
      <div class="cs-block"><h4>Context</h4><p>${esc(c.context)}</p></div>
      <div class="cs-block"><h4>What I did</h4><ul>${c.actions.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></div>
      <div class="cs-block"><h4>What changed</h4><p>${esc(c.outcome)}</p></div>
      <div class="cs-block"><h4>Takeaway</h4><p class="cs-take">“${esc(c.takeaway)}”</p></div>
    </div>`;
    $("#reader").hidden = false; document.body.style.overflow = "hidden";
    $(".reader-panel").scrollTop = 0; $(".reader-x").focus();
  }
  function closeCase() {
    if ($("#reader").hidden) return;
    $("#reader").hidden = true; document.body.style.overflow = "";
    if (caseFocus && caseFocus.focus) caseFocus.focus({ preventScroll: true });
  }

  // ---------- hero: portrait, what's new, greeting, word-by-word headline ----------
  function renderHeroExtras() {
    if (D.photo) {
      const img = new Image();
      img.alt = `Portrait of ${D.profile.name}`; img.decoding = "async"; img.src = D.photo;
      img.addEventListener("load", () => { $(".frame-empty").remove(); });
      $("#frame").appendChild(img);
    }
    const u = (D.updates || [])[0];
    if (u) { const n = $("#news"); n.href = u.link || "#"; n.innerHTML = `<b>Now</b>${esc(u.text)}<i>· ${esc(u.date)}</i>`; n.hidden = false; }
    $("#greet").hidden = true; // only used for seasonal greetings
    if (still) return;
    const h1 = $(".hero h1"); let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
            const sp = document.createElement("span"); sp.className = "w"; sp.textContent = t; sp.style.animationDelay = (0.15 + i++ * 0.07).toFixed(2) + "s"; frag.appendChild(sp);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1) walk(c);
      });
    };
    walk(h1); h1.classList.add("split");
  }

  // ---------- numbers count up when they come into view ----------
  function countUps() {
    const els = $$("#stats b[data-v]");
    if (still) return;
    // split-flap, like a timing screen: each character flips down in turn
    els.forEach((el) => { el.innerHTML = [...el.dataset.v].map((ch, i) => `<span class="flap" style="--i:${i}">${ch === " " ? "&nbsp;" : esc(ch)}</span>`).join(""); el.classList.add("flaps"); });
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("go"); io.unobserve(e.target); } }), { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }

  // ---------- the ₹4 Cr story, told on scroll ----------
  function scrollStory() {
    const steps = $$("#stSteps li"); if (!steps.length) return;
    const weeks = $$("#stWeeks span"), pill = $("#stPill"), flag = $("#stFlag");
    const labels = ["Briefed", "On site", "Budget tracked", "Discrepancy caught", "Reported ✓"];
    const set = (n) => {
      steps.forEach((li, k) => li.classList.toggle("on", k === n));
      weeks.forEach((w, k) => setTimeout(() => w.classList.toggle("on", n >= 1), n >= 1 ? k * 90 : 0));
      flag.classList.toggle("on", n >= 3);
      pill.textContent = labels[n]; pill.classList.toggle("st-pill-ok", n === 4);
    };
    set(0);
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) set(+e.target.dataset.step); }), { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach((li) => io.observe(li));
  }

  // ---------- journey map draws itself when it comes into view ----------
  function mapReveal() {
    const m = $("#map"); if (!m) return;
    if (still) { m.classList.add("drawn"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { m.classList.add("drawn"); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(m);
  }

  // ---------- "ask my portfolio": instant answers from the site's own content ----------
  const SYN = { budget: ["budget", "spend", "fund", "cost", "financ", "rupee", "₹"], lead: ["lead", "direct", "head", "elect", "represent", "team", "club"], data: ["data", "analys", "report", "excel", "tableau", "python"], avail: ["availab", "december", "june", "internship", "when", "start"], build: ["built", "build", "app", "extension", "tool", "project", "github"], verify: ["verif", "check", "discrepan", "audit", "record"], speak: ["language", "telugu", "hindi", "french", "english", "communicat"] };
  let corpus = null;
  function buildCorpus() {
    const c = [];
    D.experience.forEach((e) => e.points.forEach((t) => c.push({ src: firstOrg(e.org), t })));
    D.leadership.forEach((l) => c.push({ src: "Leadership", t: `${l.role}, ${l.org} (${l.when})` }));
    D.principles.forEach((p) => c.push({ src: "How I work", t: p.proof }));
    (D.abilities || []).forEach((a) => c.push({ src: a.name, t: a.proof }));
    D.projects.forEach((p) => c.push({ src: "Project", t: `${p.name}: ${p.blurb}` }));
    D.achievements.forEach((a) => c.push({ src: `Honour ${a.year}`, t: a.text }));
    D.skills.forEach((s) => c.push({ src: s.group, t: s.items.join(", ") }));
    c.push({ src: "Languages", t: D.profile.languages.join(", ") });
    if (D.availability) c.push({ src: "Availability", t: `Available ${D.availability.windows.join(" and ")} for ${D.availability.type}; roles: ${D.availability.roles.join(", ")}; ${D.availability.locations}.` });
    D.education.forEach((e) => c.push({ src: "Education", t: `${e.degree}, ${e.school} (${e.when}, ${e.score})` }));
    return c;
  }
  function search(q) {
    corpus = corpus || buildCorpus();
    const words = q.toLowerCase().replace(/[^\p{L}\p{N}₹\s]/gu, " ").split(/\s+/).filter((w) => w.length > 2 && !["has", "the", "and", "for", "him", "his", "does", "did", "can", "what", "with", "any", "how", "who", "skills", "tejith", "chennuru"].includes(w));
    const keys = new Set();
    words.forEach((w) => { keys.add(w.slice(0, 5)); Object.values(SYN).forEach((list) => { if (list.some((k) => w.startsWith(k.slice(0, 4)) || k.startsWith(w.slice(0, 4)))) list.forEach((k) => keys.add(k)); }); });
    return corpus.map((d) => { const low = d.t.toLowerCase(); let sc = 0; keys.forEach((k) => { if (low.includes(k)) sc++; }); return { ...d, sc }; }).filter((d) => d.sc > 0).sort((a, b) => b.sc - a.sc).slice(0, 3);
  }
  // answers come straight from js/data.js: no API, no cost, nothing leaves the browser
  const list = (xs) => (xs.length < 2 ? xs.join("") : xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1]);
  const exp = (re) => D.experience.find((e) => re.test(e.org));
  const INTENTS = [
    [/^\s*(hi|hello|hey|namaste|good (morning|afternoon|evening))\b/, () => `Hello! ${(D.bios || {}).short || ""} Ask me about his internships, leadership, projects, research or availability.`],
    [/weak|fail|mistake|salary|stipend|pay|age|old|religion|caste|married|relationship/, () => `That isn't something this site covers. It's a good one to ask Tejith directly at ${D.profile.email}.`],
    [/round table|4 ?cr|csr|school build|site visit|vst/, () => { const e = exp(/Round Table/); return `At Round Table India (${e.when.split(" · ")[0]}), Tejith worked as an operations intern on a ₹4 Cr CSR-funded government school build.\n• ${e.points.join("\n• ")}`; }],
    [/reddy|pharma|project manag/, () => { const e = exp(/Reddy/); return `At Dr. Reddy's Laboratories (${e.when.split(" · ")[0]}), Tejith was a project management intern.\n• ${e.points.join("\n• ")}`; }],
    [/ion exchange|finance intern/, () => { const e = exp(/Ion Exchange/); return `At Ion Exchange India (${e.when.split(" · ")[0]}), Tejith was a finance intern.\n• ${e.points.join("\n• ")}`; }],
    [/budget|money|financ|cost|account|spend|fund|numbers/, () => `Yes. At Round Table India he tracked CSR fund use against a ₹4 Cr sanctioned budget and caught a reporting discrepancy before it reached the sponsor. At Dr. Reddy's he analysed five years of employee costs (FY2021 to FY2025), and at Ion Exchange he handled daily transactions and vendor records.`],
    [/lead|team|club|manag(e|ing) people|committee|captain|director|head/, () => `Yes. His roles: ${list(D.leadership.map((l) => `${l.role} at ${l.org} (${l.when})`))}. He was also named Best Leader at JGU University Day 2025.`],
    [/availab|when can|start|join|free|hire|internship|vacanc|open to/, () => { const a = D.availability; return `Tejith is open to internships (${a.type.split(" · ").slice(1).join(", ").toLowerCase() || "in person"}) in ${list(a.windows)}. Roles: ${list(a.roles)}. Location: ${a.locations}. He usually replies ${a.response.toLowerCase()}.`; }],
    [/research|paper|geo\b|generative engine|seo|publish|writ/, () => { const w = D.writing[0]; return `He is writing a research paper as sole author: "${w.title}". ${w.summary} Current stage: ${D.geoStage}. You can cite it from the Research page.`; }],
    [/built|build|project|app|code|program|github|tech|extension|tool|ai\b/, () => `Alongside his degree he has built ${list([...new Set(D.projects.map((p) => p.name.split(":")[0]))].slice(0, 4))}. The featured one, ${D.projects[0].name.split(":")[0]}, is live: ${D.projects[0].live}. Source code is on ${D.profile.github}.`],
    [/language|speak|telugu|hindi|french|english/, () => `He speaks ${list(D.profile.languages)}.`],
    [/stud|educat|college|universit|degree|cgpa|gpa|grade|mark|school|class/, () => D.education.map((e) => `${e.degree}, ${e.school} (${e.when}, ${e.score})`).join("\n")],
    [/award|honou?r|achiev|recogn|rank|prize/, () => "• " + D.achievements.map((x) => `${x.text} (${x.year})`).join("\n• ")],
    [/contact|email|mail|reach|linkedin|phone|call|connect/, () => `Email ${D.profile.email}, or LinkedIn at ${D.profile.linkedin}. The Contact page also lets you book a 15-minute call.`],
    [/where|based|locat|city|relocat|move|remote|hyderabad|sonipat|delhi/, () => `He is from Hyderabad and studies in Sonipat, Haryana. For internships: ${D.availability.locations}.`],
    [/why|hire him|strength|good at|stand out|different|value/, () => "Four things he holds himself to:\n• " + D.principles.map((p) => `${p.title}: ${p.proof}`).join("\n• ")],
    [/skill|abilit|know|excel|tableau|python|software/, () => D.skills.map((s) => `${s.group}: ${s.items.join(", ")}`).join("\n")],
    [/hobb|interest|free time|weekend|f1|formula|sport/, () => D.offClock || "Ask him directly."],
    [/believ|value|loyal|principle/, () => `"${D.profile.quote.text.replace(/\*/g, "")}" That's the line he works by.`],
    [/\bwho\b|about (him|tejith)|introduce|tell me|summar|overview/, () => (D.bios || {}).long || D.profile.summary],
  ];
  function localAnswer(q) {
    const low = q.toLowerCase();
    for (const [re, fn] of INTENTS) if (re.test(low)) return fn();
    const hits = search(q);
    if (!hits.length) return `I couldn't find that on this site. The quickest way to know is to ask Tejith directly at ${D.profile.email}.`;
    return "Here is what the site says:\n• " + hits.map((h) => `${h.src}: ${h.t}`).join("\n• ");
  }
  const chat = { busy: false };
  function bubble(role, html) {
    const el = document.createElement("div");
    el.className = "bubble " + role; el.innerHTML = html;
    $("#chatLog").appendChild(el);
    $("#chatLog").scrollTop = $("#chatLog").scrollHeight;
    return el;
  }
  const fmt = (t) => esc(t).replace(/\n/g, "<br>");
  function typeOut(el, text, src) {
    const foot = `<span class="bubble-src">${src}</span>`;
    if (still) { el.innerHTML = fmt(text) + foot; return; }
    const words = text.split(/(\s+)/); let i = 0;
    el.innerHTML = "<span class='bubble-text'></span>" + foot;
    const box = $(".bubble-text", el);
    const step = () => { i = Math.min(words.length, i + 3); box.innerHTML = fmt(words.slice(0, i).join("")); $("#chatLog").scrollTop = $("#chatLog").scrollHeight; if (i < words.length) setTimeout(step, 28); };
    step();
  }
  function askAI(raw) {
    const q = String(raw || "").trim().slice(0, 500);
    if (!q || chat.busy) return;
    chat.busy = true; $("#askInput").value = "";
    bubble("me", fmt(q));
    const pending = bubble("ai", `<span class="typing" aria-label="Looking it up"><i></i><i></i><i></i></span>`);
    setTimeout(() => { typeOut(pending, localAnswer(q), "From this portfolio"); chat.busy = false; }, still ? 0 : 450);
  }
  function renderAsk() {
    const chips = ["Who is Tejith?", "Has he handled budgets?", "Can he lead a team?", "When is he available?", "What has he built?", "What is his research about?"];
    $("#askChips").innerHTML = chips.map((c) => `<button type="button">${esc(c)}</button>`).join("");
    $$("#askChips button").forEach((b) => b.addEventListener("click", () => askAI(b.textContent)));
    $("#askBtn").addEventListener("click", () => askAI($("#askInput").value));
    $("#askInput").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); askAI(e.target.value); } });
    bubble("ai", `${fmt(`Hi! Ask me anything about Tejith: his internships, leadership, projects, research or when he's available. Answers come straight from this site.`)}<span class="bubble-src">From this portfolio</span>`);
    const prompt = `Who is ${D.profile.name}?`, enc = encodeURIComponent(prompt);
    $("#askElsewhere").innerHTML = [["ChatGPT", `https://chatgpt.com/?q=${enc}`], ["Perplexity", `https://www.perplexity.ai/search?q=${enc}`], ["Claude", `https://claude.ai/new?q=${enc}`]]
      .map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${n} ${I("external", 13)}</a>`).join("") + `<span class="mono">Asks “${esc(prompt)}”</span>`;
  }

  // ---------- citation, GEO readiness ----------
  function apa() {
    const w = D.writing[0]; if (!w) return "";
    const [family, given] = D.profile.name.split(" ");
    return `${family}, ${given[0]}. (${w.date}). <i>${esc(w.title)}</i>${w.status ? " [Unpublished manuscript]" : ""}. O.P. Jindal Global University.${w.url ? " " + esc(w.url) : ""}`;
  }
  function openCite() {
    $("#citeText").innerHTML = apa();
    $("#cite").hidden = false; $("#citeCopy").focus();
  }
  function geoBadge() {
    const b = D.geoBaf || []; if (!b.length) return;
    const done = b.filter((x) => x.status === "done").length;
    const el = $("#geoBadge");
    el.innerHTML = `<span class="mono">GEO</span><span class="geo-meter" aria-hidden="true">${b.map((x) => `<i class="${x.status === "done" ? "on" : ""}"></i>`).join("")}</span><span>${done} of ${b.length} phases</span>`;
    el.setAttribute("aria-label", `GEO readiness: ${done} of ${b.length} framework phases done`);
    el.hidden = false;
  }

  // ---------- smart contact + booking ----------
  function renderContact() {
    let type = "internship";
    $$(".msg-type button").forEach((b) => b.addEventListener("click", () => {
      type = b.dataset.t; $$(".msg-type button").forEach((x) => x.setAttribute("aria-checked", x === b));
    }));
    const err = $("#msgErr");
    [$("#msgName"), $("#msgBody")].forEach((f) => f.addEventListener("input", () => (err.hidden = true)));
    $("#msgSend").addEventListener("click", () => {
      const name = $("#msgName").value.trim(), org = $("#msgOrg").value.trim(), body = $("#msgBody").value.trim();
      if (!name) { err.textContent = "Add your name first."; err.hidden = false; $("#msgName").focus(); return; }
      if (type !== "hello" && !body) { err.textContent = "Add a line about the opportunity."; err.hidden = false; $("#msgBody").focus(); return; }
      const subject = { internship: `Internship opportunity: ${org || name}`, project: `Project collaboration: ${org || name}`, hello: `Hello from ${name}` }[type];
      const text = [`Hi Tejith,`, ``, body || `Just wanted to say hello. I came across your portfolio.`, ``, `Best,`, name + (org ? `, ${org}` : "")].join("\n");
      waveFlag();
      location.href = `mailto:${D.profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    });
    $("#bookCall").addEventListener("click", () => {
      if (D.bookingUrl) { window.open(D.bookingUrl, "_blank", "noopener,noreferrer"); return; }
      const text = ["Hi Tejith,", "", "Could we set up a 15-minute call?", "Times that work for me (with time zone):", "", "Best,"].join("\n");
      location.href = `mailto:${D.profile.email}?subject=${encodeURIComponent("Request: 15-minute call")}&body=${encodeURIComponent(text)}`;
    });
  }

  // ---------- share card with QR ----------
  const shareUrl = () => { const base = location.origin + location.pathname.replace(/[^/]*$/, ""); return page && page !== "home" ? `${base}${page}.html` : base; };
  // the QR library is only needed here, so it loads on first use
  let qrLib = null;
  function loadQR() {
    if (window.qrcode) return Promise.resolve();
    return qrLib || (qrLib = new Promise((ok, fail) => { const sc = document.createElement("script"); sc.src = "js/vendor/qrcode.js?v=112"; sc.onload = ok; sc.onerror = fail; document.head.appendChild(sc); }));
  }
  async function openShare() {
    try { await loadQR(); } catch (e) { toast("Couldn't load the QR code"); return; }
    const qr = qrcode(0, "M"); qr.addData(shareUrl()); qr.make();
    $("#shareCard").innerHTML = `<span class="crest"><span>CT</span></span>
      <h3 id="shareTitle">${esc(D.profile.name)}</h3>
      <p>Finance · Operations · Leadership</p>
      <div class="sc-row"><span>BBA + MBA, O.P. Jindal Global University<br>${esc(D.profile.email)}</span><div class="sc-qr">${qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true })}</div></div>`;
    $("#share").hidden = false; $(".share-x").focus();
    $("#shareSave").onclick = () => saveCard(qr);
  }
  function closeShare() { $("#share").hidden = true; }
  function saveCard(qr) {
    const W = 1080, H = 1350, c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d");
    x.fillStyle = "#03071e"; x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(234, 220, 197,.22)"; x.strokeRect(40, 40, W - 80, H - 80);
    x.fillStyle = "#d69c77"; x.fillRect(100, 140, 90, 3);
    x.fillStyle = "#f1ece3"; x.font = "400 110px 'Bell MT', 'Times New Roman', serif"; x.fillText(D.profile.name.split(" ")[0], 96, 330); x.fillText(D.profile.name.split(" ").slice(1).join(" "), 96, 450);
    x.fillStyle = "#b58a57"; x.font = "italic 400 52px 'Bell MT', 'Times New Roman', serif"; x.fillText("Finance · Operations · Leadership", 100, 560);
    x.fillStyle = "#9c9384"; x.font = "400 30px 'Times New Roman', serif"; x.fillText("BBA + MBA, O.P. Jindal Global University", 100, 640); x.fillText(D.profile.email, 100, 690);
    const n = qr.getModuleCount(), size = 380, cell = size / n, ox = W - 100 - size, oy = H - 100 - size;
    x.fillStyle = "#f1ece3"; x.fillRect(ox - 20, oy - 20, size + 40, size + 40);
    x.fillStyle = "#03071e";
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (qr.isDark(r, k)) x.fillRect(ox + k * cell, oy + r * cell, Math.ceil(cell), Math.ceil(cell));
    x.fillStyle = "#9c9384"; x.font = "400 26px 'Times New Roman', serif"; x.fillText("SCAN TO VIEW PORTFOLIO", 100, H - 110);
    c.toBlob((b) => { const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "Chennuru-Tejith-card.png"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }, "image/png");
  }
  function wireShare() {
    $("#shareNative").addEventListener("click", async () => {
      if (navigator.share) { try { await navigator.share({ title: document.title, url: shareUrl() }); } catch (e) {} }
      else { try { await navigator.clipboard.writeText(shareUrl()); toast("Link copied ✓"); } catch (e) {} }
    });
    $("#shareCopy").addEventListener("click", async () => { try { await navigator.clipboard.writeText(shareUrl()); toast("Link copied ✓"); } catch (e) {} });
  }

  // ---------- optional visitor counter (GoatCounter, privacy-friendly) ----------
  function views() {
    const code = D.goatcounter; if (!code || !/^[a-z0-9-]+$/i.test(code)) return;
    const base = `https://${code}.goatcounter.com`, path = location.pathname;
    new Image().src = `${base}/count?p=${encodeURIComponent(path)}&t=${encodeURIComponent(document.title)}&rnd=${Math.random().toString(36).slice(2)}`;
    fetch(`${base}/counter/${encodeURIComponent(path)}.json`).then((r) => (r.ok ? r.json() : null)).then((j) => {
      if (j && j.count) { $("#views").innerHTML = `Viewed by <b>${esc(j.count)}</b> people`; $("#views").hidden = false; }
    }).catch(() => {});
  }


  // ---------- GEO-BAF applied to this site ----------
  function renderBaf() {
    const list = D.geoBaf || []; if (!list.length) return;
    $("#bafList").innerHTML = list.map((b, i) => `<li class="rv ${b.status === "done" ? "done" : ""}"><span class="baf-no">Phase ${i + 1}</span><div><b>${esc(b.phase)}</b><p>${esc(b.detail)}</p></div><span class="baf-st">${b.status === "done" ? "Done ✓" : "Next"}</span></li>`).join("");
    $("#baf").hidden = false;
  }

  // ---------- GEO paper progress ----------
  function geoTrack() {
    const stages = ["Research", "Draft", "Review", "Published"], at = stages.indexOf(D.geoStage);
    if (at < 0) return "";
    return `<div class="geo" aria-label="Stage: ${esc(D.geoStage)}">${stages.map((st, i) => `<span class="${i < at ? "done" : i === at ? "now" : ""}">${st}</span>`).join("")}</div>`;
  }

  // ---------- voice clip ----------
  function voice() {
    if (!D.voice) return;
    const btn = $("#voice"), audio = new Audio(D.voice);
    btn.hidden = false;
    btn.addEventListener("click", () => { if (audio.paused) { audio.currentTime = 0; audio.play().catch(() => {}); } else audio.pause(); });
    audio.addEventListener("play", () => btn.classList.add("playing"));
    ["pause", "ended"].forEach((ev) => audio.addEventListener(ev, () => btn.classList.remove("playing")));
  }

  // ---------- signature that writes itself ----------
  function signature() {
    const box = $("#sig"); if (!box) return;
    if (D.signature) box.innerHTML = `<img src="${esc(D.signature)}" alt="Signature of ${esc(D.profile.name)}" />`;
    else box.innerHTML = `<span class="script">${esc(D.profile.shortName || D.profile.name)}</span>`;
    if (still) { box.classList.add("go"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { box.classList.add("go"); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(box);
  }

  // ---------- seasonal greeting ----------
  function season() {
    const now = new Date(), md = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const inRange = (a, b) => (a <= b ? md >= a && md <= b : md >= a || md <= b);
    const s = (D.seasons || []).find((x) => inRange(x.from, x.to));
    if (!s) return;
    const g = $("#greet"); g.innerHTML = `<span class="season">${esc(s.greeting)}.</span>`; g.hidden = false;
    if (s.accent && document.documentElement.dataset.theme === "dark") document.documentElement.style.setProperty("--clay", s.accent);
  }

  // ---------- a decision I'd make + notes from the field ----------
  function renderThinking() {
    const d = D.decision;
    if (d) $("#decide").innerHTML = `<p class="decide-q rv">${esc(d.question)}</p><ol class="rv">${d.reasoning.map((r) => `<li>${esc(r)}</li>`).join("")}</ol>`;
    else $("#decision").hidden = true;
    $("#noteList").innerHTML = (D.notes || []).map((n) => `<article class="note rv"><span class="mono">Notes from the field · ${esc(n.date)}</span><div><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p></div></article>`).join("");
  }

  // ---------- documents: download all, vCard, one-pager ----------
  function docsActions() {
    const docs = D.documents || [];
    $("#dlAll").hidden = docs.length < 2;
    $("#dlAll").addEventListener("click", () => docs.forEach((d, i) => setTimeout(() => { const a = document.createElement("a"); a.href = d.url; a.download = ""; document.body.appendChild(a); a.click(); a.remove(); }, i * 400)));
  }
  function vcard() {
    const p = D.profile, [first, ...rest] = p.name.split(" ");
    const v = ["BEGIN:VCARD", "VERSION:3.0", `N:${rest.join(" ")};${first};;;`, `FN:${p.name}`, "ORG:O.P. Jindal Global University", `TITLE:${p.title}`, `EMAIL;TYPE=INTERNET:${p.email}`, `URL:${location.origin + location.pathname}`, `X-SOCIALPROFILE;TYPE=linkedin:${p.linkedin}`, "END:VCARD"].join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([v], { type: "text/vcard" })); a.download = "Chennuru-Tejith.vcf";
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast("Contact card downloaded ✓");
  }
  function onePager() {
    const p = D.profile, a = D.availability || {};
    $("#onepager").innerHTML = `<h1>${esc(p.name)}</h1><p class="op-role">Why Tejith, in one page · ${esc(p.title)}</p>
      <p>BBA + MBA, O.P. Jindal Global University (2024 to 2029), CGPA 7.9 / 8. ${esc(p.email)} · ${esc(p.linkedin)}</p>
      <h2>Three reasons</h2><ul>${D.principles.slice(0, 3).map((x) => `<li><b>${esc(x.title)}.</b> ${esc(x.proof)}</li>`).join("")}</ul>
      <h2>Experience</h2><ul>${D.experience.map((e) => `<li><b>${esc(e.role)}</b>, ${esc(firstOrg(e.org))} (${esc(e.when.split(" · ")[0])}): ${esc(e.points[0])}</li>`).join("")}</ul>
      <h2>Leadership</h2><ul>${D.leadership.slice(0, 3).map((l) => `<li>${esc(l.role)}, ${esc(l.org)}</li>`).join("")}</ul>
      ${a.windows ? `<h2>Availability</h2><p>${esc(a.windows.join(" & "))} · ${esc(a.type)} · ${esc(a.locations)} · ${esc(a.roles.join(", "))}</p>` : ""}
      <h2>Portfolio</h2><p>${esc(location.origin + location.pathname)}</p>`;
    document.body.classList.add("print-one");
    const done = () => { document.body.classList.remove("print-one"); removeEventListener("afterprint", done); };
    addEventListener("afterprint", done);
    window.print();
  }

  // ---------- race car draws itself ----------
  function carDraw() {
    const car = $(".car"); if (!car) return;
    if (still) { car.classList.add("drawn"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { car.classList.add("drawn"); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(car);
  }

  // ---------- endorsements from LinkedIn ----------
  function renderEndorse() {
    const e = D.endorsements || [], skills = D.profile.linkedin.replace(/\/$/, "") + "/details/skills/";
    if (!e.length) { $("#endorse").hidden = true; return; }
    $("#endorseList").innerHTML = e.length
      ? `<div class="ref-grid">${e.map((x) => `<figure class="ref rv"><span class="mono en-kind">${esc(x.kind || "Endorsement")}</span><blockquote>“${esc(x.quote)}”</blockquote>
          <figcaption><span class="ref-init" aria-hidden="true">${esc(initials(x.name))}</span><span><b>${esc(x.name)}</b><small>${esc(x.role || "")}</small></span>${x.link ? `<a class="ref-verify" href="${esc(x.link)}" target="_blank" rel="noopener noreferrer">See on LinkedIn ↗</a>` : ""}</figcaption></figure>`).join("")}</div>`
      : `<div class="empty rv"><span class="empty-ic">${I("linkedin", 22)}</span><div><h3>Skill endorsements live on LinkedIn.</h3><p>Quotes will appear here once the people who wrote them say yes. Until then, you can see every endorsement on my profile.</p></div>
          <a class="btn btn-ghost btn-sm" href="${esc(skills)}" target="_blank" rel="noopener noreferrer">See endorsements ↗</a></div>`;
  }

  // ---------- recently on LinkedIn ----------
  function renderPosts() {
    const ps = (D.linkedinPosts || []).slice(0, 3);
    $("#liPosts").innerHTML = `<h3 class="li-h">Recently on LinkedIn</h3>` + (ps.length
      ? `<div class="li-grid">${ps.map((x) => `<a class="li-card rv" href="${esc(x.url)}" target="_blank" rel="noopener noreferrer"><span class="mono">${esc(x.date)}</span><p>${esc(x.text)}</p><span class="li-more">Read on LinkedIn ↗</span></a>`).join("")}</div>`
      : `<p class="li-empty">I post about operations, research and what I'm building. <a href="${esc(D.profile.linkedin)}" target="_blank" rel="noopener noreferrer">Follow along on LinkedIn ↗</a></p>`);
  }

  // ---------- interview slots (IST, shown in the visitor's time too) ----------
  function renderSlots() {
    const now = Date.now(), here = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const ist = (d, o) => d.toLocaleString("en-GB", { timeZone: "Asia/Kolkata", ...o });
    const mine = (d) => d.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" });
    const slots = (D.interviewSlots || []).flatMap((s) => s.times.map((t) => new Date(`${s.date}T${t}:00+05:30`))).filter((d) => !isNaN(d) && d > now).sort((a, b) => a - b).slice(0, 8);
    if (!slots.length) { $("#slots").hidden = true; return; }
    if (!slots.length) {
      $("#slotGrid").innerHTML = `<div class="slot-empty"><p>No slots listed this week. Suggest a time that suits you and I'll confirm within 48 hours.</p><button class="btn btn-ghost btn-sm" id="slotAsk">Suggest a time <span aria-hidden="true">→</span></button></div>`;
      $("#slotAsk").addEventListener("click", () => { location.href = `mailto:${D.profile.email}?subject=${encodeURIComponent("Interview: suggesting a time")}&body=${encodeURIComponent("Hi Tejith,\n\nCould we speak for 30 minutes at one of these times?\n\n1.\n2.\n\nBest,")}`; });
      return;
    }
    const sameZone = here === "Asia/Kolkata" || here === "Asia/Calcutta";
    $("#slotGrid").innerHTML = slots.map((d) => {
      const label = `${ist(d, { weekday: "short", day: "numeric", month: "short" })}, ${ist(d, { hour: "2-digit", minute: "2-digit", hour12: false })} IST`;
      return `<button class="slot" data-slot="${esc(label)}"><b>${esc(ist(d, { weekday: "short", day: "numeric", month: "short" }))}</b><span>${esc(ist(d, { hour: "numeric", minute: "2-digit" }))} IST</span>${sameZone ? "" : `<small>${esc(mine(d))} your time</small>`}</button>`;
    }).join("");
    $$("#slotGrid .slot").forEach((b) => b.addEventListener("click", () => {
      location.href = `mailto:${D.profile.email}?subject=${encodeURIComponent(`Interview: ${b.dataset.slot}`)}&body=${encodeURIComponent(`Hi Tejith,\n\nI'd like to take the ${b.dataset.slot} slot for a 30-minute conversation.\n\nName:\nCompany:\nRole:\n\nBest,`)}`;
    }));
  }

  // ---------- guestbook (notes are emailed for approval) ----------
  function renderGuestbook() {
    const g = D.guestbook || [];
    $(".gb").classList.toggle("gb-solo", !g.length);
    $("#gbList").innerHTML = g.length ? g.map((x) => `<li class="rv"><p>“${esc(x.note)}”</p><span><b>${esc(x.name)}</b>${x.org ? `, ${esc(x.org)}` : ""}${x.date ? ` · ${esc(x.date)}` : ""}</span></li>`).join("") : `<li class="gb-none">No notes yet. Be the first.</li>`;
    const note = $("#gbNote"), err = $("#gbErr");
    note.addEventListener("input", () => { $("#gbCount").textContent = `${note.value.length} / 140`; err.hidden = true; });
    $("#gbSend").addEventListener("click", () => {
      const name = $("#gbName").value.trim(), org = $("#gbOrg").value.trim(), text = note.value.trim();
      if (!name || !text) { err.textContent = "Add your name and a line."; err.hidden = false; (name ? note : $("#gbName")).focus(); return; }
      const body = [`Guestbook note for your portfolio:`, ``, `"${text}"`, ``, `Name: ${name}`, org ? `Organisation: ${org}` : "", ``, `I'm happy for this to appear on the site.`].filter((l, i, a) => l || a[i - 1] !== "").join("\n");
      location.href = `mailto:${D.profile.email}?subject=${encodeURIComponent(`Guestbook: ${name}`)}&body=${encodeURIComponent(body)}`;
    });
  }

  // ---------- source popovers on the headline numbers ----------
  function wireSources() {
    const closeAll = (except) => $$(".src-pop").forEach((p) => { if (p !== except) { p.hidden = true; const b = p.previousElementSibling; if (b) b.setAttribute("aria-expanded", "false"); } });
    document.addEventListener("click", (e) => {
      const b = e.target.closest(".src-btn");
      if (b) { const p = b.nextElementSibling; closeAll(p); p.hidden = !p.hidden; b.setAttribute("aria-expanded", String(!p.hidden)); return; }
      if (!e.target.closest(".src-pop")) closeAll();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
  }

  // ---------- building now ----------
  function renderBuilding() {
    const b = D.buildingNow || []; if (!b.length) { $("#building").hidden = true; return; }
    $("#buildList").innerHTML = b.map((x, i) => `<li class="rv"><span class="bl-no">${pad(i + 1)}</span><div><b>${esc(x.skill)}</b><p>${esc(x.detail)}</p></div><span class="bl-st ${x.stage === "In progress" ? "on" : ""}">${esc(x.stage)}</span></li>`).join("");
  }

  // ---------- ask for a reference (comes to Tejith first) ----------
  function renderRefReq() {
    $("#rqArena").innerHTML = `<option value="">Area the reference should cover</option>` + G.map((g) => `<option value="${esc(g.id)}">${esc(g.domain)}</option>`).join("") + `<option value="general">General character reference</option>`;
    const err = $("#rqErr");
    $("#rqSend").addEventListener("click", () => {
      const name = $("#rqName").value.trim(), org = $("#rqOrg").value.trim(), role = $("#rqRole").value.trim(), sel = $("#rqArena");
      if (!name || !org) { err.textContent = "Add your name and company."; err.hidden = false; (name ? $("#rqOrg") : $("#rqName")).focus(); return; }
      err.hidden = true;
      const area = sel.value ? sel.options[sel.selectedIndex].text : "Any area";
      const body = [`Hi Tejith,`, ``, `I'd like a reference for you.`, ``, `Name: ${name}`, `Company: ${org}`, `Role I'm hiring for: ${role || "(not given)"}`, `Area: ${area}`, ``, `Best,`, name].join("\n");
      location.href = `mailto:${D.profile.email}?subject=${encodeURIComponent(`Reference request: ${org}`)}&body=${encodeURIComponent(body)}`;
    });
    document.addEventListener("click", (e) => { const a = e.target.closest("[data-ref-arena]"); if (a) setTimeout(() => { $("#rqArena").value = a.dataset.refArena; $("#rqName").focus({ preventScroll: true }); }, 400); });
  }

  // ---------- pit wall: a small strategy call ----------
  const PIT = {
    data: [["Lap", "34 of 57"], ["Position", "P4"], ["Tyres", "Mediums, 24 laps old"], ["Wear", "+0.15 s slower every lap"], ["Fresh hards", "about 1 s a lap quicker"], ["Pit stop costs", "21 s"], ["Gap to car behind", "19 s"], ["Rain", "40% chance in 10 laps"]],
    opts: [
      ["stay", "Stay out to the flag", "23 more laps on worn mediums. Wear adds 0.15 s a lap, every lap, which adds up to roughly 40 s by the flag: about twice what a stop costs. You'd likely lose the place anyway, late in the race."],
      ["now", "Box now for hards", "The stop costs 21 s against a 19 s gap, so you rejoin about 2 s behind. On tyres a second a lap quicker, you're back ahead within three laps. If the rain does come, it costs a second stop, but you're covered either way."],
      ["wait", "Wait for the rain", "Five more laps on old tyres costs time and shrinks the gap. If it rains (40%), one stop for intermediates wins big. If it doesn't (60%), the gap is gone and the stop now costs you a place."],
    ],
    mine: "now",
    why: "My call: box now. The numbers say the worn tyre costs more than the stop, and a plan that works whatever the weather beats one that needs a 40% chance. It's the same rule I used on site: decide on the figures you have, not the ones you hope for.",
  };
  function renderPit() {
    if (!D.offClock) return;
    $("#pitData").innerHTML = PIT.data.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
    $("#pitOpts").innerHTML = PIT.opts.map(([id, label]) => `<button data-pit="${id}" aria-pressed="false">${esc(label)}</button>`).join("");
    $$("#pitOpts button").forEach((b) => b.addEventListener("click", () => {
      $$("#pitOpts button").forEach((x) => { x.setAttribute("aria-pressed", String(x === b)); x.classList.toggle("mine", x.dataset.pit === PIT.mine); });
      const o = PIT.opts.find((x) => x[0] === b.dataset.pit);
      $("#pitOut").innerHTML = `<p><span class="mono">${b.dataset.pit === PIT.mine ? "Same call as mine" : "Your call"}</span>${esc(o[2])}</p><p class="pit-why">${esc(PIT.why)}</p>`;
    }));
  }

  // ---------- motion kit: rev lights, gauge, flag, pit boards, tilt (transform and opacity only) ----------
  // 1. rev-light strip: the scroll bar is drawn as segments; lighting them is a clip, not a resize
  function revLights() {
    const bar = $("#progress"); if (!bar) return;
    bar.innerHTML = Array.from({ length: 15 }, (_, i) => `<i style="--n:${i}"></i>`).join("");
    bar.classList.add("rev");
  }
  // 3. a small gauge beside the CGPA; the needle sweeps when it comes into view
  function gauge() {
    const stat = D.profile.stats.findIndex((x) => /cgpa/i.test(x.label)); if (stat < 0) return;
    const el = $$("#stats .metric")[stat]; if (!el) return;
    const v = parseFloat(D.profile.stats[stat].value), max = 8, deg = -120 + (v / max) * 240;
    const ticks = Array.from({ length: 9 }, (_, i) => { const a = (-120 + i * 30) * Math.PI / 180; return `<line x1="${(50 + Math.sin(a) * 36).toFixed(1)}" y1="${(50 - Math.cos(a) * 36).toFixed(1)}" x2="${(50 + Math.sin(a) * 42).toFixed(1)}" y2="${(50 - Math.cos(a) * 42).toFixed(1)}"/>`; }).join("");
    el.insertAdjacentHTML("beforeend", `<svg class="gauge" viewBox="0 0 100 100" aria-hidden="true"><path class="g-arc" d="M18.8 68 A42 42 0 1 1 81.2 68" pathLength="1"/><g class="g-ticks">${ticks}</g><g class="g-needle" style="--deg:${deg.toFixed(1)}deg"><line x1="50" y1="50" x2="50" y2="16"/><circle cx="50" cy="50" r="4"/></g></svg>`);
    const g = $(".gauge", el);
    if (still) { g.classList.add("go"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { g.classList.add("go"); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(g);
  }
  // 4. chequered flag
  function waveFlag() {
    if (still) return;
    const f = $("#flag"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go");
  }
  // 6. section labels flip in like pit boards
  function pitBoards() {
    const heads = $$(".sec-head .kicker");
    if (still) return;
    heads.forEach((k) => k.classList.add("board"));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.8 });
    heads.forEach((k) => io.observe(k));
  }
  // 7. cards lean toward the pointer, like a car into a corner (one rAF per frame at most)
  function tilt() {
    if (still || !matchMedia("(pointer: fine)").matches) return;
    let card = null, raf = 0, rx = 0, ry = 0;
    const paint = () => { raf = 0; if (card) { card.style.setProperty("--rx", rx.toFixed(2) + "deg"); card.style.setProperty("--ry", ry.toFixed(2) + "deg"); } };
    document.addEventListener("pointermove", (e) => {
      const c = e.target.closest && e.target.closest(".tilt");
      if (c !== card) { if (card) { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); } card = c; }
      if (!card) return;
      const r = card.getBoundingClientRect();
      ry = ((e.clientX - r.left) / r.width - 0.5) * 6; rx = -((e.clientY - r.top) / r.height - 0.5) * 5;
      if (!raf) raf = requestAnimationFrame(paint);
    }, { passive: true });
    $$(".feat, .ch, .proof, .li-card, .proj, .slot, .paper").forEach((c) => c.classList.add("tilt"));
  }

  // ---------- 60-second tour ----------
  const TOUR = [
    ["top", "Chennuru Tejith: BBA + MBA at O.P. Jindal Global University, working across finance, operations and leadership."],
    ["stats", "Three internships, a ₹4 Cr CSR build, a 200+ member club, and a CGPA of 7.9 out of 8."],
    ["experience", "Operations at Round Table India, project management at Dr. Reddy's, finance at Ion Exchange."],
    ["story-4cr", "The ₹4 Cr school build: 23 site visits in 7 weeks, every rupee tracked, one discrepancy caught before the sponsor saw it."],
    ["recon", "This is the weekly check, line by line: contractor figures against what the site supervisor recorded."],
    ["disciplines", "Five arenas: finance, operations, leadership, communication and tech. Each one is backed by real work."],
    ["writing", "Research as sole author: From SEO to GEO, on how AI search decides what to cite."],
    ["contact", "Open to internships in December to January and June to July. Thanks for taking the tour."],
  ];
  const tour = { i: -1, t: 0, paused: false, left: 0, started: 0 };
  const STEP = 7500;
  function tourGo(i) {
    clearTimeout(tour.t);
    if (i >= TOUR.length) return tourEnd();
    tour.i = i; tour.paused = false; $("#tourPause").innerHTML = "❚❚"; $("#tourPause").setAttribute("aria-label", "Pause tour");
    const [id, text] = TOUR[i];
    $$(".tour-focus").forEach((e) => e.classList.remove("tour-focus"));
    location.hash = id === "top" ? "#home" : "#" + id;
    if (id === "top") window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
    const el = document.getElementById(id); if (el) setTimeout(() => el.classList.add("tour-focus"), 300);
    $("#tourStep").textContent = `Stop ${i + 1} of ${TOUR.length}`;
    $("#tourText").textContent = text;
    const f = $("#tourFill"); f.style.transition = "none"; f.style.width = (i / TOUR.length) * 100 + "%"; void f.offsetWidth;
    f.style.transition = `width ${STEP}ms linear`; f.style.width = ((i + 1) / TOUR.length) * 100 + "%";
    tour.left = STEP; tour.started = Date.now();
    tour.t = setTimeout(() => tourGo(i + 1), STEP);
  }
  function tourPause() {
    const f = $("#tourFill");
    if (!tour.paused) {
      clearTimeout(tour.t); tour.left -= Date.now() - tour.started; tour.paused = true;
      f.style.transition = "none"; f.style.width = getComputedStyle(f).width;
      $("#tourPause").innerHTML = "▶"; $("#tourPause").setAttribute("aria-label", "Resume tour");
    } else {
      tour.paused = false; tour.started = Date.now();
      f.style.transition = `width ${tour.left}ms linear`; f.style.width = ((tour.i + 1) / TOUR.length) * 100 + "%";
      tour.t = setTimeout(() => tourGo(tour.i + 1), tour.left);
      $("#tourPause").innerHTML = "❚❚"; $("#tourPause").setAttribute("aria-label", "Pause tour");
    }
  }
  function tourEnd() {
    clearTimeout(tour.t); tour.i = -1;
    $("#tour").hidden = true; document.body.classList.remove("touring");
    $$(".tour-focus").forEach((e) => e.classList.remove("tour-focus"));
  }
  function wireTour() {
    $("#tourBtn").addEventListener("click", () => { $("#tour").hidden = false; document.body.classList.add("touring"); tourGo(0); $("#tourPause").focus({ preventScroll: true }); });
    $("#tourPause").addEventListener("click", tourPause);
    $("#tourNext").addEventListener("click", () => tourGo(tour.i + 1));
    $("#tourExit").addEventListener("click", tourEnd);
    document.addEventListener("visibilitychange", () => { if (tour.i >= 0 && document.hidden && !tour.paused) tourPause(); });
  }

  // ---------- reconciliation demo (example numbers) ----------
  const RECON = [["Cement (bags)", 1240, 1240], ["Steel, TMT bars (tonnes)", 18.5, 18.5], ["Bricks (units)", 42000, 38500], ["Sand (cubic metres)", 96, 96], ["Aggregate (cubic metres)", 120, 120]];
  const num = (n) => n.toLocaleString("en-IN");
  function renderRecon() {
    $("#reconRows").innerHTML = RECON.map(([m, c, r]) => `<tr><th scope="row">${esc(m)}</th><td>${num(c)}</td><td>${num(r)}</td><td class="diff">·</td><td class="chk">·</td></tr>`).join("");
    let running = false;
    $("#reconRun").addEventListener("click", () => {
      if (running) return; running = true;
      const rows = $$("#reconRows tr");
      rows.forEach((tr) => { tr.className = ""; $(".diff", tr).textContent = "·"; $(".chk", tr).textContent = "·"; });
      $("#reconOut").textContent = "Checking…";
      const one = (k) => {
        if (k === rows.length) {
          const bad = RECON.filter(([, c, r]) => c !== r);
          $("#reconOut").innerHTML = bad.length ? `<b>${bad.length} of ${RECON.length} lines ${bad.length === 1 ? "doesn't" : "don't"} match:</b> ${bad.map(([m, c, r]) => `${esc(m.split(" (")[0])}, ${num(c - r)} more reported than recorded on site`).join("; ")}. A gap like this gets traced before anything goes to the sponsor.` : "All lines match.";
          $("#reconRun").innerHTML = `Run it again <span aria-hidden="true">→</span>`; running = false; return;
        }
        const [, c, r] = RECON[k], tr = rows[k], d = c - r;
        tr.className = "checking";
        setTimeout(() => {
          tr.className = d ? "bad" : "ok";
          $(".diff", tr).textContent = d ? (d > 0 ? "+" : "") + num(d) : "0";
          $(".chk", tr).textContent = d ? "Flag" : "Match ✓";
          one(k + 1);
        }, still ? 0 : 420);
      };
      one(0);
    });
  }

  // ---------- drag through the years ----------
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mIndex = (str) => { const m = String(str).match(/([A-Z][a-z]{2}) (\d{4})/); return m ? +m[2] * 12 + MON[m[1]] : null; };
  function scrubEvents() {
    const now = new Date(), nowI = now.getFullYear() * 12 + now.getMonth();
    const range = (when) => { const [a, b] = when.split(" · ")[0].split(" to "); return [mIndex(a), /present/i.test(b || "") ? nowI : mIndex(b || a)]; };
    const ev = [];
    const x = D.education.find((e) => /Class X$/.test(e.degree)), xii = D.education.find((e) => /Class XII/.test(e.degree)), ug = D.education[0];
    if (x) ev.push({ kind: "Milestone", title: `${x.degree} completed, ${x.score}`, org: x.school, from: mIndex(x.when), to: mIndex(x.when) + 2 });
    if (x && xii) ev.push({ kind: "Studying", title: xii.degree, org: xii.school, from: mIndex(x.when) + 1, to: mIndex(xii.when) });
    if (ug) { const [a, b] = range(ug.when); ev.push({ kind: "Degree", title: ug.degree.split(",")[0], org: ug.school.split(",")[0], from: a, to: b }); }
    D.experience.forEach((e) => { const [a, b] = range(e.when); ev.push({ kind: "Internship", title: e.role, org: firstOrg(e.org), from: a, to: b }); });
    D.leadership.forEach((l) => { const [a, b] = range(l.when); ev.push({ kind: "Leadership", title: l.role, org: l.org, from: a, to: b, open: /present/i.test(l.when) }); });
    return { ev, nowI };
  }
  function renderScrub() {
    const { ev, nowI } = scrubEvents(); if (!ev.length) { $("#scrub").hidden = true; return; }
    const lo = Math.min(...ev.map((e) => e.from)), hi = Math.max(...ev.map((e) => e.to));
    const r = $("#scrubRange"); r.min = lo; r.max = hi; r.step = 1; r.value = Math.min(nowI, hi);
    const pct = (i) => ((i - lo) / (hi - lo)) * 100;
    let years = ""; for (let y = Math.ceil(lo / 12); y * 12 <= hi; y++) years += `<span style="left:${pct(y * 12)}%">${y}</span>`;
    years += `<i class="scrub-today" style="left:${pct(nowI)}%" title="Today"></i>`;
    years += ev.filter((e) => e.kind === "Internship").map((e) => `<i class="scrub-mark" style="left:${pct(e.from)}%"></i>`).join("");
    $("#scrubYears").innerHTML = years;
    const show = () => {
      const i = +r.value, label = `${MONTHS[i % 12]} ${Math.floor(i / 12)}`;
      $("#scrubDate").textContent = label;
      r.setAttribute("aria-valuetext", label);
      r.style.setProperty("--p", pct(i) + "%");
      $("#scrubTag").textContent = i > nowI ? "Ahead" : i === nowI ? "Now" : "";
      const on = ev.filter((e) => i >= e.from && i <= e.to && !(i > nowI && e.open));
      $("#scrubList").innerHTML = on.length ? on.map((e) => `<li><span class="mono">${e.kind}</span><b>${esc(e.title)}</b><em>${esc(e.org)}</em></li>`).join("") : `<li class="none">Nothing recorded for this month.</li>`;
      if (i > nowI) $("#scrubList").insertAdjacentHTML("beforeend", `<li class="none">Still to come: more internships, and graduating in Aug 2029.</li>`);
    };
    r.addEventListener("input", show); show();
  }

  // ---------- proof wall lightbox ----------
  function openProof(i) {
    const a = D.achievements[i]; if (!a || !a.image) return;
    $("#lbImg").src = a.image; $("#lbImg").alt = `Certificate: ${a.text}`; $("#lbCap").textContent = `${a.text} (${a.year})`;
    $("#lightbox").hidden = false; $("#lightbox .share-x").focus();
  }

  // ---------- reading options: text size and contrast ----------
  function applyReading() {
    const d = document.documentElement;
    d.style.setProperty("--zoom", state.zoom || 1);
    d.dataset.contrast = state.contrast === "high" ? "high" : "std";
    $$("#zoomSeg button").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.zoom === (state.zoom || 1))));
    $$("#contrastSeg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.contrast === d.dataset.contrast)));
  }
  function wireReading() {
    const btn = $("#readBtn"), pop = $("#readPop");
    const close = () => { pop.hidden = true; btn.setAttribute("aria-expanded", "false"); };
    btn.addEventListener("click", (e) => { e.stopPropagation(); pop.hidden = !pop.hidden; btn.setAttribute("aria-expanded", String(!pop.hidden)); });
    document.addEventListener("click", (e) => { if (!pop.hidden && !e.target.closest("#readPop")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !pop.hidden) { close(); btn.focus(); } });
    $$("#zoomSeg button").forEach((b) => b.addEventListener("click", () => { state.zoom = +b.dataset.zoom; save(); applyReading(); }));
    $$("#contrastSeg button").forEach((b) => b.addEventListener("click", () => { state.contrast = b.dataset.contrast; save(); applyReading(); }));
    applyReading();
  }

  // ---------- launch: the hero comes in like a car off the line ----------
  function launch() {
    if (still) return;
    const h = $(".hero"); h.classList.remove("launch"); void h.offsetWidth; h.classList.add("launch");
  }

  // ---------- start lights, once per visit: five on, lights out, go ----------
  function intro() {
    const d = document.documentElement;
    if (!d.classList.contains("intro-on")) { launch(); return; }
    try { sessionStorage.setItem("tejith-intro", "1"); } catch (e) {}
    const lights = $$("#intro .lights span"), timers = [];
    let done = false;
    lights.forEach((l, i) => timers.push(setTimeout(() => l.classList.add("on"), 350 + i * 420)));
    const end = () => {
      if (done) return; done = true; timers.forEach(clearTimeout);
      lights.forEach((l) => l.classList.remove("on"));
      d.classList.add("intro-out"); launch();
      setTimeout(() => d.classList.remove("intro-on", "intro-out"), 650);
    };
    timers.push(setTimeout(end, 350 + 4 * 420 + 750)); // hold, then lights out
    $("#intro").addEventListener("click", end);
    addEventListener("keydown", end, { once: true });
  }

  // ---------- page change: a fast bronze streak across the screen ----------
  function wipe() {
    if (still) return;
    const w = $("#wipe"); w.classList.remove("go"); void w.offsetWidth; w.classList.add("go");
  }

  // ---------- boot ----------
  applyTheme(state.theme);
  $("#year").textContent = new Date().getFullYear();
  renderDisciplines(); renderSections(); renderProgress(); renderAvail(); renderMap(); renderFaq(); renderExtras(); renderResume(); renderHeroExtras(); renderAsk(); geoBadge(); renderRecon(); renderScrub(); wireSources(); renderBuilding(); renderRefReq(); renderPit(); renderEndorse(); renderPosts(); renderSlots(); renderGuestbook(); wireTour(); wireReading(); intro(); revLights(); gauge(); pitBoards(); tilt(); renderContact(); wireShare(); renderThinking(); renderBaf(); docsActions(); voice(); signature(); season(); carDraw();
  clock(); motion(); countUps(); scrollStory(); mapReveal(); views(); reveal();

  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]"); if (go) setView(go.dataset.go, true, true);
    const cs = e.target.closest("[data-case]"); if (cs) openCase(cs.dataset.case);
    if (e.target.closest("[data-close-case]")) closeCase();
    if (e.target.closest("[data-hr]")) copyHR();
    if (e.target.closest("[data-print]")) window.print();
    if (e.target.closest("[data-share]")) openShare();
    if (e.target.closest("[data-vcard]")) vcard();
    if (e.target.closest("[data-onepager]")) onePager();
    if (e.target.closest("[data-close-share]")) closeShare();
    if (e.target.closest("[data-cite]")) openCite();
    const pf = e.target.closest("[data-proof]"); if (pf) openProof(+pf.dataset.proof);
    if (e.target.closest("[data-close-lb]")) $("#lightbox").hidden = true;
    if (e.target.closest("[data-close-cite]")) $("#cite").hidden = true;
  });
  window.addEventListener("keydown", (e) => {
    if (!$("#share").hidden && e.key === "Escape") return closeShare();
    if (!$("#cite").hidden && e.key === "Escape") { $("#cite").hidden = true; return; }
    if (!$("#lightbox").hidden && e.key === "Escape") { $("#lightbox").hidden = true; return; }
    if (tour.i >= 0 && e.key === "Escape") return tourEnd();
    if (tour.i >= 0 && e.key === "ArrowRight" && !e.target.closest("input, textarea")) return tourGo(tour.i + 1);
    if ($("#reader").hidden) return;
    if (e.key === "Escape") return closeCase();
    if (e.key === "Tab") {
      const f = $$(".reader-panel button, .reader-panel a[href]"); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  $(".logo").addEventListener("click", (e) => { if (view !== "story") { e.preventDefault(); location.hash = "#home"; setView("story", true, true); } });
  $("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: still ? "auto" : "smooth" }));
  $("#citeCopy").addEventListener("click", async () => { try { await navigator.clipboard.writeText($("#citeText").textContent); toast("Citation copied ✓"); } catch (e) {} });
  addEventListener("hashchange", () => route(true));
  $("#themeBtn").addEventListener("click", () => { state.theme = state.theme === "dark" ? "light" : "dark"; save(); applyTheme(state.theme); });
  $("#copyEmail").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(D.profile.email); toast("Email copied ✓"); } catch (err) { location.href = "mailto:" + D.profile.email; }
  });
  window.addEventListener("scroll", onScroll, { passive: true });

  if (new URLSearchParams(location.search).get("view") === "resume") setView("resume", false); else route(false, true);
})();
