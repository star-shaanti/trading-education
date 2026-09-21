import { Link } from "@/components/Link";
import { prisma } from "@/lib/prisma";
import { buttonClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

/** Liste des rapports PDF (admin). */
export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Rapports PDF</h2>
        <Link href="/admin/rapports/nouveau" className={buttonClass}>
          + Nouveau rapport
        </Link>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Publier un rapport déclenche automatiquement l&apos;email « nouveau rapport » aux abonnés
        ayant donné leur consentement (opt-in « alerte rapports »).
      </p>

      {reports.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Aucun rapport pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="py-2 pr-4">Titre</th>
                <th className="py-2 pr-4">Statut</th>
                <th className="py-2 pr-4">Période</th>
                <th className="py-2 pr-4">Vues</th>
                <th className="py-2 pr-4">Téléchargements</th>
                <th className="py-2 pr-4">Fichier</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <td className="py-3 pr-4 font-medium">{report.titleFr ?? report.title}</td>
                  <td className="py-3 pr-4">{report.status}</td>
                  <td className="py-3 pr-4">{report.periodLabel ?? "—"}</td>
                  <td className="py-3 pr-4">{report.viewCount}</td>
                  <td className="py-3 pr-4">{report.downloadCount}</td>
                  <td className="py-3 pr-4 font-mono text-xs">{report.fileUrl.slice(0, 40)}</td>
                  <td className="py-3">
                    <Link
                      href={`/admin/rapports/${report.id}`}
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
