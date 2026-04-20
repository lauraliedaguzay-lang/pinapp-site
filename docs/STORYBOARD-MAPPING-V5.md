# Storyboard V5.0 — Ouverture + vidéos pinapp.fr + vanilla (référence)

Suite de la page **`index.html`** (voyage). La vérité runtime : sections `s0`–`s8`, `voyage.css`, scripts `voyage*.js`.

## Source inspiration

- Déploiement Magic (aperçu) : `https://damp-frost-8245.21st.app/`
- Chat Magic (pas de code TSX servi en clair via HTTP) : `https://21st.dev/magic-chat/5ee97564-ac57-4181-a606-6b3cd4937bf0`

**Crédit** : patterns et hiérarchie inspirés du flux **21st.dev Magic** ; implémentation **vanilla** dans ce dépôt (pas de React / Tailwind).

## Contenu protégé (pinapp-ultime)

Le rendu **ne reprend pas** les formulations interdites du déploiement Magic (ex. « Vous récoltez »). Les textes validés Pinapp restent sur le hero et le manifeste.

## Tableau scène → vidéo → composants

| Scène | ID | Vidéo (premier `source` prod) | Statut V5 | Composants clés |
|-------|-----|-------------------------------|-----------|------------------|
| Ouverture | `s0` | `01-main-hologramme.mp4` | ✓ | Logo pulse + scroll cue |
| Prologue | `s1` | `01-main-hologramme.mp4` | ✓ | Hero + holo + CTAs |
| Rencontre | `s2` | `02-couloir-passengers.mp4` | ✓ | Pilotes glass |
| Outils | `s3` | `03-hublot-cosmos.mp4` | ✓ | Grille métiers |
| Constellation | `s4` | `04-constellation-mp.mp4` | ✓ | Planètes + sand |
| Preuves | `s5` | `05-sortie-vaisseau.mp4` | ✓ | Stats / split |
| Mécanisme | `s5b` | `05-sortie-vaisseau.mp4` | ✓ | n8n flow + spark |
| Manifeste | `s6` | `06-balade-cosmos.mp4` | ✓ | Texte + engagements |
| Œuvre | `s7` | `07-tourbillon-etoiles.mp4` | ✓ | Tourbillon WebGL |
| Atterrissage | `s8` | `08-atterrissage-sable.mp4` | ✓ | FAQ + formulaire |

## Technique V5.0

- `html` : `voyage-v40-per-scene` (fonds par section, pas de cinéma scrubber sur l’accueil) + `voyage-v41-magic-media` (voile lisibilité dégradé `rgba(10,20,37,…)`).
- Lazy vidéos : attribut `data-lazy-video` + `assets/js/voyage-lazy-videos.js` (sauf `s0`/`s1` en `preload="auto"`).
- Transitions chapitre : overlay **800 ms** `cubic-bezier(0.22, 1, 0.36, 1)` (`chapter-nav.js` + `.chapter-transition-overlay`).
- Nav points : **10** ancres (`s0` … `s8`) via `chapter-nav.js`.

## Post-merge Lauralie

- Remplacer le placeholder **`assets/images/og-pinapp-v50.jpg`** par une capture ffmpeg depuis `01-main-hologramme` t ≈ 2 s (1200×630, q 85) une fois le MP4 local disponible.
- Vérifier les posters sous `https://pinapp.fr/assets/img/voyage/*-poster.jpg` si chemins diffèrent de la prod.
