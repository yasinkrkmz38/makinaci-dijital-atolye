DİJİTAL MAKİNACI V16 — ADMIN CENTER
====================================

V16, V15 Pro CMMS verilerini koruyarak ayrı bir platform yönetim konsolu ekler.

CANLIYA ALMA
1) Bu paketin içindeki dosyaları GitHub repo köküne yükle.
2) Commit changes yap.
3) Render otomatik deploy tamamlanınca:
   https://dijitalmakinaci.pro/api/health
   adresinde version: "16.0.0" görmelisin.
4) Platform admin hesabıyla giriş yaptıktan sonra:
   https://dijitalmakinaci.pro/admin
   adresini aç.

GEREKLİ RENDER ENVIRONMENT DEĞİŞKENLERİ
- DATABASE_URL       : PostgreSQL bağlantısı
- JWT_SECRET         : güçlü, uzun ve rastgele değer
- ADMIN_EMAIL        : platform admin hesabının e-postası
- ADMIN_PASSWORD     : ilk kurulum/admin hesabı için güçlü şifre
- ADMIN_NAME         : isteğe bağlı admin adı
- NODE_ENV=production

V16 YENİLİKLERİ
- Ayrı /admin yönetim konsolu
- platform_admin yetkisi (firma rollerinden bağımsız)
- Kullanıcı aktif/pasif ve platform admin yönetimi
- Firma, makine, arıza, bakım ve iş emri genel görünümü
- Kritik arıza ve gecikmiş bakım dashboard'u
- Başarılı/başarısız giriş olayları, IP ve istemci kaydı
- Admin işlem denetim logu
- Duyuru merkezi; kullanıcı bildirim merkezine düşer
- Teknik kütüphane içerik editörü; kod değiştirmeden içerik eklenebilir
- Destek talebi sistemi
- Sistem ayarları: kayıt aç/kapat, bakım modu, dosya yükleme, site adı, destek e-postası
- V15 kullanıcı/firma/makine/bakım/arızaları korunur

GÜVENLİK
- /admin sayfasının görünmesi tek başına yetki sağlamaz.
- /api/admin/* rotalarının tamamı sunucuda platform_admin doğrulaması yapar.
- V15'te role='admin' olan mevcut admin kullanıcılar ilk V16 açılışında platform_admin=true olarak taşınır.
- ADMIN_EMAIL ile eşleşen kullanıcı deploy sırasında platform admin olarak tutulur.
- Platform admin kendi hesabını panelden pasifleştiremez veya kendi admin yetkisini kaldıramaz.
- Bakım modu açıkken normal kullanıcıların korumalı API erişimi 503 ile durdurulur; platform admin erişmeye devam eder.

VERİTABANI GEÇİŞİ
İlk çalıştırmada tablolar/kolonlar CREATE TABLE IF NOT EXISTS ve ALTER TABLE ... ADD COLUMN IF NOT EXISTS ile otomatik eklenir.
Mevcut V15 tabloları silinmez.

NOT
Production deploy öncesinde mevcut PostgreSQL veritabanının Render yedeğini almak iyi uygulamadır.
