"use client";

import { useState } from "react";
import { Link } from "@/components/Link";
import { PasswordInput } from "@/components/PasswordInput";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Dict } from "@/lib/i18n";
import { buttonClass, errorClass, inputClass, labelClass } from "@/lib/ui";

/** Connexion par email + mot de passe (NextAuth, credentials). */
export function LoginForm({ labels, callbackUrl }: { labels: Dict["auth"]; callbackUrl?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError(labels.invalidCredentials);
      return;
    }

    router.push(callbackUrl || "/espace-membre");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="login-email">
          {labels.email}
        </label>
        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="login-password">
          {labels.password}
        </label>
        <PasswordInput
          id="login-password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          labels={{ show: labels.showPassword, hide: labels.hidePassword }}
        />
      </div>

      {error && <p className={errorClass}>{error}</p>}

      <button type="submit" disabled={loading} className={`${buttonClass} w-full`}>
        {loading ? "…" : labels.signIn}
      </button>

      <div className="flex items-center justify-between text-sm">
        <Link href="/mot-de-passe-oublie" className="text-brand-primary hover:underline">
          {labels.forgotLink}
        </Link>
        <span className="text-slate-600 dark:text-slate-300">
          {labels.noAccount}{" "}
          <Link href="/inscription" className="text-brand-primary hover:underline font-medium">
            {labels.signUp}
          </Link>
        </span>
      </div>
    </form>
  );
}
