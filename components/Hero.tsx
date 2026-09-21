"use client";

import { useLang } from "@/components/LangContext";
import { getDict } from "@/lib/i18n/dict";

/**
 * Bandeau d'accueil compact : titre + accroche uniquement.
 * Les boutons d'action ont été retirés : les appels à l'action sont déjà
 * présents dans les cartes juste en dessous (rubriques et outils).
 */
export function Hero() {
  const { lang } = useLang();
  const t = getDict(lang).hero;

  return (
    <section className="relative bg-gradient-to-r from-indigo-600 via-cyan-600 to-indigo-700">
      <div className="absolute inset-0 bg-slate-900/15 dark:bg-black/30" aria-hidden="true" />
      <div className="container relative z-10 mx-auto px-4 py-8 md:py-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-white text-balance md:text-3xl">
            {t.title1}
            <span className="bg-gradient-to-r from-amber-200 via-cyan-200 to-indigo-200 bg-clip-text text-transparent">
              {t.title2}
            </span>
          </h1>
          <p className="mx-auto mt-2 max-w-3xl text-sm text-slate-100 text-balance md:text-base">
            {t.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}

