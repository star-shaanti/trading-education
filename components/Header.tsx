"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const Nav = dynamic(() => import("./Nav").then((mod) => ({ default: mod.Nav })), {
  ssr: false,
});

export function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<'en' | 'fr'>('en');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      if (saved === "true") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      }
      const savedLang = localStorage.getItem('lang');
      if (savedLang === 'en' || savedLang === 'fr') {
        setLang(savedLang);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", String(newMode));
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const toggleLang = () => {
    const next = lang === 'en' ? 'fr' : 'en';
    setLang(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', next);
      try {
        window.dispatchEvent(new CustomEvent('lang-change', { detail: next }));
      } catch {}
    }
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 text-2xl font-bold text-gradient focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary rounded"
            >
              <div className="w-10 h-10 flex-shrink-0 text-slate-900 dark:text-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" className="w-full h-full">
                  <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
                    <path d="M16 22V12M16 84V68M36 22V8M36 84V60M60 22V12M60 84V68M80 22V6M80 84V64"/>
                  </g>
                  <rect x="8"  y="22" width="16" height="44" rx="3" fill="#DC2626"/>
                  <rect x="28" y="22" width="16" height="38" rx="3" fill="#16A34A"/>
                  <rect x="52" y="22" width="16" height="44" rx="3" fill="#DC2626"/>
                  <rect x="72" y="22" width="16" height="52" rx="3" fill="#16A34A"/>
                </svg>
              </div>
              <span className="inline-block">
                <span className="block">Trading</span>
                <span className="block">Education</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-2xl font-bold text-gradient focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary rounded group"
          >
            <div className="w-10 h-10 flex-shrink-0 text-slate-900 dark:text-slate-100 group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" className="w-full h-full">
                <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
                  <path d="M16 22V12M16 84V68M36 22V8M36 84V60M60 22V12M60 84V68M80 22V6M80 84V64"/>
                </g>
                <rect x="8"  y="22" width="16" height="44" rx="3" fill="#DC2626"/>
                <rect x="28" y="22" width="16" height="38" rx="3" fill="#16A34A"/>
                <rect x="52" y="22" width="16" height="44" rx="3" fill="#DC2626"/>
                <rect x="72" y="22" width="16" height="52" rx="3" fill="#16A34A"/>
              </svg>
            </div>
            <span className="inline-block">
              <span className="block">Trading</span>
              <span className="block">Education</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Nav />
          </nav>

          <div className="flex items-center gap-4">
            {/* Lang switch */}
            <button
              onClick={toggleLang}
              aria-label={lang === 'en' ? 'Switch to French' : 'Passer en anglais'}
              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary inline-flex items-center gap-1"
              title={lang === 'en' ? 'EN' : 'FR'}
            >
              <span>🌐</span>
              <span>{lang.toUpperCase()}</span>
            </button>
            <button
              onClick={toggleDarkMode}
              aria-label={lang === 'fr' ? (darkMode ? "Passer en mode clair" : "Passer en mode sombre") : (darkMode ? "Switch to light mode" : "Switch to dark mode")}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              {darkMode ? (
                <span className="text-xl">☀️</span>
              ) : (
                <span className="text-xl">🌙</span>
              )}
            </button>
          </div>
        </div>

        <nav className="md:hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Nav mobile />
        </nav>
      </div>
    </header>
  );
}

