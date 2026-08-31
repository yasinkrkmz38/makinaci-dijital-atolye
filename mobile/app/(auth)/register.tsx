import { Alert, Text } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/AuthShell";
import { AppButton, FormField } from "@/components/ui";
import { useAuth } from "@/providers/auth-provider";
import { registerSchema, type RegisterForm } from "@/validation/schemas";
import { useAppTheme } from "@/theme/tokens";

export default function Register() {
  const t = useAppTheme(),
    router = useRouter(),
    params=useLocalSearchParams<{invite?:string}>(),
    { register } = useAuth(),
    {
      control,
      handleSubmit,
      formState: { isSubmitting },
    } = useForm<RegisterForm>({
      resolver: zodResolver(registerSchema),
      defaultValues: { name: "", email: "", password: "" },
    });
  const submit = handleSubmit(async (values) => {
    try {
      await register(values.name, values.email, values.password);
      router.replace(params.invite?{pathname:"/(app)/invite",params:{token:params.invite}}:"/(app)/(tabs)");
    } catch (error) {
      Alert.alert("Hesap oluşturulamadı", (error as Error).message);
    }
  });
  return (
    <AuthShell
      title="Hesabınızı oluşturun"
      subtitle="E-posta doğrulaması isteğe bağlıdır; hesabınızı hemen kullanabilirsiniz."
    >
      <FormField
        control={control}
        name="name"
        label="Ad soyad"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
      />
      <FormField
        control={control}
        name="email"
        label="E-posta"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <FormField
        control={control}
        name="password"
        label="Güçlü şifre"
        secureTextEntry
        allowPasswordReveal
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={() => void submit()}
      />
      <AppButton
        label="Ücretsiz hesap oluştur"
        onPress={submit}
        loading={isSubmitting}
      />
      <Text style={{ color: t.colors.muted, textAlign: "center" }}>
        Zaten hesabınız var mı?{" "}
        <Link
          href="/(auth)/login"
          style={{ color: t.colors.primary, fontWeight: "900" }}
        >
          Giriş yapın
        </Link>
      </Text>
    </AuthShell>
  );
}
