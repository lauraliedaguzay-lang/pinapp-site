# PINAPP INC. — WORKFLOWS N8N

## 8 workflows · Self-hosted Hostinger · Gratuit illimité

| #   | Nom                      | Déclencheur      | Résultat                               |
| --- | ------------------------ | ---------------- | -------------------------------------- |
| W1  | 🔷 Prospect entrant      | Tally webhook    | CRM Notion + email Lauralie + accusé   |
| W2  | 🔷 Devis → Paiement      | Notion trigger   | YouSign → Stripe → facture             |
| W3  | 🔷 Formation + Séquence  | Stripe webhook   | Accès + J1/J3/J7/J14 + upsell          |
| W4  | 🔷 Livraison → Avis      | Notion trigger   | Email livraison + avis Google J+7      |
| W5  | 🌿 M&P Contact           | Tally webhook    | WhatsApp Micha + email famille         |
| W6  | 🔷 Veille → Content      | Cron lundi 8h    | Claude → Buffer LinkedIn + newsletter  |
| W7  | 🔷 Maintenance mensuelle | Cron 1er du mois | Rapport CA + relance impayés           |
| W8  | 🔷 Auralis Aurora        | Webhook          | Claude router ACTION/FORMATION/SUPPORT |

## Installation

1. Importer chaque JSON dans n8n (Menu → Import)
2. Configurer les credentials (voir .env.template)
3. Activer les workflows un par un
4. Tester W1 en premier avec un formulaire Tally test

## Ordre recommandé

Jour 1 : W1 + W5 (contacts entrants)
Jour 2 : W2 + W3 (devis + formations)
Jour 3 : W4 + W6 (livraison + contenu)
Semaine 2 : W7 + W8 (maintenance + Auralis)

## Approbation mobile (Telegram) — modèles W9–W11

| Fichier | Rôle |
| --- | --- |
| `W9-diagnostic-telegram-approval.json` | Webhook diagnostic → Telegram Lauralie (HTTP Bot API) + note pour brancher **Wait** puis email client. |
| `W10-mp-micha-telegram-approval.json` | Webhook contact Mémoire & Présence → Telegram Micha + note Wait / email. |
| `W11-auralis-lead-magnet-auto.json` | Lead magnet Auralis → envoi email HTTP (sans étape d’approbation). |

**Variables d’environnement** (Hostinger / n8n) : `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_LAURALIE`, `TELEGRAM_CHAT_MICHA`, `LEAD_FROM`, `LEAD_MAGNET_MAIL_API` (optionnel), clé Resend ou autre selon le nœud final. **Aucun secret dans le dépôt.**

Après import, remplacez le nœud HTTP email de W11 par Gmail / SMTP n8n si vous préférez les credentials intégrés.

## Formulaire `/diagnostic/` (site statique)

Le front envoie un JSON `POST` (ou `multipart/form-data` avec champ `payload` + fichier) vers `window.__PINAPP__.WEBHOOK_DIAGNOSTIC` ou `WEBHOOK_N8N`. Champs utiles : `vous`, `entreprise`, `besoin`, `message_libre`, `meta`, `telegram_digest` (texte prêt pour Telegram), `submittedAt`, `source`.

## Kit Prompt Artisan — Stripe → n8n (19,90 € TTC)

À brancher quand le **Payment Link** Stripe du kit est en ligne (**19,90 €** TTC, paiement unique) et que la page de confirmation Stripe pointe vers `https://pinapp.fr/merci-kit/`.

1. **Stripe** : Développeurs → Webhooks → Ajouter l’endpoint → URL du webhook n8n (production). Événement : `checkout.session.completed`.
2. **n8n** : Webhook (POST) → valider la signature Stripe (secret du webhook) → extraire `customer_email`, `customer_details.name`.
3. **Email** : envoyer le message avec les livrables (PDF + lien Notion du kit), d’après le modèle `emails/sequences/C1-kit-prompts-immediat.txt`.
4. **Telegram** (optionnel) : « Vente Kit Prompts — {nom} — 19,90 € » vers `TELEGRAM_CHAT_LAURALIE`.
5. **CRM** : ligne Notion ou Google Sheet (nom, email, date, produit, montant).

Le site : variable `STRIPE_KIT_PAYMENT_LINK` dans `formations/kit-prompts/index.html` (script en bas) ; livrables dans `merci-kit/index.html` (PDF + script `NOTION_KIT`).

**Stripe (dashboard)** : un produit « Kit Prompt Artisan — 50 prompts IA », un prix **19,90 €** TTC, un **lien de paiement** — coller l’URL dans `STRIPE_KIT_PAYMENT_LINK`. Guide pas à pas : `docs/stripe-kit-prompt-artisan-setup.md`.
