"use client";

import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import BackButton from "@/components/BackButton";
import { useLang } from "@/components/LangContext";
import { AdSlot } from "@/components/AdSlot";
import { PARTNERS, PARTNER_CATEGORY_LABELS } from "@/lib/partners";

/** Ressources internes et outils tiers (hors partenaires, voir lib/partners.ts). */
const resources = [
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
      
      <div className="max-w-4xl mx-auto mb-8">
        <div className="card p-6 mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            {lang === "fr" ? "Ressources pour traders" : "Resources for Traders"}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            {lang === "fr"
              ? "Nous avons sélectionné une liste de ressources utiles pour traders de tous niveaux. Ces plateformes, outils et contenus éducatifs sont choisis pour leur qualité et leur pertinence dans le trading moderne. Que vous cherchiez des signaux de trading, des plateformes d'analyse technique, ou des ressources pédagogiques, vous trouverez ici des options fiables et professionnelles."
              : "We've curated a list of useful resources for traders of all levels. These platforms, tools, and educational content are selected for their quality and relevance in modern trading. Whether you're looking for trading signals, technical analysis platforms, or educational resources, you'll find reliable and professional options here."}
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            {lang === "fr"
              ? "Chaque ressource externe a été évaluée pour sa qualité et son utilité. Nous ne sommes pas affiliés à ces services, mais nous les recommandons car ils offrent une valeur réelle aux traders. Faites toujours vos propres recherches avant de vous engager avec un service tiers."
              : "Each external resource has been evaluated for quality and usefulness. We are not affiliated with these services, but we recommend them because they offer real value to traders. Always conduct your own research before engaging with a third-party service."}
          </p>
        </div>
      </div>

      <AdSlot format="banner" className="mx-auto my-8 container px-4" />

      {/* Plateformes partenaires (source unique : lib/partners.ts) */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {lang === "fr" ? "Nos plateformes partenaires" : "Our partner platforms"}
        </h2>
        <p className="mb-6 max-w-3xl text-slate-600 dark:text-slate-400">
          {lang === "fr"
            ? "Signaux de trading multi-actifs, comparateur de courtiers et de prop firms, convertisseurs gratuits et plateforme d'apprentissage : une sélection de plateformes que nous recommandons et utilisons."
            : "Multi-asset trading signals, broker & prop-firm comparator, free converters and a learning platform: a selection of platforms we recommend and use."}
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map((partner) => (
            <a
              key={partner.id}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${partner.name} (${partner.domain})`}
              className="card block p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  <span aria-hidden="true">{partner.emoji}</span> {partner.name}
                </h3>
                <span className="text-xl opacity-60" aria-hidden="true">
                  ↗
                </span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {PARTNER_CATEGORY_LABELS[partner.category][lang === "fr" ? "fr" : "en"]} · {partner.domain}
              </p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                {lang === "fr" ? partner.description.fr : partner.description.en}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
                {(lang === "fr" ? partner.badges.fr : partner.badges.en).map((badge) => (
                  <span
                    key={badge}
                    className="rounded border border-slate-200 bg-slate-100 px-2 py-1 dark:border-slate-700 dark:bg-slate-800"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        {lang === "fr" ? "Outils et ressources complémentaires" : "Additional tools and resources"}
      </h2>

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

      <AdSlot format="rectangle" className="mx-auto my-8 container px-4" />

      <div className="mt-12 info-box">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <strong>{lang === "fr" ? "Note :" : "Note:"}</strong>{" "}
          {lang === "fr"
            ? "Les plateformes partenaires sont mises en avant sur cette page ; certains liens peuvent être des liens partenaires. Les autres ressources tierces sont fournies à titre informatif, sans affiliation. Faites toujours vos propres recherches avant d'utiliser un service tiers."
            : "Partner platforms are highlighted on this page; some links may be partner links. Other third-party resources are provided for informational purposes, without affiliation. Always do your own research before using a third-party service."}
        </p>
      </div>
    </Section>
  );
}

