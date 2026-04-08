# Dépôt client (photos/vidéos + brief) → Email + guidage Telegram

Ce dépôt Pinapp contient une page prête à l’emploi :

- Page : `https://pinapp.fr/depot/` (fichier `depot/index.html`)
- Formulaire : **Netlify Forms** (nom : `depot-client`) + **webhook optionnel** (Make ou n8n)
- Objectif : récupérer un brief structuré (exploitable par Claude) + des **liens de dépôt** (Drive/Dropbox/WeTransfer) + un identifiant Telegram (optionnel), puis envoyer :
  - un **email** à Lauralie (ou votre boîte)
  - et des **notifications Telegram pas à pas** (checklist)

> Important : l’upload de fichiers “direct” depuis un site statique est fragile (limites, CORS, stockage).
> Le process recommandé est **un lien de dépôt** (Google Drive / Dropbox / WeTransfer), collé dans le formulaire.

---

## 1) Côté site : activer le webhook (optionnel)

Dans `assets/js/config.js` :

- `PinappConfig.webhooks.clientDepot` : remplacez `https://[TON-N8N]/webhook/client-depot`
- `PinappConfig.features.clientDepotWebhook` : passez à `true`

Le site enverra alors, en plus de Netlify Forms, un JSON “best effort” vers votre scénario.

Payload envoyé (extrait) :

- `nom`, `email`, `activite`, `offre`
- `depot_links` (liens Drive/WeTransfer/Dropbox…)
- `objectif`, `pages`, `references`, `delai`, `budget`, `outils`, `notes`
- `telegram` (ex : `@clientusername`)
- `timestamp`, `page`, `intent: "client-depot"`

---

## 2) Scénario Make (recommandé) — étapes

### A. Pré-requis

- Un scénario **Make** avec un module **Custom webhook**
- Un bot Telegram (créé via BotFather)
- (Option) Une destination email (Gmail, SMTP, etc.)

### B. Modules Make (plan simple)

1. **Webhooks → Custom webhook**
   - Reçoit le JSON du site (si `clientDepotWebhook` activé)
   - OU reçoit le webhook Netlify Forms si vous préférez brancher Netlify directement

2. **Tools → Text aggregator / Set variables**
   - Construit 2 blocs :
     - **Résumé (1 écran)** : contexte + liens + priorités
     - **Brief Claude** : le prompt “propre” à donner à Claude

3. **Email → Send an email**
   - À : `lauralie.daguzay@pinapp.fr`
   - Sujet : `Dépôt client — {{nom}} — {{activite}}`
   - Corps :
     - Résumé
     - Liens de dépôt
     - Brief Claude

4. **Telegram Bot → Send a message** (optionnel)
   - Condition : champ `telegram` non vide
   - Message 1 : “Bien reçu. Prochaine étape : …”

5. **Telegram Bot → Send a message** (suite)
   - Envoie une checklist courte en 5–7 étapes, ex :
     - 1. Vérifier que les liens sont accessibles
     - 2. Valider les pages indispensables
     - 3. Confirmer la priorité (conversion / crédibilité / automatisation…)
     - 4. Choisir 1–2 références
     - 5. Confirmer délai / budget
     - 6. Confirmer outils et accès
     - 7. “On lance : je reviens avec un plan + validations”

---

## 3) Prompt Claude (modèle)

Utiliser ce prompt côté Make (module OpenAI/Anthropic ou HTTP) si vous voulez que Claude produise un guidage structuré.

```
Tu es l’assistant de production de Pinapp Studio (site + automatisations).

Objectif : à partir du brief client ci-dessous, produire :
1) Une synthèse ultra courte (6 lignes max)
2) Les questions manquantes (max 8) dans l’ordre optimal
3) Un plan d’exécution en étapes (checklist) orienté “validation client”
4) Les risques / blocages (RGPD, droits images, délais, accès)

Contraintes :
- Ton sobre, précis, zéro promesse magique.
- Toujours proposer des validations humaines (“vous validez”) avant action irréversible.

BRIEF CLIENT (JSON) :
{{json}}
```

---

## 4) Notes RGPD / droits

- Demander au client de ne déposer **que** des contenus dont il a les droits.
- Si présence de personnes : accord explicite + pas d’info sensible.
- Stockage : Drive/Dropbox côté client (Pinapp ne duplique pas sans besoin).
