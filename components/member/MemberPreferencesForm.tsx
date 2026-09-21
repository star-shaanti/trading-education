"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { Dict } from "@/lib/i18n";
import {
  buttonClass,
  buttonDangerClass,
  buttonSecondaryClass,
  errorClass,
  successClass,
} from "@/lib/ui";

type Preferences = { newsletterOptIn: boolean; reportsOptIn: boolean; webinarsOptIn: boolean };

/** Préférences email + droits RGPD (export, suppression du compte confirmée). */
export function MemberPreferencesForm({
  labels,
  confirmLabels,
  initial,
}: {
  labels: Dict["member"];
  confirmLabels: Dict["confirm"];
  initial: Preferences;
}) {
  const [prefs, setPrefs] = useState<Preferences>(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function toggle(field: keyof Preferences) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setPrefs((previous) => ({ ...previous, [field]: event.target.checked }));
  }

  async function save() {
    setState("saving");
    try {
      const response = await fetch("/api/membre/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      if (!response.ok) throw new Error("Erreur");
      setState("saved");
      setMessage(labels.saved);
    } catch {
      setState("error");
      setMessage(labels.deleteWarning);
    }
  }

  async function deleteAccount() {
    setDeleting(true);
    const response = await fetch("/api/membre/donnees", { method: "DELETE" });
    if (response.ok) {
      await signOut({ callbackUrl: "/" });
      return;
    }
    setDeleting(false);
    setConfirming(false);
    setState("error");
    setMessage(labels.deleteWarning);
  }

  const rows: Array<{ field: keyof Preferences; label: string }> = [
    { field: "newsletterOptIn", label: labels.newsletterOptIn },
    { field: "reportsOptIn", label: labels.reportsOptIn },
    { field: "webinarsOptIn", label: labels.webinarsOptIn },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {labels.emailPrefs}
        </h3>
        {rows.map((row) => (
          <label
            key={row.field}
            className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200"
          >
            <input
              type="checkbox"
              checked={prefs[row.field]}
              onChange={toggle(row.field)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
            />
            <span>{row.label}</span>
          </label>
        ))}

        <button type="button" onClick={save} disabled={state === "saving"} className={buttonClass}>
          {state === "saving" ? "…" : labels.save}
        </button>

        {state === "saved" && <p className={successClass}>{message}</p>}
        {state === "error" && <p className={errorClass}>{message}</p>}
      </div>

      <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {labels.dangerZone}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">{labels.deleteWarning}</p>
        <div className="flex flex-wrap gap-3">
          <a href="/api/membre/donnees" className={buttonSecondaryClass}>
            {labels.exportData}
          </a>
          <button type="button" onClick={() => setConfirming(true)} className={buttonDangerClass}>
            {labels.deleteAccount}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        title={confirmLabels.deleteTitle}
        description={labels.deleteWarning}
        confirmLabel={labels.deleteAccount}
        cancelLabel={confirmLabels.cancel}
        danger
        busy={deleting}
        onConfirm={deleteAccount}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
