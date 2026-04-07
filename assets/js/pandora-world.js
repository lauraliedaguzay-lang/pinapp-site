/* pandora-world.js — Pinapp · Spores & Étoiles Pandora
   Nuit : spores qui montent · Jour : spores dans le vent
   ================================================================ */

const PandoraWorld = {

  COLORS_NUIT: [
    { r:0,   g:229, b:204 }, // teal
    { r:123, g:79,  b:232 }, // violet
    { r:0,   g:200, b:160 }, // turquoise
    { r:196, g:30,  b:168 }, // magenta
    { r:57,  g:224, b:117 }, // vert
    { r:255, g:180, b:40  }, // ambre
  ],

  COLORS_JOUR: [
    { r:255, g:220, b:150 }, // or
    { r:255, g:190, b:210 }, // rose
    { r:150, g:220, b:200 }, // jade
    { r:210, g:190, b:255 }, // lavande
    { r:255, g:240, b:200 }, // crème
  ],

  get isMobile() { return window.innerWidth < 768; },
  /* Anti-lag : moins de nœuds DOM + moins de box-shadow sur petit écran */
  get SPORES_NUIT() { return this.isMobile ? 5  : 14; },
  get SPORES_JOUR() { return this.isMobile ? 4  : 12; },
  get ETOILES()     { return this.isMobile ? 18 : 72; },

  init() {
    this.sporesEl = document.getElementById('spores-container');
    this.starsEl  = document.getElementById('stars-container');
    if (!this.sporesEl && !this.starsEl) return;

    this.isJour = document.body.classList.contains('mode-jour');
    this.createSpores();
    this.createStars();

    // Réagir au changement de mode
    document.body.addEventListener('modeChange', () => {
      this.isJour = document.body.classList.contains('mode-jour');
      if (this.sporesEl) this.sporesEl.innerHTML = '';
      if (this.starsEl)  this.starsEl.innerHTML  = '';
      this.createSpores();
      this.createStars();
    });
  },

  createSpores() {
    if (!this.sporesEl) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const count  = this.isJour ? this.SPORES_JOUR : this.SPORES_NUIT;
    const colors = this.isJour ? this.COLORS_JOUR  : this.COLORS_NUIT;

    for (let i = 0; i < count; i++) {
      const c       = colors[Math.floor(Math.random() * colors.length)];
      const size    = 1 + Math.random() * 2.5;
      const dur     = 16 + Math.random() * 18;
      const delay   = -(Math.random() * dur);
      const opacity = 0.15 + Math.random() * 0.35;
      const dx      = (Math.random() - 0.5) * 40;
      const dy      = this.isJour ? (Math.random() - 0.5) * 30 : 0;

      const spore = document.createElement('div');
      spore.className = 'spore';
      spore.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `left:${Math.random() * 100}%`,
        `top:${this.isJour
          ? Math.random() * 100
          : 30 + Math.random() * 70}%`,
        `background:rgba(${c.r},${c.g},${c.b},${opacity})`,
        `box-shadow:` +
          `0 0 ${size*3}px rgba(${c.r},${c.g},${c.b},${(opacity*0.8).toFixed(2)}),` +
          `0 0 ${size*6}px rgba(${c.r},${c.g},${c.b},${(opacity*0.4).toFixed(2)}),` +
          `0 0 ${size*12}px rgba(${c.r},${c.g},${c.b},${(opacity*0.2).toFixed(2)})`,
        `--dx:${dx}px`,
        `--dy:${dy}px`,
        `animation:${this.isJour ? 'spore-wind' : 'spore-rise'} ${dur}s ease-in-out infinite ${delay}s`,
      ].join(';');
      this.sporesEl.appendChild(spore);
    }
  },

  createStars() {
    if (!this.starsEl || this.isJour) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const starColors = [
      [230, 252, 248],
      [0, 229, 204],
      [150, 228, 210],
      [180, 210, 200],
      [255, 230, 200],
    ];

    for (let i = 0; i < this.ETOILES; i++) {
      const size   = Math.random() < 0.7 ? 1 : 1.8;
      const c      = starColors[Math.floor(Math.random() * starColors.length)];
      const opMin  = 0.08 + Math.random() * 0.15;
      const opMax  = opMin + 0.15 + Math.random() * 0.20;
      const twinkle = Math.random() < 0.35;
      const dur    = 4.5 + Math.random() * 6;
      const delay  = -(Math.random() * dur);

      const star = document.createElement('div');
      star.className = 'star';
      const glowStyle = size > 1.5
        ? `box-shadow:0 0 ${size*3}px rgba(${c[0]},${c[1]},${c[2]},0.6),0 0 ${size*6}px rgba(${c[0]},${c[1]},${c[2]},0.3);`
        : '';
      const animStyle = twinkle
        ? `animation:star-twinkle ${dur}s ease-in-out infinite ${delay}s;`
        : '';

      star.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `left:${Math.random() * 100}%`,
        `top:${Math.random() * 65}%`,
        `background:rgba(${c[0]},${c[1]},${c[2]},${opMax})`,
        `--op-min:${opMin.toFixed(2)}`,
        `--op-max:${opMax.toFixed(2)}`,
      ].join(';') + ';' + glowStyle + animStyle;

      this.starsEl.appendChild(star);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => PandoraWorld.init());
