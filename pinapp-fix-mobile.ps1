# PINAPP INC. — CORRECTIF MOBILE COMPLET
# Script PowerShell — lancer depuis la racine du dépôt pinapp-site
# Corrige tous les problèmes identifiés sur iPhone
# .\pinapp-fix-mobile.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

Write-Host ""
Write-Host "══════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  PINAPP — CORRECTIF MOBILE COMPLET" -ForegroundColor Magenta
Write-Host "══════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

# ─────────────────────────────────────────
# 1. CSS GLOBAL — correctifs mobiles
# ─────────────────────────────────────────
Write-Host "1/5 CSS mobile..." -ForegroundColor Cyan

$cssFixPath = "$Root/assets/css/pinapp-fix-mobile.css"

$cssFix = @'
/* ============================================================
   PINAPP INC. — CORRECTIF MOBILE COMPLET
   Priorité : iPhone Safari 390px
   ============================================================ */

/* ── POLICES — SF Pro natif Apple ── */
h1, h2, h3, h4, .nav__logo, .footer__brand, .btn,
.offre-title, .formation-title, .offre-gain, .offre-price,
.metric-num, .pack-duo-badge {
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "SF Pro Display",
    "Helvetica Neue",
    "Clash Display",
    Arial,
    sans-serif !important;
}

body, p, span, li, a, input, button, textarea, select,
.label, .offre-desc, .offre-delai, .checklist li,
.crosslist li, .text-muted, .nav__link, .footer__links a {
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "SF Pro Text",
    "Helvetica Neue",
    "Inter",
    Arial,
    sans-serif !important;
}

/* ── PRIX — jamais plus grand que 28px sur mobile ── */
@media (max-width: 768px) {
  .offre-price,
  .offre-gain,
  [style*="font-size:32px"],
  [style*="font-size:36px"],
  [style*="font-size:40px"],
  [style*="font-size:44px"] {
    font-size: 26px !important;
    line-height: 1.2 !important;
  }

  /* H1 hero — taille correcte iPhone */
  h1, #hero-title {
    font-size: 36px !important;
    letter-spacing: -0.03em !important;
    line-height: 1.05 !important;
  }

  h2 {
    font-size: 26px !important;
    letter-spacing: -0.02em !important;
    line-height: 1.1 !important;
  }

  h3 {
    font-size: 18px !important;
    line-height: 1.3 !important;
  }

  /* ── TOUTES LES GRILLES → 1 COLONNE ── */
  [style*="grid-template-columns: 1fr 1fr"],
  [style*="grid-template-columns:1fr 1fr"],
  [style*="grid-template-columns: repeat(2"],
  [style*="grid-template-columns:repeat(2"],
  .auralis__inner,
  .studio-2026__grid,
  .snap-section > .container > [style*="grid"] {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }

  /* Pack Duo — 1 colonne */
  [style*="grid-template-columns: 1fr 1fr"][id*="duo"],
  .pack-duo ~ div,
  section#pack-duo .container > div {
    grid-template-columns: 1fr !important;
  }

  /* ── SNAP CONTAINER — fix Safari ── */
  .snap-container {
    height: 100svh !important;
    height: -webkit-fill-available !important;
    overflow-y: scroll !important;
    -webkit-overflow-scrolling: touch !important;
    scroll-snap-type: y mandatory !important;
    overscroll-behavior-y: contain !important;
  }

  .snap-section {
    min-height: 100svh !important;
    min-height: -webkit-fill-available !important;
    scroll-snap-align: start !important;
    scroll-snap-stop: always !important;
    padding-top: 80px !important;
    padding-bottom: 40px !important;
  }

  /* ── HERO — 2 boutons max ── */
  .hero__ctas,
  [style*="display:flex"][style*="gap:16px"] {
    flex-direction: column !important;
    width: 100% !important;
  }

  .btn {
    width: 100% !important;
    justify-content: center !important;
    min-height: 48px !important;
    font-size: 15px !important;
  }

  /* ── TOUCH TARGETS — Apple HIG 44px ── */
  .nav__burger,
  .nav__theme,
  .carousel-btn,
  .sector-btn {
    min-width: 44px !important;
    min-height: 44px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* ── DRAWER — scrollable ── */
  .nav__drawer {
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    max-height: calc(100svh - 64px) !important;
    padding-bottom: max(env(safe-area-inset-bottom), 24px) !important;
  }

  /* ── SAFE AREA iPhone ── */
  .nav {
    padding-top: env(safe-area-inset-top, 0px) !important;
  }

  footer {
    padding-bottom: max(env(safe-area-inset-bottom), 40px) !important;
  }

  /* ── AURORA MOCK — lisible sur mobile ── */
  .aurora-mock,
  [id*="aurora"] .card,
  section#auralis .card {
    padding: 20px !important;
    font-size: 14px !important;
    font-style: normal !important;
  }

  .aurora-mock__msg,
  [style*="font-style:italic"] {
    font-size: 14px !important;
    line-height: 1.6 !important;
    font-style: normal !important;
  }

  /* ── GRAPHIQUES — donut + courbe ── */
  .donut-wrap {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 16px !important;
  }

  /* ── PADDING CONTAINERS ── */
  .container {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  /* ── CARDS — padding réduit mobile ── */
  .card {
    padding: 20px !important;
  }

  .offre-card,
  .formation-card {
    padding: 20px !important;
  }

  /* ── DÉFILER hint — ne pas chevaucher les boutons ── */
  .hero__scroll,
  [style*="bottom:32px"][style*="left:50%"] {
    display: none !important;
  }
}

/* ── MODE JOUR — Eau Avatar 2 (toutes tailles) ── */
[data-theme="light"] {
  --bg:            #0a3d52 !important;
  --bg-card:       rgba(0, 180, 200, 0.08) !important;
  --text:          #ffffff !important;
  --text-muted:    rgba(255, 255, 255, 0.65) !important;
  --text-soft:     rgba(255, 255, 255, 0.35) !important;
  --accent:        #00e5d4 !important;
  --accent-2:      #7dd4fc !important;
  --accent-3:      #ffffff !important;
  --accent-4:      #00b4d8 !important;
  --nacre:         #e0f7ff !important;
  --card-border:   rgba(0, 229, 212, 0.20) !important;
  --separator:     rgba(0, 229, 212, 0.12) !important;
  --shadow:        rgba(0, 20, 40, 0.30) !important;
  --btn-cta-bg:    rgba(0, 100, 160, 0.90) !important;
  --btn-cta-bd:    rgba(125, 212, 252, 0.40) !important;
  --btn-ghost-bd:  rgba(255, 255, 255, 0.25) !important;
}

[data-theme="light"] .nav {
  background: rgba(8, 50, 70, 0.92) !important;
}

[data-theme="light"] .nav__drawer {
  background: rgba(6, 40, 56, 0.98) !important;
}

[data-theme="light"] .caustics span:nth-child(1) {
  background: rgba(0, 229, 212, 0.28) !important;
}
[data-theme="light"] .caustics span:nth-child(2) {
  background: rgba(125, 212, 252, 0.20) !important;
}
[data-theme="light"] .caustics span:nth-child(3) {
  background: rgba(255, 255, 255, 0.14) !important;
}

[data-theme="light"] .water-surface {
  opacity: 1 !important;
}

[data-theme="light"] .water-reflets {
  opacity: 1 !important;
  background: linear-gradient(
    180deg,
    rgba(125, 212, 252, 0.20) 0%,
    rgba(0, 229, 212, 0.08) 50%,
    transparent 100%
  ) !important;
}

/* ── VIEWPORT META — ajout via CSS (fallback) ── */
@supports (-webkit-touch-callout: none) {
  .snap-container {
    height: -webkit-fill-available !important;
  }
}
'@

Set-Content -Path $cssFixPath -Value $cssFix -Encoding UTF8
Write-Host "   OK assets/css/pinapp-fix-mobile.css" -ForegroundColor Gray

# ─────────────────────────────────────────
# 2. INJECTER LE CSS DANS index.html
# ─────────────────────────────────────────
Write-Host "2/5 Injection CSS dans index.html..." -ForegroundColor Cyan

$indexPath = "$Root/index.html"
if (Test-Path $indexPath) {
  $html = Get-Content $indexPath -Raw -Encoding UTF8

  # Ajouter le CSS fix si pas déjà présent
  if ($html -notmatch "pinapp-fix-mobile\.css") {
    $html = $html -replace `
      '(</head>)', `
      '  <link rel="stylesheet" href="/assets/css/pinapp-fix-mobile.css"/>' + "`n`$1"
    Set-Content -Path $indexPath -Value $html -Encoding UTF8
    Write-Host "   OK CSS injecte dans index.html" -ForegroundColor Gray
  } else {
    Write-Host "   Deja present — skip" -ForegroundColor Gray
  }

  # Corriger "Je connecte" -> "Nous connectons"
  $html = Get-Content $indexPath -Raw -Encoding UTF8
  $html = $html -replace "Je connecte vos outils\.", "Nous connectons vos outils."
  $html = $html -replace "Je connecte", "Nous connectons"

  # Supprimer le 3eme bouton hero (Formations)
  $html = $html -replace '<a[^>]*href="/offres/formation/"[^>]*class="btn btn--ghost"[^>]*>Formations[^<]*</a>', ''
  $html = $html -replace '<a[^>]*>Formations\s*→\s*</a>', ''

  # Corriger la baseline hero
  $oldBaseline = 'Vos outils travaillent. Vous décidez. L''IA et l''automatisation au service d''un système clair — pas de gadget. Besoin de monter en compétence ? Des formations concrètes complètent les missions studio.'
  $newBaseline = 'Nous construisons la structure. Vous récoltez.'
  $html = $html -replace [regex]::Escape($oldBaseline), $newBaseline

  # Ajouter viewport-fit=cover si absent
  $html = $html -replace `
    'width=device-width, initial-scale=1\.0"', `
    'width=device-width, initial-scale=1.0, viewport-fit=cover"'

  Set-Content -Path $indexPath -Value $html -Encoding UTF8
  Write-Host "   OK corrections index.html (voix, boutons, baseline, viewport)" -ForegroundColor Gray
} else {
  Write-Host "   ERREUR: index.html introuvable a $indexPath" -ForegroundColor Red
}

# ─────────────────────────────────────────
# 3. INJECTER CSS DANS TOUTES LES AUTRES PAGES
# ─────────────────────────────────────────
Write-Host "3/5 Injection CSS toutes les pages..." -ForegroundColor Cyan

$htmlFiles = Get-ChildItem -Path $Root -Recurse -Filter "*.html" |
  Where-Object { $_.FullName -ne $indexPath -and $_.Name -ne "404.html" }

$count = 0
foreach ($file in $htmlFiles) {
  $content = Get-Content $file.FullName -Raw -Encoding UTF8
  if ($content -notmatch "pinapp-fix-mobile\.css") {
    # Calculer le chemin relatif vers la racine
    $depth = ($file.DirectoryName -replace [regex]::Escape($Root), "").Split([IO.Path]::DirectorySeparatorChar).Count - 1
    $prefix = "../" * $depth
    if ($depth -eq 0) { $prefix = "/" }

    $cssLink = "  <link rel=`"stylesheet`" href=`"${prefix}assets/css/pinapp-fix-mobile.css`"/>`n"
    $content = $content -replace '(</head>)', "$cssLink`$1"

    # Fix viewport
    $content = $content -replace `
      'width=device-width, initial-scale=1\.0"', `
      'width=device-width, initial-scale=1.0, viewport-fit=cover"'

    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    $count++
  }
}
Write-Host "   OK $count pages HTML mises a jour" -ForegroundColor Gray

# ─────────────────────────────────────────
# 4. .htaccess — HTTPS + headers sécurité
# ─────────────────────────────────────────
Write-Host "4/5 .htaccess HTTPS..." -ForegroundColor Cyan

$htaccessPath = "$Root/.htaccess"
$htaccessFix = @'
# PINAPP INC. — .htaccess
# Forcer HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Supprimer www
RewriteCond %{HTTP_HOST} ^www\.pinapp\.fr [NC]
RewriteRule ^(.*)$ https://pinapp.fr/$1 [L,R=301]

# Headers securite
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache statique
<FilesMatch "\.(css|js|woff2|png|jpg|webp|svg|ico)$">
  Header set Cache-Control "max-age=31536000, public, immutable"
</FilesMatch>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Erreurs
ErrorDocument 404 /404.html
'@

if (Test-Path $htaccessPath) {
  $existing = Get-Content $htaccessPath -Raw -Encoding UTF8
  if ($existing -notmatch "Forcer HTTPS") {
    $htaccessFix + "`n" + $existing | Set-Content -Path $htaccessPath -Encoding UTF8
    Write-Host "   OK .htaccess mis a jour avec HTTPS" -ForegroundColor Gray
  } else {
    Write-Host "   HTTPS deja present dans .htaccess" -ForegroundColor Gray
  }
} else {
  Set-Content -Path $htaccessPath -Value $htaccessFix -Encoding UTF8
  Write-Host "   OK .htaccess cree" -ForegroundColor Gray
}

# ─────────────────────────────────────────
# 5. JS — particules réduites mobile + courbe inversée
# ─────────────────────────────────────────
Write-Host "5/5 JS corrections particles + courbe..." -ForegroundColor Cyan

$particlesPath = "$Root/assets/js/particles.js"
if (Test-Path $particlesPath) {
  $js = Get-Content $particlesPath -Raw -Encoding UTF8
  # Réduire particules sur mobile
  if ($js -notmatch "innerWidth < 768") {
    $js = $js -replace "var N=80", "var N=window.innerWidth<768?35:80"
    $js = $js -replace "var N = 80", "var N = window.innerWidth < 768 ? 35 : 80"
    Set-Content -Path $particlesPath -Value $js -Encoding UTF8
    Write-Host "   OK particles.js — 35 sur mobile, 80 sur desktop" -ForegroundColor Gray
  } else {
    Write-Host "   Deja optimise" -ForegroundColor Gray
  }
}

# Corriger la courbe SVG dans index.html (Avec Pinapp doit descendre)
$html = Get-Content $indexPath -Raw -Encoding UTF8
# Courbe "Avec Pinapp" — doit descendre pas monter
$oldCurve = 'points="10,88 50,72 90,56 130,40 170,30 210,24 250,16"'
$newCurve = 'points="10,30 50,40 90,52 130,65 170,75 210,82 250,88"'
$html = $html -replace [regex]::Escape($oldCurve), $newCurve
Set-Content -Path $indexPath -Value $html -Encoding UTF8
Write-Host "   OK courbe SVG corrigee (Avec Pinapp descend)" -ForegroundColor Gray

# ─────────────────────────────────────────
# RÉSUMÉ
# ─────────────────────────────────────────
Write-Host ""
Write-Host "══════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  CORRECTIF TERMINE" -ForegroundColor Green
Write-Host "══════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""
Write-Host "  Corrections appliquees :" -ForegroundColor White
Write-Host "  OK Police SF Pro native iPhone sur tout le site" -ForegroundColor Gray
Write-Host "  OK Grilles 2 col -> 1 col sur mobile" -ForegroundColor Gray
Write-Host "  OK Prix max 26px sur mobile (plus de prix geant)" -ForegroundColor Gray
Write-Host "  OK H1 hero 36px · H2 26px · lisibles" -ForegroundColor Gray
Write-Host "  OK 3eme bouton hero supprime" -ForegroundColor Gray
Write-Host "  OK Baseline hero corrigee (1 phrase)" -ForegroundColor Gray
Write-Host "  OK Nous connectons (plus de Je)" -ForegroundColor Gray
Write-Host "  OK Scroll-snap Safari fix" -ForegroundColor Gray
Write-Host "  OK Touch targets 44px" -ForegroundColor Gray
Write-Host "  OK Safe area iPhone notch + home indicator" -ForegroundColor Gray
Write-Host "  OK Aurora mock lisible (pas d'italique)" -ForegroundColor Gray
Write-Host "  OK Hint Defiler masque sur mobile" -ForegroundColor Gray
Write-Host "  OK HTTPS redirect .htaccess" -ForegroundColor Gray
Write-Host "  OK Particules 35 sur mobile (performance)" -ForegroundColor Gray
Write-Host "  OK Courbe SVG corrigee" -ForegroundColor Gray
Write-Host "  OK Mode jour Avatar 2 #0a3d52" -ForegroundColor Gray
Write-Host "  OK CSS injecte dans toutes les pages" -ForegroundColor Gray
Write-Host ""
Write-Host "  DEPLOYER :" -ForegroundColor Yellow
Write-Host "  .\pinapp.ps1 ship" -ForegroundColor Gray
Write-Host ""
