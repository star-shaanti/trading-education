"use client";

import { useState } from "react";
import type { Dict } from "@/lib/i18n";
import { buttonClass, errorClass, inputClass, labelClass, successClass } from "@/lib/ui";

type Props = {
  labels: Dict["newsletter"];
  source?: string;
  compact?: boolean;
};

/** Formulaire d'abonnement (double opt-in : un email de confirmation est envoyé). */
export function NewsletterForm({ labels, source = "site", compact = false }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!consent) {
      setState("error");
      setMessage(labels.consent);
      return;
    }

    setState("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, consent: true, source }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) throw new Error(payload.error ?? "Erreur");

      setState("sent");
      setMessage(labels.success);
      setEmail("");
      setName("");
      setConsent(false);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : labels.success);
    }
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      <div className={compact ? "" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <label className={labelClass} htmlFor="newsletter-email">
            {labels.emailLabel}
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="newsletter-name">
            {labels.nameLabel}
          </label>
          <input
            id="newsletter-name"
            type="text"
            autoComplete="given-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
        />
        <span>{labels.consent}</span>
      </label>

      <button type="submit" disabled={state === "sending"} className={buttonClass}>
        {state === "sending" ? "…" : labels.submit}
      </button>

      {state === "sent" && <p className={successClass}>{message}</p>}
      {state === "error" && <p className={errorClass}>{message}</p>}
    </form>
  );
}
