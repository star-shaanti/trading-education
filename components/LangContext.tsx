"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "fr";

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("lang");
    if (saved === "fr" || saved === "en") setLangState(saved);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "lang" && (e.newValue === "en" || e.newValue === "fr")) {
        setLangState(e.newValue as Lang);
      }
    };
    const onLangChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as Lang | undefined;
      if (detail === "en" || detail === "fr") setLangState(detail);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("lang-change", onLangChange as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("lang-change", onLangChange as EventListener);
    };
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", l);
      try {
        window.dispatchEvent(new CustomEvent("lang-change", { detail: l }));
      } catch {}
    }
  };

  const value = useMemo(() => ({ lang, setLang }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextType {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}


