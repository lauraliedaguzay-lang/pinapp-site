# =============================================================
#  pandora-design.ps1 — Pinapp Studio
#  Design Pandora nuit / jour · Particules · Deploy SFTP
#  Placer a la RACINE du repo · Executer dans terminal Cursor
#
#  Deploy : .\pandora-design.ps1 -SkipDeploy
#           ou $env:PINAPP_SKIP_DEPLOY = '1'  (local uniquement, pas WinSCP)
# =============================================================

param(
    [switch]$SkipDeploy
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$ROOT     = Split-Path $PSScriptRoot -Parent
$CSS_DIR  = Join-Path $ROOT "assets\css"
$JS_DIR   = Join-Path $ROOT "assets\js"
$CSS_FILE = Join-Path $CSS_DIR "home-2026.css"
$JS_FILE  = Join-Path $JS_DIR  "pandora-fx.js"
$INDEX    = Join-Path $ROOT "index.html"
$DATE     = Get-Date -Format "yyyyMMdd-HHmm"
$BACKUP   = Join-Path $CSS_DIR "home-2026.backup.$DATE.css"

Write-Host "`n🌿 PANDORA DESIGN — Pinapp Studio" -ForegroundColor Cyan
Write-Host "────────────────────────────────────" -ForegroundColor DarkGray

# 0. Dossiers
if (-not (Test-Path $CSS_DIR)) { New-Item -ItemType Directory -Path $CSS_DIR -Force | Out-Null }
if (-not (Test-Path $JS_DIR))  { New-Item -ItemType Directory -Path $JS_DIR  -Force | Out-Null }

# 1. Backup
if (Test-Path $CSS_FILE) {
    Copy-Item $CSS_FILE $BACKUP -Force
    Write-Host "OK Backup : home-2026.backup.$DATE.css" -ForegroundColor Green
} else {
    Write-Host "i Creation from scratch" -ForegroundColor Yellow
}

# 2. CSS Pandora
Write-Host "... Ecriture home-2026.css" -ForegroundColor Cyan
$CSS = @'
/* home-2026.css -- Design Pandora -- Pinapp Studio
   Nuit : cosmos #0D0A1A  /  Jour : aurore #DFF7F2 */

:root {
  --accent:        #00E5B0;
  --accent-2:      #9B6DFF;
  --accent-glow:   rgba(0,229,176,.22);
  --accent-2-glow: rgba(155,109,255,.16);
  --accent-mid:    #7FFFD4;
  --bg:            #0D0A1A;
  --bg-layer:      rgba(13,10,26,.72);
  --bg-card:       rgba(255,255,255,.05);
  --bg-card-hover: rgba(255,255,255,.09);
  --text:          #F0FAFA;
  --text-muted:    rgba(240,250,250,.52);
  --text-dim:      rgba(240,250,250,.32);
  --border:        rgba(255,255,255,.09);
  --border-accent: rgba(0,229,176,.28);
  --radius-sm: 8px; --radius: 16px; --radius-lg: 24px;
  --t: .24s cubic-bezier(.4,0,.2,1);
  --nav-h: 64px; --container: 1160px;
  --font-apple: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', Helvetica, system-ui, sans-serif;
  --font-apple-serif: ui-serif, 'New York', 'Iowan Old Style', 'Apple Garamond', serif;
}
[data-theme="light"] {
  --bg:            #DFF7F2;
  --bg-layer:      rgba(223,247,242,.7);
  --bg-card:       rgba(0,0,0,.04);
  --bg-card-hover: rgba(0,0,0,.08);
  --text:          #0D1A18;
  --text-muted:    rgba(13,26,24,.55);
  --text-dim:      rgba(13,26,24,.35);
  --border:        rgba(0,0,0,.09);
  --border-accent: rgba(0,180,140,.3);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body.home-2026{
  font-family:var(--font-apple);
  background:var(--bg);color:var(--text);overflow-x:hidden;min-height:100dvh;
  transition:background var(--t),color var(--t);
}

/* Particules canvas */
#particles{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.7;mix-blend-mode:screen}
[data-theme="light"] #particles{opacity:.35;mix-blend-mode:multiply}

/* Caustics bioluminescents */
.caustics{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.caustics span{position:absolute;border-radius:50%;filter:blur(90px);animation:caustic-drift 18s ease-in-out infinite alternate}
.caustics span:nth-child(1){
  width:55vw;height:55vw;
  background:radial-gradient(circle,rgba(0,229,176,.12) 0%,transparent 65%);
  top:-15%;left:-10%;animation-duration:22s;
}
.caustics span:nth-child(2){
  width:45vw;height:45vw;
  background:radial-gradient(circle,rgba(155,109,255,.10) 0%,transparent 65%);
  bottom:0;right:-5%;animation-duration:27s;animation-delay:-9s;
}
.caustics span:nth-child(3){
  width:30vw;height:30vw;
  background:radial-gradient(circle,rgba(127,255,212,.08) 0%,transparent 65%);
  top:40%;left:45%;animation-duration:19s;animation-delay:-5s;
}
[data-theme="light"] .caustics span:nth-child(1){background:radial-gradient(circle,rgba(0,180,140,.18) 0%,transparent 65%)}
[data-theme="light"] .caustics span:nth-child(2){background:radial-gradient(circle,rgba(100,60,200,.10) 0%,transparent 65%)}
@keyframes caustic-drift{
  0%  {transform:translate(0,0) scale(1)}
  33% {transform:translate(4vw,3vh) scale(1.06)}
  66% {transform:translate(-3vw,5vh) scale(.96)}
  100%{transform:translate(2vw,-4vh) scale(1.04)}
}

/* Curseur */
#cursor{position:fixed;width:20px;height:20px;border:1.5px solid var(--accent);border-radius:50%;
  pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:opacity .2s;opacity:0}
body:hover #cursor{opacity:1}

/* Progress bar */
#progress{position:fixed;top:0;left:0;height:2px;
  background:linear-gradient(90deg,var(--accent),var(--accent-2));
  z-index:9999;width:0;box-shadow:0 0 8px var(--accent-glow)}

/* Nav */
.nav-2026{
  position:fixed;top:0;left:0;right:0;height:var(--nav-h);z-index:100;
  backdrop-filter:blur(20px) saturate(1.4);-webkit-backdrop-filter:blur(20px) saturate(1.4);
  background:rgba(13,10,26,.72);border-bottom:1px solid var(--border);
  transition:background var(--t),border-color var(--t);
}
[data-theme="light"] .nav-2026{background:rgba(223,247,242,.82)}
.nav-2026__inner{
  max-width:var(--container);margin:0 auto;height:100%;
  display:flex;align-items:center;gap:2rem;padding:0 1.5rem;
}
.nav-2026__logo{font-weight:700;font-size:1.05rem;letter-spacing:.04em;color:var(--text);text-decoration:none;flex-shrink:0}
.nav-2026__logo span{color:var(--accent)}
.nav-2026__links{display:flex;gap:1.8rem;list-style:none;margin-left:auto}
.nav-2026__links a{font-size:.875rem;font-weight:500;color:var(--text-muted);text-decoration:none;transition:color var(--t)}
.nav-2026__links a:hover{color:var(--accent)}
.nav-2026__cta{
  flex-shrink:0;font-size:.8rem;font-weight:600;padding:.5rem 1.1rem;
  border-radius:var(--radius-sm);background:var(--accent);color:#0D0A1A;
  text-decoration:none;transition:opacity var(--t),box-shadow var(--t);
}
.nav-2026__cta:hover{opacity:.88;box-shadow:0 0 20px var(--accent-glow)}
.nav-2026__theme{
  width:36px;height:36px;border-radius:50%;border:1px solid var(--border);
  background:var(--bg-card);color:var(--text);cursor:pointer;
  display:flex;align-items:center;justify-content:center;font-size:1rem;
  transition:background var(--t),border-color var(--t);flex-shrink:0;
}
.nav-2026__theme:hover{background:var(--bg-card-hover);border-color:var(--border-accent)}
.nav-2026__burger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}
.nav-2026__burger span{display:block;width:22px;height:2px;background:var(--text);border-radius:2px;transition:transform var(--t)}
.nav-2026__drawer{display:none;flex-direction:column;gap:.25rem;padding:1rem 1.5rem;border-top:1px solid var(--border);background:var(--bg-layer)}
.nav-2026__drawer a{padding:.75rem .5rem;color:var(--text-muted);text-decoration:none;font-size:.9rem;font-weight:500;border-bottom:1px solid var(--border);transition:color var(--t)}
.nav-2026__drawer a:hover{color:var(--accent)}
.nav-2026__drawer a:last-child{border-bottom:none}
@media(max-width:768px){
  .nav-2026__links,.nav-2026__cta{display:none}
  .nav-2026__burger{display:flex}
  .nav-2026__drawer.is-open{display:flex}
}
.skip-link-2026{position:absolute;top:-100px;left:0;background:var(--accent);color:#0D0A1A;padding:.5rem 1rem;font-size:.875rem;z-index:9999;transition:top .2s}
.skip-link-2026:focus{top:0}

/* Layout */
.stack-2026{position:relative;z-index:1;padding-top:var(--nav-h)}
.container-2026{max-width:var(--container);margin:0 auto;padding:0 1.5rem}

/* Hero */
.hero-2026{position:relative;min-height:calc(100dvh - var(--nav-h));display:flex;align-items:center;overflow:hidden}
.hero-2026__bg{position:absolute;inset:0;z-index:0}
.hero-2026__bg-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;transition:opacity .4s ease}
.hero-2026__bg--dark{opacity:1}
.hero-2026__bg--light{opacity:0}
[data-theme="light"] .hero-2026__bg--dark{opacity:0}
[data-theme="light"] .hero-2026__bg--light{opacity:1}
.hero-2026__vignette{
  position:absolute;inset:0;z-index:1;
  background:
    radial-gradient(ellipse 80% 60% at 20% 50%,transparent 30%,rgba(13,10,26,.65) 100%),
    linear-gradient(180deg,rgba(13,10,26,.2) 0%,rgba(13,10,26,.8) 100%);
}
[data-theme="light"] .hero-2026__vignette{
  background:
    radial-gradient(ellipse 80% 60% at 20% 50%,transparent 30%,rgba(223,247,242,.55) 100%),
    linear-gradient(180deg,rgba(223,247,242,.1) 0%,rgba(223,247,242,.75) 100%);
}
.hero-2026__content{position:relative;z-index:2;padding:5rem 1.5rem 4rem;max-width:min(680px,90vw)}
.hero-2026__whisper{font-family:var(--font-apple-serif);font-size:clamp(.875rem,2vw,1rem);font-style:italic;color:var(--accent);margin-bottom:.75rem;letter-spacing:.02em}
.hero-2026__title{font-family:var(--font-apple-serif);font-size:clamp(2.4rem,6vw,4.5rem);font-weight:700;line-height:1.1;letter-spacing:-.02em;color:var(--text);margin-bottom:1.5rem}

/* Shimmer Pandora */
.shimmer-2026{
  display:inline-block;
  background:linear-gradient(100deg,var(--accent) 0%,var(--accent-2) 40%,var(--accent-mid) 60%,var(--accent) 100%);
  background-size:250% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  animation:shimmer-move 4s linear infinite;
}
@keyframes shimmer-move{0%{background-position:0% center}100%{background-position:250% center}}

.hero-2026__baseline{font-family:var(--font-apple-serif);font-size:clamp(1rem,2.5vw,1.3rem);font-style:italic;color:var(--text-muted);margin-bottom:1rem;line-height:1.5}
.hero-2026__sub{font-size:clamp(.875rem,2vw,1rem);color:var(--text-muted);line-height:1.7;margin-bottom:.75rem;max-width:560px}
.hero-2026__bio{font-size:.8rem;color:var(--text-dim);margin-bottom:2rem;letter-spacing:.02em}
.hero-2026__ctas{display:flex;gap:.75rem;flex-wrap:wrap}
.hero-2026__scroll{
  position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);z-index:2;
  display:flex;flex-direction:column;align-items:center;gap:.35rem;
  font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-dim);
  animation:scroll-bob 2.5s ease-in-out infinite;
}
@keyframes scroll-bob{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(6px)}}

/* Label */
.label-2026{display:inline-block;font-size:.7rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:.75rem}

/* Boutons */
.btn-2026{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.5rem;border-radius:var(--radius-sm);font-size:.875rem;font-weight:600;text-decoration:none;transition:all var(--t);cursor:pointer;border:none;line-height:1}
.btn-2026--primary{background:var(--accent);color:#0D0A1A;box-shadow:0 0 24px rgba(0,229,176,.18)}
.btn-2026--primary:hover{opacity:.88;box-shadow:0 0 36px rgba(0,229,176,.32);transform:translateY(-1px)}
.btn-2026--ghost{background:transparent;color:var(--text);border:1px solid var(--border)}
.btn-2026--ghost:hover{border-color:var(--border-accent);color:var(--accent);transform:translateY(-1px)}

/* Sections */
.section-2026{padding:5rem 0;position:relative;z-index:1}
.section-2026 h2{font-family:var(--font-apple-serif);font-size:clamp(1.8rem,4vw,3rem);font-weight:700;line-height:1.15;letter-spacing:-.02em;margin-bottom:1rem;color:var(--text)}
.section-2026__sub{font-size:1rem;color:var(--text-muted);line-height:1.7;max-width:560px;margin-bottom:3rem}

/* Cards */
.services-2026__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr));gap:1.5rem;margin-top:2.5rem}
.card-2026{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;transition:background var(--t),border-color var(--t),transform var(--t),box-shadow var(--t)}
.card-2026:hover{background:var(--bg-card-hover);border-color:var(--border-accent);transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,.18),0 0 0 1px var(--border-accent)}
.card-2026__visual{position:relative;height:200px;overflow:hidden}
.card-2026__img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease}
.card-2026:hover .card-2026__img{transform:scale(1.03)}
.card-2026__img-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(13,10,26,.7) 100%)}
.card-2026__body{padding:1.5rem}
.card-2026__body h3{font-family:var(--font-apple-serif);font-size:1.25rem;font-weight:700;line-height:1.25;margin-bottom:.75rem;color:var(--text)}
.card-2026__body p{font-size:.875rem;color:var(--text-muted);line-height:1.6;margin-bottom:1rem}
.checklist-2026{list-style:none;display:flex;flex-direction:column;gap:.35rem;margin-bottom:1rem}
.checklist-2026 li{font-size:.8rem;color:var(--text-muted);padding-left:1.1rem;position:relative}
.checklist-2026 li::before{content:"OK";position:absolute;left:0;color:var(--accent);font-size:.75rem}
.card-2026__eco,.card-2026__roi,.card-2026__distance{font-size:.72rem;color:var(--accent);margin-bottom:.75rem}
.card-2026__footer{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border)}
.card-2026__price{font-size:.95rem;font-weight:700;color:var(--text)}
.link-arrow-2026{font-size:.8rem;font-weight:600;color:var(--accent);text-decoration:none}
.link-arrow-2026:hover{text-decoration:underline}

/* Mockup mac */
.mockup-mac-2026,.flow-diagram-2026,.neural-net-2026{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}
.mockup-mac-2026{background:rgba(13,10,26,.85);flex-direction:column}
.mockup-mac-2026__bar{width:90%;height:20px;background:rgba(255,255,255,.06);border-radius:4px 4px 0 0;display:flex;align-items:center;gap:5px;padding:0 8px}
.mockup-mac-2026__bar span{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.25)}
.mockup-mac-2026__screen{width:90%;background:rgba(0,229,176,.05);flex:1;padding:8px;display:flex;flex-direction:column;gap:6px}
.mockup-screen__nav{height:10px;background:rgba(0,229,176,.12);border-radius:3px}
.mockup-screen__hero{height:40px;background:linear-gradient(135deg,rgba(0,229,176,.1),rgba(155,109,255,.1));border-radius:4px}
.mockup-screen__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;flex:1}
.mockup-screen__grid div{background:rgba(255,255,255,.05);border-radius:3px}
.flow-diagram-2026{gap:6px}
.flow-node-2026{width:40px;height:40px;border-radius:8px;border:1px solid rgba(0,229,176,.3);background:rgba(0,229,176,.08);display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:600;color:var(--accent)}
.flow-node-2026--active{background:rgba(0,229,176,.2);border-color:var(--accent);box-shadow:0 0 12px var(--accent-glow)}
.flow-arrow-2026 svg{width:20px;opacity:.5;color:var(--accent)}
.neural-net-2026{width:100%;height:100%;opacity:.6}
.card-2026__badge{position:absolute;bottom:12px;right:12px;display:flex;align-items:center;gap:6px;padding:4px 10px;background:rgba(13,10,26,.8);border:1px solid var(--border-accent);border-radius:20px;font-size:.72rem;font-weight:600;color:var(--accent);backdrop-filter:blur(8px)}
.card-2026__avatar{width:20px;height:20px;border-radius:50%}
.reassurance-2026{text-align:center;margin-top:2.5rem;font-size:.875rem;color:var(--text-dim)}

/* Studio */
.studio-2026__grid{display:flex;align-items:flex-start;gap:3rem;margin-top:3rem}
.studio-2026__member{flex:1;display:flex;gap:1.5rem;align-items:flex-start}
.studio-2026__photo{position:relative;width:110px;flex-shrink:0}
.studio-2026__photo img{width:110px;height:140px;object-fit:cover;border-radius:var(--radius);border:1px solid var(--border)}
.studio-2026__photo-glow{position:absolute;inset:-10px;border-radius:inherit;filter:blur(20px);z-index:-1}
.studio-2026__photo-glow--teal{background:var(--accent-glow)}
.studio-2026__photo-glow--violet{background:var(--accent-2-glow)}
.studio-2026__info h3{font-family:var(--font-apple-serif);font-size:1.4rem;font-weight:700;color:var(--text);margin-bottom:.15rem}
.studio-2026__role{font-size:.75rem;color:var(--accent);letter-spacing:.05em;margin-bottom:.6rem}
.studio-2026__info p{font-size:.875rem;color:var(--text-muted);line-height:1.6;margin-bottom:.75rem}
.studio-2026__skills{list-style:none;display:flex;flex-wrap:wrap;gap:.4rem}
.studio-2026__skills li{font-size:.7rem;font-weight:600;padding:.25rem .6rem;border-radius:20px;border:1px solid var(--border-accent);color:var(--accent);background:var(--accent-glow)}
.studio-2026__separator{display:flex;flex-direction:column;align-items:center;gap:1rem;padding-top:2rem}
.studio-2026__line{width:1px;flex:1;background:var(--border)}
.studio-2026__plus{font-size:1.2rem;color:var(--text-dim);font-weight:300}
@media(max-width:768px){
  .studio-2026__grid{flex-direction:column;gap:2rem}
  .studio-2026__separator{flex-direction:row;padding:0}
  .studio-2026__line{width:auto;height:1px;flex:1}
}

/* Formations */
.formations-2026{background:var(--bg-card)}
.formations-2026__inner{padding-top:5rem;padding-bottom:5rem}
.formations-2026__title{font-family:var(--font-apple-serif);font-size:clamp(1.8rem,4vw,3rem);font-weight:700;letter-spacing:-.02em;color:var(--text);margin-bottom:.75rem}
.formations-2026__subtitle{color:var(--text-muted);margin-bottom:2.5rem;font-size:1rem}
.formations-2026__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr));gap:1.25rem}
.formations-2026__card{position:relative;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.75rem 1.5rem;overflow:hidden;transition:border-color var(--t),box-shadow var(--t),transform var(--t)}
.formations-2026__card:hover{border-color:var(--border-accent);transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,.15)}
.formations-2026__card--featured{border-color:var(--accent-2);background:linear-gradient(135deg,rgba(155,109,255,.08),rgba(0,229,176,.05))}
.formations-2026__badge{display:inline-block;font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);background:var(--accent-glow);border:1px solid var(--border-accent);padding:.2rem .6rem;border-radius:20px;margin-bottom:1rem}
.formations-2026__card-title{font-family:var(--font-apple-serif);font-size:1.2rem;font-weight:700;color:var(--text);margin-bottom:.6rem;line-height:1.25}
.formations-2026__card-title--featured{background:linear-gradient(100deg,var(--accent),var(--accent-2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.formations-2026__body{font-size:.85rem;color:var(--text-muted);line-height:1.6;margin-bottom:.75rem}
.formations-2026__format{font-size:.72rem;color:var(--text-dim);margin-bottom:.5rem;font-style:italic}
.formations-2026__price{font-size:1.4rem;font-weight:700;color:var(--text);margin-bottom:.2rem}
.formations-2026__price-note{font-size:.7rem;color:var(--text-dim);margin-bottom:1rem}
.formations-2026__highlights{margin-bottom:1rem}
.formations-2026__highlight{font-size:.8rem;color:var(--text-muted);padding:.35rem 0;border-bottom:1px solid var(--border)}
.formations-2026__cta{display:inline-block;width:100%;text-align:center;padding:.7rem;border-radius:var(--radius-sm);font-size:.8rem;font-weight:600;text-decoration:none;transition:all var(--t);position:relative;z-index:1}
.formations-2026__cta--outline{border:1px solid var(--border-accent);color:var(--accent);background:transparent}
.formations-2026__cta--outline:hover{background:var(--accent-glow)}
.formations-2026__cta--solid{background:var(--accent);color:#0D0A1A;border:none;box-shadow:0 0 20px var(--accent-glow)}
.formations-2026__cta--solid:hover{opacity:.88;box-shadow:0 0 32px var(--accent-glow)}
.formations-2026__note{font-size:.68rem;color:var(--text-dim);margin-top:.5rem;text-align:center}
.formations-2026__fill{position:absolute;inset:0;background:linear-gradient(135deg,var(--accent-glow),var(--accent-2-glow));opacity:0;transition:opacity var(--t);z-index:0}
.formations-2026__card:hover .formations-2026__fill{opacity:1}

/* Mental */
.mental-2026__visual{position:relative;border-radius:var(--radius-lg);overflow:hidden;margin-bottom:3rem;height:300px}
.mental-2026__visual img{width:100%;height:100%;object-fit:cover}
.mental-2026__overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(13,10,26,.75) 0%,rgba(0,229,176,.08) 100%)}
.mental-2026__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2rem;margin-bottom:2.5rem}
.mental-2026__block{padding:1.5rem;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);transition:border-color var(--t)}
.mental-2026__block:hover{border-color:var(--border-accent)}
.mental-2026__number{font-family:var(--font-apple-serif);font-size:2.8rem;font-weight:700;color:var(--accent);line-height:1;margin-bottom:.5rem}
.mental-2026__label{font-size:.8rem;font-weight:600;color:var(--text);margin-bottom:.5rem;line-height:1.4}
.mental-2026__source{display:block;font-size:.68rem;font-weight:400;color:var(--text-dim);font-style:italic}
.mental-2026__desc{font-size:.8rem;color:var(--text-muted);line-height:1.5;margin-bottom:.5rem}
.mental-2026__solution{font-size:.75rem;font-weight:600;color:var(--accent-2)}
.mental-2026__conclusion{font-family:var(--font-apple-serif);font-size:clamp(1.1rem,2.5vw,1.5rem);font-style:italic;color:var(--text);text-align:center;margin-bottom:2rem;line-height:1.5}
.mental-2026__cta{text-align:center}

/* Eco */
.eco-2026__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:2rem;margin-top:2.5rem}
.eco-2026__block{text-align:center;padding:2rem 1.5rem;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);transition:border-color var(--t),transform var(--t)}
.eco-2026__block:hover{border-color:var(--border-accent);transform:translateY(-2px)}
.eco-2026__icon{display:flex;justify-content:center;margin-bottom:1rem}
.eco-2026__block h3{font-size:1rem;font-weight:600;color:var(--text);margin-bottom:.5rem}
.eco-2026__block p{font-size:.825rem;color:var(--text-muted);line-height:1.5}
.eco-2026__stat{font-size:1.8rem;font-weight:700;color:var(--accent)!important;display:block;margin-bottom:.25rem}

/* Demos */
.demos-2026__live{display:inline-flex;align-items:center;gap:.4rem;font-size:.72rem;font-weight:600;color:var(--accent);letter-spacing:.06em;text-transform:uppercase;margin-bottom:1.5rem}
.demos-2026__live-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);animation:pulse-dot 2s ease-in-out infinite}
@keyframes pulse-dot{0%,100%{box-shadow:0 0 0 0 var(--accent-glow)}50%{box-shadow:0 0 0 6px rgba(0,229,176,0)}}
.demos-2026__track{display:flex;gap:1.5rem;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:thin;scrollbar-color:var(--border) transparent;padding-bottom:1rem}
.demo-2026__slide{flex:0 0 min(90vw,600px);scroll-snap-align:start;display:flex;flex-direction:column;gap:1.25rem}
.demo-2026__device{position:relative;height:320px}
.device-2026__mac{position:absolute;inset:0 60px 0 0;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.device-2026__screen{width:100%;height:100%;position:relative}
.device-2026__screen img{width:100%;height:100%;object-fit:cover}
.device-2026__overlay--pandora{position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,229,176,.06),rgba(155,109,255,.06));mix-blend-mode:overlay}
.device-2026__phone{position:absolute;right:0;bottom:0;width:80px;height:160px;background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:14px;overflow:hidden}
.device-2026__phone-screen{width:100%;height:100%}
.device-2026__phone-screen img{width:100%;height:100%;object-fit:cover}
.demo-2026__info{padding:0 .25rem}
.demo-2026__info h3{font-family:var(--font-apple-serif);font-size:1.3rem;font-weight:700;color:var(--text);margin-bottom:.4rem}
.demo-2026__info p{font-size:.85rem;color:var(--text-muted);margin-bottom:.75rem;line-height:1.5}
.demo-2026__tags{display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.75rem}
.demo-2026__tags span{font-size:.68rem;font-weight:600;padding:.2rem .6rem;border-radius:20px;border:1px solid var(--border-accent);color:var(--accent);background:var(--accent-glow)}

/* Animations */
.anim-fade-hero,.anim-up,.anim-fade,.anim-scale,.anim-scale-hero{opacity:0;animation-fill-mode:forwards;animation-play-state:paused}
.anim-fade-hero {animation:fade-in .6s ease var(--delay,0ms) forwards}
.anim-scale-hero{animation:scale-in .6s cubic-bezier(.34,1.56,.64,1) var(--delay,0ms) forwards}
.anim-up        {animation:slide-up .55s ease var(--delay,0ms) forwards}
.anim-fade      {animation:fade-in .5s ease var(--delay,0ms) forwards}
.anim-scale     {animation:scale-in .5s cubic-bezier(.34,1.56,.64,1) var(--delay,0ms) forwards}
@keyframes fade-in {to{opacity:1}}
@keyframes slide-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes scale-in{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}
.hero-2026 .anim-fade-hero,.hero-2026 .anim-scale-hero{animation-play-state:running}

.formations-2026__reveal{opacity:0;transform:translateY(16px);transition:opacity .5s ease var(--fdelay,0ms),transform .5s ease var(--fdelay,0ms)}
.formations-2026__reveal.is-visible{opacity:1;transform:none}

.img-filter{transition:filter var(--t)}
[data-theme="light"] .img-filter{filter:brightness(1.05) saturate(.9)}

@media(max-width:390px){
  .hero-2026__content{padding:3rem 1rem 3rem}
  .section-2026{padding:3.5rem 0}
  .btn-2026{padding:.65rem 1.1rem;font-size:.8rem}
}
'@

[System.IO.File]::WriteAllText($CSS_FILE, $CSS, [System.Text.Encoding]::UTF8)
Write-Host "OK home-2026.css ecrit" -ForegroundColor Green

# 3. JS Pandora
Write-Host "... Ecriture pandora-fx.js" -ForegroundColor Cyan
$JS = @'
/* pandora-fx.js -- Pinapp Studio -- Bioluminescence Pandora */
(function(){
  'use strict';
  const canvas=document.getElementById('particles');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const COLS=['#00E5B0','#9B6DFF','#7FFFD4','#C084FC','#ADFFF0','#B8FFEA'];
  const light=()=>document.documentElement.dataset.theme==='light';
  let W,H,pts=[];
  const N=()=>window.innerWidth<600?55:115;
  class P{
    constructor(){this.reset(true)}
    reset(init){
      this.x=Math.random()*W;
      this.y=init?Math.random()*H:H+10;
      this.r=Math.random()*1.8+.4;
      this.vx=(Math.random()-.5)*.25;
      this.vy=-(Math.random()*.35+.08);
      this.a=Math.random()*.55+.15;
      this.col=COLS[Math.floor(Math.random()*COLS.length)];
      this.t=0;this.max=Math.random()*400+200;
    }
    tick(){
      this.x+=this.vx+Math.sin(this.t*.012)*.18;
      this.y+=this.vy;this.t++;
      if(this.y<-10||this.t>this.max)this.reset(false);
    }
    draw(){
      const p=this.t/this.max;
      const a=this.a*(p<.15?p/.15:p>.75?(1-p)/.25:1)*(light()?.45:1);
      if(a<=0)return;
      ctx.save();ctx.globalAlpha=a;ctx.shadowBlur=10;ctx.shadowColor=this.col;ctx.fillStyle=this.col;
      ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill();ctx.restore();
    }
  }
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
  function init(){resize();pts=Array.from({length:N()},()=>new P())}
  function loop(){
    ctx.clearRect(0,0,W,H);
    const n=N();
    while(pts.length<n)pts.push(new P());
    if(pts.length>n+10)pts.length=n;
    pts.forEach(p=>{p.tick();p.draw()});
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize',resize,{passive:true});
  init();loop();

  /* Curseur */
  const cur=document.getElementById('cursor');
  if(cur&&window.matchMedia('(pointer:fine)').matches){
    let mx=-100,my=-100,cx=-100,cy=-100;
    document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
    (function anim(){cx+=(mx-cx)*.15;cy+=(my-cy)*.15;cur.style.transform=`translate(${cx-10}px,${cy-10}px)`;requestAnimationFrame(anim)})();
  }

  /* Progress */
  const bar=document.getElementById('progress');
  if(bar)window.addEventListener('scroll',()=>{
    const s=document.documentElement.scrollTop;
    const h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=h>0?(s/h*100)+'%':'0';
  },{passive:true});

  /* Theme toggle */
  const btn=document.querySelector('.nav-2026__theme');
  if(btn){
    const stored=localStorage.getItem('pinapp-theme')||'dark';
    if(stored==='light')document.documentElement.dataset.theme='light';
    btn.textContent=stored==='light'?'☀️':'🌙';
    btn.addEventListener('click',()=>{
      const next=document.documentElement.dataset.theme==='light'?'dark':'light';
      document.documentElement.dataset.theme=next==='dark'?'':'light';
      localStorage.setItem('pinapp-theme',next);
      btn.textContent=next==='light'?'☀️':'🌙';
    });
  }

  /* Burger */
  const burger=document.querySelector('.nav-2026__burger');
  const drawer=document.getElementById('navDrawer');
  if(burger&&drawer){
    burger.addEventListener('click',()=>{
      const open=drawer.classList.toggle('is-open');
      burger.setAttribute('aria-expanded',String(open));
      drawer.setAttribute('aria-hidden',String(!open));
    });
  }

  /* Count-up */
  if('IntersectionObserver' in window){
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(({target,isIntersecting})=>{
        if(!isIntersecting)return;
        const end=parseInt(target.dataset.target,10);
        let cur2=0;const inc=end/(1600/16);
        const id=setInterval(()=>{
          cur2=Math.min(cur2+inc,end);
          target.textContent=Math.floor(cur2).toLocaleString('fr-FR');
          if(cur2>=end)clearInterval(id);
        },16);
        obs.unobserve(target);
      });
    },{threshold:.4});
    document.querySelectorAll('.count-up').forEach(el=>obs.observe(el));
  }

  /* Reveal scroll */
  if('IntersectionObserver' in window){
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(({target,isIntersecting})=>{
        if(!isIntersecting)return;
        target.style.animationPlayState='running';
        target.classList.add('is-visible');
        obs.unobserve(target);
      });
    },{threshold:.12});
    document.querySelectorAll('.anim-up,.anim-fade,.anim-scale,.formations-2026__reveal').forEach(el=>obs.observe(el));
  }
})();
'@

[System.IO.File]::WriteAllText($JS_FILE, $JS, [System.Text.Encoding]::UTF8)
Write-Host "OK pandora-fx.js ecrit" -ForegroundColor Green

# 4. Patch index.html (vitrine : chemins absolus + home-2026 lie)
Write-Host "... Verification index.html" -ForegroundColor Cyan
if(Test-Path $INDEX){
  $html=[System.IO.File]::ReadAllText($INDEX,[System.Text.Encoding]::UTF8)
  $changed=$false
  if($html -notmatch 'home-2026\.css'){
    $needle = '<link rel="stylesheet" href="/style.css'
    $idx = $html.IndexOf($needle)
    if ($idx -ge 0) {
      $end = $html.IndexOf('/>', $idx)
      if ($end -ge 0) {
        $end += 2
        $html = $html.Insert($end, "`n    <link rel=`"stylesheet`" href=`"/assets/css/home-2026.css?v=1`" />")
        $changed = $true
        Write-Host "OK home-2026.css lie dans index.html" -ForegroundColor Green
      }
    }
  }
  if($html -match 'src="assets/js/pandora-fx'){
    $html=$html -replace 'src="assets/js/pandora-fx\.js[^"]*"','src="/assets/js/pandora-fx.js?v=1"'
    $changed=$true
    Write-Host "OK pandora-fx.js passe en chemin absolu" -ForegroundColor Green
  }
  if($html -notmatch 'pandora-fx\.js'){
    $html=$html -replace '(</body>)','<script src="/assets/js/pandora-fx.js?v=1" defer></script>$1'
    $changed=$true
    Write-Host "OK pandora-fx.js injecte dans index.html" -ForegroundColor Green
  }
  if($changed){
    [System.IO.File]::WriteAllText($INDEX,$html,[System.Text.Encoding]::UTF8)
  }elseif($html -match 'pandora-fx\.js'){
    Write-Host "i index.html deja a jour (pandora-fx + home-2026)" -ForegroundColor Yellow
  }
}

# 5. Deploy SFTP
$skipDeploy = $SkipDeploy -or ($env:PINAPP_SKIP_DEPLOY -match '^(1|true|yes)$')
if ($skipDeploy) {
    Write-Host "`n... DEPLOY Hostinger [SKIP] (-SkipDeploy ou PINAPP_SKIP_DEPLOY=1)" -ForegroundColor Yellow
    Write-Host '   Locaux : assets\css\home-2026.css ; assets\js\pandora-fx.js ; index.html' -ForegroundColor DarkGray
    Write-Host '   Pour SFTP : relancer sans skip, ou WinSCP manuel / Hostinger File Manager.' -ForegroundColor DarkGray
} else {
    Write-Host "`n... DEPLOY Hostinger" -ForegroundColor Cyan
    $ENV_FILE=Join-Path $env:USERPROFILE ".pinapp-fr-env.ps1"
    $H=$null;$U=$null;$PW=$null;$RP="/public_html"

    if(Test-Path $ENV_FILE){
      Write-Host "OK Credentials trouves" -ForegroundColor Green
      . $ENV_FILE
      foreach($n in 'SFTP_HOST','FTP_HOST','HOSTINGER_HOST','HOST_FTP'){$v=Get-Variable $n -EA SilentlyContinue;if($v){$H=$v.Value;break}}
      foreach($n in 'SFTP_USER','FTP_USER','HOSTINGER_USER','USER_FTP'){$v=Get-Variable $n -EA SilentlyContinue;if($v){$U=$v.Value;break}}
      foreach($n in 'SFTP_PASS','FTP_PASS','HOSTINGER_PASS','PASS_FTP'){$v=Get-Variable $n -EA SilentlyContinue;if($v){$PW=$v.Value;break}}
      foreach($n in 'SFTP_PATH','REMOTE_PATH','FTP_PATH'){$v=Get-Variable $n -EA SilentlyContinue;if($v){$RP=$v.Value;break}}
    }else{
      Write-Host "i Saisie manuelle" -ForegroundColor Yellow
    }

    if(-not $H){$H=Read-Host "  Hote SFTP Hostinger"}
    if(-not $U){$U=Read-Host "  Utilisateur SFTP"}
    if(-not $PW){
      $sec=Read-Host "  Mot de passe SFTP" -AsSecureString
      $PW=[Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
    }
    if(-not(Test-Path $ENV_FILE)){
      $save=Read-Host "  Sauvegarder credentials ? (o/n)"
      if($save -eq 'o'){
        @"
`$SFTP_HOST='$H'
`$SFTP_USER='$U'
`$SFTP_PASS='$PW'
`$SFTP_PATH='$RP'
"@ | Set-Content $ENV_FILE -Encoding UTF8
        Write-Host "OK Credentials sauvegardes" -ForegroundColor Green
      }
    }

    $WINSCP=@("C:\Program Files (x86)\WinSCP\WinSCP.com","C:\Program Files\WinSCP\WinSCP.com","$env:LOCALAPPDATA\Programs\WinSCP\WinSCP.com") | Where-Object{Test-Path $_} | Select-Object -First 1

    if($WINSCP){
      Write-Host "OK WinSCP - upload (log diagnostic)..." -ForegroundColor Green
      $TMP=Join-Path $env:TEMP "pandora-deploy.txt"
      $WLOG=Join-Path $env:TEMP ("winscp-pandora-design-{0:yyyyMMdd-HHmmss}.log" -f (Get-Date))
      $winScpScript = @"
option batch abort
option confirm off
open sftp://${U}:${PW}@${H}/ -hostkey=*
put `"$CSS_FILE`" `"${RP}/assets/css/home-2026.css`"
put `"$JS_FILE`" `"${RP}/assets/js/pandora-fx.js`"
put `"$INDEX`" `"${RP}/index.html`"
exit
"@
      $winScpScript | Set-Content $TMP -Encoding UTF8
      & $WINSCP @("/log=$WLOG", "/script=$TMP")
      Remove-Item $TMP -Force
      Write-Host "   Log WinSCP : $WLOG" -ForegroundColor DarkGray
      if($LASTEXITCODE -eq 0){Write-Host "`nOK Deploy reussi ! -> https://pinapp.fr" -ForegroundColor Green}
      else{Write-Host "`nWARN Erreur WinSCP ($LASTEXITCODE) - voir le log WinSCP ci-dessus." -ForegroundColor Red}
    }else{
      $PS1=Join-Path $ROOT "pinapp.ps1"
      if(Test-Path $PS1){
        Write-Host "i WinSCP absent - tentative pinapp.ps1 fr-auto" -ForegroundColor Yellow
        & powershell -NoProfile -ExecutionPolicy Bypass -File $PS1 fr-auto
      }else{
        Write-Host @"
WARN WinSCP non trouve.
     Installer : https://winscp.net/eng/download.php puis relancer.
     Ou upload manuel via Hostinger File Manager :
       assets/css/home-2026.css
       assets/js/pandora-fx.js
       index.html
"@ -ForegroundColor Yellow
      }
    }
}

Write-Host "`nOK Pandora design termine." -ForegroundColor Cyan
Write-Host "   Backup   : assets\css\home-2026.backup.$DATE.css" -ForegroundColor DarkGray
Write-Host "   Rollback : Copy-Item assets\css\home-2026.backup.$DATE.css assets\css\home-2026.css`n" -ForegroundColor DarkGray
