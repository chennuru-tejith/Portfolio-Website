// ============================================================
//  Tejith Island — app logic
// ============================================================
(function () {
  const D = window.PORTFOLIO, I = window.ICONS, ISL = window.ISLAND;
  const G = D.gyms;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ss = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };

  // ---------- saved state ----------
  const KEY = "tejith-island-v1";
  const state = Object.assign({ stamps: [], theme: "day", best: null },
    (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })());
  state.stamps = Array.isArray(state.stamps) ? [...new Set(state.stamps)].filter((id) => G.some((g) => g.id === id)) : [];
  if (state.theme !== "day" && state.theme !== "night") state.theme = "day";
  if (typeof state.best !== "number") state.best = null;
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };
  const has = (id) => state.stamps.includes(id);

  // island place names + icons for each gym / location
  const PLACE = {
    ledger: { name: "Ledger Vault", icon: "coin" },
    blueprint: { name: "Blueprint Site", icon: "blueprint" },
    summit: { name: "Summit Peak", icon: "crown" },
    signal: { name: "Signal Tower", icon: "signal" },
    circuit: { name: "Circuit Lab", icon: "chip" },
    library: { name: "Library", icon: "scroll", target: "#writing", note: "Research & writing" },
    hall: { name: "Town Hall", icon: "pillar", target: "#references", note: "Recommendations" },
    lighthouse: { name: "Lighthouse", icon: "tower", target: "#contact", note: "Get in touch" },
  };
  const gymIndex = (id) => G.findIndex((g) => g.id === id);

  // ---------- helpers ----------
  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false;
    t.style.animation = "none"; void t.offsetWidth; t.style.animation = "";
    clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 3000);
  }
  const fmt = (ms) => { const s = ms / 1000, m = Math.floor(s / 60); return `${m}:${(s % 60).toFixed(1).padStart(4, "0")}`; };
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    $("#themeBtn").innerHTML = I(t === "night" ? "sun" : "moon", 18);
    $("#themeBtn").setAttribute("aria-label", t === "night" ? "Switch to day" : "Switch to night");
    const tc = $('meta[name="theme-color"]'); if (tc) tc.content = t === "night" ? "#030a20" : "#7cc4ff";
  }

  // ---------- views ----------
  let view = "story";
  let heroOn = true;
  function setView(v, push = true) {
    view = v;
    $("#story").hidden = v !== "story"; $("#resume").hidden = v !== "resume";
    document.body.classList.toggle("resume-mode", v === "resume");
    $("#segStory").setAttribute("aria-selected", v === "story"); $("#segRes").setAttribute("aria-selected", v === "resume");
    if (push) { const u = new URL(location.href); v === "resume" ? u.searchParams.set("view", "resume") : u.searchParams.delete("view"); u.hash = ""; history.replaceState(null, "", u); }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (still) return;
    v === "story" && heroOn && $("#lights").hidden && ss.get("lightsSeen") ? ISL.go() : ISL.stop();
  }

  // ---------- island ----------
  let anchors = {};
  function buildIsland() {
    ISL.build($("#scene"));
    anchors = ISL.anchors();
    $("#pins").innerHTML = Object.entries(PLACE).map(([id, p]) => {
      const a = anchors[id], g = G[gymIndex(id)];
      return `<button class="pin ${g ? "" : "place"} ${has(id) ? "stamped" : ""}" data-id="${id}" style="left:${a.x.toFixed(2)}%;top:${a.y.toFixed(2)}%;${g ? `--c:${g.color}` : ""}" aria-label="${esc(p.name)}: ${esc(g ? g.domain : p.note)}">
        <span class="pin-dot">${has(id) ? I("check", 14) : I(p.icon, 14)}</span>${esc(p.name)}</button>`;
    }).join("");
    const me = anchors.me;
    Object.assign($("#bubble").style, { left: me.x + "%", top: me.y + "%" });
    const go = (id) => (PLACE[id].target ? jump(PLACE[id].target) : openGym(gymIndex(id)));
    $$("#pins .pin").forEach((b) => {
      b.addEventListener("click", () => go(b.dataset.id));
      b.addEventListener("pointerenter", () => hl(b.dataset.id, true));
      b.addEventListener("pointerleave", () => hl(b.dataset.id, false));
    });
    $$("#scene .bld").forEach((g) => {
      g.addEventListener("click", () => go(g.dataset.id));
      g.addEventListener("pointerenter", () => hl(g.dataset.id, true));
      g.addEventListener("pointerleave", () => hl(g.dataset.id, false));
    });
    const car = $("#car");
    if (car) { car.style.cursor = "pointer"; car.addEventListener("click", drs); }
  }
  function hl(id, on) {
    $(`#scene .bld[data-id="${id}"]`)?.classList.toggle("hl", on);
    $(`#pins .pin[data-id="${id}"]`)?.classList.toggle("hl", on);
  }
  function jump(sel) { $(sel)?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" }); }
  let drsT;
  function drs() { if (still) return; ISL.boost(true); toast("DRS open! 🏎️💨"); clearTimeout(drsT); drsT = setTimeout(() => ISL.boost(false), 3000); }

  // harbour greeting in Tejith's four languages
  function greet() {
    const list = D.profile.greetings || ["Hi there!"], el = $("#bubbleText");
    el.textContent = list[0];
    if (still || list.length < 2) return;
    let i = 0;
    setInterval(() => {
      if (!heroOn || document.hidden || view !== "story") return;
      el.classList.add("out");
      setTimeout(() => { i = (i + 1) % list.length; el.textContent = list[i]; el.classList.remove("out"); }, 300);
    }, 2600);
  }
  function stars() {
    let s = "";
    for (let i = 0; i < 46; i++) s += `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 100).toFixed(1)}%;animation-delay:${(Math.random() * 3).toFixed(1)}s"></i>`;
    $(".stars").innerHTML = s;
  }

  // ---------- Trainer Pass + lap timer ----------
  let lapTimer = 0;
  function renderPass() {
    $("#stamps").innerHTML = G.map((g) => `<span class="stamp ${has(g.id) ? "on" : ""}" style="--c:${g.color}" title="${esc(PLACE[g.id].name)}${has(g.id) ? " · stamped" : ""}">${I(PLACE[g.id].icon, 18)}</span>`).join("");
    $("#guide").innerHTML = Object.entries(PLACE).map(([id, p]) => {
      const g = G[gymIndex(id)];
      return `<button class="g-card ${has(id) ? "stamped" : ""}" data-id="${id}" style="${g ? `--c:${g.color}` : "--c:#5f7391"}">
        <span class="g-ic">${I(p.icon, 20)}</span><span><b>${esc(p.name)}</b><small>${g ? (has(id) ? "Stamped ✓" : esc(g.domain)) : esc(p.note)}</small></span></button>`;
    }).join("");
    $$("#guide .g-card").forEach((b) => b.addEventListener("click", () => (PLACE[b.dataset.id].target ? jump(PLACE[b.dataset.id].target) : openGym(gymIndex(b.dataset.id)))));
    $$("#pins .pin").forEach((p) => {
      const id = p.dataset.id; if (gymIndex(id) < 0) return;
      p.classList.toggle("stamped", has(id));
      p.querySelector(".pin-dot").innerHTML = has(id) ? I("check", 14) : I(PLACE[id].icon, 14);
    });
    tickLap();
  }
  function tickLap() {
    const el = $("#lap"), st = +ss.get("lapStart") || 0, done = +ss.get("lapDone") || 0;
    clearInterval(lapTimer);
    if (done) { el.textContent = fmt(done); el.classList.toggle("best", state.best === done); return; }
    if (!st) { el.textContent = state.best ? `Best ${fmt(state.best)}` : "0:00.0"; el.classList.toggle("best", !!state.best); return; }
    el.classList.remove("best");
    const draw = () => (el.textContent = fmt(Date.now() - st));
    draw(); lapTimer = setInterval(draw, 100);
  }
  function stamp(id) {
    if (has(id)) return false;
    if (!ss.get("lapStart") || ss.get("lapDone")) { ss.set("lapStart", String(Date.now())); ss.set("lapDone", ""); }
    state.stamps.push(id);
    const total = state.stamps.length;
    if (total === G.length) {
      const t = Date.now() - (+ss.get("lapStart") || Date.now());
      ss.set("lapDone", String(t));
      if (!state.best || t < state.best) state.best = t;
    }
    save(); renderPass();
    toast(total === G.length ? "🏁 All five stamps collected!" : `Stamp collected: ${PLACE[id].name} (${total}/${G.length})`);
    return true;
  }

  // ---------- gym sheet ----------
  let cur = -1, lastFocus = null;
  function zoomTo(id) {
    const w = $("#world");
    if (still || innerWidth < 1121 || !id) { w.style.transform = ""; return; }
    const a = anchors[id], r = w.getBoundingClientRect();
    const dx = r.width * (0.3 - a.x / 100), dy = r.height * (0.55 - a.y / 100);
    w.style.transformOrigin = `${a.x}% ${a.y}%`;
    w.style.transform = `translate(${dx.toFixed(0)}px, ${dy.toFixed(0)}px) scale(1.55)`;
  }
  function openSheet(html) {
    $("#sheetBody").innerHTML = html;
    const wrap = $("#sheet");
    if (wrap.hidden) { lastFocus = document.activeElement; wrap.hidden = false; document.body.classList.add("noscroll"); }
    $(".sheet").scrollTop = 0; $(".sheet-x").focus();
  }
  function closeSheet() {
    const wrap = $("#sheet"); if (wrap.hidden) return;
    const was = cur; wrap.hidden = true; cur = -1; document.body.classList.remove("noscroll"); zoomTo(null);
    const target = lastFocus && document.contains(lastFocus) ? lastFocus : (G[was] ? $(`#pins .pin[data-id="${G[was].id}"]`) : null);
    if (target && target.focus) target.focus({ preventScroll: true });
    if (ss.get("lapDone") && !ss.get("finishShown")) { ss.set("finishShown", "1"); setTimeout(finish, 350); }
  }
  function openGym(i) {
    if (i < 0) return;
    cur = i;
    const g = G[i], p = PLACE[g.id];
    if (view !== "story") setView("story");
    if (window.scrollY > 200) window.scrollTo({ top: 0, behavior: "instant" });
    zoomTo(g.id);
    const fresh = stamp(g.id);
    const projects = g.id === "circuit" ? `<div class="sh-sec"><h4>Built in the lab</h4>${D.projects.map((x) => `<div class="rec"><h5>${esc(x.name)}</h5><p class="rec-org">${esc(x.blurb)}</p></div>`).join("")}</div>` : "";
    const next = G[(i + 1) % G.length], prev = G[(i + G.length - 1) % G.length];
    const allDone = state.stamps.length === G.length;
    openSheet(`
      <div class="sh-head" style="--c:${g.color}">
        <p class="eyebrow">Gym ${pad(i + 1)} of ${pad(G.length)}</p>
        <h2 id="sheetTitle">${esc(p.name)}</h2>
        <p>${esc(g.domain)}</p>
        <div class="sh-stamp ${fresh ? "new" : ""}">VISITED<br>✓<br>${pad(state.stamps.length)}/${pad(G.length)}</div>
      </div>
      <div class="sh-body">
        <p class="sh-intro">${esc(g.intro)}</p>
        <div class="sh-sec"><h4>On the record</h4>${g.battles.map((b) => `<div class="rec"><h5>${esc(b.role)}</h5><p class="rec-org">${esc(b.org)} · ${esc(b.when)}</p>${b.points && b.points.length ? `<ul>${b.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</div>`).join("")}</div>
        ${projects}
        <div class="sh-sec"><h4>Skills trained here</h4><div class="chips">${g.moves.map((m) => `<span class="chip-s">${esc(m)}</span>`).join("")}</div></div>
        <div class="sh-nav">
          <button data-gym="${(i + G.length - 1) % G.length}">← ${esc(PLACE[prev.id].name)}</button>
          ${allDone ? `<button data-finish>Take the chequered flag 🏁</button>` : `<button data-gym="${(i + 1) % G.length}">Drive to ${esc(PLACE[next.id].name)} →</button>`}
        </div>
      </div>`);
    $$("#sheetBody [data-gym]").forEach((b) => b.addEventListener("click", () => openGym(+b.dataset.gym)));
    const fb = $("#sheetBody [data-finish]");
    if (fb) fb.addEventListener("click", () => { ss.set("finishShown", "1"); finish(); });
  }
  function finish() {
    cur = -1; zoomTo(null);
    const t = +ss.get("lapDone") || 0;
    openSheet(`<div class="finish">
      <div class="chequer" aria-hidden="true"></div>
      <h2 id="sheetTitle">Chequered flag! 🏁</h2>
      <p>You visited all five gyms on Tejith Island.</p>
      ${t ? `<div class="big-lap">${fmt(t)}</div><p>${state.best === t ? "Fastest lap so far. 🟣" : `Best lap: ${fmt(state.best)}`}</p>` : ""}
      <p>You now know more about Tejith than most interviewers do. The last step is yours:</p>
      <div class="contact-cta">${contactButtons()}</div>
      <p style="margin-top:18px"><button class="btn btn-ghost btn-sm" data-reset>Reset pass &amp; race again</button></p>
    </div>`);
    $("#sheetBody [data-reset]").addEventListener("click", () => {
      state.stamps = []; save(); ["lapStart", "lapDone", "finishShown"].forEach((k) => ss.set(k, ""));
      renderPass(); closeSheet(); toast("Pass reset. Lights out and away we go!");
    });
  }

  // ---------- content sections ----------
  function contactButtons() {
    const p = D.profile;
    return `<a class="btn btn-primary" href="mailto:${esc(p.email)}">Email me <span aria-hidden="true">→</span></a>
      <a class="btn btn-ghost" href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
      <a class="btn btn-ghost" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
      <a class="btn btn-ghost" href="${esc(p.cv)}" download>Download CV ↓</a>`;
  }
  const MON = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const startOf = (w) => { const m = w.match(/([A-Z][a-z]{2}) (\d{4})/); return m ? +m[2] * 12 + MON[m[1]] : 0; };
  const pointsFor = (role) => { for (const g of G) for (const b of g.battles) if (b.role === role && b.points) return b.points; return []; };
  function renderSections() {
    $("#stats").innerHTML = D.profile.stats.map((s) => `<div class="stat rv"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("");
    $("#principleList").innerHTML = D.principles.map((p, i) => `
      <article class="principle rv"><span class="pr-no">${pad(i + 1)}</span><h3>${esc(p.title)}</h3><p class="pr-text">${esc(p.text)}</p>
      <div class="pr-proof"><b>Proof</b><p>${esc(p.proof)}</p><span class="pr-where">${esc(p.where)}</span></div></article>`).join("");
    const q = D.profile.quote;
    if (q) { $("#quoteText").innerHTML = esc(q.text).replace(/\*([^*]+)\*/g, "<em>$1</em>"); $("#quoteBy").textContent = "— " + q.by; } else $("#quote").hidden = true;
    const items = [...D.experience.map((e) => ({ ...e, tag: "Internship" })), ...D.leadership.map((l) => ({ ...l, points: pointsFor(l.role), tag: "Leadership", lead: true }))].sort((a, b) => startOf(b.when) - startOf(a.when));
    $("#journeyList").innerHTML = items.map((s) => `
      <article class="step rv ${s.lead ? "lead" : ""}"><div><div class="step-when">${esc(s.when.split(" · ")[0])}</div><span class="step-tag">${s.tag}</span></div>
      <div><h3>${esc(s.role)}</h3><p class="step-org">${esc(s.org)}</p>${s.points.length ? `<ul>${s.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}</div></article>`).join("");
    $("#workList").innerHTML = D.projects.map((p, i) => `
      <article class="car-card rv ${i === 0 ? "feature" : ""}">
        <div class="car-top"><span class="car-no">#${pad(i + 1)}</span><span class="car-type">${esc(p.types.join(" · "))}</span></div>
        <h3>${esc(p.name)}</h3><p>${esc(p.blurb)}</p>
        <div class="tags">${p.moves.map((m) => `<span class="tag">${esc(m)}</span>`).join("")}</div>
        <div class="car-links">${p.live ? `<a href="${esc(p.live)}" target="_blank" rel="noopener noreferrer">Visit live app ↗</a>` : ""}${p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer">${I("github", 15)} Source</a>` : ""}</div>
      </article>`).join("");
    renderWriting();
    renderRefs();
    $("#honourList").innerHTML = D.achievements.map((a) => `<li class="honour rv"><b>${esc(a.year)}</b><p>${esc(a.text)}</p></li>`).join("");
    $("#school").innerHTML = `<h3>Schooling</h3>` + D.education.map((e) => `<div class="edu"><strong>${esc(e.degree)}</strong><span>${esc(e.school)}</span><em>${esc(e.when)} · ${esc(e.score)}</em></div>`).join("") +
      D.certifications.map((c) => `<div class="edu"><strong>${esc(c.name)}</strong><span>${esc(c.issuer)}</span><em>Certification</em></div>`).join("");
    $("#contactCta").innerHTML = contactButtons();
    $("#copyEmail .copy-text").textContent = D.profile.email;
  }
  function renderWriting(filter = "All") {
    const items = D.writing, box = $("#writingList"), bar = $("#writingFilters");
    if (!items.length) {
      bar.hidden = true;
      box.innerHTML = `<div class="empty rv"><span class="empty-ic">${I("scroll", 26)}</span><div><h3>Papers and essays will appear here.</h3>
        <p>Research papers, case studies and write-ups from my internships, starting with what monitoring a ₹4 Cr CSR build taught me about operations.</p></div>
        <a class="btn btn-ghost btn-sm" href="${esc(D.profile.linkedin)}" target="_blank" rel="noopener noreferrer">Follow on LinkedIn ↗</a></div>`;
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
      $("#refList").innerHTML = `<div class="empty rv"><span class="empty-ic">${I("star", 26)}</span><div><h3>Recommendations will appear here.</h3>
        <p>Words from the professors and supervisors I've worked with, published only with their permission and linked to their profiles so you can verify them.</p></div></div>${cta}`;
      return;
    }
    $("#refList").innerHTML = `<div class="ref-grid">${recs.map((r) => `<figure class="ref rv"><blockquote>${esc(r.quote)}</blockquote>
      <figcaption><span class="ref-init" aria-hidden="true">${esc(initials(r.name))}</span><span><b>${esc(r.name)}</b><small>${esc(r.role)} · ${esc(r.org)}</small>${r.relation ? `<small>${esc(r.relation)}</small>` : ""}</span>
      ${r.link ? `<a class="ref-verify" href="${esc(r.link)}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : ""}</figcaption></figure>`).join("")}</div>${cta}`;
  }
  function renderResume() {
    const p = D.profile;
    $("#resume").innerHTML = `<div class="resume"><div class="r-sheet">
      <header class="r-head"><h1>${esc(p.name)}</h1><p class="r-role">${esc(p.title)} · BBA + MBA, O.P. Jindal Global University</p>
        <div class="r-links"><span>${I("pin", 15)} ${esc(p.location)}</span><a href="mailto:${esc(p.email)}">${I("mail", 15)} ${esc(p.email)}</a>
        <a href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer">${I("linkedin", 15)} chennuru-tejith</a><a href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">${I("github", 15)} chennuru-tejith</a></div>
        <div class="r-actions"><a class="btn btn-primary btn-sm" href="${esc(p.cv)}" download>Download PDF ↓</a><a class="btn btn-ghost btn-sm" href="mailto:${esc(p.email)}">Email →</a></div></header>
      <section class="r-sec"><h2>Summary</h2><p>${esc(p.summary)}</p></section>
      <section class="r-sec"><h2>Experience</h2><div>${D.experience.map((e) => `<div class="r-item"><h3>${esc(e.role)}</h3><div class="r-sub"><span>${esc(e.org)}</span><span>${esc(e.when)}</span></div><ul>${e.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div></section>
      <section class="r-sec"><h2>Leadership</h2><div>${D.leadership.map((l) => `<div class="r-item"><h3>${esc(l.role)}</h3><div class="r-sub"><span>${esc(l.org)}</span><span>${esc(l.when)}</span></div></div>`).join("")}</div></section>
      <section class="r-sec"><h2>Education</h2><div>${D.education.map((e) => `<div class="r-item"><h3>${esc(e.degree)}</h3><div class="r-sub"><span>${esc(e.school)}</span><span>${esc(e.when)} · ${esc(e.score)}</span></div></div>`).join("")}</div></section>
      <section class="r-sec"><h2>Skills</h2><div class="r-skills">${D.skills.map((s) => `<div><b>${esc(s.group)}:</b> ${esc(s.items.join(", "))}</div>`).join("")}<div><b>Languages:</b> ${esc(p.languages.join(", "))}</div><div><b>Certification:</b> ${esc(D.certifications.map((c) => `${c.name} (${c.issuer})`).join(", "))}</div></div></section>
      <section class="r-sec"><h2>Projects</h2><div>${D.projects.map((x) => `<div class="r-item"><h3><a href="${esc(x.live || x.repo)}" target="_blank" rel="noopener noreferrer">${esc(x.name)}</a></h3><div class="r-sub"><span>${esc(x.blurb)}</span></div></div>`).join("")}</div></section>
      ${D.writing.length ? `<section class="r-sec"><h2>Writing</h2><div>${D.writing.map((w) => `<div class="r-item"><h3><a href="${esc(w.url)}" target="_blank" rel="noopener noreferrer">${esc(w.title)}</a></h3><div class="r-sub"><span>${esc(w.kind)} · ${esc(w.venue)}</span><span>${esc(w.date)}</span></div></div>`).join("")}</div></section>` : ""}
      ${D.recommendations.length ? `<section class="r-sec"><h2>References</h2><div>${D.recommendations.map((r) => `<div class="r-item"><h3>${esc(r.name)}</h3><div class="r-sub"><span>${esc(r.role)}, ${esc(r.org)}</span>${r.link ? `<a href="${esc(r.link)}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : ""}</div><p style="margin-top:6px">“${esc(r.quote)}”</p></div>`).join("")}</div></section>` : ""}
      <section class="r-sec"><h2>Honours</h2><div><ul style="margin:0;padding-left:18px">${D.achievements.map((a) => `<li>${esc(a.text)} (${esc(a.year)})</li>`).join("")}</ul></div></section>
    </div><div class="r-foot"><span>Got 3 minutes? Explore the island instead.</span><button class="btn btn-ghost btn-sm" data-go="story">Explore the island →</button></div></div>`;
  }

  // ---------- lights out ----------
  function lightsOut(done) {
    const seen = ss.get("lightsSeen");
    ss.set("lightsSeen", "1");
    if (still || seen || view !== "story") { done(); return; }
    const box = $("#lights"), dots = $$(".lights-row i", box);
    box.hidden = false;
    let n = 0, t, ended = false;
    const end = () => { if (ended) return; ended = true; clearTimeout(t); box.classList.add("go"); ISL.lights(0); setTimeout(() => (box.hidden = true), 520); done(); };
    $("#lightsSkip").addEventListener("click", end, { once: true });
    const step = () => {
      n++; dots.forEach((d, i) => d.classList.toggle("on", i < n)); ISL.lights(n);
      if (n < 5) t = setTimeout(step, 300);
      else t = setTimeout(() => { dots.forEach((d) => d.classList.remove("on")); $("#lightsText").textContent = "And away we go!"; t = setTimeout(end, 450); }, 600);
    };
    t = setTimeout(step, 250);
  }

  // ---------- scroll & reveal ----------
  let io;
  function reveal() {
    if (still) { $$(".rv").forEach((e) => e.classList.add("in")); return; }
    io = io || new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.08 });
    $$(".rv:not(.in)").forEach((e) => io.observe(e));
  }
  function onScroll() {
    if (view !== "story") return;
    let on = "top";
    ["principles", "journey", "garage", "writing", "references"].forEach((id) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * 0.4) on = id; });
    $$(".bar-nav a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + on));
  }

  // ---------- boot ----------
  applyTheme(state.theme);
  $("#year").textContent = new Date().getFullYear();
  stars(); buildIsland(); greet(); renderPass(); renderSections(); renderResume(); reveal();
  ISL.park();

  new IntersectionObserver(([e]) => {
    heroOn = e.isIntersecting; $(".hero").classList.toggle("off", !heroOn);
    if (still) return;
    heroOn && view === "story" && !document.hidden && $("#lights").hidden ? ISL.go() : ISL.stop();
  }).observe($(".hero"));
  document.addEventListener("visibilitychange", () => { if (still) return; document.hidden ? ISL.stop() : heroOn && view === "story" && ISL.go(); });

  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]"); if (go) setView(go.dataset.go);
    if (e.target.closest("[data-close]")) closeSheet();
  });
  $(".brand").addEventListener("click", (e) => { if (view !== "story") { e.preventDefault(); setView("story"); } });
  $("#themeBtn").addEventListener("click", () => { state.theme = state.theme === "night" ? "day" : "night"; save(); applyTheme(state.theme); });
  $("#startTour").addEventListener("click", () => { const i = G.findIndex((g) => !has(g.id)); i < 0 ? finish() : openGym(i); });
  $("#copyEmail").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(D.profile.email); toast("Email copied ✓"); } catch (err) { location.href = "mailto:" + D.profile.email; }
  });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", (e) => {
    if ($("#sheet").hidden) return;
    if (e.key === "Escape") return closeSheet();
    if (e.key === "Tab") {
      const f = $$(".sheet button:not(:disabled), .sheet a[href]"); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      return;
    }
    if (cur < 0) return;
    if (e.key === "ArrowRight") openGym((cur + 1) % G.length);
    if (e.key === "ArrowLeft") openGym((cur + G.length - 1) % G.length);
  });

  // centre the island on phones, where it scrolls sideways
  const ws = $("#worldScroll"); if (ws.scrollWidth > ws.clientWidth) ws.scrollLeft = (ws.scrollWidth - ws.clientWidth) / 2;

  setView(new URLSearchParams(location.search).get("view") === "resume" ? "resume" : "story", false);
  lightsOut(() => { if (!still && view === "story" && heroOn) ISL.go(); });
})();
