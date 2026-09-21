import { Link } from "@/components/Link";
import { prisma } from "@/lib/prisma";
import { buttonClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

/** Liste des analyses (admin). */
export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: { category: true, _count: { select: { comments: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Analyses</h2>
        <Link href="/admin/articles/nouveau" className={buttonClass}>
          + Nouvelle analyse
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Aucune analyse pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="py-2 pr-4">Titre</th>
                <th className="py-2 pr-4">Statut</th>
                <th className="py-2 pr-4">Catégorie</th>
                <th className="py-2 pr-4">Vues</th>
                <th className="py-2 pr-4">Commentaires</th>
                <th className="py-2 pr-4">Publié le</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <td className="py-3 pr-4 font-medium">{article.titleFr ?? article.title}</td>
                  <td className="py-3 pr-4">{article.status}</td>
                  <td className="py-3 pr-4">{article.category?.nameFr ?? article.category?.name ?? "—"}</td>
                  <td className="py-3 pr-4">{article.viewCount}</td>
                  <td className="py-3 pr-4">{article._count.comments}</td>
                  <td className="py-3 pr-4">
                    {article.publishedAt
                      ? article.publishedAt.toLocaleDateString("fr-FR")
                      : "—"}
                  </td>
                  <td className="py-3">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="text-brand-primary hover:underline"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
