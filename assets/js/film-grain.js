/**
 * Pinapp V3.0 Phase 1 — film grain overlay (~24fps, no scroll).
 */
(function () {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (document.documentElement.classList.contains('voyage-sober')) return;
  } catch (e) {
    return;
  }

  var canvas = document.createElement('canvas');
  canvas.id = 'film-grain';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:fixed;inset:0;pointer-events:none;opacity:0.04;z-index:9998;mix-blend-mode:overlay;';
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var lastFrame = 0;
  var frameInterval = 1000 / 24;

  function resize() {
    try {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    } catch (e2) {}
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function draw(now) {
    if (document.documentElement.classList.contains('voyage-sober')) {
      window.requestAnimationFrame(draw);
      return;
    }
    if (now - lastFrame >= frameInterval) {
      try {
        var w = canvas.width;
        var h = canvas.height;
        if (w > 0 && h > 0) {
          var imgData = ctx.createImageData(w, h);
          var d = imgData.data;
          var i;
          var len = d.length;
          for (i = 0; i < len; i += 4) {
            var v = (Math.random() * 255) | 0;
            d[i] = v;
            d[i + 1] = v;
            d[i + 2] = v;
            d[i + 3] = 255;
          }
          ctx.putImageData(imgData, 0, 0);
        }
      } catch (e3) {}
      lastFrame = now;
    }
    window.requestAnimationFrame(draw);
  }
  window.requestAnimationFrame(draw);

  try {
    var root = document.documentElement;
    var obs = new MutationObserver(function () {
      canvas.style.display = root.classList.contains('voyage-sober') ? 'none' : '';
    });
    obs.observe(root, { attributes: true, attributeFilter: ['class'] });
  } catch (e4) {}
})();
