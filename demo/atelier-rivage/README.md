# Atelier Rivage · Démo carte de visite Pinapp Studio

> Démo haute couture vendable 6 000–12 000€ aux architectes haut de gamme.
> Concept : *« Entrez dans la maquette »* — l'utilisateur arrive sur une villa 3D blanche flottant dans le vide, clique pour entrer, et visite six pièces dans six lumières du jour.

## Stack

- **Three.js r0.160** (module ESM via CDN unpkg)
- **WebGL2** requis (fallback élégant sinon)
- Vanilla JS, aucun framework
- HTML5/CSS3 — Cormorant Garamond + Inter (Google Fonts)
- ~28 Ko HTML+CSS+JS · Three.js ~600 Ko gz · total < 1 Mo hors fonts

## Architecture

```
demo/atelier-rivage/
├── index.html              ← entrée principale
├── assets/
│   ├── config.json         ← palette, textes, scènes (centralisé pour ré-skin)
│   ├── style.css           ← design system villa (4 couleurs strictes)
│   ├── scene.js            ← Three.js villa procédurale + 9 keyframes caméra
│   ├── loader.js           ← LoadingManager + révélation lettre par lettre
│   ├── cursor.js           ← curseur custom magnétique lerp 0.15
│   └── audio.js            ← son ambiant procédural WebAudio (vent + vagues + craquements)
└── README.md
```

## Scènes (10)

| # | Scène | Contenu | Durée caméra |
|---|---|---|---|
| 0 | Loader | Barre or + "ATELIER RIVAGE" lettre par lettre | ~1.2s |
| 1 | Maquette extérieur | Villa procédurale flottant, particules dorées, rotation auto 0.6°/s | scroll-locked |
| 2 | Welcome | Fade noir + « Bienvenue. » Cormorant 80px | 1.2s |
| 3 | Hall · Aube | Lumière chaude rasante 06h12 | scroll |
| 4 | Salon · Midi | Lumière zénithale 12h47 | scroll |
| 5 | Cuisine · Après-midi | Oblique orange 16h08 | scroll |
| 6 | Chambre · Couchant | Or rasant 19h33 | scroll |
| 7 | Bureau · Crépuscule | Bleu profond + lampe 21h02 | scroll |
| 8 | Terrasse · Nuit | Étoiles + lune 23h44 | scroll |
| 9 | Outro | Dézoom + fenêtres allumées séquentiellement + CTAs | scroll |

## Modes de visualisation (apparaît après scène 4 cuisine)

- **Rendu** — matériaux PBR + éclairage cinématique.
- **Plan** — wireframe or, caméra orthographique top-down, overlay SVG de cotations.
- **Moodboard** — cartes flottantes (matières, atmosphère) en surimpression.

## Easter eggs

- **Konami code** (↑↑↓↓←→←→BA) → vue radiographique filaire dorée 5s.
- **Touche V** → ouvre le panneau Tweaks (vitesse rotation villa).
- **Drag villa** → override rotation 3s.

## Fallbacks

- **Reduced-motion** — désactive WebGL, affiche un poster statique avec dégradés or.
- **Mobile ≤768px** — version horizontale narrative sans WebGL, six rooms en cards à dégradés.
- **Pas de WebGL2** — message « Navigateur non supporté ».

## Ré-utilisation pour autres clients architectes

Tout est centralisé dans `assets/config.json` :

```json
{
  "brand": { "name": "...", "tagline": "...", "address": "...", "email": "..." },
  "palette": { "bg": "#050505", "ivory": "#F4EBD9", "gold": "#C9A96E", ... },
  "scenes": [ ... ]
}
```

Pour ré-skin un nouveau client (Studio Marais, Maison Calanque, etc.) :

1. Modifier `config.json` (couleurs + textes + heures de chaque pièce).
2. Modifier `style.css` :root variables si la palette change radicalement.
3. Modifier les volumes 3D dans `scene.js` au début (cherchez `// Main volume`, `// Cantilevered upper volume`, etc).
4. Adapter les keyframes caméra `cameraKeys[]` pour correspondre à la nouvelle volumétrie.

Temps estimé pour un re-skin complet : 0.5 à 1 jour (vs 3-5 jours from scratch).

## Performance

- Three.js scene : ~25 meshes, ~3 lights, 220 particules, 800 étoiles.
- DPR plafonné à 2.
- Pas de post-processing (grain + vignette en CSS).
- Cible Lighthouse Performance : ≥ 80 desktop, ≥ 70 mobile.
- Total payload < 5 Mo.

## V2 (futures évolutions)

- Remplacer la villa procédurale par un GLB Sketchfab/freelance pour photoréalisme.
- Ajouter `lenis` + `gsap/ScrollTrigger` (le scroll actuel est déjà smooth via raf-eased lerp ; à rajouter si on veut paralax avancé).
- Sound design pro en .ogg loop 30s (le actuel est procédural WebAudio).
- View Transitions API entre Rendu/Plan/Moodboard.

---

**Démo conçue par Pinapp Studio · pinapp.fr · Bordeaux**
