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
