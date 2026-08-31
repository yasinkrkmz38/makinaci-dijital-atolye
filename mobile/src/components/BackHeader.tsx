import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/theme/tokens";
export function BackHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const t = useAppTheme(),
    router = useRouter();
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityLabel="Geri dön"
        hitSlop={8}
        onPress={() => router.back()}
        style={[
          styles.back,
          { backgroundColor: t.colors.surface, borderColor: t.colors.line },
        ]}
      >
        <Ionicons name="arrow-back" size={21} color={t.colors.text} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          style={[styles.title, { color: t.colors.text }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: t.colors.muted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  back: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: "900" },
  subtitle: { fontSize: 11, marginTop: 2 },
});
