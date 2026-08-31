import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { api } from "@/services/api";
import type { Fault, PageResult } from "@/types";
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
import { useAuth } from "@/providers/auth-provider";
import { canUser } from "@/services/permissions";
import { Pager } from "@/components/Pager";

export default function Faults() {
  const router = useRouter(),
    { user } = useAuth(),
    [search, setSearch] = useState(""),
    [page, setPage] = useState(1),
    query = useQuery({
      queryKey: ["faults", page, search],
      queryFn: () =>
        api<PageResult<Fault>>(
          `/api/lists/faults?page=${page}&limit=25&q=${encodeURIComponent(search)}`,
        ),
    });
  const items = query.data?.items || [];
  return (
    <Screen refreshing={query.isRefetching} onRefresh={query.refetch}>
      <PageHeader
        eyebrow="ARIZA YÖNETİMİ"
        title="Arızalar"
        subtitle={`${query.data?.total || 0} firma kaydı`}
        action={canUser(user, "operate") ? (
          <AppButton
            label="Bildir"
            icon="add"
            onPress={() => router.push("/(app)/faults/new")}
          />
        ) : undefined}
      />
      <SearchField
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Belirti veya makine ara"
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
            title={item.title || item.symptom || `Arıza #${item.id}`}
            subtitle={item.machine_name}
            status={item.status}
            meta={item.severity}
            icon="warning-outline"
            onPress={() => router.push(`/(app)/faults/${item.id}`)}
          />
        ))
      ) : (
        <EmptyState
          title="Arıza kaydı yok"
          body="Yeni bir saha arızasını anında kaydedebilirsiniz."
        />
      )}
      <Pager page={page} total={query.data?.total || 0} limit={25} onPage={setPage} />
    </Screen>
  );
}
