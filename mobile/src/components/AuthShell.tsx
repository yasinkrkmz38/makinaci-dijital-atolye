import {
  KeyboardAvoidingView,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { ReactNode } from "react";
import { Screen } from "./ui";
import { useAppTheme, spacing } from "@/theme/tokens";
import appIcon from "../../assets/branding/icon-legacy.png";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const t = useAppTheme();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Screen contentStyle={styles.content}>
        <View style={styles.brand}>
          <Image
            accessibilityLabel="Dijital Makinacı"
            source={appIcon}
            style={styles.logo}
          />
          <Text style={[styles.brandName, { color: t.colors.text }]}>
            Dijital Makinacı
          </Text>
          <Text style={[styles.brandTag, { color: t.colors.primary }]}>
            PROFESYONEL CMMS
          </Text>
        </View>
        <View
          style={[
            styles.panel,
            { backgroundColor: t.colors.surface, borderColor: t.colors.line },
          ]}
        >
          <Text
            accessibilityRole="header"
            style={[styles.title, { color: t.colors.text }]}
          >
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: t.colors.muted }]}>
            {subtitle}
          </Text>
          <View style={styles.form}>{children}</View>
        </View>
        <Text style={[styles.legal, { color: t.colors.muted }]}>
          Güvenli oturum · Firma izolasyonu · Saha kullanımı
        </Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  content: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: spacing.xxl,
  },
  brand: { alignItems: "center", gap: 4 },
  logo: {
    width: 68,
    height: 68,
    borderRadius: 17,
    marginBottom: 8,
  },
  brandName: { fontSize: 25, fontWeight: "900" },
  brandTag: { fontSize: 10, fontWeight: "900", letterSpacing: 1.7 },
  panel: { borderWidth: 1, borderRadius: 24, padding: 20, gap: 8 },
  title: { fontSize: 24, fontWeight: "900" },
  subtitle: { fontSize: 13, lineHeight: 19 },
  form: { gap: 14, marginTop: 14 },
  legal: { fontSize: 11, textAlign: "center" },
});
