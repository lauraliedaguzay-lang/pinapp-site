#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
PINAPP — UPLOAD BATCH VIDÉOS IA MICHA → VIMEO
═══════════════════════════════════════════════════════════════════════════════

Ce script :
  1. Scanne un dossier local de vidéos
  2. Lit la durée de chaque vidéo via ffprobe
  3. Upload chaque vidéo sur Vimeo avec les bons réglages privacy
  4. Trie par durée et génère un manifest.json prêt pour l'intégration web

Emplacement : tools/pinapp_vimeo_batch_upload.py (sorties par défaut dans tools/)

PRÉREQUIS (à faire UNE fois) :
  Mac     :  brew install python ffmpeg
             pip3 install PyVimeo
  Windows :  choco install python ffmpeg  (ou winget)
             pip install PyVimeo

TOKEN VIMEO (à faire UNE fois) :
  1. developer.vimeo.com/apps
  2. "Create an app" (nom: Pinapp, description: upload studio)
  3. Onglet "Authentication" → "Personal Access Tokens"
  4. "Generate" avec scopes : Public, Private, Edit, Upload, Video Files
  5. Copie le token (+ Client Identifier et Client Secrets de l’app si PyVimeo le demande)
  6. Renseigne VIMEO_TOKEN (et idéalement VIMEO_CLIENT_ID / VIMEO_CLIENT_SECRET) ci-dessous
     ou variables d’environnement : VIMEO_TOKEN, VIMEO_CLIENT_ID, VIMEO_CLIENT_SECRET

UTILISATION :
  1. Remplis CONFIG ci-dessous (ou exporte les variables d’environnement)
  2. Depuis le dépôt : python tools/pinapp_vimeo_batch_upload.py
  3. Récupère tools/pinapp_videos_manifest.json → intégration web

Ne commite jamais de vrai token : utilise .env local ou export shell.
═══════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
import json
import subprocess
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent

# ═══════════════════════════════════════════════════════════════════════════════
# ⚙️  CONFIGURATION — REMPLIS OU PASSE PAR LES VARIABLES D’ENVIRONNEMENT
# ═══════════════════════════════════════════════════════════════════════════════

VIMEO_TOKEN = os.environ.get("VIMEO_TOKEN", "COLLE_TON_TOKEN_VIMEO_ICI")
# Souvent requis par l’API Vimeo pour upload() :
VIMEO_CLIENT_ID = os.environ.get("VIMEO_CLIENT_ID", "")
VIMEO_CLIENT_SECRET = os.environ.get("VIMEO_CLIENT_SECRET", "")

# Dossier des vidéos (défaut : ~/Downloads/videos-ia-pinapp)
_default_videos = Path.home() / "Downloads" / "videos-ia-pinapp"
VIDEOS_FOLDER = os.environ.get("VIDEOS_FOLDER", str(_default_videos))

# (Tu peux laisser le reste par défaut)
ALLOWED_DOMAINS = ["pinapp.fr", "www.pinapp.fr"]
OUTPUT_MANIFEST = str(_SCRIPT_DIR / "pinapp_videos_manifest.json")
OUTPUT_LOG = str(_SCRIPT_DIR / "pinapp_upload.log")
RESUME_FILE = str(_SCRIPT_DIR / ".pinapp_upload_state.json")

# ═══════════════════════════════════════════════════════════════════════════════

try:
    import vimeo
except ImportError:
    print("❌ Module 'vimeo' manquant. Lance : pip install PyVimeo")
    sys.exit(1)


def log(msg):
    print(msg, flush=True)
    with open(OUTPUT_LOG, "a", encoding="utf-8") as f:
        f.write(msg + "\n")


def get_duration(filepath):
    """Récupère la durée en secondes via ffprobe."""
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(filepath),
            ],
            capture_output=True,
            text=True,
            timeout=30,
        )
        return float(result.stdout.strip()) if result.stdout.strip() else 0.0
    except FileNotFoundError:
        log("❌ ffprobe introuvable. Installe ffmpeg (brew install ffmpeg / choco install ffmpeg).")
        sys.exit(1)
    except Exception as e:
        log(f"⚠️  ffprobe a échoué sur {filepath.name}: {e}")
        return 0.0


def load_state():
    if Path(RESUME_FILE).exists():
        with open(RESUME_FILE, encoding="utf-8") as f:
            return json.load(f)
    return {"done": {}}


def save_state(state):
    with open(RESUME_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


def format_duration(seconds):
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f"{m}:{s:02d}"


def humanize_title(filename_stem):
    """Transforme 'video_ia_001.mp4' en 'Video Ia 001' — à affiner par Lauralie."""
    return (
        filename_stem.replace("_", " ")
        .replace("-", " ")
        .strip()
        .title()
    )


def make_vimeo_client():
    """Instancie le client PyVimeo (token seul ou token + clé app)."""
    if VIMEO_CLIENT_ID and VIMEO_CLIENT_SECRET:
        return vimeo.VimeoClient(
            token=VIMEO_TOKEN,
            key=VIMEO_CLIENT_ID,
            secret=VIMEO_CLIENT_SECRET,
        )
    return vimeo.VimeoClient(token=VIMEO_TOKEN)


def main():
    # ─── Validations ────────────────────────────────────────────────────────
    if not VIMEO_TOKEN or VIMEO_TOKEN == "COLLE_TON_TOKEN_VIMEO_ICI":
        log("❌ VIMEO_TOKEN non renseigné. Édite le script ou exporte VIMEO_TOKEN.")
        sys.exit(1)

    folder = Path(VIDEOS_FOLDER).expanduser()
    if not folder.exists():
        log(f"❌ Dossier introuvable : {folder}")
        sys.exit(1)

    # ─── Scan vidéos ────────────────────────────────────────────────────────
    extensions = {".mp4", ".mov", ".m4v", ".avi", ".mkv", ".webm"}
    videos = sorted(
        [p for p in folder.rglob("*") if p.suffix.lower() in extensions and p.is_file()]
    )

    if not videos:
        log(f"❌ Aucune vidéo trouvée dans : {folder}")
        sys.exit(1)

    log(f"📁 {len(videos)} vidéo(s) détectée(s) dans : {folder}")

    # ─── Connexion Vimeo ────────────────────────────────────────────────────
    client = make_vimeo_client()

    # Test du token
    try:
        me = client.get("/me").json()
        log(f"👤 Connecté à Vimeo : {me.get('name', '?')} ({me.get('account', '?')})")
    except Exception as e:
        log(f"❌ Token Vimeo invalide ou clé app manquante : {e}")
        log("   Si l’erreur persiste, renseigne VIMEO_CLIENT_ID et VIMEO_CLIENT_SECRET (onglet de l’app Vimeo).")
        sys.exit(1)

    state = load_state()
    results = []

    # ─── Upload boucle ──────────────────────────────────────────────────────
    for i, video in enumerate(videos, 1):
        log(f"\n[{i}/{len(videos)}] 🎬 {video.name}")

        # Reprise si déjà fait (en cas de crash)
        if str(video) in state["done"]:
            log(f"   ✓ Déjà uploadé : vimeo.com/{state['done'][str(video)]['vimeo_id']}")
            results.append(state["done"][str(video)])
            continue

        # Durée locale
        duration = get_duration(video)
        duration_str = format_duration(duration)
        size_mb = video.stat().st_size / (1024 * 1024)
        log(f"   ⏱  Durée : {duration_str}  |  📦 Taille : {size_mb:.0f} Mo")

        title = humanize_title(video.stem)

        # Upload
        log(f"   ⬆️  Upload en cours ({size_mb:.0f} Mo)...")
        try:
            uri = client.upload(
                str(video),
                data={
                    "name": title,
                    "description": "Vidéo IA — Pinapp Studio (Micha)",
                    "privacy": {
                        "view": "disable",  # non listée sur Vimeo
                        "embed": "whitelist",  # embed seulement sur nos domaines
                        "download": False,
                        "comments": "nobody",
                    },
                },
            )
            video_id = uri.split("/")[-1]
            log(f"   ✅ Uploadé : vimeo.com/{video_id}")

            # Whitelist domaines
            for domain in ALLOWED_DOMAINS:
                try:
                    client.put(f"{uri}/privacy/domains/{domain}")
                except Exception as e:
                    log(f"   ⚠️  Domaine {domain} : {e}")
            log(f"   🔒 Domaines autorisés : {', '.join(ALLOWED_DOMAINS)}")

            # Branding player propre
            try:
                client.patch(
                    uri,
                    data={
                        "embed": {
                            "logos": {"vimeo": False},
                            "title": {
                                "owner": "hide",
                                "portrait": "hide",
                                "name": "hide",
                            },
                            "buttons": {
                                "like": False,
                                "watchlater": False,
                                "share": False,
                                "embed": False,
                                "fullscreen": True,
                            },
                        }
                    },
                )
                log("   🎨 Player branding appliqué")
            except Exception as e:
                log(f"   ⚠️  Branding : {e}")

            result = {
                "filename": video.name,
                "title": title,
                "duration_seconds": round(duration, 2),
                "duration_str": duration_str,
                "size_mb": round(size_mb, 1),
                "vimeo_id": video_id,
                "vimeo_url": f"https://vimeo.com/{video_id}",
                "embed_url": f"https://player.vimeo.com/video/{video_id}",
                "thumbnail_url": f"https://vumbnail.com/{video_id}.jpg",
            }
            results.append(result)
            state["done"][str(video)] = result
            save_state(state)

        except Exception as e:
            log(f"   ❌ Erreur upload : {e}")
            continue

    # ─── Tri par durée desc ─────────────────────────────────────────────────
    results.sort(key=lambda x: x["duration_seconds"], reverse=True)

    # ─── Manifest final ─────────────────────────────────────────────────────
    manifest = {
        "generated_at": __import__("datetime").datetime.now().isoformat(),
        "total_videos": len(results),
        "hero": results[0] if results else None,
        "carousel": results[1:] if len(results) > 1 else [],
        "all_videos_by_duration": results,
    }

    with open(OUTPUT_MANIFEST, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    # ─── Récapitulatif ──────────────────────────────────────────────────────
    log("\n" + "═" * 70)
    log(f"✅ TERMINÉ — {len(results)} vidéo(s) uploadée(s) avec succès")
    log("═" * 70)
    if results:
        log("\n🏆 HERO (la plus longue) :")
        log(f"   {results[0]['title']}")
        log(f"   → {results[0]['duration_str']}  |  {results[0]['vimeo_url']}")

        if len(results) > 1:
            log(f"\n🎞  CAROUSEL ({len(results) - 1} vidéo(s)) :")
            for r in results[1:]:
                log(f"   • {r['title']} — {r['duration_str']} — {r['vimeo_url']}")

    log(f"\n📄 Manifest écrit : {OUTPUT_MANIFEST}")
    log("   → Utilise ce JSON pour l’intégration web (section Films IA, carrousel, etc.)\n")


if __name__ == "__main__":
    main()
