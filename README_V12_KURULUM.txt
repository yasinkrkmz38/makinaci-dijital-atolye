DİJİTAL MAKİNACI V12 — GERÇEK KULLANICI + ADMIN SİSTEMİ
==========================================================

BU SÜRÜMDE
- Gerçek Kaydol / Giriş Yap
- Şifreler bcrypt ile hashlenir; düz metin tutulmaz
- HttpOnly cookie ile oturum
- Her kullanıcı sadece kendi verilerini görür
- PostgreSQL veritabanı
- Kullanıcıya özel:
  • Makine parkı
  • Bakım kayıtları
  • Arıza kayıtları
  • Favoriler
  • Hesaplama geçmişi
- Admin paneli
  • Toplam kullanıcı/makine/bakım/arıza
  • Kullanıcı listesi
  • Kullanıcı aktif/pasif
  • Admin/User rolü
  • Şifre görüntüleme YOK
- Mobil alt navigasyon
- Render uyumlu

RENDER KURULUMU
1) GitHub'a bu paketteki package.json, server.js ve public klasörünü yükle.
2) Render Dashboard > New > PostgreSQL ile bir PostgreSQL veritabanı oluştur.
3) Veritabanı hazır olunca Internal Database URL değerini Web Service'e environment variable olarak bağla:
   DATABASE_URL = Render PostgreSQL internal connection URL
4) Web Service > Environment bölümüne ayrıca:
   JWT_SECRET = uzun ve rastgele bir gizli değer
   NODE_ENV = production
   ADMIN_EMAIL = senin admin e-posta adresin
   ADMIN_PASSWORD = ilk admin şifren (en az 8 karakter)
   ADMIN_NAME = Admin
5) Build Command:
   npm install
6) Start Command:
   npm start
7) Deploy.
8) İlk açılışta tablolar otomatik oluşturulur.
9) ADMIN_EMAIL ve ADMIN_PASSWORD ile ilk admin hesabı otomatik oluşturulur.
10) Admin hesabı oluştuktan sonra güvenlik için istersen ADMIN_PASSWORD değişkenini Render'dan kaldırabilirsin.

ÖNEMLİ
- DATABASE_URL, JWT_SECRET ve ADMIN_PASSWORD GitHub'a YAZILMAMALI.
- Bunlar yalnızca Render Environment Variables bölümüne girilmeli.
- Admin kullanıcı şifrelerini göremez.
- Admin paneli varsayılan olarak kullanıcının özel makine/bakım içeriğini listelemez; sadece sayısal özet gösterir.
- Teknik teşhis ve hesaplamalar karar desteğidir; üretici dokümanı ve güvenlik prosedürleri önceliklidir.
