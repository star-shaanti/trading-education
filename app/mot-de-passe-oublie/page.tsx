import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/PasswordForms";
import { Section } from "@/components/Section";
import { getDict, getLang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  robots: { index: false, follow: true },
};

export default function MotDePasseOubliePage() {
  const lang = getLang();
  const t = getDict(lang);

  return (
    <Section title={t.auth.forgotTitle}>
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <ForgotPasswordForm labels={t.auth} />
      </div>
    </Section>
  );
}
