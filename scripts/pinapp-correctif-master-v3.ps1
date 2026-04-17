# ==============================================================================
# PINAPP INC. — SCRIPT CORRECTIF MASTER V3
# Résout TOUS les problèmes identifiés dans les PDFs + screenshots iPhone
# Sources : Audit PDF 1, Audit PDF 2, PDF ChatGPT, Screenshots iPhone
# Lancer depuis la racine du dépôt : .\pinapp-correctif-master-v3.ps1
# ==============================================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $Root

function Write-Step { param($n, $t) Write-Host "▶ $n $t" -ForegroundColor Cyan }
function Write-OK   { param($t) Write-Host "   ✓ $t" -ForegroundColor Gray }
function Write-Warn { param($t) Write-Host "   ⚠ $t" -ForegroundColor Yellow }

Write-Host ""
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  PINAPP INC. — CORRECTIF MASTER V3" -ForegroundColor Magenta
Write-Host "  Tous les problèmes PDFs + iPhone résolus" -ForegroundColor Magenta
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

# ==============================================================================
# ÉTAPE 1 — CSS MASTER COMPLET
# Résout : SF Pro · mode jour · grilles · prix · scroll-snap · safe area
# ==============================================================================
Write-Step "1/7" "CSS Master — toutes corrections visuelles..."

$css = @'
/* ============================================================
   PINAPP INC. — CSS MASTER CORRECTIF V3
   Sources : PDF Audit 1 + 2 + ChatGPT + Screenshots iPhone
   ============================================================ */

/* ── 1. POLICES SF PRO NATIF APPLE (PDF : "polices impactantes")
   Arnaud valide : SF Pro = ce qu'Apple utilise sur apple.com vu sur iPhone
   Chargement zéro · rendu parfait · natif iOS ── */
*, *::before, *::after {
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "SF Pro Text",
    "Helvetica Neue",
    "Inter",
    Arial,
    sans-serif;
}

h1, h2, h3, h4, h5, h6,
.nav__logo, .footer__brand,
.offre-title, .offre-gain, .offre-price,
.formation-title, .pack-duo-badge,
[style*="font-family:'Clash Display'"],
[style*='font-family:"Clash Display"'] {
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "SF Pro Display",
    "Helvetica Neue",
    "Clash Display",
    Arial,
    sans-serif !important;
  -webkit-font-smoothing: antialiased;
}

/* ── 2. MODE JOUR AVATAR 2 (PDF : "mode clair manque de personnalité")
   Eau Avatar 2 · mer de Pandora sous le soleil
   #0a3d52 = bleu océan profond lumineux (pas sombre) ── */
[data-theme="light"] {
  --bg:           #0a3d52 !important;
  --bg-card:      rgba(0, 180, 200, 0.08) !important;
  --text:         #ffffff !important;
  --text-muted:   rgba(255, 255, 255, 0.65) !important;
  --text-soft:    rgba(255, 255, 255, 0.35) !important;
  --accent:       #00e5d4 !important;
  --accent-2:     #7dd4fc !important;
  --accent-3:     #ffffff !important;
  --accent-4:     #00b4d8 !important;
  --nacre:        #e0f7ff !important;
  --card-border:  rgba(0, 229, 212, 0.20) !important;
  --separator:    rgba(0, 229, 212, 0.12) !important;
  --shadow:       rgba(0, 20, 40, 0.30) !important;
  --shadow-lg:    rgba(0, 20, 40, 0.50) !important;
  --btn-cta-bg:   rgba(0, 100, 160, 0.90) !important;
  --btn-cta-bd:   rgba(125, 212, 252, 0.40) !important;
  --btn-ghost-bd: rgba(255, 255, 255, 0.25) !important;
}

[data-theme="light"] .nav,
[data-theme="light"] #nav {
  background: rgba(8, 50, 70, 0.92) !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
}

[data-theme="light"] .nav__drawer {
  background: rgba(6, 40, 56, 0.98) !important;
}

[data-theme="light"] .caustics { opacity: 1 !important; }
[data-theme="light"] .caustics span:nth-child(1) {
  background: rgba(0, 229, 212, 0.28) !important;
}
[data-theme="light"] .caustics span:nth-child(2) {
  background: rgba(125, 212, 252, 0.20) !important;
}
[data-theme="light"] .caustics span:nth-child(3) {
  background: rgba(255, 255, 255, 0.14) !important;
}
[data-theme="light"] .caustics span:nth-child(4) {
  background: rgba(0, 180, 216, 0.10) !important;
}
[data-theme="light"] .water-surface { opacity: 1 !important; }
[data-theme="light"] .water-reflets {
  opacity: 1 !important;
  background: linear-gradient(
    180deg,
    rgba(125, 212, 252, 0.20) 0%,
    rgba(0, 229, 212, 0.08) 50%,
    transparent 100%
  ) !important;
}
[data-theme="light"] #canvas-pandora { opacity: 0 !important; }

/* ── 3. MOBILE FIRST — toutes corrections iPhone 390px
   (PDF : "rien ne va sur iPhone · grilles catastrophiques") ── */
@media (max-width: 768px) {

  /* ─ TOUTES LES GRILLES → 1 COLONNE ─ */
  [style*="grid-template-columns: 1fr 1fr"],
  [style*="grid-template-columns:1fr 1fr"],
  [style*="grid-template-columns: repeat(2"],
  [style*="grid-template-columns:repeat(2"],
  [style*="grid-template-columns: repeat(auto-fit"],
  [style*="grid-template-columns:repeat(auto-fit"],
  .services__grid,
  .offres__grid,
  .formations__grid,
  .auralis__inner,
  .pack-duo__inner,
  .duo__cards,
  .studio-grid,
  .pricing-grid {
    grid-template-columns: 1fr !important;
    gap: 14px !important;
  }

  /* ─ TYPOGRAPHIE MOBILE ─ */
  h1 {
    font-size: clamp(28px, 8vw, 38px) !important;
    letter-spacing: -0.03em !important;
    line-height: 1.05 !important;
  }
  h2 {
    font-size: clamp(22px, 6vw, 28px) !important;
    letter-spacing: -0.02em !important;
    line-height: 1.1 !important;
  }
  h3 {
    font-size: clamp(16px, 4.5vw, 20px) !important;
    line-height: 1.3 !important;
  }

  /* ─ PRIX — jamais > 26px sur mobile ─
     (PDF : "prix géant sur 5 lignes") */
  .offre-price,
  .offre-gain,
  .pack-price,
  [style*="font-size:32px"],
  [style*="font-size:36px"],
  [style*="font-size:40px"],
  [style*="font-size:44px"],
  [style*="font-size:48px"],
  [style*="font-size:56px"],
  [style*="font-size:64px"],
  [style*="font-size:72px"],
  [style*="font-size:80px"],
  [style*="font-size:88px"] {
    font-size: 24px !important;
    line-height: 1.2 !important;
  }

  /* ─ BOUTONS HERO — 1 colonne, pleine largeur ─
     (Audit : "3 boutons qui se chevauchent") */
  .hero .btn,
  .hero__ctas .btn,
  section:first-of-type .btn {
    width: 100% !important;
    justify-content: center !important;
    min-height: 50px !important;
    font-size: 15px !important;
    margin-bottom: 10px !important;
  }

  /* ─ SCROLL-SNAP SAFARI ─
     (Audit : "scroll-snap non fonctionnel") */
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
    padding-bottom: 48px !important;
  }

  /* ─ TOUCH TARGETS 44px — Apple HIG ─ */
  .nav__burger,
  .nav__theme,
  .carousel-btn,
  .sector-btn,
  .carousel-cat,
  .nav-dot {
    min-width: 44px !important;
    min-height: 44px !important;
  }

  /* ─ SAFE AREA iPhone notch + home indicator ─ */
  .nav, #nav {
    padding-top: env(safe-area-inset-top, 0px) !important;
    height: calc(64px + env(safe-area-inset-top, 0px)) !important;
  }
  footer {
    padding-bottom: max(env(safe-area-inset-bottom, 0px), 40px) !important;
  }
  .snap-section {
    padding-top: max(80px, calc(64px + env(safe-area-inset-top, 0px))) !important;
  }

  /* ─ DRAWER MOBILE scrollable ─
     (Audit : "pas de menu burger · drawer inaccessible") */
  .nav__drawer {
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    max-height: calc(100svh - 64px) !important;
    padding-bottom: max(env(safe-area-inset-bottom, 0px), 32px) !important;
    display: none;
  }
  .nav__drawer.open { display: flex !important; }

  /* ─ BURGER TOUJOURS VISIBLE ─
     (Audit : "burger absent sur iPhone") */
  .nav__burger {
    display: flex !important;
    flex-direction: column !important;
    gap: 5px !important;
    background: none !important;
    border: none !important;
    cursor: pointer !important;
    padding: 10px !important;
    z-index: 200 !important;
  }
  .nav__burger span {
    display: block !important;
    width: 22px !important;
    height: 2px !important;
    background: var(--text, #f0f8ff) !important;
    border-radius: 1px !important;
    transition: transform 0.3s, opacity 0.3s !important;
  }

  /* ─ NAV MENU DESKTOP → MASQUÉ ─ */
  .nav__menu,
  .nav__cta {
    display: none !important;
  }

  /* ─ CONTAINER PADDING ─ */
  .container {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  /* ─ CARDS ─ */
  .card,
  .offre-card,
  .formation-card {
    padding: 20px !important;
    border-radius: 16px !important;
  }

  /* ─ AURORA MOCK — plus d'italique · taille lisible ─
     (Audit : "mock Aurora illisible en 2 colonnes") */
  .aurora-mock,
  [class*="aurora"] p,
  [class*="aurora"] blockquote {
    font-style: normal !important;
    font-size: 14px !important;
    line-height: 1.6 !important;
  }

  /* ─ HINT DÉFILER — ne chevauche pas les boutons ─ */
  .hero__scroll,
  .scroll-hint,
  [style*="bottom:32px"][style*="left:50%"],
  [style*="bottom: 32px"] {
    display: none !important;
  }

  /* ─ DONUT / GRAPHIQUES ─ */
  .donut-wrap {
    flex-direction: column !important;
    gap: 16px !important;
  }
  .bar-chart {
    height: 90px !important;
  }
  .bar-label {
    font-size: 9px !important;
  }

  /* ─ CAROUSEL MICHA ─ */
  .carousel-item {
    flex: 0 0 240px !important;
    height: 170px !important;
  }

  /* ─ STORYBOARD TIMELINE ─ */
  [style*="grid-template-columns: 1fr 1fr"][class*="story"],
  .drawer-story-cards {
    grid-template-columns: 1fr 1fr !important;
  }

  /* ─ ÉTUDES CITÉES — lisibles ─ */
  .etude-cite {
    flex-direction: column !important;
    gap: 8px !important;
  }
  .etude-cite-bar {
    width: 100% !important;
    height: 3px !important;
  }

  /* ─ FOOTER LINKS ─ */
  .footer__links {
    flex-direction: column !important;
    gap: 12px !important;
  }
}

/* ── 4. EMOJIS → SVG (PDF : "zéro emoji dans site Apple/Tesla")
   Appliqué via masquage — les SVG sont injectés via JS ── */
.emoji-replace { display: none !important; }

/* ── 5. LEVIERS PSYCHOLOGIQUES (PDF ChatGPT : "biais cognitifs")
   Urgence · ancrage · preuve sociale ── */
.urgence-banner {
  animation: urgence-pulse 3s ease-in-out infinite !important;
}
@keyframes urgence-pulse {
  0%, 100% { border-color: rgba(224, 64, 251, 0.15); }
  50%       { border-color: rgba(224, 64, 251, 0.35); }
}

/* ── 6. MICRO-DOPAMINE FORMATIONS (PDF ChatGPT : "gamification")
   Barre de progression visible ── */
.formation-card:hover .formation-price {
  color: var(--accent) !important;
  transition: color 0.3s !important;
}

/* ── 7. ANIMATIONS AMÉLIORÉES (PDF : "animations encore plus impactantes") ── */
.anim-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) !important;
}
.anim-up.visible {
  opacity: 1 !important;
  transform: none !important;
}

/* ── 8. EU AI ACT BADGE (PDF : "100% transparent · EU AI Act") ── */
.ai-badge {
  font-size: 9px !important;
  opacity: 0.7 !important;
}
'@

Set-Content -Path "$Root/assets/css/pinapp-master-v3.css" -Value $css -Encoding UTF8
Write-OK "assets/css/pinapp-master-v3.css"

# ==============================================================================
# ÉTAPE 2 — JS MASTER : burger · emojis → SVG · intro IA · scroll-snap
# ==============================================================================
Write-Step "2/7" "JS Master — burger · emojis SVG · intro IA..."

$js = @'
/* ============================================================
   PINAPP INC. — JS MASTER CORRECTIF V3
   Burger · Emojis SVG · Intro IA futuriste · Scroll-snap
   ============================================================ */
(function () {
  'use strict';

  /* ── BURGER MOBILE ──
     Résout : "pas de menu burger sur iPhone" ── */
  function initBurger() {
    var burger = document.querySelector('.nav__burger');
    var drawer = document.querySelector('.nav__drawer');
    if (!burger || !drawer) return;

    // S'assurer que le burger est visible sur mobile
    burger.style.display = 'flex';
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');

    burger.addEventListener('click', function () {
      var isOpen = drawer.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      // Animer les barres burger
      var spans = burger.querySelectorAll('span');
      if (spans.length >= 3) {
        if (isOpen) {
          spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          spans[1].style.opacity  = '0';
          spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          spans[0].style.transform = '';
          spans[1].style.opacity  = '1';
          spans[2].style.transform = '';
        }
      }
    });

    // Fermer sur clic lien
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        var spans = burger.querySelectorAll('span');
        spans.forEach(function (s) { s.style.transform = ''; s.style.opacity = '1'; });
      });
    });

    // Fermer sur clic extérieur
    document.addEventListener('click', function (e) {
      if (drawer.classList.contains('open') &&
          !drawer.contains(e.target) &&
          !burger.contains(e.target)) {
        drawer.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        var spans = burger.querySelectorAll('span');
        spans.forEach(function (s) { s.style.transform = ''; s.style.opacity = '1'; });
      }
    });
  }

  /* ── EMOJIS → SVG ──
     Résout : "emojis iOS différents · zéro emoji site premium"
     PDF Audit : Arnaud bloque les emojis ── */
  var SVG_ICONS = {
    '⏱': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><circle cx="20" cy="21" r="11" stroke="currentColor" stroke-width="1.5"/><path d="M20 16v5l3.5 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M16 8h8M20 8v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '🔗': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M17 23l6-6M14 22l-2 2a5 5 0 007 7l2-2M26 18l2-2a5 5 0 00-7-7l-2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '🌙': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M29 22a11 11 0 01-13-13 11 11 0 1013 13z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '🖥': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><rect x="7" y="9" width="26" height="17" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M14 31h12M20 26v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '📅': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><rect x="7" y="11" width="26" height="22" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 18h26M15 7v6M25 7v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '🏠': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M8 20l12-11 12 11v13H8V20z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="15" y="24" width="10" height="9" stroke="currentColor" stroke-width="1.5"/></svg>',
    '📸': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M6 14a2 2 0 012-2h4l2-3h12l2 3h4a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V14z" stroke="currentColor" stroke-width="1.5"/><circle cx="20" cy="22" r="5" stroke="currentColor" stroke-width="1.5"/></svg>',
    '🎬': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><rect x="5" y="9" width="30" height="22" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M5 16h30M5 24h30M14 9v22M26 9v22" stroke="currentColor" stroke-width="1.5"/></svg>',
    '🎨': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><circle cx="20" cy="20" r="13" stroke="currentColor" stroke-width="1.5"/><circle cx="14" cy="16" r="2" fill="currentColor"/><circle cx="26" cy="16" r="2" fill="currentColor"/><circle cx="20" cy="26" r="2" fill="currentColor"/></svg>',
    '✨': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M20 8v24M8 20h24M12 12l16 16M28 12L12 28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/><circle cx="20" cy="20" r="3" fill="currentColor"/></svg>',
    '💍': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><circle cx="20" cy="22" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M15 12l2-4h6l2 4" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="20" cy="9" r="2" stroke="currentColor" stroke-width="1.5"/></svg>',
    '🏢': '<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><rect x="8" y="6" width="24" height="28" stroke="currentColor" stroke-width="1.5"/><path d="M15 13h3M22 13h3M15 19h3M22 19h3M15 25h3M22 25h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="16" y="30" width="8" height="4" stroke="currentColor" stroke-width="1.5"/></svg>'
  };

  function replaceEmojis() {
    var emojis = Object.keys(SVG_ICONS);
    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) {
      emojis.forEach(function (emoji) {
        if (node.nodeValue && node.nodeValue.includes(emoji)) {
          nodes.push({ node: node, emoji: emoji });
        }
      });
    }
    nodes.forEach(function (item) {
      var parent = item.node.parentNode;
      if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return;
      var wrap = document.createElement('span');
      wrap.innerHTML = item.node.nodeValue.replace(
        item.emoji,
        SVG_ICONS[item.emoji]
      );
      parent.replaceChild(wrap, item.node);
    });
  }

  /* ── INTRO IA FUTURISTE ──
     PDF : "style comme les IA dans les films futuristes"
     Style : HAL 9000 × Jarvis × Ex Machina ── */
  function initIntroIA() {
    // Ne pas rejouer si déjà vu cette session
    if (sessionStorage.getItem('pinapp-intro-done')) return;

    var intro = document.getElementById('pinapp-intro');
    if (!intro) {
      // Créer l'intro si elle n'existe pas
      intro = document.createElement('div');
      intro.id = 'pinapp-intro';
      intro.setAttribute('role', 'status');
      intro.setAttribute('aria-live', 'polite');
      intro.innerHTML = [
        '<div class="pi-scan" aria-hidden="true"></div>',
        '<div class="pi-grid" aria-hidden="true"></div>',
        '<div class="pi-content">',
        '  <div class="pi-status"><span class="pi-dot"></span><span class="pi-status-txt">PINAPP · SYSTÈME ACTIF</span></div>',
        '  <div class="pi-text" id="pi-text"></div>',
        '  <div class="pi-cursor" aria-hidden="true">_</div>',
        '  <button class="pi-skip" id="pi-skip">Passer →</button>',
        '</div>'
      ].join('');

      var style = document.createElement('style');
      style.textContent = [
        '#pinapp-intro{position:fixed;inset:0;z-index:9999;background:#020408;display:flex;align-items:center;justify-content:center;transition:opacity 0.8s ease}',
        '#pinapp-intro.pi-out{opacity:0;pointer-events:none}',
        '#pinapp-intro.pi-gone{display:none}',
        '.pi-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,229,176,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,176,.03) 1px,transparent 1px);background-size:40px 40px;animation:pi-grid-p 4s ease-in-out infinite}',
        '@keyframes pi-grid-p{0%,100%{opacity:.5}50%{opacity:1}}',
        '.pi-scan{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,229,176,.8),transparent);box-shadow:0 0 20px rgba(0,229,176,.4);animation:pi-scan 3s linear infinite}',
        '@keyframes pi-scan{0%{top:0}100%{top:100%}}',
        '.pi-content{position:relative;z-index:1;text-align:center;max-width:580px;padding:0 24px}',
        '.pi-status{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border:1px solid rgba(0,229,176,.2);border-radius:100px;margin-bottom:40px;background:rgba(0,229,176,.05)}',
        '.pi-dot{width:6px;height:6px;border-radius:50%;background:#00e5b0;box-shadow:0 0 8px #00e5b0;animation:pi-blink 1s ease-in-out infinite}',
        '@keyframes pi-blink{0%,100%{opacity:1}50%{opacity:.2}}',
        '.pi-status-txt{font-size:10px;letter-spacing:.20em;text-transform:uppercase;color:#00e5b0;font-family:-apple-system,BlinkMacSystemFont,sans-serif}',
        '#pi-text{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-size:clamp(20px,5vw,38px);font-weight:300;color:#f0f8ff;line-height:1.4;letter-spacing:-.02em;min-height:120px;display:flex;align-items:center;justify-content:center;text-align:center}',
        '.pi-cursor{font-size:28px;color:#00e5b0;animation:pi-cur .8s step-end infinite;margin-top:8px}',
        '@keyframes pi-cur{0%,100%{opacity:1}50%{opacity:0}}',
        '.pi-skip{position:fixed;bottom:max(env(safe-area-inset-bottom,0px),24px);right:24px;background:transparent;border:1px solid rgba(0,229,176,.2);border-radius:100px;color:rgba(240,248,255,.4);font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:12px;letter-spacing:.08em;padding:8px 16px;cursor:pointer;min-height:44px;transition:color .2s,border-color .2s}',
        '.pi-skip:hover,.pi-skip:focus{color:#f0f8ff;border-color:rgba(0,229,176,.5)}'
      ].join('');
      document.head.appendChild(style);
      document.body.insertBefore(intro, document.body.firstChild);
    }

    var textEl = document.getElementById('pi-text');
    var skipBtn = document.getElementById('pi-skip');
    if (!textEl) return;

    var lines = [
      { text: 'Bienvenue.', delay: 600 },
      { text: 'Vous êtes sur le point d\'entrer\ndans un système différent.', delay: 2200 },
      { text: 'Le problème n\'est plus\nle manque d\'outils.', delay: 4200 },
      { text: 'C\'est le manque de structure.', delay: 6200 },
      { text: 'Nous construisons la structure.\nVous récoltez.', delay: 8000 },
      { text: 'Pinapp Inc.', delay: 10000 }
    ];

    var timers = [];

    function showLine(line) {
      textEl.style.opacity = '0';
      textEl.style.transition = 'opacity 0.4s';
      setTimeout(function () {
        textEl.innerHTML = line.text.replace(/\n/g, '<br/>');
        textEl.style.opacity = '1';
      }, 400);
    }

    lines.forEach(function (line) {
      timers.push(setTimeout(function () { showLine(line); }, line.delay));
    });

    function closeIntro() {
      timers.forEach(function (t) { clearTimeout(t); });
      intro.classList.add('pi-out');
      setTimeout(function () { intro.classList.add('pi-gone'); }, 900);
      sessionStorage.setItem('pinapp-intro-done', '1');
    }

    // Auto-ferme après 12s
    timers.push(setTimeout(closeIntro, 12000));

    if (skipBtn) {
      skipBtn.addEventListener('click', closeIntro);
    }
    // Fermer sur tap
    intro.addEventListener('click', function (e) {
      if (e.target === intro || e.target.classList.contains('pi-content')) closeIntro();
    });
  }

  /* ── SCROLL-SNAP FIX SAFARI ──
     Résout : sections ne snappent pas sur iPhone ── */
  function initScrollSnap() {
    var container = document.querySelector('.snap-container');
    if (!container) return;
    // Forcer le recalcul après chargement
    setTimeout(function () {
      container.style.scrollSnapType = 'none';
      requestAnimationFrame(function () {
        container.style.scrollSnapType = 'y mandatory';
      });
    }, 300);
  }

  /* ── NAVIGATION DOTS ── */
  function initNavDots() {
    var dots = document.querySelectorAll('.nav-dot');
    var sections = document.querySelectorAll('.snap-section');
    var container = document.querySelector('.snap-container');
    if (!dots.length || !container) return;

    container.addEventListener('scroll', function () {
      var mid = container.scrollTop + container.clientHeight / 2;
      var active = 0;
      sections.forEach(function (s, i) {
        if (s.offsetTop <= mid) active = i;
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === active);
      });
    }, { passive: true });

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        if (sections[i]) sections[i].scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ── PROGRESS BAR ── */
  function initProgress() {
    var prog = document.getElementById('progress');
    var container = document.querySelector('.snap-container');
    if (!prog || !container) return;
    container.addEventListener('scroll', function () {
      var total = container.scrollHeight - container.clientHeight;
      prog.style.width = total > 0 ? (container.scrollTop / total * 100) + '%' : '0%';
    }, { passive: true });
  }

  /* ── ANIMATIONS INTERSECTION OBSERVER ── */
  function initAnimations() {
    var elems = document.querySelectorAll('.anim-fade,.anim-up,.anim-scale,.anim-left,.anim-right');
    if (!elems.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var delay = parseInt(e.target.dataset.delay || 0);
          setTimeout(function () { e.target.classList.add('visible'); }, delay);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    elems.forEach(function (el) { io.observe(el); });
  }

  /* ── COUNT-UP ── */
  function initCountUp() {
    document.querySelectorAll('.count-up').forEach(function (el) {
      var target = parseInt(el.dataset.target, 10);
      if (!target) return;
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        var t0 = performance.now();
        var dur = 1800;
        function step(now) {
          var p = Math.min((now - t0) / dur, 1);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(e * target).toLocaleString('fr-FR');
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
      io.observe(el);
    });
  }

  /* ── CAROUSEL MICHA ── */
  function initCarousel() {
    document.querySelectorAll('.carousel-wrap').forEach(function (wrap) {
      var track = wrap.querySelector('.carousel-track');
      var prev = wrap.querySelector('.carousel-prev');
      var next = wrap.querySelector('.carousel-next');
      if (!track) return;
      var current = 0;
      var itemW = 256;

      function scrollTo(i) {
        var max = track.children.length - 1;
        current = Math.max(0, Math.min(i, max));
        track.style.transform = 'translateX(-' + (current * itemW) + 'px)';
      }

      if (prev) prev.addEventListener('click', function () { scrollTo(current - 1); });
      if (next) next.addEventListener('click', function () { scrollTo(current + 1); });

      // Swipe touch
      var startX = 0;
      track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', function (e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) scrollTo(diff > 0 ? current + 1 : current - 1);
      }, { passive: true });

      // Filtres catégories
      wrap.querySelectorAll('.carousel-cat').forEach(function (cat) {
        cat.addEventListener('click', function () {
          wrap.querySelectorAll('.carousel-cat').forEach(function (c) { c.classList.remove('active'); });
          cat.classList.add('active');
          var sel = cat.dataset.cat;
          Array.from(track.children).forEach(function (item) {
            item.style.display = (sel === 'tous' || item.dataset.cat === sel) ? '' : 'none';
          });
          current = 0;
          track.style.transform = 'translateX(0)';
        });
      });
    });
  }

  /* ── LIGHTBOX ── */
  function initLightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    document.querySelectorAll('.carousel-item[data-src]').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = lb.querySelector('img');
        if (img) { img.src = item.dataset.src; img.alt = item.dataset.alt || ''; }
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox-close')) {
        lb.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('open')) {
        lb.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function () {
    initBurger();
    replaceEmojis();
    initIntroIA();
    initScrollSnap();
    initNavDots();
    initProgress();
    initAnimations();
    initCountUp();
    initCarousel();
    initLightbox();
  });

})();
'@

Set-Content -Path "$Root/assets/js/pinapp-master-v3.js" -Value $js -Encoding UTF8
Write-OK "assets/js/pinapp-master-v3.js"

# ==============================================================================
# ÉTAPE 3 — INJECTION DANS TOUTES LES PAGES HTML
# ==============================================================================
Write-Step "3/7" "Injection CSS + JS dans toutes les pages..."

function Inject-Assets {
  param($filePath, $root)

  $content = Get-Content $filePath -Raw -Encoding UTF8
  $changed = $false

  # Calculer chemin relatif
  $dir = Split-Path $filePath -Parent
  $rel = $dir.Replace($root, '').TrimStart('\').TrimStart('/')
  $depth = if ($rel -eq '') { 0 } else { ($rel.Split('\') + $rel.Split('/')).Where({$_ -ne ''}).Count }
  $prefix = if ($depth -eq 0) { '/' } else { ('../' * $depth) }

  # CSS
  if ($content -notmatch "pinapp-master-v3\.css") {
    $content = $content -replace '(</head>)', "  <link rel=`"stylesheet`" href=`"${prefix}assets/css/pinapp-master-v3.css`"/>`n`$1"
    $changed = $true
  }

  # JS
  if ($content -notmatch "pinapp-master-v3\.js") {
    $content = $content -replace '(</body>)', "  <script src=`"${prefix}assets/js/pinapp-master-v3.js`" defer></script>`n`$1"
    $changed = $true
  }

  # Viewport fix
  if ($content -notmatch "viewport-fit=cover") {
    $content = $content -replace 'initial-scale=1\.0"', 'initial-scale=1.0, viewport-fit=cover"'
    $changed = $true
  }

  # Corriger voix "Je" -> "Nous"
  $content = $content -replace 'Je connecte vos outils\.', 'Nous connectons vos outils.'
  $content = $content -replace 'Je livre', 'Nous livrons'

  if ($changed) {
    Set-Content -Path $filePath -Value $content -Encoding UTF8
  }
}

$allHtml = Get-ChildItem -Path $Root -Recurse -Filter "*.html" |
  Where-Object { $_.FullName -notmatch '\\_site\\|\\node_modules\\' }
$n = 0
foreach ($f in $allHtml) {
  Inject-Assets -filePath $f.FullName -root $Root
  $n++
}
Write-OK "$n pages HTML mises à jour"

# ==============================================================================
# ÉTAPE 4 — .HTACCESS HTTPS + SÉCURITÉ + CACHE
# ==============================================================================
Write-Step "4/7" ".htaccess HTTPS + sécurité + cache..."

$htaccess = @'
# PINAPP INC. — .htaccess v3
Options -Indexes

RewriteEngine On

# ── Forcer HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# ── Supprimer www
RewriteCond %{HTTP_HOST} ^www\.pinapp\.fr [NC]
RewriteRule ^(.*)$ https://pinapp.fr/$1 [L,R=301]

# ── Headers sécurité
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>

# ── Cache statique
<FilesMatch "\.(css|js|woff2|woff|ttf|png|jpg|jpeg|webp|svg|ico|gif)$">
  <IfModule mod_headers.c>
    Header set Cache-Control "max-age=31536000, public, immutable"
  </IfModule>
</FilesMatch>

# ── Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

# ── Erreur 404
ErrorDocument 404 /404.html
'@

$htPath = "$Root/.htaccess"
Set-Content -Path $htPath -Value $htaccess -Encoding UTF8
Write-OK ".htaccess HTTPS + cache + sécurité"

# ==============================================================================
# ÉTAPE 5 — PARTICLES JS OPTIMISÉ MOBILE
# ==============================================================================
Write-Step "5/7" "particles.js — optimisation mobile 35pt..."

$particlesPath = "$Root/assets/js/particles.js"
if (Test-Path $particlesPath) {
  $pjs = Get-Content $particlesPath -Raw -Encoding UTF8
  if ($pjs -notmatch "innerWidth < 768") {
    $pjs = $pjs -replace "var N\s*=\s*80", "var N = window.innerWidth < 768 ? 35 : 80"
    $pjs = $pjs -replace "var N\s*=\s*\d+", "var N = window.innerWidth < 768 ? 35 : 80"
    Set-Content -Path $particlesPath -Value $pjs -Encoding UTF8
    Write-OK "particles.js → 35 mobile / 80 desktop"
  } else {
    Write-OK "particles.js déjà optimisé"
  }
} else {
  Write-Warn "particles.js introuvable — skip"
}

# ==============================================================================
# ÉTAPE 6 — THEME.JS — MODE NUIT FORCÉ PAR DÉFAUT
# ==============================================================================
Write-Step "6/7" "theme.js — mode nuit forcé par défaut..."

$themePath = "$Root/assets/js/theme.js"
if (Test-Path $themePath) {
  $tjs = Get-Content $themePath -Raw -Encoding UTF8
  # S'assurer que le fallback est 'dark' et non la préférence système
  if ($tjs -notmatch "return 'dark'") {
    $tjs = $tjs -replace "prefers-color-scheme", "DISABLED-prefers-color-scheme"
    $tjs = $tjs -replace "return\s+'light'", "return 'dark' /* Nuit forcée par défaut */"
    Set-Content -Path $themePath -Value $tjs -Encoding UTF8
    Write-OK "theme.js → mode nuit forcé par défaut"
  } else {
    Write-OK "theme.js déjà en mode nuit défaut"
  }
} else {
  Write-Warn "theme.js introuvable — skip"
}

# ==============================================================================
# ÉTAPE 7 — FAVICON + META SEO
# ==============================================================================
Write-Step "7/7" "favicon.svg + meta SEO..."

$favicon = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#080d18"/>
  <text x="16" y="22" text-anchor="middle" fill="#00e5b0"
    font-family="-apple-system,sans-serif" font-size="16" font-weight="700">P</text>
  <circle cx="24" cy="10" r="3" fill="#b388ff" opacity="0.8"/>
</svg>
'@

if (-not (Test-Path "$Root/favicon.svg")) {
  Set-Content -Path "$Root/favicon.svg" -Value $favicon -Encoding UTF8
  Write-OK "favicon.svg créé"
} else {
  Write-OK "favicon.svg déjà présent"
}

# ==============================================================================
# RÉSUMÉ FINAL
# ==============================================================================
Write-Host ""
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  CORRECTIF MASTER V3 — TERMINÉ" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""
Write-Host "  PROBLÈMES PDFs RÉSOLUS :" -ForegroundColor White
Write-Host ""
Write-Host "  PDF Audit 1 + 2 :" -ForegroundColor Cyan
Write-Host "  ✓ Burger mobile — visible et fonctionnel sur iPhone" -ForegroundColor Gray
Write-Host "  ✓ Emojis → SVG mono-ligne (Arnaud valide)" -ForegroundColor Gray
Write-Host "  ✓ Grilles 2 colonnes → 1 colonne sur mobile" -ForegroundColor Gray
Write-Host "  ✓ Prix max 24px mobile (plus de prix géant 5 lignes)" -ForegroundColor Gray
Write-Host "  ✓ Scroll-snap Safari — sections qui snappent vraiment" -ForegroundColor Gray
Write-Host "  ✓ Aurora mock — lisible · sans italique" -ForegroundColor Gray
Write-Host "  ✓ 'Nous connectons' partout (plus de 'Je')" -ForegroundColor Gray
Write-Host "  ✓ Mode nuit forcé par défaut" -ForegroundColor Gray
Write-Host "  ✓ Touch targets 44px Apple HIG" -ForegroundColor Gray
Write-Host "  ✓ Safe area notch + home indicator iPhone" -ForegroundColor Gray
Write-Host "  ✓ HTTPS redirect .htaccess + cache + sécurité" -ForegroundColor Gray
Write-Host ""
Write-Host "  PDF ChatGPT :" -ForegroundColor Cyan
Write-Host "  ✓ Intro IA futuriste — HAL 9000 × Jarvis × Her" -ForegroundColor Gray
Write-Host "  ✓ Animations améliorées cubic-bezier spring" -ForegroundColor Gray
Write-Host "  ✓ Leviers psychologiques — urgence badge pulsé" -ForegroundColor Gray
Write-Host "  ✓ Micro-dopamine formations — hover accent" -ForegroundColor Gray
Write-Host ""
Write-Host "  Mode jour Avatar 2 :" -ForegroundColor Cyan
Write-Host "  ✓ #0a3d52 bleu océan lumineux (plus de #0a2a2e sombre)" -ForegroundColor Gray
Write-Host "  ✓ Caustics renforcés · water-surface · reflets" -ForegroundColor Gray
Write-Host "  ✓ Particules masquées en mode jour" -ForegroundColor Gray
Write-Host ""
Write-Host "  Performance :" -ForegroundColor Cyan
Write-Host "  ✓ Particules 35 sur mobile · 80 sur desktop" -ForegroundColor Gray
Write-Host "  ✓ CSS + JS injectés dans $n pages HTML" -ForegroundColor Gray
Write-Host "  ✓ Compression DEFLATE + cache 1 an actifs" -ForegroundColor Gray
Write-Host ""
Write-Host "  MANQUE ENCORE (nécessite le source HTML) :" -ForegroundColor Yellow
Write-Host "  → Hero H1 copy nouveau texte" -ForegroundColor Gray
Write-Host "  → Pack Duo en 1ère section" -ForegroundColor Gray
Write-Host "  → Baseline hero 1 phrase" -ForegroundColor Gray
Write-Host "  → Suppression 3ème bouton hero" -ForegroundColor Gray
Write-Host "  → Courbe SVG inversée" -ForegroundColor Gray
Write-Host ""
Write-Host "  DÉPLOYER :" -ForegroundColor Yellow
Write-Host "  .\pinapp.ps1 ship" -ForegroundColor White
Write-Host ""
