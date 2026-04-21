#!/usr/bin/env bash
# scripts/recreate-db.sh
#
# Drops and recreates the PostgreSQL database, then applies all EF Core migrations.
# Run from the repository root:
#   bash scripts/recreate-db.sh
#
# Prerequisites: psql and dotnet CLI must be available in PATH.

set -euo pipefail

# ── Load variables from .env if present ──────────────────────────────────────
if [ -f ".env" ]; then
  echo "[info] Loading variables from .env"
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-engineeringwork}"

# ── Safety prompt ─────────────────────────────────────────────────────────────
echo ""
echo "  WARNING: This will PERMANENTLY DROP the database '${DB_NAME}'"
echo "           on ${DB_HOST}:${DB_PORT} and recreate it from scratch."
echo ""
read -rp "  Type YES to confirm: " confirm
if [ "${confirm}" != "YES" ]; then
  echo "Aborted."
  exit 0
fi

export PGPASSWORD="${DB_PASSWORD}"

# ── Drop ──────────────────────────────────────────────────────────────────────
echo "[1/3] Dropping database '${DB_NAME}'..."
psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres \
  -c "DROP DATABASE IF EXISTS \"${DB_NAME}\";"

# ── Create ────────────────────────────────────────────────────────────────────
echo "[2/3] Creating database '${DB_NAME}'..."
psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d postgres \
  -c "CREATE DATABASE \"${DB_NAME}\";"

# ── Migrate ───────────────────────────────────────────────────────────────────
echo "[3/3] Applying EF Core migrations..."
CONNECTION="Host=${DB_HOST};Port=${DB_PORT};Database=${DB_NAME};Username=${DB_USER};Password=${DB_PASSWORD}"
(
  cd backend
  dotnet ef database update \
    --connection "${CONNECTION}"
)

echo ""
echo "Done! Database '${DB_NAME}' has been recreated and all migrations applied."
