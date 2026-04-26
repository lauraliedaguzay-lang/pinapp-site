# PROMPT CURSOR · V5 DEPLOY CE SOIR

> Déploiement cible : `https://pinapp.fr/voyage-v9/` via **GitHub Pages** (`main` + `.github/workflows/deploy-pages.yml`).  
> **Lire aussi** : `PROMPT-CURSOR-V5-DEPLOY-CE-SOIR-PART2.md` (suite verbatim s05 → fin + checklist + commit).

---

## Workflow · ordre strict

```bash
git checkout main
git pull origin main

# Travail recommandé sur branche puis merge, ou directement main si brief validé seul :
# git checkout -b cursor/voyage-v9-v5-deploy-0309

# Après refonte complète du fichier :
git add voyage-v9/index.html
git commit -m "voyage-v9 V5 · refonte 14 scènes + textes verbatim + encarts + easter eggs + form 3 chemins + a11y WCAG AA"
git push origin main
```

---

## Interdits absolus

- Ne **jamais** modifier `voyage-v9/assets/hero-1..6.webp` (R1).  
- Ne **jamais** changer les **4** IDs Vimeo : `1184294762` · `1184294810` · `1184294871` · `1184294831`.  
- **Bunny Fonts uniquement** (pas Google Fonts) — **`<link>` dans `<head>`**, pas `@import` dans un bloc CSS (perf).  
- **Vanilla JS** uniquement (pas GSAP / jQuery / Lenis).  
- **Aucun `!`** dans la copy visible.  
- **Aucun « mariage »** dans les **services Micha** ni dans les **use cases** publics (film cadeau : anniversaire, départ, lancement, etc. — **sans** le mot mariage).  
- **Aucune** mention TDAH / bipolaire / neuro **des fondateurs**.  
- **OK** copy **cible** type « cerveaux qui vont vite » / « essentiel » (voir `PATCH-V5-GLOW-UP.md` § neuro).  
- Pas de « solution innovante / révolutionnaire / disruptif / game-changer ».  
- Ne pas toucher `.github/workflows/`.

---

## Design system · composants · stage · motion · a11y · SEO

Reprendre les blocs détaillés dans **PART2** (tokens `:root`, boutons, cards, form 3 chemins, stage 6 layers, IO, Ken Burns, reveal, FAQ, JSON-LD, structure `<html>` finale, checklist 26 items, commande commit).

Alignement **Pinapp existant** : réutiliser les **variables** déjà présentes dans `voyage-v9/index.html` quand elles couvrent le besoin (`--or`, `--ivoire`, etc.) ; compléter sans dupliquer toute la charte si équivalent.

---

## Textes verbatim — partie 1 (s01 → s04b)

> **Mot pour mot** pour les blocs ci-dessous. Mise en forme HTML/CSS harmonieuse OK.

### NAV TOP FIXE

```
[Logo Pinapp]   Diagnostic 24h offert →    Mode sobre    ☰
```

Hamburger ☰ → ouvre drawer « Qui sommes-nous » (4 actes — voir PART2).

---

### s01 · HERO `data-stage="hero-1"`

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

**Encart placeholder** (visible si `body.draft-mode` ou équivalent — voir PART2 note prod) :

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

**Stats** : `24h réponse  ·  0 € diagnostic  ·  30j accompagnement`

**CTA primary** : `Recevoir mon diagnostic gratuit →` (scroll `#form`)  
**CTA ghost** : `Voir le diagnostic ↓` (scroll s03)

---

### s02 · LE DUO `data-stage="hero-1"`

**Eyebrow** : `Qui fait quoi`

**H2** :

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

**Tagline** :

```
« Lauralie architecte. Michaël filme. Ensemble nous livrons. »
```

**CTA text** : `En savoir plus sur nous →` (ouvre drawer 4 actes)

---

### s03 · LE CONSTAT `data-stage="hero-2"`

**Eyebrow** : `Le diagnostic`

**H2** : `Reconnaissez-vous votre semaine ?`

**4 cards douleurs** :

```
01  Site qui dort.       → Personne ne vous trouve.
02  Devis qui s'oublient.→ Vous facturez en retard.
03  Avis Google rares.   → Vous demandez. Personne répond.
04  Charge mentale H24.  → Vous y pensez encore à 23h.
```

**Avant / Après** :

```
AVANT                          APRÈS
3 jours · 12 % closent    →    24 heures · 32 % closent
```

Note source en mute : `(Mesures sur nos propres ops · le diagnostic chiffre les vôtres.)`

**Microcopy cible** :

```
« Pour les cerveaux qui vont vite. Pour ceux qui veulent l'essentiel. »
```

---

### s04 · POURQUOI L'IA `data-stage="hero-2"`

**Eyebrow** : `La méthode`

**H2** : `Pourquoi 50 à 75 % moins cher ? Voici les 4 sources qu'on assume.`

**4 cards sources** (titres + extraits + liens externes `rel="noopener noreferrer"`) :

- McKinsey 2023 — « -50 à -70 % temps production digitale »  
- Stanford AI Index 2025 — « Coûts vidéo générative ÷ 4 entre 2023 et 2025 »  
- OECD AI Observatory 2024 — « +138 % adoption IA dans les PME françaises (YoY) »  
- ADEME 2024 (badge « Vue critique ») — « Coût environnemental de l'IA générative — transparence »

**Lead** :

```
Un site agence : 4 200 à 8 000 €.
Chez nous : à partir de 1 290 €.
Trois sources publiques le confirment.
```

**Note critique** :

```
« L'IA a un coût environnemental. Voici comment on le limite :
hébergement européen, choix d'outils sobres, pas de génération inutile. »
```

---

### s04b · PÉDAGOGIE `data-stage="hero-2"`

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

**4 Q&A** : reprendre exactement le bloc « ❓ C'est quoi… » jusqu'à « Pas de logiciel à apprendre. » du brief auteur (inchangé).

---

## Suite

**`PROMPT-CURSOR-V5-DEPLOY-CE-SOIR-PART2.md`** : s05 → s13, footer, drawer, modale STAY, easter eggs, SEO, structure `<html>`, checklist, commit. **Film cadeau** : use cases **sans** le mot « mariage » (ex. anniversaire, départ, lancement, naissance, jalon professionnel). **Draft** : par défaut **hors** `draft-mode` pour visiteurs prod ; **Ctrl+D** et **Ctrl+Shift+D** basculent `draft-mode` (voir note en tête de PART2).

---

## Instruction Cursor (une fenêtre)

```
Lis voyage-v9/PROMPT-CURSOR-V5-DEPLOY-CE-SOIR.md ET voyage-v9/PROMPT-CURSOR-V5-DEPLOY-CE-SOIR-PART2.md
ainsi que PATCH-V5-FINAL.md et PATCH-V5-GLOW-UP.md.

Refais voyage-v9/index.html monolithique selon les deux PART + patches.
Respecte R1, Vimeo, Bunny link (pas @import), vanilla, interdits, a11y.

Commit + push sur main quand la checklist PART2 est verte.
```

---

*Prompt déployé ce soir · 2026-04-26 · partie 1/2*
