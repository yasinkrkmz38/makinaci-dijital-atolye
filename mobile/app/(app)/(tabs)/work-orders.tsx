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
  PageHeader,
  Screen,
  SearchField,
  Skeleton,
} from "@/components/ui";
import { EntityRow } from "@/components/EntityRow";
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
    <Screen refreshing={query.isRefetching} onRefresh={query.refetch}>
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
      <View style={{ flexDirection: "row", gap: 8 }}>
        <AppButton
          label="Tümü"
          onPress={() => {setMine(false);setPage(1)}}
          variant={mine ? "secondary" : "primary"}
        />
        <AppButton
          label="Bana atananlar"
          onPress={() => {setMine(true);setPage(1)}}
          variant={mine ? "primary" : "secondary"}
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
          <EntityRow
            key={item.id}
            title={item.title}
            subtitle={[
              item.work_order_no,
              item.machine_name,
              item.assigned_member_name || item.assigned_user_name,
            ]
              .filter(Boolean)
              .join(" · ")}
            status={item.status}
            meta={item.due_date}
            icon="clipboard-outline"
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
