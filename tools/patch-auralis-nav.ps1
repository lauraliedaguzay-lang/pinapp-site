$ErrorActionPreference = 'Stop'
$base = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding $false

$pairs = @(
  @{
    Old = '        <a href="univers/index.html" class="nav-link" style="font-size:14px;opacity:0.8;">Univers</a>'
    New = "        <a href=`"auralis/index.html`" class=`"nav-link`" style=`"font-size:14px;opacity:0.8;`">Auralis</a>`r`n        <a href=`"univers/index.html`" class=`"nav-link`" style=`"font-size:14px;opacity:0.8;`">Univers</a>"
  },
  @{
    Old = '        <a href="../univers/index.html" class="nav-link" style="font-size:14px;opacity:0.8;">Univers</a>'
    New = "        <a href=`"../auralis/index.html`" class=`"nav-link`" style=`"font-size:14px;opacity:0.8;`">Auralis</a>`r`n        <a href=`"../univers/index.html`" class=`"nav-link`" style=`"font-size:14px;opacity:0.8;`">Univers</a>"
  },
  @{
    Old = '        <a href="../../univers/index.html" class="nav-link" style="font-size:14px;opacity:0.8;">Univers</a>'
    New = "        <a href=`"../../auralis/index.html`" class=`"nav-link`" style=`"font-size:14px;opacity:0.8;`">Auralis</a>`r`n        <a href=`"../../univers/index.html`" class=`"nav-link`" style=`"font-size:14px;opacity:0.8;`">Univers</a>"
  },
  @{
    Old = '        <a href="../univers/index.html" class="nav-link">Univers</a>'
    New = "        <a href=`"../auralis/index.html`" class=`"nav-link`">Auralis</a>`r`n        <a href=`"../univers/index.html`" class=`"nav-link`">Univers</a>"
  },
  @{
    Old = '        <a href="index.html" class="nav-link" style="font-size:14px;color:var(--accent-teal);">Univers</a>'
    New = "        <a href=`"../auralis/index.html`" class=`"nav-link`" style=`"font-size:14px;opacity:0.8;`">Auralis</a>`r`n        <a href=`"index.html`" class=`"nav-link`" style=`"font-size:14px;color:var(--accent-teal);`">Univers</a>"
  },
  @{
    Old = '      <a href="index.html" style="color:var(--accent-teal);">Univers</a>'
    New = "      <a href=`"../auralis/index.html`">Auralis</a>`r`n      <a href=`"index.html`" style=`"color:var(--accent-teal);`">Univers</a>"
  }
)

$n = 0
Get-ChildItem -Path $base -Recurse -Filter *.html | ForEach-Object {
  if ($_.FullName -match '\\node_modules\\') { return }
  $c = [System.IO.File]::ReadAllText($_.FullName)
  $orig = $c
  foreach ($p in $pairs) {
    $c = $c.Replace($p.Old, $p.New)
  }
  if ($c -ne $orig) {
    [System.IO.File]::WriteAllText($_.FullName, $c, $utf8)
    Write-Host ('OK ' + $_.FullName.Substring($base.Length + 1))
    $n++
  }
}
Write-Host "Files updated: $n"
