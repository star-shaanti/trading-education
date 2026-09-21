"use client";

import { useState } from "react";
import { Link } from "@/components/Link";
import type { Dict } from "@/lib/i18n";
import { buttonClass, errorClass, inputClass, labelClass, successClass } from "@/lib/ui";

/** Inscription gratuite à un webinaire (compte connecté ou email seul). */
export function WebinarRegisterForm({
  webinarSlug,
  labels,
  authLabels,
  isAuthenticated,
  memberEmail,
  joinUrl,
}: {
  webinarSlug: string;
  labels: Dict["webinar"];
  authLabels: Dict["auth"];
  isAuthenticated: boolean;
  memberEmail?: string | null;
  joinUrl?: string | null;
}) {
  const [email, setEmail] = useState(memberEmail ?? "");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState("sending");
    setMessage("");

    try {
      const response = await fetch(`/api/webinaires/${webinarSlug}/inscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        alreadyRegistered?: boolean;
      };
      if (!response.ok) throw new Error(payload.error ?? "Erreur");

      setState("done");
      setMessage(labels.confirmationSent);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : labels.confirmationSent);
    }
  }

  if (state === "done") {
    return (
      <div className="space-y-3">
        <p className={successClass}>
          ✅ {labels.registered} — {message}
        </p>
        {joinUrl && (
          <a
            href={joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
          >
            {labels.register}
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!isAuthenticated && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="webinar-email">
              {authLabels.email}
            </label>
            <input
              id="webinar-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="webinar-name">
              {authLabels.name}
            </label>
            <input
              id="webinar-name"
              type="text"
              autoComplete="given-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      )}

      <button type="submit" disabled={state === "sending"} className={buttonClass}>
        {state === "sending" ? "…" : labels.register}
      </button>

      {state === "error" && <p className={errorClass}>{message}</p>}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {labels.freeAccess} —{" "}
        {isAuthenticated ? (
          <Link href="/espace-membre" className="text-brand-primary hover:underline">
            {authLabels.welcome}
          </Link>
        ) : (
          <Link href="/inscription" className="text-brand-primary hover:underline">
            {authLabels.signUp}
          </Link>
        )}
      </p>
    </form>
  );
}
