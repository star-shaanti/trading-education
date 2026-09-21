import { Link } from "@/components/Link";
import { getCurrentUser } from "@/lib/auth";
import { formatNumber } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { isAdminRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

/** Tableau de bord : statistiques de base (vues, téléchargements, inscriptions). */
export default async function AdminDashboardPage() {
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const currentUser = await getCurrentUser();
  const isAdminUser = isAdminRole(currentUser?.role);

  const [
    users,
    members,
    confirmedSubscribers,
    articles,
    reports,
    webinars,
    downloads30d,
    commentsPending,
    emailsSent,
    events,
    topArticles,
    recentSignups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.subscriber.count({ where: { confirmedAt: { not: null }, unsubscribedAt: null } }),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.report.count({ where: { status: "PUBLISHED" } }),
    prisma.webinar.count(),
    prisma.reportDownload.count({ where: { createdAt: { gte: since } } }),
    prisma.comment.count({ where: { status: "PENDING" } }),
    prisma.emailLog.count({ where: { status: "SENT", createdAt: { gte: since } } }),
    prisma.analyticsEvent.groupBy({
      by: ["type"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { viewCount: "desc" },
      take: 5,
      select: { slug: true, title: true, viewCount: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { email: true, createdAt: true, role: true },
    }),
  ]);

  const countOf = (type: string) =>
    events.find((event) => event.type === type)?._count._all ?? 0;

  const pageViews = countOf("PAGE_VIEW");
  const signups = countOf("SIGNUP");
  const conversion = pageViews > 0 ? ((signups / pageViews) * 100).toFixed(2) : "0";

  const cards = [
    ...(isAdminUser
      ? [
          { label: "Membres inscrits", value: members, href: "/admin/abonnes" },
          { label: "Abonnés emails confirmés", value: confirmedSubscribers, href: "/admin/abonnes" },
        ]
      : []),
    { label: "Analyses publiées", value: articles, href: "/admin/articles" },
    { label: "Rapports publiés", value: reports, href: "/admin/rapports" },
    { label: "Webinaires", value: webinars, href: "/admin/webinaires" },
    { label: "Téléchargements (30 j)", value: downloads30d, href: "/admin/rapports" },
    { label: "Commentaires à modérer", value: commentsPending, href: "/admin/commentaires" },
    ...(isAdminUser
      ? [{ label: "Emails envoyés (30 j)", value: emailsSent, href: "/admin/emails" }]
      : []),
  ];

  const funnel = [
    { label: "Vues de page (30 j)", value: pageViews },
    { label: "Vues d'analyses", value: countOf("ARTICLE_VIEW") },
    { label: "Téléchargements", value: countOf("REPORT_DOWNLOAD") },
    { label: "Inscriptions webinaire", value: countOf("WEBINAR_REGISTER") },
    { label: "Inscriptions au site", value: signups },
    { label: "Abonnements newsletter", value: countOf("NEWSLETTER_SUBSCRIBE") },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:border-brand-primary transition-colors"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatNumber(card.value, "fr")}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {isAdminUser && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
            Entonnoir de conversion (30 derniers jours)
          </h2>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {funnel.map((step) => (
              <li key={step.label} className="flex items-center justify-between">
                <span>{step.label}</span>
                <strong>{formatNumber(step.value, "fr")}</strong>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Taux de conversion visiteur → inscription : <strong>{conversion} %</strong>
          </p>
        </div>
        )}

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
            Analyses les plus lues
          </h2>
          {topArticles.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Aucune donnée.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {topArticles.map((article) => (
                <li key={article.slug} className="flex items-center justify-between gap-3">
                  <Link
                    href={`/analyses/${article.slug}`}
                    className="text-slate-700 dark:text-slate-200 hover:text-brand-primary"
                  >
                    {article.title}
                  </Link>
                  <span className="text-slate-500 dark:text-slate-400">
                    {formatNumber(article.viewCount, "fr")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {isAdminUser && (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">
          Derniers inscrits
        </h2>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          {formatNumber(users, "fr")} comptes au total.
        </p>
        <ul className="space-y-2 text-sm">
          {recentSignups.map((signup) => (
            <li key={signup.email} className="flex items-center justify-between gap-3">
              <span className="text-slate-700 dark:text-slate-200">{signup.email}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {signup.createdAt.toLocaleDateString("fr-FR")} · {signup.role}
              </span>
            </li>
          ))}
        </ul>
      </div>
      )}
    </div>
  );
}
