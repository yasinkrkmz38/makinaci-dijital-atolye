import { Alert, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { Maintenance } from "@/types";
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
import { useAppTheme } from "@/theme/tokens";

type Checklist = {
  id: number;
  label: string;
  result_status: string;
  measurement_value?: string;
  note?: string;
  photo_file_name?: string;
};
export default function MaintenanceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    t = useAppTheme(),
    qc = useQueryClient(),
    record = useQuery({
      queryKey: ["maintenance", id],
      queryFn: () =>
        api<
          Maintenance & {
            note?: string;
            interval_months?: number;
            interval_hours?: number;
          }
        >(`/api/maintenance/${id}/detail`),
    }),
    list = useQuery({
      queryKey: ["maintenance-checklist", id],
      queryFn: () => api<Checklist[]>(`/api/checklists/maintenance/${id}`),
    }),
    refresh = async () => {
      await Promise.all([record.refetch(), list.refetch()]);
    },
    status = useMutation({
      mutationFn: (next: string) =>
        api(`/api/maintenance/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: next }),
        }),
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: ["maintenance"] });
        await refresh();
      },
      onError: (error) =>
        Alert.alert("Bakım güncellenemedi", (error as Error).message),
    }),
    check = useMutation({
      mutationFn: ({
        itemId,
        result_status,
      }: {
        itemId: number;
        result_status: string;
      }) =>
        api(`/api/checklists/items/${itemId}`, {
          method: "PATCH",
          body: JSON.stringify({ result_status }),
        }),
      onSuccess: () => list.refetch(),
      onError: (error) =>
        Alert.alert("Checklist güncellenemedi", (error as Error).message),
    });
  if (record.isLoading)
    return (
      <Screen>
        <BackHeader title="Bakım detayı" />
        <Skeleton rows={5} />
      </Screen>
    );
  if (record.error || !record.data)
    return (
      <Screen>
        <BackHeader title="Bakım detayı" />
        <ErrorState
          message={(record.error as Error)?.message || "Kayıt bulunamadı"}
        />
      </Screen>
    );
  const r = record.data;
  return (
    <Screen
      refreshing={record.isRefetching || list.isRefetching}
      onRefresh={refresh}
    >
      <BackHeader title={r.task} subtitle={r.machine_name} />
      <View style={styles.row}>
        <StatusBadge
          label={r.status}
          tone={r.status === "done" ? "success" : "warning"}
        />
        <StatusBadge
          label={r.priority || "Normal"}
          tone={r.priority === "Kritik" ? "danger" : "neutral"}
        />
      </View>
      <Card>
        <Info label="Plan tarihi" value={r.due_date} />
        <Info label="Teknisyen" value={r.technician_member_name} />
        <Info
          label="Tekrar"
          value={
            r.recurrence_type === "calendar"
              ? `${r.interval_months} ay`
              : r.recurrence_type === "hours"
                ? `${r.interval_hours} saat`
                : "Tekrarsız"
          }
        />
        <Text style={{ color: t.colors.text, lineHeight: 21, marginTop: 8 }}>
          {r.note || "Ek talimat yok."}
        </Text>
      </Card>
      <SectionTitle title="Bakım checklist'i" />
      {list.isLoading ? (
        <Skeleton rows={3} />
      ) : (
        list.data?.map((item) => (
          <Card key={item.id}>
            <Text style={{ color: t.colors.text, fontWeight: "800" }}>
              {item.label}
            </Text>
            <StatusBadge
              label={item.result_status}
              tone={
                item.result_status === "ok"
                  ? "success"
                  : item.result_status === "pending"
                    ? "neutral"
                    : "danger"
              }
            />
            <View style={styles.row}>
              <AppButton
                label="Uygun"
                variant={item.result_status === "ok" ? "primary" : "secondary"}
                onPress={() =>
                  check.mutate({ itemId: item.id, result_status: "ok" })
                }
              />
              <AppButton
                label="Uygunsuz"
                variant="danger"
                onPress={() =>
                  check.mutate({ itemId: item.id, result_status: "not_ok" })
                }
              />
              <AppButton
                label="Bulgu"
                variant="secondary"
                onPress={() =>
                  check.mutate({ itemId: item.id, result_status: "finding" })
                }
              />
            </View>
          </Card>
        ))
      )}
      <AppButton
        label={r.status === "done" ? "Bakımı yeniden aç" : "Bakımı tamamla"}
        onPress={() => status.mutate(r.status === "done" ? "open" : "done")}
        loading={status.isPending}
      />
      <Text
        style={{ color: t.colors.muted, fontSize: 11, textAlign: "center" }}
      >
        Tamamlama sonrası periyodik planın bir sonraki kaydı sunucuda otomatik
        oluşturulur.
      </Text>
    </Screen>
  );
}
function Info({ label, value }: { label: string; value: unknown }) {
  const t = useAppTheme();
  return (
    <View style={styles.info}>
      <Text style={{ color: t.colors.muted, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: t.colors.text, fontWeight: "800" }}>
        {String(value || "—")}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap", alignItems: "center" },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
  },
});
