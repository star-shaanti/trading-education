"use client";

import { useState } from "react";
import { inputClass } from "@/lib/ui";

/**
 * Champ « mot de passe » avec bouton œil : permet d'afficher/masquer la saisie
 * (connexion, inscription, réinitialisation). Le bouton est positionné avec des
 * utilitaires logiques (`end-*`, `pe-*`) pour fonctionner aussi en RTL.
 */
export function PasswordInput({
  id,
  value,
  onChange,
  labels,
  autoComplete = "current-password",
  required = true,
  minLength,
  placeholder,
  name,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Libellés traduits du bouton (accessibilité + infobulle). */
  labels: { show: string; hide: string };
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
  name?: string;
}) {
  const [visible, setVisible] = useState(false);
  const actionLabel = visible ? labels.hide : labels.show;

  return (
    <div className="relative">
      <input
        id={id}
        name={name ?? id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${inputClass} pe-12`}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={actionLabel}
        title={actionLabel}
        aria-pressed={visible}
        className="absolute inset-y-0 end-0 flex items-center px-3 text-slate-500 transition-colors hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary dark:text-slate-400 dark:hover:text-indigo-300"
      >
        {visible ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="h-5 w-5"
          >
            <path d="M3 3l18 18" />
            <path d="M10.6 5.1A10.9 10.9 0 0112 5c6.5 0 10 7 10 7a17.6 17.6 0 01-3.2 4.2M6.5 6.7C4 8.3 2 12 2 12s3.5 7 10 7a10.6 10.6 0 004.3-.9" />
            <path d="M9.9 9.9a3 3 0 004.2 4.2" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="h-5 w-5"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
