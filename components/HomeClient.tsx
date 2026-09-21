"use client";

import type { ReactNode } from "react";
import { Link } from "@/components/Link";
import { Hero } from "@/components/Hero";
import { useLang } from "@/components/LangContext";
import { getDict } from "@/lib/i18n/dict";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { AdSlot } from "@/components/AdSlot";
import { FeatureCard } from "@/components/home/FeatureCard";
import { CardGrid, SectionHeading } from "@/components/home/SectionHeading";
import { FEATURED_PARTNERS } from "@/lib/partners";
import { TradingViewTickerTape } from "@/widgets/TradingViewTickerTape";
import { TradingViewChart } from "@/widgets/TradingViewChart";
import { TradingViewScreener } from "@/widgets/TradingViewScreener";
import { CMCHeatmapWidget } from "@/widgets/CMCHeatmapWidget";

/**
 * Page d'accueil — contenu interactif présenté en cartes homogènes :
 * 1. bandeau de statistiques (rendu serveur, prop `stats`),
 * 2. bloc éditorial : analyses / rapports / webinaires / guides (prop `editorial`),
 * 3. rubriques de la plateforme,
 * 4. marché en direct (ticker + widgets) avec contenu éditorial,
 * 5. outils gratuits,
 * 6. guides pédagogiques,
 * 7. plateformes partenaires,
 * 8. transparence + appel à l'action.
 */
export function HomeClient({
  stats,
  editorial,
  isAuthenticated = false,
}: {
  stats?: ReactNode;
  editorial?: ReactNode;
  /** Membre connecté : les appels à la création de compte sont masqués. */
  isAuthenticated?: boolean;
}) {
  const { lang } = useLang();

  // Libellés de la page d'accueil (8 langues) : voir lib/i18n/dict.
  const t = getDict(lang).home;

  /**
   * Les fiches de lib/partners.ts ne sont traduites qu'en FR/EN :
   * les autres langues d'interface affichent l'anglais.
   */
  const partnerText = (value: { fr: string; en: string }) => (lang === "fr" ? value.fr : value.en);
  const partnerList = (value: { fr: string[]; en: string[] }) =>
    lang === "fr" ? value.fr : value.en;

  type FeatureItem = {
    icon: string;
    title: string;
    description: string;
    href: string;
    highlighted?: boolean;
  };

  /** Icônes et liens des cartes : indépendants de la langue. */
  const CARD_ICONS = {
    features: ["📰", "📄", "🎥", "🎓", "🧮", "📊", "🧭", "⭐"],
    tools: ["🧮", "⚖️", "🔁", "🕒"],
    guides: ["📈", "💰", "⚡", "☁️"],
    trust: ["🔓", "🛡️", "⚖️"],
  };

  const CARD_HREFS = {
    features: [
      "/analyses",
      "/rapports",
      "/webinaires",
      "/guides",
      "/outils",
      "/recap",
      "/ressources",
      "/inscription",
    ],
    tools: [
      "/outils/calculatrice-taille-position",
      "/outils/calculateur-risk-reward",
      "/outils/convertisseur-pips",
      "/outils/horaires-marches",
    ],
    guides: ["/guides/rsi", "/guides/money-management", "/guides/leverage", "/guides/ichimoku"],
    trust: ["/a-propos", "/confidentialite", "/espace-membre"],
  };

  /** Associe les textes traduits à leurs icônes et liens. */
  const toCards = (
    texts: { title: string; description: string }[],
    icons: string[],
    hrefs: string[]
  ): FeatureItem[] =>
    texts.map((text, index) => ({
      ...text,
      icon: icons[index] ?? "•",
      href: hrefs[index] ?? "/",
    }));

  const features: FeatureItem[] = toCards(
    t.features,
    CARD_ICONS.features,
    CARD_HREFS.features
  ).map((item, index) => ({ ...item, highlighted: index === 7 }));
  const tools = toCards(t.tools, CARD_ICONS.tools, CARD_HREFS.tools);
  const guides = toCards(t.guides, CARD_ICONS.guides, CARD_HREFS.guides);
  const trust = toCards(t.trust, CARD_ICONS.trust, CARD_HREFS.trust);

  return (
    <>
      <Hero />

      {/* 1. Bandeau de statistiques (rendu côté serveur) */}
      {stats}

      {/* 2. Toutes les rubriques du site, en cartes */}
      <Section variant="alt">
        <SectionHeading
          eyebrow={t.platformEyebrow}
          title={t.platformTitle}
          subtitle={t.platformSubtitle}
        />
        <CardGrid columns={4}>
          {features.map((feature) => (
            <FeatureCard
              key={feature.href}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              href={feature.href}
              highlighted={feature.highlighted}
              cta={t.featureCta}
            />
          ))}
        </CardGrid>
      </Section>

      {/* 3. Bloc éditorial : analyses récentes + ressources & live (rendu côté serveur) */}
      {editorial}

      {/* 4. Marché en direct : bandeau de cotations + widgets */}
      <div className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-6">
          <TradingViewTickerTape />
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow={t.liveEyebrow} title={t.liveTitle} subtitle={t.liveSubtitle} />

        <div className="mx-auto mb-8 max-w-4xl">
          <div className="card p-6">
            <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-slate-100">
              {t.liveCardTitle}
            </h3>
            <p className="mb-4 text-slate-700 dark:text-slate-300">{t.liveCardText1}</p>
            <p className="text-slate-700 dark:text-slate-300">{t.liveCardText2}</p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card title={t.chartCard} className="p-0 overflow-hidden">
            <TradingViewChart symbol="BINANCE:BTCUSDT" interval="60" ratio={9 / 16} minHeight={520} />
          </Card>

          <Card title={t.screenerCard} className="p-0 overflow-hidden">
            <TradingViewScreener market="crypto" defaultColumn="performance" />
          </Card>
        </div>

        {/* Zone de scroll supplémentaire après le Screener (mobile uniquement) */}
        <div className="mb-8 h-[200px] md:mb-0 md:h-0 lg:hidden" />

        <Card title={t.heatmapCard} className="p-0 overflow-hidden">
          <CMCHeatmapWidget />
        </Card>

        {/* Zone de scroll supplémentaire après le Heatmap */}
        <div className="h-[200px] md:h-20" />
      </Section>

      <AdSlot format="banner" className="mx-auto my-8 container px-4" />

      {/* 5. Outils gratuits */}
      <Section variant="alt">
        <SectionHeading
          eyebrow={t.toolsEyebrow}
          title={t.toolsTitle}
          subtitle={t.toolsSubtitle}
          linkHref="/outils"
          linkLabel={t.toolsAll}
        />
        <CardGrid columns={4}>
          {tools.map((tool) => (
            <FeatureCard
              key={tool.href}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              cta={t.openTool}
            />
          ))}
        </CardGrid>
      </Section>

      {/* 6. Guides pédagogiques */}
      <Section>
        <SectionHeading
          eyebrow={t.guidesEyebrow}
          title={t.guidesTitle}
          subtitle={t.guidesSubtitle}
          linkHref="/guides"
          linkLabel={t.guidesAll}
        />
        <CardGrid columns={4}>
          {guides.map((guide) => (
            <FeatureCard
              key={guide.href}
              icon={guide.icon}
              title={guide.title}
              description={guide.description}
              href={guide.href}
              cta={t.readGuide}
            />
          ))}
        </CardGrid>
      </Section>

      <AdSlot format="rectangle" className="mx-auto my-8 container px-4" />

      {/* 7. Plateformes partenaires */}
      <Section variant="alt">
        <SectionHeading
          eyebrow={t.partnersEyebrow}
          title={t.partnersTitle}
          subtitle={t.partnersSubtitle}
          linkHref="/ressources"
          linkLabel={t.partnersAll}
        />
        <CardGrid columns={3}>
          {FEATURED_PARTNERS.map((partner) => (
            <FeatureCard
              key={partner.id}
              icon={partner.emoji}
              title={partner.name}
              description={partnerText(partner.description)}
              href={partner.url}
              external
              badge={t.partnerBadge}
              tags={partnerList(partner.badges)}
              cta={`${t.openTool} — ${partner.domain}`}
            />
          ))}
        </CardGrid>
        <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
          {t.partnerDisclaimer}
        </p>
      </Section>

      {/* 8. Transparence + appel à l'action */}
      <Section>
        <SectionHeading eyebrow={t.trustEyebrow} title={t.trustTitle} subtitle={t.trustSubtitle} />
        <CardGrid columns={3}>
          {trust.map((item) => (
            <FeatureCard
              key={item.href}
              icon={item.icon}
              title={item.title}
              description={item.description}
              href={item.href}
              cta={t.learnMore}
            />
          ))}
        </CardGrid>

        {!isAuthenticated && (
          <div className="card mt-10 p-8 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.ctaTitle}</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              {t.ctaText}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/inscription" className="btn-primary text-center">
                {t.ctaPrimary}
              </Link>
              <Link href="/analyses" className="btn-secondary text-center">
                {t.ctaSecondary}
              </Link>
              <Link href="/espace-membre/preferences" className="btn-tertiary text-center">
                {t.ctaNewsletter}
              </Link>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
