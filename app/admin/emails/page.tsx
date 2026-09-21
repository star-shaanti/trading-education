import { redirect } from "next/navigation";
import { CampaignForm } from "@/components/admin/CampaignForm";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminRole } from "@/lib/roles";

// Campagnes email : rubrique réservée à l'administrateur.
export const dynamic = "force-dynamic";

/** Emails groupés : campagnes, journal d'envoi et audiences disponibles. */
export default async function AdminEmailsPage() {
  const currentUser = await getCurrentUser();
  if (!isAdminRole(currentUser?.role)) redirect("/admin");

  const [campaigns, logs, webinars] = await Promise.all([
    prisma.campaign.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.webinar.findMany({
      orderBy: { startsAt: "desc" },
      take: 10,
      select: { slug: true, title: true, titleFr: true },
    }),
  ]);

  const audiences = [
    { value: "subscribers", label: "Abonnés newsletter (confirmés, opt-in)" },
    { value: "members", label: "Membres inscrits sur le site" },
    { value: "downloaders", label: "Personnes ayant téléchargé un rapport" },
    ...webinars.map((webinar) => ({
      value: `webinar:${webinar.slug}`,
      label: `Inscrits au webinaire : ${webinar.titleFr ?? webinar.title}`,
    })),
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Envoyer un email groupé
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Les destinataires désinscrits ou sans consentement confirmé sont automatiquement exclus.
          Les envois sont journalisés ci-dessous.
        </p>
        <CampaignForm audiences={audiences} />
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Campagnes récentes
        </h2>
        {campaigns.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Aucune campagne envoyée.</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {campaigns.map((campaign) => (
              <li key={campaign.id} className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{campaign.subject}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {campaign.audience} · {campaign.sentCount}/{campaign.recipientCount} envoyés ·{" "}
                  {campaign.failedCount} échecs ·{" "}
                  {(campaign.sentAt ?? campaign.createdAt).toLocaleString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Journal des derniers emails
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Destinataire</th>
                <th className="py-2 pr-4">Sujet</th>
                <th className="py-2 pr-4">Statut</th>
                <th className="py-2 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <td className="py-2 pr-4">{log.type}</td>
                  <td className="py-2 pr-4">{log.to}</td>
                  <td className="py-2 pr-4">{log.subject}</td>
                  <td className="py-2 pr-4">
                    {log.status}
                    {log.error ? ` — ${log.error.slice(0, 60)}` : ""}
                  </td>
                  <td className="py-2 pr-4">{log.createdAt.toLocaleString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
