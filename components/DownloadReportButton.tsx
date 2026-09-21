"use client";

import { useState } from "react";
import type { Dict } from "@/lib/i18n";
import { buttonClass, errorClass, inputClass, successClass } from "@/lib/ui";

/**
 * Téléchargement gratuit d'un rapport (PDF) + alerte email optionnelle.
 * Le téléchargement passe par /api/rapports/[slug]/telecharger pour être
 * comptabilisé dans les statistiques (aucun paywall).
 */
export function DownloadReportButton({
  reportSlug,
  labels,
  newsletterLabels,
}: {
  reportSlug: string;
  labels: Dict["report"];
  newsletterLabels: Dict["newsletter"];
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  function startDownload() {
    window.location.href = `/api/rapports/${reportSlug}/telecharger`;
  }

  async function subscribe(event: React.FormEvent) {
    event.preventDefault();
    setState("sending");
    setMessage("");

    try {
      const response = await fetch(`/api/rapports/${reportSlug}/telecharger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subscribe: true }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Erreur");

      setState("sent");
      setMessage(newsletterLabels.success);
      setEmail("");
      startDownload();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : newsletterLabels.success);
    }
  }

  return (
    <div className="space-y-5">
      <button type="button" onClick={startDownload} className={`${buttonClass} w-full sm:w-auto`}>
        ⬇ {labels.downloadPdf}
      </button>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5">
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{labels.hint}</p>
        <form onSubmit={subscribe} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            placeholder={newsletterLabels.emailLabel}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
          <button type="submit" disabled={state === "sending"} className={buttonClass}>
            {state === "sending" ? "…" : newsletterLabels.submit}
          </button>
        </form>
        {state === "sent" && <p className={`${successClass} mt-3`}>{message}</p>}
        {state === "error" && <p className={`${errorClass} mt-3`}>{message}</p>}
      </div>
    </div>
  );
}
