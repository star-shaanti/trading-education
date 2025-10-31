"use client";

import Link from "next/link";
import { useLang } from "@/components/LangContext";

export function Footer() {
  const { lang } = useLang();
  const currentYear = new Date().getFullYear();

  const t = {
    en: {
      description: "Educational trading platform providing free guides, tools, and market insights for traders of all levels.",
      navigation: "Navigation",
      resources: "Resources",
      legal: "Legal",
      home: "Home",
      guides: "Guides",
      tools: "Tools",
      signalsRecap: "Signals Recap",
      resourcesTitle: "Resources",
      aboutUs: "About Us",
      legalNotice: "Legal Notice",
      privacyCookies: "Privacy & Cookies",
      copyright: (
        <>
          © {currentYear}{" "}
          <span className="inline-block">
            <span className="block">Trading</span>
            <span className="block">Education</span>
          </span>
          . All rights reserved.
        </>
      ),
      disclaimer: "Educational content only. Trading involves risk of loss.",
    },
    fr: {
      description: "Plateforme éducative de trading offrant des guides gratuits, des outils et des analyses de marché pour les traders de tous niveaux.",
      navigation: "Navigation",
      resources: "Ressources",
      legal: "Légal",
      home: "Accueil",
      guides: "Guides",
      tools: "Outils",
      signalsRecap: "Récap des signaux",
      resourcesTitle: "Ressources",
      aboutUs: "À propos",
      legalNotice: "Mentions légales",
      privacyCookies: "Confidentialité et Cookies",
      copyright: (
        <>
          © {currentYear}{" "}
          <span className="inline-block">
            <span className="block">Trading</span>
            <span className="block">Education</span>
          </span>
          . Tous droits réservés.
        </>
      ),
      disclaimer: "Contenu éducatif uniquement. Le trading comporte un risque de pertes.",
    },
  }[lang];

  return (
    <footer className="bg-slate-900 dark:bg-[#0F172A] text-slate-300 dark:text-slate-200 border-t border-slate-800 dark:border-slate-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
              <li>
                <Link
                  href="/"
                  className="text-slate-300 dark:text-slate-200 hover:text-brand-secondary dark:hover:text-indigo-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary rounded"
                >
                  {t.home}
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-slate-300 dark:text-slate-200 hover:text-brand-secondary dark:hover:text-indigo-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary rounded"
                >
                  {t.guides}
                </Link>
              </li>
              <li>
                <Link
                  href="/outils"
                  className="text-slate-300 dark:text-slate-200 hover:text-brand-secondary dark:hover:text-indigo-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary rounded"
                >
                  {t.tools}
                </Link>
              </li>
              <li>
                <Link
                  href="/recap"
                  className="text-slate-300 dark:text-slate-200 hover:text-brand-secondary dark:hover:text-indigo-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary rounded"
                >
                  {t.signalsRecap}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t.resources}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/ressources"
                  className="text-slate-300 dark:text-slate-200 hover:text-brand-secondary dark:hover:text-indigo-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary rounded"
                >
                  {t.resourcesTitle}
                </Link>
              </li>
              <li>
                <Link
                  href="/a-propos"
                  className="text-slate-300 dark:text-slate-200 hover:text-brand-secondary dark:hover:text-indigo-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary rounded"
                >
                  {t.aboutUs}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">{t.legal}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-slate-300 dark:text-slate-200 hover:text-brand-secondary dark:hover:text-indigo-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary rounded"
                >
                  {t.legalNotice}
                </Link>
              </li>
              <li>
                <Link
                  href="/politiques"
                  className="text-slate-300 dark:text-slate-200 hover:text-brand-secondary dark:hover:text-indigo-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary rounded"
                >
                  {t.privacyCookies}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400 dark:text-slate-300">
            {t.copyright}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}

