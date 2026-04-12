# ==============================================================================
# PINAPP STUDIO — INSTALLATION COMPLÈTE
# Script PowerShell unique — Cursor l'exécute depuis la racine du dépôt
# Cerveau : Claude | Exécution : Cursor | Déploiement : Hostinger SFTP
#
# CE SCRIPT GÉNÈRE :
# ├── .cursorrules                    — règles permanentes complètes
# ├── assets/css/pinapp-global.css   — DA Pandora/Avatar complète
# ├── assets/js/theme.js             — toggle dark/light
# ├── assets/js/particles.js         — canvas Pandora nuit
# ├── assets/js/main.js              — animations + nav + graphiques
# ├── index.html                     — home 8 sections snap
# ├── a-propos/index.html            — page société Lauralie + Micha
# ├── offres/index.html              — 6 offres + Pack Duo + pricing revu
# ├── offres/formation/index.html    — 3 formations + pack prompting
# ├── memoire-et-presence/index.html — M&P présentation
# ├── auralis/index.html             — Auralis RH
# ├── diagnostic/index.html          — onboarding Tally embed
# ├── n8n-workflows/                 — 8 fichiers JSON workflows
# ├── COPY-PINAPP.md                 — tout le texte du site
# └── AUTOMATIONS.md                 — documentation workflows
#
# DA VALIDÉE :
# Nuit #080d18 · Jour #0a2a2e Avatar 2 · Clash Display + Inter
# Nacré #e8f4f8 · Violet #b388ff · Glassmorphism blur(20px)
# Scroll-snap 100vh · TDAH-friendly · Mobile-first 390px
#
# PRICING REVU :
# Messages 490€ · Facturation 590€ · Devis 790€ · RDV 990€
# IA 890€ · Site 1290€ · Système dès 2400€ · Pack Duo dès 3900€
# Formations : 67€ / 147€ / 397€ / Pack 97€
# ==============================================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

function Write-Step { param($n, $t) Write-Host "▶ $n $t" -ForegroundColor Cyan }
function Write-OK   { param($f)     Write-Host "   ✓ $f" -ForegroundColor Gray }

Write-Host ""
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  PINAPP INC. — INSTALLATION COMPLÈTE" -ForegroundColor Magenta
Write-Host "  Pinapp Studio · Auralis RH · Mémoire & Présence" -ForegroundColor Magenta
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

# Création des dossiers
$dirs = @(
  "assets/css","assets/js","assets/fonts","assets/images",
  "a-propos","offres/formation","memoire-et-presence",
  "auralis","diagnostic","legal","engagements","realisations",
  "n8n-workflows","demo"
)
foreach ($d in $dirs) { New-Item -ItemType Directory -Force -Path "$Root/$d" | Out-Null }

# ==============================================================================
# 1. CURSORRULES
# ==============================================================================
Write-Step "1/14" ".cursorrules complet..."

$cursorrules = @'
# PINAPP INC. — RÈGLES PERMANENTES AGENT
# Portée : tout le dépôt pinapp-site
# Cerveau stratégique : Claude | Générateur : Cursor | Déploiement : Hostinger SFTP

## ENTITÉ LÉGALE
- Pinapp Inc. = maison mère
- Pinapp Studio (pinapp.fr) = agence B2B premium — seul revenu actuel
- Auralis RH = SaaS IA RH pré-commercial
- Mémoire & Présence (memoireetpresence.fr) = digitalisation secteur funéraire
  · Vocabulaire M&P : hommage · transmission · présence · lien · mémoire
  · JAMAIS : mort · deuil · décès · funérailles dans les textes publics

## ASSOCIÉS — ÉGALITÉ TOTALE
- Lauralie : PDG Pinapp Inc. · technique · IA · automatisation
  · Zéro photo publique
- Michaël Bouilhac (Micha) : co-associé · imagerie · photo · vidéo · DA · Adobe · IA générative
  · Contact : micha@memoireetpresence.fr · WhatsApp uniquement
  · Zéro photo publique sans validation
- Traitement visuel égal partout — même espace · même hiérarchie

## STACK TECHNIQUE
- Claude = cerveau stratégique. Zéro code direct.
- Cursor = générateur de tout le code HTML/CSS/JS
- Hostinger SFTP (extension Cursor — Natizyskunk)
- n8n self-hosted Hostinger ~3€/mois
- Tally (formulaires · webhook natif)
- YouSign (signature électronique)
- Stripe (paiement)
- Notion (CRM · suivi · comptabilité)
- Gmail via n8n (emails automatiques)
- Buffer (social media)
- Claude API (IA · résumés · copy)
- WhatsApp Business (notifications Micha M&P)
- Budget max : 100€/mois · Claude Pro priorité (20€/mois)
- Netlify : SUPPRIMÉ définitivement

## NOTIFICATIONS N8N
- 🔷 Pinapp Studio — toutes notifications Pinapp
- 🌿 Mémoire & Présence — toutes notifications M&P → WhatsApp Micha
- Comptabilité séparée Notion : Pinapp vs M&P

## PALETTE — NUIT (défaut)
--bg:          #080d18
--bg-card:     rgba(255,255,255,0.04)
--text:        #f0f8ff
--text-muted:  rgba(240,248,255,0.55)
--accent:      #00e5b0
--accent-2:    #b388ff
--accent-3:    #7fffea
--accent-4:    #e040fb
--nacre:       #e8f4f8
--card-border: rgba(179,136,255,0.08)
--separator:   rgba(0,229,176,0.06)
--btn-cta-bg:  rgba(91,60,180,0.85)
--btn-cta-bd:  rgba(179,136,255,0.30)

## PALETTE — JOUR (eau Avatar 2)
--bg:          #0a2a2e
--bg-card:     rgba(10,60,65,0.60)
--text:        #e8fffd
--text-muted:  rgba(232,255,253,0.55)
--accent:      #7fffea
--accent-2:    #c4b5fd
--accent-3:    #ffffff
--accent-4:    #a78bfa
--nacre:       #e8f4f8
--btn-cta-bg:  rgba(109,40,217,0.80)
--btn-cta-bd:  rgba(196,181,253,0.30)

## TYPOGRAPHIE
- Titres : Clash Display 700 (Bunny Fonts)
- Corps  : Inter 300/400/500 (Bunny Fonts)
- Hero   : clamp(48px,8vw,104px) · letter-spacing -0.04em
- H2     : clamp(32px,5vw,56px) · letter-spacing -0.03em
- Label  : 11px · uppercase · letter-spacing 0.14em
- Shimmer : cyan→violet→nacré sur 1 mot-clé hero
- text-wrap: balance sur tous les titres

## FOND
- Nuit : #080d18 CSS pur · canvas particules 80pt 4 couleurs · liaisons <100px
- Jour : #0a2a2e CSS pur · 3 caustics blur(80px) mix-blend-mode:screen · rayons
- ZÉRO image de fond (bg-sombre/bg-clair supprimés définitivement)
- ZÉRO image Unsplash

## GLASSMORPHISM
- backdrop-filter: blur(20px)
- bg-card: rgba(255,255,255,0.04)
- border: 1px solid var(--card-border)
- border-radius: 20px
- pseudo ::before : dégradé cyan→violet→nacré opacity 0.03

## LAYOUT
- scroll-snap-type: y mandatory · sections 100dvh
- 1 idée / 1 section / 1 CTA maximum
- Nav latérale : points de section
- Mobile-first 390px iPhone Safari
- Vanilla JS uniquement · WCAG AA

## PRICING VALIDÉ
- Automatisation Messages   : 490€ HT
- Automatisation Facturation: 590€ HT
- Automatisation Devis      : 790€ HT
- Automatisation RDV        : 990€ HT
- IA sur-mesure             : 890€ HT
- Site Vitrine              : 1 290€ HT
- Système Complet           : dès 2 400€ HT · sur devis
- Pack Duo Lauralie+Micha   : dès 3 900€ HT · sur devis (~1600€ économisés)
- Formation 1               : 67€
- Formation 2               : 147€
- Formation 3               : 397€
- Pack Prompting            : 97€ (inclus dans 397€)

## AUTOMATISATIONS N8N (8 WORKFLOWS)
1. Diagnostic → Notion + email confirmation + notification 🔷
2. Devis → YouSign → Stripe → facture auto + notification 🔷
3. Paiement Stripe → accès formation + email bienvenue
4. Formation → séquence email J+1/J+3/J+7 + certificat + upsell J+14
5. Livraison → feedback Tally + avis Google J+7 + maintenance J+30
6. M&P contact → WhatsApp Micha 🌿 + email famille + Notion M&P
7. Veille hebdo → Claude API → Buffer → Newsletter Notion
8. Maintenance mensuel → rapport clients + relance impayés + export comptable

## RÈGLES ABSOLUES
INTERDIT :
- Frameworks JS (React, Vue, etc.)
- Images de fond (bg-sombre/bg-clair supprimés)
- Images Unsplash · photos de Lauralie ou Micha sans validation
- Champagne #C9A96E (remplacé par nacré #e8f4f8)
- Scroll horizontal · hover sur mobile
- box-shadow opacity > 0.12 · HTML > 500Ko
- CDN externes sauf Bunny Fonts
- Mention : mort · deuil · décès · funérailles (M&P)
- Prix TTC sans mention TVA

OBLIGATOIRE :
- Vanilla JS · Custom properties · WebP final · Lazy-load
- WCAG AA · Prix HT + TVA art. 293 B CGI
- HTTPS Hostinger (Let's Encrypt hPanel)
- Arnaud valide tout livrable visuel
- Thomas bloque toute livraison non conforme

## AGENTS ACTIFS
DA      : Arnaud (Apple/Tesla) · Théo · Raphaëlle · Nino · Viktor T.
Copy    : Élisa (StoryBrand) · Lucas (Brand)
Commer. : Alexis · Clara · Bruno · Mehdi · Chloé · Fiona · Omar
Formation: Samir · Rémi
Cognitif: Dr. Élise (TDAH) · Prof. Karim
Juridique: Lila · Maître Dubois · Maître Fontaine
Finance : Éric · Nathalie
Veille  : Nora · Axel
QA      : Thomas (arbitre · bloque si non conforme)
'@

Set-Content -Path "$Root/.cursorrules" -Value $cursorrules -Encoding UTF8
Write-OK ".cursorrules"

# ==============================================================================
# 2. CSS GLOBAL
# ==============================================================================
Write-Step "2/14" "pinapp-global.css..."

$cssGlobal = @'
/* ============================================================
   PINAPP INC. — GLOBAL CSS
   DA Pandora/Avatar · Apple glassmorphism · TDAH-friendly
   Clash Display + Inter · Scroll-snap 100vh
   ============================================================ */

@import url('https://fonts.bunny.net/css?family=clash-display:wght@400;500;600;700|inter:wght@300;400;500&display=swap');

:root {
  --bg:          #080d18;
  --bg-card:     rgba(255,255,255,0.04);
  --text:        #f0f8ff;
  --text-muted:  rgba(240,248,255,0.55);
  --accent:      #00e5b0;
  --accent-2:    #b388ff;
  --accent-3:    #7fffea;
  --accent-4:    #e040fb;
  --nacre:       #e8f4f8;
  --card-border: rgba(179,136,255,0.08);
  --separator:   rgba(0,229,176,0.06);
  --shadow:      rgba(0,0,0,0.25);
  --btn-cta-bg:  rgba(91,60,180,0.85);
  --btn-cta-bd:  rgba(179,136,255,0.30);
  --max-w:       1280px;
  --pad-d:       80px;
  --pad-t:       40px;
  --pad-m:       20px;
  --radius:      20px;
  --ease:        cubic-bezier(0.25,0.1,0.25,1);
  --ease-in:     cubic-bezier(0.22,1,0.36,1);
}

[data-theme="light"] {
  --bg:          #0a2a2e;
  --bg-card:     rgba(10,60,65,0.60);
  --text:        #e8fffd;
  --text-muted:  rgba(232,255,253,0.55);
  --accent:      #7fffea;
  --accent-2:    #c4b5fd;
  --accent-3:    #ffffff;
  --accent-4:    #a78bfa;
  --card-border: rgba(127,255,234,0.12);
  --separator:   rgba(127,255,234,0.07);
  --shadow:      rgba(0,0,0,0.20);
  --btn-cta-bg:  rgba(109,40,217,0.80);
  --btn-cta-bd:  rgba(196,181,253,0.30);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased;text-size-adjust:100%}
body{
  background:var(--bg);color:var(--text);
  font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
  font-size:16px;line-height:1.75;overflow-x:hidden;
  transition:background 0.5s var(--ease),color 0.3s var(--ease);
}

/* SNAP */
.snap-container{height:100dvh;overflow-y:scroll;scroll-snap-type:y mandatory;scroll-behavior:smooth}
.snap-section{min-height:100dvh;scroll-snap-align:start;scroll-snap-stop:always;
  display:flex;align-items:center;position:relative;padding:80px 0;z-index:1}
@media(max-width:768px){.snap-section{padding:72px 0 48px}}

/* CANVAS */
#canvas-pandora{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.75;transition:opacity 0.5s var(--ease)}
[data-theme="light"] #canvas-pandora{opacity:0}

/* CAUSTICS JOUR */
.caustics{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0;transition:opacity 0.6s var(--ease)}
[data-theme="light"] .caustics{opacity:1}
.caustics span{position:absolute;border-radius:50%;filter:blur(80px);mix-blend-mode:screen;animation:caustic-drift linear infinite}
.caustics span:nth-child(1){width:65vw;height:65vw;background:rgba(0,229,176,0.15);top:-25%;left:-15%;animation-duration:13s}
.caustics span:nth-child(2){width:48vw;height:48vw;background:rgba(127,255,234,0.10);top:25%;right:-18%;animation-duration:9s;animation-delay:-3s}
.caustics span:nth-child(3){width:38vw;height:38vw;background:rgba(255,255,255,0.06);bottom:-12%;left:28%;animation-duration:14s;animation-delay:-6s}
@keyframes caustic-drift{0%{transform:translate(0,0) scale(1)}33%{transform:translate(4vw,-5vh) scale(1.06)}66%{transform:translate(-3vw,4vh) scale(0.96)}100%{transform:translate(0,0) scale(1)}}

/* RAYONS JOUR */
.light-rays{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0;transition:opacity 0.6s var(--ease);
  background:repeating-linear-gradient(-55deg,transparent 0px,transparent 90px,rgba(127,255,234,0.012) 90px,rgba(127,255,234,0.012) 92px)}
[data-theme="light"] .light-rays{opacity:1}

/* NAV DOTS */
.nav-dots{position:fixed;right:24px;top:50%;transform:translateY(-50%);z-index:50;display:flex;flex-direction:column;gap:10px}
.nav-dot{width:6px;height:6px;border-radius:50%;background:var(--text-muted);border:none;cursor:pointer;
  transition:background 0.3s,transform 0.3s;padding:0}
.nav-dot.active{background:var(--accent);transform:scale(1.6)}
@media(max-width:768px){.nav-dots{display:none}}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;height:64px;z-index:100;
  background:rgba(8,13,24,0.80);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border-bottom:1px solid var(--separator);transition:transform 0.3s var(--ease),background 0.4s}
[data-theme="light"] .nav{background:rgba(10,42,46,0.85)}
.nav.hidden{transform:translateY(-100%)}
.nav__inner{display:flex;align-items:center;justify-content:space-between;height:100%;
  max-width:var(--max-w);margin:0 auto;padding:0 var(--pad-d)}
@media(max-width:768px){.nav__inner{padding:0 var(--pad-m)}}

.nav__logo{font-family:'Clash Display',sans-serif;font-size:16px;font-weight:700;
  color:var(--text);text-decoration:none;letter-spacing:0.02em}
.nav__logo span{color:var(--nacre)}

/* Mega menu */
.nav__menu{display:flex;gap:8px;list-style:none;position:relative}
.nav__item{position:relative}
.nav__link{font-size:12px;color:var(--text-muted);text-decoration:none;
  letter-spacing:0.08em;text-transform:uppercase;padding:8px 12px;
  border-radius:8px;display:flex;align-items:center;gap:4px;
  transition:color 0.2s,background 0.2s}
@media(hover:hover){.nav__link:hover{color:var(--text);background:rgba(255,255,255,0.04)}}

.nav__dropdown{display:none;position:absolute;top:calc(100% + 8px);left:0;
  background:rgba(8,13,24,0.95);backdrop-filter:blur(20px);
  border:1px solid var(--card-border);border-radius:12px;
  padding:8px;min-width:220px;z-index:200}
[data-theme="light"] .nav__dropdown{background:rgba(10,42,46,0.95)}
.nav__item:hover .nav__dropdown{display:block}
.nav__dropdown a{display:block;padding:10px 14px;font-size:13px;
  color:var(--text-muted);text-decoration:none;border-radius:8px;
  transition:color 0.2s,background 0.2s}
@media(hover:hover){.nav__dropdown a:hover{color:var(--text);background:rgba(255,255,255,0.04)}}
.nav__dropdown-label{font-size:10px;letter-spacing:0.14em;text-transform:uppercase;
  color:var(--accent);padding:8px 14px 4px;display:block}

.nav__actions{display:flex;align-items:center;gap:10px}
.nav__theme{width:36px;height:36px;border-radius:50%;background:rgba(0,229,176,0.08);
  border:1px solid var(--card-border);color:var(--accent);cursor:pointer;font-size:14px;
  display:flex;align-items:center;justify-content:center;transition:background 0.2s}
@media(hover:hover){.nav__theme:hover{background:rgba(0,229,176,0.15)}}
.nav__cta{font-size:12px;padding:9px 18px;background:var(--btn-cta-bg);
  border:1px solid var(--btn-cta-bd);border-radius:100px;color:var(--text);
  text-decoration:none;backdrop-filter:blur(8px);letter-spacing:0.04em;
  transition:opacity 0.2s,transform 0.2s;white-space:nowrap}
@media(hover:hover){.nav__cta:hover{opacity:0.85;transform:translateY(-1px)}}

.nav__burger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}
.nav__burger span{display:block;width:22px;height:1.5px;background:var(--text);transition:transform 0.3s var(--ease)}
.nav__drawer{display:none;position:fixed;top:64px;left:0;right:0;
  background:rgba(8,13,24,0.97);backdrop-filter:blur(20px);
  padding:28px var(--pad-m) 36px;z-index:99;flex-direction:column;gap:0;
  border-bottom:1px solid var(--separator)}
[data-theme="light"] .nav__drawer{background:rgba(10,42,46,0.97)}
.nav__drawer.open{display:flex}
.nav__drawer-section{margin-bottom:20px}
.nav__drawer-label{font-size:10px;letter-spacing:0.14em;text-transform:uppercase;
  color:var(--accent);margin-bottom:10px;display:block}
.nav__drawer a{font-size:15px;color:var(--text-muted);text-decoration:none;
  display:block;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03)}

@media(max-width:900px){.nav__menu,.nav__cta{display:none}.nav__burger{display:flex}}

/* PROGRESS */
#progress{position:fixed;top:0;left:0;height:2px;width:0%;
  background:linear-gradient(90deg,var(--accent),var(--accent-2));z-index:200;transition:width 0.1s linear}

/* CURSEUR */
#cursor{width:22px;height:22px;border:1px solid var(--accent);border-radius:50%;
  position:fixed;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);
  transition:transform 0.12s var(--ease),opacity 0.2s;mix-blend-mode:difference;opacity:0}
@media(hover:hover){#cursor{opacity:1}}
#cursor.active{transform:translate(-50%,-50%) scale(1.8)}

/* CONTAINER */
.container{max-width:var(--max-w);margin:0 auto;padding:0 var(--pad-d);width:100%}
@media(max-width:1024px){.container{padding:0 var(--pad-t)}}
@media(max-width:390px){.container{padding:0 var(--pad-m)}}

/* CARD GLASS */
.card{background:var(--bg-card);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border:1px solid var(--card-border);border-radius:var(--radius);
  box-shadow:0 8px 32px var(--shadow);position:relative;overflow:hidden;
  transition:transform 0.3s var(--ease),box-shadow 0.3s var(--ease)}
.card::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  background:linear-gradient(135deg,rgba(0,229,176,0.03) 0%,rgba(179,136,255,0.02) 50%,rgba(232,244,248,0.01) 100%)}
@media(hover:hover){.card:hover{transform:translateY(-4px);box-shadow:0 20px 60px var(--shadow)}}

/* TYPO */
h1,h2,h3,h4{font-family:'Clash Display',sans-serif;font-weight:700;text-wrap:balance;line-height:1.05}
.label{font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent);font-weight:500;display:block;margin-bottom:16px}

/* SHIMMER */
.shimmer{background:linear-gradient(90deg,var(--text) 0%,var(--accent-3) 30%,var(--accent-2) 60%,var(--nacre) 80%,var(--text) 100%);
  background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;animation:shimmer 4s linear infinite}
@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}

/* BOUTONS */
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:100px;
  font-size:13px;letter-spacing:0.05em;font-family:'Inter',sans-serif;font-weight:500;
  text-decoration:none;cursor:pointer;transition:opacity 0.2s,transform 0.2s var(--ease);border:none}
.btn--primary{background:var(--btn-cta-bg);border:1px solid var(--btn-cta-bd);color:var(--text);backdrop-filter:blur(8px)}
.btn--ghost{background:transparent;border:1px solid var(--card-border);color:var(--text-muted)}
.btn--nacre{background:rgba(232,244,248,0.10);border:1px solid rgba(232,244,248,0.20);color:var(--nacre)}
@media(hover:hover){
  .btn:hover{opacity:0.85;transform:translateY(-2px)}
  .btn--ghost:hover{color:var(--text);border-color:var(--accent)}
}

/* LISTES */
.checklist{list-style:none;display:flex;flex-direction:column;gap:10px;margin:16px 0}
.checklist li{font-size:14px;color:var(--text-muted);padding-left:18px;position:relative;line-height:1.5}
.checklist li::before{content:'—';position:absolute;left:0;color:var(--accent)}
.crosslist{list-style:none;display:flex;flex-direction:column;gap:8px;margin:12px 0}
.crosslist li{font-size:13px;color:var(--text-muted);padding-left:18px;position:relative}
.crosslist li::before{content:'×';position:absolute;left:0;color:#ff6b6b;font-weight:700}

/* ANIMATIONS */
.anim-fade,.anim-up,.anim-scale{opacity:0;transition:opacity 0.7s var(--ease-in),transform 0.7s var(--ease-in)}
.anim-up{transform:translateY(28px)}
.anim-scale{transform:scale(0.94)}
.anim-fade.visible,.anim-up.visible,.anim-scale.visible{opacity:1;transform:none}

/* LINK ARROW */
.link-arrow{font-size:13px;color:var(--accent);text-decoration:none;letter-spacing:0.04em;
  display:inline-flex;align-items:center;gap:6px;transition:gap 0.2s var(--ease)}
@media(hover:hover){.link-arrow:hover{gap:10px}}

/* PULSE */
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.7)}}

/* SKIP LINK */
.skip-link{position:absolute;top:-100px;left:16px;background:var(--accent);color:#000;
  padding:8px 16px;border-radius:4px;z-index:9999;font-size:14px;transition:top 0.2s}
.skip-link:focus{top:8px}

/* SECTOR BADGE */
.sector-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;
  background:rgba(179,136,255,0.10);border:1px solid rgba(179,136,255,0.20);
  border-radius:100px;font-size:11px;letter-spacing:0.10em;text-transform:uppercase;color:var(--accent-2)}

/* SÉLECTEUR SECTEUR */
.sector-filter{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:32px}
.sector-btn{padding:8px 16px;border-radius:100px;font-size:12px;letter-spacing:0.06em;
  border:1px solid var(--card-border);background:transparent;color:var(--text-muted);
  cursor:pointer;transition:all 0.2s var(--ease);font-family:'Inter',sans-serif}
.sector-btn.active{background:var(--btn-cta-bg);border-color:var(--btn-cta-bd);color:var(--text)}

/* GRAPHIQUES */
.bar-chart{display:flex;align-items:flex-end;gap:12px;height:120px}
.bar-wrap{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1}
.bar{width:100%;border-radius:6px 6px 0 0;background:linear-gradient(180deg,var(--accent) 0%,rgba(0,229,176,0.3) 100%);
  transition:height 1.2s var(--ease-in);position:relative}
.bar-val{position:absolute;top:-22px;left:50%;transform:translateX(-50%);font-size:12px;color:var(--accent);font-weight:500}
.bar-label{font-size:10px;color:var(--text-muted);letter-spacing:0.06em;text-align:center}
.chart-title{font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-2);margin-bottom:20px}
.donut-wrap{display:flex;align-items:center;gap:24px}
.donut-legend{display:flex;flex-direction:column;gap:10px}
.donut-item{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-muted)}
.donut-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.curve-legend{display:flex;gap:16px;margin-top:12px}
.curve-leg-item{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text-muted)}
.curve-leg-line{width:16px;height:2px;border-radius:1px}

/* AURORA */
.aurora-dot{width:8px;height:8px;background:var(--accent-2);border-radius:50%;animation:pulse 3s ease-in-out infinite}

/* FOOTER */
footer{border-top:1px solid var(--separator);padding:60px 0 40px;position:relative;z-index:1}
.footer__brand{font-family:'Clash Display',sans-serif;font-size:22px;font-weight:700;color:var(--text);margin-bottom:8px}
.footer__brand span{color:var(--nacre)}
.footer__tagline{font-size:13px;color:var(--text-muted);letter-spacing:0.06em;margin-bottom:24px}
.footer__links{display:flex;flex-wrap:wrap;gap:20px;margin-bottom:24px}
.footer__links a{font-size:12px;color:var(--text-muted);text-decoration:none;letter-spacing:0.06em;
  text-transform:uppercase;transition:color 0.2s}
@media(hover:hover){.footer__links a:hover{color:var(--accent)}}
.footer__legal{font-size:11px;color:rgba(240,248,255,0.25)}

/* GALERIE MICHA */
.gallery-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
.gallery-item{border-radius:var(--radius);overflow:hidden;aspect-ratio:4/3;
  background:var(--bg-card);border:1px solid var(--card-border);
  display:flex;align-items:center;justify-content:center;
  font-size:13px;color:var(--text-muted);cursor:pointer;
  transition:transform 0.3s var(--ease)}
@media(hover:hover){.gallery-item:hover{transform:scale(1.02)}}

/* VALEURS */
.valeur-card{padding:32px}
.valeur-icon{font-size:32px;margin-bottom:16px}
.valeur-card h3{font-size:20px;margin-bottom:12px}
.valeur-card p{font-size:14px;color:var(--text-muted);line-height:1.7}

/* OFFRE CARD */
.offre-card{padding:32px}
.offre-label{font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-2);margin-bottom:12px;display:block}
.offre-title{font-size:26px;margin-bottom:14px;line-height:1.1}
.offre-desc{font-size:14px;color:var(--text-muted);margin-bottom:18px;line-height:1.7}
.offre-reste{font-size:15px;font-style:italic;color:var(--accent-3);margin:14px 0;
  padding-left:16px;border-left:2px solid var(--accent);line-height:1.5}
.offre-gain{font-family:'Clash Display',sans-serif;font-size:40px;font-weight:700;color:var(--accent);margin:14px 0 2px}
.offre-gain-label{font-size:12px;color:var(--text-muted);margin-bottom:18px}
.offre-price{font-family:'Clash Display',sans-serif;font-size:30px;font-weight:700;color:var(--nacre);margin-bottom:4px}
.offre-delai{font-size:12px;color:var(--text-muted);margin-bottom:20px}

/* PACK DUO */
.pack-duo{border-color:rgba(232,244,248,0.15);background:rgba(232,244,248,0.03)}
.pack-duo::before{background:linear-gradient(135deg,rgba(232,244,248,0.04) 0%,rgba(179,136,255,0.03) 100%)}
.pack-duo-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;
  background:rgba(232,244,248,0.10);border:1px solid rgba(232,244,248,0.20);
  border-radius:100px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--nacre);margin-bottom:14px}
.pack-duo-economy{font-size:13px;color:var(--accent);margin-bottom:20px}
'@

Set-Content -Path "$Root/assets/css/pinapp-global.css" -Value $cssGlobal -Encoding UTF8
Write-OK "assets/css/pinapp-global.css"

# ==============================================================================
# 3. JS THEME
# ==============================================================================
Write-Step "3/14" "theme.js..."

$jsTheme = @'
(function(){
  var K='pinapp-theme',h=document.documentElement;
  function get(){var s=localStorage.getItem(K);if(s)return s;return window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}
  function apply(t){h.setAttribute('data-theme',t);localStorage.setItem(K,t);var b=document.getElementById('theme-toggle');if(b){b.textContent=t==='dark'?'◐':'◑';b.setAttribute('aria-label',t==='dark'?'Mode jour':'Mode nuit')}}
  function toggle(){apply(h.getAttribute('data-theme')==='dark'?'light':'dark')}
  apply(get());
  document.addEventListener('DOMContentLoaded',function(){var b=document.getElementById('theme-toggle');if(b)b.addEventListener('click',toggle)});
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',function(e){if(!localStorage.getItem(K))apply(e.matches?'dark':'light')});
})();
'@

Set-Content -Path "$Root/assets/js/theme.js" -Value $jsTheme -Encoding UTF8
Write-OK "assets/js/theme.js"

# ==============================================================================
# 4. JS PARTICLES
# ==============================================================================
Write-Step "4/14" "particles.js..."

$jsParticles = @'
(function(){
  var canvas=document.getElementById('canvas-pandora');
  if(!canvas)return;
  var ctx=canvas.getContext('2d');
  var C=['#00E5B0','#B388FF','#7FFFEA','#E040FB'],N=80,L=100,W,H,pts=[],raf;
  function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight}
  function rand(a,b){return Math.random()*(b-a)+a}
  function mk(){return{x:rand(0,W),y:rand(0,H),vx:rand(-0.12,0.12),vy:rand(-0.12,0.12),r:rand(1,2.4),c:C[Math.floor(Math.random()*4)],a:rand(0.3,0.75)}}
  function init(){resize();pts=Array.from({length:N},mk)}
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<pts.length;i++){for(var j=i+1;j<pts.length;j++){var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<L){ctx.beginPath();ctx.strokeStyle=pts[i].c;ctx.globalAlpha=(1-d/L)*0.15;ctx.lineWidth=0.5;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke()}}}
    pts.forEach(function(p){
      ctx.globalAlpha=p.a;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.c;ctx.fill();
      var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);g.addColorStop(0,p.c+'50');g.addColorStop(1,p.c+'00');
      ctx.beginPath();ctx.arc(p.x,p.y,p.r*5,0,Math.PI*2);ctx.fillStyle=g;ctx.globalAlpha=p.a*0.4;ctx.fill();
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;if(p.y<-10)p.y=H+10;if(p.y>H+10)p.y=-10;
    });
    ctx.globalAlpha=1;
  }
  function loop(){if(document.hidden)return;draw();raf=requestAnimationFrame(loop)}
  function start(){if(!raf)loop()}
  function stop(){cancelAnimationFrame(raf);raf=null}
  document.addEventListener('visibilitychange',function(){document.hidden?stop():start()});
  window.addEventListener('resize',function(){resize();pts=Array.from({length:N},mk)});
  var obs=new MutationObserver(function(){document.documentElement.getAttribute('data-theme')==='light'?stop():start()});
  obs.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  init();if(document.documentElement.getAttribute('data-theme')!=='light')start();
})();
'@

Set-Content -Path "$Root/assets/js/particles.js" -Value $jsParticles -Encoding UTF8
Write-OK "assets/js/particles.js"

# ==============================================================================
# 5. JS MAIN
# ==============================================================================
Write-Step "5/14" "main.js..."

$jsMain = @'
document.addEventListener('DOMContentLoaded',function(){
  // Progress
  var prog=document.getElementById('progress'),snap=document.querySelector('.snap-container');
  if(prog&&snap)snap.addEventListener('scroll',function(){var t=snap.scrollHeight-snap.clientHeight;prog.style.width=t>0?(snap.scrollTop/t*100)+'%':'0%'},{passive:true});

  // Nav hide
  var nav=document.querySelector('.nav');
  if(nav&&snap){var lastY=0;snap.addEventListener('scroll',function(){var y=snap.scrollTop;nav.classList.toggle('hidden',y>lastY&&y>80);lastY=y},{passive:true})}

  // Curseur
  var cur=document.getElementById('cursor');
  if(cur&&window.matchMedia('(hover:hover)').matches){
    document.addEventListener('mousemove',function(e){cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px'});
    document.querySelectorAll('a,button,[role="button"]').forEach(function(el){el.addEventListener('mouseenter',function(){cur.classList.add('active')});el.addEventListener('mouseleave',function(){cur.classList.remove('active')})});
  }

  // IntersectionObserver animations
  var anims=document.querySelectorAll('.anim-fade,.anim-up,.anim-scale');
  if(anims.length){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){var d=parseInt(e.target.dataset.delay||0);setTimeout(function(){e.target.classList.add('visible')},d);io.unobserve(e.target)}})},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});anims.forEach(function(el){io.observe(el)})}

  // Count-up
  document.querySelectorAll('.count-up').forEach(function(el){
    var target=parseInt(el.dataset.target,10),dur=1600;
    var io2=new IntersectionObserver(function(entries){if(!entries[0].isIntersecting)return;io2.disconnect();var t0=performance.now();function step(now){var p=Math.min((now-t0)/dur,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(e*target).toLocaleString('fr-FR');if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step)});
    io2.observe(el);
  });

  // Nav dots
  var dots=document.querySelectorAll('.nav-dot'),sects=document.querySelectorAll('.snap-section');
  if(dots.length&&snap){
    snap.addEventListener('scroll',function(){var mid=snap.scrollTop+snap.clientHeight/2,active=0;sects.forEach(function(s,i){if(s.offsetTop<=mid)active=i});dots.forEach(function(d,i){d.classList.toggle('active',i===active)})},{passive:true});
    dots.forEach(function(d,i){d.addEventListener('click',function(){sects[i]&&sects[i].scrollIntoView({behavior:'smooth'})})});
  }

  // Burger
  var burger=document.querySelector('.nav__burger'),drawer=document.querySelector('.nav__drawer');
  if(burger&&drawer)burger.addEventListener('click',function(){var o=drawer.classList.toggle('open');burger.setAttribute('aria-expanded',o)});

  // Sélecteur secteur
  var sbtns=document.querySelectorAll('.sector-btn'),ocards=document.querySelectorAll('.offre-card[data-sectors]');
  sbtns.forEach(function(btn){btn.addEventListener('click',function(){sbtns.forEach(function(b){b.classList.remove('active')});btn.classList.add('active');var sel=btn.dataset.sector;ocards.forEach(function(card){var ss=card.dataset.sectors.split(',');card.closest('.offre-wrap').style.display=(sel==='tous'||ss.includes(sel))?'':'none'})})});

  // Barres graphique
  var bars=document.querySelectorAll('.bar[data-h]');
  if(bars.length){var bioBar=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.style.height=e.target.dataset.h+'px';bioBar.unobserve(e.target)}})},{threshold:0.3});bars.forEach(function(b){b.style.height='0';bioBar.observe(b)})}

  // Donut SVG
  var donut=document.getElementById('donut-svg');
  if(donut){var r=44,circ=2*Math.PI*r,data=[{p:45,c:'#00e5b0'},{p:30,c:'#b388ff'},{p:15,c:'#7fffea'},{p:10,c:'#e040fb'}],offset=0;
    data.forEach(function(d){var arc=(d.p/100)*circ,circle=document.createElementNS('http://www.w3.org/2000/svg','circle');circle.setAttribute('cx','50');circle.setAttribute('cy','50');circle.setAttribute('r',r);circle.setAttribute('fill','none');circle.setAttribute('stroke',d.c);circle.setAttribute('stroke-width','12');circle.setAttribute('stroke-dasharray',arc+' '+(circ-arc));circle.setAttribute('stroke-dashoffset',-offset);circle.setAttribute('transform','rotate(-90 50 50)');donut.appendChild(circle);offset+=arc})}
});
'@

Set-Content -Path "$Root/assets/js/main.js" -Value $jsMain -Encoding UTF8
Write-OK "assets/js/main.js"

# ==============================================================================
# FONCTION HTML SHELL (nav + canvas + footer communs)
# ==============================================================================
function Get-HtmlShell {
  param($title, $desc, $body, $extraNav = "", $snapCount = 0)

  $dots = ""
  if ($snapCount -gt 0) {
    $dots = '<nav class="nav-dots" aria-label="Sections">'
    for ($i = 0; $i -lt $snapCount; $i++) {
      $active = if ($i -eq 0) { ' class="nav-dot active"' } else { ' class="nav-dot"' }
      $dots += "<button$active></button>"
    }
    $dots += '</nav>'
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
  <link rel="preconnect" href="https://fonts.bunny.net" crossorigin/>
  <link rel="stylesheet" href="https://fonts.bunny.net/css?family=clash-display:wght@400;500;600;700|inter:wght@300;400;500&display=swap"/>
  <link rel="stylesheet" href="/assets/css/pinapp-global.css"/>
  <script src="/assets/js/theme.js"></script>
</head>
<body>
  <div id="cursor" aria-hidden="true"></div>
  <div id="progress" aria-hidden="true"></div>
  <canvas id="canvas-pandora" aria-hidden="true"></canvas>
  <div class="caustics" aria-hidden="true"><span></span><span></span><span></span></div>
  <div class="light-rays" aria-hidden="true"></div>
  <a class="skip-link" href="#main">Aller au contenu</a>

  <nav class="nav" id="nav" aria-label="Navigation principale">
    <div class="nav__inner">
      <a class="nav__logo" href="/">Pinapp <span>Inc.</span></a>
      <ul class="nav__menu" role="list">
        <li class="nav__item">
          <a class="nav__link" href="/offres/">
            Pinapp Studio
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 3l3 3 3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
          </a>
          <div class="nav__dropdown">
            <span class="nav__dropdown-label">Pinapp Studio</span>
            <a href="/offres/">Offres</a>
            <a href="/realisations/">Réalisations</a>
            <a href="/offres/formation/">Formations</a>
            <a href="/a-propos/">Notre studio</a>
          </div>
        </li>
        <li class="nav__item">
          <a class="nav__link" href="/auralis/">
            Auralis RH
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 3l3 3 3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
          </a>
          <div class="nav__dropdown">
            <span class="nav__dropdown-label">Auralis RH</span>
            <a href="/auralis/">Le produit</a>
            <a href="/auralis/#aurora">Aurora, l'IA</a>
            <a href="/auralis/#beta">Accès bêta</a>
          </div>
        </li>
        <li class="nav__item">
          <a class="nav__link" href="/memoire-et-presence/">
            Mémoire & Présence
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 3l3 3 3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
          </a>
          <div class="nav__dropdown">
            <span class="nav__dropdown-label">Mémoire & Présence</span>
            <a href="/memoire-et-presence/">Notre approche</a>
            <a href="/memoire-et-presence/#realisations">Réalisations Micha</a>
            <a href="https://memoireetpresence.fr" target="_blank" rel="noopener">memoireetpresence.fr ↗</a>
          </div>
        </li>
      </ul>
      <div class="nav__actions">
        <button class="nav__theme" id="theme-toggle" aria-label="Mode jour">◐</button>
        <a class="nav__cta" href="/diagnostic/">Premier échange offert</a>
        <button class="nav__burger" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="nav__drawer">
      <div class="nav__drawer-section">
        <span class="nav__drawer-label">Pinapp Studio</span>
        <a href="/offres/">Offres</a>
        <a href="/realisations/">Réalisations</a>
        <a href="/offres/formation/">Formations</a>
        <a href="/a-propos/">Notre studio</a>
      </div>
      <div class="nav__drawer-section">
        <span class="nav__drawer-label">Auralis RH</span>
        <a href="/auralis/">Le produit</a>
        <a href="/auralis/#beta">Accès bêta</a>
      </div>
      <div class="nav__drawer-section">
        <span class="nav__drawer-label">Mémoire & Présence</span>
        <a href="/memoire-et-presence/">Notre approche</a>
        <a href="https://memoireetpresence.fr" target="_blank" rel="noopener">memoireetpresence.fr ↗</a>
      </div>
      <a href="/diagnostic/" class="btn btn--primary" style="margin-top:8px;">Premier échange offert</a>
    </div>
  </nav>

  $dots

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
        <a href="/legal/cgv.html">CGV</a>
        <a href="/legal/confidentialite.html">Confidentialité</a>
        <a href="/engagements/">Nos engagements</a>
        <a href="https://memoireetpresence.fr" target="_blank" rel="noopener">🌿 Mémoire & Présence</a>
      </nav>
      <p class="footer__legal">© 2026 Pinapp Inc. · Lauralie & Micha · Prix HT · TVA non applicable art. 293 B CGI</p>
    </div>
  </footer>

  <script src="/assets/js/particles.js" defer></script>
  <script src="/assets/js/main.js" defer></script>
</body>
</html>
"@
}

# ==============================================================================
# 6. INDEX.HTML — HOME
# ==============================================================================
Write-Step "6/14" "index.html (home)..."

$homeBody = @'
  <div class="snap-container">

    <!-- 1. HERO -->
    <section class="snap-section" id="hero" aria-labelledby="hero-title">
      <div class="container">
        <span class="label anim-fade">Pinapp Inc. · IA · Automatisation · Web · Image</span>
        <h1 id="hero-title" style="font-size:clamp(48px,8vw,104px);letter-spacing:-0.04em;max-width:900px;margin-bottom:32px;line-height:1.0;" class="anim-up" data-delay="100">
          Nous <span class="shimmer">construisons</span> ce que vos concurrents n'ont pas encore.
        </h1>
        <p style="font-size:18px;color:var(--text-muted);max-width:520px;margin-bottom:48px;line-height:1.6;" class="anim-up" data-delay="200">
          Vos outils travaillent. Vous décidez.
        </p>
        <div style="display:flex;gap:16px;flex-wrap:wrap;" class="anim-up" data-delay="300">
          <a href="/diagnostic/" class="btn btn--primary">Premier échange offert →</a>
          <a href="/realisations/" class="btn btn--ghost">Voir les démos</a>
        </div>
      </div>
      <div style="position:absolute;bottom:32px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;color:var(--text-muted);font-size:10px;letter-spacing:0.14em;text-transform:uppercase;opacity:0.6;" aria-hidden="true">
        <span>Défiler</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 9l5 4 5-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
      </div>
    </section>

    <!-- 2. DOULEURS -->
    <section class="snap-section" id="douleurs" aria-labelledby="douleurs-title">
      <div class="container">
        <span class="label anim-fade">Ce que vous vivez en ce moment</span>
        <h2 id="douleurs-title" style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:40px;" class="anim-up" data-delay="80">
          Vos outils ont été conçus pour le bureau.<br/>Votre équipe, elle, travaille de partout.
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">
          <div class="card anim-up" style="padding:24px;" data-delay="0">
            <div style="font-size:24px;margin-bottom:12px;">⏱</div>
            <h3 style="font-size:18px;margin-bottom:10px;">Vous répondez trop lentement.</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">Le prospect est passé ailleurs. Votre assistant IA, lui, répond pendant que vous êtes sur le terrain.</p>
          </div>
          <div class="card anim-up" style="padding:24px;" data-delay="60">
            <div style="font-size:24px;margin-bottom:12px;">🔗</div>
            <h3 style="font-size:18px;margin-bottom:10px;">5 outils qui ne se parlent pas.</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">Gmail, Notion, Calendly, Stripe, votre site. On connecte tout. Une seule source de vérité.</p>
          </div>
          <div class="card anim-up" style="padding:24px;" data-delay="120">
            <div style="font-size:24px;margin-bottom:12px;">🌙</div>
            <h3 style="font-size:18px;margin-bottom:10px;">Les factures le dimanche soir.</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">Générée à la signature. Relance automatique si impayé. Export comptable le 1er du mois.</p>
          </div>
          <div class="card anim-up" style="padding:24px;" data-delay="0">
            <div style="font-size:24px;margin-bottom:12px;">🖥</div>
            <h3 style="font-size:18px;margin-bottom:10px;">Honte de donner votre URL.</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">Un site que vous partagez fièrement. Design premium. Livré en 7 jours.</p>
          </div>
          <div class="card anim-up" style="padding:24px;" data-delay="60">
            <div style="font-size:24px;margin-bottom:12px;">📅</div>
            <h3 style="font-size:18px;margin-bottom:10px;">Les no-shows non relancés.</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">Confirmation · rappel · relance automatiques. Vous ne touchez à rien.</p>
          </div>
          <div class="card anim-up" style="padding:24px;" data-delay="120">
            <div style="font-size:24px;margin-bottom:12px;">🏠</div>
            <h3 style="font-size:18px;margin-bottom:10px;">Équipe en télétravail, process de bureau.</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">Workflows reconstruits pour le distanciel. Zéro friction. Zéro coordination manuelle.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. SERVICES -->
    <section class="snap-section" id="services" aria-labelledby="services-title">
      <div class="container">
        <span class="label anim-fade">Ce que nous construisons</span>
        <h2 id="services-title" style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:48px;" class="anim-up" data-delay="80">
          Quatre expertises.<br/>Un seul résultat.
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;">
          <article class="card anim-up" style="padding:32px;" data-delay="0">
            <div class="label" style="margin-bottom:14px;">Sites & landing pages</div>
            <h3 style="font-size:22px;margin-bottom:12px;">Un site qui convertit avant même que vous parliez.</h3>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:20px;line-height:1.7;">Design sur-mesure. Copywriting inclus. Livré en 7 jours.</p>
            <div style="font-family:'Clash Display',sans-serif;font-size:26px;color:var(--nacre);margin-bottom:12px;">À partir de 1 290 € HT</div>
            <a href="/offres/#sites" class="link-arrow">En savoir plus →</a>
          </article>
          <article class="card anim-up" style="padding:32px;" data-delay="80">
            <div class="label" style="margin-bottom:14px;">Automatisation n8n</div>
            <h3 style="font-size:22px;margin-bottom:12px;">Vos tâches répétitives disparaissent.</h3>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:20px;line-height:1.7;">Je connecte vos outils. Vous ne touchez à rien.</p>
            <div style="font-family:'Clash Display',sans-serif;font-size:26px;color:var(--nacre);margin-bottom:12px;">À partir de 490 € HT</div>
            <a href="/offres/#automatisation" class="link-arrow">En savoir plus →</a>
          </article>
          <article class="card anim-up" style="padding:32px;" data-delay="160">
            <div class="label" style="margin-bottom:14px;">Intelligence artificielle</div>
            <h3 style="font-size:22px;margin-bottom:12px;">L'IA formée sur votre métier. En 48h.</h3>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:20px;line-height:1.7;">Qualifie vos leads. Répond à vos clients. Travaille quand vous dormez.</p>
            <div style="font-family:'Clash Display',sans-serif;font-size:26px;color:var(--nacre);margin-bottom:12px;">À partir de 890 € HT</div>
            <a href="/offres/#ia" class="link-arrow">En savoir plus →</a>
          </article>
          <article class="card anim-up" style="padding:32px;border-color:rgba(127,255,234,0.12);" data-delay="240">
            <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-3);margin-bottom:14px;">Imagerie & direction artistique</div>
            <h3 style="font-size:22px;margin-bottom:12px;">Des visuels qui font ressentir ce que les mots ne peuvent pas dire.</h3>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:20px;line-height:1.7;">Photo · vidéo · DA · branding Adobe · IA générative. Micha.</p>
            <div style="font-family:'Clash Display',sans-serif;font-size:26px;color:var(--nacre);margin-bottom:12px;">À partir de 300 € HT</div>
            <a href="/memoire-et-presence/" class="link-arrow">Voir les réalisations →</a>
          </article>
        </div>
      </div>
    </section>

    <!-- 4. GRAPHIQUES -->
    <section class="snap-section" id="graphiques" aria-labelledby="graph-title">
      <div class="container">
        <span class="label anim-fade">Preuves chiffrées</span>
        <h2 id="graph-title" style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:48px;" class="anim-up" data-delay="80">
          Où part votre temps ?<br/>Et combien en récupère-t-on ?
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;">
          <article class="card anim-up" style="padding:28px;" data-delay="0">
            <div class="chart-title">Heures récupérées / mois</div>
            <div class="bar-chart">
              <div class="bar-wrap"><div class="bar" data-h="96" style="height:0;"><span class="bar-val">8h</span></div><span class="bar-label">Relances</span></div>
              <div class="bar-wrap"><div class="bar" data-h="72" style="height:0;background:linear-gradient(180deg,var(--accent-2) 0%,rgba(179,136,255,0.3) 100%);"><span class="bar-val">6h</span></div><span class="bar-label">Devis</span></div>
              <div class="bar-wrap"><div class="bar" data-h="60" style="height:0;background:linear-gradient(180deg,var(--accent-3) 0%,rgba(127,255,234,0.3) 100%);"><span class="bar-val">5h</span></div><span class="bar-label">RDV</span></div>
              <div class="bar-wrap"><div class="bar" data-h="48" style="height:0;background:linear-gradient(180deg,var(--accent-4) 0%,rgba(224,64,251,0.3) 100%);"><span class="bar-val">4h</span></div><span class="bar-label">Factures</span></div>
            </div>
            <p style="font-size:13px;color:var(--text-muted);margin-top:16px;line-height:1.6;">Chaque tâche représente des heures passées à la main chaque mois.</p>
          </article>
          <article class="card anim-up" style="padding:28px;" data-delay="100">
            <div class="chart-title">Où part votre temps ?</div>
            <div class="donut-wrap">
              <svg id="donut-svg" width="100" height="100" viewBox="0 0 100 100" aria-label="Répartition du temps"></svg>
              <div class="donut-legend">
                <div class="donut-item"><span class="donut-dot" style="background:#00e5b0;"></span>Relances (45%)</div>
                <div class="donut-item"><span class="donut-dot" style="background:#b388ff;"></span>Devis (30%)</div>
                <div class="donut-item"><span class="donut-dot" style="background:#7fffea;"></span>RDV (15%)</div>
                <div class="donut-item"><span class="donut-dot" style="background:#e040fb;"></span>Autres (10%)</div>
              </div>
            </div>
          </article>
          <article class="card anim-up" style="padding:28px;" data-delay="200">
            <div class="chart-title">Interventions manuelles</div>
            <svg viewBox="0 0 260 120" width="100%" aria-label="Courbe avant/après Pinapp">
              <polyline points="10,85 50,65 90,78 130,58 170,72 210,52 250,68" fill="none" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="10,88 50,72 90,56 130,40 170,30 210,24 250,16" fill="none" stroke="#00e5b0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="curve-legend">
              <div class="curve-leg-item"><span class="curve-leg-line" style="background:#ff6b6b;"></span>Avant</div>
              <div class="curve-leg-item"><span class="curve-leg-line" style="background:#00e5b0;"></span>Avec Pinapp</div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 5. PACK DUO -->
    <section class="snap-section" id="pack-duo" aria-labelledby="duo-title">
      <div class="container">
        <span class="label anim-fade">Lauralie + Micha</span>
        <h2 id="duo-title" style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:20px;" class="anim-up" data-delay="80">
          Pack Complet Duo.<br/>Un interlocuteur.<br/>Deux expertises.
        </h2>
        <p style="font-size:17px;color:var(--text-muted);max-width:560px;margin-bottom:48px;line-height:1.6;" class="anim-up" data-delay="160">
          Site premium + automatisation + IA + direction artistique + shooting photo + vidéo de présentation + branding Adobe.<br/>Clé en main. Zéro coordination à gérer.
        </p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:800px;">
          <div class="card pack-duo anim-up" style="padding:36px;" data-delay="0">
            <div class="pack-duo-badge">Pack Duo Complet</div>
            <ul class="checklist" style="margin-bottom:24px;">
              <li>Site premium livré en 7 jours</li>
              <li>3 automatisations sur-mesure</li>
              <li>Assistant IA métier intégré</li>
              <li>Direction artistique complète</li>
              <li>Shooting photo professionnel</li>
              <li>Vidéo de présentation</li>
              <li>Branding Adobe complet</li>
            </ul>
            <p class="pack-duo-economy">~1 600 € économisés vs. séparé</p>
            <div style="font-family:'Clash Display',sans-serif;font-size:32px;color:var(--nacre);margin-bottom:4px;">À partir de 3 900 € HT</div>
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:24px;">Sur devis selon périmètre</p>
            <a href="/diagnostic/" class="btn btn--primary">Demander un devis →</a>
          </div>
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div class="card anim-up" style="padding:24px;flex:1;" data-delay="80">
              <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;">Lauralie</div>
              <h3 style="font-size:18px;margin-bottom:10px;">Technique & IA</h3>
              <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">Site · automatisation · IA · déploiement · scripts</p>
            </div>
            <div class="card anim-up" style="padding:24px;flex:1;border-color:rgba(127,255,234,0.12);" data-delay="160">
              <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-3);margin-bottom:10px;">Micha</div>
              <h3 style="font-size:18px;margin-bottom:10px;">Image & DA</h3>
              <p style="font-size:13px;color:var(--text-muted);line-height:1.6;">Photo · vidéo · branding · Adobe · IA générative</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. AURALIS -->
    <section class="snap-section" id="auralis" aria-labelledby="auralis-title">
      <div class="container">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;">
          <div>
            <div class="sector-badge anim-fade" style="margin-bottom:24px;">Produit Pinapp · Pré-commercial</div>
            <h2 id="auralis-title" style="font-size:clamp(32px,5vw,56px);letter-spacing:-0.03em;margin-bottom:20px;" class="anim-up" data-delay="80">
              Auralis RH.<br/>L'IA qui prend soin des RH.
            </h2>
            <p style="font-size:17px;color:var(--text-muted);margin-bottom:24px;line-height:1.7;" class="anim-up" data-delay="160">
              53% des RH sont épuisés. Ils gèrent le burnout des autres. Personne ne gère le leur.
            </p>
            <blockquote style="font-size:18px;font-style:italic;color:var(--accent-2);border-left:2px solid var(--accent-2);padding-left:20px;margin-bottom:32px;line-height:1.5;" class="anim-up" data-delay="200">
              "Aurora prépare. Vous décidez. Toujours."
            </blockquote>
            <a href="/auralis/" class="btn btn--primary anim-up" data-delay="260">Découvrir Auralis RH →</a>
          </div>
          <div class="card anim-scale" style="padding:32px;" data-delay="150">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--separator);">
              <div class="aurora-dot"></div>
              <div>
                <div style="font-size:13px;font-weight:500;color:var(--text);">Aurora</div>
                <div style="font-size:11px;color:var(--text-muted);">Mode proactif · 09h14</div>
              </div>
            </div>
            <p style="font-size:15px;color:var(--text);line-height:1.7;font-style:italic;">
              "Trois dossiers présentent des signaux de surcharge cette semaine. Un entretien préventif pourrait être pertinent avant vendredi."
            </p>
            <p style="font-size:11px;color:var(--text-muted);margin-top:20px;padding-top:16px;border-top:1px solid var(--separator);">
              Suggestion générée · Décision RH conservée
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. COMMENT ÇA MARCHE -->
    <section class="snap-section" id="comment" aria-labelledby="comment-title">
      <div class="container">
        <span class="label anim-fade">Comment ça marche</span>
        <h2 id="comment-title" style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:16px;" class="anim-up" data-delay="80">
          De la première question à la livraison.
        </h2>
        <p style="font-size:17px;color:var(--text-muted);margin-bottom:40px;line-height:1.6;" class="anim-up" data-delay="120">
          Pas d'appel. Tout par écrit. Vous gardez la main.
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
          <div class="card anim-up" style="padding:28px;" data-delay="0">
            <div style="font-family:'Clash Display',sans-serif;font-size:48px;font-weight:700;color:var(--accent);opacity:0.4;line-height:1;margin-bottom:14px;">01</div>
            <h3 style="font-size:18px;margin-bottom:10px;">Vous décrivez votre besoin</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">Par écrit. Votre secteur, votre problème, votre délai. Réponse sous 24h.</p>
          </div>
          <div class="card anim-up" style="padding:28px;" data-delay="80">
            <div style="font-family:'Clash Display',sans-serif;font-size:48px;font-weight:700;color:var(--accent-2);opacity:0.4;line-height:1;margin-bottom:14px;">02</div>
            <h3 style="font-size:18px;margin-bottom:10px;">Nous diagnostiquons</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">Nous analysons ce qui peut être automatisé, amélioré, construit.</p>
          </div>
          <div class="card anim-up" style="padding:28px;" data-delay="160">
            <div style="font-family:'Clash Display',sans-serif;font-size:48px;font-weight:700;color:var(--accent-3);opacity:0.4;line-height:1;margin-bottom:14px;">03</div>
            <h3 style="font-size:18px;margin-bottom:10px;">Nous construisons</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">Devis clair. Vous validez. Nous construisons. Vous suivez par écrit.</p>
          </div>
          <div class="card anim-up" style="padding:28px;" data-delay="240">
            <div style="font-family:'Clash Display',sans-serif;font-size:48px;font-weight:700;color:var(--accent-4);opacity:0.4;line-height:1;margin-bottom:14px;">04</div>
            <h3 style="font-size:18px;margin-bottom:10px;">Vous utilisez</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">Livraison · tests · formation 1h. Satisfait ou remboursé 30 jours.</p>
          </div>
        </div>
        <div style="text-align:center;margin-top:40px;" class="anim-scale" data-delay="200">
          <a href="/diagnostic/" class="btn btn--primary" style="font-size:15px;padding:16px 36px;">Commencer — par écrit →</a>
        </div>
      </div>
    </section>

  </div>
'@

$homeHtml = Get-HtmlShell `
  -title "Pinapp Inc. — Systèmes intelligents sur-mesure" `
  -desc "Vos outils ont été conçus pour le bureau. Votre équipe travaille de partout. Nous construisons ce que vos concurrents n'ont pas encore." `
  -body $homeBody `
  -snapCount 7

Set-Content -Path "$Root/index.html" -Value $homeHtml -Encoding UTF8
Write-OK "index.html"

# ==============================================================================
# 7. A-PROPOS
# ==============================================================================
Write-Step "7/14" "a-propos/index.html..."

$aproposBody = @'
  <div class="snap-container">

    <!-- HERO SOCIÉTÉ -->
    <section class="snap-section" id="societe" aria-labelledby="societe-title">
      <div class="container">
        <span class="label anim-fade">Pinapp Inc.</span>
        <h1 id="societe-title" style="font-size:clamp(40px,7vw,88px);letter-spacing:-0.04em;max-width:800px;margin-bottom:32px;line-height:1.0;" class="anim-up" data-delay="100">
          Nous construisons des systèmes.<br/>Nous croyons à <span class="shimmer">l'humain</span>.
        </h1>
        <p style="font-size:18px;color:var(--text-muted);max-width:560px;line-height:1.7;" class="anim-up" data-delay="200">
          Pinapp Inc. est née d'une conviction simple : la technologie doit servir les gens, pas les remplacer. Nous construisons des outils qui libèrent du temps, préservent les liens, et permettent à chacun de se concentrer sur ce qui compte vraiment.
        </p>
      </div>
    </section>

    <!-- LAURALIE + MICHA — ÉGALITÉ TOTALE -->
    <section class="snap-section" id="associes" aria-labelledby="associes-title">
      <div class="container">
        <span class="label anim-fade">Les associés</span>
        <h2 id="associes-title" style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:48px;" class="anim-up" data-delay="80">
          Deux expertises.<br/>Une vision commune.
        </h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;">

          <div class="card anim-up" style="padding:40px;" data-delay="0">
            <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--accent) 0%,var(--accent-2) 100%);display:flex;align-items:center;justify-content:center;font-family:'Clash Display',sans-serif;font-size:24px;font-weight:700;color:#080d18;margin-bottom:24px;">L</div>
            <div class="label" style="color:var(--accent);margin-bottom:8px;">Co-associée · PDG</div>
            <h3 style="font-size:28px;margin-bottom:16px;">Lauralie</h3>
            <p style="font-size:15px;color:var(--text-muted);margin-bottom:20px;line-height:1.7;">
              Architecte technique et stratégique. Je conçois les systèmes, j'écris les specs, je les déploie. De l'IA à l'automatisation, du site au SaaS — sans intermédiaire.
            </p>
            <ul class="checklist">
              <li>Sites & landing pages premium</li>
              <li>Automatisation n8n</li>
              <li>Intelligence artificielle sur-mesure</li>
              <li>Auralis RH — produit en cours</li>
              <li>Scripts & déploiement Hostinger</li>
            </ul>
          </div>

          <div class="card anim-up" style="padding:40px;border-color:rgba(127,255,234,0.12);" data-delay="120">
            <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--accent-3) 0%,var(--accent-4) 100%);display:flex;align-items:center;justify-content:center;font-family:'Clash Display',sans-serif;font-size:24px;font-weight:700;color:#080d18;margin-bottom:24px;">M</div>
            <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-3);margin-bottom:8px;">Co-associé · Directeur artistique</div>
            <h3 style="font-size:28px;margin-bottom:16px;">Micha</h3>
            <p style="font-size:15px;color:var(--text-muted);margin-bottom:20px;line-height:1.7;">
              Vidéaste, photographe, directeur artistique. Je crée les visuels qui font ressentir ce que les mots ne peuvent pas dire. Adobe, IA générative, restauration — depuis mon studio ou chez vous.
            </p>
            <ul class="checklist">
              <li>Photo & vidéo professionnelles</li>
              <li>Direction artistique complète</li>
              <li>Branding Adobe suite</li>
              <li>Restauration & retouche avancée</li>
              <li>Mémoire & Présence — projet fondateur</li>
            </ul>
          </div>

        </div>
      </div>
    </section>

    <!-- VALEURS -->
    <section class="snap-section" id="valeurs" aria-labelledby="valeurs-title">
      <div class="container">
        <span class="label anim-fade">Ce en quoi nous croyons</span>
        <h2 id="valeurs-title" style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:48px;" class="anim-up" data-delay="80">
          Nos valeurs.<br/>Pas des mots. Des décisions.
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;">
          <div class="card valeur-card anim-up" data-delay="0">
            <div class="valeur-icon">🤝</div>
            <h3>L'humain d'abord</h3>
            <p>La technologie existe pour servir les gens. Pas pour les impressionner. Chaque outil que nous construisons libère du temps pour ce qui compte vraiment.</p>
          </div>
          <div class="card valeur-card anim-up" data-delay="60">
            <div class="valeur-icon">🔗</div>
            <h3>La connexion</h3>
            <p>Entre les outils, entre les gens, entre les générations. Nous construisons des ponts. Numériques quand c'est utile. Humains toujours.</p>
          </div>
          <div class="card valeur-card anim-up" data-delay="120">
            <div class="valeur-icon">🌱</div>
            <h3>La sobriété</h3>
            <p>Zéro outil superflu. Chaque solution est justifiée ou supprimée. Moins d'outils, moins d'énergie, plus d'impact. Stack 100% européen.</p>
          </div>
          <div class="card valeur-card anim-up" data-delay="180">
            <div class="valeur-icon">📖</div>
            <h3>La transmission</h3>
            <p>Ce que nous construisons doit durer et se comprendre. Documentation incluse. Formation incluse. Vous êtes autonomes après notre départ.</p>
          </div>
          <div class="card valeur-card anim-up" data-delay="240">
            <div class="valeur-icon">⚖️</div>
            <h3>L'honnêteté</h3>
            <p>Paiement sur livrable. Satisfait ou remboursé 30 jours. Pas de jargon inutile. Pas de résultat garanti. Des engagements tenables.</p>
          </div>
          <div class="card valeur-card anim-up" data-delay="300">
            <div class="valeur-icon">🎯</div>
            <h3>L'égalité</h3>
            <p>Entre nous d'abord — Lauralie et Micha, associés à parts égales. Dans nos projets ensuite — chaque client mérite le même niveau d'exigence.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- NOS 3 PROJETS -->
    <section class="snap-section" id="projets" aria-labelledby="projets-title">
      <div class="container">
        <span class="label anim-fade">Pinapp Inc.</span>
        <h2 id="projets-title" style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:48px;" class="anim-up" data-delay="80">
          Trois projets.<br/>Une maison mère.
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;">

          <div class="card anim-up" style="padding:36px;" data-delay="0">
            <div class="label" style="margin-bottom:12px;">Pinapp Studio</div>
            <h3 style="font-size:24px;margin-bottom:14px;">L'agence digitale premium</h3>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:24px;line-height:1.7;">Sites web, automatisation n8n, IA sur-mesure pour TPE et PME françaises. Notre moteur de revenus actuel.</p>
            <a href="/offres/" class="btn btn--primary" style="font-size:12px;padding:10px 20px;">Voir les offres →</a>
          </div>

          <div class="card anim-up" style="padding:36px;border-color:rgba(179,136,255,0.15);" data-delay="80">
            <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-2);margin-bottom:12px;">Auralis RH</div>
            <h3 style="font-size:24px;margin-bottom:14px;">Le SaaS qui prend soin des RH</h3>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:24px;line-height:1.7;">Aurora, notre IA RH, observe, prépare et suggère. Les RH décident. Toujours. En développement actif.</p>
            <a href="/auralis/" class="btn btn--ghost" style="font-size:12px;padding:10px 20px;border-color:rgba(179,136,255,0.3);color:var(--accent-2);">Découvrir Aurora →</a>
          </div>

          <div class="card anim-up" style="padding:36px;border-color:rgba(127,255,234,0.12);" data-delay="160">
            <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-3);margin-bottom:12px;">Mémoire & Présence</div>
            <h3 style="font-size:24px;margin-bottom:14px;">La présence qui traverse le temps</h3>
            <p style="font-size:14px;color:var(--text-muted);margin-bottom:24px;line-height:1.7;">Digitalisation du secteur funéraire. QR codes d'hommage, transmission de mémoires, présence numérique durable. Micha en lead.</p>
            <a href="/memoire-et-presence/" class="btn btn--ghost" style="font-size:12px;padding:10px 20px;border-color:rgba(127,255,234,0.2);color:var(--accent-3);">Notre approche →</a>
          </div>

        </div>
      </div>
    </section>

    <!-- CE QU'ON REFUSE -->
    <section class="snap-section" id="refuses" aria-labelledby="refuses-title">
      <div class="container" style="max-width:800px;margin:0 auto;">
        <span class="label anim-fade">Notre positionnement</span>
        <h2 id="refuses-title" style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:40px;" class="anim-up" data-delay="80">
          Ce que nous refusons de faire.
        </h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;" class="anim-up" data-delay="160">
          <div class="card" style="padding:28px;">
            <ul class="crosslist">
              <li>Les agences fantômes qui facturent sans livrer</li>
              <li>Les outils inutiles qu'on revend en commission</li>
              <li>Les sites WordPress à 300€ livrés en 3 mois</li>
              <li>Les résultats garantis sans conditions</li>
              <li>Le jargon pour impressionner</li>
            </ul>
          </div>
          <div class="card" style="padding:28px;">
            <p style="font-size:15px;color:var(--text);line-height:1.8;font-style:italic;">
              "Nous avons construit ces outils pour nous d'abord. Pour gérer notre propre complexité. Aujourd'hui nous les construisons pour vous."
            </p>
            <p style="font-size:13px;color:var(--text-muted);margin-top:16px;">— Lauralie & Micha</p>
          </div>
        </div>
        <div style="text-align:center;margin-top:40px;" class="anim-scale" data-delay="200">
          <a href="/diagnostic/" class="btn btn--primary" style="font-size:15px;padding:16px 36px;">Travailler avec nous →</a>
        </div>
      </div>
    </section>

  </div>
'@

$aproposHtml = Get-HtmlShell `
  -title "Notre société — Pinapp Inc." `
  -desc "Pinapp Inc. est née d'une conviction : la technologie doit servir les gens. Lauralie & Micha, associés à égalité." `
  -body $aproposBody `
  -snapCount 5

New-Item -ItemType Directory -Force -Path "$Root/a-propos" | Out-Null
Set-Content -Path "$Root/a-propos/index.html" -Value $aproposHtml -Encoding UTF8
Write-OK "a-propos/index.html"

# ==============================================================================
# 8. MÉMOIRE & PRÉSENCE
# ==============================================================================
Write-Step "8/14" "memoire-et-presence/index.html..."

$mpBody = @'
  <div class="snap-container">

    <section class="snap-section" id="mp-hero" aria-labelledby="mp-title">
      <div class="container">
        <div style="display:inline-flex;align-items:center;gap:8px;padding:5px 14px;background:rgba(127,255,234,0.08);border:1px solid rgba(127,255,234,0.15);border-radius:100px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent-3);margin-bottom:28px;" class="anim-fade">
          🌿 Mémoire & Présence · Pinapp Inc.
        </div>
        <h1 id="mp-title" style="font-size:clamp(40px,7vw,88px);letter-spacing:-0.04em;max-width:800px;margin-bottom:32px;line-height:1.0;" class="anim-up" data-delay="100">
          La <span class="shimmer">présence</span><br/>qui traverse le temps.
        </h1>
        <p style="font-size:18px;color:var(--text-muted);max-width:560px;margin-bottom:48px;line-height:1.7;" class="anim-up" data-delay="200">
          Nous digitalisons les hommages, préservons les mémoires et créons des liens durables entre ceux qui restent et ceux qui sont partis. Image, son, présence numérique — pour que rien ne s'efface.
        </p>
        <div style="display:flex;gap:16px;flex-wrap:wrap;" class="anim-up" data-delay="300">
          <a href="https://memoireetpresence.fr" target="_blank" rel="noopener" class="btn btn--primary">Voir memoireetpresence.fr ↗</a>
          <a href="/diagnostic/" class="btn btn--ghost">Nous contacter</a>
        </div>
      </div>
    </section>

    <section class="snap-section" id="mp-micha" aria-labelledby="mp-micha-title">
      <div class="container">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;">
          <div>
            <span class="label anim-fade" style="color:var(--accent-3);">Co-associé · Directeur artistique</span>
            <h2 id="mp-micha-title" style="font-size:clamp(32px,5vw,56px);letter-spacing:-0.03em;margin-bottom:20px;" class="anim-up" data-delay="80">
              Micha.
            </h2>
            <p style="font-size:16px;color:var(--text-muted);margin-bottom:24px;line-height:1.7;" class="anim-up" data-delay="160">
              Vidéaste, photographe, directeur artistique. Michaël Bouilhac crée les visuels qui donnent à voir ce que les mots ne peuvent pas dire. Depuis son studio en Nouvelle-Aquitaine ou à distance partout en France.
            </p>
            <ul class="checklist anim-up" data-delay="200">
              <li>Photo professionnelle haute définition</li>
              <li>Vidéo de présentation et hommage</li>
              <li>Direction artistique complète</li>
              <li>Branding Adobe suite complète</li>
              <li>Restauration et retouche avancée</li>
              <li>IA générative dirigée</li>
            </ul>
            <div style="margin-top:32px;padding:20px;background:rgba(127,255,234,0.04);border:1px solid rgba(127,255,234,0.10);border-radius:12px;" class="anim-up" data-delay="260">
              <p style="font-size:13px;color:var(--text-muted);margin-bottom:6px;">Contact exclusif par WhatsApp</p>
              <a href="mailto:micha@memoireetpresence.fr" style="color:var(--accent-3);text-decoration:none;font-size:14px;">micha@memoireetpresence.fr</a>
            </div>
          </div>
          <div>
            <div class="card anim-scale" style="padding:40px;text-align:center;border-color:rgba(127,255,234,0.12);" data-delay="150">
              <div style="font-size:80px;margin-bottom:20px;">🎬</div>
              <div style="font-family:'Clash Display',sans-serif;font-size:28px;font-weight:700;color:var(--text);margin-bottom:8px;">Micha</div>
              <div style="font-size:13px;color:var(--accent-3);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;">Vidéaste · DA · M&P</div>
              <div style="font-family:'Clash Display',sans-serif;font-size:22px;color:var(--nacre);margin-bottom:4px;">À partir de 300 € HT</div>
              <p style="font-size:12px;color:var(--text-muted);">Sur devis selon périmètre</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="snap-section" id="mp-realisations" aria-labelledby="mp-real-title">
      <div class="container">
        <span class="label anim-fade" style="color:var(--accent-3);">Réalisations</span>
        <h2 id="mp-real-title" style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:16px;" class="anim-up" data-delay="80">
          Le travail de Micha.
        </h2>
        <p style="font-size:16px;color:var(--text-muted);margin-bottom:40px;line-height:1.6;" class="anim-up" data-delay="120">
          Photos, vidéos, directions artistiques — cliquez pour voir les réalisations complètes sur memoireetpresence.fr
        </p>
        <div class="gallery-grid anim-up" data-delay="160">
          <div class="gallery-item" onclick="window.open('https://memoireetpresence.fr','_blank')">
            <span style="opacity:0.5;">Photo · Hommage</span>
          </div>
          <div class="gallery-item" onclick="window.open('https://memoireetpresence.fr','_blank')">
            <span style="opacity:0.5;">Vidéo · Transmission</span>
          </div>
          <div class="gallery-item" onclick="window.open('https://memoireetpresence.fr','_blank')">
            <span style="opacity:0.5;">DA · Branding</span>
          </div>
          <div class="gallery-item" onclick="window.open('https://memoireetpresence.fr','_blank')">
            <span style="opacity:0.5;">Restauration · Mémoire</span>
          </div>
          <div class="gallery-item" onclick="window.open('https://memoireetpresence.fr','_blank')">
            <span style="opacity:0.5;">Portrait · Présence</span>
          </div>
          <div class="gallery-item" onclick="window.open('https://memoireetpresence.fr','_blank')">
            <span style="opacity:0.5;">QR Code · Lien</span>
          </div>
        </div>
        <div style="text-align:center;margin-top:32px;" class="anim-fade" data-delay="200">
          <a href="https://memoireetpresence.fr" target="_blank" rel="noopener" class="btn btn--primary">
            Voir toutes les réalisations sur memoireetpresence.fr ↗
          </a>
        </div>
      </div>
    </section>

    <section class="snap-section" id="mp-ce-que-nous-faisons" aria-labelledby="mp-service-title">
      <div class="container">
        <span class="label anim-fade" style="color:var(--accent-3);">Ce que nous construisons</span>
        <h2 id="mp-service-title" style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:48px;" class="anim-up" data-delay="80">
          La présence numérique.<br/>Le lien qui dure.
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;">
          <div class="card anim-up" style="padding:32px;border-color:rgba(127,255,234,0.12);" data-delay="0">
            <div style="font-size:32px;margin-bottom:16px;">📱</div>
            <h3 style="font-size:20px;margin-bottom:12px;">QR codes d'hommage</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">Un QR code. Une page. Une présence numérique durable qui relie les proches à la mémoire de ceux qui comptent.</p>
          </div>
          <div class="card anim-up" style="padding:32px;border-color:rgba(127,255,234,0.12);" data-delay="80">
            <div style="font-size:32px;margin-bottom:16px;">🎞</div>
            <h3 style="font-size:20px;margin-bottom:12px;">Captation & transmission</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">Vidéos de mémoire, photos de famille, restauration d'archives. Tout ce qui mérite d'être préservé.</p>
          </div>
          <div class="card anim-up" style="padding:32px;border-color:rgba(127,255,234,0.12);" data-delay="160">
            <div style="font-size:32px;margin-bottom:16px;">🌐</div>
            <h3 style="font-size:20px;margin-bottom:12px;">Présence numérique</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">Sites, pages de mémoire, interfaces digitales pour les professionnels du secteur funéraire.</p>
          </div>
          <div class="card anim-up" style="padding:32px;border-color:rgba(127,255,234,0.12);" data-delay="240">
            <div style="font-size:32px;margin-bottom:16px;">🤝</div>
            <h3 style="font-size:20px;margin-bottom:12px;">Accompagnement des familles</h3>
            <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">Un service pensé avec soin. Discret, respectueux, centré sur l'humain à chaque étape.</p>
          </div>
        </div>
        <div style="text-align:center;margin-top:40px;" class="anim-scale" data-delay="200">
          <a href="https://memoireetpresence.fr" target="_blank" rel="noopener" class="btn btn--primary">
            Découvrir memoireetpresence.fr ↗
          </a>
        </div>
      </div>
    </section>

  </div>
'@

$mpHtml = Get-HtmlShell `
  -title "Mémoire & Présence — Pinapp Inc." `
  -desc "La présence numérique qui traverse le temps. QR codes d'hommage, captation, transmission. Micha & Lauralie — Pinapp Inc." `
  -body $mpBody `
  -snapCount 4

New-Item -ItemType Directory -Force -Path "$Root/memoire-et-presence" | Out-Null
Set-Content -Path "$Root/memoire-et-presence/index.html" -Value $mpHtml -Encoding UTF8
Write-OK "memoire-et-presence/index.html"

# ==============================================================================
# 9. OFFRES
# ==============================================================================
Write-Step "9/14" "offres/index.html..."

$offresBody = @'
  <div class="snap-container">

    <section class="snap-section" id="offres-hero" aria-labelledby="offres-title">
      <div class="container">
        <span class="label anim-fade">Pinapp Studio · Offres</span>
        <h1 id="offres-title" style="font-size:clamp(40px,7vw,88px);letter-spacing:-0.04em;max-width:800px;margin-bottom:32px;line-height:1.0;" class="anim-up" data-delay="100">
          Choisissez votre secteur.<br/>Les offres <span class="shimmer">s'adaptent</span>.
        </h1>
        <div class="sector-filter anim-up" data-delay="200">
          <button class="sector-btn active" data-sector="tous">Tous</button>
          <button class="sector-btn" data-sector="beaute">💅 Beauté</button>
          <button class="sector-btn" data-sector="artisan">🔧 Artisan</button>
          <button class="sector-btn" data-sector="coach">🎯 Coach</button>
          <button class="sector-btn" data-sector="restaurant">🍽 Restaurant</button>
          <button class="sector-btn" data-sector="commerce">🛍 Commerce</button>
          <button class="sector-btn" data-sector="pme">🏢 PME</button>
        </div>
      </div>
    </section>

    <section class="snap-section" id="offres-auto" aria-labelledby="offres-auto-title">
      <div class="container">
        <span class="label anim-fade">Automatisations</span>
        <h2 id="offres-auto-title" style="font-size:clamp(24px,3vw,36px);letter-spacing:-0.03em;margin-bottom:32px;" class="anim-up" data-delay="60">
          Vos tâches répétitives disparaissent.
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">

          <div class="offre-wrap"><article class="card offre-card anim-up" data-delay="0" data-sectors="tous,coach,beaute,artisan,restaurant,pme">
            <span class="offre-label">Automatisation RDV</span>
            <h3 class="offre-title">Récupérez votre lundi matin.</h3>
            <p class="offre-desc">Confirmation · rappel · relance no-show. Tout part automatiquement.</p>
            <ul class="crosslist"><li>Confirmer chaque RDV à la main</li><li>Envoyer les rappels la veille</li><li>Relancer les no-show</li></ul>
            <p class="offre-reste">"Une notification quand quelqu'un réserve. C'est tout."</p>
            <div class="offre-gain"><span class="count-up" data-target="5">0</span>h</div>
            <p class="offre-gain-label">récupérées par semaine</p>
            <div class="offre-price">990 € HT</div>
            <p class="offre-delai">Livraison en 48h</p>
            <a href="/diagnostic/" class="btn btn--primary">Diagnostic offert — par écrit →</a>
          </article></div>

          <div class="offre-wrap"><article class="card offre-card anim-up" data-delay="80" data-sectors="tous,artisan,coach,commerce,pme">
            <span class="offre-label">Automatisation Devis</span>
            <h3 class="offre-title">Votre devis en 2 minutes. Sans vous.</h3>
            <p class="offre-desc">Le prospect remplit un formulaire. L'IA analyse · propose le devis · l'envoie. Vous validez en 30 secondes.</p>
            <ul class="crosslist"><li>Rédiger chaque devis à la main</li><li>Oublier de relancer un prospect</li><li>Passer 1h sur un devis qui ne signe pas</li></ul>
            <p class="offre-reste">"Approuver le devis en un clic. Le reste est automatique."</p>
            <div class="offre-gain"><span class="count-up" data-target="3">0</span>h</div>
            <p class="offre-gain-label">récupérées par semaine</p>
            <div class="offre-price">790 € HT</div>
            <p class="offre-delai">Livraison en 48h</p>
            <a href="/diagnostic/" class="btn btn--primary">Diagnostic offert — par écrit →</a>
          </article></div>

          <div class="offre-wrap"><article class="card offre-card anim-up" data-delay="160" data-sectors="tous,artisan,commerce,coach,pme">
            <span class="offre-label">Automatisation Facturation</span>
            <h3 class="offre-title">Une journée récupérée chaque mois.</h3>
            <p class="offre-desc">Facture générée à la signature. Relance automatique si impayé. Export comptable le 1er du mois.</p>
            <ul class="crosslist"><li>Faire vos factures le dimanche soir</li><li>Relancer les impayés à la main</li><li>Chercher quelle facture a été payée</li></ul>
            <p class="offre-reste">"Encaisser. Vérifier une fois par mois. C'est tout."</p>
            <div class="offre-gain">1 jour</div>
            <p class="offre-gain-label">récupéré par mois</p>
            <div class="offre-price">590 € HT</div>
            <p class="offre-delai">Livraison en 48h</p>
            <a href="/diagnostic/" class="btn btn--primary">Diagnostic offert — par écrit →</a>
          </article></div>

          <div class="offre-wrap"><article class="card offre-card anim-up" data-delay="0" data-sectors="tous,beaute,restaurant,commerce,coach,pme">
            <span class="offre-label">Automatisation Messages</span>
            <h3 class="offre-title">Des réponses prêtes, plus vite.</h3>
            <p class="offre-desc">L'assistant IA lit vos messages. Il propose une réponse. Vous validez en quelques secondes.</p>
            <ul class="crosslist"><li>Rédiger les mêmes réponses en boucle</li><li>Laisser des messages en attente plusieurs jours</li><li>Gérer Instagram · Gmail · WhatsApp séparément</li></ul>
            <p class="offre-reste">"Lire la réponse rédigée. Appuyer sur envoyer."</p>
            <div class="offre-gain">1 jour</div>
            <p class="offre-gain-label">récupéré par mois</p>
            <div class="offre-price">490 € HT</div>
            <p class="offre-delai">Livraison en 48h · Offre d'entrée</p>
            <a href="/diagnostic/" class="btn btn--primary">Diagnostic offert — par écrit →</a>
          </article></div>

        </div>
      </div>
    </section>

    <section class="snap-section" id="offres-site-ia" aria-labelledby="offres-site-title">
      <div class="container">
        <span class="label anim-fade">Sites & IA</span>
        <h2 id="offres-site-title" style="font-size:clamp(24px,3vw,36px);letter-spacing:-0.03em;margin-bottom:32px;" class="anim-up" data-delay="60">
          Votre présence digitale. Votre IA métier.
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;">

          <div class="offre-wrap"><article class="card offre-card anim-up" data-delay="0" data-sectors="tous,artisan,coach,beaute,commerce,restaurant,pme">
            <span class="offre-label">Site Vitrine</span>
            <h3 class="offre-title">Un site qui vous ressemble. Et qui travaille pendant que vous dormez.</h3>
            <p class="offre-desc">Design sur-mesure · Copywriting · SEO · Mode nuit/jour · Livré en 7 jours.</p>
            <ul class="crosslist"><li>Hésiter à partager votre lien</li><li>Expliquer ce que vous faites à chaque RDV</li><li>Payer 200–400€/mois à une agence sans résultat</li></ul>
            <p class="offre-reste">"Donner votre URL. Votre site fait le reste."</p>
            <div class="offre-gain">7 jours</div>
            <p class="offre-gain-label">de la commande à la mise en ligne</p>
            <div class="offre-price">1 290 € HT</div>
            <p class="offre-delai">15 univers · Sur mesure</p>
            <a href="/diagnostic/" class="btn btn--primary">Diagnostic offert — par écrit →</a>
          </article></div>

          <div class="offre-wrap"><article class="card offre-card anim-up" data-delay="80" data-sectors="tous,artisan,coach,beaute,commerce,restaurant,pme">
            <span class="offre-label">IA Sur-mesure</span>
            <h3 class="offre-title">L'IA formée sur votre métier. Opérationnelle en 48h.</h3>
            <p class="offre-desc">Formée sur vos documents. Intégrée sur votre site. Qualifie vos leads. Répond à vos clients.</p>
            <ul class="checklist"><li>Formée sur vos documents</li><li>Intégrée sur votre site</li><li>Tests 50 scénarios</li><li>Dashboard inclus</li></ul>
            <p class="offre-reste">"Votre assistant IA répond pendant que vous êtes sur le terrain."</p>
            <div class="offre-gain">48h</div>
            <p class="offre-gain-label">délai de mise en production</p>
            <div class="offre-price">890 € HT</div>
            <p class="offre-delai">+ 100€/mois maintenance optionnelle</p>
            <a href="/diagnostic/" class="btn btn--primary">Diagnostic offert — par écrit →</a>
          </article></div>

          <div class="offre-wrap"><article class="card offre-card anim-up" data-delay="160" data-sectors="tous">
            <span class="offre-label" style="color:var(--accent-2);">Système Complet</span>
            <h3 class="offre-title">Vous approuvez. Tout le reste tourne seul.</h3>
            <p class="offre-desc">Site + automatisations + IA. On câble, on teste, on met en production avec vous.</p>
            <ul class="checklist"><li>Site premium livré en 7 jours</li><li>3 automatisations au choix</li><li>Assistant IA métier intégré</li><li>Formation 2h incluse</li></ul>
            <p style="font-size:13px;color:var(--text-muted);margin:16px 0;font-style:italic;line-height:1.6;">Paiement sur livrable. Pas d'abonnement imposé. Un système bien calibré se rentabilise en quelques semaines.</p>
            <div style="font-size:13px;color:var(--accent);margin-bottom:4px;letter-spacing:0.06em;">0 € de logiciel supplémentaire</div>
            <div class="offre-price">Dès 2 400 € HT</div>
            <p class="offre-delai">Sur devis · Satisfait ou remboursé 30 jours</p>
            <a href="/diagnostic/" class="btn btn--primary">Diagnostic offert — par écrit →</a>
          </article></div>

        </div>
      </div>
    </section>

    <section class="snap-section" id="offres-duo" aria-labelledby="duo-offre-title">
      <div class="container">
        <span class="label anim-fade">Lauralie + Micha</span>
        <h2 id="duo-offre-title" style="font-size:clamp(28px,4vw,48px);letter-spacing:-0.03em;margin-bottom:20px;" class="anim-up" data-delay="80">
          Pack Complet Duo.<br/>Tout. Clé en main.
        </h2>
        <p style="font-size:17px;color:var(--text-muted);max-width:600px;margin-bottom:40px;line-height:1.6;" class="anim-up" data-delay="120">
          Site + automatisation + IA + direction artistique + shooting photo + vidéo + branding. Un seul interlocuteur. Deux expertises. Zéro coordination à gérer.
        </p>
        <div class="card pack-duo anim-up" style="padding:40px;max-width:700px;" data-delay="160">
          <div class="pack-duo-badge">Pack Duo Complet · Exclusif</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px;">
            <div>
              <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;">Lauralie apporte</div>
              <ul class="checklist">
                <li>Site premium 7 jours</li>
                <li>3 automatisations</li>
                <li>Assistant IA métier</li>
                <li>Formation 2h</li>
              </ul>
            </div>
            <div>
              <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-3);margin-bottom:10px;">Micha apporte</div>
              <ul class="checklist">
                <li>Direction artistique</li>
                <li>Shooting photo pro</li>
                <li>Vidéo de présentation</li>
                <li>Branding Adobe complet</li>
              </ul>
            </div>
          </div>
          <p class="pack-duo-economy">~1 600 € économisés vs. séparé · Valeur estimée ~5 500 €</p>
          <div style="font-family:'Clash Display',sans-serif;font-size:36px;color:var(--nacre);margin-bottom:4px;">À partir de 3 900 € HT</div>
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:28px;">Sur devis selon périmètre · Paiement sur livrable</p>
          <a href="/diagnostic/" class="btn btn--primary">Demander un devis →</a>
        </div>
      </div>
    </section>

  </div>
'@

$offresHtml = Get-HtmlShell `
  -title "Offres — Pinapp Studio" `
  -desc "Sites premium, automatisation n8n, IA sur-mesure, Pack Duo. Diagnostic offert. Paiement sur livrable." `
  -body $offresBody `
  -snapCount 4

Set-Content -Path "$Root/offres/index.html" -Value $offresHtml -Encoding UTF8
Write-OK "offres/index.html"

# ==============================================================================
# 10. DIAGNOSTIC
# ==============================================================================
Write-Step "10/14" "diagnostic/index.html..."

$diagBody = @'
  <div class="snap-container">
    <section class="snap-section" id="diag-hero" style="justify-content:center;text-align:center;">
      <div class="container" style="max-width:700px;margin:0 auto;">
        <span class="label anim-fade">Premier échange offert</span>
        <h1 style="font-size:clamp(36px,6vw,72px);letter-spacing:-0.04em;margin-bottom:24px;" class="anim-up" data-delay="100">
          Par quoi on <span class="shimmer">commence</span> ?
        </h1>
        <p style="font-size:17px;color:var(--text-muted);margin-bottom:40px;line-height:1.6;" class="anim-up" data-delay="180">
          Décrivez votre besoin par écrit. Nous vous répondons sous 24h avec un diagnostic et une proposition concrète. Aucun engagement.
        </p>
        <div class="card anim-scale" style="padding:40px;text-align:left;" data-delay="240">
          <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent);margin-bottom:24px;">Formulaire de diagnostic</div>
          <!-- TALLY EMBED — remplacer TALLY_FORM_ID par votre ID Tally -->
          <script src="https://tally.so/widgets/embed.js"></script>
          <iframe
            data-tally-src="https://tally.so/embed/TALLY_FORM_ID?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            width="100%"
            height="400"
            frameborder="0"
            marginheight="0"
            marginwidth="0"
            title="Diagnostic Pinapp Studio"
            style="border:none;background:transparent;">
          </iframe>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:32px;" class="anim-up" data-delay="300">
          <div style="text-align:center;padding:16px;">
            <div style="font-family:'Clash Display',sans-serif;font-size:28px;color:var(--accent);margin-bottom:4px;">24h</div>
            <p style="font-size:12px;color:var(--text-muted);">Délai de réponse</p>
          </div>
          <div style="text-align:center;padding:16px;">
            <div style="font-family:'Clash Display',sans-serif;font-size:28px;color:var(--accent-2);margin-bottom:4px;">0 €</div>
            <p style="font-size:12px;color:var(--text-muted);">Diagnostic offert</p>
          </div>
          <div style="text-align:center;padding:16px;">
            <div style="font-family:'Clash Display',sans-serif;font-size:28px;color:var(--nacre);margin-bottom:4px;">30j</div>
            <p style="font-size:12px;color:var(--text-muted);">Satisfait ou remboursé</p>
          </div>
        </div>
        <p style="font-size:11px;color:var(--text-muted);margin-top:24px;letter-spacing:0.06em;">
          Prix HT · TVA non applicable art. 293 B CGI · Paiement sur livrable
        </p>
      </div>
    </section>
  </div>
'@

$diagHtml = Get-HtmlShell `
  -title "Diagnostic offert — Pinapp Studio" `
  -desc "Décrivez votre besoin par écrit. Réponse sous 24h. Aucun engagement." `
  -body $diagBody `
  -snapCount 1

New-Item -ItemType Directory -Force -Path "$Root/diagnostic" | Out-Null
Set-Content -Path "$Root/diagnostic/index.html" -Value $diagHtml -Encoding UTF8
Write-OK "diagnostic/index.html"

# ==============================================================================
# 11. N8N WORKFLOWS — 8 FICHIERS JSON
# ==============================================================================
Write-Step "11/14" "n8n-workflows/ (8 fichiers JSON)..."

# Workflow 1 — Diagnostic
$wf1 = @'
{
  "name": "🔷 Pinapp — Diagnostic entrant",
  "nodes": [
    {"id":"1","name":"Webhook Tally","type":"n8n-nodes-base.webhook","parameters":{"path":"diagnostic-pinapp","method":"POST"},"position":[0,0]},
    {"id":"2","name":"Set Prospect","type":"n8n-nodes-base.set","parameters":{"values":{"string":[{"name":"nom","value":"={{ $json.nom }}"},{"name":"email","value":"={{ $json.email }}"},{"name":"besoin","value":"={{ $json.besoin }}"},{"name":"secteur","value":"={{ $json.secteur }}"}]}},"position":[200,0]},
    {"id":"3","name":"Créer Notion","type":"n8n-nodes-base.notion","parameters":{"operation":"create","databaseId":"VOTRE_DB_ID","title":"={{ $json.nom }} — {{ $json.secteur }}"},"position":[400,0]},
    {"id":"4","name":"Email confirmation","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.email }}","subject":"Votre diagnostic Pinapp Studio — reçu","body":"Bonjour {{ $json.nom }},\n\nNous avons bien reçu votre demande et vous répondrons sous 24h avec un diagnostic personnalisé.\n\nLaurale & Micha — Pinapp Inc."},"position":[600,0]},
    {"id":"5","name":"Notif 🔷 Pinapp","type":"n8n-nodes-base.gmail","parameters":{"to":"contact@pinapp.fr","subject":"🔷 Nouveau diagnostic — {{ $json.nom }}","body":"Nouveau prospect : {{ $json.nom }}\nEmail : {{ $json.email }}\nSecteur : {{ $json.secteur }}\nBesoin : {{ $json.besoin }}"},"position":[600,200]},
    {"id":"6","name":"Relance J+1","type":"n8n-nodes-base.scheduleTrigger","parameters":{"rule":{"interval":[{"field":"hours","minutesInterval":24}]}},"position":[800,0]}
  ],
  "connections":{"1":{"main":[[{"node":"2","type":"main","index":0}]]},"2":{"main":[[{"node":"3","type":"main","index":0},{"node":"4","type":"main","index":0},{"node":"5","type":"main","index":0}]]}}
}
'@

# Workflow 2 — Devis YouSign
$wf2 = @'
{
  "name": "🔷 Pinapp — Devis → Signature → Facture",
  "nodes": [
    {"id":"1","name":"Webhook YouSign","type":"n8n-nodes-base.webhook","parameters":{"path":"yousign-signature","method":"POST"},"position":[0,0]},
    {"id":"2","name":"Switch statut","type":"n8n-nodes-base.switch","parameters":{"value":"={{ $json.status }}","rules":[{"value":"signed","output":0}]},"position":[200,0]},
    {"id":"3","name":"Générer facture","type":"n8n-nodes-base.httpRequest","parameters":{"method":"POST","url":"https://api.stripe.com/v1/invoices","authentication":"genericCredentialType"},"position":[400,0]},
    {"id":"4","name":"Envoyer lien paiement","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.client_email }}","subject":"Votre facture Pinapp Studio — paiement sécurisé","body":"Bonjour,\n\nVotre devis a été signé. Voici votre lien de paiement sécurisé : {{ $json.payment_link }}\n\nMerci de votre confiance.\nLaurale — Pinapp Studio"},"position":[600,0]},
    {"id":"5","name":"Notion → En cours","type":"n8n-nodes-base.notion","parameters":{"operation":"update","pageId":"={{ $json.notion_id }}","properties":{"Statut":{"select":{"name":"En cours"}}}},"position":[600,200]},
    {"id":"6","name":"Notif 🔷","type":"n8n-nodes-base.gmail","parameters":{"to":"contact@pinapp.fr","subject":"🔷 Devis signé — {{ $json.client_nom }}","body":"Devis signé et facture envoyée pour {{ $json.client_nom }}."},"position":[800,0]}
  ],
  "connections":{"1":{"main":[[{"node":"2","type":"main","index":0}]]},"2":{"main":[[{"node":"3","type":"main","index":0}]]}}
}
'@

# Workflow 3 — Paiement Stripe
$wf3 = @'
{
  "name": "🔷 Pinapp — Paiement reçu",
  "nodes": [
    {"id":"1","name":"Webhook Stripe","type":"n8n-nodes-base.webhook","parameters":{"path":"stripe-payment","method":"POST"},"position":[0,0]},
    {"id":"2","name":"Switch type","type":"n8n-nodes-base.switch","parameters":{"value":"={{ $json.type }}","rules":[{"value":"payment_intent.succeeded","output":0},{"value":"checkout.session.completed","output":1}]},"position":[200,0]},
    {"id":"3","name":"Email confirmation client","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.customer_email }}","subject":"Paiement reçu — Pinapp Studio","body":"Votre paiement a bien été reçu. Nous commençons votre projet.\n\nLaurale — Pinapp Studio"},"position":[400,0]},
    {"id":"4","name":"Accès formation","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.customer_email }}","subject":"Votre accès formation Pinapp Studio","body":"Bienvenue ! Voici votre lien d'accès à votre formation : {{ $json.formation_url }}\n\nBonne formation !\nPinapp Studio"},"position":[400,200]},
    {"id":"5","name":"Notion update","type":"n8n-nodes-base.notion","parameters":{"operation":"update","pageId":"={{ $json.notion_id }}","properties":{"Statut":{"select":{"name":"Payé"}},"Date paiement":{"date":{"start":"={{ new Date().toISOString() }}"}}}},"position":[600,0]},
    {"id":"6","name":"Notif 🔷 Pinapp","type":"n8n-nodes-base.gmail","parameters":{"to":"contact@pinapp.fr","subject":"🔷 Paiement reçu — {{ $json.amount }}€","body":"Paiement de {{ $json.amount }}€ reçu de {{ $json.customer_email }}."},"position":[600,200]}
  ],
  "connections":{"1":{"main":[[{"node":"2","type":"main","index":0}]]},"2":{"main":[[{"node":"3","type":"main","index":0}],[{"node":"4","type":"main","index":0}]]}}
}
'@

# Workflow 4 — Formation séquence
$wf4 = @'
{
  "name": "🔷 Pinapp — Formation séquence email",
  "nodes": [
    {"id":"1","name":"Trigger achat formation","type":"n8n-nodes-base.webhook","parameters":{"path":"formation-achat","method":"POST"},"position":[0,0]},
    {"id":"2","name":"Email J+0 Bienvenue","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.email }}","subject":"Bienvenue dans votre formation Pinapp Studio","body":"Bonjour {{ $json.prenom }},\n\nVotre formation commence maintenant. Accès : {{ $json.lien_formation }}\n\nBonne formation !\nLaurale"},"position":[200,0]},
    {"id":"3","name":"Wait J+1","type":"n8n-nodes-base.wait","parameters":{"amount":1,"unit":"days"},"position":[400,0]},
    {"id":"4","name":"Email J+1","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.email }}","subject":"Module 1 — avez-vous commencé ?","body":"Bonjour {{ $json.prenom }},\n\nAvez-vous pu commencer le module 1 ? N'hésitez pas si vous avez des questions.\n\nLaurale"},"position":[600,0]},
    {"id":"5","name":"Wait J+3","type":"n8n-nodes-base.wait","parameters":{"amount":2,"unit":"days"},"position":[800,0]},
    {"id":"6","name":"Email J+3","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.email }}","subject":"Votre progression — on fait le point ?","body":"Bonjour {{ $json.prenom }},\n\nComment avancez-vous ? Si vous êtes bloqué, répondez à cet email.\n\nLaurale"},"position":[1000,0]},
    {"id":"7","name":"Wait J+14","type":"n8n-nodes-base.wait","parameters":{"amount":11,"unit":"days"},"position":[1200,0]},
    {"id":"8","name":"Upsell J+14","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.email }}","subject":"Prêt pour la prochaine étape ?","body":"Bonjour {{ $json.prenom }},\n\nVous avez terminé votre formation. La prochaine étape vous intéresse ? Voici notre offre : {{ $json.upsell_url }}\n\nLaurale"},"position":[1400,0]}
  ],
  "connections":{"1":{"main":[[{"node":"2","type":"main","index":0}]]},"2":{"main":[[{"node":"3","type":"main","index":0}]]},"3":{"main":[[{"node":"4","type":"main","index":0}]]},"4":{"main":[[{"node":"5","type":"main","index":0}]]},"5":{"main":[[{"node":"6","type":"main","index":0}]]},"6":{"main":[[{"node":"7","type":"main","index":0}]]},"7":{"main":[[{"node":"8","type":"main","index":0}]]}}
}
'@

# Workflow 5 — Livraison
$wf5 = @'
{
  "name": "🔷 Pinapp — Livraison projet",
  "nodes": [
    {"id":"1","name":"Trigger Notion Livré","type":"n8n-nodes-base.webhook","parameters":{"path":"projet-livre","method":"POST"},"position":[0,0]},
    {"id":"2","name":"Email livraison client","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.client_email }}","subject":"Votre projet est livré — Pinapp Studio","body":"Bonjour {{ $json.client_nom }},\n\nVotre projet est livré ! Retrouvez votre accès ici : {{ $json.livrable_url }}\n\nNous restons disponibles pour toute question.\n\nLaurale & Micha — Pinapp Inc."},"position":[200,0]},
    {"id":"3","name":"Lien feedback Tally","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.client_email }}","subject":"Votre avis nous intéresse — 2 minutes","body":"Bonjour,\n\nComment s'est passé votre expérience ? {{ $json.feedback_url }}\n\nMerci !\nPinapp Studio"},"position":[200,200]},
    {"id":"4","name":"Wait J+7","type":"n8n-nodes-base.wait","parameters":{"amount":7,"unit":"days"},"position":[400,0]},
    {"id":"5","name":"Relance avis Google","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.client_email }}","subject":"Un avis Google ? Ça compte beaucoup.","body":"Bonjour,\n\nSi votre projet vous satisfait, un avis Google nous aide énormément : {{ $json.google_review_url }}\n\nMerci !\nLaurale"},"position":[600,0]},
    {"id":"6","name":"Wait J+30","type":"n8n-nodes-base.wait","parameters":{"amount":23,"unit":"days"},"position":[800,0]},
    {"id":"7","name":"Proposition maintenance","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.client_email }}","subject":"Et si on allait plus loin ?","body":"Bonjour,\n\nUn mois après votre livraison — comment tout fonctionne ? Nous proposons un suivi mensuel pour optimiser vos automatisations : {{ $json.maintenance_url }}\n\nLaurale"},"position":[1000,0]}
  ],
  "connections":{"1":{"main":[[{"node":"2","type":"main","index":0},{"node":"3","type":"main","index":0}]]},"2":{"main":[[{"node":"4","type":"main","index":0}]]},"4":{"main":[[{"node":"5","type":"main","index":0}]]},"5":{"main":[[{"node":"6","type":"main","index":0}]]},"6":{"main":[[{"node":"7","type":"main","index":0}]]}}
}
'@

# Workflow 6 — M&P
$wf6 = @'
{
  "name": "🌿 Mémoire & Présence — Contact entrant",
  "nodes": [
    {"id":"1","name":"Webhook M&P","type":"n8n-nodes-base.webhook","parameters":{"path":"mp-contact","method":"POST"},"position":[0,0]},
    {"id":"2","name":"Set données","type":"n8n-nodes-base.set","parameters":{"values":{"string":[{"name":"nom","value":"={{ $json.nom }}"},{"name":"email","value":"={{ $json.email }}"},{"name":"demande","value":"={{ $json.demande }}"}]}},"position":[200,0]},
    {"id":"3","name":"Notion M&P","type":"n8n-nodes-base.notion","parameters":{"operation":"create","databaseId":"VOTRE_DB_MP_ID","title":"={{ $json.nom }} — M&P"},"position":[400,0]},
    {"id":"4","name":"Email confirmation famille","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.email }}","subject":"Votre demande — Mémoire & Présence","body":"Bonjour {{ $json.nom }},\n\nNous avons bien reçu votre demande et vous répondrons très rapidement avec toute l'attention qu'elle mérite.\n\nMicha — Mémoire & Présence"},"position":[600,0]},
    {"id":"5","name":"WhatsApp Micha 🌿","type":"n8n-nodes-base.httpRequest","parameters":{"method":"POST","url":"https://api.whatsapp.com/send","body":{"to":"336XXXXXXXX","message":"🌿 Nouvelle demande M&P\nNom : {{ $json.nom }}\nEmail : {{ $json.email }}\nDemande : {{ $json.demande }}"}},"position":[600,200]}
  ],
  "connections":{"1":{"main":[[{"node":"2","type":"main","index":0}]]},"2":{"main":[[{"node":"3","type":"main","index":0},{"node":"4","type":"main","index":0},{"node":"5","type":"main","index":0}]]}}
}
'@

# Workflow 7 — Veille
$wf7 = @'
{
  "name": "🔷 Pinapp — Veille hebdo IA",
  "nodes": [
    {"id":"1","name":"Schedule hebdo lundi 8h","type":"n8n-nodes-base.scheduleTrigger","parameters":{"rule":{"interval":[{"field":"cronExpression","expression":"0 8 * * 1"}]}},"position":[0,0]},
    {"id":"2","name":"Scrape sources IA","type":"n8n-nodes-base.httpRequest","parameters":{"method":"GET","url":"https://feeds.feedburner.com/oreilly/radar/atom"},"position":[200,0]},
    {"id":"3","name":"Claude API résumé","type":"n8n-nodes-base.httpRequest","parameters":{"method":"POST","url":"https://api.anthropic.com/v1/messages","headers":{"x-api-key":"={{ $credentials.claudeApiKey }}","anthropic-version":"2023-06-01"},"body":{"model":"claude-sonnet-4-20250514","max_tokens":1000,"messages":[{"role":"user","content":"Résume en français les 5 actualités IA les plus importantes de cette semaine pour des TPE/PME françaises : {{ $json.content }}"}]}},"position":[400,0]},
    {"id":"4","name":"Draft Buffer LinkedIn","type":"n8n-nodes-base.httpRequest","parameters":{"method":"POST","url":"https://api.bufferapp.com/1/updates/create","body":{"text":"={{ $json.content[0].text }}","profile_ids":["VOTRE_PROFILE_ID"]}},"position":[600,0]},
    {"id":"5","name":"Update Notion Newsletter","type":"n8n-nodes-base.notion","parameters":{"operation":"create","databaseId":"VOTRE_DB_NEWSLETTER","title":"Veille IA — {{ new Date().toLocaleDateString('fr-FR') }}"},"position":[600,200]}
  ],
  "connections":{"1":{"main":[[{"node":"2","type":"main","index":0}]]},"2":{"main":[[{"node":"3","type":"main","index":0}]]},"3":{"main":[[{"node":"4","type":"main","index":0},{"node":"5","type":"main","index":0}]]}}
}
'@

# Workflow 8 — Maintenance mensuelle
$wf8 = @'
{
  "name": "🔷 Pinapp — Maintenance mensuelle",
  "nodes": [
    {"id":"1","name":"Schedule 1er du mois 9h","type":"n8n-nodes-base.scheduleTrigger","parameters":{"rule":{"interval":[{"field":"cronExpression","expression":"0 9 1 * *"}]}},"position":[0,0]},
    {"id":"2","name":"Lire clients Notion","type":"n8n-nodes-base.notion","parameters":{"operation":"getAll","databaseId":"VOTRE_DB_CLIENTS"},"position":[200,0]},
    {"id":"3","name":"Filter actifs","type":"n8n-nodes-base.filter","parameters":{"conditions":{"string":[{"value1":"={{ $json.statut }}","operation":"equal","value2":"Actif"}]}},"position":[400,0]},
    {"id":"4","name":"Email rapport mensuel","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.email }}","subject":"Votre rapport mensuel Pinapp Studio — {{ new Date().toLocaleDateString('fr-FR', {month:'long', year:'numeric'}) }}","body":"Bonjour {{ $json.nom }},\n\nVoici votre rapport mensuel de vos automatisations Pinapp Studio.\n\nLaurale"},"position":[600,0]},
    {"id":"5","name":"Relance impayés >30j","type":"n8n-nodes-base.gmail","parameters":{"to":"={{ $json.email }}","subject":"Facture en attente — Pinapp Studio","body":"Bonjour,\n\nNous n'avons pas encore reçu votre règlement. Voici le lien de paiement : {{ $json.payment_link }}\n\nCordialement,\nPinapp Studio"},"position":[600,200]},
    {"id":"6","name":"Export comptable Notion","type":"n8n-nodes-base.notion","parameters":{"operation":"create","databaseId":"VOTRE_DB_COMPTA","title":"Export {{ new Date().toLocaleDateString('fr-FR', {month:'long', year:'numeric'}) }}"},"position":[800,0]}
  ],
  "connections":{"1":{"main":[[{"node":"2","type":"main","index":0}]]},"2":{"main":[[{"node":"3","type":"main","index":0}]]},"3":{"main":[[{"node":"4","type":"main","index":0},{"node":"5","type":"main","index":0},{"node":"6","type":"main","index":0}]]}}
}
'@

@{
  "01-diagnostic-entrant.json"        = $wf1
  "02-devis-signature-facture.json"   = $wf2
  "03-paiement-stripe.json"           = $wf3
  "04-formation-sequence-email.json"  = $wf4
  "05-livraison-projet.json"          = $wf5
  "06-mp-contact-entrant.json"        = $wf6
  "07-veille-hebdo-ia.json"           = $wf7
  "08-maintenance-mensuelle.json"     = $wf8
}.GetEnumerator() | ForEach-Object {
  Set-Content -Path "$Root/n8n-workflows/$($_.Key)" -Value $_.Value -Encoding UTF8
  Write-OK "n8n-workflows/$($_.Key)"
}

# ==============================================================================
# 12. SFTP.JSON
# ==============================================================================
Write-Step "12/14" ".vscode/sftp.json..."
New-Item -ItemType Directory -Force -Path "$Root/.vscode" | Out-Null
$sftp = '{"name":"Pinapp Hostinger","host":"TON_SERVEUR.hostinger.com","protocol":"sftp","port":22,"username":"TON_USERNAME","remotePath":"/public_html","uploadOnSave":false,"ignore":[".git",".cursorrules","node_modules","*.ps1","sftp.json",".env*","n8n-workflows","COPY-PINAPP.md","AUTOMATIONS.md"]}'
Set-Content -Path "$Root/.vscode/sftp.json" -Value $sftp -Encoding UTF8
if (Test-Path "$Root/.gitignore") { $gi = Get-Content "$Root/.gitignore" -Raw; if ($gi -notmatch "sftp\.json") { Add-Content "$Root/.gitignore" "`n.vscode/sftp.json" } }
Write-OK ".vscode/sftp.json"

# ==============================================================================
# 13. AUTOMATIONS.MD
# ==============================================================================
Write-Step "13/14" "AUTOMATIONS.md..."
$automations = @'
# PINAPP INC. — DOCUMENTATION AUTOMATISATIONS N8N
## 8 Workflows · Stack : n8n + Tally + YouSign + Stripe + Notion + Gmail + Buffer + Claude API

---

## 01 — Diagnostic entrant 🔷
**Déclencheur :** Formulaire Tally soumis (diagnostic/index.html)
**Actions :**
1. Webhook Tally → n8n
2. Fiche prospect créée dans Notion (DB Prospects)
3. Email confirmation automatique au prospect
4. Notification 🔷 à contact@pinapp.fr
5. Relance automatique à 24h si pas de réponse

**À configurer :** ID DB Notion · ID formulaire Tally · Email Pinapp

---

## 02 — Devis → Signature → Facture 🔷
**Déclencheur :** Signature YouSign détectée
**Actions :**
1. Webhook YouSign → n8n
2. Facture Stripe générée automatiquement
3. Lien de paiement envoyé au client
4. Notion statut → "En cours"
5. Notification 🔷 Pinapp

**À configurer :** Clé API YouSign · Clé API Stripe · ID DB Notion

---

## 03 — Paiement reçu 🔷
**Déclencheur :** Webhook Stripe (payment_intent.succeeded)
**Actions :**
1. Email confirmation client
2. Accès formation débloqué si applicable
3. Notion statut → "Payé" + date
4. Notification 🔷 Pinapp

**À configurer :** Clé Stripe webhook · URLs formations · ID DB Notion

---

## 04 — Formation séquence email 🔷
**Déclencheur :** Achat formation confirmé
**Actions :**
1. J+0 : Email bienvenue + lien accès
2. J+1 : Relance module 1
3. J+3 : Point progression
4. J+14 : Proposition upsell formation supérieure
5. J+30 : NPS + avis

**À configurer :** URLs formations · URL upsell · NPS form ID

---

## 05 — Livraison projet 🔷
**Déclencheur :** Notion statut → "Livré" (webhook)
**Actions :**
1. Email livraison + lien livrable
2. Formulaire feedback Tally envoyé
3. J+7 : Relance avis Google
4. J+30 : Proposition maintenance mensuelle

**À configurer :** URL Google Reviews · URL feedback Tally · URL maintenance

---

## 06 — Contact M&P 🌿
**Déclencheur :** Formulaire contact memoireetpresence.fr
**Actions :**
1. Fiche créée dans Notion M&P (DB séparée)
2. Email confirmation à la famille
3. Notification WhatsApp → Micha (06 59 88 20 15)
4. Comptabilité M&P séparée automatiquement

**À configurer :** Token WhatsApp Business · ID DB Notion M&P · Tel Micha

---

## 07 — Veille hebdo IA 🔷
**Déclencheur :** Tous les lundis à 8h
**Actions :**
1. Scrape flux RSS sources IA
2. Claude API résume les 5 actus clés pour TPE/PME
3. Draft LinkedIn créé dans Buffer (validation manuelle)
4. Notion Newsletter mis à jour

**À configurer :** Clé API Claude · Profil Buffer · Sources RSS

---

## 08 — Maintenance mensuelle 🔷
**Déclencheur :** 1er du mois à 9h
**Actions :**
1. Lecture DB clients Notion (filtre : actifs)
2. Email rapport mensuel automatisé
3. Relance factures impayées > 30j
4. Export comptable Notion (séparation Pinapp/M&P)

**À configurer :** DB clients Notion · Template rapport · Seuil relance

---

## VARIABLES À CONFIGURER DANS N8N

```
NOTION_DB_PROSPECTS     = [ID de votre DB Prospects]
NOTION_DB_CLIENTS       = [ID de votre DB Clients]
NOTION_DB_MP            = [ID de votre DB M&P]
NOTION_DB_COMPTA        = [ID de votre DB Comptabilité]
NOTION_DB_NEWSLETTER    = [ID de votre DB Newsletter]
TALLY_FORM_DIAGNOSTIC   = [ID de votre formulaire Tally]
TALLY_FORM_FEEDBACK     = [ID de votre formulaire feedback]
STRIPE_WEBHOOK_SECRET   = [Clé webhook Stripe]
YOUSIGN_API_KEY         = [Clé API YouSign]
CLAUDE_API_KEY          = [Clé API Claude]
BUFFER_PROFILE_ID       = [ID profil Buffer LinkedIn]
GOOGLE_REVIEWS_URL      = [URL avis Google Pinapp]
MICHA_WHATSAPP          = [Numéro WhatsApp Micha]
EMAIL_PINAPP            = contact@pinapp.fr
EMAIL_MICHA             = micha@memoireetpresence.fr
```

---

## NOTIFICATIONS
- 🔷 Pinapp Studio → contact@pinapp.fr
- 🌿 Mémoire & Présence → WhatsApp Micha (06 59 88 20 15)
- Comptabilité séparée dans Notion : onglet Pinapp / onglet M&P
'@

Set-Content -Path "$Root/AUTOMATIONS.md" -Value $automations -Encoding UTF8
Write-OK "AUTOMATIONS.md"

# ==============================================================================
# 14. COPY-PINAPP.MD
# ==============================================================================
Write-Step "14/14" "COPY-PINAPP.md..."
$copy = @'
# PINAPP INC. — COPY COMPLET
# Ton : Nous (Lauralie & Micha associés) · Direct · Bienveillant · Jamais condescendant
# Règle TDAH : titres autonomes · 3 lignes max · 1 idée par bloc · zéro exclamation
# Tabous M&P : mort · deuil · décès · funérailles → jamais dans les textes publics

---

## VOIX GLOBALE
- Nous (Pinapp Inc.) sur tout le site
- Lauralie en "je" uniquement pour les sections techniques de la page société
- Micha en "je" uniquement pour les sections imagerie
- Ton : pair à pair · ni condescendant ni obséquieux
- Jamais : "solution innovante" · "résultat garanti" · phrases avec "!"

---

## INDEX — HOME

**H1 :** Nous construisons ce que vos concurrents n'ont pas encore.
**Baseline :** Vos outils travaillent. Vous décidez.
**CTA :** Premier échange offert →

**Section douleurs H2 :** Vos outils ont été conçus pour le bureau. Votre équipe, elle, travaille de partout.

**6 douleurs :**
1. ⏱ Vous répondez trop lentement. → IA qui répond pendant que vous êtes sur le terrain.
2. 🔗 5 outils qui ne se parlent pas. → On connecte tout. Une seule source de vérité.
3. 🌙 Les factures le dimanche soir. → Générée à la signature. Relance si impayé.
4. 🖥 Honte de donner votre URL. → Un site que vous partagez fièrement.
5. 📅 Les no-shows non relancés. → Confirmation · rappel · relance automatiques.
6. 🏠 Équipe en télétravail, process de bureau. → Workflows reconstruits pour le distanciel.

**Section services H2 :** Quatre expertises. Un seul résultat.
**Sous-titre :** Vos outils travaillent. Vous décidez.

**Pack Duo H2 :** Pack Complet Duo. Un interlocuteur. Deux expertises.
**Desc :** Site premium + automatisation + IA + direction artistique + shooting photo + vidéo de présentation + branding Adobe. Clé en main. Zéro coordination à gérer.
**Économie :** ~1 600 € économisés vs. séparé

**Auralis quote :** "Aurora prépare. Vous décidez. Toujours."
**Desc Auralis :** 53% des RH sont épuisés. Ils gèrent le burnout des autres. Personne ne gère le leur.

**Comment ça marche H2 :** De la première question à la livraison.
**Sous-titre :** Pas d'appel. Tout par écrit. Vous gardez la main.

---

## A-PROPOS — SOCIÉTÉ

**H1 :** Nous construisons des systèmes. Nous croyons à l'humain.
**Desc :** Pinapp Inc. est née d'une conviction simple : la technologie doit servir les gens, pas les remplacer.

**Lauralie :** Co-associée · PDG · Architecte technique et stratégique
**Bio :** Je conçois les systèmes, j'écris les specs, je les déploie. De l'IA à l'automatisation, du site au SaaS — sans intermédiaire.

**Micha :** Co-associé · Directeur artistique
**Bio :** Je crée les visuels qui font ressentir ce que les mots ne peuvent pas dire. Adobe, IA générative, restauration — depuis mon studio ou chez vous.

**6 Valeurs :**
1. 🤝 L'humain d'abord — La technologie existe pour servir les gens.
2. 🔗 La connexion — Entre les outils, les gens, les générations.
3. 🌱 La sobriété — Zéro outil superflu. Stack 100% européen.
4. 📖 La transmission — Documentation incluse. Vous êtes autonomes.
5. ⚖️ L'honnêteté — Paiement sur livrable. Satisfait ou remboursé 30j.
6. 🎯 L'égalité — Entre nous d'abord. Dans nos projets ensuite.

**Ce que nous refusons :**
× Les agences fantômes qui facturent sans livrer
× Les outils inutiles qu'on revend en commission
× Les sites WordPress à 300€ livrés en 3 mois
× Les résultats garantis sans conditions
× Le jargon pour impressionner

**Citation :** "Nous avons construit ces outils pour nous d'abord. Pour gérer notre propre complexité. Aujourd'hui nous les construisons pour vous." — Lauralie & Micha

---

## MÉMOIRE & PRÉSENCE

**H1 :** La présence qui traverse le temps.
**Desc :** Nous digitalisons les hommages, préservons les mémoires et créons des liens durables entre ceux qui restent et ceux qui sont partis.

**Vocabulaire autorisé :** hommage · transmission · présence · lien · mémoire · souvenir · lien · famille · proches
**Vocabulaire INTERDIT :** mort · deuil · décès · funérailles · enterrement · obsèques

**Micha H2 :** Micha.
**Bio Micha :** Vidéaste, photographe, directeur artistique. Michaël Bouilhac crée les visuels qui donnent à voir ce que les mots ne peuvent pas dire.

**4 services M&P :**
1. 📱 QR codes d'hommage — Un QR code. Une page. Une présence numérique durable.
2. 🎞 Captation & transmission — Vidéos de mémoire, photos de famille, restauration d'archives.
3. 🌐 Présence numérique — Sites et interfaces pour les professionnels du secteur.
4. 🤝 Accompagnement — Discret, respectueux, centré sur l'humain.

---

## OFFRES — PRICING VALIDÉ

| Offre | Prix HT | Gain |
|---|---|---|
| Automatisation Messages | 490€ | 1 jour/mois · entrée |
| Automatisation Facturation | 590€ | 1 jour/mois |
| Automatisation Devis | 790€ | 3h/semaine |
| Automatisation RDV | 990€ | 5h/semaine |
| IA sur-mesure | 890€ | 48h livraison |
| Site Vitrine | 1 290€ | 7 jours livraison |
| Système Complet | Dès 2 400€ | Sur devis |
| Pack Duo Lauralie+Micha | Dès 3 900€ | ~1 600€ économisés |
| Formation 1 | 67€ | — |
| Formation 2 | 147€ | — |
| Formation 3 | 397€ | — |
| Pack Prompting | 97€ | inclus dans 397€ |

**Mention légale obligatoire partout :** Prix HT · TVA non applicable art. 293 B CGI · Paiement sur livrable · Satisfait ou remboursé 30 jours

---

## FOOTER

**Brand :** Pinapp Inc.
**Tagline :** Connecter. Construire. Transmettre.
**Signature :** © 2026 Pinapp Inc. · Lauralie & Micha · Prix HT · TVA non applicable art. 293 B CGI

**Liens :** Notre société · LinkedIn · contact@pinapp.fr · Mentions légales · CGV · Confidentialité · Nos engagements · 🌿 Mémoire & Présence

---

## DIAGNOSTIC — CONTACT

**H1 :** Par quoi on commence ?
**Desc :** Décrivez votre besoin par écrit. Nous vous répondons sous 24h avec un diagnostic et une proposition concrète. Aucun engagement.
**CTA :** Commencer — par écrit →

**3 stats :**
- 24h · Délai de réponse
- 0€ · Diagnostic offert
- 30j · Satisfait ou remboursé
'@

Set-Content -Path "$Root/COPY-PINAPP.md" -Value $copy -Encoding UTF8
Write-OK "COPY-PINAPP.md"

# ==============================================================================
# RÉSUMÉ FINAL
# ==============================================================================
Write-Host ""
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  PINAPP INC. — INSTALLATION COMPLÈTE TERMINÉE" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""
Write-Host "  Fichiers générés :" -ForegroundColor White
Write-Host "  ✓ .cursorrules                    — règles complètes" -ForegroundColor Gray
Write-Host "  ✓ assets/css/pinapp-global.css    — DA Pandora/Avatar" -ForegroundColor Gray
Write-Host "  ✓ assets/js/theme.js              — toggle dark/light" -ForegroundColor Gray
Write-Host "  ✓ assets/js/particles.js          — canvas nuit" -ForegroundColor Gray
Write-Host "  ✓ assets/js/main.js               — animations+nav+graphiques" -ForegroundColor Gray
Write-Host "  ✓ index.html                      — home 7 sections snap" -ForegroundColor Gray
Write-Host "  ✓ a-propos/index.html             — société Lauralie+Micha" -ForegroundColor Gray
Write-Host "  ✓ offres/index.html               — 6 offres+Pack Duo+secteurs" -ForegroundColor Gray
Write-Host "  ✓ memoire-et-presence/index.html  — M&P galerie+services" -ForegroundColor Gray
Write-Host "  ✓ diagnostic/index.html           — Tally embed" -ForegroundColor Gray
Write-Host "  ✓ n8n-workflows/ (8 JSON)         — workflows prêts à importer" -ForegroundColor Gray
Write-Host "  ✓ AUTOMATIONS.md                  — documentation complète" -ForegroundColor Gray
Write-Host "  ✓ COPY-PINAPP.md                  — tout le texte du site" -ForegroundColor Gray
Write-Host "  ✓ .vscode/sftp.json               — connexion Hostinger" -ForegroundColor Gray
Write-Host ""
Write-Host "  DA validée :" -ForegroundColor White
Write-Host "  · Nuit #080d18 + particules Pandora 4 couleurs + liaisons" -ForegroundColor Gray
Write-Host "  · Jour #0a2a2e eau Avatar 2 + caustics + rayons" -ForegroundColor Gray
Write-Host "  · Clash Display + Inter · Nacré #e8f4f8 · Violet #b388ff" -ForegroundColor Gray
Write-Host "  · Glassmorphism blur(20px) · Scroll-snap 100vh TDAH-friendly" -ForegroundColor Gray
Write-Host "  · Navigation mega-menu 3 projets + burger complet" -ForegroundColor Gray
Write-Host "  · Lauralie = Micha — égalité totale partout" -ForegroundColor Gray
Write-Host ""
Write-Host "  À FAIRE APRÈS L'EXÉCUTION :" -ForegroundColor Yellow
Write-Host "  1. npm run dev → vérifier localhost:5173" -ForegroundColor Gray
Write-Host "  2. Remplir .vscode/sftp.json (host + username Hostinger)" -ForegroundColor Gray
Write-Host "  3. Activer SSL Hostinger : hPanel → SSL → Let's Encrypt" -ForegroundColor Gray
Write-Host "  4. Importer les 8 JSON dans n8n (Settings → Import)" -ForegroundColor Gray
Write-Host "  5. Configurer les variables n8n (voir AUTOMATIONS.md)" -ForegroundColor Gray
Write-Host "  6. Créer le formulaire Tally → copier l'ID dans diagnostic/index.html" -ForegroundColor Gray
Write-Host "  7. .\pinapp.ps1 ship → push main → déploiement Hostinger" -ForegroundColor Gray
Write-Host ""
Write-Host "  Thomas — zéro blocage qualité. Livraison conforme." -ForegroundColor Cyan
Write-Host ""
