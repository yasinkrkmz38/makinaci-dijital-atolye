import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from "expo-camera";
import { useRouter } from "expo-router";
import { AppButton, Screen } from "@/components/ui";
import { BackHeader } from "@/components/BackHeader";
import { useAppTheme } from "@/theme/tokens";

export default function Scanner() {
  const t = useAppTheme(),
    router = useRouter(),
    [permission, requestPermission] = useCameraPermissions(),
    [scanned, setScanned] = useState(false);
  const handle = ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);
    let machine = "";
    try {
      const url = new URL(data);
      machine =
        url.searchParams.get("machine") ||
        url.pathname.match(/machines?\/(\d+)/)?.[1] ||
        "";
    } catch {
      machine = data.match(/machine[^0-9]*(\d+)/i)?.[1] || "";
    }
    if (machine) router.replace(`/(app)/machines/${machine}`);
    else
      Alert.alert(
        "QR kodu tanınmadı",
        "Bu kod bir Dijital Makinacı makine kartına bağlı değil.",
        [{ text: "Tekrar tara", onPress: () => setScanned(false) }],
      );
  };
  return (
    <Screen scroll={false} contentStyle={{ flex: 1 }}>
      <BackHeader
        title="QR tarayıcı"
        subtitle="Makine kartını saniyeler içinde açın"
      />
      {!permission ? (
        <Text style={{ color: t.colors.muted }}>
          Kamera izni kontrol ediliyor…
        </Text>
      ) : !permission.granted ? (
        <View style={styles.center}>
          <Text style={[styles.message, { color: t.colors.text }]}>
            QR kodlarını taramak için kamera izni gerekir.
          </Text>
          <AppButton label="Kamera izni ver" onPress={requestPermission} />
        </View>
      ) : (
        <View style={styles.cameraWrap}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={scanned ? undefined : handle}
          />
          <View style={styles.overlay}>
            <View style={styles.frame} />
            <Text style={styles.hint}>
              Makine QR kodunu çerçevenin içine getirin
            </Text>
          </View>
        </View>
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 18 },
  message: { fontSize: 16, textAlign: "center" },
  cameraWrap: { flex: 1, borderRadius: 22, overflow: "hidden" },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,.16)",
  },
  frame: {
    width: 240,
    height: 240,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 28,
  },
  hint: {
    color: "#fff",
    fontWeight: "900",
    marginTop: 24,
    backgroundColor: "rgba(0,0,0,.55)",
    padding: 10,
    borderRadius: 10,
  },
});
