## Objectif (téléphone)

Tu ne “réfléchis” pas : tu reçois une notification, tu ouvres, tu approuves (ou tu ajustes), tu envoies.

Ce dépôt te fournit 2 briques complémentaires :

- **Brique A — Gmail + Claude (brouillons)** : `apps-script/pinapp-gmail-claude.gs`
  - Claude analyse les fils Gmail taggés `Pinapp-À-traiter`
  - Il crée un **brouillon** (jamais d’envoi auto)
  - Il déclenche une **notification push Gmail** sur ton téléphone via un email interne (à toi).
- **Brique B — Guide “pas à pas” (une tâche à la fois)** : `apps-script/pinapp-mobile-guide.gs`
  - Une “file” de micro-tâches (prochain clic) arrive par email
  - Tu replies **APPROUVER** / **PLUS TARD** / **STOP**
  - Le script avance l’étape et te renvoie la suivante.

> Règle : rien d’irréversible (envoi client, paiement, suppression) sans ton action explicite.

---

## Setup — Brique A (recommandé en premier)

Suivre le guide : `docs/claude-consultation/10-APPS-SCRIPT-H24-SETUP.md`.

### Bonus “push téléphone”

Dans Apps Script (propriétés du script), ajoute :

- `PINAPP_NOTIFY_EMAIL` = ton adresse Gmail qui reçoit les push (ex. `lauralie.daguzay@pinapp.fr`)

Ensuite crée un filtre Gmail sur le téléphone :

- De : ton propre email
- Objet contient : `🔔 Pinapp — Brouillon prêt`
- Action : label (optionnel) `Pinapp-Notifs`

---

## Setup — Brique B (guide pas à pas)

1. Va sur `script.google.com` → Nouveau projet (ex. `Pinapp — Guide téléphone`)
2. Colle le contenu `apps-script/pinapp-mobile-guide.gs`
3. Dans **Propriétés du script** ajoute :
   - `PINAPP_GUIDE_TO` = ton email (réception)
   - `PINAPP_GUIDE_FROM_NAME` = `Pinapp`
4. Exécute `pinappGuideInstallTriggerEvery10Minutes` (1 fois) pour installer un déclencheur.
5. Exécute `pinappGuideSeedExample` pour injecter 3 tâches de démo.

Tu recevras un email “Prochaine étape”.

### Comment approuver depuis le téléphone

Réponds au dernier email guide avec **une** des réponses exactes :

- `APPROUVER`
- `PLUS TARD`
- `STOP`

Le guide t’envoie la tâche suivante automatiquement.

---

## Modèle de “tâche” recommandé (format)

Une tâche = une action simple, sans ambiguïté :

- “Ouvre Gmail → libellé `Pinapp-À-traiter` → ouvre le dernier fil → lis les ACTIONS → valide le BROUILLON_CLIENT → envoie.”
- “Ouvre Notion → page ‘Leads’ → mets le statut de LEAD-… à ‘Qualifié’.”
- “Ouvre Calendar → confirme le créneau du RDV Google Meet → copie le lien dans le fil client.”

> Si une tâche demande plus d’un écran ou plus de 3 clics, on la découpe.

---

## Sécurité / limites

- La brique B ne doit pas “envoyer” au client. Elle sert à **te guider** et à enregistrer tes décisions.
- Si tu veux un vrai bouton “Approuver” cliquable (lien unique), on peut le brancher sur une endpoint signée (HMAC) côté Netlify Function, mais uniquement pour des actions non sensibles (ex. “marquer comme OK”, “créer une tâche”, “déclencher un brouillon”).
