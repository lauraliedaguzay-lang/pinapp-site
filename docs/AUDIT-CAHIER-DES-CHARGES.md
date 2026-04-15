# Audit de conformité — Cahier des charges Pinapp (vitrine)

**Date de référence :** avril 2026  
**Périmètre :** dépôt `pinapp-site` (HTML/CSS/JS), règles `.cursor/rules/`, docs internes.

## 1. Hiérarchie des sources

| Priorité | Document                                                                                                  | Rôle                                                                                                            |
| -------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| A        | `pinapp-zero-scroll.mdc`                                                                                  | Comportement scroll, barre de progression, interdiction de révélation des sections au fil du défilement         |
| B        | `modernite-apple.mdc`, `premium-web-design-apple-inspired.mdc`, `blocs-frosted-glass.mdc`                 | Direction HIG / WCAG / glass                                                                                    |
| C        | `pinapp-ultime-v3.mdc`                                                                                    | Règles « absolues » historiques + anti-patterns contenu ; **tokens CSS souvent non alignés sur le code actuel** |
| D        | `variables.css`, `pandora-jour-override.css`, `pinapp-modern-biolume.css`, **`pinapp-audit-harmony.css`** | **Réalité runtime** des couleurs, overlays, rayons + **motifs DA audit** (filets, kickers, biolume section)     |
| E        | `docs/claude-consultation/07-SYNTHESE-REGLES-PROJET.md`                                                   | Méta : ce qui est aspirationnel vs implémenté                                                                   |

**En cas de conflit :** appliquer **A + B + D** pour le front ; traiter **C** comme contrainte **éditoriale** et cible design **à réconcilier**, pas comme vérité du bundle CSS.

---

## 2. Tableau d’écart (synthèse)

| Exigence (source)                                                                           | Statut                                      | Détail / fichiers                                                                                      | Action recommandée                                                                                                                 |
| ------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Pas d’`IntersectionObserver` pour révéler `.section-enter` au scroll (`pinapp-zero-scroll`) | **Corrigé en code**                         | `scroll-cinema.js` appliquait `.visible` à l’intersection ; désormais révélation au `DOMContentLoaded` | Maintenir ; ne pas réintroduire l’IO sur les sections                                                                              |
| `scroll-behavior: smooth` interdit                                                          | **Conforme**                                | `assets/grid.css` : `scroll-behavior: auto`                                                            | —                                                                                                                                  |
| Barre `#scrollProgress` sans transition sur `transform`                                     | **Conforme**                                | `animations.css` : `transition: none`                                                                  | —                                                                                                                                  |
| Texte `#FFFFFF` dans les **deux** modes (`pinapp-ultime-v3`)                                | **Non conforme** au v3, **conforme** au HIG | Mode jour : `--text` / `#1A0A2E` (`variables.css`, override)                                           | **Mettre à jour v3** : texte clair en nuit, encre en jour                                                                          |
| Overlays `body::before` / `::after` imposés par le v3 (`rgba(4,8,18,…)`)                    | **Non conforme** au v3                      | `variables.css` : overlay nuit en dégradés biolume ; jour `transparent` sur `::after`                  | **Mettre à jour v3** ou documenter « Pandora v2 »                                                                                  |
| Un seul `.btn-primary` par page (`pinapp-ultime-v3`)                                        | **Non conforme**                            | Ex. `index.html` : plusieurs CTA primaires + boutons formulaire                                        | Décision produit : **exception documentée** (conversion) ou refactor sémantique (un seul primaire, autres `btn-secondary` / liens) |
| Breathe **4s** logo + CTA uniquement (`pinapp-ultime-v3`)                                   | **Écart**                                   | `--t-breathe` 6.5s, `kiri-soar` 5.5s, multiples surfaces animées                                       | Harmoniser wording v3 ↔ `variables.css`                                                                                            |
| Glassmorphism sur **toutes** les surfaces                                                   | **Partiel**                                 | Mobile : `backdrop-filter: none` sur cartes au-delà des N premières (`variables.css`)                  | Acceptable perf ; noter dans v3                                                                                                    |
| `prefers-reduced-motion` partout                                                            | **Partiel**                                 | Bien couvert sur CSS global ; animations mockup iPhone, particules, etc.                               | Revue ciblée des `@keyframes` sans garde                                                                                           |
| Fonds d’écran `bg-sombre.webp` / `bg-clair.webp` (v3)                                       | **Non conforme**                            | PNG Pandora `bg-pandora-nuit.png` / `bg-pandora-jour.png`                                              | Mettre à jour v3                                                                                                                   |
| Vanilla JS, pas de framework                                                                | **Conforme**                                | —                                                                                                      | —                                                                                                                                  |
| `height: 100svh` (pas `100vh` seul)                                                         | **Surtout conforme**                        | `variables.css` body `min-height: 100svh`                                                              | Grep ponctuel sur `100vh` résiduel                                                                                                 |
| `rel="noopener noreferrer"` liens externes                                                  | **À contrôler**                             | Cibles `_blank`                                                                                        | Audit ponctuel `grep target="_blank"`                                                                                              |
| Contenu : zéro « Lépine », zéro HEX visible, etc. (`pinapp-ultime-v3`)                      | **À vérifier** par grep                     | —                                                                                                      | Script ou revue éditoriale                                                                                                         |
| `IntersectionObserver` sur images / compteurs (`scroll-cinema`)                             | **Hors périmètre strict** du § « sections » | Toujours actif pour `.img-reveal`, `[data-count]`                                                      | Option : garder (UX) ou passer en révélation au load ; documenter choix                                                            |
| Démos : `demo-sector.js` IO sections                                                        | **Écart** si on étend zéro-scroll aux démos | `demo/*`                                                                                               | Tranche : démos = exception ou aligner                                                                                             |

---

## 3. Fichiers outils à connaître

- `assets/css/pinapp-audit-harmony.css` — harmonisation visuelle **audit / PDF** : teal `#00e5cc` · violet `#7b4fe8`, calques légers par `.snap-section` si `<main class="pinapp-da-page">`, classes utilitaires `.pinapp-da-kicker`, `.pinapp-da-strip`, `.pinapp-da-orbit` ; importé par `variables.css` (Studio) et `pinapp-global.css` (Inc.).
- `assets/js/main.js` — scroll progress, nav, hero load, **pas** d’IO sections (commentaire explicite).
- `assets/js/scroll-cinema.js` — nav `.scrolled`, **sections** (révélation), images, compteurs.
- `assets/js/demo-sector.js` — IO sur sections des pages démo.
- `.cursor/rules/pinapp-ultime-v3.mdc` — **alwaysApply** : ajouter un encart « référentiel effectif » pour éviter les régressions.

---

## 4. Prochaines étapes suggérées

1. **Produit / design :** trancher le nombre de CTA primaires par page (règle v3 vs tunnel de conversion).
2. **Règles :** mettre à jour `pinapp-ultime-v3.mdc` (tokens, overlays, typo jour/nuit) **ou** renommer en « archive cible 2024 » et créer `pinapp-design-referentiel-2026.mdc` aligné sur le CSS.
3. **Technique :** grep `target="_blank"` + ajout systématique `rel="noopener noreferrer"`.
4. **Accessibilité :** passe `prefers-reduced-motion` sur les JS qui lancent des animations hors CSS.

---

_Document vivant : à mettre à jour après chaque refonte majeure des tokens ou des règles Cursor._
