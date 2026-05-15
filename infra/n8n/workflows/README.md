# Workflows n8n — dossier `infra/n8n/workflows/`

Fichiers JSON prêts à **Importer** dans l’admin n8n (self-hosted `n8n.pinapp.fr` ou cloud). Aucun secret dans le dépôt : tokens Telegram, chat ID, etc. restent dans **Variables d’environnement** n8n / credentials UI.

## `diagnostic-lead.json` — lead formulaire pinapp.fr

### Importer (3 étapes)

1. Ouvrir n8n en navigateur, se connecter (compte admin).
2. Menu **Workflows** → bouton **Import from File** (ou **Import** selon la version).
3. Choisir `diagnostic-lead.json` → **Save** / **Import** ; ouvrir le nœud **Telegram** et lier la **credential** « Telegram API » (bot) ; vérifier que `TELEGRAM_CHAT_ID` est défini sur le serveur (variable d’environnement n8n).

Après import, le workflow peut déjà être **actif** (`active: true` dans le JSON) ; sinon l’activer dans l’UI pour enregistrer l’URL webhook `https://n8n.pinapp.fr/webhook/diagnostic-lead`.

### Tester

**Préflight CORS (depuis pinapp.fr)**

```bash
curl -sSI -X OPTIONS 'https://n8n.pinapp.fr/webhook/diagnostic-lead' \
  -H 'Origin: https://pinapp.fr' \
  -H 'Access-Control-Request-Method: POST' | grep -i access-control
```

**POST de test (JSON minimal)**

```bash
curl -sS -X POST 'https://n8n.pinapp.fr/webhook/diagnostic-lead' \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://pinapp.fr' \
  -d '{"prenom":"Test","nom":"Cursor","entreprise":"Pinapp","email":"test@example.com","tel":"0600000000","path":"tech","message":"Ping depuis curl"}'
```

Réponse attendue du nœud **Respond to Webhook** : corps JSON du type `{"status":"received"}` (HTTP 200).

### Note technique (webhook)

Le fichier utilise `responseMode: "responseNode"` + le nœud **Respond to Webhook** pour renvoyer `{"status":"received"}` **après** l’envoi Telegram. Le mode « immédiat à la réception » (`onReceived`) ne permet pas cette chaîne avec réponse personnalisée en fin de flux.

### Variable serveur

| Variable | Rôle |
|----------|------|
| `TELEGRAM_CHAT_ID` | ID du chat / groupe qui reçoit le message (identique au pattern des autres workflows Pinapp). |

Le **Bot Telegram** doit être créé auprès de `@BotFather` ; la **credential** n8n stocke le token du bot (hors dépôt).
