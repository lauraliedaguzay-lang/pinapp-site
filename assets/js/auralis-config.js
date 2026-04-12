/**
 * Auralis — lien direct vers l’app quand APP_URL est défini (sinon CTA diagnostic sur la page).
 * Repo : éditer APP_URL ici ou laisser vide.
 * CI (GitHub Actions) : secret dépôt AURALIS_APP_URL → injecté au build (npm run build).
 */
window.PINAPP_AURALIS = {
  APP_URL: '',
};
