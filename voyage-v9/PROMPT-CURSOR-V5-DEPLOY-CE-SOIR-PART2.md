# PROMPT CURSOR V5 — PARTIE 2/2 (s05 → fin)

Suite de `PROMPT-CURSOR-V5-DEPLOY-CE-SOIR.md`.

---

## Draft mode · production

- **Visiteurs** : `<body>` **sans** `class="draft-mode"` par défaut (encarts masqués comme avant, sauf brief contraire).  
- **Repérage** : **Ctrl+D** **ou** **Ctrl+Shift+D** (hors champs formulaire) bascule `draft-mode` + met à jour `data-draft-count`.  
- Si le brief impose encarts **toujours** visibles : n’appliquer qu’après validation explicite (risque « site brouillon » en prod).

---

## Design tokens (complément)

Réutiliser les tokens existants du fichier quand possible. Ajouts si besoin :

```css
:root {
  --or: #e6b973;
  --or-light: #f7d99d;
  --or-glow: rgba(230,185,115,0.18);
  --ivoire: #f4ece0;
  --ivoire-dim: #c9bfae;
  --ivoire-mute: rgba(244,228,193,0.62);
  --cyan: #3ef5e0;
  --nuit: #050b14;
  --nuit-soft: #0a121f;
  --fumee: rgba(20,30,42,0.6);
  --fumee-strong: rgba(20,30,42,0.85);
  --rouge-err: #ff6b6b;
  --vert-ok: #5eddb6;
  --ff-display: "Fraunces", Georgia, serif;
  --ff-body: "Inter", -apple-system, system-ui, sans-serif;
  /* … sp, radius, ease, dur — aligner sur besoin réel */
}
```

**Fonts** : `<link rel="stylesheet" href="https://fonts.bunny.net/css?family=fraunces:...|inter:...">` dans `<head>` — **ne pas** `@import` dans `<style>`.

**Breakpoints** : 480 / 768 / 1024 / 1440 (mobile-first).

---

## Composants (résumé)

- Boutons : `.btn--primary`, `.btn--ghost`, `.btn--text`, `.btn--cta-large` — touch ≥ 44px, focus cyan 2px offset 3px.  
- Cards : `.card--glass`, `.card--pricing`, placeholders bordure dashed or.  
- Inputs : label au-dessus (visible), erreurs inline.  
- Accordion : `<details>` natif.  
- Modal / drawer : `role="dialog"`, `aria-modal`, ESC, clic extérieur, focus trap.  
- Form 3 chemins : **cards** cliquables, champs conditionnels, validation, submit async.

---

## Stage fixe · mapping

6 layers `assets/hero-1.webp` … `hero-6.webp` — **fichiers inchangés**.

Mapping `data-stage` / `data-hero` (adapter au schéma HTML retenu, cohérent avec le brief) :

- hero-1 → s01, s02  
- hero-2 → s03, s04, s04b  
- hero-3 → s05, s06, s06b  
- hero-4 → s07, s08, s09  
- hero-5 → s09b, s10, s11  
- hero-6 → s12, s13, footer  

IO + cross-fade ; Ken Burns seulement sur `.is-active` ; désactivé si `prefers-reduced-motion` ou `body.sober`.

---

## s05 · PACK DUO `data-stage="hero-3"` `id="pack-duo"`

Textes **verbatim** du brief utilisateur : eyebrow `L'offre signature`, H2 `Pack Duo. Tout en un seul devis.`, cards Essentiel (~~1 970 €~~ → 1 890 € HT, liste, CTA), Signature (badge `★ Le plus demandé`, 4 900 €, liste, CTA primary), note rareté `On prend 3 projets par mois. Pas plus. Pour rester bons.`

---

## s06 · LAURALIE VUE `data-stage="hero-3"`

Verbatim : eyebrow, H2 `14 démos. Votre secteur est dedans. / Prix affichés.`, placeholder reel, 3 piliers, 3 démos phares, `<details>` 11 secteurs, bundle 1 590 €, doctrine Lauralie.

---

## s06b · SYSTÈME `data-stage="hero-3"`

Verbatim : eyebrow, H3, rosace 8 pétales, flux nodes, tagline, CTA vers s10.

---

## s07 · MICHA CINÉMA `data-stage="hero-4"`

4 Vimeo (IDs imposés), overlays, doctrine Micha.

**Encart film cadeau — use cases (sans « mariage »)** :

```
Use cases : anniversaire · départ · retraite · naissance · jalon professionnel
Livraison 5 jours · à partir de 390 € HT · sur devis
```

---

## s08 · CLIMAX `data-stage="hero-4"`

Verbatim H2 « Un clip Marvel-style… », lead, placeholder Lauralie chante, tapestry Spider-Man **exacte**, crédit, tableau comparatif, chips, CTA `Recevoir un devis clip sous 48h →`.

---

## s09 · ÉVÉNEMENTIEL `data-stage="hero-4"`

Verbatim H2 « Votre événement mérite plus qu'un iPhone. », lead, 3 cards (2 placeholders + DA). **Aucun** mot « mariage ».

---

## s09b · PAUSE `data-stage="hero-5"`

Verbatim : `« Maintenant, regardons les coulisses. »` — plein écran sobre, `min-height: 100dvh`.

---

## s10 · TRAVAIL INVISIBLE `data-stage="hero-5"`

Verbatim H2, lead, slider Avant 16 étapes / Avec 4, compteurs, tagline.

---

## s11 · FORMATIONS `data-stage="hero-5"`

Verbatim : 4 niveaux 39 / 67 / 147 / 397 €, tip Découverte, cross-sell Pack Duo, CTA.

---

## s12 · MÉTHODE + TARIFS + FAQ `data-stage="hero-6"`

Verbatim : timeline 4 étapes, doctrine, **tableau funnel 4 paliers** (tarifs imposés), note -40 % SIRENE, rareté + live counter, **5 FAQ** en `<details>`, CTA diagnostic.

---

## s13 · ENGAGEMENTS + FORM `data-stage="hero-6"` `id="form"`

Verbatim : 7 engagements, clause, **3 cards chemins**, champs essentiels + conditionnels TECH / IMAGE / PACK, solidaire, message, consentement, CTAs, microcopies reassurance + automation.

---

## FOOTER · DRAWER 4 ACTES · MODALE STAY

Reprendre **textes exacts** du message utilisateur (signature, CO₂ si implémenté, liens légaux, M&P discret, copyright, drawer 4 actes, modale STAY + ESC + overlay + bouton fermer + lien memoireetpresence.fr `rel="noopener noreferrer"`).

---

## Easter eggs (5)

1. **Draft** : toggle **Ctrl+D** ou **Ctrl+Shift+D** (implémenter les deux pour coller au brief).  
2. **Scene-counter** top-droite.  
3. **Morse-stay** → modale M&P.  
4. **Konami** (existant ou à préserver).  
5. **Whisper s08** text-split si réalisable sans casser a11y.

---

## SEO `<head>`

```html
<title>Pinapp · Sites + films pour TPE/PME · 50 à 75% moins cher | Bordeaux</title>
<meta name="description" content="Duo Pinapp : sites qui convertissent + films cinéma. Diagnostic 24h gratuit. Bordeaux + Nouvelle-Aquitaine. Tarifs publics dès 1 290 €.">
<meta property="og:title" content="Pinapp — Sites + Films pour TPE/PME ambitieuses">
<meta property="og:image" content="https://pinapp.fr/voyage-v9/assets/hero-1.webp">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
```

JSON-LD **LocalBusiness** + **FAQPage** : reprendre les objets du brief (corriger `hasOfferCatalog` vs `offers` si besoin pour validité schema.org).

---

## Structure fichier attendue

`voyage-v9/index.html` monolithique : skip-link, nav, stage 6 layers, `<main id="main">` sections s01…s13 (+ s04b, s06b, s09b), footer, compteur, morse, dialog M&P, drawer, `<script>` vanilla (stage, reveal, counter, sober, drawer/modal, form, count-up, slider s10, Vimeo lazy, Konami, text-split, reduced-motion, draft toggle).

---

## Checklist avant commit

- [ ] 14 scènes + interstitiels (s04b, s06b, s09b)  
- [ ] Textes verbatim + **zéro** « mariage » (services + use cases)  
- [ ] R1 hero + 4 Vimeo  
- [ ] Placeholders + draft toggle  
- [ ] Form 3 chemins cards  
- [ ] FAQ `<details>` + JSON-LD alignés  
- [ ] Skip-link, landmarks, focus, touch 44px  
- [ ] Bunny link head, pas Google, pas GSAP  
- [ ] Pas de `!` dans la copy  
- [ ] Pas neuro fondateurs  
- [ ] `docs/SCHEMA-WORKFLOWS-N8N.md` déjà à jour sur main (W12–W22) — ne pas régresser

---

## Commit + push

```bash
git add voyage-v9/index.html
git commit -m "voyage-v9 V5 · refonte 14 scènes + textes verbatim + placeholders + easter eggs + form 3 chemins + a11y WCAG AA"
git push origin main
```

Vérif live : `https://pinapp.fr/voyage-v9/` après Actions.

---

*Partie 2/2 · 2026-04-26*
