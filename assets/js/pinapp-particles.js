/**
 * Pinapp Studio — canvas particules (cyan discret type Pandora, pas d’interaction souris)
 * Forcer sur fond toujours sombre : <html data-pinapp-particles="force">
 * Sinon : actif seulement si prefers-color-scheme: dark (cohérent avec l’accueil).
 */
(function () {
  'use strict';

  var doc = document;
  var canvas = doc.getElementById('particles');
  if (!canvas) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var force = doc.documentElement.getAttribute('data-pinapp-particles') === 'force';

  function isDarkScheme() {
    var dt = doc.documentElement.getAttribute('data-theme');
    if (dt === 'light') return false;
    if (dt === 'dark') return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function shouldRun() {
    if (reduced) return false;
    return force || isDarkScheme();
  }

  var ctx = canvas.getContext('2d');
  var particles = [];
  var animId = null;
  var COLOR = '#4fc3f7';
  var SPEED = 0.2;
  var OPACITY = 0.22;
  var COUNT = 72;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initParts() {
    particles = Array.from({ length: COUNT }, function () {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.8,
        vx: (Math.random() - 0.5) * SPEED * 2,
        vy: (Math.random() - 0.5) * SPEED * 2,
      };
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = COLOR;
    ctx.globalAlpha = OPACITY;
    particles.forEach(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function loop() {
    draw();
    animId = requestAnimationFrame(loop);
  }

  function start() {
    if (!shouldRun()) {
      canvas.classList.remove('is-on');
      if (animId) cancelAnimationFrame(animId);
      animId = null;
      return;
    }
    canvas.classList.add('is-on');
    resize();
    initParts();
    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(loop);
  }

  function stop() {
    canvas.classList.remove('is-on');
    if (animId) cancelAnimationFrame(animId);
    animId = null;
  }

  doc.addEventListener('visibilitychange', function () {
    if (doc.hidden) {
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    } else if (shouldRun()) {
      animId = requestAnimationFrame(loop);
    }
  });

  if (!force) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (doc.documentElement.getAttribute('data-theme')) return;
      if (shouldRun()) start();
      else stop();
    });
  }

  function bindModeChange() {
    if (!doc.body) return;
    doc.body.addEventListener('modeChange', function () {
      if (shouldRun()) start();
      else stop();
    });
  }
  if (doc.body) bindModeChange();
  else doc.addEventListener('DOMContentLoaded', bindModeChange);

  window.addEventListener(
    'resize',
    function () {
      if (!shouldRun()) return;
      resize();
      initParts();
    },
    { passive: true },
  );

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
