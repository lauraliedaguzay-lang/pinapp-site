# PROMPT TOTAL · Claude Design (Anthropic Labs)

> Pour claude.com/design — research preview Anthropic Labs.
> Claude Design lit ton codebase, applique ton design system, génère un prototype interactif.

---

## 🎯 Méthode recommandée

```
1. Va sur claude.com/design  (ou plugin Design depuis Claude.ai)
2. Connecte le repo GitHub : github.com/lauraliedaguzay-lang/pinapp-site
3. Pointe sur la branche main, fichier voyage-v9/index.html
4. Colle le bloc ci-dessous comme prompt
5. Claude Design génère un prototype scrollable interactif
6. Tu raffines via inline comments OU sliders OU conversation
7. Export : URL preview · PDF · Canva (selon ton plan)
```

Si Claude Design ne supporte pas l'import GitHub direct, attache simplement ces 3 fichiers en upload :
- `voyage-v9/index.html` (état actuel)
- `voyage-v9/PATCH-V5-FINAL.md`
- `voyage-v9/PATCH-V5-GLOW-UP.md`

---

## ⬇ COPIER-COLLER LE BLOC CI-DESSOUS DANS CLAUDE DESIGN

```
Mission : régénérer le site pinapp.fr/voyage-v9/ en version V5 finale, à partir du codebase importé + des deux patches PATCH-V5-FINAL.md et PATCH-V5-GLOW-UP.md.

═══════════════════════════════════════════════════════════════════════
DESIGN SYSTEM PINAPP (à appliquer automatiquement à tout)
═══════════════════════════════════════════════════════════════════════

PALETTE :
  --or:#e6b973 (accent doré · CTA · accents cinéma)
  --or-light:#f7d99d
  --ivoire:#f4ece0 (texte sur sombre)
  --ivoire-dim:#c9bfae
  --ivoire-mute:rgba(244,228,193,0.62)
  --cyan:#3ef5e0 (focus + secondaire)
  --nuit:#050b14 (fond principal sombre cinéma)
  --fumee:rgba(20,30,42,0.6) (cards · glassmorphism)
  --or-glow:rgba(230,185,115,0.18)
  ❌ JAMAIS #000000 pur · JAMAIS neon purple · JAMAIS gradient mesh

TYPOGRAPHIE (Bunny Fonts uniquement, jamais Google Fonts) :
  Display/Headlines : Fraunces (italique signature)
    https://fonts.bunny.net/css?family=fraunces:400i,500,600i,700,900
  Body : Inter
    https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap
  Échelle : H1 clamp(3.5rem,9vw,7rem) · H2 clamp(2.25rem,5vw,4rem) · body 17px line-height 1.65

COMPONENTS :
  • Cards : glassmorphism (backdrop-filter blur 20px), border 1px var(--fumee), border-radius 16px
  • Buttons : tactile -1px translate sur active, focus ring var(--cyan) 2px offset 3px
  • Inputs : label visible au-dessus (jamais sr-only), error inline rouge, focus ring cyan
  • Skeletal loaders sur images (pas spinners)

TASTE-DESIGN ANTI-GÉNÉRIQUE (Apple, anti-AI-slop) :
  ❌ Pas de "Scroll to explore" · pas de chevron bouncing
  ❌ Pas de 3-column equal grid (asymétrie obligatoire)
  ❌ Pas de fake stats inventées
  ❌ Animer transform/opacity uniquement (pas top/left/width)
  ❌ min-height: 100dvh (pas h-screen — fix iOS Safari)
  ❌ Touch targets ≥ 44px obligatoire
  ❌ Pas "Elevate / Seamless / Unleash / Next-Gen"

ANIMATIONS :
  • Stage fixe avec cross-fade entre 6 photos hero (IntersectionObserver)
  • Reveal au scroll cascade staggered (data-reveal-delay 1-5)
  • Ken Burns lent sur photo active (zoom 1→1.05 sur 15s)
  • Spring physics sur boutons
  • Glassmorphism sur cards
  • prefers-reduced-motion respecté (désactive Ken Burns + reveal)

═══════════════════════════════════════════════════════════════════════
ASSETS FOURNIS (URLs absolues — utiliser tel quel)
═══════════════════════════════════════════════════════════════════════

🎨 6 PHOTOS HERO STAGE FIXE (cross-fade au scroll) :
  hero-1 https://pinapp.fr/voyage-v9/assets/hero-1.webp (vaisseau)
  hero-2 https://pinapp.fr/voyage-v9/assets/hero-2.webp (cockpit)
  hero-3 https://pinapp.fr/voyage-v9/assets/hero-3.webp (offre)
  hero-4 https://pinapp.fr/voyage-v9/assets/hero-4.webp (cinéma)
  hero-5 https://pinapp.fr/voyage-v9/assets/hero-5.webp (profondeur)
  hero-6 https://pinapp.fr/voyage-v9/assets/hero-6.webp (atterrissage)
  → R1 NON NÉGOCIABLE : ne jamais modifier ces fichiers

🎬 4 VIDÉOS VIMEO (poster cliquable + iframe au click) :
  Walker (1184294762) https://vumbnail.com/1184294762_large.jpg
  Star Wars Teaser (1184294810) https://vumbnail.com/1184294810_large.jpg
  Resident Evil (1184294871) https://vumbnail.com/1184294871_large.jpg
  Star Wars 3 min (1184294831) https://vumbnail.com/1184294831_large.jpg

🌿 LIEN EXTERNE (easter egg uniquement) : https://memoireetpresence.fr

📭 4 ENCARTS PLACEHOLDER (border doré dashed visible) :
  • Vidéo Pinapp 60s (duo face cam — à tourner)
  • Lauralie chante · clip 100% IA voix incluse (en production)
  • Séminaire entreprise (Vimeo Micha à fournir)
  • Anniversaire / privé (Vimeo Micha à fournir)

═══════════════════════════════════════════════════════════════════════
DOCTRINE ÉDITORIALE NON NÉGOCIABLE
═══════════════════════════════════════════════════════════════════════

🚫 INTERDITS dans toute la copy visible :
  • "!" (sobriété)
  • "solution innovante" / "révolutionnaire" / "disruptif" / "game-changer"
  • "résultat garanti" / promesses chiffrées non tenables
  • "satisfait ou remboursé" → "accompagnement 30 jours"
  • Jargon agence (synergies, transformation digitale, écosystème)
  • Jargon tech (Cursor, Claude, n8n, agents IA, workflows, prompts) — caché
  • Mention TDAH/bipolaire des fondateurs Lauralie ou Michaël (info privée)
  • "Mariage" dans services Micha (il n'en fait plus)

✅ Pronoms : Lauralie (elle) · Michaël/Micha (il) · "nous" duo · "je" bios solo
✅ Bio Micha : "10 ans dans l'événementiel" (PAS "mariages")
✅ Doctrine prix :
  • Lauralie : prix fixes affichés
  • Micha : "à partir de" + sur devis

✅ Tarifs Pinapp EXACTS :
  Formations Lauralie (fixes) : 39 / 67 / 147 / 397 €
  Prestations Lauralie (fixes) : 490 / 690 (bundle Site+Auto -190€) / 890 / 1 290 / 1 590 €
  Prestations Micha (à partir de) :
    dès 390 €    Film cadeau IA · 30s
    dès 1 290 €  Court-métrage IA pro · 60-90s
    dès 1 500 €  Clip artiste IA · 30-60s
    dès 1 890 €  Court-métrage premium · 1-3 min
    dès 2 800 €  Premium "vous dedans" · 3 min
    dès 1 200 €  Anniversaire NA
    dès 1 800 €  Séminaire NA
    Sur devis    Direction artistique
  Pack Duo :
    Essentiel 1 890 € HT (afficher "1 970 €" barré → 1 890 €, économie -80 €)
    Signature 4 900 € HT (badge "Le plus demandé", économie -1 277 € vs séparé)
  Récurrent : Pinapp Care 190-390 €/mois
  Solidaire : -40 % associations / ESS / TPE < 5 salariés (vérification SIRENE auto)

═══════════════════════════════════════════════════════════════════════
14 SCÈNES À GÉNÉRER (numérotation linéaire)
═══════════════════════════════════════════════════════════════════════

s01 HERO (stage hero-1)
   Eyebrow : "Pinapp Inc · Bordeaux · 2026"
   H1 : "Vos outils travaillent." / "Vous gagnez du temps."
   Lead : "Sites · automatisations · films · clips. Un seul devis. 50 à 75 % moins cher qu'une agence classique. Diagnostic offert sous 24h."
   Encart placeholder : Vidéo Pinapp 60s (à tourner)
   Stats : 24h réponse · 0 € diagnostic · 30j accompagnement
   CTA : "Recevoir mon diagnostic gratuit →"
   Badge : "IA déclarée · Stack EU · Page < 1 Mo"

s02 LE DUO (hero-1)
   H2 : "Lauralie + Michaël. Deux experts. Un seul interlocuteur. Un seul devis."
   2 colonnes parité Lauralie ↔ Michaël (10 ans événementiel · études info · autodidacte IA)

s03 LE CONSTAT (hero-2)
   H2 : "Reconnaissez-vous votre semaine ?"
   4 douleurs : Site qui dort · Devis qui s'oublient · Avis Google rares · Charge mentale H24
   Avant/après : 3j 12% → 24h 32%
   Microcopy CIBLE : "Pour les cerveaux qui vont vite. Pour ceux qui veulent l'essentiel."
   ⚠ Neuro = CIBLE, jamais des fondateurs

s04 POURQUOI L'IA (hero-2)
   H2 : "Pourquoi 50 à 75 % moins cher ? Voici les 4 sources qu'on assume."
   4 sources cliquables : McKinsey 2023 · Stanford 2025 · OECD 2024 · ADEME 2024 (critique)
   "L'IA a un coût environnemental. Voici comment on le limite."

s04b PÉDAGOGIE IA (hero-2 · interstitiel)
   3 cards Q&A vulgaires :
   ❓ "C'est quoi ?" → "Un outil qui fait à votre place ce que vous faites en double."
   ❓ "Concrètement ?" → "Client écrit · réponse 2 min. Devis signé sans vous. Avis Google J+7."
   ❓ "Combien je gagne ?" → "8 à 14h/sem. OECD 2024."
   + bonus : "Et si je suis nul·le en informatique ?" → "On s'occupe de tout. Vous validez par mail."

s05 PACK DUO (hero-3) ★ ANCRE HAUTE ★
   2 cards :
   ESSENTIEL · 1 890 € (1 970€ barré) · site + 1 film 30-60s + 30j + DA · économie -80€
   SIGNATURE · 4 900 € (badge "Le plus demandé") · site + 1 film 3min + auto + 90j + L3 incluse + 1 mois Care offert · économie -1 277€

s06 LAURALIE · VUE (hero-3)
   H2 : "14 démos. Votre secteur est dedans. Prix affichés."
   Reel placeholder 20s (style Apple WWDC)
   3 piliers cercles connectés : 🌐 Sites 1290€ · ⚙ Auto 490€ · ✨ IA 890€
   3 démos phares mockups iPhone : Atelier Rivage ★ · Ōkami · Clara Fontaine
   Dépliant <details> : 11 démos sectorielles
   Bundle card : Site + Auto · 1 590€ HT (-190€)

s06b LAURALIE · LE SYSTÈME (hero-3 · interstitiel)
   Schéma rosace SVG : 8 dimensions (UI/UX · Code · Hosting EU · Perf · SEO · A11y · Auto · Prompts) autour centre "PROJET"
   Schéma flux : ◉ Lead → ◉ Notion → ◉ Devis → ◉ Paiement → ◉ Avis Google
   "8 dimensions · 1 livraison · 16 étapes invisibles."

s07 MICHA · CINÉMA IA (hero-4)
   Grille mosaic Apple TV+ · 4 vidéos Vimeo :
   🎬 Walker (1184294762) · 1 290€
   🎬 SW Teaser (1184294810) · 1 500€
   🎬 Resident Evil (1184294871) · 1 890€ (court premium 1-3min)
   🎬 SW 3 min (1184294831) · 2 800€ (microcopy "Exemple Pack Signature. Votre version sur votre univers — pas Star Wars.")
   📭 Slot Film cadeau · 390€
   "Avant l'IA : 8 000€ agence. Avec Pinapp : dès 1 290€. -84 %."

s08 CLIP IA · CLIMAX (hero-4) ★
   H2 : "Un clip Marvel-style. À 1 500 € au lieu de 50 000."
   Encart placeholder : Lauralie chante 100% IA (voix synthétisée IA + univers IA + montage IA · démo en production)
   Tapestry-whisper Spider-Man Option B (Fraunces italique grand format scroll-triggered) :
   « Un grand pouvoir n'implique pas une grande responsabilité.
     Pas chez les autres. Chez nous, si. »
   Crédit triptyque : "DA Lauralie · Réalisation IA Micha · Voix Lauralie"
   Tableau comparatif : Avant 8000-50000€ · Avec Pinapp 1500€+ · -90%
   Cible : 🎤 artistes · 🎬 créateurs · 🏢 marques
   CTA : "Recevoir un devis clip sous 48h →"

s09 ÉVÉNEMENTIEL + DA (hero-4)
   H2 : "Votre événement mérite plus qu'un iPhone."
   3 cards :
   📭 Séminaire NA · dès 1 800 € sur devis (placeholder Vimeo)
   📭 Anniversaire NA · dès 1 200 € sur devis (placeholder Vimeo)
   🎨 Direction artistique · sur devis
   ⚠ AUCUN MARIAGE (Micha n'en fait plus)

s09b MICRO-PAUSE (hero-5 · interstitiel)
   Plein écran sobre : "Maintenant, regardons les coulisses."

s10 LE TRAVAIL INVISIBLE (hero-5)
   H2 : "Un site. Un film. Voici tout ce que vous ne voyez pas."
   Slider Apple Health style "Avant IA / Avec IA"
   Avant : 16 étapes humaines (Brief · Architecture · Wireframes · Design system · Code · WCAG · Workflows · Prompts · Hosting · Monitoring · Stack · Tests perf · Tests a11y · Mise en ligne · Accompagnement · Suivi)
   Avec : 4 étapes IA (Brief minute · Génération assistée · Validation humaine · Mise en ligne)
   Compteurs animés : 16 → 4 · 8 000€ → 1 290€ · 30j → 7j
   "La différence n'est pas dans le travail. Elle est dans qui le fait."

s11 FORMATIONS (hero-5)
   4 cards : 🌱 39€ Éveil · 🟢 67€ Découverte · 🔵 147€ Praticien · 🟣 397€ Travailleur augmenté
   "+138 % adoption IA PME FR YoY (Stanford 2025)"
   Cross-sell : "Une fois Praticien terminé, beaucoup passent au Pack Duo."
   "💡 Beaucoup commencent par Découverte (67 €)."

s12 MÉTHODE + TARIFS RÉCAP (hero-6)
   Méthode 4 étapes : Brief · Cadrage · Livraison · Accompagnement 30j
   Doctrine prix bloc explicite
   Tableau funnel 4 paliers (avec colonne Avant/Après IA)
   Note solidaire : "★ -40 % asso/ESS/TPE<5 · vérif SIRENE auto"
   Note rareté éthique : "On prend 3 projets par mois. Pas plus. Pour rester bons."
   FAQ pliable 5 questions :
   1. "Si je ne connais rien en informatique ?" → "Vous validez par mail. Pas de logiciel à apprendre."
   2. "Combien de temps avant des résultats ?" → "Site 3 sem · leads 30-60j."
   3. "Pourquoi moins cher qu'une agence ?" → "On est 2, pas 15. On automatise notre propre travail."
   4. "Que se passe-t-il après les 30 jours ?" → "Vous gardez tout. Option Care 190-390€/mois."
   5. "Vous travaillez avec mon secteur ?" → "14 démos. Si non, on en fait une gratuitement avant le devis."

s13 ENGAGEMENTS + FORM ★ (hero-6)
   7 engagements visibles :
   🟢 IA déclarée · 🟢 Stack EU · 🟢 WCAG AA · 🟢 Page < 1 Mo · 🟢 Transparence radicale · 🟢 Inclusion · 🟢 Préparé 2030
   Clause : "Si un engagement n'est pas tenu sur votre projet, on le dit — et on rembourse la part concernée."
   FORM 3 chemins en CARDS visuelles cliquables (PAS radio buttons) :
   🔧 Tech / Systèmes → Lauralie
   🎬 Image / Mouvement → Micha
   ✨ Pack Duo complet → Lauralie + Micha
   Champs adaptés conditionnellement (apparition JS selon path)
   Champ téléphone optionnel : "si vous préférez qu'on rappelle"
   Pricing solidaire : checkbox "Je suis association / ESS / TPE < 5 salariés (-40 %)"
   CTA primaire : "Envoyer mon brief — réponse écrite sous 24h"
   CTA secondaire : "📅 Prendre rendez-vous en ligne →"
   Microcopy : "Pas un robot — un brouillon préparé en amont que Lauralie ou Michaël valide en 1 clic. Vous gagnez du temps. Nous aussi."

═══════════════════════════════════════════════════════════════════════
EASTER EGGS À INTÉGRER
═══════════════════════════════════════════════════════════════════════

🥚 1. Mode draft VISIBLE par défaut (body class="draft-mode")
   → Tous les .placeholder-asset s'affichent (border doré dashed)

🥚 2. Scene-counter (haut-droite fixed) "NN / 14" qui s'incrémente au scroll

🥚 3. Morse-stay (bas-gauche fixed) animation morse "STAY" en doré
   → CLICK ouvre une modale qui révèle Mémoire & Présence
   → "🌿 STAY = ce qui reste, ce qu'on transmet. Aux côtés de Pinapp, nous portons aussi Mémoire & Présence — projet de transmission numérique. Pas un service Pinapp. Un engagement parallèle. → Visiter memoireetpresence.fr ↗"
   → ESC + click-outside + bouton fermer

🥚 4. Console.log Pinapp avec Konami code (Up Up Down Down Left Right Left Right B A)

🥚 5. Tapestry-whisper Spider-Man Option B (s08 climax)

═══════════════════════════════════════════════════════════════════════
SEO + JSON-LD (à inclure dans <head>)
═══════════════════════════════════════════════════════════════════════

<title>Pinapp · Sites + films pour TPE/PME · 50 à 75% moins cher | Bordeaux</title>
<meta name="description" content="Duo Pinapp : sites qui convertissent + films cinéma. Diagnostic 24h gratuit. Bordeaux + Nouvelle-Aquitaine. Tarifs publics dès 1 290 €.">
<meta property="og:title" content="Pinapp — Sites + Films pour TPE/PME ambitieuses">
<meta property="og:image" content="https://pinapp.fr/voyage-v9/assets/hero-1.webp">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">

JSON-LD LocalBusiness avec founder × 2 + AggregateOffer 39-4900 €
JSON-LD FAQPage avec les 5 questions de s12

═══════════════════════════════════════════════════════════════════════
TEXTES VERBATIM · À UTILISER MOT POUR MOT
═══════════════════════════════════════════════════════════════════════

⚠ Tu utilises ces textes EXACTS, sans rien changer aux mots, aux chiffres, aux pronoms.
⚠ Tu peux uniquement adapter la mise en forme harmonieusement : typographie, hauteur de ligne, hiérarchie visuelle, espacement, retours à la ligne, balises (H1/H2/H3/p/ul/li), animation reveal, position dans la grille.
⚠ Tu ne TRADUIS pas, tu n'INVENTES pas, tu ne PARAPHRASES pas.

────────────────────────────────────────────────────
NAV (top fixe)
────────────────────────────────────────────────────
[Logo Pinapp]   Diagnostic 24h offert →   Mode sobre   ☰

Menu hamburger ☰ → "Qui sommes-nous"

────────────────────────────────────────────────────
s01 HERO
────────────────────────────────────────────────────
Eyebrow : Pinapp Inc · Bordeaux · 2026

H1 :
Vos outils travaillent.
Vous gagnez du temps.

Lead :
Sites · automatisations · films · clips.
Un seul devis. 50 à 75 % moins cher qu'une agence classique.
Diagnostic offert sous 24 heures.

Encart placeholder (mode draft visible) :
📭 Vidéo « Pinapp en 60 secondes »
Duo face caméra · 45-60 sec · à tourner

Stats : 24h réponse · 0 € diagnostic · 30j accompagnement
Badge sous H1 : IA déclarée · Stack EU · Page < 1 Mo

CTA primaire : Recevoir mon diagnostic gratuit →
CTA fantôme : Voir le diagnostic ↓

────────────────────────────────────────────────────
s02 LE DUO
────────────────────────────────────────────────────
Eyebrow : Qui fait quoi

H2 :
Lauralie + Michaël.
Deux experts. Un seul interlocuteur. Un seul devis.

🔧 LAURALIE Daguzay
Architecte des systèmes.
Sites, automatisations, assistants intelligents, formations.
Tient le système. Du brief à la mise en ligne.
Bordeaux · partout en France.

🎬 MICHA · Michaël Bouilhac
10 ans dans l'événementiel.
Photo. Vidéo. Terrain.
Études d'informatique. Autodidacte sur les outils intelligents.
Tient l'image. Du brief au rendu final.
Bordeaux · Nouvelle-Aquitaine.

Tagline : « Lauralie architecte. Michaël filme. Ensemble nous livrons. »

CTA : En savoir plus sur nous → (ouvre menu hamburger)

────────────────────────────────────────────────────
s03 LE CONSTAT
────────────────────────────────────────────────────
Eyebrow : Le diagnostic

H2 : Reconnaissez-vous votre semaine ?

4 douleurs :
01 Site qui dort. Personne ne vous trouve.
02 Devis qui s'oublient. Vous facturez en retard.
03 Avis Google rares. Vous demandez. Personne répond.
04 Charge mentale H24. Vous y pensez encore à 23h.

Avant/après chiffré :
Avant : 3 jours · 12 % closent.
Après : 24 heures · 32 % closent.
(Mesures sur nos propres ops · le diagnostic chiffre les vôtres.)

Microcopy cible :
« Pour les cerveaux qui vont vite. Pour ceux qui veulent l'essentiel. »

────────────────────────────────────────────────────
s04 POURQUOI L'IA
────────────────────────────────────────────────────
Eyebrow : La méthode

H2 : Pourquoi 50 à 75 % moins cher ? Voici les 4 sources qu'on assume.

Cards sources cliquables :
📊 McKinsey 2023 — Economic potential of generative AI
   « -50 à -70 % temps production digitale »

📊 Stanford AI Index 2025
   « Coûts vidéo générative ÷ 4 entre 2023 et 2025 »

📊 OECD AI Observatory 2024
   « +138 % adoption IA dans les PME françaises (YoY) »

📊 ADEME 2024 (vue critique)
   « Coût environnemental de l'IA générative — transparence »

Lead :
Un site agence : 4 200 à 8 000 €.
Chez nous : à partir de 1 290 €.
Trois sources publiques le confirment.

Note critique :
« L'IA a un coût environnemental. Voici comment on le limite :
hébergement européen, choix d'outils sobres, pas de génération inutile. »

────────────────────────────────────────────────────
s04b PÉDAGOGIE IA
────────────────────────────────────────────────────
Eyebrow : Comprendre

H3 :
L'intelligence pour ma boîte.
Concrètement.

Lead :
Vous n'avez pas à comprendre comment ça marche.
Juste ce que ça change pour vous.

4 cards Q&A :

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

────────────────────────────────────────────────────
s05 PACK DUO ★ ANCRE HAUTE
────────────────────────────────────────────────────
Eyebrow : L'offre signature

H2 : Pack Duo. Tout en un seul devis.

Card ESSENTIEL :
Pack Duo Essentiel
~~1 970 €~~ → 1 890 € HT
Économisez 80 €

• Site qui convertit
• + 1 film cadeau (30-60 sec)
• + 30 jours d'accompagnement
• + Direction artistique unifiée
Livrable < 30 jours

Card SIGNATURE (badge "Le plus demandé") :
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

CTA : Réserver le Pack Duo →

────────────────────────────────────────────────────
s06 LAURALIE · VUE D'ENSEMBLE
────────────────────────────────────────────────────
Eyebrow : Studio Lauralie · Prix fixes

H2 :
14 démos. Votre secteur est dedans. Prix affichés.

Reel placeholder : 14 sites en motion (style Apple WWDC, 20 sec)

3 piliers (cercles connectés) :
🌐 Sites qui convertissent · 1 290 € HT
⚙ Automatisations qui tournent seules · 490 € HT
✨ Assistants qui répondent H24 · 890 € HT

3 démos phares (mockups iPhone) :
★ Atelier Rivage · architecture · villas (démo live)
02 Ōkami · restaurant
03 Clara Fontaine · coach · consultant

Dépliant <details> : Trouver mon secteur (11 démos de plus) →
(artisan · avocat · esthéticienne · cils · ongles · coiffeur · barbier · boulangerie · fitness · tatoueuse · sur-mesure)

Card bundle passerelle :
💼 Bundle Site + Outils auto · 1 590 € HT
Séparé : 1 290 € + 490 € = 1 780 €. En bundle : -190 € (-11 %).

Doctrine prix :
« Côté Lauralie : prix fixes affichés. La tech, ça se chiffre. »

────────────────────────────────────────────────────
s06b LAURALIE · LE SYSTÈME
────────────────────────────────────────────────────
Eyebrow : Ce qu'il y a derrière

H3 :
Pourquoi un site Lauralie tient dans le temps ?
8 dimensions qu'on gère pour vous. Vous ne les verrez jamais.

Schéma rosace SVG · 8 cercles connectés autour d'un centre « PROJET » :
UI/UX · Code · Hosting EU · Performance · SEO · Accessibilité · Outils auto · Prompts intelligents

Schéma flux nodes :
◉ Lead capté → ◉ Notion CRM → ◉ Devis auto → ◉ Paiement → ◉ Avis Google J+7

Tagline : 8 dimensions · 1 livraison · 16 étapes invisibles.

CTA : Voir le travail invisible →

────────────────────────────────────────────────────
s07 MICHA · CINÉMA IA
────────────────────────────────────────────────────
Eyebrow : Studio Micha · Cinéma IA

H2 :
Du clip 30 secondes
au court-métrage 3 minutes.

Grille mosaic Apple TV+ · 4 vidéos Vimeo (posters cliquables) :

🎬 [Walker] (Vimeo 1184294762)
Court-métrage IA pro
60-90 sec · livraison 7 jours
À partir de 1 290 € HT · sur devis

🎬 [Star Wars Teaser] (Vimeo 1184294810)
Clip artiste IA
30-60 sec · livraison 7 jours
À partir de 1 500 € HT · sur devis

🎬 [Resident Evil] (Vimeo 1184294871)
Court-métrage premium
1-3 minutes · livraison 14 jours
À partir de 1 890 € HT · sur devis

🎬 [Star Wars 3 min] (Vimeo 1184294831)
Premium « vous dedans »
3 minutes · vous + IA + montage pro
À partir de 2 800 € HT · sur devis
Microcopy : « Exemple de ce que vous recevez en Pack Signature.
Votre version, sur votre univers — pas Star Wars. »

📭 Slot Film cadeau IA · 30 sec · livraison 5 jours · à partir de 390 € HT (placeholder Vimeo à fournir)

Argument tarifaire :
Avant l'IA : 8 000 € en agence.
Avec Pinapp : à partir de 1 290 €. -84 %.

Doctrine prix :
« Côté Micha : à partir de + devis. Le cinéma, ça se brieffe. »

────────────────────────────────────────────────────
s08 CLIP IA · CLIMAX ★
────────────────────────────────────────────────────
Eyebrow : Studio Micha · Clip 100 % IA

H2 :
Un clip Marvel-style.
À 1 500 € au lieu de 50 000.

Lead :
Vous voulez un clip type Marvel, Star Wars ou Avatar.
En studio classique : 8 000 à 50 000 €.
Avec Pinapp : tout en IA — visuels, voix, montage.

📭 Encart placeholder (mode draft visible) :
[▶] Lauralie chante — clip 100 % IA
En production · disponible été 2026

✦ Voix de Lauralie (synthétisée IA)
✦ Univers visuel cinéma (génération IA)
✦ Montage et étalonnage (assistés IA)

Démo Pinapp pour les créateurs qui veulent un clip CGI sans le budget studio.

Tapestry-whisper Spider-Man (Fraunces italique grand format au scroll) :
« Un grand pouvoir n'implique pas une grande responsabilité.
Pas chez les autres.
Chez nous, si. »

Crédit triptyque :
Direction artistique Lauralie · Réalisation IA Micha · Voix Lauralie

Tableau comparatif :
Avant l'IA       8 000 - 50 000 €
Avec Pinapp     à partir de 1 500 € HT
Économie        -90 %

Cible :
🎤 artistes · 🎬 créateurs de contenu · 🏢 marques narratives

CTA : Recevoir un devis clip sous 48h →

────────────────────────────────────────────────────
s09 ÉVÉNEMENTIEL + DA
────────────────────────────────────────────────────
Eyebrow : Studio Micha · Nouvelle-Aquitaine

H2 :
Votre événement mérite plus qu'un iPhone.

Lead :
Micha filme en Nouvelle-Aquitaine. Sur devis.
Le déplacement est inclus dans le chiffrage.

Card 1 :
📭 Séminaire entreprise (Vimeo Micha à fournir)
Discours, ateliers, ambiance — un livrable pro.
Captation 1 jour · montage 7 jours
À partir de 1 800 € HT · sur devis

Card 2 :
📭 Anniversaire / événement privé (Vimeo Micha à fournir)
Soirée, discours, moments forts — montage émotion.
Captation 4-6h · montage 5 jours
À partir de 1 200 € HT · sur devis

Card 3 :
🎨 Direction artistique
Univers visuel d'une marque ou d'un projet.
Sur devis

CTA : Demander un devis événementiel →

────────────────────────────────────────────────────
s09b MICRO-PAUSE (interstitiel plein écran sobre)
────────────────────────────────────────────────────
« Maintenant, regardons les coulisses. »

────────────────────────────────────────────────────
s10 LE TRAVAIL INVISIBLE
────────────────────────────────────────────────────
Eyebrow : Ce qu'il y a derrière

H2 :
Un site. Un film.
Voici tout ce que vous ne voyez pas.

Lead :
Si on est moins cher qu'une agence, c'est parce qu'on ne sous-traite rien.
Pas parce qu'on saute des étapes.

Slider Apple Health · « Avant IA / Avec IA » :

CÔTÉ AVANT IA — 16 étapes humaines
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

CÔTÉ AVEC PINAPP — 4 étapes IA
01 Brief minute
02 Génération assistée
03 Validation humaine
04 Mise en ligne

Compteurs animés :
16 → 4 étapes
8 000 € → 1 290 €
30 jours → 7 jours

Tagline :
« La différence n'est pas dans le travail.
Elle est dans qui le fait. »

────────────────────────────────────────────────────
s11 FORMATIONS
────────────────────────────────────────────────────
Eyebrow : Apprendre à piloter ses propres outils

H2 :
Quatre niveaux.
Du curieux au travailleur augmenté.

Lead :
Stanford 2025 : adoption de l'intelligence dans les PME françaises +138 % en un an.
Vous décidez de quel côté vous êtes.

4 cards :
🌱 39 €    Éveil IA           1h vidéo + checklist
🟢 67 €    Découverte         2h · comprendre l'assistant
🔵 147 €   Praticien          5h · automatiser 5 tâches
🟣 397 €   Travailleur augmenté  12h · construire son assistant

Microcopy guidance : 💡 Beaucoup commencent par Découverte (67 €).

Cross-sell :
Une fois Praticien terminé, beaucoup passent au Pack Duo. C'est l'enchaînement logique.

CTA : Choisir mon niveau →

────────────────────────────────────────────────────
s12 MÉTHODE + TARIFS RÉCAP
────────────────────────────────────────────────────
Eyebrow : Comment on travaille

H2 :
Quatre étapes. Tous les tarifs.
Pas de surprise.

Méthode 4 étapes :
01 BRIEF       30 minutes en visio ou par écrit. Vous racontez. On écoute.
02 CADRAGE     Devis fixe écrit · sous 48 heures. Vous validez par écrit.
03 LIVRAISON   On produit. Vous voyez avancer. Vous corrigez.
04 ACCOMPAGNT  30 jours offerts après livraison. On corrige jusqu'à ce que ça tienne.

Bloc doctrine prix :
🔧 Côté Lauralie : prix fixes affichés. La tech, ça se chiffre.
🎬 Côté Micha : « à partir de » + devis. Le cinéma, ça se brieffe.

Tableau funnel 4 paliers (avec colonne Avant/Après IA) :

PALIER 1 — ENTRÉE (Lauralie · prix fixes)
   39 €    Éveil IA              vs 200 €+ webinaire
   67 €    Découverte Claude     vs 400 €+ formation perso

PALIER 2 — PRODUCTIVITÉ (Lauralie · prix fixes)
   147 €   Praticien             vs 800 €+
   397 €   Travailleur augmenté  vs 2 000 €+
   490 €   Outils auto           vs 2 500 €+
   690 €   Mini-site + 1 outil   passerelle

PALIER 3 — PROJETS PONCTUELS
   890 €   Assistant H24         [Lauralie · fixe]
   1 290 € Site qui convertit    [Lauralie · fixe]
   1 590 € Bundle Site + Auto    [Lauralie · fixe · -190 €]
   Dès 390 €    Film cadeau IA           [Micha · sur devis]
   Dès 1 290 €  Court-métrage IA pro     [Micha · sur devis]
   Dès 1 500 €  Clip artiste IA          [Micha · sur devis]
   Dès 1 890 €  Court-métrage premium    [Micha · sur devis]
   Dès 2 800 €  Premium « vous dedans »  [Micha · sur devis]
   Dès 1 200 €  Anniversaire NA          [Micha · sur devis]
   Dès 1 800 €  Séminaire NA             [Micha · sur devis]
   Sur devis    Direction artistique     [Micha]

PALIER 4 — TRANSFORMATION (Pack Duo · prix fixes pour cadrage)
   1 890 €      Pack Duo Essentiel
   4 900 €      Pack Duo Signature ★ recommandé
   190-390 €/mois  Pinapp Care

Note solidaire :
★ -40 % associations · ESS · TPE < 5 salariés
sur tous nos services. Vérification SIRENE automatique.

Note rareté éthique :
On prend 3 projets par mois. Pas plus. Pour rester bons.
(Live counter : créneaux dispo ce mois)

FAQ pliable 5 questions :

1. Et si je n'y connais rien en informatique ?
   Vous validez par mail. On gère tout le reste.
   Pas de logiciel à apprendre.

2. Combien de temps avant d'avoir des résultats ?
   Site livré sous 3 semaines.
   Premiers leads sous 30 à 60 jours en moyenne (selon votre secteur).

3. Pourquoi vous êtes moins chers qu'une agence ?
   On est 2, pas 15.
   On automatise notre propre travail.
   On ne sous-traite rien. C'est tout.

4. Que se passe-t-il après les 30 jours d'accompagnement ?
   Vous gardez tout : code, accès, données.
   Option Pinapp Care (190-390 €/mois) pour rester accompagné·e.

5. Vous travaillez avec mon secteur ?
   14 démos sectorielles disponibles.
   Si le vôtre n'y est pas, on en fait une gratuitement avant le devis.

CTA : Diagnostic offert sous 24h →

────────────────────────────────────────────────────
s13 ENGAGEMENTS + FORM ★
────────────────────────────────────────────────────
Eyebrow : Pour démarrer

H2 :
Sept engagements.
Un formulaire qui s'adapte à vous.

7 engagements (cards courtes) :
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

Clause opposable :
« Si un engagement n'est pas tenu sur votre projet, on le dit
— et on rembourse la part concernée. »

FORMULAIRE 3 chemins (CARDS visuelles cliquables, PAS radio buttons) :

🔧 Tech / Systèmes
   Vous voulez parler à Lauralie

🎬 Image / Mouvement
   Vous voulez parler à Micha

✨ Pack Duo complet
   Les deux — projet à 360°

Champs essentiels :
Prénom · Entreprise · Email · Téléphone — si vous préférez qu'on rappelle

Champs adaptés selon chemin (apparition conditionnelle) :

Chemin Tech :
- Site actuel (URL ou « rien encore »)
- Douleur principale (cocher)
- Délai souhaité (< 1 mois · 1-3 mois · pas pressé)

Chemin Image :
- Type de projet (film cadeau · court-métrage · clip artiste · clip CGI · premium · séminaire · anniversaire · DA · autre)
- Date approximative · Lieu · Univers visuel souhaité

Chemin Pack Duo :
- Périmètre coché (multi)
- Échéance critique
- Budget confirmé : ≥ 1 890 € (Essentiel) · ≥ 4 900 € (Signature) · à discuter

Pricing solidaire :
☐ Je suis association 1901 / ESS / TPE < 5 salariés (-40 %)

Message libre · Consent RGPD :
☐ J'accepte d'être recontacté·e par écrit sous 24h.
   Mes données restent chez nous.

CTA primaire : Envoyer mon brief — réponse écrite sous 24h
CTA secondaire : 📅 Prendre rendez-vous en ligne →

Microcopy reassurance :
Aucun appel surprise. Aucun engagement.
100 % par écrit. Réponse d'humain — pas de robot.

Microcopy automation invisible :
« Pas un robot — un brouillon préparé en amont
que Lauralie ou Michaël valide en 1 clic.
Vous gagnez du temps. Nous aussi. »

────────────────────────────────────────────────────
FOOTER
────────────────────────────────────────────────────
Phrase signature :
« Sites faits main à Bordeaux : stack européenne, IA déclarée,
accessibles, sous 1 Mo, prix publics. »

Métriques live :
🌍 Cette page = X g CO₂ / visite (Website Carbon Calculator)

Liens :
Mentions légales · CGV · Confidentialité · TVA art. 293 B CGI

Microcopie discrète M&P :
« Nous portons aussi Mémoire & Présence. »

© 2026 Pinapp Inc. · Lauralie & Michaël

────────────────────────────────────────────────────
MENU HAMBURGER « Qui sommes-nous » · 4 actes plein écran
────────────────────────────────────────────────────

ACTE I — Avant Pinapp
Deux trajectoires séparées.
Micha à Bordeaux, dix ans à filmer des événements.
À apprendre la lumière qui ne pardonne pas.
À monter des films qui devaient tenir trente ans dans un salon.
Lauralie en parallèle, direction artistique et code.
À construire des sites pour des indépendants
qui n'avaient pas les moyens d'une agence parisienne.

ACTE II — La rencontre IA
2023-2024. L'IA générative passe de jouet à outil.
Les deux basculent en même temps, chacun de son côté.
Micha entraîne des modèles d'image, monte ses premiers films IA.
Lauralie pousse ses pipelines voix synthétique IA, sites cinématiques, automations.
Ils se croisent sur un projet commun :
un film a besoin d'un site, un site a besoin d'un film, une voix a besoin d'un univers.
Pinapp Inc. naît de cette conversation-là.

ACTE III — Le duo Pinapp
Une boîte à Bordeaux, deux expertises sous un même toit.
Lauralie tient le système : sites, automations, intelligence générative.
Michaël tient l'image : films IA, clips, captations événementielles.
Un seul interlocuteur pour le client.
Deux cerveaux derrière.
Le client paie une boîte. Il a une équipe.

ACTE IV — Aujourd'hui et après
Pinapp construit ce que les concurrents des clients n'ont pas encore.
Sites cinématiques. Automations qui tournent la nuit.
Films IA narratifs. Captations événementielles signées. Capsules créateurs.
Trente jours d'accompagnement post-livraison sur chaque chantier.
Bordeaux comme port d'attache.
Nouvelle-Aquitaine en zone caméra.
France entière en distance.
Diagnostic offert sous 24 h.

────────────────────────────────────────────────────
MODALE STAY (easter egg morse-stay au click)
────────────────────────────────────────────────────
🌿 STAY

Ce qui reste. Ce qu'on transmet.

Aux côtés de Pinapp, nous portons aussi
Mémoire & Présence — un projet de transmission numérique pour les familles.

Pas un service Pinapp. Un engagement parallèle.

→ Visiter memoireetpresence.fr ↗

═══════════════════════════════════════════════════════════════════════
LIVRABLE
═══════════════════════════════════════════════════════════════════════

Génère un prototype interactif scrollable qui implémente :
- Les 14 scènes complètes avec textes exacts
- Les 6 photos hero avec cross-fade IntersectionObserver
- Les 4 vidéos Vimeo en posters cliquables
- Les 4 encarts placeholder visibles (mode draft activé par défaut)
- Les 5 easter eggs (scene-counter, STAY morse → modale M&P, Spider-Man whisper, Konami)
- Le glow up CRO complet (CTA personnalisés, FAQ 5 questions, pricing anchors visibles, form 3 cards)
- SEO meta + JSON-LD LocalBusiness + FAQPage
- Le design system Pinapp doré/ivoire/cinéma sombre
- Toute la doctrine éditoriale respectée (0 jargon, 0 "!", neuro = cible / fondateurs jamais)
- Mode sober toggle dans la nav
- Touch targets ≥ 44px mobile
- prefers-reduced-motion respecté

Format : prototype interactif Claude Design (URL preview + export possible PDF/Canva).
Vanilla JS uniquement · Bunny Fonts uniquement · Self-contained.
```

---

*Prompt Claude Design V5 · 2026-04-26 · prêt à coller dans claude.com/design*
