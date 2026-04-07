# Pinapp Studio — Guide Automatisations Stratégiques
## Système WhatsApp "1 clic = approuver" + 10 workflows n8n

---

## Vue d'ensemble

```
Lead soumet diagnostic → n8n → WhatsApp (Lauralie) → Clic sur lien → Décision enregistrée → Email auto au lead
```

---

## Setup en 4 étapes

### Étape 1 — Variables d'environnement Netlify

Dans **Netlify > Site settings > Environment variables**, ajouter :

| Variable | Valeur |
|---|---|
| `APPROVE_SECRET` | Générer avec : `openssl rand -hex 32` |
| `N8N_APPROVE_URL` | `https://[TON-N8N]/webhook/lead-decision` |

### Étape 2 — WhatsApp Business API

**Option A (recommandée) : Twilio WhatsApp**
1. Créer compte Twilio → activer sandbox WhatsApp
2. Dans n8n : nœud "HTTP Request" vers `https://api.twilio.com/2010-04-01/Accounts/{SID}/Messages.json`
3. Coût : ~0,005€/message

**Option B : Meta Cloud API (gratuit jusqu'à 1000 conv/mois)**
1. business.facebook.com → WhatsApp Business
2. Générer token permanent dans n8n

### Étape 3 — Importer les workflows n8n

Copier-coller les JSON ci-dessous dans n8n (Import > Paste JSON).

### Étape 4 — Activer les feature flags

Dans `assets/js/config.js` :
```js
features: {
  diagnosticWebhook: true,   // après import workflow ①
  onboardingWebhook: true,   // après import workflow ③
  whatsappNotifs: true,       // après setup WhatsApp
}
```

---

## Les 10 automatisations par priorité

### 🔴 CRITIQUE

#### ① Lead Entrant — Diagnostic
**Déclencheur** : Soumission formulaire `diagnostic` (Netlify Forms webhook)
**Actions** :
1. Créer fiche lead dans Notion/Airtable (nom, email, secteur, besoin, budget)
2. Scorer le lead (budget > 500€ = score A, < 500€ = score B)
3. Envoyer message WhatsApp à Lauralie avec bouton "Approuver" et "Décliner"
4. Envoyer email accusé de réception au prospect

**Webhook Netlify** : Configurer dans Netlify > Forms > Notifications > Outgoing webhook
```
URL : https://[TON-N8N]/webhook/diagnostic-lead
```

**Lien WhatsApp généré par n8n** :
```
https://pinapp.fr/.netlify/functions/approve?id={{leadId}}&token={{hmacToken}}&action=approve
```

---

#### ② Approve/Decline (WhatsApp 1 clic)
**Déclencheur** : GET `https://pinapp.fr/.netlify/functions/approve?...`
**Actions** :
- **Si approve** : Email auto au prospect ("Bonjour, j'ai bien reçu votre demande...") + statut CRM = Qualifié + tâche Notion "RDV à planifier"
- **Si decline** : Statut CRM = Archivé, aucun email

---

#### ④ Relance 24h si aucune décision
**Déclencheur** : Cron toutes les heures (n8n)
**Logique** : Lire Notion/Airtable, chercher leads avec statut "Nouveau" créés depuis > 24h
**Action** : WhatsApp de rappel à Lauralie

---

### 🟡 IMPORTANT

#### ③ Onboarding Questionnaire
**Déclencheur** : Completion du questionnaire 4 étapes sur index.html
**Actions** :
1. Créer lead dans CRM (secteur, budget, urgence)
2. Envoyer email de présentation personnalisée selon secteur
3. (Si budget < 297€) Envoyer contenu éducatif au lieu d'offre directe

---

#### ⑤ Lead Magnet — Guide offert
**Déclencheur** : Soumission formulaire `lead-guide-gratuit`
**Actions** :
1. Envoyer PDF/lien guide par email immédiatement
2. Séquence de 3 emails sur 7 jours (J+0, J+2, J+7) :
   - J+0 : Guide + mise en contexte
   - J+2 : Cas concret d'artisan (témoignage)
   - J+7 : Invitation diagnostic gratuit

---

#### ⑥ Pipeline Projet Signé
**Déclencheur** : Webhook manuel (depuis CRM quand Lauralie marque "Signé") ou paiement Stripe
**Actions** :
1. Créer dossier Google Drive avec structure type
2. Créer page Notion client avec checklist projet
3. Envoyer email de bienvenue au client avec accès dossier
4. Créer rappels automatiques à J+3, J+7, J+14

---

#### ⑦ Rapport hebdomadaire
**Déclencheur** : Cron lundi 9h
**Actions** :
1. Lire stats Plausible Analytics (visiteurs, pages vues, conversions)
2. Compter leads de la semaine dans CRM
3. Envoyer résumé WhatsApp (3 lignes max)

---

### 🟢 NICE-TO-HAVE

#### ⑧ Aurora IA (quand activé)
**Déclencheur** : Analyse demandée sur pinapp.fr
**Actions** : Relay vers Claude API, réponse enrichie, log dans CRM

#### ⑨ Demande d'avis automatique
**Déclencheur** : 48h après livraison projet (webhook manuel)
**Actions** : Email automatique avec lien Google My Business + Trustpilot

#### ⑩ Surveillance SEO
**Déclencheur** : Cron hebdomadaire
**Actions** : Vérifier positions sur 5 mots-clés cibles via API (SerpApi), alerte si chute > 5 places

---

## Workflow n8n ① — Lead Entrant (JSON à importer)

```json
{
  "name": "Pinapp — Lead Diagnostic",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "diagnostic-lead",
        "responseMode": "onReceived",
        "responseData": "allEntries"
      },
      "name": "Webhook Lead",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "functionCode": "// Préparer les données du lead\nconst body = $input.first().json.body || $input.first().json;\nconst leadId = 'LEAD-' + Date.now();\n\nreturn [{\n  json: {\n    leadId,\n    nom:     body.nom || body.name || 'Prospect',\n    email:   body.email || '',\n    secteur: body.secteur || '',\n    besoin:  body.besoin || '',\n    budget:  body.budget || '',\n    message: body.message || '',\n    score:   (body.budget || '').includes('1000') ? 'A' : 'B',\n    createdAt: new Date().toISOString()\n  }\n}];"
      },
      "name": "Préparer Lead",
      "type": "n8n-nodes-base.function",
      "position": [450, 300]
    },
    {
      "parameters": {
        "url": "=https://pinapp.fr/.netlify/functions/approve",
        "method": "GET",
        "options": {}
      },
      "name": "Note: Approve URL Builder",
      "type": "n8n-nodes-base.noOp",
      "position": [450, 460],
      "notes": "URL à construire dans le nœud WhatsApp : \\nhttps://pinapp.fr/.netlify/functions/approve?id={{leadId}}&token={{hmacToken}}&action=approve"
    },
    {
      "parameters": {
        "authentication": "serviceAccount",
        "resource": "page",
        "operation": "create",
        "pageId": "VOTRE_PAGE_NOTION_ID",
        "title": "={{ $json.nom }} — {{ $json.secteur }}",
        "propertiesUi": {
          "propertyValues": [
            { "key": "Email", "value": "={{ $json.email }}" },
            { "key": "Budget", "value": "={{ $json.budget }}" },
            { "key": "Score", "value": "={{ $json.score }}" },
            { "key": "Statut", "value": "Nouveau" },
            { "key": "Lead ID", "value": "={{ $json.leadId }}" }
          ]
        }
      },
      "name": "Créer fiche Notion",
      "type": "n8n-nodes-base.notion",
      "position": [650, 220]
    },
    {
      "parameters": {
        "from": "Pinapp Studio <noreply@pinapp.fr>",
        "to": "={{ $json.email }}",
        "subject": "J'ai bien reçu votre demande — Pinapp Studio",
        "html": "<p>Bonjour {{ $json.nom }},</p><p>Je viens de recevoir votre demande concernant <strong>{{ $json.besoin }}</strong>.</p><p>Je vous réponds personnellement sous 24h avec des pistes concrètes — même si vous ne choisissez pas Pinapp.</p><p>À très vite,<br>Lauralie<br>Pinapp Studio</p>"
      },
      "name": "Email accusé réception",
      "type": "n8n-nodes-base.emailSend",
      "position": [650, 380]
    },
    {
      "parameters": {
        "to": "+33XXXXXXXXX",
        "message": "=🔔 Nouveau lead {{ $json.score }} — {{ $json.nom }}\\nSecteur: {{ $json.secteur }}\\nBesoin: {{ $json.besoin }}\\nBudget: {{ $json.budget }}\\n\\n✅ Approuver: https://pinapp.fr/.netlify/functions/approve?id={{ $json.leadId }}&token=TOKEN_A_GENERER&action=approve\\n❌ Décliner: https://pinapp.fr/.netlify/functions/approve?id={{ $json.leadId }}&token=TOKEN_A_GENERER&action=decline"
      },
      "name": "WhatsApp Lauralie",
      "type": "n8n-nodes-base.twilio",
      "position": [650, 540],
      "notes": "Remplacer TOKEN_A_GENERER par un nœud HMAC crypto avant ce step"
    }
  ],
  "connections": {
    "Webhook Lead": { "main": [[{ "node": "Préparer Lead", "type": "main", "index": 0 }]] },
    "Préparer Lead": {
      "main": [[
        { "node": "Créer fiche Notion", "type": "main", "index": 0 },
        { "node": "Email accusé réception", "type": "main", "index": 0 },
        { "node": "WhatsApp Lauralie", "type": "main", "index": 0 }
      ]]
    }
  }
}
```

---

## Note sur la génération du token HMAC

Dans n8n, ajouter un nœud **Code** avant le nœud WhatsApp :

```javascript
const crypto = require('crypto');
const id     = $input.first().json.leadId;
const secret = process.env.APPROVE_SECRET; // variable d'env n8n

const token = crypto.createHmac('sha256', secret).update(id).digest('hex');

return [{ json: { ...$input.first().json, approveToken: token } }];
```

Puis utiliser `{{ $json.approveToken }}` dans les URLs WhatsApp.

---

## Checklist de mise en production

- [ ] Créer variable `APPROVE_SECRET` dans Netlify et n8n (même valeur)
- [ ] Créer variable `N8N_APPROVE_URL` dans Netlify
- [ ] Configurer WhatsApp Business (Twilio ou Meta)
- [ ] Importer workflow JSON dans n8n
- [ ] Configurer Netlify Forms webhook → URL n8n
- [ ] Tester en envoyant un diagnostic de test
- [ ] Vérifier que le WhatsApp arrive bien
- [ ] Cliquer "Approuver" → vérifier page de confirmation
- [ ] Vérifier email auto au prospect
- [ ] Passer `diagnosticWebhook: true` dans config.js
- [ ] Déployer et surveiller les premières soumissions
