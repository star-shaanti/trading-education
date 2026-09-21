import { Link } from "@/components/Link";
import type { ReactNode } from "react";
import type { UserRole } from "@prisma/client";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { adminNavSections, isAdminRole } from "@/lib/roles";

const LINKS = [
  { section: "", href: "/admin", label: "Tableau de bord" },
  { section: "articles", href: "/admin/articles", label: "Analyses" },
  { section: "rapports", href: "/admin/rapports", label: "Rapports PDF" },
  { section: "webinaires", href: "/admin/webinaires", label: "Webinaires" },
  { section: "commentaires", href: "/admin/commentaires", label: "Commentaires" },
  { section: "abonnes", href: "/admin/abonnes", label: "Inscrits & export" },
  { section: "emails", href: "/admin/emails", label: "Emails groupés" },
];

/**
 * Habillage commun des pages d'administration.
 * La navigation est filtrée selon le rôle : un rédacteur (EDITOR) ne voit que
 * les rubriques de contenu et de modération.
 */
export function AdminShell({
  children,
  email,
  role,
}: {
  children: ReactNode;
  email: string;
  role: UserRole;
}) {
  const allowed = adminNavSections(role);
  const links = LINKS.filter((link) => allowed.includes(link.section));

  return (
    <div className="bg-slate-50 dark:bg-[#0B132B] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Administration
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {email} · {isAdminRole(role) ? "administrateur" : "rédacteur (contenus)"}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-brand-primary">
              ← Voir le site
            </Link>
            <LogoutButton label="Déconnexion" />
          </div>
        </div>

        <nav className="mb-8 flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-brand-primary hover:text-brand-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
