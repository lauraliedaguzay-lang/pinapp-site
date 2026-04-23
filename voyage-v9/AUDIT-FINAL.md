# AUDIT FINAL — voyage-v9/index.html

> Synthèse de 5 audits parallèles : conformité, design wearebrand, accessibilité, performance, contenu.
> Date : 2026-04-23.

---

## 📊 SCORECARD GLOBAL

| Lentille | Score | Verdict |
|---|---|---|
| **Conformité règles Pinapp** | 33/35 (94%) | ✅ Très bon |
| **Design wearebrand** | 78/100 | ✅ Atteint |
| **Accessibilité WCAG 2.1 AA** | 22/25 (88%) | ⚠️ 3 bloquants |
| **Performance / Technique** | OK | ✅ Pas de blocker |
| **Contenu exhaustivité** | 58/65 (89%) | ⚠️ 5 manques |

**Verdict global** : site **solide, prêt à 90%**. Les transitions wearebrand sont **correctement appliquées** (stage fixe global, cross-fade 1.4s, ken-burns 14s, scrim uniforme). Il reste une poignée de fixes ciblés pour atteindre le niveau production.

---

## 🏆 CE QUI MARCHE DÉJÀ

1. **Transitions photos** — stage fixe `.stage` position:fixed, 6 layers cross-fadées via IntersectionObserver, ken-burns 14s continu, scrim uniforme. **Patch AUDIT-TRANSITIONS appliqué.** ✅
2. **Structure 15 scènes** — dont la nouvelle 03b "Preuve automatisations"
3. **Contenu complet** — 13 réalisations, 5 engagements avec clause 10%, 11 lignes de tarifs, Pack Duo split 3 900 €
4. **Vocabulaire** — zéro interdit (mort/deuil/décès/funérailles/solution innovante/résultat garanti/!)
5. **Typographie** — Fraunces italic + Inter, clamp() fluide partout, `<em>` éditoriaux dans les H
6. **Carrousel** — horizontal scroll-snap, compteur live 01/13, arrows
7. **Mode sobre** — `#soberToggle` présent, désactive stage + reveals
8. **`prefers-reduced-motion`** — correctement géré
9. **RGPD-friendly stack** — Bunny Fonts (pas Google), Plausible (pas GA)
10. **Contraste principal** — #f4e4c1 sur #050b14 = 9.2:1 (excellent)

---

## 🚨 CRITIQUES BLOQUANTS (5)

Ces items empêchent une mise en prod propre. À corriger **avant** déploiement.

### C1. Focus form supprimé — a11y critique
**Fichier** `index.html` · **ligne 402**
```css
.diag input:focus,.diag select:focus,.diag textarea:focus{outline:none;border-color:var(--or)}
```
`outline:none` casse la navigation clavier (WCAG 2.4.7).
**Fix** :
```css
.diag input:focus,.diag select:focus,.diag textarea:focus{
  outline:2px solid var(--cyan); outline-offset:3px; border-color:var(--or)
}
```

### C2. Liens sans distinction visuelle — a11y critique
**Fichier** `index.html` · **ligne 71**
```css
a{color:inherit;text-decoration:none}
```
WCAG 1.4.1 : les liens doivent être identifiables sans se reposer sur la couleur seule.
**Fix** (dans le corps de la page, pas les CTA stylés) :
```css
.scene__content p a, .footer a {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: rgba(230,185,115,.5);
}
```

### C3. `aria-labelledby` pointant sur un `<p>` — a11y
**Fichier** `index.html` · **ligne 890** (scène 11 Manifeste)
`<section aria-labelledby="s11-h">` pointe sur `<p id="s11-h">` → WCAG 1.3.1.
**Fix** : envelopper la citation dans `<h2 id="s11-h" class="manifesto__quote">` (stylée comme un `<p>` via CSS), ou supprimer l'attribut et remplacer par `aria-label="Manifeste"`.

### C4. Checkbox RGPD absente du formulaire — conformité légale
**Fichier** `index.html` · **scène 14** (form autour de L964–L1003)
Le form n'a pas de case à cocher de consentement explicite.
**Fix** (exigence `.cursorrules` + RGPD) :
```html
<label class="diag__consent">
  <input type="checkbox" name="consent" required>
  <span>J'accepte d'être recontacté sous 24h par écrit. Mes données ne sont utilisées que pour cette réponse et restent chez Pinapp — <a href="/mentions-legales/">en savoir plus</a>.</span>
</label>
```

### C5. Confirmation post-submit dépend d'un feature flag
**Fichier** `index.html` · **L1197–1248**
Le remplacement DOM `.diag__ok` est gardé derrière `cfg.features.diagnosticWebhook`. Si le flag est off, l'utilisateur soumet le form sans retour.
**Fix** : retirer la condition `cfg.features.diagnosticWebhook` pour la confirmation écran — elle doit toujours s'afficher si le webhook répond 2xx. Le flag ne doit gérer QUE le skip réel de l'appel fetch.

---

## ⚠️ MAJEURS (6)

### M1. Workflow W8 absent de la scène 03b
Le brief V2 demandait 6 cartes (W1, W2, W3, W4, W5, **W8**). Seuls W1–W5 sont rendus. Ajouter une 6e carte :
```html
<article class="wf">
  <span class="wf__code">W8</span>
  <h3 class="wf__title">Auralis RH — router</h3>
  <p class="wf__flow">Signal → Claude API → réponse RH</p>
  <p class="wf__bene">Notre preuve par l'exemple : Auralis tourne sur ce flux.</p>
</article>
```

### M2. QR code chemin relatif potentiellement cassé
**L994** `src="../assets/images/qr-diagnostic.png"`
Si `index.html` est à la racine de `voyage-v9/`, le chemin doit être `assets/images/qr-diagnostic.png` (sans `..`), OU le fichier doit être copié dans `voyage-v9/assets/images/qr-diagnostic.png`.

### M3. Seulement 2 vidéos Voyage intégrées sur 8 disponibles
Intégrées : `01-main-hologramme` (scène 01), `08-atterrissage-sable` (scène 14).
Possibles en plus (respecter budget) :
- Scène 05 Réalisations → `03-hublot-cosmos.mp4` (contemplation)
- Scène 06 Méthode → `04-constellation-mp.mp4`
- Scène 12 Mémoire & Présence → `07-tourbillon-etoiles.mp4`

⚠️ Vérifier les tailles : les vidéos voyage totalisent **51.8 Mo**. Intégrer seulement 3–4 max (≤ 15 Mo critiques). Toujours avec fallback photo sur mobile + `prefers-reduced-motion`.

### M4. Hero-2 à hero-6 non préchargées → flash au scroll
Seule `hero-1.webp` est en `<link rel="preload">`.
**Fix** :
```html
<link rel="preload" as="image" href="assets/hero-2.webp">
<link rel="preload" as="image" href="assets/hero-3.webp">
<link rel="preload" as="image" href="assets/hero-4.webp">
<link rel="preload" as="image" href="assets/hero-5.webp">
<link rel="preload" as="image" href="assets/hero-6.webp">
```

### M5. Hero-3.webp trop lourde (277 Ko)
À recompresser à ≤ 200 Ko (cwebp -q 80 ou squoosh.app).

### M6. Backdrop-filter appliqué 7× → coût GPU
Limiter à la nav + 1 carte principale max. Remplacer les autres par `background: rgba(10,20,32,.75)` simple + `border: 1px solid var(--fumee)`.

---

## 💡 QUICK WINS (7 — < 5 min chacun)

| # | Fix | Gain |
|---|---|---|
| Q1 | Ajouter `<link rel="canonical" href="https://pinapp.fr/">` | SEO |
| Q2 | Ajouter JSON-LD Organization (nom, logo, adresse Bordeaux, contact@pinapp.fr) | SEO rich results |
| Q3 | Favicon + apple-touch-icon | Pro |
| Q4 | Ajouter `alt` descriptifs sur les 13 images Unsplash | A11y + SEO |
| Q5 | Chapter labels : ajouter `font-variant-caps: small-caps; font-feature-settings: "tnum"` sur `.eyebrow` | Wearebrand polish |
| Q6 | Ajouter `<track kind="descriptions">` ou confirmer `aria-hidden="true"` sur les `<video>` décoratives | A11y video |
| Q7 | Event Plausible `plausible('Diagnostic-Submit')` après succès fetch | Tracking |

---

## 🎯 PLAN DE CORRECTION ORDONNÉ

### Priorité 1 — Aujourd'hui (bloque la prod)
- [ ] C1 : restaurer outline focus sur form
- [ ] C2 : ajouter underline aux liens corps/footer
- [ ] C3 : transformer manifeste en `<h2>` ou retirer aria-labelledby
- [ ] C4 : ajouter checkbox consentement RGPD
- [ ] C5 : découpler confirmation écran du feature flag

### Priorité 2 — Cette semaine
- [ ] M1 : ajouter carte W8 dans scène 03b
- [ ] M2 : corriger chemin QR code
- [ ] M4 : preload hero-2 à hero-6
- [ ] M5 : recompresser hero-3.webp

### Priorité 3 — Polish
- [ ] M3 : intégrer 2–3 vidéos voyage supplémentaires
- [ ] M6 : réduire backdrop-filter à 2 occurrences
- [ ] Q1 à Q7 : quick wins en batch (30 min total)

---

## 📜 COMMANDE CLAUDE CODE POUR APPLIQUER LES FIXES

```bash
cd C:\Users\Lauralie\Projects\pinapp-site\voyage-v9

claude "Lis AUDIT-FINAL.md. Applique dans l'ordre : (1) les 5 critiques C1–C5 avec les fixes exacts indiqués, (2) les 6 majeurs M1–M6, (3) les 7 quick wins Q1–Q7. Ne change RIEN au stage fixe (.stage / .stage__layer) qui est déjà conforme. Ne touche PAS à la structure des 15 scènes. Après chaque section de fixes, liste en commentaire les lignes modifiées. Termine par un récap : items corrigés / items skippés / raisons."
```

---

## ✅ CE QUE JE NE TOUCHERAIS PAS

- La structure 15 scènes (validée)
- Le pattern `.stage` + IntersectionObserver pour transitions (wearebrand-grade)
- La typographie Fraunces+Inter + clamp() (excellent)
- Le mode sobre (#soberToggle)
- La grille des valeurs / engagements / tarifs (fidèle à la copy)
- Les placeholders Unsplash + badge "Aperçu sectoriel" (décision explicite vs prod réelle — garder tant que les vrais screens n'existent pas, cf `.cursorrules` "zéro photo publique sans validation")

---

*Audit consolidé par 5 agents parallèles (conformité, design, a11y, perf, contenu). Synthèse 2026-04-23.*
