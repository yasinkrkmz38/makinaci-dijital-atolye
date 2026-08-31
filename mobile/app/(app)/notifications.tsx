import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { NotificationItem } from "@/types";
import {
  AppButton,
  EmptyState,
  ErrorState,
  PageHeader,
  Screen,
  Skeleton,
} from "@/components/ui";
import { EntityRow } from "@/components/EntityRow";
import { formatDate } from "@/utils/presentation";

export default function Notifications() {
  const qc = useQueryClient(),
    query = useQuery({
      queryKey: ["notifications"],
      queryFn: () => api<NotificationItem[]>("/api/notifications"),
    }),
    read = useMutation({
      mutationFn: (id: number) =>
        api(`/api/notifications/${id}/read`, { method: "PATCH", body: "{}" }),
      onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
    }),
    readAll = useMutation({
      mutationFn: () =>
        api("/api/notifications/read-all", { method: "POST", body: "{}" }),
      onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
    });
  return (
    <Screen refreshing={query.isRefetching} onRefresh={query.refetch}>
      <PageHeader
        eyebrow="BİLDİRİM MERKEZİ"
        title="Bildirimler"
        subtitle="Bakım, arıza ve görev güncellemeleri"
        action={
          <AppButton
            label="Tümünü oku"
            variant="secondary"
            onPress={() => readAll.mutate()}
            loading={readAll.isPending}
          />
        }
      />
      {query.isLoading ? (
        <Skeleton rows={5} />
      ) : query.error ? (
        <ErrorState
          message={(query.error as Error).message}
          onRetry={query.refetch}
        />
      ) : query.data?.length ? (
        query.data.map((item) => (
          <EntityRow
            key={item.id}
            title={item.title}
            subtitle={item.body}
            status={item.read_at ? "Okundu" : "Yeni"}
            meta={formatDate(item.created_at)}
            icon="notifications-outline"
            onPress={() => read.mutate(item.id)}
          />
        ))
      ) : (
        <EmptyState
          title="Bildirim yok"
          body="Yeni operasyon bildirimleri burada görünecek."
        />
      )}
    </Screen>
  );
}
