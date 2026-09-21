import { Link } from "@/components/Link";
import { FeatureCard } from "@/components/home/FeatureCard";
import { CardGrid, SectionHeading } from "@/components/home/SectionHeading";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Section } from "@/components/Section";
import { formatDate, formatDateTime, getDict, getLang, pick } from "@/lib/i18n";
import {
  getLatestArticles,
  getLatestGuides,
  getLatestReport,
  getNextWebinar,
} from "@/lib/queries";

/**
 * Bloc éditorial de la page d'accueil, rendu côté serveur : dernières analyses,
 * dernier rapport PDF, prochain webinaire et guides pédagogiques — présentés
 * dans les mêmes cartes que le reste du site (maillage interne + SEO).
 * Silencieux si la base est vide ou indisponible.
 */
export async function LatestContent() {
  const lang = getLang();
  const t = getDict(lang);

  const [articles, guides, report, webinar] = await Promise.all([
    getLatestArticles(3),
    getLatestGuides(3),
    getLatestReport(),
    getNextWebinar(),
  ]);

  if (articles.length === 0 && guides.length === 0 && !report && !webinar) {
    return null;
  }

  return (
    <Section>
      <SectionHeading
        eyebrow={t.home.publicationsEyebrow}
        title={t.home.publicationsTitle}
        subtitle={t.home.publicationsSubtitle}
        linkHref="/analyses"
        linkLabel={t.nav.analyses}
      />

      <CardGrid columns={3}>
        {articles.map((article) => (
          <FeatureCard
            key={article.slug}
            icon="📰"
            badge={
              pick(lang, article.category?.name, article.category?.nameFr) ?? t.nav.analyses
            }
            title={pick(lang, article.title, article.titleFr) ?? article.title}
            description={pick(lang, article.excerpt, article.excerptFr) ?? article.excerpt}
            href={`/analyses/${article.slug}`}
            tags={[
              formatDate(article.publishedAt, lang),
              `${article.readingMinutes} ${t.article.readingTime}`,
            ]}
            cta={t.common.readMore}
          />
        ))}

        {report && (
          <FeatureCard
            icon="📄"
            badge={t.home.statsReports}
            title={pick(lang, report.title, report.titleFr) ?? report.title}
            description={pick(lang, report.summary, report.summaryFr) ?? report.summary}
            href={`/rapports/${report.slug}`}
            tags={[
              `${report.downloadCount} ${t.report.downloads}`,
              ...(report.periodLabel ? [report.periodLabel] : []),
            ]}
            cta={t.report.downloadPdf}
          />
        )}

        {webinar && (
          <FeatureCard
            icon="🎥"
            badge={t.webinar.upcoming}
            title={pick(lang, webinar.title, webinar.titleFr) ?? webinar.title}
            description={pick(lang, webinar.description, webinar.descriptionFr) ?? webinar.description}
            href={`/webinaires/${webinar.slug}`}
            tags={[formatDateTime(webinar.startsAt, lang), webinar.timezone, t.webinar.freeAccess]}
            cta={t.webinar.register}
          />
        )}

        {guides.length > 0 && (
          <div className="card flex h-full flex-col p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800" aria-hidden="true">
              🎓
            </span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t.home.guideListTitle}
            </h3>
            <ul className="mt-3 flex-1 space-y-2 text-sm">
              {guides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="text-slate-700 hover:text-brand-primary dark:text-slate-300"
                  >
                    → {pick(lang, guide.title, guide.titleFr) ?? guide.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/guides"
              className="mt-4 inline-block text-sm font-medium text-brand-primary dark:text-indigo-300"
            >
              {t.home.guideListAll} →
            </Link>
          </div>
        )}
      </CardGrid>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {t.newsletter.title}
        </h3>
        <p className="mt-1 mb-4 text-sm text-slate-600 dark:text-slate-400">
          {t.newsletter.subtitle}
        </p>
        <NewsletterForm labels={t.newsletter} source="accueil" compact />
      </div>
    </Section>
  );
}
