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
    document.querySelectorAll('.pp-theme-toggle').forEach(function (btn) {
      btn.textContent = t === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', 'Changer de thème');
    });
    // Déclencher event pour particles.js
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: t } }));
  }
  function toggle() {
    apply(h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }
  // Init immédiat avant paint
  apply(get());
  try {
    if (localStorage.getItem('pinapp-neuro-calm') === '1') {
      document.documentElement.setAttribute('data-pinapp-calm', '1');
    }
  } catch (e) {}
  if (!h.dataset.ppThemeThemeJsDeleg) {
    h.dataset.ppThemeThemeJsDeleg = '1';
    document.addEventListener(
      'click',
      function (e) {
        var t = e.target.closest && e.target.closest('.pp-theme-toggle');
        if (!t) return;
        if (window.PinappModeToggle) return;
        e.preventDefault();
        toggle();
      },
      true,
    );
  }
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('theme-toggle');
    if (b) b.addEventListener('click', toggle);
  });
})();

(function loadPinappJourWaves() {
  var scripts = document.getElementsByTagName('script');
  var url = '';
  for (var i = scripts.length - 1; i >= 0; i--) {
    var src = scripts[i].src || '';
    if (/\/theme\.js(\?|$)/i.test(src) || src.endsWith('theme.js')) {
      url = src.replace(/theme\.js(\?[^#]*)?/i, 'pinapp-jour-waves.js$1');
      break;
    }
  }
  if (!url) return;
  var s = document.createElement('script');
  s.src = url;
  s.defer = true;
  document.head.appendChild(s);
})();

(function loadPinappFuturAmbient() {
  if (document.querySelector('script[data-pinapp-futur-ambient]')) return;
  var scripts = document.getElementsByTagName('script');
  var url = '';
  for (var i = scripts.length - 1; i >= 0; i--) {
    var src = scripts[i].src || '';
    if (/\/theme\.js(\?|$)/i.test(src) || src.endsWith('theme.js')) {
      url = src.replace(/theme\.js(\?[^#]*)?/i, 'pinapp-futur-ambient.js$1');
      break;
    }
  }
  if (!url) return;
  var s = document.createElement('script');
  s.src = url;
  s.defer = true;
  s.setAttribute('data-pinapp-futur-ambient', '1');
  document.head.appendChild(s);
})();

(function loadPinappNeuroCalmUi() {
  if (document.querySelector('script[data-pinapp-neuro-calm-ui]')) return;
  var scripts = document.getElementsByTagName('script');
  var url = '';
  for (var i = scripts.length - 1; i >= 0; i--) {
    var src = scripts[i].src || '';
    if (/\/theme\.js(\?|$)/i.test(src) || src.endsWith('theme.js')) {
      url = src.replace(/theme\.js(\?[^#]*)?/i, 'pinapp-neuro-calm-ui.js$1');
      break;
    }
  }
  if (!url) return;
  var s = document.createElement('script');
  s.src = url;
  s.defer = true;
  s.setAttribute('data-pinapp-neuro-calm-ui', '1');
  document.head.appendChild(s);
})();

(function loadPinappUniversal() {
  if (window.__PINAPP_UNIVERSAL__) return;
  window.__PINAPP_UNIVERSAL__ = true;
  if (document.querySelector('script[data-pinapp-universal]')) return;
  var scripts = document.getElementsByTagName('script');
  var url = '';
  for (var i = scripts.length - 1; i >= 0; i--) {
    var src = scripts[i].src || '';
    if (/\/theme\.js(\?|$)/i.test(src) || src.endsWith('theme.js')) {
      url = src.replace(/theme\.js(\?[^#]*)?/i, 'pinapp-universal.js$1');
      break;
    }
  }
  if (!url) url = '/assets/js/pinapp-universal.js?v=1';
  var s = document.createElement('script');
  s.src = url;
  s.defer = true;
  s.setAttribute('data-pinapp-universal', '1');
  document.head.appendChild(s);
})();
