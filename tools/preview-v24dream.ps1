# ═══════════════════════════════════════════════════════════════
# PINAPP V2.4 DREAM · Preview local automatique
# Usage : depuis la racine pinapp-site dans un terminal PowerShell
#         .\tools\preview-v24dream.ps1
# ═══════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

# 0. Vérifier qu'on est dans pinapp-site
if (-not (Test-Path "index.html")) {
    Write-Host "[X] index.html introuvable. Lance depuis la racine pinapp-site." -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Dossier pinapp-site" -ForegroundColor Green

# 1. Basculer sur la branche V2.4 DREAM
Write-Host "`n-- Branche : cursor/v24-step5-transitions-lightbox-df83 --" -ForegroundColor Cyan

git fetch origin cursor/v24-step5-transitions-lightbox-df83 2>&1 | Out-Null
git checkout cursor/v24-step5-transitions-lightbox-df83 2>&1 | Out-Null
git pull origin cursor/v24-step5-transitions-lightbox-df83 2>&1 | Out-Null

$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -eq "cursor/v24-step5-transitions-lightbox-df83") {
    Write-Host "[OK] Branche active : $currentBranch" -ForegroundColor Green
} else {
    Write-Host "[!] Branche actuelle : $currentBranch" -ForegroundColor Yellow
}

# 2. Diagnostic MP4
Write-Host "`n-- Diagnostic MP4 Higgsfield --" -ForegroundColor Cyan

$mp4Expected = @(
    "01-main-hologramme.mp4",
    "02-couloir-passengers.mp4",
    "03-hublot-cosmos.mp4",
    "04-constellation-mp.mp4",
    "05-sortie-vaisseau.mp4",
    "06-balade-cosmos.mp4",
    "07-tourbillon-etoiles.mp4",
    "08-atterrissage-sable.mp4"
)

$videoDir = "assets/video/voyage"
if (-not (Test-Path $videoDir)) {
    New-Item -ItemType Directory -Path $videoDir -Force | Out-Null
    Write-Host "[OK] Dossier $videoDir cree" -ForegroundColor Green
}

$found = 0
$missing = @()
foreach ($f in $mp4Expected) {
    if (Test-Path "$videoDir/$f") { $found++ }
    else { $missing += $f }
}

$mp4Need = $mp4Expected.Count
$mp4Color = if ($found -eq $mp4Need) { "Green" } else { "Yellow" }
Write-Host ("MP4 presents : {0} / {1}" -f $found, $mp4Need) -ForegroundColor $mp4Color

if ($missing.Count -gt 0) {
    Write-Host "Manquants :" -ForegroundColor Yellow
    foreach ($m in $missing) { Write-Host "   - $m" -ForegroundColor DarkYellow }
    Write-Host "Le site s'ouvrira sans ces fonds video." -ForegroundColor Cyan
}

# 3. Libérer le port 8899 (attention : tue tout service local sur 8899)
Write-Host "`n-- Liberation port 8899 si occupe --" -ForegroundColor Cyan

$existing = Get-NetTCPConnection -LocalPort 8899 -ErrorAction SilentlyContinue
if ($existing) {
    $pidsToKill = $existing.OwningProcess | Sort-Object -Unique
    foreach ($pidToKill in $pidsToKill) {
        Write-Host "[!] Processus PID=$pidToKill tue sur port 8899" -ForegroundColor Yellow
        Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 1
}

# 4. Détection Python
$pythonCmd = $null
if (Get-Command py -ErrorAction SilentlyContinue) { $pythonCmd = "py" }
elseif (Get-Command python -ErrorAction SilentlyContinue) { $pythonCmd = "python" }
elseif (Get-Command python3 -ErrorAction SilentlyContinue) { $pythonCmd = "python3" }

if (-not $pythonCmd) {
    Write-Host "[X] Python introuvable." -ForegroundColor Red
    Write-Host "    Installe via : winget install Python.Python.3.12" -ForegroundColor Yellow
    Write-Host "    Ou utilise l'extension Live Server dans Cursor." -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] Python : $pythonCmd" -ForegroundColor Green

# 5. Serveur HTTP local bindé sur 127.0.0.1 uniquement
Write-Host "`n-- Lancement serveur http://127.0.0.1:8899 --" -ForegroundColor Cyan

$serverJob = Start-Job -ScriptBlock {
    param($cmd, $dir)
    Set-Location $dir
    & $cmd -m http.server 8899 --bind 127.0.0.1
} -ArgumentList $pythonCmd, (Get-Location).Path

Start-Sleep -Seconds 2

# 6. Vérifier que le serveur répond
$serverOk = $false
for ($i = 0; $i -lt 5; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://127.0.0.1:8899/" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        if ($r.StatusCode -eq 200) { $serverOk = $true ; break }
    } catch { Start-Sleep -Seconds 1 }
}

if (-not $serverOk) {
    Write-Host "[X] Serveur inactif. Logs : Receive-Job $($serverJob.Id)" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Serveur actif" -ForegroundColor Green

# 7. Ouvrir navigateur par défaut
Write-Host "`n-- Ouverture navigateur par defaut --" -ForegroundColor Cyan
Start-Process "http://127.0.0.1:8899/?preview=v24dream"

# 8. Résumé + checks
Write-Host "`n=================================================" -ForegroundColor Green
Write-Host "  PREVIEW LIVE : http://127.0.0.1:8899/" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""
Write-Host "CHECKS A FAIRE :" -ForegroundColor White
Write-Host "  1. Scroll chapitres 1 -> 8"
Write-Host "  2. Click 'Bande-annonce' au chapitre 1"
Write-Host "  3. Click carte Realisation au chapitre 7"
Write-Host "  4. Escape pour fermer les modals"
Write-Host ""
Write-Host "STOPPER LE SERVEUR :" -ForegroundColor Yellow
Write-Host "  Stop-Job $($serverJob.Id) ; Remove-Job $($serverJob.Id)"
Write-Host ""
