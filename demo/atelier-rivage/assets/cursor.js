/* Atelier Rivage · cursor magnétique lerp 0.15 */
(() => {
  if (matchMedia('(max-width: 768px)').matches) return;
  const cursor = document.querySelector('.cursor');
  const dot = document.querySelector('.cursor-dot');
  const label = document.querySelector('.cursor__label');
  if (!cursor || !dot) return;

  let mx = innerWidth / 2, my = innerHeight / 2;
  let cx = mx, cy = my;
  let dx = mx, dy = my;

  addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

  function tick() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    dx += (mx - dx) * 0.55;
    dy += (my - dy) * 0.55;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();

  // Hover state on [data-cursor]
  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest('[data-cursor]');
    if (t) {
      cursor.dataset.state = 'hover';
      if (label) label.textContent = t.dataset.cursor || '';
    }
  });
  document.addEventListener('mouseout', (e) => {
    const t = e.target.closest('[data-cursor]');
    if (t) { cursor.dataset.state = ''; if (label) label.textContent = ''; }
  });
})();
