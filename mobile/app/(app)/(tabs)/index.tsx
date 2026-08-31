import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { api } from "@/services/api";
import type { DashboardData } from "@/types";
import { useAuth } from "@/providers/auth-provider";
import {
  Card,
  ErrorState,
  MetricCard,
  OfflineBanner,
  PageHeader,
  Screen,
  SectionTitle,
  Skeleton,
  StatusBadge,
} from "@/components/ui";
import { EntityRow } from "@/components/EntityRow";
import { useAppTheme } from "@/theme/tokens";
import { canUser } from "@/services/permissions";

export default function Home() {
  const t = useAppTheme(),
    router = useRouter(),
    { user } = useAuth(),
    query = useQuery({
      queryKey: ["dashboard"],
      queryFn: () => api<DashboardData>("/api/dashboard"),
    });
  const d = query.data;
  return (
    <Screen refreshing={query.isRefetching} onRefresh={query.refetch}>
      <OfflineBanner />
      <PageHeader
        eyebrow={user?.company?.name || "DİJİTAL MAKİNACI"}
        title={`Merhaba, ${user?.name?.split(" ")[0] || ""}`}
        subtitle="Bugünün bakım ve saha operasyonları"
        action={
          <Pressable
            accessibilityLabel="Bildirimler"
            onPress={() => router.push("/(app)/notifications")}
            style={[
              styles.bell,
              { backgroundColor: t.colors.surface, borderColor: t.colors.line },
            ]}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={t.colors.text}
            />
          </Pressable>
        }
      />
      {query.isLoading ? (
        <Skeleton rows={4} />
      ) : query.error ? (
        <ErrorState
          message={(query.error as Error).message}
          onRetry={query.refetch}
        />
      ) : d ? (
        <>
          <View style={styles.metrics}>
            <MetricCard
              label="Aktif makine"
              value={d.machines}
              icon="construct-outline"
              onPress={() => router.push("/(app)/(tabs)/machines")}
            />
            <MetricCard
              label="Açık arıza"
              value={d.faults}
              icon="warning-outline"
              tone={d.faults ? "danger" : "success"}
              onPress={() => router.push("/(app)/(tabs)/faults")}
            />
          </View>
          <View style={styles.metrics}>
            <MetricCard
              label="Geciken bakım"
              value={d.overdue}
              icon="calendar-outline"
              tone={d.overdue ? "warning" : "success"}
              onPress={() => router.push("/(app)/maintenance")}
            />
            <MetricCard
              label="Açık iş emri"
              value={d.openWorkOrders}
              icon="clipboard-outline"
              onPress={() => router.push("/(app)/(tabs)/work-orders")}
            />
          </View>
          <Card>
            <View style={styles.health}>
              <View>
                <Text style={[styles.healthLabel, { color: t.colors.muted }]}>
                  ORTALAMA MAKİNE SAĞLIĞI
                </Text>
                <Text style={[styles.healthValue, { color: t.colors.text }]}>
                  %{d.avgHealth}
                </Text>
              </View>
              <StatusBadge
                label={
                  d.avgHealth >= 80
                    ? "İyi"
                    : d.avgHealth >= 55
                      ? "İzlenmeli"
                      : "Kritik"
                }
                tone={
                  d.avgHealth >= 80
                    ? "success"
                    : d.avgHealth >= 55
                      ? "warning"
                      : "danger"
                }
              />
            </View>
            <View style={[styles.track, { backgroundColor: t.colors.line }]}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.max(0, Math.min(100, d.avgHealth))}%`,
                    backgroundColor:
                      d.avgHealth >= 80
                        ? t.colors.success
                        : d.avgHealth >= 55
                          ? t.colors.warning
                          : t.colors.danger,
                  },
                ]}
              />
            </View>
          </Card>
          <SectionTitle title="Hızlı işlemler" />
          <View style={styles.actions}>
            {canUser(user, "operate") ? <Quick
              title="Arıza bildir"
              icon="warning"
              onPress={() => router.push("/(app)/faults/new")}
            /> : null}
            {canUser(user, "work") ? <Quick
              title="İş emri aç"
              icon="add-circle"
              onPress={() => router.push("/(app)/work-orders/new")}
            /> : null}
            <Quick
              title="QR tara"
              icon="qr-code"
              onPress={() => router.push("/(app)/scanner")}
            />
            <Quick
              title="Sayaç gir"
              icon="speedometer"
              onPress={() => router.push("/(app)/(tabs)/machines")}
            />
          </View>
          <SectionTitle title="Son bakım kayıtları" />
          {d.recentMaintenance.length ? (
            d.recentMaintenance.map((item) => (
              <EntityRow
                key={item.id}
                title={item.task}
                subtitle={item.machine_name}
                status={item.status}
                meta={item.due_date}
                icon="calendar-outline"
                onPress={() => router.push(`/(app)/maintenance/${item.id}`)}
              />
            ))
          ) : (
            <Text style={{ color: t.colors.muted }}>
              Henüz bakım kaydı yok.
            </Text>
          )}
        </>
      ) : null}
    </Screen>
  );
}
function Quick({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const t = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quick,
        {
          backgroundColor: t.colors.surface,
          borderColor: t.colors.line,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={23} color={t.colors.primary} />
      <Text style={[styles.quickText, { color: t.colors.text }]}>{title}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  bell: {
    width: 46,
    height: 46,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  metrics: { flexDirection: "row", gap: 12 },
  health: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  healthLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  healthValue: { fontSize: 32, fontWeight: "900" },
  track: { height: 9, borderRadius: 9, overflow: "hidden", marginTop: 14 },
  fill: { height: "100%", borderRadius: 9 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quick: {
    width: "48%",
    minHeight: 84,
    borderWidth: 1,
    borderRadius: 16,
    padding: 13,
    justifyContent: "space-between",
  },
  quickText: { fontSize: 12, fontWeight: "800" },
});
