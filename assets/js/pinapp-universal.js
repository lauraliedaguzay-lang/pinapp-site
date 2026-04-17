/**
 * Pinapp — comportements globaux : SAV footer, scroll-reveal, fade images,
 * thème pour boutons .theme-toggle (texte), complément burger générique.
 */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function injectFooterSav() {
    var foot =
      document.querySelector('footer#contact') ||
      document.querySelector('footer.footer') ||
      document.querySelector('footer.site-footer') ||
      document.querySelector('body > footer');
    if (!foot || foot.querySelector('.pinapp-support-sav')) return;
    var wrap = document.createElement('div');
    wrap.className = 'pinapp-support-sav';
    wrap.innerHTML =
      '<p class="pinapp-support-sav__label">Support &amp; SAV</p>' +
      '<p class="pinapp-support-sav__body">Un souci ? Nous répondons sous 24h → ' +
      '<a href="mailto:contact@pinapp.fr">contact@pinapp.fr</a></p>';
    foot.appendChild(wrap);
  }

  function initScrollReveal() {
    if (reduce.matches || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.scroll-reveal').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }
    var scrollObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('visible');
          scrollObs.unobserve(e.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' },
    );
    var sel =
      'main section, .card-2026, .pp-founder, [class*="card-2026"], main h2, .hero-2026__ctas';
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.closest('#pp-intro')) return;
      if (el.classList.contains('scroll-reveal')) return;
      el.classList.add('scroll-reveal');
      scrollObs.observe(el);
    });
  }

  function initImgFade() {
    document.querySelectorAll('img').forEach(function (img) {
      if (img.complete && img.naturalHeight > 0) img.classList.add('loaded');
      else
        img.addEventListener(
          'load',
          function () {
            this.classList.add('loaded');
          },
          { once: true },
        );
    });
  }

  function initThemeToggleButtons() {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      if (btn.querySelector('svg')) return;
      var t = document.documentElement.getAttribute('data-theme') || 'dark';
      btn.textContent = t === 'light' ? '🌙' : '☀️';
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') || 'dark';
        var next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        try {
          localStorage.setItem('pinapp-theme', next);
          localStorage.setItem('theme', next);
        } catch (e) {}
        document.querySelectorAll('.theme-toggle').forEach(function (b) {
          if (!b.querySelector('svg')) b.textContent = next === 'light' ? '🌙' : '☀️';
        });
      });
    });
  }

  function run() {
    injectFooterSav();
    initScrollReveal();
    initImgFade();
    initThemeToggleButtons();
    if (!document.querySelector('script[data-pinapp-cookies-banner]')) {
      var cbs = document.createElement('script');
      cbs.src = '/assets/js/pinapp-cookies-banner.js?v=1';
      cbs.defer = true;
      cbs.setAttribute('data-pinapp-cookies-banner', '1');
      document.body.appendChild(cbs);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

(function loadPinappPpThemeToggleUniversal() {
  if (document.querySelector('script[data-pinapp-pp-theme-toggle]')) return;
  if (document.querySelector('script[src*="pp-theme-toggle.js"]')) return;
  var s = document.createElement('script');
  s.src = '/assets/js/pp-theme-toggle.js?v=1';
  s.defer = true;
  s.setAttribute('data-pinapp-pp-theme-toggle', '1');
  document.head.appendChild(s);
})();
