# 06 · ASSETS — Inventaire complet

> Fonts, vidéos, images, pipeline ffmpeg, chemins exacts.

---

## 🔤 Fonts

### Self-hosted (production)

#### Geist Sans (Vercel · OFL)
| Poids | Fichier | Taille |
|---|---|---|
| 400 regular | `/assets/fonts/geist-sans-400.woff2` | ~26 KB |
| 500 medium | `/assets/fonts/geist-sans-500.woff2` | ~26 KB |
| 600 semibold | `/assets/fonts/geist-sans-600.woff2` | ~26 KB |
| 700 bold | `/assets/fonts/geist-sans-700.woff2` | ~26 KB |

**Total statique** : ~104 KB (4 fichiers).

**Migration future** : `Geist-Variable.woff2` (1 fichier · 45 KB · -57%).
Lien download : https://vercel.com/font (license MIT/OFL).

#### Fraunces italic (SIL OFL)
| Set | Fichier | Taille |
|---|---|---|
| Latin italique 400 | `/assets/fonts/fraunces-italic-latin.woff2` | ~20 KB |
| Latin extended italique | `/assets/fonts/fraunces-italic-ext.woff2` | ~22 KB |

**Total statique** : ~42 KB.

**Migration future** : `Fraunces-VariableFont_SOFT,WONK,opsz,wght.woff2` (~85 KB pour tous axes).
Lien : https://fonts.google.com/specimen/Fraunces ou https://fraunces.undercase.xyz/.

#### À ajouter — Geist Mono
| Poids | Fichier | Statut |
|---|---|---|
| 400 regular | `/assets/fonts/geist-mono-400.woff2` | **Non self-hosté actuellement** |
| 500 medium | `/assets/fonts/geist-mono-500.woff2` | **Non self-hosté actuellement** |

Utilisé par : cursor timecode, scene counter, lang switcher. Fallback actuel : `'JetBrains Mono', ui-monospace, Menlo, monospace`.

**Action** : télécharger + self-host pour cohérence famille Geist.

### Preloads dans `<head>`

```html
<link rel="preload" href="/assets/fonts/geist-sans-500.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/assets/fonts/fraunces-italic-latin.woff2" as="font" type="font/woff2" crossorigin />
```

**Note** : seuls 2 weights préchargés (500 + italic). Autres poids chargés `font-display: swap` au besoin.

### Font stacks runtime

```css
--font-body: 'Geist', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
--font-accent: 'Fraunces', Georgia, 'Cormorant Garamond', serif;
```

---

## 🎬 Vidéos

### Film V6 principal

| Fichier | Taille | Résolution | Codec | Pixel format |
|---|---|---|---|---|
| `assets/video/voyage/pinapp-film-v6.mp4` | 14.86 MB | 1280×720 | H.264 High L4.0 | **yuv420p** |
| `assets/video/voyage/pinapp-film-v6.webm` | 6.21 MB | 1280×720 | VP9 | **yuv420p** |

**Caractéristiques** :
- Durée : 62.833s
- FPS : 24
- Keyframes MP4 : 137 (1 toutes les 0.47s)
- `+faststart` flag : YES (header au début)
- Audio : NONE (silent)

### Segments sources (8 fichiers)

Dans `assets/video/voyage/` :

| Fichier | Durée | Contenu RÉEL |
|---|---|---|
| `01-main-hologramme.mp4` | 5.04s | **Main qui touche cercle cyan** (V7 update) |
| `02-couloir-passengers.mp4` | 7.04s | Hublot latéral galaxie orange (type Passengers) |
| `03-hublot-cosmos.mp4` | 10.04s | **Tourbillon doré particules** (⚠️ naming trompeur) |
| `04-constellation-mp.mp4` | 6.04s | **Vrai hublot Passengers** étoile double + planète |
| `05-sortie-vaisseau.mp4` | 10.04s | **3 cristaux colorés flottants** (cyan/violet/or) |
| `06-balade-cosmos.mp4` | 10.04s | Spirale dorée (**doublon quasi-identique** de 03) |
| `07-tourbillon-etoiles.mp4` | 8.04s | **LUNE contemplative** (⚠️ naming trompeur) |
| `08-atterrissage-sable.mp4` | 10.04s | Dunes de sable + ciel étoilé |

**Total brute** : 66.32s. Après concat + 7 crossfades 0.5s : 62.83s.

### Backups (safety)

Dans `assets/video/voyage/_backup-20260421-pre-recalibrate/` :
- `01-main-hologramme-OLD-cockpit.mp4` (ancien fichier avant V7 replacement, préserve le cockpit cosmos original)
- `01-main-hologramme-cockpit.mp4` (copie de sécurité)

### Pipeline ffmpeg

Script actuel : `tools/build-pinapp-film-v6.ps1` (obsolète V6 simple concat, à mettre à jour pour V7 avec xfades).

**Commande ffmpeg V7 utilisée** (à intégrer au script) :

```bash
ffmpeg -y \
  -i 01-main-hologramme.mp4 \
  -i 02-couloir-passengers.mp4 \
  -i 03-hublot-cosmos.mp4 \
  -i 04-constellation-mp.mp4 \
  -i 05-sortie-vaisseau.mp4 \
  -i 06-balade-cosmos.mp4 \
  -i 07-tourbillon-etoiles.mp4 \
  -i 08-atterrissage-sable.mp4 \
  -filter_complex "[0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24,format=yuv420p,setpts=PTS-STARTPTS[v0];\
... (répéter pour v1-v7) ;\
[v0][v1]xfade=transition=fade:duration=0.5:offset=4.541667[x1];\
[x1][v2]xfade=transition=fade:duration=0.5:offset=11.083334[x2];\
[x2][v3]xfade=transition=fade:duration=0.5:offset=20.625001[x3];\
[x3][v4]xfade=transition=fade:duration=0.5:offset=26.166668[x4];\
[x4][v5]xfade=transition=fade:duration=0.5:offset=35.708335[x5];\
[x5][v6]xfade=transition=fade:duration=0.5:offset=45.250002[x6];\
[x6][v7]xfade=transition=fade:duration=0.5:offset=52.791669,format=yuv420p[vout]" \
  -map "[vout]" \
  -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p \
  -crf 23 -preset medium \
  -g 12 -keyint_min 12 -force_key_frames "expr:gte(t,n_forced*0.5)" \
  -movflags +faststart -an \
  pinapp-film-v6.mp4
```

**Pour WebM VP9** (même filter_complex) :
```bash
-c:v libvpx-vp9 -crf 33 -b:v 0 -row-mt 1 -tile-columns 2 -threads 4 -g 48 -keyint_min 48 -pix_fmt yuv420p -deadline good -cpu-used 2 -an pinapp-film-v6.webm
```

**Durée encodage** : ~15s mp4 / ~75s webm sur M1 ou équivalent.

---

## 🖼️ Images

### Film posters (fallback reduced-motion)

Dans `assets/img/voyage/film-posters/` :

| Fichier | Dimensions | Rôle | Timestamp extract |
|---|---|---|---|
| `00-ouverture.jpg` | 1280×720 | LCP hero (preload !) · scène s0 | t=2s |
| `01-prologue.jpg` | 1280×720 | scène s1 | t=4.5s |
| `02-rencontre.jpg` | 1280×720 | scène s2 | t=8s |
| `03-outils.jpg` | 1280×720 | scène s3 | t=14s |
| `04-constellation.jpg` | 1280×720 | scène s4 | t=23s |
| `05-preuves.jpg` | 1280×720 | scène s5 | t=30s |
| `06-mecanisme.jpg` | 1280×720 | scène s5b | t=34s |
| `07-manifeste.jpg` | 1280×720 | scène s6 | t=42s |
| `08-oeuvre.jpg` | 1280×720 | scène s7 | t=49s |
| `09-atterrissage.jpg` | 1280×720 | scène s8 | t=58s |

**Usage** : `@media (prefers-reduced-motion: reduce)` dans `pinapp-film-v6.css` pose un `background-image` par section `.voyage-scene--*` qui pointe vers le poster correspondant.

### OG / Social share

| Fichier | Dimensions | Usage |
|---|---|---|
| `assets/images/og-pinapp-v6.jpg` | 1200×630 | OG + Twitter card · main hologramme frame t=2.5s |
| `assets/images/og-pinapp-share.jpg` | 1200×630 | Legacy (V5, à retirer) |
| `assets/images/og-pinapp-v50.jpg` | 1200×630 | Legacy (V50, à retirer) |

### Voyage décor (legacy V5)

Dans `assets/img/voyage/` :
- `01-main-poster.jpg`, `02-couloir-poster.jpg`, etc. — utilisés en fallback `<video poster="...">` dans V5

### Portraits fondateurs

Dans `assets/img/team/` :
- ⚠️ **Règle Lauralie** : zéro photo sans validation → pour l'instant initiales "LD" et "MB" en SVG
- À ajouter quand Lauralie donne OK : `lauralie-portrait.jpg` + `michael-portrait.jpg` (format 1:1, min 400×400)

### Favicons

| Fichier | Dimensions | Format |
|---|---|---|
| `favicon.svg` | vectoriel | SVG (moderne) |
| `assets/images/apple-touch-icon.png` | 180×180 | PNG (iOS) |

### Univers / démos

Dans `/assets/images/univers/` et `/demo/*/assets/` : images spécifiques à chaque démo sectorielle (14 démos). Self-contained dans chaque démo folder.

---

## 🎨 SVG inline (logos, icons, illustrations)

### Logo Pinapp
- `assets/images/pinapp-logo.png` (bitmap 64×64 pour nav header legacy)
- `assets/images/pinapp-logo.svg` (vector si dispo)
- Alternative inline : logo pulsant dans s0 (3 circles SVG, animé CSS `v50-logo-pulse`)

### Icons header (V7)
Hamburger + mode sobre : SVG inline 20×20 stroke 1.5, voir `index.html:122-130`.

### Icons métiers s3
Dans `index.html:340-420` : 4 SVG inline stroke 1.5 pour les 4 métiers (Sites, Auto, IA, Vidéo). Stroke color : `var(--gold-primary)`.

### Constellation SVG s4
Dans `index.html:434-475` : graphe SVG avec 3 nodes connectés (M&P + Auralis + Newsletter). Animation stroke-dashoffset pour tracing.

### Workflow N8N s5b
`#automation-demo` SVG inline avec 6 nodes + édges animés (voir `automation-demo.js` 374 lignes).

### Monogram "Pinapp" + favicon
SVG abstrait représenté par le logo pulsant (cercle + 2 anneaux) dans la scène d'ouverture.

---

## 📜 JavaScript files

### Core V7 (17 scripts chargés avec `defer`)

| Fichier | Rôle | Lignes |
|---|---|---|
| `pinapp-film-v6.js` | Scroll scrub film | 145 |
| `voyage.js` | Lenis, sober, hero entrance, stats, reveals | 603 (à refactorer) |
| `voyage-particles.js` | Canvas particles 10 sections | 203 |
| `voyage-sand-reveal.js` | Sand reveal H2 | 280 |
| `voyage-chapter-breath.js` | Breath events | 60 |
| `voyage-transitions.js` | Legacy V5 (70% dead) | 489 (refactorer) |
| `voyage-s4-s6-cinema.js` | Constellation + manifeste | 198 |
| `voyage-vimeo-lightbox.js` | Vimeo modal | - |
| `voyage-planete-realisations.js` | s7 logic | - |
| `ouverture-v50.js` | s0 scroll cue | 22 |
| `presentation-video.js` | Modal présentation | - |
| `config-voyage.js` | Config (urls webhooks etc.) | - |
| `forms-voyage.js` | Form submit handling | - |
| `automation-demo.js` | Workflow simulation | 374 (asset précieux) |
| `tourbillon-webgl.js` | WebGL s7 (module type) | 359 |
| `match-cuts.js` | Match cuts transitions | 139 |
| `chapter-nav.js` | Nav chapters fixed | - |
| `magnetic-cursor.js` | Magnetic CTAs | 58 |
| `custom-cursor.js` | Ring cursor + label | 76 |
| `cursor-trail.js` | 20-particle trail | 75 |
| `film-grain.js` | 24fps grain overlay | 71 |
| `easter-eggs.js` | Konami + JARVIS + Morse + data-active-section | 195 |

### Nouveaux V7

| Fichier | Rôle | Lignes |
|---|---|---|
| `scene-counter.js` | Slot-machine "01/08" | 130 |
| `film-chromatic.js` | Hue-rotate per scene | 110 |
| `cursor-timecode.js` | MM:SS / MM:SS | 90 |
| `tourbillon-vertical.js` | 60 particules montantes s6 | 183 |
| `glass-tilt.js` | 3D tilt `.glass-card` | 78 |
| `i18n.js` | Reader locales FR/EN | 155 |

### Vendors (dans `/assets/vendor/`)

- `gsap.min.js` 3.12.5 (~85 KB)
- `ScrollTrigger.min.js` 3.12.5 (~40 KB)
- `lenis.min.js` 1.1.18 (~9 KB)

Total vendors : ~134 KB minified gzipped.

---

## 📁 CSS files — inventaire critique

Dans `/assets/css/` — **87 fichiers** (dette massive V3-V5 à consolider Bloc 5).

### Core V7 (à garder)

| Fichier | Lignes | Rôle |
|---|---|---|
| `tokens-voyage.css` | 463+ | **Source vérité tokens** |
| `voyage.css` | 2513 | Layout scenes + form (à splitter) |
| `pinapp-film-v6.css` | 181 | Film fixed + overlay + chromatic |
| `glass-card.css` | 79 | Glass Apple natif |
| `custom-cursor.css` | 79 | Ring + label |
| `ouverture-v50.css` | 140 | s0 ouverture |
| `metiers-grid.css` | 41 | s3 grid |
| `pilotes-grid.css` | 23 | s2 grid |
| `constellation-drift.css` | 26 | s4 SVG drift |
| `manifeste-wow.css` | 14 | s6 manifesto |
| `oeuvre-tourbillon.css` | 151 | s7 tourbillon |
| `cards-entrance.css` | 38 | Stagger reveals |

### Legacy à archiver (Bloc 5)

`pinapp-master-v3.css`, `pinapp-master-v4.css`, `pandora-oled.css`, `cosmos-*.css`, `biolume-*.css`, `pinapp-futur-cinema.css`, `home-2026.css`, `pinapp-premium.css`, `pinapp-awwwards*.css` (×2), `pinapp-ux-premium.css`, `pinapp-signature-ux.css`, etc.

**Action recommandée Bloc 5** : archiver dans `/assets/css/_archive/` puis consolider en `/assets/css/v7/{tokens,base,components,utilities}.css` avec `@layer`.

---

## 🗂️ Structure répertoires

```
/assets
├── /css       (87 fichiers · dette)
├── /data
├── /files
├── /fonts     (Fraunces + Geist woff2)
├── /images
│   ├── og-pinapp-v6.jpg
│   └── (divers logos, avatars)
├── /img
│   ├── /team   (portraits fondateurs · TBD)
│   └── /voyage
│       ├── /film-posters  (10 fichiers · 00→09)
│       └── *.jpg          (posters legacy V5)
├── /js        (92 fichiers)
├── /svg       (assets vectoriels)
├── /vendor    (gsap, ScrollTrigger, lenis)
└── /video
    └── /voyage
        ├── /_backup-20260421-pre-recalibrate/
        ├── 01-main-hologramme.mp4 à 08-atterrissage-sable.mp4
        ├── pinapp-film-v6.mp4
        └── pinapp-film-v6.webm

/locales      (V7)
├── fr.json
└── en.json

/docs         (documentation + storyboards)
├── /design-handoff  (← vous êtes ici)
├── /studio          (audits marketing internes)
├── /claude-consultation (10 fichiers réflexion)
├── TEXT-MASTER-V7.md
├── HANDOVER-2026-04-21-NIGHT.md
├── STORYBOARD-MAPPING-V6.md
├── DEPLOY-NOTES-V6.md
└── [autres]
```

---

## 🔧 Outils et scripts

Dans `/tools/` (Windows PowerShell) :
- `Pinapp.ps1` (root) : dispatcher commandes (dev, build, ci, verify, etc.)
- `dev-vite.ps1` : lance Vite dev server sur port 5173
- `build-pinapp-film-v6.ps1` : build film V6 (à mettre à jour V7 avec xfades)
- `finish-v6.ps1` : post-build checks

Entry point : `.\pinapp.ps1 dev` depuis racine repo.

Alternative dev serveur : `python -m http.server 8000` ou `npx serve .`.

---

## 📦 Packaging + déploiement

### Hébergement actuel : Hostinger
- Auto-sync via GitHub Actions sur push `main`
- DNS pinapp.fr pointe vers Hostinger
- Pas de CDN tiers (tout servi depuis origin)
- HTTPS via certificat Hostinger

### Pas de build step obligatoire
Site vanilla : copier le repo → serveur = ça marche.

### À ajouter (roadmap)
- Compression Brotli pour CSS/JS/HTML au niveau Hostinger
- Cache-Control headers `immutable` sur fichiers versionnés (?v=20260721)
- CDN Cloudflare devant Hostinger (optionnel, pour global POPs)
