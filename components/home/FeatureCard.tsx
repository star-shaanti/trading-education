import { Link } from "@/components/Link";
import type { ReactNode } from "react";

type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
  href: string;
  /** Lien externe (ouvre un nouvel onglet). */
  external?: boolean;
  /** Petite étiquette affichée en haut à droite de la carte. */
  badge?: string;
  /** Texte de l'appel à l'action (par défaut « En savoir plus »). */
  cta?: string;
  /** Petites étiquettes descriptives (partenaires, ressources…). */
  tags?: string[];
  /** Met la carte en avant (bordure et fond légèrement colorés). */
  highlighted?: boolean;
  children?: ReactNode;
};

/**
 * Carte standard de la page d'accueil : icône, titre, description, appel à
 * l'action. Un seul style de carte pour tout le site → rendu homogène et « pro ».
 * Composant présentationnel (serveur ou client).
 */
export function FeatureCard({
  icon,
  title,
  description,
  href,
  external = false,
  badge,
  cta,
  tags,
  highlighted = false,
  children,
}: FeatureCardProps) {
  const className = [
    "card group block h-full p-6",
    highlighted ? "border-brand-primary/40 bg-indigo-50/40 dark:bg-indigo-950/20" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-800"
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="flex items-center gap-2">
          {badge && (
            <span className="rounded-full bg-brand-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-primary dark:bg-indigo-900/40 dark:text-indigo-300">
              {badge}
            </span>
          )}
          <span
            className="text-lg text-slate-300 transition-colors group-hover:text-brand-primary dark:text-slate-600 rtl:-scale-x-100"
            aria-hidden="true"
          >
            ↗
          </span>
        </span>
      </div>

      <h3 className="mt-4 text-base font-semibold break-words text-slate-900 dark:text-slate-100 sm:text-lg">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {description}
      </p>

      {tags && tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {children}

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-primary dark:text-indigo-300">
        {cta ?? "→"}
      </span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={title}
        className={className}
      >
        <div className="flex h-full flex-col">{content}</div>
      </a>
    );
  }

  return (
    <Link href={href} aria-label={title} className={className}>
      <div className="flex h-full flex-col">{content}</div>
    </Link>
  );
}
