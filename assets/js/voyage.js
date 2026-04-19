/**
 * Pinapp Voyage V2 — Lenis (desktop), ScrollTrigger pins, reveals, floating contact, mode sobre.
 */
(function () {
  var root = document.documentElement;
  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var hc = typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : 8;
  if (hc < 4) root.classList.add('low-perf');

  function plausible(name, props) {
    if (typeof window.plausible !== 'function') return;
    try {
      window.plausible(name, { props: props || {} });
    } catch (e) {}
  }

  function initSober() {
    var btn = document.getElementById('voyage-sober-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var on = root.classList.toggle('voyage-sober');
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      try {
        if (window.__VOYAGE_ST__) window.ScrollTrigger.refresh();
      } catch (e) {}
    });
  }

  function initCookieBanner() {
    try {
      if (localStorage.getItem('pinapp_voyage_cookie_ok')) return;
    } catch (e) {
      return;
    }
    var b = document.getElementById('voyage-cookie');
    if (b) b.classList.add('is-visible');
    var ok = document.getElementById('voyage-cookie-ok');
    if (ok)
      ok.addEventListener('click', function () {
        try {
          localStorage.setItem('pinapp_voyage_cookie_ok', '1');
        } catch (e2) {}
        b.classList.remove('is-visible');
      });
  }

  function initFloatingContact() {
    var el = document.getElementById('voyage-floating-contact');
    if (!el) return;
    var s2 = document.getElementById('s2');
    if (!s2) {
      el.classList.add('is-visible');
      return;
    }
    var io = new IntersectionObserver(
      function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) el.classList.add('is-visible');
        });
      },
      { rootMargin: '0px', threshold: 0.15 }
    );
    io.observe(s2);
  }

  function initReveals() {
    if (reduced) {
      document.querySelectorAll('.reveal').forEach(function (r) {
        r.classList.add('is-revealed');
      });
      return;
    }
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (r) {
        r.classList.add('is-revealed');
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) en.target.classList.add('is-revealed');
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    els.forEach(function (r) {
      io.observe(r);
    });
  }

  function initStats() {
    if (reduced) return;
    var bars = document.querySelectorAll('[data-stat-fill]');
    if (!bars.length) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var t = en.target.getAttribute('data-stat-fill');
          if (t) en.target.style.width = t;
        });
      },
      { threshold: 0.2 }
    );
    bars.forEach(function (b) {
      io.observe(b);
    });
  }

  function initPlanetPanel() {
    var panel = document.getElementById('voyage-real-panel');
    if (!panel) return;
    document.querySelectorAll('.voyage-planet .region').forEach(function (c) {
      function show() {
        var title = c.getAttribute('data-title') || '';
        var href = c.getAttribute('data-href') || '#';
        panel.innerHTML =
          '<strong style="color:var(--cyan-glow)">' +
          title +
          '</strong><br /><a href="' +
          href +
          '" style="color:#fff;margin-top:0.35rem;display:inline-block">' +
          (href.indexOf('http') === 0 ? 'Ouvrir ↗' : 'Voir →') +
          '</a>';
        plausible('realisation_clicked', { name: c.getAttribute('data-realisation') || title });
      }
      c.addEventListener('click', show);
      c.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          show();
        }
      });
    });
  }

  function initLenis() {
    if (reduced) return;
    if (root.classList.contains('voyage-sober')) return;
    if (window.innerWidth < 1024) return;
    if (typeof Lenis === 'undefined') return;
    try {
      var lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
      window.__VOYAGE_LENIS__ = lenis;
      lenis.on('scroll', function () {
        try {
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
        } catch (e2) {}
      });
      if (typeof gsap !== 'undefined' && gsap.ticker) {
        gsap.ticker.add(function (time) {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    } catch (e) {}
  }

  function initScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    window.__VOYAGE_ST__ = true;

    document.querySelectorAll('.voyage-scene').forEach(function (sec, idx) {
      var img = sec.querySelector('.voyage-scene__bg img');
      if (!img || reduced || root.classList.contains('low-perf')) return;
      gsap.fromTo(
        img,
        { scale: 1 },
        {
          scale: 1.12,
          ease: 'none',
          scrollTrigger: {
            trigger: sec,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 70%',
        onEnter: function () {
          plausible('scene_entered', { n: String(idx + 1) });
        },
      });
    });
    ScrollTrigger.refresh();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSober();
    initCookieBanner();
    initFloatingContact();
    initReveals();
    initStats();
    initPlanetPanel();

    if (!reduced) {
      window.requestAnimationFrame(function () {
        initScroll();
        initLenis();
      });
    }

    try {
      var p = new URLSearchParams(window.location.search);
      if (p.get('ref')) {
        document.cookie =
          'pinapp_ref=' + encodeURIComponent(p.get('ref')) + ';path=/;max-age=' + 60 * 60 * 24 * 30;
      }
    } catch (e) {}
  });
})();
