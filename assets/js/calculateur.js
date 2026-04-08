/* =====================================================
   CALCULATEUR LIVE — Configurez. Le prix s'adapte.
   Pinapp Studio · Avril 2026
   ===================================================== */

const Calculateur = {
  state: {
    besoins: [],
    delai: 14,
    urgent: false,
  },

  configs: {
    site: {
      prix: 1190,
      includes: [
        'Site vitrine premium',
        'Mode nuit / jour',
        'SEO complet',
        'Formulaire de contact automatisé',
      ],
    },
    auto: {
      prix: 990,
      includes: [
        "3 scénarios d'automatisation (Make / n8n)",
        'Confirmations automatiques',
        'Relances clients automatiques',
      ],
    },
    ia: {
      prix: 590,
      includes: ['Aurora sur votre site', 'Analyse prospects', 'Réponses automatiques'],
    },
    systeme: {
      prix: 1990,
      includes: [
        'Site + automatisation + fonctions intelligentes',
        'Ensemble cohérent Pinapp',
        "1 h d'accompagnement inclus",
      ],
    },
  },

  init() {
    // Pills besoins (multi-select) et délai (radio)
    document.querySelectorAll('.pill-choice').forEach((pill) => {
      pill.addEventListener('click', () => {
        const group = pill.parentElement.id;

        if (group === 'config-delai') {
          document
            .querySelectorAll('#config-delai .pill-choice')
            .forEach((p) => p.classList.remove('active'));
          pill.classList.add('active');
          this.state.delai = parseInt(pill.dataset.delai, 10);
          this.state.urgent = pill.dataset.val === 'urgent';
        } else {
          // "Tout le système" sélectionne tout
          if (pill.dataset.val === 'systeme') {
            document
              .querySelectorAll('#config-besoins .pill-choice')
              .forEach((p) => p.classList.add('active'));
            this.state.besoins = ['site', 'auto', 'ia', 'systeme'];
          } else {
            // Désélectionner "systeme" si on choisit manuellement
            document
              .querySelectorAll('#config-besoins [data-val="systeme"]')
              .forEach((p) => p.classList.remove('active'));
            this.state.besoins = this.state.besoins.filter((b) => b !== 'systeme');

            pill.classList.toggle('active');
            const val = pill.dataset.val;
            if (this.state.besoins.includes(val)) {
              this.state.besoins = this.state.besoins.filter((b) => b !== val);
            } else {
              this.state.besoins.push(val);
            }
          }
        }

        this.calculate();

        // Tracking intelligence
        if (window.PinappIntel) PinappIntel.markCalculateur();
      });
    });

    // Vibration haptic mobile sur interaction
    document.querySelector('#config-besoins')?.addEventListener('click', () => {
      if (navigator.vibrate) navigator.vibrate(8);
    });
  },

  calculate() {
    let prix = 0;
    let includes = [];

    if (this.state.besoins.includes('systeme')) {
      prix = this.configs.systeme.prix;
      includes = [...this.configs.systeme.includes];
    } else {
      this.state.besoins.forEach((b) => {
        if (this.configs[b]) {
          prix += this.configs[b].prix;
          includes.push(...this.configs[b].includes);
        }
      });
    }

    // Délai urgent : +20%
    if (this.state.urgent) prix = Math.round(prix * 1.2);

    // Animation du montant
    this.animatePrix(prix);

    // Délai
    const elDelai = document.getElementById('result-delai');
    if (elDelai) elDelai.textContent = this.state.delai;

    // Liste des inclus (dédupliqués)
    const list = document.getElementById('result-includes');
    if (list) {
      if (includes.length) {
        list.innerHTML = [...new Set(includes)].map((i) => `<li>${i}</li>`).join('');
      } else {
        list.innerHTML = '<li style="opacity:0.5">Choisissez vos besoins ci-contre</li>';
      }
    }

    // Badge "urgence" sur le résultat
    const badge = document.getElementById('result-urgence');
    if (badge) {
      badge.style.display = this.state.urgent ? '' : 'none';
    }
  },

  animatePrix(target) {
    const el = document.getElementById('result-montant');
    if (!el) return;
    const start = parseInt(el.textContent.replace(/[\s\u00A0—\-]/g, ''), 10) || 0;
    const dur = 320;
    const t0 = Date.now();

    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
      const val = Math.round(start + (target - start) * ease);
      el.textContent = val.toLocaleString('fr-FR');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },
};

document.addEventListener('DOMContentLoaded', () => {
  Calculateur.init();
  /* Premier rendu : afficher 0 € ou total si une pill est déjà active */
  Calculateur.calculate();
});
