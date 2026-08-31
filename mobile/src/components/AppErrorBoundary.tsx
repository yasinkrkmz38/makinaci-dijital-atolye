import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { palette } from "@/theme/tokens";

export class AppErrorBoundary extends React.Component<
  React.PropsWithChildren,
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    if (__DEV__) console.error("UI error", error.message);
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <View style={styles.root}>
        <Text style={styles.mark}>DM</Text>
        <Text style={styles.title}>Bir şeyler ters gitti</Text>
        <Text style={styles.body}>
          Ekran güvenli şekilde durduruldu. Yeniden deneyebilir veya uygulamayı
          kapatıp açabilirsiniz.
        </Text>
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={() => this.setState({ error: null })}
        >
          <Text style={styles.buttonText}>Yeniden dene</Text>
        </Pressable>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    backgroundColor: palette.lightBg,
  },
  mark: {
    width: 54,
    height: 54,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 16,
    backgroundColor: palette.navy,
    color: "#fff",
    fontWeight: "900",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    marginTop: 20,
    color: palette.black,
  },
  body: { textAlign: "center", marginVertical: 10, color: palette.lightMuted },
  button: {
    minHeight: 48,
    paddingHorizontal: 22,
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: palette.blue,
  },
  buttonText: { color: "#fff", fontWeight: "800" },
});
