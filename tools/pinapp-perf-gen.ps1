<#
.SYNOPSIS
  Génère posters AVIF + vidéos WebM AV1 à partir des MP4 voyage (FFmpeg requis).

.DESCRIPTION
  Sorties : assets/img/voyage/*-poster.avif et assets/video/voyage/*.webm
  Exécuter depuis la racine du dépôt sous Windows avec FFmpeg dans le PATH.
  Ne committez les binaires générés que après vérification locale (taille / qualité).
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$mapping = @(
  @{ mp4 = '01-main-hologramme.mp4'; base = '01-main' },
  @{ mp4 = '02-couloir-passengers.mp4'; base = '02-couloir' },
  @{ mp4 = '03-hublot-cosmos.mp4'; base = '03-hublot' },
  @{ mp4 = '04-constellation-mp.mp4'; base = '04-constellation' },
  @{ mp4 = '05-sortie-vaisseau.mp4'; base = '05-sortie' },
  @{ mp4 = '06-balade-cosmos.mp4'; base = '06-balade' },
  @{ mp4 = '07-tourbillon-etoiles.mp4'; base = '07-tourbillon' },
  @{ mp4 = '08-atterrissage-sable.mp4'; base = '08-sable' }
)

foreach ($entry in $mapping) {
  $src = Join-Path $root "assets/video/voyage/$($entry.mp4)"
  if (-not (Test-Path $src)) {
    Write-Warning "Source manquant : $src (skip)"
    continue
  }
  $avifDir = Join-Path $root 'assets/img/voyage'
  if (-not (Test-Path $avifDir)) { New-Item -ItemType Directory -Path $avifDir | Out-Null }
  $avif = Join-Path $avifDir "$($entry.base)-poster.avif"
  $av1 = Join-Path $root "assets/video/voyage/$($entry.base).webm"

  Write-Host "Poster AVIF : $avif"
  & ffmpeg -y -i $src -ss 00:00:00.2 -frames:v 1 -c:v libaom-av1 -crf 30 -still-picture 1 $avif 2>$null

  Write-Host "Vidéo AV1 : $av1"
  & ffmpeg -y -i $src -c:v libaom-av1 -crf 30 -b:v 0 -row-mt 1 -cpu-used 4 -pix_fmt yuv420p $av1 2>$null
}

Write-Host 'Terminé.'
