# Android Derleme Durumu

Son doğrulama: 31 Ağustos 2026

## Başarılı kontroller

- TypeScript: başarılı
- ESLint: başarılı
- Mobil Vitest: 4 dosya, 24 test başarılı
- Web/backend kalite kapısı: 13 test başarılı
- Expo bağımlılık kontrolü: güncel
- Expo Doctor: 20/21; tek uyarı, bilerek repoda tutulan `android/` klasöründen sonra app.json değişikliklerinin otomatik eşitlenmemesidir. Native proje son app.json ile yeniden prebuild edilmiştir.
- Android Metro/Hermes production export: 1.602 modül ve 4,5 MB Hermes bundle ile başarılı
- Android application ID: `pro.dijitalmakinaci.app`
- Version name/code: `1.0.1` / `2`
- Doğrudan `react-native-webview` veya `expo-dev-client` bağımlılığı: yok
- Root production npm audit: 0 açık

Mobil npm audit, Expo'nun build-time `xcode → uuid` bağımlılık zincirinde 11 adet aynı moderate bildirimi raporlar. Npm'in sunduğu tek otomatik çözüm Expo 57'yi eski Expo 46'ya zorla düşürdüğü için uygulanmamıştır. Bu zincir uygulama iş mantığına veya token üretimine girmez; Expo SDK güncellemesi geldiğinde yeniden değerlendirilecektir.

## APK/AAB durumu

Expo hesabı `ykorkmaz38` ile EAS projesi oluşturuldu ve uygulama `75eedfb8-b714-430e-8510-41ea33e55718` proje kimliğine bağlandı.

- EAS proje sayfası: https://expo.dev/accounts/ykorkmaz38/projects/dijital-makinaci
- Güncel preview APK build: `6d81e642-3d3b-4e08-b14b-09c963177bfb` — `FINISHED`
- İlk preview APK build: `9f8bdcf9-e892-4d7b-be04-6615af244209` — ağ başlığı düzeltmesi öncesi, kullanılmamalı
- Production AAB build: `e5d31386-a98d-4b8a-a349-0babeff9c729` — `FINISHED`

Doğrulanmış yerel teslimler:

- Güncel preview APK: `mobile/builds/dijital-makinaci-1.0.1-network-fix.apk`
  - Boyut: `126105814` bayt (`120,26 MB`)
  - SHA-256: `0F65E637A69F2142F90B68E9A02553B062EBC92F5B929271629543ACE358379D`
- Production AAB: `mobile/builds/dijital-makinaci-1.0.0-production.aab`
  - Boyut: `84705404` bayt (`80,78 MB`)
  - SHA-256: `ADA894F78EB5D92BDE812D25EC03E8FF2FCCF48E767927FD778B35EF346B2139`

`1.0.0` production AAB ağ başlığı düzeltmesini içermez ve mağazaya gönderilmemelidir. Sonraki production AAB, `1.0.1` kaynaklarıyla yeniden üretilmelidir.

## 1.0.1 Android ağ düzeltmesi

React Native/OkHttp, HTTP başlık değerlerindeki yazdırılabilir ASCII dışı karakterleri istek gönderilmeden reddeder. `X-Device-Name` değerindeki Türkçe `ı` ve `•` karakterleri bu nedenle genel ağ hatasına dönüşüyordu. Başlık ASCII-güvenli hale getirildi ve gerileme testi eklendi. Canlı API adresi, düzeltilmiş cihaz başlığı, manifest ve APK imza bloğu yeni binary içinde doğrulandı.

APK içindeki `AndroidManifest.xml` ve AAB içindeki `base/manifest/AndroidManifest.xml` arşivden okunarak doğrulandı. İndirilen binary dosyalar `mobile/.gitignore` ve `mobile/.easignore` ile kaynak kontrolü ve sonraki EAS yüklemelerinin dışında tutulur.

Bu bilgisayarda yerel JDK/Android SDK bulunmadığı için yerel Gradle build'i yapılmadı; gerçek imzalı çıktılar EAS cloud build ile üretildi. EAS build işlemi mağazaya otomatik göndermez. Google Play yüklemesi ayrıca ve açıkça yapılmalıdır.
