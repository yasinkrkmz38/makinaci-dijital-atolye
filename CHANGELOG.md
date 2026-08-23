# Değişiklik Geçmişi

Bu dosya projedeki önemli teknik ve kullanıcıya dönük değişiklikleri kaydeder.

## 2026-08-23

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
