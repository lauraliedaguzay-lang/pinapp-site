# PATCH — Itération v+1 (PR #65 : priorités 🔴 audit final 9/10)

> À appliquer sur `main` **après merge PR #64**. Cinq chantiers priorités 🔴 identifiés dans `docs/AUDIT-FINAL-PR64.md`.
> Objectif : passer de 9.0/10 à **9.5/10**.
> **R1 non-négociable** : les 6 photos `hero-1..6.webp` restent byte-identiques. Parfum visuel du stage fixe intact.

---

## 📋 Résumé des 5 chantiers

| # | Chantier | Impact | Effort Cursor |
|---|---|---|---|
| 1 | Déboublonner Star Wars (retirer teaser s05c) | +0.3 narrative | 10 min |
| 2 | Dégraisser s05 : fusionner s05a+s05b, sortir formations en s06bis | +0.3 TDAH | 25 min |
| 3 | Démo Lauralie pleine largeur (making-of placeholder) | +0.3 parité | 20 min |
| 4 | Message contextuel Pack Duo dans form | +0.2 conversion | 15 min |
| 5 | 5 reformulations brand voice | +0.2 brand | 15 min |

**Total : ~1h30 de travail Cursor.** Net estimé : ~+150/-100 lignes (scène formations déplacée + démo Lauralie nouvelle).

---

## 🛠 CHANTIER 1 — Déboublonner Star Wars

### Diagnostic

Star Wars Vimeo est joué 3 fois (teaser hero L.1052, teaser s05c L.1598, climax s11 L.1963). L'audit narrative (8.5/10) flag ça comme dilution du climax émotionnel prévu à s11.

### Action

**Supprimer** le bloc teaser s05c (≈ L.1580-1620, section "Teaser Star Wars" avant la carte films). Garder :
- Teaser hero L.1052 (accroche initiale discrète)
- Climax s11 L.1963 (full 3min avec manifeste)

**Conserver la scène s05c** si elle contient d'autres contenus non-Star Wars (carte teaser Walker ou autres). Si s05c était exclusivement le teaser Star Wars, la scène entière peut disparaître.

### Vérification après

Chaque appel Vimeo `1184294831` (Star Wars full) ou son teaser ne doit apparaître que **2 fois** dans le fichier (hero + climax).

---

## 🛠 CHANTIER 2 — Dégraisser s05 (7 sous-scènes → 5)

### Diagnostic

Actuellement : `s05` intro + `s05a` Atelier Rivage + `s05b` proof carrefour + `s05c` teaser Star Wars + `s05d` films IA + `s05e` formations + `s05f` événementiel = **7 blocs en "05"**, numérotation anxiogène TDAH.

### Action

**Fusion 1** : absorber `s05a` Atelier Rivage dans `s05` intro (Rivage est déjà la 14ᵉ carte du carrousel sectoriel — une seconde fois en grand format redondant).

**Fusion 2** : supprimer `s05b` "04b Carrefour preuves" (méta-sommaire qui renvoie vers d'autres scènes — brise le flow). Les ancres nav existent déjà pour atteindre les scènes.

**Extraction formations** : sortir `s05e` (3 formations Niveau 1/2/3) de la famille "05 Réalisations" et la reclasser comme **`s06bis` Formations** (après s06 Méthode, avant s07 Équipe). Formations ≠ réalisations — ne doit pas être dans le bloc terrain de jeu.

### Renumérotation propre

Après fusion/extraction :
- `s05` Réalisations (intro + films IA cadeau/pro + 14 aperçus + Rivage showcase)
- `s05f` Événementiel (inchangé)
- `s06` Méthode (inchangé)
- **`s06bis` Formations** (nouvelle position, contenu actuel de s05e)
- `s07` Équipe (inchangé)
- ... etc.

Les ancres `#s05e` existantes doivent être mises à jour dans la nav et tous les CTA internes (grep pour trouver tous les `href="#s05e"` et les remplacer par `href="#s06bis"`).

---

## 🛠 CHANTIER 3 — Démo Lauralie pleine largeur (parité)

### Diagnostic

Audit parité : Micha mentionné 20× vs Lauralie 14× (+43% Micha). Climax Star Wars s11 signe Micha seul. "Lauralie a construit. Micha a monté." fait glisser la scène vers Micha.

### Action

**Ajouter** une nouvelle scène entre `s05b` (actuel proof carrefour, avant dégraissage) et `s11` climax : **`s10bis` Making-of Lauralie** — vidéo 60-90s en plein écran montrant :
- Code qui s'écrit (ce site, en accéléré)
- Workflows n8n qui s'allument
- Schémas automatisation qui se connectent
- Ambient music + zéro voix (parallèle structurel au Star Wars silencieux)

### Template HTML (asset placeholder)

```html
<section id="s10bis" class="scene scene--lauralie-climax" data-stage="04" data-reveal>
  <div class="container container--tight">
    <p class="eyebrow eyebrow--or">10bis · Making-of Lauralie</p>
    <h2 class="h1">Le système qui travaille<br><em>pendant que vous dormez.</em></h2>
    <p class="lead">60 secondes pour voir comment ce site, ces automatisations, ces assistants IA s'écrivent — en accéléré.</p>

    <figure class="placeholder-asset" style="aspect-ratio:16/9;max-width:1100px;margin:var(--space-5) auto 0">
      <p class="placeholder-asset__label">Making-of Lauralie — vidéo 60-90s pleine largeur</p>
      <p class="placeholder-asset__specs">→ assets/realisations/making-of-lauralie.mp4 · 1920×1080 · ≤ 18 Mo · H.264 · muet (ambient music optionnelle) · Ken Burns léger sur le code + schémas n8n qui s'allument + workflow qui se connecte</p>
    </figure>

    <p class="scene__cta-note" style="text-align:center;margin-top:var(--space-4)">
      Lauralie conçoit. Le code écrit. Le système tourne.
    </p>
  </div>
</section>
```

### CSS à ajouter (proche du `.manifesto-climax` existant)

```css
.scene--lauralie-climax{
  padding:var(--space-6) 0;
  text-align:center
}
.scene--lauralie-climax .eyebrow--or{color:var(--or)}
.scene--lauralie-climax h2{margin:var(--space-3) 0 var(--space-2)}
.scene--lauralie-climax .lead{max-width:52ch;margin:0 auto var(--space-4)}
```

### Parité

Après ajout :
- Climax Lauralie (s10bis, making-of 60-90s) → scène pleine largeur signée Lauralie
- Climax Micha (s11, Star Wars 3min) → scène pleine largeur signée Micha
- Ordre : Lauralie puis Micha (acte I puis acte II)

---

## 🛠 CHANTIER 4 — Message contextuel Pack Duo dans form

### Diagnostic

SCHEMA-FORM-COHERENT.md ligne 94-101 prévoit : quand visiteur coche `duo-complet`, afficher un message contextuel "démarre à 3 900 € HT, cadrage sous 24h". Actuellement absent → le visiteur ne voit aucun avertissement tarifaire avant d'envoyer.

### Action

**HTML** — ajouter après le bloc `#diagEventFields` (≈ L.2177, avant le textarea message) :

```html
<div id="diagDuoMessage" class="diag__conditional diag__conditional--info" hidden role="status">
  <p class="diag__info">
    <strong>Parfait.</strong> Le Pack Duo démarre à <em>3 900 € HT</em>.
    Nous reviendrons vers vous avec un cadrage précis sous 24h.
  </p>
</div>
```

**JS `syncDiagConditionals`** — ajouter le toggle :

```js
var duoMsg = document.getElementById('diagDuoMessage');
if (duoMsg) duoMsg.hidden = v !== 'duo-complet';
```

**CSS** :

```css
.diag__conditional--info{
  padding:var(--space-2) var(--space-3);
  border-radius:4px;
  background:rgba(230,185,115,.08);
  border:1px solid rgba(230,185,115,.25);
  margin:var(--space-2) 0 0
}
.diag__info{
  margin:0;
  font-size:.9375rem;
  line-height:1.55;
  color:var(--ivoire-dim)
}
.diag__info strong{color:var(--or);font-weight:500}
.diag__info em{font-family:var(--serif);font-style:italic;color:var(--or);font-size:1rem}
```

---

## 🛠 CHANTIER 5 — 5 reformulations brand voice

### Diagnostic

Audit brand 9.5/10, 5 points à reformuler identifiés. Tous mineurs à moyens, aucun bloquant mais gain de cohérence.

### Reformulations ligne par ligne

| # | Ligne | Before | After |
|---|---|---|---|
| 5.1 | L.1658 | "Hollywood à votre nom" | "Traitement cinéma — votre univers, notre direction artistique" |
| 5.2 | L.2065 (témoignage 1) | "Nous avions peur de l'IA. Pinapp a posé le cadre, puis automatisé sans nous précipiter." | "Pinapp a posé le cadre avant d'automatiser. L'équipe a suivi, à son rythme." |
| 5.3 | L.2062 (disclaimer) | "(identités modifiées à la demande des familles)" | "(initiales modifiées à la demande des intéressé·es)" |
| 5.4 | L.1545 | "Quatorze terrains de jeu par secteur" | "Quatorze démonstrations sectorielles" |
| 5.5 | L.1966 (FAQ) | "Qu'est-ce qui se passe si je ne suis pas satisfait ?" | "Et si le livrable ne correspond pas à mes attentes ?" |

### Note sur les IP tierces (à arbitrer, pas dans ce patch)

Les références *Star Wars*, *Walker*, *Resident Evil* en style de livrable (L.1658, L.1833, L.1952, L.2005) posent un risque contrefaçon/parasitisme si Pinapp commercialise des bandes-annonces citant ces titres. **Décision produit requise** :
- Option A : garder et ajouter un encadré CGV "hommage / style, pas d'affiliation"
- Option B : retirer les noms et dire "bande-annonce de calibre cinéma — voir nos réalisations"

À ne pas traiter dans PR #65 sans décision Lauralie.

---

## 🎯 PROMPT CURSOR (à coller en un seul bloc)

```
Lis voyage-v9/PATCH-V1-ITERATION.md et applique les 5 chantiers priorités 🔴 dans voyage-v9/index.html sur une nouvelle branche cursor/voyage-v9-v1-iteration depuis main.

CHANTIER 1 — Déboublonner Star Wars :
- Supprimer le bloc teaser Star Wars dans s05c (≈ L.1580-1620). Garder uniquement teaser hero L.1052 + climax s11 L.1963. Vérifier après qu'il reste exactement 2 références à 1184294831 (ou son teaser).

CHANTIER 2 — Dégraisser s05 + sortir formations :
- Fusionner s05a Atelier Rivage dans s05 intro (Rivage est déjà la 14e carte du carrousel).
- Supprimer s05b "04b Carrefour preuves" (méta-sommaire qui brise le flow).
- Extraire s05e (3 formations) et la renommer s06bis, positionnée entre s06 Méthode et s07 Équipe. Mettre à jour TOUS les href="#s05e" du fichier (nav + CTA internes) en href="#s06bis".

CHANTIER 3 — Démo Lauralie pleine largeur :
- Ajouter nouvelle section #s10bis entre la fin des réalisations et le climax s11, avec un .placeholder-asset (making-of-lauralie.mp4, 1920×1080, 60-90s, ≤18 Mo, muet). HTML + CSS dans le patch. Eyebrow "10bis · Making-of Lauralie". Titre "Le système qui travaille pendant que vous dormez." Ordre respecté : Lauralie (s10bis) puis Micha (s11).

CHANTIER 4 — Message contextuel Pack Duo :
- Ajouter #diagDuoMessage après #diagEventFields (≈ L.2177) avec le message "Le Pack Duo démarre à 3 900 € HT. Cadrage précis sous 24h."
- Branche JS dans syncDiagConditionals : if (duoMsg) duoMsg.hidden = v !== 'duo-complet';
- CSS .diag__conditional--info + .diag__info selon patch.

CHANTIER 5 — 5 reformulations brand :
- L.1658 : "Hollywood à votre nom" → "Traitement cinéma — votre univers, notre direction artistique"
- L.2065 (témoignage 1) : version moins anxiogène selon patch
- L.2062 (disclaimer) : "familles" → "intéressé·es"
- L.1545 : "Quatorze terrains de jeu" → "Quatorze démonstrations sectorielles"
- L.1966 (FAQ) : question reformulée sans "satisfait"

Règles : vanilla JS, Bunny Fonts, photos hero-1..6.webp intouchables (R1), rel="noopener noreferrer" sur externes, prefers-reduced-motion respecté, aucun Google Fonts, aucun GSAP/Lenis.

Commit : "feat(voyage-v9): v+1 iteration — déboublonnage Star Wars + s05 fusion + s06bis formations + démo Lauralie + Pack Duo contextuel + 5 reformulations brand"

Pousser sur cursor/voyage-v9-v1-iteration, ouvrir PR brouillon #65 base main.
```

---

## ✅ VALIDATION POST-PATCH (bash)

```bash
set +e
FILE=/tmp/v1.html
cd /path/to/pinapp-site
git fetch origin
git show origin/cursor/voyage-v9-v1-iteration:voyage-v9/index.html > "$FILE"

echo "=== Chantier 1 — Star Wars dédoublonné ==="
echo "  Refs 1184294831 (doit être 2 : hero + climax) : $(grep -c "1184294831" "$FILE")"

echo "=== Chantier 2 — Fusion s05 + s06bis ==="
echo "  Sections id=\"s05a\" (doit être 0) : $(grep -c 'id="s05a"' "$FILE")"
echo "  Sections id=\"s05b\" (doit être 0) : $(grep -c 'id="s05b"' "$FILE")"
echo "  Sections id=\"s05e\" (doit être 0) : $(grep -c 'id="s05e"' "$FILE")"
echo "  Nouvelle section id=\"s06bis\" (doit être 1) : $(grep -c 'id="s06bis"' "$FILE")"
echo "  Ancres \"#s05e\" résiduelles (doit être 0) : $(grep -c '#s05e' "$FILE")"

echo "=== Chantier 3 — Démo Lauralie s10bis ==="
echo "  Section id=\"s10bis\" (doit être 1) : $(grep -c 'id="s10bis"' "$FILE")"
echo "  Asset making-of-lauralie (doit être >= 1) : $(grep -c 'making-of-lauralie' "$FILE")"
echo "  Placeholder count total (doit être 14 : 13 old + 1 new) : $(grep -cE 'class="[^"]*\bplaceholder-asset\b[^_]' "$FILE")"

echo "=== Chantier 4 — Pack Duo contextuel ==="
echo "  #diagDuoMessage (doit être 1) : $(grep -c 'diagDuoMessage' "$FILE")"
echo "  Branche JS toggle Pack Duo (doit être >= 1) : $(grep -c "duoMsg.hidden = v" "$FILE")"

echo "=== Chantier 5 — Reformulations ==="
echo "  Hollywood à votre nom (doit être 0) : $(grep -c 'Hollywood à votre nom' "$FILE")"
echo "  Terrains de jeu (doit être 0) : $(grep -c 'terrains de jeu' "$FILE")"
echo "  identités modifiées (doit être 0) : $(grep -c 'identités modifiées' "$FILE")"
echo "  Qu'est-ce qui se passe si je ne suis pas satisfait (doit être 0) : $(grep -c 'pas satisfait' "$FILE")"

echo "=== R1 — 6 photos hero byte-identiques main vs v1 ==="
for i in 1 2 3 4 5 6; do
  a=$(git ls-tree origin/main -- "voyage-v9/assets/hero-$i.webp" | awk '{print $3}')
  b=$(git ls-tree origin/cursor/voyage-v9-v1-iteration -- "voyage-v9/assets/hero-$i.webp" | awk '{print $3}')
  [ "$a" = "$b" ] && echo "  hero-$i.webp ✅" || echo "  hero-$i.webp ⚠ $a vs $b"
done
```

---

## 📊 ÉTAT ATTENDU APRÈS MERGE PR #65

| Axe | Avant (9.0) | Cible | Gain |
|---|---|---|---|
| WCAG 2.1 AA | 9/10 | 9/10 | = (pas touché) |
| Narrative | 8.5/10 | 9/10 | +0.5 (Star Wars dédoublonné + démo Lauralie) |
| UX visuelle | 8/10 | 8.5/10 | +0.5 (dégraissage s05 TDAH + Pack Duo contextuel) |
| Brand voice | 9.5/10 | 9.7/10 | +0.2 (5 reformulations) |
| Form ↔ n8n | 15/15 | 15/15 + UX | = routage, + message Pack Duo |
| **Moyenne** | **9.0/10** | **9.5/10** | **+0.5** |

---

## 🔄 NEXT (v++ après PR #65)

Chantiers 🟡 Major restants pour PR #66 éventuel :
- Aria-live chatter sur `.rivage-hero__viewport` → node SR-only dédié
- Nav opacity 0.7 avant scroll → opacity 1 + text-shadow
- Zone erreur form JS opérationnelle + aria-invalid
- Ajouter tiers film IA (4 formats 390/550/1290/2800 €)
- Bloc urgence site web dans form (3 options délai)
- Nav : ajouter lien #s13 Tarifs
- Trancher nommage tags n8n vs SCHEMA (aligner workflows OU rétrofit)
- Décision produit IP tierces (Star Wars/Walker/Resident Evil → CGV ou retrait)

---

*Patch v+1 iteration 2026-04-24. À pousser sur nouvelle branche `cursor/voyage-v9-v1-iteration` depuis `main` post-merge PR #64.*
