# Checklist avant mise en ligne Pinapp Studio

> **Trous à combler dans le code :** recherchez `[[PINAPP_TODO:` dans le dépôt (légal, Mémoire & Présence, etc.). Inventaire détaillé : **`PINAPP-REMPLACEMENTS.md`** à la racine.

## Informations légales à compléter

- [ ] Forme juridique (SASU ou EURL)
- [ ] SIRET (après immatriculation)
- [ ] Adresse siège social
- [ ] Nom complet Lauralie dans mentions légales

## Credentials à configurer

- [ ] `WEBHOOK_N8N` — URL Hostinger (injecter via `window.__PINAPP__` dans `index.html` ou attribut `data-webhook` du formulaire onboarding)
- [ ] `CLAUDE_API_KEY` — Anthropic (jamais en front ; référence `window.__PINAPP__.CLAUDE_API_KEY` réservée aux flux sécurisés / n8n)
- [ ] `STRIPE_KEY` — compte Stripe
- [ ] `NOTION_DATABASE_PROSPECTS` — ID Notion
- [ ] `NOTION_DATABASE_PROJETS` — ID Notion
- [ ] `NOTION_DATABASE_FORMATIONS` — ID Notion
- [ ] `GMAIL_SENDER` — hello@pinapp.fr
- [ ] `WHATSAPP_LAURALIE` — numéro WhatsApp
- [ ] `STRIPE_FORMATION_1` — lien paiement 47€
- [ ] `STRIPE_FORMATION_2` — lien paiement 147€
- [ ] `STRIPE_FORMATION_3` — lien paiement 397€
- [ ] `STRIPE_PACK_PROMPTING` — lien paiement 97€

## Tests à effectuer

- [ ] Formulaire onboarding → webhook n8n reçoit
- [ ] Mail accusé réception envoyé
- [ ] WhatsApp Lauralie reçoit notification
- [ ] Fiche Notion créée
- [ ] Démos IA fonctionnelles (clé API active)
- [ ] Générateur LinkedIn fonctionne
- [ ] Landing live génère du HTML
- [ ] Dashboard accessible — mot de passe changé
- [ ] Toutes les démos en noindex
- [ ] Google Search Console configurée
- [ ] Plausible Analytics installé

## Vérifications visuelles

- [ ] Mobile 390px — toutes les pages
- [ ] Animations prefers-reduced-motion désactivées
- [ ] Contraste WCAG AA vérifié
- [ ] Poids total < 500Ko index.html
- [ ] Google Fonts preload actif
- [ ] Zéro scroll horizontal

## Déploiement Hostinger

- [ ] SFTP configuré dans Cursor
- [ ] Tous les fichiers uploadés
- [ ] HTTPS actif sur pinapp.fr
- [ ] Redirections www → non-www
- [ ] 404 personnalisée

---

## À vérifier

- **Route `formations/index.html`** : fichier présent — redirection `noindex` vers `offres/formation/`. Remplacer par un vrai hub si besoin.
- **`memoire-et-presence/index.html`** : brouillon avec marqueurs `[[PINAPP_TODO:mp_*]]` — remplacer le texte avant diffusion ; adapter la charte M&amp;P avec Michaël si besoin.
- **Dossier `n8n/*.json`** : aucun workflow versionné dans ce clone ; audit JSON (credentials nommés, chaînage 01→02/06, signature mail, préfixe WhatsApp 🔷) à faire dès que les exports sont ajoutés au dépôt.
- **CTA Offres** : le brief prompts demandait des liens vers `../index.html#onboarding` ; `.cursorrules` impose le CTA principal « Premier échange offert » vers `/diagnostic/`. Les CTA principaux restent sur `/diagnostic/` ; ajuster manuellement si la stratégie de conversion privilégie l’onboarding.
- **Palette `pinapp-global.css` vs `.cursorrules`** : `pinapp-global.css` utilise les tokens « champagne / noir » du cahier prompts Hostinger ; les pages `home-2026` chargent `home-2026.css` ensuite pour rétablir la palette Pandora (mint / violet). Pas de fusion automatique des deux systèmes sur la home.

---

## Journal des corrections (audit)

- `[assets/css/pinapp-global.css]` créé : tokens partagés, reset minimal, utilitaires (`.fade-up`, `.card`, `.btn-*`, `.nav-back`, `.cta-float`, `.footer-legal`, `prefers-reduced-motion`), canvas `#particles`.
- `[assets/js/pinapp-particles.js]` créé : points `#1E1E1E`, vitesse ~0.2, opacité 0.4, sans souris ; `data-pinapp-particles="force"` pour fond toujours sombre.
- `[assets/js/home-2026.js]` particules retirées (délégation à `pinapp-particles.js`) ; webhook onboarding = `data-webhook` ou `window.__PINAPP__.WEBHOOK_N8N`.
- `[index.html]` title / meta description / `robots` ; `pinapp-global.css` + `__PINAPP__` + `pinapp-particles.js` ; nav Formations → `offres/formation/index.html` ; engagements → `engagements/index.html` ; webhook vide + commentaire variable.
- `[offres/index.html]` `robots`, meta description, `pinapp-global.css`.
- `[offres/formation/index.html]` meta, grille tarifaire 47 / 147 / 397 / 97 €, Stripe via `data-pinapp-stripe` + `__PINAPP__`, mention Michaël Bouilhac, correction chemins `pandora-world.js` / `pandora-interactions.js`.
- `[engagements/index.html]` `pinapp-global.css`, meta, titre, `pinapp-particles.js`, suppression du script canvas inline.
- `[dashboard/index.html]` titre, `noindex,nofollow`, `pinapp-global.css`, commentaires mot de passe / fetch n8n.
- `[legal/*]` `pinapp-global.css`, titres « — », `robots` (mentions `noindex`, CGV & confidentialité `index,follow`).
- `[demo/*]` hub + 11 démos plates + démos dossier : `noindex,nofollow`, `pinapp-global.css`, `pinapp-particles.js`, titres « — Démo Pinapp Studio », bandeaux / footers avec lien `../../index.html#onboarding` où applicable ; suppression de `demo-particles.js`.
- `[n8n/*.json]` non présents dans le dépôt — aucune modification (voir section « À vérifier »).
- Marqueurs globaux `[[PINAPP_TODO:…]]` + `PINAPP-REMPLACEMENTS.md` ; pages `formations/index.html` (redirect), `memoire-et-presence/index.html` (brouillon) ; email unifié en placeholder sur légal + accueil + JSON-LD.
