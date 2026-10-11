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
  // the monogram intro plays once per visit, never for reduced motion or the résumé view
  try {
    var still = matchMedia("(prefers-reduced-motion: reduce)").matches && !/[?&]motion=1/.test(location.search);
    if (!still && !sessionStorage.getItem("tejith-intro") && !/[?&]view=resume/.test(location.search)) d.classList.add("intro-on");
  } catch (e) {}
})();
