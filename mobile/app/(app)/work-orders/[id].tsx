import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { pickDocument, pickPhoto, uploadAsset } from "@/services/media";
import type { WorkOrder } from "@/types";
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
import {
  formatDate,
  formatDateTime,
  priorityPresentation,
  statusPresentation,
} from "@/utils/presentation";

type Event = {
  id: number;
  body: string;
  event_type: string;
  user_name?: string;
  created_at: string;
};
type Checklist = {
  id: number;
  label: string;
  result_status: string;
  measurement_value?: string;
  note?: string;
};
type Detail = {
  record: WorkOrder & { approved_by_name?: string };
  events: Event[];
  timers: Array<{
    id: number;
    started_at: string;
    stopped_at?: string;
    duration_min?: number;
    user_name: string;
  }>;
  checklist: Checklist[];
  parts: Array<{
    id: number;
    part_name: string;
    quantity: number;
    unit: string;
  }>;
  attachments: Array<{ id: number; file_name: string; size_bytes: number }>;
};
export default function WorkOrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    t = useAppTheme(),
    qc = useQueryClient(),
    [comment, setComment] = useState(""),
    query = useQuery({
      queryKey: ["work-order", id],
      queryFn: () => api<Detail>(`/api/work-orders/${id}/detail`),
    }),
    refresh = () => query.refetch(),
    act = useMutation({
      mutationFn: ({ path, body = {} }: { path: string; body?: object }) =>
        api(`/api/work-orders/${id}${path}`, {
          method: "POST",
          body: JSON.stringify(body),
        }),
      onSuccess: async () => {
        setComment("");
        await qc.invalidateQueries({ queryKey: ["work-order", id] });
        await qc.invalidateQueries({ queryKey: ["work-orders"] });
      },
      onError: (error) =>
        Alert.alert("İşlem yapılamadı", (error as Error).message),
    }),
    state = useMutation({
      mutationFn: (status: string) =>
        api(`/api/work-orders/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }),
      onSuccess: refresh,
      onError: (error) =>
        Alert.alert("Durum değişmedi", (error as Error).message),
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
      onSuccess: refresh,
    }),
    upload = useMutation({
      mutationFn: async (kind: "camera" | "document") => {
        const asset =
          kind === "camera" ? await pickPhoto(true) : await pickDocument();
        if (asset)
          return uploadAsset(`/api/work-orders/${id}/attachments`, asset);
        return null;
      },
      onSuccess: refresh,
      onError: (error) => Alert.alert("Yüklenemedi", (error as Error).message),
    });
  if (query.isLoading)
    return (
      <Screen>
        <BackHeader title="İş emri" />
        <Skeleton rows={6} />
      </Screen>
    );
  if (query.error || !query.data)
    return (
      <Screen>
        <BackHeader title="İş emri" />
        <ErrorState
          message={(query.error as Error)?.message || "Kayıt bulunamadı"}
          onRetry={refresh}
        />
      </Screen>
    );
  const d = query.data,
    r = d.record,
    openTimer = d.timers.some((x) => !x.stopped_at),
    presentedStatus = statusPresentation(r.status),
    presentedPriority = priorityPresentation(r.priority);
  return (
    <Screen refreshing={query.isRefetching} onRefresh={refresh}>
      <BackHeader
        title={r.title}
        subtitle={[r.work_order_no, r.machine_name].filter(Boolean).join(" · ")}
      />
      <View style={styles.row}>
        <StatusBadge
          label={presentedStatus.label}
          tone={presentedStatus.tone}
          icon={presentedStatus.icon as keyof typeof import("@expo/vector-icons").Ionicons.glyphMap}
        />
        <StatusBadge
          label={presentedPriority.label}
          tone={presentedPriority.tone}
        />
      </View>
      <Card>
        <Info label="Sorumlu" value={r.assigned_member_name} />
        <Info label="Termin" value={formatDate(r.due_date)} />
        <Info label="Çalışma" value={`${r.actual_duration_min || 0} dk`} />
        <Text style={{ color: t.colors.text, lineHeight: 21, marginTop: 9 }}>
          {r.description || "Açıklama girilmemiş."}
        </Text>
      </Card>
      <View style={styles.row}>
        <AppButton
          label={openTimer ? "Sayacı durdur" : "Çalışmayı başlat"}
          icon={openTimer ? "stop-circle-outline" : "play-circle-outline"}
          onPress={() =>
            act.mutate({ path: openTimer ? "/timer/stop" : "/timer/start" })
          }
          loading={act.isPending}
        />
        <AppButton
          label="Beklet"
          variant="secondary"
          onPress={() => state.mutate("waiting")}
          loading={state.isPending}
        />
      </View>
      {r.status !== "done" ? (
        <AppButton
          label="Tamamlandı olarak işaretle"
          variant="secondary"
          onPress={() => state.mutate("done")}
        />
      ) : (
        <AppButton
          label="İş emrini onayla"
          onPress={() => act.mutate({ path: "/approve" })}
        />
      )}
      <SectionTitle title="Checklist" />
      {d.checklist.length ? (
        d.checklist.map((item) => (
          <Card key={item.id}>
            <Text style={{ color: t.colors.text, fontWeight: "800" }}>
              {item.label}
            </Text>
            <View style={styles.row}>
              <AppButton
                label="Uygun"
                variant={item.result_status === "ok" ? "primary" : "secondary"}
                onPress={() =>
                  check.mutate({ itemId: item.id, result_status: "ok" })
                }
              />
              <AppButton
                label="Bulgu"
                variant={
                  item.result_status === "finding" ? "primary" : "secondary"
                }
                onPress={() =>
                  check.mutate({ itemId: item.id, result_status: "finding" })
                }
              />
              <AppButton
                label="Uygunsuz"
                variant="danger"
                onPress={() =>
                  check.mutate({ itemId: item.id, result_status: "not_ok" })
                }
              />
            </View>
          </Card>
        ))
      ) : (
        <Text style={{ color: t.colors.muted }}>Checklist maddesi yok.</Text>
      )}
      <SectionTitle title="Fotoğraf ve belge" />
      <View style={styles.row}>
        <AppButton
          label="Fotoğraf çek"
          icon="camera-outline"
          variant="secondary"
          onPress={() => upload.mutate("camera")}
        />
        <AppButton
          label="Belge ekle"
          icon="attach-outline"
          variant="secondary"
          onPress={() => upload.mutate("document")}
        />
      </View>
      {d.attachments.map((x) => (
        <EntityRow
          key={x.id}
          title={x.file_name}
          meta={`${Math.ceil(x.size_bytes / 1024)} KB`}
          icon="attach-outline"
        />
      ))}
      <SectionTitle title="Yorum ve geçmiş" />
      <View
        style={[
          styles.comment,
          { backgroundColor: t.colors.surface, borderColor: t.colors.line },
        ]}
      >
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Saha yorumu yazın"
          placeholderTextColor={t.colors.muted}
          multiline
          style={{
            color: t.colors.text,
            flex: 1,
            minHeight: 60,
            textAlignVertical: "top",
          }}
        />
        <AppButton
          label="Gönder"
          onPress={() =>
            comment.trim() &&
            act.mutate({ path: "/comments", body: { body: comment } })
          }
          disabled={!comment.trim()}
        />
      </View>
      {d.events
        .slice()
        .reverse()
        .map((event) => (
          <EntityRow
            key={event.id}
            title={event.body || event.event_type}
            subtitle={event.user_name}
            meta={formatDateTime(event.created_at)}
            icon="time-outline"
          />
        ))}
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
  comment: { borderWidth: 1, borderRadius: 16, padding: 12, gap: 8 },
});
