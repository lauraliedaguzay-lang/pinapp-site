/**
 * Pinapp Voyage V2 — configuration (remplir les webhooks côté déploiement / hébergeur).
 * Ne pas committer de secrets. Copier ce fichier ou injecter via build si besoin.
 */
(function () {
  window.PINAPP_CONFIG = window.PINAPP_CONFIG || {
    webhooks: {
      diagnostic: '',
      newsletter: '',
      parrainage: '',
    },
    calcom: {
      diagnostic: 'https://cal.com/lauralie-daguzay-hdglzw/diagnostic',
      audit: 'https://cal.com/lauralie-daguzay-hdglzw/diagnostic',
    },
  };
})();
