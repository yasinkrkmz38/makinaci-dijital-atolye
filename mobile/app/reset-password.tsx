import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { AuthShell } from "@/components/AuthShell";
import { AppButton, ErrorState, FormField, Skeleton } from "@/components/ui";
import {
  resetPasswordSchema,
  type ResetPasswordForm,
} from "@/validation/schemas";

export default function ResetPassword() {
  const { token = "" } = useLocalSearchParams<{ token?: string }>(),
    router = useRouter(),
    validation = useQuery({
      queryKey: ["reset-password", token],
      queryFn: () =>
        api<{ valid: boolean }>(
          `/api/auth/reset-password/validate?token=${encodeURIComponent(token)}`,
          { auth: false },
        ),
      enabled: token.length >= 32,
      retry: false,
    }),
    { control, handleSubmit } = useForm<ResetPasswordForm>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: { password: "", confirmation: "" },
    }),
    mutation = useMutation({
      mutationFn: (values: ResetPasswordForm) =>
        api<{ ok: boolean }>("/api/auth/reset-password", {
          auth: false,
          method: "POST",
          body: JSON.stringify({ token, password: values.password }),
        }),
      onSuccess: () =>
        Alert.alert(
          "Şifreniz yenilendi",
          "Yeni şifrenizle giriş yapabilirsiniz.",
          [
            {
              text: "Giriş yap",
              onPress: () => router.replace("/(auth)/login"),
            },
          ],
        ),
      onError: (error) =>
        Alert.alert("Şifre yenilenemedi", error.message),
    });
  return (
    <AuthShell
      title="Yeni şifre belirleyin"
      subtitle="Bu işlem diğer cihazlardaki eski oturumları güvenle kapatır."
    >
      {!token || validation.isLoading ? (
        <Skeleton rows={2} />
      ) : validation.error || !validation.data?.valid ? (
        <ErrorState
          message={
            (validation.error as Error)?.message ||
            "Bu bağlantının süresi dolmuş veya daha önce kullanılmış."
          }
        />
      ) : (
        <>
          <FormField
            control={control}
            name="password"
            label="Yeni şifre"
            secureTextEntry
            allowPasswordReveal
          />
          <FormField
            control={control}
            name="confirmation"
            label="Yeni şifre tekrar"
            secureTextEntry
            allowPasswordReveal
          />
          <AppButton
            label="Şifreyi güvenle yenile"
            loading={mutation.isPending}
            onPress={handleSubmit((values) => mutation.mutate(values))}
          />
        </>
      )}
      <AppButton
        label="Giriş ekranına dön"
        variant="text"
        onPress={() => router.replace("/(auth)/login")}
      />
    </AuthShell>
  );
}
