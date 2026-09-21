import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { Card } from "@/components/Card";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Section } from "@/components/Section";
import { formatDate, getDict, getLang, localizedAlternates, pick } from "@/lib/i18n";
import { openGraphBase } from "@/lib/seo";
import { getCategories, getPublishedArticles, isGuideArticle } from "@/lib/queries";
import { buttonSecondaryClass, inputClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

type SearchParams = { q?: string; categorie?: string; page?: string };

/**
 * Métadonnées de la liste : pagination auto-canonique, filtres de recherche en
 * `noindex` (évite le contenu dupliqué généré par les paramètres d'URL).
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
    title: t.pages.analysesTitle,
    description: t.pages.analysesSubtitle,
    alternates: localizedAlternates(lang, query ? `/analyses?${query}` : "/analyses"),
    robots: isFiltered
      ? { index: false, follow: true }
      : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      ...openGraphBase(lang),
      title: t.pages.analysesTitle,
      description: t.pages.analysesSubtitle,
    },
  };
}

export default async function AnalysesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const lang = getLang();
  const t = getDict(lang);
  const page = Math.max(1, Number(searchParams.page ?? 1) || 1);

  const [{ articles, total, pageCount }, categories] = await Promise.all([
    getPublishedArticles({ q: searchParams.q, category: searchParams.categorie, page }),
    getCategories("ARTICLE"),
  ]);

  const baseQuery = (extra: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    if (searchParams.q) params.set("q", searchParams.q);
    if (searchParams.categorie) params.set("categorie", searchParams.categorie);
    for (const [key, value] of Object.entries(extra)) {
      if (value !== undefined) params.set(key, String(value));
    }
    const query = params.toString();
    return query ? `/analyses?${query}` : "/analyses";
  };

  return (
    <Section
      title={t.pages.analysesTitle}
      subtitle={t.pages.analysesSubtitle}
    >
      <AnalyticsTracker />

      <form action="/analyses" method="get" className="mb-8 grid gap-3 md:grid-cols-[2fr_1fr_auto]">
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

      {articles.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-300">{t.common.noResults}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const guide = isGuideArticle(article.category?.slug);
            return (
              <Card
                key={article.id}
                title={pick(lang, article.title, article.titleFr) ?? article.title}
                description={pick(lang, article.excerpt, article.excerptFr) ?? article.excerpt}
                // Les guides gardent /guides/<slug> comme URL canonique.
                href={guide ? `/guides/${article.slug}` : `/analyses/${article.slug}`}
              >
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  {guide && (
                    <span className="rounded-full bg-brand-primary/10 dark:bg-indigo-900/40 px-2 py-0.5 font-semibold text-brand-primary dark:text-indigo-300">
                      {lang === "fr" ? "Guide" : "Guide"}
                    </span>
                  )}
                  {article.category && (
                    <span className="rounded-full bg-slate-200/70 dark:bg-slate-800 px-2 py-0.5">
                      {pick(lang, article.category.name, article.category.nameFr) ??
                        article.category.name}
                    </span>
                  )}
                  <span>
                    {formatDate(article.publishedAt, lang)} · {article.readingMinutes}{" "}
                    {t.article.readingTime}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {pageCount > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Pagination">
          {page > 1 && (
            <Link href={baseQuery({ page: page - 1 })} className={buttonSecondaryClass}>
              ← {t.common.previous}
            </Link>
          )}
          <span className="text-sm text-slate-600 dark:text-slate-300">
            {t.common.page} {page} / {pageCount}
          </span>
          {page < pageCount && (
            <Link href={baseQuery({ page: page + 1 })} className={buttonSecondaryClass}>
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
        <NewsletterForm labels={t.newsletter} source="analyses" />
      </div>
    </Section>
  );
}
