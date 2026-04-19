/**
 * Pinapp — TRACES : étoiles session + export constellation (silhouette ananas stylisée)
 */
(function () {
  var MAX_STARS = 180;
  var stars = [];
  var canvas;
  var ctx;
  var dpr = 1;
  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function resize() {
    if (!canvas || !ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function addStar(x, y) {
    if (reduced) return;
    if (stars.length >= MAX_STARS) stars.shift();
    stars.push({ x: x, y: y, t: performance.now(), size: 2 + Math.random() * 3 });
  }

  function bindEvents() {
    var isTouch = false;
    try {
      isTouch = window.matchMedia('(pointer: coarse)').matches;
    } catch (e2) {}

    if (isTouch) {
      document.addEventListener(
        'touchstart',
        function (e) {
          var t = e.touches[0];
          if (t) addStar(t.clientX, t.clientY);
        },
        { passive: true }
      );
      var pauseTimer;
      window.addEventListener(
        'scroll',
        function () {
          clearTimeout(pauseTimer);
          pauseTimer = window.setTimeout(function () {
            addStar(window.innerWidth / 2, window.innerHeight / 2 + (Math.random() - 0.5) * 200);
          }, 2100);
        },
        { passive: true }
      );
      return;
    }

    var lastMove = 0;
    var lastX = 0;
    var lastY = 0;
    var accDist = 0;
    var primed = false;

    window.addEventListener(
      'pointermove',
      function (e) {
        if (!primed) {
          lastX = e.clientX;
          lastY = e.clientY;
          primed = true;
          return;
        }
        var now = performance.now();
        var dx = e.clientX - lastX;
        var dy = e.clientY - lastY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        accDist += dist;
        lastX = e.clientX;
        lastY = e.clientY;
        if (accDist > 320 && now - lastMove > 220) {
          addStar(e.clientX, e.clientY);
          accDist = 0;
          lastMove = now;
        }
      },
      { passive: true }
    );

    document.addEventListener(
      'click',
      function (e) {
        addStar(e.clientX, e.clientY);
      },
      { passive: true }
    );
  }

  function draw() {
    if (!ctx || !canvas) return;
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    var now = performance.now();
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var age = now - s.t;
      var alpha = Math.min(1, age / 400) * 0.9;
      var grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 6);
      grad.addColorStop(0, 'rgba(244, 240, 255,' + alpha + ')');
      grad.addColorStop(0.3, 'rgba(166, 127, 255,' + alpha * 0.5 + ')');
      grad.addColorStop(1, 'rgba(139, 95, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(244, 240, 255,' + alpha + ')';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
    window.requestAnimationFrame(draw);
  }

  function pineappleTargets(count, W, H) {
    var pts = [];
    var cx = W / 2;
    var cy = H / 2 + H * 0.08;
    var bodyH = H * 0.48;
    var bodyW = W * 0.26;
    var leafCount = Math.max(3, Math.round(count * 0.22));
    var bodyCount = Math.max(1, count - leafCount);

    for (var i = 0; i < leafCount; i++) {
      var t = leafCount === 1 ? 0.5 : i / (leafCount - 1);
      var angle = (t - 0.5) * 0.95;
      var r = bodyH * 0.35 * (0.75 + 0.25 * Math.sin(i * 1.7 + 1));
      pts.push({
        x: cx + Math.sin(angle) * r * 0.55,
        y: cy - bodyH * 0.42 - r * 0.35,
      });
    }

    var placed = [];
    var rows = 7;
    var cols = 6;
    for (var r = 0; r < rows; r++) {
      for (var k = 0; k < cols; k++) {
        var ox = r % 2 ? 0.5 : 0;
        var x = cx - bodyW / 2 + (k + ox) * (bodyW / (cols - 0.5));
        var y = cy - bodyH / 2 + r * (bodyH / rows);
        placed.push({ x: x, y: y });
      }
    }

    var step = Math.max(1, Math.floor(placed.length / bodyCount));
    for (var j = 0; j < bodyCount; j++) {
      var idx = Math.min(placed.length - 1, j * step);
      pts.push(placed[idx]);
    }

    while (pts.length > count) pts.pop();
    while (pts.length < count && placed.length) {
      pts.push(placed[pts.length % placed.length]);
    }
    return pts.slice(0, count);
  }

  function renderConstellation(cnv) {
    var c = cnv.getContext('2d');
    var W = cnv.width;
    var H = cnv.height;
    var bg = c.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0a0612');
    bg.addColorStop(1, '#120a1e');
    c.fillStyle = bg;
    c.fillRect(0, 0, W, H);

    var n = Math.min(Math.max(stars.length, 8), 60);
    var pineapple = pineappleTargets(n, W, H);

    c.strokeStyle = 'rgba(139, 95, 255, 0.28)';
    c.lineWidth = Math.max(1, W / 960);
    for (var i = 0; i < pineapple.length - 1; i++) {
      c.beginPath();
      c.moveTo(pineapple[i].x, pineapple[i].y);
      c.lineTo(pineapple[i + 1].x, pineapple[i + 1].y);
      c.stroke();
    }

    for (var p = 0; p < pineapple.length; p++) {
      var pt = pineapple[p];
      var grad = c.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 18 * (W / 960));
      grad.addColorStop(0, 'rgba(244, 240, 255, 1)');
      grad.addColorStop(0.25, 'rgba(166, 127, 255, 0.55)');
      grad.addColorStop(1, 'rgba(139, 95, 255, 0)');
      c.fillStyle = grad;
      c.beginPath();
      c.arc(pt.x, pt.y, 18 * (W / 960), 0, Math.PI * 2);
      c.fill();
      c.fillStyle = 'rgba(244, 240, 255, 0.95)';
      c.beginPath();
      c.arc(pt.x, pt.y, 2.2 * (W / 960), 0, Math.PI * 2);
      c.fill();
    }

    c.fillStyle = 'rgba(244, 240, 255, 0.38)';
    c.font = Math.round(14 * (W / 960)) + 'px "JetBrains Mono", ui-monospace, monospace';
    c.fillText('pinapp.fr · ' + new Date().toLocaleDateString('fr-FR'), 20, H - 20);
  }

  function downloadFromModal(sourceCnv) {
    var out = document.createElement('canvas');
    out.width = 1920;
    out.height = 1080;
    renderConstellation(out);
    var a = document.createElement('a');
    a.download = 'pinapp-constellation-' + Date.now() + '.png';
    a.href = out.toDataURL('image/png');
    a.click();
  }

  function openModal() {
    if (document.querySelector('.traces-modal')) return;
    var m = document.createElement('div');
    m.className = 'traces-modal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-labelledby', 'traces-modal-title');
    m.innerHTML =
      '<div class="traces-modal__inner">' +
      '<p style="font-family:var(--pp-font-mono);font-size:var(--pp-fs-tag);letter-spacing:.14em;text-transform:uppercase;color:var(--pp-text-dim);margin:0 0 .5rem;">Votre passage</p>' +
      '<h2 id="traces-modal-title" style="font-family:var(--pp-font-display);font-style:italic;font-weight:400;font-size:var(--pp-fs-h2);color:var(--pp-text);margin:0 0 2rem;">Une constellation, la vôtre</h2>' +
      '<canvas id="traces-export-canvas" width="960" height="540"></canvas>' +
      '<div style="margin-top:2rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">' +
      '<button type="button" class="traces-modal__download" style="padding:.75rem 1.5rem;border-radius:var(--pp-radius-pill);background:var(--pp-purple-bright);border:none;color:var(--pp-bg-deep);font-family:var(--pp-font-mono);font-size:var(--pp-fs-tag);letter-spacing:.12em;text-transform:uppercase;cursor:pointer;">Télécharger</button>' +
      '<button type="button" class="traces-modal__close" style="padding:.75rem 1.5rem;border-radius:var(--pp-radius-pill);background:transparent;border:1px solid var(--pp-border-strong);color:var(--pp-text);font-family:var(--pp-font-mono);font-size:var(--pp-fs-tag);letter-spacing:.12em;text-transform:uppercase;cursor:pointer;">Fermer</button>' +
      '</div></div>';
    document.body.appendChild(m);
    var preview = m.querySelector('#traces-export-canvas');
    renderConstellation(preview);
    m.querySelector('.traces-modal__close').addEventListener('click', function () {
      m.remove();
    });
    m.querySelector('.traces-modal__download').addEventListener('click', function () {
      downloadFromModal(preview);
    });
    m.addEventListener('click', function (ev) {
      if (ev.target === m) m.remove();
    });
    window.requestAnimationFrame(function () {
      m.classList.add('is-open');
    });
  }

  function createExportButton() {
    if (document.querySelector('.traces-export-btn')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'traces-export-btn';
    btn.textContent = 'Emporter votre passage';
    btn.setAttribute('aria-label', 'Télécharger votre constellation personnelle');
    document.body.appendChild(btn);

    function check() {
      if (stars.length >= 8) btn.classList.add('is-ready');
    }
    window.setInterval(check, 1000);
    window.setTimeout(function () {
      btn.classList.add('is-ready');
    }, 30000);

    btn.addEventListener('click', openModal);
  }

  function init() {
    if (reduced) return;
    canvas = document.createElement('canvas');
    canvas.className = 'traces-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    if (!ctx) return;
    resize();
    window.addEventListener('resize', resize, { passive: true });
    bindEvents();
    window.requestAnimationFrame(draw);
    createExportButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
