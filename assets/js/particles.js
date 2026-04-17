/* Pinapp — Canvas Pandora V2 · Nuit · 80pt · 4 couleurs · liaisons · halo */
(function () {
  var canvas = document.getElementById('canvas-pandora');
  if (!canvas) return;

  function motionOff() {
    return (
      document.documentElement.getAttribute('data-pinapp-calm') === '1' ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    );
  }

  var ctx = canvas.getContext('2d');
  var C = ['#00E5B0', '#B388FF', '#7FFFEA', '#E040FB'];
  var N = window.innerWidth < 768 ? 35 : 80,
    L = 110,
    W,
    H,
    pts = [],
    raf,
    active = true;

  function resize() {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  }
  function rand(a, b) {
    return Math.random() * (b - a) + a;
  }
  function mk() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      vx: rand(-0.1, 0.1),
      vy: rand(-0.1, 0.1),
      r: rand(1, 2.6),
      c: C[Math.floor(Math.random() * 4)],
      a: rand(0.25, 0.7),
      pulse: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.01, 0.03),
    };
  }
  function init() {
    resize();
    pts = Array.from({ length: N }, mk);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Liaisons
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x,
          dy = pts[i].y - pts[j].y,
          d = Math.sqrt(dx * dx + dy * dy);
        if (d < L) {
          ctx.beginPath();
          ctx.strokeStyle = pts[i].c;
          ctx.globalAlpha = (1 - d / L) * 0.12;
          ctx.lineWidth = 0.4;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    // Points + halo pulsé
    pts.forEach(function (p) {
      p.pulse += p.pulseSpeed;
      var pa = p.a * (0.8 + 0.2 * Math.sin(p.pulse));
      // Halo
      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      g.addColorStop(0, p.c + '60');
      g.addColorStop(1, p.c + '00');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.globalAlpha = pa * 0.35;
      ctx.fill();
      // Point
      ctx.globalAlpha = pa;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.fill();
      // Mouvement
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });
    ctx.globalAlpha = 1;
  }

  function loop() {
    if (document.hidden || !active) return;
    draw();
    raf = requestAnimationFrame(loop);
  }
  function start() {
    if (!raf && active) loop();
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = null;
  }

  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : start();
  });
  window.addEventListener('resize', function () {
    resize();
    pts = Array.from({ length: N }, mk);
  });

  // Sync avec toggle thème
  document.addEventListener('themeChanged', function (e) {
    active = e.detail.theme === 'dark';
    if (motionOff()) {
      stop();
      return;
    }
    active ? start() : stop();
  });
  // Sync MutationObserver fallback
  var obs = new MutationObserver(function () {
    active = document.documentElement.getAttribute('data-theme') !== 'light';
    if (motionOff()) {
      stop();
      return;
    }
    active ? start() : stop();
  });
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'data-pinapp-calm'],
  });

  window.addEventListener('pinapp-neuro-calm-changed', applyMotionState);
  if (window.matchMedia) {
    try {
      window
        .matchMedia('(prefers-reduced-motion: reduce)')
        .addEventListener('change', applyMotionState);
    } catch (e) {
      window.matchMedia('(prefers-reduced-motion: reduce)').addListener(applyMotionState);
    }
  }

  init();
  active = document.documentElement.getAttribute('data-theme') !== 'light';
  applyMotionState();
})();
