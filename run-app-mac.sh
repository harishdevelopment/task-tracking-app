#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is not installed or not available in PATH."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

if [ "${1:-}" = "test" ]; then
  echo "Preparing Playwright tests..."
  npm install
  echo "Installing Playwright Chromium browser (skipped if already present)..."
  npx playwright install chromium
  echo "Running E2E tests..."
  npm run test:e2e
else
  echo "Starting PlanTrack (Vite + Express)..."
  npm run dev
fi
