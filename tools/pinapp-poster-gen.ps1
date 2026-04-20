# PINAPP V2.6 — Génère les posters JPG (frame ~0.2s) pour les pistes cinéma (#voyage-cinema).
# Prérequis : ffmpeg (winget install Gyan.FFmpeg) · MP4 dans assets/video/voyage/
# Usage : depuis la racine pinapp-site : .\tools\pinapp-poster-gen.ps1

$ErrorActionPreference = "Stop"
$videoDir = "assets/video/voyage"
$posterDir = "assets/img/voyage"

if (-not (Test-Path "index.html")) {
    Write-Host "[X] Exécute depuis la racine du dépôt (pinapp-site)." -ForegroundColor Red
    exit 1
}

$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ffmpeg) {
    Write-Host "[X] ffmpeg introuvable. winget install --id Gyan.FFmpeg" -ForegroundColor Red
    exit 1
}

$mapping = @(
    @{ mp4 = "01-main-hologramme.mp4"; poster = "01-main-poster.jpg" },
    @{ mp4 = "02-couloir-passengers.mp4"; poster = "02-couloir-poster.jpg" },
    @{ mp4 = "03-hublot-cosmos.mp4"; poster = "03-hublot-poster.jpg" },
    @{ mp4 = "04-constellation-mp.mp4"; poster = "04-constellation-poster.jpg" },
    @{ mp4 = "05-sortie-vaisseau.mp4"; poster = "05-sortie-poster.jpg" },
    @{ mp4 = "06-balade-cosmos.mp4"; poster = "06-balade-poster.jpg" },
    @{ mp4 = "07-tourbillon-etoiles.mp4"; poster = "07-tourbillon-poster.jpg" },
    @{ mp4 = "08-atterrissage-sable.mp4"; poster = "08-sable-poster.jpg" }
)

if (-not (Test-Path $posterDir)) {
    New-Item -ItemType Directory -Path $posterDir -Force | Out-Null
}

foreach ($entry in $mapping) {
    $src = Join-Path $videoDir $entry.mp4
    $dst = Join-Path $posterDir $entry.poster
    if (-not (Test-Path $src)) {
        Write-Host "[!] Skip (MP4 absent): $($entry.mp4)" -ForegroundColor Yellow
        continue
    }
    & ffmpeg -y -i $src -ss 00:00:00.2 -frames:v 1 -q:v 3 $dst 2>&1 | Out-Null
    if (Test-Path $dst) {
        Write-Host "[OK] $($entry.poster)" -ForegroundColor Green
    } else {
        Write-Host "[X] Échec: $($entry.poster)" -ForegroundColor Red
    }
}

Write-Host "Terminé. Commit les JPG dans assets/img/voyage/ si OK." -ForegroundColor Cyan
