# Changelog — pinapp-site

## v15.5.0 — restore-narrative (2026-05-11)

- **voyage-v9** : restauration narrative (8 blocs) — `#hook-film` (placeholder vidéo terrain distinct du teaser 1190745013), `#orientation`, `#auto`, `#auto-faq`, `#cinema-artistes`, `#captation-na` (2 placeholders captation), `#methode-formations` (4 niveaux sans emoji, accents `data-niveau`), `#methode-tarifs` (grille T0–T6 + Pinapp Care).
- **Hero / copy** : eyebrow réalisations « Studio Lauralie · Code & Studio Micha · Imagerie » ; retrait emoji sur sources « pourquoi moins cher », duo N-A, offres déplacement.
- **CSS** : libellé placeholder `[ASSET À FOURNIR]` ; animation mot-par-mot `.word-reveal` + `@keyframes word-reveal-anim` (respect `prefers-reduced-motion`).
- **JS** : `initWordReveal()` sur `[data-reveal-words]` ; mode brouillon `Ctrl+D` / `Cmd+D` (`body.draft-mode`) — pilotage stage **inchangé** (Option B + Lenis, pas de nouvel IO stage).
- **Acquis** : Vimeo hero + icebreaker, Maison Solène, filtres réalisations, wizard contact, viewport, T5 à 3 890 €, `#temoignages` masqué, cookie banner (inchangé dans ce commit).
