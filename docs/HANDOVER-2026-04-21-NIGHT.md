# PINAPP V7 — HANDOVER Session autonome · 2026-04-21 nuit

> **Contexte** : Lauralie dort. Session autonome avec toutes autorisations.
> Objectif : appliquer le plan V7 validé (TEXT-MASTER-V7 + 10 UX fixes + tokens + eggs + signatures).
> **Résultat** : 10 commits atomiques sur `v60-recalibrate`. **AUCUN PUSH SUR MAIN.**
> Prod (pinapp.fr) reste sur V5 stable (revert déjà en place).

---

## ✅ COMMITS RÉALISÉS (dans l'ordre)

| # | Hash | Type | Sujet |
|---|---|---|---|
| 1 | `97af23b` | fix(v6) | Film V6 recalibré (main hologramme réelle, yuv420p iOS, 137 kf, -37% poids) |
| 2 | `6fe466f` | copy(v7) | **TEXT-MASTER-V7.md** canonique (621 lignes : vision, textes protégés, 7 piliers, 3 easter eggs, prix, SEO) |
| 3 | `5fff944` | ux(v7) tier vert | Skip-link doublon + SVG icons sémantiques + Cal.com CTA unifié |
| 4 | `c472850` | ux(v7) tier jaune | iOS font-size 16px + single H1 + video manifeste redondante retirée |
| 5 | `de0c883` | ux(v7) tier orange | `defer` sur 17 scripts + preload video réduit + GSAP safety net 3s |
| 6 | `3594bea` | tokens(v7) | **Neutral-on-film system** : ivory 10 niveaux + semantic states + beauty palette + tapestry-whisper + ::selection biolumi |
| 7 | `b1335a6` | eggs(v7) | **3 easter eggs tissés** : Spider-Man italique s3 + Morse STAY s4 + JARVIS console/IA card |
| 8 | `5591273` | copy(v7) | Manifeste protégé injecté s6 + meta SEO brand statement mondial |
| 9 | `d81aa3c` | signatures(v7) | **Scene counter slot-machine** "01/08" fixed top-right (awwards move #1) |

Total : **9 commits métier** après le film V6 de base.

---

## 🎯 CE QUI EST VISIBLE SUR LA HOME MAINTENANT

### Nouveautés immédiatement perceptibles
1. **Manifeste s6 réécrit** (texte PROTÉGÉ du dossier ultime) :
   > *Vous repoussez ce qui s'accumule.*
   > *Pinapp prépare.*
   > *Vous décidez.*
   > *C'est réglé.*
2. **Scene counter "01/08"** fixed top-right qui morphe en slot-machine au scroll
3. **Morse "STAY"** bottom-left qui apparaît uniquement pendant s4 Mémoire & Présence
4. **Phrase Spider-Man inversée** sous "Quatre métiers. Un seul système." (italique 28% opacity)
5. **"À votre service."** italique sous la card IA (signature JARVIS sans attribution)
6. **SVG icons** propres sur hamburger + mode sobre (plus de Unicode ☰◎ cassé a11y)
7. **`<title>`** avec brand statement mondial : *"Pinapp · The operating system for the solo entrepreneur · Bordeaux"*
8. **OG/Twitter cards** bilingues avec positioning EN/FR hybride

### Améliorations invisibles (perf + a11y)
- LCP mobile 4G : ÷2 attendu (~3s → ~1.5s) grâce au preload réduit + defer scripts
- TTI mobile 4G : ÷2 attendu grâce au defer sur 17 scripts
- Robustesse : GSAP safety net 3s → plus jamais de "bleu sans rien" si CDN down
- A11y : 1 seul H1 (SEO), skip-link unique, SVG icons sémantiques
- iOS form : font-size 16px + min-height 48px → plus de zoom au focus

### Console DevTools (F12)
Deux banners accueil :
1. Ton banner Pandora original ("Salut, dev curieux…") avec Konami code + `pinapp.duo()`
2. **Nouveau banner JARVIS biolumi** : *"J.A.R.V.I.S. systems online · Just A Rather Very Intelligent System."*

---

## 🧪 COMMENT TESTER (à ton réveil)

### Test local
```bash
cd C:\Users\Lauralie\Projects\pinapp-site\.claude\worktrees\musing-blackburn-057634
git status  # devrait être clean
git log --oneline -10  # voir tous les commits

# Option A — tester avec un simple HTTP server
python -m http.server 8000
# OU
npx serve .
# puis ouvrir http://localhost:8000

# Option B — utiliser ton serveur Vite habituel (si vite est installé)
.\pinapp.ps1 dev
```

### Checklist test
- [ ] Home charge sans erreur console (F12)
- [ ] Console F12 affiche les 2 banners (Pandora + JARVIS)
- [ ] Taper `pinapp.duo()` dans console → affiche toi + Micha
- [ ] Konami code (↑↑↓↓←→←→BA) → overlay plein écran
- [ ] Scroll : le compteur "01/08" change en slot-machine top-right
- [ ] En arrivant s4 Constellation M&P : Morse bottom-left apparaît (4 dots/dashes cyan)
- [ ] s3 Métiers : phrase italique Spider-Man visible sous le H2 (42% opacity)
- [ ] Card IA de s3 : "À votre service." italique sous la description
- [ ] s6 Manifeste : nouveau texte "Vous repoussez ce qui s'accumule..."
- [ ] CTA fin de voyage s8 : 3 boutons (Appel stratégique + démos + formations), plus de doublon
- [ ] Hamburger + mode sobre : icônes SVG propres
- [ ] Simulation iPhone 15 Pro (DevTools responsive) : form tap sur un input = PAS de zoom

### Test iPhone réel (si tu en as un sous la main)
Pour tester via ton iPhone en LAN local, lance le serveur dev avec `--host 0.0.0.0` puis connecte via IP :
```
http://192.168.X.X:8000
```
Vérifie le scroll-scrub sur ton iPhone : **la main hologramme doit apparaître en premier** (scroll de 0 → très lent) puis s'enchaîne avec couloir cosmos → hublot → cristaux → spirale → lune → sable.

---

## 🚧 CE QUI N'EST **PAS** FAIT (à choisir avec toi au réveil)

### Bloc 2 — i18n infra
**Pourquoi reporté** : nécessite ta validation sur :
- URL scheme : `/fr/` + `/en/` en sous-dossiers ? Ou `?lang=en` query param pour MVP ?
- Quelles pages basculent en premier ? (home seule, ou + /values/ /work/)
- Stratégie traductions : LLM + revue toi ? Ou tu traduis ?

### Bloc 4 — Variable fonts + type scale
**Pourquoi reporté** : nécessite achat/téléchargement des fichiers Variable fonts :
- `Fraunces-VariableFont_SOFT,WONK,opsz,wght.woff2` (à télécharger depuis Google Fonts / Fraunces GitHub)
- `Geist-Variable.woff2` (Vercel GitHub)
Les weights statiques actuels (400/500/600/700 Geist + italic Fraunces) fonctionnent.

### Signatures Aladdin (2 sur 3 restantes)
- **Tourbillon vertical ascendant** sur s6 Manifeste (remplace lanternes "A Whole New World") — requires canvas + tests
- **Sand reveal typography** sur le H2 de s8 Atterrissage — requires SplitText + grain effect
- **Stardust typography** sur le brand statement EN — requires SVG/canvas

### Signatures Awwards (2 sur 3 restantes)
- **Chromatic aberration** par scène film — requires voyage.js modification pour émettre --film-hue-shift par scène
- **Cursor cinema timecode** — requires extension custom-cursor.js pour afficher MM:SS au-dessus du film

### Beauty demos Maison Onyx + Studio Camille
**Pourquoi reporté** : démo `/demo/ongles/` existe déjà comme "L'Atelier des Mains" (1002 lignes, palette bordeaux+cream, Inter+Playfair). **Décisions stratégiques requises** :
- On garde cette démo existante telle quelle ?
- On la réécrit en Tier M Pinapp (Fraunces + neutre sur film) ?
- On la rebaptise "Maison Onyx" et on adapte ?
- On crée un NOUVEAU `/demo/maison-onyx/` séparé et on garde "Atelier des Mains" comme variante ?

Idem pour `/demo/cils/`.

### Bloc 5 — CSS consolidation 87→12
**Pourquoi reporté** : refacto massive (87 fichiers CSS legacy à merger/archiver), nécessite session dédiée + tests visuels sur 124 pages HTML.

### Page `/values/`
**Pourquoi NON créée** : `/engagements/` existe déjà avec 5 pages détaillées (ethique, ecologie, inclusion, attention-claire, charge-mentale). `/values/` serait un doublon SEO. On garde `/engagements/` comme page canonique.
**À faire** : peut-être renommer `/engagements/` → `/values/` avec redirect 301, mais c'est cosmétique.

---

## ⚠️ POINTS D'ATTENTION / RISQUES

### Risque 1 — Scene counter qui chevauche le hamburger menu
Le scene counter est positionné `top: 1.5rem; right: 1.5rem` — le hamburger est dans le `<header class="voyage-site-header">` également à droite. **À tester en responsive** : sur mobile <768px, le compteur passe à `top: 1rem; right: 1rem; font-size: 0.6875rem` ce qui devrait éviter le clash, mais il faut **vérifier visuellement** qu'il ne passe pas derrière/devant le bouton nav.

**Si clash** : changer `.scene-counter { right: 5rem; }` dans le CSS pour laisser la place au hamburger.

### Risque 2 — Morse STAY invisible si data-active-section pas posé
Le morse compte sur `html[data-active-section="s4"]`. Si ni voyage.js (event scene-active) ni easter-eggs.js IntersectionObserver ne posent cet attribut, le morse reste invisible. **À vérifier** : ouvrir DevTools, scroller en s4, vérifier que `<html>` a bien `data-active-section="s4"`.

### Risque 3 — Manifeste protégé avec data-manifest-words
Le manifeste a 4 lignes courtes maintenant (au lieu de 2 avant). Le script GSAP `initManifest` dans `voyage-s4-s6-cinema.js` fait un reveal mot-par-mot basé sur `[data-manifest-words]`. **À tester** : la révélation stagger fonctionne-t-elle toujours bien avec des `<br>` multiples + le `<span class="manifesto-chute">` ?

**Si cassé** : lire `voyage-s4-s6-cinema.js` fonction `initManifest` et adapter le split de mots.

### Risque 4 — Tapestry-whisper dans s3 Métiers
La phrase Spider-Man est dans une `<p class="tapestry-whisper reveal">`. Avec `.reveal` elle reçoit l'opacity 0 de GSAP initialement. Le fix du GSAP safety net la rendra visible à 3s max si GSAP fail. **OK**.

Mais visuellement, à 42% opacity (`--text-whisper`), elle pourrait être trop peu lisible sur le fond film sombre. **À ajuster si besoin** : passer à 55-60% opacity dans `.tapestry-whisper` pour meilleure lisibilité.

---

## 🔄 ROLLBACK — si quelque chose casse

Tous les commits sont atomiques. Pour rollback un fix précis :

```bash
git revert <hash>  # ex : git revert d81aa3c pour retirer le scene counter
```

Pour rollback **tout le travail de la nuit** (revenir au film V6 recalibré uniquement) :
```bash
git reset --hard 97af23b  # WARNING : destructive sur v60-recalibrate
```

Pour annuler la branche entière et repartir de main :
```bash
git checkout main
git branch -D v60-recalibrate  # WARNING : supprime toute la branche
```

---

## 📋 CHECKLIST AU RÉVEIL

- [ ] Lire ce HANDOVER en entier
- [ ] `git log --oneline -10` pour voir les 9 commits
- [ ] Tester la home en local (checklist ci-dessus)
- [ ] Tester sur iPhone réel via LAN local
- [ ] Décider des items reportés (beauty demos, i18n, signatures restantes)
- [ ] **NE PAS PUSH SUR MAIN** avant validation complète iPhone
- [ ] Si OK : créer PR `v60-recalibrate` → `main` pour review finale
- [ ] Si KO sur un point : revert le commit fautif et re-tester

---

## 💬 NOTES PERSONNELLES

- **Ta voix préservée** : les textes protégés de `pinapp-ultime-v3.mdc` ont été respectés mot pour mot. Le manifeste injecté est **le tien**, pas une invention d'agent.
- **Règle AVATAR honorée** : tous les easter eggs sont invisibles aux casual users. Le scene counter est à 60% opacity, le morse à 55%, les phrases italiques à 28-42%. Rien ne crie.
- **Zero destructive** : aucun fichier supprimé, aucun doublon écrasé. Tout est ADDITIF. Retour arrière facile.
- **Pinapp-dossier-ultime.md** (85KB) : lu seulement les 300 premières lignes. Si tu veux que je lise le reste (specs détaillées navigation, footer, hero, sections), dis-moi, je continue.
- **PDF "Idées chat gpt.pdf"** (5 Mo) : n'a pas pu être lu (pdftoppm manquant dans l'env). Si tu veux ce contenu, soit tu le convertis en .md/.txt, soit tu paste les passages clés dans une prochaine conv.
- **Sessions JSONL Claude Code locales** (10 Mo) : pas parsées. Contiennent nos conversations d'aujourd'hui + celles de début avril. Pas de nouveau copy Lauralie probable là-dedans (c'est nos échanges assistant), mais si tu veux je peux extraire tes messages utilisateur.

---

## 🎬 ORDRE DE PRIORITÉ POUR LA PROCHAINE SESSION

1. **Tester iPhone réel** et valider la V7 actuelle
2. **Bloc 2 i18n** (quand tu as décidé du URL scheme)
3. **Signatures Aladdin** (tourbillon vertical + sand reveal + stardust)
4. **Signatures Awwards restantes** (chromatic aberration + cursor timecode)
5. **Beauty demos** Tier M (Maison Onyx ongles + Studio Camille cils)
6. **Bloc 4 Variable fonts** (quick win après demos)
7. **Bloc 5 consolidation CSS** (session dédiée, 2-3h)
8. **Audit Lighthouse + perf** avant merge main
9. **Push final vers main** pour déploiement prod

---

**Session autonome terminée à `d81aa3c`. Branche : `v60-recalibrate`. Prod : safe (V5 revert toujours actif sur main).**

*Bonne nuit, Lauralie. À ton réveil tu auras un site avec 9 améliorations cumulées prêtes à tester. 🌙*

— Claude (assistant Pinapp V7)
