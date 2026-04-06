# 01 — Contexte Pinapp & état du site

> **GitHub :** [ce fichier](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/01-CONTEXTE-ET-SITE.md) · [dossier `claude-consultation`](https://github.com/lauraliedaguzay-lang/pinapp-site/tree/main/docs/claude-consultation)

## Marque & offre

- **Pinapp Studio** — IA, automatisation, design premium pour PME et indépendants.
- **Promesse éditoriale** : « Pinapp prépare, vous validez » ; diagnostic offert 30 min ; produit de référence **Auralis RH** ; **Concours Lépine 2026**.

## URLs & dépôt

| Usage | URL |
|--------|-----|
| Production | `https://pinapp.fr/` |
| GitHub Pages (miroir) | `https://lauraliedaguzay-lang.github.io/pinapp-site/` |
| Dépôt | `pinapp-site` — HTML/CSS/JS statique |

Déploiement principal : **GitHub Actions** → **GitHub Pages**. Possibilité **Hostinger** / **ZIP Netlify** selon doc interne du dépôt.

## Contact

- **E-mail pro affiché** : `lauralie.daguzay@pinapp.fr`
- Beaucoup de CTA = **liens `mailto:`** (sujets parfois préremplis : diagnostic, formations, Starter, etc.).

## État réel des « formulaires » dans le code

- **Votre projet** (`votre-projet/`) : parcours en boutons (besoin, structure, délai, budget). Aujourd’hui les réponses finissent en **`console.log`** — **pas** d’envoi serveur, webhook ni e-mail automatique.
- **Guide offert** (`formation-gratuite/`) : champ e-mail — idem, **`console.log`** uniquement.
- **Pas** de `data-netlify="true"` sur le flux principal : le site est pensé **statique** sur GitHub Pages (pas de handler PHP).

## Besoins métier exprimés (à brancher)

- Mails analysés par **Claude** → propositions **quoi faire** + **quoi répondre** ; **Lauralie confirme toujours** avant envoi client.
- **Devis** stylisés charte Pinapp, génération assistée ; après **devis accepté**, **nouveau contexte Claude** pour la phase livraison (sans réinjecter tout le fil pré-vente).
- **Contenus réseaux** : génération assistée (LinkedIn prioritaire) ; **validation** avant publication.
- **Grille tarifaire** injectée dans les prompts pour limiter les erreurs de chiffrage (à concevoir proprement).

## Contraintes

- **Secrets** (clé Anthropic, webhooks) : hors Git — Propriétés Apps Script ou secrets build.
- **RGPD** : alignement avec `legal/confidentialite.html` et pages légales Pinapp.

## Audit UX / cohérence (rappel)

- Nav / footer globalement cohérents ; démos `demo/*` = univers visuel à part (volontaire).
- Détails mineurs : libellé « Pourquoi » vs « Pourquoi Pinapp » ; typographie des apostrophes ; `noscript` loader surtout sur l’accueil.
