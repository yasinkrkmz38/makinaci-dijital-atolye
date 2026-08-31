import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/AuthShell";
import { AppButton, FormField } from "@/components/ui";
import { useAuth } from "@/providers/auth-provider";
import { mfaSchema, type MfaForm } from "@/validation/schemas";

export default function Mfa() {
  const router = useRouter(),
    params=useLocalSearchParams<{invite?:string}>(),
    { mfaTicket, verifyMfa } = useAuth(),
    {
      control,
      handleSubmit,
      formState: { isSubmitting },
    } = useForm<MfaForm>({
      resolver: zodResolver(mfaSchema),
      defaultValues: { code: "" },
    });
  if (!mfaTicket) {
    router.replace("/(auth)/login");
    return null;
  }
  const submit = handleSubmit(async (values) => {
    try {
      await verifyMfa(values.code);
      router.replace(params.invite?{pathname:"/(app)/invite",params:{token:params.invite}}:"/(app)/(tabs)");
    } catch (error) {
      Alert.alert("Kod doğrulanamadı", (error as Error).message);
    }
  });
  return (
    <AuthShell
      title="İki adımlı doğrulama"
      subtitle="Kimlik doğrulama uygulamanızdaki 6 haneli kodu veya kurtarma kodunuzu girin."
    >
      <FormField
        control={control}
        name="code"
        label="Doğrulama kodu"
        keyboardType="number-pad"
      />
      <AppButton
        label="Doğrula ve devam et"
        onPress={submit}
        loading={isSubmitting}
      />
      <AppButton
        label="Girişe dön"
        onPress={() => router.replace("/(auth)/login")}
        variant="text"
      />
    </AuthShell>
  );
}
