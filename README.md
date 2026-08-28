# Dijital Makinacı V17.3.3

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
- `ADMIN_EMAIL`: Var olan hesabı platform yöneticisine yükseltir. Eşleşen hesap yoksa yeni yönetici oluşturmak için `ADMIN_PASSWORD` da gereklidir; `ADMIN_NAME` oluşturulan hesabın adıdır.
- `PUBLIC_BASE_URL`: Public site adresi
- `RESEND_API_KEY`, `MAIL_FROM`: E-posta doğrulama ve şifre sıfırlama gönderimi
- `REQUIRE_EMAIL_VERIFICATION`: `true` yapılırsa doğrulanmamış hesapları yalnızca güvenlik ekranıyla sınırlar; varsayılan `false`, yani doğrulama isteğe bağlıdır
- `ADMIN_MFA_REQUIRED`: Platform yöneticilerinde MFA'yı zorunlu tutar; varsayılan `true`
- `STORAGE_*`: S3 uyumlu object storage endpoint, bucket ve erişim bilgileri
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`: PWA push bildirim anahtarları

Uygulama sürümünün tek kaynağı `package.json` dosyasıdır. Sürüm değişikliğinden sonra `npm run version:sync` çalıştırılır; `APP_VERSION` ortam değişkeni kullanılmaz.

Gerçek anahtarları repoya eklemeyin.

## Kontroller

- `npm test`: sözdizimi, canonical dosya, CSP, auth/oturum güvenliği, firma rol sözleşmesi, migration, stok/bakım davranışı ve responsive UI kontrolleri
- `npm run version:sync`: statik asset ve PWA sürüm referanslarını `package.json` ile eşitler
- `npm run migrate:attachments`: eski BYTEA eklerini yapılandırılmış object storage'a taşır
- `npm run smoke`: dağıtılmış sitenin health, public site, uygulama, PWA ve auth smoke kontrolü

## Canonical yapı

- `index.html`, `site.js`, `site.css`: indekslenebilir public site
- `seo-content.js`, `seo-render.js`: sürümlü teknik içerik ve sunucu tarafı SEO sayfa üretimi
- `app.html`, `app.js`, `style.css`, `mobile.css`: CMMS uygulaması
- `admin.html`, `admin.js`, `admin.css`: platform yönetimi
- `service-worker.js`, `manifest.webmanifest`, `pwa.js`: PWA katmanı
- `server.js`: Express API ve route'lar
- `db/migrate.js`, `migrations/*.sql`: sıralı PostgreSQL migration sistemi
- `domain.js`, `tests/*.test.js`: test edilen kritik iş kuralları
- `storage.js`: S3 uyumlu ek dosya depolama katmanı
- `start.js`: güvenli production başlangıcı

Eski `v1621-*`, `appstore-v17.css`, `public/` ve `v71/` kopyaları kaldırılmıştır. Eski asset URL'leri yalnızca geçiş uyumluluğu için canonical URL'lere 308 yönlendirmesi döndürür.

## Production route'ları

| URL | Kaynak | Amaç |
| --- | --- | --- |
| `/` | `index.html` | Public site |
| `/app` | `app.html` | CMMS uygulaması |
| `/hesaplamalar`, `/hesaplamalar/:slug` | `seo-render.js` | SSR hesaplama dizini ve özgün araç sayfaları |
| `/teknik`, `/teknik/:slug` | `seo-render.js` | SSR teknik kütüphane ve özgün makaleler |
| `/admin` | `admin.html` | Platform yönetimi |
| `/api/health` | JSON | DB, e-posta, object storage, push ve migration durumu |
| `/sitemap.xml`, `/robots.txt` | Dinamik/statik | Arama motoru keşfi |

## Veri güvenliği

- Production, güçlü `JWT_SECRET` olmadan açılmaz.
- Şema güncellemeleri `schema_migrations` tablosunda kaydedilir.
- Makine ve bakım silme işlemleri arşivleme yapar ve geri alınabilir.
- Stok miktarı yalnızca giriş, çıkış veya sayım düzeltmesi hareketiyle değişir.
- Firma kapsamındaki API sorguları etkin `company_id` ile sınırlandırılır.
- Service worker, `/api/*` yanıtlarını cache'lemez.
- Yönetici hesapları MFA olmadan platform yönetim API'lerini kullanamaz.
- Şifre değişikliği tüm eski cihaz oturumlarını iptal eder; kullanıcı aktif cihazları hesabından yönetebilir.
- Dosyaların yeni içerikleri PostgreSQL BYTEA alanına yazılmaz; veritabanında yalnızca object storage metadata'sı tutulur.

## Dağıtım

Render başlangıç komutu `npm start` olmalıdır. Test edilen commit ana dala gönderildikten sonra `/api/health`, `npm run smoke` ve gerçek mobil/masaüstü tarayıcı akışları doğrulanmalıdır.

Genişletme öncesi güvenli referans dalı: `backup/pre-platform-expansion-2026-08-23`.
