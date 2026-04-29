# SCHÉMA FINAL · Claude Design · V5 avec encarts complétés

> But : visualiser ce que Cursor essaie de produire depuis tout à l'heure.
> Tous les encarts placeholder sont **visibles avec leur contenu finalisé**.
> Mode draft activé : `<body class="draft-mode">` → border doré dashed sur les 4 placeholders.

---

## 🎨 STAGE FIXE GLOBAL (toutes scènes)

```
┌──────────────────────────────────────────────────────────────────────┐
│  6 photos hero en cross-fade IntersectionObserver (R1 NON NÉGOCIABLE)│
│  hero-1 vaisseau   →  s01 · s02                                      │
│  hero-2 cockpit    →  s03 · s04 · s04b                               │
│  hero-3 offre      →  s05 · s06 · s06b                               │
│  hero-4 cinéma     →  s07 · s08 · s09                                │
│  hero-5 profondeur →  s09b · s10 · s11                               │
│  hero-6 atterriss. →  s12 · s13 · footer                             │
│                                                                      │
│  Ken Burns lent zoom 1→1.05 sur 15s (pause si reduced-motion)        │
│  Voile linéaire ivoire 0.06 → ivoire 0.18 vers bas                   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🪄 NAV TOP FIXE

```
┌──────────────────────────────────────────────────────────────────────┐
│ [● Pinapp]      Diagnostic 24h offert →    [ Mode sobre ]    [ ☰ ]  │
│                                                                      │
│  • Logo gauche · couleur or                                          │
│  • CTA centre/droite · capsule or-glow                               │
│  • Toggle Mode sobre · couleur ivoire-dim                            │
│  • Hamburger ☰ → "Qui sommes-nous" (4 actes plein écran)             │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📐 14 SCÈNES (numérotation linéaire)

---

### s01 · HERO  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-1 (vaisseau · stage cinéma)

   [ Pinapp Inc · Bordeaux · 2026 ]                       (eyebrow or)

       Vos outils travaillent.
       Vous gagnez du temps.                  (Fraunces italique 7rem)

   Sites · automatisations · films · clips.
   Un seul devis. 50 à 75 % moins cher qu'une agence classique.
   Diagnostic offert sous 24 heures.            (Inter 17px ivoire-dim)

   [ IA déclarée · Stack EU · Page < 1 Mo ]              (badge or-glow)

   ┌────────────────────────────────────────────────────────────────┐
   │ 📭 ENCART PLACEHOLDER — VISIBLE (mode draft)                   │
   │  ╔══════════════════════════════════════════════════════════╗  │
   │  ║                                                          ║  │
   │  ║   ▶ Vidéo « Pinapp en 60 secondes »                      ║  │
   │  ║                                                          ║  │
   │  ║   Duo face caméra · 45-60 sec                            ║  │
   │  ║   À tourner — couvre :                                   ║  │
   │  ║   • Lauralie & Michaël qui se présentent en duo (15s)    ║  │
   │  ║   • Démo écran : un site qui sort en 30 sec en live (20s)║  │
   │  ║   • Démo écran : un film IA qui sort en 30 sec (15s)     ║  │
   │  ║   • Pitch fin : "On fait les deux. Un seul devis." (10s) ║  │
   │  ║                                                          ║  │
   │  ║   Tournage prévu : Bordeaux · studio Lauralie            ║  │
   │  ║   Light : naturelle + key fill or                        ║  │
   │  ║   Habillage : sous-titres FR auto · audio descript dispo ║  │
   │  ╚══════════════════════════════════════════════════════════╝  │
   │  border 1px dashed var(--or) · padding 32px · radius 16px      │
   └────────────────────────────────────────────────────────────────┘

   24h réponse  ·  0 € diagnostic  ·  30j accompagnement   (stats)

   ╔══════════════════════════════════════╗  ┌────────────────────┐
   ║ Recevoir mon diagnostic gratuit  → ║  │ Voir le diagnostic↓ │
   ╚══════════════════════════════════════╝  └────────────────────┘
   (CTA primaire or solid)                   (CTA fantôme outline)
```

🥚 Easter egg s01 : **scene-counter** apparaît top-droite "01 / 14" (Fraunces italique or, transition 200ms)

---

### s02 · LE DUO  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-1 (vaisseau · même stage)

   [ Qui fait quoi ]                                       (eyebrow)

      Lauralie + Michaël.
      Deux experts. Un seul interlocuteur. Un seul devis.

   ┌────────────────────────────────┬────────────────────────────────┐
   │  🔧 LAURALIE Daguzay           │  🎬 MICHA · Michaël Bouilhac   │
   │                                │                                │
   │  Architecte des systèmes.      │  10 ans dans l'événementiel.   │
   │  Sites, automatisations,       │  Photo. Vidéo. Terrain.        │
   │  assistants intelligents,      │  Études d'informatique.        │
   │  formations.                   │  Autodidacte sur les outils    │
   │                                │  intelligents.                 │
   │  Tient le système.             │  Tient l'image.                │
   │  Du brief à la mise en ligne.  │  Du brief au rendu final.      │
   │                                │                                │
   │  Bordeaux · partout en France. │  Bordeaux · Nouvelle-Aquitaine.│
   └────────────────────────────────┴────────────────────────────────┘
                  (cards glassmorphism · fumee · radius 16px)

   « Lauralie architecte. Michaël filme. Ensemble nous livrons. »
                  (Fraunces italique · centré · 1.5rem)

                       [ En savoir plus sur nous → ]
                       (ouvre menu hamburger 4 actes)
```

⚠ Doctrine : **AUCUNE mention TDAH/bipolaire**. Bio Micha = "10 ans événementiel" (PAS mariages).

---

### s03 · LE CONSTAT  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-2 (cockpit)

   [ Le diagnostic ]                                       (eyebrow)

      Reconnaissez-vous votre semaine ?
                       (Fraunces italique · H2)

   ┌────────────┬────────────┬────────────┬────────────┐
   │ 01         │ 02         │ 03         │ 04         │
   │ Site qui   │ Devis qui  │ Avis Google│ Charge     │
   │ dort.      │ s'oublient.│ rares.     │ mentale    │
   │            │            │            │ H24.       │
   │ Personne   │ Vous       │ Vous       │            │
   │ ne vous    │ facturez   │ demandez.  │ Vous y     │
   │ trouve.    │ en retard. │ Personne   │ pensez à   │
   │            │            │ ne répond. │ 23h.       │
   └────────────┴────────────┴────────────┴────────────┘
        (4 cards asymétriques · pas equal grid)

   ┌────────────────────┐         ┌────────────────────┐
   │ AVANT              │   →     │ APRÈS              │
   │ 3 jours · 12 % closent       │ 24 heures · 32 % closent │
   └────────────────────┘         └────────────────────┘
   (Mesures sur nos propres ops · le diagnostic chiffre les vôtres.)

   « Pour les cerveaux qui vont vite.                     (microcopy
     Pour ceux qui veulent l'essentiel. »                  cible)

   ⚠ neuro = CIBLE OK · JAMAIS pour décrire les fondateurs
```

---

### s04 · POURQUOI L'IA  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-2 (cockpit)

   [ La méthode ]                                          (eyebrow)

      Pourquoi 50 à 75 % moins cher ?
      Voici les 4 sources qu'on assume.

   ┌──────────────┬──────────────┬──────────────┬──────────────┐
   │ 📊 McKinsey  │ 📊 Stanford  │ 📊 OECD      │ 📊 ADEME     │
   │    2023      │    AI Index  │    AI Obs.   │    2024      │
   │              │    2025      │    2024      │ (vue critique)│
   │ -50 à -70 %  │ Coûts vidéo  │ +138 %       │ Coût envir.  │
   │ temps prod   │ génér. ÷ 4   │ adoption IA  │ IA générative│
   │ digitale.    │ (2023→2025). │ PME FR YoY.  │ — transparence│
   │              │              │              │              │
   │ [ Lire ↗ ]   │ [ Lire ↗ ]   │ [ Lire ↗ ]   │ [ Lire ↗ ]   │
   └──────────────┴──────────────┴──────────────┴──────────────┘

   Un site agence : 4 200 à 8 000 €.
   Chez nous : à partir de 1 290 €.
   Trois sources publiques le confirment.

   « L'IA a un coût environnemental. Voici comment on le limite :
     hébergement européen, choix d'outils sobres, pas de génération
     inutile. »                                            (note critique)
```

---

### s04b · PÉDAGOGIE IA  (interstitiel)  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-2 (cockpit · suite)

   [ Comprendre ]                                          (eyebrow)

      L'intelligence pour ma boîte.
      Concrètement.                          (Fraunces italique · H3)

   Vous n'avez pas à comprendre comment ça marche.
   Juste ce que ça change pour vous.

   ┌─────────────────────────────────────────────────────────────┐
   │ ❓ C'est quoi pour ma boîte ?                                │
   │ ✓ Un outil qui fait à votre place ce que vous faites en     │
   │   double.                                                    │
   ├─────────────────────────────────────────────────────────────┤
   │ ❓ Concrètement ?                                            │
   │ ✓ Un client écrit · une réponse en 2 minutes.               │
   │   Un devis qui part · signé · payé sans vous.               │
   │   Un avis Google demandé tout seul J+7.                     │
   ├─────────────────────────────────────────────────────────────┤
   │ ❓ Combien je gagne ?                                        │
   │ ✓ 8 à 14 heures par semaine récupérées.                     │
   │   Étude OECD 2024 vérifiable.                               │
   ├─────────────────────────────────────────────────────────────┤
   │ ❓ Et si je suis nul·le en informatique ?                    │
   │ ✓ On s'occupe de tout. Vous validez par mail.               │
   │   Pas de logiciel à apprendre.                              │
   └─────────────────────────────────────────────────────────────┘
   (4 cards Q&A · accordéon stack · or accent sur ✓)
```

---

### s05 · PACK DUO ★ ANCRE HAUTE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-3 (offre · LE moment)

   [ L'offre signature ]                                   (eyebrow)

         Pack Duo. Tout en un seul devis.
                       (Fraunces italique · H2)

   ┌────────────────────────────┬────────────────────────────┐
   │ ✦ ESSENTIEL                │ ★ SIGNATURE  [Le + demandé]│
   │                            │                            │
   │ ~~1 970 €~~ → 1 890 € HT   │           4 900 € HT       │
   │ Économisez 80 €            │ Économisez 1 277 € (-21 %) │
   │                            │                            │
   │ • Site qui convertit       │ • Site qui convertit       │
   │ • + 1 film cadeau (30-60s) │ • + 1 film de 3 minutes    │
   │ • + 30 jours d'accompagn.  │ • + Automatisations compl. │
   │ • + Direction artistique   │ • + 90 jours d'accompagn.  │
   │   unifiée                  │ • + Formation N3 INCLUSE   │
   │                            │ • + 1 mois Care offert     │
   │                            │                            │
   │ Livrable < 30 jours        │ Livrable < 45 jours        │
   │                            │                            │
   │ [ Réserver Essentiel → ]   │ [ Réserver Signature  → ]  │
   └────────────────────────────┴────────────────────────────┘
   (cards glassmorphism · gauche outline · droite solid or-glow)
   (badge "Le plus demandé" · capsule or · top-droite Signature)
```

🥚 Note rareté éthique discrete sous le bloc : "On prend 3 projets par mois. Pas plus."

---

### s06 · LAURALIE · VUE D'ENSEMBLE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-3 (offre)

   [ Studio Lauralie · Prix fixes ]                        (eyebrow)

      14 démos. Votre secteur est dedans.
      Prix affichés.

   ┌──────────────────────────────────────────────────────────────┐
   │ 🎞 REEL 14 SITES · style Apple WWDC · 20 sec                  │
   │   Mosaïque animée · transitions cross-fade · sound design off │
   │   (placeholder à monter — montre 14 sites successivement)     │
   └──────────────────────────────────────────────────────────────┘

   Trois piliers (cercles connectés SVG, traits or fins) :

       🌐 Sites qui            ⚙ Automatisations          ✨ Assistants
          convertissent           qui tournent seules        qui répondent H24
          1 290 € HT              490 € HT                   890 € HT
              ●─────────────────────●─────────────────────●

   Trois démos phares (mockups iPhone · grille asymétrique) :

   ┌──────────────────┬──────────────────┬──────────────────┐
   │ ★ Atelier Rivage │ 02 Ōkami         │ 03 Clara Fontaine│
   │   architecture · │   restaurant     │   coach ·        │
   │   villas         │                  │   consultant     │
   │   [démo live ↗]  │   [voir ↗]       │   [voir ↗]       │
   └──────────────────┴──────────────────┴──────────────────┘

   <details>
     ▸ Trouver mon secteur (11 démos de plus) →
        artisan · avocat · esthéticienne · cils · ongles ·
        coiffeur · barbier · boulangerie · fitness · tatoueuse ·
        sur-mesure
   </details>

   ┌────────────────────────────────────────────────────────────┐
   │ 💼 Bundle Site + Outils auto · 1 590 € HT                  │
   │ Séparé : 1 290 € + 490 € = 1 780 €. En bundle : -190€ (-11%)│
   └────────────────────────────────────────────────────────────┘

   « Côté Lauralie : prix fixes affichés. La tech, ça se chiffre. »
                       (doctrine prix · Fraunces italique 1.25rem)
```

---

### s06b · LAURALIE · LE SYSTÈME  (interstitiel)  ━━━━━━━━━━━━━━━━━━━━

```
                  hero-3 (offre · suite)

   [ Ce qu'il y a derrière ]                               (eyebrow)

      Pourquoi un site Lauralie tient dans le temps ?
      8 dimensions qu'on gère pour vous.
      Vous ne les verrez jamais.

   Schéma rosace SVG · 8 cercles connectés autour d'un centre :

                     UI/UX        Code
                          ●──────●
                          │      │
              Hosting EU ●  PROJET  ● Performance
                          │      │
                          ●──────●
                       SEO        A11y
                          ●──────●
                       Auto       Prompts
   (animations stagger reveal · fines lignes or qui se tracent)

   Schéma flux nodes (en dessous, horizontal) :

   ◉ Lead capté → ◉ Notion CRM → ◉ Devis auto → ◉ Paiement → ◉ Avis Google J+7

   Tagline : 8 dimensions · 1 livraison · 16 étapes invisibles.

                       [ Voir le travail invisible → ]
                       (CTA fantôme · ancre vers s10)
```

---

### s07 · MICHA · CINÉMA IA  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-4 (cinéma · stage qui change)

   [ Studio Micha · Cinéma IA ]                            (eyebrow)

      Du clip 30 secondes
      au court-métrage 3 minutes.

   Grille mosaïque Apple TV+ · 4 vidéos Vimeo (posters cliquables · iframe au click) :

   ┌─────────────────────────────────┬─────────────────────────────────┐
   │ 🎬 [poster Walker]              │ 🎬 [poster SW Teaser]           │
   │  vumbnail.com/1184294762_large  │  vumbnail.com/1184294810_large  │
   │                                 │                                 │
   │  Court-métrage IA pro           │  Clip artiste IA                │
   │  60-90 sec · livraison 7j       │  30-60 sec · livraison 7j       │
   │  À partir de 1 290 € HT         │  À partir de 1 500 € HT         │
   │  · sur devis                    │  · sur devis                    │
   ├─────────────────────────────────┼─────────────────────────────────┤
   │ 🎬 [poster Resident Evil]       │ 🎬 [poster SW 3 min]            │
   │  vumbnail.com/1184294871_large  │  vumbnail.com/1184294831_large  │
   │                                 │                                 │
   │  Court-métrage premium          │  Premium « vous dedans »        │
   │  1-3 min · livraison 14j        │  3 min · vous + IA + montage pro│
   │  À partir de 1 890 € HT         │  À partir de 2 800 € HT         │
   │  · sur devis                    │  · sur devis                    │
   │                                 │  ⓘ « Exemple Pack Signature.    │
   │                                 │     Votre version, sur votre    │
   │                                 │     univers — pas Star Wars. »  │
   └─────────────────────────────────┴─────────────────────────────────┘

   ┌────────────────────────────────────────────────────────────────┐
   │ 📭 SLOT FILM CADEAU IA — VISIBLE (mode draft)                  │
   │  ╔══════════════════════════════════════════════════════════╗  │
   │  ║  ▶ Film cadeau IA · 30 sec                               ║  │
   │  ║                                                          ║  │
   │  ║  Démo Vimeo à fournir par Micha                          ║  │
   │  ║  Esthétique : intime · journal vidéo · grain doux        ║  │
   │  ║  Use case : anniversaire mariage · départ retraite ·     ║  │
   │  ║              naissance · bizz milestone                  ║  │
   │  ║                                                          ║  │
   │  ║  Livraison 5 jours · à partir de 390 € HT · sur devis    ║  │
   │  ╚══════════════════════════════════════════════════════════╝  │
   └────────────────────────────────────────────────────────────────┘

   Argument tarifaire (bloc compact or-glow) :
   ┌────────────────────────────────────────────────────────────────┐
   │ Avant l'IA : 8 000 € en agence.                                │
   │ Avec Pinapp : à partir de 1 290 €.   -84 %.                    │
   └────────────────────────────────────────────────────────────────┘

   « Côté Micha : "à partir de" + devis. Le cinéma, ça se brieffe. »
                       (doctrine prix)
```

---

### s08 · CLIP IA · CLIMAX ★  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-4 (cinéma · climax narratif)

   [ Studio Micha · Clip 100 % IA ]                        (eyebrow)

      Un clip Marvel-style.
      À 1 500 € au lieu de 50 000.
                       (Fraunces italique · 6rem · animé split chars)

   Vous voulez un clip type Marvel, Star Wars ou Avatar.
   En studio classique : 8 000 à 50 000 €.
   Avec Pinapp : tout en IA — visuels, voix, montage.

   ┌────────────────────────────────────────────────────────────────┐
   │ 📭 ENCART PLACEHOLDER — VISIBLE (mode draft) · star du climax  │
   │  ╔══════════════════════════════════════════════════════════╗  │
   │  ║                                                          ║  │
   │  ║   ▶ Lauralie chante — clip 100 % IA                      ║  │
   │  ║                                                          ║  │
   │  ║   En production · disponible été 2026                    ║  │
   │  ║                                                          ║  │
   │  ║   ✦ Voix de Lauralie (synthétisée IA)                    ║  │
   │  ║   ✦ Univers visuel cinéma (génération IA)                ║  │
   │  ║   ✦ Montage et étalonnage (assistés IA)                  ║  │
   │  ║                                                          ║  │
   │  ║   Esthétique cible : couloirs néon · slow-mo poétique ·  ║  │
   │  ║                       cinéma indé Wong Kar-wai-Marvel    ║  │
   │  ║   Format final : 16:9 · 4K · 1m20s                       ║  │
   │  ║                                                          ║  │
   │  ║   Démo Pinapp pour les créateurs qui veulent un clip     ║  │
   │  ║   CGI sans le budget studio.                             ║  │
   │  ║                                                          ║  │
   │  ╚══════════════════════════════════════════════════════════╝  │
   │  border 2px dashed var(--or) · padding 48px · radius 20px      │
   │  glow or autour · animation pulse lente                        │
   └────────────────────────────────────────────────────────────────┘

   ┌────────────────────────────────────────────────────────────────┐
   │ TAPESTRY-WHISPER (option B · Spider-Man)                       │
   │  Fraunces italique · clamp(2.5rem, 6vw, 5rem) · scroll-trigger │
   │                                                                │
   │     « Un grand pouvoir n'implique pas une grande               │
   │       responsabilité.                                          │
   │       Pas chez les autres.                                     │
   │       Chez nous, si. »                                         │
   │                                                                │
   │  → text-split caractère par caractère · cascade reveal 40ms    │
   │  → opacity 0.6 → 1 sur scroll progress                         │
   └────────────────────────────────────────────────────────────────┘

   Crédit triptyque (centré, petit ivoire-mute) :
   Direction artistique Lauralie · Réalisation IA Micha · Voix Lauralie

   Tableau comparatif (3 colonnes simples) :
   ┌──────────────────┬──────────────────┬──────────────────┐
   │ Avant l'IA       │ Avec Pinapp      │ Économie         │
   │ 8 000 - 50 000 € │ dès 1 500 € HT   │ -90 %            │
   └──────────────────┴──────────────────┴──────────────────┘

   Cible (3 chips horizontales) :
   🎤 artistes · 🎬 créateurs de contenu · 🏢 marques narratives

                  [ Recevoir un devis clip sous 48h → ]
                  (CTA primaire or solid · large)
```

🥚 Easter egg s08 : tapestry-whisper Spider-Man (Option B) **EST** l'easter egg littéraire.

---

### s09 · ÉVÉNEMENTIEL + DA  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-4 (cinéma)

   [ Studio Micha · Nouvelle-Aquitaine ]                   (eyebrow)

      Votre événement mérite plus qu'un iPhone.

   Micha filme en Nouvelle-Aquitaine. Sur devis.
   Le déplacement est inclus dans le chiffrage.

   ┌──────────────────┬──────────────────┬──────────────────┐
   │ 📭 PLACEHOLDER   │ 📭 PLACEHOLDER   │ 🎨 DA            │
   │   VISIBLE        │   VISIBLE        │                  │
   │                  │                  │                  │
   │ ▶ Séminaire      │ ▶ Anniversaire / │ Direction        │
   │   entreprise     │   événement privé│ artistique       │
   │                  │                  │                  │
   │ Vimeo Micha à    │ Vimeo Micha à    │ Univers visuel   │
   │ fournir          │ fournir          │ d'une marque ou  │
   │                  │                  │ d'un projet.     │
   │ Esthétique cible:│ Esthétique cible:│                  │
   │ corporate doux · │ émotion vraie ·  │ Sur devis        │
   │ light naturelle ·│ grain pellicule ·│                  │
   │ glide cam        │ longues focales  │                  │
   │                  │                  │                  │
   │ Discours,        │ Soirée,          │                  │
   │ ateliers,        │ discours,        │                  │
   │ ambiance —       │ moments forts —  │                  │
   │ un livrable pro. │ montage émotion. │                  │
   │                  │                  │                  │
   │ Captation 1 jour │ Captation 4-6h   │                  │
   │ Montage 7 jours  │ Montage 5 jours  │                  │
   │                  │                  │                  │
   │ Dès 1 800 € HT   │ Dès 1 200 € HT   │                  │
   │ sur devis        │ sur devis        │                  │
   └──────────────────┴──────────────────┴──────────────────┘
   (border dashed or sur cards 1 et 2 · card 3 solid)

                  [ Demander un devis événementiel → ]

   ⚠ AUCUN MARIAGE (Micha n'en fait plus — 10 ans dans l'événementiel
                    pas dans le mariage)
```

---

### s09b · MICRO-PAUSE  (interstitiel plein écran sobre)  ━━━━━━━━━━━━

```
                  hero-5 (profondeur · transition)

           ┌──────────────────────────────────────────┐
           │                                          │
           │                                          │
           │   « Maintenant, regardons les            │
           │     coulisses. »                         │
           │                                          │
           │   (Fraunces italique · centré · 4rem)    │
           │   (animation fade-in lent · 3s pause)    │
           │                                          │
           │                                          │
           └──────────────────────────────────────────┘
                       100dvh · padding 0
```

---

### s10 · LE TRAVAIL INVISIBLE  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-5 (profondeur)

   [ Ce qu'il y a derrière ]                               (eyebrow)

      Un site. Un film.
      Voici tout ce que vous ne voyez pas.

   Si on est moins cher qu'une agence, c'est parce qu'on ne
   sous-traite rien. Pas parce qu'on saute des étapes.

   ┌─────────────────────────────────────────────────────────────────┐
   │  SLIDER APPLE HEALTH STYLE · « Avant IA / Avec IA »             │
   │                                                                 │
   │  ◀ ─────────────────●──────────────── ▶                          │
   │   Tout humain          Avec Pinapp                              │
   │                                                                 │
   │  ┌─────────────────────────┬─────────────────────────┐          │
   │  │ CÔTÉ AVANT IA           │ CÔTÉ AVEC PINAPP        │          │
   │  │ 16 étapes humaines      │ 4 étapes IA             │          │
   │  │                         │                         │          │
   │  │ 01 Brief écrit + cadrage│ 01 Brief minute         │          │
   │  │ 02 Architecture info    │ 02 Génération assistée  │          │
   │  │ 03 Wireframes mobile-1st│ 03 Validation humaine   │          │
   │  │ 04 Design system compos.│ 04 Mise en ligne        │          │
   │  │ 05 Tokens couleurs typo │                         │          │
   │  │ 06 Code HTML/CSS/JS     │                         │          │
   │  │ 07 Intégration WCAG AA  │                         │          │
   │  │ 08 Workflows automation │                         │          │
   │  │ 09 Prompts IA agents    │                         │          │
   │  │ 10 Hébergement EU       │                         │          │
   │  │ 11 Monitoring + logs    │                         │          │
   │  │ 12 Stack 0 tracker      │                         │          │
   │  │ 13 Tests perf (<1Mo)    │                         │          │
   │  │ 14 Tests a11y           │                         │          │
   │  │ 15 Mise en ligne + DNS  │                         │          │
   │  │ 16 30j accompagnement   │                         │          │
   │  └─────────────────────────┴─────────────────────────┘          │
   └─────────────────────────────────────────────────────────────────┘

   Compteurs animés (CountUp.js style · 3 secondes au reveal) :

       16   →   4               8 000 €  →  1 290 €          30j  →  7j
        étapes                   coût                          délai

   « La différence n'est pas dans le travail.                  (tagline
     Elle est dans qui le fait. »                              Fraunces it.)
```

---

### s11 · FORMATIONS  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-5 (profondeur)

   [ Apprendre à piloter ses propres outils ]              (eyebrow)

      Quatre niveaux.
      Du curieux au travailleur augmenté.

   Stanford 2025 : adoption de l'intelligence dans les PME
   françaises +138 % en un an.
   Vous décidez de quel côté vous êtes.

   ┌────────────┬────────────┬────────────┬────────────┐
   │ 🌱 39 €    │ 🟢 67 €    │ 🔵 147 €   │ 🟣 397 €   │
   │            │            │            │            │
   │ Éveil IA   │ Découverte │ Praticien  │ Travailleur│
   │            │            │            │  augmenté  │
   │ 1h vidéo + │ 2h         │ 5h         │ 12h        │
   │ checklist  │ comprendre │ automatiser│ construire │
   │            │ l'assistant│ 5 tâches   │ son        │
   │            │            │            │ assistant  │
   │            │            │            │            │
   │ [ Démarrer]│ [ Démarrer]│ [ Démarrer]│ [ Démarrer]│
   └────────────┴────────────┴────────────┴────────────┘
              ↑
   💡 Beaucoup commencent par Découverte (67 €).
                       (microcopy guidance · tip discret sous card 2)

   Cross-sell (banner sous le tableau) :
   ┌─────────────────────────────────────────────────────────────┐
   │ Une fois Praticien terminé, beaucoup passent au Pack Duo.   │
   │ C'est l'enchaînement logique.                               │
   │                                            [ Voir Pack Duo →]│
   └─────────────────────────────────────────────────────────────┘

                       [ Choisir mon niveau → ]
```

---

### s12 · MÉTHODE + TARIFS RÉCAP  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-6 (atterrissage)

   [ Comment on travaille ]                                (eyebrow)

      Quatre étapes. Tous les tarifs.
      Pas de surprise.

   Méthode 4 étapes (timeline horizontale · noeuds or) :

   ──●────────●────────●────────●──────────
     01        02        03        04
     BRIEF     CADRAGE   LIVRAISON ACCOMPAGN.

   01 BRIEF       30 minutes en visio ou par écrit.
                  Vous racontez. On écoute.
   02 CADRAGE     Devis fixe écrit · sous 48 heures.
                  Vous validez par écrit.
   03 LIVRAISON   On produit. Vous voyez avancer. Vous corrigez.
   04 ACCOMPAGN.  30 jours offerts après livraison.
                  On corrige jusqu'à ce que ça tienne.

   Bloc doctrine prix :
   ┌────────────────────────────────────────────────────────────────┐
   │ 🔧 Côté Lauralie : prix fixes affichés. La tech, ça se chiffre.│
   │ 🎬 Côté Micha : « à partir de » + devis. Le cinéma, ça se      │
   │                  brieffe.                                      │
   └────────────────────────────────────────────────────────────────┘

   Tableau funnel 4 paliers (avec colonne Avant/Après IA) :

   ┌──────────────────────────────────────────────────────────────────┐
   │ PALIER 1 — ENTRÉE  (Lauralie · prix fixes)                       │
   │   39 €    Éveil IA              vs 200 €+ webinaire              │
   │   67 €    Découverte Claude     vs 400 €+ formation perso        │
   ├──────────────────────────────────────────────────────────────────┤
   │ PALIER 2 — PRODUCTIVITÉ  (Lauralie · prix fixes)                 │
   │   147 €   Praticien             vs 800 €+                        │
   │   397 €   Travailleur augmenté  vs 2 000 €+                      │
   │   490 €   Outils auto           vs 2 500 €+                      │
   │   690 €   Mini-site + 1 outil   passerelle                       │
   ├──────────────────────────────────────────────────────────────────┤
   │ PALIER 3 — PROJETS PONCTUELS                                     │
   │   890 €    Assistant H24             [Lauralie · fixe]           │
   │   1 290 €  Site qui convertit        [Lauralie · fixe]           │
   │   1 590 €  Bundle Site + Auto        [Lauralie · fixe · -190 €]  │
   │   Dès 390 €    Film cadeau IA        [Micha · sur devis]         │
   │   Dès 1 290 €  Court-métrage IA pro  [Micha · sur devis]         │
   │   Dès 1 500 €  Clip artiste IA       [Micha · sur devis]         │
   │   Dès 1 890 €  Court-métrage premium [Micha · sur devis]         │
   │   Dès 2 800 €  Premium « vous dedans »[Micha · sur devis]        │
   │   Dès 1 200 €  Anniversaire NA       [Micha · sur devis]         │
   │   Dès 1 800 €  Séminaire NA          [Micha · sur devis]         │
   │   Sur devis    Direction artistique  [Micha]                     │
   ├──────────────────────────────────────────────────────────────────┤
   │ PALIER 4 — TRANSFORMATION  (Pack Duo · prix fixes pour cadrage)  │
   │   1 890 €      Pack Duo Essentiel                                │
   │   4 900 €      Pack Duo Signature ★ recommandé                   │
   │   190-390 €/mois Pinapp Care                                     │
   └──────────────────────────────────────────────────────────────────┘

   ★ -40 % associations · ESS · TPE < 5 salariés
   sur tous nos services. Vérification SIRENE automatique.

   On prend 3 projets par mois. Pas plus. Pour rester bons.
   (Live counter : créneaux dispo ce mois — JS dynamique)

   FAQ pliable 5 questions (<details><summary>) :

   ▸ Et si je n'y connais rien en informatique ?
        Vous validez par mail. On gère tout le reste.
        Pas de logiciel à apprendre.
   ▸ Combien de temps avant d'avoir des résultats ?
        Site livré sous 3 semaines.
        Premiers leads sous 30 à 60 jours en moyenne.
   ▸ Pourquoi vous êtes moins chers qu'une agence ?
        On est 2, pas 15. On automatise notre propre travail.
        On ne sous-traite rien. C'est tout.
   ▸ Que se passe-t-il après les 30 jours d'accompagnement ?
        Vous gardez tout : code, accès, données.
        Option Pinapp Care (190-390 €/mois) pour rester accompagné·e.
   ▸ Vous travaillez avec mon secteur ?
        14 démos sectorielles disponibles.
        Si le vôtre n'y est pas, on en fait une gratuitement avant
        le devis.

                  [ Diagnostic offert sous 24h → ]
```

---

### s13 · ENGAGEMENTS + FORM ★  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-6 (atterrissage)

   [ Pour démarrer ]                                       (eyebrow)

      Sept engagements.
      Un formulaire qui s'adapte à vous.

   7 engagements (cards courtes · grid 4+3 asymétrique) :

   ┌──────────────┬──────────────┬──────────────┬──────────────┐
   │ 🟢 IA        │ 🟢 Stack     │ 🟢 Lisible   │ 🟢 Page sous │
   │   déclarée   │   européenne │   par tout   │   1 Mo       │
   │              │              │   le monde   │              │
   │ Mention sur  │ Hébergement  │ WCAG 2.1 AA  │ 0 tracker    │
   │ chaque       │ et outils EU.│ visé.        │ tiers ·      │
   │ contenu géné-│              │              │ CO₂/visite   │
   │ ré.          │              │              │ affiché.     │
   └──────────────┴──────────────┴──────────────┴──────────────┘
   ┌──────────────┬──────────────┬──────────────┐
   │ 🟢 Trans-    │ 🟢 Inclusion │ 🟢 Préparé   │
   │   parence    │   numérique  │   pour 2030  │
   │   radicale   │              │              │
   │ Tarifs       │ -40 %        │ Vos outils   │
   │ publics ·    │ assoc. ·     │ restent à    │
   │ code livré · │ 1 pro-bono   │ vous, indé-  │
   │ méthode      │ /trimestre.  │ pendants des │
   │ ouverte.     │              │ plateformes. │
   └──────────────┴──────────────┴──────────────┘

   Clause opposable (bloc or-glow centré) :
   ┌────────────────────────────────────────────────────────────────┐
   │ « Si un engagement n'est pas tenu sur votre projet, on le dit  │
   │   — et on rembourse la part concernée. »                       │
   └────────────────────────────────────────────────────────────────┘

   ─────── FORMULAIRE 3 CHEMINS · CARDS VISUELLES ───────────────────

   (PAS radio buttons — vraies cards cliquables · état actif or solid)

   ┌──────────────────┬──────────────────┬──────────────────┐
   │ 🔧 Tech /        │ 🎬 Image /       │ ✨ Pack Duo      │
   │   Systèmes       │   Mouvement      │   complet        │
   │                  │                  │                  │
   │ Vous voulez      │ Vous voulez      │ Les deux —       │
   │ parler à         │ parler à         │ projet à 360°    │
   │ Lauralie         │ Micha            │                  │
   │                  │                  │                  │
   │ [○ Sélectionner] │ [○ Sélectionner] │ [● Sélectionné ] │
   └──────────────────┴──────────────────┴──────────────────┘
   (transitions JS conditionnelles selon path · anim slide)

   Champs essentiels (toujours visibles) :
     [ Prénom         ]  [ Entreprise              ]
     [ Email          ]  [ Téléphone (optionnel)   ]   ← microcopy
                                                          "si vous
                                                           préférez
                                                           qu'on
                                                           rappelle"

   ── Si chemin TECH choisi ──
     [ Site actuel (URL ou « rien encore »)       ]
     ☐ Site qui dort  ☐ Devis qui s'oublient
     ☐ Avis Google rares  ☐ Charge mentale H24
     [ Délai souhaité : ○ <1 mois  ○ 1-3 mois  ○ pas pressé ]

   ── Si chemin IMAGE choisi ──
     [ Type de projet : film cadeau · court · clip artiste ·
       clip CGI · premium · séminaire · anniversaire · DA · autre ]
     [ Date approximative ]   [ Lieu ]
     [ Univers visuel souhaité (textarea) ]

   ── Si chemin PACK DUO choisi ──
     ☐ Site  ☐ Film  ☐ Auto  ☐ Care  ☐ DA  ☐ Formation
     [ Échéance critique ]
     ○ Budget ≥ 1 890 € (Essentiel)
     ○ Budget ≥ 4 900 € (Signature)
     ○ À discuter

   ─── Pricing solidaire (toujours visible) ───
     ☐ Je suis association 1901 / ESS / TPE < 5 salariés (-40 %)
        ↑ vérification SIRENE automatique côté serveur

   [ Message libre (textarea, 4 lignes)                              ]

   ─── RGPD ───
     ☐ J'accepte d'être recontacté·e par écrit sous 24h.
        Mes données restent chez nous.

   ╔══════════════════════════════════════╗  ┌────────────────────┐
   ║ Envoyer mon brief — réponse écrite ║  │ 📅 Prendre RDV →    │
   ║ sous 24h                            ║  └────────────────────┘
   ╚══════════════════════════════════════╝
   (CTA primaire or solid · large)         (CTA secondaire fantôme)

   Microcopy reassurance (sous CTA) :
     Aucun appel surprise. Aucun engagement.
     100 % par écrit. Réponse d'humain — pas de robot.

   Microcopy automation invisible (encart discret bas) :
     « Pas un robot — un brouillon préparé en amont
       que Lauralie ou Michaël valide en 1 clic.
       Vous gagnez du temps. Nous aussi. »
```

---

### FOOTER  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
                  hero-6 (atterrissage · fin)

   « Sites faits main à Bordeaux : stack européenne, IA déclarée,
     accessibles, sous 1 Mo, prix publics. »
                       (Fraunces italique · centré · phrase signature)

   🌍 Cette page = X g CO₂ / visite (Website Carbon Calculator API)
                       (live · couleur cyan focus · police mono)

   Mentions légales · CGV · Confidentialité · TVA art. 293 B CGI

   « Nous portons aussi Mémoire & Présence. »   (microcopie discrète)

   © 2026 Pinapp Inc. · Lauralie & Michaël
```

---

## 🥚 EASTER EGGS · 5 INTÉGRÉS

### 🥚 1 · Mode draft VISIBLE par défaut
```
<body class="draft-mode" data-draft-count="4">
  → Tous les .placeholder-asset s'affichent
  → border 1-2px dashed var(--or)
  → padding 32-48px
  → label "📭 PLACEHOLDER" en haut à gauche en or
  → 4 placeholders comptés : s01, s07, s08, s09 ×2
```

### 🥚 2 · Scene-counter top-droite
```
position: fixed · top 24px · right 24px · z-index 50
Fraunces italique 1rem · color or
"01 / 14" → "02 / 14" → ... s'incrémente IntersectionObserver
transition opacity 200ms
sober mode → masqué
```

### 🥚 3 · Morse-stay bas-gauche → modale M&P
```
position: fixed · bottom 24px · left 24px · z-index 40
Animation morse "STAY" : ●●● ─ ─ ●─ ─ ─●─
8 dots/dashes en or qui clignotent en boucle 4s
opacity 0.4 → 0.8 hover → 1 click

CLICK → ouvre modale (overlay nuit alpha 0.85 · backdrop-blur 12px)
┌──────────────────────────────────────────────────────────┐
│                       🌿 STAY                            │
│                                                          │
│            Ce qui reste. Ce qu'on transmet.              │
│                                                          │
│  Aux côtés de Pinapp, nous portons aussi                 │
│  Mémoire & Présence — un projet de transmission          │
│  numérique pour les familles.                            │
│                                                          │
│  Pas un service Pinapp. Un engagement parallèle.         │
│                                                          │
│  → Visiter memoireetpresence.fr ↗                        │
│                                                          │
│                                              [ × Fermer ]│
└──────────────────────────────────────────────────────────┘
ESC + click-outside + bouton fermer
```

### 🥚 4 · Konami code → console.log Pinapp
```
↑ ↑ ↓ ↓ ← → ← → B A
→ console.log message ASCII art Pinapp + crédit Lauralie & Michaël
→ aucun changement visuel sur la page
```

### 🥚 5 · Tapestry-whisper Spider-Man (s08)
```
Voir s08 ci-dessus · Option B Fraunces italique grand format
scroll-triggered text-split caractère par caractère
Phrase : « Un grand pouvoir n'implique pas une grande
responsabilité. Pas chez les autres. Chez nous, si. »
```

---

## 🎨 DESIGN SYSTEM · RAPPEL VISUEL

```
PALETTE
  Or             #e6b973  ███  CTA · accents · titres importants
  Or-light       #f7d99d  ███  hover · états actifs
  Ivoire         #f4ece0  ███  texte sur sombre · lead
  Ivoire-dim     #c9bfae  ███  texte secondaire
  Ivoire-mute    rgba ─   ░░░  microcopy · captions
  Cyan           #3ef5e0  ███  focus ring · easter egg
  Nuit           #050b14  ███  fond principal (PAS #000)
  Fumee          rgba ─   ▒▒▒  cards glassmorphism
  Or-glow        rgba ─   ░░░  halos · CTA hover

TYPOGRAPHIE (Bunny Fonts uniquement)
  Display    Fraunces italique  signature · H1 · H2 · taglines
  Body       Inter              tout le reste

ÉCHELLE
  H1     clamp(3.5rem, 9vw, 7rem)    Fraunces 600i
  H2     clamp(2.25rem, 5vw, 4rem)   Fraunces 600i
  H3     clamp(1.75rem, 3.5vw, 2.5rem)
  Body   17px · line-height 1.65 · Inter 400
  Micro  14px · Inter 400 · ivoire-mute

COMPONENTS
  Cards         glassmorphism · backdrop-blur 20px · border 1px fumee · radius 16px
  Buttons       active translate -1px · focus ring cyan 2px offset 3px
  Inputs        label visible (jamais sr-only) · error inline rouge
  Loaders       skeletal sur images (pas spinners)
  Touch         ≥ 44px obligatoire mobile

ANTI-AI-SLOP (taste-design)
  ❌ Pas de "Scroll to explore" · pas de chevron bouncing
  ❌ Pas de 3-column equal grid (asymétrie obligatoire)
  ❌ Pas de fake stats inventées
  ❌ Animer transform/opacity uniquement (pas top/left/width)
  ❌ min-height: 100dvh (pas h-screen — fix iOS Safari)
  ❌ Pas "Elevate / Seamless / Unleash / Next-Gen"
```

---

## 📋 DOCTRINE ÉDITORIALE · GARDE-FOUS

```
INTERDITS dans toute la copy :
  ❌ "!" (sobriété)
  ❌ "solution innovante" / "révolutionnaire" / "disruptif"
  ❌ "résultat garanti" / promesses chiffrées non tenables
  ❌ "satisfait ou remboursé" → "accompagnement 30 jours"
  ❌ Jargon agence (synergies, transformation digitale, écosystème)
  ❌ Jargon tech (Cursor, Claude, n8n, agents IA, prompts) — caché
  ❌ Mention TDAH/bipolaire des fondateurs (info privée)
  ❌ "Mariage" dans services Micha (il n'en fait plus)

OBLIGATOIRES :
  ✅ Pronoms : Lauralie (elle) · Michaël/Micha (il) · "nous" duo · "je" bios solo
  ✅ Bio Micha : "10 ans dans l'événementiel"
  ✅ Lauralie : prix fixes affichés
  ✅ Micha : "à partir de" + sur devis
  ✅ Neuro = CIBLE OK ("Pour les cerveaux qui vont vite")
  ✅ Neuro = JAMAIS pour décrire les fondateurs
```

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

## 🚦 CONTRAINTES IMMUABLES R1-R6

```
R1  6 photos hero-1..6.webp (assets/) : INTOUCHABLES, jamais modifier
R2  4 vidéos Vimeo : posters cliquables uniquement (pas autoplay)
R3  prefers-reduced-motion : désactive Ken Burns, reveal, parallax
R4  Mode sobre toggle nav : coupe les animations lourdes
R5  Bunny Fonts uniquement (pas Google Fonts)
R6  Vanilla JS uniquement (pas GSAP, jQuery, Lenis)
```

---

## 📦 LIVRABLE CLAUDE DESIGN

```
Génère un prototype interactif scrollable qui implémente :
  ✓ 14 scènes complètes avec textes verbatim
  ✓ 6 photos hero cross-fade IntersectionObserver
  ✓ 4 vidéos Vimeo posters cliquables
  ✓ 4 encarts placeholder VISIBLES (mode draft activé) :
      • s01 Vidéo Pinapp 60s (à tourner)
      • s07 Slot Film cadeau IA (Vimeo Micha à fournir)
      • s08 Lauralie chante 100% IA (en production)
      • s09 Séminaire + Anniversaire (Vimeo Micha à fournir)
  ✓ 5 easter eggs (scene-counter, STAY morse → modale M&P,
                    Spider-Man whisper s08, Konami code, mode draft)
  ✓ Glow up CRO (CTA personnalisés, FAQ 5 questions, pricing
                  anchors visibles, form 3 cards visuelles)
  ✓ SEO meta + JSON-LD LocalBusiness + FAQPage
  ✓ Design system Pinapp doré/ivoire/cinéma sombre
  ✓ Doctrine éditoriale respectée (0 jargon, 0 "!", neuro = cible
                                    fondateurs jamais, pas mariages)
  ✓ Mode sobre toggle nav
  ✓ Touch targets ≥ 44px mobile
  ✓ prefers-reduced-motion respecté

Format : prototype interactif Claude Design (URL preview + export
         possible PDF/Canva).
Stack : Vanilla JS · Bunny Fonts · Self-contained · 1 fichier HTML.
```

---

*Schéma final V5 · 2026-04-26 · prêt à coller dans claude.com/design*
*Tous les encarts placeholder sont visibles et complétés.*
*C'est le rendu cible que Cursor essaie de produire depuis tout à l'heure.*
