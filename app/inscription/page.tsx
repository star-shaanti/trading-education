import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Section } from "@/components/Section";
import { getDict, getLang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Créer un compte gratuit",
  description:
    "Inscription gratuite : recevez les rapports par email, inscrivez-vous aux webinaires et commentez les analyses. Aucun paiement, aucune donnée bancaire.",
  alternates: { canonical: "/inscription" },
};

export default function InscriptionPage() {
  const lang = getLang();
  const t = getDict(lang);

  return (
    <Section
      title={t.auth.registerTitle}
      subtitle={
        lang === "fr"
          ? "Gratuit, sans engagement : le compte sert uniquement aux emails, aux webinaires et aux commentaires."
          : "Free, no commitment: the account is only used for emails, webinars and comments."
      }
    >
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <RegisterForm labels={t.auth} />
      </div>
    </Section>
  );
}
