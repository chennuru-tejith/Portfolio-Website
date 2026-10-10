// ============================================================
//  Chennuru Tejith — professional portfolio
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
    const tc = $('meta[name="theme-color"]'); if (tc) tc.content = t === "dark" ? "#0a1220" : "#f4efe6";
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
    if (push) { const u = new URL(location.href); v === "resume" ? u.searchParams.set("view", "resume") : u.searchParams.delete("view"); u.hash = ""; history.replaceState(null, "", u); }
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
        <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f7fb"/><stop offset=".45" stop-color="#b9c4d6"/><stop offset=".7" stop-color="#eef2f8"/><stop offset="1" stop-color="#8e9bb2"/></linearGradient>
        <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g.color}"/><stop offset="1" style="stop-color:color-mix(in srgb, ${g.color} 55%, #0a1a33)"/></linearGradient>
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
    return lo === hi ? String(lo) : `${lo}–${hi}`;
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
        <div class="referee">${I("star", 16)}${g.referee ? `<span>Referee: <b>${esc(g.referee.name)}</b>, ${esc(g.referee.role)}${g.referee.link ? ` · <a href="${esc(g.referee.link)}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : ""}</span>` : `<span>Referee details shared on request.</span>`}</div>
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
    $("#stats").innerHTML = D.profile.stats.map((s) => `<div class="metric" tabindex="0"><b data-v="${esc(s.value)}">${esc(s.value)}</b><span>${esc(s.label)}</span>${s.story ? `<span class="story">${esc(s.story)}</span>` : ""}</div>`).join("");
    $("#principleList").innerHTML = D.principles.map((p, i) => `
      <article class="principle rv"><span class="pr-no">${pad(i + 1)}</span><h3>${esc(p.title)}</h3><p class="pr-text">${esc(p.text)}</p>
      <span class="pr-where">${esc(p.where)}</span></article>`).join("");
    const q = D.profile.quote;
    if (q) { $("#quoteText").innerHTML = esc(q.text).replace(/\*([^*]+)\*/g, "<em>$1</em>"); $("#quoteBy").textContent = "— " + q.by; } else $(".pq").hidden = true;

    const items = [...D.experience.map((e) => ({ ...e, tag: "Internship" })), ...D.leadership.map((l) => ({ ...l, points: pointsFor(l.role), tag: "Leadership", lead: true }))].sort((a, b) => startOf(b.when) - startOf(a.when));
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
    $("#honourList").innerHTML = D.achievements.map((a, i) => `<li class="honour rv ft" data-tags="${esc(((D.achievementTags || [])[i] || []).join(" "))}"><b>${esc(a.year)}</b><p>${esc(a.text)}</p></li>`).join("");
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
        ${w.status ? `<span class="paper-status">${esc(w.status)}</span>${geoTrack()}` : `<span class="paper-venue">${esc(w.venue)}${w.url ? " ↗" : ""}</span>`}`;
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
      $("#refList").innerHTML = `<div class="empty rv"><span class="empty-ic">${I("star", 24)}</span><div><h3>Recommendations will appear here.</h3>
        <p>Words from the professors and supervisors I've worked with, published only with their permission and linked to their profiles.</p></div></div>${cta}`;
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
    if (view !== "story") return;
    let on = "";
    ["disciplines", "journey", "experience", "projects", "qa", "references"].forEach((id) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * 0.4) on = id; });
    $$(".nav-links a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + on));
  }


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
      `${p.name} — ${D.programme ? D.programme.name : "BBA + MBA"}, O.P. Jindal Global University (graduating Aug 2029)`,
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
      <h2 id="caseTitle">${esc(e.org.split(" — ")[0])}</h2>
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

  // ---------- custom cursor (desktop, motion allowed) ----------
  function cursor() {
    if (still || !matchMedia("(pointer: fine)").matches) return;
    const c = $("#cursor"); let x = -100, y = -100, cx = -100, cy = -100, raf = 0, shown = false;
    c.style.transform = "translate3d(-100px, -100px, 0)";
    const loop = () => {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      c.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; cx = x; cy = y; document.body.classList.add("has-cursor"); }
      c.classList.toggle("big", !!(e.target && e.target.closest && e.target.closest("a, button, summary, [role=button], .dt")));
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    document.addEventListener("pointerleave", () => (c.style.opacity = "0"));
    document.addEventListener("pointerenter", () => (c.style.opacity = ""));
  }


  // ---------- rotating "Someone who …" line ----------
  function rotate() {
    const list = D.roles || [], el = $("#rot"); if (!el || !list.length) return;
    el.innerHTML = `<span>${esc(list[0])}</span>`;
    if (still || list.length < 2) return;
    let i = 0;
    setInterval(() => {
      if (document.hidden) return;
      i = (i + 1) % list.length;
      const old = el.firstElementChild, nx = document.createElement("span");
      nx.textContent = list[i]; nx.className = "in";
      old.className = "out"; el.appendChild(nx);
      setTimeout(() => old.remove(), 700);
    }, 2600);
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
    rotate();
    const h = new Date().getHours();
    const g = h < 5 ? "Up late? Welcome." : h < 12 ? "Good morning, and welcome." : h < 17 ? "Good afternoon, and welcome." : h < 22 ? "Good evening, and welcome." : "Up late? Welcome.";
    $("#greet").textContent = g;
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
    const run = (el) => {
      const raw = el.dataset.v, m = raw.match(/^([^\d]*)([\d.]+)(.*)$/); if (!m) return;
      const [, pre, num, post] = m, target = parseFloat(num), dec = (num.split(".")[1] || "").length, t0 = performance.now(), dur = 1500;
      const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = pre + (target * e).toFixed(dec) + post; if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    if (still) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: 0.6 });
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
    D.experience.forEach((e) => e.points.forEach((t) => c.push({ src: e.org.split(" — ")[0], t })));
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
  function ask(q) {
    corpus = corpus || buildCorpus();
    const words = q.toLowerCase().replace(/[^\p{L}\p{N}₹\s]/gu, " ").split(/\s+/).filter((w) => w.length > 2 && !["has", "the", "and", "for", "him", "his", "does", "did", "can", "what", "with", "any", "how", "who", "skills"].includes(w));
    const keys = new Set();
    words.forEach((w) => { keys.add(w.slice(0, 5)); Object.values(SYN).forEach((list) => { if (list.some((k) => w.startsWith(k.slice(0, 4)) || k.startsWith(w.slice(0, 4)))) list.forEach((k) => keys.add(k)); }); });
    const hits = corpus.map((d) => { const low = d.t.toLowerCase(); let sc = 0; keys.forEach((k) => { if (low.includes(k)) sc++; }); return { ...d, sc }; }).filter((d) => d.sc > 0).sort((a, b) => b.sc - a.sc).slice(0, 3);
    const out = $("#askOut");
    if (!words.length) { out.innerHTML = ""; return; }
    if (!hits.length) { out.innerHTML = `<p class="ask-none">Nothing on that yet. Try one of the suggestions, or ask Tejith directly below.</p>`; return; }
    const mark = (t) => { let h = esc(t); [...keys].filter((k) => k.length > 3).forEach((k) => { h = h.replace(new RegExp("(" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\p{L}]*)", "giu"), "<mark>$1</mark>"); }); return h; };
    out.innerHTML = hits.map((h, i) => `<div class="ask-hit" style="animation-delay:${i * 0.08}s"><span class="mono">${esc(h.src)}</span><p>${mark(h.t)}</p></div>`).join("");
  }
  function renderAsk() {
    const chips = ["Has he handled budgets?", "Can he lead a team?", "When is he available?", "Has he built anything?", "Data and reporting?", "Which languages?"];
    $("#askChips").innerHTML = chips.map((c) => `<button type="button">${esc(c)}</button>`).join("");
    $$("#askChips button").forEach((b) => b.addEventListener("click", () => { $("#askInput").value = b.textContent; ask(b.textContent); }));
    $("#askBtn").addEventListener("click", () => ask($("#askInput").value));
    $("#askInput").addEventListener("keydown", (e) => { if (e.key === "Enter") ask(e.target.value); });
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
      location.href = `mailto:${D.profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    });
    $("#bookCall").addEventListener("click", () => {
      if (D.bookingUrl) { window.open(D.bookingUrl, "_blank", "noopener,noreferrer"); return; }
      const text = ["Hi Tejith,", "", "Could we set up a 15-minute call?", "Times that work for me (with time zone):", "", "Best,"].join("\n");
      location.href = `mailto:${D.profile.email}?subject=${encodeURIComponent("Request: 15-minute call")}&body=${encodeURIComponent(text)}`;
    });
  }

  // ---------- "Hiring? Let's talk" tab after 60% of the page ----------
  function hireTab() {
    const tab = $("#hire"); let contactVis = false;
    new IntersectionObserver(([e]) => { contactVis = e.isIntersecting; upd(); }).observe($("#contact"));
    const upd = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      tab.hidden = !(view === "story" && max > 0 && scrollY / max > 0.6 && !contactVis);
    };
    addEventListener("scroll", upd, { passive: true });
    tab.addEventListener("click", () => $("#contact").scrollIntoView({ behavior: still ? "auto" : "smooth" }));
  }

  // ---------- hidden details ----------
  function hiddenDetails() {
    const list = D.details || []; if (!list.length) return;
    const seen = new Set(), pill = $("#found");
    const show = () => {
      pill.innerHTML = seen.size === list.length ? `All <b>${list.length}</b> details found ✓` : `Details found <b>${seen.size}</b> / ${list.length}`;
      pill.hidden = false;
      if (seen.size === list.length) setTimeout(() => (pill.hidden = true), 4000);
    };
    list.forEach((d, i) => {
      const walker = document.createTreeWalker($("#story"), NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.parentElement.closest("script, style, svg, .detail, button, input, textarea, .tip") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
      let n;
      while ((n = walker.nextNode())) {
        const at = n.textContent.indexOf(d.word);
        if (at < 0) continue;
        const after = n.splitText(at); after.splitText(d.word.length);
        const span = document.createElement("span");
        span.className = "detail"; span.tabIndex = 0; span.textContent = d.word;
        span.innerHTML += `<span class="tip" role="tooltip">${esc(d.fact)}</span>`;
        after.replaceWith(span);
        const hit = () => { if (!seen.has(i)) { seen.add(i); span.classList.add("seen"); show(); } };
        span.addEventListener("mouseenter", hit); span.addEventListener("focus", hit);
        break;
      }
    });
  }

  // ---------- share card with QR ----------
  const shareUrl = () => location.origin + location.pathname;
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
    x.fillStyle = "#0a1220"; x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(169,189,240,.25)"; x.strokeRect(40, 40, W - 80, H - 80);
    x.fillStyle = "#d69c77"; x.fillRect(100, 140, 90, 3);
    x.fillStyle = "#f1ece3"; x.font = "400 110px 'Instrument Serif', Georgia, serif"; x.fillText(D.profile.name.split(" ")[0], 96, 330); x.fillText(D.profile.name.split(" ").slice(1).join(" "), 96, 450);
    x.fillStyle = "#a9bdf0"; x.font = "italic 400 52px 'Instrument Serif', Georgia, serif"; x.fillText("Finance · Operations · Leadership", 100, 560);
    x.fillStyle = "#8c95a8"; x.font = "400 30px 'Geist', sans-serif"; x.fillText("BBA + MBA, O.P. Jindal Global University", 100, 640); x.fillText(D.profile.email, 100, 690);
    const n = qr.getModuleCount(), size = 380, cell = size / n, ox = W - 100 - size, oy = H - 100 - size;
    x.fillStyle = "#f1ece3"; x.fillRect(ox - 20, oy - 20, size + 40, size + 40);
    x.fillStyle = "#0a1220";
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (qr.isDark(r, k)) x.fillRect(ox + k * cell, oy + r * cell, Math.ceil(cell), Math.ceil(cell));
    x.fillStyle = "#8c95a8"; x.font = "400 26px 'Geist Mono', monospace"; x.fillText("SCAN TO VIEW PORTFOLIO", 100, H - 110);
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


  // ---------- GEO paper progress ----------
  function geoTrack() {
    const stages = ["Research", "Draft", "Review", "Published"], at = stages.indexOf(D.geoStage);
    if (at < 0) return "";
    return `<div class="geo" aria-label="Stage: ${esc(D.geoStage)}">${stages.map((st, i) => `<span class="${i < at ? "done" : i === at ? "now" : ""}">${st}</span>`).join("")}</div>`;
  }

  // ---------- interface sounds (off by default) ----------
  let actx = null;
  function click() {
    if (!state.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
      o.type = "sine"; o.frequency.setValueAtTime(880, t); o.frequency.exponentialRampToValueAtTime(520, t + 0.06);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + 0.1);
    } catch (e) {}
  }
  function soundToggle() {
    const b = $("#soundBtn");
    const paint = () => { b.innerHTML = state.sound ? "♪" : "<span style='opacity:.55'>♪</span>"; b.setAttribute("aria-pressed", !!state.sound); b.setAttribute("aria-label", state.sound ? "Turn interface sounds off" : "Turn interface sounds on"); };
    paint();
    b.addEventListener("click", () => { state.sound = !state.sound; save(); paint(); click(); });
    document.addEventListener("click", (e) => { if (e.target.closest("a, button, summary") && !e.target.closest("#soundBtn")) click(); });
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
    const g = $("#greet"); g.innerHTML = `<span class="season">${esc(s.greeting)}.</span> ${esc(g.textContent)}`;
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
      <p>BBA + MBA, O.P. Jindal Global University (2024–2029), CGPA 7.9 / 8. ${esc(p.email)} · ${esc(p.linkedin)}</p>
      <h2>Three reasons</h2><ul>${D.principles.slice(0, 3).map((x) => `<li><b>${esc(x.title)}.</b> ${esc(x.proof)}</li>`).join("")}</ul>
      <h2>Experience</h2><ul>${D.experience.map((e) => `<li><b>${esc(e.role)}</b>, ${esc(e.org.split(" — ")[0])} (${esc(e.when.split(" · ")[0])}): ${esc(e.points[0])}</li>`).join("")}</ul>
      <h2>Leadership</h2><ul>${D.leadership.slice(0, 3).map((l) => `<li>${esc(l.role)}, ${esc(l.org)}</li>`).join("")}</ul>
      ${a.windows ? `<h2>Availability</h2><p>${esc(a.windows.join(" & "))} · ${esc(a.type)} · ${esc(a.locations)} · ${esc(a.roles.join(", "))}</p>` : ""}
      <h2>Portfolio</h2><p>${esc(location.origin + location.pathname)}</p>`;
    document.body.classList.add("print-one");
    const done = () => { document.body.classList.remove("print-one"); removeEventListener("afterprint", done); };
    addEventListener("afterprint", done);
    window.print();
  }

  // ---------- footer badge case (one badge per arena) ----------
  function badgeCase() {
    $("#badgecase").innerHTML = G.map((g) => emblem(g)).join("") + `<em>${G.length} arenas · ${G.length} badges</em>`;
  }

  // ---------- race car draws itself ----------
  function carDraw() {
    const car = $(".car"); if (!car) return;
    if (still) { car.classList.add("drawn"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { car.classList.add("drawn"); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(car);
  }

  // ---------- boot ----------
  applyTheme(state.theme);
  $("#year").textContent = new Date().getFullYear();
  renderDisciplines(); renderSections(); renderProgress(); renderAvail(); renderMap(); renderFaq(); renderExtras(); renderResume(); renderHeroExtras(); renderAsk(); renderContact(); wireShare(); renderThinking(); badgeCase(); docsActions(); soundToggle(); voice(); signature(); season(); carDraw();
  clock(); cursor(); motion(); countUps(); scrollStory(); mapReveal(); hireTab(); hiddenDetails(); views(); reveal();

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
  });
  window.addEventListener("keydown", (e) => {
    if (!$("#share").hidden && e.key === "Escape") return closeShare();
    if ($("#reader").hidden) return;
    if (e.key === "Escape") return closeCase();
    if (e.key === "Tab") {
      const f = $$(".reader-panel button, .reader-panel a[href]"); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  $(".logo").addEventListener("click", (e) => { if (view !== "story") { e.preventDefault(); setView("story", true, true); } });
  $("#themeBtn").addEventListener("click", () => { state.theme = state.theme === "dark" ? "light" : "dark"; save(); applyTheme(state.theme); });
  $("#copyEmail").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(D.profile.email); toast("Email copied ✓"); } catch (err) { location.href = "mailto:" + D.profile.email; }
  });
  window.addEventListener("scroll", onScroll, { passive: true });

  setView(new URLSearchParams(location.search).get("view") === "resume" ? "resume" : "story", false);
})();
