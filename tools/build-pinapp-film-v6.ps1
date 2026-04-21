<#
.SYNOPSIS
  Concatène les 8 MP4 voyage en un seul film pinapp-film-v6 (MP4 + WebM) + posters + OG.
.DESCRIPTION
  À exécuter depuis la racine du dépôt (Windows, ffmpeg + ffprobe dans le PATH).
  Entrées : assets/video/voyage/01-main-hologramme.mp4 … 08-atterrissage-sable.mp4
  Sorties : assets/video/voyage/pinapp-film-v6.mp4, .webm
            assets/img/voyage/film-posters/00-ouverture.jpg … 08-atterrissage.jpg
            assets/images/og-pinapp-v6.jpg
.NOTES
  Si libsvtav1 est absent, adapter la ligne WebM (libaom-av1 ou sauter l’étape WebM).
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $root 'index.html'))) {
  throw "Exécuter depuis la racine du dépôt (index.html introuvable au-dessus de tools/)."
}
Set-Location $root

$vdir = Join-Path $root 'assets/video/voyage'
if (-not (Test-Path $vdir)) { throw "Dossier manquant: $vdir" }

$concat = @"
file '01-main-hologramme.mp4'
file '02-couloir-passengers.mp4'
file '03-hublot-cosmos.mp4'
file '04-constellation-mp.mp4'
file '05-sortie-vaisseau.mp4'
file '06-balade-cosmos.mp4'
file '07-tourbillon-etoiles.mp4'
file '08-atterrissage-sable.mp4'
"@
$concatPath = Join-Path $vdir 'concat-list-v6.txt'
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($concatPath, $concat.TrimEnd() + "`n", $utf8NoBom)

Push-Location $vdir
try {
  $raw = 'pinapp-film-v6-raw.mp4'
  & ffmpeg -y -f concat -safe 0 -i $concatPath -c copy $raw
  if ($LASTEXITCODE -ne 0) { throw "ffmpeg concat failed" }

  & ffmpeg -y -i $raw -c:v libx264 -preset slow -crf 22 -profile:v high -level 4.2 -pix_fmt yuv420p -movflags +faststart -an -vf "scale='min(1920,iw)':'-2'" pinapp-film-v6.mp4
  if ($LASTEXITCODE -ne 0) { throw "ffmpeg h264 failed" }

  $webmOk = $true
  & ffmpeg -y -i $raw -c:v libsvtav1 -crf 30 -preset 6 -pix_fmt yuv420p10le -an -vf "scale='min(1920,iw)':'-2'" pinapp-film-v6.webm 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "WebM AV1 (libsvtav1) a échoué — générez le WebM manuellement ou avec libaom-av1."
    $webmOk = $false
  }

  $dur = (& ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 pinapp-film-v6.mp4).Trim()
  Write-Host "Durée totale film (s) : $dur"

  $posterDir = Join-Path $root 'assets/img/voyage/film-posters'
  New-Item -ItemType Directory -Force -Path $posterDir | Out-Null

  $frames = @(
    @{ ss = '0.5';  name = '00-ouverture.jpg' },
    @{ ss = '3.5';  name = '01-prologue.jpg' },
    @{ ss = '8.5';  name = '02-rencontre.jpg' },
    @{ ss = '14';   name = '03-outils.jpg' },
    @{ ss = '19';   name = '04-constellation.jpg' },
    @{ ss = '24';   name = '05-preuves.jpg' },
    @{ ss = '28';   name = '06-mecanisme.jpg' },
    @{ ss = '31.5'; name = '07-manifeste.jpg' },
    @{ ss = '36';   name = '08-oeuvre.jpg' },
    @{ ss = '40';   name = '09-atterrissage.jpg' }
  )
  foreach ($f in $frames) {
    $out = Join-Path $posterDir $f.name
    & ffmpeg -y -ss $f.ss -i pinapp-film-v6.mp4 -frames:v 1 -q:v 3 $out
  }

  $og = Join-Path $root 'assets/images/og-pinapp-v6.jpg'
  & ffmpeg -y -ss 2 -i pinapp-film-v6.mp4 -frames:v 1 -vf 'scale=1200:630' -q:v 2 $og

  Remove-Item -Force $concatPath -ErrorAction SilentlyContinue
  Remove-Item -Force $raw -ErrorAction SilentlyContinue
  Write-Host "OK — pinapp-film-v6.mp4 généré."
  if ($webmOk) { Write-Host "OK — pinapp-film-v6.webm généré." }
}
finally {
  Pop-Location
}
