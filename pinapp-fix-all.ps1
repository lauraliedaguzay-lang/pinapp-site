#Requires -Version 5.1
<#
.SYNOPSIS
  Webhook global, injection nav refonte + bottom bar, puis verify-site.mjs

.NOTES
  - Fragments nav/tabbar : lus depuis tools/home-refonte-body-fragment.html si marqueurs
    PINAPP_FIX_* présents ; sinon depuis tools/refonte-nav-tabbar-extract.html
    (home-refonte-body-fragment.html ne contient que les BLOCs 7–13 pour splice-home-refonte.)
  - Backup : fichier.bak avant chaque écriture
  - Graphisme / tokens refonte (palette Pandora, nav, tabbar) : assets/css/refonte-conformite.css
    — aligné sur tools/pinapp-refonte-complete.ps1 ; index racine à tenir manuellement cohérent avec l’extrait.
#>
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Root = $PSScriptRoot
$Tools = Join-Path $Root 'tools'
$WebhookFrom = 'REPLACE_WEBHOOK_PINAPP'
$WebhookTo = 'WEBHOOK_URL_FINALE'

$stats = @{
  Webhook = 0
  Nav     = 0
  Tabbar  = 0
  Skipped = 0
}

function Write-Step {
  param([string]$Message)
  Write-Host "[pinapp-fix-all] $Message" -ForegroundColor Cyan
}

function Backup-AndWrite {
  param(
    [string]$LiteralPath,
    [string]$NewContent,
    [string]$Reason
  )
  if (-not (Test-Path -LiteralPath $LiteralPath)) {
    throw ('Fichier inaccessible: ' + $LiteralPath)
  }
  $cur = [System.IO.File]::ReadAllText($LiteralPath, [System.Text.UTF8Encoding]::new($false))
  if ($cur -ceq $NewContent) {
    Write-Host "  (inchange) $LiteralPath" -ForegroundColor DarkGray
    return $false
  }
  $bak = $LiteralPath + '.bak'
  Copy-Item -LiteralPath $LiteralPath -Destination $bak -Force
  Write-Host "  backup -> $bak" -ForegroundColor Yellow
  [System.IO.File]::WriteAllText($LiteralPath, $NewContent, [System.Text.UTF8Encoding]::new($false))
  Write-Host "  MODIFIE ($Reason) $LiteralPath" -ForegroundColor Green
  return $true
}

function Test-ExcludedPath {
  param([string]$FullPath)
  $n = $FullPath.Replace('\', '/')
  if ($n -match '/(node_modules|\.git|_site)(/|$)') { return $true }
  return $false
}

# --- 1) WEBHOOK ---
Write-Step ('Etape 1 - Webhook: ' + $WebhookFrom + ' -> ' + $WebhookTo)
$ext = @('*.html', '*.js')
foreach ($pattern in $ext) {
  Get-ChildItem -LiteralPath $Root -Recurse -File -Filter $pattern -ErrorAction SilentlyContinue | ForEach-Object {
    if (Test-ExcludedPath $_.FullName) { return }
    $raw = [System.IO.File]::ReadAllText($_.FullName, [System.Text.UTF8Encoding]::new($false))
    if ($raw -notlike "*$WebhookFrom*") { return }
    $new = $raw.Replace($WebhookFrom, $WebhookTo)
    if (Backup-AndWrite -LiteralPath $_.FullName -NewContent $new -Reason 'webhook') {
      $script:stats.Webhook++
    }
  }
}

# --- Préparer fragments NAV / TABBAR ---
$bodyFragPath = Join-Path $Tools 'home-refonte-body-fragment.html'
$extractPath = Join-Path $Tools 'refonte-nav-tabbar-extract.html'
if (-not (Test-Path -LiteralPath $extractPath)) {
  throw ('Fichier requis manquant: ' + $extractPath)
}

$fragSource = if (Test-Path -LiteralPath $bodyFragPath) {
  [System.IO.File]::ReadAllText($bodyFragPath, [System.Text.UTF8Encoding]::new($false))
} else { '' }

if ($fragSource -match 'PINAPP_FIX_NAV_START') {
  Write-Step 'Fragments: marqueurs dans home-refonte-body-fragment.html'
  $src = $fragSource
} else {
  Write-Step 'Fragments: refonte-nav-tabbar-extract.html (body-fragment = blocs 7-13 seulement)'
  $src = [System.IO.File]::ReadAllText($extractPath, [System.Text.UTF8Encoding]::new($false))
}

if ($src -notmatch '(?s)<!--\s*PINAPP_FIX_NAV_START\s*-->\s*(.*?)\s*<!--\s*PINAPP_FIX_NAV_END\s*-->') {
  throw 'Bloc NAV introuvable (PINAPP_FIX_NAV_START/END).'
}
$navTpl = $Matches[1].TrimEnd() + "`n"

if ($src -notmatch '(?s)<!--\s*PINAPP_FIX_TABBAR_START\s*-->\s*(.*?)\s*<!--\s*PINAPP_FIX_TABBAR_END\s*-->') {
  throw 'Bloc TABBAR introuvable (PINAPP_FIX_TABBAR_START/END).'
}
$tabTpl = $Matches[1].TrimEnd() + "`n"

function Get-RelPrefix {
  param([string]$HtmlFileFullPath)
  $dir = [System.IO.Path]::GetDirectoryName($HtmlFileFullPath)
  $rootNorm = $Root.TrimEnd('\', '/')
  if ($dir.Length -le $rootNorm.Length) { return '' }
  if (-not $dir.StartsWith($rootNorm, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Fichier hors racine projet : $HtmlFileFullPath"
  }
  $sub = $dir.Substring($rootNorm.Length).TrimStart('\', '/')
  if ([string]::IsNullOrEmpty($sub)) { return '' }
  $depth = @($sub -split '[\\/]' | Where-Object { $_ -ne '' }).Count
  if ($depth -le 0) { return '' }
  return ('../' * $depth)
}

function Expand-NavTabbar {
  param(
    [string]$Template,
    [string]$Prefix
  )
  return $Template.Replace('{{P}}', $Prefix)
}

# --- Liste cibles NAV (hors index racine : déjà refonte) ---
$explicit = @(
  'a-propos\index.html',
  'auralis\index.html',
  'client\index.html',
  'comment-ca-marche\index.html',
  'confiance\index.html',
  'diagnostic\index.html',
  'expertise-ia\index.html',
  'faq\index.html',
  'formation-gratuite\index.html',
  'merci\index.html',
  'pourquoi-pinapp\index.html',
  'realisations\index.html',
  'univers\index.html',
  'votre-projet\index.html'
)

$targetFiles = New-Object System.Collections.Generic.List[string]
foreach ($rel in $explicit) {
  $fp = Join-Path $Root $rel
  if (Test-Path -LiteralPath $fp) { $targetFiles.Add($fp) }
  else { Write-Warning ('Fichier liste absent (ignore): ' + $fp) }
}

if (Test-Path -LiteralPath (Join-Path $Root 'offres')) {
  Get-ChildItem -LiteralPath (Join-Path $Root 'offres') -Recurse -File -Filter 'index.html' -ErrorAction SilentlyContinue |
    ForEach-Object { $targetFiles.Add($_.FullName) }
}
if (Test-Path -LiteralPath (Join-Path $Root 'demo')) {
  Get-ChildItem -LiteralPath (Join-Path $Root 'demo') -Recurse -File -Filter 'index.html' -ErrorAction SilentlyContinue |
    ForEach-Object { $targetFiles.Add($_.FullName) }
}

$uniqueTargets = $targetFiles | Sort-Object -Unique

# --- 2) NAV + TABBAR ---
Write-Step ('Etape 2 - Injection nav + tabbar, ' + $uniqueTargets.Count + ' fichiers candidats')

foreach ($file in $uniqueTargets) {
  if (Test-ExcludedPath $file) { continue }

  $html = [System.IO.File]::ReadAllText($file, [System.Text.UTF8Encoding]::new($false))
  $prefix = Get-RelPrefix -HtmlFileFullPath $file

  $hasRefonteNav = $html -match 'refonte-nav-link'
  $hasMainNav = $html -match 'id="mainNav"'
  $hasTab = $html -match 'pinapp-tabbar-refonte'

  $needNav = -not $hasRefonteNav -and -not $hasMainNav
  $needTab = -not $hasTab

  if (-not $needNav -and -not $needTab) {
    Write-Host "  (deja conforme) $file" -ForegroundColor DarkGray
    $stats.Skipped++
    continue
  }

  $navHtml = Expand-NavTabbar -Template $navTpl -Prefix $prefix
  $tabHtml = Expand-NavTabbar -Template $tabTpl -Prefix $prefix

  $newHtml = $html

  if ($needNav) {
    $m = [regex]::Match($newHtml, '(?i)<body[^>]*>')
    if (-not $m.Success) {
      throw ('Balise body ouvrante introuvable: ' + $file)
    }
    $insAt = $m.Index + $m.Length
    $newHtml = $newHtml.Insert($insAt, "`n" + $navHtml)
    Write-Host "  + nav refonte" -ForegroundColor Magenta
  } else {
    Write-Host '  (nav ignoree: mainNav ou refonte deja present)' -ForegroundColor DarkYellow
  }

  if ($needTab) {
    $lb = $newHtml.LastIndexOf('</body>', [System.StringComparison]::OrdinalIgnoreCase)
    if ($lb -lt 0) {
      throw ('Balise body fermante introuvable: ' + $file)
    }
    $newHtml = $newHtml.Insert($lb, "`n" + $tabHtml)
    Write-Host "  + tabbar refonte" -ForegroundColor Magenta
  }

  if ($newHtml -ceq $html) {
    $stats.Skipped++
    continue
  }

  $reason = @()
  if ($needNav) { $reason += 'nav' }
  if ($needTab) { $reason += 'tabbar' }
  $reasonStr = $reason -join '+'

  if (Backup-AndWrite -LiteralPath $file -NewContent $newHtml -Reason $reasonStr) {
    if ($needNav) { $stats.Nav++ }
    if ($needTab) { $stats.Tabbar++ }
  }
}

# --- 3) VERIFICATION ---
Write-Step 'Etape 3 - node tools/verify-site.mjs'
$verifyExit = 1
Push-Location $Root
try {
  & node (Join-Path $Tools 'verify-site.mjs')
  if ($null -ne $LASTEXITCODE) { $verifyExit = $LASTEXITCODE }
  else { $verifyExit = 0 }
} finally {
  Pop-Location
}
Write-Host "verify-site.mjs exit code: $verifyExit" -ForegroundColor $(if ($verifyExit -eq 0) { 'Green' } else { 'Red' })

# --- 4) RAPPORT ---
Write-Step 'Etape 4 - Rapport'
Write-Host ''
Write-Host ('Fichiers modifies (webhook)  : ' + $stats.Webhook) -ForegroundColor White
Write-Host ('Fichiers nav injectee        : ' + $stats.Nav) -ForegroundColor White
Write-Host ('Fichiers tabbar injectee     : ' + $stats.Tabbar) -ForegroundColor White
Write-Host ('Fichiers inchanges (deja OK) : ' + $stats.Skipped) -ForegroundColor White
Write-Host ""

if ($verifyExit -ne 0) {
  exit $verifyExit
}
