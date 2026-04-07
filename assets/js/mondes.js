/* PINAPP — mondes.js — Grid 15 mondes + Modal
   Utilise mondes-data.js (MONDES doit être chargé avant)
   ============================================================ */

const Mondes = {

  init() {
    if (typeof MONDES === 'undefined') return;
    this.renderGrid('all');
    this.initFiltres();
    this.initModal();
  },

  renderGrid(filtre) {
    const grid = document.getElementById('mondes-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const data = filtre === 'all'
      ? MONDES
      : MONDES.filter(m => m.filtres.includes(filtre));

    data.forEach((monde, i) => {
      const card = this.createCard(monde);
      grid.appendChild(card);
      setTimeout(() => card.classList.add('visible'), i * 55);
    });
  },

  createCard(monde) {
    const card = document.createElement('div');
    card.className = 'monde-card';
    card.dataset.id = monde.id;

    const rgb1 = this.hexRgb(monde.accent1);
    card.style.cssText = `
      background:
        linear-gradient(135deg, rgba(${rgb1},0.13) 0%, rgba(${rgb1},0.05) 40%, transparent 70%),
        ${monde.glassmorphism};
      backdrop-filter:blur(40px) saturate(180%);
      -webkit-backdrop-filter:blur(40px) saturate(180%);
      border:1px solid ${monde.border};
      box-shadow:inset 0 1px 0 rgba(255,255,255,0.12),0 20px 40px rgba(0,0,0,0.28);`;

    const preview = document.createElement('div');
    preview.className = 'monde-preview';
    preview.style.background = monde.fond;
    const canvas = document.createElement('canvas');
    preview.appendChild(canvas);
    this.drawPreview(canvas, monde);

    const isDark = this.isDark(monde.fond);
    const body = document.createElement('div');
    body.className = 'monde-body';
    body.innerHTML = `
      <span class="monde-emoji">${monde.emoji}</span>
      <h3 class="monde-nom">${monde.nom}</h3>
      <p class="monde-tagline">"${monde.tagline}"</p>
      <span class="monde-clients" style="color:${monde.accent1}">${monde.clients}</span>
      <div class="monde-footer">
        <span class="monde-prix">À partir de ${monde.prix}</span>
        <button class="monde-btn"
          style="background:${monde.accent1};color:${isDark?'#fff':'#111'}">
          Voir →
        </button>
      </div>`;

    card.appendChild(preview);
    card.appendChild(body);
    card.addEventListener('click', () => this.openModal(monde));
    return card;
  },

  drawPreview(canvas, monde) {
    const parent = canvas.parentElement;
    const W = parent.offsetWidth || 320;
    const H = 100;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    const colors = [monde.accent1, monde.accent2, monde.accent3].filter(Boolean);
    const positions = [{x:0.25,y:0.50},{x:0.75,y:0.45},{x:0.50,y:0.80}];

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = monde.fond;
      ctx.fillRect(0, 0, W, H);

      positions.forEach((pos, i) => {
        if (!colors[i]) return;
        const rgb = this.hexRgb(colors[i]);
        const px = W * (pos.x + Math.sin(t * 0.012 + i) * 0.06);
        const py = H * (pos.y + Math.cos(t * 0.015 + i) * 0.08);
        const alpha = 0.55 + Math.sin(t * 0.018 + i) * 0.12;
        const g = ctx.createRadialGradient(px, py, 0, px, py, W * 0.40);
        g.addColorStop(0, `rgba(${rgb},${alpha})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });
      t++;
      requestAnimationFrame(draw);
    };
    draw();
  },

  initFiltres() {
    document.querySelectorAll('.filtre-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.filtre-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.renderGrid(pill.dataset.filtre);
      });
    });
  },

  initModal() {
    document.getElementById('modal-close')
      ?.addEventListener('click', () => this.closeModal());

    document.getElementById('monde-modal')
      ?.addEventListener('click', e => {
        if (e.target.id === 'monde-modal') this.closeModal();
      });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closeModal();
    });

    let touchStartY = 0;
    const modal = document.getElementById('monde-modal');
    modal?.addEventListener('touchstart', e => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    modal?.addEventListener('touchend', e => {
      if (e.changedTouches[0].clientY - touchStartY > 80) this.closeModal();
    }, { passive: true });
  },

  openModal(monde) {
    const modal   = document.getElementById('monde-modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;

    const rgb1   = this.hexRgb(monde.accent1);
    const isDark = this.isDark(monde.fond);

    content.style.cssText = `
      background:
        linear-gradient(135deg, rgba(${rgb1},0.14) 0%, rgba(${rgb1},0.06) 40%, transparent 70%),
        ${monde.glassmorphism};
      backdrop-filter:blur(60px);
      -webkit-backdrop-filter:blur(60px);
      border:1px solid ${monde.border};`;

    const palette = [monde.fond, monde.accent1, monde.accent2, monde.accent3]
      .filter(Boolean)
      .map(c => `<div style="width:44px;height:44px;border-radius:50%;background:${c};
        box-shadow:0 4px 12px rgba(0,0,0,0.25),0 0 0 1px rgba(255,255,255,0.08);"></div>`)
      .join('');

    content.innerHTML = `
      <div style="text-align:center;margin-bottom:36px;">
        <div style="font-size:48px;margin-bottom:12px;">${monde.emoji}</div>
        <h2 style="font-family:Georgia,serif;font-size:clamp(32px,5vw,56px);font-weight:300;
                   color:${monde.texte||'var(--text)'};margin:0 0 8px;">${monde.nom}</h2>
        <p style="font-style:italic;color:${monde.accent1};font-size:16px;">"${monde.tagline}"</p>
      </div>

      <p style="font-size:16px;line-height:1.85;color:var(--text-2);text-align:center;
                max-width:520px;margin:0 auto 32px;">${monde.description}</p>

      <div style="display:flex;gap:12px;justify-content:center;margin-bottom:32px;">${palette}</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:32px;">
        <div class="modal-info-block">
          <p class="modal-info-label" style="color:${monde.accent1}">INSPIRÉ PAR</p>
          <p class="modal-info-value">${monde.inspire}</p>
        </div>
        <div class="modal-info-block">
          <p class="modal-info-label" style="color:${monde.accent1}">POUR QUI</p>
          <p class="modal-info-value">${monde.clients}</p>
        </div>
        <div class="modal-info-block">
          <p class="modal-info-label" style="color:${monde.accent1}">EFFET SIGNATURE</p>
          <p class="modal-info-value">${monde.effet}</p>
        </div>
        <div class="modal-info-block">
          <p class="modal-info-label" style="color:${monde.accent1}">VOS CLIENTS RESSENTENT</p>
          <p class="modal-info-value" style="font-family:Georgia,serif;font-style:italic;font-size:15px;">
            ${monde.emotion}
          </p>
        </div>
      </div>

      <blockquote style="border-left:2px solid ${monde.accent1};padding-left:18px;
        margin:0 0 32px;font-style:italic;color:var(--text-3);font-size:14px;">
        ${monde.demo_temoignage}
        <span style="display:block;margin-top:4px;font-size:10px;font-style:normal;
                     letter-spacing:0.08em;opacity:0.6;">FICTIF — DÉMO</span>
      </blockquote>

      <div style="text-align:center;">
        <p style="font-family:Georgia,serif;font-size:30px;color:var(--text);margin-bottom:4px;">
          ${monde.prix}
        </p>
        <p style="font-size:13px;color:var(--text-3);margin-bottom:28px;">
          Livraison en ${monde.delai}
        </p>
        <a href="../diagnostic/index.html?univers=${encodeURIComponent(monde.nom)}"
           style="display:inline-block;padding:15px 40px;
                  background:${monde.accent1};color:${isDark?'#fff':'#111'};
                  border-radius:100px;text-decoration:none;
                  font-size:15px;font-weight:500;
                  box-shadow:0 0 28px rgba(${rgb1},0.40);">
          Je veux cet univers →
        </a>
      </div>`;

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    document.querySelector('.modal-inner')?.scrollTo(0, 0);
  },

  closeModal() {
    const modal = document.getElementById('monde-modal');
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  },

  hexRgb(hex) {
    if (!hex?.startsWith('#')) return '255,255,255';
    return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
  },

  isDark(hex) {
    if (!hex?.startsWith('#')) return true;
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
  }
};

/* Inject modal info block styles */
(function() {
  const s = document.createElement('style');
  s.textContent = `
    .modal-info-block{padding:18px;border-radius:14px;
      background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);}
    .modal-info-label{font-size:9px;letter-spacing:0.14em;text-transform:uppercase;
      margin-bottom:6px;font-weight:500;}
    .modal-info-value{font-size:13px;color:var(--text-2);line-height:1.6;}`;
  document.head.appendChild(s);
})();

document.addEventListener('DOMContentLoaded', () => Mondes.init());
