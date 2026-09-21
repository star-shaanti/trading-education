import { ReportForm } from "@/components/admin/ReportForm";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Création (`/admin/rapports/nouveau`) ou édition (`/admin/rapports/<id>`). */
export default async function AdminReportEditPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "nouveau";

  const [categories, report] = await Promise.all([
    getCategories("REPORT"),
    isNew
      ? Promise.resolve(null)
      : prisma.report.findUnique({ where: { id: params.id }, include: { tags: true } }),
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        {isNew ? "Nouveau rapport" : "Modifier le rapport"}
      </h2>

      <ReportForm
        categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        initial={
          report
            ? {
                id: report.id,
                slug: report.slug,
                title: report.title,
                titleFr: report.titleFr ?? "",
                summary: report.summary,
                summaryFr: report.summaryFr ?? "",
                fileUrl: report.fileUrl,
                fileName: report.fileName ?? "",
                fileSizeBytes: report.fileSizeBytes ?? 0,
                periodLabel: report.periodLabel ?? "",
                status: report.status,
                featured: report.featured,
                categoryId: report.categoryId ?? "",
                tags: report.tags.map((tag) => tag.name).join(", "),
              }
            : undefined
        }
      />
    </div>
  );
}
