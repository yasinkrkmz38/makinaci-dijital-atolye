import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { api } from "@/services/api";
import { apiWithOfflineCache } from "@/services/offline-cache";
import type { Machine, PageResult } from "@/types";
import { useAuth } from "@/providers/auth-provider";
import { canUser } from "@/services/permissions";
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

export default function Machines() {
  const router = useRouter(),
    { user } = useAuth(),
    [search, setSearch] = useState(""),
    [page, setPage] = useState(1),
    query = useQuery({
      queryKey: ["machines", page, search],
      queryFn: () =>
        user?.company
          ? apiWithOfflineCache<PageResult<Machine>>({
              userId: user.id,
              companyId: user.company.id,
              name: `machines_${page}_${search.trim().toLocaleLowerCase("tr")}`,
              path: `/api/lists/machines?page=${page}&limit=25&q=${encodeURIComponent(search)}`,
            })
          : api<PageResult<Machine>>(
              `/api/lists/machines?page=${page}&limit=25&q=${encodeURIComponent(search)}`,
            ),
    });
  const items = query.data?.items || [];
  return (
    <Screen bottomInset={false} refreshing={query.isRefetching} onRefresh={query.refetch}>
      <PageHeader
        eyebrow="VARLIK YÖNETİMİ"
        title="Makineler"
        subtitle={`${query.data?.total || 0} aktif makine`}
        action={canUser(user, "editAssets") ? (
          <AppButton
            label="Ekle"
            icon="add"
            onPress={() => router.push("/(app)/machines/new")}
          />
        ) : undefined}
      />
      <SearchField
        value={search}
        onChange={(value)=>{setSearch(value);setPage(1)}}
        placeholder="Makine, seri no veya konum ara"
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
            title={item.name}
            subtitle={[
              [item.manufacturer, item.model].filter(Boolean).join(" "),
              item.location,
              item.criticality ? `${item.criticality} kritiklik` : "",
            ]
              .filter(Boolean)
              .join(" · ")}
            status={item.status}
            meta={
              item.health_score === undefined
                ? ""
                : `Sağlık %${item.health_score}`
            }
            icon="construct-outline"
            onPress={() => router.push(`/(app)/machines/${item.id}`)}
          />
        ))
      ) : (
        <EmptyState
          title="Makine bulunamadı"
          body={
            search
              ? "Arama ölçütünü değiştirin."
              : "İlk makinenizi ekleyerek varlık takibine başlayın."
          }
          action={
            !search && canUser(user, "editAssets") ? (
              <AppButton
                label="Makine ekle"
                onPress={() => router.push("/(app)/machines/new")}
              />
            ) : undefined
          }
        />
      )}
      <Pager page={page} total={query.data?.total||0} limit={25} onPage={setPage}/>
    </Screen>
  );
}
