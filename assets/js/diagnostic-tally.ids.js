/**
 * Formulaire Tally « Diagnostic Pinapp » : après publication, l’ID est le segment d’URL
 * (ex. tally.so/r/XXXXX → XXXXX, ou embed tally.so/embed/XXXXX).
 *
 * Alias : `window.__PINAPP_TALLY__` pointe sur le même objet que `PINAPP_TALLY_DIAGNOSTIC`.
 * Laissez une clé vide ('') pour réutiliser le formulaire `default` sur les onglets.
 *
 * Remplissage : .\tools\pinapp-diagnostic-tally.ps1 -Default VOTRE_ID
 */
window.PINAPP_TALLY_DIAGNOSTIC = {
  default: '',
  systeme: '',
  image: '',
  duo: '',
};
window.__PINAPP_TALLY__ = window.PINAPP_TALLY_DIAGNOSTIC;
