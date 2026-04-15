# PINAPP INC. — DOCUMENTATION AUTOMATISATIONS N8N

**Médias (vidéos, photos, sites démo) :** ce fichier ne les couvre pas — voir **`GUIDE-CONTENU.md`** à la racine du dépôt.

## 8 Workflows · Stack : n8n + Tally + YouSign + Stripe + Notion + Gmail + Buffer + Claude API

---

## Mise en service du site (webhooks + Tally)

Sans cette étape, le dépôt reste volontairement **hors ligne** côté automatisations : `assets/js/config.js` contient `https://[TON-N8N]` et les feature flags restent à `false` jusqu’au build de production.

1. **n8n** : créez les workflows qui exposent les chemins `/webhook/diagnostic-lead`, `/webhook/onboarding-lead`, etc. (voir exports dans `n8n-workflows/`).
2. **Secrets GitHub** (Settings → Secrets → Actions) : ajoutez au minimum  
   `PINAPP_N8N_BASE_URL` = `https://VOTRE_INSTANCE.n8n.cloud`  
   (ou `PINAPP_N8N_HOST` = `VOTRE_INSTANCE.n8n.cloud`).  
   Optionnel : `PINAPP_TALLY_DIAGNOSTIC_DEFAULT` = ID du formulaire embed Tally (page `/diagnostic/`).
3. **Push sur `main`** : le workflow « Déployer GitHub Pages » lance `npm run build`, qui réécrit **`_site/` uniquement** : URLs réelles + flags à `true` pour les webhooks listés dans `config.js`.
4. **Alternative locale** : copiez `pinapp-automation.env.example` → `pinapp-automation.env`, remplissez les variables, puis `npm run build` avant tout déploiement manuel.
5. **Diagnostic** : le flux principal est **Tally → n8n** (intégration native Tally). Les appels `sendDiagnosticLead` dans `votre-projet/` et `client/` partent du navigateur vers n8n : CORS doit être accepté côté n8n (ou proxy).
6. **Netlify Functions** (`approve`, etc.) : l’URL dans `approveEndpoint` suppose un déploiement **Netlify** (ou équivalent). Sur **GitHub Pages seul**, ces URLs ne s’exécutent pas — prévoir un hébergeur fonctions ou retirer ce maillon du workflow.

---

## 01 — Diagnostic entrant 🔷

**Déclencheur :** Formulaire Tally soumis (diagnostic/index.html)
**Actions :**

1. Webhook Tally → n8n
2. Fiche prospect créée dans Notion (DB Prospects)
3. Email confirmation automatique au prospect
4. Notification 🔷 à contact@pinapp.fr
5. Relance automatique à 24h si pas de réponse

**À configurer :** ID DB Notion · ID formulaire Tally · Email Pinapp

---

## 02 — Devis → Signature → Facture 🔷

**Déclencheur :** Signature YouSign détectée
**Actions :**

1. Webhook YouSign → n8n
2. Facture Stripe générée automatiquement
3. Lien de paiement envoyé au client
4. Notion statut → "En cours"
5. Notification 🔷 Pinapp

**À configurer :** Clé API YouSign · Clé API Stripe · ID DB Notion

---

## 03 — Paiement reçu 🔷

**Déclencheur :** Webhook Stripe (payment_intent.succeeded)
**Actions :**

1. Email confirmation client
2. Accès formation débloqué si applicable
3. Notion statut → "Payé" + date
4. Notification 🔷 Pinapp

**À configurer :** Clé Stripe webhook · URLs formations · ID DB Notion

---

## 04 — Formation séquence email 🔷

**Déclencheur :** Achat formation confirmé
**Actions :**

1. J+0 : Email bienvenue + lien accès
2. J+1 : Relance module 1
3. J+3 : Point progression
4. J+14 : Proposition upsell formation supérieure
5. J+30 : NPS + avis

**À configurer :** URLs formations · URL upsell · NPS form ID

---

## 05 — Livraison projet 🔷

**Déclencheur :** Notion statut → "Livré" (webhook)
**Actions :**

1. Email livraison + lien livrable
2. Formulaire feedback Tally envoyé
3. J+7 : Relance avis Google
4. J+30 : Proposition maintenance mensuelle

**À configurer :** URL Google Reviews · URL feedback Tally · URL maintenance

---

## 06 — Contact M&P 🌿

**Déclencheur :** Formulaire contact memoireetpresence.fr
**Actions :**

1. Fiche créée dans Notion M&P (DB séparée)
2. Email confirmation à la famille
3. Notification WhatsApp → Micha (06 59 88 20 15)
4. Comptabilité M&P séparée automatiquement

**À configurer :** Token WhatsApp Business · ID DB Notion M&P · Tel Micha

---

## 07 — Veille hebdo IA 🔷

**Déclencheur :** Tous les lundis à 8h
**Actions :**

1. Scrape flux RSS sources IA
2. Claude API résume les 5 actus clés pour TPE/PME
3. Draft LinkedIn créé dans Buffer (validation manuelle)
4. Notion Newsletter mis à jour

**À configurer :** Clé API Claude · Profil Buffer · Sources RSS

---

## 08 — Maintenance mensuelle 🔷

**Déclencheur :** 1er du mois à 9h
**Actions :**

1. Lecture DB clients Notion (filtre : actifs)
2. Email rapport mensuel automatisé
3. Relance factures impayées > 30j
4. Export comptable Notion (séparation Pinapp/M&P)

**À configurer :** DB clients Notion · Template rapport · Seuil relance

---

## VARIABLES À CONFIGURER DANS N8N

```
NOTION_DB_PROSPECTS     = [ID de votre DB Prospects]
NOTION_DB_CLIENTS       = [ID de votre DB Clients]
NOTION_DB_MP            = [ID de votre DB M&P]
NOTION_DB_COMPTA        = [ID de votre DB Comptabilité]
NOTION_DB_NEWSLETTER    = [ID de votre DB Newsletter]
TALLY_FORM_DIAGNOSTIC   = [ID de votre formulaire Tally]
TALLY_FORM_FEEDBACK     = [ID de votre formulaire feedback]
STRIPE_WEBHOOK_SECRET   = [Clé webhook Stripe]
YOUSIGN_API_KEY         = [Clé API YouSign]
CLAUDE_API_KEY          = [Clé API Claude]
BUFFER_PROFILE_ID       = [ID profil Buffer LinkedIn]
GOOGLE_REVIEWS_URL      = [URL avis Google Pinapp]
MICHA_WHATSAPP          = [Numéro WhatsApp Micha]
EMAIL_PINAPP            = contact@pinapp.fr
EMAIL_MICHA             = micha@memoireetpresence.fr
```

---

## NOTIFICATIONS

- 🔷 Pinapp Studio → contact@pinapp.fr
- 🌿 Mémoire & Présence → WhatsApp Micha (06 59 88 20 15)
- Comptabilité séparée dans Notion : onglet Pinapp / onglet M&P
