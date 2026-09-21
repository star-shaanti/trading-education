import type { Metadata } from "next";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { Card } from "@/components/Card";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Section } from "@/components/Section";
import { formatDateTime, getDict, getLang, getVisitorTimezone, localizedAlternates, pick, timeZoneLabel } from "@/lib/i18n";
import { openGraphBase } from "@/lib/seo";
import { getPastWebinars, getUpcomingWebinars } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const lang = getLang();
  const t = getDict(lang);

  return {
    title: t.pages.webinarsTitle,
    description: t.pages.webinarsSubtitle,
    alternates: localizedAlternates(lang, "/webinaires"),
    openGraph: {
      ...openGraphBase(lang),
      title: t.pages.webinarsTitle,
      description: t.pages.webinarsSubtitle,
    },
  };
}

export default async function WebinairesPage() {
  const lang = getLang();
  const t = getDict(lang);

  const [upcoming, past] = await Promise.all([getUpcomingWebinars(6), getPastWebinars(6)]);
  const visitorTz = getVisitorTimezone();

  return (
    <>
      <Section title={t.pages.webinarsTitle} subtitle={t.pages.webinarsSubtitle}>
        <AnalyticsTracker />

        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {t.webinar.upcoming}
        </h2>

        {upcoming.length === 0 ? (
          <p className="mb-12 text-slate-600 dark:text-slate-300">{t.webinar.noUpcoming}</p>
        ) : (
          <div className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((webinar) => (
              <Card
                key={webinar.id}
                title={pick(lang, webinar.title, webinar.titleFr) ?? webinar.title}
                description={pick(lang, webinar.description, webinar.descriptionFr)?.slice(0, 160)}
                href={`/webinaires/${webinar.slug}`}
              >
                <div className="mt-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <p>
                    📅 {formatDateTime(webinar.startsAt, lang, visitorTz)} (
                    {timeZoneLabel(visitorTz)})
                  </p>
                  {webinar.capacity && (
                    <p>
                      {t.webinar.capacity} : {webinar._count.registrations}/{webinar.capacity}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 font-semibold text-brand-primary dark:text-indigo-300">
                    {t.webinar.register} →
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {t.webinar.past}
        </h2>

        {past.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-300">{t.webinar.noPast}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {past.map((webinar) => (
              <Card
                key={webinar.id}
                title={pick(lang, webinar.title, webinar.titleFr) ?? webinar.title}
                description={formatDateTime(webinar.startsAt, lang, visitorTz)}
                href={`/webinaires/${webinar.slug}`}
              >
                <span className="mt-4 inline-flex items-center gap-1 font-semibold text-brand-primary dark:text-indigo-300">
                  ▶ {t.webinar.replay}
                </span>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section variant="alt">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
            {t.newsletter.title}
          </h2>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">{t.newsletter.subtitle}</p>
          <NewsletterForm labels={t.newsletter} source="webinaires" />
        </div>
      </Section>
    </>
  );
}
