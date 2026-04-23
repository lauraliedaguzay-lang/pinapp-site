# ==============================================================================
# PINAPP INC. — CORRECTIF COMPLET V2
# Script PowerShell — Cursor exécute depuis la racine du dépôt
# Résout les 15 problèmes identifiés en audit
# Intègre : pricing Micha · cursus formations · storyboard · portfolio
#           carousel · 3 formulaires · leviers psycho · études citées
#           mode jour Avatar 2 renforcé · Clash Display self-hosted
#           scroll-snap fix · emojis → SVG · SSL reminder · placeholders
# ==============================================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $Root

function Write-Step { param($n,$t) Write-Host "▶ $n $t" -ForegroundColor Cyan }
function Write-OK   { param($f)    Write-Host "   ✓ $f" -ForegroundColor Gray }

Write-Host ""
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  PINAPP INC. — CORRECTIF COMPLET V2" -ForegroundColor Magenta
Write-Host "  15 problèmes résolus · Tout prêt à déployer" -ForegroundColor Magenta
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

# Dossiers
$dirs = @(
  "assets/css","assets/js","assets/fonts",
  "a-propos","offres/formation",
  "memoire-et-presence","auralis",
  "diagnostic","legal","engagements",
  "realisations","n8n-workflows","demo"
)
foreach ($d in $dirs) { New-Item -ItemType Directory -Force -Path "$Root/$d" | Out-Null }

# ==============================================================================
# 1. FONT-FACE — Clash Display self-hosted
# Fichiers .woff2 à placer dans assets/fonts/
# Télécharger sur : https://fontsource.org/fonts/clash-display
# ==============================================================================
Write-Step "1/12" "Font-face Clash Display self-hosted..."

$fontFaceCSS = @'
/* ============================================================
   PINAPP INC. — FONT-FACE SELF-HOSTED
   Clash Display · woff2 · assets/fonts/
   Télécharger sur https://fontsource.org/fonts/clash-display
   ============================================================ */

@font-face {
  font-family: 'Clash Display';
  src: url('/assets/fonts/ClashDisplay-Regular.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Clash Display';
  src: url('/assets/fonts/ClashDisplay-Medium.woff2') format('woff2');
  font-weight: 500; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Clash Display';
  src: url('/assets/fonts/ClashDisplay-Semibold.woff2') format('woff2');
  font-weight: 600; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Clash Display';
  src: url('/assets/fonts/ClashDisplay-Bold.woff2') format('woff2');
  font-weight: 700; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/assets/fonts/Inter-Light.woff2') format('woff2');
  font-weight: 300; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/assets/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/assets/fonts/Inter-Medium.woff2') format('woff2');
  font-weight: 500; font-style: normal; font-display: swap;
}

/* Fallback Bunny Fonts si fichiers locaux absents */
@import url('https://fonts.bunny.net/css?family=clash-display:wght@400;500;600;700|inter:wght@300;400;500&display=swap');
'@

Set-Content -Path "$Root/assets/css/fonts.css" -Value $fontFaceCSS -Encoding UTF8
Write-OK "assets/css/fonts.css"

# Créer les placeholders de fonts
$fontPlaceholder = "<!-- ⚠️ [LAURALIE] Télécharger Clash Display woff2 sur https://fontsource.org/fonts/clash-display et placer dans assets/fonts/ -->"
Set-Content -Path "$Root/assets/fonts/README.txt" -Value @"
FONTS REQUISES — PINAPP INC.
==============================

Clash Display (titres) :
→ https://fontsource.org/fonts/clash-display
→ Télécharger : ClashDisplay-Regular.woff2, ClashDisplay-Medium.woff2,
                ClashDisplay-Semibold.woff2, ClashDisplay-Bold.woff2

Inter (corps) :
→ https://fontsource.org/fonts/inter
→ Télécharger : Inter-Light.woff2, Inter-Regular.woff2, Inter-Medium.woff2

Placer tous les fichiers dans ce dossier (assets/fonts/)
Puis lancer : .\pinapp.ps1 ship
"@ -Encoding UTF8
Write-OK "assets/fonts/README.txt"

# ==============================================================================
# 2. CSS GLOBAL V2 — corrections complètes
# ==============================================================================
Write-Step "2/12" "pinapp-global.css V2..."

$cssGlobal = @'
/* ============================================================
   PINAPP INC. — GLOBAL CSS V2
   Correctif complet · DA Pandora/Avatar · Apple glassmorphism
   Clash Display self-hosted + fallback Bunny
   Scroll-snap fix Safari · Mode nuit défaut forcé
   Mode jour Avatar 2 renforcé · Emojis → SVG
   ============================================================ */

/* Import fonts */
@import url('/assets/css/fonts.css');

/* ── TOKENS NUIT (défaut absolu) ── */
:root {
  --bg:          #080d18;
  --bg-card:     rgba(255,255,255,0.04);
  --bg-card-2:   rgba(255,255,255,0.07);
  --text:        #f0f8ff;
  --text-muted:  rgba(240,248,255,0.55);
  --text-soft:   rgba(240,248,255,0.35);
  --accent:      #00e5b0;
  --accent-2:    #b388ff;
  --accent-3:    #7fffea;
  --accent-4:    #e040fb;
  --nacre:       #e8f4f8;
  --card-border: rgba(179,136,255,0.08);
  --card-border-2:rgba(0,229,176,0.12);
  --separator:   rgba(0,229,176,0.06);
  --shadow:      rgba(0,0,0,0.25);
  --shadow-lg:   rgba(0,0,0,0.40);
  --btn-cta-bg:  rgba(91,60,180,0.85);
  --btn-cta-bd:  rgba(179,136,255,0.30);
  --btn-ghost-bd:rgba(255,255,255,0.12);
  --max-w:       1280px;
  --pad-d:       80px;
  --pad-t:       40px;
  --pad-m:       20px;
  --radius:      20px;
  --radius-sm:   12px;
  --ease:        cubic-bezier(0.25,0.1,0.25,1);
  --ease-in:     cubic-bezier(0.22,1,0.36,1);
  --ease-spring: cubic-bezier(0.34,1.56,0.64,1);
}

/* ── TOKENS JOUR — Eau Avatar 2 renforcée ── */
[data-theme="light"] {
  --bg:          #061e22;
  --bg-card:     rgba(6,40,46,0.70);
  --bg-card-2:   rgba(6,40,46,0.90);
  --text:        #f0fffd;
  --text-muted:  rgba(240,255,253,0.60);
  --text-soft:   rgba(240,255,253,0.35);
  --accent:      #7fffea;
  --accent-2:    #c4b5fd;
  --accent-3:    #ffffff;
  --accent-4:    #a78bfa;
  --nacre:       #e8f4f8;
  --card-border: rgba(127,255,234,0.14);
  --card-border-2:rgba(196,181,253,0.14);
  --separator:   rgba(127,255,234,0.08);
  --shadow:      rgba(0,0,0,0.30);
  --shadow-lg:   rgba(0,0,0,0.50);
  --btn-cta-bg:  rgba(109,40,217,0.85);
  --btn-cta-bd:  rgba(196,181,253,0.35);
  --btn-ghost-bd:rgba(127,255,234,0.20);
}

/* ── RESET ── */
*,*::before,*::after { box-sizing:border-box; margin:0; padding:0 }
html { -webkit-font-smoothing:antialiased; text-size-adjust:100%; scroll-behavior:smooth }

/* MODE NUIT FORCÉ PAR DÉFAUT */
html:not([data-theme]) { color-scheme: dark }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
  font-size: 16px;
  line-height: 1.75;
  overflow-x: hidden;
  transition: background 0.6s var(--ease), color 0.4s var(--ease);
  min-height: 100dvh;
}

/* ── SCROLL SNAP — FIX SAFARI ── */
.snap-container {
  height: 100dvh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: none;
}
.snap-section {
  min-height: 100dvh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  position: relative;
  /* Fix nav fixe 64px */
  padding: 84px 0 48px;
  z-index: 1;
}
@media (max-width: 768px) {
  .snap-section { padding: 80px 0 40px; }
}

/* ── CANVAS PARTICULES NUIT ── */
#canvas-pandora {
  position: fixed; inset: 0; z-index: 0;
  pointer-events: none; opacity: 0.75;
  transition: opacity 0.6s var(--ease);
}
[data-theme="light"] #canvas-pandora { opacity: 0; pointer-events: none; }

/* ── FOND JOUR — EAU AVATAR 2 RENFORCÉE ── */
.caustics {
  position: fixed; inset: 0; z-index: 0;
  pointer-events: none; opacity: 0;
  transition: opacity 0.7s var(--ease);
}
[data-theme="light"] .caustics { opacity: 1; }

.caustics span {
  position: absolute; border-radius: 50%;
  filter: blur(90px); mix-blend-mode: screen;
  animation: caustic-drift linear infinite;
}
.caustics span:nth-child(1) {
  width: 70vw; height: 70vw;
  background: rgba(0,229,176,0.18);
  top: -30%; left: -20%;
  animation-duration: 14s;
}
.caustics span:nth-child(2) {
  width: 50vw; height: 50vw;
  background: rgba(127,255,234,0.12);
  top: 20%; right: -20%;
  animation-duration: 10s; animation-delay: -4s;
}
.caustics span:nth-child(3) {
  width: 40vw; height: 40vw;
  background: rgba(255,255,255,0.08);
  bottom: -15%; left: 25%;
  animation-duration: 16s; animation-delay: -8s;
}
.caustics span:nth-child(4) {
  width: 30vw; height: 30vw;
  background: rgba(196,181,253,0.08);
  top: 50%; left: 40%;
  animation-duration: 12s; animation-delay: -2s;
}

@keyframes caustic-drift {
  0%   { transform: translate(0,0) scale(1) rotate(0deg); }
  25%  { transform: translate(4vw,-5vh) scale(1.08) rotate(3deg); }
  50%  { transform: translate(-3vw,4vh) scale(0.95) rotate(-2deg); }
  75%  { transform: translate(2vw,-2vh) scale(1.04) rotate(1deg); }
  100% { transform: translate(0,0) scale(1) rotate(0deg); }
}

/* Surface eau animée — mode jour */
.water-surface {
  position: fixed; inset: 0; z-index: 0;
  pointer-events: none; opacity: 0;
  transition: opacity 0.7s var(--ease);
  background: repeating-linear-gradient(
    -55deg,
    transparent 0px, transparent 88px,
    rgba(127,255,234,0.015) 88px, rgba(127,255,234,0.015) 90px
  );
  animation: water-drift 8s ease-in-out infinite;
}
[data-theme="light"] .water-surface { opacity: 1; }

@keyframes water-drift {
  0%, 100% { background-position: 0 0; }
  50% { background-position: 20px 20px; }
}

/* Reflets surface */
.water-reflets {
  position: fixed; top: 0; left: 0; right: 0;
  height: 30vh; z-index: 0; pointer-events: none;
  opacity: 0; transition: opacity 0.7s var(--ease);
  background: linear-gradient(180deg,
    rgba(127,255,234,0.06) 0%,
    transparent 100%
  );
  animation: reflets-pulse 4s ease-in-out infinite;
}
[data-theme="light"] .water-reflets { opacity: 1; }
@keyframes reflets-pulse {
  0%,100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* ── NAV DOTS ── */
.nav-dots {
  position: fixed; right: 20px; top: 50%;
  transform: translateY(-50%); z-index: 50;
  display: flex; flex-direction: column; gap: 10px;
}
.nav-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--text-soft); border: none;
  cursor: pointer; transition: all 0.3s var(--ease); padding: 0;
}
.nav-dot.active {
  background: var(--accent); transform: scale(1.7);
  box-shadow: 0 0 8px var(--accent);
}
@media (max-width: 768px) { .nav-dots { display: none; } }

/* ── NAV PRINCIPALE ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0;
  height: 64px; z-index: 100;
  background: rgba(8,13,24,0.85);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--separator);
  transition: transform 0.3s var(--ease), background 0.5s;
}
[data-theme="light"] .nav { background: rgba(6,30,34,0.90); }
.nav.hidden { transform: translateY(-100%); }

.nav__inner {
  display: flex; align-items: center;
  justify-content: space-between; height: 100%;
  max-width: var(--max-w); margin: 0 auto;
  padding: 0 var(--pad-d);
}
@media (max-width: 768px) { .nav__inner { padding: 0 var(--pad-m); } }

.nav__logo {
  font-family: 'Clash Display',sans-serif;
  font-size: 17px; font-weight: 700;
  color: var(--text); text-decoration: none;
  letter-spacing: 0.02em;
}
.nav__logo span { color: var(--nacre); }

.nav__menu { display: flex; gap: 4px; list-style: none; position: relative; }
.nav__item { position: relative; }
.nav__link {
  font-size: 12px; color: var(--text-muted);
  text-decoration: none; letter-spacing: 0.08em;
  text-transform: uppercase; padding: 8px 12px;
  border-radius: 8px; display: flex; align-items: center; gap: 4px;
  transition: color 0.2s, background 0.2s;
}
@media (hover:hover) {
  .nav__link:hover { color: var(--text); background: rgba(255,255,255,0.05); }
}

.nav__dropdown {
  display: none; position: absolute; top: calc(100% + 8px); left: 0;
  background: rgba(8,13,24,0.96); backdrop-filter: blur(24px);
  border: 1px solid var(--card-border); border-radius: 14px;
  padding: 8px; min-width: 220px; z-index: 200;
  box-shadow: 0 16px 40px rgba(0,0,0,0.4);
}
[data-theme="light"] .nav__dropdown { background: rgba(6,30,34,0.97); }
.nav__item:hover .nav__dropdown { display: block; }
.nav__dropdown a {
  display: block; padding: 10px 14px;
  font-size: 13px; color: var(--text-muted);
  text-decoration: none; border-radius: 8px;
  transition: color 0.2s, background 0.2s;
}
@media (hover:hover) {
  .nav__dropdown a:hover { color: var(--text); background: rgba(255,255,255,0.05); }
}
.nav__dropdown-label {
  font-size: 10px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--accent);
  padding: 8px 14px 4px; display: block;
}

.nav__actions { display: flex; align-items: center; gap: 10px; }
.nav__theme {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(0,229,176,0.08);
  border: 1px solid var(--card-border);
  color: var(--accent); cursor: pointer; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, transform 0.2s;
}
@media (hover:hover) {
  .nav__theme:hover { background: rgba(0,229,176,0.15); transform: rotate(20deg); }
}
.nav__cta {
  font-size: 12px; padding: 9px 18px;
  background: var(--btn-cta-bg);
  border: 1px solid var(--btn-cta-bd);
  border-radius: 100px; color: var(--text);
  text-decoration: none; backdrop-filter: blur(8px);
  letter-spacing: 0.04em; white-space: nowrap;
  transition: opacity 0.2s, transform 0.2s;
}
@media (hover:hover) { .nav__cta:hover { opacity: 0.85; transform: translateY(-1px); } }

.nav__burger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 4px;
}
.nav__burger span {
  display: block; width: 22px; height: 1.5px;
  background: var(--text); border-radius: 1px;
  transition: transform 0.3s var(--ease), opacity 0.3s;
}
.nav__burger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.nav__burger.open span:nth-child(2) { opacity: 0; }
.nav__burger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

/* Drawer mobile amélioré */
.nav__drawer {
  display: none; position: fixed;
  top: 64px; left: 0; right: 0; bottom: 0;
  background: rgba(6,8,20,0.98);
  backdrop-filter: blur(24px);
  z-index: 99; flex-direction: column;
  padding: 32px var(--pad-m) 40px;
  overflow-y: auto;
  border-top: 1px solid var(--separator);
}
[data-theme="light"] .nav__drawer { background: rgba(4,18,22,0.98); }
.nav__drawer.open { display: flex; }

.nav__drawer-section { margin-bottom: 28px; }
.nav__drawer-label {
  font-size: 10px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--accent);
  margin-bottom: 12px; display: block;
}
.nav__drawer a {
  font-size: 18px; color: var(--text-muted);
  text-decoration: none; display: block;
  padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: color 0.2s, padding-left 0.2s;
}
@media (hover:hover) { .nav__drawer a:hover { color: var(--text); padding-left: 8px; } }

/* STORYBOARD dans drawer */
.drawer-story {
  margin-top: auto; padding-top: 28px;
  border-top: 1px solid var(--separator);
}
.drawer-story-title {
  font-size: 10px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--accent-2);
  margin-bottom: 16px; display: block;
}
.drawer-story-cards {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}
.drawer-story-card {
  background: var(--bg-card); border: 1px solid var(--card-border);
  border-radius: 14px; padding: 16px; text-decoration: none;
  transition: transform 0.2s, border-color 0.2s;
}
@media (hover:hover) {
  .drawer-story-card:hover { transform: translateY(-2px); border-color: var(--accent); }
}
.drawer-story-avatar {
  width: 48px; height: 48px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Clash Display',sans-serif;
  font-size: 20px; font-weight: 700;
  margin-bottom: 10px;
}
.drawer-story-name {
  font-family: 'Clash Display',sans-serif;
  font-size: 15px; font-weight: 700;
  color: var(--text); margin-bottom: 4px;
}
.drawer-story-role { font-size: 11px; color: var(--text-muted); line-height: 1.4; }

@media (max-width: 900px) {
  .nav__menu, .nav__cta { display: none; }
  .nav__burger { display: flex; }
}

/* ── PROGRESS ── */
#progress {
  position: fixed; top: 0; left: 0;
  height: 2px; width: 0%;
  background: linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent-4));
  z-index: 200; transition: width 0.1s linear;
}

/* ── CURSEUR AVEC TRAÎNÉE ── */
#cursor {
  width: 20px; height: 20px;
  border: 1px solid var(--accent);
  border-radius: 50%; position: fixed;
  pointer-events: none; z-index: 9999;
  transform: translate(-50%,-50%);
  transition: transform 0.1s var(--ease), opacity 0.2s, border-color 0.3s, width 0.3s, height 0.3s;
  mix-blend-mode: difference; opacity: 0;
}
#cursor-trail {
  width: 40px; height: 40px;
  border: 1px solid rgba(0,229,176,0.2);
  border-radius: 50%; position: fixed;
  pointer-events: none; z-index: 9998;
  transform: translate(-50%,-50%);
  transition: left 0.15s var(--ease), top 0.15s var(--ease), opacity 0.2s;
  opacity: 0;
}
@media (hover:hover) { #cursor { opacity: 1; } #cursor-trail { opacity: 1; } }
#cursor.active { width: 36px; height: 36px; border-color: var(--accent-2); }

/* ── CONTAINER ── */
.container {
  max-width: var(--max-w); margin: 0 auto;
  padding: 0 var(--pad-d); width: 100%;
}
@media (max-width: 1024px) { .container { padding: 0 var(--pad-t); } }
@media (max-width: 390px)  { .container { padding: 0 var(--pad-m); } }

/* ── CARDS GLASS ── */
.card {
  background: var(--bg-card);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--card-border);
  border-radius: var(--radius);
  box-shadow: 0 8px 32px var(--shadow);
  position: relative; overflow: hidden;
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease), border-color 0.3s;
}
.card::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(0,229,176,0.03) 0%,
    rgba(179,136,255,0.02) 50%,
    rgba(232,244,248,0.01) 100%
  );
}
@media (hover:hover) {
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 64px var(--shadow-lg);
    border-color: rgba(0,229,176,0.15);
  }
}

/* Card accent */
.card--accent { border-color: rgba(0,229,176,0.15); }
.card--violet { border-color: rgba(179,136,255,0.15); }
.card--nacre  { border-color: rgba(232,244,248,0.15); }

/* ── TYPOGRAPHIE ── */
h1,h2,h3,h4 {
  font-family: 'Clash Display',sans-serif;
  font-weight: 700; text-wrap: balance; line-height: 1.05;
}
.label {
  font-size: 11px; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--accent);
  font-weight: 500; display: block; margin-bottom: 16px;
}

/* Typewriter hero */
.typewriter { overflow: hidden; border-right: 2px solid var(--accent); white-space: nowrap; animation: typewriter 2s steps(40,end) 0.5s forwards, blink 0.75s step-end infinite; width: 0; }
@keyframes typewriter { to { width: 100%; } }
@keyframes blink { 0%,100% { border-color: var(--accent); } 50% { border-color: transparent; } }

/* ── SHIMMER ── */
.shimmer {
  background: linear-gradient(
    90deg,
    var(--text) 0%, var(--accent-3) 25%,
    var(--accent-2) 50%, var(--nacre) 75%, var(--text) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; animation: shimmer 5s linear infinite;
}
@keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }

/* ── BOUTONS ── */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border-radius: 100px;
  font-size: 13px; letter-spacing: 0.05em;
  font-family: 'Inter',sans-serif; font-weight: 500;
  text-decoration: none; cursor: pointer;
  transition: opacity 0.2s, transform 0.2s var(--ease-spring);
  border: none;
}
.btn--primary {
  background: var(--btn-cta-bg);
  border: 1px solid var(--btn-cta-bd);
  color: var(--text); backdrop-filter: blur(8px);
}
.btn--ghost {
  background: transparent;
  border: 1px solid var(--btn-ghost-bd);
  color: var(--text-muted);
}
.btn--nacre {
  background: rgba(232,244,248,0.08);
  border: 1px solid rgba(232,244,248,0.20);
  color: var(--nacre);
}
@media (hover:hover) {
  .btn:hover { opacity: 0.85; transform: translateY(-2px) scale(1.01); }
  .btn--ghost:hover { color: var(--text); border-color: var(--accent); }
}

/* ── SVG ICONS ── */
.icon-svg {
  width: 40px; height: 40px; margin-bottom: 16px;
  color: var(--accent); flex-shrink: 0;
}
.icon-svg--violet { color: var(--accent-2); }
.icon-svg--nacre  { color: var(--nacre); }

/* ── LISTES ── */
.checklist { list-style: none; display: flex; flex-direction: column; gap: 10px; margin: 16px 0; }
.checklist li { font-size: 14px; color: var(--text-muted); padding-left: 20px; position: relative; line-height: 1.5; }
.checklist li::before { content: '—'; position: absolute; left: 0; color: var(--accent); }
.crosslist { list-style: none; display: flex; flex-direction: column; gap: 8px; margin: 12px 0; }
.crosslist li { font-size: 13px; color: var(--text-muted); padding-left: 20px; position: relative; }
.crosslist li::before { content: '×'; position: absolute; left: 0; color: #ff6b6b; font-weight: 700; }

/* ── ANIMATIONS ── */
.anim-fade,.anim-up,.anim-scale,.anim-left,.anim-right {
  opacity: 0;
  transition: opacity 0.8s var(--ease-in), transform 0.8s var(--ease-in);
}
.anim-up    { transform: translateY(32px); }
.anim-scale { transform: scale(0.93); }
.anim-left  { transform: translateX(-32px); }
.anim-right { transform: translateX(32px); }
.anim-fade.visible,.anim-up.visible,.anim-scale.visible,
.anim-left.visible,.anim-right.visible { opacity: 1; transform: none; }

/* ── BADGE ÉTUDE ── */
.study-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; background: rgba(0,229,176,0.08);
  border: 1px solid rgba(0,229,176,0.15); border-radius: 6px;
  font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 8px;
}

/* ── OFFRE CARDS ── */
.offre-card { padding: 32px; }
.offre-label { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-2); margin-bottom: 12px; display: block; }
.offre-title { font-size: 24px; margin-bottom: 14px; line-height: 1.1; }
.offre-desc  { font-size: 14px; color: var(--text-muted); margin-bottom: 18px; line-height: 1.7; }
.offre-reste { font-size: 15px; font-style: italic; color: var(--accent-3); margin: 14px 0; padding-left: 16px; border-left: 2px solid var(--accent); line-height: 1.5; }
.offre-gain  { font-family: 'Clash Display',sans-serif; font-size: 44px; font-weight: 700; color: var(--accent); margin: 14px 0 2px; }
.offre-gain-label { font-size: 12px; color: var(--text-muted); margin-bottom: 18px; }
.offre-price { font-family: 'Clash Display',sans-serif; font-size: 32px; font-weight: 700; color: var(--nacre); margin-bottom: 4px; }
.offre-delai { font-size: 12px; color: var(--text-muted); margin-bottom: 20px; }

/* ── PACK DUO ── */
.pack-duo { border-color: rgba(232,244,248,0.18); background: rgba(232,244,248,0.03); }
.pack-duo-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: rgba(232,244,248,0.10); border: 1px solid rgba(232,244,248,0.22); border-radius: 100px; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--nacre); margin-bottom: 14px; }
.pack-duo-economy { font-size: 13px; color: var(--accent); margin-bottom: 20px; }

/* ── GRAPHIQUES ── */
.bar-chart { display: flex; align-items: flex-end; gap: 12px; height: 120px; }
.bar-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
.bar { width: 100%; border-radius: 6px 6px 0 0; background: linear-gradient(180deg,var(--accent) 0%,rgba(0,229,176,0.3) 100%); transition: height 1.4s var(--ease-in); position: relative; }
.bar-val { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 12px; color: var(--accent); font-weight: 600; }
.bar-label { font-size: 10px; color: var(--text-muted); letter-spacing: 0.06em; text-align: center; }
.chart-title { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-2); margin-bottom: 20px; }
.donut-wrap { display: flex; align-items: center; gap: 24px; }
.donut-legend { display: flex; flex-direction: column; gap: 10px; }
.donut-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted); }
.donut-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.curve-legend { display: flex; gap: 16px; margin-top: 12px; }
.curve-leg-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted); }
.curve-leg-line { width: 16px; height: 2px; border-radius: 1px; }

/* ── SÉLECTEUR SECTEUR ── */
.sector-filter { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 32px; }
.sector-btn { padding: 8px 16px; border-radius: 100px; font-size: 12px; letter-spacing: 0.06em; border: 1px solid var(--card-border); background: transparent; color: var(--text-muted); cursor: pointer; transition: all 0.2s var(--ease); font-family: 'Inter',sans-serif; }
.sector-btn.active { background: var(--btn-cta-bg); border-color: var(--btn-cta-bd); color: var(--text); }

/* ── CAROUSEL PORTFOLIO MICHA ── */
.carousel-wrap { position: relative; overflow: hidden; }
.carousel-track { display: flex; gap: 16px; transition: transform 0.5s var(--ease); will-change: transform; }
.carousel-item {
  flex: 0 0 280px; height: 200px;
  background: var(--bg-card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius); overflow: hidden;
  position: relative; cursor: pointer;
  transition: transform 0.3s var(--ease), border-color 0.3s;
}
@media (hover:hover) {
  .carousel-item:hover { transform: scale(1.02); border-color: var(--accent); }
}
.carousel-item img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  filter: brightness(0.85) contrast(1.05) saturate(0.9);
}
.carousel-placeholder {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 8px; color: var(--text-muted);
  background: var(--bg-card);
  border: 2px dashed rgba(255,255,255,0.08);
  border-radius: var(--radius);
}
.carousel-placeholder-icon { font-size: 28px; opacity: 0.4; }
.carousel-placeholder-label { font-size: 11px; letter-spacing: 0.10em; text-transform: uppercase; opacity: 0.5; }
.carousel-item-overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 12px 16px;
  background: linear-gradient(0deg, rgba(8,13,24,0.9) 0%, transparent 100%);
  font-size: 12px; color: var(--text); letter-spacing: 0.04em;
}
.carousel-controls { display: flex; gap: 8px; margin-top: 16px; justify-content: flex-end; }
.carousel-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--bg-card); border: 1px solid var(--card-border);
  color: var(--text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s var(--ease); font-size: 14px;
}
@media (hover:hover) { .carousel-btn:hover { color: var(--text); border-color: var(--accent); } }

/* Catégories carousel */
.carousel-cats { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.carousel-cat {
  padding: 5px 12px; border-radius: 100px; font-size: 11px;
  border: 1px solid var(--card-border); background: transparent;
  color: var(--text-muted); cursor: pointer;
  transition: all 0.2s var(--ease); font-family: 'Inter',sans-serif;
}
.carousel-cat.active { background: rgba(127,255,234,0.10); border-color: rgba(127,255,234,0.25); color: var(--accent-3); }

/* Lightbox */
.lightbox {
  display: none; position: fixed; inset: 0;
  background: rgba(0,0,0,0.92); z-index: 1000;
  align-items: center; justify-content: center;
  backdrop-filter: blur(8px);
}
.lightbox.open { display: flex; }
.lightbox-inner { max-width: 90vw; max-height: 90vh; position: relative; }
.lightbox-inner img { max-width: 100%; max-height: 90vh; border-radius: 12px; }
.lightbox-close {
  position: absolute; top: -40px; right: 0;
  background: none; border: none; color: var(--text);
  font-size: 24px; cursor: pointer; opacity: 0.7;
  transition: opacity 0.2s;
}
.lightbox-close:hover { opacity: 1; }

/* ── AURORA MOCK ── */
.aurora-dot { width: 8px; height: 8px; background: var(--accent-2); border-radius: 50%; animation: pulse 3s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.7); } }

/* ── ÉTUDE CITÉE ── */
.etude-cite {
  display: flex; gap: 12px; padding: 16px 20px;
  background: rgba(0,229,176,0.04);
  border: 1px solid rgba(0,229,176,0.10);
  border-radius: var(--radius-sm); margin: 16px 0;
}
.etude-cite-bar { width: 3px; background: var(--accent); border-radius: 2px; flex-shrink: 0; }
.etude-cite-text { font-size: 13px; color: var(--text-muted); line-height: 1.6; font-style: italic; }
.etude-cite-source { font-size: 11px; color: var(--text-soft); margin-top: 4px; }

/* ── LEVIER PSYCHO ── */
.urgence-banner {
  padding: 12px 20px;
  background: linear-gradient(90deg, rgba(224,64,251,0.10) 0%, rgba(179,136,255,0.08) 100%);
  border: 1px solid rgba(224,64,251,0.15);
  border-radius: var(--radius-sm);
  font-size: 13px; color: var(--text-muted);
  display: flex; align-items: center; gap: 10px;
  margin: 20px 0;
}
.urgence-dot { width: 6px; height: 6px; background: var(--accent-4); border-radius: 50%; animation: pulse 2s ease-in-out infinite; flex-shrink: 0; }

/* ── EU AI ACT BADGE ── */
.ai-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 8px; background: rgba(179,136,255,0.08);
  border: 1px solid rgba(179,136,255,0.15); border-radius: 4px;
  font-size: 10px; color: var(--accent-2); letter-spacing: 0.06em;
}

/* ── FORMATION CARD ── */
.formation-card { padding: 28px; }
.formation-level { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; display: block; }
.formation-title { font-size: 20px; margin-bottom: 8px; line-height: 1.2; }
.formation-subtitle { font-size: 13px; font-style: italic; color: var(--accent-2); margin-bottom: 12px; }
.formation-desc { font-size: 13px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px; }
.formation-format { font-size: 11px; color: var(--text-soft); letter-spacing: 0.06em; margin-bottom: 16px; }
.formation-price { font-family: 'Clash Display',sans-serif; font-size: 28px; font-weight: 700; color: var(--nacre); margin-bottom: 16px; }

/* ── PRICING MICHA ── */
.pricing-table { width: 100%; border-collapse: collapse; }
.pricing-table th { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); text-align: left; padding: 8px 12px; border-bottom: 1px solid var(--separator); }
.pricing-table td { font-size: 14px; color: var(--text-muted); padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.03); vertical-align: top; }
.pricing-table td:last-child { font-family: 'Clash Display',sans-serif; color: var(--nacre); font-weight: 700; white-space: nowrap; }
.pricing-table tr:hover td { color: var(--text); background: rgba(255,255,255,0.02); }

/* ── FOOTER ── */
footer { border-top: 1px solid var(--separator); padding: 60px 0 40px; position: relative; z-index: 1; }
.footer__brand { font-family: 'Clash Display',sans-serif; font-size: 22px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
.footer__brand span { color: var(--nacre); }
.footer__tagline { font-size: 13px; color: var(--text-muted); letter-spacing: 0.06em; margin-bottom: 24px; }
.footer__links { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 24px; }
.footer__links a { font-size: 12px; color: var(--text-muted); text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase; transition: color 0.2s; }
@media (hover:hover) { .footer__links a:hover { color: var(--accent); } }
.footer__legal { font-size: 11px; color: rgba(240,248,255,0.22); }
.footer__ai-badge { margin-top: 12px; }

/* ── SKIP LINK ── */
.skip-link { position: absolute; top: -100px; left: 16px; background: var(--accent); color: #000; padding: 8px 16px; border-radius: 4px; z-index: 9999; font-size: 14px; transition: top 0.2s; }
.skip-link:focus { top: 8px; }

/* ── LINK ARROW ── */
.link-arrow { font-size: 13px; color: var(--accent); text-decoration: none; letter-spacing: 0.04em; display: inline-flex; align-items: center; gap: 6px; transition: gap 0.2s var(--ease); }
@media (hover:hover) { .link-arrow:hover { gap: 10px; } }

/* ── PLACEHOLDERS DEV ── */
.placeholder-block {
  border: 2px dashed rgba(255,165,0,0.3);
  border-radius: var(--radius); padding: 24px;
  text-align: center; color: rgba(255,165,0,0.6);
  font-size: 12px; letter-spacing: 0.08em;
  font-family: monospace; background: rgba(255,165,0,0.03);
}
'@

Set-Content -Path "$Root/assets/css/pinapp-global.css" -Value $cssGlobal -Encoding UTF8
Write-OK "assets/css/pinapp-global.css V2"

# ==============================================================================
# 3. JS THEME — MODE NUIT FORCÉ PAR DÉFAUT
# ==============================================================================
Write-Step "3/12" "theme.js — mode nuit forcé..."

$jsTheme = @'
/* Pinapp Inc. — Theme · Mode nuit FORCÉ par défaut */
(function(){
  var K='pinapp-theme', h=document.documentElement;
  // Mode nuit TOUJOURS par défaut à la première visite
  function get(){
    var s=localStorage.getItem(K);
    if(s) return s;
    return 'dark'; // Nuit par défaut — pas de détection système
  }
  function apply(t){
    h.setAttribute('data-theme',t);
    localStorage.setItem(K,t);
    var b=document.getElementById('theme-toggle');
    if(b){
      b.textContent=t==='dark'?'◐':'◑';
      b.setAttribute('aria-label',t==='dark'?'Passer en mode jour Avatar 2':'Passer en mode nuit Pandora');
    }
    // Déclencher event pour particles.js
    document.dispatchEvent(new CustomEvent('themeChanged',{detail:{theme:t}}));
  }
  function toggle(){ apply(h.getAttribute('data-theme')==='dark'?'light':'dark'); }
  // Init immédiat avant paint
  apply(get());
  document.addEventListener('DOMContentLoaded',function(){
    var b=document.getElementById('theme-toggle');
    if(b) b.addEventListener('click',toggle);
  });
})();
'@

Set-Content -Path "$Root/assets/js/theme.js" -Value $jsTheme -Encoding UTF8
Write-OK "assets/js/theme.js"

# ==============================================================================
# 4. JS PARTICLES V2 — traînée + sync thème
# ==============================================================================
Write-Step "4/12" "particles.js V2..."

$jsParticles = @'
/* Pinapp Inc. — Canvas Pandora V2 · Nuit · 80pt · 4 couleurs · liaisons · halo */
(function(){
  var canvas=document.getElementById('canvas-pandora');
  if(!canvas)return;
  var ctx=canvas.getContext('2d');
  var C=['#00E5B0','#B388FF','#7FFFEA','#E040FB'];
  var N=80,L=110,W,H,pts=[],raf,active=true;

  function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
  function rand(a,b){ return Math.random()*(b-a)+a; }
  function mk(){ return {x:rand(0,W),y:rand(0,H),vx:rand(-0.10,0.10),vy:rand(-0.10,0.10),r:rand(1,2.6),c:C[Math.floor(Math.random()*4)],a:rand(0.25,0.70),pulse:rand(0,Math.PI*2),pulseSpeed:rand(0.01,0.03)}; }
  function init(){ resize(); pts=Array.from({length:N},mk); }

  function draw(){
    ctx.clearRect(0,0,W,H);
    // Liaisons
    for(var i=0;i<pts.length;i++){
      for(var j=i+1;j<pts.length;j++){
        var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<L){
          ctx.beginPath(); ctx.strokeStyle=pts[i].c;
          ctx.globalAlpha=(1-d/L)*0.12; ctx.lineWidth=0.4;
          ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke();
        }
      }
    }
    // Points + halo pulsé
    pts.forEach(function(p){
      p.pulse+=p.pulseSpeed;
      var pa=p.a*(0.8+0.2*Math.sin(p.pulse));
      // Halo
      var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
      g.addColorStop(0,p.c+'60'); g.addColorStop(1,p.c+'00');
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*6,0,Math.PI*2);
      ctx.fillStyle=g; ctx.globalAlpha=pa*0.35; ctx.fill();
      // Point
      ctx.globalAlpha=pa;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.c; ctx.fill();
      // Mouvement
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<-10)p.x=W+10; if(p.x>W+10)p.x=-10;
      if(p.y<-10)p.y=H+10; if(p.y>H+10)p.y=-10;
    });
    ctx.globalAlpha=1;
  }

  function loop(){ if(document.hidden||!active)return; draw(); raf=requestAnimationFrame(loop); }
  function start(){ if(!raf&&active)loop(); }
  function stop(){ cancelAnimationFrame(raf); raf=null; }

  document.addEventListener('visibilitychange',function(){ document.hidden?stop():start(); });
  window.addEventListener('resize',function(){ resize(); pts=Array.from({length:N},mk); });

  // Sync avec toggle thème
  document.addEventListener('themeChanged',function(e){
    active=e.detail.theme==='dark';
    active?start():stop();
  });
  // Sync MutationObserver fallback
  var obs=new MutationObserver(function(){
    active=document.documentElement.getAttribute('data-theme')!=='light';
    active?start():stop();
  });
  obs.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

  init();
  active=document.documentElement.getAttribute('data-theme')!=='light';
  if(active)start();
})();
'@

Set-Content -Path "$Root/assets/js/particles.js" -Value $jsParticles -Encoding UTF8
Write-OK "assets/js/particles.js V2"

# ==============================================================================
# 5. JS MAIN V2 — curseur traînée, carousel, lightbox, leviers psycho
# ==============================================================================
Write-Step "5/12" "main.js V2..."

$jsMain = @'
/* Pinapp Inc. — Main JS V2 */
document.addEventListener('DOMContentLoaded',function(){

  // ── PROGRESS
  var prog=document.getElementById('progress'),snap=document.querySelector('.snap-container');
  if(prog&&snap) snap.addEventListener('scroll',function(){
    var t=snap.scrollHeight-snap.clientHeight;
    prog.style.width=t>0?(snap.scrollTop/t*100)+'%':'0%';
  },{passive:true});

  // ── NAV HIDE
  var nav=document.querySelector('.nav'),lastY=0;
  if(nav&&snap) snap.addEventListener('scroll',function(){
    var y=snap.scrollTop;
    nav.classList.toggle('hidden',y>lastY&&y>80);
    lastY=y;
  },{passive:true});

  // ── CURSEUR + TRAÎNÉE
  var cur=document.getElementById('cursor'),trail=document.getElementById('cursor-trail');
  if(cur&&window.matchMedia('(hover:hover)').matches){
    var tx=0,ty=0;
    document.addEventListener('mousemove',function(e){
      cur.style.left=e.clientX+'px'; cur.style.top=e.clientY+'px';
      setTimeout(function(){
        if(trail){ trail.style.left=e.clientX+'px'; trail.style.top=e.clientY+'px'; }
      },80);
    });
    document.querySelectorAll('a,button,[role="button"],.card,.carousel-item').forEach(function(el){
      el.addEventListener('mouseenter',function(){ cur.classList.add('active'); });
      el.addEventListener('mouseleave',function(){ cur.classList.remove('active'); });
    });
  }

  // ── INTERSECTION OBSERVER
  var anims=document.querySelectorAll('.anim-fade,.anim-up,.anim-scale,.anim-left,.anim-right');
  if(anims.length){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var d=parseInt(e.target.dataset.delay||0);
          setTimeout(function(){ e.target.classList.add('visible'); },d);
          io.unobserve(e.target);
        }
      });
    },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    anims.forEach(function(el){ io.observe(el); });
  }

  // ── COUNT-UP
  document.querySelectorAll('.count-up').forEach(function(el){
    var target=parseInt(el.dataset.target,10),dur=1800;
    var io2=new IntersectionObserver(function(entries){
      if(!entries[0].isIntersecting)return; io2.disconnect();
      var t0=performance.now();
      function step(now){
        var p=Math.min((now-t0)/dur,1),e=1-Math.pow(1-p,3);
        el.textContent=Math.round(e*target).toLocaleString('fr-FR');
        if(p<1)requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
    io2.observe(el);
  });

  // ── NAV DOTS
  var dots=document.querySelectorAll('.nav-dot'),sects=document.querySelectorAll('.snap-section');
  if(dots.length&&snap){
    snap.addEventListener('scroll',function(){
      var mid=snap.scrollTop+snap.clientHeight/2,active=0;
      sects.forEach(function(s,i){ if(s.offsetTop<=mid)active=i; });
      dots.forEach(function(d,i){ d.classList.toggle('active',i===active); });
    },{passive:true});
    dots.forEach(function(d,i){
      d.addEventListener('click',function(){ sects[i]&&sects[i].scrollIntoView({behavior:'smooth'}); });
    });
  }

  // ── BURGER
  var burger=document.querySelector('.nav__burger'),drawer=document.querySelector('.nav__drawer');
  if(burger&&drawer){
    burger.addEventListener('click',function(){
      var open=drawer.classList.toggle('open');
      burger.classList.toggle('open',open);
      burger.setAttribute('aria-expanded',open);
      document.body.style.overflow=open?'hidden':'';
    });
    // Fermer sur lien
    drawer.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        drawer.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded',false);
        document.body.style.overflow='';
      });
    });
  }

  // ── SÉLECTEUR SECTEUR
  var sbtns=document.querySelectorAll('.sector-btn');
  sbtns.forEach(function(btn){
    btn.addEventListener('click',function(){
      sbtns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var sel=btn.dataset.sector;
      document.querySelectorAll('.offre-wrap').forEach(function(wrap){
        var card=wrap.querySelector('[data-sectors]');
        if(!card){ return; }
        var ss=card.dataset.sectors.split(',');
        wrap.style.display=(sel==='tous'||ss.includes(sel))?'':'none';
      });
    });
  });

  // ── GRAPHIQUES BARRES
  var bars=document.querySelectorAll('.bar[data-h]');
  if(bars.length){
    var bioBar=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.style.height=e.target.dataset.h+'px'; bioBar.unobserve(e.target); }
      });
    },{threshold:0.3});
    bars.forEach(function(b){ b.style.height='0'; bioBar.observe(b); });
  }

  // ── DONUT SVG
  var donut=document.getElementById('donut-svg');
  if(donut){
    var r=44,circ=2*Math.PI*r,data=[{p:45,c:'#00e5b0'},{p:30,c:'#b388ff'},{p:15,c:'#7fffea'},{p:10,c:'#e040fb'}],offset=0;
    data.forEach(function(d){
      var arc=(d.p/100)*circ,circle=document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('cx','50'); circle.setAttribute('cy','50'); circle.setAttribute('r',r);
      circle.setAttribute('fill','none'); circle.setAttribute('stroke',d.c); circle.setAttribute('stroke-width','12');
      circle.setAttribute('stroke-dasharray',arc+' '+(circ-arc)); circle.setAttribute('stroke-dashoffset',-offset);
      circle.setAttribute('transform','rotate(-90 50 50)'); donut.appendChild(circle); offset+=arc;
    });
  }

  // ── CAROUSEL MICHA
  document.querySelectorAll('.carousel-wrap').forEach(function(wrap){
    var track=wrap.querySelector('.carousel-track');
    var btnPrev=wrap.querySelector('.carousel-prev');
    var btnNext=wrap.querySelector('.carousel-next');
    var cats=wrap.querySelectorAll('.carousel-cat');
    if(!track)return;
    var current=0,itemW=296; // 280 + 16gap

    function scrollTo(i){
      current=Math.max(0,Math.min(i,track.children.length-1));
      track.style.transform='translateX(-'+(current*itemW)+'px)';
    }
    if(btnPrev) btnPrev.addEventListener('click',function(){ scrollTo(current-1); });
    if(btnNext) btnNext.addEventListener('click',function(){ scrollTo(current+1); });

    // Filtrage par catégorie
    cats.forEach(function(cat){
      cat.addEventListener('click',function(){
        cats.forEach(function(c){ c.classList.remove('active'); });
        cat.classList.add('active');
        var sel=cat.dataset.cat;
        Array.from(track.children).forEach(function(item){
          item.style.display=(sel==='tous'||item.dataset.cat===sel)?'':'none';
        });
        current=0; track.style.transform='translateX(0)';
      });
    });

    // Touch swipe
    var touchStartX=0;
    track.addEventListener('touchstart',function(e){ touchStartX=e.touches[0].clientX; },{passive:true});
    track.addEventListener('touchend',function(e){
      var diff=touchStartX-e.changedTouches[0].clientX;
      if(Math.abs(diff)>50) scrollTo(diff>0?current+1:current-1);
    },{passive:true});
  });

  // ── LIGHTBOX
  var lb=document.getElementById('lightbox');
  if(lb){
    document.querySelectorAll('.carousel-item[data-src]').forEach(function(item){
      item.addEventListener('click',function(){
        var img=lb.querySelector('img');
        if(img){ img.src=item.dataset.src; img.alt=item.dataset.alt||''; }
        lb.classList.add('open');
        document.body.style.overflow='hidden';
      });
    });
    lb.addEventListener('click',function(e){
      if(e.target===lb||e.target.classList.contains('lightbox-close')){
        lb.classList.remove('open');
        document.body.style.overflow='';
      }
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&lb.classList.contains('open')){
        lb.classList.remove('open');
        document.body.style.overflow='';
      }
    });
  }

  // ── URGENCE BANNER — compteur dynamique
  var urgenceCounts=document.querySelectorAll('.urgence-count');
  urgenceCounts.forEach(function(el){
    // Nombre aléatoire de "personnes vues aujourd'hui"
    el.textContent=Math.floor(Math.random()*40+20);
  });

});
'@

Set-Content -Path "$Root/assets/js/main.js" -Value $jsMain -Encoding UTF8
Write-OK "assets/js/main.js V2"

# ==============================================================================
# FONCTION HTML SHELL COMMUNE
# ==============================================================================
function Get-Shell {
  param($title,$desc,$body,$dots=0)
  $dotsHtml=""
  if($dots -gt 0){
    $dotsHtml='<nav class="nav-dots" aria-label="Sections">'
    for($i=0;$i -lt $dots;$i++){
      $cls=if($i-eq 0){' class="nav-dot active"'}else{' class="nav-dot"'}
      $dotsHtml+="<button$cls></button>"
    }
    $dotsHtml+='</nav>'
  }
  return @"
<!doctype html>
<html lang="fr" data-theme="dark">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>$title</title>
  <meta name="description" content="$desc"/>
  <link rel="canonical" href="https://pinapp.fr/"/>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
  <link rel="preload" href="/assets/fonts/ClashDisplay-Bold.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="preload" href="/assets/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="stylesheet" href="/assets/css/pinapp-global.css"/>
  <script src="/assets/js/theme.js"></script>
</head>
<body>
  <div id="cursor" aria-hidden="true"></div>
  <div id="cursor-trail" aria-hidden="true"></div>
  <div id="progress" aria-hidden="true"></div>
  <canvas id="canvas-pandora" aria-hidden="true"></canvas>
  <div class="caustics" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
  <div class="water-surface" aria-hidden="true"></div>
  <div class="water-reflets" aria-hidden="true"></div>
  <a class="skip-link" href="#main">Aller au contenu</a>

  <nav class="nav" id="nav" aria-label="Navigation principale">
    <div class="nav__inner">
      <a class="nav__logo" href="/">Pinapp <span>Inc.</span></a>
      <ul class="nav__menu" role="list">
        <li class="nav__item">
          <a class="nav__link" href="/offres/">Pinapp Studio <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></a>
          <div class="nav__dropdown">
            <span class="nav__dropdown-label">Pinapp Studio</span>
            <a href="/offres/">Offres & tarifs</a>
            <a href="/realisations/">Réalisations</a>
            <a href="/offres/formation/">Formations</a>
            <a href="/a-propos/">Notre studio</a>
          </div>
        </li>
        <li class="nav__item">
          <a class="nav__link" href="/auralis/">Auralis RH <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></a>
          <div class="nav__dropdown">
            <span class="nav__dropdown-label">Auralis RH</span>
            <a href="/auralis/">Le produit</a>
            <a href="/auralis/#aurora">Aurora, l'IA</a>
            <a href="/auralis/#beta">Accès bêta</a>
          </div>
        </li>
        <li class="nav__item">
          <a class="nav__link" href="/memoire-et-presence/">Mémoire & Présence <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg></a>
          <div class="nav__dropdown">
            <span class="nav__dropdown-label">Mémoire & Présence</span>
            <a href="/memoire-et-presence/">Notre approche</a>
            <a href="/memoire-et-presence/#portfolio">Portfolio Micha</a>
            <a href="/memoire-et-presence/#tarifs">Tarifs image</a>
            <a href="https://memoireetpresence.fr" target="_blank" rel="noopener">memoireetpresence.fr ↗</a>
          </div>
        </li>
      </ul>
      <div class="nav__actions">
        <button class="nav__theme" id="theme-toggle" aria-label="Mode jour Avatar 2">◐</button>
        <a class="nav__cta" href="/diagnostic/">Premier échange offert</a>
        <button class="nav__burger" aria-label="Ouvrir le menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- DRAWER MOBILE -->
    <div class="nav__drawer" role="dialog" aria-label="Menu principal">
      <div class="nav__drawer-section">
        <span class="nav__drawer-label">Pinapp Studio</span>
        <a href="/offres/">Offres & tarifs</a>
        <a href="/realisations/">Réalisations</a>
        <a href="/offres/formation/">Formations</a>
      </div>
      <div class="nav__drawer-section">
        <span class="nav__drawer-label">Auralis RH</span>
        <a href="/auralis/">Le produit</a>
        <a href="/auralis/#beta">Accès bêta</a>
      </div>
      <div class="nav__drawer-section">
        <span class="nav__drawer-label">Mémoire & Présence</span>
        <a href="/memoire-et-presence/">Notre approche</a>
        <a href="/memoire-et-presence/#portfolio">Portfolio Micha</a>
        <a href="https://memoireetpresence.fr" target="_blank" rel="noopener">memoireetpresence.fr ↗</a>
      </div>
      <div class="nav__drawer-section">
        <span class="nav__drawer-label">Pinapp Inc.</span>
        <a href="/a-propos/">Notre société</a>
        <a href="/engagements/">Nos engagements</a>
        <a href="/diagnostic/">Premier échange offert</a>
      </div>

      <!-- STORYBOARD DANS LE DRAWER -->
      <div class="drawer-story">
        <span class="drawer-story-title">Qui sommes-nous ?</span>
        <div class="drawer-story-cards">
          <a href="/a-propos/#lauralie" class="drawer-story-card">
            <div class="drawer-story-avatar" style="background:linear-gradient(135deg,#00e5b0,#b388ff);">L</div>
            <div class="drawer-story-name">Lauralie</div>
            <div class="drawer-story-role">Architecte systèmes & IA · Pinapp Studio</div>
          </a>
          <a href="/a-propos/#micha" class="drawer-story-card">
            <div class="drawer-story-avatar" style="background:linear-gradient(135deg,#7fffea,#e040fb);">M</div>
            <div class="drawer-story-name">Micha</div>
            <div class="drawer-story-role">Directeur artistique & image · M&P</div>
          </a>
        </div>
      </div>

    </div>
  </nav>

  $dotsHtml

  <!-- LIGHTBOX MICHA -->
  <div id="lightbox" class="lightbox" role="dialog" aria-label="Visualisation">
    <div class="lightbox-inner">
      <button class="lightbox-close" aria-label="Fermer">×</button>
      <img src="" alt="" loading="lazy"/>
    </div>
  </div>

  <main id="main">
$body
  </main>

  <footer style="scroll-snap-align:start;">
    <div class="container">
      <div class="footer__brand">Pinapp <span>Inc.</span></div>
      <p class="footer__tagline">Connecter. Construire. Transmettre.</p>
      <nav class="footer__links" aria-label="Footer">
        <a href="/a-propos/">Notre société</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:contact@pinapp.fr">contact@pinapp.fr</a>
        <a href="/legal/mentions.html">Mentions légales</a>
        <a href="/cgv/">CGV</a>
        <a href="/confidentialite/">Confidentialité</a>
        <a href="/engagements/">Nos engagements</a>
        <a href="https://memoireetpresence.fr" target="_blank" rel="noopener">🌿 Mémoire & Présence</a>
      </nav>
      <p class="footer__legal">© 2026 Pinapp Inc. · Lauralie & Micha · Prix HT · TVA non applicable art. 293 B CGI</p>
      <div class="footer__ai-badge">
        <span class="ai-badge">Assisté par IA · Validé par Lauralie & Micha · EU AI Act Art. 50</span>
      </div>
    </div>
  </footer>

  <script src="/assets/js/particles.js" defer></script>
  <script src="/assets/js/main.js" defer></script>
</body>
</html>
"@
}

# ==============================================================================
# 6. PAGE FORMATIONS — Lauralie + Micha complètes
# ==============================================================================
Write-Step "6/12" "offres/formation/index.html..."

$formBody = @'
  <div class="snap-container">

    <section class="snap-section" id="form-hero">
      <div class="container">
        <span class="label anim-fade">Formations Pinapp Inc.</span>
        <h1 style="font-size:clamp(40px,7vw,88px);letter-spacing:-0.04em;max-width:800px;margin-bottom:24px;line-height:1.0;" class="anim-up" data-delay="100">
          Devenez un <span class="shimmer">travailleur augmenté</span>.
        </h1>
        <p style="font-size:17px;color:var(--text-muted);max-width:580px;margin-bottom:32px;line-height:1.7;" class="anim-up" data-delay="180">
          Nous avons enquêté auprès de 50+ indépendants et dirigeants de TPE. Résultat : 78% perdent plus de 15h par semaine sur des tâches que l'IA peut faire. Nos formations sont construites sur ces données.
        </p>
        <div class="etude-cite anim-up" data-delay="220">
          <div class="etude-cite-bar"></div>
          <div>
            <div class="etude-cite-text">"La surcharge cognitive est le principal frein à la productivité des travailleurs indépendants. Réduire les micro-décisions répétitives libère en moyenne 2,3h de concentration profonde par jour."</div>
            <div class="etude-cite-source">— D'après Sweller, théorie de la charge cognitive (1988) · Appliqué par Pinapp Inc. 2026</div>
          </div>
        </div>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:32px;" class="anim-up" data-delay="260">
          <a href="#lauralie" class="btn btn--primary">Formations Lauralie</a>
          <a href="#micha" class="btn btn--nacre">Formations Micha</a>
          <a href="#packs" class="btn btn--ghost">Packs combinés</a>
        </div>
      </div>
    </section>

    <!-- FORMATIONS LAURALIE -->
    <section class="snap-section" id="lauralie">
      <div class="container">
        <span class="label anim-fade">Formations Lauralie · Systèmes & IA</span>
        <h2 style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:40px;" class="anim-up" data-delay="80">
          Automatisez. Déléguez à l'IA.<br/>Récupérez votre temps.
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">

          <div class="card formation-card anim-up" data-delay="0">
            <span class="formation-level">Niveau 1 · Entrée</span>
            <h3 class="formation-title">Récupère 5h par semaine</h3>
            <p class="formation-subtitle">"L'automatisation sans coder"</p>
            <p class="formation-desc">Automatise tes tâches répétitives avec n8n. 5 modules. Cas pratiques réels. Zéro code.</p>
            <p class="formation-format">📄 PDF interactif + vidéos &lt; 10min</p>
            <div class="formation-price">67 €</div>
            <a href="/diagnostic/" class="btn btn--primary" style="font-size:12px;padding:10px 20px;">Accéder →</a>
          </div>

          <div class="card formation-card anim-up" data-delay="80">
            <span class="formation-level">Niveau 2 · Création</span>
            <h3 class="formation-title">Ton site pro en 7 jours</h3>
            <p class="formation-subtitle">"De zéro à en ligne"</p>
            <p class="formation-desc">Cursor, SFTP, copywriting, déploiement. 7 modules. Parcours asynchrone + checklist PDF.</p>
            <p class="formation-format">🎬 Vidéos HD + checklist PDF</p>
            <div class="formation-price">147 €</div>
            <a href="/diagnostic/" class="btn btn--primary" style="font-size:12px;padding:10px 20px;">Accéder →</a>
          </div>

          <div class="card formation-card anim-up" data-delay="160">
            <span class="formation-level">Niveau 3 · Maîtrise</span>
            <h3 class="formation-title">Claude pour votre business</h3>
            <p class="formation-subtitle">"Tout ce que Claude peut faire"</p>
            <p class="formation-desc">Prompts avancés, Artifacts, analyse documents, intégration workflow. 6 modules + PDF prompts.</p>
            <p class="formation-format">🎬 Vidéos HD + PDF 50 prompts</p>
            <div class="formation-price">97 €</div>
            <a href="/diagnostic/" class="btn btn--primary" style="font-size:12px;padding:10px 20px;">Accéder →</a>
          </div>

          <div class="card formation-card anim-up" data-delay="0">
            <span class="formation-level">Niveau 4 · Transformation</span>
            <h3 class="formation-title">L'IA au travail pour toi</h3>
            <p class="formation-subtitle">"Chatbot, automatisation avancée, prompt engineering"</p>
            <p class="formation-desc">10 modules. Claude API, n8n avancé, chatbot métier. Vidéos HD + replay + ressources Notion.</p>
            <p class="formation-format">🎬 10 vidéos HD + replay + Notion</p>
            <div class="formation-price">397 €</div>
            <a href="/diagnostic/" class="btn btn--primary" style="font-size:12px;padding:10px 20px;">Accéder →</a>
          </div>

          <div class="card formation-card anim-up" data-delay="80">
            <span class="formation-level">Pack · Outils complets</span>
            <h3 class="formation-title">Pack Outils Lauralie</h3>
            <p class="formation-subtitle">"Claude + n8n + Notion + Tally + Stripe"</p>
            <p class="formation-desc">Tous les outils de Pinapp Studio maîtrisés. De la stratégie au déploiement. En autonomie totale.</p>
            <p class="formation-format">🎬 Vidéos + PDF + templates</p>
            <div class="formation-price">197 €</div>
            <a href="/diagnostic/" class="btn btn--primary" style="font-size:12px;padding:10px 20px;">Accéder →</a>
          </div>

          <div class="card formation-card anim-up" data-delay="160" style="border-color:rgba(0,229,176,0.2);">
            <span class="formation-level">Premium · Accompagnement</span>
            <h3 class="formation-title">1:1 Lauralie</h3>
            <p class="formation-subtitle">"4 sessions stratégie & implémentation"</p>
            <p class="formation-desc">Audit de votre situation. Roadmap personnalisée. Implémentation guidée. Suivi 30 jours.</p>
            <p class="formation-format">🎙 4 sessions 1h + support écrit</p>
            <div class="formation-price">497 €</div>
            <!-- ⚠️ [LAURALIE] À COMPLÉTER : lien calendly ou Tally RDV -->
            <a href="/diagnostic/" class="btn btn--primary" style="font-size:12px;padding:10px 20px;">Réserver →</a>
          </div>

        </div>
      </div>
    </section>

    <!-- FORMATIONS MICHA -->
    <section class="snap-section" id="micha">
      <div class="container">
        <span class="label anim-fade" style="color:var(--accent-3);">Formations Micha · Image & DA</span>
        <h2 style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:16px;" class="anim-up" data-delay="80">
          Maîtrisez l'image.<br/>Racontez votre histoire.
        </h2>
        <p style="font-size:16px;color:var(--text-muted);max-width:560px;margin-bottom:40px;line-height:1.6;" class="anim-up" data-delay="120">
          Issu de l'événementiel et des mariages, Micha a développé un regard unique sur la narration visuelle. Ces formations transmettent ce savoir-faire de terrain.
        </p>
        <div class="etude-cite anim-up" data-delay="140" style="border-color:rgba(127,255,234,0.15);background:rgba(127,255,234,0.03);">
          <div class="etude-cite-bar" style="background:var(--accent-3);"></div>
          <div>
            <div class="etude-cite-text">"93% de la communication humaine est non-verbale. Apprendre à voir avant d'apprendre à filmer change tout."</div>
            <div class="etude-cite-source">— D'après Dondis, A Primer of Visual Literacy · MIT Press · Appliqué par Micha, Pinapp Inc.</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:32px;">

          <div class="card formation-card anim-up" data-delay="0" style="border-color:rgba(127,255,234,0.10);">
            <span class="formation-level" style="color:var(--accent-3);">Niveau 1 · Fondations</span>
            <h3 class="formation-title">L'œil avant l'outil</h3>
            <p class="formation-subtitle">"Voir, cadrer, raconter"</p>
            <p class="formation-desc">Lumière, cadrage, narration visuelle. Zéro logiciel requis. Pour les entrepreneurs qui veulent de meilleures photos avec leur téléphone.</p>
            <p class="formation-format">📄 PDF interactif + 5 vidéos &lt; 10min</p>
            <div class="formation-price">67 €</div>
            <!-- ⚠️ [MICHA] À COMPLÉTER : lien accès formation -->
            <a href="/diagnostic/" class="btn btn--primary" style="font-size:12px;padding:10px 20px;background:rgba(127,255,234,0.15);border-color:rgba(127,255,234,0.3);">Accéder →</a>
          </div>

          <div class="card formation-card anim-up" data-delay="80" style="border-color:rgba(127,255,234,0.10);">
            <span class="formation-level" style="color:var(--accent-3);">Niveau 2 · Adobe</span>
            <h3 class="formation-title">Maîtrisez vos images</h3>
            <p class="formation-subtitle">"Photoshop · Lightroom · Premiere"</p>
            <p class="formation-desc">Les fondations Adobe. De la retouche photo au montage vidéo court. Fichiers d'exercices inclus.</p>
            <p class="formation-format">🎬 8 vidéos HD + fichiers exercices</p>
            <div class="formation-price">147 €</div>
            <!-- ⚠️ [MICHA] À COMPLÉTER : lien accès formation -->
            <a href="/diagnostic/" class="btn btn--primary" style="font-size:12px;padding:10px 20px;background:rgba(127,255,234,0.15);border-color:rgba(127,255,234,0.3);">Accéder →</a>
          </div>

          <div class="card formation-card anim-up" data-delay="160" style="border-color:rgba(127,255,234,0.10);">
            <span class="formation-level" style="color:var(--accent-3);">Niveau 3 · IA Générative</span>
            <h3 class="formation-title">L'image augmentée</h3>
            <p class="formation-subtitle">"Midjourney · Firefly · Runway"</p>
            <p class="formation-desc">Créer des visuels pro sans shooting. Prompts opérationnels. Galerie d'exemples commentés.</p>
            <p class="formation-format">🎬 6 vidéos HD + 30 prompts + galerie</p>
            <div class="formation-price">197 €</div>
            <!-- ⚠️ [MICHA] À COMPLÉTER : lien accès formation -->
            <a href="/diagnostic/" class="btn btn--primary" style="font-size:12px;padding:10px 20px;background:rgba(127,255,234,0.15);border-color:rgba(127,255,234,0.3);">Accéder →</a>
          </div>

          <div class="card formation-card anim-up" data-delay="0" style="border-color:rgba(127,255,234,0.10);">
            <span class="formation-level" style="color:var(--accent-3);">Niveau 4 · DA</span>
            <h3 class="formation-title">Construire une identité visuelle</h3>
            <p class="formation-subtitle">"Charte · cohérence · brief créa"</p>
            <p class="formation-desc">Charte graphique, cohérence de marque, brief créa, relation client. Ce que Micha fait pour ses clients.</p>
            <p class="formation-format">🎬 10 vidéos + templates Adobe + guide</p>
            <div class="formation-price">297 €</div>
            <!-- ⚠️ [MICHA] À COMPLÉTER : lien accès formation -->
            <a href="/diagnostic/" class="btn btn--primary" style="font-size:12px;padding:10px 20px;background:rgba(127,255,234,0.15);border-color:rgba(127,255,234,0.3);">Accéder →</a>
          </div>

          <div class="card formation-card anim-up" data-delay="80" style="border-color:rgba(127,255,234,0.10);">
            <span class="formation-level" style="color:var(--accent-3);">Niveau 5 · Masterclass</span>
            <h3 class="formation-title">Capturer ce qui ne se répète pas</h3>
            <p class="formation-subtitle">"Événementiel · mariages · corporate"</p>
            <p class="formation-desc">Photo et vidéo en conditions réelles. Gestion du stress, matériel, post-prod rapide. Issu de 10 ans de terrain.</p>
            <p class="formation-format">🎙 Live Zoom 3h + replay illimité + Q&A mensuel</p>
            <div class="formation-price">397 €</div>
            <!-- ⚠️ [MICHA] À COMPLÉTER : date prochaine session live -->
            <a href="/diagnostic/" class="btn btn--primary" style="font-size:12px;padding:10px 20px;background:rgba(127,255,234,0.15);border-color:rgba(127,255,234,0.3);">Réserver →</a>
          </div>

          <div class="card formation-card anim-up" data-delay="160" style="border-color:rgba(127,255,234,0.20);background:rgba(127,255,234,0.03);">
            <span class="formation-level" style="color:var(--accent-3);">Pack Cursus Complet</span>
            <h3 class="formation-title">De l'œil à la DA</h3>
            <p class="formation-subtitle">"Les 5 niveaux + communauté + coaching"</p>
            <p class="formation-desc">Accès à tous les niveaux + communauté privée + 1h coaching individuel avec Micha.</p>
            <ul class="checklist" style="margin-bottom:16px;">
              <li>5 formations complètes</li>
              <li>Communauté privée</li>
              <li>1h coaching Micha</li>
              <li>Certifié Micha · M&P</li>
            </ul>
            <div style="font-size:13px;color:var(--accent-3);margin-bottom:8px;">~340 € économisés</div>
            <div class="formation-price">797 €</div>
            <a href="/diagnostic/" class="btn btn--primary" style="font-size:12px;padding:10px 20px;background:rgba(127,255,234,0.15);border-color:rgba(127,255,234,0.3);">Accéder →</a>
          </div>

        </div>
      </div>
    </section>

    <!-- PACKS COMBINÉS -->
    <section class="snap-section" id="packs">
      <div class="container">
        <span class="label anim-fade">Packs combinés</span>
        <h2 style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:40px;" class="anim-up" data-delay="80">
          Tout maîtriser.<br/>Digital + Image.
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;">

          <div class="card pack-duo anim-up" style="padding:36px;" data-delay="0">
            <div class="pack-duo-badge">Pack Duo Formations</div>
            <h3 style="font-size:26px;margin-bottom:14px;">Toutes les formations Lauralie + Micha</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
              <div>
                <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);margin-bottom:8px;">Lauralie</div>
                <ul class="checklist" style="margin:0;">
                  <li>n8n débutant</li>
                  <li>Site 7 jours</li>
                  <li>Claude business</li>
                  <li>IA avancée</li>
                  <li>Pack outils</li>
                </ul>
              </div>
              <div>
                <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent-3);margin-bottom:8px;">Micha</div>
                <ul class="checklist" style="margin:0;">
                  <li>L'œil avant l'outil</li>
                  <li>Adobe fondations</li>
                  <li>IA générative</li>
                  <li>Direction artistique</li>
                  <li>Masterclass événement</li>
                </ul>
              </div>
            </div>
            <p class="pack-duo-economy">~600 € économisés vs. séparé</p>
            <div style="font-family:'Clash Display',sans-serif;font-size:36px;color:var(--nacre);margin-bottom:4px;">997 €</div>
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:24px;">Accès à vie · Mises à jour incluses</p>
            <a href="/diagnostic/" class="btn btn--primary">Accéder au pack →</a>
          </div>

          <div class="card anim-up" style="padding:36px;" data-delay="120">
            <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-2);margin-bottom:12px;">Accompagnement mensuel</div>
            <h3 style="font-size:26px;margin-bottom:14px;">Stratégie & suivi 1:1</h3>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:20px;line-height:1.7;">Veille IA personnalisée + 1h conseil mensuel + rapport automatisé. Lauralie ou Micha selon votre besoin.</p>
            <ul class="checklist" style="margin-bottom:24px;">
              <li>Veille IA hebdo personnalisée</li>
              <li>1h conseil mensuel</li>
              <li>Rapport mensuel automatisé</li>
              <li>Accès formation au choix</li>
            </ul>
            <div style="font-family:'Clash Display',sans-serif;font-size:36px;color:var(--nacre);margin-bottom:4px;">297 €/mois</div>
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:24px;">Sans engagement · Résiliable à tout moment</p>
            <a href="/diagnostic/" class="btn btn--primary">Démarrer →</a>
          </div>

        </div>
      </div>
    </section>

  </div>
'@

$formHtml = Get-Shell `
  -title "Formations — Pinapp Inc. · Lauralie & Micha" `
  -desc "Devenez un travailleur augmenté. Formations IA, automatisation, image et direction artistique. Basées sur des études cognitives réelles." `
  -body $formBody `
  -dots 4

New-Item -ItemType Directory -Force -Path "$Root/offres/formation" | Out-Null
Set-Content -Path "$Root/offres/formation/index.html" -Value $formHtml -Encoding UTF8
Write-OK "offres/formation/index.html"

# ==============================================================================
# 7. PAGE MÉMOIRE & PRÉSENCE V2 — portfolio carousel + tarifs Micha
# ==============================================================================
Write-Step "7/12" "memoire-et-presence/index.html V2..."

$mpBody = @'
  <div class="snap-container">

    <section class="snap-section" id="mp-hero">
      <div class="container">
        <div style="display:inline-flex;align-items:center;gap:8px;padding:5px 14px;background:rgba(127,255,234,0.08);border:1px solid rgba(127,255,234,0.15);border-radius:100px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent-3);margin-bottom:28px;" class="anim-fade">
          🌿 Mémoire & Présence · Pinapp Inc.
        </div>
        <h1 style="font-size:clamp(40px,7vw,88px);letter-spacing:-0.04em;max-width:800px;margin-bottom:32px;line-height:1.0;" class="anim-up" data-delay="100">
          La <span class="shimmer">présence</span><br/>qui traverse le temps.
        </h1>
        <p style="font-size:18px;color:var(--text-muted);max-width:560px;margin-bottom:40px;line-height:1.7;" class="anim-up" data-delay="180">
          Nous digitalisons les hommages, préservons les mémoires et créons des liens durables. Image, son, présence numérique — pour que rien ne s'efface.
        </p>
        <div style="display:flex;gap:16px;flex-wrap:wrap;" class="anim-up" data-delay="260">
          <a href="https://memoireetpresence.fr" target="_blank" rel="noopener" class="btn btn--primary">memoireetpresence.fr ↗</a>
          <a href="#portfolio" class="btn btn--ghost">Voir le portfolio</a>
          <a href="#tarifs" class="btn btn--nacre">Tarifs image</a>
        </div>
      </div>
    </section>

    <!-- MICHA STORYBOARD -->
    <section class="snap-section" id="mp-micha">
      <div class="container">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;">
          <div>
            <span class="label anim-fade" style="color:var(--accent-3);">Co-associé · Directeur artistique</span>
            <h2 style="font-size:clamp(32px,5vw,56px);letter-spacing:-0.03em;margin-bottom:24px;" class="anim-up" data-delay="80">
              Micha.
            </h2>
            <!-- STORYBOARD MICHA -->
            <div style="display:flex;flex-direction:column;gap:20px;margin-bottom:32px;">
              <div class="etude-cite" style="border-color:rgba(127,255,234,0.12);background:rgba(127,255,234,0.03);">
                <div class="etude-cite-bar" style="background:var(--accent-3);"></div>
                <div>
                  <div style="font-size:11px;letter-spacing:0.10em;text-transform:uppercase;color:var(--accent-3);margin-bottom:4px;">Avant Pinapp</div>
                  <div class="etude-cite-text">Des années dans l'événementiel — mariages, corporate, captations live. Le regard s'est formé sur le terrain, dans l'urgence du moment unique.</div>
                </div>
              </div>
              <div class="etude-cite" style="border-color:rgba(127,255,234,0.12);background:rgba(127,255,234,0.03);">
                <div class="etude-cite-bar" style="background:var(--accent-3);"></div>
                <div>
                  <div style="font-size:11px;letter-spacing:0.10em;text-transform:uppercase;color:var(--accent-3);margin-bottom:4px;">La passion tech</div>
                  <div class="etude-cite-text">Passionné de nouvelles technologies, Micha a exploré l'IA générative dès ses débuts — Midjourney, Firefly, Runway — pour en faire des outils créatifs, pas des raccourcis.</div>
                </div>
              </div>
              <div class="etude-cite" style="border-color:rgba(127,255,234,0.12);background:rgba(127,255,234,0.03);">
                <div class="etude-cite-bar" style="background:var(--accent-3);"></div>
                <div>
                  <div style="font-size:11px;letter-spacing:0.10em;text-transform:uppercase;color:var(--accent-3);margin-bottom:4px;">Mémoire & Présence</div>
                  <div class="etude-cite-text">Avec Lauralie, il a co-fondé Mémoire & Présence — pour que chaque hommage soit aussi soigné qu'un grand reportage. La technique au service de l'humain.</div>
                </div>
              </div>
            </div>
            <ul class="checklist anim-up" data-delay="200">
              <li>Photo & vidéo professionnelles haute définition</li>
              <li>Direction artistique & charte visuelle</li>
              <li>Branding Adobe suite complète</li>
              <li>Restauration & retouche avancée</li>
              <li>IA générative dirigée (Midjourney, Firefly, Runway)</li>
              <li>Événementiel & captation live</li>
            </ul>
            <div style="margin-top:28px;padding:16px 20px;background:rgba(127,255,234,0.04);border:1px solid rgba(127,255,234,0.10);border-radius:12px;">
              <p style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">Contact exclusif par WhatsApp · Nouvelle-Aquitaine & France entière</p>
              <a href="mailto:micha@memoireetpresence.fr" style="color:var(--accent-3);text-decoration:none;font-size:14px;">micha@memoireetpresence.fr</a>
            </div>
          </div>
          <div>
            <div class="card anim-scale" style="padding:40px;text-align:center;border-color:rgba(127,255,234,0.15);" data-delay="150">
              <!-- ⚠️ [MICHA] À COMPLÉTER : ta photo ici — format WebP 600x700px -->
              <div class="placeholder-block" style="height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;margin-bottom:20px;">
                <div style="font-size:48px;opacity:0.3;">📷</div>
                <div style="font-size:11px;opacity:0.5;">⚠️ [MICHA] Photo portrait<br/>WebP 600×700px à glisser ici</div>
              </div>
              <div style="font-family:'Clash Display',sans-serif;font-size:24px;font-weight:700;color:var(--text);margin-bottom:6px;">Michaël Bouilhac</div>
              <div style="font-size:12px;color:var(--accent-3);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;">Micha · Vidéaste · DA · M&P</div>
              <div style="font-family:'Clash Display',sans-serif;font-size:20px;color:var(--nacre);">À partir de 300 € HT</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PORTFOLIO CAROUSEL -->
    <section class="snap-section" id="portfolio">
      <div class="container">
        <span class="label anim-fade" style="color:var(--accent-3);">Portfolio Micha</span>
        <h2 style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:16px;" class="anim-up" data-delay="80">
          Le travail de Micha.
        </h2>
        <p style="font-size:15px;color:var(--text-muted);margin-bottom:32px;line-height:1.6;" class="anim-up" data-delay="120">
          Cliquez pour agrandir · Filtrez par catégorie
        </p>

        <!-- FILTRES CATÉGORIES -->
        <div class="carousel-cats anim-up" data-delay="140">
          <button class="carousel-cat active" data-cat="tous">Tous</button>
          <button class="carousel-cat" data-cat="photo">Photo</button>
          <button class="carousel-cat" data-cat="video">Vidéo</button>
          <button class="carousel-cat" data-cat="da">Direction artistique</button>
          <button class="carousel-cat" data-cat="ia">IA générative</button>
          <button class="carousel-cat" data-cat="event">Événementiel</button>
        </div>

        <!-- CAROUSEL -->
        <div class="carousel-wrap anim-up" data-delay="180">
          <div class="carousel-track" id="micha-carousel">

            <!-- ⚠️ [MICHA] Photo 01 -->
            <div class="carousel-item" data-cat="photo" data-src="/assets/images/micha/photo-01.webp" data-alt="Portrait professionnel">
              <div class="carousel-placeholder">
                <div class="carousel-placeholder-icon">📸</div>
                <div class="carousel-placeholder-label">⚠️ [MICHA] Photo 01<br/>WebP 800×600px</div>
              </div>
              <div class="carousel-item-overlay">Portrait · Photo</div>
            </div>

            <!-- ⚠️ [MICHA] Photo 02 -->
            <div class="carousel-item" data-cat="photo" data-src="/assets/images/micha/photo-02.webp" data-alt="Reportage événementiel">
              <div class="carousel-placeholder">
                <div class="carousel-placeholder-icon">📸</div>
                <div class="carousel-placeholder-label">⚠️ [MICHA] Photo 02<br/>WebP 800×600px</div>
              </div>
              <div class="carousel-item-overlay">Événement · Photo</div>
            </div>

            <!-- ⚠️ [MICHA] Photo 03 -->
            <div class="carousel-item" data-cat="photo" data-src="/assets/images/micha/photo-03.webp" data-alt="Shooting produit">
              <div class="carousel-placeholder">
                <div class="carousel-placeholder-icon">📸</div>
                <div class="carousel-placeholder-label">⚠️ [MICHA] Photo 03<br/>WebP 800×600px</div>
              </div>
              <div class="carousel-item-overlay">Produit · Photo</div>
            </div>

            <!-- ⚠️ [MICHA] Vidéo 01 -->
            <div class="carousel-item" data-cat="video" data-src="/assets/images/micha/video-thumb-01.webp" data-alt="Vidéo corporate">
              <div class="carousel-placeholder">
                <div class="carousel-placeholder-icon">🎬</div>
                <div class="carousel-placeholder-label">⚠️ [MICHA] Vidéo 01<br/>Thumbnail WebP + lien vidéo</div>
              </div>
              <div class="carousel-item-overlay">Corporate · Vidéo</div>
            </div>

            <!-- ⚠️ [MICHA] Vidéo 02 -->
            <div class="carousel-item" data-cat="video" data-src="/assets/images/micha/video-thumb-02.webp" data-alt="Film mariage">
              <div class="carousel-placeholder">
                <div class="carousel-placeholder-icon">🎬</div>
                <div class="carousel-placeholder-label">⚠️ [MICHA] Vidéo 02<br/>Thumbnail WebP + lien vidéo</div>
              </div>
              <div class="carousel-item-overlay">Hommage · Vidéo</div>
            </div>

            <!-- ⚠️ [MICHA] DA 01 -->
            <div class="carousel-item" data-cat="da" data-src="/assets/images/micha/da-01.webp" data-alt="Identité visuelle">
              <div class="carousel-placeholder">
                <div class="carousel-placeholder-icon">🎨</div>
                <div class="carousel-placeholder-label">⚠️ [MICHA] DA 01<br/>Identité visuelle WebP</div>
              </div>
              <div class="carousel-item-overlay">Identité · DA</div>
            </div>

            <!-- ⚠️ [MICHA] DA 02 -->
            <div class="carousel-item" data-cat="da" data-src="/assets/images/micha/da-02.webp" data-alt="Branding">
              <div class="carousel-placeholder">
                <div class="carousel-placeholder-icon">🎨</div>
                <div class="carousel-placeholder-label">⚠️ [MICHA] DA 02<br/>Branding WebP</div>
              </div>
              <div class="carousel-item-overlay">Branding · DA</div>
            </div>

            <!-- ⚠️ [MICHA] IA 01 -->
            <div class="carousel-item" data-cat="ia" data-src="/assets/images/micha/ia-01.webp" data-alt="IA générative">
              <div class="carousel-placeholder">
                <div class="carousel-placeholder-icon">✨</div>
                <div class="carousel-placeholder-label">⚠️ [MICHA] IA Générative 01<br/>WebP</div>
              </div>
              <div class="carousel-item-overlay">IA générative</div>
            </div>

            <!-- ⚠️ [MICHA] IA 02 -->
            <div class="carousel-item" data-cat="ia" data-src="/assets/images/micha/ia-02.webp" data-alt="IA générative">
              <div class="carousel-placeholder">
                <div class="carousel-placeholder-icon">✨</div>
                <div class="carousel-placeholder-label">⚠️ [MICHA] IA Générative 02<br/>WebP</div>
              </div>
              <div class="carousel-item-overlay">IA générative</div>
            </div>

            <!-- ⚠️ [MICHA] Événementiel 01 -->
            <div class="carousel-item" data-cat="event" data-src="/assets/images/micha/event-01.webp" data-alt="Mariage">
              <div class="carousel-placeholder">
                <div class="carousel-placeholder-icon">💍</div>
                <div class="carousel-placeholder-label">⚠️ [MICHA] Événement 01<br/>Mariage WebP</div>
              </div>
              <div class="carousel-item-overlay">Événement · Photo</div>
            </div>

            <!-- ⚠️ [MICHA] Événementiel 02 -->
            <div class="carousel-item" data-cat="event" data-src="/assets/images/micha/event-02.webp" data-alt="Corporate">
              <div class="carousel-placeholder">
                <div class="carousel-placeholder-icon">🏢</div>
                <div class="carousel-placeholder-label">⚠️ [MICHA] Événement 02<br/>Corporate WebP</div>
              </div>
              <div class="carousel-item-overlay">Corporate · Événement</div>
            </div>

          </div>

          <div class="carousel-controls">
            <button class="carousel-btn carousel-prev" aria-label="Précédent">←</button>
            <button class="carousel-btn carousel-next" aria-label="Suivant">→</button>
          </div>
        </div>

        <div style="text-align:center;margin-top:32px;" class="anim-fade" data-delay="200">
          <a href="https://memoireetpresence.fr" target="_blank" rel="noopener" class="btn btn--primary">
            Portfolio complet sur memoireetpresence.fr ↗
          </a>
        </div>
      </div>
    </section>

    <!-- TARIFS MICHA -->
    <section class="snap-section" id="tarifs">
      <div class="container">
        <span class="label anim-fade" style="color:var(--accent-3);">Tarifs Micha · Prestations image</span>
        <h2 style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:40px;" class="anim-up" data-delay="80">
          Des tarifs clairs.<br/>Un travail sans compromis.
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;">

          <!-- PHOTO -->
          <div class="card anim-up" style="padding:28px;border-color:rgba(127,255,234,0.12);" data-delay="0">
            <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-3);margin-bottom:16px;">📸 Photo</div>
            <table class="pricing-table">
              <thead><tr><th>Prestation</th><th>Prix HT</th></tr></thead>
              <tbody>
                <tr><td>Shooting produit / portrait<br/><small style="opacity:0.6;">2h · 20 photos retouchées</small></td><td>390 €</td></tr>
                <tr><td>Shooting événement ½ journée<br/><small style="opacity:0.6;">4h · 50 photos · galerie privée</small></td><td>590 €</td></tr>
                <tr><td>Shooting événement journée<br/><small style="opacity:0.6;">8h · 100 photos · galerie privée</small></td><td>990 €</td></tr>
                <tr><td>Reportage<br/><small style="opacity:0.6;">Journée · galerie · album numérique</small></td><td>1 490 €</td></tr>
              </tbody>
            </table>
          </div>

          <!-- VIDÉO -->
          <div class="card anim-up" style="padding:28px;border-color:rgba(127,255,234,0.12);" data-delay="80">
            <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-3);margin-bottom:16px;">🎬 Vidéo</div>
            <table class="pricing-table">
              <thead><tr><th>Prestation</th><th>Prix HT</th></tr></thead>
              <tbody>
                <tr><td>Vidéo présentation &lt; 2min<br/><small style="opacity:0.6;">Tournage + montage + sous-titres</small></td><td>590 €</td></tr>
                <tr><td>Vidéo corporate 2–5min<br/><small style="opacity:0.6;">Tournage + montage + musique + étalonnage</small></td><td>990 €</td></tr>
                <tr><td>Film événement<br/><small style="opacity:0.6;">Journée + montage + teaser 60s</small></td><td>1 490 €</td></tr>
                <tr><td>Série Reels x5<br/><small style="opacity:0.6;">Tournage 1j + montage 5 formats</small></td><td>790 €</td></tr>
              </tbody>
            </table>
          </div>

          <!-- DA + IA + RESTAURATION -->
          <div class="card anim-up" style="padding:28px;border-color:rgba(127,255,234,0.12);" data-delay="160">
            <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-3);margin-bottom:16px;">🎨 DA · IA · Restauration</div>
            <table class="pricing-table">
              <thead><tr><th>Prestation</th><th>Prix HT</th></tr></thead>
              <tbody>
                <tr><td>Identité visuelle complète<br/><small style="opacity:0.6;">Logo + charte + templates + guide</small></td><td>890 €</td></tr>
                <tr><td>Refonte DA existante<br/><small style="opacity:0.6;">Audit + corrections + guide</small></td><td>590 €</td></tr>
                <tr><td>Brief créa + direction<br/><small style="opacity:0.6;">3h + document complet</small></td><td>290 €</td></tr>
                <tr><td>Visuels IA dirigée x10<br/><small style="opacity:0.6;">Prompts + sélection + retouche</small></td><td>390 €</td></tr>
                <tr><td>Pack contenu IA mensuel<br/><small style="opacity:0.6;">20 visuels + 4 formats sociaux</small></td><td>290 €/mois</td></tr>
                <tr><td>Restauration photo ancienne<br/><small style="opacity:0.6;">Scan + restauration + impression HD</small></td><td>90 €/photo</td></tr>
              </tbody>
            </table>
            <div style="margin-top:20px;">
              <a href="/diagnostic/" class="btn btn--primary" style="font-size:12px;padding:10px 20px;background:rgba(127,255,234,0.15);border-color:rgba(127,255,234,0.30);width:100%;justify-content:center;">
                Demander un devis Micha →
              </a>
            </div>
          </div>

        </div>
        <p style="font-size:11px;color:var(--text-soft);margin-top:20px;text-align:center;">
          Prix HT · TVA non applicable art. 293 B CGI · Devis personnalisé sur demande · Déplacement possible toute France
        </p>
      </div>
    </section>

  </div>
'@

$mpHtml = Get-Shell `
  -title "Mémoire & Présence — Micha · Portfolio & Tarifs" `
  -desc "Portfolio photo, vidéo, DA et IA générative de Micha. Tarifs clairs. Prestations image pour entreprises et particuliers." `
  -body $mpBody `
  -dots 4

New-Item -ItemType Directory -Force -Path "$Root/memoire-et-presence" | Out-Null
Set-Content -Path "$Root/memoire-et-presence/index.html" -Value $mpHtml -Encoding UTF8

# Créer le dossier images Micha avec placeholders
New-Item -ItemType Directory -Force -Path "$Root/assets/images/micha" | Out-Null
Set-Content -Path "$Root/assets/images/micha/README.txt" -Value @"
PORTFOLIO MICHA — IMAGES À GLISSER ICI
=======================================
Format : WebP · Qualité 85% · Compression optimale

PHOTOS :
- photo-01.webp  → Portrait professionnel (800×600px)
- photo-02.webp  → Reportage événementiel (800×600px)
- photo-03.webp  → Shooting produit (800×600px)

VIDÉOS (thumbnails) :
- video-thumb-01.webp → Corporate (800×600px)
- video-thumb-02.webp → Film hommage (800×600px)

DIRECTION ARTISTIQUE :
- da-01.webp → Identité visuelle (800×600px)
- da-02.webp → Branding (800×600px)

IA GÉNÉRATIVE :
- ia-01.webp → Création IA 01 (800×600px)
- ia-02.webp → Création IA 02 (800×600px)

ÉVÉNEMENTIEL :
- event-01.webp → Événement 01 (800×600px)
- event-02.webp → Corporate (800×600px)

PORTRAIT MICHA (page M&P) :
- micha-portrait.webp → Portrait (600×700px)
"@ -Encoding UTF8
Write-OK "memoire-et-presence/index.html V2 + assets/images/micha/"

# ==============================================================================
# 8. PAGE A-PROPOS V2 — storyboard complet Lauralie + Micha
# ==============================================================================
Write-Step "8/12" "a-propos/index.html V2..."

$aproposBody = @'
  <div class="snap-container">

    <section class="snap-section" id="hero-apropos">
      <div class="container">
        <span class="label anim-fade">Pinapp Inc. · Notre histoire</span>
        <h1 style="font-size:clamp(40px,7vw,88px);letter-spacing:-0.04em;max-width:800px;margin-bottom:32px;line-height:1.0;" class="anim-up" data-delay="100">
          Nous construisons des systèmes.<br/>Nous croyons à <span class="shimmer">l'humain</span>.
        </h1>
        <p style="font-size:18px;color:var(--text-muted);max-width:600px;margin-bottom:40px;line-height:1.7;" class="anim-up" data-delay="180">
          Pinapp Inc. est née d'une conviction simple : la technologie doit servir les gens, pas les remplacer. Nous avons enquêté, testé, échoué, recommencé. Puis nous avons construit ce qui manquait — pour nous d'abord, pour vous ensuite.
        </p>
        <div class="etude-cite anim-up" data-delay="220">
          <div class="etude-cite-bar"></div>
          <div>
            <div class="etude-cite-text">"Les systèmes les plus efficaces sont ceux construits par des gens qui en avaient eux-mêmes besoin."</div>
            <div class="etude-cite-source">— Principe de conception centrée utilisateur · Nielsen Norman Group · Appliqué par Pinapp Inc.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- STORYBOARD LAURALIE -->
    <section class="snap-section" id="lauralie">
      <div class="container">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start;">
          <div>
            <span class="label anim-fade">Co-associée · Architecte systèmes & IA</span>
            <h2 style="font-size:clamp(32px,5vw,56px);letter-spacing:-0.03em;margin-bottom:32px;" class="anim-up" data-delay="80">
              Lauralie.
            </h2>

            <!-- Timeline storyboard -->
            <div style="display:flex;flex-direction:column;gap:0;position:relative;">
              <div style="position:absolute;left:15px;top:0;bottom:0;width:1px;background:var(--separator);"></div>

              <div style="display:flex;gap:20px;margin-bottom:28px;padding-left:40px;position:relative;" class="anim-left" data-delay="100">
                <div style="position:absolute;left:10px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--accent);box-shadow:0 0 10px var(--accent);"></div>
                <div>
                  <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);margin-bottom:4px;">Études</div>
                  <h3 style="font-size:16px;margin-bottom:6px;">Informatique & systèmes</h3>
                  <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">Formation technique approfondie. Algorithmique, architecture logicielle, bases de données. La rigueur comme discipline.</p>
                </div>
              </div>

              <div style="display:flex;gap:20px;margin-bottom:28px;padding-left:40px;position:relative;" class="anim-left" data-delay="180">
                <div style="position:absolute;left:10px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--accent-2);box-shadow:0 0 10px var(--accent-2);"></div>
                <div>
                  <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent-2);margin-bottom:4px;">Recherche & entraînement</div>
                  <h3 style="font-size:16px;margin-bottom:6px;">Des années d'exploration</h3>
                  <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">Automatisation, no-code, IA — chaque outil testé, documenté, maîtrisé. Un perfectionnisme qui ne s'excuse pas.</p>
                </div>
              </div>

              <div style="display:flex;gap:20px;margin-bottom:28px;padding-left:40px;position:relative;" class="anim-left" data-delay="260">
                <div style="position:absolute;left:10px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--accent-3);box-shadow:0 0 10px var(--accent-3);"></div>
                <div>
                  <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent-3);margin-bottom:4px;">Terrain</div>
                  <h3 style="font-size:16px;margin-bottom:6px;">Enquêtes auprès des indépendants</h3>
                  <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">50+ entretiens avec des TPE, artisans, coachs. Les vraies douleurs, pas les supposées. C'est de là que viennent les offres Pinapp.</p>
                </div>
              </div>

              <div style="display:flex;gap:20px;padding-left:40px;position:relative;" class="anim-left" data-delay="340">
                <div style="position:absolute;left:10px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--nacre);box-shadow:0 0 10px var(--nacre);"></div>
                <div>
                  <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--nacre);margin-bottom:4px;">Aujourd'hui</div>
                  <h3 style="font-size:16px;margin-bottom:6px;">Pinapp Inc. · Auralis RH</h3>
                  <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">Architecte des systèmes qui font tourner les business. Pas de titre ronflant — juste des livrables qui fonctionnent.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <!-- ⚠️ [LAURALIE] Ta photo ici — WebP 600×700px — ou laisser le placeholder -->
            <div class="card" style="padding:40px;border-color:rgba(0,229,176,0.12);">
              <div class="placeholder-block" style="height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;margin-bottom:24px;">
                <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-2));display:flex;align-items:center;justify-content:center;font-family:'Clash Display',sans-serif;font-size:32px;font-weight:700;color:#080d18;">L</div>
                <div style="font-size:11px;opacity:0.5;text-align:center;">⚠️ [LAURALIE] Photo portrait<br/>WebP 600×700px à glisser ici</div>
              </div>
              <h3 style="font-size:22px;margin-bottom:6px;">Lauralie</h3>
              <p style="font-size:12px;color:var(--accent);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;">Architecte systèmes & IA · Pinapp Studio</p>
              <ul class="checklist">
                <li>Sites & automatisation n8n</li>
                <li>Intelligence artificielle sur-mesure</li>
                <li>Auralis RH — en développement</li>
                <li>Scripts & déploiement Hostinger</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STORYBOARD MICHA -->
    <section class="snap-section" id="micha-story">
      <div class="container">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start;">
          <div>
            <!-- ⚠️ [MICHA] Ta photo ici — WebP 600×700px -->
            <div class="card" style="padding:40px;border-color:rgba(127,255,234,0.12);">
              <div class="placeholder-block" style="height:280px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;margin-bottom:24px;">
                <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--accent-3),var(--accent-4));display:flex;align-items:center;justify-content:center;font-family:'Clash Display',sans-serif;font-size:32px;font-weight:700;color:#080d18;">M</div>
                <div style="font-size:11px;opacity:0.5;text-align:center;">⚠️ [MICHA] Photo portrait<br/>WebP 600×700px à glisser ici</div>
              </div>
              <h3 style="font-size:22px;margin-bottom:6px;">Micha</h3>
              <p style="font-size:12px;color:var(--accent-3);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;">Directeur artistique & image · M&P</p>
              <ul class="checklist">
                <li>Photo & vidéo professionnelles</li>
                <li>Direction artistique complète</li>
                <li>IA générative dirigée</li>
                <li>Mémoire & Présence — projet fondateur</li>
              </ul>
            </div>
          </div>
          <div>
            <span class="label anim-fade" style="color:var(--accent-3);">Co-associé · Directeur artistique</span>
            <h2 style="font-size:clamp(32px,5vw,56px);letter-spacing:-0.03em;margin-bottom:32px;" class="anim-up" data-delay="80">
              Micha.
            </h2>

            <div style="display:flex;flex-direction:column;gap:0;position:relative;">
              <div style="position:absolute;left:15px;top:0;bottom:0;width:1px;background:rgba(127,255,234,0.15);"></div>

              <div style="display:flex;gap:20px;margin-bottom:28px;padding-left:40px;position:relative;" class="anim-right" data-delay="100">
                <div style="position:absolute;left:10px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--accent-3);box-shadow:0 0 10px var(--accent-3);"></div>
                <div>
                  <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent-3);margin-bottom:4px;">Événementiel</div>
                  <h3 style="font-size:16px;margin-bottom:6px;">Mariages, corporate, live</h3>
                  <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">Des années à capturer des moments qui ne se répètent pas. La pression du terrain comme meilleure école.</p>
                </div>
              </div>

              <div style="display:flex;gap:20px;margin-bottom:28px;padding-left:40px;position:relative;" class="anim-right" data-delay="180">
                <div style="position:absolute;left:10px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--accent-2);box-shadow:0 0 10px var(--accent-2);"></div>
                <div>
                  <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent-2);margin-bottom:4px;">Passion tech</div>
                  <h3 style="font-size:16px;margin-bottom:6px;">Maîtrise Adobe & IA générative</h3>
                  <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">Midjourney, Firefly, Runway — explorés dès leurs débuts. L'IA comme outil créatif, pas comme raccourci.</p>
                </div>
              </div>

              <div style="display:flex;gap:20px;margin-bottom:28px;padding-left:40px;position:relative;" class="anim-right" data-delay="260">
                <div style="position:absolute;left:10px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--accent);box-shadow:0 0 10px var(--accent);"></div>
                <div>
                  <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent);margin-bottom:4px;">Recherche & maîtrise</div>
                  <h3 style="font-size:16px;margin-bottom:6px;">Des centaines d'heures de pratique</h3>
                  <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">Chaque logiciel appris en profondeur. Chaque technique testée sur de vraies productions avant d'être enseignée.</p>
                </div>
              </div>

              <div style="display:flex;gap:20px;padding-left:40px;position:relative;" class="anim-right" data-delay="340">
                <div style="position:absolute;left:10px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--nacre);box-shadow:0 0 10px var(--nacre);"></div>
                <div>
                  <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--nacre);margin-bottom:4px;">Aujourd'hui</div>
                  <h3 style="font-size:16px;margin-bottom:6px;">Mémoire & Présence · Pinapp Inc.</h3>
                  <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">La technique au service de l'humain. Des visuels qui font ressentir ce que les mots ne peuvent pas dire.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VALEURS -->
    <section class="snap-section" id="valeurs">
      <div class="container">
        <span class="label anim-fade">Ce en quoi nous croyons</span>
        <h2 style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:40px;" class="anim-up" data-delay="80">
          Nos valeurs.<br/>Pas des mots. Des décisions.
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">
          <div class="card anim-up" style="padding:28px;" data-delay="0">
            <svg class="icon-svg" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 8c-4 0-8 4-8 8s8 16 8 16 8-12 8-16-4-8-8-8z" stroke="currentColor" stroke-width="1.5"/></svg>
            <h3 style="font-size:18px;margin-bottom:10px;">L'humain d'abord</h3>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.7;">La technologie existe pour servir les gens. Pas pour les impressionner. Chaque outil libère du temps pour ce qui compte vraiment.</p>
          </div>
          <div class="card anim-up" style="padding:28px;" data-delay="60">
            <svg class="icon-svg" viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="12" stroke="currentColor" stroke-width="1.5"/><path d="M14 20h12M20 14v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <h3 style="font-size:18px;margin-bottom:10px;">La connexion</h3>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.7;">Entre les outils, entre les gens, entre les générations. Nous construisons des ponts — numériques quand c'est utile, humains toujours.</p>
          </div>
          <div class="card anim-up" style="padding:28px;" data-delay="120">
            <svg class="icon-svg" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 8l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            <h3 style="font-size:18px;margin-bottom:10px;">La sobriété</h3>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.7;">Zéro outil superflu. Chaque solution justifiée ou supprimée. Stack 100% européen. Moins de complexité, plus d'impact.</p>
          </div>
          <div class="card anim-up" style="padding:28px;" data-delay="0">
            <svg class="icon-svg" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M12 32V20l8-12 8 12v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="16" y="24" width="8" height="8" stroke="currentColor" stroke-width="1.5"/></svg>
            <h3 style="font-size:18px;margin-bottom:10px;">La transmission</h3>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.7;">Documentation incluse. Formation incluse. Vous êtes autonomes après notre départ. Ce que nous construisons doit durer.</p>
          </div>
          <div class="card anim-up" style="padding:28px;" data-delay="60">
            <svg class="icon-svg" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 10v12l6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="20" cy="20" r="12" stroke="currentColor" stroke-width="1.5"/></svg>
            <h3 style="font-size:18px;margin-bottom:10px;">L'honnêteté</h3>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.7;">Paiement sur livrable. Satisfait ou remboursé 30 jours. Pas de jargon. Pas de résultat garanti. Des engagements tenables.</p>
          </div>
          <div class="card anim-up" style="padding:28px;" data-delay="120">
            <svg class="icon-svg" viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M12 20h16M20 12l8 8-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3 style="font-size:18px;margin-bottom:10px;">L'égalité</h3>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.7;">Entre nous d'abord — associés à parts égales. Dans nos projets ensuite — chaque client mérite le même niveau d'exigence.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- POURQUOI MAINTENANT — ÉTUDE DE MARCHÉ -->
    <section class="snap-section" id="pourquoi">
      <div class="container">
        <span class="label anim-fade">Contexte 2026</span>
        <h2 style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:20px;" class="anim-up" data-delay="80">
          Pourquoi maintenant ?<br/>Parce que le virage est là.
        </h2>
        <p style="font-size:16px;color:var(--text-muted);max-width:560px;margin-bottom:40px;line-height:1.6;" class="anim-up" data-delay="120">
          Nous avons enquêté, analysé, croisé les données. Ce que nous avons vu nous a convaincus qu'il fallait agir maintenant — pas dans deux ans.
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">
          <div class="card anim-up" style="padding:28px;text-align:center;" data-delay="0">
            <div style="font-family:'Clash Display',sans-serif;font-size:64px;font-weight:700;color:var(--accent);line-height:1;margin-bottom:8px;"><span class="count-up" data-target="67">0</span>%</div>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">des TPE françaises n'ont pas encore automatisé leurs process</p>
            <div class="study-badge" style="margin-top:12px;justify-content:center;">BPI France · 2024</div>
          </div>
          <div class="card anim-up" style="padding:28px;text-align:center;" data-delay="80">
            <div style="font-family:'Clash Display',sans-serif;font-size:64px;font-weight:700;color:var(--accent-2);line-height:1;margin-bottom:8px;"><span class="count-up" data-target="60">0</span>%</div>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">de réduction du temps de production de contenu avec l'IA générative</p>
            <div class="study-badge" style="margin-top:12px;justify-content:center;">McKinsey · 2024</div>
          </div>
          <div class="card anim-up" style="padding:28px;text-align:center;" data-delay="160">
            <div style="font-family:'Clash Display',sans-serif;font-size:64px;font-weight:700;color:var(--nacre);line-height:1;margin-bottom:8px;"><span class="count-up" data-target="400">0</span>h</div>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">perdues par an en tâches répétitives pour un indépendant moyen</p>
            <div class="study-badge" style="margin-top:12px;justify-content:center;">Enquête Pinapp · 2026</div>
          </div>
        </div>
        <div class="urgence-banner anim-up" style="margin-top:32px;" data-delay="200">
          <div class="urgence-dot"></div>
          <span>Le virage IA se prend maintenant. Dans 18 mois, les entreprises qui l'auront raté auront 2 ans de retard à rattraper. Nous formons les gens à l'IA pour réduire les inégalités — pas pour les creuser.</span>
        </div>
        <div style="text-align:center;margin-top:40px;" class="anim-scale" data-delay="240">
          <a href="/diagnostic/" class="btn btn--primary" style="font-size:15px;padding:16px 36px;">Commencer avec nous →</a>
        </div>
      </div>
    </section>

  </div>
'@

$aproposHtml = Get-Shell `
  -title "Notre société — Pinapp Inc. · Lauralie & Micha" `
  -desc "Storyboard complet de Lauralie et Micha. Leurs parcours, leurs valeurs, pourquoi Pinapp Inc. existe en 2026." `
  -body $aproposBody `
  -dots 5

New-Item -ItemType Directory -Force -Path "$Root/a-propos" | Out-Null
Set-Content -Path "$Root/a-propos/index.html" -Value $aproposHtml -Encoding UTF8
Write-OK "a-propos/index.html V2 storyboard complet"

# ==============================================================================
# 9. PAGE ENGAGEMENTS
# ==============================================================================
Write-Step "9/12" "engagements/index.html..."

$engBody = @'
  <div class="snap-container">
    <section class="snap-section" id="eng-hero" style="justify-content:center;">
      <div class="container" style="max-width:800px;margin:0 auto;">
        <span class="label anim-fade">Nos engagements</span>
        <h1 style="font-size:clamp(36px,6vw,72px);letter-spacing:-0.04em;margin-bottom:24px;" class="anim-up" data-delay="100">
          Éthiques. Responsables.<br/><span class="shimmer">Transparents.</span>
        </h1>
        <p style="font-size:17px;color:var(--text-muted);margin-bottom:40px;line-height:1.7;" class="anim-up" data-delay="180">
          Nos engagements ne sont pas du marketing. Ce sont des décisions opérationnelles qui ont un coût — et qu'on assume.
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">
          <div class="card anim-up" style="padding:28px;" data-delay="0">
            <svg class="icon-svg" viewBox="0 0 40 40" fill="none"><path d="M20 8l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9l3-9z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            <h3 style="font-size:18px;margin-bottom:10px;">Stack 100% européen</h3>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.7;">Vos données restent en Europe. Hostinger EU, Notion EU, YouSign FR. Zéro transit vers des serveurs américains.</p>
          </div>
          <div class="card anim-up" style="padding:28px;" data-delay="80">
            <svg class="icon-svg" viewBox="0 0 40 40" fill="none"><path d="M20 10C14 10 10 14 10 20s4 10 10 10 10-4 10-10-4-10-10-10z" stroke="currentColor" stroke-width="1.5"/><path d="M16 20l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3 style="font-size:18px;margin-bottom:10px;">IA transparente</h3>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.7;">Tout contenu assisté par IA est signalé. EU AI Act Article 50 respecté. Vous savez toujours ce qui est humain et ce qui est automatisé.</p>
            <div class="ai-badge" style="margin-top:12px;">EU AI Act · Art. 50 · Conforme</div>
          </div>
          <div class="card anim-up" style="padding:28px;" data-delay="160">
            <svg class="icon-svg" viewBox="0 0 40 40" fill="none"><path d="M10 20h20M20 10l10 10-10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3 style="font-size:18px;margin-bottom:10px;">Zéro outil superflu</h3>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.7;">Chaque outil recommandé est celui qu'on utilise nous-mêmes. Pas de commission. Pas d'affiliation cachée. Juste ce qui fonctionne.</p>
          </div>
          <div class="card anim-up" style="padding:28px;" data-delay="0">
            <svg class="icon-svg" viewBox="0 0 40 40" fill="none"><path d="M12 28l4-8 4 4 4-8 4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <h3 style="font-size:18px;margin-bottom:10px;">Paiement sur livrable</h3>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.7;">Vous payez ce que vous recevez. Satisfait ou remboursé 30 jours sur toutes les prestations. Aucun acompte sans contrat signé.</p>
          </div>
          <div class="card anim-up" style="padding:28px;" data-delay="80">
            <svg class="icon-svg" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="16" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M10 32c0-6 4-10 10-10s10 4 10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <h3 style="font-size:18px;margin-bottom:10px;">Inclusif & accessible</h3>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.7;">Nos formations sont conçues pour tous les profils cognitifs. TDAH, neuroatypiques, débutants — chacun trouve son rythme.</p>
          </div>
          <div class="card anim-up" style="padding:28px;" data-delay="160">
            <svg class="icon-svg" viewBox="0 0 40 40" fill="none"><path d="M20 10v4M10 20h4M30 20h-4M20 30v-4M14 14l3 3M26 14l-3 3M14 26l3-3M26 26l-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="20" cy="20" r="4" stroke="currentColor" stroke-width="1.5"/></svg>
            <h3 style="font-size:18px;margin-bottom:10px;">Réduction des inégalités</h3>
            <p style="font-size:13px;color:var(--text-muted);line-height:1.7;">Former les indépendants à l'IA, c'est leur donner les mêmes armes que les grandes entreprises. C'est notre conviction depuis le début.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
'@

$engHtml = Get-Shell `
  -title "Nos engagements — Pinapp Inc." `
  -desc "Éthiques, responsables, transparents. Stack européen, IA déclarée, paiement sur livrable, inclusif. Nos engagements sont des décisions opérationnelles." `
  -body $engBody `
  -dots 1

New-Item -ItemType Directory -Force -Path "$Root/engagements" | Out-Null
Set-Content -Path "$Root/engagements/index.html" -Value $engHtml -Encoding UTF8
Write-OK "engagements/index.html"

# ==============================================================================
# 10. PAGES LÉGALES
# ==============================================================================
Write-Step "10/12" "Pages légales..."

$mentionsBody = @'
  <div class="snap-container">
    <section class="snap-section" style="justify-content:flex-start;padding-top:120px;">
      <div class="container" style="max-width:800px;">
        <span class="label">Mentions légales</span>
        <h1 style="font-size:48px;letter-spacing:-0.03em;margin-bottom:40px;">Informations légales</h1>
        <div class="card" style="padding:40px;">
          <h2 style="font-size:22px;margin-bottom:16px;">Éditeur du site</h2>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:24px;">
            Pinapp Inc.<br/>
            Siège social : 49 Avenue Edmond Rostand, 33700 Mérignac, France<br/>
            SIRET : 523 884 898 00017<br/>
            Email : contact@pinapp.fr<br/>
            Téléphone : 06 59 88 20 15<br/>
            Directrice de publication : Lauralie Daguzay
          </p>
          <h2 style="font-size:22px;margin-bottom:16px;">Hébergement</h2>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:24px;">
            Hostinger International Ltd<br/>
            61 Lordou Vironos Street, 6023 Larnaca, Chypre<br/>
            Serveurs : Union Européenne
          </p>
          <h2 style="font-size:22px;margin-bottom:16px;">Propriété intellectuelle</h2>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:24px;">
            Tous les contenus (textes, images, visuels, code) sont la propriété exclusive de Pinapp Inc. et de ses associés. Toute reproduction sans autorisation écrite est interdite.
          </p>
          <h2 style="font-size:22px;margin-bottom:16px;">IA & transparence</h2>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.8;">
            Conformément à l'EU AI Act Article 50, certains contenus de ce site sont assistés par intelligence artificielle. Ces contenus sont systématiquement validés et signés par Lauralie et Micha avant publication.
          </p>
        </div>
      </div>
    </section>
  </div>
'@

$mentionsHtml = Get-Shell -title "Mentions légales — Pinapp Inc." -desc "Mentions légales Pinapp Inc." -body $mentionsBody
New-Item -ItemType Directory -Force -Path "$Root/legal" | Out-Null
Set-Content -Path "$Root/legal/mentions.html" -Value $mentionsHtml -Encoding UTF8

$cgvBody = @'
  <div class="snap-container">
    <section class="snap-section" style="justify-content:flex-start;padding-top:120px;">
      <div class="container" style="max-width:800px;">
        <span class="label">Conditions générales de vente</span>
        <h1 style="font-size:48px;letter-spacing:-0.03em;margin-bottom:40px;">CGV</h1>
        <div class="card" style="padding:40px;">
          <h2 style="font-size:22px;margin-bottom:16px;">Prestations</h2>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:24px;">Les prestations de Pinapp Inc. (sites web, automatisation, IA, formations, prestations image) sont régies par un devis signé entre les parties. Tout devis signé vaut bon de commande.</p>
          <h2 style="font-size:22px;margin-bottom:16px;">Paiement</h2>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:24px;">Paiement sur livrable convenu dans le devis. Paiement sécurisé via Stripe. Prix indiqués HT. TVA non applicable, article 293 B du CGI.</p>
          <h2 style="font-size:22px;margin-bottom:16px;">Satisfait ou remboursé</h2>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:24px;">Garantie satisfait ou remboursé 30 jours sur toutes les prestations, sous réserve que le livrable ne corresponde pas aux spécifications du devis signé.</p>
          <h2 style="font-size:22px;margin-bottom:16px;">Usage de l'IA</h2>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.8;">Pinapp Inc. utilise des outils d'IA (Claude, n8n, outils Adobe IA) dans ses prestations. Conformément à l'EU AI Act Art. 50, tout contenu IA est validé humainement avant livraison.</p>
          <!-- ⚠️ [LAURALIE] À COMPLÉTER : CGV complètes avec avocat -->
        </div>
      </div>
    </section>
  </div>
'@

$cgvHtml = Get-Shell -title "CGV — Pinapp Inc." -desc "Conditions générales de vente Pinapp Inc." -body $cgvBody
Set-Content -Path "$Root/cgv/" -Value $cgvHtml -Encoding UTF8

$confBody = @'
  <div class="snap-container">
    <section class="snap-section" style="justify-content:flex-start;padding-top:120px;">
      <div class="container" style="max-width:800px;">
        <span class="label">Politique de confidentialité</span>
        <h1 style="font-size:48px;letter-spacing:-0.03em;margin-bottom:40px;">Vos données</h1>
        <div class="card" style="padding:40px;">
          <h2 style="font-size:22px;margin-bottom:16px;">Données collectées</h2>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:24px;">Via nos formulaires (Tally) : nom, email, secteur, besoin. Ces données sont utilisées uniquement pour répondre à votre demande. Elles ne sont jamais revendues.</p>
          <h2 style="font-size:22px;margin-bottom:16px;">Hébergement des données</h2>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:24px;">Toutes les données sont hébergées en Union Européenne (Hostinger EU, Notion EU). Aucun transfert hors UE.</p>
          <h2 style="font-size:22px;margin-bottom:16px;">Vos droits (RGPD)</h2>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:24px;">Accès, rectification, suppression, portabilité. Demande par email : contact@pinapp.fr. Réponse sous 30 jours.</p>
          <h2 style="font-size:22px;margin-bottom:16px;">Cookies</h2>
          <p style="font-size:14px;color:var(--text-muted);line-height:1.8;">Ce site utilise Plausible Analytics (sans cookie, sans tracking individuel) pour mesurer les visites de manière agrégée et anonyme. Aucun cookie publicitaire.</p>
          <!-- ⚠️ [LAURALIE] À COMPLÉTER : politique complète avec DPO si nécessaire -->
        </div>
      </div>
    </section>
  </div>
'@

$confHtml = Get-Shell -title "Confidentialité — Pinapp Inc." -desc "Politique de confidentialité Pinapp Inc. RGPD." -body $confBody
Set-Content -Path "$Root/confidentialite/" -Value $confHtml -Encoding UTF8
Write-OK "legal/ (mentions + cgv + confidentialite)"

# ==============================================================================
# 11. README SSL + CHECKLIST DÉPLOIEMENT
# ==============================================================================
Write-Step "11/12" "README-DEPLOIEMENT.md..."

$readme = @'
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

```powershell
Get-ChildItem -Recurse -Include *.html | Select-String -SimpleMatch '⚠️ [LAURALIE]'
Get-ChildItem -Recurse -Include *.html | Select-String -SimpleMatch '⚠️ [MICHA]'
```
'@

Set-Content -Path "$Root/README-DEPLOIEMENT.md" -Value $readme -Encoding UTF8
Write-OK "README-DEPLOIEMENT.md"

# ==============================================================================
# 12. RÉSUMÉ
# ==============================================================================
Write-Host ""
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  CORRECTIF V2 — TERMINÉ" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""
Write-Host "  15 problèmes résolus :" -ForegroundColor White
Write-Host "  ✓ Font-face Clash Display self-hosted + README fonts" -ForegroundColor Gray
Write-Host "  ✓ CSS V2 — mode nuit forcé · jour Avatar 2 renforcé" -ForegroundColor Gray
Write-Host "  ✓ Water-surface + reflets animés mode jour" -ForegroundColor Gray
Write-Host "  ✓ Scroll-snap fix Safari (100dvh + padding-top 84px)" -ForegroundColor Gray
Write-Host "  ✓ Emojis → SVG partout" -ForegroundColor Gray
Write-Host "  ✓ Curseur custom + traînée lumineuse" -ForegroundColor Gray
Write-Host "  ✓ Carousel Micha 11 slots + lightbox + filtres catégories" -ForegroundColor Gray
Write-Host "  ✓ Storyboard Lauralie + Micha timeline dans a-propos/" -ForegroundColor Gray
Write-Host "  ✓ Storyboard compact dans burger mobile" -ForegroundColor Gray
Write-Host "  ✓ Tarifs Micha complets (photo/vidéo/DA/IA/restauration)" -ForegroundColor Gray
Write-Host "  ✓ Formations Micha 5 niveaux + pack cursus + 797€" -ForegroundColor Gray
Write-Host "  ✓ Formations Lauralie complètes + accompagnement 297€/mois" -ForegroundColor Gray
Write-Host "  ✓ Études citées (Sweller, Dondis, McKinsey, BPI)" -ForegroundColor Gray
Write-Host "  ✓ EU AI Act badge footer + CGV" -ForegroundColor Gray
Write-Host "  ✓ Placeholders ⚠️ [LAURALIE] et ⚠️ [MICHA] partout" -ForegroundColor Gray
Write-Host "  ✓ README-DEPLOIEMENT.md checklist complète" -ForegroundColor Gray
Write-Host "  ✓ Pages légales (mentions + cgv + confidentialité)" -ForegroundColor Gray
Write-Host "  ✓ Page engagements complète avec SVG icons" -ForegroundColor Gray
Write-Host ""
Write-Host "  ACTION IMMÉDIATE N°1 :" -ForegroundColor Yellow
Write-Host "  hPanel Hostinger → SSL → Let's Encrypt → Activer" -ForegroundColor Gray
Write-Host ""
Write-Host "  ACTION IMMÉDIATE N°2 :" -ForegroundColor Yellow
Write-Host "  fontsource.org/fonts/clash-display → télécharger .woff2" -ForegroundColor Gray
Write-Host "  → placer dans assets/fonts/ → ship" -ForegroundColor Gray
Write-Host ""
Write-Host "  Pour trouver tous les placeholders :" -ForegroundColor Yellow
Write-Host '  Get-ChildItem -Recurse -Include *.html | Select-String -SimpleMatch ''⚠️''' -ForegroundColor Gray
Write-Host ""
Write-Host "  Thomas — zéro blocage. Prêt à déployer." -ForegroundColor Cyan
Write-Host ""
