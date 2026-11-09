#!/usr/bin/env bash
# Günlük veritabanı yedeği (plan 0.6): pg_dump → gzip; 14 günden eski yedekler silinir.
# Kullanım (sunucuda, proje kökünden): ./deploy/yedek.sh   — cron için bkz. deploy/README.md
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -f .env ]; then set -a; . ./.env; set +a; fi
KLASOR="${YEDEK_KLASORU:-./yedekler}"
ZAMAN="$(date +%Y%m%d-%H%M%S)"
DOSYA="$KLASOR/beyza-$ZAMAN.sql.gz"
mkdir -p "$KLASOR"

docker compose exec -T db pg_dump -U "${PGUSER:-beyza}" -d "${PGDATABASE:-beyza}" --no-owner --clean --if-exists | gzip > "$DOSYA"

# Boş ya da yarım yedeği kabul etme.
if [ ! -s "$DOSYA" ]; then echo "Yedek boş: $DOSYA" >&2; exit 1; fi

# 14 günden eski yedekleri döndür.
find "$KLASOR" -name 'beyza-*.sql.gz' -mtime +14 -delete
echo "Yedek alındı: $DOSYA"
