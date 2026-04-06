# Synthèse pour avis externe — **Pinapp uniquement**

> **Dossier complet à jour (GitHub)** : [dossier `docs/claude-consultation`](https://github.com/lauraliedaguzay-lang/pinapp-site/tree/main/docs/claude-consultation) — entrée [00-INDEX-DOSSIER-COMPLET.md](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/00-INDEX-DOSSIER-COMPLET.md).  
> Ce fichier reste une synthèse courte ; pour un avis détaillé, privilégier tout le dossier.

> Document à transmettre à Claude (ou un autre modèle) pour critique, risques et recommandations.  
> Périmètre : **Pinapp Studio** — pas Mémoire & Présence.

---

## 1. Contexte produit

- **Marque** : Pinapp Studio — IA, automatisation, design premium pour PME / indépendants.
- **Site public** : `https://pinapp.fr/` (domaine) ; miroir GitHub Pages : `https://lauraliedaguzay-lang.github.io/pinapp-site/`.
- **Dépôt** : `pinapp-site` (HTML/CSS/JS statique, déploiement via GitHub Actions → GitHub Pages ; possibilité ZIP Netlify / Hostinger selon doc interne).
- **Contact affiché** : `lauralie.daguzay@pinapp.fr`.
- **Positionnement éditorial** : « Pinapp prépare, vous validez », diagnostic 30 min, Auralis RH, Concours Lépine 2026.

---

## 2. Ce qui a été fait ou clarifié (côté site / règles)

### Règle Cursor `uptime-continu.mdc`

- Objectif : sites **en ligne en continu**, **zéro intervention quotidienne** ; privilégier hébergement managé, déploiement par push, health checks + alertes.
- Fichier : `.cursor/rules/uptime-continu.mdc` (`alwaysApply: true`).

### Audit harmonie & cohérence (lecture de code)

- Nav / footer globalement alignés sur les pages Pinapp ; démos sectorielles (`demo/*`) = système visuel séparé assumé.
- Points notés : légère incohérence libellé **« Pourquoi »** (desktop) vs **« Pourquoi Pinapp »** (drawer) ; apostrophes typographiques vs droites sur certaines pages ; `noscript` masquant le loader seulement sur l’accueil ; en mode clair `--separator` très léger sur bordures 1 px.

### Flux **e-mail / formulaires** (état réel du code)

- La plupart des CTA = **`mailto:lauralie.daguzay@pinapp.fr`** (parfois sujet prérempli : diagnostic, formations, Starter, etc.).
- Page **Votre projet** : parcours en boutons (besoin, structure, délai, budget) — en fin de parcours le JS fait aujourd’hui un **`console.log`** des réponses, **sans** envoi serveur / webhook / e-mail automatique (commentaires du type « Make / Tally » en attente).
- Page **Guide offert** (`formation-gratuite`) : champ e-mail + bouton — même chose : **`console.log`**, pas d’intégration réelle.
- **Pas** de `data-netlify="true"` sur Pinapp comme sur un autre projet statique déployé Netlify : le site Pinapp principal est pensé **GitHub Pages** (pas de backend formulaires natif).

### Demandes métier exprimées (pas encore implémentées dans ce dépôt)

- Recevoir par **e-mail** les demandes clients avec **grille tarifaire** pour facturer.
- **Devis stylisés** dans la **charte graphique Pinapp** (teal `#00E5CC` / fond sombre, etc.), génération **automatisée**.
- **Connexion Gmail** côté automatisation (type Google Apps Script + API Claude), sur le modèle d’un autre site — mais **uniquement pour Pinapp** dans ce périmètre.

### Git / GitHub

- Environnement local : `git` parfois absent du PATH PowerShell ; mise à jour GitHub à faire depuis la machine de Lauralie (Cursor terminal ou Git installé) si besoin.
- Le dépôt `pinapp-site` peut contenir de nombreux fichiers modifiés / règles `.cursor` non suivis selon l’état du workspace.

---

## 3. Contraintes techniques à respecter

- Site **statique** : pas d’exécution PHP sur GitHub Pages pour traiter des POST formulaires.
- **Secrets** (clé API Anthropic, webhooks Make) : **ne pas** les committer dans le dépôt ; les mettre dans Apps Script properties ou variables d’environnement côté outil qui les consomme.
- **RGPD** : tout traitement e-mail / lead doit rester cohérent avec les pages légales Pinapp (`legal/confidentialite.html`, etc.).

---

## 4. Questions ouvertes pour ton avis (Claude)

1. **Architecture** : pour Pinapp sur GitHub Pages, privilégier **Formspree / Getform / Tally + webhook Make**, **Google Apps Script** qui lit Gmail et appelle Claude, ou **déploiement miroir Netlify** uniquement pour les formulaires — quels compromis (coût, spam, maintenance) ?
2. **Devis HTML** : générer un **corps HTML** pour `GmailApp.createDraft` avec `htmlBody`, ou pièce jointe PDF (via Google Docs + script) — recommandation ?
3. **Grille tarifaire** : meilleure pratique pour la **injecter dans le prompt système** (texte long figé vs JSON versionné) sans hallucinations de prix ?
4. **Séparation des brouillons** : un brouillon « réponse client » + un brouillon « devis seul » + analyse interne — structure recommandée ?
5. **Risques** : abus de formulaires publics, fuites de clés, non-délivrabilité HTML dans certains clients mail — que prévoir ?

---

## 5. Ce que l’on attend de ta réponse

- Avis **clair** : faisable / déconseillé / à ajuster.
- **Ordre de mise en œuvre** réaliste (MVP → v2).
- **Pièges** légaux ou UX spécifiques **Pinapp** (B2B services, pas secteur sensible deuil).
- Si tu proposes du pseudo-code ou une structure de `CONFIG`, qu’elle soit **générique** (sans inventer de clés API).

---

*Document généré pour consultation externe — périmètre strict **Pinapp**.*
