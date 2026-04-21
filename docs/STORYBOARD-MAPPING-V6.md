# Storyboard V6.0 — « Le film » · scroll-scrub · une seule vidéo

Document de vérité runtime : **`index.html`** + **`assets/js/pinapp-film-v6.js`** + **`assets/css/pinapp-film-v6.css`**.

## Pourquoi V6

V5 utilisait plusieurs `<video>` par section + lazy + classes cinéma héritées → discontinuités et `currentTime` peu fiables. **V6** : un fichier **`pinapp-film-v6`** (concat des 8 rushs) + **scroll → `currentTime`** (style Apple product pages).

## Architecture

- `html.voyage-v60-film` sur la page voyage.
- **Un** `<video id="pinapp-film">` en `position: fixed` + `.pinapp-film-overlay`.
- Les **10 sections** (`s0`–`s8`) scrollent au-dessus ; plus de `.voyage-scene__bg` / `.lieu-bg-video` pour le décor.
- `data-film-start` / `data-film-end` : bornes indicatives du segment (à recaler après `ffprobe` sur le fichier final).
- Scripts retirés : `voyage-bg-video.js`, `voyage-lazy-videos.js`.
- `voyage.js` : pas de pin/zoom par section en mode V6 (ScrollTrigger limité aux stats `scene_entered`).

## Tableau section → segment (placeholders 42 s total)

| Section | id | t début (s) | t fin (s) | Notes |
|---------|-----|-------------|-----------|--------|
| Ouverture | s0 | 0 | 3 | Logo + scroll cue |
| Prologue | s1 | 3 | 8 | Hero |
| Rencontre | s2 | 8 | 13 | Pilotes |
| Outils | s3 | 13 | 18 | Métiers |
| Constellation | s4 | 18 | 23 | Planètes |
| Preuves | s5 | 23 | 27 | Stats |
| Mécanisme | s5b | 27 | 30 | n8n |
| Manifeste | s6 | 30 | 34 | (vidéo widget manifeste inchangée) |
| Œuvre | s7 | 34 | 38 | Tourbillon |
| Atterrissage | s8 | 38 | 42 | Formulaire |

**Après build réel** : remplacer la durée totale et les bornes par les valeurs `ffprobe` du `pinapp-film-v6.mp4` final.

## Inspiration

Scroll-driven storytelling type **apple.com/iphone-16-pro** (référence technique, pas de code tiers).

## Génération des assets

PowerShell : **`tools/build-pinapp-film-v6.ps1`** (à lancer sur poste Lauralie avec les 8 MP4 sources).

## SEO

- `index.html` : `og:image` / `twitter:image` → `https://pinapp.fr/assets/images/og-pinapp-v6.jpg`.
