import { Alert, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { apiWithOfflineCache } from "@/services/offline-cache";
import { pickDocument, pickPhoto, uploadAsset } from "@/services/media";
import type { Fault, Machine, Maintenance, WorkOrder } from "@/types";
import {
  AppButton,
  Card,
  ErrorState,
  Screen,
  SectionTitle,
  Skeleton,
  StatusBadge,
} from "@/components/ui";
import { BackHeader } from "@/components/BackHeader";
import { EntityRow } from "@/components/EntityRow";
import { useAppTheme } from "@/theme/tokens";
import { useAuth } from "@/providers/auth-provider";
import { canUser } from "@/services/permissions";

type Detail = {
  machine: Machine & { note?: string; category?: string; power_kw?: number };
  maintenance: Maintenance[];
  faults: Fault[];
  workOrders: WorkOrder[];
  measurements: Array<Record<string, unknown>>;
  attachments: Array<{ id: number; file_name: string; size_bytes: number }>;
};
export default function MachineDetail() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    router = useRouter(),
    qc = useQueryClient(),
    { user } = useAuth(),
    query = useQuery({
      queryKey: ["machine", id],
      queryFn: () =>
        user?.company
          ? apiWithOfflineCache<Detail>({
              userId: user.id,
              companyId: user.company.id,
              name: `machine_detail_${id}`,
              path: `/api/machines/${id}/detail`,
            })
          : api<Detail>(`/api/machines/${id}/detail`),
      enabled: !!id,
    }),
    refresh = () => query.refetch(),
    archive = useMutation({
      mutationFn: () => api(`/api/machines/${id}`, { method: "DELETE" }),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: ["machines"] });
        router.replace("/(app)/(tabs)/machines");
      },
      onError: (error) =>
        Alert.alert("Arşivlenemedi", (error as Error).message),
    }),
    upload = useMutation({
      mutationFn: async (kind: "camera" | "gallery" | "document") => {
        const asset =
          kind === "document"
            ? await pickDocument()
            : await pickPhoto(kind === "camera");
        if (!asset) return null;
        return uploadAsset(`/api/machines/${id}/attachments`, asset);
      },
      onSuccess: refresh,
      onError: (error) =>
        Alert.alert("Dosya eklenemedi", (error as Error).message),
    });
  const d = query.data;
  if (query.isLoading)
    return (
      <Screen>
        <BackHeader title="Makine detayı" />
        <Skeleton rows={5} />
      </Screen>
    );
  if (query.error || !d)
    return (
      <Screen>
        <BackHeader title="Makine detayı" />
        <ErrorState
          message={(query.error as Error)?.message || "Makine bulunamadı"}
          onRetry={refresh}
        />
      </Screen>
    );
  return (
    <Screen refreshing={query.isRefetching} onRefresh={refresh}>
      <BackHeader
        title={d.machine.name}
        subtitle={[d.machine.manufacturer, d.machine.model]
          .filter(Boolean)
          .join(" · ")}
      />
      <View style={styles.status}>
        <StatusBadge
          label={d.machine.status || "Durum yok"}
          tone={d.machine.status === "Çalışıyor" ? "success" : "warning"}
        />
        <StatusBadge
          label={`Sağlık %${d.machine.health_score ?? 0}`}
          tone={(d.machine.health_score || 0) >= 75 ? "success" : "warning"}
        />
      </View>
      <Card>
        <Info label="Seri no" value={d.machine.serial_no} />
        <Info label="Konum" value={d.machine.location} />
        <Info label="Kritiklik" value={d.machine.criticality} />
        <Info label="Çalışma saati" value={`${d.machine.hours || 0} saat`} />
        <Info label="Açık arıza" value={String(d.machine.open_faults || 0)} />
      </Card>
      <View style={styles.actions}>
        <AppButton
          label="Arıza bildir"
          icon="warning-outline"
          onPress={() =>
            router.push({
              pathname: "/(app)/faults/new",
              params: { machine_id: id },
            })
          }
        />
        <AppButton
          label="İş emri"
          icon="clipboard-outline"
          variant="secondary"
          onPress={() =>
            router.push({
              pathname: "/(app)/work-orders/new",
              params: { machine_id: id },
            })
          }
        />
      </View>
      <SectionTitle title="Saha medyası" />
      <View style={styles.actions}>
        <AppButton
          label="Fotoğraf çek"
          icon="camera-outline"
          variant="secondary"
          onPress={() => upload.mutate("camera")}
          loading={upload.isPending}
        />
        <AppButton
          label="Galeriden"
          icon="images-outline"
          variant="secondary"
          onPress={() => upload.mutate("gallery")}
          loading={upload.isPending}
        />
      </View>
      <AppButton
        label="Belge ekle"
        icon="document-attach-outline"
        variant="secondary"
        onPress={() => upload.mutate("document")}
        loading={upload.isPending}
      />
      {d.attachments.map((file) => (
        <EntityRow
          key={file.id}
          title={file.file_name}
          meta={`${Math.ceil(file.size_bytes / 1024)} KB`}
          icon="attach-outline"
        />
      ))}
      <SectionTitle title="Bakım geçmişi" />
      {d.maintenance.slice(0, 8).map((item) => (
        <EntityRow
          key={item.id}
          title={item.task}
          status={item.status}
          meta={item.due_date}
          icon="calendar-outline"
          onPress={() => router.push(`/(app)/maintenance/${item.id}`)}
        />
      ))}
      {canUser(user, "editAssets") ? <>
      <SectionTitle title="Yönetim" />
      <AppButton
        label="Makineyi arşivle"
        variant="danger"
        onPress={() =>
          Alert.alert(
            "Makine arşivlensin mi?",
            "Geçmiş kayıtlar korunur ve makine aktif listeden kaldırılır.",
            [
              { text: "Vazgeç", style: "cancel" },
              {
                text: "Arşivle",
                style: "destructive",
                onPress: () => archive.mutate(),
              },
            ],
          )
        }
        loading={archive.isPending}
      />
      </> : null}
    </Screen>
  );
}
function Info({ label, value }: { label: string; value: unknown }) {
  const t = useAppTheme();
  return (
    <View style={styles.info}>
      <Text style={[styles.infoLabel, { color: t.colors.muted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: t.colors.text }]}>
        {String(value || "—")}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  status: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  actions: { flexDirection: "row", gap: 9 },
  info: {
    minHeight: 39,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  infoLabel: { fontSize: 12 },
  infoValue: { fontSize: 13, fontWeight: "800", textAlign: "right" },
});
