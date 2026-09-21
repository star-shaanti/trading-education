import { prisma } from "@/lib/prisma";
import { notifyNewReport } from "@/lib/campaigns";
import type { ArticleInput, ReportInput, WebinarInput } from "@/lib/validation";

/** Helpers partagés par les routes d'administration (CRUD des contenus). */

export function tagConnect(tags: string[] | undefined) {
  const unique = Array.from(
    new Set(
      (tags ?? [])
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length >= 2)
        .map((tag) => tag.replace(/\s+/g, "-"))
    )
  );

  return unique.map((slug) => ({
    where: { slug },
    create: { slug, name: slug.replace(/-/g, " ") },
  }));
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/** Aucun slug en double : suffixe numérique automatique si nécessaire. */
export async function uniqueSlug(
  model: "article" | "report" | "webinar",
  slug: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(slug) || "contenu";
  let candidate = base;

  for (let attempt = 0; attempt < 25; attempt += 1) {
    const existing =
      model === "article"
        ? await prisma.article.findUnique({ where: { slug: candidate }, select: { id: true } })
        : model === "report"
        ? await prisma.report.findUnique({ where: { slug: candidate }, select: { id: true } })
        : await prisma.webinar.findUnique({ where: { slug: candidate }, select: { id: true } });

    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${attempt + 2}`;
  }

  return `${base}-${Date.now()}`;
}

export async function saveArticle(input: ArticleInput) {
  const slug = await uniqueSlug("article", input.slug, input.id);
  const isPublished = input.status === "PUBLISHED";

  const data = {
    slug,
    title: input.title,
    titleFr: input.titleFr || null,
    excerpt: input.excerpt,
    excerptFr: input.excerptFr || null,
    contentHtml: input.contentHtml,
    contentHtmlFr: input.contentHtmlFr || null,
    coverImage: input.coverImage || null,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
    status: input.status,
    featured: input.featured ?? false,
    readingMinutes: input.readingMinutes ?? 6,
    categoryId: input.categoryId || null,
  };

  const tags = tagConnect(input.tags);

  if (input.id) {
    const previous = await prisma.article.findUnique({
      where: { id: input.id },
      select: { publishedAt: true },
    });
    return prisma.article.update({
      where: { id: input.id },
      data: {
        ...data,
        publishedAt: isPublished ? previous?.publishedAt ?? new Date() : null,
        tags: { set: [], connectOrCreate: tags },
      },
    });
  }

  return prisma.article.create({
    data: {
      ...data,
      publishedAt: isPublished ? new Date() : null,
      tags: { connectOrCreate: tags },
    },
  });
}

export async function saveReport(input: ReportInput) {
  const slug = await uniqueSlug("report", input.slug, input.id);
  const isPublished = input.status === "PUBLISHED";

  const data = {
    slug,
    title: input.title,
    titleFr: input.titleFr || null,
    summary: input.summary,
    summaryFr: input.summaryFr || null,
    fileUrl: input.fileUrl,
    fileName: input.fileName || null,
    fileSizeBytes: input.fileSizeBytes ?? null,
    periodLabel: input.periodLabel || null,
    status: input.status,
    featured: input.featured ?? false,
    categoryId: input.categoryId || null,
  };

  const tags = tagConnect(input.tags);

  if (input.id) {
    const previous = await prisma.report.findUnique({
      where: { id: input.id },
      select: { publishedAt: true },
    });
    const report = await prisma.report.update({
      where: { id: input.id },
      data: {
        ...data,
        publishedAt: isPublished ? previous?.publishedAt ?? new Date() : null,
        tags: { set: [], connectOrCreate: tags },
      },
    });

    // Transition brouillon → publié : on prévient les abonnés (opt-in).
    if (isPublished && !previous?.publishedAt) {
      await notifyNewReport({
        slug: report.slug,
        title: report.title,
        titleFr: report.titleFr,
        summary: report.summary,
        summaryFr: report.summaryFr,
        periodLabel: report.periodLabel,
      });
    }

    return report;
  }

  const report = await prisma.report.create({
    data: {
      ...data,
      publishedAt: isPublished ? new Date() : null,
      tags: { connectOrCreate: tags },
    },
  });

  if (isPublished) {
    await notifyNewReport({
      slug: report.slug,
      title: report.title,
      titleFr: report.titleFr,
      summary: report.summary,
      summaryFr: report.summaryFr,
      periodLabel: report.periodLabel,
    });
  }

  return report;
}

export async function saveWebinar(input: WebinarInput) {
  const slug = await uniqueSlug("webinar", input.slug, input.id);

  const data = {
    slug,
    title: input.title,
    titleFr: input.titleFr || null,
    description: input.description,
    descriptionFr: input.descriptionFr || null,
    platform: input.platform,
    startsAt: new Date(input.startsAt),
    endsAt: input.endsAt ? new Date(input.endsAt) : null,
    joinUrl: input.joinUrl || null,
    replayUrl: input.replayUrl || null,
    coverImage: input.coverImage || null,
    capacity: input.capacity ?? null,
    status: input.status,
    categoryId: input.categoryId || null,
  };

  const tags = tagConnect(input.tags);

  if (input.id) {
    const previous = await prisma.webinar.findUnique({
      where: { id: input.id },
      select: { publishedAt: true },
    });
    return prisma.webinar.update({
      where: { id: input.id },
      data: {
        ...data,
        publishedAt: input.publish ? previous?.publishedAt ?? new Date() : null,
        tags: { set: [], connectOrCreate: tags },
      },
    });
  }

  return prisma.webinar.create({
    data: {
      ...data,
      publishedAt: input.publish ? new Date() : null,
      tags: { connectOrCreate: tags },
    },
  });
}
