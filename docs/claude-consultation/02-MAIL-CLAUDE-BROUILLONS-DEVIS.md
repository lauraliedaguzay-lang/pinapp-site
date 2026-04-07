# 02 — Mail + Claude : mode passif, brouillons, devis, contexte neuf

> **GitHub :** [ce fichier](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/02-MAIL-CLAUDE-BROUILLONS-DEVIS.md) · [dossier `claude-consultation`](https://github.com/lauraliedaguzay-lang/pinapp-site/tree/main/docs/claude-consultation)

## Objectif

Lauralie veut être **passive sur la rédaction** : Claude **analyse** les mails et propose **actions** + **brouillon de réponse**.  
Elle reste **active sur la décision** : **aucun envoi client automatique** pour les contenus générés ; elle **ouvre le brouillon** et **envoie** (ou édite puis envoie).

## Règles produit (non négociable)

1. **Brouillons uniquement** pour réponses générées : `GmailApp.createDraft` (ou équivalent), **pas** `sendEmail` vers le client pour le corps produit par Claude.
2. **Confirmation humaine** sur tout ce qui engage : prix, délais, périmètre, engagements.
3. **Après devis accepté** : traiter la suite comme une **nouvelle session** :
   - **Brief dossier** figé : offre, montant HT/TTC, délai, livrables, contact.
   - Prompts post-signature = **brief + mails récents phase production**, **sans** coller l’historique complet de négociation.
   - Côté API : éviter d’enchaîner une longue « conversation » / ancien `response_id` pour la phase exécution.

## Signaux Gmail suggérés

- `Pinapp-À-traiter` — à analyser
- `Pinapp-Suivi` — fil actif avant signature
- `Pinapp-Devis-accepté` ou `Pinapp-Production` — route vers prompt « livraison » + contexte neuf
- `Pinapp-Traité-Claude` — optionnel, anti-boucle

## Format de sortie Claude (parsing / brouillon)

```
===ACTIONS_LAURALIE===
1. …
2. …
===FIN_ACTIONS===

===BROUILLON_CLIENT===
(texte prêt à envoyer, ton Pinapp)
===FIN_BROUILLON===
```

Lauralie retire toute partie **confidentielle** du corps avant envoi si elle est concaténée dans le même brouillon.

## Devis

- Souhait : **devis HTML** dans la charte (teal, sombre/clair selon `variables.css`), généré en brouillon ou pièce jointe — **à trancher** (HTML dans mail vs PDF).
- Grille tarifaire : à maintenir **hors prompt fouillis** (ex. bloc versionné ou JSON) pour limiter **hallucinations** sur les montants.

## Implémentation

- **Code :** `apps-script/pinapp-gmail-claude.gs` (copier-coller dans un projet Google Apps Script).
- **Installation :** `docs/claude-consultation/10-APPS-SCRIPT-H24-SETUP.md`
- **Clés :** uniquement dans les propriétés du script Google — jamais dans Git.
