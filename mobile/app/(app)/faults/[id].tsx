import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { api } from "@/services/api";
import { pickDocument, pickPhoto, uploadAsset } from "@/services/media";
import type { Fault } from "@/types";
import { AppButton, Card, ErrorState, Screen, SectionTitle, Skeleton, StatusBadge } from "@/components/ui";
import { BackHeader } from "@/components/BackHeader";
import { ChoiceField } from "@/components/ChoiceField";
import { EntityRow } from "@/components/EntityRow";
import { useAppTheme } from "@/theme/tokens";

type Detail = {
  record: Fault & { note?: string; system?: string; category?: string; diagnosis?: string; created_by_name?: string; closed_by_name?: string };
  attachments: Array<{ id: number; file_name: string; size_bytes: number; created_at: string }>;
  events: Array<{ id: number; body: string; event_type: string; user_name?: string; to_status?: string; created_at: string }>;
};
type CompanyData = { members: Array<{ id: number; name: string; role: string; is_active: boolean }> };
type AssignmentForm = { assigned_user_id: string };
const statusLabel: Record<string, string> = { open: "Açık", new: "Yeni", reviewing: "İnceleniyor", assigned: "Atandı", in_progress: "İşlemde", waiting_part: "Parça bekliyor", resolved: "Çözüldü", closed: "Kapatıldı", cancelled: "İptal edildi" };

export default function FaultDetail() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    t = useAppTheme(), qc = useQueryClient(),
    [rootCause, setRootCause] = useState(""), [actionTaken, setActionTaken] = useState(""),
    [resolution, setResolution] = useState(""), [downtime, setDowntime] = useState("0"),
    { control, watch } = useForm<AssignmentForm>({ defaultValues: { assigned_user_id: "" } }),
    assignedUserId = watch("assigned_user_id"),
    query = useQuery({ queryKey: ["fault", id], queryFn: () => api<Detail>(`/api/faults/${id}/detail`), enabled: !!id }),
    company = useQuery({ queryKey: ["company"], queryFn: () => api<CompanyData>("/api/company") }),
    status = useMutation({
      mutationFn: (body: Record<string, unknown>) => api(`/api/faults/${id}/status`, { method: "PATCH", body: JSON.stringify(body) }),
      onSuccess: async () => { await Promise.all([query.refetch(), qc.invalidateQueries({ queryKey: ["faults"] }), qc.invalidateQueries({ queryKey: ["dashboard"] })]); },
      onError: (error) => Alert.alert("Arıza güncellenemedi", error.message),
    }),
    upload = useMutation({
      mutationFn: async (kind: "camera" | "gallery" | "document") => {
        const asset = kind === "document" ? await pickDocument() : await pickPhoto(kind === "camera");
        return asset ? uploadAsset(`/api/faults/${id}/attachments`, asset) : null;
      },
      onSuccess: () => query.refetch(),
      onError: (error) => Alert.alert("Dosya yüklenemedi", error.message),
    });
  const detail = query.data, record = detail?.record,
    closed = record ? ["resolved", "closed"].includes(record.status) : false;
  const closeFault = () => {
    if (!rootCause.trim() || !actionTaken.trim() || !resolution.trim()) return Alert.alert("Kapatma bilgileri eksik", "Kök neden, yapılan işlem ve çözüm notunu doldurun.");
    const minutes = Number(downtime);
    if (!Number.isFinite(minutes) || minutes < 0) return Alert.alert("Duruş süresi geçersiz", "0 veya daha büyük bir sayı girin.");
    status.mutate({ status: "closed", root_cause: rootCause, action_taken: actionTaken, resolution, downtime_min: minutes });
  };
  if (query.isLoading) return <Screen><BackHeader title="Arıza detayı" /><Skeleton rows={5} /></Screen>;
  if (query.error || !detail || !record) return <Screen><BackHeader title="Arıza detayı" /><ErrorState message={(query.error as Error)?.message || "Arıza bulunamadı"} onRetry={query.refetch} /></Screen>;
  return (
    <Screen refreshing={query.isRefetching} onRefresh={query.refetch}>
      <BackHeader title={record.title || record.symptom || `Arıza #${id}`} subtitle={[record.machine_name, record.category].filter(Boolean).join(" · ")} />
      <View style={styles.wrap}><StatusBadge label={statusLabel[record.status] || record.status} tone={closed ? "success" : "danger"} /><StatusBadge label={record.severity || "Önem yok"} tone="warning" /></View>
      <Card>
        <Info label="Belirti" value={record.symptom} /><Info label="Sistem" value={record.system} />
        <Info label="Atanan teknisyen" value={record.assigned_user_name} /><Info label="Bildiren" value={record.created_by_name} />
        <Info label="Duruş" value={`${record.downtime_min || 0} dk`} />
        <Text style={[styles.note, { color: t.colors.text }]}>{record.note || "Saha notu girilmedi."}</Text>
      </Card>
      {!closed ? <>
        <SectionTitle title="Operasyon durumu" />
        <View style={styles.wrap}>
          <AppButton label="İşleme başla" variant="secondary" onPress={() => status.mutate({ status: "in_progress" })} loading={status.isPending} />
          <AppButton label="Parça bekliyor" variant="secondary" onPress={() => status.mutate({ status: "waiting_part" })} loading={status.isPending} />
        </View>
        <Card>
          <ChoiceField control={control} name="assigned_user_id" label="Teknisyen ata / değiştir" choices={(company.data?.members || []).filter((item) => item.is_active !== false).map((item) => ({ label: `${item.name} · ${item.role}`, value: String(item.id) }))} />
          <AppButton label="Atamayı kaydet" variant="secondary" disabled={!assignedUserId} onPress={() => status.mutate({ status: record.status, assigned_user_id: Number(assignedUserId) })} />
        </Card>
        <SectionTitle title="Arızayı sonuçlandır" />
        <Card>
          <FaultInput label="Kök neden" value={rootCause} onChange={setRootCause} />
          <FaultInput label="Yapılan işlem" value={actionTaken} onChange={setActionTaken} />
          <FaultInput label="Çözüm / sonuç notu" value={resolution} onChange={setResolution} />
          <FaultInput label="Toplam duruş süresi (dk)" value={downtime} onChange={setDowntime} numeric multiline={false} />
          <AppButton label="Arızayı kapat" onPress={closeFault} loading={status.isPending} />
        </Card>
      </> : <Card>
        <Info label="Kök neden" value={record.root_cause} /><Info label="Yapılan işlem" value={record.action_taken} />
        <Info label="Çözüm" value={record.resolution} /><Info label="Kapatan" value={record.closed_by_name} />
        <AppButton label="Arızayı yeniden aç" variant="secondary" onPress={() => status.mutate({ status: "open" })} loading={status.isPending} />
      </Card>}
      <SectionTitle title={`Fotoğraf ve belgeler · ${detail.attachments.length}`} />
      <View style={styles.wrap}>
        <AppButton label="Fotoğraf çek" icon="camera-outline" variant="secondary" onPress={() => upload.mutate("camera")} loading={upload.isPending} />
        <AppButton label="Galeriden" icon="images-outline" variant="secondary" onPress={() => upload.mutate("gallery")} loading={upload.isPending} />
        <AppButton label="Belge" icon="document-attach-outline" variant="secondary" onPress={() => upload.mutate("document")} loading={upload.isPending} />
      </View>
      {detail.attachments.map((file) => <EntityRow key={file.id} title={file.file_name} meta={`${Math.ceil(file.size_bytes / 1024)} KB`} icon="attach-outline" />)}
      <SectionTitle title="Arıza geçmişi" />
      {detail.events.length ? detail.events.map((event) => <EntityRow key={event.id} title={event.body || event.event_type} subtitle={event.user_name} status={event.to_status ? statusLabel[event.to_status] || event.to_status : event.event_type} meta={new Date(event.created_at).toLocaleString("tr-TR")} icon="time-outline" />) : <Text style={{ color: t.colors.muted }}>Henüz geçmiş kaydı yok.</Text>}
    </Screen>
  );
}
function Info({ label, value }: { label: string; value: unknown }) { const t = useAppTheme(); return <View style={styles.info}><Text style={[styles.infoLabel, { color: t.colors.muted }]}>{label}</Text><Text style={[styles.infoValue, { color: t.colors.text }]}>{String(value || "—")}</Text></View>; }
function FaultInput({ label, value, onChange, numeric = false, multiline = true }: { label: string; value: string; onChange: (value: string) => void; numeric?: boolean; multiline?: boolean }) { const t = useAppTheme(); return <View style={{ gap: 6 }}><Text style={[styles.inputLabel, { color: t.colors.text }]}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChange} keyboardType={numeric ? "numeric" : "default"} multiline={multiline} style={[styles.input, multiline && styles.textarea, { color: t.colors.text, backgroundColor: t.colors.raised, borderColor: t.colors.line }]} /></View>; }
const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, note: { fontSize: 13, lineHeight: 20, marginTop: 4 },
  info: { minHeight: 38, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  infoLabel: { fontSize: 12 }, infoValue: { flex: 1, fontSize: 13, fontWeight: "800", textAlign: "right" }, inputLabel: { fontSize: 12, fontWeight: "800" },
  input: { minHeight: 50, borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, fontSize: 16 }, textarea: { height: 92, paddingTop: 11, textAlignVertical: "top" },
});
