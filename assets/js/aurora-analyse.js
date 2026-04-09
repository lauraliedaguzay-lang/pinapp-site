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
    const isArtisan = /electri|plomb|charpent|maçon|carrel|peintr|menuisi|serru|couver|toitur/.test(
      a,
    );
    const isBeaute = /esthéti|estheti|coiff|ongl|cil|soins|spa|massage|beauté|beaute/.test(a);
    const isResto =
      /restaurant|brasserie|café|cafe|bar|traiteur|pizz|boucher|boulang|patissier/.test(a);
    const isCoach = /coach|conseil|consultant|formateur|therapeut|psych|naturo|ostéo|osteo/.test(a);
    const isCommerce = /boutique|magasin|commerce|vente|librairie|fleur|décor|decor/.test(a);
    const isPhoto = /photographe|photo|vidéo|video|graphiste|design|illustrat/.test(a);

    if (isArtisan)
      return `① Les demandes urgentes peuvent déclencher une alerte (ex. WhatsApp) dès réception du formulaire — selon la config choisie.\n② Les devis peuvent être générés et envoyés avec votre logo et tarifs, pour validation rapide.\n③ Des rappels automatiques la veille d'une intervention aident souvent à limiter les absences.\n\nCe sont des exemples types : votre diagnostic précisera ce qui est réaliste pour vous.`;
    if (isBeaute)
      return `① Confirmation par e-mail (et SMS si vous le souhaitez) dès une réservation en ligne.\n② Rappels la veille : beaucoup de salons constatent moins de lapins qu’avec des rappels manuels seuls.\n③ Un message de suivi après le soin peut inviter à reprogrammer — sans être intrusif.\n\nCe sont des pistes courantes ; le diagnostic affine ce qui vous correspond.`;
    if (isResto)
      return `① Les réservations peuvent arriver sur un canal que vous consultez (téléphone, tablette, outil dédié).\n② Le menu peut être mis à jour depuis un flux simple, sans repasser par un prestataire à chaque plat.\n③ Une sollicitation d’avis après le repas peut être automatisée — dans le respect du cadre légal.\n\nÀ valider ensemble selon votre outillage actuel.`;
    if (isCoach)
      return `① Une page claire peut qualifier les demandes avant un échange — vous gardez le filtre final.\n② Devis ou contrat : envoi automatique possible après réservation d’un créneau, sous votre validation.\n③ Des relances programmées limitent les dossiers qui restent en attente dans la boîte mail.\n\nLe diagnostic précise le périmètre réaliste pour votre activité.`;
    if (isCommerce)
      return `① Commandes et confirmations peuvent s’enchaîner avec peu de saisie manuelle.\n② Relance paniers abandonnés : utile quand c’est bien calibré (délai, ton, consentement).\n③ Alertes stock avant rupture : selon l’outil que vous utilisez.\n\nExemples indicatifs — pas un engagement de résultat chiffré.`;
    if (isPhoto)
      return `① Portfolio + formulaire de brief pour structurer les demandes entrantes.\n② Propositions de devis / contrats à valider en quelques clics, avec votre charte.\n③ Relances douces pour les dossiers en cours — vous restez maître du ton.\n\nVotre diagnostic gratuit précise ce qui est faisable dans votre stack.`;

    return `① Formulaires, confirmations et relances peuvent être orchestrés pour limiter la saisie répétitive.\n② Les devis peuvent intégrer un lien de paiement ou de signature — selon votre process.\n③ Vous gardez la validation aux étapes sensibles.\n\nDiagnostic gratuit et sans engagement : on affine ensemble ce qui a du sens pour vous.`;
  },

  async run() {
    const input = document.getElementById('aurora-input');
    const result = document.getElementById('aurora-result');
    const btn = document.querySelector('.aurora-submit');
    if (!input?.value?.trim()) return;

    const activite = input.value.trim();

    btn.textContent = 'Aurora analyse…';
    btn.disabled = true;
    result.hidden = false;
    result.innerHTML = '<span class="aurora-typing">●●●</span>';

    if (window.PinappIntel) PinappIntel.markAurora();

    const cfg = window.PinappConfig;
    const useN8n =
      cfg && cfg.features.auroraAnalyseIA && cfg._isRealUrl(cfg.webhooks.auroraAnalyse);

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
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activite }),
          });
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          const data = await resp.json();
          text = data.text || data.content || data.response || '';
          if (!text) throw new Error('Réponse vide');
        } catch {
          await new Promise((r) => setTimeout(r, 600));
          text = this._localResponse(activite);
        }
      } else {
        /* Mode démo local — toujours actif sans API */
        await new Promise((r) => setTimeout(r, 1200));
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
          .replace(/[①②③④⑤]/g, (m) => `<span class="aurora-num">${m}</span>`);
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
        btn.disabled = false;
        input.value = '';
      }
    }, 22);
  },
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('aurora-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      AuroraAnalyse.run();
    }
  });

  const hints = [
    'Je suis esthéticienne à Lyon et je gère mes RDV à la main…',
    'Je suis artisan électricien et mes devis prennent 2h chacun…',
    'Je suis coach certifiée et je relance mes prospects manuellement…',
    'Je suis restaurateur et je confirme chaque réservation par téléphone…',
    'Je suis photographe et ma facturation me prend une journée par mois…',
    "Je suis kiné et j'envoie mes rappels de rendez-vous manuellement…",
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
