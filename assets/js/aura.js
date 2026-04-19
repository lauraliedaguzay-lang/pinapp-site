/**
 * Pinapp — lentille AURA (desktop : suivi pointeur ; mobile : bande + gyro optionnel)
 */
(function () {
  var root = document.documentElement;
  var reduced = false;
  try {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}
  if (reduced) return;

  var body = document.body;
  if (!body || !body.classList.contains('aura-stage')) return;

  if (!document.querySelector('.aura-veil')) {
    var veil = document.createElement('div');
    veil.className = 'aura-veil';
    veil.setAttribute('aria-hidden', 'true');
    body.appendChild(veil);
  }

  var isTouch = false;
  try {
    isTouch = window.matchMedia('(pointer: coarse)').matches;
  } catch (e2) {}

  if (!isTouch) {
    var glow = document.querySelector('.aura-lens-glow');
    if (!glow) {
      glow = document.createElement('div');
      glow.className = 'aura-lens-glow';
      glow.setAttribute('aria-hidden', 'true');
      body.appendChild(glow);
    }
  }

  if (isTouch) {
    if (window.DeviceOrientationEvent) {
      window.addEventListener(
        'deviceorientation',
        function (e) {
          var gamma = e.gamma;
          if (typeof gamma !== 'number') return;
          var g = Math.max(-30, Math.min(30, gamma));
          root.style.setProperty('--pp-gyro-x', g * 0.3 + 'px');
        },
        { passive: true }
      );
    }
    return;
  }

  var rafId = null;
  var targetX = window.innerWidth / 2;
  var targetY = window.innerHeight / 2;
  var currentX = targetX;
  var currentY = targetY;

  window.addEventListener(
    'pointermove',
    function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!rafId) rafId = window.requestAnimationFrame(update);
    },
    { passive: true }
  );

  function update() {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    root.style.setProperty('--pp-lens-x', currentX + 'px');
    root.style.setProperty('--pp-lens-y', currentY + 'px');
    var dx = Math.abs(targetX - currentX);
    var dy = Math.abs(targetY - currentY);
    if (dx > 0.15 || dy > 0.15) {
      rafId = window.requestAnimationFrame(update);
    } else {
      rafId = null;
    }
  }

  update();

  try {
    body.classList.add('aura-lens-active');
  } catch (e3) {}

  var veilEl = document.querySelector('.aura-veil');
  var glowEl = document.querySelector('.aura-lens-glow');

  document.addEventListener('pointerleave', function () {
    if (veilEl) veilEl.style.opacity = '1';
    if (glowEl) glowEl.style.opacity = '0';
  });
  document.addEventListener('pointerenter', function () {
    if (veilEl) veilEl.style.removeProperty('opacity');
    if (glowEl) glowEl.style.removeProperty('opacity');
  });
})();
