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

      // Détecter si on est sur mobile (écran < 768px = md breakpoint de Tailwind)
      const isMobile = window.innerWidth < 768;
      const widgetHeight = isMobile ? 400 : 640;
      
      const iframe = document.createElement("iframe");
      iframe.src = "https://coinmarketcap.com/heatmap/";
      iframe.width = "100%";
      iframe.height = String(widgetHeight);
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
        <div className="w-full h-[400px] md:h-[640px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
      )}
      <div
        ref={containerRef}
        className={`w-full rounded-2xl overflow-hidden ${loading ? "hidden" : ""}`}
        style={{ 
          minHeight: "400px",
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

