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
- `render-start.js`: Render ağ ve timeout ayarları
