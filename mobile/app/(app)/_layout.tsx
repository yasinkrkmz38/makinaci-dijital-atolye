import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/auth-provider";
export default function PrivateLayout() {
  const { user, loading } = useAuth();
  if (!loading && !user) return <Redirect href="/(auth)/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
