# PINAPP - Generateur images voyage cosmique via Pollinations.ai (gratuit)
# A utiliser UNIQUEMENT si tu n'as pas Cursor 2.4+ avec Nano Banana Pro (fallback)
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Web

$OUT = "./assets/images/voyage"
New-Item -ItemType Directory -Force -Path $OUT | Out-Null

$DNA = "shot on IMAX 65mm film, Roger Deakins cinematography, Hans Zimmer cosmic mood, deep indigo blacks, cyan bioluminescent accents, violet and magenta highlights, precious solemn tone, shallow depth of field, subtle film grain, photoreal 8K detail"

$scenes = @(
  @{ id = "01-seuil"; v = 1; p = "single human emerging from luxurious curved hibernation pod, shutters slowly opening, first cyan biolumi light on face, Passengers Avalon hibernation bay, warm amber architecture, precious awakening" },
  @{ id = "02-corridor"; v = 1; p = "first-person view walking forward down curved luxurious spaceship corridor, ribbed organic architecture warm amber, cyan bioluminescent accents on walls, distant cockpit door with bright light, Passengers Avalon corridor meets Avatar living architecture, Kubrickian symmetry" },
  @{ id = "03-cockpit-planete"; v = 3; p = "view from inside luxurious spaceship cockpit, captain silhouette in shadowed foreground, massive curved panoramic window, single magnificent bioluminescent planet dominating 80% of view, planet surface covered in glowing cyan and violet network veins like neural connections, rivers of light, Avatar Eywa meets Earth at night from ISS, dark ribbed cockpit barely visible" },
  @{ id = "04-pod-voie-lactee"; v = 3; p = "single human inside luxurious curved cryopod with panoramic transparent canopy, floating clinical cyan holographic statistics and bar charts, Oxygene 2021 Melanie Laurent MILO interface, INCREDIBLY DENSE Milky Way through canopy with countless precious stars like scattered jewels, thousands of stars varying sizes, deep violet and magenta nebula, warm amber star accents, brightest stars with delicate halos like gems, cosmic dust, Terrence Malick Tree of Life meets Interstellar warmth meets Passengers spacewalk Milky Way" },
  @{ id = "05-warp"; v = 1; p = "view from inside spaceship observation deck as vessel enters warp speed, stars streaking into light trails through massive curved window, cyan and violet light streaks motion blur, Interstellar wormhole meets Passengers hyperspace softer cinematic" },
  @{ id = "06-bridge-lune"; v = 2; p = "breathtaking view from inside luxurious spaceship bridge, curved control consoles foreground with cyan biolumi details, massive panoramic curved window revealing THE MOON dominating 70% of frame, craters and shadows hyper-detailed, distant Earth as small blue marble, countless precious stars, holographic cyan form interface panel levitating glowing biolumi, Passengers Avalon bridge meets 2001 lunar monolith meets Ad Astra meets Interstellar Cooper station" }
)

$total = 0
foreach ($s in $scenes) { $total += $s.v * 2 }
Write-Host "`n[PINAPP] $total images to generate`n" -ForegroundColor Cyan

$i = 0
foreach ($s in $scenes) {
  Write-Host "[$($s.id)]" -ForegroundColor Yellow
  $enc = [System.Web.HttpUtility]::UrlEncode("$($s.p), $DNA")
  for ($v = 1; $v -le $s.v; $v++) {
    foreach ($fmt in @(@{ s = "desktop"; w = 1920; h = 1080 }, @{ s = "mobile"; w = 1080; h = 1920 })) {
      $i++
      $seed = 1000 + ($i * 7)
      $name = if ($s.v -gt 1) { "$($s.id)-$($fmt.s)-v$v.png" } else { "$($s.id)-$($fmt.s).png" }
      $path = Join-Path $OUT $name
      $url = "https://image.pollinations.ai/prompt/$enc`?width=$($fmt.w)&height=$($fmt.h)&model=flux&nologo=true&seed=$seed"
      Write-Host "  [$i/$total] $name..." -NoNewline -ForegroundColor Gray
      try {
        Invoke-WebRequest -Uri $url -OutFile $path -TimeoutSec 90 -UseBasicParsing
        $kb = [math]::Round((Get-Item $path).Length / 1KB, 0)
        Write-Host " OK ($kb KB)" -ForegroundColor Green
      }
      catch { Write-Host " FAIL" -ForegroundColor Red }
      Start-Sleep -Seconds 2
    }
  }
}
Write-Host "`n[DONE] $i images in $OUT`n" -ForegroundColor Green
