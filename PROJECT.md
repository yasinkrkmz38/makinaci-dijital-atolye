# Dijital Makinacı — Proje Kaydı

## Proje kimliği

- Proje: Dijital Makinacı
- Tür: Çok firmalı CMMS ve dijital atölye
- Canlı adres: https://dijitalmakinaci.pro/
- GitHub: https://github.com/yasinkrkmz38/makinaci-dijital-atolye
- Ana dal: `main`
- Uygulama sürümü: `17.2.0`
- Dağıtım: Render
- Çalışma zamanı: Node.js 20+
- Veritabanı: PostgreSQL

## Ürün sınırları

Public site `/` altında, giriş gerektiren CMMS `/app` altında çalışır. Platform yönetimi `/admin`, public hesaplamalar `/hesaplamalar/:slug`, teknik içerikler `/teknik/:slug` altındadır.

Temel alanlar:

- Kimlik doğrulama, firma üyeliği, rol ve oturum güvenliği
- Makine envanteri, arşivleme ve QR kimliği
- Takvim/çalışma saati bazlı periyodik bakım
- Checklist, ölçüm, bulgu, fotoğraf ve kullanılan parça
- İş emri atama, zaman, geçmiş, dosya ve onay
- Stok hareketi ve izlenebilir parça kullanımı
- Teknik kütüphane, karar ağacı ve hesaplama araçları
- Bildirim, e-posta, PWA push ve offline saha desteği
- Public teknik içerik, SEO ve paylaşılabilir sonuçlar

## Mimari kararlar

- Canonical frontend dosyaları sürüm önekleri taşımaz.
- Sürümün tek kaynağı `package.json` içindeki `17.2.0` değeridir; runtime varsayılanları bununla eşleşir.
- PostgreSQL değişiklikleri numaralı migration dosyalarıyla transaction içinde uygulanır.
- Production sırrı ve servis anahtarları yalnızca ortam değişkenlerinde tutulur.
- Dosya ekleri için hedef S3 uyumlu object storage'dır; veritabanı yalnızca metadata taşır.
- Stok miktarı metadata güncellemesinden ayrı, transaction içindeki hareketlerle değişir.
- Silinmesi geçmişi bozacak operasyonel kayıtlar hard delete yerine arşivlenir.
- Firma kapsamındaki tüm kayıtlar kullanıcı üyeliğinden türetilen company context ile sorgulanır.
- Public sayfalar indekslenebilir, `/app` ve `/admin` arama motorlarına kapalıdır.
- Hesaplama ve teknik makale sayfaları ilk HTML yanıtında özgün başlık, açıklama, self-canonical, breadcrumb, iç bağlantı ve JSON-LD sunar; kritik SEO içeriği istemci JavaScript'ine bağlı değildir.
- Sürümlü `seo-content.js` public teknik kütüphanenin asgari içerik tabanıdır; veritabanında yayınlanan makaleler bununla slug bazında birleştirilir.

## Güvenlik tabanı

- Güçlü JWT anahtarı production startup için zorunludur.
- Helmet/CSP aktiftir. HTML içi olay işleyicileri kademeli kaldırılırken script kaynakları yalnızca aynı origin ile sınırlıdır.
- Auth endpointleri rate limit ve kalıcı başarısız giriş kayıtlarıyla korunur.
- E-posta doğrulama, MFA, cihaz oturumları ve parola değişiminde toplu oturum iptali migration modelinin parçasıdır.
- Yüklemelerde boyut, MIME, dosya imzası ve firma kapsamı kontrol edilir.

## Çalışma ve recovery

- Aktif geliştirme dalı: `codex/platform-expansion`
- Genişletme öncesi yedek: `backup/pre-platform-expansion-2026-08-23`
- Önceki stabilizasyon yedeği: `backup/pre-codex-recovery-2026-08-23`

Production veritabanında DROP, recreate veya toplu DELETE yapılmaz. Migration'lar geriye uyumlu ve veri koruyucu hazırlanır. Kısmi veya test edilmemiş çalışma `main` dalına gönderilmez.

## Doğrulama kapıları

1. `npm ci`
2. `npm test`
3. Migration'ları geçici PostgreSQL üzerinde çalıştırma
4. Auth/firma izolasyonu/rol/stok/bakım entegrasyon testleri
5. Mobil ve masaüstü tarayıcı akışları
6. `/api/health`
7. Production `npm run smoke`

## Güncel çalışma

27 Ağustos 2026 itibarıyla yeni hesaplar kayıt tamamlanır tamamlanmaz normal oturumla uygulamanın bütün modüllerini kullanabilir. E-posta doğrulaması hesabı kullanmanın ön şartı değildir; gerçek doğrulama durumu korunur ve kullanıcı Hesap ve Güvenlik bölümünden istediği zaman doğrulama bağlantısı isteyebilir. Zorunlu doğrulama politika anahtarı özel kurulumlar için korunmuştur, production varsayılanı `false` değeridir. Resend gönderim alan adı Hostinger DNS üzerinde doğrulanmıştır. Canonical frontend/public site ayrımı, güvenli auth, periyodik bakım/checklist, stok bağlantılı iş emirleri, ekip davetleri, object storage, bildirim/PWA/offline saha, karar ağacı, public teknik araçlar ve SEO altyapısı `codex/platform-expansion` dalında birlikte test edilmektedir. Ana dala geçiş yalnızca migration denemesi, tarayıcı doğrulaması ve production smoke kapıları tamamlandıktan sonra yapılır.
