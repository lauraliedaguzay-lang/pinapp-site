/**
 * Pinapp — pilotage studio (checklists Lauralie / Michaël / duo).
 * Persistance locale (localStorage), réinitialisation par semaine ISO.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'pinapp_studio_checklists_v1';

  var TASK_GROUPS = [
    {
      id: 'lauralie',
      title: 'Lauralie — priorité commerciale & admin',
      hint: 'Leads, relances, conformité légère, facturation.',
      tasks: [
        {
          id: 'l-leads',
          label:
            'Traiter les leads (diagnostic Pinapp, onboarding, notifications internes mail / WhatsApp / Claude)',
        },
        { id: 'l-relance', label: 'Relances devis & propositions en attente' },
        { id: 'l-clients', label: 'Suivi missions en cours (jalons, livrables)' },
        { id: 'l-compta', label: 'Facturation / numérotation PP- (voir règle compta Cursor)' },
        { id: 'l-rgpd', label: 'Demandes données / consentements si message reçu' },
      ],
    },
    {
      id: 'michael',
      title: 'Michaël — contenu, pédagogie & technique',
      hint: 'Catalogue, pages, préparation interventions.',
      tasks: [
        { id: 'm-catalog', label: 'Cohérence catalogue JSON + pages formation / offres' },
        { id: 'm-story', label: 'Storyboards & supports clients à jour' },
        { id: 'm-tech', label: 'Revue déploiement / CI / accessibilité si changement publié' },
        { id: 'm-demos', label: 'Démos & exemples (mentions « fictif » / maquettes)' },
      ],
    },
    {
      id: 'duo',
      title: 'Duo — rythme & visibilité',
      hint: 'Court point suffit : charge, blocages, décisions.',
      tasks: [
        { id: 'c-point', label: 'Point studio (15 min) — charge, priorités, risques' },
        {
          id: 'c-pipeline',
          label: 'Alignement pipeline (n8n / Notion / e-mail) si changement de process',
        },
        { id: 'c-veille', label: 'Digest veille / sécurité : lecture ou report explicite' },
      ],
    },
  ];

  function isoWeekKey() {
    var now = new Date();
    var d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var y = d.getUTCFullYear();
    var yearStart = new Date(Date.UTC(y, 0, 1));
    var w = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return y + '-W' + String(w).padStart(2, '0');
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { week: isoWeekKey(), checks: {} };
      var o = JSON.parse(raw);
      if (!o || typeof o !== 'object') return { week: isoWeekKey(), checks: {} };
      var wk = isoWeekKey();
      if (o.week !== wk) return { week: wk, checks: {} };
      return { week: wk, checks: o.checks && typeof o.checks === 'object' ? o.checks : {} };
    } catch (e) {
      return { week: isoWeekKey(), checks: {} };
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function allTaskIds() {
    var ids = [];
    TASK_GROUPS.forEach(function (g) {
      g.tasks.forEach(function (t) {
        ids.push(t.id);
      });
    });
    return ids;
  }

  function buildRecap(state) {
    var lines = ['Pinapp — récap studio (sem. ' + state.week + ')', ''];
    TASK_GROUPS.forEach(function (g) {
      var open = g.tasks.filter(function (t) {
        return !state.checks[t.id];
      });
      if (!open.length) return;
      lines.push('— ' + g.title);
      open.forEach(function (t) {
        lines.push('  • ' + t.label);
      });
      lines.push('');
    });
    if (lines.length <= 2) lines.push('(Rien en attente sur les listes — bravo.)');
    return lines.join('\n').trim();
  }

  function init() {
    var mount = document.getElementById('admin-studio-mount');
    if (!mount) return;

    var state = loadState();

    function render() {
      mount.innerHTML = '';
      var meta = document.createElement('p');
      meta.className = 'admin-studio-meta';
      meta.textContent =
        'Semaine ' +
        state.week +
        ' — les coches sont enregistrées sur cet appareil / ce navigateur.';
      mount.appendChild(meta);

      var grid = document.createElement('div');
      grid.className = 'admin-studio-grid';

      TASK_GROUPS.forEach(function (group) {
        var card = document.createElement('section');
        card.className = 'admin-studio-card';
        var h2 = document.createElement('h2');
        h2.textContent = group.title;
        card.appendChild(h2);
        if (group.hint) {
          var ph = document.createElement('p');
          ph.className = 'admin-studio-hint';
          ph.textContent = group.hint;
          card.appendChild(ph);
        }
        var ul = document.createElement('ul');
        ul.className = 'admin-studio-checklist';
        group.tasks.forEach(function (t) {
          var li = document.createElement('li');
          var label = document.createElement('label');
          var cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.checked = !!state.checks[t.id];
          cb.setAttribute('data-task-id', t.id);
          cb.addEventListener('change', function () {
            if (cb.checked) state.checks[t.id] = true;
            else delete state.checks[t.id];
            saveState(state);
          });
          label.appendChild(cb);
          label.appendChild(document.createTextNode(' ' + t.label));
          li.appendChild(label);
          ul.appendChild(li);
        });
        card.appendChild(ul);
        grid.appendChild(card);
      });

      mount.appendChild(grid);

      var actions = document.createElement('div');
      actions.className = 'admin-studio-actions';

      var btnReset = document.createElement('button');
      btnReset.type = 'button';
      btnReset.className = 'admin-btn';
      btnReset.textContent = 'Réinitialiser les coches (nouvelle semaine manuelle)';
      btnReset.addEventListener('click', function () {
        if (!window.confirm('Effacer toutes les coches pour cette semaine sur cet appareil ?'))
          return;
        state.checks = {};
        saveState(state);
        render();
      });

      var btnCopy = document.createElement('button');
      btnCopy.type = 'button';
      btnCopy.className = 'admin-btn admin-btn--primary';
      btnCopy.textContent = 'Copier le récap « à faire »';
      btnCopy.addEventListener('click', function () {
        var text = buildRecap(state);
        navigator.clipboard.writeText(text).catch(function () {});
      });

      actions.appendChild(btnReset);
      actions.appendChild(btnCopy);
      mount.appendChild(actions);
    }

    render();
  }

  window.PinappAdminStudio = { init: init };
})();
