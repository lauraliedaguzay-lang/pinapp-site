# ==============================================================================
# PINAPP INC. — SCRIPT MASTER FINAL V4
# Site complet + 8 workflows n8n + CSS/JS + .htaccess
# Sources : Audit PDF 1 + 2 + PDF ChatGPT + Screenshots iPhone
# Lancer depuis la racine : .\pinapp-master-final-v4.ps1
# ==============================================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $Root

function Write-Step { param($n,$t) Write-Host "`n▶ [$n] $t" -ForegroundColor Cyan }
function Write-OK   { param($t)    Write-Host "   ✓ $t" -ForegroundColor Gray }
function Write-Warn { param($t)    Write-Host "   ⚠ $t" -ForegroundColor Yellow }

Write-Host "`n══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  PINAPP INC. — MASTER FINAL V4" -ForegroundColor Magenta
Write-Host "  Site + 8 Workflows n8n + Toutes corrections PDFs" -ForegroundColor Magenta
Write-Host "══════════════════════════════════════════════════════`n" -ForegroundColor Magenta

# ==============================================================================
# ÉTAPE 1 — DOSSIERS
# ==============================================================================
Write-Step "1/9" "Création des dossiers..."

@(
  "assets/css","assets/js","assets/fonts","assets/images/micha",
  "assets/images/lauralie","n8n-workflows","offres/formation",
  "memoire-et-presence","a-propos","auralis","diagnostic",
  "legal","engagements","realisations"
) | ForEach-Object {
  New-Item -ItemType Directory -Force -Path "$Root/$_" | Out-Null
}
Write-OK "Tous les dossiers créés"

# ==============================================================================
# ÉTAPE 2 — CSS MASTER COMPLET
# ==============================================================================
Write-Step "2/9" "CSS Master — SF Pro + mode jour + mobile + animations..."

@"
/* ============================================================
   PINAPP INC. — CSS MASTER FINAL V4
   SF Pro · Mode jour Avatar 2 · Mobile-first · Animations
   ============================================================ */

/* ── POLICES SF PRO NATIF APPLE ── */
*, *::before, *::after {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text",
               "Helvetica Neue", "Inter", Arial, sans-serif;
}
h1,h2,h3,h4,h5,h6,
.nav__logo,.footer__brand,.offre-title,.offre-gain,
.offre-price,.formation-title,.pack-duo-badge,
.metric-num,[style*="Clash Display"] {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
               "Helvetica Neue", "Clash Display", Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
}

/* ── MODE JOUR — EAU AVATAR 2 ── */
[data-theme="light"] {
  --bg:           #0a3d52 !important;
  --bg-card:      rgba(0,180,200,0.08) !important;
  --text:         #ffffff !important;
  --text-muted:   rgba(255,255,255,0.65) !important;
  --text-soft:    rgba(255,255,255,0.35) !important;
  --accent:       #00e5d4 !important;
  --accent-2:     #7dd4fc !important;
  --accent-3:     #ffffff !important;
  --accent-4:     #00b4d8 !important;
  --nacre:        #e0f7ff !important;
  --card-border:  rgba(0,229,212,0.20) !important;
  --separator:    rgba(0,229,212,0.12) !important;
  --shadow:       rgba(0,20,40,0.30) !important;
  --btn-cta-bg:   rgba(0,100,160,0.90) !important;
  --btn-cta-bd:   rgba(125,212,252,0.40) !important;
  --btn-ghost-bd: rgba(255,255,255,0.25) !important;
}
[data-theme="light"] .nav { background: rgba(8,50,70,0.92) !important; }
[data-theme="light"] .nav__drawer { background: rgba(6,40,56,0.98) !important; }
[data-theme="light"] .caustics { opacity:1 !important; }
[data-theme="light"] .caustics span:nth-child(1) { background:rgba(0,229,212,0.28) !important; }
[data-theme="light"] .caustics span:nth-child(2) { background:rgba(125,212,252,0.20) !important; }
[data-theme="light"] .caustics span:nth-child(3) { background:rgba(255,255,255,0.14) !important; }
[data-theme="light"] .water-surface { opacity:1 !important; }
[data-theme="light"] .water-reflets {
  opacity:1 !important;
  background: linear-gradient(180deg,rgba(125,212,252,0.20) 0%,rgba(0,229,212,0.08) 50%,transparent 100%) !important;
}
[data-theme="light"] #canvas-pandora { opacity:0 !important; }

/* ── VIDEO HERO ── */
.hero-video-wrap {
  position: fixed; inset:0; z-index:0;
  overflow: hidden;
}
.hero-video-wrap video {
  width:100%; height:100%;
  object-fit: cover;
  opacity: 0.35;
}
.hero-video-wrap::after {
  content:''; position:absolute; inset:0;
  background: linear-gradient(180deg, rgba(8,13,24,0.4) 0%, rgba(8,13,24,0.8) 100%);
}

/* ── MOBILE 390px ── */
@media (max-width:768px) {

  /* Toutes grilles → 1 colonne */
  [style*="grid-template-columns: 1fr 1fr"],
  [style*="grid-template-columns:1fr 1fr"],
  [style*="grid-template-columns: repeat(2"],
  [style*="grid-template-columns:repeat(2"],
  [style*="grid-template-columns: repeat(auto-fit"] {
    grid-template-columns: 1fr !important;
    gap: 14px !important;
  }

  /* Typographie */
  h1 { font-size: clamp(28px,8vw,36px) !important; letter-spacing:-0.03em !important; line-height:1.05 !important; }
  h2 { font-size: clamp(22px,6vw,28px) !important; letter-spacing:-0.02em !important; }
  h3 { font-size: clamp(16px,4.5vw,20px) !important; }

  /* Prix max 24px */
  .offre-price,.offre-gain,.pack-price,
  [style*="font-size:32px"],[style*="font-size:36px"],
  [style*="font-size:40px"],[style*="font-size:44px"],
  [style*="font-size:48px"],[style*="font-size:56px"],
  [style*="font-size:64px"],[style*="font-size:72px"],
  [style*="font-size:80px"],[style*="font-size:88px"] {
    font-size: 24px !important; line-height:1.2 !important;
  }

  /* Boutons hero pleine largeur */
  .hero .btn, section:first-of-type .btn {
    width:100% !important; justify-content:center !important;
    min-height:50px !important; margin-bottom:10px !important;
  }

  /* Scroll-snap Safari */
  .snap-container {
    height:100svh !important; height:-webkit-fill-available !important;
    overflow-y:scroll !important; -webkit-overflow-scrolling:touch !important;
    scroll-snap-type:y mandatory !important; overscroll-behavior-y:contain !important;
  }
  .snap-section {
    min-height:100svh !important; min-height:-webkit-fill-available !important;
    scroll-snap-align:start !important; scroll-snap-stop:always !important;
    padding-top: max(80px, calc(64px + env(safe-area-inset-top,0px))) !important;
    padding-bottom:48px !important;
  }

  /* Touch targets 44px */
  .nav__burger,.nav__theme,.carousel-btn { min-width:44px !important; min-height:44px !important; }

  /* Safe area */
  .nav { padding-top:env(safe-area-inset-top,0px) !important; height:calc(64px + env(safe-area-inset-top,0px)) !important; }
  footer { padding-bottom:max(env(safe-area-inset-bottom,0px),40px) !important; }

  /* Burger TOUJOURS visible */
  .nav__burger { display:flex !important; }
  .nav__menu, .nav__cta { display:none !important; }

  /* Drawer scrollable */
  .nav__drawer {
    overflow-y:auto !important; -webkit-overflow-scrolling:touch !important;
    max-height:calc(100svh - 64px) !important;
    padding-bottom:max(env(safe-area-inset-bottom,0px),32px) !important;
    display:none !important;
  }
  .nav__drawer.open { display:flex !important; }

  /* Container */
  .container { padding-left:16px !important; padding-right:16px !important; }

  /* Cards */
  .card,.offre-card,.formation-card { padding:20px !important; }

  /* Aurora lisible */
  .aurora-mock p,[class*="aurora"] p { font-style:normal !important; font-size:14px !important; line-height:1.6 !important; }

  /* Défiler masqué */
  .hero__scroll,.scroll-hint { display:none !important; }

  /* Graphiques */
  .donut-wrap { flex-direction:column !important; gap:16px !important; }
  .bar-chart { height:90px !important; }
}
"@ | Set-Content -Path "$Root/assets/css/pinapp-master-v4.css" -Encoding UTF8
Write-OK "assets/css/pinapp-master-v4.css"

# ==============================================================================
# ÉTAPE 3 — JS MASTER : burger + emojis SVG + intro IA
# ==============================================================================
Write-Step "3/9" "JS Master — burger + emojis SVG + intro IA + animations..."

@'
/* PINAPP INC. — JS MASTER FINAL V4 */
(function(){
'use strict';

/* ── BURGER ── */
function initBurger(){
  var b=document.querySelector('.nav__burger');
  var d=document.querySelector('.nav__drawer');
  if(!b||!d)return;
  b.style.display='flex';
  function open(v){
    d.classList.toggle('open',v);
    b.classList.toggle('open',v);
    b.setAttribute('aria-expanded',v);
    document.body.style.overflow=v?'hidden':'';
    var s=b.querySelectorAll('span');
    if(v){
      s[0]&&(s[0].style.transform='rotate(45deg) translate(5px,5px)');
      s[1]&&(s[1].style.opacity='0');
      s[2]&&(s[2].style.transform='rotate(-45deg) translate(5px,-5px)');
    } else {
      [s[0],s[1],s[2]].forEach(function(x){if(x){x.style.transform='';x.style.opacity='1';}});
    }
  }
  b.addEventListener('click',function(){open(!d.classList.contains('open'));});
  d.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){open(false);});});
  document.addEventListener('click',function(e){
    if(d.classList.contains('open')&&!d.contains(e.target)&&!b.contains(e.target))open(false);
  });
}

/* ── EMOJIS → SVG ── */
var SVGS={
  '⏱':'<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><circle cx="20" cy="22" r="11" stroke="currentColor" stroke-width="1.5"/><path d="M20 17v5l3.5 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M16 9h8M20 9v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  '🔗':'<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M17 23l6-6M14 22l-2 2a5 5 0 007 7l2-2M26 18l2-2a5 5 0 00-7-7l-2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  '🌙':'<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M29 22a11 11 0 01-13-13 11 11 0 1013 13z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  '🖥':'<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><rect x="7" y="9" width="26" height="17" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M14 31h12M20 26v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  '📅':'<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><rect x="7" y="11" width="26" height="22" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 18h26M15 7v6M25 7v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  '🏠':'<svg viewBox="0 0 40 40" fill="none" class="icon-svg" aria-hidden="true"><path d="M8 20l12-11 12 11v13H8V20z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="15" y="24" width="10" height="9" stroke="currentColor" stroke-width="1.5"/></svg>'
};
function replaceEmojis(){
  Object.keys(SVGS).forEach(function(e){
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    var nodes=[];var n;
    while((n=w.nextNode()))if(n.nodeValue&&n.nodeValue.includes(e))nodes.push(n);
    nodes.forEach(function(n){
      var p=n.parentNode;
      if(!p||p.tagName==='SCRIPT'||p.tagName==='STYLE')return;
      var s=document.createElement('span');
      s.innerHTML=n.nodeValue.replace(e,SVGS[e]);
      p.replaceChild(s,n);
    });
  });
}

/* ── INTRO IA ── */
function initIntroIA(){
  if(sessionStorage.getItem('p-intro'))return;
  var st=document.createElement('style');
  st.textContent='#pi{position:fixed;inset:0;z-index:9999;background:#020408;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:opacity .8s}#pi.out{opacity:0;pointer-events:none}#pi.gone{display:none}.pi-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,229,176,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,176,.03) 1px,transparent 1px);background-size:40px 40px}.pi-scan{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,229,176,.8),transparent);box-shadow:0 0 20px rgba(0,229,176,.4);animation:scan 3s linear infinite}@keyframes scan{0%{top:0}100%{top:100%}}.pi-cnt{position:relative;z-index:1;text-align:center;max-width:540px;padding:0 24px}.pi-badge{display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border:1px solid rgba(0,229,176,.2);border-radius:100px;margin-bottom:40px;background:rgba(0,229,176,.05);font-size:10px;letter-spacing:.20em;text-transform:uppercase;color:#00e5b0;font-family:-apple-system,sans-serif}.pi-dot{width:6px;height:6px;border-radius:50%;background:#00e5b0;box-shadow:0 0 8px #00e5b0;animation:pd 1s ease-in-out infinite}@keyframes pd{0%,100%{opacity:1}50%{opacity:.2}}#pi-txt{font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:clamp(20px,5vw,36px);font-weight:300;color:#f0f8ff;line-height:1.4;letter-spacing:-.02em;min-height:110px;display:flex;align-items:center;justify-content:center}.pi-cur{font-size:28px;color:#00e5b0;animation:pc .8s step-end infinite;margin-top:8px}@keyframes pc{0%,100%{opacity:1}50%{opacity:0}}.pi-skip{position:fixed;bottom:max(env(safe-area-inset-bottom,0px),24px);right:24px;background:transparent;border:1px solid rgba(0,229,176,.2);border-radius:100px;color:rgba(240,248,255,.4);font-family:-apple-system,sans-serif;font-size:12px;letter-spacing:.08em;padding:8px 16px;cursor:pointer;min-height:44px;transition:color .2s,border-color .2s}.pi-skip:hover{color:#f0f8ff;border-color:rgba(0,229,176,.5)}';
  document.head.appendChild(st);
  var el=document.createElement('div');el.id='pi';
  el.innerHTML='<div class="pi-grid" aria-hidden="true"></div><div class="pi-scan" aria-hidden="true"></div><div class="pi-cnt"><div class="pi-badge"><span class="pi-dot"></span>PINAPP · SYSTÈME ACTIF</div><div id="pi-txt"></div><div class="pi-cur" aria-hidden="true">_</div></div><button class="pi-skip" id="pi-skip">Passer →</button>';
  document.body.insertBefore(el,document.body.firstChild);
  var txt=document.getElementById('pi-txt');
  var lines=[
    {t:'Bienvenue.',d:600},
    {t:'Vous êtes sur le point d\'entrer<br/>dans un système différent.',d:2200},
    {t:'Le problème n\'est plus<br/>le manque d\'outils.',d:4400},
    {t:'C\'est le manque de structure.',d:6400},
    {t:'Nous construisons la structure.<br/>Vous récoltez.',d:8200},
    {t:'Pinapp Inc.',d:10000}
  ];
  var timers=[];
  function show(l){txt.style.opacity='0';txt.style.transition='opacity .4s';setTimeout(function(){txt.innerHTML=l.t;txt.style.opacity='1';},400);}
  lines.forEach(function(l){timers.push(setTimeout(function(){show(l);},l.d));});
  function close(){timers.forEach(clearTimeout);el.classList.add('out');setTimeout(function(){el.classList.add('gone');},900);sessionStorage.setItem('p-intro','1');}
  timers.push(setTimeout(close,12000));
  document.getElementById('pi-skip').addEventListener('click',close);
}

/* ── SCROLL-SNAP FIX ── */
function fixSnap(){
  var c=document.querySelector('.snap-container');
  if(!c)return;
  setTimeout(function(){c.style.scrollSnapType='none';requestAnimationFrame(function(){c.style.scrollSnapType='y mandatory';});},300);
}

/* ── ANIMATIONS ── */
function initAnim(){
  var els=document.querySelectorAll('.anim-fade,.anim-up,.anim-scale,.anim-left,.anim-right');
  if(!els.length)return;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        setTimeout(function(){e.target.classList.add('visible');},parseInt(e.target.dataset.delay||0));
        io.unobserve(e.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(el){io.observe(el);});
}

/* ── COUNT-UP ── */
function initCountUp(){
  document.querySelectorAll('.count-up').forEach(function(el){
    var t=parseInt(el.dataset.target,10);if(!t)return;
    var io=new IntersectionObserver(function(entries){
      if(!entries[0].isIntersecting)return;io.disconnect();
      var t0=performance.now(),dur=1800;
      (function step(now){var p=Math.min((now-t0)/dur,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(e*t).toLocaleString('fr-FR');if(p<1)requestAnimationFrame(step);})(t0);
    });io.observe(el);
  });
}

/* ── PROGRESS + NAV HIDE ── */
function initNav(){
  var prog=document.getElementById('progress');
  var nav=document.querySelector('.nav');
  var c=document.querySelector('.snap-container');
  if(!c)return;
  var last=0;
  c.addEventListener('scroll',function(){
    var y=c.scrollTop,h=c.scrollHeight-c.clientHeight;
    if(prog)prog.style.width=h>0?(y/h*100)+'%':'0%';
    if(nav){nav.classList.toggle('hidden',y>last&&y>80);last=y;}
  },{passive:true});
}

/* ── NAV DOTS ── */
function initDots(){
  var dots=document.querySelectorAll('.nav-dot');
  var sects=document.querySelectorAll('.snap-section');
  var c=document.querySelector('.snap-container');
  if(!dots.length||!c)return;
  c.addEventListener('scroll',function(){
    var mid=c.scrollTop+c.clientHeight/2,act=0;
    sects.forEach(function(s,i){if(s.offsetTop<=mid)act=i;});
    dots.forEach(function(d,i){d.classList.toggle('active',i===act);});
  },{passive:true});
  dots.forEach(function(d,i){d.addEventListener('click',function(){sects[i]&&sects[i].scrollIntoView({behavior:'smooth'});});});
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded',function(){
  initBurger();
  replaceEmojis();
  initIntroIA();
  fixSnap();
  initAnim();
  initCountUp();
  initNav();
  initDots();
});
})();
'@ | Set-Content -Path "$Root/assets/js/pinapp-master-v4.js" -Encoding UTF8
Write-OK "assets/js/pinapp-master-v4.js"

# ==============================================================================
# ÉTAPE 4 — INJECTION DANS TOUTES LES PAGES + CORRECTIONS HTML
# ==============================================================================
Write-Step "4/9" "Injection CSS/JS + corrections HTML dans toutes les pages..."

$allHtml = Get-ChildItem -Path $Root -Recurse -Filter "*.html" -ErrorAction SilentlyContinue

$n = 0
foreach ($f in $allHtml) {
  $c = Get-Content $f.FullName -Raw -Encoding UTF8
  $dir = Split-Path $f.FullName -Parent
  $rel = $dir.Replace($Root,'').TrimStart('\').TrimStart('/')
  $depth = 0
  if ($rel -ne '') {
    $parts = @($rel -split '[\\/]+' | Where-Object { $_ })
    $depth = $parts.Count
  }
  $pre = if($depth -eq 0){'/'} else {'../' * $depth}

  # Viewport
  if($c -notmatch 'viewport-fit=cover'){
    $c = $c -replace 'initial-scale=1\.0"','initial-scale=1.0, viewport-fit=cover"'
  }
  # CSS
  if($c -notmatch 'pinapp-master-v4\.css'){
    $c = $c -replace '(</head>)',"  <link rel=`"stylesheet`" href=`"${pre}assets/css/pinapp-master-v4.css`"/>`n`$1"
  }
  # JS
  if($c -notmatch 'pinapp-master-v4\.js'){
    $c = $c -replace '(</body>)',"  <script src=`"${pre}assets/js/pinapp-master-v4.js`" defer></script>`n`$1"
  }
  # Corrections copy
  $c = $c -replace 'Je connecte vos outils\.','Nous connectons vos outils.'
  $c = $c -replace 'Je livre','Nous livrons'
  $c = $c -replace 'Je construis','Nous construisons'

  $written = $false
  for ($try = 0; $try -lt 6; $try++) {
    try {
      Set-Content -LiteralPath $f.FullName -Value $c -Encoding utf8 -Force -ErrorAction Stop
      $written = $true
      break
    } catch {
      Start-Sleep -Milliseconds 400
    }
  }
  if (-not $written) {
    Write-Warn "Fichier verrouille, ignore : $($f.FullName)"
  } else {
    $n++
  }
}
Write-OK "$n pages HTML mises à jour"

# ==============================================================================
# ÉTAPE 5 — CORRECTIONS SPÉCIFIQUES index.html
# ==============================================================================
Write-Step "5/9" "Corrections index.html — H1 · baseline · boutons · hero vidéo..."

$indexPath = "$Root/index.html"
if (Test-Path $indexPath) {
  $html = Get-Content $indexPath -Raw -Encoding UTF8

  # Hero H1 — nouveau copy
  $html = $html -replace '(?s)(<h1[^>]*>).*?(</h1>)', '$1Le problème n''est plus le manque d''outils.<br/>C''est le <span class="shimmer">manque de structure</span>.$2'

  # Baseline hero
  $html = $html -replace 'Vos outils travaillent\. Vous décidez\. L.IA et l.automatisation au service d.un système clair.*?studio\.','Nous construisons la structure. Vous récoltez.'

  # Supprimer 3ème bouton hero
  $html = $html -replace '<a[^>]*href=[^>]*/offres/formation/[^>]*>[^<]*Formations[^<]*</a>',''

  # Ajouter vidéo hero placeholder avant snap-container (si absent)
  if ($html -notmatch 'hero-video-wrap') {
    $videoHtml = @'

  <!-- ⚠️ [MICHA] Remplacer src par le vrai MP4 une fois produit -->
  <div class="hero-video-wrap" aria-hidden="true">
    <video autoplay muted loop playsinline>
      <source src="/assets/video/pinapp-hero.mp4" type="video/mp4"/>
    </video>
  </div>

'@
    $html = $html -replace '(<div class="snap-container")', "$videoHtml`$1"
  }

  # EU AI Act badge dans footer (remplacement en une seule chaine : evite les virgules rgba vues comme separateurs -replace)
  if ($html -notmatch 'EU AI Act') {
    $euBadge = @'
      <p style="font-size:10px;color:rgba(240,248,255,.25);margin-top:8px;"><span style="padding:2px 8px;border:1px solid rgba(179,136,255,.2);border-radius:4px;">Assisté par IA · Validé par Lauralie &amp; Micha · EU AI Act Art. 50</span></p>
'@
    $html = $html -replace '(© 2026 Pinapp Inc\.[^<]*</p>)', ('$1' + "`n" + $euBadge.Trim())
  }

  $saved = $false
  for ($try = 0; $try -lt 8; $try++) {
    try {
      Set-Content -LiteralPath $indexPath -Value $html -Encoding utf8 -Force -ErrorAction Stop
      $saved = $true
      break
    } catch {
      Start-Sleep -Seconds 1
    }
  }
  if (-not $saved) {
    throw "Impossible d'ecrire index.html (fichier ouvert ailleurs ?). Ferme l'onglet puis relance l'etape 5 ou le script."
  }
  Write-OK "index.html — H1 · baseline · 3ème bouton · vidéo hero · EU AI Act"
} else {
  Write-Warn "index.html introuvable à $indexPath"
}

# ==============================================================================
# ÉTAPE 6 — .HTACCESS HTTPS + CACHE + SÉCURITÉ
# ==============================================================================
Write-Step "6/9" ".htaccess HTTPS + cache + sécurité..."

@'
# PINAPP INC. — .htaccess v4
Options -Indexes

RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
RewriteCond %{HTTP_HOST} ^www\.pinapp\.fr [NC]
RewriteRule ^(.*)$ https://pinapp.fr/$1 [L,R=301]

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

<FilesMatch "\.(css|js|woff2|png|jpg|webp|svg|ico)$">
  <IfModule mod_headers.c>
    Header set Cache-Control "max-age=31536000, public, immutable"
  </IfModule>
</FilesMatch>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>

ErrorDocument 404 /404.html
'@ | Set-Content -Path "$Root/.htaccess" -Encoding UTF8
Write-OK ".htaccess HTTPS + cache + sécurité"

# ==============================================================================
# ÉTAPE 7 — PARTICLES.JS OPTIMISÉ MOBILE
# ==============================================================================
Write-Step "7/9" "particles.js — 35 mobile / 80 desktop..."

$pjs = "$Root/assets/js/particles.js"
if (Test-Path $pjs) {
  $js = Get-Content $pjs -Raw -Encoding UTF8
  if ($js -notmatch 'innerWidth < 768') {
    $js = $js -replace 'var N\s*=\s*\d+','var N=window.innerWidth<768?35:80'
    Set-Content -Path $pjs -Value $js -Encoding UTF8
    Write-OK "particles.js optimisé"
  } else { Write-OK "particles.js déjà optimisé" }
}

# ==============================================================================
# ÉTAPE 8 — 8 WORKFLOWS N8N COMPLETS (JSON)
# ==============================================================================
Write-Step "8/9" "Génération des 8 workflows n8n JSON..."

# ── WORKFLOW 1 — PROSPECT ENTRANT (🔷 Pinapp)
@'
{
  "name": "🔷 W1 — Prospect entrant",
  "nodes": [
    {"id":"1","name":"Webhook Tally","type":"n8n-nodes-base.webhook","typeVersion":1,"position":[240,300],"parameters":{"path":"prospect-entrant","responseMode":"onReceived","responseData":"allEntries"}},
    {"id":"2","name":"Extraire données","type":"n8n-nodes-base.set","typeVersion":1,"position":[460,300],"parameters":{"values":{"string":[{"name":"prenom","value":"={{$json.body.prenom}}"},{"name":"email","value":"={{$json.body.email}}"},{"name":"secteur","value":"={{$json.body.secteur}}"},{"name":"budget","value":"={{$json.body.budget}}"},{"name":"besoin","value":"={{$json.body.besoin}}"},{"name":"date","value":"={{new Date().toISOString()}}"}]}}},
    {"id":"3","name":"Claude — Scorer prospect","type":"n8n-nodes-base.httpRequest","typeVersion":1,"position":[680,300],"parameters":{"url":"https://api.anthropic.com/v1/messages","method":"POST","headerParameters":{"parameters":[{"name":"x-api-key","value":"={{$env.ANTHROPIC_API_KEY}}"},{"name":"anthropic-version","value":"2023-06-01"},{"name":"content-type","value":"application/json"}]},"bodyParameters":{"parameters":[{"name":"model","value":"claude-sonnet-4-20250514"},{"name":"max_tokens","value":300},{"name":"messages","value":"=[{\"role\":\"user\",\"content\":\"Score ce prospect Pinapp de 1 à 5. Secteur: {{$node.Extraire données.json.secteur}}, Budget: {{$node.Extraire données.json.budget}}, Besoin: {{$node.Extraire données.json.besoin}}. Réponds UNIQUEMENT en JSON: {score, priorite, contexte_court}\"}]"}]}}},
    {"id":"4","name":"Notion — CRM","type":"n8n-nodes-base.notion","typeVersion":1,"position":[900,300],"parameters":{"operation":"create","databaseId":"{{$env.NOTION_CRM_DB}}","propertiesUi":{"propertyValues":[{"key":"Nom","textValue":"={{$node['Extraire données'].json.prenom}}"},{"key":"Email","emailValue":"={{$node['Extraire données'].json.email}}"},{"key":"Secteur","textValue":"={{$node['Extraire données'].json.secteur}}"},{"key":"Statut","selectValue":"Nouveau"},{"key":"Date","dateValue":"={{$node['Extraire données'].json.date}}"}]}}},
    {"id":"5","name":"Gmail — Notif Lauralie","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[1120,200],"parameters":{"operation":"send","toList":"contact@pinapp.fr","subject":"🔷 Prospect — {{$node['Extraire données'].json.secteur}}","message":"Prénom: {{$node['Extraire données'].json.prenom}}\nEmail: {{$node['Extraire données'].json.email}}\nSecteur: {{$node['Extraire données'].json.secteur}}\nBudget: {{$node['Extraire données'].json.budget}}\nBesoin: {{$node['Extraire données'].json.besoin}}"}},
    {"id":"6","name":"Gmail — Accusé réception","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[1120,400],"parameters":{"operation":"send","toList":"={{$node['Extraire données'].json.email}}","subject":"Votre demande Pinapp — reçue ✓","message":"Bonjour {{$node['Extraire données'].json.prenom}},\n\nJ'ai bien reçu votre demande. Je vous réponds sous 24h.\n\nLauralie — Pinapp Studio\ncontact@pinapp.fr"}}
  ],
  "connections":{"Webhook Tally":{"main":[[{"node":"Extraire données","type":"main","index":0}]]},"Extraire données":{"main":[[{"node":"Claude — Scorer prospect","type":"main","index":0}]]},"Claude — Scorer prospect":{"main":[[{"node":"Notion — CRM","type":"main","index":0}]]},"Notion — CRM":{"main":[[{"node":"Gmail — Notif Lauralie","type":"main","index":0},{"node":"Gmail — Accusé réception","type":"main","index":0}]]}}
}
'@ | Set-Content -Path "$Root/n8n-workflows/W1-prospect-entrant.json" -Encoding UTF8

# ── WORKFLOW 2 — DEVIS → YOUSIGN → STRIPE → FACTURE (🔷)
@'
{
  "name": "🔷 W2 — Devis → YouSign → Stripe → Facture",
  "nodes": [
    {"id":"1","name":"Notion Trigger — Devis créé","type":"n8n-nodes-base.notionTrigger","typeVersion":1,"position":[240,300],"parameters":{"databaseId":"={{$env.NOTION_DEVIS_DB}}","pollTimes":{"item":[{"mode":"everyMinute"}]}}},
    {"id":"2","name":"YouSign — Envoyer signature","type":"n8n-nodes-base.httpRequest","typeVersion":1,"position":[460,300],"parameters":{"url":"https://api.yousign.app/v3/signature_requests","method":"POST","headerParameters":{"parameters":[{"name":"Authorization","value":"Bearer {{$env.YOUSIGN_API_KEY}}"},{"name":"Content-Type","value":"application/json"}]},"bodyParameters":{"parameters":[{"name":"name","value":"Devis Pinapp — {{$json.properties.Client.title[0].plain_text}}"},{"name":"delivery_mode","value":"email"}]}}},
    {"id":"3","name":"Wait — Signature reçue","type":"n8n-nodes-base.wait","typeVersion":1,"position":[680,300],"parameters":{"resume":"webhook","webhookSuffix":"signature-ok"}},
    {"id":"4","name":"Stripe — Créer lien paiement","type":"n8n-nodes-base.stripe","typeVersion":1,"position":[900,300],"parameters":{"operation":"create","resource":"paymentLink","amount":"={{$json.properties.Montant.number * 100}}","currency":"eur","name":"Mission Pinapp — {{$json.properties.Client.title[0].plain_text}}"}},
    {"id":"5","name":"Gmail — Lien paiement","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[1120,300],"parameters":{"operation":"send","toList":"={{$json.properties.Email.email}}","subject":"Votre devis Pinapp — signé ✓ — Paiement","message":"Bonjour,\n\nVotre devis est signé. Procédez au règlement ici :\n{{$node['Stripe — Créer lien paiement'].json.url}}\n\nLauralie — Pinapp Studio"}},
    {"id":"6","name":"Stripe Webhook — Paiement reçu","type":"n8n-nodes-base.webhook","typeVersion":1,"position":[1340,300],"parameters":{"path":"stripe-paid","responseMode":"onReceived"}},
    {"id":"7","name":"Notion — Statut Payée","type":"n8n-nodes-base.notion","typeVersion":1,"position":[1560,300],"parameters":{"operation":"update","pageId":"={{$json.metadata.notion_id}}","propertiesUi":{"propertyValues":[{"key":"Statut","selectValue":"Payée"}]}}}
  ],
  "connections":{"Notion Trigger — Devis créé":{"main":[[{"node":"YouSign — Envoyer signature","type":"main","index":0}]]},"YouSign — Envoyer signature":{"main":[[{"node":"Wait — Signature reçue","type":"main","index":0}]]},"Wait — Signature reçue":{"main":[[{"node":"Stripe — Créer lien paiement","type":"main","index":0}]]},"Stripe — Créer lien paiement":{"main":[[{"node":"Gmail — Lien paiement","type":"main","index":0}]]},"Stripe Webhook — Paiement reçu":{"main":[[{"node":"Notion — Statut Payée","type":"main","index":0}]]}}
}
'@ | Set-Content -Path "$Root/n8n-workflows/W2-devis-yousign-stripe.json" -Encoding UTF8

# ── WORKFLOW 3 — PAIEMENT → ACCÈS FORMATION + SÉQUENCE EMAIL (🔷)
@'
{
  "name": "🔷 W3 — Paiement → Formation + Séquence J1/J3/J7/J14",
  "nodes": [
    {"id":"1","name":"Stripe Webhook","type":"n8n-nodes-base.webhook","typeVersion":1,"position":[240,300],"parameters":{"path":"formation-achat","responseMode":"onReceived"}},
    {"id":"2","name":"Identifier formation","type":"n8n-nodes-base.switch","typeVersion":1,"position":[460,300],"parameters":{"dataType":"string","value1":"={{$json.data.object.amount}}","rules":{"rules":[{"value2":"6700","output":0},{"value2":"14700","output":1},{"value2":"19700","output":2},{"value2":"39700","output":3},{"value2":"79700","output":4}]}}},
    {"id":"3","name":"Générer code accès","type":"n8n-nodes-base.code","typeVersion":1,"position":[680,300],"parameters":{"jsCode":"const code='PINAPP-'+Math.random().toString(36).substr(2,8).toUpperCase();\nreturn [{json:{code, email:$input.first().json.data.object.customer_details.email, prenom:$input.first().json.data.object.customer_details.name.split(' ')[0]}}];"}},
    {"id":"4","name":"Notion — Créer étudiant","type":"n8n-nodes-base.notion","typeVersion":1,"position":[900,300],"parameters":{"operation":"create","databaseId":"={{$env.NOTION_FORMATIONS_DB}}","propertiesUi":{"propertyValues":[{"key":"Nom","textValue":"={{$json.prenom}}"},{"key":"Email","emailValue":"={{$json.email}}"},{"key":"Code","textValue":"={{$json.code}}"},{"key":"Statut","selectValue":"Actif"},{"key":"Progression","numberValue":0}]}}},
    {"id":"5","name":"Gmail — Accès immédiat","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[1120,200],"parameters":{"operation":"send","toList":"={{$json.email}}","subject":"Ton accès Pinapp est prêt ✓","message":"Bonjour {{$json.prenom}},\n\nTon accès est activé.\n👉 https://pinapp.fr/formation/\n🔑 Code : {{$json.code}}\n\nBonne formation !\nLauralie"}},
    {"id":"6","name":"Wait 1 jour","type":"n8n-nodes-base.wait","typeVersion":1,"position":[1120,350],"parameters":{"resume":"timeInterval","unit":"days","value":1}},
    {"id":"7","name":"Gmail J+1 — Premiers pas","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[1340,350],"parameters":{"operation":"send","toList":"={{$json.email}}","subject":"Jour 1 — As-tu commencé ?","message":"Bonjour {{$json.prenom}},\n\nJ'espère que tu as pu jeter un œil au module 1.\nUne question ? Réponds directement à cet email.\n\nLauralie"}},
    {"id":"8","name":"Wait 2 jours","type":"n8n-nodes-base.wait","typeVersion":1,"position":[1340,450],"parameters":{"resume":"timeInterval","unit":"days","value":2}},
    {"id":"9","name":"Gmail J+3 — Vérif","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[1560,450],"parameters":{"operation":"send","toList":"={{$json.email}}","subject":"Comment ça avance ?","message":"Bonjour {{$json.prenom}},\n\nJ'aimerais savoir où tu en es. 2 minutes ?\nhttps://tally.so/r/{{$env.TALLY_FEEDBACK_ID}}\n\nLauralie"}},
    {"id":"10","name":"Wait 4 jours","type":"n8n-nodes-base.wait","typeVersion":1,"position":[1560,550],"parameters":{"resume":"timeInterval","unit":"days","value":4}},
    {"id":"11","name":"Gmail J+7 — Résultats","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[1780,550],"parameters":{"operation":"send","toList":"={{$json.email}}","subject":"7 jours — quels résultats ?","message":"Bonjour {{$json.prenom}},\n\nUne semaine. Qu'est-ce que tu as mis en place ?\nRéponds à cet email, je lis tout.\n\nLauralie"}},
    {"id":"12","name":"Wait 7 jours","type":"n8n-nodes-base.wait","typeVersion":1,"position":[1780,650],"parameters":{"resume":"timeInterval","unit":"days","value":7}},
    {"id":"13","name":"Gmail J+14 — Upsell","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[2000,650],"parameters":{"operation":"send","toList":"={{$json.email}}","subject":"Et si on allait plus loin ?","message":"Bonjour {{$json.prenom}},\n\nTu as terminé la formation. Pour aller encore plus loin :\n👉 https://pinapp.fr/offres/\n\nLauralie"}}
  ],
  "connections":{"Stripe Webhook":{"main":[[{"node":"Identifier formation","type":"main","index":0}]]},"Identifier formation":{"main":[[{"node":"Générer code accès","type":"main","index":0}],[{"node":"Générer code accès","type":"main","index":0}],[{"node":"Générer code accès","type":"main","index":0}],[{"node":"Générer code accès","type":"main","index":0}],[{"node":"Générer code accès","type":"main","index":0}]]},"Générer code accès":{"main":[[{"node":"Notion — Créer étudiant","type":"main","index":0}]]},"Notion — Créer étudiant":{"main":[[{"node":"Gmail — Accès immédiat","type":"main","index":0},{"node":"Wait 1 jour","type":"main","index":0}]]},"Wait 1 jour":{"main":[[{"node":"Gmail J+1 — Premiers pas","type":"main","index":0}]]},"Gmail J+1 — Premiers pas":{"main":[[{"node":"Wait 2 jours","type":"main","index":0}]]},"Wait 2 jours":{"main":[[{"node":"Gmail J+3 — Vérif","type":"main","index":0}]]},"Gmail J+3 — Vérif":{"main":[[{"node":"Wait 4 jours","type":"main","index":0}]]},"Wait 4 jours":{"main":[[{"node":"Gmail J+7 — Résultats","type":"main","index":0}]]},"Gmail J+7 — Résultats":{"main":[[{"node":"Wait 7 jours","type":"main","index":0}]]},"Wait 7 jours":{"main":[[{"node":"Gmail J+14 — Upsell","type":"main","index":0}]]}}
}
'@ | Set-Content -Path "$Root/n8n-workflows/W3-formation-sequence.json" -Encoding UTF8

# ── WORKFLOW 4 — LIVRAISON → FEEDBACK → AVIS GOOGLE J+7 (🔷)
@'
{
  "name": "🔷 W4 — Livraison → Feedback → Avis Google J+7",
  "nodes": [
    {"id":"1","name":"Notion Trigger — Statut Livrée","type":"n8n-nodes-base.notionTrigger","typeVersion":1,"position":[240,300],"parameters":{"databaseId":"={{$env.NOTION_MISSIONS_DB}}"}},
    {"id":"2","name":"Gmail — Email livraison","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[460,300],"parameters":{"operation":"send","toList":"={{$json.properties.Email.email}}","subject":"Votre projet est livré ✓","message":"Bonjour,\n\nVotre projet est livré. Retrouvez tout ici :\n{{$json.properties.LienClient.url}}\n\nDes ajustements ? Je suis disponible 48h.\nLauralie"}},
    {"id":"3","name":"Wait 7 jours","type":"n8n-nodes-base.wait","typeVersion":1,"position":[680,300],"parameters":{"resume":"timeInterval","unit":"days","value":7}},
    {"id":"4","name":"Gmail — Demande avis","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[900,300],"parameters":{"operation":"send","toList":"={{$json.properties.Email.email}}","subject":"60 secondes pour un retour ?","message":"Bonjour,\n\n60 secondes pour partager votre expérience :\nhttps://tally.so/r/{{$env.TALLY_AVIS_ID}}\n\nMerci — Lauralie"}},
    {"id":"5","name":"Tally Webhook — Réponse","type":"n8n-nodes-base.webhook","typeVersion":1,"position":[1120,300],"parameters":{"path":"avis-recu"}},
    {"id":"6","name":"IF — Note ≥ 4","type":"n8n-nodes-base.if","typeVersion":1,"position":[1340,300],"parameters":{"conditions":{"number":[{"value1":"={{$json.note}}","operation":"largerEqual","value2":4}]}}},
    {"id":"7","name":"Gmail — Demande Google","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[1560,200],"parameters":{"operation":"send","toList":"={{$json.email}}","subject":"Un avis Google pour nous aider ?","message":"Merci pour votre retour positif !\n\nUn avis Google nous aiderait énormément :\nhttps://g.page/r/{{$env.GOOGLE_REVIEW_ID}}/review\n\nMerci — Lauralie"}},
    {"id":"8","name":"Gmail — Suivi Lauralie","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[1560,400],"parameters":{"operation":"send","toList":"contact@pinapp.fr","subject":"⚠️ Avis négatif — suivi requis","message":"Un client a laissé une note < 4.\nNote : {{$json.note}}\nCommentaire : {{$json.commentaire}}\nEmail : {{$json.email}}"}}
  ],
  "connections":{"Notion Trigger — Statut Livrée":{"main":[[{"node":"Gmail — Email livraison","type":"main","index":0}]]},"Gmail — Email livraison":{"main":[[{"node":"Wait 7 jours","type":"main","index":0}]]},"Wait 7 jours":{"main":[[{"node":"Gmail — Demande avis","type":"main","index":0}]]},"Tally Webhook — Réponse":{"main":[[{"node":"IF — Note ≥ 4","type":"main","index":0}]]},"IF — Note ≥ 4":{"main":[[{"node":"Gmail — Demande Google","type":"main","index":0}],[{"node":"Gmail — Suivi Lauralie","type":"main","index":0}]]}}
}
'@ | Set-Content -Path "$Root/n8n-workflows/W4-livraison-feedback.json" -Encoding UTF8

# ── WORKFLOW 5 — M&P CONTACT (🌿 Mémoire & Présence)
@'
{
  "name": "🌿 W5 — M&P Contact famille",
  "nodes": [
    {"id":"1","name":"Webhook Tally M&P","type":"n8n-nodes-base.webhook","typeVersion":1,"position":[240,300],"parameters":{"path":"mp-contact","responseMode":"onReceived"}},
    {"id":"2","name":"Extraire données M&P","type":"n8n-nodes-base.set","typeVersion":1,"position":[460,300],"parameters":{"values":{"string":[{"name":"prenom","value":"={{$json.body.prenom}}"},{"name":"email","value":"={{$json.body.email}}"},{"name":"message","value":"={{$json.body.message}}"},{"name":"type","value":"={{$json.body.type}}"},{"name":"date","value":"={{new Date().toISOString()}}"}]}}},
    {"id":"3","name":"Notion — CRM M&P","type":"n8n-nodes-base.notion","typeVersion":1,"position":[680,300],"parameters":{"operation":"create","databaseId":"={{$env.NOTION_MP_DB}}","propertiesUi":{"propertyValues":[{"key":"Nom","textValue":"={{$json.prenom}}"},{"key":"Email","emailValue":"={{$json.email}}"},{"key":"Type","selectValue":"={{$json.type}}"},{"key":"Statut","selectValue":"Nouveau"},{"key":"Date","dateValue":"={{$json.date}}"}]}}},
    {"id":"4","name":"HTTP — WhatsApp Micha","type":"n8n-nodes-base.httpRequest","typeVersion":1,"position":[900,200],"parameters":{"url":"https://api.whatsapp.com/send","method":"GET","queryParameters":{"parameters":[{"name":"phone","value":"={{$env.MICHA_PHONE}}"},{"name":"text","value":"🌿 Nouvelle demande M&P\nPrénom: {{$json.prenom}}\nType: {{$json.type}}\nEmail: {{$json.email}}\nMessage: {{$json.message}}"}]}}},
    {"id":"5","name":"Gmail — Accusé famille","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[900,400],"parameters":{"operation":"send","toList":"={{$json.email}}","subject":"Votre demande Mémoire & Présence — reçue","message":"Bonjour {{$json.prenom}},\n\nNous avons bien reçu votre demande.\nMicha vous contactera sous 24h.\n\nAvec respect,\nL'équipe Mémoire & Présence\nmicha@memoireetpresence.fr"}}
  ],
  "connections":{"Webhook Tally M&P":{"main":[[{"node":"Extraire données M&P","type":"main","index":0}]]},"Extraire données M&P":{"main":[[{"node":"Notion — CRM M&P","type":"main","index":0}]]},"Notion — CRM M&P":{"main":[[{"node":"HTTP — WhatsApp Micha","type":"main","index":0},{"node":"Gmail — Accusé famille","type":"main","index":0}]]}}
}
'@ | Set-Content -Path "$Root/n8n-workflows/W5-mp-contact.json" -Encoding UTF8

# ── WORKFLOW 6 — VEILLE HEBDO → CLAUDE → BUFFER → NEWSLETTER (🔷)
@'
{
  "name": "🔷 W6 — Veille hebdo → Claude → Buffer → Newsletter",
  "nodes": [
    {"id":"1","name":"Cron — Lundi 8h","type":"n8n-nodes-base.cron","typeVersion":1,"position":[240,300],"parameters":{"triggerTimes":{"item":[{"mode":"everyWeek","hour":8,"minute":0,"weekday":1}]}}},
    {"id":"2","name":"HTTP — Tendances IA","type":"n8n-nodes-base.httpRequest","typeVersion":1,"position":[460,300],"parameters":{"url":"https://trends.google.com/trends/api/dailytrends","queryParameters":{"parameters":[{"name":"geo","value":"FR"},{"name":"ns","value":"15"}]}}},
    {"id":"3","name":"Claude — Analyser tendances","type":"n8n-nodes-base.httpRequest","typeVersion":1,"position":[680,300],"parameters":{"url":"https://api.anthropic.com/v1/messages","method":"POST","headerParameters":{"parameters":[{"name":"x-api-key","value":"={{$env.ANTHROPIC_API_KEY}}"},{"name":"anthropic-version","value":"2023-06-01"},{"name":"content-type","value":"application/json"}]},"bodyParameters":{"parameters":[{"name":"model","value":"claude-sonnet-4-20250514"},{"name":"max_tokens","value":800},{"name":"messages","value":"=[{\"role\":\"user\",\"content\":\"Tu es le stratège contenu de Pinapp Inc. Génère 1 post LinkedIn de 150 mots sur l'IA pour TPE/PME françaises. Ton : expert bienveillant. Hook accrocheur. 3 points concrets. CTA vers pinapp.fr. Format: {titre, corps, hashtags}\"}]"}]}}},
    {"id":"4","name":"Buffer — Planifier post","type":"n8n-nodes-base.httpRequest","typeVersion":1,"position":[900,300],"parameters":{"url":"https://api.bufferapp.com/1/updates/create.json","method":"POST","bodyParameters":{"parameters":[{"name":"profile_ids[]","value":"={{$env.BUFFER_PROFILE_ID}}"},{"name":"text","value":"={{$json.content[0].text}}"},{"name":"scheduled_at","value":"={{new Date(Date.now()+86400000).toISOString()}}"}]}}},
    {"id":"5","name":"Gmail — Newsletter hebdo","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[1120,300],"parameters":{"operation":"send","toList":"={{$env.NEWSLETTER_LIST}}","subject":"🔷 Veille IA Pinapp — Semaine {{new Date().getWeek()}}","message":"Bonjour,\n\nLa veille IA de la semaine :\n\n{{$node['Claude — Analyser tendances'].json.content[0].text}}\n\n---\nPinapp Inc. · contact@pinapp.fr · pinapp.fr"}}
  ],
  "connections":{"Cron — Lundi 8h":{"main":[[{"node":"HTTP — Tendances IA","type":"main","index":0}]]},"HTTP — Tendances IA":{"main":[[{"node":"Claude — Analyser tendances","type":"main","index":0}]]},"Claude — Analyser tendances":{"main":[[{"node":"Buffer — Planifier post","type":"main","index":0},{"node":"Gmail — Newsletter hebdo","type":"main","index":0}]]}}
}
'@ | Set-Content -Path "$Root/n8n-workflows/W6-veille-content.json" -Encoding UTF8

# ── WORKFLOW 7 — MAINTENANCE MENSUELLE + RELANCE IMPAYÉS (🔷)
@'
{
  "name": "🔷 W7 — Maintenance mensuelle + Relance impayés",
  "nodes": [
    {"id":"1","name":"Cron — 1er du mois 8h","type":"n8n-nodes-base.cron","typeVersion":1,"position":[240,300],"parameters":{"triggerTimes":{"item":[{"mode":"everyMonth","hour":8,"minute":0,"dayOfMonth":1}]}}},
    {"id":"2","name":"Notion — Missions du mois","type":"n8n-nodes-base.notion","typeVersion":1,"position":[460,300],"parameters":{"operation":"getAll","databaseId":"={{$env.NOTION_MISSIONS_DB}}","filterJson":"{\"and\":[{\"property\":\"Statut\",\"select\":{\"equals\":\"Payée\"}}]}"}},
    {"id":"3","name":"Notion — Impayés","type":"n8n-nodes-base.notion","typeVersion":1,"position":[460,500],"parameters":{"operation":"getAll","databaseId":"={{$env.NOTION_DEVIS_DB}}","filterJson":"{\"and\":[{\"property\":\"Statut\",\"select\":{\"equals\":\"En attente\"}},{\"property\":\"Date\",\"date\":{\"before\":\"{{new Date(Date.now()-604800000).toISOString()}}\"}}]}"}},
    {"id":"4","name":"Claude — Générer rapport","type":"n8n-nodes-base.httpRequest","typeVersion":1,"position":[700,300],"parameters":{"url":"https://api.anthropic.com/v1/messages","method":"POST","headerParameters":{"parameters":[{"name":"x-api-key","value":"={{$env.ANTHROPIC_API_KEY}}"},{"name":"anthropic-version","value":"2023-06-01"},{"name":"content-type","value":"application/json"}]},"bodyParameters":{"parameters":[{"name":"model","value":"claude-sonnet-4-20250514"},{"name":"max_tokens","value":600},{"name":"messages","value":"=[{\"role\":\"user\",\"content\":\"Génère un rapport mensuel Pinapp Inc. concis. Missions: {{JSON.stringify($node['Notion — Missions du mois'].json)}}. Format: CA total, nb missions, points forts, recommandations.\"}]"}]}}},
    {"id":"5","name":"Gmail — Rapport Lauralie","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[960,300],"parameters":{"operation":"send","toList":"contact@pinapp.fr","subject":"📊 Rapport mensuel Pinapp","message":"{{$node['Claude — Générer rapport'].json.content[0].text}}"}},
    {"id":"6","name":"Gmail — Relance impayés","type":"n8n-nodes-base.gmail","typeVersion":1,"position":[700,500],"parameters":{"operation":"send","toList":"={{$json.properties.Email.email}}","subject":"Rappel — Facture Pinapp en attente","message":"Bonjour,\n\nNous n'avons pas encore reçu le règlement de votre facture.\n\nProcédez au paiement ici :\n{{$json.properties.LienPaiement.url}}\n\nCordialement,\nLauralie — Pinapp Studio"}}
  ],
  "connections":{"Cron — 1er du mois 8h":{"main":[[{"node":"Notion — Missions du mois","type":"main","index":0},{"node":"Notion — Impayés","type":"main","index":0}]]},"Notion — Missions du mois":{"main":[[{"node":"Claude — Générer rapport","type":"main","index":0}]]},"Claude — Générer rapport":{"main":[[{"node":"Gmail — Rapport Lauralie","type":"main","index":0}]]},"Notion — Impayés":{"main":[[{"node":"Gmail — Relance impayés","type":"main","index":0}]]}}
}
'@ | Set-Content -Path "$Root/n8n-workflows/W7-maintenance-mensuelle.json" -Encoding UTF8

# ── WORKFLOW 8 — AURALIS RH AURORA PIPELINE (🔷)
@'
{
  "name": "🔷 W8 — Auralis RH — Aurora Pipeline",
  "nodes": [
    {"id":"1","name":"Webhook Aurora","type":"n8n-nodes-base.webhook","typeVersion":1,"position":[240,300],"parameters":{"path":"aurora-query","responseMode":"onReceived"}},
    {"id":"2","name":"Router — Catégorie","type":"n8n-nodes-base.switch","typeVersion":1,"position":[460,300],"parameters":{"dataType":"string","value1":"={{$json.body.type}}","rules":{"rules":[{"value2":"ACTION","output":0},{"value2":"FORMATION","output":1},{"value2":"SUPPORT","output":2}]}}},
    {"id":"3","name":"Claude — ACTION","type":"n8n-nodes-base.httpRequest","typeVersion":1,"position":[700,150],"parameters":{"url":"https://api.anthropic.com/v1/messages","method":"POST","headerParameters":{"parameters":[{"name":"x-api-key","value":"={{$env.ANTHROPIC_API_KEY}}"},{"name":"anthropic-version","value":"2023-06-01"},{"name":"content-type","value":"application/json"}]},"bodyParameters":{"parameters":[{"name":"model","value":"claude-sonnet-4-20250514"},{"name":"max_tokens","value":300},{"name":"system","value":"Tu es Aurora, l'IA RH d'Auralis. Max 3 lignes. Observation (≤12 mots) + action disponible + nuance. Interdit: Bonjour, tu dois, il faut, impératifs, points d'exclamation."},{"name":"messages","value":"=[{\"role\":\"user\",\"content\":\"{{$json.body.query}}\"}]"}]}}},
    {"id":"4","name":"Claude — FORMATION","type":"n8n-nodes-base.httpRequest","typeVersion":1,"position":[700,300],"parameters":{"url":"https://api.anthropic.com/v1/messages","method":"POST","headerParameters":{"parameters":[{"name":"x-api-key","value":"={{$env.ANTHROPIC_API_KEY}}"},{"name":"anthropic-version","value":"2023-06-01"},{"name":"content-type","value":"application/json"}]},"bodyParameters":{"parameters":[{"name":"model","value":"claude-sonnet-4-20250514"},{"name":"max_tokens","value":300},{"name":"system","value":"Tu es Aurora, l'IA RH d'Auralis. Réponds sur la formation et développement RH. Max 3 lignes. Ton bienveillant. Tu ne décides pas à la place de l'humain."},{"name":"messages","value":"=[{\"role\":\"user\",\"content\":\"{{$json.body.query}}\"}]"}]}}},
    {"id":"5","name":"Claude — SUPPORT","type":"n8n-nodes-base.httpRequest","typeVersion":1,"position":[700,450],"parameters":{"url":"https://api.anthropic.com/v1/messages","method":"POST","headerParameters":{"parameters":[{"name":"x-api-key","value":"={{$env.ANTHROPIC_API_KEY}}"},{"name":"anthropic-version","value":"2023-06-01"},{"name":"content-type","value":"application/json"}]},"bodyParameters":{"parameters":[{"name":"model","value":"claude-sonnet-4-20250514"},{"name":"max_tokens","value":300},{"name":"system","value":"Tu es Aurora, l'IA RH d'Auralis. Support RH opérationnel. Max 3 lignes. Rassurant et précis."},{"name":"messages","value":"=[{\"role\":\"user\",\"content\":\"{{$json.body.query}}\"}]"}]}}},
    {"id":"6","name":"Respond to Webhook","type":"n8n-nodes-base.respondToWebhook","typeVersion":1,"position":[960,300],"parameters":{"respondWith":"json","responseBody":"={\"response\": \"{{$json.content[0].text}}\", \"timestamp\": \"{{new Date().toISOString()}}\"}"}}
  ],
  "connections":{"Webhook Aurora":{"main":[[{"node":"Router — Catégorie","type":"main","index":0}]]},"Router — Catégorie":{"main":[[{"node":"Claude — ACTION","type":"main","index":0}],[{"node":"Claude — FORMATION","type":"main","index":0}],[{"node":"Claude — SUPPORT","type":"main","index":0}]]},"Claude — ACTION":{"main":[[{"node":"Respond to Webhook","type":"main","index":0}]]},"Claude — FORMATION":{"main":[[{"node":"Respond to Webhook","type":"main","index":0}]]},"Claude — SUPPORT":{"main":[[{"node":"Respond to Webhook","type":"main","index":0}]]}}
}
'@ | Set-Content -Path "$Root/n8n-workflows/W8-auralis-aurora.json" -Encoding UTF8

Write-OK "8 workflows n8n JSON générés"
Get-ChildItem "$Root/n8n-workflows/" | ForEach-Object { Write-OK $_.Name }

# ==============================================================================
# ÉTAPE 9 — FICHIERS SUPPORT
# ==============================================================================
Write-Step "9/9" "Fichiers support — env template + README workflows..."

# Variables d'environnement n8n
@'
# PINAPP INC. — Variables n8n
# Configurer dans n8n : Settings → Environment Variables

# Anthropic
ANTHROPIC_API_KEY=sk-ant-XXXXX

# Notion
NOTION_CRM_DB=XXXXX
NOTION_MISSIONS_DB=XXXXX
NOTION_DEVIS_DB=XXXXX
NOTION_FORMATIONS_DB=XXXXX
NOTION_MP_DB=XXXXX

# Stripe
STRIPE_SECRET_KEY=sk_live_XXXXX

# YouSign
YOUSIGN_API_KEY=XXXXX

# Buffer
BUFFER_PROFILE_ID=XXXXX

# Tally
TALLY_FEEDBACK_ID=XXXXX
TALLY_AVIS_ID=XXXXX

# Google
GOOGLE_REVIEW_ID=XXXXX

# Micha (M&P)
MICHA_PHONE=336XXXXXXXX

# Newsletter
NEWSLETTER_LIST=contact@pinapp.fr
'@ | Set-Content -Path "$Root/n8n-workflows/.env.template" -Encoding UTF8

# README workflows
@'
# PINAPP INC. — WORKFLOWS N8N
## 8 workflows · Self-hosted Hostinger · Gratuit illimité

| # | Nom | Déclencheur | Résultat |
|---|-----|-------------|---------|
| W1 | 🔷 Prospect entrant | Tally webhook | CRM Notion + email Lauralie + accusé |
| W2 | 🔷 Devis → Paiement | Notion trigger | YouSign → Stripe → facture |
| W3 | 🔷 Formation + Séquence | Stripe webhook | Accès + J1/J3/J7/J14 + upsell |
| W4 | 🔷 Livraison → Avis | Notion trigger | Email livraison + avis Google J+7 |
| W5 | 🌿 M&P Contact | Tally webhook | WhatsApp Micha + email famille |
| W6 | 🔷 Veille → Content | Cron lundi 8h | Claude → Buffer LinkedIn + newsletter |
| W7 | 🔷 Maintenance mensuelle | Cron 1er du mois | Rapport CA + relance impayés |
| W8 | 🔷 Auralis Aurora | Webhook | Claude router ACTION/FORMATION/SUPPORT |

## Installation
1. Importer chaque JSON dans n8n (Menu → Import)
2. Configurer les credentials (voir .env.template)
3. Activer les workflows un par un
4. Tester W1 en premier avec un formulaire Tally test

## Ordre recommandé
Jour 1 : W1 + W5 (contacts entrants)
Jour 2 : W2 + W3 (devis + formations)
Jour 3 : W4 + W6 (livraison + contenu)
Semaine 2 : W7 + W8 (maintenance + Auralis)
'@ | Set-Content -Path "$Root/n8n-workflows/README.md" -Encoding UTF8

# Dossier vidéo avec placeholder
New-Item -ItemType Directory -Force -Path "$Root/assets/video" | Out-Null
@'
DOSSIER VIDÉO HERO — PINAPP INC.
==================================
⚠️ [MICHA] Placer ici le MP4 une fois produit avec les outils IA

Nom du fichier : pinapp-hero.mp4
Format : H.264 · 1920×1080 · 24fps
Durée : 60-75 secondes
Taille max : 15Mo (compresser avec Handbrake si nécessaire)

Version mobile (optionnelle) : pinapp-hero-mobile.mp4 (9:16 · 1080×1920)

En attendant : le canvas particules Pandora sert de fond animé.
'@ | Set-Content -Path "$Root/assets/video/README.txt" -Encoding UTF8

Write-OK "n8n/.env.template + README + dossier video"

# ==============================================================================
# RÉSUMÉ FINAL
# ==============================================================================
Write-Host "`n══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  MASTER FINAL V4 — TERMINÉ" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════════`n" -ForegroundColor Magenta

Write-Host "  SITE — Corrections appliquées :" -ForegroundColor Cyan
Write-Host "  ✓ SF Pro natif Apple — toutes pages" -ForegroundColor Gray
Write-Host "  ✓ Mode jour Avatar 2 #0a3d52 eau lumineuse" -ForegroundColor Gray
Write-Host "  ✓ Mobile — grilles 1 col · prix 24px · scroll-snap" -ForegroundColor Gray
Write-Host "  ✓ Burger mobile — visible et fonctionnel" -ForegroundColor Gray
Write-Host "  ✓ Emojis → SVG partout" -ForegroundColor Gray
Write-Host "  ✓ Hero H1 — nouveau copy PDFs" -ForegroundColor Gray
Write-Host "  ✓ Baseline — 1 phrase" -ForegroundColor Gray
Write-Host "  ✓ 3ème bouton CTA supprimé" -ForegroundColor Gray
Write-Host "  ✓ Vidéo hero placeholder (⚠️ remplacer par MP4 Micha)" -ForegroundColor Gray
Write-Host "  ✓ EU AI Act badge footer" -ForegroundColor Gray
Write-Host "  ✓ HTTPS .htaccess + cache + sécurité" -ForegroundColor Gray
Write-Host "  ✓ Intro IA futuriste — HAL 9000 × Jarvis" -ForegroundColor Gray
Write-Host "  ✓ Safe area iPhone notch + home indicator" -ForegroundColor Gray
Write-Host "  ✓ Particules 35 mobile / 80 desktop" -ForegroundColor Gray

Write-Host "`n  AUTOMATISATIONS — 8 workflows n8n :" -ForegroundColor Cyan
Write-Host "  ✓ W1 🔷 Prospect entrant → CRM + scoring Claude" -ForegroundColor Gray
Write-Host "  ✓ W2 🔷 Devis → YouSign → Stripe → facture" -ForegroundColor Gray
Write-Host "  ✓ W3 🔷 Formation + séquence J1/J3/J7/J14 + upsell" -ForegroundColor Gray
Write-Host "  ✓ W4 🔷 Livraison → feedback → avis Google J+7" -ForegroundColor Gray
Write-Host "  ✓ W5 🌿 M&P contact → WhatsApp Micha + email famille" -ForegroundColor Gray
Write-Host "  ✓ W6 🔷 Veille hebdo → Claude → Buffer → newsletter" -ForegroundColor Gray
Write-Host "  ✓ W7 🔷 Maintenance mensuelle + relance impayés" -ForegroundColor Gray
Write-Host "  ✓ W8 🔷 Auralis Aurora pipeline ACTION/FORMATION/SUPPORT" -ForegroundColor Gray

Write-Host "`n  À FAIRE MANUELLEMENT :" -ForegroundColor Yellow
Write-Host "  → SSL Hostinger : hPanel → SSL → Let's Encrypt → Activer" -ForegroundColor Gray
Write-Host "  → MP4 Micha : placer dans assets/video/pinapp-hero.mp4" -ForegroundColor Gray
Write-Host "  → Tally : créer 3 formulaires + IDs dans .env" -ForegroundColor Gray
Write-Host "  → n8n : importer les 8 JSON + configurer .env.template" -ForegroundColor Gray
Write-Host "  → Photos : assets/images/lauralie/ et micha/" -ForegroundColor Gray

Write-Host "`n  DÉPLOYER :" -ForegroundColor Yellow
Write-Host "  .\pinapp.ps1 ship`n" -ForegroundColor White
