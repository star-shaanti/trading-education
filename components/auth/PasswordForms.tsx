"use client";

import { useState } from "react";
import { Link } from "@/components/Link";
import { PasswordInput } from "@/components/PasswordInput";
import type { Dict } from "@/lib/i18n";
import { buttonClass, errorClass, inputClass, labelClass, successClass } from "@/lib/ui";

/** Demande de lien de réinitialisation (réponse toujours neutre). */
export function ForgotPasswordForm({ labels }: { labels: Dict["auth"] }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    await fetch("/api/mot-de-passe-oublie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);

    setLoading(false);
    setMessage(labels.forgotSent);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="forgot-email">
          {labels.email}
        </label>
        <input
          id="forgot-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
        />
      </div>

      <button type="submit" disabled={loading} className={`${buttonClass} w-full`}>
        {loading ? "…" : labels.sendLink}
      </button>

      {message && <p className={successClass}>{message}</p>}

      <p className="text-sm text-slate-600 dark:text-slate-300">
        <Link href="/connexion" className="text-brand-primary hover:underline">
          ← {labels.signIn}
        </Link>
      </p>
    </form>
  );
}

/** Définition du nouveau mot de passe (token reçu par email). */
export function ResetPasswordForm({ labels, token }: { labels: Dict["auth"]; token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (password !== confirm) {
      setError(labels.confirmPassword);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reinitialiser-mot-de-passe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Erreur");
      setDone(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-4">
        <p className={successClass}>{labels.registerSuccess}</p>
        <Link href="/connexion" className={buttonClass}>
          {labels.signIn}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="reset-password">
          {labels.password}
        </label>
        <PasswordInput
          id="reset-password"
          value={password}
          onChange={setPassword}
          minLength={8}
          autoComplete="new-password"
          labels={{ show: labels.showPassword, hide: labels.hidePassword }}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="reset-confirm">
          {labels.confirmPassword}
        </label>
        <PasswordInput
          id="reset-confirm"
          value={confirm}
          onChange={setConfirm}
          minLength={8}
          autoComplete="new-password"
          labels={{ show: labels.showPassword, hide: labels.hidePassword }}
        />
      </div>

      {error && <p className={errorClass}>{error}</p>}

      <button type="submit" disabled={loading} className={`${buttonClass} w-full`}>
        {loading ? "…" : labels.newPassword}
      </button>
    </form>
  );
}
