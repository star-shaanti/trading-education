import { Link } from "@/components/Link";
import type { ReactNode } from "react";

/**
 * En-tête de section homogène pour la page d'accueil et les blocs éditoriaux :
 * titre + sous-titre à gauche, lien d'action optionnel à droite.
 * Composant purement présentationnel (utilisable côté serveur comme client).
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  linkHref,
  linkLabel,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-primary dark:text-indigo-300">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-bold break-words text-slate-900 dark:text-slate-100 sm:text-2xl md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 md:text-base">{subtitle}</p>
        )}
      </div>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="flex-shrink-0 text-sm font-medium text-brand-primary hover:underline dark:text-indigo-300"
        >
          {linkLabel} <span className="inline-block rtl:-scale-x-100">→</span>
        </Link>
      )}
    </div>
  );
}

/** Grille responsive standard utilisée par tous les blocs de cartes. */
export function CardGrid({
  children,
  columns = 3,
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}) {
  const cols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return <div className={`grid grid-cols-1 gap-6 ${cols}`}>{children}</div>;
}
