import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/providers/auth-provider";
import { palette } from "@/theme/tokens";

export default function Index() {
  const { user, loading } = useAuth(),
    [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);
  useEffect(() => {
    AsyncStorage.getItem("dm_onboarding_v1").then((value) =>
      setOnboardingSeen(value === "done"),
    );
  }, []);
  if (loading || onboardingSeen === null)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={palette.blue} />
      </View>
    );
  if (!onboardingSeen) return <Redirect href="/onboarding" />;
  return <Redirect href={user ? "/(app)/(tabs)" : "/(auth)/login"} />;
}
