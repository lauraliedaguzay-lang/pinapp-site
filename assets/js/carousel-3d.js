/* =====================================================
   CAROUSEL 3D — /realisations/
   3D coverflow · filtres (classiques / univers poussés)
   Molette · trackpad horizontal · swipe · clavier · auto-play
   Pinapp Studio · 2026
   ===================================================== */

class Carousel3D {
  constructor(el) {
    this.el = el;
    this.allCards = [...el.querySelectorAll('.demo-card-3d')];
    this.filterTier = 'all';
    this.current = 0;
    this.dragging = false;
    this.startX = 0;
    this.auto = null;
    this.wheelAccum = 0;
    this.wheelTimeout = null;
    this.hovering = false;
    this.isMobile = window.matchMedia('(max-width: 767px)').matches;
    this.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.lowFx = this.isMobile || this.prefersReduced;
    this.refreshItems();
    if (this.total > 0) this.init();
  }

  refreshItems() {
    this.items = this.allCards.filter(
      (c) => !c.classList.contains('carousel-filter-hidden')
    );
    this.total = this.items.length;
    if (this.current >= this.total) this.current = Math.max(0, this.total - 1);
  }

  scalePos(p) {
    const m = this.isMobile ? 0.52 : 1;
    return {
      x: p.x * m,
      z: p.z * m,
      s: p.s,
      o: p.o,
      b: p.b,
      ry: p.ry,
      rx: p.rx != null ? p.rx : 0,
      zi: p.zi,
    };
  }

  /* Distance au centre : coverflow + léger rotateX (profondeur) */
  pos(diff) {
    const d = Math.max(-2, Math.min(2, diff));
    const map = {
      0: { x: 0, z: 0, s: 1.0, o: 1.0, b: 0, ry: 0, rx: 0, zi: 10 },
      1: { x: 340, z: -200, s: 0.82, o: 0.72, b: 1.5, ry: -16, rx: 5, zi: 8 },
      '-1': { x: -340, z: -200, s: 0.82, o: 0.72, b: 1.5, ry: 16, rx: 5, zi: 8 },
      2: { x: 600, z: -420, s: 0.56, o: 0.35, b: 4, ry: -26, rx: 8, zi: 5 },
      '-2': { x: -600, z: -420, s: 0.56, o: 0.35, b: 4, ry: 26, rx: 8, zi: 5 },
    };
    const raw =
      map[String(d)] ||
      {
        x: diff > 0 ? 900 : -900,
        z: -620,
        s: 0.28,
        o: 0,
        b: 8,
        ry: 0,
        rx: 10,
        zi: 1,
      };
    const p = this.scalePos(raw);
    if (this.prefersReduced) p.rx = 0;
    return p;
  }

  render() {
    this.refreshItems();
    this.allCards.forEach((item) => {
      if (item.classList.contains('carousel-filter-hidden')) return;
      const i = this.items.indexOf(item);
      if (i === -1) return;
      const p = this.pos(i - this.current);
      const b = this.lowFx ? 0 : p.b;
      item.style.cssText = `
        position: absolute;
        left: 50%; top: 50%;
        transform:
          translate(-50%, -50%)
          translateX(${p.x}px)
          translateZ(${p.z}px)
          rotateX(${p.rx}deg)
          rotateY(${p.ry}deg)
          scale(${p.s});
        opacity: ${p.o};
        filter: blur(${b}px);
        z-index: ${p.zi};
        transition:
          transform 460ms cubic-bezier(0.45,0.05,0.55,0.95),
          opacity 380ms ease,
          filter 380ms ease;
        will-change: ${this.lowFx ? 'transform, opacity' : 'transform, opacity, filter'};
        cursor: pointer;
        pointer-events: ${p.o > 0.28 ? 'auto' : 'none'};`;
    });
    this.updateInfo();
    this.updateDots();
  }

  updateInfo() {
    const c = this.items[this.current];
    const info = document.querySelector('.carousel-info');
    if (!info || !c) return;

    info.style.opacity = '0';
    info.style.transform = 'translateY(6px)';
    window.setTimeout(() => {
      const n = info.querySelector('.info-name');
      const s = info.querySelector('.info-style');
      const a = info.querySelector('.info-cta');
      const t = info.querySelector('.info-tag');
      if (n) n.textContent = c.dataset.name || '';
      if (s) s.textContent = c.dataset.style || '';
      if (t) t.textContent = c.dataset.tag || '';
      if (a) {
        a.href = c.dataset.link || '#';
        const isCreative = (c.dataset.tier || '') === 'creative';
        a.textContent = isCreative
          ? 'Découvrir les univers →'
          : 'Ouvrir la vitrine →';
        if (isCreative) {
          a.removeAttribute('target');
          a.removeAttribute('rel');
        } else {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
      }
      info.style.opacity = '1';
      info.style.transform = 'translateY(0)';
    }, 160);
  }

  updateDots() {
    document.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === this.current);
    });
  }

  rebuildDots() {
    const dotsEl = this.el.querySelector('.carousel-dots');
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    this.items.forEach((card, i) => {
      const label = card.dataset.name || `Exemple ${i + 1}`;
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'carousel-dot';
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-selected', i === this.current ? 'true' : 'false');
      d.setAttribute('aria-label', label);
      d.addEventListener('click', () => {
        this.stopAuto();
        this.goTo(i);
      });
      dotsEl.appendChild(d);
    });
  }

  goTo(i) {
    this.refreshItems();
    if (this.total === 0) return;
    this.current = ((i % this.total) + this.total) % this.total;
    this.render();
  }

  next() {
    this.goTo(this.current + 1);
  }
  prev() {
    this.goTo(this.current - 1);
  }

  applyFilter(tier) {
    this.filterTier = tier;
    this.allCards.forEach((card) => {
      const t = card.dataset.tier || 'classic';
      const line = (card.dataset.carouselLine || '').trim();
      let hide = false;
      if (tier === 'beaute') {
        hide = line !== 'beaute';
      } else if (tier === 'all') {
        hide = false;
      } else if (tier === 'perso') {
        hide = t !== 'perso';
      } else {
        hide = t !== tier;
      }
      card.classList.toggle('carousel-filter-hidden', hide);
    });
    document.querySelectorAll('.carousel-filter-btn').forEach((btn) => {
      const t = btn.getAttribute('data-carousel-filter') || 'all';
      const on = t === tier;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    this.current = 0;
    this.refreshItems();
    this.rebuildDots();
    this.render();
  }

  startAuto() {
    this.stopAuto();
    const ms = this.isMobile ? 8000 : 5200;
    this.auto = window.setInterval(() => this.next(), ms);
  }
  stopAuto() {
    if (this.auto) window.clearInterval(this.auto);
    this.auto = null;
  }

  onWheel(e) {
    /* Ne pas bloquer le scroll de page si la souris n’est pas sur la scène */
    if (!this.isMobile && !this.hovering) return;
    const dx = e.deltaX;
    const dy = e.deltaY;
    const dominant = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    if (Math.abs(dominant) < 0.5) return;
    e.preventDefault();
    this.wheelAccum += dominant;
    this.stopAuto();
    if (this.wheelTimeout) window.clearTimeout(this.wheelTimeout);
    this.wheelTimeout = window.setTimeout(() => {
      this.wheelAccum = 0;
    }, 180);
    if (this.wheelAccum > 48) {
      this.next();
      this.wheelAccum = 0;
    } else if (this.wheelAccum < -48) {
      this.prev();
      this.wheelAccum = 0;
    }
  }

  init() {
    this.rebuildDots();
    this.render();

    this.el.querySelector('.carousel-prev')?.addEventListener('click', () => {
      this.stopAuto();
      this.prev();
    });
    this.el.querySelector('.carousel-next')?.addEventListener('click', () => {
      this.stopAuto();
      this.next();
    });

    document.querySelectorAll('.carousel-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tier = btn.getAttribute('data-carousel-filter') || 'all';
        this.stopAuto();
        this.applyFilter(tier);
        const gridAll = document.querySelector('.filter-btn[data-filter="all"]');
        const gridBeaute = document.querySelector('.filter-btn[data-filter="beaute"]');
        const gridPerso = document.querySelector('.filter-btn[data-filter="perso"]');
        if (tier === 'beaute' && gridBeaute) gridBeaute.click();
        else if (tier === 'perso' && gridPerso) gridPerso.click();
        else if (tier === 'all' && gridAll) gridAll.click();
      });
    });

    this.el.addEventListener('click', (e) => {
      const card = e.target.closest('.demo-card-3d');
      if (!card || !this.items.includes(card)) return;
      const idx = this.items.indexOf(card);
      if (idx === this.current && card.dataset.link) {
        const href = card.dataset.link;
        if ((card.dataset.tier || '') === 'creative') {
          window.location.href = href;
        } else {
          window.open(href, '_blank', 'noopener');
        }
      } else if (idx !== -1) {
        this.stopAuto();
        this.goTo(idx);
      }
    });

    const onKey = (e) => {
      if (!this.el.closest('body')) return;
      const region = this.el.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      const visible =
        region.top < vh * 0.92 && region.bottom > vh * 0.08;
      if (!visible) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.stopAuto();
        this.prev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.stopAuto();
        this.next();
      }
    };
    document.addEventListener('keydown', onKey);

    this.el.addEventListener('mouseenter', () => {
      this.hovering = true;
    });
    this.el.addEventListener('mouseleave', () => {
      this.hovering = false;
      this.wheelAccum = 0;
    });
    this.el.addEventListener(
      'wheel',
      (e) => {
        if (this.prefersReduced) return;
        this.onWheel(e);
      },
      { passive: false }
    );

    this.el.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      this.dragging = true;
      this.startX = e.clientX;
      this.stopAuto();
    });
    window.addEventListener('mousemove', (e) => {
      if (!this.dragging) return;
      if (Math.abs(e.clientX - this.startX) > 70) {
        e.clientX < this.startX ? this.next() : this.prev();
        this.dragging = false;
      }
    });
    window.addEventListener('mouseup', () => {
      this.dragging = false;
    });

    let touchStart = 0;
    this.el.addEventListener(
      'touchstart',
      (e) => {
        touchStart = e.touches[0].clientX;
        this.stopAuto();
      },
      { passive: true }
    );
    this.el.addEventListener(
      'touchend',
      (e) => {
        const delta = e.changedTouches[0].clientX - touchStart;
        if (Math.abs(delta) > 45) delta < 0 ? this.next() : this.prev();
      },
      { passive: true }
    );

    const mq = window.matchMedia('(max-width: 767px)');
    mq.addEventListener('change', () => {
      this.isMobile = mq.matches;
      this.lowFx = this.isMobile || this.prefersReduced;
      this.render();
    });

    const canAuto = !this.isMobile && !this.prefersReduced;
    if (canAuto) {
      this.el.addEventListener('mouseenter', () => this.stopAuto());
      this.el.addEventListener('mouseleave', () => this.startAuto());
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.stopAuto();
        else this.startAuto();
      });
      this.startAuto();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.carousel-3d');
  if (!el) return;
  const carousel = new Carousel3D(el);
  window.__pinappCarousel3D = carousel;
  try {
    const filtre = new URLSearchParams(window.location.search).get('filtre');
    if (filtre === 'beaute') {
      document.querySelector('.filter-btn[data-filter="beaute"]')?.click();
    }
  } catch (e) { /* noop */ }
});
