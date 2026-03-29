#!/usr/bin/env bash
# SentinelX local bootstrap — installs Node and Python dependencies.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "[setup] root: $ROOT"

if command -v npm >/dev/null 2>&1; then
  echo "[setup] installing backend dependencies"
  (cd "$ROOT/backend" && npm install)
  echo "[setup] installing frontend dependencies"
  (cd "$ROOT/frontend" && npm install)
else
  echo "[setup] npm not found; install Node.js 18+ and re-run." >&2
  exit 1
fi

if command -v python3 >/dev/null 2>&1; then
  echo "[setup] python3 available — ai-engine uses stdlib only (no pip requirements for demo)."
else
  echo "[setup] python3 not found; optional for AI offline scoring." >&2
fi

echo "[setup] done. Start API: (cd backend && npm run dev). UI: (cd frontend && npm run dev)."
