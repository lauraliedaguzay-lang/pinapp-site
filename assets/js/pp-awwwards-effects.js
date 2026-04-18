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

  /* ── Préchargeur vortex (sessionStorage uniquement — indépendant de #pp-intro) ── */
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

    var w = canvas.width;
    var h = canvas.height;
    var cx = w / 2;
    var cy = h / 2;

    var stars = [];
    var si;
    for (si = 0; si < 400; si++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1 + 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: 0,
        color: '#ffffff',
      });
    }
    for (si = 0; si < 150; si++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: 1,
        color: '#ffffff',
      });
    }
    for (si = 0; si < 50; si++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.05 + 0.02,
        twinklePhase: Math.random() * Math.PI * 2,
        layer: 2,
        hasCross: Math.random() > 0.6,
        color: Math.random() > 0.7 ? '#00E5B0' : Math.random() > 0.5 ? '#5B4FE8' : '#ffffff',
        vx: 0,
        vy: 0,
      });
    }

    function pickVortexColor() {
      var r = Math.random();
      if (r < 0.4) return '#00E5B0';
      if (r < 0.7) return '#5B4FE8';
      if (r < 0.85) return '#ffffff';
      if (r < 0.95) return '#85B7EB';
      return '#ED93B1';
    }

    var particles = [];
    var pi;
    for (pi = 0; pi < 200; pi++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.018 + 0.008) * 0.55,
        size: Math.random() * 1 + 0.5,
        orbit: Math.random() * 120 + 20,
        color: pickVortexColor(),
        alpha: Math.random() * 0.65 + 0.25,
        yFactor: Math.random() * 0.4 + 0.3,
        trail: [],
        x: cx,
        y: cy,
      });
    }

    var phase = 1;
    var startTime = Date.now();
    var rafId = 0;
    var explodeAt = 3.15;
    var totalEnd = 4.05;
    var bgOpacity = 0;
    var cosmosLoopId = 0;
    var preloaderFinished = false;

    function vortexSpeedMul(elapsed) {
      if (elapsed < 0.5) return 0;
      if (elapsed < 1) return 0.55;
      if (elapsed < 1.5) return 0.72;
      return 0.95;
    }

    function drawNebulaAndBg(t) {
      ctx.fillStyle = '#050A14';
      ctx.fillRect(0, 0, w, h);
      var fade = Math.min(1, t / 0.5) * bgOpacity;
      if (fade <= 0) return;
      var nebula = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.5);
      nebula.addColorStop(0, 'rgba(91, 79, 232, 0.12)');
      nebula.addColorStop(0.4, 'rgba(91, 79, 232, 0.04)');
      nebula.addColorStop(0.7, 'rgba(0, 229, 176, 0.02)');
      nebula.addColorStop(1, 'transparent');
      ctx.globalAlpha = fade;
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    function drawStars(elapsed, time) {
      var explode = phase === 3;
      var iaBoost = elapsed >= 1.5 && elapsed < 2 && !explode;
      var logoBoost = elapsed >= 2.5 && elapsed < 3.1 && !explode;

      stars.forEach(function (s) {
        if (explode && s.layer === 2) {
          if (!s.vx && !s.vy) {
            var ang = Math.random() * Math.PI * 2;
            var sp = 2 + Math.random() * 4;
            s.vx = Math.cos(ang) * sp;
            s.vy = Math.sin(ang) * sp;
          }
          s.x += s.vx;
          s.y += s.vy;
          s.alpha *= 0.92;
          if (s.alpha < 0.02) return;
        }

        var twinkle = Math.sin(time * s.twinkleSpeed + s.twinklePhase) * 0.5 + 0.5;
        var alpha = s.alpha * (0.5 + twinkle * 0.5);
        if (s.layer === 2 && iaBoost) alpha *= 1.35;
        if (s.layer === 2 && logoBoost) alpha = Math.min(1, alpha * 1.5);
        if (explode && s.layer === 0) alpha *= 0.85;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color || '#ffffff';
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.fill();

        if (s.layer === 2 && !explode) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = s.color || '#ffffff';
          ctx.globalAlpha = Math.min(0.35, alpha * 0.12);
          ctx.fill();
        }

        if (s.hasCross && twinkle > 0.7 && s.layer === 2 && !explode) {
          ctx.globalAlpha = Math.min(0.45, alpha * 0.3);
          ctx.strokeStyle = s.color || '#ffffff';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - s.size * 4, s.y);
          ctx.lineTo(s.x + s.size * 4, s.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(s.x, s.y - s.size * 4);
          ctx.lineTo(s.x, s.y + s.size * 4);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      });
    }

    function drawParticles(elapsed, time) {
      if (elapsed < 0.5) return;
      var mul = vortexSpeedMul(elapsed);
      if (phase === 3) mul *= 1.15;

      particles.forEach(function (p) {
        p.angle += p.speed * mul;
        if (phase <= 2) {
          p.x = cx + Math.cos(p.angle) * p.orbit;
          p.y = cy + Math.sin(p.angle * 1.5) * p.orbit * p.yFactor;
        } else if (phase === 3) {
          p.orbit += 5.5;
          p.alpha = Math.max(0, p.alpha - 0.014);
          p.x = cx + Math.cos(p.angle) * p.orbit;
          p.y = cy + Math.sin(p.angle) * p.orbit;
        }

        p.trail.push({ x: p.x, y: p.y, a: p.alpha });
        if (p.trail.length > 10) p.trail.shift();

        p.trail.forEach(function (t, idx) {
          var ratio = idx / Math.max(1, p.trail.length);
          ctx.beginPath();
          ctx.arc(t.x, t.y, p.size * ratio * 1.1, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = t.a * ratio * 0.18;
          ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        if (p.alpha > 0.12) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.globalAlpha = p.alpha * (p.color === '#ffffff' ? 0.14 : 0.08);
          ctx.fillStyle = p.color === '#00E5B0' ? '#00E5B0' : p.color === '#5B4FE8' ? '#5B4FE8' : '#ffffff';
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      });
    }

    function animate() {
      var elapsed = (Date.now() - startTime) / 1000;
      var time = elapsed;
      w = canvas.width;
      h = canvas.height;
      cx = w / 2;
      cy = h / 2;

      if (elapsed < 0.5) {
        bgOpacity = elapsed / 0.5;
      } else {
        bgOpacity = 1;
      }

      if (elapsed >= explodeAt && phase < 3) phase = 3;
      if (elapsed >= totalEnd) phase = 4;

      ctx.clearRect(0, 0, w, h);
      drawNebulaAndBg(elapsed);
      drawStars(elapsed, time);
      drawParticles(elapsed, time);

      if (phase < 4) {
        rafId = window.requestAnimationFrame(animate);
      }
    }
    animate();

    function repositionAllStars() {
      stars.forEach(function (s) {
        s.x = Math.random() * canvas.width;
        s.y = Math.random() * canvas.height;
        if (s.layer === 2) {
          s.vx = 0;
          s.vy = 0;
        }
      });
    }

    function mountCosmosStarfield() {
      if (preloaderFinished) return;
      preloaderFinished = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;

      try {
        canvas.removeAttribute('width');
        canvas.removeAttribute('height');
        canvas.id = 'pp-cosmos-stars';
        canvas.className = 'pp-cosmos-stars';
        canvas.setAttribute('aria-hidden', 'true');
        if (pl.contains(canvas)) pl.removeChild(canvas);
        var pcBg = document.getElementById('pc');
        if (pcBg && pcBg.parentNode) {
          if (pcBg.nextSibling) {
            pcBg.parentNode.insertBefore(canvas, pcBg.nextSibling);
          } else {
            pcBg.parentNode.appendChild(canvas);
          }
        } else {
          document.body.insertBefore(canvas, document.body.firstChild);
        }
        sizeCanvas();
        repositionAllStars();
        canvas.classList.add('pp-cosmos-stars--visible');

        function cosmosOnlyLoop() {
          if (document.documentElement.getAttribute('data-theme') === 'light') {
            canvas.style.display = 'none';
            cosmosLoopId = 0;
            return;
          }
          var w2 = canvas.width;
          var h2 = canvas.height;
          var cx2 = w2 / 2;
          var cy2 = h2 / 2;
          var t = Date.now() / 1000;
          ctx.clearRect(0, 0, w2, h2);
          var nebula2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, Math.min(w2, h2) * 0.48);
          nebula2.addColorStop(0, 'rgba(91, 79, 232, 0.07)');
          nebula2.addColorStop(0.42, 'rgba(91, 79, 232, 0.025)');
          nebula2.addColorStop(0.72, 'rgba(0, 229, 176, 0.018)');
          nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = nebula2;
          ctx.fillRect(0, 0, w2, h2);

          stars.forEach(function (s) {
            if (s.layer !== 0) return;
            var tw = Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.5 + 0.5;
            var al = s.alpha * (0.5 + tw * 0.5);
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = Math.min(1, al * 0.95);
            ctx.fill();
            ctx.globalAlpha = 1;
          });
          cosmosLoopId = window.requestAnimationFrame(cosmosOnlyLoop);
        }
        cosmosOnlyLoop();
      } catch (eM) {
        console.warn('[pp] cosmos starfield mount', eM);
      }
    }

    var logo = document.getElementById('pp-preloader-logo');
    var wordsWrap = document.getElementById('pp-preloader-words');

    if (g && logo) {
      g.set(logo, { opacity: 0, scale: 0.5 });
      document.querySelectorAll('.pp-intro-word').forEach(function (word) {
        var delay = parseInt(word.getAttribute('data-delay'), 10) || 0;
        g.fromTo(
          word,
          { opacity: 0, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
            delay: delay / 1000,
          }
        );
        g.to(word, {
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          ease: 'power2.in',
          delay: delay / 1000 + 0.4,
        });
      });

      var iaWord = document.querySelector('.pp-intro-word--ia');
      if (iaWord) {
        g.to(iaWord, {
          scale: 1.06,
          duration: 0.32,
          ease: 'sine.inOut',
          repeat: 2,
          yoyo: true,
          delay: 1.55,
        });
      }

      if (wordsWrap) {
        g.to(wordsWrap, {
          opacity: 0,
          duration: 0.35,
          delay: 2.65,
        });
      }

      g.to(logo, {
        opacity: 1,
        scale: 1,
        duration: 0.75,
        ease: 'elastic.out(1, 0.5)',
        delay: 2.75,
      });

      g.to('#pp-preloader', {
        opacity: 0,
        duration: 0.55,
        ease: 'power2.inOut',
        delay: 3.5,
        onComplete: function () {
          mountCosmosStarfield();
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
        mountCosmosStarfield();
        pl.style.display = 'none';
        document.body.classList.remove('pp-preloader-active');
        document.body.classList.add('pp-loaded');
        try {
          sessionStorage.setItem('pp-preloader-done', '1');
        } catch (e3) {}
        if (typeof onDone === 'function') onDone();
      }, 4100);
    }

    window.addEventListener(
      'resize',
      function () {
        sizeCanvas();
        cx = canvas.width / 2;
        cy = canvas.height / 2;
        repositionAllStars();
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

    function beginPreloader() {
      document.body.classList.add('pp-preloader-active');
      initPreloader(function () {
        document.body.classList.remove('pp-preloader-active');
        startSite();
      });
    }

    if (!document.documentElement.classList.contains('pp-intro-skip') && document.getElementById('pp-intro')) {
      window.addEventListener('pp-pinapp-intro-done', function onIntroDone() {
        window.removeEventListener('pp-pinapp-intro-done', onIntroDone);
        window.setTimeout(beginPreloader, 0);
      });
    } else {
      beginPreloader();
    }
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

  function splitHasElementChildren(el) {
    for (var c = el.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 1) return true;
    }
    return false;
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
      if (h2.querySelector('.pp-word')) return;
      if (splitHasElementChildren(h2)) return;
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
    console.log('[pp] boot() start');
    gsap = gsapRef();
    ScrollTrigger = stRef();

    autoMarkup();
    initLazyIframes();
    console.log('[pp] autoMarkup + lazy iframes OK');

    /* ── 1. Lenis (synchrone — boot() arrive après DOMContentLoaded si préchargeur) ── */
    if (!reduceMotion) {
      try {
        var LenisGlobal = window.Lenis;
        if (!LenisGlobal) {
          console.warn('[pp] Lenis constructor missing (window.Lenis)');
        } else {
          var lenis = new LenisGlobal({ duration: 1.2, smoothWheel: true });
          document.documentElement.classList.add('lenis', 'lenis-smooth');
          function raf(time) {
            lenis.raf(time);
            window.requestAnimationFrame(raf);
          }
          window.requestAnimationFrame(raf);
          if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger) {
            lenis.on('scroll', ScrollTrigger.update);
          }
          window.__PINAPP_LENIS__ = lenis;
          console.log('[pp] Lenis OK');
        }
      } catch (eLenis) {
        console.warn('[pp] Lenis failed, using native scroll', eLenis);
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
        document.documentElement.classList.remove('lenis', 'lenis-smooth');
      }
    } else {
      console.log('[pp] Lenis skipped (prefers-reduced-motion)');
    }

    if (reduceMotion) {
      document.querySelectorAll('.pp-reveal').forEach(function (el) {
        el.classList.add('revealed');
      });
      document.querySelectorAll('.pp-fade').forEach(function (el) {
        el.classList.add('visible');
      });
      document.querySelectorAll('.pp-line').forEach(function (line) {
        line.style.transform = 'scaleX(1)';
      });
      initCursor();
      initMagnetic();
      try {
        document.body.classList.add('pp-loaded');
      } catch (e) {}
      console.log('[pp] boot() complete (reduced motion)');
      return;
    }

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || !gsap || !ScrollTrigger) {
      console.error('[pp] GSAP or ScrollTrigger missing!');
      document.querySelectorAll('.pp-reveal').forEach(function (el) {
        el.classList.add('revealed');
      });
      document.querySelectorAll('.pp-fade').forEach(function (el) {
        el.classList.add('visible');
      });
      document.querySelectorAll('.pp-line').forEach(function (line) {
        line.style.transform = 'scaleX(1)';
      });
      initCursor();
      initMagnetic();
      try {
        document.body.classList.add('pp-loaded');
      } catch (e2) {}
      return;
    }

    try {
      gsap.registerPlugin(ScrollTrigger);
      console.log('[pp] ScrollTrigger registered');
    } catch (eReg) {
      console.warn('[pp] registerPlugin', eReg);
    }

    /* ── 3. Text split (.pp-split) ── */
    document.querySelectorAll('.pp-split').forEach(function (el) {
      if (el.querySelector('.pp-word')) return;
      if (el.getAttribute('data-pp-split') === '1') return;
      var hasElements = false;
      for (var i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].nodeType === 1) {
          hasElements = true;
          break;
        }
      }
      if (hasElements) return;

      var text = (el.textContent || '').trim();
      if (!text) return;
      var words = text.split(/\s+/).filter(Boolean);
      if (!words.length) return;

      el.innerHTML = words
        .map(function (w) {
          return (
            '<span class="pp-word" style="display:inline-block;opacity:0;transform:translateY(30px)">' +
            w +
            '</span>'
          );
        })
        .join(' ');
      el.setAttribute('data-pp-split', '1');

      gsap.to(el.querySelectorAll('.pp-word'), {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });
    console.log('[pp] Split words total: ' + document.querySelectorAll('.pp-word').length);

    /* ── 4. Reveal (clip + opacité ; .revealed garde le zoom img/vidéo du CSS) ── */
    document.querySelectorAll('.pp-reveal').forEach(function (el) {
      gsap.set(el, { clipPath: 'inset(12% 0% 12% 0%)', opacity: 0.3 });
      gsap.to(el, {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: function () {
            el.classList.add('revealed');
          },
        },
      });
    });

    /* ── 5. Fade ── */
    document.querySelectorAll('.pp-fade').forEach(function (el) {
      gsap.set(el, { opacity: 0, y: 40 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });

    /* ── 6. Lines ── */
    document.querySelectorAll('.pp-line').forEach(function (el) {
      gsap.set(el, { scaleX: 0 });
      gsap.to(el, {
        scaleX: 1,
        duration: 1.5,
        ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    });

    /* ── 7. Parallax ([data-parallax] + .pp-parallax) ── */
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax') || '0.1');
      if (isNaN(speed)) speed = 0.1;
      gsap.to(el, {
        y: -100 * speed,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });
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

    console.log('[pp] All scroll animations initialized');

    initCursor();
    initMagnetic();

    try {
      ScrollTrigger.refresh();
    } catch (eRf) {
      console.warn('[pp] ScrollTrigger.refresh', eRf);
    }

    try {
      document.body.classList.add('pp-loaded');
    } catch (e3) {}
    console.log('[pp] boot() complete');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPreloaderGate);
  } else {
    runPreloaderGate();
  }
})();
