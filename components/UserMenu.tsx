"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Link } from "@/components/Link";
import { useLang } from "@/components/LangContext";
import { getDict } from "@/lib/i18n/dict";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  role?: string;
} | null;

/** Action sensible en attente de confirmation. */
type PendingAction = "logout" | "suspend" | "delete";

/** Initiales affichées dans la pastille (nom, sinon email). */
function initialsOf(user: SessionUser): string {
  const source = user?.name?.trim() || user?.email || "";
  if (!source) return "?";
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

/**
 * Menu du compte connecté : remplace le bouton « Connexion » dans l'en-tête.
 *
 * - identité (nom + email) ;
 * - espace membre, préférences email, administration (selon le rôle) ;
 * - **Paramètres** → sous-catégorie « suspension » et « suppression » du compte ;
 * - déconnexion.
 *
 * Les trois actions sensibles (déconnexion, suspension, suppression) demandent
 * une **confirmation** (`ConfirmDialog`). La suspension est réversible : les
 * données sont conservées, les emails interrompus, et le compte est réactivé
 * automatiquement à la prochaine connexion.
 */
export function UserMenu({ user }: { user: SessionUser }) {
  const { lang } = useLang();
  const t = getDict(lang);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

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

  const canAdmin = user?.role === "ADMIN" || user?.role === "EDITOR";
  const displayName = user?.name?.trim() || user?.email || t.member.title;

  /** Ouvre la confirmation d'une action sensible (referme le menu). */
  function ask(action: PendingAction) {
    setError("");
    setOpen(false);
    setPending(action);
  }

  /** Exécute l'action confirmée. */
  async function confirmPending() {
    if (!pending) return;

    if (pending === "logout") {
      await signOut({ callbackUrl: "/" });
      return;
    }

    setBusy(true);
    try {
      const endpoint = pending === "suspend" ? "/api/membre/suspension" : "/api/membre/donnees";
      const response = await fetch(endpoint, {
        method: pending === "suspend" ? "POST" : "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? t.errors.generic);
      }

      await signOut({ callbackUrl: "/" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.errors.generic);
      setPending(null);
      setOpen(true);
    } finally {
      setBusy(false);
    }
  }

  const dialog = {
    logout: {
      title: t.confirm.logoutTitle,
      description: t.confirm.logoutText,
      confirmLabel: t.nav.logout,
      danger: false,
    },
    suspend: {
      title: t.confirm.suspendTitle,
      description: t.member.suspendWarning,
      confirmLabel: t.member.suspendAccount,
      danger: true,
    },
    delete: {
      title: t.confirm.deleteTitle,
      description: t.member.deleteWarning,
      confirmLabel: t.member.deleteAccount,
      danger: true,
    },
  } as const;

  const itemClass =
    "block w-full px-3 py-2 text-start text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={displayName}
        title={displayName}
        className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <span
          aria-hidden="true"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-[11px] font-bold text-white"
        >
          {initialsOf(user)}
        </span>
        <span className="hidden max-w-[9rem] truncate lg:inline">{displayName}</span>
        <span aria-hidden="true" className="text-[10px] text-slate-500 dark:text-slate-400">
          ▾
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t.member.title}
          className="absolute end-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-700">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {user?.name?.trim() || t.member.title}
            </p>
            {user?.email && (
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            )}
          </div>

          <Link
            href="/espace-membre"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            {t.nav.member}
          </Link>

          <Link
            href="/espace-membre/preferences"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            {t.member.emailPrefs}
          </Link>

          {canAdmin && (
            <Link href="/admin" role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
              {t.nav.admin}
            </Link>
          )}

          {/* Paramètres → sous-catégorie suspension / suppression du compte */}
          <button
            type="button"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((current) => !current)}
            className={`${itemClass} flex items-center justify-between gap-2 border-t border-slate-100 font-medium dark:border-slate-700`}
          >
            <span>{t.member.settings}</span>
            <span aria-hidden="true" className="text-[10px] text-slate-500 dark:text-slate-400">
              {settingsOpen ? "▾" : "▸"}
            </span>
          </button>

          {settingsOpen && (
            <div className="bg-slate-50/70 px-2 py-1 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => ask("suspend")}
                className="w-full rounded-lg px-2 py-2 text-start text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {t.member.suspendAccount}
              </button>
              <button
                type="button"
                onClick={() => ask("delete")}
                className="w-full rounded-lg px-2 py-2 text-start text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                {t.member.deleteAccount}
              </button>
            </div>
          )}

          {error && (
            <p className="px-3 py-2 text-xs text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="button"
            role="menuitem"
            onClick={() => ask("logout")}
            className="mt-1 block w-full border-t border-slate-100 px-3 py-2 text-start text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {t.nav.logout}
          </button>
        </div>
      )}

      <ConfirmDialog
        open={pending !== null}
        title={pending ? dialog[pending].title : ""}
        description={pending ? dialog[pending].description : undefined}
        confirmLabel={pending ? dialog[pending].confirmLabel : ""}
        cancelLabel={t.confirm.cancel}
        danger={pending ? dialog[pending].danger : false}
        busy={busy}
        onConfirm={confirmPending}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
