# ====================================================================
#  PINAPP STUDIO - GO.PS1
#  Script tout-en-un : trouve le ZIP, deploie pinapp.fr, verifie, ouvre le site.
#
#  Premier run : demande host / user / port / chemin distant / mot de passe
#                une fois ; stocke config claire + secret DPAPI (Import/Export-Clixml).
#
#  Runs suivants : zero question (sauf si -Reconfigure ou fichiers manquants).
#
#  Usage :
#    powershell -NoProfile -ExecutionPolicy Bypass -File .\go.ps1
#    .\go.ps1 -Reconfigure
#    .\go.ps1 -ZipPath "C:\chemin\bundle.zip"
# ====================================================================

#Requires -Version 5.1
[CmdletBinding()]
param(
    [switch] $Reconfigure,
    [string] $ZipPath
)

$ErrorActionPreference = 'Stop'
$startTime = Get-Date

function Step { param($M) Write-Host "`n[->] $M" -ForegroundColor Cyan }
function OK { param($M) Write-Host "[OK] $M" -ForegroundColor Green }
function Warn2 { param($M) Write-Host "[!]  $M" -ForegroundColor Yellow }
function Err { param($M) Write-Host "[X]  $M" -ForegroundColor Red }
function Info { param($M) Write-Host "     $M" -ForegroundColor DarkGray }

function Resolve-WinScpNetDll {
    $candidates = @(
        (Join-Path ${env:ProgramFiles(x86)} 'WinSCP\WinSCPnet.dll'),
        (Join-Path $env:ProgramFiles 'WinSCP\WinSCPnet.dll'),
        (Join-Path $env:LOCALAPPDATA 'Programs\WinSCP\WinSCPnet.dll')
    )
    foreach ($p in $candidates) {
        if (Test-Path -LiteralPath $p) { return $p }
    }
    return $null
}

function Set-WinScpTrustHostKey {
    param($SessionOptions)
    if ($SessionOptions.PSObject.Properties['SshHostKeyPolicy']) {
        $SessionOptions.SshHostKeyPolicy = [WinSCP.SshHostKeyPolicy]::GiveUpSecurityAndAcceptAny
    }
    elseif ($SessionOptions.PSObject.Properties['GiveUpSecurityAndAcceptAnySshHostKey']) {
        $SessionOptions.GiveUpSecurityAndAcceptAnySshHostKey = $true
    }
}

function Normalize-RemotePath {
    param([string] $Path)
    $p = $Path.Trim().TrimEnd('/')
    if (-not $p.StartsWith('/')) { $p = '/' + $p }
    return $p
}

Clear-Host
Write-Host '====================================================================' -ForegroundColor Yellow
Write-Host '   PINAPP - Deploiement automatique pinapp.fr                      ' -ForegroundColor Yellow
Write-Host '====================================================================' -ForegroundColor Yellow

# --- ETAPE 1 - CREDENTIALS ---
Step '1/8 - Credentials Hostinger'

$envFile = Join-Path $HOME '.pinapp-deploy-env.ps1'
$credFile = Join-Path $HOME '.pinapp-creds.xml'

$needSetup = $Reconfigure -or -not (Test-Path -LiteralPath $envFile) -or -not (Test-Path -LiteralPath $credFile)

if ($needSetup) {
    Write-Host ''
    Write-Host '  Premier setup ou reconfiguration.' -ForegroundColor White
    Write-Host '  Infos sur : hpanel.hostinger.com -> Hebergements -> Avance -> Comptes FTP' -ForegroundColor White
    Write-Host ''

    $sftpHost = Read-Host '  Hote SFTP (ex: ftp.pinapp.fr ou IP)'
    if ([string]::IsNullOrWhiteSpace($sftpHost)) { Err 'Hote vide. Annule.'; exit 1 }

    $sftpUser = Read-Host '  Utilisateur SFTP (ex: u123456789)'
    if ([string]::IsNullOrWhiteSpace($sftpUser)) { Err 'User vide. Annule.'; exit 1 }

    $portStr = Read-Host '  Port SFTP [22]'
    $sftpPort = if ([string]::IsNullOrWhiteSpace($portStr)) { 22 } else { [int]$portStr }

    $rpathStr = Read-Host '  Dossier distant [/public_html]'
    $rpath = if ([string]::IsNullOrWhiteSpace($rpathStr)) { '/public_html' } else { $rpathStr.Trim() }

    $secPwd = Read-Host '  Mot de passe SFTP (saisie masquee)' -AsSecureString
    if ($null -eq $secPwd -or $secPwd.Length -eq 0) { Err 'Mot de passe vide. Annule.'; exit 1 }

    $envContent = @"
# Pinapp deploy - genere automatiquement par go.ps1
`$PinappDeployHost       = '$($sftpHost.Replace("'","''"))'
`$PinappDeployUser       = '$($sftpUser.Replace("'","''"))'
`$PinappDeployPort       = $sftpPort
`$PinappDeployRemotePath = '$($rpath.Replace("'","''"))'
"@
    Set-Content -LiteralPath $envFile -Value $envContent -Encoding UTF8

    $cred = New-Object System.Management.Automation.PSCredential ($sftpUser, $secPwd)
    $cred | Export-Clixml -LiteralPath $credFile

    OK 'Credentials stockes (DPAPI + fichier env).'
    Info ('Profil : ' + $envFile)
    Info ('Secret : ' + $credFile)
}

. $envFile
$cred = Import-Clixml -LiteralPath $credFile
$pwdPlain = $cred.GetNetworkCredential().Password

$PinappDeployRemotePath = Normalize-RemotePath -Path $PinappDeployRemotePath

OK ('Host : ' + $PinappDeployHost)
OK ('User : ' + $PinappDeployUser)
OK ('Port : ' + $PinappDeployPort + '  -  Path : ' + $PinappDeployRemotePath)

# --- ETAPE 2 - ZIP ---
Step '2/8 - Recherche du bundle pinapp'

$resolvedZip = $null
if ($ZipPath -and (Test-Path -LiteralPath $ZipPath)) {
    $resolvedZip = (Resolve-Path -LiteralPath $ZipPath).Path
    OK ('ZIP fourni : ' + $resolvedZip)
}
else {
    $searchPaths = @(
        (Join-Path $HOME 'Downloads'),
        (Join-Path $HOME 'Desktop'),
        (Join-Path $HOME 'Bureau'),
        (Join-Path $HOME 'Documents'),
        (Get-Location).Path
    )

    $found = $null
    foreach ($p in $searchPaths) {
        if (-not (Test-Path -LiteralPath $p)) { continue }
        $candidate = Get-ChildItem -LiteralPath $p -Filter 'pinapp*.zip' -File -ErrorAction SilentlyContinue |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 1
        if ($candidate) {
            if (-not $found -or $candidate.LastWriteTime -gt $found.LastWriteTime) {
                $found = $candidate
            }
        }
    }

    if (-not $found) {
        Err "Aucun ZIP 'pinapp*.zip' trouve."
        Info 'Cherche dans : Downloads, Bureau, Documents, dossier courant.'
        Info 'Utilise -ZipPath ou place le ZIP puis relance.'
        exit 1
    }

    $resolvedZip = $found.FullName
    $sizeMo = [math]::Round($found.Length / 1MB, 1)
    OK ('Trouve : ' + $resolvedZip + " ($sizeMo Mo, $($found.LastWriteTime))")
}

# --- ETAPE 3 - EXTRACTION ---
Step '3/8 - Decompression du bundle'

$extractDir = Join-Path $env:TEMP ('pinapp-deploy-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -LiteralPath $extractDir -ItemType Directory -Force | Out-Null

try {
    Expand-Archive -LiteralPath $resolvedZip -DestinationPath $extractDir -Force

    $workDir = $extractDir
    if (-not (Test-Path -LiteralPath (Join-Path $workDir 'index.html'))) {
        $sub = Get-ChildItem -LiteralPath $workDir -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($sub -and (Test-Path -LiteralPath (Join-Path $sub.FullName 'index.html'))) {
            $workDir = $sub.FullName
        }
        else {
            Err 'Bundle invalide : aucun index.html trouve.'
            exit 1
        }
    }

    $fileCount = (Get-ChildItem -LiteralPath $workDir -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count
    OK ('Bundle decompresse : ' + $fileCount + ' fichiers')
    Info ('Source : ' + $workDir)

    # --- ETAPE 4 - WINSCP ---
    Step '4/8 - WinSCP (verification ou installation)'

    $winscpDll = Resolve-WinScpNetDll
    if (-not $winscpDll) {
        Warn2 'WinSCP non installe. Installation via winget...'
        $winget = Get-Command winget -ErrorAction SilentlyContinue
        if (-not $winget) {
            Err 'winget introuvable. Installe WinSCP : https://winscp.net/'
            exit 1
        }
        & winget install -e --id WinSCP.WinSCP --accept-source-agreements --accept-package-agreements
        if ($LASTEXITCODE -ne 0) {
            Err ('winget a retourne le code ' + $LASTEXITCODE)
            exit 1
        }
        Start-Sleep -Seconds 3
        $winscpDll = Resolve-WinScpNetDll
        if (-not $winscpDll) {
            Err 'WinSCP installe mais WinSCPnet.dll introuvable. Redemarre PowerShell et relance.'
            exit 1
        }
        OK ('WinSCP installe : ' + $winscpDll)
    }
    else {
        OK ('WinSCP detecte : ' + $winscpDll)
    }

    Add-Type -LiteralPath $winscpDll

    # --- ETAPE 5 - SFTP ---
    Step '5/8 - Connexion SFTP Hostinger'

    $sessionOpts = New-Object WinSCP.SessionOptions
    $sessionOpts.Protocol = [WinSCP.Protocol]::Sftp
    $sessionOpts.HostName = $PinappDeployHost
    $sessionOpts.UserName = $PinappDeployUser
    $sessionOpts.Password = $pwdPlain
    $sessionOpts.PortNumber = $PinappDeployPort
    Set-WinScpTrustHostKey -SessionOptions $sessionOpts

    $session = New-Object WinSCP.Session
    try {
        try {
            $session.Open($sessionOpts)
            OK ('Connecte a ' + $PinappDeployHost)
        }
        catch {
            Err ('Echec connexion : ' + $_.Exception.Message)
            Info 'Verifie host, user, mot de passe (-Reconfigure), port 22.'
            exit 1
        }

        # --- ETAPE 6 - BACKUP + SYNC UPLOAD ---
        Step '6/8 - Backup ancien site + upload'

        $dateStr = Get-Date -Format 'yyyy-MM-dd-HHmmss'
        $remoteBase = $PinappDeployRemotePath.TrimEnd('/')
        $remoteIndex = $remoteBase + '/index.html'
        $remoteAssets = $remoteBase + '/assets'

        try {
            if ($session.FileExists($remoteIndex)) {
                $backupName = $remoteBase + '/index-OLD-' + $dateStr + '.html'
                $session.MoveFile($remoteIndex, $backupName)
                OK ('Ancien index.html -> index-OLD-' + $dateStr + '.html')
            }
            else {
                Info 'Pas d index.html distant (premier deploiement ?)'
            }
        }
        catch {
            Warn2 ('Backup index : ' + $_.Exception.Message)
        }

        try {
            if ($session.FileExists($remoteAssets)) {
                $backupAssets = $remoteBase + '/assets-OLD-' + $dateStr
                $session.MoveFile($remoteAssets, $backupAssets)
                OK ('Ancien assets/ -> assets-OLD-' + $dateStr + '/')
            }
        }
        catch {
            Warn2 ('Backup assets : ' + $_.Exception.Message)
        }

        Info 'Synchronisation fichiers (recursif)...'
        $mode = [WinSCP.SynchronizationMode]::Remote
        $syncResult = $session.SynchronizeDirectories($mode, $workDir, $remoteBase, $false)
        $syncResult.Check()
        $uploaded = $syncResult.Uploads.Count
        OK ($uploaded.ToString() + ' fichiers transferes (sync)')

        $session.Dispose()
        $session = $null
        OK 'Connexion SFTP fermee'
    }
    catch {
        if ($null -ne $session) {
            try { $session.Dispose() } catch { }
        }
        throw
    }
}
finally {
    $pwdPlain = $null
    Remove-Item -LiteralPath $extractDir -Recurse -Force -ErrorAction SilentlyContinue
}

# --- ETAPE 7 - HTTP ---
Step '7/8 - Verification pinapp.fr'

Start-Sleep -Seconds 3
try {
    $r = Invoke-WebRequest -Uri 'https://pinapp.fr' -UseBasicParsing -TimeoutSec 15
    $sizeKo = [math]::Round($r.RawContentLength / 1KB, 1)
    if ($r.StatusCode -eq 200) {
        OK ('HTTP 200 - ' + $sizeKo + ' Ko')
    }
    else {
        Warn2 ('HTTP ' + [int]$r.StatusCode)
    }
}
catch {
    Warn2 ('HTTP : ' + $_.Exception.Message)
    Warn2 'Le site peut etre en ligne quand meme. Vide le cache Hostinger si besoin.'
}

# --- ETAPE 8 - NAVIGATEUR ---
Step '8/8 - Ouverture pinapp.fr (navigation privee)'

$cacheBust = Get-Date -Format 'HHmmss'
$url = 'https://pinapp.fr?v=' + $cacheBust

$opened = $false
$pf86 = ${env:ProgramFiles(x86)}
$browsers = @(
    @{ exe = (Join-Path $env:ProgramFiles 'Microsoft\Edge\Application\msedge.exe'); args = @('-inprivate', $url) },
    @{ exe = (Join-Path $pf86 'Microsoft\Edge\Application\msedge.exe'); args = @('-inprivate', $url) },
    @{ exe = (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'); args = @('-incognito', $url) },
    @{ exe = (Join-Path $pf86 'Google\Chrome\Application\chrome.exe'); args = @('-incognito', $url) },
    @{ exe = (Join-Path $env:ProgramFiles 'Mozilla Firefox\firefox.exe'); args = @('-private-window', $url) }
)
foreach ($b in $browsers) {
    if (Test-Path -LiteralPath $b.exe) {
        Start-Process -FilePath $b.exe -ArgumentList $b.args
        OK ('Navigateur : ' + (Split-Path -Leaf $b.exe))
        $opened = $true
        break
    }
}
if (-not $opened) {
    Start-Process $url
    OK 'Navigateur par defaut'
}

# --- RAPPORT ---
$duration = (Get-Date) - $startTime
$durStr = ('{0} min {1} sec' -f [int][math]::Floor($duration.TotalMinutes), $duration.Seconds)

Write-Host ''
Write-Host '====================================================================' -ForegroundColor Green
Write-Host '   DEPLOIEMENT TERMINE AVEC SUCCES                                 ' -ForegroundColor Green
Write-Host '====================================================================' -ForegroundColor Green
Write-Host ''
Write-Host '  URL               : https://pinapp.fr' -ForegroundColor White
Write-Host ('  Fichiers uploades : ' + $uploaded) -ForegroundColor White
Write-Host ('  Backup index      : index-OLD-' + $dateStr + '.html (si existait)') -ForegroundColor White
Write-Host ('  Backup assets     : assets-OLD-' + $dateStr + '/ (si existait)') -ForegroundColor White
Write-Host ('  Duree             : ' + $durStr) -ForegroundColor White
Write-Host ''
Write-Host '  Si la page semble vieille :' -ForegroundColor Yellow
Info 'hpanel.hostinger.com -> Avance -> Cache -> Vider'
Write-Host ''
Write-Host '  Prochain run : double-clic sur go.ps1, zero saisie.' -ForegroundColor White
Write-Host ''

Write-Host '  --- Checklist visuelle ---' -ForegroundColor Cyan
@(
    "Hero : Le site qu'on signe. Le systeme qui tourne.",
    'Video : Voyez comment on travaille -> modal Vimeo',
    '4 cards Realisations (Atelier Rivage + 3 demos)',
    "A propos : Une conviction simple",
    'Approche : 7 / 30 / 0 (or italique)',
    'Temoignages fond bleu profond',
    'Tarifs : Essentiel 1500 / Studio 3500 (featured) / Sur-mesure',
    'FAQ : 8 accordions',
    'Footer : bandeau STACK TECHNIQUE',
    'Mobile : burger + X visible'
) | ForEach-Object { Write-Host ('    [ ] ' + $_) -ForegroundColor DarkGray }
