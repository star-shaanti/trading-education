"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const TradingViewHeatmap = dynamic(
  () => import("@/widgets/TradingViewHeatmap").then((m) => m.TradingViewHeatmap),
  { ssr: false }
);

interface CMCHeatmapWidgetProps {
  theme?: "light" | "dark";
}

export function CMCHeatmapWidget({ theme = "light" }: CMCHeatmapWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let cancelled = false;
    try {
      containerRef.current.innerHTML = "";

      const iframe = document.createElement("iframe");
      iframe.src = "https://coinmarketcap.com/heatmap/";
      iframe.width = "100%";
      iframe.height = "640";
      iframe.frameBorder = "0";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.style.border = "none";
      iframe.style.display = "block";
      iframe.className = "rounded-2xl";

      const onOk = () => {
        if (cancelled) return;
        setLoading(false);
        setFallback(false);
      };
      const onErr = () => {
        if (cancelled) return;
        // Nettoyer tout contenu existant (iframe cassé) pour éviter la zone grise résiduelle
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
        setFallback(true);
        setLoading(false);
      };

      iframe.onload = onOk;
      iframe.onerror = onErr;

      containerRef.current.appendChild(iframe);

      // Si l'iframe est bloqué par X-Frame-Options, déclenche un fallback après 1500 ms
      const t = window.setTimeout(() => {
        if (loading) {
          onErr();
        }
      }, 1500);

      return () => {
        cancelled = true;
        window.clearTimeout(t);
        if (containerRef.current) containerRef.current.innerHTML = "";
      };
    } catch (err) {
      console.error("CMC Heatmap Widget error:", err);
      setFallback(true);
      setLoading(false);
    }
  }, [theme]);

  if (fallback) {
    return (
      <div className="w-full">
        <div className="rounded-2xl overflow-hidden">
          <TradingViewHeatmap dataSource="crypto" theme={theme} />
        </div>
        {/* External link removed on request */}
      </div>
    );
  }

  return (
    <div className="w-full">
      {loading && (
        <div className="w-full h-[640px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
      )}
      <div
        ref={containerRef}
        className={`w-full rounded-2xl overflow-hidden ${loading ? "hidden" : ""}`}
        style={{ minHeight: "640px" }}
      />
    </div>
  );
}

