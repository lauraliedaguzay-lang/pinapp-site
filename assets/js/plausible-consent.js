/**
 * Plausible + consentement RGPD — execution portee par pinapp-master-v3.js (`initCookieConsent`).
 * Chaque page qui charge pinapp-master-v3.js obtient banniere, stockage local et chargement conditionnel.
 * Pour une page sans master-v3, copier la logique depuis assets/js/pinapp-master-v3.js ou ajouter master-v3.
 */
(function () {
  'use strict';
  if (typeof window !== 'undefined' && window.__pinappCookieConsentInit) return;
})();
