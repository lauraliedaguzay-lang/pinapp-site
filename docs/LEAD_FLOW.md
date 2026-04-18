# Pinapp — Pipeline de leads (diagnostic)

## Architecture

```
Visiteur pinapp.fr
   ↓ POST JSON (Content-Type: application/json)
Webhook n8n cloud
   ↓
Validate & Score (nœud Code)
   ↓
   ├─→ Notion — fiche lead structurée
   ├─→ Email de confirmation au prospect (Gmail / SMTP selon credential)
   └─→ Slack — résumé qualifié (Incoming Webhook)
```

## Configuration n8n cloud

1. Importer `n8n-workflows/diagnostic-pinapp.json` dans n8n cloud.
2. Configurer les credentials :
   - **Notion** : OAuth2, accès à la base « Leads Pinapp ».
   - **Gmail** (ou SMTP) : envoi depuis `contact@pinapp.fr` (ou expéditeur validé).
3. Définir les variables d’environnement n8n :
   - `NOTION_DB_LEADS_ID` : ID de la base Notion.
   - `SLACK_WEBHOOK_URL` : URL Incoming Webhook Slack.
4. Ouvrir le nœud **Create Notion Lead** et aligner `propertyValues` sur les **noms et types** réels des propriétés Notion (le JSON du dépôt est un modèle).
5. Activer le workflow, puis copier l’URL publique du webhook.
6. Coller l’URL dans `index.html` (bloc `<head>` existant, à côté de `window.__PINAPP__`) :

```html
<script>
  window.__PINAPP__ = Object.assign({}, window.__PINAPP__ || {}, { /* … */ });
  window.PINAPP_WEBHOOK_URL = 'https://votre-instance.app.n8n.cloud/webhook/pinapp-diagnostic';
</script>
```

Optionnel : renseigner aussi `window.__PINAPP__.WEBHOOK_DIAGNOSTIC` dans le bloc `<head>` (le script `assets/js/diag-form.js` utilise `PINAPP_WEBHOOK_URL` en priorité).

## Base Notion « Leads Pinapp »

Créer une base avec des colonnes cohérentes avec le mapping du workflow (à adapter) :

| Nom de colonne | Type | Options / remarques |
|----------------|------|----------------------|
| Name (titre) | Title | Titre de la page |
| Email | Email | — |
| Téléphone | Phone | — |
| Entreprise | Texte enrichi ou texte | — |
| Secteur | Select | Valeurs du formulaire (restaurant, coiffeur, …) |
| Projets | Multi-select | site, auto, ia, video, conseil, formation |
| Budget | Select | lt2k, 2k-5k, 5k-10k, 10k-25k, gt25k, unknown |
| Urgence | Select | asap, 1-3m, 3-6m, explore, non-precise |
| Score | Number | 0–100 |
| Tier | Select | hot, warm, cold |
| Source | Select | google, linkedin, bao, memoire, article, autre, non-precise |
| Description | Texte enrichi ou texte | — |
| Statut | Select | Nouveau, Qualifié, Devis envoyé, Signé, Perdu |

L’ID de la base se lit dans l’URL Notion : `https://www.notion.so/{workspace}/{DB_ID}?v=…`

## Slack `#pinapp-leads`

1. Créer le canal `#pinapp-leads`.
2. Ajouter une app **Incoming Webhooks** (Slack App Directory).
3. Copier l’URL → variable `SLACK_WEBHOOK_URL`.

Le message inclut un préfixe visuel selon le tier (hot / warm / cold) dans le nœud Code (`_slack_emoji`).

## Scoring (côté serveur, nœud Code)

Référence alignée sur la logique du workflow importé : budget, urgence, nombre de types de projet cochés, longueur de la description, présence entreprise / téléphone / site.

## Accès des leads pour Claude / relecture

1. **Notion** : partager ou exporter la page.
2. **Slack** : copier le message du canal.
3. Le payload JSON inclut les champs du formulaire + `_meta` (URL, referrer, user agent, viewport, etc.) + `_server_score`, `_tier`, `_projets_str`.

## Anti-spam

- **Honeypot** : champ `website` masqué. Si rempli → réponse HTTP 200 « reçu » sans traitement (silent).
- **Validation** : champs requis, email, au moins une case « projet ».
- **Rate limiting** : à activer côté n8n / proxy si besoin.

## Tracking Plausible

Événements personnalisés côté front (si `plausible` est chargé) :

- `Diagnostic Submit` — props : `secteur`, `budget`, `score`
- `Diagnostic Error` — props : `error`

À déclarer comme objectifs dans le tableau de bord Plausible si besoin.

## Test

1. Mode test n8n ou workflow actif.
2. Soumission depuis la page d’accueil (navigation privée).
3. Vérifier : ligne Notion, email reçu, message Slack, réponse JSON `success: true`.

## Panne n8n

Le formulaire affiche une erreur et propose `contact@pinapp.fr`.

---

_Dernière mise à jour : Phase 4 — avril 2026_
