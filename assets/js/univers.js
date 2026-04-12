/* XSS protection: escape HTML in user-provided/localStorage data */
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

/** Couleurs API : uniquement #RGB / #RRGGBB (évite injection CSS). */
function sanitizeHexColor(c) {
  if (!c || typeof c !== 'string') return '#0a0a12';
  var s = c.trim();
  if (/^#[0-9A-Fa-f]{3}$/.test(s) || /^#[0-9A-Fa-f]{6}$/.test(s)) return s;
  return '#0a0a12';
}

function hexToRgbComponents(hexColor) {
  var s = sanitizeHexColor(hexColor).replace('#', '');
  if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  if (s.length !== 6) return [10, 10, 18];
  var r = parseInt(s.slice(0, 2), 16);
  var g = parseInt(s.slice(2, 4), 16);
  var b = parseInt(s.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return [10, 10, 18];
  return [r, g, b];
}
/* =====================================================
   UNIVERS DIGITAL — Aurora directrice artistique
   Pinapp Studio · Avril 2026
   
   ⚠️  CONFIGURATION REQUISE :
   Remplacer PINAPP_AURORA_ENDPOINT par l'URL de votre
   webhook n8n qui fait le relais vers l'API Claude.
   Ex : https://[votre-n8n]/webhook/aurora-univers
   ===================================================== */

function pinappAuroraUniversEndpoint() {
  var cfg = window.PinappConfig;
  if (
    !cfg ||
    !cfg.features ||
    !cfg.features.auroraUniversIA ||
    !cfg._isRealUrl(cfg.webhooks.auroraUnivers)
  ) {
    return null;
  }
  return cfg.webhooks.auroraUnivers;
}

const UniversDigital = {
  state: {
    lieu: null,
    emotion: null,
    reference: '',
    briefOrientClaude: '',
    step: 1,
  },

  init() {
    // Pills lieu
    document.querySelectorAll('#pills-lieu .univers-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        document
          .querySelectorAll('#pills-lieu .univers-pill')
          .forEach((p) => p.classList.remove('selected'));
        pill.classList.add('selected');
        this.state.lieu = pill.dataset.val;

        if (navigator.vibrate) navigator.vibrate(10);
        setTimeout(() => this.goToStep(2), 300);
      });
    });

    // Pills émotion
    document.querySelectorAll('#pills-emotion .univers-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        document
          .querySelectorAll('#pills-emotion .univers-pill')
          .forEach((p) => p.classList.remove('selected'));
        pill.classList.add('selected');
        this.state.emotion = pill.dataset.val;

        if (navigator.vibrate) navigator.vibrate(10);
        setTimeout(() => this.goToStep(3), 300);
      });
    });

    // Bouton générer
    document.getElementById('btn-generer')?.addEventListener('click', () => this.generer());

    // Entrée clavier sur le champ référence
    document.getElementById('input-reference')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.generer();
    });
  },

  goToStep(n) {
    this.state.step = n;

    // Cacher l'étape précédente avec transition douce
    const prev = document.getElementById(`step-${n - 1}`);
    if (prev) {
      prev.style.opacity = '0';
      prev.style.transform = 'translateY(-8px)';
      prev.style.transition = 'all 300ms cubic-bezier(0.45,0.05,0.55,0.95)';
      setTimeout(() => prev.classList.add('hidden'), 300);
    }

    // Montrer la nouvelle étape
    const next = document.getElementById(`step-${n}`);
    if (next) {
      setTimeout(() => {
        next.classList.remove('hidden');
        next.classList.add('entering');
        if (n === 3) {
          setTimeout(() => {
            document.getElementById('input-brief-claude')?.focus();
          }, 400);
        }
      }, 350);
    }

    // Mise à jour de la barre de progression
    const progress = { 1: 0, 2: 33, 3: 66 }[n] || 0;
    const fill = document.getElementById('univers-progress-fill');
    if (fill) fill.style.width = progress + '%';
  },

  async generer() {
    const ref = document.getElementById('input-reference')?.value?.trim();
    const brief = document.getElementById('input-brief-claude')?.value?.trim() || '';
    this.state.reference = ref || 'aucune référence particulière';
    this.state.briefOrientClaude = brief;

    if (!this.state.lieu || !this.state.emotion) return;

    // Cacher l'étape 3
    const step3 = document.getElementById('step-3');
    if (step3) {
      step3.style.opacity = '0';
      setTimeout(() => step3.classList.add('hidden'), 300);
    }

    // Progression à 100%
    const fill = document.getElementById('univers-progress-fill');
    if (fill) fill.style.width = '100%';

    // Afficher le loader
    const resultat = document.getElementById('univers-resultat');
    if (!resultat) return;
    resultat.classList.remove('hidden');
    resultat.innerHTML = `
      <p class="univers-loader">
        ✦ Aurora compose votre univers...
      </p>`;

    // Tracking
    if (window.PinappIntel) {
      PinappIntel.data.usedAurora = true;
      PinappIntel.data.universGenere = true;
    }

    const endpoint = pinappAuroraUniversEndpoint();

    try {
      if (!endpoint) {
        throw new Error('no-endpoint');
      }
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lieu: this.state.lieu,
          emotion: this.state.emotion,
          reference: this.state.reference,
          brief_orient_claude: brief,
        }),
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const univers = await resp.json();

      this.afficherResultat(univers);
      this.notifyLauralie(univers);
    } catch (e) {
      /* Webhook absent / erreur : démo locale (même UX que page Univers dédiée) */
      await new Promise(function (r) {
        setTimeout(r, 700);
      });
      const univers = this.genererLocalFallback(brief);
      this.afficherResultat(univers);
      try {
        localStorage.setItem(
          'pinapp-univers',
          JSON.stringify(
            Object.assign({}, univers, {
              brief_orient_claude: this.state.briefOrientClaude || undefined,
            }),
          ),
        );
      } catch (err) {}
      this.notifyLauralie(univers);
    }
  },

  genererLocalFallback(briefText) {
    var noms = [
      'Lumière Voilée',
      'Horizon Intérieur',
      'Nuit Dorée',
      'Brume de Jade',
      'Éclat du Soir',
      'Cristal Nordique',
    ];
    var fonds = ['#080C18', '#100810', '#0A0D0A'];
    var accs = [
      ['#3EEBD6', '#A78BFA'],
      ['#00E5CC', '#7B4FE8'],
      ['#C9A96E', '#F0EDE8'],
    ];
    var nom = noms[Math.floor(Math.random() * noms.length)];
    var fond = fonds[Math.floor(Math.random() * fonds.length)];
    var ac = accs[Math.floor(Math.random() * accs.length)];
    var baseAtmo =
      'Un espace qui respire à votre rythme. Aperçu local : branchez n8n (auroraUniversIA + URL) pour une composition Claude.';
    return {
      nom: nom,
      palette: { fond: fond, accent1: ac[0], accent2: ac[1] },
      atmosphere: briefText ? baseAtmo + ' Votre brief sera pris en compte en production.' : baseAtmo,
      promesse: 'Vos clients arrivent. Ils restent. Ils reviennent.',
    };
  },

  afficherResultat(u) {
    const resultat = document.getElementById('univers-resultat');
    if (!resultat) return;

    // Teinter le bloc avec la couleur accent1 de l'univers
    const iface = document.querySelector('.univers-interface');
    if (iface && u.palette?.accent1) {
      var rgb = hexToRgbComponents(u.palette.accent1);
      var r = rgb[0];
      var g = rgb[1];
      var b = rgb[2];
      iface.style.background = `
        linear-gradient(135deg,
          rgba(${r},${g},${b},0.12) 0%,
          rgba(${r},${g},${b},0.06) 40%,
          transparent 70%),
        rgba(0,15,30,0.48)`;
      iface.style.borderColor = `rgba(${r},${g},${b},0.30)`;
      iface.classList.add('tinted');
    }

    // HTML du résultat
    resultat.innerHTML = `
      <div class="univers-nom">
        ✦ ${_he(u.nom || 'Votre Univers')}
      </div>

      <div class="univers-palette">
        ${
          u.palette
            ? `
          <div class="univers-swatch"
               style="background:${sanitizeHexColor(u.palette.fond)}"
               title="Fond"></div>
          <div class="univers-swatch"
               style="background:${sanitizeHexColor(u.palette.accent1)}"
               title="Accent principal"></div>
          <div class="univers-swatch"
               style="background:${sanitizeHexColor(u.palette.accent2)}"
               title="Accent secondaire"></div>
          <span class="univers-palette-label">Votre palette</span>
        `
            : ''
        }
      </div>

      <p class="univers-description">
        &ldquo;${_he(u.atmosphere || '')}&rdquo;
      </p>

      ${
        u.signature
          ? `
        <div class="univers-signature">
          ◈ Signature visuelle : ${_he(u.signature)}
        </div>
      `
          : ''
      }

      ${
        u.promesse
          ? `
        <p style="font-size:18px;font-weight:500;color:var(--text);
                  margin-bottom:32px;font-family:Georgia,serif;">
          ${_he(u.promesse)}
        </p>
      `
          : ''
      }

      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:8px;">
        <a href="/diagnostic/?univers=${encodeURIComponent(u.nom || '')}"
           class="univers-cta btn-primary">
          Construire mon univers &rarr;
        </a>
        <button class="univers-recommencer"
                onclick="UniversDigital.reset()">
          Recommencer
        </button>
      </div>`;

    // Animation d'entrée du nom
    const nom = resultat.querySelector('.univers-nom');
    if (nom) {
      nom.style.opacity = '0';
      nom.style.transform = 'translateY(12px)';
      nom.style.transition = 'all 600ms cubic-bezier(0.45,0.05,0.55,0.95)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          nom.style.opacity = '1';
          nom.style.transform = 'translateY(0)';
        }, 80);
      });
    }

    // Swatches — entrée décalée (stagger)
    resultat.querySelectorAll('.univers-swatch').forEach((s, i) => {
      s.style.opacity = '0';
      s.style.transform = 'scale(0.5)';
      s.style.transition = `all 400ms cubic-bezier(0.25,0.1,0.25,1) ${200 + i * 80}ms`;
      setTimeout(() => {
        s.style.opacity = '1';
        s.style.transform = 'scale(1)';
      }, 80);
    });

    // Sauvegarder dans localStorage pour /diagnostic/
    try {
      localStorage.setItem(
        'pinapp-univers',
        JSON.stringify({
          ...u,
          brief_orient_claude: this.state.briefOrientClaude || undefined,
        }),
      );
    } catch (e) {}
  },

  notifyLauralie(u) {
    // Webhook n8n → notif interne (ex. WhatsApp) — uniquement si URL réelle + flag actif
    var cfg = window.PinappConfig;
    if (
      !cfg ||
      !cfg.features ||
      !cfg.features.whatsappNotifs ||
      !cfg._isRealUrl(cfg.webhooks.notifWhatsapp)
    ) {
      return;
    }
    try {
      fetch(cfg.webhooks.notifWhatsapp, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'univers-genere',
          lieu: this.state.lieu,
          emotion: this.state.emotion,
          reference: this.state.reference,
          brief_orient_claude: this.state.briefOrientClaude || '',
          univers: u.nom,
          palette: u.palette,
          timestamp: new Date().toISOString(),
          page: location.href,
        }),
      }).catch(function () {});
    } catch (e) {}
  },

  reset() {
    this.state = { lieu: null, emotion: null, reference: '', briefOrientClaude: '', step: 1 };

    ['step-2', 'step-3'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    const step1 = document.getElementById('step-1');
    if (step1) {
      step1.classList.remove('hidden');
      step1.style.opacity = '1';
      step1.style.transform = 'translateY(0)';
    }

    document.querySelectorAll('.univers-pill').forEach((p) => p.classList.remove('selected'));

    const resultat = document.getElementById('univers-resultat');
    if (resultat) {
      resultat.classList.add('hidden');
      resultat.innerHTML = '';
    }

    const fill = document.getElementById('univers-progress-fill');
    if (fill) fill.style.width = '0%';

    const iface = document.querySelector('.univers-interface');
    if (iface) {
      iface.style.background = '';
      iface.style.borderColor = '';
      iface.classList.remove('tinted');
    }

    const input = document.getElementById('input-reference');
    if (input) input.value = '';
    const briefEl = document.getElementById('input-brief-claude');
    if (briefEl) briefEl.value = '';
  },
};

document.addEventListener('DOMContentLoaded', () => UniversDigital.init());
