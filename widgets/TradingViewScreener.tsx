"use client";

import { useEffect, useRef, useState } from "react";

interface TradingViewScreenerProps {
  market?: "crypto" | "forex" | "stock";
  defaultColumn?: string;
  theme?: "light" | "dark";
  locale?: string;
}

export function TradingViewScreener({
  market = "crypto",
  defaultColumn = "overview",
  theme = "light",
  locale = "en",
}: TradingViewScreenerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let scriptElement: HTMLScriptElement | null = null;

    const containerId = `tradingview-screener-${market}-${Date.now()}`;
    containerRef.current.id = containerId;

    try {
      scriptElement = document.createElement("script");
      scriptElement.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
      scriptElement.async = true;
      scriptElement.type = "text/javascript";
      scriptElement.textContent = JSON.stringify({
        width: "100%",
        height: 600,
        defaultColumn: String(defaultColumn).toLowerCase(),
        screener_type: market,
        displayCurrency: "USD",
        colorTheme: theme,
        locale: locale,
      });

      containerRef.current.appendChild(scriptElement);

      scriptElement.onload = () => setLoading(false);
      scriptElement.onerror = () => setLoading(false);
    } catch (err) {
      console.error("TradingView screener error:", err);
      setLoading(false);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [market, defaultColumn, theme, locale]);

  return (
    <div className="w-full">
      {loading && (
        <div className="w-full h-[600px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
      )}
      <div
        ref={containerRef}
        className={`tradingview-widget-container ${loading ? "hidden" : ""}`}
        style={{ minHeight: "600px" }}
      />
    </div>
  );
}
