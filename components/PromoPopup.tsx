"use client";

import { useState, useEffect } from "react";
import { Link } from "@/components/Link";
import { useLang } from "@/components/LangContext";
import { getDict } from "@/lib/i18n/dict";
import { FEATURED_PARTNERS } from "@/lib/partners";

/**
 * Popup promo (20 s après l'arrivée, une fois par session) :
 * met en avant les plateformes partenaires (source : lib/partners.ts).
 * Textes traduits (8 langues) ; les fiches partenaires, disponibles en FR/EN,
 * affichent l'anglais dans les autres langues.
 */
export default function PromoPopup() {
  const { lang } = useLang();
  const t = getDict(lang);
  const partnerText = (value: { fr: string; en: string }) => (lang === "fr" ? value.fr : value.en);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Vérifier si le popup a déjà été affiché dans cette session
    if (typeof window === "undefined") return;

    const sessionShown = sessionStorage.getItem("promoPopupShown");
    if (sessionShown === "true") {
      setHasBeenShown(true);
      return;
    }

    // Timer pour afficher le popup après 20 secondes
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      setHasBeenShown(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("promoPopupShown", "true");
      }
    }, 20000); // 20 secondes

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    let autoCloseTimer: NodeJS.Timeout;
    if (isVisible) {
      // Timer pour fermer automatiquement après 20 secondes
      autoCloseTimer = setTimeout(() => {
        setIsVisible(false);
      }, 20000); // 20 secondes après l'affichage
    }

    return () => {
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
    };
  }, [isVisible]);

  void hasBeenShown;

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto border border-slate-200 dark:border-slate-700 animate-scale-in">
        {/* Bouton de fermeture */}
        <button
          onClick={handleClose}
          className="absolute top-4 end-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors text-2xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label={t.common.close}
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 text-center pe-8">
          {t.home.partnersTitle}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-5 text-center text-sm">
          {t.home.partnersSubtitle}
        </p>

        <div className="flex max-h-[55vh] flex-col gap-3 overflow-y-auto pe-1">
          {FEATURED_PARTNERS.map((partner) => (
            <Link
              key={partner.id}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-brand-primary hover:bg-indigo-50/40 dark:hover:bg-slate-700/50 transition-colors"
              aria-label={`${partner.name} (${partner.domain})`}
              onClick={handleClose}
            >
              <span>
                <span className="block font-semibold text-slate-900 dark:text-white">
                  <span aria-hidden="true">{partner.emoji}</span> {partner.name}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  {partnerText(partner.tagline)}
                </span>
              </span>
              <span
                className="flex-shrink-0 text-lg text-slate-400 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-transform rtl:-scale-x-100"
                aria-hidden="true"
              >
                ↗
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
          <Link href="/ressources" className="text-brand-primary hover:underline" onClick={handleClose}>
            {t.home.partnersAll}
          </Link>
        </p>
      </div>
    </div>
  );
}

