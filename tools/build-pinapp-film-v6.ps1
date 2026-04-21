# build-pinapp-film-v6.ps1
# Pipeline ffmpeg pour V6.0 "Le Film" scroll-scrubbed
# Concatène les 8 vidéos voyage en 1 seul film + génère posters + OG

# Prérequis : ffmpeg + ffprobe dans le PATH
# Usage : .\tools\build-pinapp-film-v6.ps1 (depuis la racine du repo)

$ErrorActionPreference = "Stop"

# Racine repo (parent du dossier tools)
$repoRoot = Split-Path -Parent $PSScriptRoot
Write-Host "Repo root : $repoRoot" -ForegroundColor Cyan

$videoDir = Join-Path $repoRoot "assets\video\voyage"
$postersDir = Join-Path $repoRoot "assets\img\voyage\film-posters"
$ogDir = Join-Path $repoRoot "assets\images"

if (-not (Test-Path $videoDir)) {
  Write-Error "Dossier vidéos introuvable : $videoDir"
  exit 1
}

Set-Location $videoDir

# Liste de concaténation ffmpeg
@"
file '01-main-hologramme.mp4'
file '02-couloir-passengers.mp4'
file '03-hublot-cosmos.mp4'
file '04-constellation-mp.mp4'
file '05-sortie-vaisseau.mp4'
file '06-balade-cosmos.mp4'
file '07-tourbillon-etoiles.mp4'
file '08-atterrissage-sable.mp4'
"@ | Out-File -Encoding ASCII -FilePath concat-list.txt -NoNewline

Write-Host "=> Etape 1/6 : concaténation raw (copy codec)" -ForegroundColor Yellow
ffmpeg -y -f concat -safe 0 -i concat-list.txt -c copy pinapp-film-v6-raw.mp4
if ($LASTEXITCODE -ne 0) { Write-Error "Concat raw failed"; exit 1 }

Write-Host "=> Etape 2/6 : encodage H.264 web (faststart)" -ForegroundColor Yellow
ffmpeg -y -i pinapp-film-v6-raw.mp4 `
  -c:v libx264 -preset slow -crf 22 -profile:v high -level 4.2 `
  -pix_fmt yuv420p -movflags +faststart -an `
  -vf "scale='min(1920,iw)':-2" `
  pinapp-film-v6.mp4
if ($LASTEXITCODE -ne 0) { Write-Error "H.264 encoding failed"; exit 1 }

Write-Host "=> Etape 3/6 : encodage AV1 WebM (si libsvtav1 disponible)" -ForegroundColor Yellow
ffmpeg -y -i pinapp-film-v6-raw.mp4 `
  -c:v libsvtav1 -crf 30 -preset 6 -pix_fmt yuv420p10le -an `
  -vf "scale='min(1920,iw)':-2" `
  pinapp-film-v6.webm
if ($LASTEXITCODE -ne 0) {
  Write-Host "libsvtav1 indisponible, fallback VP9" -ForegroundColor DarkYellow
  ffmpeg -y -i pinapp-film-v6-raw.mp4 `
    -c:v libvpx-vp9 -crf 32 -b:v 0 -an `
    -vf "scale='min(1920,iw)':-2" `
    pinapp-film-v6.webm
}

Write-Host "=> Etape 4/6 : lecture durée totale" -ForegroundColor Yellow
$duration = (ffprobe -v error -show_entries format=duration `
  -of default=noprint_wrappers=1:nokey=1 pinapp-film-v6.mp4).Trim()
Write-Host "    Durée totale : $duration secondes" -ForegroundColor Green

Write-Host "=> Etape 5/6 : génération des 10 posters" -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $postersDir | Out-Null

# Timestamps à ajuster après premier run selon durée réelle
$scenes = @(
  @{ name = "00-ouverture"; ts = "0.5" },
  @{ name = "01-prologue"; ts = "3.5" },
  @{ name = "02-rencontre"; ts = "8.5" },
  @{ name = "03-outils"; ts = "13.5" },
  @{ name = "04-constellation"; ts = "18.5" },
  @{ name = "05-preuves"; ts = "23.5" },
  @{ name = "05b-mecanisme"; ts = "27.5" },
  @{ name = "06-manifeste"; ts = "30.5" },
  @{ name = "07-oeuvre"; ts = "34.5" },
  @{ name = "08-atterrissage"; ts = "38.5" }
)
foreach ($scene in $scenes) {
  $output = Join-Path $postersDir "$($scene.name).jpg"
  ffmpeg -y -ss $scene.ts -i pinapp-film-v6.mp4 -frames:v 1 -q:v 3 $output 2>$null
  Write-Host "    poster : $($scene.name).jpg @ $($scene.ts)s"
}

Write-Host "=> Etape 6/6 : OG image 1200x630 @ 2s" -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $ogDir | Out-Null
$ogPath = Join-Path $ogDir "og-pinapp-v6.jpg"
ffmpeg -y -ss 2 -i pinapp-film-v6.mp4 `
  -frames:v 1 -vf "scale=1200:630" -q:v 2 $ogPath

# Cleanup
Remove-Item concat-list.txt -Force
Remove-Item pinapp-film-v6-raw.mp4 -Force

Write-Host ""
Write-Host "✓ Film v6 généré !" -ForegroundColor Green
Write-Host "   pinapp-film-v6.mp4  : $(Get-Item pinapp-film-v6.mp4 | Select-Object -ExpandProperty Length) octets"
Write-Host "   pinapp-film-v6.webm : $(Get-Item pinapp-film-v6.webm | Select-Object -ExpandProperty Length) octets"
Write-Host "   10 posters          : $postersDir"
Write-Host "   OG image            : $ogPath"
Write-Host ""
Write-Host "Prochaine étape :"
Write-Host "   git add assets/video/voyage/pinapp-film-v6.{mp4,webm}"
Write-Host "   git add assets/img/voyage/film-posters/"
Write-Host "   git add assets/images/og-pinapp-v6.jpg"
Write-Host "   git commit -m "assets(v60): generated pinapp-film-v6 + 10 posters + og""
Write-Host "   git push origin cursor/v60-film-scroll-scrub"
