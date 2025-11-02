"use client";

import { useEffect } from "react";

interface AdSlotProps {
  format?: "banner" | "rectangle" | "sidebar";
  className?: string;
}

export function AdSlot({ format = "banner", className = "" }: AdSlotProps) {
  const heights: Record<string, string> = {
    banner: "min-h-[120px]",
    rectangle: "min-h-[250px]",
    sidebar: "min-h-[600px]",
  };

  useEffect(() => {
    try {
      // Initialiser les annonces AdSense après le chargement du script
      if (typeof window !== "undefined" && (window as any).adsbygoogle && (window as any).adsbygoogle.loaded !== true) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      // Erreur silencieuse en cas de problème avec AdSense
    }
  }, []);

  return (
    <div
      role="complementary"
      aria-label="advertisement"
      className={`${heights[format]} w-full
        bg-slate-50 dark:bg-slate-900
        border border-slate-200 dark:border-slate-800
        rounded-2xl ${className}`}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: "block",
          textAlign: "center",
        }}
        data-ad-client="ca-pub-5343389597650456"
        data-ad-format={format === "banner" ? "auto" : format === "rectangle" ? "auto" : "auto"}
        data-full-width-responsive="true"
      />
    </div>
  );
}

