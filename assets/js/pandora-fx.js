/* pandora-fx.js -- Pinapp Studio -- Bioluminescence Pandora */
(function () {
  'use strict';
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const COLS = ['#00E5B0', '#9B6DFF', '#7FFFD4', '#C084FC', '#ADFFF0', '#B8FFEA'];
  const light = () => document.documentElement.dataset.theme === 'light';
  let W,
    H,
    pts = [];
  const N = () => (window.innerWidth < 600 ? 55 : 115);
  class P {
    constructor() {
      this.reset(true);
    }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = -(Math.random() * 0.35 + 0.08);
      this.a = Math.random() * 0.55 + 0.15;
      this.col = COLS[Math.floor(Math.random() * COLS.length)];
      this.t = 0;
      this.max = Math.random() * 400 + 200;
    }
    tick() {
      this.x += this.vx + Math.sin(this.t * 0.012) * 0.18;
      this.y += this.vy;
      this.t++;
      if (this.y < -10 || this.t > this.max) this.reset(false);
    }
    draw() {
      const p = this.t / this.max;
      const a =
        this.a * (p < 0.15 ? p / 0.15 : p > 0.75 ? (1 - p) / 0.25 : 1) * (light() ? 0.45 : 1);
      if (a <= 0) return;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.col;
      ctx.fillStyle = this.col;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function init() {
    resize();
    pts = Array.from({ length: N() }, () => new P());
  }
  function loop() {
    ctx.clearRect(0, 0, W, H);
    const n = N();
    while (pts.length < n) pts.push(new P());
    if (pts.length > n + 10) pts.length = n;
    pts.forEach((p) => {
      p.tick();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize', resize, { passive: true });
  init();
  loop();

  /* Curseur */
  const cur = document.getElementById('cursor');
  if (cur && window.matchMedia('(pointer:fine)').matches) {
    let mx = -100,
      my = -100,
      cx = -100,
      cy = -100;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });
    (function anim() {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      cur.style.transform = `translate(${cx - 10}px,${cy - 10}px)`;
      requestAnimationFrame(anim);
    })();
  }

  /* Progress */
  const bar = document.getElementById('progress');
  if (bar)
    window.addEventListener(
      'scroll',
      () => {
        const s = document.documentElement.scrollTop;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = h > 0 ? (s / h) * 100 + '%' : '0';
      },
      { passive: true },
    );

  /* Theme toggle */
  const btn = document.querySelector('.nav-2026__theme');
  if (btn) {
    const stored = localStorage.getItem('pinapp-theme') || 'dark';
    if (stored === 'light') document.documentElement.dataset.theme = 'light';
    btn.textContent = stored === 'light' ? '☀️' : '🌙';
    btn.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next === 'dark' ? '' : 'light';
      localStorage.setItem('pinapp-theme', next);
      btn.textContent = next === 'light' ? '☀️' : '🌙';
    });
  }

  /* Burger */
  const burger = document.querySelector('.nav-2026__burger');
  const drawer = document.getElementById('navDrawer');
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      const open = drawer.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('aria-hidden', String(!open));
    });
  }

  /* Count-up */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          const end = parseInt(target.dataset.target, 10);
          let cur2 = 0;
          const inc = end / (1600 / 16);
          const id = setInterval(() => {
            cur2 = Math.min(cur2 + inc, end);
            target.textContent = Math.floor(cur2).toLocaleString('fr-FR');
            if (cur2 >= end) clearInterval(id);
          }, 16);
          obs.unobserve(target);
        });
      },
      { threshold: 0.4 },
    );
    document.querySelectorAll('.count-up').forEach((el) => obs.observe(el));
  }

  /* Reveal scroll */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.style.animationPlayState = 'running';
          target.classList.add('is-visible');
          obs.unobserve(target);
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll('.anim-up,.anim-fade,.anim-scale,.formations-2026__reveal')
      .forEach((el) => obs.observe(el));
  }
})();
