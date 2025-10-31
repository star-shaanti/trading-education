"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/components/LangContext";

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

  const links = [
    { href: "/", label: lang === "fr" ? "Accueil" : "Home" },
    { href: "/guides", label: lang === "fr" ? "Guides" : "Guides" },
    { href: "/outils", label: lang === "fr" ? "Outils" : "Tools" },
    { href: "/recap", label: lang === "fr" ? "Récap des signaux" : "Signals Recap" },
    { href: "/ressources", label: lang === "fr" ? "Ressources" : "Resources" },
    { href: "/a-propos", label: lang === "fr" ? "À propos" : "About" },
  ];

  const currentPath = mounted ? pathname : "";

  return (
    <ul className={`flex ${mobile ? "flex-col gap-2" : "flex-row gap-4"}`}>
      {links.map((link) => {
        const isActive = currentPath === link.href;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`px-3 py-2 rounded-lg transition-colors font-medium ${
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

