/* pandora-interactions.js — Pinapp · Interactions bioluminescentes
   Curseur traînée · Glow carte · Compteurs · Scroll indicator
   ================================================================ */

const PandoraInteractions = {
  // ── Curseur traînée 3 points ──────────────────────────────────
  initCursorTrail() {
    if ('ontouchstart' in window) return;
    if (window.innerWidth < 1024) return;

    const trail = [];
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail-dot';
      const size = 6 - i * 1.5;
      dot.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `opacity:${(0.6 - i * 0.18).toFixed(2)}`,
        `transition:left ${80 + i * 60}ms ease,top ${80 + i * 60}ms ease`,
      ].join(';');
      document.body.appendChild(dot);
      trail.push(dot);
    }
    document.addEventListener('mousemove', (e) => {
      trail.forEach((d) => {
        d.style.left = e.clientX + 'px';
        d.style.top = e.clientY + 'px';
      });
    });
  },

  // ── Lumière qui suit le curseur sur les cards ─────────────────
  initCardGlow() {
    if ('ontouchstart' in window) return;
    document.querySelectorAll('.block,.card,[class*="card"]').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (((e.clientX - r.left) / r.width) * 100).toFixed(1);
        const y = (((e.clientY - r.top) / r.height) * 100).toFixed(1);
        card.style.setProperty('--cursor-x', x + '%');
        card.style.setProperty('--cursor-y', y + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--cursor-x', '50%');
        card.style.setProperty('--cursor-y', '50%');
      });
    });
  },

  // ── Scroll indicator avec étoiles ────────────────────────────
  // Note: initCounters() géré par scroll-cinema.js (éviter doublon)
  initScrollIndicator() {
    document.querySelectorAll('.scroll-indicator').forEach((el) => {
      // Ne pas écraser si déjà rempli
      if (el.childElementCount > 0) {
        window.addEventListener(
          'scroll',
          () => {
            el.style.opacity = '0';
            el.style.transition = 'opacity 400ms ease';
          },
          { passive: true, once: true },
        );
        return;
      }
      el.innerHTML = `
        <div class="scroll-chevron">&#8595;</div>
        <div class="scroll-stars">
          <div class="scroll-star"></div>
          <div class="scroll-star"></div>
          <div class="scroll-star"></div>
        </div>`;
      window.addEventListener(
        'scroll',
        () => {
          el.style.opacity = '0';
          el.style.transition = 'opacity 400ms ease';
        },
        { passive: true, once: true },
      );
    });
  },

  init() {
    this.initCursorTrail();
    this.initCardGlow();
    this.initScrollIndicator();
  },
};

document.addEventListener('DOMContentLoaded', () => PandoraInteractions.init());
