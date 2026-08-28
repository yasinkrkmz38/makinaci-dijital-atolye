# Değişiklik Geçmişi

Bu dosya projedeki önemli teknik ve kullanıcıya dönük değişiklikleri kaydeder.

## 2026-08-27

### V17.3.3 mobil arayüz yenilemesi

- 360–430 piksel telefonlar için açık yüzeyli, lacivert kabuklu ve kontrollü mavi vurgulu yeni mobil tasarım sistemi oluşturuldu.
- Uygulama başlığı 62 piksel sticky header'a; ana navigasyon Ana, Araçlar, Bakım, Arızalar ve Hesabım öğeli bottom navigation'a dönüştürüldü.
- Firma seçimi, global arama ve ikincil çalışma alanları erişilebilir bir “Daha Fazla” bottom-sheet içinde toplandı.
- Mobil ana ekrana altı adet iki kolonlu hızlı araç kartı; bakım ekranına Bugün, Geciken, Yaklaşan ve Makine özetleri eklendi.
- Arıza teşhis formuna dokunulabilir adım göstergeleri, uzun oluşturma formlarına kompakt aç/kapat davranışı eklendi.
- Makine kartlarının tamamı klavye ve dokunmayla açılabilir hale getirildi; 44 piksel dokunma hedefleri ve yatay taşma koruması güçlendirildi.
- Login, kayıt, şifre yenileme ve hesap güvenliği alanlarına şifre göster/gizle; giriş düğmesine loading durumu eklendi.
- Giriş/kayıt sekmelerine ayrı başlık ve eylem metinleri eklendi; mobil Admin Center açık yüzey, lacivert kabuk ve mavi vurgu diline taşındı.
- Skeleton yükleme, sade toast, responsive bottom-sheet modal ve açık sonuç kartı bileşenleri eklendi.
- Public ana site ve SEO hesaplama sayfaları da iki kolonlu araç grid'i, kompakt hero, responsive form ve tablo yüzeyleriyle yenilendi.

### V17.2.1 kalite ve güvenilirlik düzeltmeleri

- Arıza analitiği sorguları hata katmanına bağlandı; boş veri sonuçları güvenli varsayılanlarla gösterilir.
- MTBF, makine toplam saatlerinin tekrar tekrar toplanması yerine dönem içindeki gerçek sayaç farkından hesaplanır.
- Vardiya devir kayıtları açık arıza, iş emri, geciken bakım ve kritik olay anlık görüntülerini saklar.
- Mobil hızlı menü dinamik seçeneklerden etkilenmeden düğmenin gerçek metnini ve doğru eylemini gösterir.
- Sürümlü statik dosyalar uzun süreli immutable önbelleğe, service worker kaynakları cache-first akışına geçirildi.
- Form etiketlerine dinamik `for`/`id` ilişkisi ve başlıklı ikon düğmelerine erişilebilir ad eklendi.
- Hatalı hesaplama girişinden sonra WhatsApp bağlantısında önceki geçerli sonucun kalması engellendi.

### Profesyonel CMMS bağlantılı operasyon genişletmesi

- Makina sayaç geçmişi; çalışma saati, çevrim, kilometre, üretim ve özel sayaç tipleriyle firma kapsamında eklendi.
- Sayaç güncellemesi azalan değerleri reddeder, çalışma saati bakım eşiklerini yeniden kontrol eder ve kullanıcı/zaman bilgisini saklar.
- İş emirlerine otomatik `WO-YIL-000001` numarası, bağlı arıza ve profesyonel kapanış alanları için güvenli migration eklendi.
- Bakım Şefi ve Depo Sorumlusu rolleri gerçek backend yetki listesine eklendi.
- Vardiya devir teslim ekranı; açık arıza, açık iş emri ve geciken bakım özetiyle eklendi.
- Makina–yedek parça çoktan çoğa eşleştirmesi ve firma izolasyonlu API'leri eklendi.
- Makinalara saatlik duruş maliyeti; raporlara MTTR, MTBF, bakım uyum oranı ve tahmini duruş maliyeti altyapısı eklendi.
- Arıza, iş emri, bakım ve stok raporları için Excel uyumlu UTF-8 CSV çıktıları eklendi.
- Migration yalnızca genişletici `ALTER TABLE ... ADD COLUMN` ve `CREATE TABLE/INDEX` işlemleri kullanır; mevcut veriyi silmez.

### Mobil tasarım diline uyarlanmış masaüstü arayüzü

- Telefon arayüzündeki yuvarlatılmış kart, cam yüzey, katmanlı koyu zemin ve belirgin yeşil aktif durum dili masaüstüne taşındı.
- Masaüstü kenar çubuğu sayfa kenarından ayrılan, kaydırılabilir ve küçük ekran yüksekliğinde de kullanılabilen uygulama paneline dönüştürüldü.
- Üst araç çubuğu yapışkan cam panele; firma seçimi, global arama, bildirim ve profil alanları ortak görsel sisteme geçirildi.
- Kontrol merkezi hero alanı, KPI kartları, paneller, form alanları, liste kartları ve modallar daha geniş köşeler ve tutarlı derinlikle yenilendi.
- 901–1220 piksel aralığı için kompakt masaüstü yerleşimi, 1600 piksel üzeri için sekiz kolonlu KPI kullanımı eklendi; telefon kırılımları korunarak regresyon kontrolü genişletildi.

### Admin Center erişim teşhisi

- Normal kullanıcı `/admin` adresini açtığında ana sayfaya sessizce yönlendirilmek yerine eksik platform yetkisini açıkça görür.
- Platform yöneticisi için MFA kurulumu veya MFA doğrulamalı oturum eksikse doğru Hesap ve Güvenlik adımı gösterilir.
- MFA etkin olup mevcut oturum doğrulanmamışsa Admin Center tek düğmeyle güvenli çıkış ve MFA'lı yeniden giriş akışını başlatır.
- Render `ADMIN_EMAIL` ayarı artık mevcut hesabı ek parola sırrı gerektirmeden platform yöneticisine yükseltebilir; `ADMIN_PASSWORD` yalnızca yeni yönetici hesabı oluşturulacaksa zorunludur.

### İsteğe bağlı e-posta doğrulaması

- Yeni kullanıcı kayıt tamamlanır tamamlanmaz normal oturumla uygulamanın bütün modüllerini kullanabilir.
- E-posta adresi doğrulanmış gibi işaretlenmez; doğrulama gerçek bağlantıyla Hesap ve Güvenlik bölümünden isteğe bağlı yapılır.
- E-posta doğrulamasının MFA, aktif oturumlar ve diğer cihazlardan çıkış özelliklerini engellemesi kaldırıldı.
- Zorunlu doğrulama politika anahtarı korundu ancak varsayılan ve production davranışı `false` olacak şekilde değiştirildi.
- Resend için `dijitalmakinaci.pro` alan adı Hostinger DNS üzerinde DKIM ve gönderim CNAME kayıtlarıyla doğrulandı.

## 2026-08-26

### Production çalışma ortamı

- Render'ın kararsız Node 26 alpha sürümünü seçmesini önlemek için production Node sürümü kararlı `22.x` hattına sabitlendi.

### Kayıt ve e-posta doğrulama deneyimi

- Kayıt tamamlandıktan sonra doğrulama e-postası gönderilemese bile hesabın oluşturulup kullanıcıya kısıtlı oturum açılması sağlandı.
- Doğrulanmamış kullanıcı doğrudan Hesap ve Güvenlik ekranına yönlendirilir; doğrulama bitene kadar operasyon verileri hem arayüzde hem API katmanında kapalıdır.
- Hesap içinden doğrulama bağlantısını yeniden gönderme ve doğrulama durumunu yenileme eklendi.
- Resend hataları genel “sunucu hatası” yerine kullanıcıya tekrar denenebilir, açık bir e-posta hatası olarak gösterilir.
- Doğrulanmamış oturumun yalnızca izinli güvenlik uç noktalarına erişebildiğini doğrulayan test eklendi.

## 2026-08-23

### Admin görünüm tutarlılığı

- Admin Center içindeki eski V16 etiketleri ürünün güncel V17.2.0 sürümüyle eşitlendi.
- Depolama göstergesi PostgreSQL yerine production dosya hedefi Cloudflare R2 olarak güncellendi.

### Organik trafik ve teknik SEO altyapısı

- Beş public hesaplama sayfası istemci tarafı generic metadata yerine sunucu tarafı özgün title, description, self-canonical ve sosyal paylaşım etiketleriyle yayınlanır hâle getirildi.
- Hesaplama sayfalarına kapsamlı açıklamalar, standart referansları, SSS, ilgili rehberler ve `WebApplication` / `FAQPage` / `BreadcrumbList` JSON-LD eklendi.
- Hidrolik, CNC, rulman, tolerans, elektrik motoru, pnömatik, kestirimci bakım, stok ve bakım yönetimini kapsayan 18 kaynak ve revizyon bilgili teknik rehber eklendi.
- Teknik rehberler `TechArticle`, public dizinler `CollectionPage` ve `ItemList` şemasıyla sunucu tarafında render edilmeye başlandı.
- `/teknik` ve `/hesaplamalar` dizinleri, ana sayfada taranabilir iç bağlantılar ve statik+veritabanı içeriğini birleştiren public makale API'si eklendi.
- Sitemap 26'dan fazla public URL, lastmod, changefreq ve priority bilgisiyle genişletildi; robots çıktısı ortamın public base URL'sine bağlandı.
- Google Search Console URL-prefix sahiplik doğrulaması için kalıcı ana sayfa meta etiketi eklendi.
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
