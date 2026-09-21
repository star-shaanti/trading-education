"use client";

import { signOut } from "next-auth/react";

/** Déconnexion (utilisée dans l'espace membre et l'administration). */
export function LogoutButton({
  label,
  className = "text-sm text-slate-600 dark:text-slate-300 hover:text-brand-primary",
}: {
  label: string;
  className?: string;
}) {
  return (
    <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className={className}>
      {label}
    </button>
  );
}
