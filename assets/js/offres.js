// assets/js/offres.js — Pinapp offres restructurées

function applySecteurFromQuery() {
  try {
    const s = new URLSearchParams(window.location.search).get('secteur');
    if (!s) return;
    const pill = document.querySelector('.secteur-pill[data-secteur="' + s + '"]');
    if (pill) pill.click();
    if (s === 'beaute') {
      const pipe = document.querySelector('.pipeline-pill[data-pipeline="beaute"]');
      if (pipe) pipe.click();
    }
  } catch (e) { /* noop */ }
}

// SÉLECTEUR SECTEUR → filtre les offres
document.querySelectorAll('.secteur-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.secteur-pill')
      .forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const s = pill.dataset.secteur;

    document.querySelectorAll('.offre-card').forEach(card => {
      const secteurs = card.dataset.secteurs || 'tous';
      const visible = s === 'tous' || secteurs.split(',').includes(s);
      card.style.display = visible ? '' : 'none';
    });
  });
});

document.addEventListener('DOMContentLoaded', applySecteurFromQuery);

// PIPELINE SECTEUR
document.querySelectorAll('.pipeline-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pipeline-pill')
      .forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const id = pill.dataset.pipeline;

    document.querySelectorAll('.pipeline-scenario')
      .forEach(s => s.classList.remove('active'));
    document.getElementById('pipeline-' + id)
      ?.classList.add('active');
  });
});

// CALCULATEUR TEMPS
const calcConfig = {
  rdv:      { id:'calc-rdv',      val:'val-rdv',      minsPerUnit:3  },
  devis:    { id:'calc-devis',    val:'val-devis',    minsPerUnit:45 },
  messages: { id:'calc-messages', val:'val-messages', minsPerUnit:4  },
  factures: { id:'calc-factures', val:'val-factures', minsPerUnit:15 },
};

function updateCalc() {
  let totalMins = 0;

  Object.entries(calcConfig).forEach(([key, cfg]) => {
    const slider = document.getElementById(cfg.id);
    const valEl  = document.getElementById(cfg.val);
    if (!slider) return;
    const v = parseInt(slider.value, 10);
    if (valEl) valEl.textContent = v;
    const weekly = key === 'factures' ? v / 4 : v;
    totalMins += weekly * cfg.minsPerUnit;
  });

  const totalH     = Math.round(totalMins / 60 * 10) / 10;
  const totalJours = Math.round(totalH * 52 / 8);
  const totalEuros = Math.round(totalH * 52 * 55);

  const totalEl = document.getElementById('calc-total');
  const subEl   = document.getElementById('calc-sub');
  const valEl   = document.getElementById('calc-valeur');

  if (totalEl) totalEl.textContent = totalH;
  if (subEl)   subEl.textContent   = 'Soit ' + totalJours + ' jours récupérés par an.';
  if (valEl)   valEl.textContent   = 'À 55€/h (TPE / indépendant) — c\'est ' +
    totalEuros.toLocaleString('fr-FR') + '€ de valeur libérée par an.';
}

Object.values(calcConfig).forEach(cfg => {
  document.getElementById(cfg.id)?.addEventListener('input', updateCalc);
});
updateCalc();

// PREFILL diagnostic depuis offre cliquée
document.querySelectorAll('[href*="diagnostic"][href*="offre"]').forEach(link => {
  link.addEventListener('click', () => {
    try {
      const url = new URL(link.href, location.href);
      const offre = url.searchParams.get('offre');
      if (offre) {
        const PinS = window.PinappStorage;
        if (PinS) PinS.set(PinS.KEYS.OFFRE, offre);
        else localStorage.setItem('pinapp-offre', offre);
      }
    } catch(e) {}
  });
});
