"use client";

import { useEffect, useRef, useState } from "react";

interface CMCPriceWidgetProps {
  symbols?: string[];
  currency?: "USD" | "EUR";
  theme?: "light" | "dark";
}

export function CMCPriceWidget({
  symbols = ["BTC", "ETH", "BNB", "SOL", "XRP"],
  currency = "USD",
  theme = "light",
}: CMCPriceWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    try {
      containerRef.current.innerHTML = "";

      // Créer le conteneur pour le widget CoinMarketCap
      const widgetContainer = document.createElement("div");
      widgetContainer.className = "coinmarketcap-widget-container";
      widgetContainer.setAttribute("data-currency", currency);
      widgetContainer.setAttribute("data-crypto", symbols.join(","));
      widgetContainer.setAttribute("data-theme", theme);

      containerRef.current.appendChild(widgetContainer);

      // Charger le script CoinMarketCap Price Ticker
      const script = document.createElement("script");
      script.src =
        "https://files.coinmarketcap.com/static/widget/currency.js";
      script.async = true;
      script.onload = () => setLoading(false);
      script.onerror = () => setLoading(false);

      // Ajouter l'attribut data-* pour le widget
      widgetContainer.setAttribute(
        "data-url",
        `https://coinmarketcap.com/currencies/${symbols[0]?.toLowerCase()}/`
      );

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
      console.error("CMC Price Widget error:", err);
      setLoading(false);
    }
  }, [symbols, currency, theme]);

  return (
    <div className="w-full">
      {loading && (
        <div className="w-full h-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
      )}
      <div
        ref={containerRef}
        className={`w-full rounded-2xl overflow-hidden ${loading ? "hidden" : ""}`}
        style={{ minHeight: "100px" }}
      />
    </div>
  );
}

