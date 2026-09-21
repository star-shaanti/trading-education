import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminRole } from "@/lib/roles";
import { buttonSecondaryClass, inputClass } from "@/lib/ui";

// Données personnelles : rubrique réservée à l'administrateur.
export const dynamic = "force-dynamic";

/** Gestion des inscrits : recherche, préférences, export CSV, comptes membres. */
export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const currentUser = await getCurrentUser();
  if (!isAdminRole(currentUser?.role)) redirect("/admin");

  const query = searchParams.q?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.page ?? 1) || 1);
  const perPage = 50;

  const where = query
    ? {
        OR: [
          { email: { contains: query, mode: "insensitive" as const } },
          { name: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const [subscribers, total, members] = await Promise.all([
    prisma.subscriber.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.subscriber.count({ where }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        _count: { select: { downloads: true, webinarRegistrations: true, comments: true } },
      },
    }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Abonnés emails ({total})
          </h2>
          <a href="/api/admin/abonnes?format=csv" className={buttonSecondaryClass}>
            ⬇ Export CSV
          </a>
        </div>

        <form action="/admin/abonnes" method="get" className="grid gap-3 sm:grid-cols-[2fr_auto]">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Rechercher un email ou un prénom…"
            className={inputClass}
          />
          <button type="submit" className={buttonSecondaryClass}>
            Rechercher
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Prénom</th>
                <th className="py-2 pr-4">Source</th>
                <th className="py-2 pr-4">Consentement</th>
                <th className="py-2 pr-4">Newsletter</th>
                <th className="py-2 pr-4">Rapports</th>
                <th className="py-2 pr-4">Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr
                  key={subscriber.id}
                  className="border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <td className="py-2 pr-4">{subscriber.email}</td>
                  <td className="py-2 pr-4">{subscriber.name ?? "—"}</td>
                  <td className="py-2 pr-4">{subscriber.source}</td>
                  <td className="py-2 pr-4">
                    {subscriber.confirmedAt ? "✅ confirmé" : "⏳ en attente"}
                    {subscriber.unsubscribedAt ? " / désinscrit" : ""}
                  </td>
                  <td className="py-2 pr-4">{subscriber.newsletterOptIn ? "oui" : "non"}</td>
                  <td className="py-2 pr-4">{subscriber.reportsOptIn ? "oui" : "non"}</td>
                  <td className="py-2 pr-4">
                    {subscriber.createdAt.toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div className="flex items-center gap-4 text-sm">
            {page > 1 && (
              <a href={`/admin/abonnes?page=${page - 1}`} className="text-brand-primary">
                ← Précédent
              </a>
            )}
            <span className="text-slate-500 dark:text-slate-400">
              Page {page} / {pageCount}
            </span>
            {page < pageCount && (
              <a href={`/admin/abonnes?page=${page + 1}`} className="text-brand-primary">
                Suivant →
              </a>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Comptes membres (50 derniers)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Rôle</th>
                <th className="py-2 pr-4">Téléchargements</th>
                <th className="py-2 pr-4">Webinaires</th>
                <th className="py-2 pr-4">Commentaires</th>
                <th className="py-2 pr-4">Dernière connexion</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <td className="py-2 pr-4">{member.email}</td>
                  <td className="py-2 pr-4">{member.role}</td>
                  <td className="py-2 pr-4">{member._count.downloads}</td>
                  <td className="py-2 pr-4">{member._count.webinarRegistrations}</td>
                  <td className="py-2 pr-4">{member._count.comments}</td>
                  <td className="py-2 pr-4">
                    {member.lastLoginAt ? member.lastLoginAt.toLocaleDateString("fr-FR") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
