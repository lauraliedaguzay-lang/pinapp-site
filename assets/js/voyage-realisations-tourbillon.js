/**
 * P5 — Spiral layout for #s7 réalisations (scroll-driven, GSAP ScrollTrigger).
 * Center mockup + 5 Vimeo preview iframes; burst canvas on click before lightbox.
 */
(function () {
  var root = document.getElementById('voyage-spiral-real');
  if (!root) return;

  var stage = root.querySelector('.voyage-spiral__stage');
  var nodesLayer = root.querySelector('.voyage-spiral__nodes');
  var canvas = root.querySelector('.voyage-spiral__canvas');
  var cards = root.querySelectorAll('.voyage-spiral__card');
  if (!stage || !nodesLayer || !cards.length) return;

  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

  function reducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function sober() {
    return document.documentElement.classList.contains('voyage-sober');
  }

  // Note: we do NOT disable the spiral on low-perf; it should still animate
  // (manual scroll driver fallback if ScrollTrigger isn't usable).
  function lowPerf() {
    return document.documentElement.classList.contains('low-perf');
  }

  function easePower2Out(t) {
    return 1 - (1 - t) * (1 - t);
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = stage.getBoundingClientRect();
    var w = Math.max(1, Math.floor(r.width * dpr));
    var h = Math.max(1, Math.floor(r.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    canvas.style.width = r.width + 'px';
    canvas.style.height = r.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: r.width, h: r.height, dpr: dpr };
  }

  function burstAt(x, y, onDone) {
    if (!ctx || reducedMotion() || sober() || lowPerf()) {
      if (onDone) onDone();
      return;
    }
    var dim = resizeCanvas();
    if (!dim) {
      if (onDone) onDone();
      return;
    }
    var parts = [];
    var n = 40;
    var i;
    for (i = 0; i < n; i++) {
      var ang = (Math.PI * 2 * i) / n + Math.random() * 0.3;
      var sp = 2 + Math.random() * 2.5;
      parts.push({
        x: x,
        y: y,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp - 0.5,
        life: 0,
      });
    }
    var start = performance.now();
    var dur = 520;
    function frame(now) {
      var t = Math.min(1, (now - start) / dur);
      ctx.clearRect(0, 0, dim.w, dim.h);
      var j;
      for (j = 0; j < parts.length; j++) {
        var p = parts[j];
        p.x += p.vx * 1.8;
        p.y += p.vy * 1.8;
        p.vy += 0.06;
        var al = (1 - t) * 0.55;
        ctx.fillStyle = 'rgba(232,166,97,' + al + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, dim.w, dim.h);
        if (onDone) onDone();
      }
    }
    requestAnimationFrame(frame);
  }

  function placeCards(tScroll) {
    var dim = resizeCanvas();
    if (!dim) return;
    var cx = dim.w * 0.5;
    var cy = dim.h * 0.46;
    var maxR = Math.min(400, dim.w * 0.38, dim.h * 0.42);
    var deg720 = Math.PI * 4;

    var k;
    for (k = 0; k < cards.length; k++) {
      var el = cards[k];
      var startTh = k === 0 ? 0 : k * 0.15;
      var u = Math.max(0, Math.min(1, (tScroll - startTh) / (1 - startTh + 0.0001)));
      u = easePower2Out(u);
      var rotDeg = -360 * (1 - u);
      var sc = k === 0 ? 0.35 + 0.65 * u : 0.3 + 0.7 * u;
      var op = k === 0 ? Math.min(1, u * 1.4) : Math.min(1, u * 1.25);

      var x = cx;
      var y = cy;
      if (k > 0) {
        var tk = Math.max(0, Math.min(1, tScroll));
        var r = maxR * (1 - tk);
        var theta = deg720 * tk + (k - 1) * 1.15;
        x = cx + r * Math.cos(theta);
        y = cy + r * Math.sin(theta);
      }

      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.opacity = String(op);
      el.style.transform =
        'translate(-50%, -50%) rotate(' + rotDeg + 'deg) scale(' + sc + ')';
    }
  }

  function hydrateIframes() {
    root.querySelectorAll('iframe[data-src]:not([src])').forEach(function (fr) {
      var u = fr.getAttribute('data-src');
      if (u) fr.setAttribute('src', u);
    });
  }

  function initStatic() {
    root.classList.add('voyage-spiral--static');
    hydrateIframes();
    cards.forEach(function (c) {
      c.style.opacity = '1';
      c.style.left = '';
      c.style.top = '';
      c.style.transform = '';
    });
  }

  function clamp01(v) {
    return Math.min(1, Math.max(0, v));
  }

  function manualProgressForSection(sec) {
    if (!sec) return 0;
    var r = sec.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    var total = Math.max(1, r.height - vh);
    var seen = Math.min(Math.max(-r.top, 0), total);
    return clamp01(seen / total);
  }

  function initManualScrollDriver(sec) {
    var raf = 0;
    function tick() {
      raf = 0;
      placeCards(manualProgressForSection(sec));
    }
    function onScroll() {
      if (raf) return;
      raf = window.requestAnimationFrame(tick);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    tick();
  }

  function initMotion() {
    resizeCanvas();
    placeCards(0);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (ents) {
          ents.forEach(function (en) {
            if (en.isIntersecting) hydrateIframes();
          });
        },
        { rootMargin: '80px', threshold: 0.05 }
      );
      io.observe(root);
    } else {
      hydrateIframes();
    }

    var hoverPause = false;
    nodesLayer.addEventListener(
      'pointerenter',
      function (e) {
        if (e.target && e.target.closest && e.target.closest('.voyage-spiral__card')) {
          hoverPause = true;
        }
      },
      true
    );
    nodesLayer.addEventListener(
      'pointerleave',
      function (e) {
        if (e.target && e.target.closest && e.target.closest('.voyage-spiral__card')) {
          hoverPause = false;
        }
      },
      true
    );

    var s7 = document.getElementById('s7');
    if (!s7) {
      initStatic();
      return;
    }
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Still animate (no pin) if GSAP/ScrollTrigger not available for any reason.
      initManualScrollDriver(s7);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    var proxy = { t: 0 };
    var st = ScrollTrigger.create({
      trigger: s7,
      start: 'top top',
      end: '+=105%',
      scrub: 0.65,
      pin: true,
      anticipatePin: 1,
      onUpdate: function (self) {
        if (hoverPause) return;
        proxy.t = self.progress;
        placeCards(self.progress);
      },
    });

    window.addEventListener(
      'resize',
      function () {
        try {
          ScrollTrigger.refresh();
        } catch (e2) {}
        placeCards(proxy.t);
      },
      { passive: true }
    );

    stage.addEventListener(
      'pointerdown',
      function (ev) {
        var btn = ev.target && ev.target.closest ? ev.target.closest('[data-vimeo-id]') : null;
        if (!btn || !root.contains(btn)) return;
        var rect = btn.getBoundingClientRect();
        var sr = stage.getBoundingClientRect();
        var px = rect.left - sr.left + rect.width * 0.5;
        var py = rect.top - sr.top + rect.height * 0.5;
        burstAt(px, py, null);
      },
      true
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (reducedMotion() || sober() || lowPerf()) {
      initStatic();
      return;
    }
    initMotion();
  });
})();
