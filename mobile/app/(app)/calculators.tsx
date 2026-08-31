import { useState } from "react";
import { Alert, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { AppButton, Card, Screen } from "@/components/ui";
import { BackHeader } from "@/components/BackHeader";
import {
  calculate,
  calculators,
  type CalculatorDefinition,
} from "@/services/calculators";
import { useAppTheme } from "@/theme/tokens";

export default function Calculators() {
  const t = useAppTheme();
  const [selected, setSelected] = useState<CalculatorDefinition | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);

  const choose = (item: CalculatorDefinition) => {
    setSelected(item);
    setResult(null);
    setValues(
      Object.fromEntries(
        item.fields.map((field) => [
          field.key,
          String(field.defaultValue ?? ""),
        ]),
      ),
    );
  };
  if (!selected)
    return (
      <Screen>
        <BackHeader
          title="Hesaplama araçları"
          subtitle="Sahada hızlı ve doğrulanmış teknik hesaplar"
        />
        {calculators.map((item) => (
          <Card key={item.key}>
            <Text style={[styles.title, { color: t.colors.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.body, { color: t.colors.muted }]}>
              {item.description}
            </Text>
            <AppButton
              label="Hesaplayıcıyı aç"
              variant="secondary"
              onPress={() => choose(item)}
            />
          </Card>
        ))}
      </Screen>
    );

  const run = () => {
    try {
      const numeric = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          Number(value.replace(",", ".")),
        ]),
      );
      setResult(calculate(selected.key, numeric));
    } catch (error) {
      Alert.alert("Girişleri kontrol edin", (error as Error).message);
    }
  };
  return (
    <Screen>
      <BackHeader title={selected.title} subtitle={selected.description} />
      <Card>
        {selected.fields.map((field) => (
          <View key={field.key} style={{ gap: 6 }}>
            <Text
              style={{ color: t.colors.text, fontSize: 12, fontWeight: "800" }}
            >
              {field.label} ({field.unit})
            </Text>
            <TextInput
              value={values[field.key] || ""}
              onChangeText={(value) => {
                setValues((current) => ({ ...current, [field.key]: value }));
                setResult(null);
              }}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={t.colors.muted}
              style={[
                styles.input,
                {
                  color: t.colors.text,
                  borderColor: t.colors.line,
                  backgroundColor: t.colors.raised,
                },
              ]}
            />
          </View>
        ))}
        <AppButton label="Hesapla" icon="calculator-outline" onPress={run} />
      </Card>
      {result !== null ? (
        <Card>
          <Text
            style={{ color: t.colors.muted, fontSize: 11, fontWeight: "900" }}
          >
            SONUÇ
          </Text>
          <Text selectable style={[styles.result, { color: t.colors.text }]}>
            {result.toLocaleString("tr-TR", { maximumFractionDigits: 4 })}{" "}
            <Text style={{ fontSize: 16 }}>{selected.resultUnit}</Text>
          </Text>
          <AppButton
            label="Sonucu paylaş"
            variant="secondary"
            icon="share-social-outline"
            onPress={() =>
              Share.share({
                message: `Dijital Makinacı · ${selected.title}: ${result.toLocaleString("tr-TR", { maximumFractionDigits: 4 })} ${selected.resultUnit}`,
              })
            }
          />
        </Card>
      ) : null}
      <AppButton
        label="Tüm hesaplayıcılar"
        variant="text"
        onPress={() => setSelected(null)}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  title: { fontSize: 17, fontWeight: "900" },
  body: { fontSize: 12, lineHeight: 18, marginVertical: 6 },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 13,
    fontSize: 17,
  },
  result: { fontSize: 30, fontWeight: "900", marginVertical: 8 },
});
