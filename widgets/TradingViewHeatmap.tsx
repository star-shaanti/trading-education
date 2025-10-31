"use client";

import { useEffect, useRef, useState } from "react";

interface TradingViewHeatmapProps {
  dataSource?: "crypto" | "forex" | "stocks";
  theme?: "light" | "dark";
  locale?: string;
}

export function TradingViewHeatmap({
  dataSource = "crypto",
  theme = "light",
  locale = "en",
}: TradingViewHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let scriptElement: HTMLScriptElement | null = null;

    const containerId = `tradingview-heatmap-${dataSource}-${Date.now()}`;
    containerRef.current.id = containerId;

    try {
      scriptElement = document.createElement("script");
      scriptElement.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
      scriptElement.async = true;
      scriptElement.type = "text/javascript";
      scriptElement.textContent = JSON.stringify({
        dataSource: dataSource,
        blockSize: "market_cap_calc",
        blockColor: "change",
        locale: locale,
        symbolUrl: "",
        colorTheme: theme,
        hasTopBar: false,
        isDataSetEnabled: false,
        isZoomEnabled: true,
        hasSymbolTooltip: true,
        width: "100%",
        height: 640,
      });

      containerRef.current.appendChild(scriptElement);

      scriptElement.onload = () => setLoading(false);
      scriptElement.onerror = () => setLoading(false);
    } catch (err) {
      console.error("TradingView heatmap error:", err);
      setLoading(false);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [dataSource, theme, locale]);

  return (
    <div className="w-full">
      {loading && (
        <div className="w-full h-[640px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
      )}
      <div
        ref={containerRef}
        className={`tradingview-widget-container ${loading ? "hidden" : ""}`}
        style={{ minHeight: "640px" }}
      />
    </div>
  );
}
