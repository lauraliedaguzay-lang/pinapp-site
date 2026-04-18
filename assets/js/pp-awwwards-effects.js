/**
 * Pinapp — effets scroll (Lenis + GSAP + ScrollTrigger)
 * Dépend de : gsap, ScrollTrigger, Lenis (chargés avant ce fichier)
 */
(function () {
  'use strict';

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var LenisCtor = window.Lenis;

  if (gsap && ScrollTrigger) {
    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (e) {}
  }

  if (document.body) {
    document.body.classList.add('pp-aww-body');
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.classList.add('pp-aww-body');
    });
  }

  /* ── Curseur (pointer fin, pas reduced motion) ── */
  function initCursor() {
    if (reduceMotion) return;
    if (window.matchMedia('(pointer:coarse)').matches) return;
    var dot = document.querySelector('.pp-cursor-dot');
    var circle = document.querySelector('.pp-cursor-circle');
    if (!dot || !circle) return;

    document.documentElement.classList.add('pp-custom-cursor');

    var mx = 0;
    var my = 0;
    var cx = 0;
    var cy = 0;
    var circleSize = 40;

    function setCircleSize(n) {
      circleSize = n;
      circle.style.width = n + 'px';
      circle.style.height = n + 'px';
      circle.dataset.size = String(n);
    }

    document.addEventListener(
      'mousemove',
      function (e) {
        mx = e.clientX;
        my = e.clientY;
        dot.style.transform = 'translate(' + (mx - 3) + 'px,' + (my - 3) + 'px)';
      },
      { passive: true }
    );

    function lerp() {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      var half = circleSize / 2;
      circle.style.transform = 'translate(' + (cx - half) + 'px,' + (cy - half) + 'px)';
      requestAnimationFrame(lerp);
    }
    lerp();

    var targets = 'a, button, [role="button"], input[type="submit"], .pp-cursor-grow';
    document.querySelectorAll(targets).forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        setCircleSize(70);
        circle.style.borderColor = 'rgba(0,229,176,0.48)';
        dot.style.opacity = '0';
      });
      el.addEventListener('mouseleave', function () {
        setCircleSize(40);
        circle.style.borderColor = '';
        dot.style.opacity = '1';
      });
    });
  }

  /* ── Lenis + ScrollTrigger ── */
  function initLenis() {
    if (reduceMotion || !LenisCtor || !gsap || !ScrollTrigger) return;
    try {
      var lenis = new LenisCtor({
        duration: 1.2,
        easing: function (t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        },
        smoothWheel: true,
      });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
      window.__PINAPP_LENIS__ = lenis;
    } catch (e) {}
  }

  /* ── Text split (h2 / titres uniquement, pas d’enfants éléments) ── */
  function initSplit() {
    if (!gsap || !ScrollTrigger || reduceMotion) return;
    document.querySelectorAll('.pp-split').forEach(function (el) {
      if (el.querySelector('*')) return;
      var text = el.textContent;
      if (!text || !text.trim()) return;
      var html = '';
      for (var i = 0; i < text.length; i++) {
        if (text[i] === ' ') html += '<span class="pp-char">&nbsp;</span>';
        else {
          html += '<span class="pp-char" style="display:inline-block">' + text[i] + '</span>';
        }
      }
      el.innerHTML = html;
      el.style.overflow = 'hidden';
      gsap.fromTo(
        el.querySelectorAll('.pp-char'),
        { opacity: 0, yPercent: 92 },
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.58,
          stagger: 0.014,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true,
          },
        }
      );
    });
  }

  /* ── Reveal clip ── */
  function initReveal() {
    if (!ScrollTrigger || reduceMotion) {
      document.querySelectorAll('.pp-reveal').forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }
    document.querySelectorAll('.pp-reveal').forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 84%',
        once: true,
        onEnter: function () {
          el.classList.add('revealed');
        },
      });
    });
  }

  /* ── Fade ── */
  function initFade() {
    if (!ScrollTrigger || reduceMotion) {
      document.querySelectorAll('.pp-fade').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }
    document.querySelectorAll('.pp-fade').forEach(function (el, i) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          var delay = (i % 4) * 90;
          window.setTimeout(function () {
            el.classList.add('visible');
          }, delay);
        },
      });
    });
  }

  /* ── Lignes ── */
  function initLines() {
    if (!gsap || !ScrollTrigger || reduceMotion) {
      document.querySelectorAll('.pp-line').forEach(function (line) {
        line.style.transform = 'scaleX(1)';
      });
      return;
    }
    document.querySelectorAll('.pp-line').forEach(function (line) {
      gsap.to(line, {
        scaleX: 1,
        duration: 1.45,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: line, start: 'top 90%', once: true },
      });
    });
  }

  /* ── Parallax léger ── */
  function initParallax() {
    if (!gsap || !ScrollTrigger || reduceMotion) return;
    document.querySelectorAll('.pp-parallax').forEach(function (img) {
      var par = img.parentElement;
      if (!par) return;
      if (!par.classList.contains('pp-parallax-wrap')) {
        par.classList.add('pp-parallax-wrap');
      }
      gsap.to(img, {
        y: -36,
        ease: 'none',
        scrollTrigger: {
          trigger: par,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      });
    });
  }

  /* ── Magnétique ── */
  function initMagnetic() {
    if (!gsap || window.matchMedia('(pointer:coarse)').matches || reduceMotion) return;
    document.querySelectorAll('.pp-magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.18, y: y * 0.18, duration: 0.28, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.45)' });
      });
    });
  }

  /** Auto-classes (évite des centaines d’éditions HTML) */
  function autoMarkup() {
    var root = document.querySelector('main') || document.getElementById('main');
    if (!root || root.hasAttribute('data-awww-skip')) return;

    document
      .querySelectorAll('.pp-trust-bar, .atelier-v6__card, .pp-testi-card, .pp-pnk-card')
      .forEach(function (el) {
        el.classList.add('pp-fade');
      });

    document.querySelectorAll('.univers-teaser__card[href]').forEach(function (el) {
      el.classList.add('pp-reveal');
    });

    document.querySelectorAll('.atelier-v6__card').forEach(function (el) {
      el.classList.add('pp-reveal');
    });

    document.querySelectorAll('main h2').forEach(function (h2) {
      if (h2.closest('form')) return;
      if (h2.closest('.tdah-modal')) return;
      if (h2.classList.contains('pp-form-title')) return;
      if (h2.classList.contains('no-pp-split')) return;
      if (h2.querySelector('*')) return;
      if (!h2.textContent || h2.textContent.trim().length < 4) return;
      h2.classList.add('pp-split');
    });

    var sections = root.querySelectorAll(':scope > section');
    var list = Array.prototype.slice.call(sections);
    for (var i = 0; i < list.length - 1; i++) {
      var line = document.createElement('div');
      line.className = 'pp-line pp-line--spaced';
      line.setAttribute('aria-hidden', 'true');
      if (typeof list[i].after === 'function') {
        list[i].after(line);
      }
    }

    document.querySelectorAll('.btn--primary, a.drawer__cta, #tdahStickyCta').forEach(function (el) {
      el.classList.add('pp-magnetic');
    });
  }

  function boot() {
    autoMarkup();
    initCursor();
    initLenis();
    initReveal();
    initFade();
    initLines();
    initParallax();
    initMagnetic();
    if (ScrollTrigger && !reduceMotion) {
      try {
        ScrollTrigger.refresh();
      } catch (e) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
