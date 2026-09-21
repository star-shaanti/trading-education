import { Link } from "@/components/Link";
import { getCurrentUser } from "@/lib/auth";
import { getLang } from "@/lib/i18n";
import { getHomeStats } from "@/lib/queries";

/**
 * Bandeau « en un coup d'œil » : compteurs de contenus publiés.
 * Rendu côté serveur (données base de données) — silencieux si la base est
 * vide ou indisponible.
 *
 * Le lien « créer un compte gratuit » n'est affiché qu'aux **visiteurs** : un
 * membre connecté ne doit pas voir d'appel à la création de compte.
 */
export async function HomeStats() {
  const lang = getLang();
  const [stats, user] = await Promise.all([getHomeStats(), getCurrentUser()]);

  const items = [
    {
      icon: "📰",
      value: stats.articles,
      label: lang === "fr" ? "Analyses publiées" : "Published analyses",
      href: "/analyses",
    },
    {
      icon: "🎓",
      value: stats.guides,
      label: lang === "fr" ? "Guides pédagogiques" : "Educational guides",
      href: "/guides",
    },
    {
      icon: "📄",
      value: stats.reports,
      label: lang === "fr" ? "Rapports PDF" : "PDF reports",
      href: "/rapports",
    },
    {
      icon: "🎥",
      value: stats.webinars,
      label: lang === "fr" ? "Webinaires & replays" : "Webinars & replays",
      href: "/webinaires",
    },
    {
      icon: "🧮",
      value: 4,
      label: lang === "fr" ? "Outils gratuits" : "Free tools",
      href: "/outils",
    },
  ];

  const total = stats.articles + stats.guides + stats.reports + stats.webinars + 4;
  if (total === 4) return null;

  return (
    <div className="border-b border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {lang === "fr"
            ? "100 % gratuit · sans paywall · aucune donnée bancaire"
            : "100% free · no paywall · no banking data"}
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card block p-5 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <span className="text-xl" aria-hidden="true">
                {item.icon}
              </span>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                {item.value}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
        {!user && (
          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            <Link href="/inscription" className="text-brand-primary hover:underline dark:text-indigo-300">
              {lang === "fr"
                ? "Créer un compte gratuit pour recevoir les rapports par email"
                : "Create a free account to get the reports by email"}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
