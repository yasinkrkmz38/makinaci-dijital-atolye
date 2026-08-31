import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { clearQueue, getQueue, removeQueued } from "@/services/offline-queue";
import type { QueueItem } from "@/types";
import { useAuth } from "@/providers/auth-provider";
import { useNetwork } from "@/providers/network-provider";
import { AppButton, EmptyState, Screen } from "@/components/ui";
import { BackHeader } from "@/components/BackHeader";
import { EntityRow } from "@/components/EntityRow";
import { formatDateTime } from "@/utils/presentation";

const labels = {
  fault: "Arıza kaydı",
  maintenance: "Bakım kaydı",
  "work-order": "İş emri",
};
export default function Offline() {
  const { user } = useAuth(),
    { online, sync, syncing } = useNetwork(),
    [items, setItems] = useState<QueueItem[]>([]),
    load = useCallback(
      async () => setItems(user ? await getQueue(user.id) : []),
      [user],
    );
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );
  useEffect(() => {
    if (!syncing) load();
  }, [syncing, load]);
  return (
    <Screen>
      <BackHeader
        title="Çevrimdışı kayıtlar"
        subtitle={
          online
            ? "Bağlantı var · senkronizasyona hazır"
            : "Bağlantı bekleniyor"
        }
      />
      {items.length ? (
        items.map((item) => (
          <EntityRow
            key={item.id}
            title={labels[item.kind]}
            subtitle={String(
              item.body.title ||
                item.body.symptom ||
                item.body.task ||
                "Saha kaydı",
            )}
            status={`${item.attempts} deneme`}
            meta={formatDateTime(item.createdAt)}
            icon="cloud-offline-outline"
            onPress={() =>
              Alert.alert(
                "Kayıt silinsin mi?",
                "Henüz sunucuya gönderilmemiş bu taslak kaldırılacak.",
                [
                  { text: "Vazgeç", style: "cancel" },
                  {
                    text: "Sil",
                    style: "destructive",
                    onPress: async () => {
                      if (user) {
                        await removeQueued(user.id, item.id);
                        load();
                      }
                    },
                  },
                ],
              )
            }
          />
        ))
      ) : (
        <EmptyState
          title="Bekleyen kayıt yok"
          body="Çevrimdışı oluşturulan arıza, iş emri ve bakım kayıtları burada güvenle saklanır."
        />
      )}
      <AppButton
        label="Şimdi senkronize et"
        icon="sync"
        onPress={async () => {
          await sync();
          load();
        }}
        disabled={!online || !items.length}
        loading={syncing}
      />
      {items.length ? (
        <AppButton
          label="Tüm taslakları sil"
          variant="danger"
          onPress={() =>
            Alert.alert(
              "Tüm taslaklar silinsin mi?",
              "Bu işlem geri alınamaz.",
              [
                { text: "Vazgeç", style: "cancel" },
                {
                  text: "Sil",
                  style: "destructive",
                  onPress: async () => {
                    if (user) {
                      await clearQueue(user.id);
                      load();
                    }
                  },
                },
              ],
            )
          }
        />
      ) : null}
    </Screen>
  );
}
