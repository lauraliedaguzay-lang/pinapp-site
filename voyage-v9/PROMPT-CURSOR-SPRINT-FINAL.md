# Sprint final voyage-v9 — statut implémentation (agent)

Ce fichier résume ce qui a été **appliqué dans le dépôt** sur la branche de travail (équivalent du prompt consolidé).

## Fait dans `voyage-v9/index.html` (+ JS)

1. **Auralis retiré** : scène 12b = M&P seule (`sisters__grid--solo`), W8 réécrit sans Auralis, skill Lauralie remplacé, zéro lien `/auralis/`.
2. **Liens légaux** : footer → `../legal/mentions-legales.html` (fichier présent dans `/legal/`).
3. **Baseline hero** : phrase backup « L'IA et l'automatisation… pas de gadget ».
4. **Scène 02b « Conviction »** : 3 piliers ; ancien avant/après renommé **02c** (`#s02c`).
5. **Canonical + Twitter** : `canonical` et `og:image` absolus pour `/voyage-v9/` ; meta Twitter title/description/image.
6. **Backdrop-filter** : réduit à **2** usages (nav scrollée + formulaire) ; autres surfaces en fond opaque renforcé.
7. **Animations** : `@keyframes` kenburns / line / pulse et reveals sous `prefers-reduced-motion` ; `html { scroll-behavior: auto }` ; ancres en `behavior: 'auto'`.
8. **Skip link** : `.sr:focus` visible.
9. **Nav mobile** : burger + drawer, fermeture après clic ancre / Escape ; Mode sobre dupliqué dans le drawer (`data-sober-toggle`).
10. **Formulaire** : labels `.diag__sr` + `id`/`for` sur champs.
11. **Compteur draft** : **13** `<div class="placeholder-asset">` (encart scène tarifs + encart 02b pour compenser la suppression sous 12b).

## Fichiers JS

- `scene-counter.js` / `film-chromatic.js` : alias **`s02c`** ajouté.

## Non couvert ici (sprint suivant)

Sand-text H2, Web Audio, logo morphing, scrub 8 chapitres, témoignages réels, blog, 7 SVG partenaires, activation webhooks prod.
