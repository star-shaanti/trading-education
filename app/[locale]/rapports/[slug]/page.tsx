import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { notFound } from "next/navigation";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { DownloadReportButton } from "@/components/DownloadReportButton";
import { Section } from "@/components/Section";
import { SITE_URL, formatDate, getDict, getLang, localizedAlternates, pick, withLocale } from "@/lib/i18n";
import { getRelatedReports, getReportBySlug } from "@/lib/queries";
import { authorJsonLd, openGraphBase } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const lang = getLang();
  const report = await getReportBySlug(params.slug);
  if (!report) return { title: "Rapport introuvable" };

  return {
    title: pick(lang, report.title, report.titleFr) ?? report.title,
    description: pick(lang, report.summary, report.summaryFr) ?? report.summary,
    alternates: localizedAlternates(lang, `/rapports/${report.slug}`),
    openGraph: {
      ...openGraphBase(lang, "article"),
      title: pick(lang, report.title, report.titleFr) ?? report.title,
      description: pick(lang, report.summary, report.summaryFr) ?? report.summary,
      url: `${SITE_URL}${withLocale(`/rapports/${report.slug}`, lang)}`,
    },
  };
}

export default async function ReportPage({ params }: { params: Params }) {
  const lang = getLang();
  const t = getDict(lang);
  const report = await getReportBySlug(params.slug);

  if (!report) notFound();

  const related = await getRelatedReports({ id: report.id, categoryId: report.categoryId });
  const title = pick(lang, report.title, report.titleFr) ?? report.title;
  const summary = pick(lang, report.summary, report.summaryFr) ?? report.summary;

  const jsonLd = {
    "@context": "https://schema.org",
    // « Report » n'existe pas dans schema.org : on décrit un Article
    // dont la ressource téléchargeable est un PDF (encodingFormat).
    "@type": "Article",
    headline: title,
    name: title,
    description: summary,
    inLanguage: lang,
    datePublished: report.publishedAt?.toISOString(),
    dateModified: report.updatedAt.toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/rapports/${report.slug}` },
    url: `${SITE_URL}/rapports/${report.slug}`,
    isAccessibleForFree: true,
    encodingFormat: "application/pdf",
    author: authorJsonLd(null),
    publisher: { "@type": "Organization", name: "Trading Education", url: SITE_URL },
    encoding: {
      "@type": "MediaObject",
      contentUrl: `${SITE_URL}/api/rapports/${report.slug}/telecharger`,
      encodingFormat: "application/pdf",
    },
  };

  return (
    <Section>
      <AnalyticsTracker entityType="report" entitySlug={report.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { name: t.navLinks.home, href: "/" },
            { name: t.navLinks.reports, href: "/rapports" },
            { name: title },
          ]}
        />
        <Link href="/rapports" className="text-sm text-brand-primary hover:underline">
          ← {t.common.backToList}
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">
          {title}
        </h1>

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {t.common.publishedOn} {formatDate(report.publishedAt, lang)}
          {report.periodLabel ? ` · ${t.report.period} : ${report.periodLabel}` : ""} ·{" "}
          {report.downloadCount} {t.report.downloads} · {t.common.free}
        </p>

        <p className="mt-6 text-lg text-slate-700 dark:text-slate-300">{summary}</p>

        <div className="mt-8">
          <DownloadReportButton
            reportSlug={report.slug}
            labels={t.report}
            newsletterLabels={t.newsletter}
          />
        </div>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {t.common.relatedContent}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Card
                  key={item.id}
                  title={pick(lang, item.title, item.titleFr) ?? item.title}
                  description={item.summary}
                  href={`/rapports/${item.slug}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
