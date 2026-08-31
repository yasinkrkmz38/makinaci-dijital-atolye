import { AppState, Platform } from "react-native";
import * as Network from "expo-network";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { getQueue, syncQueue } from "@/services/offline-queue";
import { useAuth } from "./auth-provider";

type NetworkState = {
  online: boolean;
  pending: number;
  syncing: boolean;
  refresh: () => Promise<void>;
  sync: () => Promise<void>;
};
const NetworkContext = createContext<NetworkState | null>(null);
export function NetworkProvider({ children }: PropsWithChildren) {
  const { user } = useAuth(),
    [online, setOnline] = useState(true),
    [pending, setPending] = useState(0),
    [syncing, setSyncing] = useState(false);
  const refresh = useCallback(async () => {
    const state = await Network.getNetworkStateAsync();
    setOnline(
      state.isConnected !== false && state.isInternetReachable !== false,
    );
    if (user) setPending((await getQueue(user.id)).length);
    else setPending(0);
  }, [user]);
  const sync = useCallback(async () => {
    if (!user || !online || syncing) return;
    setSyncing(true);
    try {
      const result = await syncQueue(user.id);
      setPending(result.pending);
    } finally {
      setSyncing(false);
    }
  }, [user, online, syncing]);
  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 15000),
      sub = AppState.addEventListener("change", (state) => {
        if (state === "active") refresh();
      });
    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, [refresh]);
  useEffect(() => {
    if (online && pending) sync();
  }, [online, pending, sync]);
  const value = useMemo(
    () => ({ online, pending, syncing, refresh, sync }),
    [online, pending, syncing, refresh, sync],
  );
  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
}
export function useNetwork() {
  const value = useContext(NetworkContext);
  if (!value) throw new Error("NetworkProvider gerekli");
  return value;
}
export const mobilePlatform = Platform.OS;
