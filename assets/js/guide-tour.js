/**
 * PINAPP — guide-tour.js
 * Guidage pas à pas, discret et accessible.
 *
 * Règles:
 * - Zéro scroll animé: pas de scroll smooth
 * - Prefers-reduced-motion: animations minimisées
 * - Accessible: focus, ESC, aria-modal, aria-live
 */
(function () {
  'use strict';

  var prefersReducedMotion = false;
  try {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var STORAGE_KEY = 'pinapp-guide';
  var DEFAULT_STATE = { dismissed: false, completed: {}, lastStep: {} };

  function readState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_STATE };
      var parsed = JSON.parse(raw);
      return {
        dismissed: !!parsed.dismissed,
        completed: parsed.completed || {},
        lastStep: parsed.lastStep || {},
      };
    } catch (e) {
      return { ...DEFAULT_STATE };
    }
  }

  function writeState(next) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {}
  }

  function pageKey() {
    var p = location.pathname || '/';
    if (p.endsWith('/index.html')) p = p.slice(0, -'/index.html'.length) + '/';
    return p || '/';
  }

  function stepsForPage() {
    var p = pageKey();
    // Page-specific steps; selectors are best-effort (some pages differ).
    if (p === '/' || p === '/index.html') {
      return [
        {
          id: 'home-cta',
          title: 'Commencer ici',
          body: 'Le plus simple: démarrez par une demande écrite. Je reviens avec un plan clair, puis vous validez.',
          selector: '.btn.btn-primary, .bottom-bar-cta',
        },
        {
          id: 'home-offres',
          title: 'Choisir une offre',
          body: 'Si vous hésitez, commencez par Offres: tout est cadré, sans jargon.',
          selector: 'a[href*="offres/"]',
        },
        {
          id: 'home-realisations',
          title: 'Voir des exemples',
          body: 'Réalisations: ouvrez une démo pour vous projeter, puis revenez ici.',
          selector: 'a[href*="realisations/"]',
        },
      ];
    }
    if (p.startsWith('/offres')) {
      return [
        {
          id: 'offres-choix',
          title: 'Choisir votre option',
          body: 'Sélectionnez l’option la plus proche: on ajuste ensuite par écrit.',
          selector: '.offre-card, .card, main a.btn-primary, .btn.btn-primary',
        },
        {
          id: 'offres-demarrer',
          title: 'Démarrer par écrit',
          body: 'Cliquez “Démarrer” pour poser le contexte. Je te guide ensuite pas à pas.',
          selector: 'a[href*="diagnostic/"], a[href*="votre-projet/"], .bottom-bar-cta',
        },
      ];
    }
    if (p.startsWith('/diagnostic')) {
      return [
        {
          id: 'diag-remplir',
          title: 'Remplir',
          body: 'Décrivez votre besoin. Si vous ne savez pas, écrivez ce qui vous bloque: je poserai les bonnes questions.',
          selector: 'form, textarea, input[type="email"]',
        },
        {
          id: 'diag-suivant',
          title: 'Après envoi',
          body: 'Vous recevez une synthèse et la prochaine étape. Tout reste traçable.',
          selector: 'main',
        },
      ];
    }
    if (p.startsWith('/depot')) {
      return [
        {
          id: 'depot-liens',
          title: 'Coller vos liens',
          body: 'Ajoutez vos liens Drive/Dropbox/WeTransfer. Un lien par ligne.',
          selector: '#depotLinks',
        },
        {
          id: 'depot-brief',
          title: 'Le brief',
          body: 'Remplissez l’essentiel: objectif, pages, références. Le reste, je le demande dans l’ordre.',
          selector: '#clientDepotForm',
        },
        {
          id: 'depot-send',
          title: 'Envoyer',
          body: 'Envoyez le brief. Si vous préférez, utilisez le bouton email.',
          selector: '#clientDepotForm button[type="submit"], #clientDepotMailto',
        },
      ];
    }
    if (p.startsWith('/realisations')) {
      return [
        {
          id: 'real-open',
          title: 'Ouvrir une démo',
          body: 'Cliquez sur une carte: vous pouvez tester une démo en conditions réelles.',
          selector: '.demo-card-3d, [data-link]',
        },
        {
          id: 'real-next',
          title: 'Après la démo',
          body: 'Revenez ensuite sur “Démarrer” pour me dire ce que vous voulez obtenir.',
          selector: '.bottom-bar-cta, a[href*="diagnostic/"]',
        },
      ];
    }
    // Default minimal guide
    return [
      {
        id: 'default-1',
        title: 'Étape suivante',
        body: 'Si vous voulez avancer, démarrez une demande écrite. Je vous guide ensuite étape par étape.',
        selector: '.bottom-bar-cta, a[href*="diagnostic/"], a[href*="votre-projet/"]',
      },
    ];
  }

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') n.className = attrs[k];
        else if (k === 'text') n.textContent = attrs[k];
        else n.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (typeof c === 'string') n.appendChild(document.createTextNode(c));
      else if (c) n.appendChild(c);
    });
    return n;
  }

  function firstMatch(selector) {
    if (!selector) return null;
    try {
      var list = document.querySelectorAll(selector);
      for (var i = 0; i < list.length; i++) {
        var node = list[i];
        if (!node) continue;
        // Skip hidden
        var r = node.getBoundingClientRect();
        if (r && r.width > 0 && r.height > 0) return node;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function positionPopover(pop, target) {
    var vw = window.innerWidth || 390;
    var vh = window.innerHeight || 700;
    var pad = 14;
    var maxW = Math.min(420, vw - pad * 2);
    pop.style.maxWidth = maxW + 'px';

    var tr = target ? target.getBoundingClientRect() : null;
    var pr = pop.getBoundingClientRect();
    var x = pad;
    var y = vh - pr.height - pad;

    if (tr) {
      // Prefer below target, otherwise above.
      var belowY = tr.bottom + 12;
      var aboveY = tr.top - pr.height - 12;
      var canBelow = belowY + pr.height + pad <= vh;
      var canAbove = aboveY >= pad;
      y = canBelow ? belowY : canAbove ? aboveY : y;

      var centerX = tr.left + tr.width / 2 - pr.width / 2;
      x = clamp(centerX, pad, vw - pr.width - pad);
    }

    pop.style.left = x + 'px';
    pop.style.top = y + 'px';
  }

  function setSpotlight(spot, target) {
    if (!spot) return;
    if (!target) {
      spot.style.opacity = '0';
      return;
    }
    var r = target.getBoundingClientRect();
    var pad = 10;
    spot.style.setProperty('--x', r.left - pad + 'px');
    spot.style.setProperty('--y', r.top - pad + 'px');
    spot.style.setProperty('--w', r.width + pad * 2 + 'px');
    spot.style.setProperty('--h', r.height + pad * 2 + 'px');
    spot.style.opacity = '1';
  }

  function init() {
    var state = readState();
    if (state.dismissed) return;

    var steps = stepsForPage();
    if (!steps || !steps.length) return;

    var key = pageKey();
    var idx = 0;
    if (typeof state.lastStep[key] === 'number')
      idx = clamp(state.lastStep[key], 0, steps.length - 1);

    // Floating entry button
    var btn = el('button', {
      type: 'button',
      class: 'pinapp-guide-fab',
      id: 'pinappGuideFab',
      'aria-label': 'Ouvrir le guide pas à pas',
      title: 'Guide',
    });
    btn.innerHTML =
      '<span aria-hidden="true" style="font-size:14px;letter-spacing:0.06em;">Guide</span>';

    // Overlay + popover
    var overlay = el('div', {
      class: 'pinapp-guide-overlay',
      id: 'pinappGuideOverlay',
      'aria-hidden': 'true',
    });
    var spotlight = el('div', {
      class: 'pinapp-guide-spot',
      id: 'pinappGuideSpot',
      'aria-hidden': 'true',
    });
    overlay.appendChild(spotlight);

    var pop = el('div', {
      class: 'pinapp-guide-pop',
      id: 'pinappGuidePop',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-label': 'Guide pas à pas',
      tabindex: '-1',
    });

    var title = el('div', { class: 'pinapp-guide-title', id: 'pinappGuideTitle', text: '' });
    var body = el('div', { class: 'pinapp-guide-body', id: 'pinappGuideBody', text: '' });
    var progress = el('div', {
      class: 'pinapp-guide-progress',
      id: 'pinappGuideProgress',
      text: '',
    });

    var actions = el('div', { class: 'pinapp-guide-actions' });
    var prev = el('button', { type: 'button', class: 'btn btn-secondary', id: 'pinappGuidePrev' }, [
      'Précédent',
    ]);
    var next = el('button', { type: 'button', class: 'btn btn-primary', id: 'pinappGuideNext' }, [
      'Suivant',
    ]);
    var close = el(
      'button',
      { type: 'button', class: 'btn btn-secondary', id: 'pinappGuideClose' },
      ['Fermer'],
    );
    var never = el(
      'button',
      { type: 'button', class: 'pinapp-guide-never', id: 'pinappGuideNever' },
      ['Ne plus afficher'],
    );

    actions.appendChild(prev);
    actions.appendChild(next);
    actions.appendChild(close);

    pop.appendChild(title);
    pop.appendChild(body);
    pop.appendChild(progress);
    pop.appendChild(actions);
    pop.appendChild(never);

    var lastFocus = null;
    var open = false;

    function render() {
      var s = steps[idx];
      var target = firstMatch(s && s.selector);
      title.textContent = s ? s.title : 'Guide';
      body.textContent = s ? s.body : '';
      progress.textContent = 'Étape ' + (idx + 1) + ' / ' + steps.length;

      prev.disabled = idx === 0;
      next.textContent = idx === steps.length - 1 ? 'Terminer' : 'Suivant';

      // Highlight target
      setSpotlight(spotlight, target);
      if (target) {
        target.classList.add('pinapp-guide-target');
        window.setTimeout(
          function () {
            target.classList.remove('pinapp-guide-target');
          },
          prefersReducedMotion ? 10 : 820,
        );
      }

      // Position
      positionPopover(pop, target);
      state.lastStep[key] = idx;
      writeState(state);
    }

    function setOpen(v) {
      open = !!v;
      overlay.classList.toggle('open', open);
      pop.classList.toggle('open', open);
      overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) {
        lastFocus = document.activeElement;
        render();
        window.setTimeout(function () {
          try {
            pop.focus();
          } catch (e) {}
        }, 0);
      } else {
        setSpotlight(spotlight, null);
        window.setTimeout(function () {
          try {
            (lastFocus && lastFocus.focus ? lastFocus : btn).focus();
          } catch (e) {}
        }, 0);
      }
    }

    function completeGuide() {
      state.completed[key] = true;
      state.lastStep[key] = 0;
      writeState(state);
      setOpen(false);
    }

    btn.addEventListener('click', function () {
      setOpen(true);
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) setOpen(false);
    });
    close.addEventListener('click', function () {
      setOpen(false);
    });
    prev.addEventListener('click', function () {
      idx = clamp(idx - 1, 0, steps.length - 1);
      render();
    });
    next.addEventListener('click', function () {
      if (idx >= steps.length - 1) return completeGuide();
      idx = clamp(idx + 1, 0, steps.length - 1);
      render();
    });
    never.addEventListener('click', function () {
      state.dismissed = true;
      writeState(state);
      setOpen(false);
      try {
        btn.remove();
      } catch (e) {}
    });

    document.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    });
    window.addEventListener(
      'resize',
      function () {
        if (!open) return;
        render();
      },
      { passive: true },
    );
    window.addEventListener(
      'scroll',
      function () {
        if (!open) return;
        render();
      },
      { passive: true },
    );

    // Mount
    document.body.appendChild(btn);
    document.body.appendChild(overlay);
    document.body.appendChild(pop);

    // Ne jamais auto-ouvrir : ça bloque l'UI (ex. toggle mode clair/sombre) et surprend.
    // Le guide reste disponible via le bouton flottant.
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
