#!/usr/bin/env bash
set -euo pipefail

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Release readiness check failed: working tree is not clean."
  echo "Commit or stash all changes before marking DoD/release complete."
  git status --short
  exit 1
fi

echo "Release readiness check passed: working tree is clean."
