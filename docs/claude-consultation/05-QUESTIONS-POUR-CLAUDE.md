# 05 — Questions pour l’avis de Claude (Pinapp)

> **GitHub :** [ce fichier](https://github.com/lauraliedaguzay-lang/pinapp-site/blob/main/docs/claude-consultation/05-QUESTIONS-POUR-CLAUDE.md) · [dossier `claude-consultation`](https://github.com/lauraliedaguzay-lang/pinapp-site/tree/main/docs/claude-consultation)

Réponds **point par point**. Périmètre : **Pinapp uniquement**.



## Architecture & formulaires



1. Pour un site **GitHub Pages** sans backend, quelle combinaison recommandes-tu pour **capturer** leads (Votre projet, guide offert) : Formspree, Getform, Tally + Make, **ou** miroir Netlify **uniquement** pour les POST — compromis **spam**, **coût**, **maintenance** ?



## Mail + Claude



2. Comment structurer **techniquement** le flux **brouillon uniquement** (découpage analyse / brouillon client / HTML devis) pour limiter les erreurs de copier-coller côté humain ?



3. **Devis** : privilégier **HTML** dans `htmlBody` Gmail, **PDF** généré (Docs + script), ou **les deux** — selon délivrabilité et image de marque ?



4. **Grille tarifaire** : comment la **versionner** et l’**injecter** au prompt pour minimiser les **hallucinations** de prix tout en restant à jour ?



5. **Contexte neuf après devis accepté** : valides-tu l’approche « brief dossier + mails récents production » ? As-tu une variante plus robuste (CRM minimal, Google Sheet, Notion) ?



## Réseaux sociaux



6. Pour la **génération hebdo** + **revue multi-critères** dans un seul appel Claude : risque de sorties **génériques** ? Faut-il **deux passes** (génération puis critique) ?



7. **LinkedIn B2B** pour une offre IA / automatisation : quelles **red flags** de contenu éviter pour la crédibilité ?



## Risques & conformité



8. Liste les **risques** principaux (sécurité clés API, abus formulaires, RGPD, dépendance à un compte Gmail) et des **mitigations** concrètes.



## Veille tech, digests e-mail, RH & admin



9. Pour agréger **RSS + alertes sécurité + résumé hebdo**, privilégier **Make**, **n8n**, **Apps Script seul**, ou **GitHub Actions + notification** — pourquoi ?



10. Comment limiter le **bruit** (trop d’e-mails) tout en ne **pas rater** les correctifs critiques ?



11. Quelles tâches **RH** (micro-entreprise vs société) sont **raisonnablement** automatisables en **rappel / brouillon** vs **déconseillées** en full-auto ?



12. **Sheet** pour suivi commercial + factures : suffisant comme **MVP** ? À quel moment recommander un **outil compta** ou un **expert** obligatoire ?



13. **RGPD** : minimisant pour traitements **Gmail + Sheets + Make** (données clients) — que documenter dans un registre simplifié ?



14. Les **modèles d’e-mail** en annexe 08 : manquent-ils de champs **obligatoires** (traçabilité, désabonnement, mention légale) selon ton usage ?



## Livrable attendu de ta réponse



- Verdict **faisable / à ajuster / déconseillé** par grand bloc : capture leads, mail+Claude, devis, social, veille, RH/admin, compta.  

- **Roadmap** MVP → v2 en **étapes numérotées** (horizon **quelques semaines** de travail humain réaliste).  

- **Pièges** B2B services France.  

- Tableau des **incohérences** détectées entre fichiers **01** et **07** (règles vs réalité code).

