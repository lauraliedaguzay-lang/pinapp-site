#requires -Version 5.1
<#
.SYNOPSIS
  Orchestration Pinapp : site (ship + APIs Hostinger/GitHub) + webhooks n8n optionnels + rappels Claude/Apps Script.
.DESCRIPTION
  1) Webhook n8n « demarrage » (optionnel) : $env:PINAPP_N8N_ORCHESTRATE_START_URL
  2) pinapp-applique-tout.ps1 : config locale + ship + fr-auto + probe
  3) Webhook n8n « fin » (optionnel) : $env:PINAPP_N8N_ORCHESTRATE_DONE_URL
  4) Webhook generique (optionnel) : $env:PINAPP_N8N_WEBHOOK_URL — un seul POST JSON { event, source }
  5) Rappels : n8n / Claude (Gmail) = hors ce script (URLs et doc ci-dessous)
  6) -TestAnthropic : un appel minimal API Anthropic (coute un peu) si ANTHROPIC_API_KEY

  Variables utiles (voir AUTOMATIONS.md pour n8n / Netlify) :
    PINAPP_N8N_ORCHESTRATE_START_URL, PINAPP_N8N_ORCHESTRATE_DONE_URL, PINAPP_N8N_WEBHOOK_URL
    ANTHROPIC_API_KEY, PINAPP_ANTHROPIC_MODEL (defaut claude-3-5-haiku-20241022)

  Config jetons Hostinger/GitHub : pinapp-fr-deploy.local.ps1 ou .pinapp-secrets.ps1 (voir pinapp-fr-deploy.EXAMPLE.ps1).
.PARAMETER ConfigFile
  Passe a pinapp-applique-tout.ps1.
.PARAMETER SkipShip
  Passe a pinapp-applique-tout.ps1.
.PARAMETER SkipN8n
  Ne pas appeler les webhooks n8n.
.PARAMETER TestAnthropic
  Verifie ANTHROPIC_API_KEY avec un appel messages (max_tokens 1).
.PARAMETER DryRun
  Affiche les etapes sans executer ship/fr-auto ni webhooks.
.EXAMPLE
  .\pinapp-orchestrate.ps1
  $env:PINAPP_N8N_ORCHESTRATE_START_URL = 'https://ton-n8n/webhook/pinapp-start'; .\pinapp-orchestrate.ps1
#>
[CmdletBinding()]
param(
    [string] $ConfigFile,
    [switch] $SkipShip,
    [switch] $SkipN8n,
    [switch] $TestAnthropic,
    [switch] $DryRun
)

$ErrorActionPreference = 'Continue'
if (-not $PSScriptRoot) {
    Write-Error 'Lance ce fichier comme .ps1'
}
$PinappRepoRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $PinappRepoRoot
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')

$applique = Join-Path $PSScriptRoot 'pinapp-applique-tout.ps1'

function Invoke-PinappN8nWebhook {
    param(
        [string] $Url,
        [string] $EventName
    )
    if (-not $Url -or -not $Url.Trim()) { return }
    $payload = @{
        source    = 'pinapp-orchestrate'
        event     = $EventName
        timestamp = [DateTime]::UtcNow.ToString('o')
    } | ConvertTo-Json -Compress
    try {
        $null = Invoke-RestMethod -Uri $Url.Trim() -Method Post -Body $payload -ContentType 'application/json; charset=utf-8' -TimeoutSec 30
        Write-Host ('OK n8n webhook : ' + $EventName) -ForegroundColor Green
    } catch {
        Write-Host ('n8n webhook ' + $EventName + ' : ' + $_.Exception.Message) -ForegroundColor Yellow
    }
}

function Write-PinappStackReminders {
    Write-Host ''
    Write-Host '=== Suite a faire hors PowerShell (API / SaaS) ===' -ForegroundColor Cyan
    Write-Host '  n8n     : workflows JSON et webhooks dans AUTOMATIONS.md (diagnostic-lead, lead-decision, etc.)' -ForegroundColor White
    Write-Host '  Claude  : brouillons Gmail = apps-script/pinapp-gmail-claude.gs' -ForegroundColor White
    Write-Host '            guide : docs/claude-consultation/10-APPS-SCRIPT-H24-SETUP.md' -ForegroundColor DarkGray
    Write-Host '  Netlify : variables APPROVE_SECRET, N8N_APPROVE_URL (voir AUTOMATIONS.md)' -ForegroundColor White
    Write-Host ''
}

Write-Host ''
Write-Host '=== pinapp-orchestrate ===' -ForegroundColor Cyan

if ($DryRun) {
    Write-Host 'DryRun : pas d appels API site ni n8n.' -ForegroundColor Yellow
    Write-Host '  - applique-tout (ship + fr-auto + probe)' -ForegroundColor Gray
    Write-Host '  - START_URL = ' $env:PINAPP_N8N_ORCHESTRATE_START_URL -ForegroundColor Gray
    Write-Host '  - DONE_URL  = ' $env:PINAPP_N8N_ORCHESTRATE_DONE_URL -ForegroundColor Gray
    Write-Host '  - WEBHOOK   = ' $env:PINAPP_N8N_WEBHOOK_URL -ForegroundColor Gray
    Write-PinappStackReminders
    exit 0
}

if (-not $SkipN8n) {
    Invoke-PinappN8nWebhook -Url $env:PINAPP_N8N_ORCHESTRATE_START_URL -EventName 'orchestrate_start'
    if ($env:PINAPP_N8N_WEBHOOK_URL) {
        Invoke-PinappN8nWebhook -Url $env:PINAPP_N8N_WEBHOOK_URL -EventName 'orchestrate'
    }
}

if (-not (Test-Path -LiteralPath $applique)) {
    Write-Error ('Introuvable : ' + $applique)
}

$splat = @{}
if ($ConfigFile) { $splat['ConfigFile'] = $ConfigFile }
if ($SkipShip) { $splat['SkipShip'] = $true }

Write-Host ''
Write-Host '--- noyau : pinapp-applique-tout ---' -ForegroundColor Cyan
& $applique @splat
$exitApplique = $LASTEXITCODE

if (-not $SkipN8n) {
    Invoke-PinappN8nWebhook -Url $env:PINAPP_N8N_ORCHESTRATE_DONE_URL -EventName 'orchestrate_done'
}

if ($TestAnthropic) {
    $key = $env:ANTHROPIC_API_KEY
    if (-not $key -or -not $key.Trim()) {
        Write-Host 'TestAnthropic : ANTHROPIC_API_KEY absent.' -ForegroundColor Yellow
    } else {
        $model = $env:PINAPP_ANTHROPIC_MODEL
        if (-not $model) { $model = 'claude-3-5-haiku-20241022' }
        $uri = 'https://api.anthropic.com/v1/messages'
        $bodyObj = @{
            model       = $model
            max_tokens  = 1
            messages    = @(@{ role = 'user'; content = '0' })
        }
        $json = $bodyObj | ConvertTo-Json -Depth 6 -Compress
        try {
            $null = Invoke-RestMethod -Uri $uri -Method Post -Headers @{
                'x-api-key'         = $key.Trim()
                'anthropic-version' = '2023-06-01'
                'Content-Type'      = 'application/json'
            } -Body $json -TimeoutSec 60
            Write-Host 'TestAnthropic : API OK.' -ForegroundColor Green
        } catch {
            Write-Host ('TestAnthropic : ' + $_.Exception.Message) -ForegroundColor Red
        }
    }
}

Write-PinappStackReminders

if ($exitApplique -ne 0 -and $null -ne $exitApplique) {
    exit $exitApplique
}
