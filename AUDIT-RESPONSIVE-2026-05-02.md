# Audit responsive Pinapp (voyage-v9) · 02/05/2026

**Périmètre :** `voyage-v9/index.html` (CSS inline majeur), `voyage-v9/assets/css/pinapp-*.css` hors `pr3a-v12.css` (gelé), aperçu statique de `pr3a-v12.css` pour le wizard contact.

**Méthode :** revue de code (grep, lecture de media queries, variables `:root`, patrons `min-height`, `overflow`, `clamp`). **Pas** de campagne Playwright ni de mesures Lighthouse réelles dans cet audit : les métriques LCP / CLS / INP sont marquées **à mesurer sur device** (Chrome DevTools ou CI).

---

## Résumé exécutif

| Niveau | Nombre |
|--------|--------|
| Total constats | 14 |
| Critiques (risque pitch / lisibilité / scroll) | 2 |
| Importants | 5 |
| Mineurs | 7 |

**Verdict court :** la base responsive est solide (`overflow-x` sur `html`/`body`, nombreuses `clamp()`, grilles avec breakpoints à 600–1100px, beaucoup de cibles `min-height: 44px`). Les points critiques concernent surtout **corps de texte sous 16px** sur le hero mobile et **l’absence de `srcset`/`sizes`** sur les images marketing (hors favicon).

---

## Bugs par viewport (code + impact attendu)

### iPhone SE 390 × 667 (mobile contraint)

1. **[BUG] Sous-titre hero sous 16px**  
   - **Section :** `#hero`  
   - **Code :** `@media (max-width:390px)` → `#hero .lead { font-size: clamp(13px, 3.5vw, 15px); }`  
   - **Sévérité :** Critique (lisibilité + recommandation corps 16px minimum sur mobile)  
   - **Fix proposé :** relever le plancher à `clamp(15px, 3.5vw, 16px)` ou `max(16px, …)`.

2. **[BUG] Images démo sans `srcset` / `sizes`**  
   - **Section :** `#realisations` (cartes `.real-hub-card__thumb img`)  
   - **Code :** `<img … width="640" height="400">` sans `srcset`  
   - **Sévérité :** Important (réseau + sharpness ; pas de débordement grâce à `max-width:100%`)  
   - **Fix proposé :** si variantes de largeur existent un jour, ajouter `srcset` + `sizes="(max-width:700px) 100vw, 33vw"` ; sinon documenter comme dette acceptable pour MVP.

3. **[BUG] Liens `.btn--text` : zone de clic horizontale réduite**  
   - **Section :** multiples (ex. `#realisations` « En savoir plus »)  
   - **Code :** `.btn--text { padding: 12px 8px; min-height: 44px; }` — hauteur OK, largeur parfois étroite sur libellé court  
   - **Sévérité :** Mineur  
   - **Fix proposé :** `padding-inline: 12px` ou `min-width: 44px` sur les `.btn--text` critiques.

4. **[MANQUE] Validation Lighthouse mobile**  
   - **Sévérité :** Important pour objectifs annoncés (LCP &lt; 2,5 s, CLS &lt; 0,1)  
   - **Action :** lancer Lighthouse « Mobile » sur `https://pinapp.fr/` (ou preview) et archiver le JSON.

### iPhone 14 Pro 393 × 852

5. Même constat **#hero .lead** si la règle `@media (max-width:390px)` ne s’applique pas (393px &gt; 390) : le lead repasse au `clamp` global plus large — **à vérifier visuellement** ; risque abaissé vs SE.  
   - **Sévérité :** Mineur (contrôle visuel)

6. **Easter egg pierres** (`pinapp-easter-egg.css`) : `max-width` + `flex-wrap` en bas à droite — pas de scroll horizontal attendu.  
   - **Sévérité :** OK en lecture de code

### iPad 768 × 1024 (portrait)

7. **Grilles domaines / réalisations** : passages `600px` / `700px` / `768px` / `1024px` cohérents ; **zone sensible 768–1024** : navigation desktop vs burger dépend du markup nav (liens visibles large écran) — **à valider en device** si un breakpoint intermédiaire serre le CTA.  
   - **Sévérité :** Mineur

8. **Tableau comparatif agence** : `overflow-x: auto` sous `max-width:599px` — sur iPad portrait le tableau est en mode « table » ; surveiller colonnes étroites.  
   - **Sévérité :** Mineur (UX lecture)

### Desktop 1280 × 800

9. **`--container: min(1200px, 92vw)`** : marges latérales stables ; pas de signal de débordement dans les règles globales.  
   - **Sévérité :** OK

10. **Animations / `prefers-reduced-motion`** : plusieurs blocs désactivent transitions — cohérent avec exigence H24 / confort.  
    - **Sévérité :** OK

### Wide 1920 × 1080

11. **Titres `clamp` très grands** (`--fs-h1` jusqu’à ~7rem)** : acceptable en wide ; vérifier **line-length** sur paragraphes centrés `max-width` — déjà présents sur plusieurs `.lead`.  
    - **Sévérité :** Mineur (polish)

---

## Wizard PR-A (`pr3a-v12.css` + `#pinapp-contact-wizard`)

**Fichier gelé pour modifications** — audit surfacique uniquement.

12. **Étapes sur 390px** : le wizard est injecté via `pr3a-v12.js` / CSS dédié ; sans exécution navigateur, **statut : à valider** (scroll interne du card, hauteur des steps, sticky footer des actions).  
    - **Sévérité :** Important (bloquant seulement si constaté cassé en test manuel)

13. **Hauteur des inputs** : le fichier `pr3a-v12.css` ne remonte pas systématiquement `min-height: 44px` sur tous les champs dans les extraits grep — **à contrôler dans l’onglet Computed** sur un champ date / file / text.  
    - **Sévérité :** Important si &lt; 44px mesuré

14. **Honeypot** : présence attendue côté wizard — **non vérifiée dans cet audit statique** (logique dans `pr3a-v12.js`).  
    - **Sévérité :** Vérification fonctionnelle requise

---

## Accessibilité (transversal)

- **`lang="fr"`** sur `<html>` : présent.  
- **Skip link** « Aller au contenu » : présent.  
- **Focus** : nombreuses règles `:focus-visible` sur boutons / liens.  
- **Contraste** : combinaisons or / ivoire / nuit — **non mesurées au ratio WCAG** dans ce rapport ; recommandation : passage outil contrast checker sur CTA secondaires et texte `muted`.

---

## Plan de fixes recommandés

| Lot | Cible | Durée indicative |
|-----|--------|-------------------|
| **PR-N1 (critiques)** | Relever `#hero .lead` à ≥16px sur la plage mobile concernée ; re-scan Lighthouse mobile | ~30 min |
| **PR-N2 (importants)** | Mesures Lighthouse + INP sur home ; test manuel wizard 390px (4 étapes + upload) | ~45 min |
| **PR-N3 (mineurs)** | `btn--text` tap area ; relecture tableau comparatif iPad ; `srcset` si assets multi-tailles | ~30–60 min |

---

## Outils recommandés (prochaine itération)

- Chrome DevTools → Device Mode (SE, 14 Pro, iPad) + **Lighthouse** mobile/desktop  
- **Playwright** (screenshots régressions par viewport) si intégration CI souhaitée  
- **WebPageTest** ou Field Data Plausible pour corréler INP réel

---

*Document généré par audit statique du dépôt ; compléter par captures et métriques après tests navigateur.*
