"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANG, dirOf, isLang, type Dir, type Lang } from "@/lib/i18n/languages";

/** Code de langue de l'interface (8 langues, voir lib/i18n/languages.ts). */
export type { Lang };

type LangContextType = {
  lang: Lang;
  dir: Dir;
  setLang: (l: Lang) => void;
};

const LangContext = createContext<LangContextType | undefined>(undefined);

/**
 * Langue de l'interface.
 * `initialLang` provient du cookie `te_lang` lu côté serveur (layout) : le rendu
 * HTML initial est donc déjà dans la bonne langue (SEO + cohérence avec les
 * pages serveur). Le localStorage reste prioritaire côté navigateur lorsqu'il
 * a été renseigné par le sélecteur de langue.
 *
 * `setLang` enregistre la préférence (localStorage + cookie `te_lang`, utilisée
 * pour rediriger les URLs historiques sans préfixe) et applique `lang` / `dir`
 * sur `<html>`. La **navigation** vers l'URL localisée est faite par le
 * sélecteur de langue de l'en-tête : chaque langue possède sa propre URL.
 */
export function LangProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang ?? DEFAULT_LANG);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onLangChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as string | undefined;
      if (isLang(detail)) setLangState(detail);
    };
    window.addEventListener("lang-change", onLangChange as EventListener);
    return () => {
      window.removeEventListener("lang-change", onLangChange as EventListener);
    };
  }, []);

  /**
   * L'URL fait foi : la langue fournie par le serveur (segment `[locale]`) prime
   * sur toute préférence locale. Garde aussi la cohérence lors d'une navigation
   * entre langues (retour arrière du navigateur, changement d'URL).
   */
  useEffect(() => {
    if (initialLang) setLangState(initialLang);
  }, [initialLang]);

  // Langue et sens de lecture du document (RTL pour l'arabe).
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = dirOf(lang);
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", l);
      // Cookie lu par les Server Components (SEO) et par les emails transactionnels.
      document.cookie = `te_lang=${l};path=/;max-age=${365 * 24 * 3600};SameSite=Lax`;
      try {
        window.dispatchEvent(new CustomEvent("lang-change", { detail: l }));
      } catch {}
    }
  };

  const value = useMemo(() => ({ lang, dir: dirOf(lang), setLang }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextType {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
