import { Link } from "@/components/Link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

/**
 * Fil d'Ariane : version visible (navigation, maillage interne) + version
 * structurée `BreadcrumbList` (rich results Google).
 * Le dernier élément est la page courante : non cliquable.
 * Composant serveur ; les libellés sont traduits par l'appelant.
 */
export function Breadcrumbs({
  items,
  className = "",
}: {
  items: { name: string; href?: string }[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(items)} />
      <nav aria-label="Breadcrumb" className={`mb-2 ${className}`}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 md:text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.name}-${index}`} className="flex items-center gap-x-2">
                {index > 0 && (
                  <span aria-hidden="true" className="text-slate-300 rtl:-scale-x-100 dark:text-slate-600">
                    ›
                  </span>
                )}
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-brand-primary hover:underline">
                    {item.name}
                  </Link>
                ) : (
                  <span aria-current={isLast ? "page" : undefined} className="text-slate-700 dark:text-slate-200">
                    {item.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
