/* =====================================================
   AURORA ANALYSE — L'IA analyse votre activité
   Pinapp Studio · Avril 2026

   ⚠️  CONFIGURATION REQUISE :
   Remplacer AURORA_ANALYSE_ENDPOINT par l'URL du webhook
   n8n qui fait le relais vers Claude.
   Ex : https://[votre-n8n]/webhook/aurora-analyse
   ===================================================== */

const AURORA_ANALYSE_ENDPOINT = 'https://[TON-N8N]/webhook/aurora-analyse';

const AuroraAnalyse = {
  async run() {
    const input  = document.getElementById('aurora-input');
    const result = document.getElementById('aurora-result');
    const btn    = document.querySelector('.aurora-submit');
    if (!input?.value?.trim()) return;

    // État chargement
    btn.textContent = 'Aurora analyse…';
    btn.disabled    = true;
    result.hidden   = false;
    result.innerHTML = '<span class="aurora-typing">●●●</span>';

    // Tracking intelligence
    if (window.PinappIntel) PinappIntel.markAurora();

    try {
      const resp = await fetch(AURORA_ANALYSE_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activite: input.value.trim() })
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const data = await resp.json();
      const text = data.text || data.content || data.response || '';

      if (!text) throw new Error('Réponse vide');

      // Affichage lettre par lettre — 28ms
      result.innerHTML = '';
      let i = 0;
      const type = setInterval(() => {
        if (i < text.length) {
          result.innerHTML = text
            .slice(0, i + 1)
            .replace(/\n/g, '<br>')
            .replace(/[①②③]/g, m => `<span class="aurora-num">${m}</span>`);
          i++;
        } else {
          clearInterval(type);
          // CTA après la réponse
          result.innerHTML += `<br><br><a href="/diagnostic/"
            class="aurora-cta btn-primary"
            style="display:inline-block;margin-top:8px;">
            Voir comment ça fonctionne &rarr;
          </a>`;
          btn.textContent = 'Nouvelle analyse →';
          btn.disabled    = false;
          input.value     = '';
        }
      }, 28);

    } catch (e) {
      result.innerHTML =
        '<span style="opacity:0.7">Aurora n\'a pas pu analyser votre activité.<br>' +
        '<a href="/diagnostic/" style="color:var(--teal)">Parlons-en directement →</a></span>';
      btn.textContent = 'Analyser mon activité →';
      btn.disabled    = false;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Entrée clavier — Shift+Entrée = nouvelle ligne, Entrée = analyser
  document.getElementById('aurora-input')
    ?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        AuroraAnalyse.run();
      }
    });

  // Placeholders rotatifs toutes les 3s
  const hints = [
    'Je suis esthéticienne à Lyon et je gère mes RDV à la main…',
    'Je suis artisan électricien et mes devis prennent 2h chacun…',
    'Je suis coach certifiée et je relance mes prospects à la main…',
    'Je suis restaurateur et je confirme chaque réservation par téléphone…',
    'Je suis photographe et ma facturation me prend une journée par mois…',
    'Je suis kiné et j\'envoie mes rappels de rendez-vous manuellement…',
  ];
  let hi = 0;
  const inp = document.getElementById('aurora-input');
  if (inp) {
    setInterval(() => {
      if (document.activeElement !== inp && !inp.value) {
        hi = (hi + 1) % hints.length;
        inp.placeholder = hints[hi];
      }
    }, 3200);
  }
});
