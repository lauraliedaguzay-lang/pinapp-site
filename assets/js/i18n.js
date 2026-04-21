/**
 * Pinapp V7 — i18n minimal scaffold
 * ────────────────────────────────────────────────────────────────
 * Lecteur i18n non-intrusif.
 *
 * Attend que Lauralie valide la stratégie URL avant activation :
 *  - Option A : path-based `/fr/` + `/en/` (recommandé, SEO-first)
 *  - Option B : query param `?lang=en` (MVP rapide)
 *  - Option C : détection auto `navigator.language`
 *
 * Pour activer :
 *  1. Ajouter `<script src="/assets/js/i18n.js" defer></script>` dans <head>
 *  2. Sur chaque élément traduisible : `<h1 data-i18n="hero.h1">Le digital qui travaille...</h1>`
 *  3. Les clés suivent la structure de locales/fr.json + locales/en.json
 *
 * NOTE : ce script n'est PAS chargé dans index.html pour l'instant.
 * Zéro effet en l'état actuel. Scaffold prêt pour activation.
 */
(function () {
  'use strict';

  var DEFAULT_LANG = 'fr';
  var SUPPORTED = ['fr', 'en'];
  var cache = {};

  /**
   * Détecte la langue préférée selon priorité :
   * 1. Path /fr/ ou /en/
   * 2. Query param ?lang=en
   * 3. localStorage pinapp.lang
   * 4. navigator.language
   * 5. DEFAULT_LANG
   */
  function detectLang() {
    // Path-based
    var pathMatch = window.location.pathname.match(/^\/(fr|en)(\/|$)/);
    if (pathMatch && SUPPORTED.indexOf(pathMatch[1]) !== -1) return pathMatch[1];

    // Query param
    var query = window.location.search;
    var qMatch = query.match(/[?&]lang=(fr|en)/);
    if (qMatch) return qMatch[1];

    // localStorage
    try {
      var stored = localStorage.getItem('pinapp.lang');
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (e) {}

    // Browser language
    var nav = navigator.language || navigator.userLanguage || '';
    if (nav.toLowerCase().indexOf('fr') === 0) return 'fr';
    if (nav.toLowerCase().indexOf('en') === 0) return 'en';

    return DEFAULT_LANG;
  }

  /**
   * Charge le fichier locale correspondant.
   * Cache en mémoire pour éviter les refetch.
   */
  function loadLocale(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    return fetch('/locales/' + lang + '.json')
      .then(function (r) {
        if (!r.ok) throw new Error('locale fetch failed: ' + r.status);
        return r.json();
      })
      .then(function (data) {
        cache[lang] = data;
        return data;
      });
  }

  /**
   * Résout une clé pointée (ex: "hero.h1") dans l'objet locale.
   */
  function getKey(obj, dotKey) {
    var parts = dotKey.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null || typeof cur !== 'object') return null;
      cur = cur[parts[i]];
    }
    return cur;
  }

  /**
   * Applique les traductions aux éléments [data-i18n].
   * Supporte :
   *  - data-i18n="key.path"              → element.textContent
   *  - data-i18n-html="key.path"         → element.innerHTML (prudent)
   *  - data-i18n-attr="key.path:attr"    → element.setAttribute
   */
  function apply(locale) {
    // textContent
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = getKey(locale, key);
      if (typeof val === 'string') el.textContent = val;
    });

    // innerHTML (si contient entités, <br>, etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      var val = getKey(locale, key);
      if (typeof val === 'string') el.innerHTML = val;
    });

    // Attributs (ex: data-i18n-attr="hero.h1:aria-label")
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var raw = el.getAttribute('data-i18n-attr');
      var parts = raw.split(':');
      if (parts.length !== 2) return;
      var val = getKey(locale, parts[0]);
      if (typeof val === 'string') el.setAttribute(parts[1], val);
    });

    // <html lang> synced
    document.documentElement.setAttribute('lang', locale._meta ? locale._meta.lang : 'fr');
  }

  /**
   * API publique window.pinappI18n
   */
  window.pinappI18n = {
    detectLang: detectLang,
    load: loadLocale,
    apply: apply,
    setLang: function (lang) {
      if (SUPPORTED.indexOf(lang) === -1) return Promise.reject(new Error('unsupported lang'));
      try { localStorage.setItem('pinapp.lang', lang); } catch (e) {}
      return loadLocale(lang).then(apply);
    },
    currentLang: detectLang,
    supportedLangs: SUPPORTED.slice()
  };

  // Auto-init au DOMContentLoaded
  function boot() {
    var lang = detectLang();
    loadLocale(lang).then(apply).catch(function (err) {
      // Silent fail : la page reste dans son état HTML natif (FR)
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[pinapp-i18n] fallback to HTML native lang :', err && err.message);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
