"use client";

import { useEffect, useRef, useState } from "react";

interface CMCConverterWidgetProps {
  fromSymbol?: string;
  toSymbol?: string;
  theme?: "light" | "dark";
}

export function CMCConverterWidget({
  fromSymbol = "BTC",
  toSymbol = "USD",
  theme = "light",
}: CMCConverterWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    try {
      containerRef.current.innerHTML = "";

      // Créer un conteneur pour le widget de conversion CoinMarketCap
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "coinmarketcap-currency-converter";
      widgetContainer.setAttribute("data-basecurrency", fromSymbol);
      widgetContainer.setAttribute("data-quote", toSymbol);
      widgetContainer.setAttribute("data-theme", theme);

      containerRef.current.appendChild(widgetContainer);

      // Charger le script de conversion CoinMarketCap
      const script = document.createElement("script");
      script.src =
        "https://files.coinmarketcap.com/static/widget/currency.js";
      script.async = true;
      script.onload = () => setLoading(false);
      script.onerror = () => setLoading(false);

      document.body.appendChild(script);

      setLoading(false);

      return () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    } catch (err) {
      console.error("CMC Converter Widget error:", err);
      setLoading(false);
    }
  }, [fromSymbol, toSymbol, theme]);

  return (
    <div className="w-full">
      {loading && (
        <div className="w-full h-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
      )}
      <div
        ref={containerRef}
        className={`w-full rounded-2xl overflow-hidden ${loading ? "hidden" : ""}`}
        style={{ minHeight: "120px" }}
      />
    </div>
  );
}

