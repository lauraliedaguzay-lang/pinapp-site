/**
 * Pinapp V3.0 Phase 2 — golden cursor trail (canvas, desktop + motion ok).
 */
(function () {
  var mqHover;
  var mqReduce;
  try {
    mqHover = window.matchMedia('(hover: hover)');
    mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  } catch (e) {
    return;
  }
  function boot() {
    if (!mqHover.matches || mqReduce.matches) return;
    if (document.documentElement.classList.contains('voyage-sober')) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'cursor-trail-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:100000;width:100%;height:100%;';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var N = 20;
  var particles = [];
  var i;
  for (i = 0; i < N; i++) {
    particles.push({ x: 0, y: 0, tx: 0, ty: 0 });
  }
  var mx = 0;
  var my = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener(
    'mousemove',
    function (e) {
      mx = e.clientX;
      my = e.clientY;
    },
    { passive: true }
  );

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var j;
    for (j = 0; j < particles.length; j++) {
      var p = particles[j];
      p.tx = mx;
      p.ty = my;
      var lag = 0.1 * (1 - j / particles.length);
      p.x += (p.tx - p.x) * lag;
      p.y += (p.ty - p.y) * lag;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, 2 - j * 0.05), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(230,185,115,' + String(0.6 - j * 0.025) + ')';
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    setTimeout(boot, 0);
  }
})();
