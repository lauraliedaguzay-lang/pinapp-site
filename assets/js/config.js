/* =====================================================
   PINAPP STUDIO — config.js
   Configuration centralisée de tous les modules
   ⚙️  SEUL FICHIER À ÉDITER pour brancher vos webhooks n8n
   ===================================================== */

window.PinappConfig = {

  /* ─── WEBHOOKS N8N ─────────────────────────────────
     Remplacez [TON-N8N] par votre sous-domaine n8n
     Ex : https://lauralie.n8n.cloud/webhook/...
     ─────────────────────────────────────────────── */
  webhooks: {
    auroraAnalyse:   'https://[TON-N8N]/webhook/aurora-analyse',
    auroraUnivers:   'https://[TON-N8N]/webhook/aurora-univers',
    onboarding:      'https://[TON-N8N]/webhook/onboarding-lead',
    leadMagnet:      'https://[TON-N8N]/webhook/lead-guide',
    notifWhatsapp:   'https://[TON-N8N]/webhook/notif-lauralie',
  },

  /* ─── FEATURE FLAGS ─────────────────────────────────
     true  = utilise le webhook n8n (nécessite l'URL réelle)
     false = mode fallback local (toujours fonctionnel)
     ─────────────────────────────────────────────── */
  features: {
    auroraAnalyseIA: false,   // passer à true quand n8n est branché
    auroraUniversIA: false,   // passer à true quand n8n est branché
    onboardingWebhook: false, // passer à true quand n8n est branché
    leadWebhook: false,       // passer à true quand n8n est branché
  },

  /* ─── CONTACT ────────────────────────────────────── */
  email:    'lauralie.daguzay@pinapp.fr',
  whatsapp: 'https://wa.me/33XXXXXXXXX', // remplacer par le vrai numéro

  /* ─── BRANDING ───────────────────────────────────── */
  siteUrl: 'https://pinapp.fr',
};

/* Détection : webhook est-il une vraie URL ? */
window.PinappConfig._isRealUrl = function(url) {
  return url && !url.includes('[TON-N8N]') && url.startsWith('https://');
};
