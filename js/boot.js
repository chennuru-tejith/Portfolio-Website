// Runs before first paint: enables reveal animations and applies the saved theme (no flash).
(function () {
  var d = document.documentElement;
  d.classList.add("js");
  try {
    var s = JSON.parse(localStorage.getItem("tejith-pro-v1"));
    if (s && (s.theme === "light" || s.theme === "dark")) d.setAttribute("data-theme", s.theme);
  } catch (e) {}
})();
