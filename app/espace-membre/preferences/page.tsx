import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { redirect } from "next/navigation";
import { MemberPreferencesForm } from "@/components/member/MemberPreferencesForm";
import { Section } from "@/components/Section";
import { getCurrentUser } from "@/lib/auth";
import { getDict, getLang } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Préférences email",
  robots: { index: false, follow: false },
};

export default async function PreferencesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?callbackUrl=/espace-membre/preferences");

  const lang = getLang();
  const t = getDict(lang);

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { newsletterOptIn: true, reportsOptIn: true, webinarsOptIn: true },
  });

  return (
    <Section title={t.member.preferences}>
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/espace-membre" className="text-sm text-brand-primary hover:underline">
          ← {t.member.title}
        </Link>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <MemberPreferencesForm
            labels={t.member}
            confirmLabels={t.confirm}
            initial={{
              newsletterOptIn: profile?.newsletterOptIn ?? true,
              reportsOptIn: profile?.reportsOptIn ?? true,
              webinarsOptIn: profile?.webinarsOptIn ?? true,
            }}
          />
        </div>
      </div>
    </Section>
  );
}
