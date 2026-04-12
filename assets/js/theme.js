(function () {
  var K = 'pinapp-theme',
    h = document.documentElement;
  function get() {
    var s = localStorage.getItem(K);
    if (s) return s;
    return window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  }
  function apply(t) {
    h.setAttribute('data-theme', t);
    localStorage.setItem(K, t);
    var b = document.getElementById('theme-toggle');
    if (b) {
      b.textContent = t === 'dark' ? '◐' : '◑';
      b.setAttribute('aria-label', t === 'dark' ? 'Mode jour' : 'Mode nuit');
    }
  }
  function toggle() {
    apply(h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }
  apply(get());
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('theme-toggle');
    if (b) b.addEventListener('click', toggle);
  });
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(K)) apply(e.matches ? 'dark' : 'light');
  });
})();
