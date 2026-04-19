/**
 * Canvas particules simples par scène (densité adaptative + low-perf).
 */
(function () {
  function ParticleSystem(canvas) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var scene = canvas.getAttribute('data-scene') || '1';
    var low = document.documentElement.classList.contains('low-perf');
    var base = parseInt(canvas.getAttribute('data-density') || '60', 10);
    var count = low ? Math.max(12, Math.floor(base / 2)) : base;
    var w = 0;
    var h = 0;
    var parts = [];
    var raf = 0;
    var running = false;

    function resize() {
      var dpr = low ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (w < 1 || h < 1) return;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      parts = [];
      for (var i = 0; i < count; i++) {
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * (scene === '5' ? 2.2 : 1.4) + 0.3,
          vx: (Math.random() - 0.5) * (scene === '5' ? 2.4 : 0.25),
          vy: (Math.random() - 0.5) * (scene === '5' ? 0.8 : 0.25),
          a: Math.random() * 0.45 + 0.08,
          hue: Math.random() < 0.68 ? 168 : Math.random() < 0.9 ? 265 : 320,
        });
      }
    }

    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        if (scene === '5') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(0.4);
          ctx.fillStyle = 'hsla(' + p.hue + ',85%,65%,' + p.a + ')';
          ctx.fillRect(-p.r * 6, -p.r, p.r * 12, p.r * 2);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'hsla(' + p.hue + ',80%,62%,' + p.a + ')';
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    }

    this.start = function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      resize();
      spawn();
      running = true;
      tick();
    };

    this.stop = function () {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    };

    window.addEventListener(
      'resize',
      function () {
        resize();
        spawn();
      },
      { passive: true }
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.particles-canvas').forEach(function (cv) {
      var sys = new ParticleSystem(cv);
      cv._particleSystem = sys;
      sys.start();
    });
  });
})();
