/**
 * Pinapp — bootstrap a11y / perf (toutes les pages qui incluent ce script)
 * Skip link, cible #main, lazy images, dns-prefetch Plausible, aria burger / thème
 */
(function () {
  'use strict';

  function dnsPrefetchPlausible() {
    if (document.querySelector('link[rel="dns-prefetch"][href="https://plausible.io"]')) return;
    var l = document.createElement('link');
    l.rel = 'dns-prefetch';
    l.href = 'https://plausible.io';
    document.head.appendChild(l);
  }

  function mainTargetId() {
    if (document.getElementById('main')) return 'main';
    if (document.getElementById('contenu-principal')) return 'contenu-principal';
    if (document.getElementById('contenu')) return 'contenu';
    if (document.getElementById('main-demo')) return 'main-demo';
    var m = document.querySelector('main');
    if (m) {
      if (!m.id) {
        m.id = 'main';
        return 'main';
      }
      return m.id;
    }
    return null;
  }

  function ensureSkipLink() {
    var tid = mainTargetId();
    if (!tid) return;
    var href = '#' + tid;
    var existing = document.querySelector('a.skip-link[href="' + href + '"]');
    if (existing) {
      existing.textContent = 'Aller au contenu principal';
      return;
    }
    var first = document.body && document.body.firstElementChild;
    if (first && first.tagName === 'A' && (first.classList.contains('skip-link') || first.classList.contains('skip'))) {
      first.classList.add('skip-link');
      first.classList.remove('skip');
      first.setAttribute('href', href);
      first.textContent = 'Aller au contenu principal';
      return;
    }
    var a = document.createElement('a');
    a.href = href;
    a.className = 'skip-link';
    a.textContent = 'Aller au contenu principal';
    document.body.insertBefore(a, document.body.firstChild);
  }

  function enhanceImages() {
    document.querySelectorAll('img').forEach(function (img) {
      if (img.closest('#pp-intro')) return;
      if (img.getAttribute('loading')) {
        if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
        if (img.getAttribute('alt') === null) img.setAttribute('alt', '');
        return;
      }
      if (img.getAttribute('fetchpriority') === 'high') {
        img.setAttribute('loading', 'eager');
      } else {
        img.setAttribute('loading', 'lazy');
      }
      if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
      if (img.getAttribute('alt') === null) img.setAttribute('alt', '');
    });
  }

  function navBurgerAria() {
    document.querySelectorAll('.nav__burger').forEach(function (b) {
      if (!b.getAttribute('aria-label')) b.setAttribute('aria-label', 'Ouvrir le menu');
      if (!b.hasAttribute('aria-expanded')) b.setAttribute('aria-expanded', 'false');
    });
  }

  function themeToggleAria() {
    document.querySelectorAll('#theme-toggle, .nav__theme').forEach(function (b) {
      if (!b.getAttribute('aria-label')) b.setAttribute('aria-label', 'Changer de thème');
    });
  }

  function externalLinksRel() {
    document.querySelectorAll('a[href^="http"]').forEach(function (a) {
      try {
        if (a.hostname && a.hostname !== location.hostname) {
          var rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
          if (rel.indexOf('noopener') === -1) rel.push('noopener');
          if (rel.indexOf('noreferrer') === -1) rel.push('noreferrer');
          a.setAttribute('rel', rel.join(' '));
          if (a.getAttribute('target') === '_blank' && !a.getAttribute('aria-label')) {
            var t = (a.textContent || '').trim();
            if (t) a.setAttribute('aria-label', t + ' (ouvre un nouvel onglet)');
          }
        }
      } catch (_e) {}
    });
  }

  function run() {
    if (window.__PINAPP_A11Y_RAN__) return;
    window.__PINAPP_A11Y_RAN__ = true;
    dnsPrefetchPlausible();
    ensureSkipLink();
    enhanceImages();
    navBurgerAria();
    themeToggleAria();
    externalLinksRel();
  }

  window.pinappA11yBootstrapRun = run;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
