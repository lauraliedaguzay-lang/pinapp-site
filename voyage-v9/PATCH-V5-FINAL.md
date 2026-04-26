# PATCH-V5-FINAL — Refonte voyage-v9 · 14 scènes · langage simple · auto Claude

> Patch monolithique consolidé après 36 itérations de réflexion en réunion 7 experts.  
> 14 scènes (16 sections HTML) · doctrine prix Lauralie fixe / Micha sur devis · 5 réductions éthiques · 5 easter eggs cohérents · workflows W12–W22.  
> **R1 INTOUCHABLE** : 6 photos `hero-1..6.webp` byte-identiques (ne jamais modifier les fichiers).

---

## Sauvegarde Git (état du site avant V5)

Branche de sauvegarde : **`backup/main-pre-v5-2026-04-26`** (pointe sur le même commit que `main` au moment de la sauvegarde, avant application du patch dans le code).

```powershell
cd C:\Users\Lauralie\Projects\pinapp-site

git fetch origin
git checkout main
git pull origin main
git checkout -b backup/main-pre-v5-2026-04-26
git push -u origin backup/main-pre-v5-2026-04-26

git checkout main

# Versionner ce fichier patch sur main (sans appliquer encore le HTML)
git add voyage-v9/PATCH-V5-FINAL.md
git commit -m "docs(voyage-v9): PATCH-V5-FINAL — refonte 14 scènes + langage simple + auto Claude"
git push origin main
```

### Rollback `main` si besoin

```powershell
cd C:\Users\Lauralie\Projects\pinapp-site
git checkout main
git reset --hard backup/main-pre-v5-2026-04-26
git push -f origin main
```

⚠️ Le force-push n’écrase que `main` ; la branche `backup/…` reste disponible.

---

## Structure cible (14 scènes + interstitiels)

| ID HTML | Titre | `data-stage` | Eyebrow |
|---------|--------|--------------|---------|
| s01 | HERO | 01 | Pinapp Inc · Bordeaux |
| s02 | LE DUO | 01 | Qui fait quoi |
| s03 | LE CONSTAT | 02 | Le diagnostic |
| s04 | POURQUOI L'IA | 02 | La méthode |
| s04b | L'IA POUR MA BOÎTE | 02 | Comprendre |
| s05 | PACK DUO | 03 | L'offre signature |
| s06 | LAURALIE · VUE | 03 | Studio Lauralie · Prix fixes |
| s06b | LAURALIE · LE SYSTÈME | 03 | Ce qu'il y a derrière |
| s07 | MICHA · CINÉMA IA | 04 | Studio Micha · Cinéma |
| s08 | CLIP IA (CLIMAX) | 04 | Studio Micha · Clip 100 % IA |
| s09 | MICHA · ÉVÉNEMENT + DA | 04 | Nouvelle-Aquitaine |
| s09b | MICRO-PAUSE | 05 | (transition) |
| s10 | LE TRAVAIL INVISIBLE | 05 | Ce qu'il y a derrière |
| s11 | FORMATIONS | 05 | Apprendre à piloter |
| s12 | MÉTHODE + TARIFS RÉCAP | 06 | Comment on travaille |
| s13 | ENGAGEMENTS + FORM | 06 | Pour démarrer |

---

## Table de migration des ancres (ancien → nouveau)

| Ancien | Nouveau | Notes |
|--------|---------|--------|
| #s01 | #s01 | Hero |
| #s02 | #s03 | Constat (fusion s02 + s02b + s02c) |
| #s02b | #s04 | Pourquoi IA |
| #s02c | #s03 | Fusionné |
| #s03 | #s06 | Lauralie services |
| #s03b | #s06b | Lauralie système |
| #s04 | #s05 | Pack Duo |
| #s05 | #s06 | Fusion Lauralie |
| #s05a | #s06 | Fusionné |
| #s05c | #s07 | Micha cinéma |
| #s05d | #s07 | Fusionné |
| #s05e | #s11 | Formations |
| #s05f | #s09 | Événementiel |
| #s06 | #s12 | Méthode + tarifs |
| #s06bis | #s11 | Formations |
| #s07 | #s02 | Duo |
| #s07b | — | M&P → easter egg STAY uniquement |
| #s08 | #s13 | Engagements + form |
| #s08b | #s13 | Fusion |
| #s09 | #s13 | Fusion |
| #s10bis | — | Remplacé par s10 |
| #s11 | #s07 | Climax SW → grille Micha (selon spec) |
| #s13 | #s12 | Tarifs |
| #s13b | #s12 | FAQ fusion |
| #s14 | #s13 | Form |

→ **Chercher tous les `href="#s…"`** et remplacer selon cette table.  
→ **`scene-counter.js` / `film-chromatic.js`** : nouvelle liste d’alias (16 sections logiques, pas 22).

---

## Contraintes non négociables

- **R1** · 6 photos `hero-1..6.webp` byte-identiques (ne pas toucher aux fichiers).  
- **R2** · Stage fixe + logique scroll / `IntersectionObserver` : ne modifier que `data-stage` des sections si le patch le prévoit explicitement.  
- **R3** · Vanilla JS, Bunny Fonts, pas GSAP / Lenis / Google Fonts.  
- **R5** · `rel="noopener noreferrer"` sur tous les liens externes.  
- **R6** · `prefers-reduced-motion` respecté.

Interdit côté visiteur (copy) :

- Point d’exclamation `!` (ton sobre).  
- « solution innovante », « révolutionnaire », « disruptif », « game-changer ».  
- « résultat garanti », promesses non tenables.  
- « satisfait ou remboursé » → remplacer par **accompagnement 30 jours**.  
- Jargon agence : synergies, transformation digitale, écosystème.  
- **Jargon tech visible** : noms d’outils éditeurs, « agents », « prompts », etc. (voir glossaire).  
- Mention **TDAH / bipolaire** publique des fondateurs.

Pronoms : Lauralie (elle), Michaël / Micha (il), « nous » = duo.

Bio Micha : **10 ans dans l’événementiel** (ne pas centrer « mariages ») ; **pas de mariages** dans les services proposés.

Doctrine prix : Lauralie **prix fixes** ; Micha **à partir de** + devis.

---

## Easter eggs à préserver

- `voyage-v9/assets/js/easter-eggs.js` (Konami, etc.)  
- `voyage-v9/assets/js/scene-counter.js` (mettre à jour les alias)  
- `voyage-v9/assets/js/film-chromatic.js` (cinéma s07 / s08 selon spec)  
- CSS `.morse-stay` · bouton mode sobre  
- **STAY → M&P** : clic sur `.morse-stay` ouvre modale `#stay-modal` avec lien `memoireetpresence.fr` ; **seul** accès M&P hors microcopie footer si prévu.

---

## Glossaire jargon → grand public

| Éviter (visible) | Préférer |
|------------------|----------|
| n8n, workflow, pipeline | outils qui tournent seuls |
| noms d’assistants / éditeurs | intelligence · assistant |
| IDE, éditeur de code | (ne pas afficher) |
| prompt, modèle | (ne pas afficher) |
| agent, chatbot | assistant |
| stack technique | les outils qu’on utilise |
| API, webhook | connexion · alerte automatique |
| RGPD-friendly | vos données restent chez nous |
| WCAA / WCAG | lisible par tout le monde |
| SaaS, cloud | service en ligne |
| ROI, KPI | chiffres clés · ce que vous gagnez |

---

## Blocs HTML complets (implémentation)

Les **sections HTML complètes** (s01 → s13), modale STAY, et snippets JS associés sont ceux du **brief auteur** (même version que le message Cursor / Lauralie du 2026-04-26).  
L’agent qui applique le patch doit les **reprendre verbatim** depuis ce brief (titres, prix, grilles Vimeo, tableau tarifs, formulaire 3 chemins, tapestry-whisper, etc.) pour éviter toute dérive.

Points d’attention lors du portage :

- **Pack Duo Essentiel** : **1 890 € HT** avec économie chiffrée vs achat séparé.  
- **Resident Evil** : tarif **dès 1 890 € HT** (aligner overlays / tableaux).  
- **s08** : clip 100 % IA + encart placeholder « Lauralie chante » + citation type tapestry (spec auteur).  
- **s09** : séminaire + anniversaire + DA **sans** mariages.  
- **s10** : slider 16 vs 4 étapes + compteurs.  
- **s11** : 4 niveaux formations (39 / 67 / 147 / 397 € selon spec).  
- **s12** : méthode 4 étapes + tableau funnel + **-40 %** solidaire (vérif SIRENE) + **3 projets / mois**.  
- **s13** : 7 engagements + **form 3 chemins** (`path` tech / image / duo) + microcopy « automation invisible ».

---

## `scene-counter.js` — liste cible (exemple)

```js
// Exemple de structure attendue (adapter aux alias internes du fichier existant)
const SCENES = [
  { id: 's01', label: 'Hero' },
  { id: 's02', label: 'Le duo' },
  { id: 's03', label: 'Le constat' },
  { id: 's04', label: 'Pourquoi IA' },
  { id: 's04b', label: 'Pédagogie IA' },
  { id: 's05', label: 'Pack Duo' },
  { id: 's06', label: 'Lauralie · Vue' },
  { id: 's06b', label: 'Lauralie · Système' },
  { id: 's07', label: 'Micha · Cinéma' },
  { id: 's08', label: 'Climax · Clip IA' },
  { id: 's09', label: 'Micha · Événement' },
  { id: 's09b', label: 'Pause' },
  { id: 's10', label: 'Travail invisible' },
  { id: 's11', label: 'Formations' },
  { id: 's12', label: 'Méthode + Tarifs' },
  { id: 's13', label: 'Form' }
];
```

Compteur cible : **`NN / 16`** (ou équivalent selon convention du fichier).

---

## Workflows automation Claude (W12–W22) — à ajouter dans `docs/SCHEMA-WORKFLOWS-N8N.md`

| # | Nom | Déclencheur | Résultat |
|---|-----|--------------|----------|
| W12 | Daily Brief | Cron 8h30 + 18h00 | Telegram « 3 actions max » |
| W13 | API SIRENE -40 % | Case solidaire formulaire | Remise auto sur devis |
| W14 | Lead Drafter | Nouveau formulaire | Brouillon mail + validation Telegram |
| W15 | Devis Generator | Telegram /devis | PDF signature électronique |
| W16 | Project Brief | Devis signé | Brief production Notion |
| W17 | Weekly Strategy | Cron lundi 8h | Telegram priorités |
| W18 | Email Triage | Boîte mail | Classement + brouillons |
| W19 | Content Engine | Cron mar / ven | Brouillons réseaux |
| W20 | Admin Helper | Échéance | Brouillons admin |
| W21 | Project Tracker | Cron quotidien | Alertes retard |
| W22 | Cross-sell Detector | Cron mensuel | Suggestions upgrade |

Sprint 1 prod recommandé : **W1 + W12 + W14**.

---

## Ordre des 6 commits (séquentiel)

1. **Squelette HTML** : renumérotation, `data-stage`, tous les `href`, `scene-counter.js` / `film-chromatic.js`.  
2. **Textes Lauralie** s01–s06b (hero, duo, constat, IA, pédagogie, packs, démos, rosace).  
3. **Textes Micha** s07–s09 (mosaic Vimeo, climax déplacé selon spec, événementiel).  
4. **s09b + s10 + s11** (pause, travail invisible, formations).  
5. **s12 + s13** (méthode, tarifs, form 3 chemins, solidaire, capacité).  
6. **Easter egg STAY + audit glossaire** (modale M&P, footer, zéro jargon visible).

Commit final suggéré après rebase éventuel :

`feat(voyage-v9): refonte V5 — 14 scènes langage simple + 5 réductions éthiques + easter egg STAY M&P + auto Claude W12-W22`

---

## Validation bash (post-patch)

```bash
cd /path/to/pinapp-site
git fetch origin
FILE=voyage-v9/index.html
BR=cursor/voyage-v9-refonte-v5-0309

echo "=== Sections id=s… (ajuster regex si besoin) ==="
git show "origin/$BR:$FILE" | grep -cE 'id="s[0-9]+[a-z]?"'

echo "=== Hero webp (hashes vs main) ==="
for i in 1 2 3 4 5 6; do
  a=$(git ls-tree origin/main -- "voyage-v9/assets/hero-$i.webp" | awk '{print $3}')
  b=$(git ls-tree "origin/$BR" -- "voyage-v9/assets/hero-$i.webp" | awk '{print $3}')
  [ "$a" = "$b" ] && echo "  hero-$i OK" || echo "  hero-$i DIFF"
done

echo "=== Mariages (doit être 0) ==="
git show "origin/$BR:$FILE" | grep -ci mariage || true

echo "=== Pack 1 890 € ==="
git show "origin/$BR:$FILE" | grep -c "1 890"

echo "=== stay-modal / mémoire ==="
git show "origin/$BR:$FILE" | grep -cE "stay-modal|memoireetpresence"

echo "=== Jargon visible (copy) — revue manuelle recommandée ==="
git show "origin/$BR:$FILE" | grep -niE "n8n|cursor|claude|workflow|prompt|agent ia" || true
```

---

## Prompt Cursor (clé en main)

```
Lis voyage-v9/PATCH-V5-FINAL.md attentivement.

Crée la branche `cursor/voyage-v9-refonte-v5-0309` depuis main.

Applique les 6 commits dans l'ordre exact :
1. Squelette HTML : renumérotation 22→16 sections, mapping data-stage selon table, mise à jour de TOUS les href="#sXX" via table de migration, mise à jour scene-counter.js avec la nouvelle liste de 16 scènes.
2. Textes Lauralie s01-s06b : copies exactes du patch, mode TDAH, glossaire jargon→simple appliqué, Pack Duo Essentiel à 1 890 € avec économies chiffrées.
3. Textes Micha s07-s09 : 4 vidéos Vimeo en grille mosaic, microcopy SW 3min "exemple Pack Signature", Resident Evil 1 890 €, climax s08 avec tapestry-whisper Spider-Man "Un grand pouvoir n'implique pas une grande responsabilité. Pas chez les autres. Chez nous, si.", événementiel SANS mariages (séminaire + anniversaire + DA seulement).
4. s09b micro-pause + s10 travail invisible (slider 16 vs 4 étapes) + s11 formations 4 niveaux vulgarisés.
5. s12 méthode 4 étapes + tableau funnel complet avec colonne avant/après IA, pricing solidaire -40 % auto via SIRENE, capacité réelle 3 projets/mois affichée, s13 engagements 7 piliers + form 3 chemins conditionnels (path tech / image / duo) avec automation invisible microcopy.
6. Easter egg STAY → M&P (click sur .morse-stay ouvre modale avec lien memoireetpresence.fr), audit complet du fichier pour remplacer le jargon visible (n8n, Cursor, Claude, prompts, agents) par le langage grand public selon le glossaire du patch.

CONTRAINTES IMMUABLES :
- R1 : photos hero-1..6.webp byte-identiques (ne pas toucher les fichiers)
- R2 : stage fixe + IntersectionObserver inchangés (ne toucher que data-stage des sections)
- R3 : vanilla JS uniquement, Bunny Fonts, pas de GSAP/Lenis/Google Fonts
- R5 : rel="noopener noreferrer" sur tous liens externes
- R6 : prefers-reduced-motion respecté
- Pronoms : Lauralie (elle) · Michaël/Micha (il) · "nous" duo
- Bio Micha : "10 ans dans l'événementiel" (pas "mariages")
- Doctrine prix : Lauralie fixe affiché / Micha "à partir de" sur devis
- Pas de "!", pas de "solution innovante", pas de "résultat garanti", pas de "satisfait ou remboursé"
- Pas de mention TDAH/bipolaire des fondateurs
- Easter eggs préservés : morse-stay, scene-counter, easter-eggs.js (Konami), film-chromatic.js
- M&P : seul accès = easter egg STAY au click sur morse + microcopie footer

Push sur cursor/voyage-v9-refonte-v5-0309. Ouvre PR brouillon vers main.

Mettre à jour aussi docs/SCHEMA-WORKFLOWS-N8N.md avec la section "Workflows automation Claude" (W12-W22) selon le patch.

Commit final : "feat(voyage-v9): refonte V5 — 14 scènes langage simple + 5 réductions éthiques + easter egg STAY M&P + auto Claude W12-W22"
```

---

## Effort indicatif

- Cursor : plusieurs heures (6 commits).  
- Revue : ancres, mobile, formulaire, R1 hero.

---

*Patch V5 final · 2026-04-26 · 14 scènes · langage simple · auto Claude W12–W22 · easter egg M&P*
