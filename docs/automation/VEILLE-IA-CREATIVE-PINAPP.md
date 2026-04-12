# Veille automatique — offres site & IA créative (Michaël / formations)

Objectif : rester à jour sur **ce que Pinapp peut proposer** (pages offres, formations, packs, textes Michaël) sans tout suivre à la main. Le **squelette** est ici ; **Make / n8n / Apps Script** agrègent les sources et **Claude** (ou GPT) rédige le digest — comme pour `DIGESTS-EMAIL-PINAPP.md`.

---

## 1. Higgsfield (orthographe usuelle : **Higgsfield**)

- **Site :** [higgsfield.ai](https://higgsfield.ai) — plateforme d’**infrastructure** autour de la **génération vidéo et image** (plusieurs **modèles** + **workflows** de production).
- **Positionnement observé (2025–2026) :** outils type **Cinema Studio**, **Lipsync Studio**, **Draw to Video**, **Motion Control**, génération **image** (**Soul**, **Soul ID**, etc.), édition image/vidéo dans le même écosystème ; blog produit sur le site.
- **API :** présentation séparée sur [higgsfieldapi.com](https://www.higgsfieldapi.com) — à lire pour **usage pro**, quotas, CGU, droits sur les sorties (obligatoire avant promesse client).
- **Pour Pinapp :** cohérent avec la ligne déjà affichée (« flux type **Higgsfield** » avec **Michaël**). Veille = **nouveaux modèles**, **nouveaux packs tarifaires**, **nouvelles capacités** (durée, résolution, contrôle caméra) → matière à **atelier**, **masterclass** ou **ligne pack** sur le site.

**Source veille :** blog / changelog Higgsfield (RSS si disponible ; sinon **veille manuelle** mensuelle capturée dans le scénario ou **alerte Google** sur `site:higgsfield.ai`).

---

## 2. Vidéo générative — panorama à affiner **chaque trimestre**

Les outils bougent vite ; cette table sert de **checklist revue** (pas de classement définitif).

| Famille                | Exemples (2025–2026)                           | Usage typique côté client                  |
| ---------------------- | ---------------------------------------------- | ------------------------------------------ |
| Prod / contrôle        | Runway (ex. Gen-4), outils orientés « studio » | Clips courts, image→vidéo, contrôle caméra |
| Rapport qualité / coût | Kling, autres acteurs asiatiques / freemium    | Volume, social, itérations                 |
| Créa rapide / effets   | Pika, etc.                                     | Social, tests, look stylisé                |
| Qualité « prompt pur » | Sora (OpenAI, via offre ChatGPT selon dispo)   | Scènes plus longues, démo premium          |
| Avatar / parlant       | HeyGen, etc.                                   | Corporate, FAQ vidéo, internal comm        |

**Pour le site :** ne pas lister une **marque** comme « incluse dans le prix » sans contrat d’abo client ; préférer **« au choix selon brief et droits »** + **accompagnement Michaël**.

**Sources veille (exemples) :** blogs éditeurs, comparatifs sérieux (à croiser avec **2 sources** avant d’afficher une affirmation sur pinapp.fr).

---

## 3. Photo & « IA façon Photoshop »

- **Adobe — Photoshop + Firefly (2026, évolutif) :** génération / retouche (**Generative Fill**, remove, expand, upscale), **éditeur Firefly**, évolutions type **assistant** / **markup** sur image, **modèles personnalisés** (bêta), intégration de **plusieurs moteurs** selon abonnement — tout est **sous licence Adobe** : vérifier **conditions commerciales** et **droits de revente** avant packaging.
- **Piste Pinapp :** Michaël reste sur la **chaîne pro** (Adobe + compléments génératifs) ; les **alternatives** (Canva, Photoroom, Affinity, open source…) se traitent **au cas par cas** selon budget et conformité client.

**Source veille :** [blog.adobe.com](https://blog.adobe.com) (Firefly, Photoshop) — RSS ou flux thématique dans Make.

---

## 4. E-mail automatique « Veille IA créative & offres » (modèle)

**Objet :** `Pinapp — Veille IA créative · semaine du {{date}}`

**Corps (texte) :**

```
Bonjour,

Synthèse IA créative / offres Pinapp (site + formations + ligne Michaël).

━━ NOUVEAUTÉS OUTILS (3 max) ━━
• {{outil_1}} — {{fait_marquant}} — {{source_url}}
• {{outil_2}} — …
• {{outil_3}} — …

━━ IDÉE D’OFFRE SITE (brouillon) ━━
Titre : {{titre_pack_ou_atelier}}
Pitch 2 lignes : {{pitch}}

━━ ACTIONS SUGGÉRÉES ━━
1) {{page_à_mettre_à_jour}} — {{changement_concret}}
2) {{formation_gratuite_ou_pack}} — {{ajustement}}
3) {{catalogue_JSON_ou_réalisations}} — si pertinent

━━ PROMPT CURSOR (copier-coller) ━━
« Sur pinapp-site : mets à jour {{fichier_ou_page}} pour refléter {{nouveauté}}.
Reste factuel, pas de promesse légale, ton "nous", cohérent avec docs/automation/VEILLE-IA-CREATIVE-PINAPP.md. »

— Automatisation Pinapp (brouillon)
```

Remplir `{{…}}` via **Claude** dans le scénario à partir des articles agrégés.

---

## 5. Sources techniques à brancher (exemples)

| Source                                         | Type                        | Intérêt                          |
| ---------------------------------------------- | --------------------------- | -------------------------------- |
| `blog.adobe.com`                               | RSS / fil                   | Photoshop, Firefly, vidéo        |
| `higgsfield.ai` + blog                         | RSS ou scrape léger         | Pipeline Michaël                 |
| Releases GitHub outils open source si utilisés | Atom                        | Moins prioritaire que créa pro   |
| Comparatifs **indépendants**                   | lien manuel ou RSS si dispo | Veille marché (à valider humain) |

---

## 6. Rappels

- **Michaël + Lauralie :** une même veille peut alimenter **deux paragraphes** dans le mail (image/motion vs système / pages site).
- **RGPD / droits :** ne pas promettre un outil tiers sans **CGU** et **usage client** clarifiés sur le devis.
- **Fréquence :** **hebdo** ou **bi-hebdo** suffisent ; éviter le bruit.

---

_Document interne Pinapp — complète `DIGESTS-EMAIL-PINAPP.md`._
