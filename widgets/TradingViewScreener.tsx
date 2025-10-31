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
    <div className="w-full relative">
      {/* Zone de scroll pass-through en haut (mobile et desktop) */}
      <div 
        className="absolute top-0 left-0 right-0 z-10 h-12 md:h-8"
        style={{ 
          pointerEvents: 'auto',
          touchAction: 'pan-y',
          cursor: 'default',
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.01))'
        }}
        onTouchStart={(e) => {
          // Permet le scroll de la page depuis cette zone (mobile)
          if (e.touches.length > 0) {
            const touch = e.touches[0];
            const scrollY = window.scrollY;
            const startY = touch.clientY;
            
            const handleMove = (moveEvent: TouchEvent) => {
              if (moveEvent.touches.length > 0) {
                const deltaY = moveEvent.touches[0].clientY - startY;
                window.scrollTo({
                  top: scrollY - deltaY,
                  behavior: 'auto'
                });
              }
            };
            
            const handleEnd = () => {
              document.removeEventListener('touchmove', handleMove);
              document.removeEventListener('touchend', handleEnd);
            };
            
            document.addEventListener('touchmove', handleMove, { passive: false });
            document.addEventListener('touchend', handleEnd);
          }
        }}
        onWheel={(e) => {
          // Permet le scroll de la page avec la molette depuis cette zone (desktop)
          window.scrollBy({
            top: e.deltaY,
            behavior: 'auto'
          });
        }}
        onMouseDown={(e) => {
          // Empêche l'interaction avec le widget, permet le scroll de la page
          if (e.button === 0) {
            e.preventDefault();
            const startY = e.clientY;
            const scrollY = window.scrollY;
            
            const handleMove = (moveEvent: MouseEvent) => {
              const deltaY = moveEvent.clientY - startY;
              window.scrollTo({
                top: scrollY - deltaY,
                behavior: 'auto'
              });
            };
            
            const handleEnd = () => {
              document.removeEventListener('mousemove', handleMove);
              document.removeEventListener('mouseup', handleEnd);
            };
            
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);
          }
        }}
      />
      
      {loading && (
        <div className="w-full h-[600px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
      )}
      <div
        ref={containerRef}
        className={`tradingview-widget-container ${loading ? "hidden" : ""}`}
        style={{ 
          minHeight: "600px",
          touchAction: 'pan-y pinch-zoom',
          position: 'relative',
          zIndex: 1
        }}
      />
      
      {/* Zone de scroll pass-through en bas (mobile et desktop) */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-10 h-16 md:h-12"
        style={{ 
          pointerEvents: 'auto',
          touchAction: 'pan-y',
          cursor: 'default',
          background: 'linear-gradient(to top, transparent, rgba(0,0,0,0.01))'
        }}
        onTouchStart={(e) => {
          // Permet le scroll de la page depuis cette zone (mobile)
          if (e.touches.length > 0) {
            const touch = e.touches[0];
            const scrollY = window.scrollY;
            const startY = touch.clientY;
            
            const handleMove = (moveEvent: TouchEvent) => {
              if (moveEvent.touches.length > 0) {
                const deltaY = moveEvent.touches[0].clientY - startY;
                window.scrollTo({
                  top: scrollY - deltaY,
                  behavior: 'auto'
                });
              }
            };
            
            const handleEnd = () => {
              document.removeEventListener('touchmove', handleMove);
              document.removeEventListener('touchend', handleEnd);
            };
            
            document.addEventListener('touchmove', handleMove, { passive: false });
            document.addEventListener('touchend', handleEnd);
          }
        }}
        onWheel={(e) => {
          // Permet le scroll de la page avec la molette depuis cette zone (desktop)
          window.scrollBy({
            top: e.deltaY,
            behavior: 'auto'
          });
        }}
        onMouseDown={(e) => {
          // Empêche l'interaction avec le widget, permet le scroll de la page
          if (e.button === 0) {
            e.preventDefault();
            const startY = e.clientY;
            const scrollY = window.scrollY;
            
            const handleMove = (moveEvent: MouseEvent) => {
              const deltaY = moveEvent.clientY - startY;
              window.scrollTo({
                top: scrollY - deltaY,
                behavior: 'auto'
              });
            };
            
            const handleEnd = () => {
              document.removeEventListener('mousemove', handleMove);
              document.removeEventListener('mouseup', handleEnd);
            };
            
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);
          }
        }}
      />
    </div>
  );
}
