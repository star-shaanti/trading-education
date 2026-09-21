import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { Card } from "@/components/Card";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Section } from "@/components/Section";
import { formatDate, getDict, getLang, localizedAlternates, pick } from "@/lib/i18n";
import { openGraphBase } from "@/lib/seo";
import { getCategories, getPublishedReports } from "@/lib/queries";
import { buttonSecondaryClass, inputClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

type SearchParams = { q?: string; categorie?: string; page?: string };

/**
 * Métadonnées de la liste : pagination auto-canonique, filtres en `noindex`.
 * Titres et descriptions suivent la langue de l'interface.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const lang = getLang();
  const t = getDict(lang);
  const page = Math.max(1, Number(searchParams.page ?? 1) || 1);
  const isFiltered = Boolean(searchParams.q || searchParams.categorie);

  const params = new URLSearchParams();
  if (searchParams.categorie) params.set("categorie", searchParams.categorie);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();

  return {
    title: t.pages.reportsTitle,
    description: t.pages.reportsSubtitle,
    alternates: localizedAlternates(lang, query ? `/rapports?${query}` : "/rapports"),
    robots: isFiltered
      ? { index: false, follow: true }
      : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      ...openGraphBase(lang),
      title: t.pages.reportsTitle,
      description: t.pages.reportsSubtitle,
    },
  };
}

export default async function RapportsPage({ searchParams }: { searchParams: SearchParams }) {
  const lang = getLang();
  const t = getDict(lang);
  const page = Math.max(1, Number(searchParams.page ?? 1) || 1);

  const [{ reports, total, pageCount }, categories] = await Promise.all([
    getPublishedReports({ q: searchParams.q, category: searchParams.categorie, page }),
    getCategories("REPORT"),
  ]);

  return (
    <Section title={t.pages.reportsTitle} subtitle={t.pages.reportsSubtitle}>
      <AnalyticsTracker />

      <form action="/rapports" method="get" className="mb-8 grid gap-3 md:grid-cols-[2fr_1fr_auto]">
        <input
          type="search"
          name="q"
          defaultValue={searchParams.q ?? ""}
          placeholder={t.common.searchPlaceholder}
          aria-label={t.common.search}
          className={inputClass}
        />
        <select
          name="categorie"
          defaultValue={searchParams.categorie ?? ""}
          aria-label={t.common.category}
          className={inputClass}
        >
          <option value="">{t.common.allCategories}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {pick(lang, category.name, category.nameFr) ?? category.name}
            </option>
          ))}
        </select>
        <button type="submit" className={buttonSecondaryClass}>
          {t.common.filter}
        </button>
      </form>

      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        {total} {t.common.results}
      </p>

      {reports.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-300">{t.common.noResults}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Card
              key={report.id}
              title={pick(lang, report.title, report.titleFr) ?? report.title}
              description={pick(lang, report.summary, report.summaryFr) ?? report.summary}
              href={`/rapports/${report.slug}`}
            >
              <div className="mt-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {report.periodLabel && <p>{report.periodLabel}</p>}
                <p>
                  {formatDate(report.publishedAt, lang)} · {report.downloadCount}{" "}
                  {t.report.downloads}
                </p>
                <span className="inline-flex items-center gap-1 font-semibold text-brand-primary dark:text-indigo-300">
                  ⬇ {t.report.downloadPdf}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Pagination">
          {page > 1 && (
            <Link href={`/rapports?page=${page - 1}`} className={buttonSecondaryClass}>
              ← {t.common.previous}
            </Link>
          )}
          <span className="text-sm text-slate-600 dark:text-slate-300">
            {t.common.page} {page} / {pageCount}
          </span>
          {page < pageCount && (
            <Link href={`/rapports?page=${page + 1}`} className={buttonSecondaryClass}>
              {t.common.next} →
            </Link>
          )}
        </nav>
      )}

      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
          {t.newsletter.title}
        </h2>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">{t.newsletter.subtitle}</p>
        <NewsletterForm labels={t.newsletter} source="rapports" />
      </div>
    </Section>
  );
}
