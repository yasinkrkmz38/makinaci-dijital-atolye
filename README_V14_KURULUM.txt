DİJİTAL MAKİNACI — V14 AKILLI ATÖLYE
=====================================

V14, V13 veritabanını silmeden yükseltme yapar. Uygulama başlarken eksik tabloları otomatik oluşturur.

V14 ANA ÖZELLİKLER
------------------
• 0–100 dinamik Makine Sağlık Skoru
• Her makine için QR varlık etiketi
• QR okutulduğunda giriş sonrası doğrudan ilgili makine dosyasının açılması
• Ayrı İş Emirleri modülü: açık / işlemde / bekliyor / tamamlandı
• Sorumlu, termin, öncelik, parça, maliyet ve duruş süresi takibi
• Makine ölçüm defteri: sıcaklık, basınç, akım, gerilim, titreşim, rpm
• Son 24 ölçümden otomatik SVG trend grafikleri
• Makineye fotoğraf, PDF, DOC/DOCX ve TXT ekleme
• Dosyalar PostgreSQL BYTEA alanında tutulur; Render yeniden deploy olduğunda kaybolmaz
• Canlı Bildirim Merkezi: geciken/yaklaşan bakım, yüksek-kritik arıza, düşük stok, iş emri
• Dashboard: ortalama makine sağlığı + açık iş emri KPI'ları
• Geliştirilmiş mobil görünüm
• Eski tarayıcı önbelleği sorunu için V14 cache-busting
• Kullanıcı izolasyonu: her kayıt sahibinin user_id'sine göre doğrulanır

MAKİNE SAĞLIK SKORU
-------------------
Skor mevcut saha verilerinden dinamik hesaplanır. Makine durumu, açık arıza sayısı, kritik arızalar,
geciken/yaklaşan bakımlar, son 90 gündeki arıza yoğunluğu ve son bakım tarihi skoru etkiler.
Bu skor bir kestirimci bakım göstergesidir; üretici limitleri veya mühendislik değerlendirmesinin yerine geçmez.

GITHUB / RENDER GÜNCELLEME
--------------------------
1) Bu paketin İÇİNDEKİ dosyaları GitHub reposunun köküne yükle.
2) Eski public/index.html, public/style.css, public/app.js, server.js ve package.json dosyalarının üzerine yaz.
3) .npmrc dosyasını da yükle. Bu dosya eski package-lock.json'ın yeni bağımlılıkları engellemesini önler.
4) Render Build Command: npm install
5) Render Start Command: npm start
6) Commit sonrası Render deploy logunda "Dijital Makinacı V14" satırını kontrol et.
7) /api/health adresi {"ok":true,"version":"14.0.0"} döndürmelidir.

GEREKLİ ENV DEĞİŞKENLERİ
------------------------
DATABASE_URL=Render PostgreSQL bağlantısı
JWT_SECRET=uzun ve rastgele gizli anahtar
NODE_ENV=production
ADMIN_EMAIL=admin e-posta adresi (isteğe bağlı)
ADMIN_PASSWORD=admin ilk şifresi (isteğe bağlı)
ADMIN_NAME=admin adı (isteğe bağlı)

DOSYA YÜKLEME
-------------
• Tek dosya üst sınırı: 5 MB
• İzin verilenler: JPG, PNG, WEBP, PDF, TXT, DOC, DOCX
• Dosyalar PostgreSQL'e kaydedilir. Çok yüksek dosya hacminde ileride S3/Cloudinary benzeri obje depolamaya geçmek daha uygundur.

YENİ NPM BAĞIMLILIKLARI
-----------------------
• multer — güvenli multipart dosya yükleme akışı
• qrcode — makine QR etiketi üretimi

NOT
---
Canlı PostgreSQL hesabına bu çalışma ortamından bağlanılmadığı için gerçek üretim DB'sine uçtan uca deploy testi yapılmadı.
server.js ve public/app.js Node sözdizimi, HTML yapısı, statik DOM ID referansları ve ZIP bütünlüğü paketleme öncesi kontrol edilmiştir.
