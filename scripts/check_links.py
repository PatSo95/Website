#!/usr/bin/env python3
"""Validate internal links in HTML files."""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent


class LinkCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []
        self.base_href: str | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_map = dict(attrs)
        if tag == "base" and attrs_map.get("href") and self.base_href is None:
            self.base_href = attrs_map["href"] or None
        if tag == "a" and attrs_map.get("href"):
            self.links.append(attrs_map["href"] or "")
        if tag in {"link", "script"}:
            key = "href" if tag == "link" else "src"
            if attrs_map.get(key):
                self.links.append(attrs_map[key] or "")


def is_external(link: str) -> bool:
    parsed = urlparse(link)
    return bool(parsed.scheme in {"http", "https", "mailto", "tel"} and parsed.netloc)


def resolve_target(current: Path, link: str, base_href: str | None) -> Path:
    path = link.split("#", 1)[0].split("?", 1)[0]
    if not path:
        return current

    if path.startswith("/"):
        return (ROOT / path.lstrip("/")).resolve()

    if base_href and base_href.startswith("/"):
        return (ROOT / base_href.lstrip("/") / path).resolve()

    return (current.parent / path).resolve()


def target_exists(target: Path) -> bool:
    if target.is_file():
        return True
    if target.is_dir():
        return (target / "index.html").exists()
    if target.suffix:
        return False
    return (target / "index.html").exists() or target.with_suffix(".html").exists()


def check_html_links() -> list[str]:
    errors: list[str] = []
    for html in sorted(ROOT.rglob("*.html")):
        if ".git" in html.parts:
            continue
        parser = LinkCollector()
        parser.feed(html.read_text(encoding="utf-8"))
        for link in parser.links:
            if not link or link.startswith("#") or is_external(link):
                continue
            target = resolve_target(html, link, parser.base_href)
            if not target_exists(target):
                errors.append(f"{html.relative_to(ROOT)} -> missing target: {link}")
    return errors


def main() -> int:
    errors = check_html_links()
    if errors:
        print("Broken internal HTML links found:")
        for err in errors:
            print(f" - {err}")
        return 1
    print("No broken internal HTML links found.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
