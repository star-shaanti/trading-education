import { Link } from "@/components/Link";
import { prisma } from "@/lib/prisma";
import { buttonClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

/** Liste des webinaires (admin) avec nombre d'inscrits. */
export default async function AdminWebinarsPage() {
  const webinars = await prisma.webinar.findMany({
    orderBy: { startsAt: "desc" },
    take: 100,
    include: { _count: { select: { registrations: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Webinaires</h2>
        <Link href="/admin/webinaires/nouveau" className={buttonClass}>
          + Nouveau webinaire
        </Link>
      </div>

      {webinars.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Aucun webinaire pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="py-2 pr-4">Titre</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Statut</th>
                <th className="py-2 pr-4">Inscrits</th>
                <th className="py-2 pr-4">Replay</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {webinars.map((webinar) => (
                <tr
                  key={webinar.id}
                  className="border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <td className="py-3 pr-4 font-medium">{webinar.titleFr ?? webinar.title}</td>
                  <td className="py-3 pr-4">
                    {webinar.startsAt.toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}
                  </td>
                  <td className="py-3 pr-4">{webinar.status}</td>
                  <td className="py-3 pr-4">{webinar._count.registrations}</td>
                  <td className="py-3 pr-4">{webinar.replayUrl ? "oui" : "—"}</td>
                  <td className="py-3">
                    <Link
                      href={`/admin/webinaires/${webinar.id}`}
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
