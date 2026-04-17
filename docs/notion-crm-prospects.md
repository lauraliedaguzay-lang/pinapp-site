# Notion CRM — base « Prospects » (instructions Lauralie)

Créer une **base de données** (tableau complet) avec les propriétés suivantes.

## Propriétés

| Propriété | Type Notion | Options / remarques |
|-----------|---------------|---------------------|
| **Nom** | Titre | Nom du contact (prénom + nom ou société). |
| **Entreprise** | Texte | — |
| **Email** | Email | — |
| **Téléphone** | Texte | — |
| **Secteur** | Select | Aligner sur les **35 secteurs** du formulaire diagnostic (même libellés que le `<select>` secteur du site). |
| **Besoin** | Multi-select | `Site`, `Automatisation` (alias interne **Auto**), `IA`, `Vidéo`, `Formation`, `M&P`, `Pack`, `Autre` — aligner sur les cases « intérêts » du formulaire diagnostic. |
| **Budget** | Select | `<1K`, `1-3K`, `3-5K`, `5-10K`, `10K+`, `NSP` |
| **Statut** | Select | `Nouveau`, `Contacté`, `Devis envoyé`, `Signé`, `Perdu`, `En attente` — variante lisible avec emojis : `🆕 Nouveau`, `📞 Contacté`, `📋 Devis envoyé`, `✅ Signé`, `❌ Perdu`, `💤 En attente` (même valeurs logiques pour n8n si vous mappez sans emoji). |
| **Source** | Select | `Site`, `LinkedIn`, `Bouche-à-oreille`, `Google`, `Autre` |
| **Acquisition** | Select ou Texte | Valeurs typiques : `direct`, `qr`, `utm`, … — alimenté par le champ JSON **`acquisition_source`** du webhook diagnostic (ex. `qr` si URL `?source=qr`). |
| **Date contact** | Date | Date de première prise de contact ou de création de la fiche. |
| **Prochain RDV** | Date | — |
| **Montant devis** | Nombre | Format € (affichage devise dans Notion). |
| **Notes** | Texte long | — |
| **Priorité** | Select | `🔥 Chaud`, `🟡 Tiède`, `❄️ Froid` (ou équivalent texte sans emoji pour exports n8n). |
| **Assigné** | Select | `Lauralie`, `Michaël`, `Les deux` |

## Vues recommandées

1. **Pipeline (Kanban)**  
   - Groupement : **Statut**  
   - Colonnes logiques : Nouveau → Contacté → Devis envoyé → Signé / Perdu / En attente.

2. **À relancer**  
   - Type : Tableau  
   - Filtre : `Statut` = **Contacté** ET `Prochain RDV` **est avant** aujourd’hui.

3. **Ce mois**  
   - Filtre : `Date contact` **est dans** ce mois-ci  
   - Tri : `Date contact` décroissant.

4. **Revenus**  
   - Filtre : `Statut` = **Signé**  
   - Afficher la **somme** de `Montant devis` (barre de calcul Notion).

## Automatisation n8n → Notion (diagnostic)

Lorsqu’un diagnostic est reçu sur le webhook :

1. Créer une page dans la base **Prospects**.
2. Renseigner **Statut** = **Nouveau**.
3. **Source** = **Site** (si le lead vient du formulaire pinapp.fr).
4. **Acquisition** = valeur du JSON **`acquisition_source`** (ex. `qr`, `direct`, ou valeur d’`utm_source` si vous la recopiez dans le même champ).
5. Mapper les champs du payload (voir `assets/js/diagnostic-native.js`, objet `buildPayload`) : prénom, nom, email, téléphone, entreprise, secteur, besoins, budget, message, etc.

Champs utiles du JSON : `vous`, `entreprise`, `besoin`, `message_libre`, `meta`, `acquisition_source`, `submittedAt`.
