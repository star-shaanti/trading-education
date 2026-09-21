"use client";

import { useState } from "react";
import { Link } from "@/components/Link";
import { PasswordInput } from "@/components/PasswordInput";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Dict } from "@/lib/i18n";
import { buttonClass, errorClass, inputClass, labelClass } from "@/lib/ui";

/** Inscription gratuite : crée le compte puis connecte directement le membre. */
export function RegisterForm({ labels }: { labels: Dict["auth"] }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((previous) => ({ ...previous, [field]: event.target.value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError(labels.confirmPassword);
      return;
    }

    if (!acceptTerms) {
      setError(labels.termsConsent);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          acceptTerms: true,
          newsletterOptIn,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Erreur");

      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      router.push("/espace-membre?bienvenue=1");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="register-name">
          {labels.name}
        </label>
        <input
          id="register-name"
          type="text"
          autoComplete="given-name"
          value={form.name}
          onChange={update("name")}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="register-email">
          {labels.email}
        </label>
        <input
          id="register-email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="register-password">
            {labels.password}
          </label>
          <PasswordInput
            id="register-password"
            value={form.password}
            onChange={(value) => setForm((current) => ({ ...current, password: value }))}
            minLength={8}
            autoComplete="new-password"
            labels={{ show: labels.showPassword, hide: labels.hidePassword }}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="register-confirm">
            {labels.confirmPassword}
          </label>
          <PasswordInput
            id="register-confirm"
            value={form.confirm}
            onChange={(value) => setForm((current) => ({ ...current, confirm: value }))}
            minLength={8}
            autoComplete="new-password"
            labels={{ show: labels.showPassword, hide: labels.hidePassword }}
          />
        </div>
      </div>

      <label className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(event) => setAcceptTerms(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
        />
        <span>
          {labels.termsConsent}{" "}
          <Link href="/confidentialite" className="text-brand-primary underline">
            →
          </Link>
        </span>
      </label>

      <label className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
        <input
          type="checkbox"
          checked={newsletterOptIn}
          onChange={(event) => setNewsletterOptIn(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
        />
        <span>{labels.newsletterOptIn}</span>
      </label>

      {error && <p className={errorClass}>{error}</p>}

      <button type="submit" disabled={loading} className={`${buttonClass} w-full`}>
        {loading ? "…" : labels.signUp}
      </button>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        {labels.hasAccount}{" "}
        <Link href="/connexion" className="text-brand-primary hover:underline font-medium">
          {labels.signIn}
        </Link>
      </p>
    </form>
  );
}
