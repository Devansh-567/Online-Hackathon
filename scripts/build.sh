#!/usr/bin/env bash
# Production-oriented build — compiles the React client.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "[build] root: $ROOT"

(cd "$ROOT/frontend" && npm run build)
echo "[build] frontend artifact in frontend/dist"
echo "[build] deploy backend with process manager + serve static or reverse-proxy to CDN."
