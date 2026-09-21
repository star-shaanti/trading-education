import { ReactNode } from "react";

interface SectionProps {
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  children: ReactNode;
  variant?: "default" | "alt" | "dark";
  className?: string;
}

export function Section({
  title,
  subtitle,
  children,
  variant = "default",
  className = "",
}: SectionProps) {
  const variants = {
    default: "bg-white dark:bg-slate-900",
    alt: "bg-slate-50 dark:bg-slate-950",
    dark: "bg-slate-900 dark:bg-[#0B132B] text-slate-100",
  };

  return (
    <section className={`py-12 md:py-16 ${variants[variant]} ${className}`}>
      <div className="container mx-auto px-4">
        {title && (
          <div className="mb-10 md:mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold break-words text-slate-900 dark:text-slate-100 sm:text-3xl md:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-400 md:text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

