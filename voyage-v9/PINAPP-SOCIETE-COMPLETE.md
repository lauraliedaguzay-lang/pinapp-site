# PINAPP — AUDIT "VRAIE SOCIÉTÉ" COMPLET

> Synthèse de 5 audits parallèles : fondations légales, design+animations, automatisations, artefacts Claude, crédibilité.
> Objectif : identifier ce qui reste à faire pour passer de **belle vitrine** à **société opérationnelle qui scale**.

---

## 🎯 VERDICT GLOBAL

| Domaine | Score | État | Sévérité |
|---|---|---|---|
| **Fondations légales** | 15/20 | Société solide | 🟢 OK |
| **Design & animations** | 13/25 | Écart wearebrand | 🟠 À combler |
| **Automatisations réelles** | 0/8 en prod | Coque façade | 🔴 CRITIQUE |
| **Artefacts Claude** | intégrés à 80% | Quelques orphelins | 🟡 Mineur |
| **Crédibilité / preuves** | 18/30 | Freelance-like | 🟠 Bloquant B2B |

**Bilan brutal** : le site est beau, la copy est carrée, la structure légale tient la route — mais **les automatisations promises ne tournent pas**, et **il n'y a aucun témoignage client réel**. Pinapp fait aujourd'hui "société en façade" mais dépend 100% de la présence personnelle de Lauralie+Micha pour convertir.

---

## 🔴 CHANTIER #1 — AUTOMATISATIONS : DU JSON AU PROD

**État réel** : les 8 workflows n8n (W1 à W8) existent en JSON, les 7 templates email existent en HTML, la doc CRM Notion est écrite, mais **AUCUN n'est branché en prod**. Tous les feature flags sont à `false`, les webhooks pointent sur `[TON-N8N]`, les secrets GitHub Stripe/YouSign/WhatsApp/Notion sont vides.

La scène 03b "Preuve automatisations" que Claude vient de mettre en valeur est **une promesse architecturale, pas une livraison**.

### Actions critiques (ordre)

1. **Configurer les 9 secrets GitHub** (Stripe, YouSign, WhatsApp, Notion DBs × 3, webhook n8n, ElevenLabs, Gmail)
2. **Créer les 3 DB Notion** (Leads, Devis, Missions) avec les colonnes documentées dans `docs/LEAD_FLOW.md`
3. **Flipper `features.diagnosticWebhook` à `true`** dans `config.js`
4. **Activer W1** (Prospect entrant) en premier → le formulaire voyage-v9 doit arriver dans la DB Leads
5. **Valider W1 bout en bout** avec un test (submit form → Notion → email Lauralie + Slack)
6. **Déployer W2 → W5** par vagues (facturation, formation, livraison, M&P)
7. **Instrumenter les events Plausible** : `Diagnostic-Submit`, `Portfolio-Play`, `Pack-Duo-Click`, `Cal-Click`, `Formation-Click`

**Sans cette étape, le site reste une brochure.** Tout le reste est secondaire.

---

## 🟠 CHANTIER #2 — CRÉDIBILITÉ : DE DÉMO À PREUVE

**État réel** : `/realisations/` montre 13 univers/démos mais **zéro vrai client nommé**. Pas de témoignage, pas de case study chiffré, pas de logos "vu dans", pas de LinkedIn Pinapp en footer.

La fameuse ligne canonique de COPY-PINAPP `12h → 2h / 30% → 85% / 3j → <24h / ×3 temps libre` n'est matérialisée nulle part par des stats clients réels.

### 5 gains rapides (cette semaine)

1. **3 témoignages nommés** minimum (photo + nom + secteur + 1 phrase + métrique avant/après), même anonymisé en "Patrick M. – artisan couvreur Pessac"
2. **2 case studies chiffrées** : convertir 2 des 13 démos en histoires réelles avec problème → solution → gain (restaurant + avocat sont déjà bien positionnés)
3. **LinkedIn Pinapp en footer** + 1 post LinkedIn repris dans la home ("dernière publication")
4. **Bloc "Partenaires technos"** : logos Stripe, n8n, Anthropic, Hostinger, Bunny Fonts (zéro permission requise, tous publics)
5. **Avis Google / Malt** : lier la note et nombre d'avis s'ils existent

### 3 chantiers stratégiques (60-90 jours)

1. **Base clients réels** : contacter 5-10 clients passés pour accord de diffusion + quote + photo
2. **Blog cadencé** : 1 article de fond par mois (guide n8n TPE, IA pour RH, case study technique)
3. **Présence réseau** : LinkedIn 1 post/semaine, meetup Bordeaux, podcast invité

---

## 🟠 CHANTIER #3 — DESIGN & ANIMATIONS : ATTEINDRE LE WEAREBRAND

**État réel** : voyage-v9 a le stage fixe global ✓, scrub vidéo 8/8 ✓, easter eggs V7 codés à 75% (chromatic aberration chargé mais pas activé). Mais il manque les **signatures wearebrand** : cursor magnétique, light leak, parallax 3D, sand text, badge Connected pulsant.

### 10 animations à ajouter (impact décroissant)

1. **Light leak doré radial** entre scènes — signature cinématographique V24-SPEC §3
2. **Cursor custom magnétique** (via wearebrand-kit.js perdu, à reconstruire)
3. **Activer `film-chromatic.js`** — déjà dans le repo, juste `<script src>` manquant
4. **Parallax 3D multi-couches** sur hero scène 01
5. **Sand text** formation lettres — `sand-text.css` jamais écrit
6. **Text split char-by-char reveal** sur H1/H2 Fraunces (GSAP split)
7. **Tilt 3D hover** sur cartes portfolio et duo (style Stripe / Linear)
8. **Boost particules** systématique au changement de scène (`pinappParticleBoost` non triggé)
9. **Badge "Connected" pulsant** (inspiration wearebrand)
10. **Sound design** discret (clic, hover, scroll) avec opt-out respectueux

**Effort estimé** : 8-12h pour les 4 premiers (chromatic, cursor, light leak, parallax). Gros impact visuel.

---

## 🟢 CHANTIER #4 — FONDATIONS LÉGALES : 3 MANQUES MINEURS

**État réel** : tout est carré — SIRET 523 884 898 00017, mentions légales, CGV 16 articles, confidentialité RGPD, devis/contrat templates, Stripe commercial, processus onboarding formalisé. Verdict : "SOCIÉTÉ SOLIDE".

### Les 3 manques pour monter en B2B

1. **Assurance RC pro** — ~300 €/an en micro-entreprise, impératif pour signer des contrats > 10 k€ (Hiscox, MMA, AXA)
2. **SLA écrit** — actuellement "livraison 7 jours" mais pas de contrat type qui engage explicitement
3. **Signature électronique YouSign branchée** — le workflow W2 existe, à activer

**Bonus** : un pitch deck PDF à télécharger (pour présentation commerciale hors-site, réunions CCI/Bpifrance).

---

## 🟡 CHANTIER #5 — ARTEFACTS CLAUDE : RÉCUPÉRER LES ORPHELINS

**État réel** : la majorité des artefacts Claude sont intégrés (voyage-*.js, TEXT-MASTER-V7, tokens-voyage.css). Worktree `musing-blackburn-057634` a le V7 handover complet.

### Artefacts perdus à reconstruire ou retrouver

1. **wearebrand-kit.css + wearebrand-kit.js** (pill magnétique, badge Connected, Ken Burns, slider fade) — probablement dans un `outputs/` de session disparue. Sinon reconstruire depuis wearebrand.io en vanilla (2-3h).
2. **cupola-scroll-zoom.html** (démo scroll zoom hublot) — disparu. Probablement en session isolée sans commit.
3. **COPY-REWRITES.md** — remplacé par TEXT-MASTER-V7.md, pas de perte.

### Action

Chercher sur le disque Lauralie dans :
- `C:\Users\Lauralie\Downloads\`
- `C:\Users\Lauralie\Desktop\pinapp*`
- `C:\Users\Lauralie\Documents\`
- Tout export de session Claude / Cursor récent

Si introuvables : reconstruire les 2 effets depuis zéro (cursor magnétique + badge Connected) en 2-3h.

---

## 🗓 PLAN 30 / 60 / 90 JOURS

### J+1 à J+30 — DÉBLOQUER LE MOTEUR

- **Sem 1** : Activer W1 Prospect entrant (secrets GitHub, DB Notion Leads, flip flag, test)
- **Sem 2** : Activer W2 Devis-YouSign-Stripe (DB Devis, webhooks)
- **Sem 3** : Activer W3 Formation + W4 Livraison (DB Missions)
- **Sem 4** : Instrumenter 5 events Plausible + souscrire assurance RC pro

**Résultat** : Pinapp est réellement opérationnel. Un lead entre, parcourt le funnel automatisé sans que Lauralie touche un bouton.

### J+31 à J+60 — CRÉDIBILITÉ

- Contacter 10 clients passés → 3 témoignages publiés + 2 case studies chiffrées
- Activer LinkedIn Pinapp (1 post/semaine)
- Ajouter bloc partenaires techno au footer
- Blog : 1 article "Comment on a automatisé la facturation de X en 3 jours"
- Pitch deck PDF téléchargeable

**Résultat** : conversion B2B divisée par 2 en durée (acheteur méfiant devient acheteur équipé).

### J+61 à J+90 — DESIGN & PRODUITS DÉRIVÉS

- Light leak + cursor magnétique + chromatic aberration → niveau wearebrand-grade atteint
- Page `/films-ia/` avec nouvelle grille tarifaire auditée (Clip 550 € / Court 1290 € / Premium 2800 €)
- Ajout du segment **"Film à offrir"** (Clip cadeau 390-490 €) avec case à cocher dans le form diagnostic
- FAQ enrichie (+5 questions sur films IA cadeaux, délais, univers)
- Roadmap publique minimaliste

**Résultat** : 3 nouveaux segments clients (particuliers cadeaux, studios, PME marketing) + crédibilité Awwwards potentielle.

---

## 📊 PRIORITÉS ABSOLUES SI TU AS 1 HEURE

1. **Configurer 1 secret** : `N8N_WEBHOOK_URL` dans `config.js` ou variable d'env
2. **Créer 1 DB Notion** : "Leads Pinapp" avec les 13 colonnes de `docs/LEAD_FLOW.md`
3. **Flipper 1 flag** : `features.diagnosticWebhook = true`
4. **Tester** : soumettre le formulaire voyage-v9 en navigation privée, vérifier la ligne Notion

**Impact** : le formulaire de ton site passe de décoratif à fonctionnel. C'est la différence entre "j'ai un beau site" et "je capte des prospects automatiquement".

---

## 🎯 QUESTION POUR TOI

Quel chantier tu veux attaquer en premier ?

- **A** — Automatisations (le moteur) — 1 à 2 semaines de config
- **B** — Crédibilité (les preuves) — 3-4 jours de démarchage + publication
- **C** — Design/animations (le wow) — 8-12h dev
- **D** — Segment "Film à offrir" + nouvelle grille tarifaire films IA (commercial pur)
- **E** — Les 4 en parallèle avec priorités

Chacun de ces chantiers peut générer son propre prompt exécutable. Dis-moi lequel et je prépare le plan d'action exact.

---

*Audit consolidé 2026-04-23 · 5 agents parallèles (fondations, design, automatisations, artefacts, crédibilité).*
