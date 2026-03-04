#!/usr/bin/env python3
"""Check Markdown files for broken internal links."""
from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent
MD_LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")


def slugify(heading: str) -> str:
    text = heading.strip().lower()
    text = re.sub(r"[`*_~]", "", text)
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def collect_headings(md_file: Path) -> set[str]:
    anchors: set[str] = set()
    seen: dict[str, int] = {}
    for line in md_file.read_text(encoding="utf-8").splitlines():
        match = HEADING_RE.match(line)
        if not match:
            continue
        base = slugify(match.group(2))
        if not base:
            continue
        count = seen.get(base, 0)
        seen[base] = count + 1
        anchors.add(base if count == 0 else f"{base}-{count}")
    return anchors


def iter_markdown_files() -> list[Path]:
    return sorted(
        p
        for p in ROOT.rglob("*.md")
        if ".git" not in p.parts and "node_modules" not in p.parts
    )


def validate() -> list[str]:
    errors: list[str] = []
    heading_cache: dict[Path, set[str]] = {}

    for md in iter_markdown_files():
        text = md.read_text(encoding="utf-8")
        for target in MD_LINK_RE.findall(text):
            target = target.strip()
            if not target or target.startswith(("http://", "https://", "mailto:")):
                continue
            if target.startswith("#"):
                anchor = unquote(target[1:])
                anchors = heading_cache.setdefault(md, collect_headings(md))
                if anchor not in anchors:
                    errors.append(f"{md.relative_to(ROOT)}: missing anchor #{anchor}")
                continue

            path_part, _, fragment = target.partition("#")
            path_part = unquote(path_part)
            dest = (md.parent / path_part).resolve()
            if not dest.exists():
                errors.append(
                    f"{md.relative_to(ROOT)}: missing file target {path_part}"
                )
                continue
            if fragment and dest.suffix.lower() == ".md":
                anchors = heading_cache.setdefault(dest, collect_headings(dest))
                if fragment not in anchors:
                    errors.append(
                        f"{md.relative_to(ROOT)}: missing anchor #{fragment} in {dest.relative_to(ROOT)}"
                    )
    return errors


def main() -> int:
    errors = validate()
    if errors:
        print("Broken internal Markdown links found:")
        for err in errors:
            print(f" - {err}")
        return 1
    print("No broken internal Markdown links found.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
