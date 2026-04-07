/* =====================================================
   CAROUSEL 3D — /realisations/
   Drag · Touch · Keyboard · Auto-play
   Pinapp Studio · Avril 2026
   ===================================================== */

class Carousel3D {
  constructor(el) {
    this.el       = el;
    this.items    = [...el.querySelectorAll('.demo-card-3d')];
    this.total    = this.items.length;
    this.current  = 0;
    this.dragging = false;
    this.startX   = 0;
    this.auto     = null;
    if (this.total > 0) this.init();
  }

  /* Position 3D selon la distance au centre */
  pos(diff) {
    const d = Math.max(-2, Math.min(2, diff));
    const map = {
       '0':  { x: 0,    z: 0,    s: 1.00, o: 1.00, b: 0,   ry: 0,   zi: 10 },
       '1':  { x: 340,  z: -180, s: 0.82, o: 0.72, b: 1.5, ry: -12, zi: 8  },
      '-1':  { x: -340, z: -180, s: 0.82, o: 0.72, b: 1.5, ry: 12,  zi: 8  },
       '2':  { x: 580,  z: -380, s: 0.58, o: 0.38, b: 4,   ry: -20, zi: 5  },
      '-2':  { x: -580, z: -380, s: 0.58, o: 0.38, b: 4,   ry: 20,  zi: 5  },
    };
    return map[String(d)] || {
      x: diff > 0 ? 900 : -900, z: -600,
      s: 0.3, o: 0, b: 8, ry: 0, zi: 1
    };
  }

  render() {
    this.items.forEach((item, i) => {
      const p = this.pos(i - this.current);
      item.style.cssText = `
        position: absolute;
        left: 50%; top: 50%;
        transform:
          translate(-50%, -50%)
          translateX(${p.x}px)
          translateZ(${p.z}px)
          rotateY(${p.ry}deg)
          scale(${p.s});
        opacity: ${p.o};
        filter: blur(${p.b}px);
        z-index: ${p.zi};
        transition:
          transform 420ms cubic-bezier(0.45,0.05,0.55,0.95),
          opacity 350ms ease,
          filter 350ms ease;
        will-change: transform, opacity, filter;
        cursor: ${i === this.current ? 'pointer' : 'default'};
        pointer-events: ${p.o > 0.3 ? 'auto' : 'none'};`;
    });
    this.updateInfo();
    this.updateDots();
  }

  updateInfo() {
    const c    = this.items[this.current];
    const info = document.querySelector('.carousel-info');
    if (!info || !c) return;

    info.style.opacity = '0';
    info.style.transform = 'translateY(6px)';
    setTimeout(() => {
      const n = info.querySelector('.info-name');
      const s = info.querySelector('.info-style');
      const a = info.querySelector('.info-cta');
      const t = info.querySelector('.info-tag');
      if (n) n.textContent = c.dataset.name  || '';
      if (s) s.textContent = c.dataset.style || '';
      if (t) t.textContent = c.dataset.tag   || '';
      if (a) a.href        = c.dataset.link  || '#';
      info.style.opacity   = '1';
      info.style.transform = 'translateY(0)';
    }, 160);
  }

  updateDots() {
    document.querySelectorAll('.carousel-dot')
      .forEach((d, i) => d.classList.toggle('active', i === this.current));
  }

  goTo(i) {
    this.current = (i + this.total) % this.total;
    this.render();
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }

  startAuto() {
    this.stopAuto();
    this.auto = setInterval(() => this.next(), 5000);
  }
  stopAuto() { clearInterval(this.auto); this.auto = null; }

  init() {
    this.render();

    // Dots de navigation
    const dotsEl = this.el.querySelector('.carousel-dots');
    if (dotsEl) {
      this.items.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'carousel-dot';
        d.setAttribute('aria-label', `Démo ${i + 1}`);
        d.addEventListener('click', () => { this.stopAuto(); this.goTo(i); });
        dotsEl.appendChild(d);
      });
    }

    // Flèches
    this.el.querySelector('.carousel-prev')
      ?.addEventListener('click', () => { this.stopAuto(); this.prev(); });
    this.el.querySelector('.carousel-next')
      ?.addEventListener('click', () => { this.stopAuto(); this.next(); });

    // Clic sur carte active → ouvrir la démo
    this.el.addEventListener('click', e => {
      const card = e.target.closest('.demo-card-3d');
      if (!card) return;
      const idx = this.items.indexOf(card);
      if (idx === this.current && card.dataset.link) {
        window.open(card.dataset.link, '_blank', 'noopener');
      } else if (idx !== -1) {
        this.stopAuto();
        this.goTo(idx);
      }
    });

    // Clavier
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { this.stopAuto(); this.prev(); }
      if (e.key === 'ArrowRight') { this.stopAuto(); this.next(); }
    });

    // Mouse drag
    this.el.addEventListener('mousedown', e => {
      this.dragging = true;
      this.startX   = e.clientX;
      this.stopAuto();
    });
    window.addEventListener('mousemove', e => {
      if (!this.dragging) return;
      if (Math.abs(e.clientX - this.startX) > 60) {
        e.clientX < this.startX ? this.next() : this.prev();
        this.dragging = false;
      }
    });
    window.addEventListener('mouseup', () => { this.dragging = false; });

    // Touch swipe
    let touchStart = 0;
    this.el.addEventListener('touchstart', e => {
      touchStart = e.touches[0].clientX;
      this.stopAuto();
    }, { passive: true });
    this.el.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].clientX - touchStart;
      if (Math.abs(delta) > 50) delta < 0 ? this.next() : this.prev();
    }, { passive: true });

    // Pause au survol
    this.el.addEventListener('mouseenter', () => this.stopAuto());
    this.el.addEventListener('mouseleave', () => this.startAuto());

    this.startAuto();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.carousel-3d');
  if (el) new Carousel3D(el);
});
