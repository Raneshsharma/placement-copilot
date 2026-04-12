#!/usr/bin/env bash
# ============================================================
# Build Script for Placement Copilot
# ============================================================
# Builds all Docker images for the monorepo.
#
# Usage:
#   ./scripts/build.sh [--no-cache] [--pull]
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

NOCACHE=""
PULL=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --no-cache)
            NOCACHE="--no-cache"
            shift
            ;;
        --pull)
            PULL="--pull"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

cd "$PROJECT_ROOT"

echo "Building Placement Copilot Docker images..."

echo ""
echo "[1/3] Building API (NestJS)..."
docker build $NOCACHE $PULL -t placement-copilot/api:latest -f apps/api/Dockerfile .

echo ""
echo "[2/3] Building Web (Next.js)..."
docker build $NOCACHE $PULL -t placement-copilot/web:latest -f apps/web/Dockerfile .

echo ""
echo "[3/3] Building AI Service (FastAPI)..."
docker build $NOCACHE $PULL -t placement-copilot/ai:latest -f apps/ai/Dockerfile .

echo ""
echo "All images built successfully!"
echo "  - placement-copilot/api:latest"
echo "  - placement-copilot/web:latest"
echo "  - placement-copilot/ai:latest"
