"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/Link";
import { getDict } from "@/lib/i18n/dict";
import { DEFAULT_LANG, type Lang } from "@/lib/i18n/languages";

/**
 * Bannière de consentement (RGPD / cookies).
 * - « Tout accepter » : active la mesure d'audience first-party (sans tiers) ;
 * - « Essentiel » : seuls les cookies nécessaires (session, consentement).
 * Aucun traceur publicitaire n'est chargé par le site (hors AdSense, géré
 * séparément par Google).
 */
const CONSENT_COOKIE = "te_consent";

export function CookieConsent({ lang = DEFAULT_LANG }: { lang?: Lang }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )te_consent=([^;]*)/);
    if (!match) setVisible(true);
  }, []);

  function decide(value: "all" | "essential") {
    document.cookie = `${CONSENT_COOKIE}=${value};path=/;max-age=${180 * 24 * 3600};SameSite=Lax`;
    setVisible(false);
    window.dispatchEvent(new CustomEvent("te-consent-change", { detail: value }));
  }

  if (!visible) return null;

  const copy = getDict(lang).consent;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentement cookies"
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 py-4"
    >
      <div className="container mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-700 dark:text-slate-200 md:max-w-3xl">
          {copy.text}{" "}
          <Link href="/confidentialite" className="text-brand-primary underline">
            {copy.more}
          </Link>
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("essential")}
            className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {copy.essential}
          </button>
          <button
            type="button"
            onClick={() => decide("all")}
            className="rounded-xl bg-brand-primary hover:bg-brand-primary-700 px-4 py-2 text-sm font-medium text-white"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
