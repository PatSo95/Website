#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8000}"

python3 -m http.server "$PORT" >/tmp/website-smoke-server.log 2>&1 &
SERVER_PID=$!
cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT

sleep 1
curl --fail --silent "http://127.0.0.1:${PORT}/" >/dev/null

echo "Smoke check passed: local server responded on http://127.0.0.1:${PORT}/"
