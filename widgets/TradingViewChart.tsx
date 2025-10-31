"use client";

import { useEffect, useRef, useState } from "react";

interface TradingViewChartProps {
  symbol: string;
  interval?: "1" | "5" | "15" | "60" | "240" | "D" | "W";
  theme?: "light" | "dark";
  studies?: string[];
  height?: number; // fixed height (fallback)
  ratio?: number; // if fourni, calcule la hauteur = largeur * ratio (ex: 9/16)
  minHeight?: number; // hauteur minimale quand ratio est actif
}

declare global {
  interface Window {
    TradingView?: any;
  }
}

export function TradingViewChart({
  symbol,
  interval = "D",
  theme = "light",
  studies = [],
  height = 480,
  ratio,
  minHeight = 480,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [computedHeight, setComputedHeight] = useState<number>(height);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    let scriptElement: HTMLScriptElement | null = null;

    const initWidget = () => {
      if (!containerRef.current || !window.TradingView) {
        setError("TradingView script not loaded");
        setLoading(false);
        return;
      }

      try {
        // Vider le conteneur
        containerRef.current.innerHTML = "";

        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: "Etc/UTC",
          theme: theme,
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          studies: studies,
          // height is managed by container when autosize=true
        });

        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("TradingView widget error:", err);
        setError("Failed to load chart");
        setLoading(false);
      }
    };

    // Vérifier si le script TradingView est déjà chargé
    if (window.TradingView) {
      initWidget();
    } else {
      // Charger le script TradingView
      scriptElement = document.createElement("script");
      scriptElement.src = "https://s3.tradingview.com/tv.js";
      scriptElement.async = true;
      scriptElement.onload = () => {
        setLoading(true);
        initWidget();
      };
      scriptElement.onerror = () => {
        setError("Failed to load TradingView script");
        setLoading(false);
      };
      document.head.appendChild(scriptElement);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
    };
  }, [symbol, interval, theme, studies, height]);

  // Ajuster la hauteur sur redimensionnement si ratio est fourni
  useEffect(() => {
    if (!ratio || !containerRef.current) return;
    const ro = new ResizeObserver(() => {
      const width = containerRef.current?.clientWidth ?? 0;
      const h = Math.max(minHeight, Math.round(width * ratio));
      setComputedHeight(h);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [ratio, minHeight]);

  // Générer un ID unique pour le conteneur
  const containerId = `tradingview-chart-${symbol.replace(/[^a-zA-Z0-9]/g, "-")}`;

  return (
    <div className="w-full">
      {loading && (
        <div
          className="w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl"
          style={{ height: `${ratio ? computedHeight : height}px` }}
        />
      )}
      {error && (
        <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      <div
        id={containerId}
        ref={containerRef}
        className={`w-full rounded-2xl overflow-hidden ${
          loading || error ? "hidden" : ""
        }`}
        style={{ minHeight: loading || error ? 0 : `${ratio ? computedHeight : height}px`, height: ratio ? `${computedHeight}px` : `${height}px` }}
      />
    </div>
  );
}

