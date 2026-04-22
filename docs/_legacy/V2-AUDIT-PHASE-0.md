# Phase 0 — Audit repo (refonte voyage V2)

**Branche** : `refonte-aura-traces-df83` (courante au moment de l’audit)  
**Date** : exécution agent automatisée

## Stack existante (homepage `index.html`)

- HTML monolithique ~4100+ lignes : AURA + sections legacy + Vimeo + formulaires.
- CSS : `assets/css/tokens.css`, `aura.css`, `sections.css`, `base.css`, `pp-awwwards.css`, styles inline volumineux.
- JS : `preloader.js`, `splits.js`, `pp-awwwards-effects.js`, GSAP / Lenis en vendor, `aura.js`, `traces.js`, etc.
- **Prix / JSON-LD** (extraits du grep) : offres ~2500 €, 1200 € (répété), `priceRange` 1200€–8000€, contact `contact@pinapp.fr`, SIRET `523 884 898 00017`.

## Workflows

- Déploiement : GitHub Actions → Pages depuis `main` (cf. `.cursorrules`).

## Décision Phase 0 pour la suite

- La **refonte voyage V2** sera livrée d’abord comme **page dédiée** `voyage/index.html` (bundle CSS/JS voyage) pour **ne pas casser** l’accueil actuel avant validation humaine ; fusion racine `index.html` = étape merge explicite.
- Les pages légales existantes (`mentions-legales/`, `cgv/`, etc.) ne sont pas réécrites dans cette passe (Phase 8 partielle).

## Fichiers de pilotage

- `PINAPP_CURSOR_V2_MASTER.md`
- `pinapp-generate-voyage-images.ps1`
