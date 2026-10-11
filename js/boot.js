// Runs before first paint: enables reveal animations, applies saved theme and reading options, and arms the intro (no flash).
(function () {
  var d = document.documentElement;
  d.classList.add("js");
  try {
    var s = JSON.parse(localStorage.getItem("tejith-pro-v1"));
    if (s && (s.theme === "light" || s.theme === "dark")) d.setAttribute("data-theme", s.theme);
    if (s && s.contrast === "high") d.setAttribute("data-contrast", "high");
    if (s && s.zoom) d.style.setProperty("--zoom", s.zoom);
  } catch (e) {}
  // Motion: "auto" follows the system setting for decorative effects but still plays the hero entrance;
  // "full" plays everything; "reduced" switches all motion off. Chosen in the Aa menu.
  try {
    var pref = "auto";
    try { var ss = JSON.parse(localStorage.getItem("tejith-pro-v1")); if (ss && ss.motion) pref = ss.motion; } catch (e) {}
    var os = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var forced = /[?&]motion=1/.test(location.search);
    var still = pref === "reduced" || (pref === "auto" && os && !forced);
    if (still) d.classList.add("still");
    if (pref === "reduced") d.classList.add("motion-off");
    if (pref !== "reduced" && !sessionStorage.getItem("tejith-intro") && !/[?&]view=resume/.test(location.search)) d.classList.add("intro-on");
  } catch (e) {}
})();
