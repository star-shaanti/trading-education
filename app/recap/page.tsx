"use client";

import { useEffect, useState } from "react";
import { Section } from "@/components/Section";
import { TradingViewChart } from "@/widgets/TradingViewChart";
import BackButton from "@/components/BackButton";

type Lang = "en" | "fr";

export default function RecapPage() {
  const [activeChart, setActiveChart] = useState<string>("BTC");
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("lang");
    if (saved === "fr" || saved === "en") setLang(saved);
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'lang' && (e.newValue === 'en' || e.newValue === 'fr')) {
        setLang(e.newValue as Lang);
      }
    };
    const onLangChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as Lang | undefined;
      if (detail === 'en' || detail === 'fr') setLang(detail);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('lang-change', onLangChange as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('lang-change', onLangChange as EventListener);
    };
  }, []);

  const setLangPersist = (l: Lang) => {
    setLang(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const charts = [
    { id: "BTC", symbol: "BINANCE:BTCUSDT", name: "Bitcoin (BTC/USDT)" },
    { id: "ETH", symbol: "BINANCE:ETHUSDT", name: "Ethereum (ETH/USDT)" },
    { id: "EURUSD", symbol: "FX:EURUSD", name: "EUR/USD" },
    { id: "NAS100", symbol: "OANDA:NAS100USD", name: "NAS100" },
  ];

  const activeChartData = charts.find((c) => c.id === activeChart);

  const t = {
    en: {
      pageTitle: "Signals Recap",
      pageSubtitle:
        "Educational market analysis and chart insights (not financial advice)",
      risk:
        "⚠️ Risk Warning: This site provides educational content only. Trading involves a substantial risk of loss. Past performance is not indicative of future results. Never invest more than you can afford to lose.",
      discoverTitle: "Discover actionable real‑time signals",
      discoverText:
        "Access clear dashboards, AI‑filtered signals and human validation for reliable market reads. Choose the platform that best matches your trading style:",
      card1Title: "Real‑time Trading Signals",
      card1Text:
        "Multi‑market BUY/SELL signals validated by pro traders. Ideal for Forex, Indices and Crypto.",
      r1: ["Real‑time", "Human validation", "Forex • Indices • Crypto"],
      card2Title: "Crypto Signals X",
      card2Text:
        "24/7 Crypto signals (Scalping, Day & Swing) with AI + quality control for clean entries.",
      r2: ["Crypto 24/7", "Scalping • Day • Swing", "Premium interface"],
      chartLabel: "Chart",
      disclaimer:
        "Disclaimer: Charts and analysis are provided for educational purposes only. This is not investment advice.",
      open: "Open",
    },
    fr: {
      pageTitle: "Récapitulatif des signaux",
      pageSubtitle:
        "Analyse pédagogique du marché et synthèse des opportunités (aucun conseil financier)",
      risk:
        "⚠️ Avertissement : ce site fournit des informations éducatives. Le trading comporte un risque de pertes. Les performances passées ne préjugent pas des performances futures.",
      discoverTitle: "Découvrez des signaux exploitables en temps réel",
      discoverText:
        "Accédez à des tableaux de bord clairs, des signaux filtrés par l’IA et une validation humaine pour une lecture fiable du marché. Choisissez la plateforme qui correspond le mieux à votre style de trading :",
      card1Title: "Real‑time Trading Signals",
      card1Text:
        "Signaux BUY/SELL multi‑marchés, validés par des traders pros. Idéal pour Forex, Indices et Crypto.",
      r1: ["Temps réel", "Validation humaine", "Forex • Indices • Crypto"],
      card2Title: "Crypto Signals X",
      card2Text:
        "Signaux Crypto 24/7 (Scalping, Day & Swing) avec IA + contrôle qualité pour des entrées nettes.",
      r2: ["Crypto 24/7", "Scalping • Day • Swing", "Interface premium"],
      chartLabel: "Graphique",
      disclaimer:
        "Avertissement : graphiques et analyses à but éducatif uniquement. Ceci n’est pas un conseil en investissement.",
      open: "Ouvrir",
    },
  }[lang];

  return (
    <>
      <Section title={t.pageTitle} subtitle={t.pageSubtitle}>
        <BackButton />
        <div className="max-w-4xl mx-auto mb-8">
          <div className="card p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">{t.discoverTitle}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-5">{t.discoverText}</p>

            <div className="grid gap-3 md:grid-cols-2">
              <a
                href="https://realtimetradesignals.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:bg-indigo-50/40 dark:hover:bg-slate-800/60 transition-colors"
                aria-label="Ouvrir Real‑time Trading Signals dans un nouvel onglet"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.card1Title}</h4>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.card1Text}</p>
                  </div>
                  <span className="text-xl opacity-60 group-hover:opacity-100">↗</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  {t.r1.map((b, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">{b}</span>
                  ))}
                </div>
              </a>

              <a
                href="https://cryptosignalsx.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:bg-indigo-50/40 dark:hover:bg-slate-800/60 transition-colors"
                aria-label="Ouvrir Crypto Signals X dans un nouvel onglet"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.card2Title}</h4>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.card2Text}</p>
                  </div>
                  <span className="text-xl opacity-60 group-hover:opacity-100">↗</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  {t.r2.map((b, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">{b}</span>
                  ))}
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="card p-6 mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {charts.map((chart) => (
              <button
                key={chart.id}
                onClick={() => setActiveChart(chart.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeChart === chart.id
                    ? "bg-brand-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {chart.name}
              </button>
            ))}
          </div>

          {activeChartData && (
            <div>
              <h3 className="text-xl font-bold mb-4">{activeChartData.name} {t.chartLabel}</h3>
              <TradingViewChart symbol={activeChartData.symbol} interval="D" />
            </div>
          )}
        </div>

        <div className="info-box">
          <p className="text-sm text-slate-700 dark:text-slate-300">{t.disclaimer}</p>
        </div>

        <div className="info-box bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 mt-6">
          <p className="text-sm text-red-800 dark:text-red-200 font-medium">{t.risk}</p>
        </div>
      </Section>
    </>
  );
}

