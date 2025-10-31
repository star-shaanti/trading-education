import { ReactNode } from "react";

interface SectionProps {
  title?: string;
  subtitle?: string;
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
    <section className={`py-16 ${variants[variant]} ${className}`}>
      <div className="container mx-auto px-4">
        {title && (
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
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

