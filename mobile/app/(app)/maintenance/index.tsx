import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { api } from "@/services/api";
import type { Maintenance, PageResult } from "@/types";
import {
  AppButton,
  EmptyState,
  ErrorState,
  PageHeader,
  Screen,
  SearchField,
  Skeleton,
} from "@/components/ui";
import { EntityRow } from "@/components/EntityRow";
import { Pager } from "@/components/Pager";
import { useAuth } from "@/providers/auth-provider";
import { canUser } from "@/services/permissions";

export default function MaintenanceList() {
  const router = useRouter(),
    { user } = useAuth(),
    [search, setSearch] = useState(""),
    [page, setPage] = useState(1),
    query = useQuery({
      queryKey: ["maintenance", page, search],
      queryFn: () =>
        api<PageResult<Maintenance>>(
          `/api/lists/maintenance?page=${page}&limit=25&q=${encodeURIComponent(search)}`,
        ),
    });
  const items = query.data?.items || [];
  return (
    <Screen refreshing={query.isRefetching} onRefresh={query.refetch}>
      <PageHeader
        eyebrow="PLANLI BAKIM"
        title="Bakım Planları"
        subtitle="Takvim ve çalışma saati görevleri"
        action={canUser(user, "work") ? (
          <AppButton
            label="Yeni"
            icon="add"
            onPress={() => router.push("/(app)/maintenance/new")}
          />
        ) : undefined}
      />
      <SearchField
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Bakım, makine veya teknisyen ara"
      />
      {query.isLoading ? (
        <Skeleton rows={5} />
      ) : query.error ? (
        <ErrorState
          message={(query.error as Error).message}
          onRetry={query.refetch}
        />
      ) : items.length ? (
        items.map((item) => (
          <EntityRow
            key={item.id}
            title={item.task}
            subtitle={[item.machine_name, item.technician_member_name]
              .filter(Boolean)
              .join(" · ")}
            status={item.status}
            meta={item.due_date}
            icon="calendar-outline"
            onPress={() => router.push(`/(app)/maintenance/${item.id}`)}
          />
        ))
      ) : (
        <EmptyState
          title="Bakım görevi yok"
          body="İlk periyodik bakım planınızı oluşturun."
        />
      )}
      <Pager page={page} total={query.data?.total || 0} limit={25} onPage={setPage} />
    </Screen>
  );
}
