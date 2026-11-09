# Coolify ile yayın

Depo: https://github.com/Optimus825482/blanc — compose dosyası: `docker-compose.coolify.yml` (kökte).
Tek Coolify kaynağı içinde üç hizmet çalışır: **app** (Next.js), **db** (PostgreSQL 16), **backup** (günlük pg_dump).

## Kurulum (yaklaşık 10 dakika)

1. Coolify → Projects → projeniz → **+ New Resource** → **Docker Compose** → kaynak olarak GitHub deposunu seçin (`Optimus825482/blanc`, dal `main`).
2. **Docker Compose Location** alanına `/docker-compose.coolify.yml` yazın; Coolify dosyayı okuyup hizmetleri listeler.
3. **Domains**: `app` hizmetine alan adınızı yazın (ör. `https://beyzablanc.com`). HTTPS sertifikasını Coolify kendisi alır. DNS A kaydı Coolify sunucusunun IP'sine işaret etmeli.
4. **Environment Variables** sekmesinde Coolify'ın ürettiği değerler görünür:
   - `SERVICE_PASSWORD_DB` → veritabanı parolası (otomatik)
   - `SERVICE_PASSWORD_ADMIN` → **panel giriş parolası** (otomatik; buradan okuyup saklayın, isterseniz 16+ karakterli kendi parolanızla değiştirin)
   - `SERVICE_BASE64_64_SESSION` → oturum imza anahtarı (otomatik)
   - `SERVICE_URL_APP` → site adresi; `SITE_URL` buna bağlıdır (sitemap, Open Graph ve WhatsApp bağlantıları için)
   İsteğe bağlı: `PGUSER`, `PGDATABASE` (varsayılan `beyza`).
5. **Deploy**. İlk açılışta `app` konteyneri `db/schema.sql` + tohum verisini (`db/seed.mjs`) uygular; her yeniden dağıtımda aynı adım tekrarlanır ama var olan kayıtlara dokunmaz (idempotent).
6. `https://<alan-adı>/admin` → `SERVICE_PASSWORD_ADMIN` ile girin → **Ayarlar**'da WhatsApp numarası ve harita bağlantısı, **Arama ve analitik**'te GA4 ve doğrulama kodları.

## Hacimler (veri dağıtımda silinmez)

| Hacim | İçerik |
|---|---|
| `pgdata` | Tüm veritabanı: içerik, katalog, teklifler, yorumlar, ziyaret ölçümü ve **panelden yüklenen bütün görseller** (`bb_media`) |
| `uploads` | `/app/public/uploads` — dosya olarak eklenecek görseller; `https://<alan-adı>/uploads/<dosya>` ile erişilir |
| `backups` | Günlük `beyza-YYYY-MM-DD-HHMM.dump` yedekleri (14 gün) |

Depodaki `platform/public/assets/img` görselleri (Instagram fotoğrafları, stüdyo altlıkları) Docker imajının parçasıdır; onları değiştirmek için depoya commit yeterlidir.

### Görsel yüklemek (uploads hacmi)
Coolify → kaynak → `app` hizmeti → **Terminal**:
```bash
ls /app/public/uploads
```
Dosya kopyalamak için sunucuda: `docker cp foto.webp <app-konteyner-adı>:/app/public/uploads/`. Panelden yüklenen görseller için bu gerekmez; onlar veritabanına yazılır.

## Yedekten dönme
```bash
docker exec -i <db-konteyner-adı> pg_restore -U beyza -d beyza --clean --if-exists /backups/beyza-2026-11-09-0300.dump
```
(`backups` hacmi `backup` konteynerine bağlıdır; dosyayı önce `docker cp` ile alın ya da `backup` konteynerinden `pg_restore` çalıştırın: `docker exec -it <backup-konteyner> pg_restore -h db -U beyza -d beyza --clean --if-exists /backups/<dosya>`.)

## Güncelleme
`main` dalına push → Coolify'da **Redeploy** (ya da GitHub webhook ile otomatik). İmaj yeniden derlenir, hacimler korunur.

## Notlar
- Uygulama ters vekil (Traefik) arkasındadır; istemci adresi `X-Forwarded-For` başlığının son hop'undan okunur, hız sınırları buna göre çalışır.
- `SEED_ON_START=0` verilirse açılışta tohum adımı atlanır (çok hızlı yeniden başlatma istenirse).
- `compose.yml` + `Caddyfile` ise Coolify olmadan düz bir VPS'e kurulum içindir (bkz. `deploy/README.md`).
