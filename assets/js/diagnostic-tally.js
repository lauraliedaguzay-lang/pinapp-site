/**
 * Logique d’embed diagnostic (onglets + iframe). Les IDs se configurent dans
 * diagnostic-tally.ids.js (window.PINAPP_TALLY_DIAGNOSTIC).
 */
(function () {
  var PLACEHOLDER = 'TALLY_FORM_ID';
  var BUILTIN = { default: PLACEHOLDER, systeme: '', image: '', duo: '' };
  var U = (typeof window !== 'undefined' && window.PINAPP_TALLY_DIAGNOSTIC) || {};

  function pick(k) {
    var v = U[k];
    if (v !== undefined && v !== null) {
      v = String(v).trim();
      if (v !== '') return v;
    }
    return BUILTIN[k];
  }

  var CFG = {
    default: pick('default'),
    systeme: pick('systeme'),
    image: pick('image'),
    duo: pick('duo'),
  };

  var QUERY = 'alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1';

  function formUrl(id) {
    if (!id || id === PLACEHOLDER) return '';
    return 'https://tally.so/embed/' + encodeURIComponent(id) + '?' + QUERY;
  }

  function resolveId(key) {
    var raw = CFG[key];
    if (raw && raw !== PLACEHOLDER) return raw;
    return CFG.default;
  }

  function setIframeSrc(iframe, key) {
    var id = resolveId(key);
    var url = formUrl(id);
    if (url) iframe.src = url;
  }

  function init() {
    var iframe = document.getElementById('diagnostic-tally-iframe');
    var tabs = document.querySelectorAll('[data-diagnostic-tally-tab]');
    var placeholder = document.getElementById('diagnostic-tally-placeholder');
    var tablist = document.querySelector('.diag-tally-tabs');
    if (!iframe || !tabs.length) return;

    var firstKey = tabs[0].getAttribute('data-diagnostic-tally-tab');
    if (!formUrl(resolveId(firstKey))) {
      if (placeholder) placeholder.hidden = false;
      if (tablist) tablist.setAttribute('hidden', '');
      iframe.setAttribute('hidden', '');
      tabs.forEach(function (btn) {
        btn.setAttribute('disabled', '');
        btn.setAttribute('aria-disabled', 'true');
      });
      return;
    }

    if (placeholder) placeholder.hidden = true;
    if (tablist) tablist.removeAttribute('hidden');
    iframe.removeAttribute('hidden');

    function activate(key) {
      setIframeSrc(iframe, key);
      tabs.forEach(function (btn) {
        var active = btn.getAttribute('data-diagnostic-tally-tab') === key;
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
        btn.classList.toggle('diagnostic-tally-tab--active', active);
      });
    }

    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activate(btn.getAttribute('data-diagnostic-tally-tab'));
      });
    });

    if (firstKey) activate(firstKey);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
