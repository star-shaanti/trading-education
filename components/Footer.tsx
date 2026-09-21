"use client";

import { Link } from "@/components/Link";
import { useLang } from "@/components/LangContext";
import { getDict } from "@/lib/i18n/dict";

/**
 * Pied de page : description de la plateforme + trois colonnes de liens
 * (navigation, ressources, légal). Textes traduits dans les 8 langues
 * d'interface (voir lib/i18n/dict).
 */
export function Footer() {
  const { lang } = useLang();
  const t = getDict(lang).footer;
  const currentYear = new Date().getFullYear();

  const linkClass =
    "text-slate-300 dark:text-slate-200 hover:text-brand-secondary dark:hover:text-indigo-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary rounded";

  const navigation = [
    { href: "/", label: t.home },
    { href: "/analyses", label: t.analyses },
    { href: "/rapports", label: t.reports },
    { href: "/webinaires", label: t.webinars },
    { href: "/guides", label: t.guides },
  ];

  const resources = [
    { href: "/outils", label: t.tools },
    { href: "/recap", label: t.signalsRecap },
    { href: "/ressources", label: t.resources },
    { href: "/a-propos", label: t.aboutUs },
  ];

  const legal = [
    { href: "/espace-membre", label: t.memberArea },
    { href: "/mentions-legales", label: t.legalNotice },
    { href: "/politiques", label: t.privacyCookies },
    { href: "/confidentialite", label: t.privacy },
  ];

  return (
    <footer className="bg-slate-900 dark:bg-[#0F172A] text-slate-300 dark:text-slate-200 border-t border-slate-800 dark:border-slate-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              <span className="block">Trading</span>
              <span className="block">Education</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-300 dark:text-slate-200">
              {t.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t.navigation}</h4>
            <ul className="space-y-2 text-sm">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t.resourcesTitle}</h4>
            <ul className="space-y-2 text-sm">
              {resources.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="mailto:support@tradingeducationpro.com" className={linkClass}>
                  {t.support}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t.legal}</h4>
            <ul className="space-y-2 text-sm">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400 dark:text-slate-300 text-center md:text-start">
            © {currentYear} Trading Education. {t.rights}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-end">
            {t.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
