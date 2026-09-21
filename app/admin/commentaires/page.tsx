import { Link } from "@/components/Link";
import { ModerationList } from "@/components/admin/ModerationList";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Modération des commentaires (filtre par statut). */
export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status =
    searchParams.status === "APPROVED" ||
    searchParams.status === "REJECTED" ||
    searchParams.status === "PENDING"
      ? searchParams.status
      : undefined;

  const comments = await prisma.comment.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { email: true, name: true } },
      article: { select: { slug: true, title: true, titleFr: true } },
    },
  });

  const filters = [
    { value: "", label: "Tous" },
    { value: "PENDING", label: "En attente" },
    { value: "APPROVED", label: "Approuvés" },
    { value: "REJECTED", label: "Rejetés" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Commentaires</h2>

      <div className="flex flex-wrap gap-2 text-sm">
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value ? `/admin/commentaires?status=${filter.value}` : "/admin/commentaires"}
            className={`rounded-xl border px-3 py-1.5 ${
              (status ?? "") === filter.value
                ? "border-brand-primary text-brand-primary"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <ModerationList
        comments={comments.map((comment) => ({
          id: comment.id,
          body: comment.body,
          status: comment.status,
          createdAt: comment.createdAt.toISOString(),
          authorEmail: comment.user.email,
          authorName: comment.user.name,
          articleSlug: comment.article.slug,
          articleTitle: comment.article.titleFr ?? comment.article.title,
        }))}
      />
    </div>
  );
}
