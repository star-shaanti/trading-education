"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sélecteur de thème : un **menu** (Clair / Sombre / Système) plutôt qu'un
 * bouton qui bascule — un clic ouvre le choix, le thème ne change que si
 * l'utilisateur sélectionne explicitement une option.
 *
 * - préférence enregistrée dans `localStorage.theme` (migration de l'ancienne
 *   clé booléenne `darkMode`) ;
 * - **thème clair par défaut** : tant que l'utilisateur n'a rien choisi, le site
 *   reste en clair (le mode « Système » est disponible mais n'est jamais imposé) ;
 * - le mode « Système » suit `prefers-color-scheme` en direct ;
 * - la classe `dark` est appliquée sur `<html>` (comme avant) ;
 * - fermeture au clic extérieur, à `Échap` ; navigation clavier et ARIA
 *   (`role="menu"` / `menuitemradio`) pour l'accessibilité.
 */

export type ThemeChoice = "light" | "dark" | "system";

export type ThemeLabels = {
  label: string;
  light: string;
  dark: string;
  system: string;
};

const STORAGE_KEY = "theme";

export function ThemeMenu({ labels }: { labels: ThemeLabels }) {
  // Défaut : thème clair (le mode « Système » reste un choix explicite).
  const [choice, setChoice] = useState<ThemeChoice>("light");
  const [systemDark, setSystemDark] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Préférence enregistrée (nouvelle clé `theme`, repli sur `darkMode`).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") {
      setChoice(saved);
      return;
    }
    const legacy = localStorage.getItem("darkMode");
    if (legacy === "true") setChoice("dark");
    else if (legacy === "false") setChoice("light");
  }, []);

  // 2. Préférence du système (suivie tant que le thème choisi est « Système »).
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(media.matches);
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // 3. Application du thème effectif.
  useEffect(() => {
    const dark = choice === "dark" || (choice === "system" && systemDark);
    document.documentElement.classList.toggle("dark", dark);
  }, [choice, systemDark]);

  // 4. Fermeture au clic extérieur et à la touche Échap.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const choose = (value: ThemeChoice) => {
    setChoice(value);
    localStorage.setItem(STORAGE_KEY, value);
    // Rétrocompatibilité : d'anciens scripts lisent encore `darkMode`.
    localStorage.setItem("darkMode", String(value === "dark"));
    setOpen(false);
  };

  const options: { value: ThemeChoice; label: string; icon: string }[] = [
    { value: "light", label: labels.light, icon: "☀️" },
    { value: "dark", label: labels.dark, icon: "🌙" },
    { value: "system", label: labels.system, icon: "🖥️" },
  ];

  const current = options.find((option) => option.value === choice) ?? options[2];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={labels.label}
        title={labels.label}
        className="flex items-center gap-1 rounded-lg p-2 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary dark:hover:bg-slate-800"
      >
        <span className="text-xl leading-none" aria-hidden="true">
          {current.icon}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={labels.label}
          className="absolute end-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={choice === option.value}
              onClick={() => choose(option.value)}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span aria-hidden="true">{option.icon}</span>
              <span className="flex-1 text-start">{option.label}</span>
              {choice === option.value && (
                <span className="text-brand-primary dark:text-indigo-300" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
