FONTS — PINAPP AURA (self-host)
================================

Fichiers `.woff2` servis depuis `/assets/fonts/` (même origine que pinapp.fr,
équivalent self-host « Bunny » une fois le dépôt déployé sur l’hébergement).

- **Fraunces** : italique (variable 300–600) + normal (300–700), 3 sous-ensembles
  (viet / latin-ext / latin) — Google Fonts, licence SIL OFL 1.1.
- **General Sans** : 400, 500, 600 — Fontshare (usage vitrine ; conserver la
  licence dans le dossier projet).
- **JetBrains Mono** : 400 et 500 — Google Fonts, SIL OFL 1.1 (les fichiers
  latins sont partagés entre les deux graisses, comportement identique au CSS
  officiel).

Déclarations : `/assets/css/fonts.css` (`font-display: swap`).

Préchargement critique (home) : `fraunces-italic-latin.woff2` +
`general-sans-500.woff2`.

Anciens fichiers (Clash Display, Inter) : archives locales, non utilisés par
le bundle AURA.
