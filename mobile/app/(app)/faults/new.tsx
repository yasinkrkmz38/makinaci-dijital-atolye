import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { apiWithOfflineCache } from "@/services/offline-cache";
import { createRequestId, enqueue } from "@/services/offline-queue";
import {
  persistOfflineAsset,
  pickDocument,
  pickPhoto,
  uploadAsset,
  type UploadAsset,
} from "@/services/media";
import type { Machine } from "@/types";
import { faultSchema, type FaultForm } from "@/validation/schemas";
import { useNetwork } from "@/providers/network-provider";
import { useAuth } from "@/providers/auth-provider";
import { AppButton, Card, FormField, Screen } from "@/components/ui";
import { BackHeader } from "@/components/BackHeader";
import { ChoiceField } from "@/components/ChoiceField";
import { useAppTheme } from "@/theme/tokens";

type CompanyData = {
  members: Array<{
    id: number;
    name: string;
    role: string;
    is_active: boolean;
  }>;
};

export default function NewFault() {
  const params = useLocalSearchParams<{
      machine_id?: string;
      system?: string;
      symptom?: string;
      diagnosis?: string;
    }>(),
    router = useRouter(),
    qc = useQueryClient(),
    t = useAppTheme(),
    { online, refresh } = useNetwork(),
    { user } = useAuth(),
    [attachment, setAttachment] = useState<UploadAsset | null>(null),
    machines = useQuery({
      queryKey: ["machines"],
      queryFn: () =>
        user?.company
          ? apiWithOfflineCache<Machine[]>({
              userId: user.id,
              companyId: user.company.id,
              name: "machines_all",
              path: "/api/machines",
            })
          : api<Machine[]>("/api/machines"),
    }),
    company = useQuery({
      queryKey: ["company"],
      queryFn: () =>
        user?.company
          ? apiWithOfflineCache<CompanyData>({
              userId: user.id,
              companyId: user.company.id,
              name: "company_team",
              path: "/api/company",
            })
          : api<CompanyData>("/api/company"),
    }),
    { control, handleSubmit } = useForm<FaultForm>({
      resolver: zodResolver(faultSchema),
      defaultValues: {
        machine_id: params.machine_id || "",
        title: params.symptom || "",
        category: "Diğer",
        system: params.system || "",
        symptom: params.symptom || "",
        severity: "Orta",
        assigned_user_id: "",
        note: "",
      },
    }),
    mutation = useMutation({
      mutationFn: async (body: FaultForm) => {
        const payload = {
          ...body,
          machine_id: body.machine_id || null,
          assigned_user_id: body.assigned_user_id
            ? Number(body.assigned_user_id)
            : null,
          diagnosis: params.diagnosis || "",
        };
        if (!online && user) {
          const savedAttachment = attachment
            ? await persistOfflineAsset(attachment)
            : null;
          await enqueue(user.id, {
            method: "POST",
            path: "/api/faults",
            body: payload,
            kind: "fault",
            attachments: savedAttachment
              ? [{ ...savedAttachment, id: createRequestId() }]
              : undefined,
          });
          return { queued: true };
        }
        const row = await api<{ id: number }>("/api/faults", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        let uploadError = "";
        if (attachment)
          try {
            await uploadAsset(`/api/faults/${row.id}/attachments`, attachment);
          } catch (error) {
            uploadError = (error as Error).message;
          }
        return { ...row, uploadError };
      },
      onSuccess: async (result) => {
        await qc.invalidateQueries({ queryKey: ["faults"] });
        await refresh();
        if ("queued" in result)
          Alert.alert(
            "Çevrimdışı kaydedildi",
            attachment
              ? "Arıza ve seçilen dosya internet geldiğinde otomatik gönderilecek."
              : "Arıza internet geldiğinde otomatik gönderilecek.",
          );
        else if (result.uploadError)
          Alert.alert(
            "Arıza kaydedildi",
            `Dosya yüklenemedi; detay ekranından tekrar ekleyebilirsiniz. ${result.uploadError}`,
          );
        router.replace(
          "id" in result ? `/(app)/faults/${result.id}` : "/(app)/(tabs)/faults",
        );
      },
      onError: (error) =>
        Alert.alert("Arıza kaydedilemedi", (error as Error).message),
    });
  const chooseAttachment = async (kind: "camera" | "gallery" | "document") => {
    try {
      setAttachment(
        kind === "document"
          ? await pickDocument()
          : await pickPhoto(kind === "camera"),
      );
    } catch (error) {
      Alert.alert("Dosya seçilemedi", (error as Error).message);
    }
  };
  return (
    <Screen>
      <BackHeader
        title="Arıza bildir"
        subtitle={
          online
            ? "Sunucuya güvenli kayıt"
            : "Çevrimdışı taslak olarak saklanacak"
        }
      />
      <Card>
        <ChoiceField
          control={control}
          name="machine_id"
          label="Makine"
          choices={[
            { label: "Makine seçilmedi", value: "" },
            ...(machines.data || []).map((x) => ({
              label: x.name,
              value: String(x.id),
            })),
          ]}
        />
        <FormField control={control} name="title" label="Arıza başlığı" />
        <ChoiceField
          control={control}
          name="category"
          label="Kategori"
          choices={["Mekanik", "Elektrik", "Hidrolik", "Pnömatik", "CNC", "Diğer"].map(
            (value) => ({ label: value, value }),
          )}
        />
        <FormField
          control={control}
          name="system"
          label="Sistem"
          placeholder="Motor, hidrolik, CNC..."
        />
        <FormField control={control} name="symptom" label="Belirti" multiline />
        <ChoiceField
          control={control}
          name="severity"
          label="Önem"
          choices={["Düşük", "Orta", "Yüksek", "Kritik"].map((x) => ({
            label: x,
            value: x,
          }))}
        />
        <ChoiceField
          control={control}
          name="assigned_user_id"
          label="Atanan teknisyen"
          choices={[
            { label: "Atama yok", value: "" },
            ...(company.data?.members || [])
              .filter((item) => item.is_active !== false)
              .map((item) => ({
                label: `${item.name} · ${item.role}`,
                value: String(item.id),
              })),
          ]}
        />
        <FormField control={control} name="note" label="Saha notu" multiline />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <AppButton
            label="Fotoğraf çek"
            icon="camera-outline"
            variant="secondary"
            onPress={() => chooseAttachment("camera")}
          />
          <AppButton
            label="Galeriden seç"
            icon="images-outline"
            variant="secondary"
            onPress={() => chooseAttachment("gallery")}
          />
          <AppButton
            label="Belge seç"
            icon="document-attach-outline"
            variant="secondary"
            onPress={() => chooseAttachment("document")}
          />
        </View>
        {attachment ? (
          <Text style={{ color: t.colors.muted, fontSize: 12 }}>
            Eklenecek dosya: {attachment.name}
          </Text>
        ) : null}
        <AppButton
          label={online ? "Arızayı kaydet" : "Çevrimdışı kaydet"}
          onPress={handleSubmit((values) => mutation.mutate(values))}
          loading={mutation.isPending}
        />
      </Card>
    </Screen>
  );
}
