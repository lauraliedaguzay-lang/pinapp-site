#Requires -Version 5.1
<#
.SYNOPSIS
  Audit (and optional update) of site -> automation webhooks (n8n) via assets/js/config.js.

.DESCRIPTION
  WhatsApp Business, Stripe, Make, Zapier credentials live in n8n/Make/Netlify, not in this repo.
  This script checks config.js placeholders and can apply pinapp-automation.local.ps1 settings.

.PARAMETER Apply
  Writes config.js (with .bak) when pinapp-automation.local.ps1 exists.

.PARAMETER DryRun
  With -Apply: no write.

.EXAMPLE
  .\pinapp-automation-connect.ps1
  .\pinapp-automation-connect.ps1 -Apply
#>
[CmdletBinding()]
param(
  [switch]$Apply,
  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Root = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $Root
$ConfigPath = Join-Path $Root 'assets\js\config.js'
$LocalPath = Join-Path $Root 'pinapp-automation.local.ps1'

function Write-Section([string]$Title) {
  Write-Host ''
  Write-Host "=== $Title ===" -ForegroundColor Cyan
}

if (-not (Test-Path -LiteralPath $ConfigPath)) {
  Write-Error "Missing file: $ConfigPath"
}

$raw = [System.IO.File]::ReadAllText($ConfigPath, [System.Text.UTF8Encoding]::new($false))

Write-Section 'PINAPP automation audit'

$placeholderN8n = $raw -match '\[TON-N8N\]'
$badWa = $raw -match '33XXXXXXXXX'

$flags = @(
  @{ Name = 'diagnosticWebhook';       Label = 'Webhook diagnostic lead -> n8n' }
  @{ Name = 'onboardingWebhook';       Label = 'Webhook onboarding -> n8n' }
  @{ Name = 'leadWebhook';             Label = 'Webhook lead magnet / guide' }
  @{ Name = 'auroraAnalyseIA';         Label = 'Aurora analyse IA -> n8n' }
  @{ Name = 'auroraUniversIA';         Label = 'Aurora univers -> n8n' }
  @{ Name = 'whatsappNotifs';          Label = 'Internal notifs (often WhatsApp via n8n)' }
  @{ Name = 'diagnosticClaudePrep';    Label = 'Claude prep / n8n orchestrator' }
)

Write-Host ''
Write-Host 'Site -> n8n (assets/js/config.js)' -ForegroundColor Yellow
if ($placeholderN8n) {
  Write-Host '  [NO]  Webhook URLs still contain [TON-N8N] - site cannot reach your n8n yet.' -ForegroundColor Red
} else {
  Write-Host '  [OK]  No [TON-N8N] placeholder (host filled in).' -ForegroundColor Green
}

if ($badWa) {
  Write-Host '  [NO]  wa.me still has placeholder 33XXXXXXXXX.' -ForegroundColor Red
} else {
  Write-Host '  [OK]  wa.me has no obvious placeholder.' -ForegroundColor Green
}

Write-Host ''
Write-Host 'Feature flags (browser fetch only if true AND real https URL)' -ForegroundColor Yellow
foreach ($f in $flags) {
  $n = $f.Name
  if ($raw -match "$([regex]::Escape($n)):\s*true\b") {
    Write-Host "  [ON]  $($f.Label)" -ForegroundColor Green
  } else {
    Write-Host "  [OFF] $($f.Label)" -ForegroundColor DarkGray
  }
}

Write-Section 'Outside this repo (your dashboards)'
Write-Host '  - WhatsApp Business API: Meta or Twilio -> configure in n8n (HTTP/Twilio node).'
Write-Host '  - Stripe: secret keys in n8n, Stripe Dashboard, or Netlify - never in public config.js.'
Write-Host '  - Make/Zapier: paste their webhook URL into config.js line by line if you prefer them over n8n.'
Write-Host '  - See AUTOMATIONS.md and comments in assets/js/config.js.'

if (-not $Apply) {
  Write-Host ''
  Write-Host 'To set n8n host + wa.me: copy pinapp-automation.local.EXAMPLE.ps1 to pinapp-automation.local.ps1, edit, then:' -ForegroundColor Cyan
  Write-Host '  .\pinapp-automation-connect.ps1 -Apply' -ForegroundColor White
  exit 0
}

Write-Section 'Apply to config.js'

if (-not (Test-Path -LiteralPath $LocalPath)) {
  Write-Error "Missing $LocalPath - copy from pinapp-automation.local.EXAMPLE.ps1"
}

. $LocalPath

if (-not $PinappN8nHostname -or [string]::IsNullOrWhiteSpace($PinappN8nHostname)) {
  Write-Error 'pinapp-automation.local.ps1 must set $PinappN8nHostname (e.g. myapp.n8n.cloud, no https://).'
}

$hostClean = $PinappN8nHostname.Trim().TrimEnd('/')
$hostClean = $hostClean -replace '^https?://', ''
if ($hostClean -match '[^\w.\-]') {
  Write-Error "Invalid n8n host: $hostClean"
}

$newContent = $raw -replace '\[TON-N8N\]', $hostClean

if ($PinappWhatsAppWaMe -and -not [string]::IsNullOrWhiteSpace($PinappWhatsAppWaMe)) {
  $wa = ($PinappWhatsAppWaMe -replace '\s', '' -replace '^\+', '')
  if ($wa -notmatch '^\d{10,15}$') {
    Write-Error 'wa.me: use digits only (e.g. 33612345678)'
  }
  $newContent = $newContent -replace 'https://wa\.me/33XXXXXXXXX', "https://wa.me/$wa"
}

$replacements = @{
  'diagnosticWebhook'    = 'PinappEnableDiagnosticWebhook'
  'onboardingWebhook'    = 'PinappEnableOnboardingWebhook'
  'leadWebhook'          = 'PinappEnableLeadWebhook'
  'auroraAnalyseIA'      = 'PinappEnableAuroraAnalyseIA'
  'auroraUniversIA'      = 'PinappEnableAuroraUniversIA'
  'whatsappNotifs'       = 'PinappEnableWhatsappNotifs'
  'diagnosticClaudePrep' = 'PinappEnableDiagnosticClaudePrep'
}

foreach ($kv in $replacements.GetEnumerator()) {
  $key = $kv.Key
  $varName = $kv.Value
  $val = Get-Variable -Name $varName -ErrorAction SilentlyContinue
  if ($null -eq $val) { continue }
  $bool = [bool]$val.Value
  $pattern = "\b$key\s*:\s*(?:true|false)(\s*,)"
  if ($newContent -notmatch $pattern) {
    Write-Warning "Feature key not found: $key"
    continue
  }
  if ($bool) {
    $newContent = $newContent -replace "(\b$key\s*:\s*)false(\s*,)", '${1}true${2}'
  } else {
    $newContent = $newContent -replace "(\b$key\s*:\s*)true(\s*,)", '${1}false${2}'
  }
}

if ($newContent -ceq $raw) {
  Write-Host 'No changes needed (already matches local profile).' -ForegroundColor DarkYellow
  exit 0
}

if ($DryRun) {
  Write-Host '[DryRun] Would write config.js (length change:' ($newContent.Length - $raw.Length) 'chars).' -ForegroundColor Yellow
  exit 0
}

$bak = $ConfigPath + '.bak'
Copy-Item -LiteralPath $ConfigPath -Destination $bak -Force
Write-Host "Backup: $bak" -ForegroundColor Yellow
[System.IO.File]::WriteAllText($ConfigPath, $newContent, [System.Text.UTF8Encoding]::new($false))
Write-Host "Updated: $ConfigPath" -ForegroundColor Green
Write-Host ''
Write-Host 'Next: test each n8n workflow, then set flags to true one by one in .local and re-run -Apply.' -ForegroundColor Cyan
