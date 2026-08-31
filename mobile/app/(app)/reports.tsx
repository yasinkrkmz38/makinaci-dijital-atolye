import { Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import {
  Card,
  ErrorState,
  MetricCard,
  Screen,
  Skeleton,
} from "@/components/ui";
import { BackHeader } from "@/components/BackHeader";
import { useAppTheme } from "@/theme/tokens";

type Report = {
  total_faults: number;
  open_faults: number;
  downtime_min: number;
  mttr_min: number;
  mtbf_hours: number;
  downtime_cost: number;
  maintenance_compliance: number;
  days: number;
};
export default function Reports() {
  const t = useAppTheme(),
    query = useQuery({
      queryKey: ["reports", 90],
      queryFn: () => api<Report>("/api/reports/overview?days=90"),
    });
  return (
    <Screen refreshing={query.isRefetching} onRefresh={query.refetch}>
      <BackHeader
        title="Raporlar"
        subtitle="Son 90 gün güvenilirlik ve bakım KPI'ları"
      />
      {query.isLoading ? (
        <Skeleton rows={5} />
      ) : query.error ? (
        <ErrorState message={(query.error as Error).message} />
      ) : query.data ? (
        <>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <MetricCard
              label="Toplam arıza"
              value={query.data.total_faults}
              icon="warning-outline"
              tone="danger"
            />
            <MetricCard
              label="Açık arıza"
              value={query.data.open_faults}
              icon="alert-circle-outline"
              tone="warning"
            />
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <MetricCard
              label="MTTR (dk)"
              value={query.data.mttr_min}
              icon="time-outline"
            />
            <MetricCard
              label="MTBF (saat)"
              value={query.data.mtbf_hours || "—"}
              icon="pulse-outline"
              tone="success"
            />
          </View>
          <Card>
            <Text
              style={{ color: t.colors.muted, fontSize: 11, fontWeight: "900" }}
            >
              BAKIM UYUMU
            </Text>
            <Text
              style={{ color: t.colors.text, fontSize: 34, fontWeight: "900" }}
            >
              %{query.data.maintenance_compliance}
            </Text>
            <Text style={{ color: t.colors.muted }}>
              Toplam duruş: {query.data.downtime_min} dakika
            </Text>
            <Text style={{ color: t.colors.muted }}>
              Tahmini duruş maliyeti:{" "}
              {Number(query.data.downtime_cost).toLocaleString("tr-TR")} ₺
            </Text>
          </Card>
        </>
      ) : null}
    </Screen>
  );
}
