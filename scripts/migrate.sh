#!/usr/bin/env bash
# ============================================================
# Database Migration Script for Placement Copilot
# ============================================================
# Run migrations for the NestJS API service.
#
# Usage:
#   ./scripts/migrate.sh [command]
#
# Commands:
#   up         Run pending migrations (default)
#   deploy     Deploy all migrations (no dev checks)
#   status     Show migration status
#   create     Create a new migration
#   reset      Reset database (DESTRUCTIVE - deletes all data)
#   seed       Seed the database with initial data
# ============================================================

set -e

# Load environment variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if [ -f "$PROJECT_ROOT/.env" ]; then
    set -a
    source "$PROJECT_ROOT/.env"
    set +a
else
    echo "WARNING: .env file not found. Using defaults."
fi

# Override for Docker environment
if [ "${IN_DOCKER:-false}" = "true" ]; then
    DATABASE_URL="${DATABASE_URL:-postgresql://postgres:${POSTGRES_PASSWORD:-postgres}@postgres:5432/placement_copilot}"
    DIRECT_URL="${DIRECT_URL:-postgresql://postgres:${POSTGRES_PASSWORD:-postgres}@postgres:5432/placement_copilot}"
fi

API_DIR="$PROJECT_ROOT/apps/api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

cd "$API_DIR"

COMMAND="${1:-up}"

case "$COMMAND" in
    up)
        log_info "Running database migrations..."
        npx prisma migrate dev --name init
        log_info "Generating Prisma client..."
        npx prisma generate
        log_info "Migrations complete."
        ;;

    deploy)
        log_info "Deploying migrations (production mode)..."
        npx prisma migrate deploy
        log_info "Generating Prisma client..."
        npx prisma generate
        log_info "Deploy complete."
        ;;

    status)
        log_info "Checking migration status..."
        npx prisma migrate status
        ;;

    create)
        MIGRATION_NAME="${2:-update}"
        log_info "Creating migration: $MIGRATION_NAME"
        npx prisma migrate dev --name "$MIGRATION_NAME"
        ;;

    reset)
        log_warn "This will DELETE ALL DATA in the database!"
        read -p "Are you sure? Type 'yes' to confirm: " confirm
        if [ "$confirm" = "yes" ]; then
            log_info "Resetting database..."
            npx prisma migrate reset --force
            log_info "Database reset complete."
        else
            log_info "Aborted."
        fi
        ;;

    seed)
        log_info "Seeding database..."
        npx prisma db seed
        ;;

    dev)
        log_info "Running migrations in development mode..."
        npx prisma migrate dev
        npx prisma generate
        log_info "Development migrations complete."
        ;;

    *)
        echo "Usage: $0 {up|deploy|status|create|reset|seed|dev}"
        echo ""
        echo "Commands:"
        echo "  up       Run pending migrations (default)"
        echo "  deploy   Deploy all migrations (production)"
        echo "  status   Show migration status"
        echo "  create   Create a new migration"
        echo "  reset    Reset database (deletes all data)"
        echo "  seed     Seed the database"
        echo "  dev      Run dev migrations"
        exit 1
        ;;
esac
