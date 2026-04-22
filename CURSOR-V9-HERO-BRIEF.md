# PINAPP V9 — HERO IMMERSIF AVALON

**À coller dans Cursor Agent. Brief autonome, pas besoin de contexte préalable au-delà du repo `lauraliedaguzay-lang/pinapp-site` (branche `main` à `114bd7a` post-V8.3).**

---

## 0. CONTEXTE & OBJECTIF

V8.3 est en prod (Lighthouse 97/100/96/100 mobile, LCP 1.9s). On passe à **V9 — hero immersif cinématique** sur la home `index.html`. Le reste du site (univers, services, méthodes…) reste tel quel pour l'instant — V9 ne touche **que la home**.

**Objectif Awwwards** : Site of the Day dans 3-4 semaines, stretch SOTM. Le hero doit faire dire « waouh » au scroll, pas en survolant.

**Principe directeur** : Remake de *Passengers* (2016, vaisseau Avalon) en plan-séquence continu type *1917*. Direction Avalon **moderne sleek 2016**, pas vintage — blanc/cream + accents cuivre brossé + courbes organiques + LEDs intégrées + marbre clair. Nuit + vue cosmique aux fenêtres. Atmosphère solennelle contemplative.

---

## 1. ARCHITECTURE — 6 SCÈNES FULLSCREEN (100vh chacune)

Chaque scène = un `<section>` plein écran avec image background + overlay textes. Au scroll, on enchaîne les scènes en plan-séquence (transitions fondus + parallax).

| # | ID | Image background | Texte H2 | Texte body | CTA |
|---|---|---|---|---|---|
| 1 | `atrium-eveil` | `scene-1-atrium-eveil-16x9.webp` | **« Le digital qui travaille pendant que vous vivez. »** | « Sites, automatisation n8n, IA et vidéo à Bordeaux. Par Lauralie & Michaël. » | `[Décrire mon projet]` `[Voir nos réalisations]` |
| 2 | `corridor` | `scene-2-corridor-16x9.webp` | **« Quatre métiers. Un seul système. »** | 4 cartes face-à-face : Sites · n8n · IA · Vidéo (avec micro-description ligne) | `[Voir un métier en détail →]` |
| 3 | `cockpit-pandora` | `scene-3-cockpit-pandora-16x9.webp` | **« Voyez votre métier, conçu par Pinapp. »** | « Des sites que vos concurrents ne pourront pas copier. » + grille 3-4 réalisations en vignettes orbitales | `[Voir toutes les réalisations →]` |
| 4 | `lounge-voie-lactee` | `scene-4-lounge-voie-lactee-16x9.webp` | **« Des preuves. Des souvenirs aussi. »** | Bloc gauche : stats MILO chiffrées avant/après. Bloc droit : « Mémoire & Présence — pour ceux qu'on n'oublie pas. » avec étoiles | `[MILO]` `[M&P]` |
| 5 | `cosmos-pur` | `scene-5-cosmos-pur-16x9.webp` | **« Pourquoi Pinapp. »** | Manifeste court 3-4 lignes, philo de l'agence, vision long terme | — (pas de CTA, scène contemplative) |
| 6 | `desert-sf` | `scene-6-desert-sf-16x9.webp` | **« Décrivez votre projet. On revient sous 24h. »** | Formulaire contact (4 champs : nom · email · projet · budget select) + FAQ accordion en dessous | `[Envoyer]` (primary) + `[Audit express 490€]` (secondary) |

**Menu** : hamburger fixe top-right, 3 sections (Univers · Méthodes · Contact). Translucent verre dépoli. Visible en permanence sur les 6 scènes.

**Nav chapitre** : barre de progression verticale fixe à droite avec 6 dots (1 par scène). Au clic → scroll vers la scène. Le dot actif est cyan `#3EF5E0`. Cf amendement Camille.

**CTA contact sticky** : bouton « Décrire mon projet » fixe en bas à droite mobile, devient inline desktop. Apparait après scroll > 100vh. Cf amendement Camille.

---

## 2. STACK TECHNIQUE — VERROUILLÉE

```
HTML : sémantique propre, 1 <section> par scène, ARIA labels
CSS  : custom properties (variables), Grid/Flex, pas de framework
JS   : vanilla ES2022 + GSAP 3.x core + ScrollTrigger + Lenis (desktop only)
Animations : Canvas 2D pour particules cyan/violet (pas Three.js, pas WebGL)
Images : WebP servies en <picture> avec fallback PNG
Polices : Geist (4 weights : 400/500/600/700) self-hosted, ~50 Ko
Performance : Lighthouse cible ≥ 90 mobile sur tous les axes
Hosting : Netlify statique, zéro CDN externe, tout auto-hébergé
```

**Budget JS gzippé total : ≤ 85 Ko.**
**Budget page complète chargée : ≤ 2 Mo.**
**LCP cible : ≤ 1.5s mobile 4G simulé.**

**Gates obligatoires** :
- `prefers-reduced-motion: reduce` → coupe Lenis + désactive ScrollTrigger animations + scroll natif
- Mobile (≤ 768px) → Lenis OFF, parallax 3 couches → 1 couche, hover → tap sheets, particules ↓50%

---

## 3. ASSETS — DOSSIER `assets/images/v9-hero/`

À créer. Contenu (déjà fournis) :

```
assets/images/v9-hero/
├── ASSETS-README.md
├── scene-1-atrium-eveil-16x9.png   (206 Ko, 1376×768)
├── scene-1-atrium-eveil-16x9.webp  (143 Ko)
├── scene-2-corridor-16x9.png    (219 Ko)
├── scene-2-corridor-16x9.webp   (182 Ko)
├── scene-3-cockpit-pandora-16x9.png   (304 Ko)
├── scene-3-cockpit-pandora-16x9.webp  (276 Ko)
├── scene-4-lounge-voie-lactee-16x9.png   (168 Ko)
├── scene-4-lounge-voie-lactee-16x9.webp  (99 Ko)
├── scene-5-cosmos-pur-16x9.png   (195 Ko)
├── scene-5-cosmos-pur-16x9.webp  (134 Ko)
├── scene-6-desert-sf-16x9.png    (171 Ko)
└── scene-6-desert-sf-16x9.webp   (103 Ko)
```

**Total assets V9 hero : 936 Ko WebP.** Confortable.

**Versions mobile 9:16** : pas générées pour l'instant. Stratégie = recadrage CSS via `object-fit: cover` + `object-position` calibré par scène (cf §6 ci-dessous). On verra à l'usage si on doit regénérer en 9:16 dédié.

---

## 4. PALETTE & TYPOGRAPHIE

```css
:root {
  --bg-deep        : #0A1425;  /* navy nuit, fond global */
  --bg-overlay     : rgba(10, 20, 37, 0.55);  /* overlay sur images */
  --accent-amber   : #F0A454;  /* cuivre brossé Avalon */
  --accent-cyan    : #3EF5E0;  /* bioluminescent Pandora, dot actif */
  --accent-violet  : #8B6FE8;  /* secondaire cosmique, sparingly */
  --text-primary   : #F5F1E8;  /* cream, contraste sur navy */
  --text-secondary : rgba(245, 241, 232, 0.72);
  --text-muted     : rgba(245, 241, 232, 0.45);

  --font-display : 'Geist', 'SF Pro Display', system-ui, sans-serif;
  --font-body    : 'Geist', 'SF Pro Text', system-ui, sans-serif;
}
```

**Tailles types** (clamp fluides) :
- H1 hero : `clamp(2.5rem, 6vw, 5.5rem)` weight 600
- H2 scène : `clamp(1.75rem, 4vw, 3.5rem)` weight 600
- Body large : `clamp(1.0625rem, 1.4vw, 1.25rem)` weight 400, line-height 1.55
- Caption : `0.875rem` weight 500, letter-spacing 0.04em uppercase

---

## 5. PHASES DE TRAVAIL — 5 phases

### Phase 1 — Architecture HTML/CSS (≈ 50h)
- Créer `index-v9.html` à côté de l'actuel (pas écraser tant que pas validé)
- 6 sections fullscreen avec ID, ARIA, sémantique
- CSS variables + grid layout responsive + clamp typography
- `<picture>` avec WebP + PNG fallback pour chaque scène
- Menu hamburger + nav chapitre + CTA sticky structurés
- **Pas encore d'animations** — version statique scrollable d'abord, validation visuelle Lauralie avant phase 2

### Phase 2 — Textes verrouillés (≈ 4h)
- Recopier mot-pour-mot les copy de la table §1 ci-dessus
- **Ne pas réécrire, ne pas reformuler, ne pas ajouter de baseline** — ces textes ont été validés des dizaines de fois
- Vérifier que chaque scène a son texte cohérent
- Validation Lauralie sur build statique avant phase 3

### Phase 3 — Animations GSAP + Lenis + parallax (≈ 60h)
- Lenis init (desktop only, off mobile)
- ScrollTrigger : timeline globale enchaînant les 6 scènes en plan-séquence
- Parallax 3 couches par scène (background image / particules canvas / textes overlay)
- Particules cyan/violet en Canvas 2D (pas Three.js) — densité variable selon scène
- Nav progress bar : auto-update + clic → scroll programmé GSAP
- CTA sticky : apparition au scroll > 100vh, fade-in
- Toutes les anim respectent `prefers-reduced-motion`

### Phase 4 — Accessibilité + SEO + perf (≈ 30h)
- Alt text descriptif pour chaque image (cf ASSETS-README.md)
- ARIA roles/labels sur menu, nav chapitre, CTAs
- Focus visible custom (outline cyan)
- Skip-to-content link
- Meta OG : regénérer image OG depuis scène 3 (cockpit + Pandora — la plus signature) — **amendement Sofiane**
- Sitemap + robots.txt à jour
- Lazy-load images sauf la 1ère (preload `scene-1-atrium-eveil` pour LCP)
- Audit Lighthouse mobile, viser ≥ 90 sur tous les axes

### Phase 5 — Deploy preview + audit final (≈ 20h)
- Push branche `feature/v9-hero-immersif`
- Netlify deploy preview automatique
- Audit Lighthouse sur la preview URL
- Test multi-device (Chrome desktop, Safari iOS, Firefox)
- Test prefers-reduced-motion réel
- Validation finale Lauralie avant merge sur `main`
- Tag de release `v9.0.0`

**Budget total : 164h** (cohérent avec les 192h estimés Cowork dont 28h Phase 0 inventaire/setup déjà fait).

---

## 6. STRATÉGIE MOBILE — RECADRAGE CSS

Pas de versions 9:16 dédiées pour l'instant. À la place, focal points calibrés en CSS :

```css
.scene img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
}

.scene-1-atrium-eveil img       { object-position: 50% 50%; }   /* dôme centré */
.scene-2-corridor img        { object-position: 65% 50%; }   /* hublots droite */
.scene-3-cockpit-pandora img { object-position: 50% 60%; }   /* dashboard bas */
.scene-4-lounge-voie-lactee img { object-position: 50% 30%; } /* dôme étoiles haut */
.scene-5-cosmos-pur img      { object-position: 50% 50%; }   /* Voie Lactée centrée */
.scene-6-desert-sf img       { object-position: 50% 70%; }   /* dunes bas */
```

**Si la qualité du recadrage n'est pas satisfaisante en review mobile**, on regénérera les 6 versions 9:16 via Higgsfield (~12 crédits, prompts archivés dans ASSETS-README.md).

---

## 7. DEFINITION OF DONE

V9 hero est livrable et mergeable sur `main` quand :

- ✅ Les 6 scènes scrollent en plan-séquence cinématique sur desktop
- ✅ Mobile fonctionne en scroll natif sans Lenis, lisible et tappable
- ✅ Lighthouse mobile ≥ 90 sur Performance, A11y, Best Practices, SEO
- ✅ LCP mobile ≤ 1.5s sur 4G simulé
- ✅ Aucune erreur console, aucune CLS visible
- ✅ Tous les textes sont copies exactes de la table §1
- ✅ Menu hamburger + nav chapitre + CTA sticky fonctionnels
- ✅ `prefers-reduced-motion: reduce` testé et fonctionnel
- ✅ OG image regénérée + meta tags complets
- ✅ Validation visuelle Lauralie sur preview Netlify

---

## 8. ÉLÉMENTS DIFFÉRÉS — pas dans V9

- Photos fondateurs (shoot Lauralie + Michaël) → quand prêt, on remplacera les silhouettes dans scène 4 ou ajoutera bloc dédié
- Maintenance+ 99€/mois → ajouter section pricing plus tard
- Programme parrainage -10% → CTA secondaire sur scène 6 ultérieurement
- Audit express 490€ → déjà prévu en CTA secondaire scène 6
- Pages /univers/, /services/, /methodes/ → restent V8.3 telles quelles
- Versions mobile 9:16 dédiées → si CSS object-fit insuffisant en review

---

## 9. RÉFÉRENCES VISUELLES

Cinématographie : *Passengers* (Tyldum 2016) pour l'Avalon, *Avatar* (Cameron 2009) pour la bioluminescence Pandora, *Interstellar* (Nolan 2014) pour la Voie Lactée précieuse, *Dune* (Villeneuve 2021) pour le désert SF — mais **désaturé monochrome, pas chaud orange**.

Sites web : `wearebrand.io` pour le full-screen narratif (mais on évite leur écueil « le client disparaît » — ici c'est NOTRE site, on a le droit d'occuper toute la place).

---

**FIN DU BRIEF. Cursor, tu peux commencer Phase 1 dès maintenant. Pose des questions si quelque chose n'est pas clair avant de coder.**
