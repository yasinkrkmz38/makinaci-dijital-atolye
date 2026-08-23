# Dijital Makinacı V17.2.0

Dijital Makinacı; makine parkı, bakım, arıza, iş emri, ölçüm ve yedek parça süreçlerini tek çalışma alanında yöneten çok firmalı bir CMMS uygulamasıdır.

Kalıcı proje bağlamı için `PROJECT.md`, sürüm geçmişi için `CHANGELOG.md` dosyasına bakın.

## Gereksinimler

- Node.js 20 veya üzeri
- PostgreSQL

## Yerel kurulum

1. `npm ci`
2. `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli değerleri doldurun.
3. Ortam değişkenlerini çalışma kabuğunuza yükleyin.
4. `npm start`
5. Public site için `http://localhost:10000/`, uygulama için `http://localhost:10000/app` adresini açın.

`npm start`, veritabanı bağlantısını her ortamda; güçlü JWT anahtarını ise production ortamında zorunlu tutar. Migration dosyaları başlangıçta sıra ile ve transaction içinde uygulanır.

## Ortam değişkenleri

- `DATABASE_URL`: PostgreSQL bağlantı adresi
- `JWT_SECRET`: Production'da en az 32 karakterlik rastgele anahtar
- `NODE_ENV`: Production'da `production`
- `PORT`: HTTP portu; varsayılan `10000`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`: İlk platform yöneticisi
- `PUBLIC_BASE_URL`: Public site adresi
- `RESEND_API_KEY`, `MAIL_FROM`: E-posta doğrulama ve şifre sıfırlama gönderimi
- `REQUIRE_EMAIL_VERIFICATION`: Yeni hesaplarda doğrulamayı zorunlu tutar; varsayılan `true`
- `ADMIN_MFA_REQUIRED`: Platform yöneticilerinde MFA'yı zorunlu tutar; varsayılan `true`
- `APP_VERSION`: Varsayılan `17.2.0`

Gerçek anahtarları repoya eklemeyin.

## Kontroller

- `npm test`: sözdizimi, canonical dosya, CSP, auth güvenliği, migration, kritik stok/arşiv ve responsive UI kontrolleri
- `npm run smoke`: dağıtılmış sitenin health, public site, uygulama, PWA ve auth smoke kontrolü

## Canonical yapı

- `index.html`, `site.js`, `site.css`: indekslenebilir public site
- `app.html`, `app.js`, `style.css`, `mobile.css`: CMMS uygulaması
- `admin.html`, `admin.js`, `admin.css`: platform yönetimi
- `service-worker.js`, `manifest.webmanifest`, `pwa.js`: PWA katmanı
- `server.js`: Express API ve route'lar
- `db/migrate.js`, `migrations/*.sql`: sıralı PostgreSQL migration sistemi
- `start.js`: güvenli production başlangıcı

Eski `v1621-*`, `appstore-v17.css`, `public/` ve `v71/` kopyaları kaldırılmıştır. Eski asset URL'leri yalnızca geçiş uyumluluğu için canonical URL'lere 308 yönlendirmesi döndürür.

## Production route'ları

| URL | Kaynak | Amaç |
| --- | --- | --- |
| `/` | `index.html` | Public site |
| `/app` | `app.html` | CMMS uygulaması |
| `/hesaplamalar/:slug` | `calculator.html` | İndekslenebilir hesaplama sayfaları |
| `/teknik/:slug` | `article.html` | İndekslenebilir teknik makaleler |
| `/admin` | `admin.html` | Platform yönetimi |
| `/api/health` | JSON | DB, e-posta ve depolama durumu |
| `/sitemap.xml`, `/robots.txt` | Dinamik/statik | Arama motoru keşfi |

## Veri güvenliği

- Production, güçlü `JWT_SECRET` olmadan açılmaz.
- Şema güncellemeleri `schema_migrations` tablosunda kaydedilir.
- Makine ve bakım silme işlemleri arşivleme yapar ve geri alınabilir.
- Stok miktarı yalnızca giriş, çıkış veya sayım düzeltmesi hareketiyle değişir.
- Firma kapsamındaki API sorguları etkin `company_id` ile sınırlandırılır.
- Service worker, `/api/*` yanıtlarını cache'lemez.

## Dağıtım

Render başlangıç komutu `npm start` olmalıdır. Test edilen commit ana dala gönderildikten sonra `/api/health`, `npm run smoke` ve gerçek mobil/masaüstü tarayıcı akışları doğrulanmalıdır.

Genişletme öncesi güvenli referans dalı: `backup/pre-platform-expansion-2026-08-23`.
