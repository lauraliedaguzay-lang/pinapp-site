/* Atelier Rivage · loader cinematique progressif */
(() => {
  const loader = document.querySelector('.loader');
  const pctEl = document.querySelector('.loader__pct');
  const bar = document.querySelector('.loader__bar');
  if (!loader) return;

  let displayed = 0;
  let target = 0;
  let texturesReady = false;

  // Tick : displayed rattrape target en lerp
  function tick() {
    displayed += (target - displayed) * 0.08;
    const pct = Math.round(displayed);
    if (pctEl) pctEl.textContent = String(pct).padStart(3, '0');
    if (bar) bar.style.setProperty('--p', (displayed / 100).toFixed(3));
    if (pct >= 99 && texturesReady) {
      loader.dataset.done = 'true';
      window.dispatchEvent(new CustomEvent('atelier:loader-done'));
      return;
    }
    requestAnimationFrame(tick);
  }
  tick();

  // Progressive simulé pendant que Three.js charge les photos
  let sim = 0;
  const simInterval = setInterval(() => {
    sim = Math.min(sim + (Math.random() * 8 + 3), 88);
    if (sim > target) target = sim;
    if (sim >= 88) clearInterval(simInterval);
  }, 180);

  // Real progress from Three loader
  addEventListener('atelier:progress', (e) => {
    target = Math.max(target, Math.round((e.detail?.pct || 0)));
  });
  addEventListener('atelier:loaded', () => {
    texturesReady = true;
    target = 100;
  });

  // Failsafe : 6s max
  setTimeout(() => { texturesReady = true; target = 100; }, 6000);
})();
