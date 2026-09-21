import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { redirect } from "next/navigation";
import { Section } from "@/components/Section";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatDateTime, getDict, getLang, pick } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { buttonSecondaryClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Espace membre",
  robots: { index: false, follow: false },
};

export default async function EspaceMembrePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?callbackUrl=/espace-membre");

  const lang = getLang();
  const t = getDict(lang);

  const [profile, downloads, registrations, upcoming] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        createdAt: true,
        newsletterOptIn: true,
        reportsOptIn: true,
        webinarsOptIn: true,
      },
    }),
    prisma.reportDownload.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { report: { select: { slug: true, title: true, titleFr: true } } },
    }),
    prisma.webinarRegistration.findMany({
      where: { userId: user.id, status: "REGISTERED", webinar: { startsAt: { gte: new Date() } } },
      orderBy: { webinar: { startsAt: "asc" } },
      include: { webinar: { select: { slug: true, title: true, titleFr: true, startsAt: true } } },
    }),
    prisma.webinar.findMany({
      where: { status: "SCHEDULED", publishedAt: { not: null }, startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      take: 3,
      select: { id: true, slug: true, title: true, titleFr: true, startsAt: true },
    }),
  ]);

  const prefs = [
    { label: t.member.newsletterOptIn, value: profile?.newsletterOptIn },
    { label: t.member.reportsOptIn, value: profile?.reportsOptIn },
    { label: t.member.webinarsOptIn, value: profile?.webinarsOptIn },
  ];

  return (
    <Section title={t.member.title}>
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {user.name ?? user.email}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.member.memberSince} {formatDate(profile?.createdAt, lang)}
                {user.role === "ADMIN" ? " · Admin" : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/espace-membre/preferences" className={buttonSecondaryClass}>
                {t.member.preferences}
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin" className={buttonSecondaryClass}>
                  {t.nav.admin}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              {t.member.upcomingWebinars}
            </h2>
            {registrations.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.member.noWebinars}</p>
            ) : (
              <ul className="space-y-3">
                {registrations.map((registration) => (
                  <li key={registration.id} className="text-sm">
                    <Link
                      href={`/webinaires/${registration.webinar.slug}`}
                      className="font-medium text-brand-primary hover:underline"
                    >
                      {pick(lang, registration.webinar.title, registration.webinar.titleFr)}
                    </Link>
                    <span className="ms-2 text-slate-500 dark:text-slate-400">
                      {formatDateTime(registration.webinar.startsAt, lang)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {upcoming.length > 0 && (
              <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t.webinar.upcoming}
                </p>
                <ul className="space-y-2 text-sm">
                  {upcoming.map((webinar) => (
                    <li key={webinar.id}>
                      <Link
                        href={`/webinaires/${webinar.slug}`}
                        className="text-slate-700 dark:text-slate-200 hover:text-brand-primary"
                      >
                        {pick(lang, webinar.title, webinar.titleFr)}
                      </Link>{" "}
                      <span className="text-slate-400">
                        {formatDateTime(webinar.startsAt, lang)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
              {t.member.downloadHistory}
            </h2>
            {downloads.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">{t.member.noDownloads}</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {downloads.map((download) => (
                  <li key={download.id} className="flex items-center justify-between gap-3">
                    <Link
                      href={`/rapports/${download.report.slug}`}
                      className="text-slate-700 dark:text-slate-200 hover:text-brand-primary"
                    >
                      {pick(lang, download.report.title, download.report.titleFr)}
                    </Link>
                    <span className="flex-shrink-0 text-xs text-slate-400">
                      {formatDate(download.createdAt, lang)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
            {t.member.emailPrefs}
          </h2>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {prefs.map((pref) => (
              <li key={pref.label}>
                {pref.value ? "✅" : "⬜"} {pref.label}
              </li>
            ))}
          </ul>
          <Link
            href="/espace-membre/preferences"
            className="mt-4 inline-block text-sm font-medium text-brand-primary hover:underline"
          >
            {t.member.preferences} →
          </Link>
        </div>
      </div>
    </Section>
  );
}
