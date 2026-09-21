"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/lib/i18n/locale-path";

/**
 * Analytics respectueux du consentement :
 * - n'envoie rien si le cookie `te_consent` n'est pas « all » ;
 * - crée un identifiant de session anonyme (cookie first-party `te_session`).
 */

const CONSENT_COOKIE = "te_consent";
const SESSION_COOKIE = "te_session";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeDays: number) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${
    maxAgeDays * 24 * 3600
  };SameSite=Lax`;
}

export function AnalyticsTracker({
  entityType,
  entitySlug,
}: {
  entityType?: "article" | "report" | "webinar";
  entitySlug?: string;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (readCookie(CONSENT_COOKIE) !== "all") return;

    if (!readCookie(SESSION_COOKIE)) {
      const sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
      writeCookie(SESSION_COOKIE, sessionId, 1);
    }

    const type = entityType
      ? entityType === "article"
        ? "ARTICLE_VIEW"
        : entityType === "report"
        ? "REPORT_VIEW"
        : "WEBINAR_VIEW"
      : "PAGE_VIEW";

    const payload = JSON.stringify({
      type,
      // Le préfixe de langue est retiré : les statistiques agrègent par page.
      path: stripLocale(pathname ?? "/"),
      entityType,
      entitySlug,
      referrer: document.referrer || undefined,
    });

    // sendBeacon évite de bloquer la navigation.
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  }, [pathname, entityType, entitySlug]);

  return null;
}
