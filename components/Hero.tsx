"use client";

import Link from "next/link";
import { useLang } from "@/components/LangContext";

export function Hero() {
  const { lang } = useLang();
  const t = {
    en: {
      title1: "Learn Trading the ",
      title2: "Smart Way",
      subtitle:
        "Free educational resources, powerful tools, and market insights to help you master trading",
      btnPrimary: "Explore Tools",
      btnSecondary: "Read Guides",
    },
    fr: {
      title1: "Apprenez le trading de manière ",
      title2: "intelligente",
      subtitle:
        "Ressources pédagogiques gratuites, outils puissants et analyses de marché pour progresser",
      btnPrimary: "Voir les outils",
      btnSecondary: "Lire les guides",
    },
  }[lang];
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-indigo-600 via-cyan-500 to-amber-500">
      <div className="absolute inset-0 bg-slate-900/20 dark:bg-black/40"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
            {t.title1}
            <span className="bg-gradient-to-r from-amber-200 via-cyan-200 to-indigo-200 bg-clip-text text-transparent">
              {t.title2}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 mb-8 text-balance">
            {t.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/outils"
              className="btn-primary text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t.btnPrimary}
            </Link>
            <Link
              href="/guides"
              className="btn-secondary bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-slate-900 text-center"
            >
              {t.btnSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

