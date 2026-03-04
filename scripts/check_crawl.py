#!/usr/bin/env python3
"""HTTP crawl sanity check for GitHub Pages project path style URLs."""

from __future__ import annotations

import subprocess
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]  # /workspace
PORT = 8790
BASE = f"http://127.0.0.1:{PORT}"
PATHS = [
    "/Website/",
    "/Website/en/",
    "/Website/ko/",
    "/Website/en/programs.html",
    "/Website/en/advantages.html",
    "/Website/en/support.html",
    "/Website/en/contact.html",
    "/Website/en/cookie-settings.html",
    "/Website/en/one-on-one.html",
    "/Website/ko/programs.html",
    "/Website/ko/advantages.html",
    "/Website/ko/support.html",
    "/Website/ko/contact.html",
    "/Website/ko/cookie-settings.html",
    "/Website/ko/one-on-one.html",
]


def main() -> int:
    server = subprocess.Popen(
        ["python3", "-m", "http.server", str(PORT), "--directory", str(ROOT)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    failures: list[tuple[str, str]] = []
    try:
        time.sleep(0.7)
        for path in PATHS:
            url = f"{BASE}{path}"
            try:
                with urllib.request.urlopen(url, timeout=10) as response:
                    code = response.getcode()
                if code != 200:
                    failures.append((path, f"HTTP {code}"))
            except Exception as exc:  # pragma: no cover - runtime connectivity guard
                failures.append((path, str(exc)))
    finally:
        server.terminate()
        server.wait(timeout=5)

    if failures:
        for path, reason in failures:
            print(f"FAIL {path}: {reason}")
        return 1

    print("Crawl check passed for all required /Website/ routes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
