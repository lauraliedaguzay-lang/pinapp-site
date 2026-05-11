/**
 * Pinapp V10 — Lenis + ancres + mini-nav réalisations + jauge circulaire
 */
(function () {
  'use strict';

  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var lenis = null;
  if (!reduced && typeof Lenis !== 'undefined' && !document.documentElement.classList.contains('sober')) {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      touchMultiplier: 1.6
    });
    window.__pinappLenis = lenis;
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  function scrollOffset() {
    if (lenis && typeof lenis.scroll === 'number') return lenis.scroll;
    return window.scrollY || document.documentElement.scrollTop || 0;
  }

  function onScrollOrLenis() {
    var prog = document.getElementById('scroll-progress');
    if (!prog) return;
    var fill = prog.querySelector('.scroll-progress__fill');
    if (!fill) return;
    var scrolled = scrollOffset();
    var total = document.documentElement.scrollHeight - window.innerHeight;
    var pct = total > 0 ? Math.min(scrolled / total, 1) : 0;
    var C = 163.36;
    fill.style.strokeDashoffset = String(C - C * pct);
    prog.classList.toggle('is-visible', scrolled > 280);
  }

  if (lenis) {
    lenis.on('scroll', onScrollOrLenis);
    /* PR #161 — Lenis anime le scroll sans déclencher window 'scroll' ; on réémet pour le pilotage stage (Option B). */
    lenis.on('scroll', function () {
      try {
        window.dispatchEvent(new Event('scroll'));
      } catch (e0) {}
    });
  } else {
    window.addEventListener('scroll', onScrollOrLenis, { passive: true });
  }
  onScrollOrLenis();

  if ('IntersectionObserver' in window) {
    var hook = document.getElementById('hook-film');
    if (hook) {
      new IntersectionObserver(
        function (ents) {
          ents.forEach(function (x) {
            if (x.isIntersecting) hook.classList.add('in-view');
          });
        },
        { threshold: 0.3 }
      ).observe(hook);
    }
  }

  document.addEventListener(
    'click',
    function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || !lenis) return;
      var href = a.getAttribute('href');
      if (!href || href === '#' || href === '#0') return;
      var target = document.querySelector(href);
      if (!target) return;
      if (a.getAttribute('data-lenis-ignore') === 'true') return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -84, lerp: 0.12 });
    },
    true
  );

  var navIds = [
    'realisations-vitrine',
    'realisations-demos',
    'realisations-stack',
    'realisations-films',
    'cinema-artistes',
    'captation-na'
  ];
  if ('IntersectionObserver' in window) {
    var links = document.querySelectorAll('.bloc6-nav__link');
    var navObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var id = en.target.id;
          links.forEach(function (l) {
            l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
          });
        });
      },
      { rootMargin: '-28% 0px -52% 0px', threshold: 0.01 }
    );
    navIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) navObs.observe(el);
    });
  }

  if ('IntersectionObserver' in window) {
    var revealIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) en.target.classList.add('in-view');
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );
    var pack = document.querySelector('.pack-essentiel');
    if (pack) revealIo.observe(pack);
    document.querySelectorAll('.team-figure').forEach(function (fig) {
      revealIo.observe(fig);
    });
  }
})();
