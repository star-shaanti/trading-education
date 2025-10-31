"use client";

import { Hero } from "@/components/Hero";
import { useLang } from "@/components/LangContext";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { AdSlot } from "@/components/AdSlot";
import { TradingViewTickerTape } from "@/widgets/TradingViewTickerTape";
import { TradingViewChart } from "@/widgets/TradingViewChart";
import { TradingViewScreener } from "@/widgets/TradingViewScreener";
import { CMCHeatmapWidget } from "@/widgets/CMCHeatmapWidget";

export default function HomePage() {
  const { lang } = useLang();
  const popularGuides = [
    lang === "fr"
      ? { title: "Guide de l'indicateur RSI", href: "/guides#rsi", description: "Utiliser le Relative Strength Index" }
      : { title: "RSI Indicator Guide", href: "/guides#rsi", description: "Learn how to use the Relative Strength Index" },
    lang === "fr"
      ? { title: "Bases du Money Management", href: "/guides#money-management", description: "Principes essentiels de gestion du risque" }
      : { title: "Money Management Basics", href: "/guides#money-management", description: "Essential risk management principles" },
    lang === "fr"
      ? { title: "Comprendre l'effet de levier", href: "/guides#leverage", description: "Comment fonctionne le levier" }
      : { title: "Understanding Leverage", href: "/guides#leverage", description: "How leverage works in trading" },
    lang === "fr"
      ? { title: "Stratégie Ichimoku", href: "/guides#ichimoku", description: "Maîtriser l'indicateur Ichimoku" }
      : { title: "Ichimoku Cloud Strategy", href: "/guides#ichimoku", description: "Master the Ichimoku indicator" },
  ];

  const tools = [
    lang === "fr"
      ? { title: "Calculatrice de taille de position", href: "/outils/calculatrice-taille-position", description: "Calculez la taille optimale" }
      : { title: "Position Size Calculator", href: "/outils/calculatrice-taille-position", description: "Calculate optimal position sizes" },
    lang === "fr"
      ? { title: "Calculateur Risk/Reward", href: "/outils/calculateur-risk-reward", description: "Calculez l'espérance de votre stratégie" }
      : { title: "Risk/Reward Calculator", href: "/outils/calculateur-risk-reward", description: "Calculate trading expectancy" },
    lang === "fr"
      ? { title: "Convertisseur de pips", href: "/outils/convertisseur-pips", description: "Convertir pips, points et pourcentage" }
      : { title: "Pips Converter", href: "/outils/convertisseur-pips", description: "Convert pips, points, and percentages" },
    lang === "fr"
      ? { title: "Horaires des marchés", href: "/outils/horaires-marches", description: "Voir les horaires pour chaque marché" }
      : { title: "Market Hours", href: "/outils/horaires-marches", description: "View trading hours for all markets" },
  ];

  return (
    <>
      <Hero />
      
      <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <TradingViewTickerTape />
        </div>
      </div>

      <AdSlot format="banner" className="mx-auto my-8 container px-4" />

      <Section
        title={lang === "fr" ? "Graphiques interactifs" : "Interactive Charts"}
        subtitle={
          lang === "fr"
            ? "Données de marché en temps réel et outils d'analyse"
            : "Real-time market data and analysis tools"
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card title="BTC/USDT Chart" className="p-0 overflow-hidden">
            <TradingViewChart symbol="BINANCE:BTCUSDT" interval="60" ratio={9/16} minHeight={520} />
          </Card>

          <Card title="Crypto Market Screener" className="p-0 overflow-hidden">
            <TradingViewScreener market="crypto" defaultColumn="performance" />
          </Card>
        </div>
        
        {/* Zone de scroll supplémentaire après le Screener (mobile uniquement) */}
        <div className="h-[200px] md:h-0 mb-8 md:mb-0 lg:hidden" />

        <Card title="Heatmap" className="p-0 overflow-hidden mb-8 md:mb-0">
          <CMCHeatmapWidget />
        </Card>
        
        {/* Zone de scroll supplémentaire après le Heatmap */}
        <div className="h-[200px] md:h-20" />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://realtimetradesignals.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center"
            aria-label={lang === "fr" ? "Voir les signaux temps réel multi‑marchés" : "View real-time multi-market signals"}
          >
            {lang === "fr" ? (
              <>
                <span className="text-white font-semibold">Voir les signaux temps réel</span>{" "}
                <span className="text-white/80 font-normal">(Forex • Indices • Crypto)</span>{" "}
                <span className="text-white">↗</span>
              </>
            ) : (
              <>
                <span className="text-white font-semibold">View Real-Time Signals</span>{" "}
                <span className="text-white/80 font-normal">(Forex • Indices • Crypto)</span>{" "}
                <span className="text-white">↗</span>
              </>
            )}
          </a>
          <a
            href="https://cryptosignalsx.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-center dark:bg-indigo-900/30 dark:border-indigo-400 dark:text-indigo-200 dark:hover:bg-indigo-800/50 dark:hover:text-white dark:hover:border-indigo-300"
            aria-label={lang === "fr" ? "Voir les signaux Crypto 24/7" : "View 24/7 Crypto Signals"}
          >
            {lang === "fr" ? "Voir les signaux Crypto 24/7 ↗" : "View 24/7 Crypto Signals ↗"}
          </a>
        </div>
      </Section>

      <Section
        title={lang === "fr" ? "Guides populaires" : "Popular Guides"}
        variant="alt"
        subtitle={
          lang === "fr" ? "Apprenez avec nos guides complets" : "Learn from our comprehensive trading guides"
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularGuides.map((guide, index) => (
            <Card
              key={index}
              title={guide.title}
              description={guide.description}
              href={guide.href}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href="/guides"
            className="btn-secondary inline-block"
          >
            {lang === "fr" ? "Voir tous les guides" : "View All Guides"}
          </a>
        </div>
      </Section>

      <Section
        title={lang === "fr" ? "Outils gratuits" : "Free Trading Tools"}
        subtitle={
          lang === "fr"
            ? "Calculatrices et utilitaires essentiels pour les traders"
            : "Essential calculators and utilities for traders"
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <Card
              key={index}
              title={tool.title}
              description={tool.description}
              href={tool.href}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href="/outils"
            className="btn-secondary inline-block"
          >
            {lang === "fr" ? "Voir tous les outils" : "Explore All Tools"}
          </a>
        </div>
      </Section>

      <AdSlot format="rectangle" className="mx-auto my-8 container px-4" />
    </>
  );
}

