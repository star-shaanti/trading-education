"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Synchronise le fuseau horaire du visiteur dans un cookie first-party
 * (`te_tz`) afin que les Server Components affichent les dates dans son
 * fuseau local. Un rafraîchissement unique est déclenché si le cookie
 * change (le serveur rend alors les dates au bon fuseau).
 */
export function TimezoneSync() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let timeZone = "";
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    } catch {
      return;
    }
    if (!timeZone) return;

    const match = document.cookie.match(/(?:^|; )te_tz=([^;]*)/);
    const current = match ? decodeURIComponent(match[1]) : null;
    if (current === timeZone) return;

    document.cookie = `te_tz=${encodeURIComponent(timeZone)};path=/;max-age=${
      365 * 24 * 3600
    };SameSite=Lax`;
    router.refresh();
  }, [router]);

  return null;
}
