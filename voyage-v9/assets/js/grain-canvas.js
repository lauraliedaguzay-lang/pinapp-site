/**
 * Pinapp V11 — grain vivant + RM soft (particules toujours présentes)
 */
(function () {
  'use strict';

  var RM = false;
  try {
    RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var canvas = document.createElement('canvas');
  canvas.id = 'grain-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:fixed;inset:0;z-index:-1;pointer-events:none;width:100%;height:100%';
  document.body.prepend(canvas);

  var ctx = canvas.getContext('2d', { alpha: true });
  var W = 0;
  var H = 0;
  var dpr = 1;
  var particles = [];
  var animating = true;
  var rafId = 0;
  var scrollTimer = null;

  function countParticles() {
    var w = window.innerWidth;
    if (RM) return 40;
    if (w < 390) return 30;
    if (w < 768) return 60;
    if (w < 1024) return 120;
    return 200;
  }

  function motionParams() {
    if (RM) {
      return { speed: 0.03, opacity: 0.04, links: false, fillAlpha: 0.02 };
    }
    return { speed: 0.15, opacity: 0.08, links: true, fillAlpha: 0.06 };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    W = canvas.width;
    H = canvas.height;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function init() {
    var mp = motionParams();
    var n = countParticles();
    var w = window.innerWidth;
    var h = window.innerHeight;
    particles = [];
    var i;
    for (i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * mp.speed,
        vy: (Math.random() - 0.5) * mp.speed,
        r: Math.random() * 1.2 + 0.35
      });
    }
  }

  function tick() {
    if (!animating) return;
    var mp = motionParams();
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    var i;
    var j;
    var p;
    var q;
    var dx;
    var dy;
    var dist;
    var maxD = 88;

    for (i = 0; i < particles.length; i++) {
      p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(230, 185, 115, ' + String(mp.fillAlpha) + ')';
      ctx.fill();

      if (mp.links) {
        for (j = i + 1; j < particles.length; j++) {
          q = particles[j];
          dx = p.x - q.x;
          dy = p.y - q.y;
          dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxD) {
            ctx.strokeStyle =
              'rgba(230, 185, 115,' + String(0.035 * mp.opacity * (1 - dist / maxD)) + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
    }

    rafId = window.requestAnimationFrame(tick);
  }

  function pauseAfterScroll() {
    animating = false;
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(function () {
      animating = true;
      tick();
    }, RM ? 520 : 320);
  }

  window.addEventListener(
    'scroll',
    function () {
      pauseAfterScroll();
    },
    { passive: true }
  );

  window.addEventListener('resize', function () {
    resize();
    init();
  });

  resize();
  init();
  tick();
})();
