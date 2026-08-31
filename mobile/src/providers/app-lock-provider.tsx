import {
  AppState,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { PropsWithChildren } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { AppButton } from "@/components/ui";
import { useAuth } from "./auth-provider";
import { useAppTheme } from "@/theme/tokens";

const KEY = "dm_biometric_lock";
type LockState = {
  enabled: boolean;
  setEnabled: (value: boolean) => Promise<boolean>;
  unlock: () => Promise<void>;
};
const LockContext = createContext<LockState | null>(null);
export function AppLockProvider({ children }: PropsWithChildren) {
  const { user } = useAuth(),
    t = useAppTheme(),
    [enabled, setEnabledState] = useState(false),
    [locked, setLocked] = useState(false);
  const unlock = useCallback(async () => {
    const available =
      (await LocalAuthentication.hasHardwareAsync()) &&
      (await LocalAuthentication.isEnrolledAsync());
    if (!available) {
      setLocked(false);
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Dijital Makinacı kilidini aç",
      cancelLabel: "Vazgeç",
      fallbackLabel: "Cihaz şifresini kullan",
      disableDeviceFallback: false,
    });
    if (result.success) setLocked(false);
  }, []);
  useEffect(() => {
    SecureStore.getItemAsync(KEY).then((value) => {
      const active = value === "1";
      setEnabledState(active);
      setLocked(active && !!user);
    });
  }, [user]);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && enabled && user) setLocked(true);
    });
    return () => sub.remove();
  }, [enabled, user]);
  useEffect(() => {
    if (locked) unlock();
  }, [locked, unlock]);
  const setEnabled = async (value: boolean) => {
    if (value) {
      const available =
        (await LocalAuthentication.hasHardwareAsync()) &&
        (await LocalAuthentication.isEnrolledAsync());
      if (!available) return false;
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Biyometrik kilidi etkinleştir",
      });
      if (!result.success) return false;
    }
    await SecureStore.setItemAsync(KEY, value ? "1" : "0");
    setEnabledState(value);
    setLocked(false);
    return true;
  };
  const context = useMemo(
    () => ({ enabled, setEnabled, unlock }),
    [enabled, unlock],
  );
  if (locked && user)
    return (
      <LockContext.Provider value={context}>
        <View style={[styles.lock, { backgroundColor: t.colors.background }]}>
          <Text style={[styles.logo, { color: t.colors.primary }]}>DM</Text>
          <Text style={[styles.title, { color: t.colors.text }]}>
            Dijital Makinacı kilitli
          </Text>
          <Text style={[styles.body, { color: t.colors.muted }]}>
            Devam etmek için cihaz kimliğinizi doğrulayın.
          </Text>
          <AppButton
            label="Kilidi aç"
            icon="finger-print-outline"
            onPress={unlock}
          />
        </View>
      </LockContext.Provider>
    );
  return (
    <LockContext.Provider value={context}>{children}</LockContext.Provider>
  );
}
export function useAppLock() {
  const value = useContext(LockContext);
  if (!value) throw new Error("AppLockProvider gerekli");
  return value;
}
const styles = StyleSheet.create({
  lock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    gap: 14,
  },
  logo: { fontSize: 38, fontWeight: "900" },
  title: { fontSize: 23, fontWeight: "900" },
  body: { textAlign: "center", fontSize: 14, marginBottom: 10 },
});
