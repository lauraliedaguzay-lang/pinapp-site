/* Pinapp : pas de révélation au scroll (charte zéro-scroll / pas d’IO sur sections).
   Ce fichier garantit seulement la classe utilitaire si du CSS l’attend plus tard. */
(function () {
  document.querySelectorAll('main > section, main > div > section').forEach(function (s) {
    s.classList.add('is-revealed');
  });
})();
