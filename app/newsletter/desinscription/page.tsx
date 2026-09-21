import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { Section } from "@/components/Section";
import { UnsubscribeForm } from "@/components/UnsubscribeForm";
import { getDict, getLang } from "@/lib/i18n";
import { successClass } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Désinscription",
  robots: { index: false, follow: true },
};

/** Désinscription (lien présent dans chaque email + formulaire par email). */
export default function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: { etat?: string };
}) {
  const lang = getLang();
  const t = getDict(lang);
  const ok = searchParams.etat === "ok";

  return (
    <Section
      title={t.newsletter.unsubscribe}
      subtitle={t.pages.unsubscribeSubtitle}
    >
      <div className="mx-auto max-w-xl space-y-6">
        {ok && <p className={successClass}>{t.newsletter.unsubscribeSuccess}</p>}

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
            {t.pages.unsubscribeHint}
          </p>
          <UnsubscribeForm labels={t.newsletter} />
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          <Link href="/" className="text-brand-primary hover:underline">
            <span className="inline-block rtl:-scale-x-100" aria-hidden="true">
              ←
            </span>{" "}
            {t.pages.backHome}
          </Link>
        </p>
      </div>
    </Section>
  );
}
