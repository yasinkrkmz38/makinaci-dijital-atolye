import { useState } from "react";
import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { api } from "@/services/api";
import type { PageResult, WorkOrder } from "@/types";
import {
  AppButton,
  EmptyState,
  ErrorState,
  FilterChip,
  PageHeader,
  Screen,
  SearchField,
  Skeleton,
} from "@/components/ui";
import { WorkOrderCard } from "@/components/WorkOrderCard";
import { Pager } from "@/components/Pager";
import { useAuth } from "@/providers/auth-provider";
import { canUser } from "@/services/permissions";

export default function WorkOrders() {
  const router = useRouter(),
    { user } = useAuth(),
    [search, setSearch] = useState(""),
    [mine, setMine] = useState(false),
    [page, setPage] = useState(1),
    query = useQuery({
      queryKey: ["work-orders", mine, page, search],
      queryFn: () => api<PageResult<WorkOrder>>(`/api/lists/work-orders?page=${page}&limit=25&mine=${mine?'1':'0'}&q=${encodeURIComponent(search)}`),
    });
  const items = query.data?.items || [];
  return (
    <Screen bottomInset={false} refreshing={query.isRefetching} onRefresh={query.refetch}>
      <PageHeader
        eyebrow="SAHA OPERASYONU"
        title="İş Emirleri"
        subtitle={mine ? "Bana atanan işler" : "Tüm aktif işler"}
        action={canUser(user, "work") ? (
          <AppButton
            label="Yeni"
            icon="add"
            onPress={() => router.push("/(app)/work-orders/new")}
          />
        ) : undefined}
      />
      <SearchField
        value={search}
        onChange={(value)=>{setSearch(value);setPage(1)}}
        placeholder="İş emri veya makine ara"
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <FilterChip
          label="Tümü"
          onPress={() => {setMine(false);setPage(1)}}
          selected={!mine}
          icon="layers-outline"
        />
        <FilterChip
          label="Bana atananlar"
          onPress={() => {setMine(true);setPage(1)}}
          selected={mine}
          icon="person-outline"
        />
      </View>
      {query.isLoading ? (
        <Skeleton rows={5} />
      ) : query.error ? (
        <ErrorState
          message={(query.error as Error).message}
          onRetry={query.refetch}
        />
      ) : items.length ? (
        items.map((item) => (
          <WorkOrderCard
            key={item.id}
            item={item}
            onPress={() => router.push(`/(app)/work-orders/${item.id}`)}
          />
        ))
      ) : (
        <EmptyState
          title="İş emri bulunamadı"
          body="Bu görünümde eşleşen iş emri yok."
        />
      )}
      <Pager page={page} total={query.data?.total||0} limit={25} onPage={setPage}/>
    </Screen>
  );
}
