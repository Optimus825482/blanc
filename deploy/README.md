# Yayın ve yedek (plan 0.6)

Yapı: `compose.yml` üç hizmet çalıştırır: **app** (Next.js, `platform/Dockerfile`), **db** (PostgreSQL 16) ve **caddy** (HTTPS, otomatik sertifika). Dışarıya yalnızca 80 ve 443 açılır.

## İlk kurulum (VPS, Ubuntu varsayımı)

1. Docker ve Compose kurun (`docker compose version` çalışmalı).
2. Depoyu alın: `git clone <depo-adresi> /opt/beyza` (uzak depo henüz bağlı değil; sahibi bilgisi bekleniyor).
3. Ortam dosyasını hazırlayın:
   ```bash
   cd /opt/beyza
   cp .env.example .env
   ```
   `.env` içinde `SITE_DOMAIN`, `SITE_URL`, `PGPASSWORD`, `ADMIN_PASSWORD` (en az 16 karakter) ve `SESSION_SECRET` (en az 32 karakter; `openssl rand -hex 32`) değerlerini doldurun.
4. Alan adının A kaydı sunucu IP'sine işaret ettiğinden emin olun (Caddy sertifika için buna ihtiyaç duyar).
5. Başlatın ve tohum verisini yükleyin:
   ```bash
   docker compose up -d --build
   docker compose --profile tools run --rm migrate
   ```
6. `https://<alan-adınız>` adresinin açıldığını ve `/admin` girişinin çalıştığını kontrol edin.

Şema ilk kez boş veri klasöründe `platform/db/schema.sql` ile otomatik uygulanır. Sonraki şema değişikliklerinde şemayı `migrate` hizmeti üzerinden tekrar çalıştırmak yeterlidir (dosya idempotenttir).

## Güncelleme

```bash
cd /opt/beyza
git pull --ff-only
docker compose up -d --build
```

## Yedek

`deploy/yedek.sh` veritabanını `yedekler/` klasörüne sıkıştırılmış olarak alır ve 14 günden eski yedekleri siler. Günlük cron:

```bash
crontab -e
# her gün 03:00
0 3 * * * /opt/beyza/deploy/yedek.sh >> /var/log/beyza-yedek.log 2>&1
```

Geri yükleme denemesi (haftalık önerilir; önce test bir veritabanında):

```bash
gunzip -c yedekler/beyza-YYYYMMDD-HHMMSS.sql.gz | docker compose exec -T db psql -U "$PGUSER" -d "$PGDATABASE"
```

Yedekleri sunucu dışına da kopyalayın (ör. başka bir depolama alanına); tek sunucuda yedek, arıza riskini tek başına çözmez.

## Notlar

- Caddy, istemci adresini `X-Forwarded-For` sonuna ekler; uygulama IP sınırlarında bu en sağdaki adresi okur. Ek bir proxy eklerseniz bu sıra değişir.
- `docker compose` ve `deploy/yedek.sh` bu depoda yerelde çalıştırılmadı (geliştirme makinesinde Docker yok). Sunucuda ilk kurulumda doğrulanmalı.
- Sahip girdileri: VPS, alan adı, `SITE_DOMAIN`, uzak depo adresi.
