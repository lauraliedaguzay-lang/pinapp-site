#Requires -Version 5.1
<#
.SYNOPSIS
  Prépare la branche V4.0 avant polish (Magic MCP côté Cursor local).

.DESCRIPTION
  - Vérifie / bascule sur cursor/v40-schema-fidele-df83
  - fetch + pull
  - Vérifie les scripts MCP 21st.dev
  - Signale michael.jpg / teaser mp4 ; option placeholder teaser 3s si ffmpeg + source MP4
  - Affiche git log ; commit/push uniquement si changements (ex. nouveau teaser)

.NOTES
  Ne jamais coller de clé API dans ce fichier. TWENTYFIRST_API_KEY = variable d’environnement uniquement.
#>
$ErrorActionPreference = 'Stop'

Write-Host "`nPINAPP V4.0 · POLISH PREP`n" -ForegroundColor Cyan

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$targetBranch = 'cursor/v40-schema-fidele-df83'

Write-Host "Etape 1/6 · Branche git..." -ForegroundColor Yellow
$current = (git rev-parse --abbrev-ref HEAD).Trim()
if ($current -ne $targetBranch) {
  Write-Host "  Bascule $current -> $targetBranch" -ForegroundColor Yellow
  git fetch origin
  git checkout $targetBranch
}
git pull origin $targetBranch
Write-Host "  OK : $targetBranch" -ForegroundColor Green

Write-Host "`nEtape 2/6 · ffmpeg..." -ForegroundColor Yellow
$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ffmpeg -and (Test-Path 'C:\ffmpeg\bin\ffmpeg.exe')) {
  $env:PATH = "C:\ffmpeg\bin;$env:PATH"
  $ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
}
if ($ffmpeg) { Write-Host "  OK : ffmpeg" -ForegroundColor Green }
else { Write-Host "  Absent : placeholders vidéo ignorés" -ForegroundColor Yellow }

Write-Host "`nEtape 3/6 · Scripts MCP..." -ForegroundColor Yellow
foreach ($rel in @('tools\install-21st-dev-magic-mcp.ps1', 'tools\install-21st-dev-magic-mcp.sh')) {
  if (Test-Path (Join-Path $repoRoot $rel)) { Write-Host "  OK : $rel" -ForegroundColor Green }
  else { Write-Host "  Manquant : $rel (pull origin ?)" -ForegroundColor Yellow }
}

Write-Host "`nEtape 4/6 · Assets..." -ForegroundColor Yellow
$michael = Join-Path $repoRoot 'assets\img\team\michael.jpg'
if (Test-Path $michael) { Write-Host "  OK : michael.jpg" -ForegroundColor Green }
else {
  Write-Host "  Absent : michael.jpg — fallback .pilote-img.img-fallback actif" -ForegroundColor Yellow
}

$teaser = Join-Path $repoRoot 'assets\video\voyage\pinapp-presentation-46s.mp4'
$srcMain = Join-Path $repoRoot 'assets\video\voyage\01-main-hologramme.mp4'
if (Test-Path $teaser) { Write-Host "  OK : pinapp-presentation-46s.mp4" -ForegroundColor Green }
elseif ($ffmpeg -and (Test-Path $srcMain)) {
  Write-Host "  Placeholder 3s depuis 01-main-hologramme.mp4..." -ForegroundColor Cyan
  & ffmpeg -y -i $srcMain -t 3 -c copy $teaser 2>$null
  if (Test-Path $teaser) { Write-Host "  OK : teaser placeholder créé" -ForegroundColor Green }
}
else { Write-Host "  Absent : teaser (et ffmpeg ou source manquant)" -ForegroundColor Yellow }

Write-Host "`nEtape 5/6 · Derniers commits..." -ForegroundColor Yellow
git log --oneline -10

Write-Host "`nEtape 6/6 · Git..." -ForegroundColor Yellow
$st = git status --porcelain
if ([string]::IsNullOrWhiteSpace($st)) {
  Write-Host "  Rien à commiter" -ForegroundColor Gray
}
else {
  git add -A
  git commit -m "chore(v40): polish prep placeholders or sync"
  git push origin $targetBranch
  Write-Host "  Push OK" -ForegroundColor Green
}

Write-Host "`nPREP TERMINÉ — nouvelle convo Cursor + Magic, puis polish.`n" -ForegroundColor Green
