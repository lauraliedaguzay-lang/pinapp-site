# PINAPP INC. — CHECKLIST DÉPLOIEMENT

# =====================================

# À faire AVANT de mettre en ligne

## 🔴 URGENT — Avant toute communication

### SSL Hostinger (2 min)

1. Se connecter à hPanel (hpanel.hostinger.com)
2. Domaines → pinapp.fr → SSL
3. Let's Encrypt → Installer
4. Forcer HTTPS dans .htaccess (déjà configuré)

### Fonts Clash Display (10 min)

1. Aller sur https://fontsource.org/fonts/clash-display
2. Télécharger : Regular · Medium · Semibold · Bold (format woff2)
3. Aller sur https://fontsource.org/fonts/inter
4. Télécharger : Light · Regular · Medium (format woff2)
5. Placer tous les .woff2 dans assets/fonts/
6. Pusher sur main

### Tally Forms (20 min)

1. Créer compte sur tally.so
2. Créer 3 formulaires :
   - Formulaire Lauralie (diagnostic général)
   - Formulaire Micha (prestation image)
   - Formulaire Duo (pack complet)
3. Copier les IDs dans diagnostic/index.html
4. Configurer webhook → n8n workflow 01

## 🟠 SEMAINE 1

### Photos Lauralie & Micha

- [ ] Photo Lauralie → assets/images/lauralie-portrait.webp (600×700px)
- [ ] Photo Micha → assets/images/micha-portrait.webp (600×700px)
- Remplacer les placeholders dans a-propos/index.html

### Portfolio Micha

- [ ] 11 images dans assets/images/micha/ (format WebP 800×600px)
- Voir assets/images/micha/README.txt pour les noms exacts

### SIRET & informations légales

- [ ] Compléter legal/mentions.html après immatriculation
- [ ] Compléter legal/cgv.html (faire relire par avocat)

### n8n workflows

1. Se connecter à n8n (votre instance Hostinger)
2. Settings → Import
3. Importer les 8 fichiers JSON dans n8n-workflows/
4. Configurer les variables (voir AUTOMATIONS.md)

## 🟡 MOIS 1

### Formations

- [ ] Créer le contenu des formations (vidéos + PDF)
- [ ] Mettre en ligne sur hébergement sécurisé
- [ ] Compléter les liens dans offres/formation/index.html

### Stratégie LinkedIn

- [ ] Créer compte Buffer
- [ ] Connecter au workflow n8n #7
- [ ] Planifier le premier pilier de contenu

### Google Reviews

- [ ] Créer fiche Google Business Pinapp Inc.
- [ ] Récupérer l'URL d'avis
- [ ] Intégrer dans workflow n8n #5

## DÉPLOIEMENT

```powershell
# 1. Vérifier en local
npm run dev

# 2. Ship vers main
.\pinapp.ps1 ship

# 3. Vérifier sur pinapp.fr
# 4. Vérifier HTTPS actif
# 5. Vérifier Clash Display chargée (DevTools → Network → Fonts)
```

## PLACEHOLDERS RESTANTS

Rechercher dans le code : `⚠️ [LAURALIE]` et `⚠️ [MICHA]`
Ces marqueurs indiquent exactement où glisser les fichiers manquants.

```bash
grep -r "⚠️ \[LAURALIE\]" --include="*.html" .
grep -r "⚠️ \[MICHA\]" --include="*.html" .
```
