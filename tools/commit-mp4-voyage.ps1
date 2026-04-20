#Requires -Version 5.1
<#
.SYNOPSIS
  Trouve les 8 MP4 Higgsfield, les place dans assets/video/voyage/, commit et push sur la branche V2.4 DREAM.
.DESCRIPTION
  Ne modifie que assets/video/voyage/*.mp4 (git add explicite par fichier).
  Confirmations interactives avant copie et avant push.
  Journal : tools/logs/commit-mp4-YYYY-MM-DD.log
#>

$ErrorActionPreference = 'Continue'
$NetlifyPreviewUrl = 'https://deploy-preview-39--stellular-liger-a492db.netlify.app/'
$Mp4CheckPath = '/assets/video/voyage/01-main-hologramme.mp4'
$TargetBranch = 'cursor/v24-step5-transitions-lightbox-df83'
$VideoDir = 'assets/video/voyage'
$MaxTotalBytes = 500MB
$WarnTotalBytes = 100MB
$MaxFileBytes = 100MB
$WarnFileBytes = 50MB

$mp4Expected = @(
    '01-main-hologramme.mp4',
    '02-couloir-passengers.mp4',
    '03-hublot-cosmos.mp4',
    '04-constellation-mp.mp4',
    '05-sortie-vaisseau.mp4',
    '06-balade-cosmos.mp4',
    '07-tourbillon-etoiles.mp4',
    '08-lune-finale.mp4'
)

$logDir = Join-Path $PSScriptRoot 'logs'
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}
$logFile = Join-Path $logDir ("commit-mp4-{0:yyyy-MM-dd}.log" -f (Get-Date))

function Write-Log {
    param([string]$Message, [string]$Color = 'Gray')
    $line = ('[{0:u}] {1}' -f (Get-Date), $Message)
    Add-Content -Path $logFile -Value $line -Encoding UTF8
    Write-Host $Message -ForegroundColor $Color
}

function Read-YesNo {
    param([string]$Prompt)
    do {
        $r = Read-Host $Prompt
        if ($null -eq $r) { continue }
        $t = $r.Trim().ToUpperInvariant()
        if ($t -eq 'Y' -or $t -eq 'O') { return $true }
        if ($t -eq 'N') { return $false }
    } while ($true)
}

try {
    Write-Log "=== commit-mp4-voyage demarre ===" 'Cyan'
    Set-Location (Join-Path $PSScriptRoot '..')
    $repoRoot = (Get-Location).Path

    if (-not (Test-Path 'index.html')) {
        Write-Log "[X] index.html introuvable. Lance depuis la racine pinapp-site (le script remonte depuis tools/)." 'Red'
        exit 1
    }
    Write-Log "[OK] Racine repo : $repoRoot" 'Green'

    # .gitattributes
    $ga = Join-Path $repoRoot '.gitattributes'
    if (-not (Test-Path $ga)) {
        Write-Log "[!] .gitattributes absent — verifie manuellement que *.mp4 binary est configure." 'Yellow'
    } else {
        $gaContent = Get-Content $ga -Raw -ErrorAction SilentlyContinue
        if ($gaContent -notmatch '\*\.mp4\s+binary') {
            Write-Log "[!] .gitattributes ne contient pas '*.mp4 binary' — corrige avant gros commits video." 'Yellow'
        } else {
            Write-Log "[OK] .gitattributes contient *.mp4 binary" 'Green'
        }
    }

    Write-Log "Branche cible : $TargetBranch" 'Cyan'
    git fetch origin $TargetBranch 2>&1 | Out-Null
    git checkout $TargetBranch 2>&1 | ForEach-Object { Write-Log $_ 'Gray' }
    git pull origin $TargetBranch 2>&1 | ForEach-Object { Write-Log $_ 'Gray' }

    $cur = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
    if ($cur -ne $TargetBranch) {
        Write-Log "[!] Branche actuelle : $cur (attendu $TargetBranch). Continue a tes risques." 'Yellow'
    }

    if (-not (Test-Path $VideoDir)) {
        New-Item -ItemType Directory -Path $VideoDir -Force | Out-Null
        Write-Log "[OK] Dossier $VideoDir cree" 'Green'
    }

    $searchRoots = @(
        (Join-Path $repoRoot $VideoDir),
        (Join-Path $env:USERPROFILE 'Downloads'),
        (Join-Path $env:USERPROFILE 'Videos'),
        (Join-Path $env:USERPROFILE 'Desktop')
    ) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -Unique

    # Collecter hf_*.mp4 (dedupe par chemin), tri date croissante = ordre 01..08
    $hfDict = @{}
    foreach ($root in $searchRoots) {
        Get-ChildItem -Path $root -Filter 'hf_*.mp4' -File -ErrorAction SilentlyContinue | ForEach-Object {
            if (-not $hfDict.ContainsKey($_.FullName)) {
                $hfDict[$_.FullName] = $_
            }
        }
    }
    $hfPool = @($hfDict.Values | Sort-Object -Property LastWriteTime)

    $plan = @{}
    $copyOps = @()

    foreach ($name in $mp4Expected) {
        $dest = Join-Path $repoRoot (Join-Path $VideoDir $name)
        if (Test-Path $dest) {
            $plan[$name] = @{ Type = 'repo'; Path = $dest }
            continue
        }
        $found = $null
        foreach ($root in $searchRoots) {
            $cand = Join-Path $root $name
            if (Test-Path $cand) {
                $found = Get-Item $cand
                break
            }
        }
        if ($found) {
            $plan[$name] = @{ Type = 'copy'; Path = $found.FullName; Dest = $dest }
            $copyOps += @{ Src = $found.FullName; Dest = $dest; Name = $name }
        }
    }

    foreach ($name in $mp4Expected) {
        if ($plan.ContainsKey($name)) { continue }
        if ($hfPool.Count -gt 0) {
            $item = $hfPool[0]
            $hfPool = @($hfPool | Select-Object -Skip 1)
            $dest = Join-Path $repoRoot (Join-Path $VideoDir $name)
            $plan[$name] = @{ Type = 'copy'; Path = $item.FullName; Dest = $dest; FromHf = $true }
            $copyOps += @{ Src = $item.FullName; Dest = $dest; Name = $name }
        }
    }

    $missing = @($mp4Expected | Where-Object { -not $plan.ContainsKey($_) })
    if ($missing.Count -gt 0) {
        Write-Log "[!] MP4 introuvables (apres scan repo + Downloads/Videos/Desktop + hf_*.mp4) :" 'Yellow'
        foreach ($m in $missing) { Write-Log "    - $m" 'DarkYellow' }
        Write-Log "Le script continue avec les fichiers trouves uniquement." 'Yellow'
    }

    if ($copyOps.Count -gt 0) {
        Write-Log "`nCopies prevues ($($copyOps.Count)) :" 'Cyan'
        foreach ($op in $copyOps) {
            Write-Log ("  {0} -> {1}" -f $op.Src, $op.Dest) 'White'
        }
        if (-not (Read-YesNo "Confirmer la copie vers $VideoDir ? (Y/N)")) {
            Write-Log "Annule par l'utilisateur (copie)." 'Yellow'
            exit 0
        }
        foreach ($op in $copyOps) {
            Copy-Item -LiteralPath $op.Src -Destination $op.Dest -Force
            Write-Log ("[OK] Copie : {0}" -f $op.Name) 'Green'
        }
    }

    $stagedFiles = @()
    $totalBytes = 0L
    foreach ($name in $mp4Expected) {
        $p = Join-Path $repoRoot (Join-Path $VideoDir $name)
        if (-not (Test-Path $p)) { continue }
        $len = (Get-Item $p).Length
        $totalBytes += $len
        if ($len -gt $MaxFileBytes) {
            Write-Log ("[X] Fichier trop lourd pour GitHub (> {0} Mo) : {1} ({2:N1} Mo). Compresse (ex. HandBrake CRF 28) puis relance." -f ($MaxFileBytes / 1MB), $name, ($len / 1MB)) 'Red'
            exit 1
        }
        if ($len -gt $WarnFileBytes) {
            Write-Log ("[!] Fichier > {0} Mo : {1} ({2:N1} Mo) — compression suggeree (HandBrake CRF ~28)." -f ($WarnFileBytes / 1MB), $name, ($len / 1MB)) 'Yellow'
        }
        $stagedFiles += $p
    }

    if ($stagedFiles.Count -eq 0) {
        Write-Log "[X] Aucun MP4 a committer dans $VideoDir." 'Red'
        exit 1
    }

    if ($totalBytes -gt $MaxTotalBytes) {
        Write-Log ("[X] Poids total > {0} Mo ({1:N1} Mo). Stop." -f ($MaxTotalBytes / 1MB), ($totalBytes / 1MB)) 'Red'
        exit 1
    }
    if ($totalBytes -gt $WarnTotalBytes) {
        Write-Log ("[!] Poids total > {0} Mo ({1:N1} Mo)." -f ($WarnTotalBytes / 1MB), ($totalBytes / 1MB)) 'Yellow'
    }

    foreach ($p in $stagedFiles) {
        $rel = ($p.Substring($repoRoot.Length).TrimStart('\', '/')) -replace '\\', '/'
        git add -- $rel
        if ($LASTEXITCODE -ne 0) {
            Write-Log "[X] git add a echoue pour : $rel" 'Red'
            exit 1
        }
    }

    git diff --cached --quiet
    if ($LASTEXITCODE -eq 0) {
        Write-Log "[OK] Aucun changement a committer (fichiers deja identiques a HEAD)." 'Green'
        exit 0
    }

    if (-not (Read-YesNo "Confirmer git commit + push vers origin/$TargetBranch ? (Y/N)")) {
        Write-Log "Annule par l'utilisateur (push). Index non vide : git reset pour degager le staging si besoin." 'Yellow'
        exit 0
    }

    $commitMsg = 'chore(v24): add 8 Higgsfield MP4 to assets/video/voyage/'
    git commit -m $commitMsg
    $commitExit = $LASTEXITCODE
    git log -1 --oneline 2>$null | ForEach-Object { Write-Log $_ 'Gray' }
    if ($commitExit -ne 0) {
        Write-Log "[!] git commit a echoue (code $commitExit). Message Git ci-dessus." 'Yellow'
        exit 1
    }

    git push -u origin $TargetBranch
    if ($LASTEXITCODE -ne 0) {
        Write-Log "[X] git push a echoue. Verifie reseau / credentials / taille des fichiers." 'Red'
        exit 1
    }
    Write-Log "[OK] Push effectue vers origin/$TargetBranch" 'Green'

    $checkUrl = $NetlifyPreviewUrl.TrimEnd('/') + $Mp4CheckPath
    Write-Log "`nPreview Netlify : $NetlifyPreviewUrl" 'Cyan'
    Write-Log "Verification HEAD : $checkUrl" 'Cyan'

    function Test-Mp4Deployed {
        param([string]$Url)
        try {
            $r = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -TimeoutSec 15 -ErrorAction Stop
            return ($r.StatusCode -eq 200)
        } catch {
            try {
                $r2 = Invoke-WebRequest -Uri $Url -Method Get -Headers @{ Range = 'bytes=0-0' } -UseBasicParsing -TimeoutSec 15 -ErrorAction Stop
                return ($r2.StatusCode -eq 206 -or $r2.StatusCode -eq 200)
            } catch {
                return $false
            }
        }
    }

    $deadline = (Get-Date).AddMinutes(3)
    $ok = $false
    while ((Get-Date) -lt $deadline) {
        if (Test-Mp4Deployed -Url $checkUrl) {
            $ok = $true
            break
        }
        Write-Log '  Attente Netlify (nouveau build)...' 'DarkGray'
        Start-Sleep -Seconds 15
    }

    if ($ok) {
        Write-Log "`n=== DEPLOIEMENT TERMINE, LE SITE EST A JOUR ===" 'Green'
        Start-Process $NetlifyPreviewUrl
    } else {
        Write-Log "[!] Le MP4 01 ne repond pas encore en 200 apres 3 min. Ouvre manuellement :" 'Yellow'
        Write-Log $NetlifyPreviewUrl 'Cyan'
        Start-Process $NetlifyPreviewUrl
    }
}
catch {
    Write-Log ("[X] Erreur : {0}" -f $_.Exception.Message) 'Red'
    Write-Log $_.ScriptStackTrace 'DarkGray'
    exit 1
}
