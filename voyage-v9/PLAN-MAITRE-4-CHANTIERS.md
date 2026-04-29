# PLAN MAÎTRE — 4 CHANTIERS EN PARALLÈLE

> Automatisations + Crédibilité + Design + Films IA.
> Ordre d'exécution optimisé pour minimiser les blocages et maximiser les retours.
> Chaque tâche : action · qui la porte · temps · livrable · prompt prêt.

---

## 🗂 VUE D'ENSEMBLE

| Chantier | Poids | Bloquant pour | Effort total |
|---|---|---|---|
| 🔴 **A** — Automatisations | Fondamental | tout le reste | 2 sem |
| 🟠 **B** — Crédibilité | Conversion B2B | scaling | 3-4 sem |
| 🟠 **C** — Design wearebrand | Perception premium | Awwwards | 1-2 sem |
| 🟡 **D** — Films IA + cadeau | Nouveau revenu | volume Micha | 1 sem |

**Stratégie** : A démarre lundi (débloque tout), B et D en parallèle (démarchage + pricing en même temps), C arrive après que A soit validé (inutile de polir un site qui ne capte personne).

---

## 📅 SPRINT 0 — Semaine 1 (cette semaine)

**Objectif** : le formulaire diagnostic capte réellement des leads. Tout le reste en découle.

### A.1 — Débloquer le webhook n8n (2h, Lauralie)

**Action** : créer le compte n8n si pas fait, activer l'instance (self-hosted sur Hostinger OU cloud n8n), récupérer l'URL webhook W1.

**Livrable** : URL `https://n8n.pinapp.fr/webhook/prospect-entrant` active et testée avec curl.

**Test** :
```bash
curl -X POST https://n8n.pinapp.fr/webhook/prospect-entrant \
  -H "Content-Type: application/json" \
  -d '{"test":"ping"}'
# Doit retourner 200
```

### A.2 — Créer la DB Notion "Leads Pinapp" (1h, Lauralie)

**Action** : dans Notion, créer la database avec les 13 colonnes de `docs/LEAD_FLOW.md` :
Name, Email, Tél, Entreprise, Secteur, Projets, Budget, Urgence, Score, Tier, Source, Description, Statut.

**Livrable** : Database ID Notion + clé API intégration.

### A.3 — Flipper les flags (30 min, via Cursor)

**Prompt Cursor** :
```
Dans assets/js/config.js, passe features.diagnosticWebhook à true et ajoute la constante WEBHOOK_URL pointant sur https://n8n.pinapp.fr/webhook/prospect-entrant.

Commit "feat: active webhook diagnostic en prod".
```

### A.4 — Test bout-en-bout (30 min, Lauralie)

**Action** : ouvrir voyage-v9 en navigation privée, soumettre le formulaire, vérifier :
- Confirmation écran s'affiche
- Nouvelle ligne dans Notion Leads DB
- Email reçu à contact@pinapp.fr

### A.5 — Souscrire assurance RC pro (1h, Lauralie)

**Action** : contacter Hiscox ou AXA, souscrire une RC pro micro-entreprise (~300 €/an).

**Livrable** : attestation RC pro à ajouter dans mentions légales.

### B.1 — Lister 10 anciens clients à démarcher (1h, Lauralie)

**Action** : ouvrir le CRM actuel (Notion, carnet, mails) et lister 10 clients qui ont eu un livrable Pinapp, avec :
- Nom / entreprise / secteur
- Mail de contact
- Livrable livré (site, automatisation, film, etc.)
- Estimation gain client (même approximative)

**Livrable** : fichier `docs/contacts/anciens-clients-a-contacter.md` avec les 10 lignes.

### Sprint 0 — Total : ~6 heures sur la semaine

---

## 📅 SPRINT 1 — Semaines 2-3

**Objectif** : les autres workflows tournent + les 3 premiers témoignages arrivent.

### A.6 — Activer W2 (Devis-YouSign-Stripe) — 3h Lauralie

**Prérequis** :
- Compte YouSign actif, clé API générée
- Compte Stripe actif, clé secrète + publishable

**Prompt Cursor** :
```
Configure n8n-workflows/W2-devis-yousign-stripe.json avec les vraies clés env (YOUSIGN_API_KEY, STRIPE_SECRET). Crée la DB Notion "Devis Pinapp" avec colonnes Status, Client, Montant, DateEnvoi, DateSignature, LienYouSign, LienStripe.

Dans assets/js/config.js ajoute le flag features.devisAutomation = true.

Test : simuler un devis de 490 € HT, vérifier que YouSign l'envoie et Stripe génère le payment link.
```

### A.7 — Activer W3 (Formation sequence) — 2h

Similaire à W2, pour les kits prompts : J+0 bienvenue, J+1 rappel ressources, J+3 module 1, J+7 module 2, J+14 check-in, J+30 avis.

### A.8 — Activer W4 (Livraison feedback) — 2h

Trigger : statut "Livré" dans Notion Missions → email J+7 avec lien Google Reviews + Tally feedback.

### A.9 — Instrumenter 5 events Plausible — 1h (via Cursor)

**Prompt Cursor** :
```
Ajoute 5 events Plausible dans voyage-v9/index.html :
- window.plausible('Diagnostic-Submit') après succès fetch dans le JS du form
- window.plausible('Portfolio-Play', {props:{id: vimeoId}}) dans initPortfolioVimeo
- window.plausible('PackDuo-Click') au clic sur les CTA Pack Duo
- window.plausible('Cal-Click') au clic sur le lien Cal.com
- window.plausible('Formation-Click') au clic sur les 3 prices__link

Commit "feat(analytics): 5 events Plausible custom pour tracking funnel".
```

### B.2 — Démarchage témoignages — 4h Lauralie sur 2 semaines

**Template email à envoyer aux 10 clients de Sprint 0** :
```
Objet : 2 minutes pour nous aider à grandir ?

Bonjour [prénom],

On prépare la refonte du site Pinapp et on cherche 3-5 clients comme toi pour témoigner — idéalement une phrase + un chiffre (ex: "j'ai récupéré 2 jours/mois").

Ça prend 5 minutes. Je peux te faire la question en 2 lignes pour que tu n'aies qu'à valider.

Merci,
Lauralie
```

Objectif : **3 témoignages publiés** au bout du sprint.

### B.3 — 2 case studies chiffrées — 3h Lauralie/Claude

**Prompt Claude / Cursor quand les témoignages arrivent** :
```
Crée 2 fichiers docs/case-studies/[client]/index.md avec la structure :
- Problème initial (3 lignes + chiffre brut)
- Solution Pinapp (2 étapes clés + outils utilisés)
- Résultat mesurable (1 métrique avant/après)
- Quote client

Puis insère-les dans voyage-v9/index.html après la scène 05 Réalisations, dans une sous-section "05d · Cas clients concrets" inspirée du style .sisters__card mais 1 colonne.
```

### Sprint 1 — Total : ~15 heures sur 2 semaines

---

## 📅 SPRINT 2 — Semaines 4-5

**Objectif** : tout ce qui tourne tourne. Passer au polish design.

### C.1 — Activer chromatic aberration — 30 min (Cursor)

**Prompt Cursor** :
```
Dans voyage-v9/index.html, ajoute la ligne <script src="../assets/js/film-chromatic.js" defer></script> juste avant la fermeture </body> (le fichier existe déjà dans le repo, juste pas référencé). 

Vérifie que le code hue-shift par scène est opérationnel. Teste sur 3 scènes différentes.
```

### C.2 — Custom cursor magnétique — 2h

**Prompt Cursor** :
```
Crée voyage-v9/assets/js/cursor-magnetic.js avec :
- Un cercle 24px qui suit le curseur avec easing
- Effet magnétique sur les .btn, .btn--secondary, .real, .port, .sisters__card (attraction quand le curseur entre dans 80px)
- Se désactive si matchMedia('(hover:hover)') false OU prefers-reduced-motion: reduce
- Mix-blend-mode: difference sur le cercle pour l'inversion couleur sur fond clair

Ajoute le script à voyage-v9/index.html. Style inline minimal dans <style>.
```

### C.3 — Light leak doré radial — 2h

**Prompt Cursor** :
```
Dans voyage-v9/index.html, ajoute un <div class="light-leak"> fixed au-dessus du stage, qui reçoit une animation CSS au changement de stage active. Gradient radial or (#e6b973) + violet subtil, opacity pulse 0 → 0.35 → 0 sur 1.2s. Trigger via IntersectionObserver quand data-active change.

Spec V24-DREAM-SPEC §3 point 3.
```

### C.4 — Parallax 3D hero — 3h

**Prompt Cursor** :
```
Dans voyage-v9/index.html scène 01, ajoute un effet parallax 3 couches :
- arrière-plan : hero-1.webp avec translate-y + scale au scroll
- milieu : particules cyan subtiles
- avant : texte H1 qui reste fixe avec léger translate-z

Utilise transform3d et will-change:transform. Désactive si prefers-reduced-motion.
Effet doit être visible dans les 100 premières vh uniquement.
```

### D.1 — Audit final pricing films IA — déjà fait

Grille suggérée (après audit 3 agents) :
- **Clip 30-60s** : 550 € HT (vs 350 actuel) — aligné freelance senior
- **Court-métrage 1-3 min** : 1 290 € HT (vs 850) — cohérent catalogue
- **Premium bande-annonce** : 2 800 € HT (vs 1 800) — légitimité supervision créative
- **Pack réseaux 4 clips/mois** : 1 900 € HT/mois (vs 1 200) — viable pour duo
- **🆕 Film à offrir** : 390 € HT — nouveau segment B2C cadeau

### D.2 — Intégrer la nouvelle grille films IA dans voyage-v9 — 2h

**Prompt Cursor** :
```
Ajoute une nouvelle sous-scène "05d · Films IA sur mesure" dans voyage-v9/index.html, entre la scène 05 aperçus sectoriels et la scène 06 méthode. Utilise data-stage="04" (même photo que scène 05 Réalisations).

Structure : 
- Eyebrow "05d · Films IA"
- H2 "Un film qui vous ressemble. <em>Ou un cadeau</em> qui marque."
- Grille .films-grid en 4 colonnes desktop, 2 tablet, 1 mobile
- 4 tiers : Clip 550 €, Court-métrage 1 290 € (featured avec badge "★ le plus offert"), Premium 2 800 €, Film cadeau 390 € (badge "NOUVEAU")
- CTA : "Voir les exemples" (vers /realisations/films-ia/) + mention "🎁 Offrir un film : cochez-le dans le diagnostic"

Mets aussi à jour le tableau tarifs scène 13 en insérant 4 lignes entre "Système Complet" et "Pack Duo".

CSS .films-grid, .film-tier, .film-tier--featured, .film-tier__badge inspiré du style .sisters__card et .prices.

Commit "feat(voyage-v9): scène Films IA avec nouvelle grille tarifaire + segment Film à offrir".
```

### D.3 — Ajouter "Film à offrir" dans le formulaire diagnostic — 30 min

**Prompt Cursor** :
```
Dans voyage-v9/index.html scène 14 formulaire, ajoute une option "🎁 Film IA à offrir" dans le <select name="besoin"> juste après "Mémoire & Présence".

Quand cette option est sélectionnée, révèle un champ conditionnel "Qui est le destinataire ?" (input text optionnel).

JS : addEventListener('change', ...) sur le select, toggle .hidden sur le div conditionnel.
```

### Sprint 2 — Total : ~11 heures

---

## 📅 SPRINT 3 — Semaines 6-7

**Objectif** : crédibilité cadencée + easter eggs restants.

### B.4 — LinkedIn Pinapp actif — 1h Lauralie + 30 min/semaine

- Créer la page LinkedIn Pinapp si pas existante
- Lier dans footer voyage-v9
- Publier 1 post par semaine (format simple : réalisation, insight, coulisse)

### B.5 — Bloc "Partenaires technos" — 1h

**Prompt Cursor** :
```
Dans voyage-v9/index.html, ajoute une mini-section "Partenaires technos" dans le footer (juste avant le copyright).

Logos sobres en monochrome ivoire : Anthropic, Stripe, n8n, Hostinger, Bunny Fonts, Plausible, YouSign.

Layout : flex wrap horizontal, opacity 0.5 de base, opacity 1 au hover.
Alt texts descriptifs. Pas de liens (règle .cursorrules "zéro photo publique sans validation" — utilise uniquement les logos officiels que ces services fournissent en libre usage).
```

### B.6 — 1 article de blog "Cas client" — 3h Lauralie+Micha

Ouvrir `/blog/` et écrire 1 article de fond (1000-1500 mots) :
"Comment Clara Fontaine a libéré 5h par semaine grâce à l'automatisation devis + RDV"

Structure : contexte, problème concret, solution technique (avec screenshots n8n), résultat mesuré, enseignements.

### C.5 — Scene counter slot-machine — 1h (déjà codé, à activer)

**Prompt Cursor** :
```
Le fichier scene-counter.js existe dans .claude/worktrees/musing-blackburn-057634/assets/js/. Vérifie son contenu, copie-le dans voyage-v9/assets/js/scene-counter.js si utile, puis référence-le dans voyage-v9/index.html.

Configure pour afficher "01 / 15" top-right fixed, avec animation slot-machine au changement de scène.
```

### C.6 — Morse STAY + Spider-Man phrase — déjà codés, activer

Idem : récupérer depuis `.claude/worktrees/musing-blackburn-057634/assets/js/easter-eggs.js` et référencer.

### C.7 — Sand text reveal — 3h

Nouveau fichier `voyage-v9/assets/css/sand-text.css` + `voyage-v9/assets/js/sand-text.js`.

Animation : chaque lettre de certains H2 se forme en sable (particules qui convergent). Appliquer aux H2 des scènes 01, 12b et 14.

### Sprint 3 — Total : ~8 heures

---

## 📅 SPRINT 4+ — Semaines 8+

### Continues
- **B** : 1 post LinkedIn/semaine, 1 article blog/mois
- **A** : monitoring n8n, dashboard Notion analytics, ajustements flows

### Nice-to-have P2
- Sound design discret (clic, hover, scroll) avec opt-out
- Badge "Connected" pulsant dans nav
- Tilt 3D sur cartes portfolio + duo
- Text split char-by-char sur H1/H2 Fraunces
- Roadmap publique `/roadmap/`
- Newsletter dédiée (Mailerlite ou Buffer)

### Produit
- Pitch deck PDF téléchargeable
- SLA contrat type écrit
- Case studies PDF téléchargeables

---

## 📊 TABLEAU RÉCAPITULATIF

| # | Item | Semaine | Effort | Porté par | Impact |
|---|---|---|---|---|---|
| A.1 | Webhook n8n actif | S1 | 2h | Lauralie | 🔴 CRITIQUE |
| A.2 | DB Notion Leads | S1 | 1h | Lauralie | 🔴 CRITIQUE |
| A.3 | Flipper flags | S1 | 30min | Cursor | 🔴 CRITIQUE |
| A.4 | Test bout-en-bout | S1 | 30min | Lauralie | 🔴 CRITIQUE |
| A.5 | Assurance RC pro | S1 | 1h | Lauralie | 🟠 B2B |
| B.1 | Liste 10 clients | S1 | 1h | Lauralie | 🟠 |
| A.6 | W2 YouSign-Stripe | S2-3 | 3h | Lauralie+Cursor | 🔴 |
| A.7 | W3 Formation seq | S2-3 | 2h | Cursor | 🟡 |
| A.8 | W4 Livraison | S2-3 | 2h | Cursor | 🟡 |
| A.9 | Events Plausible | S2-3 | 1h | Cursor | 🟠 |
| B.2 | Démarcher témoignages | S2-3 | 4h | Lauralie | 🟠 |
| B.3 | 2 case studies | S2-3 | 3h | Lauralie+Claude | 🟠 |
| C.1 | Chromatic activation | S4-5 | 30min | Cursor | 🟡 |
| C.2 | Cursor magnétique | S4-5 | 2h | Cursor | 🟡 |
| C.3 | Light leak | S4-5 | 2h | Cursor | 🟡 |
| C.4 | Parallax hero | S4-5 | 3h | Cursor | 🟡 |
| D.2 | Scène Films IA | S4-5 | 2h | Cursor | 🟠 |
| D.3 | "Film à offrir" form | S4-5 | 30min | Cursor | 🟠 |
| B.4 | LinkedIn + posts | S6-7 | 1h + continu | Lauralie | 🟠 |
| B.5 | Partenaires technos | S6-7 | 1h | Cursor | 🟡 |
| B.6 | 1 article blog | S6-7 | 3h | Lauralie+Micha | 🟠 |
| C.5-7 | Easter eggs + sand | S6-7 | 4h | Cursor | 🟡 |

**Total sur 7 semaines : ~40 heures Lauralie + ~25 heures Cursor prompts.**

---

## 🎯 LA SEMAINE 1 EN 6 ACTIONS

Pour ne pas t'éparpiller, voici les 6 tâches Sprint 0 **dans l'ordre exact** :

1. **Aujourd'hui / demain** : ouvrir Notion, créer DB "Leads Pinapp" (13 colonnes de LEAD_FLOW.md) + récupérer database ID + clé API
2. **Jour suivant** : déployer n8n sur Hostinger OU souscrire n8n cloud (19 €/mois start) + récupérer URL webhook W1
3. **Même jour** : via Cursor, prompt → flipper `features.diagnosticWebhook = true` + ajouter WEBHOOK_URL dans config.js
4. **Même soir** : test bout-en-bout en navigation privée, vérifier ligne Notion
5. **Fin de semaine** : contacter Hiscox pour RC pro (≤ 1h de démarche)
6. **Fin de semaine** : lister 10 anciens clients dans `docs/contacts/anciens-clients-a-contacter.md`

**Après ce sprint 0**, le site n'est plus une brochure — il capte des leads réels, en automatique, 24/7.

---

## 🚦 DÉCISION AUJOURD'HUI

Par quoi tu commences **ce soir** ?

- **1** — Notion DB Leads (20 min)
- **2** — Souscrire n8n cloud (15 min)
- **3** — Les deux (40 min)
- **4** — Lire le plan et planifier demain

Dis-moi et je te guide sur cette tâche précise avec les liens, les specs exactes, et le template Notion prêt à copier.

---

*Plan maître 2026-04-23. Basé sur 5 audits + audits pricing + gaps sessions antérieures.*
