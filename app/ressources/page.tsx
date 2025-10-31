"use client";

import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import BackButton from "@/components/BackButton";
import { useLang } from "@/components/LangContext";

const resources = [
  {
    title: "Real‑time Trading Signals",
    description:
      "Signaux AI BUY/SELL pour Forex, Indices et Crypto — validation humaine, exécution simple.",
    href: "https://realtimetradesignals.com/",
    external: true,
  },
  {
    title: "Crypto Signals X",
    description:
      "Signaux Crypto 24/7 (Scalping, Day & Swing) avec interface premium et mises à jour en continu.",
    href: "https://cryptosignalsx.com/",
    external: true,
  },
  {
    title: "TradingView Platform",
    description: "Advanced charting platform with technical indicators and social trading features.",
    href: "https://www.tradingview.com",
    external: true,
  },
  {
    title: "CoinMarketCap",
    description: "Comprehensive cryptocurrency market data, prices, and market capitalization.",
    href: "https://coinmarketcap.com",
    external: true,
  },
  {
    title: "Economic Calendar",
    description: "Track important economic events that can impact financial markets.",
    href: "/guides/economic-calendar",
  },
  {
    title: "Trading Psychology Resources",
    description: "Books and articles on managing emotions and developing trading discipline.",
    href: "/guides/psychology",
  },
  {
    title: "Risk Management Guides",
    description: "Learn essential risk management techniques to protect your trading capital.",
    href: "/guides/money-management",
  },
  {
    title: "Backtesting Tools",
    description: "Software and platforms for testing trading strategies on historical data.",
    href: "/guides/backtesting",
  },
];

export default function RessourcesPage() {
  const { lang } = useLang();
  const list = resources.map((r) => {
    if (lang !== "fr") return r;
    if (r.title === "TradingView Platform") {
      return { ...r, title: "Plateforme TradingView", description: "Plateforme de graphiques avancés avec indicateurs techniques et fonctionnalités sociales." };
    }
    if (r.title === "CoinMarketCap") {
      return { ...r, description: "Données complètes du marché crypto : prix, capitalisation, classements." };
    }
    if (r.title === "Economic Calendar") {
      return { ...r, title: "Calendrier économique", description: "Suivez les événements macroéconomiques qui peuvent impacter les marchés." };
    }
    if (r.title === "Trading Psychology Resources") {
      return { ...r, title: "Ressources de psychologie du trading", description: "Livres et articles pour gérer les émotions et développer la discipline." };
    }
    if (r.title === "Risk Management Guides") {
      return { ...r, title: "Guides de gestion du risque", description: "Techniques essentielles pour protéger votre capital de trading." };
    }
    if (r.title === "Backtesting Tools") {
      return { ...r, title: "Outils de backtest", description: "Logiciels et plateformes pour tester vos stratégies sur données historiques." };
    }
    return r;
  });
  return (
    <Section
      title={lang === "fr" ? "Ressources" : "Resources"}
      subtitle={
        lang === "fr"
          ? "Liste sélectionnée d'outils, de plateformes et de contenus pédagogiques"
          : "Curated list of tools, platforms, and educational materials"
      }
    >
      <BackButton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((resource, index) => (
          <Card
            key={index}
            title={resource.title}
            description={resource.description}
            href={resource.href}
          >
            {resource.external && (
              <a
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 mt-4 text-brand-primary hover:text-brand-secondary dark:text-indigo-300 dark:hover:text-indigo-200 transition-colors font-medium text-sm group"
              >
                <span>{lang === "fr" ? "Ouvrir" : "Open"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-12 info-box">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <strong>{lang === "fr" ? "Note :" : "Note:"}</strong> {lang === "fr"
            ? "Ces ressources tierces sont fournies à titre informatif. Nous ne sommes pas affiliés à ces plateformes et n'endossons aucun service spécifique. Faites vos propres recherches avant utilisation."
            : "External resources are provided for informational purposes only. We are not affiliated with these platforms and do not endorse any specific trading services. Always conduct your own research before using third-party platforms."}
        </p>
      </div>
    </Section>
  );
}

