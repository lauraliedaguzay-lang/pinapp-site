/* =====================================================
   AURORA ANALYSE — L'IA analyse votre activité
   Pinapp Studio · Avril 2026

   ⚙️  Configuration dans assets/js/config.js
   Mettre features.auroraAnalyseIA = true quand n8n est branché.
   ===================================================== */

const AuroraAnalyse = {

  /* Fallback local — réponses pertinentes sans API */
  _localResponse(activite) {
    const a = activite.toLowerCase();
    const isArtisan  = /electri|plomb|charpent|maçon|carrel|peintr|menuisi|serru|couver|toitur/.test(a);
    const isBeaute   = /esthéti|estheti|coiff|ongl|cil|soins|spa|massage|beauté|beaute/.test(a);
    const isResto    = /restaurant|brasserie|café|cafe|bar|traiteur|pizz|boucher|boulang|patissier/.test(a);
    const isCoach    = /coach|conseil|consultant|formateur|therapeut|psych|naturo|ostéo|osteo/.test(a);
    const isCommerce = /boutique|magasin|commerce|vente|librairie|fleur|décor|decor/.test(a);
    const isPhoto    = /photographe|photo|vidéo|video|graphiste|design|illustrat/.test(a);

    if (isArtisan) return `① Votre site capte les urgences 24h/24 — le formulaire envoie une alerte WhatsApp en 30 secondes.\n② Vos devis partent automatiquement avec votre logo, vos tarifs et un lien de signature.\n③ Chaque client reçoit un rappel la veille de l'intervention — zéro no-show.`;
    if (isBeaute)  return `① Vos RDV sont confirmés automatiquement par email et SMS dès la réservation en ligne.\n② Les rappels partent 24h avant — réduisent les absences de 60 % en moyenne.\n③ Après chaque soin, un email de fidélisation propose la prochaine réservation.`;
    if (isResto)   return `① Les réservations arrivent sur votre téléphone en temps réel — même à 23h.\n② Votre menu est mis à jour en 30 secondes depuis votre téléphone.\n③ Les avis Google sont sollicités automatiquement après chaque repas.`;
    if (isCoach)   return `① Votre page de vente qualifie vos prospects — seuls ceux qui correspondent passent à l'étape suivante.\n② Le devis et le contrat partent automatiquement dès qu'un créneau est réservé.\n③ Vos relances sont programmées — vous ne perdez plus de leads dans votre boîte mail.`;
    if (isCommerce) return `① Votre boutique en ligne tourne sans vous — commandes, confirmations, suivi automatiques.\n② Les paniers abandonnés reçoivent une relance 1h après — récupère 15-20 % des ventes perdues.\n③ Vos stocks sont alertés avant la rupture.`;
    if (isPhoto)   return `① Votre portfolio capte des leads qualifiés — formulaire de brief intégré.\n② Les devis et contrats partent en 2 clics avec votre charte.\n③ Les relances clients sont automatisées — vous vous concentrez sur la création.`;

    return `① Un site qui travaille pendant que vous dormez — formulaires, confirmations, relances automatiques.\n② Vos devis partent en quelques secondes avec un lien de paiement intégré.\n③ Vous ne perdez plus de temps sur les tâches répétitives — votre système s'en charge.\n\nVotre diagnostic complet est gratuit et sans engagement.`;
  },

  async run() {
    const input  = document.getElementById('aurora-input');
    const result = document.getElementById('aurora-result');
    const btn    = document.querySelector('.aurora-submit');
    if (!input?.value?.trim()) return;

    const activite = input.value.trim();

    btn.textContent = 'Aurora analyse…';
    btn.disabled    = true;
    result.hidden   = false;
    result.innerHTML = '<span class="aurora-typing">●●●</span>';

    if (window.PinappIntel) PinappIntel.markAurora();

    const cfg = window.PinappConfig;
    const useN8n = cfg && cfg.features.auroraAnalyseIA && cfg._isRealUrl(cfg.webhooks.auroraAnalyse);

    let text = '';

    try {
      // Étape 2 — Netlify Function (clé API sécurisée, jamais en front)
      const netlifyResp = await fetch('/.netlify/functions/aurora', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activite }),
      });
      if (!netlifyResp.ok) throw new Error(`netlify ${netlifyResp.status}`);
      const netlifyData = await netlifyResp.json();
      text = netlifyData.result || '';
      if (!text) throw new Error('Réponse vide');
    } catch {
      // Fallback n8n webhook
      if (useN8n) {
        try {
          const resp = await fetch(cfg.webhooks.auroraAnalyse, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activite }),
          });
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const data = await resp.json();
          text = data.text || data.content || data.response || '';
          if (!text) throw new Error('Réponse vide');
        } catch {
          await new Promise(r => setTimeout(r, 600));
          text = this._localResponse(activite);
        }
      } else {
        /* Mode démo local — toujours actif sans API */
        await new Promise(r => setTimeout(r, 1200));
        text = this._localResponse(activite);
      }
    }

    /* Affichage lettre par lettre */
    result.innerHTML = '';
    let i = 0;
    const type = setInterval(() => {
      if (i < text.length) {
        result.innerHTML = text
          .slice(0, i + 1)
          .replace(/\n/g, '<br>')
          .replace(/[①②③④⑤]/g, m => `<span class="aurora-num">${m}</span>`);
        i++;
      } else {
        clearInterval(type);
        result.innerHTML += `<br><br>
          <a href="diagnostic/index.html"
            class="btn btn-primary aurora-cta"
            style="display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:12px 24px;font-size:14px;">
            Obtenir mon diagnostic gratuit &rarr;
          </a>
          <span style="display:block;font-size:12px;opacity:0.5;margin-top:8px;">Réponse sous 24 h · Zéro engagement</span>`;
        btn.textContent = 'Nouvelle analyse →';
        btn.disabled    = false;
        input.value     = '';
      }
    }, 22);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('aurora-input')
    ?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); AuroraAnalyse.run(); }
    });

  const hints = [
    'Je suis esthéticienne à Lyon et je gère mes RDV à la main…',
    'Je suis artisan électricien et mes devis prennent 2h chacun…',
    'Je suis coach certifiée et je relance mes prospects manuellement…',
    'Je suis restaurateur et je confirme chaque réservation par téléphone…',
    'Je suis photographe et ma facturation me prend une journée par mois…',
    'Je suis kiné et j\'envoie mes rappels de rendez-vous manuellement…',
    'Je suis fleuriste et je perds des commandes faute de site en ligne…',
    'Je suis consultant et mes relances clients me prennent des heures…',
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
