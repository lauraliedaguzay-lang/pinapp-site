(function () {
  var canvas = document.getElementById('canvas-pandora');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var C = ['#00E5B0', '#B388FF', '#7FFFEA', '#E040FB'],
    N = 80,
    L = 100,
    W,
    H,
    pts = [],
    raf;
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
      vx: rand(-0.12, 0.12),
      vy: rand(-0.12, 0.12),
      r: rand(1, 2.4),
      c: C[Math.floor(Math.random() * 4)],
      a: rand(0.3, 0.75),
    };
  }
  function init() {
    resize();
    pts = Array.from({ length: N }, mk);
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x,
          dy = pts[i].y - pts[j].y,
          d = Math.sqrt(dx * dx + dy * dy);
        if (d < L) {
          ctx.beginPath();
          ctx.strokeStyle = pts[i].c;
          ctx.globalAlpha = (1 - d / L) * 0.15;
          ctx.lineWidth = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    pts.forEach(function (p) {
      ctx.globalAlpha = p.a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.fill();
      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      g.addColorStop(0, p.c + '50');
      g.addColorStop(1, p.c + '00');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.globalAlpha = p.a * 0.4;
      ctx.fill();
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
    if (document.hidden) return;
    draw();
    raf = requestAnimationFrame(loop);
  }
  function start() {
    if (!raf) loop();
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
  var obs = new MutationObserver(function () {
    document.documentElement.getAttribute('data-theme') === 'light' ? stop() : start();
  });
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  init();
  if (document.documentElement.getAttribute('data-theme') !== 'light') start();
})();
