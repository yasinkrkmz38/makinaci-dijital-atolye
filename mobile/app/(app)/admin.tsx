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
import { useAuth } from "@/providers/auth-provider";
import { useAppTheme } from "@/theme/tokens";

type Stats = {
  users?: number;
  companies?: number;
  machines?: number;
  faults?: number;
};
export default function Admin() {
  const t = useAppTheme(),
    { user } = useAuth(),
    query = useQuery({
      queryKey: ["admin-stats"],
    queryFn: () => api<Stats>("/api/admin/summary"),
      enabled: !!user?.platform_admin,
    });
  if (!user?.platform_admin)
    return (
      <Screen>
        <BackHeader title="Admin Center" />
        <ErrorState message="Bu alan yalnızca platform yöneticilerine açıktır." />
      </Screen>
    );
  return (
    <Screen>
      <BackHeader
        title="Admin Center"
        subtitle="Platform geneli salt okunur mobil özet"
      />
      {query.isLoading ? (
        <Skeleton rows={5} />
      ) : query.error ? (
        <ErrorState message={(query.error as Error).message} />
      ) : (
        <>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <MetricCard
              label="Kullanıcı"
              value={Number(query.data?.users || 0)}
              icon="people-outline"
            />
            <MetricCard
              label="Firma"
              value={Number(query.data?.companies || 0)}
              icon="business-outline"
            />
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <MetricCard
              label="Makine"
              value={Number(query.data?.machines || 0)}
              icon="construct-outline"
            />
            <MetricCard
              label="Arıza"
              value={Number(query.data?.faults || 0)}
              icon="warning-outline"
              tone="warning"
            />
          </View>
          <Card>
            <Text style={{ color: t.colors.text, fontWeight: "900" }}>
              Güvenli yönetim
            </Text>
            <Text style={{ color: t.colors.muted, lineHeight: 20 }}>
              Kullanıcı engelleme, rol değişikliği ve sistem ayarları gibi
              yüksek etkili işlemler masaüstü Admin Center’da MFA ile yapılır.
              Mobil ekran operasyon durumunu izlemek içindir.
            </Text>
          </Card>
        </>
      )}
    </Screen>
  );
}
