# PROMPT CORRECTIF ULTIME — voyage-v9

> Le prompt unique à donner à Claude Code pour tout appliquer en un run.
> À copier-coller intégralement dans le terminal après `cd voyage-v9`.

---

## 🚀 COMMANDE À LANCER

```bash
cd C:\Users\Lauralie\Projects\pinapp-site\voyage-v9
claude
```

Puis coller ce prompt dans la session Claude Code :

---

```
Tu es architecte front senior sur le site Pinapp v9. Objectif : amener voyage-v9/index.html au niveau wearebrand.io production-ready en appliquant 7 patches dans l'ordre ci-dessous, sans régression.

========================================
PHASE 0 — CONTEXTE (lire dans cet ordre)
========================================

LIS OBLIGATOIREMENT avant d'écrire une ligne de code :

1. ../CLAUDE.md  (doctrine pinapp.fr cinématique V2)
2. ../.cursorrules  (213 lignes de règles permanentes)
3. ../PINAPP_CURSOR_V2_MASTER.md  (spec exécutive)
4. ../COPY-PINAPP.md  (voix, interdits, 6 douleurs)
5. ../AUTOMATIONS.md  (8 workflows n8n)
6. ../assets/data/realisations.json  (SOURCE CANONIQUE des vraies réalisations)
7. voyage-v9/BRIEF-CLAUDE-CODE-V2.md  (cahier des charges)
8. voyage-v9/AUDIT-FINAL.md  (5 critiques + 6 majeurs + 7 quick wins)
9. voyage-v9/PATCH-REALISATIONS-V2.md  (portfolio 5 films)
10. voyage-v9/PATCH-CARROUSEL.md  (carrousel 13 aperçus)
11. voyage-v9/PATCH-QUI-SOMMES-NOUS.md  (scène 07 photos)
12. voyage-v9/AUDIT-TRANSITIONS.md  (vérifier que stage fixe est déjà appliqué)

Puis lis voyage-v9/index.html (par chunks si > 25k tokens). Identifie les lignes-clés de chaque scène.

========================================
RÈGLES IMMUABLES (à respecter en permanence)
========================================

- Vanilla JS only. Bunny Fonts (pas Google Fonts). Pas de GSAP/Lenis/jQuery.
- Voix : "nous" partout, "je" seulement dans bios Lauralie/Micha.
- Interdits copy : "!", "solution innovante", "résultat garanti".
- Interdits M&P : mort, deuil, décès, funérailles, enterrement, obsèques.
- "Zéro photo publique sans validation" — garder badges "Aperçu sectoriel" sur les 13 démos.
- NE PAS TOUCHER : la structure .stage / .stage__layer des transitions (déjà wearebrand-grade), le mode sobre #soberToggle, le scroll progress, la grille 15 scènes.

========================================
PHASE 1 — SCÈNE 05 : RÉALISATIONS (refonte majeure)
========================================

Applique PATCH-REALISATIONS-V2.md intégralement :

(a) Remplace TOUT le contenu actuel de <section id="s05"> par la structure en 2 parties :
   - Portfolio (5 vraies réalisations, Star Wars en hero span 2×2)
   - Aperçus sectoriels (sous-titre séparateur + carrousel 13 cartes)

(b) Les 5 réalisations viennent de ../assets/data/realisations.json :
   1. Star Wars — HERO — Vimeo 1184294810 — tag "FILM IA · SCI-FI" (gradient #1a1a2e → #3ef5e0) — span 2×2
   2. Walker — Vimeo 1184294762 — tag "FILM IA · WESTERN" (#c4622d) — c'est la "vidéo Texas" de Lauralie
   3. Resident Evil — Vimeo 1184294871 — tag "FILM IA · HORREUR" (#8b1e2e)
   4. Atelier Rivage — site archi — <a href="/demo/atelier-rivage/" target="_blank"> — tag "SITE · ARCHITECTE" (#c4a77d) — badge "DÉMO LIVE" en haut-droite
   5. Mémoire & Présence clip — Vimeo 1184294901 — tag "EXTRAIT CINÉMA" (#2d6a4f)

(c) Posters via vumbnail.com/<id>_large.jpg pour les 4 Vimeo (récupère le thumb officiel sans charger d'iframe).
    Atelier Rivage : si pas de screenshot local, Unsplash architecture temporaire (conserve alt honnête).

(d) Ajoute le CSS .portfolio / .port / .port--hero / .port--site / .port__play / .port__live (cf PATCH 2 du doc).

(e) Ajoute le JS initPortfolioVimeo (click-to-play, inject iframe Vimeo UNIQUEMENT au clic). Event Plausible 'Portfolio-Play' avec prop id.

(f) Sous le portfolio, ajoute le bloc séparateur "05b · Aperçus sectoriels" avec sous-titre :
   "Treize terrains de jeu par secteur. Démos construites pour montrer ce que nous déployons sur des TPE/PME. Ce ne sont pas des sites clients livrés — juste des aperçus de la méthode sectorielle."

(g) Puis applique PATCH-CARROUSEL.md (CSS .reals__scroll / .real + JS initRealsCarousel) pour que les 13 cartes SOIENT RÉELLEMENT un carrousel horizontal avec scroll-snap + compteur 01/13 qui se met à jour + flèches prev/next fonctionnelles + navigation clavier + responsive mobile. Vérifie que les IDs realsScroll/realsCounter/realsPrev/realsNext existent.

Change l'eyebrow de la scène en "05 · Réalisations" (plus "Preuve").
H2 : "Ce que nous avons <em>déjà</em> construit."

========================================
PHASE 2 — SCÈNE 07 : QUI SOMMES-NOUS
========================================

Applique PATCH-QUI-SOMMES-NOUS.md :

(a) Copie les 2 photos du repo racine vers voyage-v9/assets/team/ :
   - ../assets/images/lauralie.png  →  assets/team/lauralie.png (82 Ko)
   - ../assets/images/micha.jpg     →  assets/team/micha.jpg (41 Ko)
   Crée le dossier assets/team/ si besoin.

(b) Remplace la scène 07 entière (~lignes 804-829, cartes avec initiales "L" et "M") par la structure .duo éditoriale :
   - H2 : "Deux personnes. <em>Zéro</em> intermédiaire."
   - Lead : "Vous parlez à ceux qui construisent. Toujours."
   - Carte Lauralie (photo-gauche) : portrait 4/5 + figcaption rôle + nom "Lauralie <em>Daguzay</em>" + bio serif italic + skills (Sites premium, Automatisation n8n, IA sur-mesure, Auralis RH, Scripts Hostinger) + meta "📍 Bordeaux · 🇫🇷 France"
   - Carte Micha (photo-droite via direction:rtl) : portrait + figcaption + nom "Michaël <em>Bouilhac</em>" + bio + skills (Photo & vidéo pro, Direction artistique, Branding Adobe, Films IA (Star Wars, Walker, Resident Evil), Mémoire & Présence · restauration) + meta lien "Voir les films IA ↓" qui ancre vers #s05

(c) Ajoute le CSS .duo / .duo__card / .duo__portrait / .duo__body / .duo__name / .duo__bio / .duo__skills / .duo__meta avec :
   - Photos en grayscale(18%) qui désature au hover
   - Bio en Fraunces italic avec border-left or
   - Skills en grille 2 colonnes desktop, 1 col mobile
   - Responsive : sur mobile empile photo > texte, supprime reverse
   - prefers-reduced-motion : désactive transitions

(d) Chaque <img> avec width/height explicites (640/800) pour zéro CLS.

========================================
PHASE 3 — AJOUT CARTE W8 SCÈNE 03b
========================================

Dans la scène 03b "Preuve automatisations", ajoute une 6e carte workflow manquante :

<article class="wf">
  <span class="wf__code">W8</span>
  <h3 class="wf__title">Auralis RH — router</h3>
  <p class="wf__flow">Signal RH → Claude API → réponse contextualisée</p>
  <p class="wf__bene">Notre preuve par l'exemple : Auralis tourne sur ce flux.</p>
</article>

========================================
PHASE 4 — FIXES A11Y + RGPD CRITIQUES
========================================

(a) CSS ligne 402 : Remplacer
.diag input:focus,.diag select:focus,.diag textarea:focus{outline:none;border-color:var(--or)}
par :
.diag input:focus,.diag select:focus,.diag textarea:focus{outline:2px solid var(--cyan);outline-offset:3px;border-color:var(--or)}

(b) CSS ligne 71 : Ajouter après a{color:inherit;text-decoration:none} un sélecteur ciblé :
.scene__content p a, .footer a{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px;text-decoration-color:rgba(230,185,115,.5)}

(c) Scène 11 Manifeste (~ligne 890) : remplacer <p class="manifesto__quote" id="s11-h"> par <h2 class="manifesto__quote" id="s11-h" style="font-weight:400"> — garder les styles via CSS existant, mais promouvoir sémantiquement en h2 pour satisfaire aria-labelledby.

(d) Formulaire scène 14 : AJOUTER avant le bouton submit :
<label class="diag__consent">
  <input type="checkbox" name="consent" required>
  <span>J'accepte d'être recontacté sous 24h par écrit. Mes données ne sont utilisées que pour cette réponse et restent chez Pinapp — <a href="/mentions-legales/">en savoir plus</a>.</span>
</label>

(e) Formulaire scène 14 : découpler la confirmation écran du feature flag. Retire toute condition `if(cfg.features.diagnosticWebhook)` qui bloque le remplacement DOM par .diag__ok. Le flag ne doit gérer QUE le skip réel de fetch, pas l'UI de succès.

========================================
PHASE 5 — FIXES MAJEURS
========================================

(a) Ligne 994 : corriger le chemin QR code de src="../assets/images/qr-diagnostic.png" à src="assets/images/qr-diagnostic.png" OU copier le fichier dans voyage-v9/assets/images/qr-diagnostic.png et pointer sur ce chemin relatif.

(b) Dans <head>, ajouter après le preload hero-1 existant :
<link rel="preload" as="image" href="assets/hero-2.webp">
<link rel="preload" as="image" href="assets/hero-3.webp">
<link rel="preload" as="image" href="assets/hero-4.webp">
<link rel="preload" as="image" href="assets/hero-5.webp">
<link rel="preload" as="image" href="assets/hero-6.webp">

(c) Si l'outil est dispo, recompresser hero-3.webp à 200 Ko (sinon laisser un commentaire TODO).

(d) Limiter backdrop-filter à 2 occurrences maximum : la nav (garder) + la carte principale Pack Duo (garder). Sur les autres cartes (duo__card, wf, real…), remplacer `backdrop-filter: blur(Npx)` par `background: rgba(10,20,32,.75); border: 1px solid var(--fumee);` simple.

========================================
PHASE 6 — QUICK WINS (30 min total)
========================================

Dans <head> ajoute :
- <link rel="canonical" href="https://pinapp.fr/">
- <link rel="icon" type="image/svg+xml" href="/favicon.svg">
- <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

JSON-LD Organization (juste avant </head>) :
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"Organization",
  "name":"Pinapp Inc.",
  "url":"https://pinapp.fr",
  "logo":"https://pinapp.fr/assets/logo.svg",
  "address":{"@type":"PostalAddress","addressLocality":"Bordeaux","addressCountry":"FR"},
  "email":"contact@pinapp.fr",
  "founder":[{"@type":"Person","name":"Lauralie Daguzay"},{"@type":"Person","name":"Michaël Bouilhac"}],
  "sameAs":["https://www.linkedin.com/company/pinapp-inc"]
}
</script>

Sur les 13 images du carrousel aperçus sectoriels : vérifier que chaque <img> a un alt descriptif (ex: "Aperçu sectoriel Pinapp — BTP (exemple Renov&Co)").

Sur .eyebrow (chapter labels) ajouter au CSS :
.eyebrow{font-variant-caps:small-caps;font-feature-settings:"tnum" 1}

Sur les <video> de la stage, confirmer aria-hidden="true" (décoratives muted).

Dans le JS du form diagnostic, après succès fetch, ajouter :
if(window.plausible) plausible('Diagnostic-Submit');

========================================
PHASE 7 — VÉRIFICATION FINALE
========================================

Après tous les patches, relis voyage-v9/index.html par chunks et confirme :

✅ Transitions : stage fixe global .stage + .stage__layer avec cross-fade IntersectionObserver → INCHANGÉ
✅ 15 scènes (01 invitation → 14 contact) + 03b preuve automatisations
✅ Scène 03b : 6 cartes workflow (W1 à W5 + W8)
✅ Scène 05 : portfolio 5 réalisations avec Star Wars en hero + 13 aperçus sectoriels en carrousel fonctionnel
✅ Scène 07 : duo avec photos Lauralie + Micha
✅ Scène 11 : manifeste en <h2>
✅ Scène 14 : formulaire avec checkbox RGPD, confirmation écran indépendante du feature flag
✅ Preload 6 hero photos
✅ QR code path correct
✅ Canonical + JSON-LD + favicon
✅ Aucun outline:none sur les inputs
✅ Liens corps/footer underlined
✅ Pas de "!" dans les textes publics
✅ Vocabulaire M&P respecté (aucun interdit)
✅ backdrop-filter limité à 2 occurrences

Produis à la fin un récap structuré :
## APPLIQUÉ
- (liste des fichiers/lignes modifiés)
## IGNORÉ
- (si un patch n'a pas pu être appliqué, pourquoi)
## À CONFIRMER
- (les 5 décisions restantes à valider avec Lauralie : posters Atelier Rivage, décision Tally vs form natif, liens /demo/<slug>/, etc.)

========================================
NE FAIS PAS
========================================

- Ne touche pas au stage fixe .stage / .stage__layer (déjà wearebrand-grade).
- Ne touche pas à la typographie Fraunces/Inter.
- Ne touche pas au mode sobre #soberToggle.
- Ne supprime pas les badges "Aperçu sectoriel".
- Ne recompose PAS la copy (6 douleurs, 5 engagements, 6 valeurs, 11 lignes tarifs) — respecte les textes canoniques.
- Ne désactive pas prefers-reduced-motion.
- Ne charge AUCUN script externe hors Bunny Fonts + Plausible.

Commence maintenant par PHASE 0. Travaille scène par scène. Commit mental après chaque phase.
```

---

## 📋 ORDRE DES PHASES (résumé)

| Phase | Cible | Impact |
|---|---|---|
| 0 | Lecture docs | 0 — prérequis |
| 1 | Scène 05 refonte complète | 🔥 MAJEUR |
| 2 | Scène 07 photos Lauralie + Micha | 🔥 MAJEUR |
| 3 | Ajout W8 scène 03b | mineur |
| 4 | Fixes a11y/RGPD critiques (5) | 🔥 BLOQUANT PROD |
| 5 | Majeurs (QR, preloads, backdrop-filter) | 💡 |
| 6 | Quick wins (SEO, favicon, JSON-LD) | 💡 |
| 7 | Vérif finale + récap | ✅ |

---

## ⏱ ESTIMATION TEMPS CLAUDE CODE

- Phase 0 : 3–5 min (lecture + indexation)
- Phase 1 : 15–20 min (refonte scène 05 + JS Vimeo + CSS portfolio)
- Phase 2 : 8–10 min (scène 07 + CSS duo + copie photos)
- Phase 3 : 2 min (1 carte)
- Phase 4 : 5 min (5 edits ciblés)
- Phase 5 : 5 min (preloads + backdrop)
- Phase 6 : 5 min (head + JSON-LD + alts)
- Phase 7 : 3–5 min (relecture + récap)

**Total : ~45–55 min** pour un index.html prêt prod.

---

## 🧭 APRÈS EXÉCUTION DU PROMPT

1. Ouvre `voyage-v9/index.html` dans le navigateur (ou `file://.../voyage-v9/index.html`)
2. Test rapide :
   - Scroll de haut en bas : transitions fluides, zéro coupe
   - Clic sur play du hero Star Wars : iframe Vimeo charge
   - Carrousel aperçus : flèches + swipe fonctionnent
   - Photos Lauralie + Micha : zéro 404
   - Formulaire diagnostic : checkbox RGPD visible, submit donne confirmation écran
3. Lance Lighthouse mobile : viser ≥ 85 perf, ≥ 95 a11y, ≥ 95 SEO
4. Valide les 5 "À confirmer" du récap avec moi

---

## 🚨 SI UN PATCH CASSE QUELQUE CHOSE

Chaque patch est indépendant. Si Phase 1 (réalisations) casse tout, tu peux revenir en arrière sur cette section uniquement sans perdre les fixes a11y/RGPD.

Copie de sauvegarde avant exécution :
```bash
cp voyage-v9/index.html voyage-v9/index.html.backup-$(date +%Y%m%d-%H%M)
```

---

*Prompt ultime du 2026-04-23. Consolide BRIEF V2 + AUDIT FINAL + 3 PATCHES + règles `.cursorrules` + doctrine `CLAUDE.md`.*
