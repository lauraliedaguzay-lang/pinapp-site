# Pinapp — processus unique (Lauralie · Michaël · Client)

> **Règle d’or :** tout le monde suit **un seul fil**, le **plus court possible**. Ce fichier donne le **squelette** ; **Claude** (Cursor, n8n, e-mail interne, etc.) **détaille** les sous-étapes, checklists et libellés à partir du brief réel — pas l’inverse.

### Voix éditoriale (site, e-mails, prompts)

- **Pinapp = projet commun Lauralie & Michaël** : en marketing, parler au **nous** et nommer le **duo** quand c’est le message principal (accueil, à propos, réseaux, meta).
- **Rôles** : Lauralie = fondatrice, système & relation client pour la partie web / auto ; Michaël = image, motion, créa (dont Mémoire & Présence). Ne pas présenter Pinapp comme un one-woman-show.
- **Juridique** : l’EI affichée en mentions peut rester celle de Lauralie ; le **SIRET au footer** reste celui de Michaël tel que déjà indiqué — sans contredire le discours « studio à deux ».

---

## 1. Processus **client** (toujours le même)

| #   | Étape         | Ce que fait le client                                                                                                                    | Ce que fait Pinapp                                                        |
| --- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | **Demande**   | Remplit le **diagnostic Pinapp** (questionnaire + zone message). Une seule entrée, pas de chaîne WhatsApp / mail pour ouvrir le dossier. | Accusé de réception implicite ; dossier créé côté studio (notif interne). |
| 2   | **Lecture**   | Lit le **plan** et, si proposé, le **devis** reçus par e-mail (trace).                                                                   | Nous préparons en interne (Claude aide à structurer ; humains valident).  |
| 3   | **Décision**  | Répond par écrit : **oui** / **ajustements** / **stop** — un fil suffit.                                                                 | Nous enregistrons la décision ; pas de pression.                          |
| 4   | **Livraison** | Valide les jalons convenus (écrit). Reçoit accès / fichiers / mise en ligne selon contrat.                                               | Nous livrons par étapes ; rien de public sans accord explicite.           |

**En une phrase pour le site / e-mails :** _Une demande sur Pinapp → une réponse structurée → vous décidez → nous livrons par étapes, toujours par écrit._

---

## 2. Processus **Lauralie** (pôle système & relation)

| #   | Étape           | But                                                                                                                                                                                           |
| --- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1  | **Captation**   | Vérifier que la demande est complète (diagnostic + message) ; noter urgence, budget, secteur.                                                                                                 |
| L2  | **Cadrage**     | Produire ou valider le **plan d’action** et le **périmètre** (ce qui est in / out). Claude peut brouillonner ; Lauralie tranche.                                                              |
| L3  | **Proposition** | Devis / proposition chiffrée alignée CGV ; **Lauralie** comme interlocutrice principale côté client pour la partie « système » ; Michaël prend le relais quand le périmètre est visuel / M&P. |
| L4  | **Exécution**   | Ingénierie, automatisations, site, recettes ; coordination avec Michaël si visuel / M&P.                                                                                                      |
| L5  | **Clôture**     | Facturation (PP-), transfert des accès, fin de mission ou passage en maintenance si prévu.                                                                                                    |

---

## 3. Processus **Michaël** (pôle image & motion)

| #   | Étape           | But                                                                                                                                    |
| --- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| M1  | **Brief**       | Recevoir un brief validé (contenu, tonalité, contraintes techniques, délais) — issu du dossier Lauralie ou du client selon le contrat. |
| M2  | **Proposition** | Direction créative / storyboard / moodboard selon le projet ; validation écrite avant grosse prod.                                     |
| M3  | **Production**  | Fichiers sources + exports livrables (Adobe, Higgsfield, etc.) ; nommage et handoff clairs.                                            |
| M4  | **Revue**       | Boucle d’ajustements **dans le périmètre signé** ; puis livraison finale.                                                              |

---

## 4. Où **Claude** intervient (détailler, pas décider seul)

Utiliser ce document comme **entrée fixe** dans tout prompt automatisé (n8n, Cursor, Gmail brouillon, etc.) :

### Consignes pour Claude

1. **À partir des tableaux ci-dessus**, produire pour **ce dossier précis** :
   - une **checklist ordonnée** de sous-tâches ;
   - pour chaque ligne : **responsable** (`Client` | `Lauralie` | `Michaël` | `Les deux`) ;
   - des **libellés courts** (verbe d’action + livrable) ;
   - les **dépendances** (quoi bloque quoi).
2. **Rester factuel** : ne pas inventer d’obligations légales, de délais contractuels ou de tarifs ; si une info manque, lister **une question** à poser au client ou au studio.
3. **Ton** : français, professionnel, « nous » pour Pinapp, vouvoiement pour le client.
4. **Sortie souhaitée** : d’abord un **résumé en 5 lignes max**, puis le **détail** ; optionnel : tableau Markdown ou JSON `{ "tasks": [ { "id", "owner", "title", "dependsOn" } ] }`.

### Exemple de pré-prompt (à coller dans n8n / Cursor)

```text
Tu es l’assistant opérationnel du studio Pinapp. Voici le processus canon (squelette) :
- Client : demande Plateforme → lecture plan/devis → décision → livraison validée.
- Lauralie : L1 captation → L2 cadrage → L3 proposition → L4 exécution → L5 clôture.
- Michaël : M1 brief → M2 proposition visuelle → M3 production → M4 revue.

Entrée utilisateur : [COLLER ICI LE BRIEF / LE MAIL / LE FORMULAIRE]

Tâche : décline le squelette en tâches concrètes pour CE dossier uniquement, avec responsables et ordre. Ne pas inventer de clauses contractuelles.
```

---

## 5. Lien avec le dépôt

- **Automations** : `AUTOMATIONS.md` (webhooks diagnostic / onboarding / approve).
- **Admin interne** : `/admin/` → onglet **Gestion studio** (rappels hebdo, pas le process métier détaillé).
- **Copilotage** : `docs/claude-consultation/` pour les garde-fous (brouillons, pas d’envoi client automatique non validé).

---

## 6. Évolution

Si un jour un type de mission ne rentre dans aucune ligne, **ajouter une ligne au tableau** (pas une procédure parallèle). Puis faire régénérer le détail par Claude pour ce nouveau cas.
