"use client";

import { useState } from "react";
import { Section } from "@/components/Section";
import { TradingViewChart } from "@/widgets/TradingViewChart";
import BackButton from "@/components/BackButton";
import { AdSlot } from "@/components/AdSlot";
import { useLang } from "@/components/LangContext";
import { PARTNERS } from "@/lib/partners";

export default function RecapPage() {
  const [activeChart, setActiveChart] = useState<string>("BTC");
  // Langue gérée par le contexte global (cookie te_lang + sélecteur de l'en-tête).
  const { lang } = useLang();

  const charts = [
    { id: "BTC", symbol: "BINANCE:BTCUSDT", name: "Bitcoin (BTC/USDT)" },
    { id: "ETH", symbol: "BINANCE:ETHUSDT", name: "Ethereum (ETH/USDT)" },
    { id: "EURUSD", symbol: "FX:EURUSD", name: "EUR/USD" },
    { id: "NAS100", symbol: "OANDA:NAS100USD", name: "NAS100" },
  ];

  const activeChartData = charts.find((c) => c.id === activeChart);

  const COPY = {
    en: {
      pageTitle: "Signals Recap",
      pageSubtitle:
        "Educational market analysis and chart insights (not financial advice)",
      risk:
        "⚠️ Risk Warning: This site provides educational content only. Trading involves a substantial risk of loss. Past performance is not indicative of future results. Never invest more than you can afford to lose.",
      discoverTitle: "Our partner platforms",
      discoverText:
        "Trading signals, broker & prop-firm comparator, free conversion tools and a learning platform: the platforms we recommend to go further.",
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
      discoverTitle: "Nos plateformes partenaires",
      discoverText:
        "Signaux de trading, comparateur de courtiers et de prop firms, outils de conversion gratuits et plateforme d'apprentissage : les plateformes que nous recommandons pour aller plus loin.",
      chartLabel: "Graphique",
      disclaimer:
        "Avertissement : graphiques et analyses à but éducatif uniquement. Ceci n’est pas un conseil en investissement.",
      open: "Ouvrir",
    },
  };

  // Contenu éditorial FR/EN : les autres langues d'interface affichent l'anglais.
  const t = COPY[lang as keyof typeof COPY] ?? COPY.en;

  return (
    <>
      <Section title={t.pageTitle} subtitle={t.pageSubtitle}>
        <BackButton />
        
        <div className="max-w-4xl mx-auto mb-8">
          <div className="card p-6 mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              {lang === "fr" ? "Analyse de marché éducative" : "Educational Market Analysis"}
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              {lang === "fr"
                ? "Cette page vous présente des analyses de marché et des graphiques à des fins éducatives uniquement. Les informations fournies ne constituent pas des conseils financiers ni des recommandations d'investissement. Utilisez ces données pour apprendre à analyser les marchés et à identifier les tendances, mais toujours dans un contexte éducatif."
                : "This page presents market analysis and charts for educational purposes only. The information provided does not constitute financial advice or investment recommendations. Use this data to learn how to analyze markets and identify trends, but always in an educational context."}
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              {lang === "fr"
                ? "Pour aller plus loin : signaux de trading en temps réel, comparateur de courtiers et de prop firms, outils de conversion gratuits et plateforme d'apprentissage. Ces plateformes partenaires sont présentées ci-dessous avec leurs cas d'usage."
                : "To go further: real-time trading signals, a broker & prop-firm comparator, free conversion tools and a learning platform. These partner platforms are listed below with their use cases."}
            </p>
          </div>
        </div>

        <AdSlot format="banner" className="mx-auto my-8 container px-4" />

        <div className="max-w-4xl mx-auto mb-8">
          <div className="card p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">{t.discoverTitle}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-5">{t.discoverText}</p>

            <div className="grid gap-3 md:grid-cols-2">
              {PARTNERS.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:bg-indigo-50/40 dark:hover:bg-slate-800/60 transition-colors"
                  aria-label={`${t.open} ${partner.name} (${partner.domain})`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        <span aria-hidden="true">{partner.emoji}</span> {partner.name}
                      </h4>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {lang === "fr" ? partner.description.fr : partner.description.en}
                      </p>
                    </div>
                    <span className="text-xl opacity-60 group-hover:opacity-100" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {(lang === "fr" ? partner.badges.fr : partner.badges.en).map((badge, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
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

        <AdSlot format="rectangle" className="mx-auto my-8 container px-4" />

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

