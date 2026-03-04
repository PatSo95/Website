#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ("en", "ko")


def route_set(locale: str) -> set[str]:
    locale_root = ROOT / locale
    routes: set[str] = set()
    for html_file in locale_root.rglob("*.html"):
        relative = html_file.relative_to(locale_root)
        if relative.name == "index.html":
            relative = relative.parent

        route = "/" if str(relative) in (".", "") else "/" + str(relative).replace("\\", "/")
        routes.add(route)
    return routes


def main() -> int:
    en_routes = route_set("en")
    ko_routes = route_set("ko")

    missing_in_ko = sorted(en_routes - ko_routes)
    missing_in_en = sorted(ko_routes - en_routes)

    if missing_in_ko or missing_in_en:
        print("Locale parity validation failed.")
        if missing_in_ko:
            print("Routes present in /en but missing in /ko:")
            for route in missing_in_ko:
                print(f"  {route}")
        if missing_in_en:
            print("Routes present in /ko but missing in /en:")
            for route in missing_in_en:
                print(f"  {route}")
        return 1

    print(f"Locale parity validated for {len(en_routes)} route(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
