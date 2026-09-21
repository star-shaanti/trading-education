"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Link } from "@/components/Link";
import { ThemeMenu } from "@/components/ThemeMenu";
import { UserMenu } from "@/components/UserMenu";
import { useLang } from "@/components/LangContext";
import { LANGUAGES, normalizeLang } from "@/lib/i18n/languages";
import { stripLocale, withLocale } from "@/lib/i18n/locale-path";
import { getDict } from "@/lib/i18n/dict";

/**
 * `Nav` est rendu côté serveur lui aussi : les 9 rubriques sont présentes dans
 * le HTML initial (maillage interne crawlable, pas de saut visuel).
 */
const Nav = dynamic(() => import("./Nav").then((mod) => ({ default: mod.Nav })));

const LOGO = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" className="w-full h-full">
    <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
      <path d="M16 22V12M16 84V68M36 22V8M36 84V60M60 22V12M60 84V68M80 22V6M80 84V64" />
    </g>
    <rect x="8" y="22" width="16" height="44" rx="3" fill="#DC2626" />
    <rect x="28" y="22" width="16" height="38" rx="3" fill="#16A34A" />
    <rect x="52" y="22" width="16" height="44" rx="3" fill="#DC2626" />
    <rect x="72" y="22" width="16" height="52" rx="3" fill="#16A34A" />
  </svg>
);

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const t = getDict(lang);

  /**
   * Session via `SessionProvider` (`AuthProvider` dans le layout) : l'état se
   * met à jour **automatiquement** après connexion/déconnexion, y compris dans
   * cet en-tête qui n'est pas remonté lors d'une navigation côté client.
   */
  const { data: session } = useSession();
  const user = session?.user ?? null;

  /**
   * Change la langue : `setLang` met à jour la préférence (cookie +
   * localStorage + `<html lang/dir>`) et la navigation pointe vers l'URL
   * localisée (chaque langue a sa propre URL indexable).
   */
  const changeLang = (value: string) => {
    const next = normalizeLang(value);
    setLang(next);
    const target = withLocale(stripLocale(pathname ?? "/"), next);
    if (target !== pathname) router.push(target);
    else router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 lg:gap-3">
          <Link
            href="/"
            className="flex flex-shrink-0 items-center gap-3 text-lg font-bold text-gradient focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary rounded group sm:text-xl md:text-2xl"
          >
            <span className="w-8 h-8 flex-shrink-0 text-slate-900 dark:text-slate-100 group-hover:scale-105 transition-transform sm:w-9 sm:h-9 md:w-10 md:h-10">
              {LOGO}
            </span>
            <span className="inline-block leading-tight">
              <span className="block">Trading</span>
              <span className="block">Education</span>
            </span>
          </Link>

          {/* Rubriques centrées entre le logo et les actions (dès lg) */}
          <nav
            aria-label={t.footer.navigation}
            className="hidden min-w-0 flex-1 justify-center lg:flex"
          >
            <Nav />
          </nav>

          {/*
            Actions de droite, dans cet ordre : sélecteur de langue, menu de
            thème, puis compte (« Connexion »). Le bouton « Inscription gratuite »
            n'est pas dupliqué ici : la page Connexion propose déjà « Créer un compte ».
          */}
          <div className="flex flex-shrink-0 items-center gap-2 md:gap-3">
            {/* Sélecteur de langue (8 langues, libellés dans leur langue) */}
            <label className="relative inline-flex items-center">
              <span className="pointer-events-none absolute start-2 text-sm" aria-hidden="true">
                🌐
              </span>
              <select
                value={lang}
                onChange={(event) => changeLang(event.target.value)}
                aria-label="Language / Langue"
                title="Language / Langue"
                className="appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 ps-7 pe-6 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                {LANGUAGES.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.flag} {language.nativeLabel}
                  </option>
                ))}
              </select>
              <span
                className="pointer-events-none absolute end-2 text-[10px] text-slate-500 dark:text-slate-400"
                aria-hidden="true"
              >
                ▾
              </span>
            </label>

            {/* Menu de thème : Clair / Sombre / Système */}
            <ThemeMenu labels={t.theme} />

            {user ? (
              <div className="hidden lg:block">
                <UserMenu user={user} />
              </div>
            ) : (
              <Link
                href="/connexion"
                className="hidden rounded-xl bg-brand-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-primary-700 lg:inline-flex lg:items-center"
              >
                {t.nav.login}
              </Link>
            )}

          </div>
        </div>
      </div>

      {/* Menu compact (logo + langue + thème + rubriques) en dessous de lg */}
      <nav className="lg:hidden border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3">
          <Nav mobile />

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Link
                href="/connexion"
                className="rounded-lg bg-brand-primary px-3 py-1.5 font-medium text-white"
              >
                {t.nav.login}
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
