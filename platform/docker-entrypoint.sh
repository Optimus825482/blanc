#!/bin/sh
# Konteyner açılışı: şema + tohum (idempotent) ardından Next sunucusu.
# SEED_ON_START=0 verilirse tohum adımı atlanır.
set -e
if [ "${SEED_ON_START:-1}" = "1" ]; then
  n=0
  until node db/seed.mjs; do
    n=$((n + 1))
    if [ "$n" -ge 15 ]; then echo "Şema/tohum 15 denemede uygulanamadı; çıkılıyor." >&2; exit 1; fi
    echo "Veritabanı hazır değil, yeniden denenecek ($n/15)…"
    sleep 4
  done
fi
exec node server.js
