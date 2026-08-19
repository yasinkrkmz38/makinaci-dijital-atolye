DİJİTAL MAKİNACI V15 PRO CMMS
================================

V15 ana özellikleri:
- Firma bazlı ortak çalışma alanları ve firma değiştirme
- Firma Sahibi / Yönetici / Teknisyen / Operatör / Görüntüleyici yetkileri
- E-posta ile mevcut kullanıcıyı firmaya ekip üyesi ekleme
- Bakım + iş emri aylık takvimi
- Gelişmiş arıza analitiği: duruş, MTTR, tekrar eden arıza, makine/sistem/kök neden dağılımı
- Bakım ve iş emirlerinden profesyonel A4 servis raporu; Yazdır / PDF olarak kaydet
- Firma faaliyet/audit kaydı
- V14: QR, makine sağlık skoru, ölçüm trendleri, fotoğraf/belge, bildirim ve stok özellikleri korunmuştur.

MEVCUT V14'TEN GEÇİŞ
----------------------
Veritabanını silmeyin. V15 açılışta gerekli tablo/kolonları otomatik oluşturur.
Mevcut kullanıcıların eski kayıtları otomatik olarak kendi kişisel firmasına bağlanır.

GITHUB / RENDER
---------------
1) Bu paketteki dosyaları GitHub reposunun KÖKÜNE yükleyin.
2) Eski public/app.js, public/index.html, public/style.css ve server.js dosyalarının üzerine yazın.
3) Commit changes yapın.
4) Render otomatik deploy etmelidir.
5) https://SITENIZ/api/health cevabında version: 15.0.0 görmelisiniz.

GEREKLİ ENV
------------
DATABASE_URL=...
JWT_SECRET=uzun-rastgele-gizli-deger
NODE_ENV=production
ADMIN_EMAIL=... (opsiyonel)
ADMIN_PASSWORD=... (opsiyonel)
ADMIN_NAME=... (opsiyonel)

NOTLAR
------
- Servis raporunda 'Yazdır / PDF olarak kaydet' butonu tarayıcının yazdırma ekranını açar. Chrome/Edge'de hedef olarak 'PDF olarak kaydet' seçilebilir.
- Bir ekip üyesini e-posta ile ekleyebilmek için o kişinin önce Dijital Makinacı hesabı açmış olması gerekir.
- Firma verisi company_id ile ayrılır; bir kullanıcı yalnızca üye olduğu firmalara geçebilir.
- Yetki kontrolü yalnızca arayüzde değil backend API seviyesinde de uygulanır.
- Yayına almadan önce güçlü JWT_SECRET kullanın ve PostgreSQL yedeği alın.
