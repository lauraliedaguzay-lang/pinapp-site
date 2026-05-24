/* Intro Pinapp — assemblage cosmique : des étincelles volent depuis l'espace
   et se posent une à une pour former le logo (poussière d'étoiles -> PINAPP).
   100% canvas 2D (léger, fiable mobile). Réglages perf selon l'appareil. */
(function () {
  var el = document.getElementById('pnp-intro');
  var canvas = document.getElementById('pnp-canvas');
  var wrap = el && el.querySelector('.pnp-logo-wrap');
  if (!el || !canvas || !wrap || !window.__pnpIntro) return;
  var ctx = canvas.getContext && canvas.getContext('2d');
  if (!ctx) { if (window.__pnpIntroKill) window.__pnpIntroKill(); return; }

  var reduce = false;
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var coarse = false;
  try { coarse = matchMedia('(pointer:coarse)').matches; } catch (e) {}

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  function resize() {
    W = el.clientWidth; H = el.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  function reveal() { el.classList.add('pnp-assembled'); }

  // reduced-motion : pas de tempête de particules, on montre direct le logo
  if (reduce) { reveal(); return; }

  var img = new Image();
  img.onload = run;
  img.onerror = function () { reveal(); };
  img.src = '/assets/images/pinapp-logo-trans.png';

  function run() {
    var rect = wrap.getBoundingClientRect();
    var lw = Math.max(40, Math.round(rect.width)), lh = Math.max(20, Math.round(rect.height));
    var ox = rect.left, oy = rect.top;

    var oc = document.createElement('canvas'); oc.width = lw; oc.height = lh;
    var octx = oc.getContext('2d'); octx.drawImage(img, 0, 0, lw, lh);
    var data;
    try { data = octx.getImageData(0, 0, lw, lh).data; } catch (e) { reveal(); return; }

    var step = coarse ? 5 : 3;
    var pts = [];
    for (var y = 0; y < lh; y += step) {
      for (var x = 0; x < lw; x += step) {
        var i = (y * lw + x) * 4;
        if (data[i + 3] > 60) pts.push([ox + x, oy + y, data[i], data[i + 1], data[i + 2]]);
      }
    }
    var CAP = coarse ? 700 : 2200;
    if (pts.length > CAP) {
      for (var k = pts.length - 1; k > 0; k--) { var j = (Math.random() * (k + 1)) | 0; var tmp = pts[k]; pts[k] = pts[j]; pts[j] = tmp; }
      pts.length = CAP;
    }

    var N = pts.length, parts = new Array(N), cx = W / 2, cy = H / 2, far = Math.max(W, H);
    for (var p = 0; p < N; p++) {
      var t = pts[p], ang = Math.random() * Math.PI * 2, rad = far * (0.45 + Math.random() * 0.55);
      parts[p] = {
        sx: cx + Math.cos(ang) * rad, sy: cy + Math.sin(ang) * rad,
        tx: t[0], ty: t[1], r: t[2], g: t[3], b: t[4],
        delay: Math.random() * 0.85, dur: 1.15 + Math.random() * 0.6, sz: 1.3 + Math.random() * 1.9
      };
    }

    var t0 = performance.now(), raf;
    function easeOut(u) { return 1 - Math.pow(1 - u, 3); }
    function frame(now) {
      if (el.getAttribute('data-killed') === '1') { cancelAnimationFrame(raf); return; }
      var e = (now - t0) / 1000, done = true;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (var p = 0; p < N; p++) {
        var a = parts[p], u = (e - a.delay) / a.dur;
        if (u < 0) { done = false; continue; }
        if (u >= 1) u = 1; else done = false;
        var k = easeOut(u);
        var x = a.sx + (a.tx - a.sx) * k, y = a.sy + (a.ty - a.sy) * k;
        var r = (255 * (1 - u) + a.r * u) | 0, g = (233 * (1 - u) + a.g * u) | 0, b = (150 * (1 - u) + a.b * u) | 0;
        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (0.55 + 0.45 * u) + ')';
        ctx.beginPath();
        ctx.arc(x, y, a.sz * (2.0 - 0.9 * u), 0, 6.283);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      if (done) { cancelAnimationFrame(raf); setTimeout(function () { reveal(); fadeCanvas(); }, 260); return; }
      raf = requestAnimationFrame(frame);
    }
    function fadeCanvas() { canvas.style.transition = 'opacity .9s ease'; canvas.style.opacity = '0'; }
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', function () { resize(); });
  }
})();
