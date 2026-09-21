import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { Section } from "@/components/Section";
import { getDict, getLang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: true },
};

export default function ConnexionPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const lang = getLang();
  const t = getDict(lang);

  return (
    <Section title={t.auth.loginTitle} subtitle={t.newsletter.subtitle}>
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <LoginForm labels={t.auth} callbackUrl={searchParams.callbackUrl} />
      </div>
    </Section>
  );
}
