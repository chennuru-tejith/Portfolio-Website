// ============================================================
//  Chennuru Tejith — "Every badge, earned."
// ============================================================

(function () {
  const D = window.PORTFOLIO;
  const I = window.ICONS;
  const G = D.gyms;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const roman = ["I", "II", "III", "IV", "V"];
  const pad = (n) => String(n).padStart(2, "0");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- saved state ----------
  const KEY = "tejith-badges-v3";
  const state = Object.assign({ badges: [], theme: "night", champ: false },
    (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })());
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };
  state.badges = Array.isArray(state.badges) ? [...new Set(state.badges)].filter((id) => G.some((g) => g.id === id)) : [];
  if (state.theme !== "day" && state.theme !== "night") state.theme = "night";
  const has = (id) => state.badges.includes(id);

  // ---------- badge artwork (original enamel badges) ----------
  const SHAPES = ["coin", "hex", "shield", "diamond", "oct"];
  function poly(n, r, rot = -90, alt = null) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = ((rot + (360 / n) * i) * Math.PI) / 180;
      const rr = alt && i % 2 ? alt : r;
      pts.push((100 + Math.cos(a) * rr).toFixed(1) + "," + (100 + Math.sin(a) * rr).toFixed(1));
    }
    return `<polygon points="${pts.join(" ")}"`;
  }
  function shape(kind, r) {
    switch (kind) {
      case "coin": return poly(56, r, -90, r * 0.955);
      case "hex": return poly(6, r * 1.04);
      case "diamond": return poly(4, r * 1.12);
      case "oct": return poly(8, r * 1.02, -67.5);
      case "shield": {
        const w = r * 0.86;
        return `<path d="M100 ${100 - r} L${100 + w} ${100 - r * 0.68} V${100 + r * 0.08} Q${100 + w} ${100 + r * 0.72} 100 ${100 + r} Q${100 - w} ${100 + r * 0.72} ${100 - w} ${100 + r * 0.08} V${100 - r * 0.68} Z"`;
      }
    }
  }
  let uid = 0;
  function badge(i, cls = "") {
    const g = G[i], k = SHAPES[i % SHAPES.length], id = "b" + ++uid;
    const glyph = I(g.icon, 64).replace("<svg ", '<svg x="68" y="68" ').replace('stroke-width="1.7"', 'stroke-width="1.6"');
    return `<svg class="${cls}" viewBox="0 0 200 200" role="img" aria-label="${esc(g.medal)}">
      <defs>
        <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fbe9b7"/><stop offset=".3" stop-color="#c9a45c"/><stop offset=".55" stop-color="#7a5a22"/><stop offset=".8" stop-color="#e9cd8e"/><stop offset="1" stop-color="#9b7630"/>
        </linearGradient>
        <radialGradient id="${id}e" cx=".35" cy=".28" r=".9">
          <stop offset="0" stop-color="${g.color}"/><stop offset=".6" stop-color="${g.color}" stop-opacity=".9"/><stop offset="1" stop-color="#0b0b10"/>
        </radialGradient>
        <linearGradient id="${id}h" x1="0" y1="0" x2=".6" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
        <clipPath id="${id}c">${shape(k, 70)}/></clipPath>
      </defs>
      ${shape(k, 92)} fill="url(#${id}m)"/>
      ${shape(k, 80)} fill="none" stroke="#4a3510" stroke-opacity=".55" stroke-width="1.5"/>
      ${shape(k, 74)} fill="url(#${id}e)" stroke="url(#${id}m)" stroke-width="4"/>
      ${shape(k, 63)} fill="none" stroke="#fff" stroke-opacity=".3" stroke-dasharray="1.5 4"/>
      <g color="#fff">${glyph}</g>
      <g clip-path="url(#${id}c)"><rect x="0" y="0" width="200" height="110" fill="url(#${id}h)" transform="rotate(-18 100 100)"/></g>
    </svg>`;
  }

  // ---------- guilloche (banknote engraving, generated) ----------
  // Drawn once into an <img> so the slow rotation runs on the GPU instead of repainting vectors.
  let guillochePaths = "";
  function guilloche(theme) {
    if (!guillochePaths) {
      for (let i = 0; i < 26; i++) {
        for (const [R, A, n, B, m] of [[230, 34, 9, 10, 23], [150, 22, 13, 6, 31]]) {
          let d = "";
          for (let j = 0; j <= 360; j++) {
            const t = (j / 360) * Math.PI * 2;
            const r = R + A * Math.sin(n * t + i * 0.24) + B * Math.sin(m * t);
            d += (j ? "L" : "M") + (Math.cos(t) * r).toFixed(1) + " " + (Math.sin(t) * r).toFixed(1);
          }
          guillochePaths += `<path d="${d}Z"/>`;
        }
      }
    }
    const stroke = theme === "day" ? "#94701f" : "#c9a45c";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-300 -300 600 600"><g fill="none" stroke="${stroke}" stroke-width=".4" stroke-opacity=".5">${guillochePaths}</g></svg>`;
    $("#guilloche").src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  // ---------- quote ----------
  function renderQuote() {
    const q = D.profile.quote;
    if (!q) { $("#quote").hidden = true; return; }
    $("#quoteText").innerHTML = esc(q.text).replace(/\*([^*]+)\*/g, "<em>$1</em>");
    $("#quoteBy").textContent = q.by;
  }

  // ---------- motion (pointer spotlight + portrait parallax), paused off-screen ----------
  function motion() {
    const hero = $(".hero"), spot = $("#spot");
    new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; hero.classList.toggle("off", !heroOn); }).observe(hero);
    if (still) return;
    let tx = 0, ty = 0, raf = 0;
    const paint = () => {
      raf = 0;
      spot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      const img = $("#avatarImg");
      if (heroOn && img) img.style.transform = `translate3d(0, ${Math.min(scrollY, 900) * 0.06}px, 0)`;
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
    if (matchMedia("(pointer: fine)").matches) {
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        tx = e.clientX - r.left - 300; ty = e.clientY - r.top - 300; ask();
      }, { passive: true });
      hero.addEventListener("pointerenter", () => spot.classList.add("on"));
      hero.addEventListener("pointerleave", () => spot.classList.remove("on"));
    }
    window.addEventListener("scroll", () => heroOn && ask(), { passive: true });
  }

  // ---------- small helpers ----------
  let toastT;
  function toast(html) {
    const t = $("#toast");
    t.innerHTML = html; t.hidden = false;
    t.style.animation = "none"; void t.offsetWidth; t.style.animation = "";
    clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 3200);
  }
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    guilloche(t);
    const tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.content = t === "day" ? "#f4efe4" : "#0a0d12";
    $("#themeBtn").innerHTML = I(t === "night" ? "sun" : "moon", 17);
    $("#themeBtn").setAttribute("aria-label", t === "night" ? "Switch to day" : "Switch to night");
  }

  // ---------- views ----------
  let view = "story";
  function setView(v, push = true) {
    view = v;
    $("#story").hidden = v !== "story";
    $("#resume").hidden = v !== "resume";
    document.body.classList.toggle("resume-mode", v === "resume");
    $("#segStory").setAttribute("aria-selected", v === "story");
    $("#segRes").setAttribute("aria-selected", v === "resume");
    if (push) {
      const u = new URL(location.href);
      if (v === "resume") u.searchParams.set("view", "resume"); else u.searchParams.delete("view");
      u.hash = ""; history.replaceState(null, "", u);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    onScroll();
  }

  // ---------- render: hero + stats ----------
  function renderHero() {
    const e = D.profile.email;
    $("#copyEmail .copy-text").textContent = e;
    $("#copyEmail").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(e); toast(`${I("check", 18)} Email copied to clipboard`); }
      catch (err) { location.href = "mailto:" + e; }
    });
    $("#stats").innerHTML = D.profile.stats.map((s) => `<div class="stat"><b>${esc(s.value)}</b><span class="mono">${esc(s.label)}</span></div>`).join("");
  }

  // ---------- render: gyms ----------
  function renderGyms(shown = false) {
    $("#gymList").innerHTML = G.map((g, i) => `
      <li class="gym-row rv ${shown ? "in" : ""} ${has(g.id) ? "won" : ""}" style="--c:${g.color}">
        <button class="gym-btn" data-i="${i}" aria-label="Open ${esc(g.name)}: ${esc(g.domain)}">
          <span class="gym-no">${pad(i + 1)}</span>
          <span class="gym-name">${esc(g.name.replace(" Gym", ""))}<small>${esc(g.domain)}</small></span>
          <span class="gym-state mono">${has(g.id) ? "◆ Badge earned" : "◇ Challenge open"}</span>
          ${badge(i, "gym-badge")}
          <span class="gym-arrow" aria-hidden="true">→</span>
        </button>
      </li>`).join("");
    $$("#gymList .gym-btn").forEach((b) => b.addEventListener("click", () => openGym(+b.dataset.i)));
    reveal();
  }
  function renderProgress() {
    $("#tally").textContent = `${state.badges.length} / ${G.length} badges earned`;
    $("#caseBtn").innerHTML = G.map((g) => `<i class="${has(g.id) ? "on" : ""}" style="--c:${g.color}"></i>`).join("");
  }

  // ---------- drawer ----------
  let cur = -1, lastFocus = null;
  function openDrawer(html) {
    $("#drawerBody").innerHTML = html;
    const w = $("#drawer");
    if (w.hidden) { lastFocus = document.activeElement; w.hidden = false; document.body.classList.add("noscroll"); }
    $(".drawer").scrollTop = 0;
    $(".drawer-x").focus();
  }
  function closeDrawer() {
    const w = $("#drawer");
    if (w.hidden) return;
    const was = cur;
    w.hidden = true; cur = -1; document.body.classList.remove("noscroll");
    // the gym list may have been re-rendered, so fall back to the matching row
    const target = lastFocus && document.contains(lastFocus) ? lastFocus : $$("#gymList .gym-btn")[was];
    target && target.focus && target.focus({ preventScroll: true });
  }
  function openGym(i) {
    cur = i;
    const g = G[i], done = has(g.id);
    const prev = G[(i + G.length - 1) % G.length], next = G[(i + 1) % G.length];
    openDrawer(`
      <p class="kicker">GYM ${roman[i]} OF ${roman[G.length - 1]}</p>
      <div class="d-head">
        <div><h2 id="drawerTitle">${esc(g.name.replace(" Gym", ""))} <em>Gym</em></h2><p class="d-domain">${esc(g.domain)}</p></div>
        ${badge(i, "d-badge" + (done ? "" : " locked"))}
      </div>
      <p class="d-quote">“${esc(g.intro)}”</p>
      <div class="d-sec"><span class="mono">Techniques</span><div class="chips">${g.moves.map((m) => `<span class="chip">${esc(m)}</span>`).join("")}</div></div>
      <div class="d-sec"><span class="mono">The record</span>${g.battles.map((b) => `
        <div class="rec"><h4>${esc(b.role)}</h4><p class="rec-org">${esc(b.org)} · ${esc(b.when)}</p>
        ${b.points && b.points.length ? `<ul>${b.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}</div>`).join("")}
      </div>
      <div class="challenge">
        <span class="mono" style="color:var(--brass)">The challenge</span>
        <p class="challenge-q" style="margin-top:12px">${esc(g.quiz.q)}</p>
        <div class="opts">${g.quiz.options.map((o, k) => `<button data-k="${k}" ${done ? "disabled" : ""} class="${done && k === g.quiz.answer ? "right" : ""}"><span class="k">${"abc"[k]}</span>${esc(o)}</button>`).join("")}</div>
        <p class="msg ${done ? "ok" : ""}" aria-live="polite">${done ? "Challenge passed. The " + esc(g.medal) + " is yours." : "The answer is in the record above."}</p>
      </div>
      <div class="d-nav">
        <button data-go-gym="${(i + G.length - 1) % G.length}">← ${esc(prev.name)}</button>
        <button data-go-gym="${(i + 1) % G.length}">${esc(next.name)} →</button>
      </div>`);
    $$("#drawerBody .opts button").forEach((b) => b.addEventListener("click", () => answer(+b.dataset.k)));
    $$("#drawerBody [data-go-gym]").forEach((b) => b.addEventListener("click", () => openGym(+b.dataset.goGym)));
  }
  function answer(k) {
    const g = G[cur];
    if (!g || has(g.id)) return;
    const btns = $$("#drawerBody .opts button"), msg = $("#drawerBody .msg");
    if (k !== g.quiz.answer) {
      btns[k].classList.add("wrong"); btns[k].disabled = true;
      msg.className = "msg no"; msg.textContent = "Not quite. Read the record again and try another answer.";
      return;
    }
    btns[k].classList.add("right"); btns.forEach((b) => (b.disabled = true));
    msg.className = "msg ok"; msg.textContent = `Challenge passed. The ${g.medal} is yours.`;
    state.badges.push(g.id); save();
    const b = $("#drawerBody .d-badge"); b.classList.remove("locked"); b.classList.add("earn");
    toast(`${badge(cur)} ${esc(g.medal)} earned · ${state.badges.length} of ${G.length}`);
    renderProgress(); renderGyms(true);
    if (state.badges.length === G.length && !state.champ) {
      state.champ = true; save();
      const from = cur;
      // only take over the drawer if the visitor is still on this gym
      setTimeout(() => { if (view === "story" && (cur === from || $("#drawer").hidden)) champion(); }, 1800);
    }
  }
  function champion() {
    cur = -1;
    openDrawer(`
      <div class="champ">
        <p class="kicker" style="justify-content:center">ALL FIVE GYMS</p>
        <h2 id="drawerTitle">Every badge, <em>earned.</em></h2>
        <p>You've collected the full set, so you now know Tejith better than most interviewers do. The last step is yours.</p>
        <div class="champ-row">${G.map((_, i) => badge(i).replace("<svg ", `<svg style="animation-delay:${i * 0.12}s" `)).join("")}</div>
        <div class="finale-cta">${contactButtons()}</div>
      </div>`);
  }

  // ---------- render: journey ----------
  const MON = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const start = (w) => { const m = w.match(/([A-Z][a-z]{2}) (\d{4})/); return m ? +m[2] * 12 + MON[m[1]] : 0; };
  const pointsFor = (role) => { for (const g of G) for (const b of g.battles) if (b.role === role && b.points) return b.points; return []; };
  function renderJourney() {
    const items = [
      ...D.experience.map((e) => ({ ...e, tag: "Internship" })),
      ...D.leadership.map((l) => ({ ...l, points: pointsFor(l.role), tag: "Leadership", lead: true })),
    ].sort((a, b) => start(b.when) - start(a.when));
    $("#journeyList").innerHTML = items.map((s) => `
      <article class="step rv ${s.lead ? "lead" : ""}">
        <div class="step-when mono">${esc(s.when.split(" · ")[0])}</div>
        <div>
          <h3>${esc(s.role)}</h3>
          <p class="step-org">${esc(s.org)}</p>
          ${s.points.length ? `<ul>${s.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
        </div>
        <div class="step-tag mono">${s.tag}</div>
      </article>`).join("");
  }

  // ---------- render: work ----------
  function links(p) {
    return `<div class="work-links">
      ${p.live ? `<a class="live" href="${esc(p.live)}" target="_blank" rel="noopener noreferrer">Visit live app ${I("external", 15)}</a>` : ""}
      ${p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer">${I("github", 15)} Source</a>` : ""}
    </div>`;
  }
  function renderWork() {
    $("#workList").innerHTML = D.projects.map((p, i) => {
      const head = `<div class="work-top mono"><span>${pad(i + 1)} / ${pad(D.projects.length)}</span><span>${esc(p.types.join(" · "))}</span></div>`;
      const body = `<h3>${esc(p.name.split(" — ")[0])}</h3>${p.name.includes(" — ") ? `<p class="mono" style="color:var(--brass)">${esc(p.name.split(" — ")[1])}</p>` : ""}
        <p>${esc(p.blurb)}</p><div class="tags">${p.moves.map((m) => `<span class="tag">${esc(m)}</span>`).join("")}</div>${links(p)}`;
      if (i === 0) return `
        <article class="work feature rv">
          <div class="work-main">${head}${body}</div>
          <div class="feature-art" aria-hidden="true">
            <div class="fa-row"><span class="fa-dot"></span><div>Find the right people<small>Alumni, recruiters, founders</small></div><span class="fa-chip">DISCOVER</span></div>
            <div class="fa-row"><span class="fa-dot" style="opacity:.6"></span><div>Write a note that sounds like you<small>Personal, not spammy</small></div><span class="fa-chip">DRAFT</span></div>
            <div class="fa-row"><span class="fa-dot" style="opacity:.35"></span><div>Turn replies into referrals<small>Follow-ups that land</small></div><span class="fa-chip">CONVERT</span></div>
          </div>
        </article>`;
      return `<article class="work rv">${head}${body}</article>`;
    }).join("");
  }

  // ---------- render: honours + school + contact ----------
  function renderHonours() {
    $("#honourList").innerHTML = D.achievements.map((a) => `<li class="honour rv"><b>${esc(a.year)}</b><p>${esc(a.text)}</p></li>`).join("");
    $("#school").innerHTML = `<p class="kicker">THE ACADEMY</p><h3>Schooling</h3>` +
      D.education.map((e) => `<div class="edu"><strong>${esc(e.degree)}</strong><span>${esc(e.school)}</span><span class="mono">${esc(e.when)} · ${esc(e.score)}</span></div>`).join("") +
      D.certifications.map((c) => `<div class="edu"><strong>${esc(c.name)}</strong><span>${esc(c.issuer)}</span><span class="mono">Certification</span></div>`).join("");
  }
  function contactButtons() {
    const p = D.profile;
    return `<a class="btn btn-fill" href="mailto:${esc(p.email)}">Write to me <span aria-hidden="true">→</span></a>
      <a class="btn btn-line" href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
      <a class="btn btn-line" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      <a class="btn btn-line" href="${esc(p.cv)}" download>Download CV <span aria-hidden="true">↓</span></a>`;
  }

  // ---------- avatar + greeting ----------
  let heroOn = true;
  function renderAvatar() {
    const src = D.profile.avatar;
    if (!src) return;
    const img = new Image();
    img.id = "avatarImg"; img.className = "avatar-img"; img.decoding = "async";
    img.alt = "Avatar of Chennuru Tejith waving hello";
    img.setAttribute("fetchpriority", "high");
    img.addEventListener("load", () => $("#arch").classList.add("has-avatar"));
    img.addEventListener("error", () => img.remove()); // fall back to the monogram seal
    img.src = src;
    $("#arch").appendChild(img);
    $("#plateCaption").textContent = "PLATE 01 · SAYING HELLO";
  }
  function greet() {
    const list = D.profile.greetings || [];
    const el = $("#greetText");
    if (!list.length) { $("#greet").hidden = true; return; }
    el.textContent = list[0];
    if (still || list.length < 2) return;
    let i = 0;
    setInterval(() => {
      if (!heroOn || document.hidden) return;
      el.classList.add("out");
      setTimeout(() => { i = (i + 1) % list.length; el.textContent = list[i]; el.classList.remove("out"); }, 320);
    }, 2800);
  }

  // ---------- render: principles ----------
  function renderPrinciples() {
    $("#principleList").innerHTML = D.principles.map((p, i) => `
      <li class="principle rv">
        <span class="pr-no">${pad(i + 1)}</span>
        <h3>${esc(p.title)}</h3>
        <p class="pr-text">${esc(p.text)}</p>
        <div class="pr-proof"><span class="mono">Proof</span><p>${esc(p.proof)}</p><span class="pr-where">${esc(p.where)}</span></div>
      </li>`).join("");
  }

  // ---------- render: research & writing ----------
  function renderWriting(filter = "All") {
    const items = D.writing;
    const box = $("#writingList"), bar = $("#writingFilters");
    if (!items.length) {
      bar.hidden = true;
      box.innerHTML = `<div class="empty rv">
        <span class="empty-ic">${I("scroll", 26)}</span>
        <div><h3>Papers and essays will appear here.</h3>
        <p>Research papers, case studies and write-ups from my internships, starting with what monitoring a ₹4 Cr CSR build taught me about operations.</p></div>
        <a class="btn btn-line btn-sm" href="${esc(D.profile.linkedin)}" target="_blank" rel="noopener noreferrer">Follow on LinkedIn <span aria-hidden="true">↗</span></a>
      </div>`;
      return;
    }
    const kinds = ["All", ...new Set(items.map((w) => w.kind))];
    bar.hidden = kinds.length < 3;
    bar.innerHTML = kinds.map((k) => `<button role="tab" aria-selected="${k === filter}" data-kind="${esc(k)}">${esc(k)}</button>`).join("");
    $$("button", bar).forEach((b) => b.addEventListener("click", () => renderWriting(b.dataset.kind)));
    box.innerHTML = items.filter((w) => filter === "All" || w.kind === filter).map((w) => `
      <a class="paper rv in" href="${esc(w.url)}" target="_blank" rel="noopener noreferrer">
        <div class="paper-top mono"><span>${esc(w.kind)}</span><span>${esc(w.date)}</span></div>
        <h3>${esc(w.title)}</h3>
        <p>${esc(w.summary)}</p>
        <span class="paper-venue mono">${esc(w.venue)} <span aria-hidden="true">↗</span></span>
      </a>`).join("");
  }

  // ---------- render: recommendations ----------
  function requestLink() {
    const subject = "Recommendation for Chennuru Tejith";
    const body = [
      "Hi Tejith,", "",
      "Here is my recommendation for your portfolio:", "", "", "",
      "Name:", "Role / title:", "Organisation:", "How I know you (e.g. taught you X / supervised you at Y):",
      "LinkedIn profile (so recruiters can verify):", "",
      "I give permission to publish this on your portfolio: Yes / No",
    ].join("\n");
    return `mailto:${D.profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  const initials = (name) => name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/, "").split(/\s+/).map((x) => x[0]).slice(0, 2).join("");
  function renderRefs() {
    const recs = D.recommendations;
    const cta = `<div class="ref-cta rv">
        <div><h3>Worked with me?</h3><p>If I've been your student, intern or teammate, I'd be grateful for a few honest lines. I only publish them with your permission.</p></div>
        <a class="btn btn-fill btn-sm" href="${esc(requestLink())}">Write a recommendation <span aria-hidden="true">→</span></a>
      </div>`;
    if (!recs.length) {
      $("#refList").innerHTML = `<div class="empty rv">
        <span class="empty-ic">${I("star", 26)}</span>
        <div><h3>Recommendations will appear here.</h3>
        <p>Words from the professors and supervisors I've worked with, published only with their permission and linked to their profiles so you can verify them.</p></div>
      </div>${cta}`;
      return;
    }
    $("#refList").innerHTML = `<div class="ref-grid">${recs.map((r) => `
      <figure class="ref rv">
        <span class="ref-mark" aria-hidden="true">“</span>
        <blockquote>${esc(r.quote)}</blockquote>
        <figcaption>
          <span class="ref-init" aria-hidden="true">${esc(initials(r.name))}</span>
          <span><b>${esc(r.name)}</b><small>${esc(r.role)} · ${esc(r.org)}</small>${r.relation ? `<small class="ref-rel">${esc(r.relation)}</small>` : ""}</span>
          ${r.link ? `<a class="ref-verify mono" href="${esc(r.link)}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : ""}
        </figcaption>
      </figure>`).join("")}</div>${cta}`;
  }

  // ---------- render: résumé ----------
  function renderResume() {
    const p = D.profile;
    $("#resume").innerHTML = `<div class="resume"><div class="r-sheet">
      <header class="r-head">
        <div>
          <p class="kicker">CURRICULUM VITAE</p>
          <h1>${esc(p.name)}</h1>
          <p class="r-role">${esc(p.title)} · BBA + MBA, O.P. Jindal Global University</p>
          <div class="r-links">
            <span>${I("pin", 15)} ${esc(p.location)}</span>
            <a href="mailto:${esc(p.email)}">${I("mail", 15)} ${esc(p.email)}</a>
            <a href="${esc(p.linkedin)}" target="_blank" rel="noopener noreferrer">${I("linkedin", 15)} chennuru-tejith</a>
            <a href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">${I("github", 15)} chennuru-tejith</a>
          </div>
          <div class="r-actions">
            <a class="btn btn-fill btn-sm" href="${esc(p.cv)}" download>Download PDF <span aria-hidden="true">↓</span></a>
            <a class="btn btn-line btn-sm" href="mailto:${esc(p.email)}">Email <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </header>
      <section class="r-sec"><h2>Summary</h2><p>${esc(p.summary)}</p></section>
      <section class="r-sec"><h2>Experience</h2><div>${D.experience.map((e) => `
        <div class="r-item"><h3>${esc(e.role)}</h3><div class="r-sub"><span>${esc(e.org)}</span><span>${esc(e.when)}</span></div>
        <ul>${e.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div></section>
      <section class="r-sec"><h2>Leadership</h2><div>${D.leadership.map((l) => `
        <div class="r-item"><h3>${esc(l.role)}</h3><div class="r-sub"><span>${esc(l.org)}</span><span>${esc(l.when)}</span></div></div>`).join("")}</div></section>
      <section class="r-sec"><h2>Education</h2><div>${D.education.map((e) => `
        <div class="r-item"><h3>${esc(e.degree)}</h3><div class="r-sub"><span>${esc(e.school)}</span><span>${esc(e.when)} · ${esc(e.score)}</span></div></div>`).join("")}</div></section>
      <section class="r-sec"><h2>Skills</h2><div class="r-skills">
        ${D.skills.map((s) => `<div><b>${esc(s.group)}:</b> ${esc(s.items.join(", "))}</div>`).join("")}
        <div><b>Languages:</b> ${esc(p.languages.join(", "))}</div>
        <div><b>Certification:</b> ${esc(D.certifications.map((c) => `${c.name} (${c.issuer})`).join(", "))}</div>
      </div></section>
      <section class="r-sec"><h2>Projects</h2><div>${D.projects.map((x) => `
        <div class="r-item"><h3><a href="${esc(x.live || x.repo)}" target="_blank" rel="noopener noreferrer">${esc(x.name)}</a></h3><div class="r-sub"><span>${esc(x.blurb)}</span></div></div>`).join("")}</div></section>
      ${D.writing.length ? `<section class="r-sec"><h2>Writing</h2><div>${D.writing.map((w) => `
        <div class="r-item"><h3><a href="${esc(w.url)}" target="_blank" rel="noopener noreferrer">${esc(w.title)}</a></h3><div class="r-sub"><span>${esc(w.kind)} · ${esc(w.venue)}</span><span>${esc(w.date)}</span></div></div>`).join("")}</div></section>` : ""}
      ${D.recommendations.length ? `<section class="r-sec"><h2>References</h2><div>${D.recommendations.map((r) => `
        <div class="r-item"><h3>${esc(r.name)}</h3><div class="r-sub"><span>${esc(r.role)}, ${esc(r.org)}</span>${r.link ? `<a href="${esc(r.link)}" target="_blank" rel="noopener noreferrer">Verify ↗</a>` : ""}</div><p style="margin-top:6px">“${esc(r.quote)}”</p></div>`).join("")}</div></section>` : ""}
      <section class="r-sec"><h2>Honours</h2><div><ul style="margin:0;padding-left:18px">${D.achievements.map((a) => `<li>${esc(a.text)} (${esc(a.year)})</li>`).join("")}</ul></div></section>
    </div>
    <div class="r-foot"><span>Prefer the story? There are five gyms and five badges waiting.</span><button class="btn btn-line btn-sm" data-go="story">Read the story <span aria-hidden="true">→</span></button></div>
    </div>`;
  }

  // ---------- scroll + reveal ----------
  let io;
  function reveal() {
    if (still) { $$(".rv").forEach((e) => e.classList.add("in")); return; }
    io = io || new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    $$(".rv:not(.in)").forEach((e) => io.observe(e));
  }
  function onScroll() {
    $("#mast").classList.toggle("scrolled", scrollY > 30);
    if (view !== "story") return;
    let on = "";
    ["gyms", "principles", "journey", "work", "writing", "references", "honours", "contact"].forEach((id) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * 0.45) on = id; });
    $$(".mast-nav a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + on));
  }

  // ---------- boot ----------
  applyTheme(state.theme);
  $("#year").textContent = new Date().getFullYear();
  renderAvatar(); greet(); renderQuote(); motion(); renderPrinciples(); renderWriting(); renderRefs(); renderHero(); renderGyms(); renderProgress(); renderJourney(); renderWork(); renderHonours(); renderResume();
  $("#contactCta").innerHTML = contactButtons();
  reveal();

  document.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) setView(go.dataset.go);
    if (e.target.closest("[data-close]")) closeDrawer();
  });
  $(".sig").addEventListener("click", (e) => { if (view !== "story") { e.preventDefault(); setView("story"); } });
  $("#themeBtn").addEventListener("click", () => { state.theme = state.theme === "night" ? "day" : "night"; save(); applyTheme(state.theme); });
  $("#caseBtn").addEventListener("click", () => {
    const i = G.findIndex((g) => !has(g.id));
    i < 0 ? champion() : openGym(i);
  });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", (e) => {
    if ($("#drawer").hidden) return;
    if (e.key === "Escape") return closeDrawer();
    if (e.key === "Tab") {
      const f = $$('.drawer button:not(:disabled), .drawer a[href]');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      return;
    }
    if (cur < 0 || e.metaKey || e.ctrlKey) return;
    const k = { a: 0, b: 1, c: 2 }[e.key.toLowerCase()];
    if (k != null) answer(k);
    if (e.key === "ArrowRight") openGym((cur + 1) % G.length);
    if (e.key === "ArrowLeft") openGym((cur + G.length - 1) % G.length);
  });

  setView(new URLSearchParams(location.search).get("view") === "resume" ? "resume" : "story", false);
})();
