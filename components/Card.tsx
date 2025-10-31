import Link from "next/link";
import { ReactNode } from "react";

interface CardProps {
  title: string;
  description?: string;
  href?: string;
  children?: ReactNode;
  className?: string;
  plain?: boolean; // when true, no inner gradient/padding (for widgets/iframes)
  onClick?: () => void;
}

export function Card({ title, description, href, children, className = "", plain = false, onClick }: CardProps) {
  const isPlain = plain || className?.includes("p-0");

  const inner = (
    <>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-slate-600 dark:text-slate-100 mb-4">{description}</p>
      )}
      {children}
    </>
  );

  const cardContent = isPlain ? (
    <div className={`card ${className}`}>{inner}</div>
  ) : (
    <div className={`card p-0 ${className}`}>
      <div
        className="rounded-2xl p-6 bg-gradient-to-br from-blue-100 via-sky-100 to-white dark:from-blue-500/60 dark:via-sky-500/50 dark:to-blue-600/40"
      >
        {inner}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary rounded-2xl"
        onClick={onClick}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

