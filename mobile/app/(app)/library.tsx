import { useMemo, useState } from "react";
import { Linking, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import {
  AppButton,
  Card,
  EmptyState,
  ErrorState,
  Screen,
  SearchField,
  Skeleton,
  StatusBadge,
} from "@/components/ui";
import { BackHeader } from "@/components/BackHeader";
import { EntityRow } from "@/components/EntityRow";
import { useAppTheme } from "@/theme/tokens";

type Article = {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  source?: string;
  standard?: string;
  revision_date?: string;
};
export default function Library() {
  const t = useAppTheme(),
    [search, setSearch] = useState(""),
    [selected, setSelected] = useState<Article | null>(null),
    query = useQuery({
      queryKey: ["articles"],
      queryFn: () => api<Article[]>("/api/content/articles"),
    }),
    items = useMemo(
      () =>
        query.data?.filter((x) =>
          `${x.title} ${x.category} ${x.summary} ${x.standard}`
            .toLocaleLowerCase("tr")
            .includes(search.toLocaleLowerCase("tr")),
        ) || [],
      [query.data, search],
    );
  if (selected)
    return (
      <Screen>
        <BackHeader title={selected.title} subtitle={selected.category} />
        <StatusBadge label={selected.standard || "Teknik rehber"} tone="info" />
        <Card>
          <Text
            style={{ color: t.colors.text, fontSize: 15, lineHeight: 24 }}
            selectable
          >
            {selected.body}
          </Text>
        </Card>
        {selected.revision_date ? (
          <Text style={{ color: t.colors.muted }}>
            Revizyon: {selected.revision_date}
          </Text>
        ) : null}
        {selected.source?.startsWith("http") ? (
          <AppButton
            label="Kaynağı aç"
            variant="secondary"
            icon="open-outline"
            onPress={() => Linking.openURL(selected.source!)}
          />
        ) : null}
        <AppButton
          label="Kütüphaneye dön"
          variant="text"
          onPress={() => setSelected(null)}
        />
      </Screen>
    );
  return (
    <Screen>
      <BackHeader
        title="Teknik kütüphane"
        subtitle="Kaynaklı ve revizyonlu teknik içerikler"
      />
      <SearchField
        value={search}
        onChange={setSearch}
        placeholder="Makale, standart veya kategori ara"
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
            title={item.title}
            subtitle={item.summary}
            status={item.category}
            meta={item.standard}
            icon="book-outline"
            onPress={() => setSelected(item)}
          />
        ))
      ) : (
        <EmptyState
          title="İçerik bulunamadı"
          body="Arama ölçütünü değiştirin."
        />
      )}
    </Screen>
  );
}
