<#
.SYNOPSIS
  Après génération du film : posters JPG + OG + mise à jour des data-film-* dans index.html.
.DESCRIPTION
  À lancer depuis la racine du dépôt (PowerShell), une fois
  assets/video/voyage/pinapp-film-v6.mp4 présent (concat réel).

  - Extrait 10 posters (noms alignés sur pinapp-film-v6.css / reduced-motion).
  - Génère assets/images/og-pinapp-v6.jpg (frame ~3 s).
  - Recalcule data-film-start / data-film-end pour les 10 sections à partir
    de la durée ffprobe (échelle linéaire depuis une grille de référence 67,29 s).

  Ne pas coller ce script dans un terminal multi-ligne incomplet : enregistrer
  le fichier puis :  .\tools\finish-v6.ps1
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $root 'index.html'))) {
  throw "Lancer depuis pinapp-site (index.html introuvable au-dessus de tools/)."
}
Set-Location $root

$film = Join-Path $root 'assets\video\voyage\pinapp-film-v6.mp4'
if (-not (Test-Path $film)) {
  throw "Fichier introuvable : $film — lancer d'abord build-pinapp-film-v6.ps1 ou copier le MP4 concaténé."
}

function Get-FilmDurationSeconds {
  $ff = Get-Command ffprobe -ErrorAction SilentlyContinue
  if (-not $ff) { return $null }
  $raw = & ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $film 2>$null
  if (-not $raw) { return $null }
  $t = 0.0
  if (-not [double]::TryParse($raw.Trim().Replace(',', '.'), [ref]$t)) { return $null }
  return $t
}

# Grille de référence (secondes cumulées) — total 67,29 s ; mise à l’échelle si durée réelle différente
$refTotal = 67.29
$refBounds = @(0, 4, 8, 17, 25, 34, 38, 42, 50, 59, 67)
$ids = @('s0', 's1', 's2', 's3', 's4', 's5', 's5b', 's6', 's7', 's8')
$posterNames = @(
  '00-ouverture.jpg',
  '01-prologue.jpg',
  '02-rencontre.jpg',
  '03-outils.jpg',
  '04-constellation.jpg',
  '05-preuves.jpg',
  '06-mecanisme.jpg',
  '07-manifeste.jpg',
  '08-oeuvre.jpg',
  '09-atterrissage.jpg'
)

$dur = Get-FilmDurationSeconds
if ($null -eq $dur -or $dur -le 0) {
  Write-Warning "ffprobe indisponible ou durée illisible — utilisation durée référence $refTotal s pour le mapping."
  $dur = $refTotal
}
$scale = $dur / $refTotal
Write-Host "Durée film : $([math]::Round($dur, 2)) s (échelle x $([math]::Round($scale, 4)))" -ForegroundColor Cyan

$postersDir = Join-Path $root 'assets\img\voyage\film-posters'
New-Item -ItemType Directory -Force -Path $postersDir | Out-Null

Write-Host "Génération des 10 posters..." -ForegroundColor Cyan
for ($i = 0; $i -lt 10; $i++) {
  $t0 = $refBounds[$i] * $scale
  $t1 = $refBounds[$i + 1] * $scale
  $mid = ($t0 + $t1) / 2.0
  $ss = [math]::Max(0.05, [math]::Round($mid, 2))
  $out = Join-Path $postersDir $posterNames[$i]
  & ffmpeg -y -ss $ss -i $film -frames:v 1 -q:v 3 $out
  if (Test-Path $out) {
    $kb = [math]::Round((Get-Item $out).Length / 1KB, 1)
    Write-Host "  OK $($posterNames[$i]) @ ${ss}s ($kb KB)" -ForegroundColor Green
  } else {
    Write-Host "  ECHEC $($posterNames[$i])" -ForegroundColor Red
  }
}

$ogPath = Join-Path $root 'assets\images\og-pinapp-v6.jpg'
Write-Host "Génération OG (frame ~3 s)..." -ForegroundColor Cyan
$ogSs = [math]::Min(3, [math]::Max(0.1, $dur - 0.1))
& ffmpeg -y -ss $ogSs -i $film -frames:v 1 -vf "scale=1200:630" -q:v 2 $ogPath
if (Test-Path $ogPath) {
  $kb = [math]::Round((Get-Item $ogPath).Length / 1KB, 1)
  Write-Host "  OK og-pinapp-v6.jpg ($kb KB)" -ForegroundColor Green
}

Write-Host "Mise à jour data-film-* dans index.html..." -ForegroundColor Cyan
$indexPath = Join-Path $root 'index.html'
$content = Get-Content -Raw -Encoding UTF8 $indexPath
$replaced = 0
for ($i = 0; $i -lt 10; $i++) {
  $id = $ids[$i]
  $start = [math]::Round($refBounds[$i] * $scale, 2)
  $end = [math]::Round($refBounds[$i + 1] * $scale, 2)
  if ($end -le $start) { $end = [math]::Round($start + 0.5, 2) }
  $idEsc = [regex]::Escape($id)
  $pattern = '(id="' + $idEsc + '"[\s\S]*?data-film-start=")\d+(?:\.\d+)?("[\s\S]*?data-film-end=")\d+(?:\.\d+)?(")'
  $newContent = [regex]::Replace($content, $pattern, { param($m) return $m.Groups[1].Value + $start + $m.Groups[2].Value + $end + $m.Groups[3].Value }, 1)
  if ($newContent -ne $content) {
    $content = $newContent
    $replaced++
    Write-Host "  OK $id : start=$start end=$end" -ForegroundColor Green
  } else {
    Write-Host "  MISS $id (motif non trouvé)" -ForegroundColor Yellow
  }
}

$utf8Bom = New-Object System.Text.UTF8Encoding $true
[System.IO.File]::WriteAllText($indexPath, $content, $utf8Bom)
Write-Host "Sections mises à jour : $replaced / 10" -ForegroundColor Cyan
Write-Host "TERMINE — git add puis commit quand tu es prête." -ForegroundColor Green
