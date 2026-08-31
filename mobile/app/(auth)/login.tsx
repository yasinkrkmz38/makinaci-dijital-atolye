import { Alert, Text } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/AuthShell";
import { AppButton, FormField } from "@/components/ui";
import { useAuth } from "@/providers/auth-provider";
import { loginSchema, type LoginForm } from "@/validation/schemas";
import { useAppTheme } from "@/theme/tokens";

export default function Login() {
  const t = useAppTheme(),
    router = useRouter(),
    params=useLocalSearchParams<{invite?:string}>(),
    { login, sessionExpired } = useAuth(),
    {
      control,
      handleSubmit,
      formState: { isSubmitting },
    } = useForm<LoginForm>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: "", password: "" },
    });
  const submit = handleSubmit(async (values) => {
    try {
      const result = await login(values.email, values.password);
        router.replace(result === "mfa" ? {pathname:"/(auth)/mfa",params:{invite:params.invite||''}} : params.invite?{pathname:"/(app)/invite",params:{token:params.invite}}:"/(app)/(tabs)");
    } catch (error) {
      Alert.alert("Giriş yapılamadı", (error as Error).message);
    }
  });
  return (
    <AuthShell
      title="Tekrar hoş geldiniz"
      subtitle="Bakım operasyonlarınıza güvenli şekilde devam edin."
    >
      {sessionExpired ? (
        <Text
          style={{
            color: t.colors.danger,
            textAlign: "center",
            fontWeight: "800",
          }}
        >
          Güvenli oturumunuzun süresi doldu. Lütfen yeniden giriş yapın.
        </Text>
      ) : null}
      <FormField
        control={control}
        name="email"
        label="E-posta"
        placeholder="ornek@firma.com"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <FormField
        control={control}
        name="password"
        label="Şifre"
        secureTextEntry
        allowPasswordReveal
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={() => void submit()}
      />
      <AppButton label="Giriş yap" onPress={submit} loading={isSubmitting} />
      <Link
        href="/(auth)/forgot"
        style={{
          color: t.colors.primary,
          fontWeight: "800",
          textAlign: "center",
        }}
      >
        Şifremi unuttum
      </Link>
      <Text style={{ color: t.colors.muted, textAlign: "center" }}>
        Hesabınız yok mu?{" "}
        <Link
          href={params.invite?{pathname:"/(auth)/register",params:{invite:params.invite}}:"/(auth)/register"}
          style={{ color: t.colors.primary, fontWeight: "900" }}
        >
          Hesap oluşturun
        </Link>
      </Text>
    </AuthShell>
  );
}
