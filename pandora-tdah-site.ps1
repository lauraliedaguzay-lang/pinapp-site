# =============================================================
#  pandora-tdah-site.ps1 — Pinapp Studio
#  UX TDAH : modale Tally inline, sticky CTA, textes courts, F-pattern
#  Racine du repo · pwsh recommande
#
#  Deploy : -SkipDeploy  ou  $env:PINAPP_SKIP_DEPLOY = '1'
# =============================================================

param(
    [switch]$SkipDeploy
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$ROOT   = Split-Path -Parent $MyInvocation.MyCommand.Path
$INDEX  = Join-Path $ROOT "index.html"
$DATE   = Get-Date -Format "yyyyMMdd-HHmm"
$BACKUP = Join-Path $ROOT "index.tdah-backup.$DATE.html"

Write-Host "`n[PINAPP] TDAH — optimisation site (vitrine)" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor DarkGray

if (-not (Test-Path $INDEX)) {
    Write-Host "ERREUR : index.html introuvable a la racine." -ForegroundColor Red
    exit 1
}

Copy-Item $INDEX $BACKUP -Force
Write-Host "OK Backup : index.tdah-backup.$DATE.html" -ForegroundColor Green

$html = [System.IO.File]::ReadAllText($INDEX, [System.Text.Encoding]::UTF8)

# --- CSS (variables alignees sur style.css : --bg --surface --text --muted --border --teal --violet) ---
$CSS_TDAH = @'
<style id="pandora-tdah">
/* TDAH : F-pattern, modale, friction reduite */
.card p,
.section__sub,
.manifeste__col p {
  max-width: 52ch;
  line-height: 1.55;
}
.card ul { margin: 0.35rem 0 0; padding-left: 1.1rem; }
.card ul li { margin: 0.2rem 0; }

.tdah-modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(5, 10, 15, 0.88);
  backdrop-filter: blur(10px);
  z-index: 9000;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.tdah-modal-overlay.is-open { display: flex; }

.tdah-modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 100%;
  max-width: 560px;
  max-height: 90dvh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
}

.tdah-modal__close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.tdah-modal__close:hover { opacity: 0.92; }

.tdah-modal__header {
  padding: 1.25rem 1.25rem 0.5rem;
  border-bottom: 1px solid var(--border);
}
.tdah-modal__title {
  font-family: Inter, system-ui, sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 0.25rem;
  text-wrap: balance;
}
.tdah-modal__sub {
  font-size: 0.8rem;
  color: var(--muted);
  margin: 0;
}

.tdah-modal__body { padding: 1rem 1.25rem 1.25rem; }

.tdah-modal iframe {
  width: 100%;
  min-height: 420px;
  border: none;
  border-radius: 8px;
  background: transparent;
}

.tdah-steps {
  display: flex;
  gap: 0.35rem;
  padding: 0.65rem 1.25rem;
  border-bottom: 1px solid var(--border);
}
.tdah-step {
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: var(--border);
  transition: background 0.25s ease;
}
.tdah-step.active { background: var(--teal); }
.tdah-step.done { background: var(--violet); }

.tdah-confirm {
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 1rem;
  text-align: center;
}
.tdah-confirm.is-visible { display: flex; }
.tdah-confirm__icon { font-size: 2.5rem; line-height: 1; }
.tdah-confirm__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}
.tdah-confirm__sub { font-size: 0.85rem; color: var(--muted); margin: 0; }

:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: 3px;
  border-radius: 4px;
}

.hero .btn--primary.js-tdah-open {
  animation: tdah-breathe 4s ease-in-out infinite;
}
@keyframes tdah-breathe {
  0%, 100% { box-shadow: 0 0 16px rgba(0, 201, 177, 0.08); }
  50% { box-shadow: 0 0 22px rgba(0, 201, 177, 0.12); }
}

.tdah-sticky-cta {
  display: none;
  position: fixed;
  bottom: max(1rem, env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  z-index: 800;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
@media (max-width: 768px) {
  .tdah-sticky-cta { display: inline-flex; }
}

.tdah-badge-hero {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--teal);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.3rem 0.75rem;
  margin-bottom: 0.75rem;
  background: var(--teal-glow);
}
.tdah-badge-hero__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--teal);
  animation: tdah-pulse 2s ease-in-out infinite;
}
@keyframes tdah-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.55; transform: scale(0.92); }
}
</style>
'@

if ($html -notmatch 'id="pandora-tdah"') {
    $html = $html -replace '(</head>)', "$CSS_TDAH`n`$1"
    Write-Host "OK CSS TDAH injecte dans head" -ForegroundColor Green
} else {
    Write-Host "i CSS TDAH deja present — skip" -ForegroundColor Yellow
}

$MODAL_BLOCK = @'

<!-- Pandora TDAH : modale Tally -->
<div class="tdah-modal-overlay" id="tallyModal" role="dialog" aria-modal="true" aria-labelledby="tdahModalTitle">
  <div class="tdah-modal">
    <button type="button" class="tdah-modal__close" id="tdahModalClose" aria-label="Fermer la fenetre">&times;</button>
    <div class="tdah-modal__header">
      <h2 class="tdah-modal__title" id="tdahModalTitle">Obtenir une reponse sous 24 h</h2>
      <p class="tdah-modal__sub">Deux minutes — meme onglet. Pas de page perdue.</p>
    </div>
    <div class="tdah-steps" aria-hidden="true">
      <div class="tdah-step active" id="tdahStep1"></div>
      <div class="tdah-step" id="tdahStep2"></div>
      <div class="tdah-step" id="tdahStep3"></div>
    </div>
    <div class="tdah-modal__body">
      <iframe
        src="https://tally.so/embed/PINAPP-DIAGNOSTIC?alignLeft=1&amp;hideTitle=1&amp;transparentBackground=1&amp;dynamicHeight=1"
        loading="lazy"
        id="tdahTallyFrame"
        title="Formulaire Pinapp Studio — premier echange"
      ></iframe>
      <div class="tdah-confirm" id="tdahTallyConfirm" role="status" aria-live="polite" hidden>
        <div class="tdah-confirm__icon" aria-hidden="true">&#10003;</div>
        <h3 class="tdah-confirm__title">Message bien envoye</h3>
        <p class="tdah-confirm__sub">Nous revenons vers vous sous 24 h. Verifiez vos spams si besoin.</p>
      </div>
    </div>
  </div>
</div>
<a href="#contact" class="btn btn--primary tdah-sticky-cta js-tdah-open" id="tdahStickyCta" aria-controls="tallyModal">Demander une reponse — 2 min</a>
<script>
(function () {
  'use strict';
  var overlay = document.getElementById('tallyModal');
  var closeBtn = document.getElementById('tdahModalClose');
  var confirmEl = document.getElementById('tdahTallyConfirm');
  var frame = document.getElementById('tdahTallyFrame');
  var sticky = document.getElementById('tdahStickyCta');

  function resetSteps() {
    ['tdahStep1', 'tdahStep2', 'tdahStep3'].forEach(function (id, i) {
      var s = document.getElementById(id);
      if (!s) return;
      s.classList.remove('active', 'done');
      if (i === 0) s.classList.add('active');
    });
  }

  function openModal(e) {
    if (e) e.preventDefault();
    if (!overlay) return;
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (frame) frame.style.display = '';
    if (confirmEl) {
      confirmEl.classList.remove('is-visible');
      confirmEl.hidden = true;
    }
    resetSteps();
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 80);
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if (frame) frame.style.display = '';
    if (confirmEl) {
      confirmEl.classList.remove('is-visible');
      confirmEl.hidden = true;
    }
    resetSteps();
  }

  if (overlay) {
    overlay.addEventListener('click', function (ev) {
      if (ev.target === overlay) closeModal();
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && overlay && overlay.classList.contains('is-open')) closeModal();
  });

  window.addEventListener('message', function (ev) {
    if (!ev.data || ev.data.type !== 'tally-form-submitted') return;
    if (frame) frame.style.display = 'none';
    if (confirmEl) {
      confirmEl.hidden = false;
      confirmEl.classList.add('is-visible');
    }
    ['tdahStep1', 'tdahStep2', 'tdahStep3'].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) {
        s.classList.remove('active');
        s.classList.add('done');
      }
    });
    setTimeout(closeModal, 3000);
  });

  document.querySelectorAll('a.js-tdah-open[href="#contact"]').forEach(function (el) {
    el.addEventListener('click', openModal);
  });

  if (sticky) {
    window.addEventListener(
      'scroll',
      function () {
        var y = window.scrollY || document.documentElement.scrollTop;
        sticky.style.opacity = y > 400 ? '1' : '0';
        sticky.style.pointerEvents = y > 400 ? 'auto' : 'none';
      },
      { passive: true }
    );
    sticky.style.opacity = '0';
    sticky.style.transition = 'opacity 0.25s ease';
  }

  if (frame) {
    frame.addEventListener('load', function () {
      var s2 = document.getElementById('tdahStep2');
      if (s2) s2.classList.add('active');
    });
  }
})();
</script>
'@

if ($html -notmatch 'id="tallyModal"') {
    $html = $html -replace '(</body>)', "$MODAL_BLOCK`n`$1"
    Write-Host "OK Modale Tally + script injectes avant </body>" -ForegroundColor Green
} else {
    Write-Host "i Modale TDAH deja presente — skip injection HTML" -ForegroundColor Yellow
}

# --- Copy courts + badge hero + classes js-tdah-open (idempotent sur marqueurs) ---
if ($html -notmatch '<div class="tdah-badge-hero"') {
    Write-Host "... Textes courts + badge + liens modale" -ForegroundColor Cyan

    $html = $html -replace '<div class="hero__inner">', @'
<div class="hero__inner">
            <div class="tdah-badge-hero" role="status" aria-live="polite"><span class="tdah-badge-hero__dot" aria-hidden="true"></span>Reponse sous 24 h</div>
'@

    $html = $html -replace '<p class="hero__baseline">Je pense le système\.&#10;Je le construis\.&#10;Vous récoltez\.</p>',
        '<p class="hero__baseline">Dites-nous votre besoin en 2 minutes.<br />Nous repondons sous 24 h avec la suite claire.</p>'

    $html = $html -replace '<p class="hero__kicker hero__kicker--tw">Systèmes digitaux · Automatisation IA · Design premium</p>',
        '<p class="hero__kicker hero__kicker--tw">Sites et systemes qui travaillent pendant que vous avancez.</p>'

    $html = $html -replace '<p>Le monde s''accélère\.<br />Les outils explosent\.<br />Les humains s''épuisent\.</p>',
        '<p>Trop d''outils, pas assez de clarte.<br />Nous reduisons le bruit.</p>'

    $html = $html -replace '<p>Le problème n''est plus le manque d''outils\.<br />C''est le manque de structure\.</p>',
        '<p>Le probleme : des outils sans systeme.<br />La solution : un fil conducteur unique.</p>'

    $html = $html -replace '<p>Nous ne vendons pas des logiciels\.<br />Nous construisons des systèmes<br />qui pensent à votre place\.</p>',
        '<p>Nous vendons des systemes qui pensent a votre place.<br />Pas des logiciels isolés.</p>'

    $html = $html -replace '<p>Sites premium · Landing pages · Écosystèmes digitaux complets\.</p>',
        '<ul><li>Site ou landing premium</li><li>Livraison cadrée</li><li>SEO de base inclus</li></ul>'

    $html = $html -replace '<p>n8n · Workflows intelligents · Zéro tâche manuelle répétitive\.</p>',
        '<ul><li>Workflows n8n sur mesure</li><li>Moins de saisie manuelle</li><li>Alertes utiles</li></ul>'

    $html = $html -replace '<p>Chatbots métier · Agents autonomes · RAG · Auralis\.</p>',
        '<ul><li>Chatbot métier + RAG</li><li>Agents utiles, pas gadget</li><li>Données sous votre contrôle</li></ul>'

    $html = $html -replace '<p>Apprendre l''IA concrètement · Maîtriser ses outils · Devenir autonome\.</p>',
        '<ul><li>Parcours court et concret</li><li>Exercices actionnables</li><li>Autonomie rapidement</li></ul>'

    $html = $html -replace '<p class="section__sub">Chaque démo est un système réel\.</p>',
        '<p class="section__sub">Chaque démo montre un resultat reel, pas une maquette vide.</p>'

    $html = $html -replace '<p class="section__sub">Chaque offre structure une étape\.</p>',
        '<p class="section__sub">Chaque offre = une étape claire vers plus de marge et moins de charge.</p>'

    $html = $html -replace '<p class="section__sub">Posez des bases solides\. Devenez visible\. Structurez\.</p>',
        '<p class="section__sub">À partir de 1 290 € HT — site vitrine cle en main, copy et SEO essentiels.</p>'

    $html = $html -replace '<p class="section__sub">Votre activité tourne sans vous\.</p>',
        '<p class="section__sub">Dès 2 400 € HT — systeme complet sur devis, automatisation incluse.</p>'

    $html = $html -replace '<p class="section__sub">Un système complet et autonome\.</p>',
        '<p class="section__sub">Pack duo Lauralie + Micha : dès 3 900 € HT — image + systeme alignés.</p>'

    $html = $html -replace '<p class="price">Prix à définir</p>\s*<a class="btn btn--outline-violet" href="#contact">Démarrer →</a>',
        "<p class=`"price`">1 290 &euro; HT + TVA art. 293 B CGI — vitrine cle en main</p>`n                <a class=`"btn btn--outline-violet js-tdah-open`" href=`"#contact`">Demarrer — reponse 24 h</a>"

    $html = $html -replace '<p class="price">Prix à définir</p>\s*<a class="btn btn--primary" href="#contact">Accélérer →</a>',
        "<p class=`"price`">2 400 &euro; HT + TVA art. 293 B CGI — systeme sur devis</p>`n                <a class=`"btn btn--primary js-tdah-open`" href=`"#contact`">Accelerer — audit inclus</a>"

    $html = $html -replace '<p class="price">Prix à définir</p>\s*<a class="btn btn--ghost" href="#contact">Transformer →</a>',
        "<p class=`"price`">3 900 &euro; HT + TVA art. 293 B CGI — duo sur devis</p>`n                <a class=`"btn btn--ghost js-tdah-open`" href=`"#contact`">Transformer — un seul interlocuteur duo</a>"

    $html = $html -replace '<a class="btn btn--primary" href="#contact">Lancer mon projet →</a>',
        '<a class="btn btn--primary js-tdah-open" href="#contact">Lancer mon projet — formulaire 2 min</a>'

    $html = $html -replace '<a href="#contact">Contact</a>', '<a href="#contact" class="js-tdah-open">Contact</a>'

    Write-Host "OK Copy + badge + classes js-tdah-open" -ForegroundColor Green
} else {
    Write-Host "i Badge TDAH deja present — skip copy" -ForegroundColor Yellow
}

[System.IO.File]::WriteAllText($INDEX, $html, [System.Text.Encoding]::UTF8)
Write-Host "OK index.html ecrit" -ForegroundColor Green

# --- Deploy (meme logique que pandora-design) ---
$skipDeploy = $SkipDeploy -or ($env:PINAPP_SKIP_DEPLOY -match '^(1|true|yes)$')
if ($skipDeploy) {
    Write-Host "`n... DEPLOY Hostinger [SKIP]" -ForegroundColor Yellow
    Write-Host "   Local : index.html" -ForegroundColor DarkGray
} else {
    Write-Host "`n... DEPLOY Hostinger" -ForegroundColor Cyan
    $ENV_FILE = Join-Path $env:USERPROFILE ".pinapp-fr-env.ps1"
    $H = $null; $U = $null; $PW = $null; $RP = "/public_html"

    if (Test-Path $ENV_FILE) {
        Write-Host "OK Credentials trouves" -ForegroundColor Green
        . $ENV_FILE
        foreach ($n in 'SFTP_HOST', 'FTP_HOST', 'HOSTINGER_HOST') { $v = Get-Variable $n -EA SilentlyContinue; if ($v) { $H = $v.Value; break } }
        foreach ($n in 'SFTP_USER', 'FTP_USER', 'HOSTINGER_USER') { $v = Get-Variable $n -EA SilentlyContinue; if ($v) { $U = $v.Value; break } }
        foreach ($n in 'SFTP_PASS', 'FTP_PASS', 'HOSTINGER_PASS') { $v = Get-Variable $n -EA SilentlyContinue; if ($v) { $PW = $v.Value; break } }
        foreach ($n in 'SFTP_PATH', 'REMOTE_PATH', 'FTP_PATH') { $v = Get-Variable $n -EA SilentlyContinue; if ($v) { $RP = $v.Value; break } }
    }

    if (-not $H) { $H = Read-Host "  Hote SFTP" }
    if (-not $U) { $U = Read-Host "  Utilisateur SFTP" }
    if (-not $PW) {
        $sec = Read-Host "  Mot de passe SFTP" -AsSecureString
        $PW = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
    }

    $WINSCP = @(
        "C:\Program Files (x86)\WinSCP\WinSCP.com",
        "C:\Program Files\WinSCP\WinSCP.com",
        "$env:LOCALAPPDATA\Programs\WinSCP\WinSCP.com"
    ) | Where-Object { Test-Path $_ } | Select-Object -First 1

    if ($WINSCP) {
        $TMP = Join-Path $env:TEMP "tdah-deploy.txt"
        $WLOG = Join-Path $env:TEMP ("winscp-pandora-tdah-{0:yyyyMMdd-HHmmss}.log" -f (Get-Date))
        $winScpScript = @"
option batch abort
option confirm off
open sftp://${U}:${PW}@${H}/ -hostkey=*
put `"$INDEX`" `"${RP}/index.html`"
exit
"@
        $winScpScript | Set-Content $TMP -Encoding UTF8
        & $WINSCP @("/log=$WLOG", "/script=$TMP")
        Remove-Item $TMP -Force
        Write-Host "   Log WinSCP : $WLOG" -ForegroundColor DarkGray
        if ($LASTEXITCODE -eq 0) { Write-Host "`nOK Deploy reussi -> https://pinapp.fr" -ForegroundColor Green }
        else { Write-Host "`nWARN Erreur WinSCP ($LASTEXITCODE)" -ForegroundColor Red }
    } else {
        Write-Host "WARN WinSCP absent — upload manuel index.html" -ForegroundColor Yellow
    }
}

Write-Host "`nOK TDAH site termine." -ForegroundColor Cyan
Write-Host "   Remplacer PINAPP-DIAGNOSTIC dans l iframe Tally si besoin." -ForegroundColor DarkGray
Write-Host "   Importer pinapp-n8n-workflows.json (tableau workflows) dans n8n." -ForegroundColor DarkGray
Write-Host "   Backup : index.tdah-backup.$DATE.html`n" -ForegroundColor DarkGray
