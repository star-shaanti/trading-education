import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Requêtes de contenu partagées par les pages publiques (SEO + JSON-LD). */

export const PAGE_SIZE = 9;

/**
 * Les guides historiques (/guides/<id>) sont importés en base dans cette
 * catégorie : leurs articles restent canoniques sur /guides/<id>, et
 * /analyses/<slug> redirige vers eux (pas de contenu dupliqué).
 */
export const GUIDE_CATEGORY_SLUG = "guides-education";

export function isGuideArticle(categorySlug?: string | null): boolean {
  return categorySlug === GUIDE_CATEGORY_SLUG;
}

export type ArticleFilters = {
  category?: string;
  tag?: string;
  q?: string;
  page?: number;
};

export function articleWhere(filters: ArticleFilters): Prisma.ArticleWhereInput {
  const where: Prisma.ArticleWhereInput = { status: "PUBLISHED" };
  if (filters.category) where.category = { slug: filters.category };
  if (filters.tag) where.tags = { some: { slug: filters.tag } };
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { titleFr: { contains: filters.q, mode: "insensitive" } },
      { excerpt: { contains: filters.q, mode: "insensitive" } },
      { excerptFr: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  return where;
}

export async function getPublishedArticles(filters: ArticleFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const where = articleWhere(filters);

  try {
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: { category: true, tags: true },
      }),
      prisma.article.count({ where }),
    ]);
    return { articles, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
  } catch {
    return { articles: [], total: 0, page, pageCount: 1 };
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    return await prisma.article.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        category: true,
        tags: true,
        author: { select: { name: true, image: true } },
      },
    });
  } catch {
    return null;
  }
}

export async function getRelatedArticles(article: {
  id: string;
  categoryId: string | null;
  tags: Array<{ slug: string }>;
}) {
  const tagSlugs = article.tags.map((tag) => tag.slug);
  try {
    return await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        id: { not: article.id },
        OR: [
          ...(article.categoryId ? [{ categoryId: article.categoryId }] : []),
          ...(tagSlugs.length ? [{ tags: { some: { slug: { in: tagSlugs } } } }] : []),
        ],
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { category: true },
    });
  } catch {
    return [];
  }
}

export type ReportFilters = { category?: string; q?: string; page?: number };

export async function getPublishedReports(filters: ReportFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const where: Prisma.ReportWhereInput = { status: "PUBLISHED" };
  if (filters.category) where.category = { slug: filters.category };
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { titleFr: { contains: filters.q, mode: "insensitive" } },
      { summary: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  try {
    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: { category: true },
      }),
      prisma.report.count({ where }),
    ]);
    return { reports, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
  } catch {
    return { reports: [], total: 0, page, pageCount: 1 };
  }
}

export async function getReportBySlug(slug: string) {
  try {
    return await prisma.report.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { category: true, tags: true },
    });
  } catch {
    return null;
  }
}

export async function getRelatedReports(report: { id: string; categoryId: string | null }) {
  try {
    return await prisma.report.findMany({
      where: {
        status: "PUBLISHED",
        id: { not: report.id },
        ...(report.categoryId ? { categoryId: report.categoryId } : {}),
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, slug: true, title: true, titleFr: true, summary: true, publishedAt: true },
    });
  } catch {
    return [];
  }
}

export async function getUpcomingWebinars(limit = 6) {
  try {
    return await prisma.webinar.findMany({
      where: { status: { in: ["SCHEDULED", "LIVE"] }, publishedAt: { not: null } },
      orderBy: { startsAt: "asc" },
      take: limit,
      include: { category: true, _count: { select: { registrations: true } } },
    });
  } catch {
    return [];
  }
}

export async function getPastWebinars(limit = 6) {
  try {
    return await prisma.webinar.findMany({
      where: { status: "ENDED", replayUrl: { not: null } },
      orderBy: { startsAt: "desc" },
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        titleFr: true,
        startsAt: true,
        replayUrl: true,
        coverImage: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getWebinarBySlug(slug: string) {
  try {
    return await prisma.webinar.findFirst({
      where: { slug, publishedAt: { not: null } },
      include: { category: true, tags: true, _count: { select: { registrations: true } } },
    });
  } catch {
    return null;
  }
}

export async function getCategories(kind?: "ARTICLE" | "REPORT" | "WEBINAR") {
  try {
    return await prisma.category.findMany({
      where: kind ? { kind } : undefined,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch {
    return [];
  }
}

// ----------------- Statistiques d'accueil (bandeau) -------------------------

/** Compteurs publiés affichés sur la page d'accueil. */
export async function getHomeStats() {
  try {
    const [articles, guides, reports, webinars] = await Promise.all([
      prisma.article.count({
        where: { status: "PUBLISHED", NOT: { category: { slug: GUIDE_CATEGORY_SLUG } } },
      }),
      prisma.article.count({
        where: { status: "PUBLISHED", category: { slug: GUIDE_CATEGORY_SLUG } },
      }),
      prisma.report.count({ where: { status: "PUBLISHED" } }),
      prisma.webinar.count({ where: { publishedAt: { not: null } } }),
    ]);
    return { articles, guides, reports, webinars };
  } catch {
    return { articles: 0, guides: 0, reports: 0, webinars: 0 };
  }
}

/** Dernières analyses publiées (hors guides, qui ont leur propre page). */
export async function getLatestArticles(limit = 3) {
  try {
    return await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        NOT: { category: { slug: GUIDE_CATEGORY_SLUG } },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
      select: {
        slug: true,
        title: true,
        titleFr: true,
        excerpt: true,
        excerptFr: true,
        readingMinutes: true,
        publishedAt: true,
        category: { select: { name: true, nameFr: true, slug: true } },
      },
    });
  } catch {
    return [];
  }
}

/** Guides pédagogiques mis en avant. */
export async function getLatestGuides(limit = 3) {
  try {
    return await prisma.article.findMany({
      where: { status: "PUBLISHED", category: { slug: GUIDE_CATEGORY_SLUG } },
      orderBy: [{ publishedAt: "desc" }],
      take: limit,
      select: { slug: true, title: true, titleFr: true, excerpt: true, excerptFr: true, readingMinutes: true },
    });
  } catch {
    return [];
  }
}

/** Dernier rapport publié (téléchargement gratuit). */
export async function getLatestReport() {
  try {
    return await prisma.report.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        slug: true,
        title: true,
        titleFr: true,
        summary: true,
        summaryFr: true,
        periodLabel: true,
        downloadCount: true,
        publishedAt: true,
      },
    });
  } catch {
    return null;
  }
}

/** Prochain webinaire programmé. */
export async function getNextWebinar() {
  try {
    return await prisma.webinar.findFirst({
      where: { status: "SCHEDULED", publishedAt: { not: null }, startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      select: {
        slug: true,
        title: true,
        titleFr: true,
        description: true,
        descriptionFr: true,
        startsAt: true,
        timezone: true,
      },
    });
  } catch {
    return null;
  }
}
