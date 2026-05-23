# 🔌 Brancher les automatisations Pinapp

Tout est câblé côté site. Il reste **2 réglages** côté serveur (5–10 min) — je ne peux pas les faire à distance car ce sont **tes** comptes (n8n + Telegram + Cal.com).

---

## 1. Réservation en ligne (Cal.com) — ✅ déjà fonctionnel
- Le calendrier est **intégré directement dans la page** (section Contact de la home) : le client choisit son créneau → Cal.com gère **confirmation, ajout au calendrier et rappels** automatiquement.
- Lien utilisé : `lauralie-daguzay-hdglzw/diagnostic`.
- **À vérifier de ton côté** : que ce lien Cal.com existe bien et que l'événement « diagnostic » est actif. Si ton identifiant Cal.com a changé, dis-le-moi (je remplace `lauralie-daguzay-hdglzw/diagnostic` dans la home).

## 2. Formulaire → Telegram (n8n) — à brancher
Le formulaire envoie tout (champs + pièces jointes) en `POST` vers un **webhook n8n**.

### a) Importer le workflow
1. Ouvre ton n8n → **Workflows → Import from File** → choisis `n8n-brief-pinapp.json`.
2. Le workflow contient : **Webhook → Formater le message → Telegram**.

### b) Créer le bot Telegram (une fois)
1. Sur Telegram, parle à **@BotFather** → `/newbot` → récupère le **token**.
2. Dans n8n → **Credentials → New → Telegram API** → colle le token (nomme-la « Pinapp Bot »).
3. Récupère ton **chat ID** : écris un message à ton bot, puis ouvre
   `https://api.telegram.org/bot<TON_TOKEN>/getUpdates` → copie `chat.id`.
4. Dans le nœud **Telegram → Lauralie** : mets ce `chat ID` à la place de `REMPLIR_VOTRE_CHAT_ID_TELEGRAM`, et sélectionne la credential « Pinapp Bot ».

### c) Connecter le site au webhook
1. Active le workflow → copie l'**URL de production du webhook** (ex. `https://TON-N8N/webhook/brief-pinapp`).
2. Dans la home, remplace l'URL placeholder :
   - Fichier : `voyage-sunmetalon/index.html` **et** `index.html` (cherche `PINAPP_WEBHOOK`).
   - Remplace `https://n8n.pinapp.fr/webhook/brief-pinapp` par ton URL réelle.
   - (ou dis-le-moi, je le fais en 30 s.)

### Résultat
Chaque brief rempli sur le site → message Telegram instantané chez toi, avec tout le détail + le nombre de pièces jointes. Tu n'as plus qu'à répondre.

> Optionnel : ajoute un nœud **Telegram → Michaël** (même message, autre chat ID) pour les briefs « image », ou un nœud **Google Drive / email** pour stocker les pièces jointes (`item.binary`).

---

## Récap : qui fait quoi
| Brique | État | Action |
|---|---|---|
| Réservation Cal.com (inline) | ✅ marche | Vérifier le lien/événement actif |
| Formulaire → n8n (multipart + fichiers) | ✅ câblé | Coller l'URL webnook réelle |
| n8n → Telegram | 📦 workflow fourni | Importer + bot Telegram + chat ID |
| Fallback email | ✅ marche | Rien à faire |
