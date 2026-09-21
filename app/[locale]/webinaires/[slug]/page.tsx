import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { notFound } from "next/navigation";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Section } from "@/components/Section";
import { WebinarRegisterForm } from "@/components/WebinarRegisterForm";
import { getCurrentUser } from "@/lib/auth";
import { SITE_URL, formatDateTime, getDict, getLang, getVisitorTimezone, localizedAlternates, pick, timeZoneLabel, withLocale } from "@/lib/i18n";
import { getWebinarBySlug } from "@/lib/queries";
import { openGraphBase } from "@/lib/seo";
import { badgeClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const lang = getLang();
  const webinar = await getWebinarBySlug(params.slug);
  if (!webinar) return { title: "Webinaire introuvable" };

  return {
    title: pick(lang, webinar.title, webinar.titleFr) ?? webinar.title,
    description: (pick(lang, webinar.description, webinar.descriptionFr) ?? webinar.description).slice(
      0,
      300
    ),
    alternates: localizedAlternates(lang, `/webinaires/${webinar.slug}`),
    openGraph: {
      ...openGraphBase(lang, "article"),
      title: pick(lang, webinar.title, webinar.titleFr) ?? webinar.title,
      description: (pick(lang, webinar.description, webinar.descriptionFr) ?? webinar.description).slice(
        0,
        300
      ),
      url: `${SITE_URL}${withLocale(`/webinaires/${webinar.slug}`, lang)}`,
    },
  };
}

export default async function WebinarPage({ params }: { params: Params }) {
  const lang = getLang();
  const t = getDict(lang);
  const webinar = await getWebinarBySlug(params.slug);

  if (!webinar) notFound();

  const user = await getCurrentUser();
  const visitorTz = getVisitorTimezone();
  const title = pick(lang, webinar.title, webinar.titleFr) ?? webinar.title;
  const description = pick(lang, webinar.description, webinar.descriptionFr) ?? webinar.description;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: title,
    description: description.slice(0, 500),
    inLanguage: lang,
    startDate: webinar.startsAt.toISOString(),
    endDate: (webinar.endsAt ?? new Date(webinar.startsAt.getTime() + 3600_000)).toISOString(),
    eventStatus:
      webinar.status === "CANCELED"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    isAccessibleForFree: true,
    url: `${SITE_URL}/webinaires/${webinar.slug}`,
    location: {
      "@type": "VirtualLocation",
      url: webinar.joinUrl ?? `${SITE_URL}/webinaires/${webinar.slug}`,
    },
    organizer: { "@type": "Organization", name: "Trading Education", url: SITE_URL },
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/webinaires/${webinar.slug}`,
    },
  };

  return (
    <Section>
      <AnalyticsTracker entityType="webinar" entitySlug={webinar.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { name: t.navLinks.home, href: "/" },
            { name: t.navLinks.webinars, href: "/webinaires" },
            { name: title },
          ]}
        />
        <Link href="/webinaires" className="text-sm text-brand-primary hover:underline">
          ← {t.common.backToList}
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className={badgeClass}>{t.webinar.freeAccess}</span>
          {webinar.status === "LIVE" && <span className={badgeClass}>🔴 LIVE</span>}
        </div>

        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">
          {title}
        </h1>

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          📅 {formatDateTime(webinar.startsAt, lang, visitorTz)} ({timeZoneLabel(visitorTz)}) ·{" "}
          {t.webinar.timezone} : {webinar.timezone}
        </p>

        <div
          className="prose-custom mt-6"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-6">
          {webinar.status === "ENDED" ? (
            webinar.replayUrl ? (
              <a
                href={webinar.replayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-primary hover:bg-brand-primary-700 px-5 py-2.5 text-sm font-medium text-white"
              >
                ▶ {t.webinar.replay}
              </a>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300">{t.webinar.noPast}</p>
            )
          ) : (
            <>
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
                {t.webinar.register}
              </h2>
              <WebinarRegisterForm
                webinarSlug={webinar.slug}
                labels={t.webinar}
                authLabels={t.auth}
                isAuthenticated={Boolean(user)}
                memberEmail={user?.email}
                joinUrl={webinar.joinUrl}
              />
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
