# Dijital Makinacı Mobil

Android öncelikli, gerçek React Native CMMS istemcisidir. WebView veya web uygulaması sarmalayıcısı kullanmaz. Expo SDK 57, React Native 0.86, TypeScript, Expo Router, TanStack Query, React Hook Form ve Zod üzerine kuruludur.

## Mimari

- `app/`: Expo Router ekran ve yönlendirmeleri
- `src/services/api.ts`: HTTPS, bearer access token, tek uçtan otomatik refresh rotation ve anlamlı ağ hataları
- `src/services/token-store.ts`: access/refresh anahtarlarının yalnızca SecureStore'da tutulması
- `src/services/offline-queue.ts`: kullanıcıya özel, idempotent arıza, bakım, iş emri ve arıza medyası kuyruğu
- `src/services/offline-cache.ts`: kullanıcı+firma anahtarlı makine listesi ve detay önbelleği
- `src/providers/`: auth, ağ durumu, biyometrik uygulama kilidi ve query yaşam döngüsü
- `src/validation/`: Zod form sözleşmeleri
- `src/services/calculators.ts`: saf ve test edilen 10 teknik hesaplayıcı
- `android/`: Expo prebuild ile üretilmiş yerel Android projesi

Mobil istemci firma veya rol bilgisini yetki kaynağı olarak kullanmaz. Sunucu, bearer oturumundan kullanıcıyı ve aktif firma üyeliğini yeniden çözer; tüm yazma işlemlerinde mevcut `companyCtx` ve `permit` kontrolleri çalışır.

## Yerel kurulum

```powershell
cd mobile
Copy-Item .env.example .env
npm ci
npm run check
npx expo start
```

`EXPO_PUBLIC_API_URL` production'da HTTPS olmalıdır. Push için Expo/EAS proje kimliği app config içinde tanımlıdır ve gerekirse `EXPO_PUBLIC_EAS_PROJECT_ID` ile değiştirilebilir. Anahtarlar repoya yazılmaz.

## Android

- Paket: `pro.dijitalmakinaci.app`
- Sürüm: `1.0.1`
- Version code: `2`
- Minimum/target/compile SDK değerleri Expo SDK 57 yerel Gradle ayarlarından gelir.

Android Studio, JDK ve Android SDK kurulu bir bilgisayarda:

```powershell
cd mobile
npx expo run:android
```

Yalnız debug APK:

```powershell
cd mobile\android
.\gradlew.bat assembleDebug
```

Çıktı: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`

Yerel release APK ve Play Store AAB:

```powershell
cd mobile\android
.\gradlew.bat assembleRelease
.\gradlew.bat bundleRelease
```

- Release APK: `mobile/android/app/build/outputs/apk/release/app-release.apk`
- Production AAB: `mobile/android/app/build/outputs/bundle/release/app-release.aab`
- İmzalı release için Android keystore/Gradle signing ayarı veya EAS credentials gerekir.

EAS ile kurulabilir preview APK:

```powershell
cd mobile
npx.cmd eas-cli@latest build --platform android --profile preview
```

Play Store AAB:

```powershell
cd mobile
npx.cmd eas-cli@latest build --platform android --profile production
```

EAS profilleri `eas.json` içindedir. Bu komutlar build üretir; mağazaya veya production'a kendiliğinden göndermez.

31 Ağustos 2026 tarihinde EAS ile doğrulanmış çıktılar:

- Güncel kurulabilir APK: `mobile/builds/dijital-makinaci-1.0.1-network-fix.apk`
- Önceki Play Store AAB: `mobile/builds/dijital-makinaci-1.0.0-production.aab` (1.0.1 düzeltmesini içermez; yayımlanmaz)
- EAS proje sayfası: https://expo.dev/accounts/ykorkmaz38/projects/dijital-makinaci

PowerShell script yürütme ilkesi `npx.ps1` dosyasını engelliyorsa yukarıdaki gibi `npx.cmd` kullanılmalıdır. Binary çıktılar bilerek Git ve sonraki EAS kaynak arşivlerinin dışında tutulur.

## Güvenlik ve izinler

- Access token 15 dakika, dönen refresh token 30 gündür; refresh tekrar kullanımı cihaz oturumunu tamamen kapatır.
- Şifre değişikliği eski web ve mobil cihaz oturumlarını iptal eder.
- Biyometrik kilit isteğe bağlıdır ve cihaz SecureStore tercihinde tutulur.
- Kamera yalnız QR tarama veya kullanıcı fotoğraf çekmeyi seçtiğinde istenir.
- Bildirim izni kullanıcı Hesabım ekranındaki etkinleştirme düğmesine bastığında istenir.
- Dosyalar mevcut sunucu MIME/imza/boyut kontrollerinden sonra object storage'a gider.
- Çevrimdışı istek ve dosya yüklemeleri UUID v4 idempotency anahtarı taşır; tekrar deneme çift kayıt üretmez.
- Kullanıcı veya firma değişiminde React Query önbelleği temizlenir; offline önbellek kullanıcı+firma kimliğiyle ayrılır.
- Uygulama ses kaydetmez veya ekran üstü pencere açmaz; bu Android izinleri native manifest birleşiminde engellenmiştir.

## Kalite kapıları

```powershell
npm run typecheck
npm run lint
npm test
npx expo-doctor
```

Android production bundle doğrulaması:

```powershell
npx expo export --platform android --output-dir dist-android --clear
```

Vitest Windows ortamında üst dizin modül çözümlemesi için erişim kısıtına takılırsa komut normal bir PowerShell penceresinde çalıştırılmalıdır. Testlerde hesaplama sınır değerleri, form doğrulama, rol görünürlüğü ve çevrimdışı kuyruk/idempotency davranışı kapsanır.

`android/` yerel proje teslimatın parçası olarak repoda tutulur. `app.json` değiştirildikten sonra native dosyaları yeniden eşitlemek için `npx expo prebuild --platform android --clean --no-install` çalıştırılmalıdır. Expo Doctor'ın “app config fields may not be synced” uyarısı bu bilinçli checked-in native proje düzeninden kaynaklanır.

Güncel doğrulama, build kimlikleri ve dosya özetleri için [BUILD_STATUS.md](./BUILD_STATUS.md) dosyasına bakın.
