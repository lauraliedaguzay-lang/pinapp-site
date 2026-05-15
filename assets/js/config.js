/* =====================================================
   PINAPP STUDIO — config.js
   Configuration centralisée de tous les modules

   Médias (vidéos, photos, démos) : ne pas configurer ici.
   → Voir GUIDE-CONTENU.md à la racine du dépôt.

   Production (GitHub Actions / build) : définir les secrets
   PINAPP_N8N_BASE_URL (ou PINAPP_N8N_HOST) et optionnellement
   PINAPP_TALLY_DIAGNOSTIC_DEFAULT — le script inject-automation-config.mjs
   réécrit _site/assets/js/config.js et diagnostic-tally.ids.js au build.
   Fichier local : copier pinapp-automation.env.example → pinapp-automation.env

   Développement sans build : remplacer manuellement https://[TON-N8N] par
   votre base n8n (ex. https://lauralie.n8n.cloud) et passer les flags à true.

   FEATURE FLAGS : false = désactivé même si l’URL est valide. true = actif si URL valide.

   Cohérence pages (payload.source pour n8n) :
   • diagnosticWebhook + diagnosticLead → /diagnostic/, /client/ (idées),
     /votre-projet/ (source: votre-projet | idees-client | diagnostic)
   • diagnosticClaudePrep → même formulaires que ci-dessus (prépa interne)
   • onboardingWebhook + onboarding → main.js (newsletter / onboarding)
   • leadWebhook + leadMagnet → formation-gratuite (liste d’attente)
   • auroraAnalyseIA + auroraAnalyse → aurora-analyse.js (puis Netlify fn)
   • auroraUniversIA + auroraUnivers → univers.js, univers-questionnaire.js
   • whatsappNotifs + notifWhatsapp → univers.js après génération (notif interne)
   • formApproval, projetSigne, demandeAvis → réservés n8n / Netlify (approve.js), pas fetch front direct
   ===================================================== */

window.PinappConfig = {
  /* ─── WEBHOOKS N8N ─────────────────────────────────── */
  webhooks: {
    /* Leads & Diagnostic */
    // Activé 2026-05-15 — infra P2 finalisée (DNS + SSL Let's Encrypt + CORS).
    // Le webhook doit être créé côté n8n admin (workflow JSON dans infra/n8n/workflows/).
    diagnosticLead: 'https://n8n.pinapp.fr/webhook/diagnostic-lead', // ① Lead entrant
    formApproval: 'https://[TON-N8N]/webhook/lead-decision', // ② Décision approve/decline

    /* Onboarding questionnaire index.html */
    onboarding: 'https://[TON-N8N]/webhook/onboarding-lead', // ③ Parcours onboarding

    /* Lead magnet / guide offert */
    leadMagnet: 'https://[TON-N8N]/webhook/lead-guide', // ④ Guide gratuit demandé

    /* Aurora IA */
    auroraAnalyse: 'https://[TON-N8N]/webhook/aurora-analyse', // ⑤ Analyse site IA
    auroraUnivers: 'https://[TON-N8N]/webhook/aurora-univers', // ⑥ Univers généré IA

    /* Notifications internes */
    notifWhatsapp: 'https://[TON-N8N]/webhook/notif-lauralie', // ⑦ Notif WhatsApp Lauralie

    /* Projet signé */
    projetSigne: 'https://[TON-N8N]/webhook/projet-signe', // ⑧ Nouveau client signé

    /* Satisfaction / avis */
    demandeAvis: 'https://[TON-N8N]/webhook/demande-avis', // ⑨ Demande avis fin mission

    /* Premier passage Claude (n8n / Make) — notification interne ou brouillon, jamais envoi client auto */
    diagnosticClaudePrep: 'https://[TON-N8N]/webhook/diagnostic-claude-prep',
  },

  /* ─── FEATURE FLAGS ────────────────────────────────── */
  features: {
    /* Automation leads */
    diagnosticWebhook: true, // ① Actif — webhook https://n8n.pinapp.fr/webhook/diagnostic-lead
    onboardingWebhook: false, // ③ Activer quand n8n workflow "onboarding" est prêt
    leadWebhook: false, // ④ Activer quand n8n workflow "lead-guide" est prêt

    /* Aurora IA */
    auroraAnalyseIA: false, // ⑤ Activer quand Claude branché via n8n
    auroraUniversIA: false, // ⑥ Activer quand Claude branché via n8n

    /* Notifications */
    whatsappNotifs: false, // ⑦ Activer quand WhatsApp Business API configurée

    /* Claude prep : même payload que diagnostic + intent (orchestrateur n8n) */
    diagnosticClaudePrep: false,
  },

  /* ─── CONTACT ──────────────────────────────────────── */
  email: 'lauralie.daguzay@pinapp.fr',
  whatsapp: 'https://wa.me/33659882015',

  /* ─── BRANDING ─────────────────────────────────────── */
  siteUrl: 'https://pinapp.fr',

  /* ─── AUTOMATION APPROVE URL (WhatsApp flow) ───────── */
  /* Utilisé par n8n pour générer le lien d'approbation :
     {siteUrl}/.netlify/functions/approve?id={leadId}&token={hmacToken}&action=approve */
  approveEndpoint: 'https://pinapp.fr/.netlify/functions/approve',
};

/* Détection : webhook est-il une vraie URL ? */
window.PinappConfig._isRealUrl = function (url) {
  return (
    url &&
    typeof url === 'string' &&
    url.startsWith('https://') &&
    !url.includes('[TON-N8N]') &&
    !url.includes('REPLACE')
  );
};

/* Helper : déclencher le webhook diagnostic si activé */
/** Questionnaire accueil (index refonte) → même schéma que fetch manuel dans refonte-home.js */
window.PinappConfig.sendOnboardingLead = function (answers) {
  var cfg = window.PinappConfig;
  if (
    !cfg ||
    !cfg.features ||
    cfg.features.onboardingWebhook === false ||
    !cfg._isRealUrl(cfg.webhooks.onboarding)
  ) {
    return Promise.reject(new Error('onboarding webhook disabled'));
  }
  return fetch(cfg.webhooks.onboarding, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'pinapp-home-onboarding',
      answers: answers,
      timestamp: new Date().toISOString(),
    }),
  });
};

window.PinappConfig.sendDiagnosticLead = function (payload) {
  var cfg = window.PinappConfig;
  if (
    !cfg ||
    !cfg.features ||
    cfg.features.diagnosticWebhook === false ||
    !cfg._isRealUrl(cfg.webhooks.diagnosticLead)
  ) {
    return;
  }
  fetch(cfg.webhooks.diagnosticLead, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      Object.assign({ source: 'diagnostic', timestamp: new Date().toISOString() }, payload),
    ),
  }).catch(function () {});
};

/** Webhook optionnel : premier passage Claude / plan (n8n). Règle métier : pas d’email client automatique depuis ce flux. */
window.PinappConfig.sendDiagnosticClaudePrep = function (payload) {
  var cfg = window.PinappConfig;
  if (
    !cfg ||
    !cfg.features ||
    cfg.features.diagnosticClaudePrep === false ||
    !cfg._isRealUrl(cfg.webhooks.diagnosticClaudePrep)
  ) {
    return;
  }
  fetch(cfg.webhooks.diagnosticClaudePrep, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      Object.assign(
        {
          source: 'diagnostic',
          intent: 'diagnostic-claude-prep',
          timestamp: new Date().toISOString(),
        },
        payload,
      ),
    ),
  }).catch(function () {});
};

/* Formulaire accueil #pinapp-form (form-handler.js) : même webhook que diagnosticLead si activé. */
(function () {
  var cfg = window.PinappConfig;
  if (
    cfg &&
    cfg.features &&
    cfg.features.diagnosticWebhook === true &&
    cfg._isRealUrl &&
    cfg._isRealUrl(cfg.webhooks.diagnosticLead)
  ) {
    window.PINAPP_USE_N8N = true;
    window.PINAPP_N8N_URL = cfg.webhooks.diagnosticLead;
  }
})();
