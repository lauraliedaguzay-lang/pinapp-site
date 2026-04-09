/* =====================================================
   DÉMOS — Features signature uniques par secteur
   Pinapp Studio · Avril 2026
   Chaque secteur a une feature interactive exclusive.
   ===================================================== */

(function () {
  'use strict';

  var S = window.PINAPP_DEMO_SITE;
  if (!S || !S.feature) return;

  var accent = S.accent || '#00E5CC';

  /* ── Injecter après la section services ──────────── */
  function inject(html) {
    var target = document.getElementById('demo-feature');
    if (target) target.innerHTML = html;
  }

  /* ── Utilitaires ─────────────────────────────────── */
  function fmt(n) { return n.toLocaleString('fr-FR') + ' €'; }
  function anim(el, from, to, dur, cb) {
    var t0 = Date.now();
    var tick = function () {
      var p = Math.min((Date.now() - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * e).toLocaleString('fr-FR');
      if (p < 1) requestAnimationFrame(tick);
      else if (cb) cb();
    };
    tick();
  }

  /* ================================================
     1. ARTISAN — Calculateur devis surface
     ============================================== */
  function featureCalculateurArtisan() {
    inject(`
      <div class="df-card">
        <p class="df-label">ESTIMEZ VOTRE CHANTIER</p>
        <h3 class="df-title">Surface à rénover</h3>
        <div class="df-slider-wrap">
          <input type="range" id="df-surface" min="10" max="200" value="60"
            class="df-slider" aria-label="Surface en m²">
          <p class="df-val"><span id="df-surface-val">60</span> m²</p>
        </div>
        <div class="df-pills-row" id="df-type-pills">
          <button class="df-pill active" data-mult="45">Standard</button>
          <button class="df-pill" data-mult="75">Premium</button>
          <button class="df-pill" data-mult="95">Urgent</button>
        </div>
        <div class="df-result-flip" id="df-result">
          <span class="df-currency">€</span>
          <span id="df-prix">2 700</span>
        </div>
        <p class="df-note">Estimation indicative — devis précis sous 24h</p>
        <button class="df-cta" onclick="document.getElementById('booking').scrollIntoView({behavior:'auto'})">
          Demander un devis gratuit →
        </button>
      </div>`);

    var slider = document.getElementById('df-surface');
    var valEl  = document.getElementById('df-surface-val');
    var prixEl = document.getElementById('df-prix');
    var mult   = 45;

    function calc() {
      var s = parseInt(slider.value);
      valEl.textContent = s;
      var target = s * mult;
      anim(prixEl, parseInt(prixEl.textContent.replace(/\s/g,'')) || target, target, 300);
    }

    slider.addEventListener('input', calc);

    document.querySelectorAll('#df-type-pills .df-pill').forEach(function(p) {
      p.addEventListener('click', function() {
        document.querySelectorAll('#df-type-pills .df-pill')
          .forEach(function(x) { x.classList.remove('active'); });
        p.classList.add('active');
        mult = parseInt(p.dataset.mult);
        calc();
      });
    });
  }

  /* ================================================
     2. RESTAURANT — Plan de salle SVG cliquable
     ============================================== */
  function featurePlanSalle() {
    var tables = [
      {id:'t1',x:40, y:40, r:22, cap:2, libre:true},
      {id:'t2',x:110,y:40, r:22, cap:2, libre:false},
      {id:'t3',x:180,y:40, r:22, cap:4, libre:true},
      {id:'t4',x:250,y:40, r:22, cap:4, libre:true},
      {id:'t5',x:40, y:110,r:28, cap:6, libre:true},
      {id:'t6',x:130,y:110,r:28, cap:6, libre:false},
      {id:'t7',x:220,y:110,r:28, cap:6, libre:true},
      {id:'t8',x:40, y:185,r:22, cap:2, libre:true},
      {id:'t9',x:110,y:185,r:22, cap:2, libre:false},
      {id:'t10',x:185,y:185,r:34, cap:8, libre:true},
    ];

    var svgCircles = tables.map(function(t) {
      var fill = t.libre ? 'rgba(0,180,100,0.18)' : 'rgba(200,30,30,0.18)';
      var stroke = t.libre ? '#39E075' : '#dc2626';
      return '<g class="df-table" data-id="' + t.id + '" style="cursor:' + (t.libre?'pointer':'default') + '">' +
        '<circle cx="' + t.x + '" cy="' + t.y + '" r="' + t.r + '"' +
          ' fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>' +
        '<text x="' + t.x + '" y="' + (t.y+4) + '"' +
          ' text-anchor="middle" font-size="10" fill="' + stroke + '">' +
          t.cap + 'p</text></g>';
    }).join('');

    inject(`
      <div class="df-card">
        <p class="df-label">PLAN DE SALLE</p>
        <h3 class="df-title">Choisissez votre table</h3>
        <div class="df-salle-wrap">
          <svg viewBox="0 0 300 240" class="df-salle-svg" role="img" aria-label="Plan de salle interactif">
            <rect x="0" y="0" width="300" height="240" rx="12"
              fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
            <text x="150" y="230" text-anchor="middle" font-size="9"
              fill="rgba(255,255,255,0.25)">ENTRÉE</text>
            ${svgCircles}
          </svg>
          <div class="df-salle-legend">
            <span class="df-leg-dot" style="background:#39E075"></span> Disponible
            <span class="df-leg-dot" style="background:#dc2626;margin-left:12px"></span> Réservée
          </div>
        </div>
        <div id="df-table-info" class="df-table-info" style="display:none">
          <p id="df-table-msg"></p>
          <button class="df-cta" onclick="document.getElementById('booking').scrollIntoView({behavior:'auto'})">
            Réserver cette table →
          </button>
        </div>
        <p class="df-note">Cliquez sur une table disponible</p>
      </div>`);

    document.querySelectorAll('.df-table').forEach(function(g) {
      var id = g.dataset.id;
      var t  = tables.find(function(x) { return x.id === id; });
      if (!t || !t.libre) return;
      g.addEventListener('click', function() {
        document.querySelectorAll('.df-table circle')
          .forEach(function(c) { c.setAttribute('stroke-width','1.5'); });
        g.querySelector('circle').setAttribute('stroke-width','3');
        var info = document.getElementById('df-table-info');
        var msg  = document.getElementById('df-table-msg');
        info.style.display = '';
        msg.textContent = 'Table ' + t.cap + ' personnes sélectionnée ✓';
      });
    });
  }

  /* ================================================
     3. COACH — Quiz compatibilité 5 questions
     ============================================== */
  function featureQuizCoach() {
    var qs = [
      { q: 'Vous avez une décision importante à prendre ?', oui: 20, non: 0 },
      { q: 'Vous vous sentez bloqué(e) depuis plus de 3 mois ?', oui: 20, non: 0 },
      { q: 'Vous avez déjà essayé seul(e) sans succès ?', oui: 20, non: 5 },
      { q: 'Vous êtes prêt(e) à passer à l\'action dès maintenant ?', oui: 30, non: 0 },
      { q: 'Un accompagnement extérieur vous semble utile ?', oui: 10, non: 0 },
    ];

    var current = 0, score = 0;

    inject(`
      <div class="df-card">
        <p class="df-label">ÊTES-VOUS FAIT(E) POUR TRAVAILLER ENSEMBLE ?</p>
        <h3 class="df-title">Quiz compatibilité</h3>
        <div class="df-quiz-wrap" id="df-quiz-wrap">
          <div class="df-progress-bar"><div class="df-progress-fill" id="df-qprog" style="width:0%"></div></div>
          <p class="df-quiz-q" id="df-quiz-q"></p>
          <div class="df-quiz-btns">
            <button class="df-btn-oui" id="df-oui">Oui</button>
            <button class="df-btn-non" id="df-non">Non</button>
          </div>
          <p class="df-quiz-count" id="df-qcount">1 / 5</p>
        </div>
        <div id="df-quiz-result" style="display:none;text-align:center">
          <div class="df-compat-ring">
            <svg viewBox="0 0 100 100" width="120">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>
              <circle id="df-ring" cx="50" cy="50" r="42" fill="none"
                stroke="${accent}" stroke-width="8"
                stroke-dasharray="264" stroke-dashoffset="264"
                transform="rotate(-90 50 50)"
                style="transition:stroke-dashoffset 1s ease"/>
            </svg>
            <p class="df-compat-pct" id="df-pct">0%</p>
          </div>
          <p class="df-compat-msg" id="df-compat-msg"></p>
          <button class="df-cta" onclick="document.getElementById('booking').scrollIntoView({behavior:'auto'})">
            Réserver une séance découverte →
          </button>
        </div>
      </div>`);

    function showQ() {
      if (current >= qs.length) return showResult();
      document.getElementById('df-quiz-q').textContent = qs[current].q;
      document.getElementById('df-qcount').textContent = (current+1) + ' / ' + qs.length;
      document.getElementById('df-qprog').style.width = ((current / qs.length) * 100) + '%';
    }
    function answer(oui) {
      score += oui ? qs[current].oui : qs[current].non;
      current++;
      if (current < qs.length) showQ();
      else showResult();
    }
    function showResult() {
      document.getElementById('df-quiz-wrap').style.display = 'none';
      document.getElementById('df-quiz-result').style.display = '';
      var pct = Math.min(score, 100);
      document.getElementById('df-pct').textContent = pct + '%';
      var ring = document.getElementById('df-ring');
      setTimeout(function() {
        ring.style.strokeDashoffset = 264 - (264 * pct / 100);
      }, 100);
      var msgs = {
        high: 'Nous sommes très compatibles. Passons à l\'action.',
        mid:  'De bonnes bases. Une séance pour confirmer.',
        low:  'Un premier échange pour voir si c\'est le bon moment.',
      };
      document.getElementById('df-compat-msg').textContent =
        pct >= 70 ? msgs.high : pct >= 40 ? msgs.mid : msgs.low;
    }
    document.getElementById('df-oui').addEventListener('click', function() { answer(true); });
    document.getElementById('df-non').addEventListener('click', function() { answer(false); });
    showQ();
  }

  /* ================================================
     4. AVOCAT — Arbre décision juridique
     ============================================== */
  function featureArbreJuridique() {
    var tree = {
      q: 'Quel est votre besoin principal ?',
      opts: [
        { label: 'Contrat / Accord', next: {
          q: 'Quel type de contrat ?',
          opts: [
            { label: 'Commercial', answer: 'Rédaction ou révision de contrat commercial. Consultation sous 48h.' },
            { label: 'Bail / Location', answer: 'Bail commercial ou résidentiel — vérification des clauses.' },
            { label: 'Partenariat', answer: 'Convention de partenariat — protégez vos intérêts dès le départ.' },
          ]
        }},
        { label: 'Litige / Conflit', next: {
          q: 'Avec qui ?',
          opts: [
            { label: 'Un client', answer: 'Mise en demeure, recouvrement, procédure. On établit la stratégie.' },
            { label: 'Un fournisseur', answer: 'Rupture de contrat, inexécution — vos recours en 3 étapes.' },
            { label: 'Un associé', answer: 'Conflit interne — médiation ou procédure. On vous guide.' },
          ]
        }},
        { label: 'Création / Société', next: {
          q: 'Quelle structure ?',
          opts: [
            { label: 'SAS / SARL', answer: 'Statuts sur mesure, pacte d\'associés, immatriculation sécurisée.' },
            { label: 'Auto-entrepreneur', answer: 'Contrats-types, protection intellectuelle, conformité URSSAF.' },
            { label: 'Reprise d\'entreprise', answer: 'Due diligence juridique complète avant toute acquisition.' },
          ]
        }},
      ]
    };

    inject(`
      <div class="df-card">
        <p class="df-label">TROUVEZ VOTRE RÉPONSE JURIDIQUE</p>
        <h3 class="df-title">Quel est votre situation ?</h3>
        <div id="df-tree"></div>
        <button class="df-cta" id="df-tree-cta" style="display:none"
          onclick="document.getElementById('booking').scrollIntoView({behavior:'auto'})">
          Parler à Maître Renaud →
        </button>
      </div>`);

    var treeEl = document.getElementById('df-tree');
    var history = [];

    function render(node) {
      treeEl.innerHTML = '';
      if (history.length > 0) {
        var back = document.createElement('button');
        back.className = 'df-pill df-back';
        back.textContent = '← Retour';
        back.addEventListener('click', function() {
          history.pop();
          render(history.length ? history[history.length - 1].next : tree);
        });
        treeEl.appendChild(back);
      }
      var qEl = document.createElement('p');
      qEl.className = 'df-quiz-q';
      qEl.textContent = node.q;
      treeEl.appendChild(qEl);

      if (node.opts) {
        node.opts.forEach(function(opt) {
          var btn = document.createElement('button');
          btn.className = 'df-pill';
          btn.textContent = opt.label;
          btn.addEventListener('click', function() {
            if (opt.answer) {
              treeEl.innerHTML = '<p class="df-answer">' + opt.answer + '</p>';
              document.getElementById('df-tree-cta').style.display = '';
            } else {
              history.push({ next: opt.next });
              render(opt.next);
            }
          });
          treeEl.appendChild(btn);
        });
      }
    }
    render(tree);
  }

  /* ================================================
     5. ESTHÉTICIENNE — Diagnostic peau
     ============================================== */
  function featureDiagnosticPeau() {
    var qs = [
      { q: 'Votre peau en milieu de journée :', opts: ['Tiraillements', 'Brillances T-zone', 'Mixte / Normal', 'Brillances totales'] },
      { q: 'Votre principale préoccupation :', opts: ['Rides / Fermeté', 'Éclat / Teint', 'Hydratation', 'Pores / Imperfections'] },
      { q: 'Votre routine actuelle :', opts: ['Aucune routine', 'Basique (nettoyage)', 'Complète', 'Je ne sais pas'] },
    ];

    var recos = [
      { type: 'Soin hydratation intense', desc: 'Masque régénérant + sérum acide hyaluronique.', prix: '75€' },
      { type: 'Soin éclat signature', desc: 'Peeling doux + luminothérapie LED.', prix: '90€' },
      { type: 'Soin anti-âge prestige', desc: 'Microneedling + collagène + UV', prix: '120€' },
      { type: 'Soin purifiant complet', desc: 'Extraction + masque argile + zinc.', prix: '65€' },
    ];

    var current = 0, answers = [];

    inject(`
      <div class="df-card">
        <p class="df-label">VOTRE DIAGNOSTIC PEAU</p>
        <h3 class="df-title">3 questions pour votre soin sur mesure</h3>
        <div class="df-progress-bar"><div class="df-progress-fill" id="df-dprog" style="width:0%"></div></div>
        <div id="df-diag-wrap">
          <p class="df-quiz-q" id="df-diag-q"></p>
          <div class="df-pills-col" id="df-diag-pills"></div>
        </div>
        <div id="df-diag-result" style="display:none">
          <div class="df-reco-card">
            <p class="df-label">VOTRE SOIN RECOMMANDÉ</p>
            <p class="df-reco-name" id="df-reco-name"></p>
            <p class="df-reco-desc" id="df-reco-desc"></p>
            <p class="df-reco-prix" id="df-reco-prix"></p>
          </div>
          <button class="df-cta" onclick="document.getElementById('booking').scrollIntoView({behavior:'auto'})">
            Réserver ce soin →
          </button>
        </div>
      </div>`);

    function showQ() {
      var q = qs[current];
      document.getElementById('df-diag-q').textContent = q.q;
      document.getElementById('df-dprog').style.width = ((current / qs.length) * 100) + '%';
      var pills = document.getElementById('df-diag-pills');
      pills.innerHTML = '';
      q.opts.forEach(function(o, i) {
        var b = document.createElement('button');
        b.className = 'df-pill';
        b.textContent = o;
        b.addEventListener('click', function() {
          answers.push(i);
          current++;
          if (current < qs.length) showQ();
          else showResult();
        });
        pills.appendChild(b);
      });
    }

    function showResult() {
      document.getElementById('df-diag-wrap').style.display = 'none';
      document.getElementById('df-diag-result').style.display = '';
      var idx = answers[1] % recos.length;
      var r = recos[idx];
      document.getElementById('df-reco-name').textContent = r.type;
      document.getElementById('df-reco-desc').textContent = r.desc;
      document.getElementById('df-reco-prix').textContent = r.prix;
    }
    showQ();
  }

  /* ================================================
     6. CILS — Configurateur extensions
     ============================================== */
  function featureConfigCils() {
    var longueurs = ['10mm', '12mm', '14mm', '16mm'];
    var courbes   = ['J', 'B', 'C', 'D'];
    var volumes   = ['Naturel', 'Classique', 'Volume russe'];
    var prix      = { '10mm': 45, '12mm': 55, '14mm': 65, '16mm': 75 };

    inject(`
      <div class="df-card">
        <p class="df-label">CONFIGUREZ VOS EXTENSIONS</p>
        <h3 class="df-title">Votre paire sur mesure</h3>
        <div class="df-cils-grid">
          <div>
            <p class="df-sub-label">Longueur</p>
            <div class="df-pills-row" id="df-long"></div>
          </div>
          <div>
            <p class="df-sub-label">Courbe</p>
            <div class="df-pills-row" id="df-courbe"></div>
          </div>
          <div>
            <p class="df-sub-label">Volume</p>
            <div class="df-pills-row" id="df-vol"></div>
          </div>
        </div>
        <div class="df-cils-preview" id="df-cils-preview">
          <svg viewBox="0 0 200 80" width="200" aria-hidden="true">
            <ellipse cx="100" cy="55" rx="80" ry="20" fill="rgba(255,255,255,0.08)"/>
            <g id="df-cils-svg" stroke="${accent}" stroke-width="2" stroke-linecap="round" fill="none"></g>
          </svg>
        </div>
        <div class="df-result-flip">
          <span class="df-currency">€</span>
          <span id="df-cils-prix">55</span>
        </div>
        <button class="df-cta" onclick="document.getElementById('booking').scrollIntoView({behavior:'auto'})">
          Réserver cette pose →
        </button>
      </div>`);

    var state = { long: '12mm', courbe: 'C', vol: 'Classique' };

    function makepills(el, items, key) {
      items.forEach(function(v) {
        var b = document.createElement('button');
        b.className = 'df-pill' + (state[key] === v ? ' active' : '');
        b.textContent = v;
        b.addEventListener('click', function() {
          el.querySelectorAll('.df-pill').forEach(function(x){x.classList.remove('active');});
          b.classList.add('active');
          state[key] = v;
          updateCils();
        });
        el.appendChild(b);
      });
    }

    makepills(document.getElementById('df-long'),   longueurs, 'long');
    makepills(document.getElementById('df-courbe'), courbes,   'courbe');
    makepills(document.getElementById('df-vol'),    volumes,   'vol');

    function updateCils() {
      var p = prix[state.long] || 55;
      if (state.vol === 'Volume russe') p += 20;
      document.getElementById('df-cils-prix').textContent = p;
      // SVG simplifié des cils
      var g = document.getElementById('df-cils-svg');
      var angles = { 'J':10, 'B':20, 'C':35, 'D':50 };
      var angle = angles[state.courbe] || 35;
      var n = state.vol === 'Volume russe' ? 11 : state.vol === 'Classique' ? 9 : 7;
      var paths = '';
      for (var i = 0; i < n; i++) {
        var x = 30 + i * (140 / (n - 1));
        var len = 20 + Math.sin((i / (n-1)) * Math.PI) * 14;
        var rad = (angle + (i - n/2) * 2) * Math.PI / 180;
        paths += '<line x1="' + x + '" y1="55" x2="' + (x + Math.sin(rad) * len) + '" y2="' + (55 - Math.cos(rad) * len) + '"/>';
      }
      g.innerHTML = paths;
    }
    updateCils();
  }

  /* ================================================
     7. ONGLES — 12 swatches → SVG main
     ============================================== */
  function featureSwatchesOngles() {
    var palette = [
      '#E8B4B8','#C9748F','#A84B6E','#7B2D4A',
      '#D4A574','#C07A40','#8B4513','#5C2A0A',
      '#9B7FF8','#6B4FC8','#3B2088','#1B0848',
    ];
    var selected = palette[0];
    var prix = ['25€ Vernis','35€ Semi-permanent','55€ Gel UV','75€ Capsules'];

    inject(`
      <div class="df-card">
        <p class="df-label">CHOISISSEZ VOTRE COULEUR</p>
        <h3 class="df-title">12 teintes · Votre aperçu en direct</h3>
        <div class="df-swatches" id="df-swatches"></div>
        <div class="df-nails-wrap">
          <svg viewBox="0 0 220 140" width="220" aria-label="Aperçu main avec couleur sélectionnée">
            <g id="df-nails-svg"></g>
          </svg>
        </div>
        <div class="df-pills-row" id="df-pose-pills"></div>
        <div class="df-result-flip">
          <span id="df-nails-prix">25€ Vernis</span>
        </div>
        <button class="df-cta" onclick="document.getElementById('booking').scrollIntoView({behavior:'auto'})">
          Réserver cette manucure →
        </button>
      </div>`);

    // Swatches
    var sw = document.getElementById('df-swatches');
    palette.forEach(function(c) {
      var b = document.createElement('button');
      b.className = 'df-swatch';
      b.style.background = c;
      b.setAttribute('aria-label', 'Couleur ' + c);
      b.addEventListener('click', function() {
        selected = c;
        document.querySelectorAll('.df-swatch').forEach(function(x){x.classList.remove('active');});
        b.classList.add('active');
        renderNails();
      });
      if (c === selected) b.classList.add('active');
      sw.appendChild(b);
    });

    // Poses
    var pp = document.getElementById('df-pose-pills');
    prix.forEach(function(p, i) {
      var b = document.createElement('button');
      b.className = 'df-pill' + (i===0?' active':'');
      b.textContent = p.split(' ')[1];
      b.addEventListener('click', function() {
        document.querySelectorAll('#df-pose-pills .df-pill').forEach(function(x){x.classList.remove('active');});
        b.classList.add('active');
        document.getElementById('df-nails-prix').textContent = p;
      });
      pp.appendChild(b);
    });

    // SVG main (5 doigts stylisés)
    var nailPositions = [
      {x:30, y:90, w:20, h:28, rx:10},
      {x:60, y:70, w:22, h:40, rx:11},
      {x:90, y:60, w:22, h:50, rx:11},
      {x:120,y:68, w:22, h:42, rx:11},
      {x:152,y:82, w:18, h:32, rx:9},
    ];

    function renderNails() {
      var g = document.getElementById('df-nails-svg');
      var shapes = nailPositions.map(function(n) {
        return '<rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '"' +
          ' rx="' + n.rx + '" fill="rgba(255,220,180,0.25)" stroke="rgba(255,200,150,0.4)" stroke-width="1"/>' +
          '<rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="14"' +
          ' rx="' + n.rx + '" fill="' + selected + '" opacity="0.90"/>';
      }).join('');
      g.innerHTML = shapes;
    }
    renderNails();
  }

  /* ================================================
     8. COIFFEUR — Slider longueur → prix
     ============================================== */
  function featureSliderCoiffeur() {
    inject(`
      <div class="df-card">
        <p class="df-label">ESTIMEZ VOTRE PRESTATION</p>
        <h3 class="df-title">Longueur de cheveux</h3>
        <div class="df-hair-levels" id="df-hair-levels">
          <button class="df-hair-btn active" data-label="Courts" data-prix="35" data-details="Coupe + brushing">Courts</button>
          <button class="df-hair-btn" data-label="Mi-longs" data-prix="55" data-details="Coupe + brushing + finitions">Mi-longs</button>
          <button class="df-hair-btn" data-label="Longs" data-prix="70" data-details="Coupe + brushing + soin kératine">Longs</button>
          <button class="df-hair-btn" data-label="Très longs" data-prix="90" data-details="Coupe + brushing + traitement complet">Très longs</button>
        </div>
        <div class="df-hair-visual" id="df-hair-visual">
          <div class="df-hair-icon" id="df-hair-icon">✂</div>
          <p class="df-hair-details" id="df-hair-details">Coupe + brushing</p>
        </div>
        <div class="df-result-flip">
          <span class="df-currency">À partir de </span>
          <span id="df-hair-prix">35</span>
          <span class="df-currency">€</span>
        </div>
        <button class="df-cta" onclick="document.getElementById('booking').scrollIntoView({behavior:'auto'})">
          Réserver ma coupe →
        </button>
      </div>`);

    document.querySelectorAll('.df-hair-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.df-hair-btn').forEach(function(b){b.classList.remove('active');});
        btn.classList.add('active');
        var prixEl = document.getElementById('df-hair-prix');
        anim(prixEl, parseInt(prixEl.textContent)||35, parseInt(btn.dataset.prix), 300);
        document.getElementById('df-hair-details').textContent = btn.dataset.details;
      });
    });
  }

  /* ================================================
     9. BARBIER — Booking 2 clics + countdown
     ============================================== */
  function featureBookingBarbier() {
    var services = [
      { nom: 'Coupe barbe', dur: '30min', prix: '25€' },
      { nom: 'Coupe cheveux', dur: '45min', prix: '30€' },
      { nom: 'Coupe + Barbe', dur: '1h', prix: '50€' },
      { nom: 'Rasage complet', dur: '45min', prix: '40€' },
    ];
    var creneaux = ['09:00','10:00','11:00','14:00','15:00','16:00','17:00'];
    var selected = { service: null, creneau: null };

    inject(`
      <div class="df-card">
        <p class="df-label">RÉSERVATION RAPIDE</p>
        <h3 class="df-title">2 clics. C'est réservé.</h3>
        <p class="df-sub-label">1. Choisissez votre prestation</p>
        <div class="df-pills-col" id="df-srv-pills"></div>
        <p class="df-sub-label" style="margin-top:16px">2. Votre créneau (aujourd'hui)</p>
        <div class="df-pills-row" id="df-time-pills"></div>
        <div id="df-barber-confirm" style="display:none;margin-top:20px">
          <div class="df-countdown-lcd">
            <span id="df-countdown">05:00</span>
          </div>
          <p class="df-confirm-txt" id="df-barber-msg"></p>
          <p class="df-note">Créneau réservé 5 minutes · DÉMO</p>
        </div>
      </div>`);

    var sp = document.getElementById('df-srv-pills');
    services.forEach(function(s) {
      var b = document.createElement('button');
      b.className = 'df-pill df-srv';
      b.innerHTML = '<strong>' + s.nom + '</strong> — ' + s.dur + ' · ' + s.prix;
      b.addEventListener('click', function() {
        document.querySelectorAll('.df-srv').forEach(function(x){x.classList.remove('active');});
        b.classList.add('active');
        selected.service = s;
        tryConfirm();
      });
      sp.appendChild(b);
    });

    var tp = document.getElementById('df-time-pills');
    creneaux.forEach(function(c) {
      var b = document.createElement('button');
      b.className = 'df-pill';
      b.textContent = c;
      b.addEventListener('click', function() {
        document.querySelectorAll('#df-time-pills .df-pill').forEach(function(x){x.classList.remove('active');});
        b.classList.add('active');
        selected.creneau = c;
        tryConfirm();
      });
      tp.appendChild(b);
    });

    var countdownInterval;
    function tryConfirm() {
      if (!selected.service || !selected.creneau) return;
      var conf = document.getElementById('df-barber-confirm');
      conf.style.display = '';
      document.getElementById('df-barber-msg').textContent =
        selected.service.nom + ' à ' + selected.creneau + ' — confirmé ✓';
      clearInterval(countdownInterval);
      var secs = 300;
      var el = document.getElementById('df-countdown');
      countdownInterval = setInterval(function() {
        secs--;
        if (secs <= 0) { clearInterval(countdownInterval); el.textContent = 'Expiré'; return; }
        var m = Math.floor(secs/60), s = secs%60;
        el.textContent = (m<10?'0':'') + m + ':' + (s<10?'0':'') + s;
      }, 1000);
    }
  }

  /* ================================================
     10. BOULANGERIE — Panier JS
     ============================================== */
  function featurePanierBoulangerie() {
    var produits = [
      { nom: 'Croissant pur beurre', prix: 1.80, emoji: '🥐' },
      { nom: 'Pain de campagne 400g', prix: 3.20, emoji: '🍞' },
      { nom: 'Tarte aux fraises', prix: 6.50, emoji: '🍓' },
      { nom: 'Chausson aux pommes', prix: 2.40, emoji: '🥧' },
      { nom: 'Éclair chocolat', prix: 3.90, emoji: '⚡' },
    ];
    var panier = {};

    inject(`
      <div class="df-card">
        <p class="df-label">CLICK & COLLECT</p>
        <h3 class="df-title">Commandez pour demain matin</h3>
        <div id="df-produits"></div>
        <div class="df-panier-total">
          <span>Total :</span>
          <span id="df-total">0,00 €</span>
        </div>
        <button class="df-cta" id="df-panier-cta" disabled
          onclick="document.getElementById('booking').scrollIntoView({behavior:'auto'})">
          Valider ma commande →
        </button>
        <p class="df-note">Retrait en boutique · DÉMO</p>
      </div>`);

    var wrap = document.getElementById('df-produits');
    produits.forEach(function(p, i) {
      var row = document.createElement('div');
      row.className = 'df-panier-row';
      row.innerHTML =
        '<span class="df-panier-emoji">' + p.emoji + '</span>' +
        '<span class="df-panier-nom">' + p.nom + '</span>' +
        '<span class="df-panier-prix">' + p.prix.toFixed(2).replace('.',',') + '€</span>' +
        '<div class="df-qte-ctrl">' +
          '<button class="df-qte-btn df-minus" data-i="' + i + '">−</button>' +
          '<span class="df-qte" id="df-q' + i + '">0</span>' +
          '<button class="df-qte-btn df-plus" data-i="' + i + '">+</button>' +
        '</div>';
      wrap.appendChild(row);
    });

    function updateTotal() {
      var total = 0;
      Object.keys(panier).forEach(function(k) {
        total += produits[k].prix * panier[k];
      });
      document.getElementById('df-total').textContent = total.toFixed(2).replace('.',',') + ' €';
      document.getElementById('df-panier-cta').disabled = total === 0;
    }

    document.querySelectorAll('.df-plus').forEach(function(b) {
      b.addEventListener('click', function() {
        var i = parseInt(b.dataset.i);
        panier[i] = (panier[i] || 0) + 1;
        document.getElementById('df-q'+i).textContent = panier[i];
        updateTotal();
      });
    });
    document.querySelectorAll('.df-minus').forEach(function(b) {
      b.addEventListener('click', function() {
        var i = parseInt(b.dataset.i);
        if ((panier[i] || 0) > 0) {
          panier[i]--;
          document.getElementById('df-q'+i).textContent = panier[i];
          updateTotal();
        }
      });
    });
  }

  /* ================================================
     11. FITNESS — Calculateur Harris-Benedict
     ============================================== */
  function featureHarrisBenedict() {
    inject(`
      <div class="df-card">
        <p class="df-label">CALCULATEUR PERSONNALISÉ</p>
        <h3 class="df-title">Vos besoins caloriques</h3>
        <div class="df-hb-form">
          <div class="df-hb-row">
            <label>Sexe</label>
            <div class="df-pills-row">
              <button class="df-pill active" data-sexe="H">Homme</button>
              <button class="df-pill" data-sexe="F">Femme</button>
            </div>
          </div>
          <div class="df-hb-row">
            <label>Âge</label>
            <input type="number" id="df-age" value="30" min="15" max="80" class="df-input">
          </div>
          <div class="df-hb-row">
            <label>Poids (kg)</label>
            <input type="number" id="df-poids" value="75" min="40" max="200" class="df-input">
          </div>
          <div class="df-hb-row">
            <label>Taille (cm)</label>
            <input type="number" id="df-taille" value="175" min="140" max="220" class="df-input">
          </div>
          <div class="df-hb-row">
            <label>Activité</label>
            <div class="df-pills-row" id="df-act-pills">
              <button class="df-pill" data-fact="1.2">Sédentaire</button>
              <button class="df-pill active" data-fact="1.55">Modérée</button>
              <button class="df-pill" data-fact="1.725">Intense</button>
            </div>
          </div>
        </div>
        <button class="df-cta df-calc-btn" id="df-hb-calc">Calculer →</button>
        <div id="df-hb-result" style="display:none;margin-top:20px">
          <div class="df-hb-res-grid">
            <div class="df-hb-stat"><p class="df-hb-val" id="df-bmr"></p><p class="df-hb-lab">BMR (kcal)</p></div>
            <div class="df-hb-stat"><p class="df-hb-val" id="df-tdee"></p><p class="df-hb-lab">TDEE (kcal)</p></div>
            <div class="df-hb-stat"><p class="df-hb-val" id="df-imc"></p><p class="df-hb-lab">IMC</p></div>
          </div>
          <svg id="df-hb-bar" viewBox="0 0 300 60" width="100%" style="margin-top:12px"></svg>
          <p class="df-hb-msg" id="df-hb-msg"></p>
          <button class="df-cta" onclick="document.getElementById('booking').scrollIntoView({behavior:'auto'})">
            Démarrer mon programme →
          </button>
        </div>
      </div>`);

    var sexe = 'H', fact = 1.55;

    document.querySelectorAll('[data-sexe]').forEach(function(b) {
      b.addEventListener('click', function() {
        document.querySelectorAll('[data-sexe]').forEach(function(x){x.classList.remove('active');});
        b.classList.add('active'); sexe = b.dataset.sexe;
      });
    });
    document.querySelectorAll('[data-fact]').forEach(function(b) {
      b.addEventListener('click', function() {
        document.querySelectorAll('[data-fact]').forEach(function(x){x.classList.remove('active');});
        b.classList.add('active'); fact = parseFloat(b.dataset.fact);
      });
    });

    document.getElementById('df-hb-calc').addEventListener('click', function() {
      var age    = parseInt(document.getElementById('df-age').value) || 30;
      var poids  = parseInt(document.getElementById('df-poids').value) || 75;
      var taille = parseInt(document.getElementById('df-taille').value) || 175;
      var bmr = sexe === 'H'
        ? 88.362 + 13.397*poids + 4.799*taille - 5.677*age
        : 447.593 + 9.247*poids + 3.098*taille - 4.330*age;
      var tdee = Math.round(bmr * fact);
      var imc  = (poids / ((taille/100) * (taille/100))).toFixed(1);
      var msg  = imc < 18.5 ? 'Sous le poids idéal — programme prise de masse.' :
                 imc < 25   ? 'IMC idéal — programme performance.' :
                 imc < 30   ? 'Légère surcharge — programme perte de gras.' :
                              'Programme intensif recommandé.';
      document.getElementById('df-bmr').textContent  = Math.round(bmr);
      document.getElementById('df-tdee').textContent = tdee;
      document.getElementById('df-imc').textContent  = imc;
      document.getElementById('df-hb-msg').textContent = msg;
      document.getElementById('df-hb-result').style.display = '';
      // Barre macro SVG
      var svg = document.getElementById('df-hb-bar');
      var prot = Math.round(tdee * 0.30 / 4), carbs = Math.round(tdee * 0.45 / 4), lip = Math.round(tdee * 0.25 / 9);
      svg.innerHTML =
        '<rect x="0" y="20" width="90" height="20" rx="4" fill="#00E5CC"/>' +
        '<rect x="95" y="20" width="110" height="20" rx="4" fill="#7B4FE8"/>' +
        '<rect x="210" y="20" width="90" height="20" rx="4" fill="#FFB830"/>' +
        '<text x="45" y="14" text-anchor="middle" font-size="9" fill="#00E5CC">Protéines</text>' +
        '<text x="150" y="14" text-anchor="middle" font-size="9" fill="#7B4FE8">Glucides</text>' +
        '<text x="255" y="14" text-anchor="middle" font-size="9" fill="#FFB830">Lipides</text>' +
        '<text x="45" y="52" text-anchor="middle" font-size="9" fill="rgba(238,248,255,0.6)">' + prot + 'g</text>' +
        '<text x="150" y="52" text-anchor="middle" font-size="9" fill="rgba(238,248,255,0.6)">' + carbs + 'g</text>' +
        '<text x="255" y="52" text-anchor="middle" font-size="9" fill="rgba(238,248,255,0.6)">' + lip + 'g</text>';
    });
  }

  /* ── Dispatch selon S.feature ────────────────────── */
  var features = {
    'calculateur-artisan':  featureCalculateurArtisan,
    'plan-salle':           featurePlanSalle,
    'quiz-coach':           featureQuizCoach,
    'arbre-juridique':      featureArbreJuridique,
    'diagnostic-peau':      featureDiagnosticPeau,
    'config-cils':          featureConfigCils,
    'swatches-ongles':      featureSwatchesOngles,
    'slider-coiffeur':      featureSliderCoiffeur,
    'booking-barbier':      featureBookingBarbier,
    'panier-boulangerie':   featurePanierBoulangerie,
    'harris-benedict':      featureHarrisBenedict,
  };

  document.addEventListener('DOMContentLoaded', function() {
    var fn = features[S.feature];
    if (fn) fn();
  });

})();
