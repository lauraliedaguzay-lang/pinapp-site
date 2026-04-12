/* Appliquer le thème avant le premier rendu (évite un flash). */
(function () {
  try {
    var t = localStorage.getItem('pinapp-theme');
    var pm = localStorage.getItem('pinapp-mode');
    var darkOs = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var mode;
    if (t === 'light' || pm === 'jour') mode = 'light';
    else if (t === 'dark' || pm === 'nuit') mode = 'dark';
    else mode = darkOs ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.setAttribute('data-mode', mode === 'light' ? 'jour' : 'nuit');
    var m = document.getElementById('pinapp-theme-color');
    if (m) m.setAttribute('content', mode === 'light' ? '#0a2a2e' : '#080d18');
  } catch (e) {}

  /* Retrait du loader si main.js ne charge pas (404, CSP, erreur) — idempotent avec main.js */
  function dismissLoaderEarly() {
    var loader = document.getElementById('loader');
    if (!loader || loader.dataset.dismissed === '1') return;
    loader.dataset.dismissed = '1';
    loader.classList.add('hidden');
    window.setTimeout(function () {
      if (loader && loader.parentNode) loader.remove();
    }, 300);
  }
  window.addEventListener('load', dismissLoaderEarly);
  function armFailsafe() {
    window.setTimeout(dismissLoaderEarly, 4500);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', armFailsafe);
  } else {
    armFailsafe();
  }
})();
