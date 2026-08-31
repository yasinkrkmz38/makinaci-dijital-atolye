import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/AuthShell";
import { AppButton, FormField } from "@/components/ui";
import { useAuth } from "@/providers/auth-provider";
import { forgotSchema, type ForgotForm } from "@/validation/schemas";

export default function Forgot() {
  const router = useRouter(),
    { forgotPassword } = useAuth(),
    {
      control,
      handleSubmit,
      formState: { isSubmitting },
    } = useForm<ForgotForm>({
      resolver: zodResolver(forgotSchema),
      defaultValues: { email: "" },
    });
  const submit = handleSubmit(async (values) => {
    try {
      const message = await forgotPassword(values.email);
      Alert.alert("Talep alındı", message, [
        { text: "Girişe dön", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (error) {
      Alert.alert("Gönderilemedi", (error as Error).message);
    }
  });
  return (
    <AuthShell
      title="Şifrenizi yenileyin"
      subtitle="Hesabınız varsa güvenli sıfırlama bağlantısını e-posta adresinize göndereceğiz."
    >
      <FormField
        control={control}
        name="email"
        label="E-posta"
        keyboardType="email-address"
      />
      <AppButton
        label="Sıfırlama bağlantısı gönder"
        onPress={submit}
        loading={isSubmitting}
      />
      <AppButton
        label="Girişe dön"
        onPress={() => router.back()}
        variant="text"
      />
    </AuthShell>
  );
}
