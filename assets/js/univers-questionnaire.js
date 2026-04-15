/* XSS protection */
var _he = function (s) {
  return s == null
    ? ''
    : String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
};

function sanitizeHexColor(c) {
  if (!c || typeof c !== 'string') return '#0a0a12';
  const s = c.trim();
  if (/^#[0-9A-Fa-f]{3}$/.test(s) || /^#[0-9A-Fa-f]{6}$/.test(s)) return s;
  return '#0a0a12';
}

/* PINAPP — univers-questionnaire.js
   Questions structurantes + texte libre → brief JSON (brief_orient_claude)
   pour orienter Claude via webhook n8n. Fallback local si endpoint absent.
   ============================================================ */

/* endpoint : flag + URL réelle ; sinon null = démo locale sans requête réseau */
const AURORA_UNIVERS_ENDPOINT =
  window.PinappConfig &&
  window.PinappConfig.features &&
  window.PinappConfig.features.auroraUniversIA &&
  window.PinappConfig._isRealUrl(window.PinappConfig.webhooks.auroraUnivers)
    ? window.PinappConfig.webhooks.auroraUnivers
    : null;

const UniversQ = {
  state: { lieu: null, emotion: null, reference: '', prenom: '', briefOrientClaude: '' },

  init() {
    document.querySelectorAll('#pills-lieu .univers-pill').forEach((p) => {
      p.addEventListener('click', () => {
        document
          .querySelectorAll('#pills-lieu .univers-pill')
          .forEach((x) => x.classList.remove('selected'));
        p.classList.add('selected');
        this.state.lieu = p.dataset.val;
        if (navigator.vibrate) navigator.vibrate(10);
        setTimeout(() => this.goTo(2), 280);
      });
    });

    document.querySelectorAll('#pills-emotion .univers-pill').forEach((p) => {
      p.addEventListener('click', () => {
        document
          .querySelectorAll('#pills-emotion .univers-pill')
          .forEach((x) => x.classList.remove('selected'));
        p.classList.add('selected');
        this.state.emotion = p.dataset.val;
        if (navigator.vibrate) navigator.vibrate(10);
        setTimeout(() => this.goTo(3), 280);
      });
    });

    document.getElementById('btn-generer')?.addEventListener('click', () => this.generer());
    document.getElementById('input-reference')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.generer();
    });
  },

  goTo(n) {
    const prev = document.getElementById(`step-${n - 1}`);
    if (prev) {
      prev.style.opacity = '0';
      prev.style.transform = 'translateY(-8px)';
      prev.style.transition = 'all 280ms ease';
      setTimeout(() => prev.classList.add('hidden'), 280);
    }
    setTimeout(() => {
      const next = document.getElementById(`step-${n}`);
      if (next) {
        next.classList.remove('hidden');
        next.style.opacity = '0';
        next.style.transform = 'translateY(12px)';
        requestAnimationFrame(() => {
          next.style.transition = 'all 400ms ease';
          next.style.opacity = '1';
          next.style.transform = 'translateY(0)';
        });
        if (n === 3) setTimeout(() => document.getElementById('input-brief-claude')?.focus(), 420);
      }
    }, 320);

    const pct = { 1: 0, 2: 33, 3: 66 }[n] || 0;
    const fill = document.getElementById('univers-progress-fill');
    if (fill) fill.style.width = pct + '%';
  },

  async generer() {
    const ref = document.getElementById('input-reference')?.value?.trim();
    const prenom = document.getElementById('input-prenom')?.value?.trim();
    const brief = document.getElementById('input-brief-claude')?.value?.trim() || '';
    this.state.reference = ref || 'aucune référence';
    this.state.prenom = prenom || '';
    this.state.briefOrientClaude = brief;

    if (!this.state.lieu || !this.state.emotion) return;

    if (prenom) {
      try {
        localStorage.setItem('pinapp-prenom', prenom);
      } catch (e) {}
    }

    const step3 = document.getElementById('step-3');
    if (step3) {
      step3.style.opacity = '0';
      setTimeout(() => step3.classList.add('hidden'), 280);
    }

    const fill = document.getElementById('univers-progress-fill');
    if (fill) fill.style.width = '100%';

    const resultat = document.getElementById('univers-resultat');
    if (!resultat) return;
    resultat.classList.remove('hidden');
    const prn = this.state.prenom;
    resultat.innerHTML = `
      <p style="color:var(--accent-teal);font-size:14px;
                animation:kiri-soar 5.5s ease-in-out infinite;
                text-align:center;padding:24px 0;">
        ${prn ? `Aurora compose votre univers, ${_he(prn)}...` : 'Aurora compose votre univers...'}
      </p>`;

    try {
      if (!AURORA_UNIVERS_ENDPOINT) {
        throw new Error('no-endpoint');
      }
      const resp = await fetch(AURORA_UNIVERS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lieu: this.state.lieu,
          emotion: this.state.emotion,
          reference: this.state.reference,
          prenom: this.state.prenom,
          brief_orient_claude: brief,
        }),
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const u =
        data &&
        typeof data.univers === 'object' &&
        data.univers !== null &&
        !Array.isArray(data.univers)
          ? data.univers
          : data;
      this.afficher(u);

      try {
        localStorage.setItem(
          'pinapp-univers',
          JSON.stringify({
            ...u,
            prenom: this.state.prenom,
            brief_orient_claude: this.state.briefOrientClaude || undefined,
          }),
        );
      } catch (e) {}
    } catch (e) {
      /* Fallback local si webhook absent, désactivé ou erreur réseau */
      const univers = this.genererLocal();
      this.afficher(univers);
      try {
        localStorage.setItem(
          'pinapp-univers',
          JSON.stringify({
            ...univers,
            prenom: this.state.prenom,
            brief_orient_claude: this.state.briefOrientClaude || undefined,
          }),
        );
      } catch (err) {}
    }
  },

  genererLocal() {
    const noms = [
      'Lumière Voilée',
      'Horizon Intérieur',
      'Nuit Dorée',
      'Brume de Jade',
      'Éclat du Soir',
      "Velours d'Aube",
      'Cristal Nordique',
      'Ambre Vivant',
    ];
    const fondsSombres = ['#080C18', '#100810', '#0A0D0A', '#0D0800'];
    const accs = [
      ['#3EEBD6', '#A78BFA'],
      ['#FF6B6B', '#FFD93D'],
      ['#00E5CC', '#7B4FE8'],
      ['#88FFCC', '#CC88FF'],
      ['#FF2D9B', '#BF5FFF'],
      ['#C9A96E', '#F0EDE8'],
    ];

    const nom = noms[Math.floor(Math.random() * noms.length)];
    const fond = fondsSombres[Math.floor(Math.random() * fondsSombres.length)];
    const ac = accs[Math.floor(Math.random() * accs.length)];
    const brief = this.state.briefOrientClaude;
    const baseAtmo = `Un espace qui respire à votre rythme. Chaque visiteur ressent immédiatement que quelqu'un a pensé à lui.`;
    const atmosphere = brief
      ? `${baseAtmo} (aperçu hors ligne : votre texte libre sera intégré au brief Claude en production.)`
      : baseAtmo;

    return {
      nom,
      palette: { fond, accent1: ac[0], accent2: ac[1] },
      atmosphere,
      promesse: 'Vos clients arrivent. Ils restent. Ils reviennent.',
    };
  },

  afficher(u) {
    const resultat = document.getElementById('univers-resultat');
    if (!resultat) return;

    const iface = document.querySelector('.univers-interface');
    if (iface && u.palette?.accent1) {
      const rgb = this.hexRgb(u.palette.accent1);
      iface.style.background = `
        linear-gradient(135deg, rgba(${rgb},0.14) 0%, rgba(${rgb},0.06) 40%, transparent 70%),
        rgba(15,5,18,0.48)`;
      iface.style.borderColor = `rgba(${rgb},0.30)`;
      iface.style.transition = 'all 800ms ease';
    }

    const prenom = this.state.prenom;
    const intro = prenom ? `${prenom}, votre univers s'appelle` : "Votre univers s'appelle";

    resultat.innerHTML = `
      <p style="font-size:13px;color:var(--text-4);margin-bottom:8px;">${_he(intro)}</p>

      <div class="univers-nom">✦ ${_he(u.nom || 'Votre Univers')}</div>

      ${
        u.palette
          ? `
        <div style="display:flex;gap:10px;align-items:center;margin-bottom:20px;">
          ${[u.palette.fond, u.palette.accent1, u.palette.accent2]
            .filter(Boolean)
            .map(
              (c) => `
            <div style="width:36px;height:36px;border-radius:50%;background:${sanitizeHexColor(c)};
                        box-shadow:0 2px 8px rgba(0,0,0,0.25),0 0 0 1px rgba(255,255,255,0.10);
                        transition:transform 200ms ease;"
                 onmouseenter="this.style.transform='scale(1.15)'"
                 onmouseleave="this.style.transform='scale(1)'"></div>`,
            )
            .join('')}
          <span style="font-size:11px;color:var(--text-4);margin-left:4px;">Votre palette</span>
        </div>`
          : ''
      }

      ${
        u.atmosphere
          ? `
        <p style="font-family:ui-serif,'Iowan Old Style','Apple Garamond',serif;font-style:italic;font-size:15px;line-height:1.8;
                  color:var(--text-2);margin-bottom:20px;">"${_he(u.atmosphere)}"</p>`
          : ''
      }

      ${
        u.promesse
          ? `
        <p style="font-size:16px;font-weight:500;color:var(--text);margin-bottom:24px;
                  font-family:ui-serif,'Iowan Old Style','Apple Garamond',serif;">${_he(u.promesse)}</p>`
          : ''
      }

      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <a href="../diagnostic/index.html?univers=${encodeURIComponent(u.nom || '')}"
           style="display:inline-block;padding:13px 28px;background:var(--accent-violet);
                  color:#fff;border-radius:100px;text-decoration:none;
                  font-size:14px;font-weight:500;
                  box-shadow:var(--glow-violet);
                  animation:kiri-soar 5.5s ease-in-out infinite;">
          Construire mon univers →
        </a>
        <button onclick="UniversQ.reset()"
                style="font-size:13px;color:var(--text-3);background:none;border:none;
                       cursor:pointer;text-decoration:underline;text-underline-offset:3px;">
          Recommencer
        </button>
      </div>`;

    const nom = resultat.querySelector('.univers-nom');
    if (nom) {
      nom.style.opacity = '0';
      nom.style.transform = 'translateY(12px)';
      nom.style.transition = 'all 600ms cubic-bezier(0.45,0.05,0.55,0.95)';
      setTimeout(() => {
        nom.style.opacity = '1';
        nom.style.transform = 'translateY(0)';
      }, 80);
    }
  },

  reset() {
    this.state = { lieu: null, emotion: null, reference: '', prenom: '', briefOrientClaude: '' };
    ['step-2', 'step-3'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    const s1 = document.getElementById('step-1');
    if (s1) {
      s1.classList.remove('hidden');
      s1.style.opacity = '1';
      s1.style.transform = 'translateY(0)';
    }
    document.querySelectorAll('.univers-pill').forEach((p) => p.classList.remove('selected'));
    const r = document.getElementById('univers-resultat');
    if (r) {
      r.classList.add('hidden');
      r.innerHTML = '';
    }
    const fill = document.getElementById('univers-progress-fill');
    if (fill) fill.style.width = '0%';
    const iface = document.querySelector('.univers-interface');
    if (iface) {
      iface.style.background = '';
      iface.style.borderColor = '';
    }
    ['input-reference', 'input-prenom', 'input-brief-claude'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  },

  hexRgb(hex) {
    let s = sanitizeHexColor(hex).replace('#', '');
    if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    if (s.length !== 6) return '10,10,18';
    const r = parseInt(s.slice(0, 2), 16);
    const g = parseInt(s.slice(2, 4), 16);
    const b = parseInt(s.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return '10,10,18';
    return `${r},${g},${b}`;
  },
};

document.addEventListener('DOMContentLoaded', () => UniversQ.init());
