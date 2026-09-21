"use client";

import { useState } from "react";
import type { Dict } from "@/lib/i18n";
import { buttonClass, errorClass, inputClass, successClass } from "@/lib/ui";

/** Désinscription par email (alternative au lien présent dans chaque email). */
export function UnsubscribeForm({ labels }: { labels: Dict["newsletter"] }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState("sending");

    try {
      const response = await fetch("/api/newsletter", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Erreur");
      setState("done");
      setMessage(labels.unsubscribeSuccess);
    } catch {
      setState("error");
      setMessage("Erreur");
    }
  }

  if (state === "done") {
    return <p className={successClass}>{message}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
          {labels.emailLabel}
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
        />
      </div>
      <button type="submit" disabled={state === "sending"} className={buttonClass}>
        {state === "sending" ? "…" : labels.unsubscribe}
      </button>
      {state === "error" && <p className={errorClass}>Erreur</p>}
    </form>
  );
}
