# PROMPT CURSOR · V5 DEPLOY · FULL (1 fichier copier-coller)
> Version unifiée — remplace PART1 + PART2.
> Tu reçois ce prompt entier. Tu fais tout. Tu commits. Tu pousses sur main. GitHub Pages déploie.

---

## 🚀 WORKFLOW (ordre strict)

```bash
cd C:\Users\Lauralie\Projects\pinapp-site
git checkout main
git pull origin main
# → tu refais voyage-v9/index.html selon ce brief
git add voyage-v9/index.html
git commit -m "voyage-v9 V5 · refonte 14 scènes + textes verbatim + 4 placeholders + 5 easter eggs + form 3 chemins + a11y AA"
git push origin main
# GitHub Pages déploie auto via deploy-pages.yml
# URL live : https://pinapp.fr/voyage-v9/?v=<hash-court>
```

---

## ⛔ INTERDITS ABSOLUS

```
❌ JAMAIS modifier voyage-v9/assets/hero-1..6.webp (R1)
❌ JAMAIS changer les 4 IDs Vimeo : 1184294762 · 1184294810 · 1184294871 · 1184294831
❌ JAMAIS Google Fonts → Bunny Fonts uniquement
❌ JAMAIS GSAP/jQuery/Lenis → Vanilla JS uniquement
❌ JAMAIS "!" dans la copy visible (sobriété)
❌ JAMAIS "mariage" dans services Micha (il n'en fait plus)
❌ JAMAIS "mariage" dans use cases du film cadeau s07 (anniversaire / départ retraite / naissance / bizz milestone uniquement)
❌ JAMAIS mention TDAH/bipolaire des fondateurs (info privée)
❌ JAMAIS "solution innovante / révolutionnaire / disruptif / game-changer"
❌ JAMAIS toucher .github/workflows/ (CI prête)
❌ JAMAIS class="draft-mode" sur <body> par défaut (les visiteurs voient un site clean ; les placeholders se révèlent uniquement via Ctrl+D ou Ctrl+Shift+D)
```

---

## 🎨 DESIGN TOKENS (CSS `:root`)

```css
:root {
  /* PALETTE */
  --or:           #e6b973;
  --or-light:     #f7d99d;
  --or-glow:      rgba(230,185,115,0.18);
  --ivoire:       #f4ece0;
  --ivoire-dim:   #c9bfae;
  --ivoire-mute:  rgba(244,228,193,0.62);
  --cyan:         #3ef5e0;
  --nuit:         #050b14;
  --nuit-soft:    #0a121f;
  --fumee:        rgba(20,30,42,0.6);
  --fumee-strong: rgba(20,30,42,0.85);
  --rouge-err:    #ff6b6b;
  --vert-ok:      #5eddb6;

  /* TYPO Bunny Fonts */
  --ff-display: "Fraunces", Georgia, serif;
  --ff-body:    "Inter", -apple-system, system-ui, sans-serif;

  /* ÉCHELLE */
  --fs-h1:    clamp(3.5rem, 9vw, 7rem);
  --fs-h2:    clamp(2.25rem, 5vw, 4rem);
  --fs-h3:    clamp(1.75rem, 3.5vw, 2.5rem);
  --fs-lead:  clamp(1.125rem, 1.5vw, 1.375rem);
  --fs-body:  17px;
  --fs-micro: 14px;
  --lh-tight: 1.15;
  --lh-body:  1.65;

  /* ESPACEMENT */
  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px;
  --sp-5: 24px; --sp-6: 32px; --sp-7: 48px; --sp-8: 64px;
  --sp-9: 96px; --sp-10: 128px;

  /* RADIUS */
  --r-sm: 8px; --r-md: 16px; --r-lg: 24px; --r-pill: 999px;

  /* MOTION */
  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-fast: 200ms; --dur-mid: 400ms; --dur-slow: 800ms; --dur-cinema: 1200ms;
}

/* Bunny Fonts (pas Google !) */
@import url('https://fonts.bunny.net/css?family=fraunces:400i,500,600i,700,900&family=inter:400,500,600,700&display=swap');
```

**Breakpoints mobile-first** : 480 / 768 / 1024 / 1440

---

## 🧩 COMPOSANTS REQUIS

- **Buttons** : `.btn--primary` (or solid · text nuit · 14×28 · hover -1px) · `.btn--ghost` (border or · hover bg or-glow) · `.btn--text` (underline-offset 4px) · `.btn--cta-large` (18×40 · 1.125rem) · Touch ≥ 44px · Focus ring cyan 2px offset 3px
- **Cards** : `.card--glass` (bg fumee · backdrop-blur 20px · border 1px or alpha 0.15 · radius lg) · `.card--pricing` (glass + price slot + badge popular slot) · `.card--placeholder` (border 2px dashed or · label "📭 PLACEHOLDER" top-left · visible si `body.draft-mode`)
- **Inputs** : label visible AU-DESSUS (jamais sr-only) · border 1px ivoire-mute · radius md · padding 14×16 · focus border or ring 2px or-glow · error border rouge + message inline rouge
- **Accordion** : `<details>` natif · chevron rotate 90° au open · border-bottom 1px ivoire-mute
- **Modal** : overlay nuit alpha 0.85 · backdrop-blur 12px · dialog max-width 480px · ESC + click-outside + button × ferment · focus trap
- **Drawer** : slide right · width 100vw · 4 sections plein écran scrollable
- **Form 3 chemins** : cards visuelles cliquables (PAS radio buttons natifs · 1 actif à la fois) · champs conditionnels slide-down 300ms · validation inline debounced 400ms · submit async + loading + success banner

---

## 🎬 STAGE FIXE GLOBAL

```html
<div class="stage" aria-hidden="true">
  <div class="stage__layer is-active" data-hero="1" style="background-image:url(assets/hero-1.webp)"></div>
  <div class="stage__layer" data-hero="2" style="background-image:url(assets/hero-2.webp)"></div>
  <div class="stage__layer" data-hero="3" style="background-image:url(assets/hero-3.webp)"></div>
  <div class="stage__layer" data-hero="4" style="background-image:url(assets/hero-4.webp)"></div>
  <div class="stage__layer" data-hero="5" style="background-image:url(assets/hero-5.webp)"></div>
  <div class="stage__layer" data-hero="6" style="background-image:url(assets/hero-6.webp)"></div>
</div>
```

**Mapping hero ↔ scènes** :
- hero-1 → s01, s02
- hero-2 → s03, s04, s04b
- hero-3 → s05, s06, s06b
- hero-4 → s07, s08, s09
- hero-5 → s09b, s10, s11
- hero-6 → s12, s13, footer

**JS** : IntersectionObserver sur chaque `<section data-stage="hero-N">` → active layer correspondant via `.is-active` (cross-fade opacity 0→1 sur dur-cinema). Ken Burns scale 1→1.05 sur 15s linear infinite uniquement sur `.is-active`. **Désactivé** si `prefers-reduced-motion` ou `body.sober`/`html.sober`.

---

## 🌀 SYSTÈME DE MOTION

- **Reveal cascade** : `[data-reveal]` initial opacity 0 + translateY 24px → IO intersect = opacity 1 + translateY 0 sur dur-mid ease-out · stagger via `[data-reveal-delay="N"]` (N×80ms)
- **Text-split (s08 whisper)** : char par char via JS · scroll progress 0..1 → reveal char N proportionnel
- **Count-up (stats)** : 0 → target sur 2s ease-out au 1er reveal IO (1 fois)
- **Hover physics** : translateY -2px sur hover · transition transform dur-fast ease-spring
- **Morse-stay** : @keyframes 4s linear infinite · 8 dots clignotent en séquence morse "STAY"

**TOUS** désactivés en `prefers-reduced-motion` ou mode sober.

---

## ♿ A11Y · WCAG 2.1 AA OBLIGATOIRE

- Focus visible cyan 2px offset 3px sur TOUS interactifs
- Skip-link "Aller au contenu" (apparaît au focus)
- 1 `<h1>` par page · hiérarchie respectée
- Landmarks : `<nav>` `<main>` `<footer>`
- Modal/Drawer : `role="dialog"` `aria-modal="true"` + focus trap
- Form : `aria-required` `aria-invalid` `aria-describedby`
- Live region : `aria-live="polite"` sur form status
- Touch ≥ 44×44px obligatoire
- `<html lang="fr">`

---

## 🗺 14 SCÈNES · TEXTES VERBATIM COMPLETS

> ⚠ Tu utilises ces textes EXACTS, mot-pour-mot. Pas de traduction, pas de paraphrase.
> Mise en forme harmonieuse OK (typo, line-height, hiérarchie, espacement, retours à la ligne).

---

### NAV TOP FIXE

```
[Logo Pinapp]   Diagnostic 24h offert →    Mode sobre    ☰
```

Hamburger ☰ → ouvre drawer "Qui sommes-nous" (4 actes, voir bas du doc)

---

### s01 · HERO  `data-stage="hero-1"`

**Eyebrow** : `Pinapp Inc · Bordeaux · 2026`

**H1** (Fraunces italique, 2 lignes) :
```
Vos outils travaillent.
Vous gagnez du temps.
```

**Lead** :
```
Sites · automatisations · films · clips.
Un seul devis. 50 à 75 % moins cher qu'une agence classique.
Diagnostic offert sous 24 heures.
```

**Badge sous H1** : `IA déclarée · Stack EU · Page < 1 Mo`

**Encart placeholder (visible UNIQUEMENT en draft-mode via Ctrl+D)** :
```
📭 Vidéo « Pinapp en 60 secondes »
Duo face caméra · 45-60 sec · à tourner

Script découpé :
• Lauralie & Michaël se présentent en duo (15s)
• Démo écran : un site qui sort en 30 sec en live (20s)
• Démo écran : un film IA qui sort en 30 sec (15s)
• Pitch fin : "On fait les deux. Un seul devis." (10s)

Tournage : Bordeaux · light naturelle + key fill or
Habillage : sous-titres FR auto · audio descriptive dispo
```

**Stats (3 colonnes)** : `24h réponse  ·  0 € diagnostic  ·  30j accompagnement`

**CTA primary** : `Recevoir mon diagnostic gratuit →` (scroll to #form)
**CTA ghost** : `Voir le diagnostic ↓` (scroll to s03)

---

### s02 · LE DUO  `data-stage="hero-1"`

**Eyebrow** : `Qui fait quoi`

**H2** (Fraunces italique, 2 lignes) :
```
Lauralie + Michaël.
Deux experts. Un seul interlocuteur. Un seul devis.
```

**Card LAURALIE** :
```
🔧 LAURALIE Daguzay
Architecte des systèmes.
Sites, automatisations, assistants intelligents, formations.
Tient le système. Du brief à la mise en ligne.
Bordeaux · partout en France.
```

**Card MICHA** :
```
🎬 MICHA · Michaël Bouilhac
10 ans dans l'événementiel.
Photo. Vidéo. Terrain.
Études d'informatique. Autodidacte sur les outils intelligents.
Tient l'image. Du brief au rendu final.
Bordeaux · Nouvelle-Aquitaine.
```

**Tagline** (centré, Fraunces italique 1.5rem) :
```
« Lauralie architecte. Michaël filme. Ensemble nous livrons. »
```

**CTA text** : `En savoir plus sur nous →` (ouvre drawer 4 actes)

---

### s03 · LE CONSTAT  `data-stage="hero-2"`

**Eyebrow** : `Le diagnostic`

**H2** : `Reconnaissez-vous votre semaine ?`

**4 cards douleurs (asymétriques, PAS equal grid)** :
```
01  Site qui dort.       → Personne ne vous trouve.
02  Devis qui s'oublient.→ Vous facturez en retard.
03  Avis Google rares.   → Vous demandez. Personne répond.
04  Charge mentale H24.  → Vous y pensez encore à 23h.
```

**Avant/Après** :
```
AVANT                          APRÈS
3 jours · 12 % closent    →    24 heures · 32 % closent
```
Note source en mute : `(Mesures sur nos propres ops · le diagnostic chiffre les vôtres.)`

**Microcopy cible** (Fraunces italique, centré, ivoire-mute) :
```
« Pour les cerveaux qui vont vite. Pour ceux qui veulent l'essentiel. »
```
⚠ Neuro = CIBLE OK / fondateurs jamais

---

### s04 · POURQUOI L'IA  `data-stage="hero-2"`

**Eyebrow** : `La méthode`

**H2** : `Pourquoi 50 à 75 % moins cher ? Voici les 4 sources qu'on assume.`

**4 cards sources cliquables** :
```
📊 McKinsey 2023 — Economic potential of generative AI
   « -50 à -70 % temps production digitale »
   [ Lire ↗ ]

📊 Stanford AI Index 2025
   « Coûts vidéo générative ÷ 4 entre 2023 et 2025 »
   [ Lire ↗ ]

📊 OECD AI Observatory 2024
   « +138 % adoption IA dans les PME françaises (YoY) »
   [ Lire ↗ ]

📊 ADEME 2024 (vue critique)         ← badge or-glow "Vue critique"
   « Coût environnemental de l'IA générative — transparence »
   [ Lire ↗ ]
```

**Lead** :
```
Un site agence : 4 200 à 8 000 €.
Chez nous : à partir de 1 290 €.
Trois sources publiques le confirment.
```

**Note critique (encart bg or-glow alpha 0.5)** :
```
« L'IA a un coût environnemental. Voici comment on le limite :
hébergement européen, choix d'outils sobres, pas de génération inutile. »
```

---

### s04b · PÉDAGOGIE IA (interstitiel)  `data-stage="hero-2"`

**Eyebrow** : `Comprendre`

**H3** :
```
L'intelligence pour ma boîte.
Concrètement.
```

**Lead** :
```
Vous n'avez pas à comprendre comment ça marche.
Juste ce que ça change pour vous.
```

**4 Q&A (stack 1 colonne max-w-2xl)** :
```
❓ C'est quoi pour ma boîte ?
✓ Un outil qui fait à votre place ce que vous faites en double.

❓ Concrètement ?
✓ Un client écrit · une réponse en 2 minutes.
  Un devis qui part · signé · payé sans vous.
  Un avis Google demandé tout seul J+7.

❓ Combien je gagne ?
✓ 8 à 14 heures par semaine récupérées.
  Étude OECD 2024 vérifiable.

❓ Et si je suis nul·le en informatique ?
✓ On s'occupe de tout. Vous validez par mail.
  Pas de logiciel à apprendre.
```

---

### s05 · PACK DUO ★ ANCRE HAUTE  `data-stage="hero-3"` `id="pack-duo"`

**Eyebrow** : `L'offre signature`

**H2** : `Pack Duo. Tout en un seul devis.`

**Card ESSENTIEL** :
```
Pack Duo Essentiel
~~1 970 €~~ → 1 890 € HT
Économisez 80 €

• Site qui convertit
• + 1 film cadeau (30-60 sec)
• + 30 jours d'accompagnement
• + Direction artistique unifiée

Livrable < 30 jours

[ Réserver le Pack Essentiel → ]
```

**Card SIGNATURE (badge "★ Le plus demandé" top-droite)** :
```
Pack Duo Signature
4 900 € HT
Économisez 1 277 € vs séparé (-21 %)

• Site qui convertit
• + 1 film de 3 minutes
• + Automatisations complètes
• + 90 jours d'accompagnement
• + Formation Niveau 3 (397 €) INCLUSE
• + 1 mois de Pinapp Care offert

Livrable < 45 jours

[ Réserver le Pack Signature → ]    ← CTA primary or solid large
```

**Note rareté discrète sous le bloc** :
```
On prend 3 projets par mois. Pas plus. Pour rester bons.
```

---

### s06 · LAURALIE · VUE D'ENSEMBLE  `data-stage="hero-3"`

**Eyebrow** : `Studio Lauralie · Prix fixes`

**H2** :
```
14 démos. Votre secteur est dedans.
Prix affichés.
```

**Encart placeholder (visible UNIQUEMENT en draft-mode)** :
```
📭 Reel 14 sites · style Apple WWDC · 20 sec
Mosaïque animée · transitions cross-fade · sound design off
À monter — montre 14 sites successivement
```

**3 piliers (cercles connectés SVG)** :
```
🌐 Sites qui          ⚙ Automatisations        ✨ Assistants qui
   convertissent          qui tournent seules        répondent H24
   1 290 € HT             490 € HT                   890 € HT
```

**3 démos phares (mockups iPhone, grille asymétrique 1 large + 2 petits)** :
```
★ Atelier Rivage · architecture · villas (démo live ↗)
02 Ōkami · restaurant (voir ↗)
03 Clara Fontaine · coach · consultant (voir ↗)
```

**`<details>` Trouver mon secteur (11 démos +)** :
```
artisan · avocat · esthéticienne · cils · ongles ·
coiffeur · barbier · boulangerie · fitness · tatoueuse · sur-mesure
```

**Card bundle passerelle** :
```
💼 Bundle Site + Outils auto · 1 590 € HT
Séparé : 1 290 € + 490 € = 1 780 €. En bundle : -190 € (-11 %).
[ Réserver le bundle → ]
```

**Doctrine prix** (Fraunces italique 1.25rem) :
```
« Côté Lauralie : prix fixes affichés. La tech, ça se chiffre. »
```

---

### s06b · LAURALIE · LE SYSTÈME (interstitiel)  `data-stage="hero-3"`

**Eyebrow** : `Ce qu'il y a derrière`

**H3** :
```
Pourquoi un site Lauralie tient dans le temps ?
8 dimensions qu'on gère pour vous. Vous ne les verrez jamais.
```

**Schéma rosace SVG** :
```
Centre : PROJET
Pétales : UI/UX · Code · Hosting EU · Performance · SEO · Accessibilité · Outils auto · Prompts intelligents
Animation : centre puis 8 cercles radial stagger · stroke or fin
```

**Schéma flux nodes (horizontal)** :
```
◉ Lead capté → ◉ Notion CRM → ◉ Devis auto → ◉ Paiement → ◉ Avis Google J+7
Animation : flèches qui se tracent puis pulsent
```

**Tagline** :
```
8 dimensions · 1 livraison · 16 étapes invisibles.
```

**CTA text** : `Voir le travail invisible →` (anchor → s10)

---

### s07 · MICHA · CINÉMA IA  `data-stage="hero-4"`

**Eyebrow** : `Studio Micha · Cinéma IA`

**H2** :
```
Du clip 30 secondes
au court-métrage 3 minutes.
```

**Grille mosaïque Apple TV+ · 4 vidéos Vimeo (posters cliquables)** :

```
🎬 [poster Walker · vumbnail.com/1184294762_large.jpg]
   Court-métrage IA pro
   60-90 sec · livraison 7 jours
   À partir de 1 290 € HT · sur devis

🎬 [poster SW Teaser · vumbnail.com/1184294810_large.jpg]
   Clip artiste IA
   30-60 sec · livraison 7 jours
   À partir de 1 500 € HT · sur devis

🎬 [poster Resident Evil · vumbnail.com/1184294871_large.jpg]
   Court-métrage premium
   1-3 minutes · livraison 14 jours
   À partir de 1 890 € HT · sur devis

🎬 [poster SW 3 min · vumbnail.com/1184294831_large.jpg]
   Premium « vous dedans »
   3 minutes · vous + IA + montage pro
   À partir de 2 800 € HT · sur devis
   Microcopy : « Exemple de ce que vous recevez en Pack Signature.
                 Votre version, sur votre univers — pas Star Wars. »
```

**Encart placeholder (visible UNIQUEMENT en draft-mode)** :
```
📭 Slot Film cadeau IA · 30 sec
Démo Vimeo à fournir par Micha
Esthétique : intime · journal vidéo · grain doux
Use cases : anniversaire · départ retraite · naissance · bizz milestone
            (PAS de mariage)
Livraison 5 jours · à partir de 390 € HT · sur devis
```

**Argument tarifaire (bloc compact bg or-glow)** :
```
Avant l'IA : 8 000 € en agence.
Avec Pinapp : à partir de 1 290 €.   -84 %.
```

**Doctrine prix** :
```
« Côté Micha : "à partir de" + devis. Le cinéma, ça se brieffe. »
```

---

### s08 · CLIP IA · CLIMAX ★  `data-stage="hero-4"`

**Eyebrow** : `Studio Micha · Clip 100 % IA`

**H2** (Fraunces italique BIG, split chars, 6rem) :
```
Un clip Marvel-style.
À 1 500 € au lieu de 50 000.
```

**Lead** :
```
Vous voulez un clip type Marvel, Star Wars ou Avatar.
En studio classique : 8 000 à 50 000 €.
Avec Pinapp : tout en IA — visuels, voix, montage.
```

**Encart placeholder STAR ★ (visible UNIQUEMENT en draft-mode)** :
```
[▶] Lauralie chante — clip 100 % IA
En production · disponible été 2026

✦ Voix de Lauralie (synthétisée IA)
✦ Univers visuel cinéma (génération IA)
✦ Montage et étalonnage (assistés IA)

Esthétique cible : couloirs néon · slow-mo poétique ·
                   cinéma indé Wong Kar-wai-Marvel
Format final : 16:9 · 4K · 1m20s

Démo Pinapp pour les créateurs qui veulent un clip CGI sans le budget studio.
```
border 2px dashed or, padding 48px, glow halo pulse lente

**Tapestry-whisper Spider-Man (Fraunces italique grand format scroll-trigger text-split)** :
```
« Un grand pouvoir n'implique pas une grande responsabilité.
  Pas chez les autres.
  Chez nous, si. »
```

**Crédit triptyque** (centré, ivoire-mute, fs micro) :
```
Direction artistique Lauralie · Réalisation IA Micha · Voix Lauralie
```

**Tableau comparatif (3 colonnes)** :
```
Avant l'IA           Avec Pinapp           Économie
8 000 - 50 000 €     dès 1 500 € HT        -90 %
```

**Cible (3 chips horizontales)** :
```
🎤 artistes  ·  🎬 créateurs de contenu  ·  🏢 marques narratives
```

**CTA primary** : `Recevoir un devis clip sous 48h →`

---

### s09 · ÉVÉNEMENTIEL + DA  `data-stage="hero-4"`

**Eyebrow** : `Studio Micha · Nouvelle-Aquitaine`

**H2** : `Votre événement mérite plus qu'un iPhone.`

**Lead** :
```
Micha filme en Nouvelle-Aquitaine. Sur devis.
Le déplacement est inclus dans le chiffrage.
```

**3 cards** :
```
📭 Séminaire entreprise (visible UNIQUEMENT en draft-mode)
Vimeo Micha à fournir
Esthétique : corporate doux · light naturelle · glide cam
Discours, ateliers, ambiance — un livrable pro.
Captation 1 jour · montage 7 jours
À partir de 1 800 € HT · sur devis

📭 Anniversaire / événement privé (visible UNIQUEMENT en draft-mode)
Vimeo Micha à fournir
Esthétique : émotion vraie · grain pellicule · longues focales
Soirée, discours, moments forts — montage émotion.
Captation 4-6h · montage 5 jours
À partir de 1 200 € HT · sur devis

🎨 Direction artistique
Univers visuel d'une marque ou d'un projet.
Sur devis
```

**CTA** : `Demander un devis événementiel →`

⚠ AUCUN MARIAGE

---

### s09b · MICRO-PAUSE (interstitiel plein écran sobre)  `data-stage="hero-5"`

100dvh, contenu centré flex, fade-in lent 1.5s :
```
« Maintenant, regardons les coulisses. »
```

---

### s10 · LE TRAVAIL INVISIBLE  `data-stage="hero-5"`

**Eyebrow** : `Ce qu'il y a derrière`

**H2** :
```
Un site. Un film.
Voici tout ce que vous ne voyez pas.
```

**Lead** :
```
Si on est moins cher qu'une agence, c'est parce qu'on ne sous-traite rien.
Pas parce qu'on saute des étapes.
```

**Slider Apple Health "Avant IA / Avec IA"** : curseur range custom or, 2 colonnes cross-fade selon position.

**Colonne AVANT IA — 16 étapes humaines** :
```
01 Brief écrit + cadrage
02 Architecture information
03 Wireframes mobile-first
04 Design system composants
05 Tokens couleurs typographie
06 Code HTML/CSS/JS vanilla
07 Intégration WCAG AA
08 Workflows d'automation
09 Prompts IA agents
10 Hébergement européen configuré
11 Monitoring + logs
12 Stack 0 tracker tiers
13 Tests performance (< 1 Mo)
14 Tests accessibilité lecteur d'écran
15 Mise en ligne + DNS
16 30 jours d'accompagnement
```

**Colonne AVEC PINAPP — 4 étapes IA** :
```
01 Brief minute
02 Génération assistée
03 Validation humaine
04 Mise en ligne
```

**3 compteurs animés (CountUp au reveal)** :
```
16 → 4 étapes
8 000 € → 1 290 €
30 jours → 7 jours
```

**Tagline** (Fraunces italique) :
```
« La différence n'est pas dans le travail.
  Elle est dans qui le fait. »
```

---

### s11 · FORMATIONS  `data-stage="hero-5"`

**Eyebrow** : `Apprendre à piloter ses propres outils`

**H2** :
```
Quatre niveaux.
Du curieux au travailleur augmenté.
```

**Lead** :
```
Stanford 2025 : adoption de l'intelligence dans les PME françaises +138 % en un an.
Vous décidez de quel côté vous êtes.
```

**4 cards niveau** :
```
🌱 39 €    Éveil IA           1h vidéo + checklist     [Démarrer]
🟢 67 €    Découverte         2h · comprendre l'assist [Démarrer]
🔵 147 €   Praticien          5h · automatiser 5 tâches[Démarrer]
🟣 397 €   Travailleur augm.  12h · construire son ass.[Démarrer]
```

**Tip sur card Découverte** : `💡 Beaucoup commencent par Découverte (67 €).`

**Banner cross-sell** :
```
Une fois Praticien terminé, beaucoup passent au Pack Duo.
C'est l'enchaînement logique.
                                                    [ Voir Pack Duo → ]
```

**CTA** : `Choisir mon niveau →`

---

### s12 · MÉTHODE + TARIFS RÉCAP + FAQ  `data-stage="hero-6"`

**Eyebrow** : `Comment on travaille`

**H2** :
```
Quatre étapes. Tous les tarifs.
Pas de surprise.
```

**Timeline 4 étapes (horizontale desktop, verticale mobile)** :
```
01 BRIEF       30 minutes en visio ou par écrit. Vous racontez. On écoute.
02 CADRAGE     Devis fixe écrit · sous 48 heures. Vous validez par écrit.
03 LIVRAISON   On produit. Vous voyez avancer. Vous corrigez.
04 ACCOMPAGNT  30 jours offerts après livraison. On corrige jusqu'à ce que ça tienne.
```

**Bloc doctrine prix** :
```
🔧 Côté Lauralie : prix fixes affichés. La tech, ça se chiffre.
🎬 Côté Micha : « à partir de » + devis. Le cinéma, ça se brieffe.
```

**Tableau funnel 4 paliers** :

```
PALIER 1 — ENTRÉE  (Lauralie · prix fixes)
   39 €    Éveil IA              vs 200 €+ webinaire
   67 €    Découverte Claude     vs 400 €+ formation perso

PALIER 2 — PRODUCTIVITÉ  (Lauralie · prix fixes)
   147 €   Praticien             vs 800 €+
   397 €   Travailleur augmenté  vs 2 000 €+
   490 €   Outils auto           vs 2 500 €+
   690 €   Mini-site + 1 outil   passerelle

PALIER 3 — PROJETS PONCTUELS
   890 €    Assistant H24             [Lauralie · fixe]
   1 290 €  Site qui convertit        [Lauralie · fixe]
   1 590 €  Bundle Site + Auto        [Lauralie · fixe · -190 €]
   Dès 390 €     Film cadeau IA            [Micha · sur devis]
   Dès 1 290 €   Court-métrage IA pro      [Micha · sur devis]
   Dès 1 500 €   Clip artiste IA           [Micha · sur devis]
   Dès 1 890 €   Court-métrage premium     [Micha · sur devis]
   Dès 2 800 €   Premium « vous dedans »   [Micha · sur devis]
   Dès 1 200 €   Anniversaire NA           [Micha · sur devis]
   Dès 1 800 €   Séminaire NA              [Micha · sur devis]
   Sur devis     Direction artistique      [Micha]

PALIER 4 — TRANSFORMATION  (Pack Duo · prix fixes pour cadrage)
   1 890 €      Pack Duo Essentiel
   4 900 €      Pack Duo Signature ★ recommandé
   190-390 €/mois Pinapp Care
```

**Note solidaire** :
```
★ -40 % associations · ESS · TPE < 5 salariés
sur tous nos services. Vérification SIRENE automatique.
```

**Note rareté éthique** :
```
On prend 3 projets par mois. Pas plus. Pour rester bons.
(Live counter : créneaux dispo ce mois)
```

**FAQ pliable 5 questions (`<details><summary>`)** :
```
▸ Et si je n'y connais rien en informatique ?
   Vous validez par mail. On gère tout le reste.
   Pas de logiciel à apprendre.

▸ Combien de temps avant d'avoir des résultats ?
   Site livré sous 3 semaines.
   Premiers leads sous 30 à 60 jours en moyenne (selon votre secteur).

▸ Pourquoi vous êtes moins chers qu'une agence ?
   On est 2, pas 15. On automatise notre propre travail.
   On ne sous-traite rien. C'est tout.

▸ Que se passe-t-il après les 30 jours d'accompagnement ?
   Vous gardez tout : code, accès, données.
   Option Pinapp Care (190-390 €/mois) pour rester accompagné·e.

▸ Vous travaillez avec mon secteur ?
   14 démos sectorielles disponibles.
   Si le vôtre n'y est pas, on en fait une gratuitement avant le devis.
```

**CTA** : `Diagnostic offert sous 24h →`

---

### s13 · ENGAGEMENTS + FORM ★  `data-stage="hero-6"` `id="form"`

**Eyebrow** : `Pour démarrer`

**H2** :
```
Sept engagements.
Un formulaire qui s'adapte à vous.
```

**7 engagements (cards courtes, grid 4+3 asymétrique)** :
```
🟢 IA déclarée
   Mention sur chaque contenu généré.

🟢 Stack européenne
   Hébergement et outils EU.

🟢 Lisible par tout le monde
   WCAG 2.1 AA visé.

🟢 Page sous 1 Mo
   0 tracker tiers · CO₂/visite affiché.

🟢 Transparence radicale
   Tarifs publics · code livré · méthode ouverte.

🟢 Inclusion numérique
   -40 % associations · 1 pro-bono /trimestre.

🟢 Préparé pour 2030
   Vos outils restent à vous, indépendants des plateformes.
```

**Clause opposable (bloc bg or-glow centré)** :
```
« Si un engagement n'est pas tenu sur votre projet, on le dit
  — et on rembourse la part concernée. »
```

**FORMULAIRE 3 chemins · 3 cards visuelles cliquables (PAS radio buttons)** :

```
🔧 Tech / Systèmes              🎬 Image / Mouvement         ✨ Pack Duo complet
Vous voulez parler à            Vous voulez parler à          Les deux —
Lauralie                        Micha                         projet à 360°
[○ Sélectionner]                [○ Sélectionner]              [○ Sélectionner]
```

**Champs essentiels (toujours visibles)** :
```
[ Prénom * ]                 [ Entreprise * ]
[ Email * ]                  [ Téléphone (optionnel) ]   ← helper "si vous préférez qu'on rappelle"
```

**Champs conditionnels (slide-down 300ms à l'activation)** :

— **Si chemin TECH** :
```
[ Site actuel (URL ou « rien encore ») ]
☐ Site qui dort  ☐ Devis qui s'oublient
☐ Avis Google rares  ☐ Charge mentale H24
[ Délai souhaité : ○ < 1 mois  ○ 1-3 mois  ○ pas pressé ]
```

— **Si chemin IMAGE** :
```
[ Type de projet : film cadeau · court-métrage · clip artiste ·
  clip CGI · premium · séminaire · anniversaire · DA · autre ]
[ Date approximative ]   [ Lieu ]
[ Univers visuel souhaité (textarea) ]
```

— **Si chemin PACK DUO** :
```
☐ Site  ☐ Film  ☐ Auto  ☐ Care  ☐ DA  ☐ Formation
[ Échéance critique ]
○ Budget ≥ 1 890 € (Essentiel)
○ Budget ≥ 4 900 € (Signature)
○ À discuter
```

**Pricing solidaire (toujours visible)** :
```
☐ Je suis association 1901 / ESS / TPE < 5 salariés (-40 %)
   ↑ vérification SIRENE automatique
```

**Message libre + RGPD** :
```
[ Message libre (textarea) ]

☐ J'accepte d'être recontacté·e par écrit sous 24h.
   Mes données restent chez nous.
```

**CTAs** :
```
[ Envoyer mon brief — réponse écrite sous 24h ]    ← primary or solid large
[ 📅 Prendre rendez-vous en ligne → ]               ← secondary fantôme
```

**Microcopy reassurance (sous CTA)** :
```
Aucun appel surprise. Aucun engagement.
100 % par écrit. Réponse d'humain — pas de robot.
```

**Microcopy automation invisible (encart discret bas)** :
```
« Pas un robot — un brouillon préparé en amont
  que Lauralie ou Michaël valide en 1 clic.
  Vous gagnez du temps. Nous aussi. »
```

---

### FOOTER

**Phrase signature** (Fraunces italique centré) :
```
« Sites faits main à Bordeaux : stack européenne, IA déclarée,
  accessibles, sous 1 Mo, prix publics. »
```

**Métriques live** :
```
🌍 Cette page = X g CO₂ / visite (Website Carbon Calculator)
```

**Liens légaux** :
```
Mentions légales · CGV · Confidentialité · TVA art. 293 B CGI
```

**Microcopie M&P discrète** :
```
« Nous portons aussi Mémoire & Présence. »
```

**Copyright** : `© 2026 Pinapp Inc. · Lauralie & Michaël`

---

### DRAWER "QUI SOMMES-NOUS" · 4 ACTES (ouvert au hamburger ☰)

**ACTE I — Avant Pinapp** :
```
Deux trajectoires séparées.
Micha à Bordeaux, dix ans à filmer des événements.
À apprendre la lumière qui ne pardonne pas.
À monter des films qui devaient tenir trente ans dans un salon.
Lauralie en parallèle, direction artistique et code.
À construire des sites pour des indépendants
qui n'avaient pas les moyens d'une agence parisienne.
```

**ACTE II — La rencontre IA** :
```
2023-2024. L'IA générative passe de jouet à outil.
Les deux basculent en même temps, chacun de son côté.
Micha entraîne des modèles d'image, monte ses premiers films IA.
Lauralie pousse ses pipelines voix synthétique IA, sites cinématiques, automations.
Ils se croisent sur un projet commun :
un film a besoin d'un site, un site a besoin d'un film, une voix a besoin d'un univers.
Pinapp Inc. naît de cette conversation-là.
```

**ACTE III — Le duo Pinapp** :
```
Une boîte à Bordeaux, deux expertises sous un même toit.
Lauralie tient le système : sites, automations, intelligence générative.
Michaël tient l'image : films IA, clips, captations événementielles.
Un seul interlocuteur pour le client.
Deux cerveaux derrière.
Le client paie une boîte. Il a une équipe.
```

**ACTE IV — Aujourd'hui et après** :
```
Pinapp construit ce que les concurrents des clients n'ont pas encore.
Sites cinématiques. Automations qui tournent la nuit.
Films IA narratifs. Captations événementielles signées. Capsules créateurs.
Trente jours d'accompagnement post-livraison sur chaque chantier.
Bordeaux comme port d'attache.
Nouvelle-Aquitaine en zone caméra.
France entière en distance.
Diagnostic offert sous 24 h.
```

---

### MODALE STAY (easter egg morse-stay)

```
🌿 STAY

Ce qui reste. Ce qu'on transmet.

Aux côtés de Pinapp, nous portons aussi
Mémoire & Présence — un projet de transmission numérique pour les familles.

Pas un service Pinapp. Un engagement parallèle.

→ Visiter memoireetpresence.fr ↗

[ × Fermer ]
```

ESC + click-outside + bouton ferment.

---

## 🥚 EASTER EGGS (5)

1. **Mode draft TOGGLE clavier** : `Ctrl+D` ou `Ctrl+Shift+D` toggle `body.draft-mode`. **PAS** activé par défaut sur le `<body>` (visiteurs voient site clean). Quand actif : tous les `.placeholder-asset` deviennent visibles avec border dashed or + label "📭 PLACEHOLDER".
2. **Scene-counter** top-droite fixed : "01 / 14" → "14 / 14" via IO. Caché en sober.
3. **Morse-stay** bas-gauche fixed : 8 dots animés en séquence morse "STAY" en or. Click → modale M&P.
4. **Konami code** : ↑↑↓↓←→←→BA → `console.log` ASCII art Pinapp + crédit.
5. **Spider-Man whisper** (s08) : tapestry text-split scroll-trigger.

---

## 🔍 SEO + JSON-LD (head)

```html
<title>Pinapp · Sites + films pour TPE/PME · 50 à 75% moins cher | Bordeaux</title>
<meta name="description" content="Duo Pinapp : sites qui convertissent + films cinéma. Diagnostic 24h gratuit. Bordeaux + Nouvelle-Aquitaine. Tarifs publics dès 1 290 €.">
<meta property="og:title" content="Pinapp — Sites + Films pour TPE/PME ambitieuses">
<meta property="og:image" content="https://pinapp.fr/voyage-v9/assets/hero-1.webp">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Pinapp Inc.",
  "founder": [
    { "@type": "Person", "name": "Lauralie Daguzay" },
    { "@type": "Person", "name": "Michaël Bouilhac" }
  ],
  "address": { "@type": "PostalAddress", "addressLocality": "Bordeaux", "addressCountry": "FR" },
  "priceRange": "39 € – 4 900 €",
  "hasOfferCatalog": { "@type": "AggregateOffer", "lowPrice": "39", "highPrice": "4900", "priceCurrency": "EUR" }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Et si je n'y connais rien en informatique ?", "acceptedAnswer": { "@type": "Answer", "text": "Vous validez par mail. On gère tout le reste. Pas de logiciel à apprendre." } },
    { "@type": "Question", "name": "Combien de temps avant d'avoir des résultats ?", "acceptedAnswer": { "@type": "Answer", "text": "Site livré sous 3 semaines. Premiers leads sous 30 à 60 jours en moyenne." } },
    { "@type": "Question", "name": "Pourquoi vous êtes moins chers qu'une agence ?", "acceptedAnswer": { "@type": "Answer", "text": "On est 2, pas 15. On automatise notre propre travail. On ne sous-traite rien." } },
    { "@type": "Question", "name": "Que se passe-t-il après les 30 jours d'accompagnement ?", "acceptedAnswer": { "@type": "Answer", "text": "Vous gardez tout : code, accès, données. Option Pinapp Care 190-390 €/mois." } },
    { "@type": "Question", "name": "Vous travaillez avec mon secteur ?", "acceptedAnswer": { "@type": "Answer", "text": "14 démos sectorielles. Si le vôtre n'y est pas, on en fait une gratuitement avant le devis." } }
  ]
}
</script>
```

---

## 📦 STRUCTURE FICHIER FINAL ATTENDUE

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  meta charset/viewport
  title + description V5
  OG + Twitter (og:image = hero-1.webp)
  preconnect + Bunny Fonts (Fraunces + Inter)
  preload hero-1.webp
  JSON-LD LocalBusiness + FAQPage
  <style> tokens + reset + composants + scènes + responsive + a11y + easter eggs
</head>

<!-- ⚠ PAS de class="draft-mode" par défaut · les placeholders sont DISCRETS en prod
     · révélation uniquement via Ctrl+D ou Ctrl+Shift+D -->
<body data-draft-count="0">

  <a href="#main" class="skip-link">Aller au contenu</a>

  <nav class="nav">[Logo] · CTA Diagnostic · Toggle Sober · ☰</nav>

  <div class="stage" aria-hidden="true">
    6× <div class="stage__layer" data-hero="N">
  </div>

  <main id="main">
    <section id="s01" data-stage="hero-1" class="scene">…</section>
    … 14 scènes verbatim ci-dessus …
    <section id="s13" data-stage="hero-6" class="scene scene--anchor">…</section>
  </main>

  <footer>…</footer>

  <!-- Easter eggs -->
  <div class="scene-counter" aria-hidden="true">01 / 14</div>
  <button class="morse-stay" aria-label="Découvrir Mémoire & Présence">…8 dots…</button>
  <dialog class="modal modal--mp">…</dialog>
  <aside class="drawer drawer--about">4 actes…</aside>
  <div class="draft-badge" aria-hidden="true"></div>

  <script>
    // 1. Stage manager (cross-fade hero layers via IO)
    // 2. Reveal cascade (data-reveal IO)
    // 3. Scene counter (IO update)
    // 4. Sober toggle + localStorage persist
    // 5. Drawer/Modal open/close + focus trap + ESC + click-outside
    // 6. Form 3 chemins (path switch + conditional fields slide-down + validation + submit async)
    // 7. CountUp (stats au reveal)
    // 8. Slider Avant/Avec (s10) avec range custom
    // 9. Vimeo lazy embed (poster click → iframe)
    // 10. Morse-stay → modal M&P
    // 11. Konami listener
    // 12. Text-split (s08 whisper)
    // 13. matchMedia reduced-motion respect partout
    // 14. localStorage form draft auto-save
    // 15. Toggle draft-mode :
    //     document.addEventListener('keydown', (e) => {
    //       const t = e.target;
    //       if (t && (t.tagName==='INPUT' || t.tagName==='TEXTAREA' || t.tagName==='SELECT' || t.isContentEditable)) return;
    //       if (e.ctrlKey && (e.key === 'd' || e.key === 'D')) {
    //         e.preventDefault();
    //         document.body.classList.toggle('draft-mode');
    //         document.body.setAttribute('data-draft-count', String(document.querySelectorAll('.placeholder-asset').length));
    //         updateDraftBadge();
    //       }
    //     });
  </script>

</body>
</html>
```

---

## ✅ CHECKLIST AVANT COMMIT

```
□ 14 sections complètes (s01..s13 + s04b + s06b + s09b interstitiels)
□ Tous textes verbatim mot-pour-mot (rien inventé)
□ 6 photos hero R1 intactes (assets/hero-1..6.webp)
□ 4 vidéos Vimeo posters cliquables (lazy iframe)
□ <body> SANS class="draft-mode" par défaut (visiteurs site clean)
□ Toggle Ctrl+D ET Ctrl+Shift+D fonctionnent (handler Ctrl + d/D, avec ou sans Shift)
□ 4 placeholders ne s'affichent QUE si body.draft-mode actif :
   · s01 vidéo Pinapp 60s
   · s06 reel 14 sites
   · s07 slot Film cadeau IA (use cases SANS mariage)
   · s08 Lauralie chante 100% IA
   · s09 Séminaire + Anniversaire
□ 5 easter eggs (draft toggle, scene-counter, morse-stay→modal, Konami, whisper)
□ FAQ accordéon natif <details>
□ Slider Avant/Avec interactif (s10)
□ Skip-link
□ Drawer "Qui sommes-nous" 4 actes
□ Modale M&P
□ Toggle Mode sober persistant (localStorage)
□ Form 3 chemins avec conditionnels
□ Validation inline form
□ Touch targets ≥ 44px
□ Focus visible cyan partout
□ A11y WCAG 2.1 AA
□ JSON-LD LocalBusiness + FAQPage
□ og:image = hero-1.webp
□ Bunny Fonts only (pas Google)
□ Vanilla JS only
□ 1 fichier HTML monolithique
□ AUCUN "!" dans la copy
□ AUCUN "mariage" dans services Micha NI dans use cases film cadeau
□ AUCUNE mention TDAH/bipolaire fondateurs
□ Doctrine prix Lauralie fixe / Micha "à partir de"
```

---

## 🚢 COMMIT + PUSH FINAL

```bash
git add voyage-v9/index.html
git commit -m "voyage-v9 V5 · refonte 14 scènes + textes verbatim + 4 placeholders draft-only + 5 easter eggs + form 3 chemins + a11y WCAG AA + og:image hero-1"
git push origin main
```

GitHub Pages déploie automatiquement.
URL live attendu : `https://pinapp.fr/voyage-v9/?v=<hash-court>`

---

## 🧪 VÉRIFICATIONS POST-DEPLOY

1. Site clean sans encarts placeholder visibles (visiteurs normaux)
2. Ctrl+D OU Ctrl+Shift+D → 4 encarts dashed or apparaissent
3. Hero stage + Ken Burns OK (cut en sober et reduced-motion)
4. Scene-counter top-droite incrémente au scroll
5. Morse-stay bas-gauche clignote → modale M&P au click
6. Form 3 cards cliquables, conditionnels qui apparaissent
7. FAQ accordéon natif fonctionne
8. Mode sober toggle marche (et persiste après reload)
9. Mobile : touch ≥ 44px, layout stack, lisible
10. Lighthouse perf/a11y/SEO ≥ 90

---

## 📌 SI TU AS UN DOUTE

- Texte exact = celui dans ce doc, jamais inventer
- Composant non listé = ne pas créer (focus 14 scènes + nav + footer + drawer + modal)
- Animation lourde = couper en sober + reduced-motion
- Photo hero = JAMAIS toucher
- "Mariage" = JAMAIS, ni dans services Micha (s09), ni dans use cases film cadeau (s07)

---

*Prompt Cursor V5 deploy ce soir · FULL · 1 fichier copier-coller*
*Tu reçois ce doc, tu fais tout, tu commits, tu pousses. C'est ce soir.*
*Remplace PART1 + PART2.*
