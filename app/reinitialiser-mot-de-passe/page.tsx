import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/PasswordForms";
import { Section } from "@/components/Section";
import { getDict, getLang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
  robots: { index: false, follow: true },
};

export default function ReinitialiserMotDePassePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const lang = getLang();
  const t = getDict(lang);
  const token = searchParams.token ?? "";

  return (
    <Section title={t.auth.resetTitle}>
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        {token.length >= 10 ? (
          <ResetPasswordForm labels={t.auth} token={token} />
        ) : (
          <p className="text-sm text-red-600 dark:text-red-400">
            Lien invalide : demandez un nouveau lien depuis la page « {t.auth.forgotTitle} ».
          </p>
        )}
      </div>
    </Section>
  );
}
