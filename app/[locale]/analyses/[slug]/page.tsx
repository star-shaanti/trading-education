import type { Metadata } from "next";
import { Link } from "@/components/Link";
import { notFound, permanentRedirect } from "next/navigation";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card } from "@/components/Card";
import { CommentSection } from "@/components/CommentSection";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Section } from "@/components/Section";
import { getCurrentUser } from "@/lib/auth";
import { SITE_URL, formatDate, getDict, getLang, localizedAlternates, pick, withLocale } from "@/lib/i18n";
import { getArticleBySlug, getRelatedArticles, isGuideArticle } from "@/lib/queries";
import { authorJsonLd, OG_IMAGE, openGraphBase } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const lang = getLang();
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Analyse introuvable" };

  const title = pick(lang, article.title, article.titleFr) ?? article.title;
  const description = pick(lang, article.excerpt, article.excerptFr) ?? article.excerpt;

  return {
    title: article.seoTitle ?? title,
    description: article.seoDescription ?? description,
    alternates: localizedAlternates(lang, `/analyses/${article.slug}`),
    openGraph: {
      ...openGraphBase(lang, "article"),
      title,
      description,
      url: `${SITE_URL}${withLocale(`/analyses/${article.slug}`, lang)}`,
      publishedTime: article.publishedAt?.toISOString(),
      images: article.coverImage ? [article.coverImage] : [OG_IMAGE],
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const lang = getLang();
  const t = getDict(lang);
  const article = await getArticleBySlug(params.slug);

  if (!article) notFound();

  // Les guides pédagogiques ont leur page canonique : /guides/<slug>.
  if (isGuideArticle(article.category?.slug)) {
    permanentRedirect(withLocale(`/guides/${article.slug}`, lang));
  }

  const [related, user] = await Promise.all([
    getRelatedArticles({ id: article.id, categoryId: article.categoryId, tags: article.tags }),
    getCurrentUser(),
  ]);

  const title = pick(lang, article.title, article.titleFr) ?? article.title;
  const excerpt = pick(lang, article.excerpt, article.excerptFr) ?? article.excerpt;
  const content = pick(lang, article.contentHtml, article.contentHtmlFr) ?? article.contentHtml;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    inLanguage: lang,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${withLocale(`/analyses/${article.slug}`, lang)}` },
    image: article.coverImage ? [article.coverImage] : undefined,
    author: authorJsonLd(article.author?.name),
    publisher: { "@type": "Organization", name: "Trading Education", url: SITE_URL },
    articleSection: article.category
      ? pick(lang, article.category.name, article.category.nameFr)
      : undefined,
    keywords: article.tags.map((tag) => tag.name).join(", "),
    isAccessibleForFree: true,
  };

  return (
    <Section>
      <AnalyticsTracker entityType="article" entitySlug={article.slug} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { name: t.navLinks.home, href: "/" },
            { name: t.navLinks.analyses, href: "/analyses" },
            { name: title },
          ]}
        />
        <Link href="/analyses" className="text-sm text-brand-primary hover:underline">
          ← {t.common.backToList}
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">
          {title}
        </h1>

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {t.common.publishedOn} {formatDate(article.publishedAt, lang)} · {article.readingMinutes}{" "}
          {t.article.readingTime}
          {article.author?.name ? ` · ${t.common.by} ${article.author.name}` : ""} · {t.common.free}
        </p>

        <p className="mt-6 text-lg text-slate-700 dark:text-slate-300">{excerpt}</p>

        {article.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImage}
            alt={title}
            className="mt-8 w-full rounded-2xl border border-slate-200 dark:border-slate-800"
          />
        )}

        <div className="prose-custom mt-8" dangerouslySetInnerHTML={{ __html: content }} />

        {article.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {t.common.tags} :
            </span>
            {article.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/analyses?q=${encodeURIComponent(tag.name)}`}
                className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        <CommentSection
          articleSlug={article.slug}
          labels={t.article}
          isAuthenticated={Boolean(user)}
        />

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
                  description={pick(lang, item.excerpt, item.excerptFr) ?? item.excerpt}
                  href={`/analyses/${item.slug}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-14 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-6">
          <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
            {t.newsletter.title}
          </h2>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">{t.newsletter.subtitle}</p>
          <NewsletterForm labels={t.newsletter} source="analyse" compact />
        </div>
      </article>
    </Section>
  );
}
