"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/components/Link";
import { useLang } from "@/components/LangContext";
import { getDict } from "@/lib/i18n/dict";
import { stripLocale } from "@/lib/i18n/locale-path";

interface NavProps {
  mobile?: boolean;
}

export function Nav({ mobile }: NavProps) {
  const pathname = usePathname();
  const { lang } = useLang();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Libellés traduits (8 langues) : voir lib/i18n/dict.
  const t = getDict(lang).navLinks;
  const links = [
    { href: "/", label: t.home },
    { href: "/analyses", label: t.analyses },
    { href: "/rapports", label: t.reports },
    { href: "/webinaires", label: t.webinars },
    { href: "/guides", label: t.guides },
    { href: "/outils", label: t.tools },
    { href: "/recap", label: t.recap },
    { href: "/ressources", label: t.resources },
    { href: "/a-propos", label: t.about },
  ];

  // Le préfixe de langue est retiré pour comparer avec les liens « nus ».
  const currentPath = mounted ? stripLocale(pathname ?? "/") : "";

  return (
    <ul
      className={`${
        mobile
          ? "grid grid-cols-3 gap-2 text-sm"
          : "flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-[13px] lg:gap-x-2 lg:text-sm xl:text-base"
      }`}
    >
      {links.map((link) => {
        const isActive = currentPath === link.href;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`rounded-lg font-medium transition-colors ${
                mobile ? "px-3 py-2 text-center" : "px-2 py-1.5 lg:px-2.5"
              } ${
                isActive
                  ? "text-brand-primary bg-indigo-50 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border dark:border-indigo-700/50"
                  : "text-slate-700 dark:text-slate-200 hover:text-brand-primary hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-white"
              } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

