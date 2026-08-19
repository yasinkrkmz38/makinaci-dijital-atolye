DİJİTAL MAKİNACI V13 — PRO ATÖLYE
=================================

Bu sürüm, V12 kullanıcı + admin altyapısı korunarak kapsamlı şekilde büyütülmüştür.

V13 ANA YENİLİKLER
------------------
• Baştan düzenlenmiş koyu/endüstriyel, responsive arayüz
• Telefon için sabit ve büyük dokunma alanlı alt navigasyon
• Gelişmiş dashboard:
  - Toplam makine
  - Açık/planlı bakım
  - Geciken bakım
  - 30 gün içinde yaklaşan bakım
  - Kritik arıza
  - Düşük stok
  - Aylık bakım maliyeti
• Detaylı makine varlık kartı:
  - Marka, model, kategori, konum, durum
  - Güç, üretim yılı
  - Son / sonraki bakım
  - Yağ, rulman, kayış, motor-redüktör bilgileri
  - Makineye özel bakım ve arıza geçmişi
• Bakım yönetimi:
  - Bakım tipi, tarih, periyot, sayaç saati
  - Öncelik, teknisyen, maliyet, süre, kullanılan parçalar
  - Açık / tamamlandı durumu
• Arıza Teşhis Merkezi:
  - Mekanik
  - Elektrik
  - Hidrolik
  - Pnömatik
  - Soğutma / yağlama
  - CNC / servo
  - Redüktör
  - 28 teşhis akışı
  - Olası nedenler ve kontrol sırası
  - Ölçüm verileri: sıcaklık, basınç, akım, gerilim, titreşim, devir
  - Önem seviyesi, duruş süresi
  - Kök neden ve yapılan işlem kaydı
• Yedek parça / stok modülü:
  - Parça kodu, kategori, miktar, minimum stok
  - Birim, raf/konum, tedarikçi, maliyet, not
  - Düşük stok uyarısı
• 14 teknik hesaplama aracı:
  - Torna devri/ilerleme
  - Freze ilerlemesi
  - Delme devri
  - Kılavuz ön delik
  - Dişli oranı
  - Kasnak oranı
  - Limit ölçü/tolerans
  - mm-inch
  - Hidrolik kuvvet
  - Silindir hızı
  - Motor torku
  - İşleme süresi
  - Koniklik
  - Çevresel hız
• 30 maddelik teknik kütüphane
• Global arama: makine, arıza, araç ve teknik içerik
• Genişletilmiş admin paneli ve kullanıcı arama
• Kullanıcı verileri birbirinden ayrıdır.
• Başka kullanıcıya ait makineye kayıt bağlama engellenir.

GEREKSİNİMLER
--------------
• Node.js 20 veya üzeri
• PostgreSQL veritabanı

KURULUM
-------
1. Bu klasörde terminal / PowerShell aç.
2. Paketleri kur:
   npm install

3. Ortam değişkenlerini tanımla:
   DATABASE_URL=postgresql://KULLANICI:SIFRE@SUNUCU:5432/VERITABANI
   JWT_SECRET=uzun-ve-rastgele-bir-gizli-anahtar
   ADMIN_EMAIL=admin@ornek.com
   ADMIN_PASSWORD=guclu-admin-sifresi
   ADMIN_NAME=Yönetici

4. Başlat:
   npm start

5. Tarayıcıdan aç:
   http://localhost:3000

VERİTABANI / V12'DEN GEÇİŞ
---------------------------
V13, V12 tablolarını koruyacak şekilde hazırlanmıştır. Uygulama açılışında yeni sütunlar
ADD COLUMN IF NOT EXISTS yaklaşımıyla eklenir ve yeni parts tablosu oluşturulur.
Mevcut kullanıcı/makine/bakım/arıza kayıtlarını silmek için bir işlem yapılmaz.

YAYINA ALMADAN ÖNCE
-------------------
• JWT_SECRET mutlaka güçlü ve benzersiz olsun.
• ADMIN_PASSWORD güçlü olsun.
• HTTPS kullan.
• PostgreSQL yedeği al.
• DATABASE_URL ve diğer gizli değerleri GitHub'a yükleme; .env / hosting secrets kullan.
• Üretimde e-posta doğrulama, parola sıfırlama, loglama ve düzenli DB yedeği önerilir.

NOT
---
Arıza Teşhis Merkezi yardımcı kontrol akışıdır; üretici servis dokümanı, LOTO/enerji izolasyonu,
yetkili personel prosedürleri ve iş güvenliği kuralları yerine geçmez.
