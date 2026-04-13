/* Pinapp Inc. — Theme · Nuit par défaut (1re visite) · sync pinapp-mode (pages Pandora) */
(function () {
  var K = 'pinapp-theme',
    h = document.documentElement;
  function get() {
    var s = localStorage.getItem(K);
    if (s === 'light' || s === 'dark') return s;
    var pm = localStorage.getItem('pinapp-mode');
    if (pm === 'jour') return 'light';
    if (pm === 'nuit') return 'dark';
    return 'dark';
  }
  function apply(t) {
    h.setAttribute('data-theme', t);
    try {
      localStorage.setItem(K, t);
      localStorage.setItem('pinapp-mode', t === 'light' ? 'jour' : 'nuit');
    } catch (e) {}
    var b = document.getElementById('theme-toggle');
    if (b) {
      b.textContent = t === 'dark' ? '◐' : '◑';
      b.setAttribute(
        'aria-label',
        t === 'dark' ? 'Passer en mode jour Avatar 2' : 'Passer en mode nuit Pandora',
      );
    }
    // Déclencher event pour particles.js
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: t } }));
  }
  function toggle() {
    apply(h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }
  // Init immédiat avant paint
  apply(get());
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('theme-toggle');
    if (b) b.addEventListener('click', toggle);
  });
})();
