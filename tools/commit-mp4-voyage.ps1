#Requires -Version 5.1
<#
.SYNOPSIS
  PowerShell Windows natif — pousse les MP4 voyage (00 + 01–08) vers assets/video/voyage/ puis commit + push (branche V2.4 DREAM).
.DESCRIPTION
  Pas de bash / WSL. git add uniquement assets/video/voyage/*.mp4 (jamais git add -A).
  Journal : tools/logs/commit-mp4-yyyy-MM-dd-HHmmss.log
#>
$ErrorActionPreference = 'Stop'

$NetlifyPreviewUrl = 'https://deploy-preview-39--stellular-liger-a492db.netlify.app/'
$Mp4CheckPath = '/assets/video/voyage/01-main-hologramme.mp4'
$TargetBranch = 'cursor/v24-step5-transitions-lightbox-df83'
$VideoDir = 'assets/video/voyage'
$MaxTotalBytes = 500MB
$WarnTotalBytes = 100MB
$MaxFileBytes = 100MB
$WarnFileBytes = 50MB

$mp4Expected = @(
    '00-seedance-intro.mp4',
    '01-main-hologramme.mp4',
    '02-couloir-passengers.mp4',
    '03-hublot-cosmos.mp4',
    '04-constellation-mp.mp4',
    '05-sortie-vaisseau.mp4',
    '06-balade-cosmos.mp4',
    '07-tourbillon-etoiles.mp4',
    '08-lune-finale.mp4',
    '09-atterrissage-sable.mp4'
)

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

function Get-MediaDurationLabel {
    param([string]$FilePath)
    try {
        $shell = New-Object -ComObject Shell.Application
        $folderPath = Split-Path -Parent $FilePath
        $fileName = Split-Path -Leaf $FilePath
        $folder = $shell.Namespace($folderPath)
        if (-not $folder) { return 'n/d' }
        $item = $folder.ParseName($fileName)
        if (-not $item) { return 'n/d' }
        # Index 27 = souvent « Durée » (selon langue Windows)
        $dur = $folder.GetDetailsOf($item, 27)
        if ([string]::IsNullOrWhiteSpace($dur)) { return 'n/d' }
        return $dur.Trim()
    } catch {
        return 'n/d'
    }
}

function Invoke-GitLines {
    param([string[]]$GitArgs)
    $oldEap = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        & git @GitArgs 2>&1 | ForEach-Object { Write-Host $_ }
        return $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $oldEap
    }
}

$logFile = $null
try {
    Set-Location (Join-Path $PSScriptRoot '..')
    $repoRoot = (Get-Location).Path

    $logDir = Join-Path $PSScriptRoot 'logs'
    if (-not (Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    }
    $logStamp = Get-Date -Format 'yyyy-MM-dd-HHmmss'
    $logFile = Join-Path $logDir ("commit-mp4-{0}.log" -f $logStamp)
    $utf8Bom = New-Object System.Text.UTF8Encoding $true

    function Write-Log {
        param([string]$Message, [string]$Color = 'Gray')
        $line = ('[{0:u}] {1}' -f (Get-Date), $Message)
        [System.IO.File]::AppendAllText($logFile, $line + [Environment]::NewLine, $utf8Bom)
        Write-Host $Message -ForegroundColor $Color
    }

    Write-Log '=== commit-mp4-voyage (PowerShell Windows) ===' 'Cyan'

    # --- ÉTAPE 1 ---
    Write-Host "`n-- Etape 1 : Verifications initiales --" -ForegroundColor Cyan
    if (-not (Test-Path (Join-Path $repoRoot 'index.html'))) {
        Write-Log "[X] index.html introuvable. Ouvre Cursor a la racine pinapp-site puis relance .\tools\commit-mp4-voyage.ps1" 'Red'
        exit 1
    }
    Write-Log "[OK] Racine repo : $repoRoot" 'Green'

    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Log "[X] Git introuvable (Get-Command git). Installe Git for Windows." 'Red'
        exit 1
    }
    Write-Log '[OK] Git detecte' 'Green'

    $curBranch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
    if ($curBranch -ne $TargetBranch) {
        Write-Host "[!] Branche actuelle : $curBranch (attendu : $TargetBranch)" -ForegroundColor Yellow
        if (Read-YesNo "Faire checkout $TargetBranch + fetch + pull ? (Y/N)") {
            $null = Invoke-GitLines @('fetch', 'origin', $TargetBranch)
            $co = Invoke-GitLines @('checkout', $TargetBranch)
            if ($co -ne 0) {
                Write-Log "[X] git checkout a echoue (code $co)." 'Red'
                exit 1
            }
            $null = Invoke-GitLines @('pull', 'origin', $TargetBranch)
            $curBranch = (git rev-parse --abbrev-ref HEAD).Trim()
            Write-Log "[OK] Branche : $curBranch" 'Green'
        } else {
            Write-Log '[!] Tu restes sur la branche actuelle — risque de mauvais push.' 'Yellow'
        }
    } else {
        Write-Log "[OK] Branche : $curBranch" 'Green'
        $null = Invoke-GitLines @('fetch', 'origin', $TargetBranch)
        $null = Invoke-GitLines @('pull', 'origin', $TargetBranch)
    }

    # --- .gitattributes ---
    $gaPath = Join-Path $repoRoot '.gitattributes'
    if (Test-Path $gaPath) {
        $gaRaw = Get-Content -LiteralPath $gaPath -Raw -Encoding UTF8
        $hasBinary = $gaRaw -match '\*\.mp4\s+binary'
        $hasNoText = $gaRaw -match '\*\.mp4\s+-text'
        if (-not $hasBinary -or -not $hasNoText) {
            Write-Log "[!] .gitattributes : verifie manuellement '*.mp4 binary' et '*.mp4 -text'." 'Yellow'
        } else {
            Write-Log '[OK] .gitattributes contient *.mp4 binary et *.mp4 -text' 'Green'
        }
    } else {
        Write-Log '[!] .gitattributes absent — warning.' 'Yellow'
    }

    if (-not (Test-Path (Join-Path $repoRoot $VideoDir))) {
        New-Item -ItemType Directory -Path (Join-Path $repoRoot $VideoDir) -Force | Out-Null
        Write-Log "[OK] Dossier $VideoDir cree" 'Green'
    }

    # --- ÉTAPE 2 : scan ---
    Write-Host "`n-- Etape 2 : Scan des MP4 --" -ForegroundColor Cyan
    $searchRoots = New-Object System.Collections.Generic.List[string]
    $repoVoyage = Join-Path $repoRoot $VideoDir
    foreach ($p in @(
            $repoVoyage,
            (Join-Path $env:USERPROFILE 'Downloads'),
            (Join-Path $env:USERPROFILE 'Videos'),
            (Join-Path $env:USERPROFILE 'OneDrive\Downloads'),
            (Join-Path $env:USERPROFILE 'OneDrive\Bureau'),
            (Join-Path $env:USERPROFILE 'Desktop')
        )) {
        if ($p -and (Test-Path -LiteralPath $p)) {
            if (-not $searchRoots.Contains($p)) { $searchRoots.Add($p) }
        }
    }

    $hfDict = @{}
    foreach ($root in $searchRoots) {
        Get-ChildItem -LiteralPath $root -Filter 'hf_*.mp4' -File -ErrorAction SilentlyContinue | ForEach-Object {
            if (-not $hfDict.ContainsKey($_.FullName)) { $hfDict[$_.FullName] = $_ }
        }
    }
    $hfPool = [System.Collections.ArrayList]@($hfDict.Values | Sort-Object -Property LastWriteTime)

    $copyOps = [System.Collections.ArrayList]@()
    $namesSatisfied = @{}

    foreach ($name in $mp4Expected) {
        $dest = Join-Path $repoRoot (Join-Path $VideoDir $name)
        if (Test-Path -LiteralPath $dest) {
            $namesSatisfied[$name] = $true
            continue
        }
        $found = $null
        foreach ($root in $searchRoots) {
            $cand = Join-Path $root $name
            if (Test-Path -LiteralPath $cand) {
                $found = Get-Item -LiteralPath $cand
                break
            }
        }
        if ($found) {
            [void]$copyOps.Add(@{ Src = $found.FullName; Dest = $dest; Name = $name; FromHf = $false })
            $namesSatisfied[$name] = $true
        }
    }

    foreach ($name in $mp4Expected) {
        if ($namesSatisfied.ContainsKey($name)) { continue }
        if ($hfPool.Count -gt 0) {
            $item = $hfPool[0]
            $hfPool.RemoveAt(0)
            $dest = Join-Path $repoRoot (Join-Path $VideoDir $name)
            [void]$copyOps.Add(@{ Src = $item.FullName; Dest = $dest; Name = $name; FromHf = $true })
            $namesSatisfied[$name] = $true
        }
    }

    $hfMappings = @($copyOps | Where-Object { $_.FromHf })
    if ($hfMappings.Count -gt 0) {
        Write-Host "`nMapping automatique hf_*.mp4 (ordre = date modification croissante) :" -ForegroundColor Cyan
        foreach ($op in $hfMappings) {
            $sz = (Get-Item -LiteralPath $op.Src).Length
            $dur = Get-MediaDurationLabel -FilePath $op.Src
            $line = ('  {0} -> {1} ({2:N1} Mo, duree: {3})' -f (Split-Path -Leaf $op.Src), $op.Name, ($sz / 1MB), $dur)
            Write-Host $line
            Write-Log $line 'White'
        }
        if (-not (Read-YesNo "Accepter ce mapping hf_ -> 00..09 ? (Y/N)")) {
            Write-Log 'Annule : mapping hf refuse.' 'Yellow'
            exit 0
        }
    }

    $missing = @($mp4Expected | Where-Object {
            $d = Join-Path $repoRoot (Join-Path $VideoDir $_)
            -not (Test-Path -LiteralPath $d)
        })
    if ($missing.Count -gt 0) {
        Write-Log '[!] MP4 manquants apres scan :' 'Yellow'
        foreach ($m in $missing) { Write-Log "    - $m" 'DarkYellow' }
    }

    if ($copyOps.Count -gt 0) {
        Write-Host "`nCopies prevues ($($copyOps.Count)) :" -ForegroundColor Cyan
        foreach ($op in $copyOps) {
            Write-Host ("  {0} -> {1}" -f $op.Src, $op.Dest)
        }
        if (-not (Read-YesNo "Confirmer la copie vers $VideoDir ? (Y/N)")) {
            Write-Log 'Annule : copie refusee.' 'Yellow'
            exit 0
        }
        foreach ($op in $copyOps) {
            Copy-Item -LiteralPath $op.Src -Destination $op.Dest -Force
            Write-Log ("[OK] Copie : {0}" -f $op.Name) 'Green'
        }
    }

    $totalBytes = [long]0
    $presentCount = 0
    foreach ($name in $mp4Expected) {
        $p = Join-Path $repoRoot (Join-Path $VideoDir $name)
        if (-not (Test-Path -LiteralPath $p)) { continue }
        $presentCount++
        $len = (Get-Item -LiteralPath $p).Length
        $totalBytes += $len
        if ($len -gt $MaxFileBytes) {
            Write-Log ("[X] Fichier > {0} Mo (limite GitHub) : {1}" -f ($MaxFileBytes / 1MB), $name) 'Red'
            exit 1
        }
        if ($len -gt $WarnFileBytes) {
            Write-Log ("[!] Fichier > {0} Mo : {1} — HandBrake CRF ~28 suggere." -f ($WarnFileBytes / 1MB), $name) 'Yellow'
        }
    }

    if ($presentCount -eq 0) {
        Write-Log "[X] Aucun des MP4 attendus (00 + 01-08) presents dans $VideoDir." 'Red'
        exit 1
    }

    if ($totalBytes -gt $MaxTotalBytes) {
        Write-Log ("[X] Poids total > {0} Mo. Stop." -f ($MaxTotalBytes / 1MB)) 'Red'
        exit 1
    }

    Write-Host ("`nPoids cumule (fichiers presents) : {0:N1} Mo" -f ($totalBytes / 1MB)) -ForegroundColor White
    Write-Log ("Poids cumule : {0:N1} Mo" -f ($totalBytes / 1MB)) 'White'

    if ($totalBytes -gt $WarnTotalBytes) {
        Write-Host "[!] Total > 100 Mo — push GitHub peut etre lent." -ForegroundColor Yellow
        if (-not (Read-YesNo "Continuer malgre le poids ? (Y/N)")) {
            Write-Log 'Annule : poids total refuse.' 'Yellow'
            exit 0
        }
    }

    # --- ÉTAPE 5 : git ---
    Write-Host "`n-- Etape 5 : Git status (zone $VideoDir) --" -ForegroundColor Cyan
    $null = Invoke-GitLines @('status', '--', $VideoDir)

    $videoGlob = $VideoDir + '/*.mp4'
    $exitAddGlob = Invoke-GitLines @('add', '--', $videoGlob)
    if ($exitAddGlob -ne 0) {
        Write-Log "[X] git add a echoue (code $exitAddGlob) pour : $videoGlob" 'Red'
        exit 1
    }

    $ErrorActionPreference = 'Continue'
    & git diff --cached --quiet 2>$null
    $exitDiff = $LASTEXITCODE
    $ErrorActionPreference = 'Stop'
    if ($exitDiff -eq 0) {
        Write-Log '[OK] Rien a committer (deja a jour avec HEAD).' 'Green'
        exit 0
    }

    if (-not (Read-YesNo "Confirmer commit + push vers origin/$TargetBranch ? (Y/N)")) {
        Write-Log 'Annule : push refuse. De-staging : git reset HEAD -- sur dossier voyage' 'Yellow'
        $null = Invoke-GitLines @('reset', 'HEAD', '--', $VideoDir)
        exit 0
    }

    $commitMsg = 'chore(v24): add voyage MP4 (00 + 01-08) to assets/video/voyage/'
    $exitCommit = Invoke-GitLines @('commit', '-m', $commitMsg)
    if ($exitCommit -ne 0) {
        Write-Log "[!] git commit a echoue (code $exitCommit). Verifie le message Git ci-dessus." 'Yellow'
        exit 1
    }
    $sha = (git rev-parse HEAD 2>$null).Trim()
    Write-Log ("Commit SHA : {0}" -f $sha) 'Green'
    [System.IO.File]::AppendAllText($logFile, "commit_sha=$sha$([Environment]::NewLine)", $utf8Bom)

    $exitPush = Invoke-GitLines @('push', '-u', 'origin', $TargetBranch)
    if ($exitPush -ne 0) {
        Write-Log "[X] git push a echoue (code $exitPush). Reseau / auth / taille depot." 'Red'
        exit 1
    }
    Write-Log '[OK] Push effectue' 'Green'

    # --- ÉTAPE 6 : Netlify (5 min max) ---
    Write-Host "`nAttente du redeploiement Netlify (max 5 min)..." -ForegroundColor Cyan
    $checkUrl = $NetlifyPreviewUrl.TrimEnd('/') + $Mp4CheckPath
    $deadline = (Get-Date).AddMinutes(5)
    $ok = $false
    while ((Get-Date) -lt $deadline) {
        try {
            $resp = Invoke-WebRequest -Uri $checkUrl -Method Head -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
            if ($resp.StatusCode -eq 200) {
                $ok = $true
                break
            }
        } catch {
            # ignore
        }
        Write-Host '.' -NoNewline
        Start-Sleep -Seconds 15
    }
    Write-Host ''

    if ($ok) {
        Write-Host 'Deploiement OK - preview live' -ForegroundColor Green
        Write-Log 'Deploiement OK - preview live' 'Green'
    } else {
        Write-Host 'Netlify met plus de 5 min a redeployer - verifie le build sur https://app.netlify.com/' -ForegroundColor Yellow
        Write-Log 'Timeout 5 min sans HEAD 200 sur MP4 01' 'Yellow'
        if (Read-YesNo "Ouvrir quand meme la preview (cache possible) ? (Y/N)") {
            Start-Process $NetlifyPreviewUrl
        }
        [System.IO.File]::AppendAllText($logFile, "preview_url=$NetlifyPreviewUrl$([Environment]::NewLine)", $utf8Bom)
        Write-Host ("Log ecrit : {0}" -f $logFile) -ForegroundColor Cyan
        exit 0
    }

    Start-Process $NetlifyPreviewUrl
    [System.IO.File]::AppendAllText($logFile, "preview_url=$NetlifyPreviewUrl$([Environment]::NewLine)", $utf8Bom)
    Write-Host ("`nLog ecrit : {0}" -f $logFile) -ForegroundColor Cyan
}
catch {
    Write-Host ("[X] Erreur : {0}" -f $_.Exception.Message) -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor DarkGray
    if ($null -ne $logFile -and (Test-Path -LiteralPath (Split-Path -Parent $logFile))) {
        try {
            [System.IO.File]::AppendAllText($logFile, "[EXCEPTION] $($_.Exception)$([Environment]::NewLine)", (New-Object System.Text.UTF8Encoding $true))
        } catch { }
    }
    exit 1
}
