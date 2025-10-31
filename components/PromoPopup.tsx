"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";

export default function PromoPopup() {
  const { lang } = useLang();
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
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors text-2xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label={lang === "fr" ? "Fermer" : "Close"}
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center pr-8">
          {lang === "fr" ? "Explorez nos signaux de trading" : "Explore Our Trading Signals"}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6 text-center text-sm">
          {lang === "fr"
            ? "Ne manquez aucune opportunité avec nos plateformes de signaux en temps réel."
            : "Don't miss any opportunity with our real-time signal platforms."}
        </p>

        <div className="flex flex-col gap-4">
          {/* Premier lien - Real-Time Signals */}
          <Link
            href="https://realtimetradesignals.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center flex items-center justify-center gap-2 group"
            aria-label={lang === "fr" ? "Voir les signaux temps réel multi‑marchés" : "View real-time multi-market signals"}
            onClick={handleClose}
          >
            <div className="flex flex-col items-center flex-1">
              <span className="text-white font-semibold">{lang === "fr" ? "Voir les signaux temps réel" : "View Real-Time Signals"}</span>
              <span className="text-white/80 font-normal text-sm">(Forex • Indices • Crypto)</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </Link>

          {/* Deuxième lien - Crypto 24/7 */}
          <Link
            href="https://cryptosignalsx.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-center dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-200 dark:hover:bg-indigo-800/50 dark:hover:text-white dark:hover:border-indigo-300 flex items-center justify-center gap-2 group"
            aria-label={lang === "fr" ? "Voir les signaux Crypto 24/7" : "View 24/7 Crypto Signals"}
            onClick={handleClose}
          >
            <span className="font-semibold">{lang === "fr" ? "Voir les signaux Crypto 24/7" : "View 24/7 Crypto Signals"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

