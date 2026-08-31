import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { WorkOrder } from "@/types";
import { StatusBadge } from "./ui";
import { useAppTheme, radius, spacing } from "@/theme/tokens";
import {
  formatDate,
  isOverdue,
  priorityPresentation,
  statusPresentation,
} from "@/utils/presentation";

export function WorkOrderCard({
  item,
  onPress,
}: {
  item: WorkOrder;
  onPress: () => void;
}) {
  const t = useAppTheme(),
    status = statusPresentation(item.status),
    priority = priorityPresentation(item.priority),
    overdue = isOverdue(item.due_date, item.status),
    assignee = item.assigned_member_name || item.assigned_user_name;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${status.label}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: t.colors.surface,
          borderColor: overdue ? t.colors.warning : t.colors.line,
          opacity: pressed ? 0.78 : 1,
          transform: [{ scale: pressed ? 0.992 : 1 }],
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={{ flex: 1, gap: 4 }}>
          {item.work_order_no ? (
            <Text style={[styles.number, { color: t.colors.primary }]}>
              {item.work_order_no}
            </Text>
          ) : null}
          <Text numberOfLines={2} style={[styles.title, { color: t.colors.text }]}>
            {item.title}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={19} color={t.colors.muted} />
      </View>

      <View style={styles.badges}>
        <StatusBadge
          label={status.label}
          tone={status.tone}
          icon={status.icon as keyof typeof Ionicons.glyphMap}
        />
        {item.priority ? (
          <StatusBadge
            label={priority.label}
            tone={priority.tone}
            icon={priority.icon as keyof typeof Ionicons.glyphMap}
          />
        ) : null}
      </View>

      <View style={[styles.details, { borderTopColor: t.colors.divider }]}>
        <Detail icon="construct-outline" value={item.machine_name || "Makine belirtilmedi"} />
        <Detail icon="person-outline" value={assignee || "Henüz atanmadı"} />
        <Detail
          icon={overdue ? "alert-circle-outline" : "calendar-outline"}
          value={
            item.due_date
              ? `${overdue ? "Gecikti · " : "Termin · "}${formatDate(item.due_date)}`
              : "Termin belirtilmedi"
          }
          danger={overdue}
        />
      </View>
    </Pressable>
  );
}

function Detail({
  icon,
  value,
  danger = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  danger?: boolean;
}) {
  const t = useAppTheme(),
    color = danger ? t.colors.danger : t.colors.muted;
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={15} color={color} />
      <Text numberOfLines={1} style={[styles.detailText, { color }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 164,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  topRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  number: { fontSize: 10, fontWeight: "900", letterSpacing: 0.8 },
  title: { fontSize: 16, lineHeight: 22, fontWeight: "900" },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  details: { borderTopWidth: 1, paddingTop: spacing.md, gap: spacing.sm },
  detailRow: { minHeight: 20, flexDirection: "row", alignItems: "center", gap: 7 },
  detailText: { flex: 1, fontSize: 12, lineHeight: 17, fontWeight: "700" },
});
