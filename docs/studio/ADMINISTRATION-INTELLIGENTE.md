# Pinapp Studio — gestion administrative intelligente (Lauralie & Michaël)

## Processus unique (squelette + détail Claude)

Un **fil unique** par acteur — **client**, **Lauralie**, **Michaël** — volontairement **minimal**. Le détail opérationnel (checklists, ordre, questions manquantes) est **généré par Claude** à partir de ce squelette : voir **`docs/studio/PROCESSUS-UNIQUE-PINAPP.md`**.

## Canal client vs canal studio

- **Client** : tout passe par **Pinapp** (questionnaire + **zone message** sur le diagnostic). Il ne doit pas avoir à ouvrir WhatsApp ou sa messagerie pour _lancer_ une demande.
- **Studio (Lauralie & Michaël)** : réception et orchestration **en interne** — e-mail, WhatsApp, **Claude** (préparation / structuration), n8n, Netlify — selon vos workflows. La **réponse formalisée** (plan, devis) revient en général sur **l’e-mail du client** pour trace et relecture.

## Objectif

Réduire la charge cognitive et les oublis, **sans** remplacer les décisions juridiques, comptables ou les engagements contractuels. Le système combine :

1. **Automatisations** (n8n, Netlify, webhooks) pour l’entrée des leads et les notifications.
2. **Une base de vérité** (Notion, Airtable ou équivalent) pour les dossiers clients et le pipeline.
3. **La console interne** `/admin/` — onglet **Gestion studio** : checklists par rôle, persistance locale, récap copiable pour un message rapide à l’autre.

## Rôles suggérés

| Zone                     | Lauralie                                               | Michaël                                                   |
| ------------------------ | ------------------------------------------------------ | --------------------------------------------------------- |
| Entrées commerciales     | Diagnostic, devis, relances, validation « approve »    | Appui technique sur les réponses si besoin                |
| Contenu site & catalogue | Validation éditoriale, offres, conformité des messages | Mise à jour `pinapp-catalog.json`, pages formation, démos |
| Livraison client         | Contrat, planning, facturation (PP-)                   | Storyboards, pédagogie, revue technique                   |
| Veille & sécurité        | Lecture des digests, arbitrage                         | Mise en œuvre correctifs simples sur le dépôt si convenu  |

Ajustez la répartition dans votre outil de tâches ; les listes de l’admin sont des **rappels**, pas un contrat de responsabilité.

## Flux « intelligents » déjà prévus dans le dépôt

- **Leads** : `AUTOMATIONS.md` — diagnostic, onboarding, webhook n8n, fonction Netlify `approve`.
- **E-mails assistés** : `docs/automation/DIGESTS-EMAIL-PINAPP.md` — veille tech, rappels RH / admin (brouillons, pas envoi engageant sans validation).
- **Veille offres & IA créative (Michaël / site)** : `docs/automation/VEILLE-IA-CREATIVE-PINAPP.md` — Higgsfield, vidéo/photo génératifs, Adobe Firefly ; modèle de digest + sources.
- **RGPD / limites** : `docs/claude-consultation/06-VEILLE-RH-ADMIN.md` et règle Cursor `pinapp-veille-rh-admin.mdc`.

## Console `/admin/`

- URL : `https://pinapp.fr/admin/` (non référencée dans le menu public ; `robots.txt` contient `Disallow: /admin/`).
- **Mot de passe** : défini dans `assets/js/admin-dashboard.js` — à changer avant production ; pour une vraie protection, ajouter **Basic Auth** ou équivalent côté hébergeur.
- Onglet **Gestion studio** : coches stockées en **localStorage** (par navigateur). Nouvelle **semaine ISO** = liste remise à zéro automatiquement. Bouton de reset manuel si besoin.

## Évolutions possibles (hors site statique)

- Synchroniser les mêmes tâches vers **Notion** via n8n (webhook + API).
- Tableau **Airtable** « Studio » relié à `approve.js` pour l’historique des décisions.
- Rappels **WhatsApp** internes (déjà documentés dans `AUTOMATIONS.md` pour les leads ; duplicable pour tâches récurrentes avec parcimonie).

## Rappel

Tout ce qui part vers un **tiers** ou engage la **société** : **brouillon validé par un humain**, comme pour les e-mails clients.
