import { ArticleForm } from "@/components/admin/ArticleForm";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Création (`/admin/articles/nouveau`) ou édition (`/admin/articles/<id>`). */
export default async function AdminArticleEditPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "nouveau";

  const [categories, article] = await Promise.all([
    getCategories("ARTICLE"),
    isNew
      ? Promise.resolve(null)
      : prisma.article.findUnique({ where: { id: params.id }, include: { tags: true } }),
  ]);

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        {isNew ? "Nouvelle analyse" : "Modifier l'analyse"}
      </h2>

      <ArticleForm
        categories={categoryOptions}
        initial={
          article
            ? {
                id: article.id,
                slug: article.slug,
                title: article.title,
                titleFr: article.titleFr ?? "",
                excerpt: article.excerpt,
                excerptFr: article.excerptFr ?? "",
                contentHtml: article.contentHtml,
                contentHtmlFr: article.contentHtmlFr ?? "",
                coverImage: article.coverImage ?? "",
                seoTitle: article.seoTitle ?? "",
                seoDescription: article.seoDescription ?? "",
                status: article.status,
                featured: article.featured,
                readingMinutes: article.readingMinutes,
                categoryId: article.categoryId ?? "",
                tags: article.tags.map((tag) => tag.name).join(", "),
              }
            : undefined
        }
      />
    </div>
  );
}
