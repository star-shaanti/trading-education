import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { Section } from "@/components/Section";
import { getDict, getLang } from "@/lib/i18n";
import { buttonClass, errorClass, successClass } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Confirmation d'inscription",
  robots: { index: false, follow: true },
};

/** Page de retour après clic sur le lien de confirmation (double opt-in). */
export default function NewsletterConfirmationPage({
  searchParams,
}: {
  searchParams: { etat?: string };
}) {
  const lang = getLang();
  const t = getDict(lang);
  const ok = searchParams.etat === "ok";

  return (
    <Section title={t.pages.confirmationTitle}>
      <div className="mx-auto max-w-xl space-y-6">
        {ok ? (
          <p className={successClass}>
            ✅ {t.pages.confirmationOk}
          </p>
        ) : (
          <p className={errorClass}>{t.pages.confirmationInvalid}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <Link href="/analyses" className={buttonClass}>
            {t.nav.analyses}
          </Link>
          <Link href="/rapports" className={buttonClass}>
            {t.nav.reports}
          </Link>
        </div>
      </div>
    </Section>
  );
}
