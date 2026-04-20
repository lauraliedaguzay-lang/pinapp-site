/**
 * Pinapp Voyage V2 — Lenis (desktop), ScrollTrigger pin + scrub zoom, GSAP blur-reveal, mode sobre.
 */
(function () {
  var root = document.documentElement;
  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var hc = typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : 8;
  if (hc < 4) root.classList.add('low-perf');

  var mqDesktop = window.matchMedia('(min-width: 1024px)');

  function plausible(name, props) {
    if (typeof window.plausible !== 'function') return;
    try {
      window.plausible(name, { props: props || {} });
    } catch (e) {}
  }

  function killVoyageScroll() {
    try {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(function (st) {
          st.kill();
        });
      }
    } catch (e) {}
    try {
      if (window.__VOYAGE_LENIS__) {
        window.__VOYAGE_LENIS__.destroy();
        window.__VOYAGE_LENIS__ = null;
      }
    } catch (e2) {}
    window.__VOYAGE_ST__ = false;
  }

  function initSober() {
    var btn = document.getElementById('voyage-sober-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var on = root.classList.toggle('voyage-sober');
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on) {
        killVoyageScroll();
        var cinema = document.getElementById('voyage-cinema');
        if (cinema) {
          cinema.hidden = true;
          cinema.querySelectorAll('video').forEach(function (v) {
            try {
              v.pause();
            } catch (e0) {}
          });
        }
        root.classList.remove('voyage-v24-cinema');
        document.querySelectorAll('.reveal').forEach(function (r) {
          r.classList.add('is-revealed');
        });
      } else {
        if (!reduced && document.querySelector('#voyage-main section[data-chapter="11"]')) {
          var cinema2 = document.getElementById('voyage-cinema');
          if (cinema2) {
            cinema2.hidden = false;
            root.classList.add('voyage-v24-cinema');
          }
        }
        window.requestAnimationFrame(function () {
          bootMotion();
          try {
            window.dispatchEvent(new Event('scroll'));
          } catch (e1) {}
        });
      }
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

  function initRevealsFallback() {
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

  function initSceneRevealsGsap() {
    if (reduced || root.classList.contains('voyage-sober') || !mqDesktop.matches) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    document.querySelectorAll('.voyage-scene').forEach(function (sec) {
      var reveals = sec.querySelectorAll('.reveal');
      if (!reveals.length) return;
      gsap.set(reveals, {
        opacity: 0,
        filter: 'blur(36px)',
        y: 60,
        immediateRender: true,
      });
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: 'top 78%',
          end: 'top 35%',
          scrub: false,
          once: true,
        },
      });
      tl.to(reveals, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        stagger: 0.15,
      });
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

  function initPresentationModal() {
    var trigger = document.getElementById('holo-presentation-trigger');
    var modal = document.getElementById('presentation-modal');
    if (!trigger || !modal) return;

    var stage = modal.querySelector('[data-pv-stage]');
    var closeBtn = document.getElementById('presentation-modal-close');
    var lastOpener = trigger;

    var supportsDialog =
      typeof modal.showModal === 'function' && typeof modal.close === 'function';

    function resetStage() {
      if (stage && typeof stage.__pvReset === 'function') {
        try {
          stage.__pvReset();
        } catch (eR) {}
      }
    }

    function openModal(opener) {
      lastOpener = opener || trigger;
      if (supportsDialog) {
        try {
          modal.showModal();
        } catch (e) {
          return;
        }
      } else {
        modal.setAttribute('open', '');
        modal.style.display = 'block';
      }
      document.body.classList.add('is-modal-open');
      resetStage();
      var first = closeBtn || modal.querySelector('[data-pv-overlay], button, a');
      if (first) {
        window.requestAnimationFrame(function () {
          try {
            first.focus();
          } catch (eF) {}
        });
      }
    }

    function closeModal() {
      resetStage();
      if (supportsDialog && modal.open) {
        try {
          modal.close();
        } catch (e2) {}
      } else {
        modal.removeAttribute('open');
        modal.style.display = '';
      }
      document.body.classList.remove('is-modal-open');
      if (lastOpener && typeof lastOpener.focus === 'function') {
        try {
          lastOpener.focus();
        } catch (e3) {}
      }
    }

    function bindOpener(el) {
      if (!el) return;
      el.addEventListener('click', function () {
        openModal(el);
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(el);
        }
      });
    }

    bindOpener(trigger);

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeModal();
      });
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    modal.addEventListener('cancel', function () {
      closeModal();
    });

    var overlay = stage && stage.querySelector('[data-pv-overlay]');
    if (overlay) {
      overlay.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          overlay.click();
        }
      });
    }

    if (!supportsDialog) {
      document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape' && modal.hasAttribute('open')) {
          closeModal();
        }
      });
    }
  }

  function initLenis() {
    if (reduced) return;
    if (root.classList.contains('voyage-sober')) return;
    if (!mqDesktop.matches) return;
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

  function getVoyageBgMotionTarget(sec) {
    var stack = sec.querySelector('.voyage-scene__media-stack');
    if (stack && stack.classList.contains('has-video')) {
      var vid = stack.querySelector('.lieu-bg-video');
      if (vid) return vid;
    }
    var im = sec.querySelector('.voyage-scene__bg img');
    return im || null;
  }

  function initScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (reduced || root.classList.contains('voyage-sober')) return;

    gsap.registerPlugin(ScrollTrigger);
    window.__VOYAGE_ST__ = true;

    try {
      ScrollTrigger.normalizeScroll(true);
    } catch (e) {}

    document.querySelectorAll('.voyage-scene').forEach(function (sec, idx) {
      var img = getVoyageBgMotionTarget(sec);
      var veil = sec.querySelector('.voyage-scene__veil');
      var inner = sec.querySelector('.voyage-scene__inner');

      ScrollTrigger.create({
        trigger: sec,
        start: 'top 70%',
        onEnter: function () {
          plausible('scene_entered', { n: String(idx + 1) });
          try {
            window.dispatchEvent(
              new CustomEvent('voyage:scene-active', { detail: { index: idx + 1, sectionId: sec.id || '' } })
            );
          } catch (e2) {}
        },
      });

      if (root.classList.contains('low-perf')) {
        return;
      }

      if (mqDesktop.matches) {
        var endPin = '+=105%';
        var stZoom = {
          trigger: sec,
          start: 'top top',
          end: endPin,
          scrub: 0.65,
          anticipatePin: 1,
          pin: true,
          pinSpacing: true,
        };
        if (img) {
          gsap.fromTo(img, { scale: 1 }, { scale: 1.3, ease: 'none', scrollTrigger: stZoom });
        }
        if (veil) {
          gsap.fromTo(
            veil,
            { opacity: 0.92 },
            { opacity: 0.55, ease: 'none', scrollTrigger: Object.assign({}, stZoom, { scrub: 0.45 }) }
          );
        }
        if (inner) {
          gsap.fromTo(
            inner,
            { clipPath: 'inset(10% 6% 10% 6% round 12px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power1.out', scrollTrigger: Object.assign({}, stZoom, { scrub: 0.5 }) }
          );
        }
      } else if (img) {
        gsap.fromTo(
          img,
          { scale: 1 },
          {
            scale: 1.18,
            ease: 'none',
            scrollTrigger: {
              trigger: sec,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    });

    ScrollTrigger.refresh();
  }

  function bootMotion() {
    if (root.classList.contains('voyage-sober')) return;
    killVoyageScroll();
    initScroll();
    initLenis();
    var hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    if (hasGsap && mqDesktop.matches && !reduced) {
      initSceneRevealsGsap();
    }
    if (!hasGsap || !mqDesktop.matches || reduced) {
      initRevealsFallback();
    }
    try {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSober();
    initCookieBanner();
    initFloatingContact();
    initStats();
    initPresentationModal();

    if (!reduced && !root.classList.contains('voyage-sober')) {
      window.requestAnimationFrame(function () {
        bootMotion();
      });
    } else {
      initRevealsFallback();
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
