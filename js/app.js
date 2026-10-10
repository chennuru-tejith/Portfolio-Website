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
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- saved preferences ----------
  const KEY = "tejith-pro-v1";
  const state = Object.assign({ theme: "dark" }, (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })());
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
    const tc = $('meta[name="theme-color"]'); if (tc) tc.content = t === "dark" ? "#0b1424" : "#f6f3ee";
  }

  // ---------- views ----------
  let view = "story";
  function setView(v, push = true) {
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
    $("#stats").innerHTML = D.profile.stats.map((s) => `<div class="metric"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("");
    $("#principleList").innerHTML = D.principles.map((p, i) => `
      <article class="principle rv"><span class="pr-no">${pad(i + 1)}</span><h3>${esc(p.title)}</h3><p class="pr-text">${esc(p.text)}</p>
      <div class="pr-proof"><b>Proof</b><p>${esc(p.proof)}</p><span class="pr-where">${esc(p.where)}</span></div></article>`).join("");
    const q = D.profile.quote;
    if (q) { $("#quoteText").innerHTML = esc(q.text).replace(/\*([^*]+)\*/g, "<em>$1</em>"); $("#quoteBy").textContent = "— " + q.by; } else $("#quote").hidden = true;

    const items = [...D.experience.map((e) => ({ ...e, tag: "Internship" })), ...D.leadership.map((l) => ({ ...l, points: pointsFor(l.role), tag: "Leadership", lead: true }))].sort((a, b) => startOf(b.when) - startOf(a.when));
    $("#journeyList").innerHTML = items.map((s) => `
      <article class="step rv ft ${s.lead ? "lead" : ""}" data-tags="${esc((TAGS[s.role] || []).join(" "))}"><div><div class="step-when">${esc(s.when.split(" · ")[0])}</div><span class="step-tag">${s.tag}</span></div>
      <div><h3>${esc(s.role)}</h3><p class="step-org">${esc(s.org)}</p>${s.points.length ? `<ul>${s.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
      ${!s.lead && OUT[s.role] ? `<div class="ba"><div class="b"><b>Before</b>${esc(OUT[s.role].before)}</div><div class="arr" aria-hidden="true">→</div><div class="a"><b>After</b>${esc(OUT[s.role].after)}</div></div>` : ""}</div></article>`).join("");

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
      D.certifications.map((c) => `<div class="edu"><strong>${esc(c.name)}</strong><span>${esc(c.issuer)}</span><em>Certification</em></div>`).join("");
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
    box.innerHTML = items.filter((w) => filter === "All" || w.kind === filter).map((w) => `
      <a class="paper" href="${esc(w.url)}" target="_blank" rel="noopener noreferrer"><div class="paper-top"><span>${esc(w.kind)}</span><span>${esc(w.date)}</span></div>
      <h3>${esc(w.title)}</h3><p>${esc(w.summary)}</p><span class="paper-venue">${esc(w.venue)} ↗</span></a>`).join("");
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
        <div class="r-actions"><a class="btn btn-primary btn-sm" href="${esc(p.cv)}" download>Download PDF</a><a class="btn btn-ghost btn-sm" href="mailto:${esc(p.email)}">Email</a></div></header>
      <section class="r-sec"><h2>Summary</h2><p>${esc(p.summary)}</p></section>
      <section class="r-sec"><h2>Experience</h2><div>${D.experience.map((e) => `<div class="r-item"><h3>${esc(e.role)}</h3><div class="r-sub"><span>${esc(e.org)}</span><span>${esc(e.when)}</span></div><ul>${e.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div></section>
      <section class="r-sec"><h2>Leadership</h2><div>${D.leadership.map((l) => `<div class="r-item"><h3>${esc(l.role)}</h3><div class="r-sub"><span>${esc(l.org)}</span><span>${esc(l.when)}</span></div></div>`).join("")}</div></section>
      <section class="r-sec"><h2>Education</h2><div>${D.education.map((e) => `<div class="r-item"><h3>${esc(e.degree)}</h3><div class="r-sub"><span>${esc(e.school)}</span><span>${esc(e.when)} · ${esc(e.score)}</span></div></div>`).join("")}</div></section>
      <section class="r-sec"><h2>Skills</h2><div class="r-skills">${D.skills.map((s) => `<div><b>${esc(s.group)}:</b> ${esc(s.items.join(", "))}</div>`).join("")}<div><b>Languages:</b> ${esc(p.languages.join(", "))}</div><div><b>Certification:</b> ${esc(D.certifications.map((c) => `${c.name} (${c.issuer})`).join(", "))}</div></div></section>
      <section class="r-sec"><h2>Projects</h2><div>${D.projects.map((x) => `<div class="r-item"><h3><a href="${esc(x.live || x.repo)}" target="_blank" rel="noopener noreferrer">${esc(x.name)}</a></h3><div class="r-sub"><span>${esc(x.blurb)}</span></div></div>`).join("")}</div></section>
      ${D.writing.length ? `<section class="r-sec"><h2>Writing</h2><div>${D.writing.map((w) => `<div class="r-item"><h3><a href="${esc(w.url)}" target="_blank" rel="noopener noreferrer">${esc(w.title)}</a></h3><div class="r-sub"><span>${esc(w.kind)} · ${esc(w.venue)}</span><span>${esc(w.date)}</span></div></div>`).join("")}</div></section>` : ""}
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
        <text x="-16" y="5" text-anchor="end">${esc(p.city)}</text><text class="st" x="-16" y="21" text-anchor="end">${esc(p.state)}</text></g>`;
    });
    svg.innerHTML = s;
    const pick = (i) => {
      $$("#map .pin").forEach((g) => g.classList.toggle("on", +g.dataset.i === i));
      const p = places[i];
      $("#mapSide").innerHTML = `<div class="city-tabs" role="tablist">${places.map((q, k) => `<button role="tab" aria-selected="${k === i}" data-i="${k}">${esc(q.city)}</button>`).join("")}</div>
        <div class="city"><h3>${esc(p.city)}</h3><p>${esc(p.state)}, India</p><ul>${p.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>`;
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

  // ---------- skill filter (highlights matching work across the page) ----------
  let filter = "all";
  function renderFilter() {
    const bar = $("#filterbar");
    $("#fbBtns").innerHTML = `<button aria-pressed="true" data-f="all">All</button>` + G.map((g) => `<button aria-pressed="false" data-f="${g.id}" style="--c:${g.color}"><i></i>${esc(SHORT[g.id] || g.domain)}</button>`).join("");
    $$("#fbBtns button").forEach((b) => b.addEventListener("click", () => setFilter(b.dataset.f)));
    new IntersectionObserver(([e]) => { bar.hidden = e.isIntersecting || view !== "story"; }, { rootMargin: "0px 0px -40% 0px" }).observe($(".hero"));
  }
  function setFilter(id) {
    filter = filter === id ? "all" : id;
    $$("#fbBtns button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.f === filter));
    const on = filter !== "all";
    document.body.classList.toggle("filtering", on);
    const g = G.find((x) => x.id === filter);
    let n = 0;
    $$(".ft").forEach((el) => {
      const m = on && (el.dataset.tags || "").split(" ").includes(filter);
      el.classList.toggle("match", m); if (m) n++;
      el.style.setProperty("--fc", g ? g.color : "transparent");
    });
    if (on) { showDisc(G.indexOf(g)); toast(`${n} items highlighted for ${SHORT[filter]}`); }
  }

  // ---------- motion: hero card tilt, paused off-screen ----------
  function motion() {
    const hero = $(".hero");
    new IntersectionObserver(([e]) => hero.classList.toggle("off", !e.isIntersecting)).observe(hero);
    if (still || !matchMedia("(pointer: fine)").matches) return;
    const vis = $("#heroVisual"), file = $(".file", vis);
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
    if (view !== "story") return;
    let on = "";
    ["disciplines", "journey", "experience", "projects", "qa", "references"].forEach((id) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * 0.4) on = id; });
    $$(".nav-links a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + on));
  }

  // ---------- boot ----------
  applyTheme(state.theme);
  $("#year").textContent = new Date().getFullYear();
  renderDisciplines(); renderSections(); renderProgress(); renderAvail(); renderAbilities(); renderMap(); renderFaq(); renderFilter(); renderResume(); motion(); reveal();

  document.addEventListener("click", (e) => { const go = e.target.closest("[data-go]"); if (go) setView(go.dataset.go); });
  $(".logo").addEventListener("click", (e) => { if (view !== "story") { e.preventDefault(); setView("story"); } });
  $("#themeBtn").addEventListener("click", () => { state.theme = state.theme === "dark" ? "light" : "dark"; save(); applyTheme(state.theme); });
  $("#copyEmail").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(D.profile.email); toast("Email copied ✓"); } catch (err) { location.href = "mailto:" + D.profile.email; }
  });
  window.addEventListener("scroll", onScroll, { passive: true });

  setView(new URLSearchParams(location.search).get("view") === "resume" ? "resume" : "story", false);
})();
