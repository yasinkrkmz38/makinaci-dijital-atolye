import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useAppTheme } from "@/theme/tokens";

export function ChoiceField<T extends FieldValues>({
  control,
  name,
  label,
  choices,
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  choices: Array<{ label: string; value: string }>;
}) {
  const t = useAppTheme();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={styles.wrap}>
          <Text style={[styles.label, { color: t.colors.text }]}>{label}</Text>
          <View style={styles.choices}>
            {choices.map((choice) => {
              const active = value === choice.value;
              return (
                <Pressable
                  key={choice.value}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  onPress={() => onChange(choice.value)}
                  style={[
                    styles.choice,
                    {
                      backgroundColor: active
                        ? t.colors.primary
                        : t.colors.surface,
                      borderColor: active ? t.colors.primary : t.colors.line,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: active ? "#fff" : t.colors.text,
                      fontSize: 12,
                      fontWeight: "800",
                    }}
                  >
                    {choice.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {error ? (
            <Text style={{ color: t.colors.danger, fontSize: 12 }}>
              {error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}
const styles = StyleSheet.create({
  wrap: { gap: 7 },
  label: { fontSize: 12, fontWeight: "800" },
  choices: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  choice: {
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
