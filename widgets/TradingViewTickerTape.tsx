"use client";

import { useEffect, useRef, useState } from "react";

interface Symbol {
  proName: string;
  title?: string;
}

interface TradingViewTickerTapeProps {
  symbols?: Symbol[];
  theme?: "light" | "dark";
  isTransparent?: boolean;
  locale?: string;
}

export function TradingViewTickerTape({
  symbols = [
    { proName: "BINANCE:BTCUSDT", title: "Bitcoin" },
    { proName: "BINANCE:ETHUSDT", title: "Ethereum" },
    { proName: "BINANCE:SOLUSDT", title: "Solana" },
    { proName: "BINANCE:XRPUSDT", title: "XRP" },
    { proName: "BINANCE:ADAUSDT", title: "Cardano" },
  ],
  theme = "light",
  isTransparent = false,
  locale = "en",
}: TradingViewTickerTapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let scriptElement: HTMLScriptElement | null = null;
    let configScript: HTMLScriptElement | null = null;

    const containerId = `tradingview-ticker-tape-${Date.now()}`;
    containerRef.current.id = containerId;

    try {
      // Créer le script de configuration
      configScript = document.createElement("script");
      configScript.type = "text/javascript";
      configScript.textContent = JSON.stringify({
        symbols: symbols,
        showSymbolLogo: true,
        colorTheme: theme,
        isTransparent: isTransparent,
        displayMode: "adaptive",
        locale: locale,
      });

      // Créer le script externe TradingView
      scriptElement = document.createElement("script");
      scriptElement.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      scriptElement.async = true;
      scriptElement.innerHTML = configScript.textContent;

      containerRef.current.appendChild(scriptElement);

      scriptElement.onload = () => setLoading(false);
      scriptElement.onerror = () => setLoading(false);
    } catch (err) {
      console.error("TradingView ticker tape error:", err);
      setLoading(false);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, [symbols, theme, isTransparent, locale]);

  return (
    <div className="w-full">
      {loading && (
        <div className="w-full h-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
      )}
      <div
        ref={containerRef}
        className={`tradingview-widget-container ${loading ? "hidden" : ""}`}
        style={{ minHeight: "60px" }}
      />
    </div>
  );
}
