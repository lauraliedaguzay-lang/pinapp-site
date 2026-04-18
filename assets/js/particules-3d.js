/* PINAPP PARTICULES 3D · v1.0
   Canvas 2D avec coordonnée Z simulée. 70 particules avec parallax,
   traînées, connexions réseau, highlight au curseur.
*/
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.getElementById('pp-particules')) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'pp-particules';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  var ctx = canvas.getContext('2d');
  var W;
  var H;
  var dpr = window.devicePixelRatio || 1;
  var particles = [];
  var COUNT = 70;
  var mouse = { x: -1000, y: -1000 };
  var COLORS = [
    'rgba(0, 229, 176, ',
    'rgba(155, 109, 255, ',
    'rgba(255, 107, 157, ',
    'rgba(127, 255, 212, ',
  ];

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function init() {
    particles = [];
    for (var i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        trail: [],
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx * (0.4 + p.z * 0.8);
      p.y += p.vy * (0.4 + p.z * 0.8);

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 6) p.trail.shift();

      var size = 1 + p.z * 2.4;
      var opacity = 0.18 + p.z * 0.55;

      var dx = p.x - mouse.x;
      var dy = p.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        opacity = Math.min(1, opacity + (1 - dist / 140) * 0.5);
        size += (1 - dist / 140) * 1.6;
      }

      for (var t = 0; t < p.trail.length; t++) {
        var tp = p.trail[t];
        var tOpacity = (t / p.trail.length) * opacity * 0.4;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, size * (t / p.trail.length), 0, Math.PI * 2);
        ctx.fillStyle = p.color + tOpacity + ')';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + opacity + ')';
      ctx.fill();

      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var ddx = p.x - p2.x;
        var ddy = p.y - p2.y;
        var dd = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dd < 110) {
          var lineOpacity = (1 - dd / 110) * 0.18 * Math.min(p.z, p2.z);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color + lineOpacity + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener(
    'mousemove',
    function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    },
    { passive: true },
  );
  window.addEventListener('mouseleave', function () {
    mouse.x = -1000;
    mouse.y = -1000;
  });
  window.addEventListener(
    'resize',
    function () {
      resize();
      init();
    },
    { passive: true },
  );

  resize();
  init();
  tick();
})();
