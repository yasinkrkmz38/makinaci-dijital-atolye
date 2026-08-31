import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBadge } from "./ui";
import { useAppTheme } from "@/theme/tokens";

const tone = (value = "") =>
  /kritik|arız|gecik|open/i.test(value)
    ? ("danger" as const)
    : /yüksek|bakım|progress/i.test(value)
      ? ("warning" as const)
      : /tamam|done|çalış/i.test(value)
        ? ("success" as const)
        : ("neutral" as const);
export function EntityRow({
  title,
  subtitle,
  status,
  meta,
  onPress,
  icon = "document-text-outline",
}: {
  title: string;
  subtitle?: string;
  status?: string;
  meta?: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const t = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: t.colors.surface,
          borderColor: t.colors.line,
          opacity: pressed ? 0.76 : 1,
        },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: t.colors.raised }]}>
        <Ionicons name={icon} size={21} color={t.colors.primary} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text
          numberOfLines={1}
          style={[styles.title, { color: t.colors.text }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={2}
            style={[styles.subtitle, { color: t.colors.muted }]}
          >
            {subtitle}
          </Text>
        ) : null}
        <View style={styles.meta}>
          {status ? <StatusBadge label={status} tone={tone(status)} /> : null}
          {meta ? (
            <Text style={[styles.metaText, { color: t.colors.muted }]}>
              {meta}
            </Text>
          ) : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={t.colors.muted} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  row: {
    minHeight: 82,
    borderWidth: 1,
    borderRadius: 17,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 15, fontWeight: "900" },
  subtitle: { fontSize: 12, lineHeight: 17 },
  meta: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaText: { fontSize: 10, fontWeight: "700" },
});
