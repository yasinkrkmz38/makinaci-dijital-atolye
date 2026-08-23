# Dijital Makinacı — Proje Kaydı

## Proje kimliği

- Proje: Dijital Makinacı
- Tür: Çok firmalı CMMS ve dijital atölye uygulaması
- Canlı adres: https://dijitalmakinaci.pro/
- GitHub: https://github.com/yasinkrkmz38/makinaci-dijital-atolye
- Ana dal: `main`
- Uygulama sürümü: `17.2.0`
- Dağıtım: Render
- Çalışma zamanı: Node.js 20+
- Veritabanı: PostgreSQL

## Projenin amacı

Sanayi işletmelerinin makine parkı, bakım, arıza, iş emri, teknik ölçüm, servis raporu ve yedek parça süreçlerini tek bir çalışma alanında yönetmesini sağlamak.

## Temel modüller

- Kullanıcı girişi, kayıt ve şifre yenileme
- Firma ve ekip yönetimi
- Rol tabanlı yetkilendirme
- Makine envanteri ve sağlık skoru
- Planlı bakım yönetimi
- Arıza kaydı ve analitiği
- İş emirleri
- Depo ve stok hareketleri
- Makine ölçümleri
- Dosya ekleri ve QR etiketleri
- Teknik kütüphane ve hesaplama araçları
- Platform yönetim paneli
- PWA ve mobil arayüz

## Aktif üretim dosyaları

- `server.js`: API, veritabanı şeması ve yetkilendirme
- `start.js`: Güvenli üretim başlangıcı
- `render-start.js`: Render ağ ayarları
- `v1621-index.html`: Ana kullanıcı arayüzü
- `v1621-app.js`: Ana kullanıcı uygulaması
- `v1621-style.css`: Ana kullanıcı stilleri
- `v1621-service-worker.js`: PWA önbelleği
- `admin.html`, `admin.js`, `admin.css`: Yönetim paneli

## Üretim ortamı

Render üzerinde en az şu ortam değişkenleri bulunmalıdır:

- `NODE_ENV=production`
- `DATABASE_URL`
- `JWT_SECRET`: En az 32 karakterlik rastgele değer
- `APP_VERSION=17.2.0`

İsteğe bağlı değişkenler `.env.example` dosyasında listelenir. Gerçek anahtarlar hiçbir zaman GitHub'a eklenmemelidir.

## Doğrulama

Her değişiklikten önce veya sonra şu komut çalıştırılmalıdır:

```text
npm test
```

Canlı sağlık kontrolü:

```text
GET https://dijitalmakinaci.pro/api/health
```

## Bilinen teknik borç

- Ana arayüzde çok sayıda HTML içi olay işleyicisi (`onclick`, `oninput`, `onchange`) bulunuyor.
- Bu nedenle katı Content Security Policy geçici olarak etkinleştirilemiyor; diğer Helmet güvenlik başlıkları aktif.
- HTML, CSS ve JavaScript dosyaları büyük ve tek parça; modüllere ayrılmalı.
- Eski sürüm adları taşıyan aktif dosyalar (`v1621-*`) ileride anlamlı adlara taşınmalı.
- Otomatik API, veritabanı ve tarayıcı uçtan uca testleri genişletilmeli.
- Eski sürüm/yedek dosyaları doğrulandıktan sonra arşivlenmeli veya kaldırılmalı.

## Çalışma ilkeleri

- Üretim sırları yalnız Render ortam değişkenlerinde tutulur.
- Değişiklikler önce yerel repo kopyasında yapılır ve `npm test` ile doğrulanır.
- Test edilen değişiklikler açıklayıcı commit mesajıyla `main` dalına gönderilir.
- Render dağıtımından sonra canlı sağlık ve gerekli statik dosyalar doğrulanır.
- Veri kaybına yol açabilecek veritabanı işlemleri ayrıca onaylanır.

## Güncel durum

23 Ağustos 2026 itibarıyla üretim başlangıcı güvenli hale getirildi, repo hijyeni iyileştirildi, giriş/kayıt kontrolleri güçlendirildi ve canlı buton uyumluluğu düzeltildi. Site Render üzerinde çalışıyor.
