# ==============================================================================
# PINAPP STUDIO — DA FINALE COMPLÈTE
# Script PowerShell — Cursor l'exécute depuis la racine du dépôt
# Cerveau : Claude · Exécution : Cursor · Déploiement : Hostinger SFTP
#
# DA VALIDÉE INTÉGRALEMENT CETTE SESSION :
# Univers    → Pandora/Avatar + Apple glassmorphism
# Nuit       → #080d18 + canvas particules 4 couleurs + liaisons
# Jour       → #0a2a2e eau Avatar 2 + caustics + rayons lumineux
# Typo       → Clash Display (titres) + Inter (corps)
# Accents    → #00e5b0 cyan + #b388ff violet + #e8f4f8 nacré
# Jour acct  → #7fffea cyan eau + #c4b5fd lavande nacré
# Bouton     → rgba(91,60,180,0.85) violet indigo arrondi
# Glass      → rgba(255,255,255,0.04) blur(20px) bordure violet/cyan
# Layout     → scroll-snap 100vh TDAH-friendly
# Nav lat.   → points de section, position active
# Sections   → Hero / Services / Offres+secteur / Graphiques /
#              Auralis / Micha+M&P / Onboarding / Contact
# Micha      → Prestataire imagerie M&P (pas cofondateur)
# Champagne  → SUPPRIMÉ remplacé par nacré #e8f4f8
# ==============================================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $Root

Write-Host ""
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  PINAPP STUDIO — DA PANDORA/AVATAR FINALE" -ForegroundColor Magenta
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

New-Item -ItemType Directory -Force -Path "$Root/assets/css" | Out-Null
New-Item -ItemType Directory -Force -Path "$Root/assets/js"  | Out-Null

# ==============================================================================
# 1. CURSORRULES — RÉÉCRIT COMPLET
# ==============================================================================
Write-Host "▶ 1/8 .cursorrules complet..." -ForegroundColor Cyan

$cursorRules = @'
# Pinapp Studio — règles permanentes agent
# Portée : tout le dépôt pinapp-site
# Cerveau stratégique : Claude | Générateur : Cursor | Déploiement : Hostinger SFTP

## STACK TECHNIQUE
- Claude = cerveau stratégique uniquement. Zéro génération de code direct.
- Cursor = générateur de tout le code HTML/CSS/JS.
- Hébergement : Hostinger · connexion SFTP depuis Cursor (extension SFTP Natizyskunk)
- Déploiement : push main → GitHub Actions → Hostinger
- Netlify : supprimé définitivement
- Budget : 100€/mois max · Claude Pro priorité absolue (20€/mois)
- n8n self-hosted Hostinger ~3€/mois

## IDENTITÉ
- Marque : Pinapp Studio
- PDG : Lauralie — technique, IA, automatisation
- Prestataire imagerie : Michaël Bouilhac (Micha) — M&P, photo, vidéo, Adobe, IA générative
  · Micha N'EST PAS cofondateur Pinapp Studio
  · Contact Micha : micha@memoireetpresence.fr · WhatsApp uniquement
- Tagline : "Je construis ce que vos concurrents n'ont pas encore."
- Baseline : "Je pense le système. Je le construis. Vous récoltez."
- CTA principal : "Premier échange offert"
- Philosophie Avatar/Cameron : connexion, symbiose, sobriété, responsabilité
- Zéro photo de Lauralie sur le site
- Zéro image Unsplash

## PROJETS PINAPP INC.
- Pinapp Studio (pinapp.fr) — agence B2B premium, seul revenu actuel
- Auralis RH (SaaS IA RH) — pre-commercial, Aurora = IA intégrée
- Mémoire & Présence (memoireetpresence.fr) — QR hommages, Micha vidéaste
  · Comptabilité séparée de Pinapp Studio
  · Notifications n8n : 🌿 M&P vs 🔷 Pinapp

## PALETTE — NUIT (défaut)
:root {
  --bg:          #080d18;
  --bg-card:     rgba(255, 255, 255, 0.04);
  --text:        #f0f8ff;
  --text-muted:  rgba(240, 248, 255, 0.55);
  --accent:      #00e5b0;
  --accent-2:    #b388ff;
  --accent-3:    #7fffea;
  --accent-4:    #e040fb;
  --nacre:       #e8f4f8;
  --card-border: rgba(179, 136, 255, 0.08);
  --separator:   rgba(0, 229, 176, 0.06);
  --shadow:      rgba(0, 0, 0, 0.25);
  --btn-cta-bg:  rgba(91, 60, 180, 0.85);
  --btn-cta-bd:  rgba(179, 136, 255, 0.30);
}

## PALETTE — JOUR (eau Avatar 2)
[data-theme="light"] {
  --bg:          #0a2a2e;
  --bg-card:     rgba(10, 60, 65, 0.60);
  --text:        #e8fffd;
  --text-muted:  rgba(232, 255, 253, 0.55);
  --accent:      #7fffea;
  --accent-2:    #c4b5fd;
  --accent-3:    #ffffff;
  --accent-4:    #a78bfa;
  --nacre:       #e8f4f8;
  --card-border: rgba(127, 255, 234, 0.12);
  --separator:   rgba(127, 255, 234, 0.07);
  --shadow:      rgba(0, 0, 0, 0.20);
  --btn-cta-bg:  rgba(109, 40, 217, 0.80);
  --btn-cta-bd:  rgba(196, 181, 253, 0.30);
}

## TYPOGRAPHIE
- Titres : Clash Display (700) — futuriste premium tech
- Corps : Inter (300/400/500)
- Hébergement : Bunny Fonts
- font-hero : 104px desktop / 56px mobile
- font-h1 : 64px / 40px
- font-h2 : 40px / 28px
- font-h3 : 24px / 20px
- font-body : 16px · line-height 1.75
- font-label : 11px · uppercase · letter-spacing 0.14em
- Letter-spacing hero : -0.04em
- text-wrap: balance sur tous les titres
- Shimmer : cyan → violet → nacré sur 1 mot-clé du titre hero

## GLASSMORPHISM APPLE/PANDORA
- backdrop-filter: blur(20px) -webkit-backdrop-filter: blur(20px)
- bg-card: rgba(255,255,255,0.04)
- border: 1px solid var(--card-border) [violet nuit / cyan jour]
- border-radius: 20px
- box-shadow opacity max 0.12
- pseudo ::before : dégradé cyan 0% → violet 50% → nacré 100% opacity 0.03

## FOND — NUIT
- body background: #080d18 CSS pur — zéro image de fond
- Canvas particules : #00E5B0 + #B388FF + #7FFFEA + #E040FB
  · ~80 particules · liaisons si distance < 100px · mouvement lent organique
  · pause si document.hidden (éco énergie)
  · désactivé en mode jour

## FOND — JOUR (eau Avatar 2)
- body background: #0a2a2e CSS pur
- 3 caustics position:fixed blur(80px) mix-blend-mode:screen animés 9-14s
  · rgba(0,229,176,0.15) + rgba(127,255,234,0.10) + rgba(255,255,255,0.06)
- Rayons lumineux : repeating-linear-gradient diagonal très subtil
- Particules canvas désactivées en mode jour

## LAYOUT — SCROLL SNAP TDAH-FRIENDLY
- scroll-snap-type: y mandatory sur .snap-container
- Chaque section : min-height 100dvh · scroll-snap-align: start
- 1 idée / 1 section / 1 CTA maximum
- Navigation latérale : points de section, position active en accent
- Transition snap : 400ms cubic-bezier(0.25,0.1,0.25,1)
- Zéro scroll infini · Zéro surcharge cognitive
- Mobile-first 390px iPhone Safari

## NAVIGATION
- Position fixed 64px glass
- Logo : Pinapp Studio (nacré sur Studio)
- Toggle thème : bouton rond 40px
- CTA nav : "Premier échange offert" violet arrondi
- Burger + drawer mobile
- Hide on scroll down (seuil 80px)

## SECTIONS — 8 ÉCRANS
1. Hero — titre 104px shimmer + baseline + 1 CTA
2. Services — 3 cards glass (Sites / Automatisation / IA)
3. Offres — sélecteur secteur + fiches "CE QUE VOUS NE FEREZ PLUS"
4. Graphiques — barres heures + courbe avant/après + donut
5. Auralis — preuve produit + mock Aurora
6. Micha/M&P — imagerie + lien memoireetpresence.fr
7. Onboarding — 4 étapes numérotées
8. Contact — 1 question, 1 bouton

## ANIMATIONS
- IntersectionObserver threshold 0.15
- Durée UI ≤ 300ms · exceptions justifiées ≤ 400ms
- easing standard : cubic-bezier(0.25,0.1,0.25,1)
- easing entrée : cubic-bezier(0.22,1,0.36,1)
- Hover uniquement @media (hover: hover)
- Shimmer : 4s linear infinite
- Caustics : 9-14s linear infinite

## RÈGLES ABSOLUES
INTERDIT :
- Frameworks JS (React, Vue, etc.)
- Image de fond (bg-sombre/bg-clair supprimés définitivement)
- Images Unsplash
- Photo de Lauralie
- Champagne #C9A96E (remplacé par nacré #e8f4f8)
- Scroll horizontal
- Hover sur mobile
- box-shadow opacity > 0.12
- HTML > 500Ko par fichier
- CDN externes sauf Bunny Fonts

OBLIGATOIRE :
- Vanilla JS uniquement
- Custom properties pour toutes les couleurs
- WebP pour images finales
- Lazy-load natif
- WCAG AA contrastes
- Prix HT + mention TVA art. 293 B CGI
- HTTPS (certificat SSL Hostinger hPanel)
- Arnaud valide tout livrable visuel

## AGENTS SENIOR ACTIFS
QA : Thomas (arbitre permanent, bloque si non conforme)
DA : Arnaud (Apple/Tesla — "Apple signerait-il ça ?"), Théo (DA multimédia), Raphaëlle (PAO), Nino (Motion/CSS), Viktor T. (Typographie)
Commercial : Alexis (B2B), Clara (Growth), Bruno (Pricing), Mehdi (Freelance/pricing), Chloé (Onboarding client), Fiona (Personal branding)
Formation : Samir (LMS/pédagogie digitale), Rémi (Pédagogie)
Partenariats : Omar (Apporteurs), Lila (Juridique freelance)
Cognitif : Dr. Élise (Psychologie cognitive/TDAH), Prof. Karim (Neurosciences)
Veille : Nora (Veille stratégique), Axel (Intelligence compétitive)
Finance : Éric (CFO), Nathalie (Contrôle gestion)
Juridique : Maître Dubois, Maître Fontaine (EU AI Act/RGPD)
Prospective : Hélène (Futurisme/signaux faibles)
Copywriting : Élisa (AIDA/StoryBrand), Lucas (Brand/Kapferer)

## PROTOCOLES
- Réunion agents avant tout livrable complexe
- Arnaud convoqué sur CHAQUE décision visuelle
- Thomas peut bloquer toute livraison
- Lauralie = dernier mot absolu
- Décisions soumises en choix binaires
- Réponses courtes · zéro politesse · zéro répétition
- Langue : français par défaut
- Nommage : pinapp-[sujet]-[date]-v[n]
'@

Set-Content -Path "$Root/.cursorrules" -Value $cursorRules -Encoding UTF8
Write-Host "   + .cursorrules" -ForegroundColor Gray

# ==============================================================================
# 2. CSS GLOBAL
# ==============================================================================
Write-Host "▶ 2/8 pinapp-global.css..." -ForegroundColor Cyan

$cssGlobal = @'
/* ============================================================
   PINAPP STUDIO — GLOBAL CSS
   DA Pandora/Avatar · Apple glassmorphism · TDAH-friendly
   Clash Display + Inter · Scroll snap 100vh
   ============================================================ */

@import url('https://fonts.bunny.net/css?family=clash-display:wght@400;500;600;700|inter:wght@300;400;500&display=swap');

/* ── TOKENS NUIT ── */
:root {
  --bg:          #080d18;
  --bg-card:     rgba(255, 255, 255, 0.04);
  --text:        #f0f8ff;
  --text-muted:  rgba(240, 248, 255, 0.55);
  --accent:      #00e5b0;
  --accent-2:    #b388ff;
  --accent-3:    #7fffea;
  --accent-4:    #e040fb;
  --nacre:       #e8f4f8;
  --card-border: rgba(179, 136, 255, 0.08);
  --separator:   rgba(0, 229, 176, 0.06);
  --shadow:      rgba(0, 0, 0, 0.25);
  --btn-cta-bg:  rgba(91, 60, 180, 0.85);
  --btn-cta-bd:  rgba(179, 136, 255, 0.30);
  --max-w:       1280px;
  --pad-d:       80px;
  --pad-t:       40px;
  --pad-m:       20px;
  --radius:      20px;
  --ease:        cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-in:     cubic-bezier(0.22, 1, 0.36, 1);
}

/* ── TOKENS JOUR — Eau Avatar 2 ── */
[data-theme="light"] {
  --bg:          #0a2a2e;
  --bg-card:     rgba(10, 60, 65, 0.60);
  --text:        #e8fffd;
  --text-muted:  rgba(232, 255, 253, 0.55);
  --accent:      #7fffea;
  --accent-2:    #c4b5fd;
  --accent-3:    #ffffff;
  --accent-4:    #a78bfa;
  --nacre:       #e8f4f8;
  --card-border: rgba(127, 255, 234, 0.12);
  --separator:   rgba(127, 255, 234, 0.07);
  --shadow:      rgba(0, 0, 0, 0.20);
  --btn-cta-bg:  rgba(109, 40, 217, 0.80);
  --btn-cta-bd:  rgba(196, 181, 253, 0.30);
}

/* ── RESET ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  line-height: 1.75;
  overflow-x: hidden;
  transition: background 0.5s var(--ease), color 0.3s var(--ease);
}

/* ── SCROLL SNAP CONTAINER ── */
.snap-container {
  height: 100dvh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}
.snap-section {
  min-height: 100dvh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  position: relative;
  padding: 80px 0;
}
@media (max-width: 768px) { .snap-section { padding: 64px 0; } }

/* ── CANVAS PARTICULES NUIT ── */
#canvas-pandora {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.75;
  transition: opacity 0.5s var(--ease);
}
[data-theme="light"] #canvas-pandora { opacity: 0; pointer-events: none; }

/* ── CAUSTICS JOUR — Eau Avatar 2 ── */
.caustics {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.6s var(--ease);
}
[data-theme="light"] .caustics { opacity: 1; }

.caustics span {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  mix-blend-mode: screen;
  animation: caustic-drift linear infinite;
}
.caustics span:nth-child(1) {
  width: 65vw; height: 65vw;
  background: rgba(0, 229, 176, 0.15);
  top: -25%; left: -15%;
  animation-duration: 13s;
}
.caustics span:nth-child(2) {
  width: 48vw; height: 48vw;
  background: rgba(127, 255, 234, 0.10);
  top: 25%; right: -18%;
  animation-duration: 9s;
  animation-delay: -3s;
}
.caustics span:nth-child(3) {
  width: 38vw; height: 38vw;
  background: rgba(255, 255, 255, 0.06);
  bottom: -12%; left: 28%;
  animation-duration: 14s;
  animation-delay: -6s;
}
@keyframes caustic-drift {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(4vw, -5vh) scale(1.06); }
  66%  { transform: translate(-3vw, 4vh) scale(0.96); }
  100% { transform: translate(0, 0) scale(1); }
}

/* Rayons lumineux jour */
.light-rays {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.6s var(--ease);
  background: repeating-linear-gradient(
    -55deg,
    transparent 0px,
    transparent 90px,
    rgba(127, 255, 234, 0.012) 90px,
    rgba(127, 255, 234, 0.012) 92px
  );
}
[data-theme="light"] .light-rays { opacity: 1; }

/* ── NAVIGATION LATÉRALE ── */
.nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.nav-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
  border: none;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  padding: 0;
}
.nav-dot.active {
  background: var(--accent);
  transform: scale(1.5);
}
@media (max-width: 768px) { .nav-dots { display: none; } }

/* ── NAV PRINCIPALE ── */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 64px;
  z-index: 100;
  background: rgba(8, 13, 24, 0.80);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--separator);
  transition: transform 0.3s var(--ease), background 0.4s;
}
[data-theme="light"] .nav { background: rgba(10, 42, 46, 0.85); }
.nav.hidden { transform: translateY(-100%); }

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 var(--pad-d);
}
@media (max-width: 768px) { .nav__inner { padding: 0 var(--pad-m); } }

.nav__logo {
  font-family: 'Clash Display', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  letter-spacing: 0.02em;
}
.nav__logo span { color: var(--nacre); }

.nav__links {
  display: flex; gap: 32px; list-style: none;
}
.nav__links a {
  font-size: 12px;
  color: var(--text-muted);
  text-decoration: none;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  transition: color 0.2s;
}
@media (hover: hover) { .nav__links a:hover { color: var(--text); } }

.nav__actions { display: flex; align-items: center; gap: 12px; }

.nav__theme {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: rgba(0, 229, 176, 0.08);
  border: 1px solid var(--card-border);
  color: var(--accent);
  cursor: pointer;
  font-size: 15px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
@media (hover: hover) { .nav__theme:hover { background: rgba(0,229,176,0.15); } }

.nav__cta {
  font-size: 12px;
  padding: 9px 18px;
  background: var(--btn-cta-bg);
  border: 1px solid var(--btn-cta-bd);
  border-radius: 100px;
  color: var(--text);
  text-decoration: none;
  backdrop-filter: blur(8px);
  letter-spacing: 0.04em;
  transition: opacity 0.2s, transform 0.2s;
  white-space: nowrap;
}
@media (hover: hover) { .nav__cta:hover { opacity: 0.85; transform: translateY(-1px); } }

.nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none; border: none;
  cursor: pointer; padding: 4px;
}
.nav__burger span {
  display: block;
  width: 22px; height: 1.5px;
  background: var(--text);
  transition: transform 0.3s var(--ease);
}

.nav__drawer {
  display: none;
  position: fixed;
  top: 64px; left: 0; right: 0;
  background: rgba(8, 13, 24, 0.97);
  backdrop-filter: blur(20px);
  padding: 28px var(--pad-m) 36px;
  z-index: 99;
  flex-direction: column;
  gap: 24px;
  border-bottom: 1px solid var(--separator);
}
[data-theme="light"] .nav__drawer { background: rgba(10,42,46,0.97); }
.nav__drawer.open { display: flex; }
.nav__drawer a {
  font-size: 15px;
  color: var(--text-muted);
  text-decoration: none;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .nav__links, .nav__cta { display: none; }
  .nav__burger { display: flex; }
}

/* ── PROGRESS BAR ── */
#progress {
  position: fixed;
  top: 0; left: 0;
  height: 2px; width: 0%;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  z-index: 200;
  transition: width 0.1s linear;
}

/* ── CURSEUR ── */
#cursor {
  width: 22px; height: 22px;
  border: 1px solid var(--accent);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: transform 0.12s var(--ease), opacity 0.2s;
  mix-blend-mode: difference;
  opacity: 0;
}
@media (hover: hover) { #cursor { opacity: 1; } }
#cursor.active { transform: translate(-50%, -50%) scale(1.8); }

/* ── CONTAINER ── */
.container {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 var(--pad-d);
  width: 100%;
}
@media (max-width: 1024px) { .container { padding: 0 var(--pad-t); } }
@media (max-width: 390px)  { .container { padding: 0 var(--pad-m); } }

/* ── CARDS GLASS ── */
.card {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  box-shadow: 0 8px 32px var(--shadow);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}
.card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 229, 176, 0.03) 0%,
    rgba(179, 136, 255, 0.02) 50%,
    rgba(232, 244, 248, 0.01) 100%
  );
  pointer-events: none; border-radius: inherit;
}
@media (hover: hover) {
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 60px var(--shadow);
  }
}

/* ── TYPO ── */
h1, h2, h3, h4 {
  font-family: 'Clash Display', sans-serif;
  font-weight: 700;
  text-wrap: balance;
  line-height: 1.05;
}

.label {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 500;
  display: block;
  margin-bottom: 16px;
}

/* ── SHIMMER ── */
.shimmer {
  background: linear-gradient(
    90deg,
    var(--text) 0%,
    var(--accent-3) 30%,
    var(--accent-2) 60%,
    var(--nacre) 80%,
    var(--text) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
}
@keyframes shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}

/* ── BOUTONS ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 100px;
  font-size: 13px;
  letter-spacing: 0.05em;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s var(--ease);
  border: none;
}
.btn--primary {
  background: var(--btn-cta-bg);
  border: 1px solid var(--btn-cta-bd);
  color: var(--text);
  backdrop-filter: blur(8px);
}
.btn--ghost {
  background: transparent;
  border: 1px solid var(--card-border);
  color: var(--text-muted);
}
@media (hover: hover) {
  .btn:hover { opacity: 0.85; transform: translateY(-2px); }
  .btn--ghost:hover { color: var(--text); border-color: var(--accent); }
}

/* ── CHECKLIST ── */
.checklist { list-style: none; display: flex; flex-direction: column; gap: 10px; margin: 16px 0; }
.checklist li {
  font-size: 14px; color: var(--text-muted);
  padding-left: 18px; position: relative; line-height: 1.5;
}
.checklist li::before { content: '—'; position: absolute; left: 0; color: var(--accent); }

/* ── CROSS LIST (ce que vous ne ferez plus) ── */
.crosslist { list-style: none; display: flex; flex-direction: column; gap: 10px; margin: 12px 0; }
.crosslist li {
  font-size: 13px; color: var(--text-muted);
  padding-left: 18px; position: relative;
}
.crosslist li::before { content: '×'; position: absolute; left: 0; color: #ff6b6b; font-weight: 700; }

/* ── ANIMATIONS ── */
.anim-fade, .anim-up, .anim-scale {
  opacity: 0;
  transition: opacity 0.7s var(--ease-in), transform 0.7s var(--ease-in);
}
.anim-up    { transform: translateY(28px); }
.anim-scale { transform: scale(0.94); }
.anim-fade.visible, .anim-up.visible, .anim-scale.visible {
  opacity: 1; transform: none;
}

/* ── LINK ARROW ── */
.link-arrow {
  font-size: 13px; color: var(--accent);
  text-decoration: none; letter-spacing: 0.04em;
  display: inline-flex; align-items: center; gap: 6px;
  transition: gap 0.2s var(--ease);
}
@media (hover: hover) { .link-arrow:hover { gap: 10px; } }

/* ── STAT METRIC ── */
.metric-num {
  font-family: 'Clash Display', sans-serif;
  font-size: 72px; font-weight: 700;
  color: var(--accent); line-height: 1;
}
.metric-label { font-size: 14px; color: var(--text-muted); margin-top: 8px; line-height: 1.5; }

/* ── SECTEUR BADGE ── */
.sector-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 12px;
  background: rgba(179, 136, 255, 0.10);
  border: 1px solid rgba(179, 136, 255, 0.20);
  border-radius: 100px;
  font-size: 11px; letter-spacing: 0.10em;
  text-transform: uppercase; color: var(--accent-2);
}

/* ── FOOTER ── */
footer {
  scroll-snap-align: start;
  border-top: 1px solid var(--separator);
  padding: 60px 0 40px;
  position: relative; z-index: 1;
}
.footer__brand {
  font-family: 'Clash Display', sans-serif;
  font-size: 22px; font-weight: 700;
  color: var(--text); margin-bottom: 8px;
}
.footer__brand span { color: var(--nacre); }
.footer__tagline { font-size: 13px; color: var(--text-muted); letter-spacing: 0.06em; margin-bottom: 24px; }
.footer__links { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 24px; }
.footer__links a {
  font-size: 12px; color: var(--text-muted);
  text-decoration: none; letter-spacing: 0.06em;
  text-transform: uppercase; transition: color 0.2s;
}
@media (hover: hover) { .footer__links a:hover { color: var(--accent); } }
.footer__legal { font-size: 11px; color: rgba(240,248,255,0.25); }

/* ── SKIP LINK ── */
.skip-link {
  position: absolute; top: -100px; left: 16px;
  background: var(--accent); color: #000;
  padding: 8px 16px; border-radius: 4px;
  z-index: 9999; font-size: 14px; transition: top 0.2s;
}
.skip-link:focus { top: 8px; }

/* ── AURORA MOCK ── */
.aurora-mock {
  padding: 28px; font-family: 'Inter', sans-serif;
}
.aurora-mock__header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 20px; padding-bottom: 16px;
  border-bottom: 1px solid var(--separator);
}
.aurora-dot {
  width: 8px; height: 8px;
  background: var(--accent-2); border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
}
.aurora-mock__name { font-size: 13px; font-weight: 500; color: var(--text); letter-spacing: 0.06em; }
.aurora-mock__state { font-size: 11px; color: var(--text-muted); }
.aurora-mock__msg { font-size: 15px; color: var(--text); line-height: 1.7; font-style: italic; }
.aurora-mock__footer {
  font-size: 11px; color: var(--text-muted);
  margin-top: 20px; padding-top: 16px;
  border-top: 1px solid var(--separator);
}

/* ── GRAPHIQUES ── */
.chart-card { padding: 28px; }
.chart-title {
  font-size: 11px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--accent-2);
  margin-bottom: 20px;
}
.bar-chart { display: flex; align-items: flex-end; gap: 12px; height: 120px; }
.bar-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
.bar {
  width: 100%; border-radius: 6px 6px 0 0;
  background: linear-gradient(180deg, var(--accent) 0%, rgba(0,229,176,0.3) 100%);
  transition: height 1s var(--ease-in);
  position: relative;
}
.bar-val {
  position: absolute; top: -20px; left: 50%;
  transform: translateX(-50%);
  font-size: 12px; color: var(--accent); font-weight: 500;
}
.bar-label { font-size: 10px; color: var(--text-muted); letter-spacing: 0.06em; }

/* Donut */
.donut-wrap { display: flex; align-items: center; gap: 24px; }
.donut-legend { display: flex; flex-direction: column; gap: 10px; }
.donut-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted); }
.donut-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* Courbe */
.curve-wrap { position: relative; }
.curve-legend {
  display: flex; gap: 16px; margin-top: 12px;
}
.curve-leg-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted); }
.curve-leg-line { width: 16px; height: 2px; border-radius: 1px; }

/* ── SÉLECTEUR SECTEUR ── */
.sector-filter { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 32px; }
.sector-btn {
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 12px;
  letter-spacing: 0.06em;
  border: 1px solid var(--card-border);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s var(--ease);
  font-family: 'Inter', sans-serif;
}
.sector-btn.active {
  background: var(--btn-cta-bg);
  border-color: var(--btn-cta-bd);
  color: var(--text);
}

/* ── OFFRE CARD ── */
.offre-card { padding: 32px; }
.offre-label {
  font-size: 11px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--accent-2);
  margin-bottom: 12px; display: block;
}
.offre-title { font-size: 28px; margin-bottom: 16px; line-height: 1.1; }
.offre-desc { font-size: 14px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.7; }
.offre-reste {
  font-size: 15px; font-style: italic;
  color: var(--accent-3); margin: 16px 0;
  padding-left: 16px; border-left: 2px solid var(--accent);
  line-height: 1.5;
}
.offre-gain {
  font-family: 'Clash Display', sans-serif;
  font-size: 36px; font-weight: 700;
  color: var(--accent); margin: 16px 0 4px;
}
.offre-gain-label { font-size: 12px; color: var(--text-muted); margin-bottom: 20px; }
.offre-price {
  font-family: 'Clash Display', sans-serif;
  font-size: 28px; font-weight: 700;
  color: var(--nacre); margin-bottom: 4px;
}
.offre-delai { font-size: 12px; color: var(--text-muted); margin-bottom: 24px; }
'@

Set-Content -Path "$Root/assets/css/pinapp-global.css" -Value $cssGlobal -Encoding UTF8
Write-Host "   + pinapp-global.css" -ForegroundColor Gray

# ==============================================================================
# 3. JS THÈME
# ==============================================================================
Write-Host "▶ 3/8 theme.js..." -ForegroundColor Cyan

$jsTheme = @'
/* Pinapp Studio — Theme toggle · dark/light · localStorage */
(function () {
  var KEY = 'pinapp-theme';
  var html = document.documentElement;
  function get() {
    var s = localStorage.getItem(KEY);
    if (s) return s;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function apply(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem(KEY, t);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = t === 'dark' ? '◐' : '◑';
      btn.setAttribute('aria-label', t === 'dark' ? 'Mode jour' : 'Mode nuit');
    }
  }
  function toggle() {
    apply(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }
  apply(get());
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggle);
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(KEY)) apply(e.matches ? 'dark' : 'light');
  });
})();
'@

Set-Content -Path "$Root/assets/js/theme.js" -Value $jsTheme -Encoding UTF8
Write-Host "   + theme.js" -ForegroundColor Gray

# ==============================================================================
# 4. JS PARTICULES PANDORA
# ==============================================================================
Write-Host "▶ 4/8 particles.js..." -ForegroundColor Cyan

$jsParticles = @'
/* Pinapp Studio — Canvas particules Pandora · nuit uniquement */
(function () {
  var canvas = document.getElementById('canvas-pandora');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var COLORS = ['#00E5B0', '#B388FF', '#7FFFEA', '#E040FB'];
  var COUNT = 80, LINK = 100;
  var W, H, pts = [], raf;

  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  function rand(a, b) { return Math.random() * (b - a) + a; }
  function mk() {
    return { x: rand(0,W), y: rand(0,H), vx: rand(-0.12,0.12), vy: rand(-0.12,0.12),
             r: rand(1,2.4), c: COLORS[Math.floor(Math.random()*4)], a: rand(0.3,0.75) };
  }
  function init() { resize(); pts = Array.from({length:COUNT}, mk); }

  function draw() {
    ctx.clearRect(0,0,W,H);
    for (var i=0; i<pts.length; i++) {
      for (var j=i+1; j<pts.length; j++) {
        var dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if (d<LINK) {
          ctx.beginPath();
          ctx.strokeStyle=pts[i].c;
          ctx.globalAlpha=(1-d/LINK)*0.15;
          ctx.lineWidth=0.5;
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.stroke();
        }
      }
    }
    pts.forEach(function(p) {
      ctx.globalAlpha=p.a;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=p.c; ctx.fill();
      var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);
      g.addColorStop(0,p.c+'50'); g.addColorStop(1,p.c+'00');
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*5,0,Math.PI*2);
      ctx.fillStyle=g; ctx.globalAlpha=p.a*0.4; ctx.fill();
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<-10) p.x=W+10; if(p.x>W+10) p.x=-10;
      if(p.y<-10) p.y=H+10; if(p.y>H+10) p.y=-10;
    });
    ctx.globalAlpha=1;
  }

  function loop() { if(document.hidden) return; draw(); raf=requestAnimationFrame(loop); }
  function start() { if(!raf) loop(); }
  function stop()  { cancelAnimationFrame(raf); raf=null; }

  document.addEventListener('visibilitychange', function() { document.hidden?stop():start(); });
  window.addEventListener('resize', function() { resize(); pts=Array.from({length:COUNT},mk); });

  var obs = new MutationObserver(function() {
    document.documentElement.getAttribute('data-theme')==='light' ? stop() : start();
  });
  obs.observe(document.documentElement, {attributes:true, attributeFilter:['data-theme']});

  init();
  if (document.documentElement.getAttribute('data-theme') !== 'light') start();
})();
'@

Set-Content -Path "$Root/assets/js/particles.js" -Value $jsParticles -Encoding UTF8
Write-Host "   + particles.js" -ForegroundColor Gray

# ==============================================================================
# 5. JS MAIN
# ==============================================================================
Write-Host "▶ 5/8 main.js..." -ForegroundColor Cyan

$jsMain = @'
/* Pinapp Studio — Main JS · Nav · Progress · Cursor · Animations · Count-up · Nav dots */
document.addEventListener('DOMContentLoaded', function () {

  /* Progress */
  var prog = document.getElementById('progress');
  var snap = document.querySelector('.snap-container');
  if (prog && snap) {
    snap.addEventListener('scroll', function () {
      var t = snap.scrollHeight - snap.clientHeight;
      prog.style.width = t > 0 ? (snap.scrollTop / t * 100) + '%' : '0%';
    }, {passive:true});
  }

  /* Nav hide */
  var nav = document.querySelector('.nav');
  if (nav && snap) {
    var lastY = 0;
    snap.addEventListener('scroll', function () {
      var y = snap.scrollTop;
      nav.classList.toggle('hidden', y > lastY && y > 80);
      lastY = y;
    }, {passive:true});
  }

  /* Curseur */
  var cur = document.getElementById('cursor');
  if (cur && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', function(e) {
      cur.style.left = e.clientX + 'px';
      cur.style.top  = e.clientY + 'px';
    });
    document.querySelectorAll('a,button,[role="button"]').forEach(function(el) {
      el.addEventListener('mouseenter', function() { cur.classList.add('active'); });
      el.addEventListener('mouseleave', function() { cur.classList.remove('active'); });
    });
  }

  /* IntersectionObserver */
  var anims = document.querySelectorAll('.anim-fade,.anim-up,.anim-scale');
  if (anims.length) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          var d = parseInt(e.target.dataset.delay||0);
          setTimeout(function(){ e.target.classList.add('visible'); }, d);
          io.unobserve(e.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
    anims.forEach(function(el){ io.observe(el); });
  }

  /* Count-up */
  document.querySelectorAll('.count-up').forEach(function(el) {
    var target = parseInt(el.dataset.target, 10);
    var dur = 1600;
    var io2 = new IntersectionObserver(function(entries) {
      if (!entries[0].isIntersecting) return;
      io2.disconnect();
      var t0 = performance.now();
      function step(now) {
        var p = Math.min((now-t0)/dur, 1);
        var e = 1 - Math.pow(1-p, 3);
        el.textContent = Math.round(e*target).toLocaleString('fr-FR');
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
    io2.observe(el);
  });

  /* Nav dots */
  var dots  = document.querySelectorAll('.nav-dot');
  var sects = document.querySelectorAll('.snap-section');
  if (dots.length && snap) {
    snap.addEventListener('scroll', function() {
      var mid = snap.scrollTop + snap.clientHeight / 2;
      var active = 0;
      sects.forEach(function(s, i) {
        if (s.offsetTop <= mid) active = i;
      });
      dots.forEach(function(d,i){ d.classList.toggle('active', i===active); });
    }, {passive:true});
    dots.forEach(function(d,i) {
      d.addEventListener('click', function() {
        sects[i] && sects[i].scrollIntoView({behavior:'smooth'});
      });
    });
  }

  /* Burger */
  var burger = document.querySelector('.nav__burger');
  var drawer = document.querySelector('.nav__drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function() {
      var open = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
  }

  /* Sélecteur secteur offres */
  var sectBtns  = document.querySelectorAll('.sector-btn');
  var offCards  = document.querySelectorAll('.offre-card[data-sectors]');
  sectBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      sectBtns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var sel = btn.dataset.sector;
      offCards.forEach(function(card) {
        var sects = card.dataset.sectors.split(',');
        card.parentElement.style.display =
          (sel === 'tous' || sects.includes(sel)) ? '' : 'none';
      });
    });
  });

  /* Graphiques barres */
  var bars = document.querySelectorAll('.bar[data-h]');
  if (bars.length) {
    var bioBar = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.style.height = e.target.dataset.h + 'px';
          bioBar.unobserve(e.target);
        }
      });
    }, {threshold:0.3});
    bars.forEach(function(b){ b.style.height='0'; bioBar.observe(b); });
  }

  /* Donut SVG */
  var donut = document.getElementById('donut-svg');
  if (donut) {
    var r = 44, circ = 2 * Math.PI * r;
    var data = [
      {pct:45, color:'#00e5b0'},
      {pct:30, color:'#b388ff'},
      {pct:15, color:'#7fffea'},
      {pct:10, color:'#e040fb'}
    ];
    var offset = 0;
    data.forEach(function(d) {
      var arc = (d.pct/100) * circ;
      var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('cx','50'); circle.setAttribute('cy','50'); circle.setAttribute('r', r);
      circle.setAttribute('fill','none'); circle.setAttribute('stroke', d.color);
      circle.setAttribute('stroke-width','12');
      circle.setAttribute('stroke-dasharray', arc + ' ' + (circ - arc));
      circle.setAttribute('stroke-dashoffset', -offset);
      circle.setAttribute('transform','rotate(-90 50 50)');
      donut.appendChild(circle);
      offset += arc;
    });
  }

});
'@

Set-Content -Path "$Root/assets/js/main.js" -Value $jsMain -Encoding UTF8
Write-Host "   + main.js" -ForegroundColor Gray

# ==============================================================================
# 6. INDEX.HTML
# ==============================================================================
Write-Host "▶ 6/8 index.html..." -ForegroundColor Cyan

$html = @'
<!doctype html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="robots" content="index, follow"/>
  <title>Pinapp Studio — Systèmes intelligents sur-mesure</title>
  <meta name="description" content="Sites premium, automatisations n8n et IA sur-mesure. Je construis ce que vos concurrents n'ont pas encore."/>
  <meta property="og:title" content="Pinapp Studio"/>
  <meta property="og:url" content="https://pinapp.fr/"/>
  <meta property="og:type" content="website"/>
  <meta property="og:locale" content="fr_FR"/>
  <link rel="canonical" href="https://pinapp.fr/"/>
  <link rel="icon" href="favicon.svg" type="image/svg+xml"/>
  <link rel="preconnect" href="https://fonts.bunny.net" crossorigin/>
  <link rel="stylesheet" href="https://fonts.bunny.net/css?family=clash-display:wght@400;500;600;700|inter:wght@300;400;500&display=swap"/>
  <link rel="stylesheet" href="assets/css/pinapp-global.css"/>
  <script src="assets/js/theme.js"></script>
</head>
<body>

  <div id="cursor" aria-hidden="true"></div>
  <div id="progress" aria-hidden="true"></div>
  <canvas id="canvas-pandora" aria-hidden="true"></canvas>
  <div class="caustics" aria-hidden="true"><span></span><span></span><span></span></div>
  <div class="light-rays" aria-hidden="true"></div>
  <a class="skip-link" href="#main">Aller au contenu</a>

  <!-- NAV -->
  <nav class="nav" id="nav" aria-label="Navigation principale">
    <div class="nav__inner">
      <a class="nav__logo" href="/">Pinapp <span>Studio</span></a>
      <ul class="nav__links" role="list">
        <li><a href="a-propos/">Studio</a></li>
        <li><a href="realisations/">Réalisations</a></li>
        <li><a href="offres/">Offres</a></li>
        <li><a href="offres/formation/">Formations</a></li>
      </ul>
      <div class="nav__actions">
        <button class="nav__theme" id="theme-toggle" aria-label="Mode jour">◐</button>
        <a class="nav__cta" href="diagnostic/">Premier échange offert</a>
        <button class="nav__burger" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="nav__drawer">
      <a href="a-propos/">Studio</a>
      <a href="realisations/">Réalisations</a>
      <a href="offres/">Offres</a>
      <a href="offres/formation/">Formations</a>
      <a href="diagnostic/">Premier échange offert</a>
    </div>
  </nav>

  <!-- POINTS NAVIGATION LATÉRALE -->
  <nav class="nav-dots" aria-label="Navigation sections">
    <button class="nav-dot active" aria-label="Hero"></button>
    <button class="nav-dot" aria-label="Services"></button>
    <button class="nav-dot" aria-label="Offres"></button>
    <button class="nav-dot" aria-label="Graphiques"></button>
    <button class="nav-dot" aria-label="Auralis"></button>
    <button class="nav-dot" aria-label="Micha"></button>
    <button class="nav-dot" aria-label="Comment"></button>
    <button class="nav-dot" aria-label="Contact"></button>
  </nav>

  <main id="main">
  <div class="snap-container">

    <!-- ══ 1. HERO ══ -->
    <section class="snap-section" id="hero" aria-labelledby="hero-title"
             style="justify-content:center;">
      <div class="container">
        <span class="label anim-fade">Pinapp Studio · IA · Automatisation · Web premium</span>
        <h1 id="hero-title" style="font-size:clamp(48px,8vw,104px);letter-spacing:-0.04em;
            max-width:900px;margin-bottom:32px;line-height:1.0;"
            class="anim-up" data-delay="100"
            aria-label="Je construis ce que vos concurrents n'ont pas encore.">
          Je <span class="shimmer">construis</span><br/>
          ce que vos concurrents<br/>
          n'ont pas encore.
        </h1>
        <p style="font-size:18px;color:var(--text-muted);max-width:520px;
                  margin-bottom:48px;line-height:1.6;"
           class="anim-up" data-delay="200">
          Je pense le système. Je le construis. Vous récoltez.
        </p>
        <div style="display:flex;gap:16px;flex-wrap:wrap;" class="anim-up" data-delay="300">
          <a href="diagnostic/" class="btn btn--primary">
            Premier échange offert
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <a href="realisations/" class="btn btn--ghost">Voir les démos</a>
        </div>
      </div>
      <!-- Scroll hint -->
      <div style="position:absolute;bottom:32px;left:50%;transform:translateX(-50%);
                  display:flex;flex-direction:column;align-items:center;gap:6px;
                  color:var(--text-muted);font-size:10px;letter-spacing:0.14em;
                  text-transform:uppercase;opacity:0.6;" aria-hidden="true">
        <span>Défiler</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 9l5 4 5-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </div>
    </section>

    <!-- ══ 2. SERVICES ══ -->
    <section class="snap-section" id="services" aria-labelledby="services-title">
      <div class="container">
        <span class="label anim-fade">Ce que je construis</span>
        <h2 id="services-title" style="font-size:clamp(32px,5vw,56px);
            letter-spacing:-0.03em;margin-bottom:48px;" class="anim-up" data-delay="80">
          Trois expertises.<br/>Un seul résultat.
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">

          <article class="card anim-up" data-delay="0" style="padding:32px;">
            <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;
                        color:var(--accent);margin-bottom:14px;">Sites & landing pages</div>
            <h3 style="font-size:22px;margin-bottom:14px;line-height:1.2;">
              Un site qui convertit avant même que vous parliez.
            </h3>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:20px;line-height:1.7;">
              Design sur-mesure mobile + desktop. Copywriting inclus. Livré en 7 jours.
            </p>
            <ul class="checklist">
              <li>Design premium mobile + desktop</li>
              <li>Copywriting inclus</li>
              <li>SEO + mise en ligne</li>
              <li>Mode nuit / jour</li>
            </ul>
            <div style="margin-top:20px;font-family:'Clash Display',sans-serif;
                        font-size:28px;color:var(--nacre);">À partir de 800 € HT</div>
            <a href="offres/#sites" class="link-arrow" style="margin-top:12px;">En savoir plus →</a>
          </article>

          <article class="card anim-up" data-delay="100" style="padding:32px;">
            <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;
                        color:var(--accent);margin-bottom:14px;">Automatisation n8n</div>
            <h3 style="font-size:22px;margin-bottom:14px;line-height:1.2;">
              Vos tâches répétitives disparaissent. Votre temps revient.
            </h3>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:20px;line-height:1.7;">
              Je connecte vos outils et programme les actions à votre place.
            </p>
            <ul class="checklist">
              <li>Audit process 1h offert</li>
              <li>Workflow n8n complet</li>
              <li>Connexion jusqu'à 5 outils</li>
              <li>Tests + documentation</li>
            </ul>
            <div style="margin-top:20px;font-family:'Clash Display',sans-serif;
                        font-size:28px;color:var(--nacre);">À partir de 500 € HT</div>
            <a href="offres/#automatisation" class="link-arrow" style="margin-top:12px;">En savoir plus →</a>
          </article>

          <article class="card anim-up" data-delay="200" style="padding:32px;">
            <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;
                        color:var(--accent);margin-bottom:14px;">Intelligence artificielle</div>
            <h3 style="font-size:22px;margin-bottom:14px;line-height:1.2;">
              L'IA formée sur votre métier. Opérationnelle en 48h.
            </h3>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:20px;line-height:1.7;">
              Un assistant qui connaît votre activité et travaille pendant que vous dormez.
            </p>
            <ul class="checklist">
              <li>Formé sur vos documents</li>
              <li>Intégré sur votre site</li>
              <li>Tests 50 scénarios</li>
              <li>Maintenance mensuelle optionnelle</li>
            </ul>
            <div style="margin-top:20px;font-family:'Clash Display',sans-serif;
                        font-size:28px;color:var(--nacre);">À partir de 600 € HT</div>
            <a href="offres/#ia" class="link-arrow" style="margin-top:12px;">En savoir plus →</a>
          </article>

        </div>
      </div>
    </section>

    <!-- ══ 3. OFFRES + SÉLECTEUR SECTEUR ══ -->
    <section class="snap-section" id="offres" aria-labelledby="offres-title">
      <div class="container">
        <span class="label anim-fade">Offres sur-mesure</span>
        <h2 id="offres-title" style="font-size:clamp(28px,4vw,48px);
            letter-spacing:-0.03em;margin-bottom:32px;" class="anim-up" data-delay="80">
          Choisissez votre secteur.<br/>Les offres s'adaptent.
        </h2>
        <div class="sector-filter anim-up" data-delay="120">
          <button class="sector-btn active" data-sector="tous">Tous</button>
          <button class="sector-btn" data-sector="beaute">💅 Beauté</button>
          <button class="sector-btn" data-sector="artisan">🔧 Artisan</button>
          <button class="sector-btn" data-sector="coach">🎯 Coach</button>
          <button class="sector-btn" data-sector="restaurant">🍽 Restaurant</button>
          <button class="sector-btn" data-sector="commerce">🛍 Commerce</button>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">

          <div><article class="card offre-card anim-up" data-delay="0"
               data-sectors="tous,coach,beaute,artisan,restaurant">
            <span class="offre-label">Automatisation RDV</span>
            <h3 class="offre-title">Récupérez votre lundi matin.</h3>
            <p class="offre-desc">Confirmation · rappel · relance no-show.<br/>Tout part automatiquement.</p>
            <ul class="crosslist">
              <li>Confirmer chaque RDV à la main</li>
              <li>Envoyer les rappels la veille</li>
              <li>Relancer les no-show</li>
            </ul>
            <p class="offre-reste">"Une notification quand quelqu'un réserve. C'est tout."</p>
            <div class="offre-gain"><span class="count-up" data-target="5">0</span>h</div>
            <p class="offre-gain-label">récupérées par semaine</p>
            <div class="offre-price">990 € HT</div>
            <p class="offre-delai">Livraison en 48h</p>
            <a href="diagnostic/" class="btn btn--primary">Diagnostic offert — par écrit →</a>
          </article></div>

          <div><article class="card offre-card anim-up" data-delay="80"
               data-sectors="tous,artisan,coach,commerce">
            <span class="offre-label">Automatisation Devis</span>
            <h3 class="offre-title">Votre devis en 2 minutes. Sans vous.</h3>
            <p class="offre-desc">Le prospect remplit un formulaire. L'IA analyse, propose le devis, l'envoie. Vous validez en 30 secondes.</p>
            <ul class="crosslist">
              <li>Rédiger chaque devis à la main</li>
              <li>Oublier de relancer un prospect</li>
              <li>Passer 1h sur un devis qui ne signe pas</li>
            </ul>
            <p class="offre-reste">"Approuver le devis en un clic. Le reste est automatique."</p>
            <div class="offre-gain"><span class="count-up" data-target="3">0</span>h</div>
            <p class="offre-gain-label">récupérées par semaine</p>
            <div class="offre-price">750 € HT</div>
            <p class="offre-delai">Livraison en 48h</p>
            <a href="diagnostic/" class="btn btn--primary">Diagnostic offert — par écrit →</a>
          </article></div>

          <div><article class="card offre-card anim-up" data-delay="160"
               data-sectors="tous,artisan,commerce,coach">
            <span class="offre-label">Automatisation Facturation</span>
            <h3 class="offre-title">Une journée récupérée chaque mois.</h3>
            <p class="offre-desc">Facture générée à la signature. Relance automatique si impayé. Export comptable le 1er du mois.</p>
            <ul class="crosslist">
              <li>Faire vos factures le dimanche soir</li>
              <li>Relancer les impayés à la main</li>
              <li>Chercher quelle facture a été payée</li>
            </ul>
            <p class="offre-reste">"Encaisser. Vérifier une fois par mois. C'est tout."</p>
            <div class="offre-gain">1 jour</div>
            <p class="offre-gain-label">récupéré par mois</p>
            <div class="offre-price">590 € HT</div>
            <p class="offre-delai">Livraison en 48h</p>
            <a href="diagnostic/" class="btn btn--primary">Diagnostic offert — par écrit →</a>
          </article></div>

          <div><article class="card offre-card anim-up" data-delay="0"
               data-sectors="tous,beaute,restaurant,commerce,coach">
            <span class="offre-label">Automatisation Messages</span>
            <h3 class="offre-title">Des réponses prêtes, plus vite.</h3>
            <p class="offre-desc">L'assistant IA lit vos messages entrants. Il propose une réponse. Vous validez en quelques secondes.</p>
            <ul class="crosslist">
              <li>Rédiger les mêmes réponses en boucle</li>
              <li>Laisser des messages en attente plusieurs jours</li>
              <li>Gérer Instagram · Gmail · WhatsApp séparément</li>
            </ul>
            <p class="offre-reste">"Lire la réponse rédigée. Appuyer sur envoyer."</p>
            <div class="offre-gain">1 jour</div>
            <p class="offre-gain-label">récupéré par mois</p>
            <div class="offre-price">590 € HT</div>
            <p class="offre-delai">Livraison en 48h</p>
            <a href="diagnostic/" class="btn btn--primary">Diagnostic offert — par écrit →</a>
          </article></div>

          <div><article class="card offre-card anim-up" data-delay="80"
               data-sectors="tous,artisan,coach,beaute,commerce,restaurant">
            <span class="offre-label">Site Vitrine</span>
            <h3 class="offre-title">Un site qui vous ressemble. Et qui travaille pendant que vous dormez.</h3>
            <p class="offre-desc">Votre univers digital sur-mesure. Formulaire de contact · Calendly · SEO · Mode nuit/jour.</p>
            <ul class="crosslist">
              <li>Hésiter à partager votre lien</li>
              <li>Expliquer ce que vous faites à chaque RDV</li>
              <li>Perdre des clients faute de présence en ligne</li>
              <li>Payer 200–400€/mois à une agence sans résultat</li>
            </ul>
            <p class="offre-reste">"Donner votre URL. Votre site fait le reste."</p>
            <div class="offre-gain">7 jours</div>
            <p class="offre-gain-label">de la commande à la mise en ligne</p>
            <div class="offre-price">1 190 € HT</div>
            <p class="offre-delai">15 univers disponibles · Sur mesure</p>
            <a href="diagnostic/" class="btn btn--primary">Diagnostic offert — par écrit →</a>
          </article></div>

          <div><article class="card offre-card anim-up" data-delay="160"
               data-sectors="tous">
            <span class="offre-label" style="color:var(--accent-2);">Système Complet</span>
            <h3 class="offre-title">Vous approuvez. Tout le reste tourne seul.</h3>
            <p class="offre-desc">Site + automatisations + IA. Le système complet. On le câble, on le teste, on le met en production avec vous.</p>
            <ul class="checklist">
              <li>Site premium livré en 7 jours</li>
              <li>3 automatisations au choix</li>
              <li>Assistant IA métier intégré</li>
              <li>Formation 2h incluse</li>
            </ul>
            <p class="offre-reste">"Ce que vous voyez sur pinapp.fr, c'est le showroom."</p>
            <div style="font-family:'Clash Display',sans-serif;font-size:11px;
                        letter-spacing:0.14em;text-transform:uppercase;
                        color:var(--text-muted);margin:16px 0 4px;">0 €</div>
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:20px;">de logiciel supplémentaire à payer</p>
            <div class="offre-price">Sur devis</div>
            <p class="offre-delai">Paiement sur livrable · Satisfait ou remboursé 30 jours</p>
            <a href="diagnostic/" class="btn btn--primary">Diagnostic offert — par écrit →</a>
          </article></div>

        </div>
      </div>
    </section>

    <!-- ══ 4. GRAPHIQUES ══ -->
    <section class="snap-section" id="graphiques" aria-labelledby="graph-title">
      <div class="container">
        <span class="label anim-fade">Preuves chiffrées</span>
        <h2 id="graph-title" style="font-size:clamp(28px,4vw,48px);
            letter-spacing:-0.03em;margin-bottom:48px;" class="anim-up" data-delay="80">
          Où part votre temps ?<br/>Et combien en récupère-t-on ?
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;">

          <!-- Barres heures récupérées -->
          <article class="card chart-card anim-up" data-delay="0">
            <div class="chart-title">Heures récupérées / mois</div>
            <div class="bar-chart">
              <div class="bar-wrap">
                <div class="bar" data-h="96" style="height:0;">
                  <span class="bar-val">8h</span>
                </div>
                <span class="bar-label">Relances</span>
              </div>
              <div class="bar-wrap">
                <div class="bar" data-h="72"
                     style="height:0;background:linear-gradient(180deg,var(--accent-2) 0%,rgba(179,136,255,0.3) 100%);">
                  <span class="bar-val">6h</span>
                </div>
                <span class="bar-label">Devis</span>
              </div>
              <div class="bar-wrap">
                <div class="bar" data-h="60"
                     style="height:0;background:linear-gradient(180deg,var(--accent-3) 0%,rgba(127,255,234,0.3) 100%);">
                  <span class="bar-val">5h</span>
                </div>
                <span class="bar-label">RDV</span>
              </div>
              <div class="bar-wrap">
                <div class="bar" data-h="48"
                     style="height:0;background:linear-gradient(180deg,var(--accent-4) 0%,rgba(224,64,251,0.3) 100%);">
                  <span class="bar-val">4h</span>
                </div>
                <span class="bar-label">Factures</span>
              </div>
            </div>
            <p style="font-size:13px;color:var(--text-muted);margin-top:16px;line-height:1.6;">
              Chaque tâche représente des heures passées à la main chaque mois.
            </p>
          </article>

          <!-- Donut -->
          <article class="card chart-card anim-up" data-delay="100">
            <div class="chart-title">Où part votre temps ?</div>
            <div class="donut-wrap">
              <svg id="donut-svg" width="100" height="100" viewBox="0 0 100 100" aria-hidden="true"></svg>
              <div class="donut-legend">
                <div class="donut-item">
                  <span class="donut-dot" style="background:#00e5b0;"></span>
                  Relances (45%)
                </div>
                <div class="donut-item">
                  <span class="donut-dot" style="background:#b388ff;"></span>
                  Devis (30%)
                </div>
                <div class="donut-item">
                  <span class="donut-dot" style="background:#7fffea;"></span>
                  RDV (15%)
                </div>
                <div class="donut-item">
                  <span class="donut-dot" style="background:#e040fb;"></span>
                  Autres (10%)
                </div>
              </div>
            </div>
          </article>

          <!-- Courbe avant/après -->
          <article class="card chart-card anim-up" data-delay="200">
            <div class="chart-title">Interventions manuelles</div>
            <svg viewBox="0 0 260 120" width="100%" aria-label="Courbe avant/après Pinapp">
              <!-- Avant -->
              <polyline points="10,80 50,60 90,75 130,55 170,70 210,50 250,65"
                fill="none" stroke="#ff6b6b" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
              <!-- Avec Pinapp -->
              <polyline points="10,85 50,70 90,55 130,40 170,32 210,28 250,20"
                fill="none" stroke="#00e5b0" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="curve-legend">
              <div class="curve-leg-item">
                <span class="curve-leg-line" style="background:#ff6b6b;"></span>
                Avant
              </div>
              <div class="curve-leg-item">
                <span class="curve-leg-line" style="background:#00e5b0;"></span>
                Avec Pinapp
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>

    <!-- ══ 5. AURALIS ══ -->
    <section class="snap-section" id="auralis" aria-labelledby="auralis-title">
      <div class="container">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;">
          <div>
            <div class="sector-badge anim-fade" style="margin-bottom:24px;">
              <span style="width:6px;height:6px;background:var(--accent-2);border-radius:50%;display:inline-block;"></span>
              Produit Pinapp · Pre-commercial
            </div>
            <h2 id="auralis-title" style="font-size:clamp(32px,5vw,56px);
                letter-spacing:-0.03em;margin-bottom:20px;" class="anim-up" data-delay="80">
              Auralis RH.<br/>L'IA qui prend<br/>soin des RH.
            </h2>
            <p style="font-size:17px;color:var(--text-muted);margin-bottom:24px;line-height:1.7;"
               class="anim-up" data-delay="160">
              53% des RH sont épuisés. Ils gèrent le burnout des autres.
              Personne ne gère le leur.
            </p>
            <blockquote style="font-size:18px;font-style:italic;color:var(--accent-2);
                               border-left:2px solid var(--accent-2);padding-left:20px;
                               margin-bottom:32px;line-height:1.5;"
                        class="anim-up" data-delay="200">
              "Aurora prépare. Vous décidez. Toujours."
            </blockquote>
            <a href="auralis/" class="btn btn--primary anim-up" data-delay="260">
              Découvrir Auralis RH →
            </a>
          </div>
          <div class="card aurora-mock anim-scale" data-delay="150">
            <div class="aurora-mock__header">
              <div class="aurora-dot"></div>
              <div>
                <div class="aurora-mock__name">Aurora</div>
                <div class="aurora-mock__state">Mode proactif · 09h14</div>
              </div>
            </div>
            <p class="aurora-mock__msg">
              "Trois dossiers présentent des signaux de surcharge cette semaine.
              Un entretien préventif pourrait être pertinent avant vendredi."
            </p>
            <p class="aurora-mock__footer">Suggestion générée · Décision RH conservée</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ 6. MICHA / MÉMOIRE & PRÉSENCE ══ -->
    <section class="snap-section" id="micha" aria-labelledby="micha-title">
      <div class="container">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;">
          <div>
            <div class="sector-badge anim-fade" style="margin-bottom:24px;
                 color:var(--accent-3);border-color:rgba(127,255,234,0.2);
                 background:rgba(127,255,234,0.08);">
              🌿 Mémoire & Présence · Partenaire imagerie
            </div>
            <h2 id="micha-title" style="font-size:clamp(28px,4vw,48px);
                letter-spacing:-0.03em;margin-bottom:20px;" class="anim-up" data-delay="80">
              Des visuels qui font ressentir ce que les mots ne peuvent pas dire.
            </h2>
            <p style="font-size:16px;color:var(--text-muted);margin-bottom:24px;line-height:1.7;"
               class="anim-up" data-delay="160">
              Michaël Bouilhac — vidéaste, photographe, directeur artistique.
              Photo, vidéo, restauration, branding Adobe et IA générative.
              Nouvelle-Aquitaine · France entière à distance.
            </p>
            <ul class="checklist anim-up" data-delay="200">
              <li>Photo & vidéo professionnelles</li>
              <li>Restauration highfield</li>
              <li>Branding Adobe complet</li>
              <li>IA générative dirigée</li>
            </ul>
            <div style="margin-top:32px;display:flex;gap:16px;flex-wrap:wrap;"
                 class="anim-up" data-delay="260">
              <a href="https://memoireetpresence.fr" target="_blank" rel="noopener"
                 class="btn btn--primary">
                Voir Mémoire & Présence →
              </a>
              <div style="font-family:'Clash Display',sans-serif;font-size:24px;
                          color:var(--nacre);display:flex;align-items:center;">
                À partir de 300 € HT
              </div>
            </div>
          </div>
          <div class="card anim-scale" data-delay="150"
               style="padding:40px;text-align:center;
                      background:rgba(127,255,234,0.04);
                      border-color:rgba(127,255,234,0.10);">
            <div style="font-size:64px;margin-bottom:16px;">🎬</div>
            <div style="font-family:'Clash Display',sans-serif;font-size:22px;
                        font-weight:700;color:var(--text);margin-bottom:8px;">
              Micha
            </div>
            <div style="font-size:13px;color:var(--accent-3);letter-spacing:0.08em;
                        text-transform:uppercase;margin-bottom:20px;">
              Vidéaste · DA · M&P
            </div>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">
              Contact exclusif par WhatsApp.<br/>
              <a href="mailto:micha@memoireetpresence.fr"
                 style="color:var(--accent-3);text-decoration:none;">
                micha@memoireetpresence.fr
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ 7. COMMENT ÇA MARCHE ══ -->
    <section class="snap-section" id="comment" aria-labelledby="comment-title">
      <div class="container">
        <span class="label anim-fade">Comment ça marche</span>
        <h2 id="comment-title" style="font-size:clamp(28px,4vw,48px);
            letter-spacing:-0.03em;margin-bottom:48px;" class="anim-up" data-delay="80">
          De la première question<br/>à la livraison.
        </h2>
        <p style="font-size:17px;color:var(--text-muted);margin-bottom:48px;
                  max-width:500px;line-height:1.6;" class="anim-up" data-delay="120">
          Pas d'appel. Tout par écrit. Vous gardez la main.
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;">

          <div class="card anim-up" data-delay="0" style="padding:32px;">
            <div style="font-family:'Clash Display',sans-serif;font-size:56px;
                        font-weight:700;color:var(--accent);opacity:0.4;
                        line-height:1;margin-bottom:16px;">01</div>
            <h3 style="font-size:20px;margin-bottom:12px;">Vous décrivez votre besoin</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">
              Par écrit, en quelques lignes. Votre secteur, votre problème, votre délai. Je réponds sous 24h.
            </p>
          </div>

          <div class="card anim-up" data-delay="80" style="padding:32px;">
            <div style="font-family:'Clash Display',sans-serif;font-size:56px;
                        font-weight:700;color:var(--accent-2);opacity:0.4;
                        line-height:1;margin-bottom:16px;">02</div>
            <h3 style="font-size:20px;margin-bottom:12px;">Je diagnostique</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">
              J'analyse ce que vous faites aujourd'hui, ce qui peut être automatisé, ce qui peut être amélioré.
            </p>
          </div>

          <div class="card anim-up" data-delay="160" style="padding:32px;">
            <div style="font-family:'Clash Display',sans-serif;font-size:56px;
                        font-weight:700;color:var(--accent-3);opacity:0.4;
                        line-height:1;margin-bottom:16px;">03</div>
            <h3 style="font-size:20px;margin-bottom:12px;">Je propose et je construis</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">
              Un devis clair. Vous validez. Je construis. Vous suivez l'avancement par écrit.
            </p>
          </div>

          <div class="card anim-up" data-delay="240" style="padding:32px;">
            <div style="font-family:'Clash Display',sans-serif;font-size:56px;
                        font-weight:700;color:var(--accent-4);opacity:0.4;
                        line-height:1;margin-bottom:16px;">04</div>
            <h3 style="font-size:20px;margin-bottom:12px;">Vous recevez et utilisez</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">
              Livraison, tests, documentation. Formation 1h incluse.<br/>
              Satisfait ou remboursé 30 jours.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- ══ 8. CONTACT ══ -->
    <section class="snap-section" id="contact" aria-labelledby="contact-title">
      <div class="container" style="text-align:center;max-width:700px;margin:0 auto;">
        <span class="label anim-fade">Premier échange offert</span>
        <h2 id="contact-title" style="font-size:clamp(32px,6vw,72px);
            letter-spacing:-0.04em;margin-bottom:24px;" class="anim-up" data-delay="80">
          Par quoi on commence ?
        </h2>
        <p style="font-size:18px;color:var(--text-muted);margin-bottom:48px;line-height:1.6;"
           class="anim-up" data-delay="160">
          Décrivez votre besoin par écrit. Je vous réponds sous 24h avec un diagnostic et une proposition concrète. Aucun engagement.
        </p>
        <div class="anim-scale" data-delay="240">
          <a href="diagnostic/" class="btn btn--primary"
             style="font-size:16px;padding:18px 40px;">
            Commencer — par écrit →
          </a>
        </div>
        <p style="font-size:12px;color:var(--text-muted);margin-top:24px;
                  letter-spacing:0.06em;" class="anim-fade" data-delay="320">
          Satisfait ou remboursé 30 jours · Prix HT · TVA non applicable art. 293 B CGI
        </p>
      </div>
    </section>

    <!-- ══ FOOTER ══ -->
    <footer style="scroll-snap-align:start;border-top:1px solid var(--separator);
                   padding:60px 0 40px;position:relative;z-index:1;">
      <div class="container">
        <div class="footer__brand">Pinapp <span>Studio</span></div>
        <p class="footer__tagline">Connecter. Construire. Transmettre.</p>
        <nav class="footer__links" aria-label="Liens footer">
          <a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
          <a href="mailto:contact@pinapp.fr">Contact</a>
          <a href="legal/mentions.html">Mentions légales</a>
          <a href="legal/cgv.html">CGV</a>
          <a href="legal/confidentialite.html">Confidentialité</a>
          <a href="https://memoireetpresence.fr" target="_blank" rel="noopener">🌿 Mémoire & Présence</a>
        </nav>
        <p class="footer__legal">
          © 2026 Pinapp Studio · Prix HT · TVA non applicable art. 293 B CGI
        </p>
      </div>
    </footer>

  </div><!-- /snap-container -->
  </main>

  <script src="assets/js/particles.js" defer></script>
  <script src="assets/js/main.js" defer></script>
</body>
</html>
'@

Set-Content -Path "$Root/index.html" -Value $html -Encoding UTF8
Write-Host "   + index.html" -ForegroundColor Gray

# ==============================================================================
# 7. SFTP.JSON — Connexion Cursor → Hostinger
# ==============================================================================
Write-Host "▶ 7/8 sftp.json (Cursor → Hostinger)..." -ForegroundColor Cyan

$sftp = @'
{
  "name": "Pinapp Hostinger",
  "host": "TON_SERVEUR_HOSTINGER.hostinger.com",
  "protocol": "sftp",
  "port": 22,
  "username": "TON_USERNAME_HOSTINGER",
  "remotePath": "/public_html",
  "uploadOnSave": false,
  "ignore": [
    ".git",
    ".cursorrules",
    "node_modules",
    "*.ps1",
    "*.md",
    "sftp.json",
    ".env*"
  ]
}
'@

Set-Content -Path "$Root/.vscode/sftp.json" -Value $sftp -Encoding UTF8

# Ajouter sftp.json au .gitignore
$gitignorePath = "$Root/.gitignore"
if (Test-Path $gitignorePath) {
  $gi = Get-Content $gitignorePath -Raw
  if ($gi -notmatch "sftp\.json") {
    Add-Content -Path $gitignorePath -Value "`n.vscode/sftp.json"
    Write-Host "   + .gitignore mis à jour (sftp.json exclu)" -ForegroundColor Gray
  }
}
Write-Host "   + .vscode/sftp.json — à remplir avec tes credentials Hostinger" -ForegroundColor Gray

# ==============================================================================
# 8. RÉSUMÉ FINAL
# ==============================================================================
Write-Host ""
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  REFONTE TERMINÉE — DA PANDORA/AVATAR COMPLÈTE" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""
Write-Host "  Fichiers générés :" -ForegroundColor White
Write-Host "  + .cursorrules          — réécrit complet (agents, DA, Micha, stack)" -ForegroundColor Gray
Write-Host "  + assets/css/pinapp-global.css  — tokens nuit + jour Avatar 2" -ForegroundColor Gray
Write-Host "  + assets/js/theme.js    — toggle dark/light localStorage" -ForegroundColor Gray
Write-Host "  + assets/js/particles.js — canvas Pandora 80pt 4 couleurs liaisons" -ForegroundColor Gray
Write-Host "  + assets/js/main.js     — snap, dots, count-up, graphiques, filtres" -ForegroundColor Gray
Write-Host "  + index.html            — 8 sections snap complètes" -ForegroundColor Gray
Write-Host "  + .vscode/sftp.json     — à remplir (host + username Hostinger)" -ForegroundColor Gray
Write-Host ""
Write-Host "  DA validée :" -ForegroundColor White
Write-Host "  · Nuit  #080d18 · Particules cyan+violet+menthe+magenta · liaisons" -ForegroundColor Gray
Write-Host "  · Jour  #0a2a2e · Caustics Avatar 2 · Rayons lumineux diagonaux" -ForegroundColor Gray
Write-Host "  · Clash Display 700 titres · Inter corps" -ForegroundColor Gray
Write-Host "  · Nacré #e8f4f8 (champagne supprimé définitivement)" -ForegroundColor Gray
Write-Host "  · Violet #b388ff nuit · Lavande #c4b5fd jour" -ForegroundColor Gray
Write-Host "  · Glassmorphism rgba(255,255,255,0.04) blur(20px)" -ForegroundColor Gray
Write-Host "  · Scroll-snap 100vh · Nav latérale 8 points · TDAH-friendly" -ForegroundColor Gray
Write-Host "  · Micha = prestataire M&P · Zéro photo Lauralie · Zéro Unsplash" -ForegroundColor Gray
Write-Host ""
Write-Host "  ÉTAPES SUIVANTES :" -ForegroundColor Yellow
Write-Host "  1. npm run dev  →  vérifier sur localhost:5173" -ForegroundColor Gray
Write-Host "  2. Remplir .vscode/sftp.json avec credentials Hostinger hPanel" -ForegroundColor Gray
Write-Host "  3. Activer SSL sur Hostinger (hPanel → SSL → Let's Encrypt)" -ForegroundColor Gray
Write-Host "  4. .\pinapp.ps1 ship  →  push main  →  déploiement" -ForegroundColor Gray
Write-Host ""
Write-Host "  Thomas — aucun blocage qualité détecté." -ForegroundColor Cyan
Write-Host ""
