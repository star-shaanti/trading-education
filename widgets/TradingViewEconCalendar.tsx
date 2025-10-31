"use client";

import { useEffect, useRef, useState } from "react";

interface TradingViewEconCalendarProps {
  theme?: "light" | "dark";
  locale?: string;
}

export function TradingViewEconCalendar({
  theme = "light",
  locale = "en",
}: TradingViewEconCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let scriptElement: HTMLScriptElement | null = null;

    const containerId = `tradingview-econ-calendar-${Date.now()}`;
    containerRef.current.id = containerId;

    try {
      scriptElement = document.createElement("script");
      scriptElement.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
      scriptElement.async = true;
      scriptElement.type = "text/javascript";
      scriptElement.textContent = JSON.stringify({
        colorTheme: theme,
        isTransparent: false,
        locale: locale,
        width: "100%",
        height: 600,
        importanceFilter: "-1,0,1",
      });

      containerRef.current.appendChild(scriptElement);

      scriptElement.onload = () => setLoading(false);
      scriptElement.onerror = () => setLoading(false);
    } catch (err) {
      console.error("TradingView economic calendar error:", err);
      setLoading(false);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [theme, locale]);

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
