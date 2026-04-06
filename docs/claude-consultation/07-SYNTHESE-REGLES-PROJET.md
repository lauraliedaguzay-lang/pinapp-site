# 07 — Synthèse des règles projet Pinapp (Cursor / interne)

> **GitHub :** [ce fichier](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/07-SYNTHESE-REGLES-PROJET.md) · [dossier `claude-consultation`](https://github.com/lauraliedaguzay-lang/pinapp-site/tree/main/docs/claude-consultation)

> Ce fichier résume les **intentions** codées dans `.cursor/rules/` pour **pinapp-site**.  
> **Attention** : certaines règles peuvent être **aspirationnelles** (ex. Netlify Forms) alors que le site, **au moment de la rédaction du dossier consultation**, reposait surtout sur **mailto** et **console.log** pour les parcours — voir `01-CONTEXTE-ET-SITE.md`.

## Identité & périmètre

- Projet **pinapp-site** ; marque **Pinapp Studio** ; **ne pas** mélanger textes ou visuels d’autres marques.
- Workspace typique : dossier `pinapp-site` ; déploiement **GitHub Actions → GitHub Pages** ; domaine **pinapp.fr**.

## Uptime & exploitation (`uptime-continu.mdc`)

- Sites livrés **disponibles en continu** ; privilégier hébergement **managé**, **push to deploy**, health checks + alertes.
- Éviter serveur perso à maintenir à la main pour la vitrine.

## Mail + Claude (`pinapp-mail-claude-validation.mdc`)

- Claude **analyse** et **propose** ; Lauralie **valide toujours** avant envoi client.
- **Brouillons** pour contenus générés ; pas d’envoi auto des réponses « à risque ».
- Après **devis accepté** : **nouveau contexte** (brief dossier) pour la phase livraison, sans réinjecter tout l’historique pré-vente.

## Réseaux sociaux (`social-media-automatisation.mdc`)

- Génération **assistée** (LinkedIn prioritaire B2B) ; **aucune publication** sans validation humaine.
- Charte visuelle alignée sur **`assets/variables.css`** (identité Pinapp).

## Veille tech + RH + admin (`pinapp-veille-rh-admin.mdc`)

- Digests **e-mail** : nouveautés tech + **prompts Cursor** ; rappels **RH/admin** (checklists, brouillons).
- **Pas** de remplacement des obligations **légales / paie / expert-comptable** par un script.

## Comptabilité / suivi (`comptabilite-automatisee.mdc`)

- **Google Sheet** avec onglet **Pinapp** ; statuts pipeline ; préfixe factures **PP-AAAA-NNN**.
- Logging automatique possible ; montants et validation **humaine**.

## Contexte technique (`pinapp-contexte.mdc`)

- Mention de standards (cache-bust, nav, **Netlify Forms** + fetch, footer légal, accessibilité nav).
- **À recouper** avec l’état réel du dépôt (01).

## Administratif avant prod (`administratif-pret.mdc`)

- Checklist large (légal France, domaine, GSC, formulaires…) ; contient encore des items **génériques / autres sites** — pour Pinapp, croiser avec **pinapp-veille-rh-admin** et ignorer l’irrelevant.

## Autres règles présentes (non détaillées ici)

- Design premium, cohérence web, audit multi-agents, zero-scroll, etc. — impact surtout **front** ; hors cœur du présent dossier automation.
