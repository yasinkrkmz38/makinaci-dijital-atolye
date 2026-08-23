# Dijital Makinacı V17.2.0

Makine parkı, bakım, arıza, iş emri, ölçüm ve yedek parça süreçlerini tek çalışma alanında yöneten çok firmalı bir CMMS uygulamasıdır.

Kalıcı proje bağlamı için `PROJECT.md`, yapılan değişiklikler için `CHANGELOG.md` dosyasına bakın.

## Gereksinimler

- Node.js 20 veya üzeri
- PostgreSQL

## Yerel kurulum

1. Bağımlılıkları kurun: `npm install`
2. `.env.example` dosyasını `.env` olarak kopyalayıp gerekli değerleri doldurun.
3. Ortam değişkenlerini kabuğunuza yükleyin.
4. Uygulamayı başlatın: `npm start`
5. Tarayıcıda `http://localhost:10000` adresini açın.

`npm start`, veritabanı bağlantısını her ortamda; güçlü JWT anahtarını ise üretim ortamında zorunlu tutar.

## Ortam değişkenleri

- `DATABASE_URL`: PostgreSQL bağlantı adresi (zorunlu)
- `JWT_SECRET`: Üretimde en az 32 karakterlik rastgele anahtar (zorunlu)
- `NODE_ENV`: Üretimde `production`
- `PORT`: HTTP portu; varsayılan `10000`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`: İlk platform yöneticisi
- `PUBLIC_BASE_URL`: Şifre yenileme bağlantılarının site adresi
- `RESEND_API_KEY`, `PASSWORD_RESET_FROM`: Şifre yenileme e-postaları
- `APP_VERSION`: Varsayılan `17.2.0`

Gerçek anahtarları repoya eklemeyin.

## Kontroller

`npm test` komutu sunucu ve tarayıcı JavaScript dosyalarının sözdizimini, gerekli üretim dosyalarını ve sürüm tutarlılığını kontrol eder.

## Dağıtım

Render başlangıç komutu `npm start` olmalıdır. Sağlık kontrolü `/api/health`, yönetim paneli `/admin` adresindedir.

## Ana yapı

- `server.js`: Express API, PostgreSQL şeması ve yetkilendirme
- `v1621-index.html`, `v1621-app.js`, `v1621-style.css`: Aktif kullanıcı arayüzü
- `admin.html`, `admin.js`, `admin.css`: Aktif yönetim arayüzü
- `v1621-service-worker.js`, `v1621-manifest.webmanifest`: PWA dosyaları
- `start.js`: Ortam doğrulaması ve güvenli üretim başlangıcı
- `render-start.js`: Eski Render komutları için `start.js` uyumluluk girişi

## Production routing

| URL | Fiziksel dosya | Amaç |
| --- | --- | --- |
| `/`, `/index.html` | `v1621-index.html` | Ana uygulama |
| `/v1621-app.js` | `v1621-app.js` | Uygulama davranışı |
| `/v1621-style.css` | `v1621-style.css` | Temel arayüz |
| `/appstore-v17.css` | `appstore-v17.css` | Mobil arayüz iyileştirmeleri |
| `/manifest.webmanifest` | `v1621-manifest.webmanifest` | PWA manifesti |
| `/service-worker.js` | `v1621-service-worker.js` | Offline app shell |
| `/admin` | `admin.html` | Platform yönetimi |
| `/admin.js`, `/admin.css` | `admin.js`, `admin.css` | Yönetim paneli kaynakları |

`public/` dizini fallback statik içeriktir; ana production UI değildir.

## PostgreSQL ve veri güvenliği

Şema ilk açılışta `CREATE TABLE IF NOT EXISTS` ve `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` ile geriye uyumlu hazırlanır. Production veritabanı sıfırlanmaz.

- Makine ve bakım silme işlemleri hard delete yerine arşivleme yapar.
- Arşiv kayıtları ilişkili geçmişi korur ve geri yüklenebilir.
- Stok miktarı yalnız `/api/parts/:id/movement` transaction endpointiyle değişir.
- Firma kapsamındaki API sorguları aktif `company_id` ile sınırlandırılır.

## PWA

Service worker yalnız app shell/statik dosya cache'i ve offline navigation fallback sağlar. `/api/*` isteklerini intercept veya cache etmez; JavaScript/CSS içeriğini değiştirmez. Yeni sürüm etkinleşirken yalnız `dm-*` uygulama cache'leri temizlenir.

## Şifre yenileme

`RESEND_API_KEY`, `PASSWORD_RESET_FROM` ve `PUBLIC_BASE_URL` ayarlandığında şifre yenileme e-postaları gönderilir. Tokenların yalnız SHA-256 özeti veritabanında, 30 dakika süreyle ve tek kullanımlık tutulur.

## Backup ve recovery

Stabilizasyon öncesi referans dalı: `backup/pre-codex-recovery-2026-08-23`.

Bir geri dönüş gerektiğinde önce ilgili commit/dal diff'i incelenmeli; production veritabanında DROP, recreate veya toplu DELETE uygulanmamalıdır.

## Deployment kontrol listesi

1. `npm ci`
2. `npm test`
3. Render environment değişkenlerini doğrula.
4. `main` dalına test edilmiş commitleri gönder.
5. `/api/health` sürümünü kontrol et.
6. `npm run smoke` ile production statik/auth smoke testini çalıştır.
7. Masaüstü ve mobil giriş/navigasyon kontrolünü tamamla.
