"use client";

import { useEffect, useRef } from "react";
import { buttonClass, buttonSecondaryClass } from "@/lib/ui";

/**
 * Boîte de confirmation pour les actions sensibles (déconnexion, suspension,
 * suppression de compte).
 *
 * - `role="dialog"` + `aria-modal`, focus placé sur « Annuler » ;
 * - fermeture par `Échap`, clic sur le fond ou bouton Annuler ;
 * - bouton de confirmation en rouge lorsque l'action est destructive ;
 * - défilement de la page bloqué pendant l'ouverture.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onCancel]);

  if (!open) return null;

  const confirmClass = danger
    ? "inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-60"
    : buttonClass;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
    >
      <div
        aria-hidden="true"
        onClick={onCancel}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
      />
      <div className="relative w-full max-w-md animate-scale-in rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
        )}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className={buttonSecondaryClass}
          >
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} disabled={busy} className={confirmClass}>
            {busy ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
