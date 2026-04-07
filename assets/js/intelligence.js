/* =====================================================
   PINAPP INTELLIGENCE — Le site observe · comprend · s'adapte
   Zéro cookie tiers — tout en localStorage
   Pinapp Studio · Avril 2026
   ===================================================== */

const PinappIntel = {
  data: {
    secteur:          null,
    demosSeen:        [],
    timeOnPage:       0,
    scrollDepth:      0,
    usedAurora:       false,
    usedCalculateur:  false,
    usedUnivers:      false,
    visits:           0,
    lastVisit:        null,
    pagesVisited:     [],
  },

  _startTime: Date.now(),

  init() {
    this.load();
    this.data.visits++;
    this.data.lastVisit = new Date().toISOString();

    // Enregistrer la page courante
    const page = location.pathname;
    if (!this.data.pagesVisited.includes(page)) {
      this.data.pagesVisited.push(page);
    }

    this.trackScroll();
    this.trackTime();
    this.trackDemos();
    this.detectReadyToConvert();

    // Visite de retour — message subtil après 3s
    if (this.data.visits > 1) {
      setTimeout(() => this.showReturnMessage(), 3000);
    }

    // Sauvegarde avant départ
    window.addEventListener('beforeunload', () => {
      this.data.timeOnPage += Math.round(
        (Date.now() - this._startTime) / 1000
      );
      this.save();
    });
  },

  load() {
    try {
      const saved = localStorage.getItem('pinapp-intel');
      if (saved) this.data = { ...this.data, ...JSON.parse(saved) };
    } catch (e) {}
  },

  save() {
    try {
      localStorage.setItem('pinapp-intel', JSON.stringify(this.data));
    } catch (e) {}
  },

  trackScroll() {
    window.addEventListener('scroll', () => {
      const bodyH  = document.body.scrollHeight - window.innerHeight;
      if (bodyH <= 0) return;
      const depth = Math.round((window.scrollY / bodyH) * 100);
      this.data.scrollDepth = Math.max(this.data.scrollDepth, depth);
    }, { passive: true });
  },

  trackTime() {
    // Mise à jour du temps toutes les 10s
    setInterval(() => this.save(), 10000);
  },

  trackDemos() {
    // Observer les éléments avec data-filter (cartes réalisations)
    document.querySelectorAll('[data-filter]').forEach(el => {
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          const secteur = el.dataset.filter;
          if (secteur && secteur !== 'all') {
            if (!this.data.demosSeen.includes(secteur)) {
              this.data.demosSeen.push(secteur);
            }
            this.detectSecteur();
          }
        }
      }, { threshold: 0.5 });
      obs.observe(el);
    });
  },

  detectSecteur() {
    if (!this.data.demosSeen.length) return;

    // Secteur le plus vu
    const counts = {};
    this.data.demosSeen.forEach(s => {
      counts[s] = (counts[s] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted.length) {
      this.data.secteur = sorted[0][0];

      // Adapter le placeholder Aurora si présent
      const auroraInput = document.querySelector('#aurora-input');
      if (auroraInput && !auroraInput.value) {
        const hints = {
          services:  'esthéticienne',
          commerce:  'restaurateur',
          beaute:    'esthéticienne',
          artisan:   'artisan plombier',
          coach:     'coach certifié',
          sante:     'cabinet médical',
        };
        const metier = hints[this.data.secteur] || 'indépendant';
        auroraInput.placeholder =
          `Je suis ${metier} et je cherche à automatiser...`;
      }
    }
  },

  detectReadyToConvert() {
    // Moment idéal : scroll > 60% + interaction Aurora ou calculateur
    const check = setInterval(() => {
      const prêt =
        this.data.scrollDepth > 60 &&
        (this.data.usedAurora ||
         this.data.usedCalculateur ||
         this.data.usedUnivers);

      if (prêt) {
        const cta = document.querySelector('.sticky-cta');
        if (cta) {
          cta.textContent = 'Vous avez vu ce qu\'il vous faut. 30 min →';
          cta.classList.add('visible');
        }
        clearInterval(check);
      }
    }, 2000);
  },

  showReturnMessage() {
    // Message discret pour les visiteurs de retour
    const hero = document.querySelector('.hero-subtitle');
    if (!hero || this.data.visits < 2) return;

    const msg = document.createElement('p');
    msg.style.cssText = [
      'font-size:12px',
      'opacity:0',
      'color:rgba(238,248,255,0.45)',
      'text-align:center',
      'margin-top:8px',
      'transition:opacity 1s ease',
      'font-style:italic',
    ].join(';');
    msg.textContent = 'Vous êtes revenu. Bonne décision.';

    hero.parentElement.insertBefore(msg, hero.nextSibling);
    requestAnimationFrame(() => {
      setTimeout(() => { msg.style.opacity = '1'; }, 100);
      setTimeout(() => { msg.style.opacity = '0'; }, 5000);
      setTimeout(() => { msg.remove(); }, 6200);
    });
  },

  /* Méthodes appelables depuis d'autres scripts */
  markAurora()      { this.data.usedAurora      = true; this.save(); },
  markCalculateur() { this.data.usedCalculateur = true; this.save(); },
  markUnivers()     { this.data.usedUnivers     = true; this.save(); },
};

document.addEventListener('DOMContentLoaded', () => PinappIntel.init());
