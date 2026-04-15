#!/usr/bin/env python3
"""
Synchronise pinapp.fr : DNS Hostinger (optionnel) + domaine custom GitHub Pages.
Utilise les variables d'environnement ; aucun secret en sortie.

CI GitHub : preferer tools/ci/pinapp-fr-sync.ps1 (PowerShell ; workflows pinapp-fr).
Ce fichier reste comme reference / secours hors pwsh.

  HOSTINGER_API_TOKEN   — si absent ou vide : etape Hostinger ignoree (exit 0).
  GITHUB_TOKEN          — requis pour PUT Pages (sauf si PINAPP_SKIP_GITHUB=1).
  GITHUB_REPOSITORY     — owner/repo (fourni par GitHub Actions).
  PINAPP_DOMAIN         — defaut pinapp.fr
  PAGES_CNAME_TARGET    — defaut lauraliedaguzay-lang.github.io.
  PINAPP_SKIP_HOSTINGER — 1 / true : ne pas appeler Hostinger
  PINAPP_SKIP_GITHUB    — 1 / true : ne pas appeler GitHub
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request


def _truthy(name: str) -> bool:
    v = (os.environ.get(name) or "").strip().lower()
    return v in ("1", "true", "yes", "on")


def hostinger_dns_put() -> int:
    if _truthy("PINAPP_SKIP_HOSTINGER"):
        print("Hostinger DNS : PINAPP_SKIP_HOSTINGER — ignore.")
        return 0
    token = (os.environ.get("HOSTINGER_API_TOKEN") or "").strip()
    if not token:
        print("Hostinger DNS : secret HOSTINGER_API_TOKEN absent — ignore (optionnel).")
        return 0

    domain = os.environ.get("PINAPP_DOMAIN", "pinapp.fr").strip()
    target = os.environ.get("PAGES_CNAME_TARGET", "lauraliedaguzay-lang.github.io.").strip()
    if not target.endswith("."):
        target += "."

    ips = ["185.199.108.153", "185.199.109.153", "185.199.110.153", "185.199.111.153"]
    zone = [
        {"name": "@", "type": "A", "ttl": 3600, "records": [{"content": ip} for ip in ips]},
        {"name": "www", "type": "CNAME", "ttl": 3600, "records": [{"content": target}]},
    ]
    payload = {"overwrite": True, "zone": zone}
    body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    path = urllib.parse.quote(domain, safe="")
    url = f"https://developers.hostinger.com/api/dns/v1/zones/{path}"
    req = urllib.request.Request(
        url,
        data=body,
        method="PUT",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            print(f"Hostinger DNS PUT -> HTTP {r.status}")
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        print(f"::error::Hostinger API HTTP {e.code}: {err[:2000]}")
        return 1
    return 0


def github_pages_put() -> int:
    if _truthy("PINAPP_SKIP_GITHUB"):
        print("GitHub Pages domaine : PINAPP_SKIP_GITHUB — ignore.")
        return 0
    owner, _, repo = (os.environ.get("GITHUB_REPOSITORY") or "").partition("/")
    if not owner or not repo:
        print("::error::GITHUB_REPOSITORY manquant ou invalide")
        return 1
    token = (os.environ.get("GITHUB_TOKEN") or "").strip()
    if not token:
        print("::error::GITHUB_TOKEN manquant")
        return 1
    cname = os.environ.get("PINAPP_DOMAIN", "pinapp.fr").strip()

    body = json.dumps({"cname": cname, "https_enforced": True}).encode("utf-8")
    url = f"https://api.github.com/repos/{owner}/{repo}/pages"
    req = urllib.request.Request(
        url,
        data=body,
        method="PUT",
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            print(f"GitHub Pages PUT (cname) -> HTTP {r.status}")
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        print(f"::error::GitHub API HTTP {e.code}: {err[:2000]}")
        return 1
    return 0


def main() -> int:
    # GitHub Pages en premier : declarer pinapp.fr sur le depot meme si Hostinger echoue ensuite.
    rc = 0
    rc |= github_pages_put()
    rc |= hostinger_dns_put()
    return rc


if __name__ == "__main__":
    sys.exit(main())
