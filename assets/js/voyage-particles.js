/**
 * Canvas particules — page Voyage uniquement (ne pas confondre avec assets/js/particles.js Pandora).
 * Densité élevée, couleurs par scène, morph léger au changement de scène (événement voyage:scene-active).
 */
(function () {
  function pickHue(scene, rnd) {
    var r = rnd();
    if (scene === '1' || scene === '1b') {
      if (r < 0.55) return 168 + rnd() * 18;
      if (r < 0.88) return 265 + rnd() * 25;
      return 38 + rnd() * 22;
    }
    if (scene === '2') {
      if (r < 0.45) return 168 + rnd() * 20;
      if (r < 0.8) return 255 + rnd() * 35;
      return 320 + rnd() * 25;
    }
    if (scene === '3') {
      if (r < 0.5) return 250 + rnd() * 40;
      if (r < 0.82) return 168 + rnd() * 15;
      return 185 + rnd() * 30;
    }
    if (scene === '4') {
      if (r < 0.4) return 168 + rnd() * 18;
      if (r < 0.72) return 300 + rnd() * 35;
      return 38 + rnd() * 25;
    }
    if (scene === '5') {
      if (r < 0.6) return 175 + rnd() * 40;
      if (r < 0.88) return 285 + rnd() * 30;
      return 330 + rnd() * 20;
    }
    if (scene === '6') {
      if (r < 0.5) return 200 + rnd() * 50;
      if (r < 0.85) return 168 + rnd() * 12;
      return 265 + rnd() * 20;
    }
    if (r < 0.65) return 168;
    if (r < 0.9) return 265;
    return 320;
  }

  function ParticleSystem(canvas) {
    if (!canvas || !canvas.getContext) return;
    var self = this;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var scene = canvas.getAttribute('data-scene') || '1';
    var low = document.documentElement.classList.contains('low-perf');
    var base = parseInt(canvas.getAttribute('data-density') || '120', 10);
    var maxCap = low ? 140 : 400;
    var count = Math.min(low ? Math.max(40, Math.floor(base * 0.45)) : base, maxCap);
    var w = 0;
    var h = 0;
    var parts = [];
    var raf = 0;
    var running = false;
    var rnd = Math.random;

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
      var cx = w * 0.5;
      var cy = h * 0.48;
      for (var i = 0; i < count; i++) {
        var ang = rnd() * Math.PI * 2;
        var rad = rnd() * Math.min(w, h) * 0.55;
        parts.push({
          x: cx + Math.cos(ang) * rad * rnd(),
          y: cy + Math.sin(ang) * rad * rnd(),
          r: rnd() * (scene === '5' ? 2.4 : 1.55) + 0.25,
          vx: (rnd() - 0.5) * (scene === '5' ? 2.8 : 0.35),
          vy: (rnd() - 0.5) * (scene === '5' ? 1.1 : 0.35),
          a: rnd() * 0.42 + 0.06,
          hue: pickHue(scene, rnd),
        });
      }
    }

    self.morphBurst = function () {
      if (!parts.length || w < 2) return;
      var cx = w * 0.5;
      var cy = h * 0.5;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        var dx = p.x - cx;
        var dy = p.y - cy;
        var d = Math.sqrt(dx * dx + dy * dy) || 1;
        p.vx += (dx / d) * (1.8 + rnd() * 2.2);
        p.vy += (dy / d) * (1.8 + rnd() * 2.2);
        p.hue = pickHue(scene, rnd);
        p.a = Math.min(0.55, p.a + 0.12);
      }
    };

    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= scene === '5' ? 0.992 : 0.998;
        p.vy *= scene === '5' ? 0.992 : 0.998;
        if (p.x < 0 || p.x > w) p.vx *= -0.92;
        if (p.y < 0 || p.y > h) p.vy *= -0.92;
        if (scene === '5') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(0.45);
          ctx.fillStyle = 'hsla(' + p.hue + ',85%,64%,' + p.a + ')';
          ctx.fillRect(-p.r * 6, -p.r, p.r * 12, p.r * 2);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'hsla(' + p.hue + ',78%,62%,' + p.a + ')';
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    }

    self.start = function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      resize();
      spawn();
      running = true;
      tick();
    };

    self.stop = function () {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    };

    self.boost = function () {
      if (!parts.length || w < 2) return;
      self.morphBurst();
      window.setTimeout(function () {
        spawn();
      }, 220);
    };

    window.addEventListener(
      'resize',
      function () {
        resize();
        spawn();
      },
      { passive: true }
    );

    window.addEventListener(
      'voyage:scene-active',
      function (ev) {
        try {
          var id = ev.detail && ev.detail.sectionId;
          if (!id) return;
          var sec = canvas.closest('.voyage-scene');
          if (!sec || sec.id !== id) return;
          self.morphBurst();
          window.setTimeout(function () {
            spawn();
          }, 280);
        } catch (e) {}
      },
      { passive: true }
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.particles-canvas').forEach(function (cv) {
      var sys = new ParticleSystem(cv);
      cv._voyageParticleSystem = sys;
      sys.start();
    });
  });

  window.pinappParticleBoost = function () {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (document.documentElement.classList.contains('voyage-sober')) return;
    } catch (e0) {
      return;
    }
    document.querySelectorAll('.particles-canvas').forEach(function (cv) {
      var sys = cv._voyageParticleSystem;
      if (!sys || typeof sys.boost !== 'function') return;
      sys.boost();
    });
  };
})();
