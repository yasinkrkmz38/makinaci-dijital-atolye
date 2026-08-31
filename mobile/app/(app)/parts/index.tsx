import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { api } from "@/services/api";
import type { PageResult, Part } from "@/types";
import {
  EmptyState,
  ErrorState,
  PageHeader,
  Screen,
  SearchField,
  Skeleton,
} from "@/components/ui";
import { EntityRow } from "@/components/EntityRow";
import { Pager } from "@/components/Pager";

export default function Parts() {
  const router = useRouter(),
    [search, setSearch] = useState(""),
    [page, setPage] = useState(1),
    query = useQuery({
      queryKey: ["parts", page, search],
      queryFn: () =>
        api<PageResult<Part>>(
          `/api/lists/parts?page=${page}&limit=25&q=${encodeURIComponent(search)}`,
        ),
    });
  const items = query.data?.items || [];
  return (
    <Screen refreshing={query.isRefetching} onRefresh={query.refetch}>
      <PageHeader
        eyebrow="STOK YÖNETİMİ"
        title="Parçalar"
        subtitle="Miktar yalnızca stok hareketiyle değişir"
      />
      <SearchField
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Parça veya kod ara"
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
            subtitle={[item.part_code, item.location]
              .filter(Boolean)
              .join(" · ")}
            status={
              item.quantity <= item.min_quantity ? "Düşük stok" : "Yeterli"
            }
            meta={`${item.quantity} ${item.unit || "adet"}`}
            icon="cube-outline"
            onPress={() => router.push(`/(app)/parts/${item.id}`)}
          />
        ))
      ) : (
        <EmptyState
          title="Parça bulunamadı"
          body="Arama kriterine uyan stok kartı yok."
        />
      )}
      <Pager page={page} total={query.data?.total || 0} limit={25} onPage={setPage} />
    </Screen>
  );
}
