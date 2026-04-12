/* Appliquer le thème avant le premier rendu (évite un flash). */
(function () {
  try {
    var t = localStorage.getItem('pinapp-theme');
    var m = document.getElementById('pinapp-theme-color');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-theme', t);
      if (m) m.setAttribute('content', t === 'light' ? '#E8EEF5' : '#0A0A0A');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (m) m.setAttribute('content', '#0A0A0A');
    }
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
