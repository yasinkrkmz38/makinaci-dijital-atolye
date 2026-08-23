# Değişiklik Geçmişi

Bu dosya projedeki önemli teknik ve kullanıcıya dönük değişiklikleri kaydeder.

## 2026-08-23

### Organik trafik ve teknik SEO altyapısı

- Beş public hesaplama sayfası istemci tarafı generic metadata yerine sunucu tarafı özgün title, description, self-canonical ve sosyal paylaşım etiketleriyle yayınlanır hâle getirildi.
- Hesaplama sayfalarına kapsamlı açıklamalar, standart referansları, SSS, ilgili rehberler ve `WebApplication` / `FAQPage` / `BreadcrumbList` JSON-LD eklendi.
- Hidrolik, CNC, rulman, tolerans, elektrik motoru, pnömatik, kestirimci bakım, stok ve bakım yönetimini kapsayan 18 kaynak ve revizyon bilgili teknik rehber eklendi.
- Teknik rehberler `TechArticle`, public dizinler `CollectionPage` ve `ItemList` şemasıyla sunucu tarafında render edilmeye başlandı.
- `/teknik` ve `/hesaplamalar` dizinleri, ana sayfada taranabilir iç bağlantılar ve statik+veritabanı içeriğini birleştiren public makale API'si eklendi.
- Sitemap 26'dan fazla public URL, lastmod, changefreq ve priority bilgisiyle genişletildi; robots çıktısı ortamın public base URL'sine bağlandı.
- JSON-LD için istek başına nonce kullanan sıkı CSP korundu; dinamik makalelerde HTML/JSON kaçışları eklendi.
- SEO kalite kapısı ve production smoke testi; içerik uzunluğu, metadata, canonical, schema, public dizinler ve sitemap kapsamını denetleyecek şekilde genişletildi.

### V17.2 platform genişletmesi

- Public site `/`, CMMS `/app`, yönetim `/admin`, hesaplama ve teknik makale URL'leri ayrıldı; sitemap, robots, canonical/meta ve schema altyapısı eklendi.
- Frontend kopyaları ve geçici `v1621-*` yapısı kaldırıldı; sürümün tek kaynağı `package.json` ve sürüm eşitleme kontrolü oldu.
- E-posta doğrulama, Resend şifre sıfırlama, kalıcı brute-force koruması, MFA/kurtarma kodları, cihaz oturumları ve şifre değişiminde toplu çıkış eklendi.
- Takvim ve sayaç bazlı otomatik bakım şablonları, sonraki bakım üretimi, checklist sonucu/ölçümü/notu/fotoğrafı ve gerçek ekip teknisyeni ataması eklendi.
- İş emirlerine gerçek kullanıcı ataması, “Benim işlerim”, yorum/timeline, gerçek süre sayacı, checklist, dosya, parça, onay ve servis raporu eklendi.
- Stok miktarı yalnızca transaction içindeki giriş/çıkış/kullanım hareketleriyle değişir hâle getirildi; bakım ve iş emri parça kullanımı stoktan otomatik düşürülür.
- Firma e-posta daveti, bekleyen davetleri yeniden gönderme/iptal ve güvenli kabul akışı eklendi.
- Firma logolu, QR'lı, fotoğraf/ölçüm/parça ve teknisyen/müşteri imzalı servis raporları eklendi.
- Yeni ek dosyalar S3 uyumlu object storage'a taşındı; eski BYTEA ekleri için kontrollü migration komutu eklendi.
- Kalıcı okundu/ertele/kapat bildirimleri, e-posta ve PWA push, çevrimdışı saha kuyruğu ve kamera destekli QR tarayıcı eklendi.
- Sunucu tarafı global arama ve büyük operasyon listelerinde sayfalama eklendi.
- Teknik içeriklere kaynak, standart, revizyon tarihi ve ilgili araç/sistem bağlantıları eklendi.
- Motor, rulman, hidrolik, pnömatik, CNC, elektrik ve redüktör için veritabanı tabanlı karar ağaçları ve sonuçtan arıza oluşturma eklendi.
- ISO 286, metrik/UNC/UNF ön delik, torna/freze kesme, rulman kodu ve genişletilmiş hidrolik araçları public, paylaşılabilir kart ve WhatsApp akışıyla eklendi.
- Admin mobil görünümü güvenli alan ve bottom-sheet davranışıyla V17 tasarım diline geçirildi; native `prompt()`/`confirm()` kullanımları özel dialog ile değiştirildi.
- Migration, operasyon, güvenlik, UI ve kritik domain davranış testleri genişletildi; health endpointi DB/mail/storage/migration durumunu raporlar.

### V17.2 kapsamlı production stabilizasyonu

- Stabilizasyon öncesi `backup/pre-codex-recovery-2026-08-23` dalı oluşturuldu.
- Production routing ve Git geçmişi `7c01605` baseline'ına kadar incelendi.
- Server doğrudan `0.0.0.0:$PORT` dinleyecek şekilde sadeleştirildi.
- Health endpointine canlı Render commit SHA bilgisi eklendi.
- Service worker JS/CSS rewrite, runtime injection ve login hack'lerinden arındırıldı.
- Eski service worker devreden çıktığında açık sekmenin yeni sürüme otomatik geçmesi sağlandı.
- Mobil CSS açık production route ve HTML referansı ile korundu.
- Login başarı akışı doğrudan `enterApp()` çağrısına bağlandı; blocking overlay kaldırıldı.
- Makine ve bakım kayıtları için arşivleme/geri yükleme eklendi.
- Dashboard, bildirim, takvim ve sağlık hesaplarında arşiv kayıtları dışlandı.
- Stok miktarının metadata PUT isteğiyle değiştirilmesi backend'de engellendi.
- Atanan kullanıcı/teknisyen firma üyeliği doğrulaması eklendi.
- Dosya yüklemelerinde MIME ile dosya imzası eşleştirmesi eklendi.
- Upload middleware güvenlik düzeltmeleri içeren Multer 2.2 sürümüne yükseltildi.
- Auth endpointleri için ayrı brute-force limitleri eklendi.
- Eski SQLite/Express 5 kalıntılı lockfile güncel production ağacından üretildi.
- Mimari invariant, UI ve production smoke testleri eklendi.

### Güvenlik ve üretim başlangıcı — `3d62e7f`

- `npm start`, ortam doğrulaması yapan `start.js` dosyasına bağlandı.
- Üretimde en az 32 karakterlik `JWT_SECRET` zorunlu hale getirildi.
- Render ağ ve timeout ayarları güvenli başlangıç zincirine eklendi.
- Sağlık kontrolü uygulama sürümünü dinamik olarak göstermeye başladı.
- Admin rotaları güncel kök admin dosyalarına yönlendirildi.
- README güncel kurulum ve dağıtım bilgileriyle yenilendi.
- `npm test` ve `scripts/check.js` doğrulama sistemi eklendi.
- Repoya yanlışlıkla eklenmiş bağımlılık kaynak klasörleri kaldırıldı.

### Giriş, kayıt ve PWA — `c3d9814`

- Giriş ve kayıt sekmeleri doğrudan JavaScript olaylarıyla bağlandı.
- Form gönderme butonu ve Enter tuşu desteği güçlendirildi.
- Service worker önbellek sürümü yenilendi.
- Service worker güncellemelerinde tarayıcı önbelleğini atlama etkinleştirildi.
- Giriş kontrolleri otomatik proje testlerine eklendi.

### Etkileşim uyumluluğu — `61675a9`

- Mevcut HTML içi olay işleyicileriyle uyumsuz CSP kaldırıldı.
- Helmet'in diğer güvenlik başlıkları korunmaya devam etti.
- Giriş, kayıt ve arayüz butonlarının canlı ortamda yeniden çalışması sağlandı.
- Render dağıtımı ve canlı güvenlik başlığı değişikliği doğrulandı.

## Kayıt kuralı

Yeni özellik, hata düzeltmesi, güvenlik değişikliği, veri modeli değişikliği veya önemli dağıtım işlemi bu dosyaya tarih ve ilgili commit ile eklenmelidir.
