/**
 * Pinapp — effets scroll (Lenis + GSAP + ScrollTrigger) + préchargeur + lazy iframes
 * Dépend de : gsap, ScrollTrigger, Lenis (chargés avant ce fichier)
 */
(function () {
  'use strict';

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function gsapRef() {
    return window.gsap;
  }
  function stRef() {
    return window.ScrollTrigger;
  }

  var gsap = gsapRef();
  var ScrollTrigger = stRef();

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

  var siteStarted = false;

  function startSite() {
    if (siteStarted) return;
    siteStarted = true;
    gsap = gsapRef();
    ScrollTrigger = stRef();
    if (gsap && ScrollTrigger) {
      try {
        gsap.registerPlugin(ScrollTrigger);
      } catch (e) {}
    }

    boot();
  }

  /* ── Lazy iframes (IntersectionObserver) — sauf .pp-iframe-eager ── */
  function initLazyIframes() {
    var lazyIframes = document.querySelectorAll('iframe[data-src]');
    if (!lazyIframes.length) return;

    function activate(iframe) {
      var url = iframe.getAttribute('data-src');
      if (!url) return;
      iframe.setAttribute('src', url);
      iframe.removeAttribute('data-src');
    }

    if ('IntersectionObserver' in window) {
      var iframeObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              activate(entry.target);
              iframeObs.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '200px' }
      );
      lazyIframes.forEach(function (iframe) {
        iframeObs.observe(iframe);
      });
    } else {
      lazyIframes.forEach(activate);
    }
  }

  /* ── Préchargeur vortex (sessionStorage, pas si intro plein écran active) ── */
  function hidePreloaderImmediate() {
    var pl = document.getElementById('pp-preloader');
    if (pl) pl.style.display = 'none';
    document.body.classList.add('pp-loaded');
  }

  function initPreloader(onDone) {
    var canvas = document.getElementById('pp-vortex');
    var pl = document.getElementById('pp-preloader');
    if (!canvas || !canvas.getContext || !pl) {
      hidePreloaderImmediate();
      if (typeof onDone === 'function') onDone();
      return;
    }

    var ctx = canvas.getContext('2d');
    if (!ctx) {
      hidePreloaderImmediate();
      if (typeof onDone === 'function') onDone();
      return;
    }

    var g = gsapRef();

    function sizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    sizeCanvas();

    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var particles = [];
    var phase = 1;
    var startTime = Date.now();
    var rafId = 0;

    for (var i = 0; i < 200; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.03 + 0.015,
        size: Math.random() * 2.5 + 0.5,
        orbit: Math.random() * 120 + 20,
        color: Math.random() > 0.5 ? '#00E5B0' : '#5B4FE8',
        alpha: Math.random() * 0.7 + 0.3,
        yFactor: Math.random() * 0.4 + 0.3,
        trail: [],
        x: cx,
        y: cy,
      });
      if (Math.random() > 0.85) particles[i].color = '#ffffff';
    }

    function animate() {
      var elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 1.2 && phase === 1) phase = 2;
      if (elapsed > 2.5 && phase === 2) phase = 3;
      if (elapsed > 3.5 && phase === 3) phase = 4;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (p) {
        p.angle += p.speed;
        if (phase <= 2) {
          p.x = cx + Math.cos(p.angle) * p.orbit;
          p.y = cy + Math.sin(p.angle * 1.5) * p.orbit * p.yFactor;
        } else if (phase === 3) {
          p.orbit += 6;
          p.alpha = Math.max(0, p.alpha - 0.015);
          p.x = cx + Math.cos(p.angle) * p.orbit;
          p.y = cy + Math.sin(p.angle) * p.orbit;
        }

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 6) p.trail.shift();

        p.trail.forEach(function (t, idx) {
          ctx.beginPath();
          ctx.arc(t.x, t.y, p.size * (idx / Math.max(1, p.trail.length)), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * (idx / Math.max(1, p.trail.length)) * 0.2;
          ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      if (phase < 4) {
        rafId = window.requestAnimationFrame(animate);
      }
    }
    animate();

    if (g) {
      g.to('#pp-preloader-logo', {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        delay: 1.3,
      });
      g.to('#pp-preloader', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        delay: 3.5,
        onComplete: function () {
          if (rafId) window.cancelAnimationFrame(rafId);
          pl.style.display = 'none';
          document.body.classList.remove('pp-preloader-active');
          document.body.classList.add('pp-loaded');
          try {
            sessionStorage.setItem('pp-preloader-done', '1');
          } catch (e2) {}
          if (typeof onDone === 'function') onDone();
        },
      });
    } else {
      window.setTimeout(function () {
        if (rafId) window.cancelAnimationFrame(rafId);
        pl.style.display = 'none';
        document.body.classList.remove('pp-preloader-active');
        document.body.classList.add('pp-loaded');
        try {
          sessionStorage.setItem('pp-preloader-done', '1');
        } catch (e3) {}
        if (typeof onDone === 'function') onDone();
      }, 3800);
    }

    window.addEventListener(
      'resize',
      function () {
        sizeCanvas();
        cx = canvas.width / 2;
        cy = canvas.height / 2;
      },
      { passive: true }
    );
  }

  function runPreloaderGate() {
    var pl = document.getElementById('pp-preloader');
    if (!pl) {
      startSite();
      return;
    }

    if (reduceMotion) {
      pl.style.display = 'none';
      document.body.classList.add('pp-loaded');
      try {
        sessionStorage.setItem('pp-preloader-done', '1');
      } catch (e) {}
      startSite();
      return;
    }

    try {
      if (sessionStorage.getItem('pp-preloader-done')) {
        pl.style.display = 'none';
        document.body.classList.add('pp-loaded');
        startSite();
        return;
      }
    } catch (e) {}

    /* Intro plein écran : ne pas empiler deux overlays */
    if (!document.documentElement.classList.contains('pp-intro-skip')) {
      pl.style.display = 'none';
      document.body.classList.add('pp-loaded');
      startSite();
      return;
    }

    document.body.classList.add('pp-preloader-active');
    initPreloader(function () {
      document.body.classList.remove('pp-preloader-active');
      startSite();
    });
  }

  /* ── Curseur (pointer fin) ── */
  function initCursor() {
    if (reduceMotion) return;
    if (window.matchMedia('(pointer:coarse)').matches) return;
    var dot = document.querySelector('.pp-cursor-dot');
    var circle = document.querySelector('.pp-cursor-circle');
    if (!dot || !circle) return;

    document.documentElement.classList.add('pp-custom-cursor');

    var mx = 0;
    var my = 0;
    var dx = 0;
    var dy = 0;
    var cx = 0;
    var cy = 0;
    var label = circle.querySelector('.pp-cursor-circle__label');

    document.addEventListener(
      'mousemove',
      function (e) {
        mx = e.clientX;
        my = e.clientY;
      },
      { passive: true }
    );

    function render() {
      dx += (mx - dx) * 0.15;
      dy += (my - dy) * 0.15;
      dot.style.left = dx + 'px';
      dot.style.top = dy + 'px';

      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      circle.style.left = cx + 'px';
      circle.style.top = cy + 'px';

      window.requestAnimationFrame(render);
    }
    render();

    var targets = 'a, button, [role="button"], input[type="submit"], .pp-cursor-grow, .pp-magnetic';
    document.querySelectorAll(targets).forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        circle.classList.add('hover');
        if (label) label.style.opacity = '1';
      });
      el.addEventListener('mouseleave', function () {
        circle.classList.remove('hover');
        if (label) label.style.opacity = '0';
      });
    });
  }

  /* ── Lenis + ScrollTrigger ── */
  function initLenis() {
    if (reduceMotion) return;
    function startLenis() {
      try {
        var LenisGlobal = window.Lenis;
        if (!LenisGlobal) return;
        var lenis = new LenisGlobal({ duration: 1.2, smoothWheel: true });
        document.documentElement.classList.add('lenis', 'lenis-smooth');
        function raf(time) {
          lenis.raf(time);
          window.requestAnimationFrame(raf);
        }
        window.requestAnimationFrame(raf);
        if (typeof ScrollTrigger !== 'undefined') {
          lenis.on('scroll', ScrollTrigger.update);
        }
        window.__PINAPP_LENIS__ = lenis;
      } catch (e) {
        console.warn('Lenis failed, fallback natif', e);
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
        document.documentElement.classList.remove('lenis', 'lenis-smooth');
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startLenis);
    } else {
      startLenis();
    }
  }

  /* ── Text split par mots ── */
  function initSplit() {
    if (!gsap || !ScrollTrigger || reduceMotion) return;
    document.querySelectorAll('.pp-split').forEach(function (el) {
      if (el.querySelector('*')) return;
      if (el.getAttribute('data-pp-split') === '1') return;
      var text = el.textContent;
      if (!text || !text.trim()) return;
      var words = text.trim().split(/\s+/).filter(Boolean);
      if (!words.length) return;

      el.textContent = '';
      words.forEach(function (w, idx) {
        var span = document.createElement('span');
        span.className = 'pp-word';
        span.textContent = w;
        el.appendChild(span);
        if (idx < words.length - 1) {
          el.appendChild(document.createTextNode(' '));
        }
      });
      el.setAttribute('data-pp-split', '1');

      var wordEls = el.querySelectorAll('.pp-word');
      gsap.set(wordEls, { opacity: 0, y: 30 });
      gsap.to(wordEls, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
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
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.45,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: line, start: 'top 90%', once: true },
        }
      );
    });
  }

  /* ── Parallax léger (.pp-parallax + [data-parallax]) ── */
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

    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var raw = el.getAttribute('data-parallax');
      var speed = parseFloat(raw || '0.1', 10);
      if (isNaN(speed)) speed = 0.1;
      gsap.to(el, {
        y: -100 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
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
      if (i === 0 && list[0].classList && list[0].classList.contains('hero-v6')) continue;
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
    initLazyIframes();
    initCursor();
    initLenis();
    initSplit();
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
    document.addEventListener('DOMContentLoaded', runPreloaderGate);
  } else {
    runPreloaderGate();
  }
})();
