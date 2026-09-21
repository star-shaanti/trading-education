/**
 * Partenaires de Trading Education — source unique.
 *
 * Utilisé par : la page /ressources, la page d'accueil (CTA), le popup promo
 * et la page /recap. Toute modification (ajout, retrait, changement d'URL ou
 * de texte) se fait ici uniquement, pas dans les composants.
 *
 * Note : Crypto Signals X a été retiré de la liste des partenaires.
 */

export type PartnerCategory = "signals" | "compare" | "tools" | "learning";

export type Partner = {
  id: string;
  name: string;
  url: string;
  domain: string;
  emoji: string;
  category: PartnerCategory;
  /** Mise en avant sur la page d'accueil et dans le popup promo. */
  featured: boolean;
  tagline: { en: string; fr: string };
  description: { en: string; fr: string };
  badges: { en: string[]; fr: string[] };
};

export const PARTNERS: Partner[] = [
  {
    id: "realtimetradesignals",
    name: "Real-Time Trading Signals",
    url: "https://realtimetradesignals.com/",
    domain: "realtimetradesignals.com",
    emoji: "📈",
    category: "signals",
    featured: true,
    tagline: {
      en: "AI BUY/SELL signals, human validated",
      fr: "Signaux BUY/SELL validés par des pros",
    },
    description: {
      en: "Multi-market BUY/SELL signals (Forex, Indices, Crypto) with human validation and a simple execution interface.",
      fr: "Signaux BUY/SELL multi-marchés (Forex, Indices, Crypto) avec validation humaine et interface d'exécution simple.",
    },
    badges: {
      en: ["Real-time", "Human validation", "Forex • Indices • Crypto"],
      fr: ["Temps réel", "Validation humaine", "Forex • Indices • Crypto"],
    },
  },
  {
    id: "marketsignals24",
    name: "Market Signal24",
    url: "https://marketsignals24.com/",
    domain: "marketsignals24.com",
    emoji: "🎯",
    category: "signals",
    featured: true,
    tagline: {
      en: "Signals for every asset and every style",
      fr: "Signaux pour tous les actifs et tous les styles",
    },
    description: {
      en: "Signals covering all asset classes and all trading styles: scalping, day trading and swing trading.",
      fr: "Signaux couvrant toutes les classes d'actifs et tous les styles de trading : scalping, day trading et swing trading.",
    },
    badges: {
      en: ["All assets", "Scalping • Day • Swing", "Multi-market"],
      fr: ["Tous les actifs", "Scalping • Day • Swing", "Multi-marchés"],
    },
  },
  {
    id: "tradecomparator",
    name: "Trade Comparator",
    url: "https://tradecomparator.com",
    domain: "tradecomparator.com",
    emoji: "⚖️",
    category: "compare",
    featured: true,
    tagline: {
      en: "Compare brokers & prop firms",
      fr: "Comparez plateformes et prop firms",
    },
    description: {
      en: "Comparison platform for trading platforms and prop firms: fees, rules, payouts and conditions side by side.",
      fr: "Comparateur de plateformes de trading et de prop firms : frais, règles, retraits et conditions côte à côte.",
    },
    badges: {
      en: ["Brokers", "Prop firms", "Side-by-side"],
      fr: ["Courtiers", "Prop firms", "Comparatif"],
    },
  },
  {
    id: "multi-convert",
    name: "Multi Convert",
    url: "https://multi-convert.com/",
    domain: "multi-convert.com",
    emoji: "🔄",
    category: "tools",
    featured: true,
    tagline: {
      en: "50+ converters, 100% free",
      fr: "50+ convertisseurs, 100% gratuit",
    },
    description: {
      en: "Free conversion platform with more than 50 types of conversion (currencies, units, data, crypto…), no sign-up required.",
      fr: "Plateforme de conversion gratuite avec plus de 50 types de conversions (devises, unités, données, crypto…), sans inscription.",
    },
    badges: {
      en: ["50+ conversions", "100% free", "No sign-up"],
      fr: ["50+ conversions", "100% gratuit", "Sans inscription"],
    },
  },
  {
    id: "imparami",
    name: "Imparami",
    url: "https://imparami.com/",
    domain: "imparami.com",
    emoji: "🎓",
    category: "learning",
    featured: true,
    tagline: {
      en: "Learn languages & school subjects",
      fr: "Apprenez langues et matières",
    },
    description: {
      en: "Learning platform for languages, school subjects and many other fields, with structured courses and progress tracking.",
      fr: "Plateforme d'apprentissage des langues, des matières scolaires et de nombreux autres domaines, avec des parcours structurés et un suivi de progression.",
    },
    badges: {
      en: ["Languages", "School subjects", "Structured courses"],
      fr: ["Langues", "Matières", "Parcours guidés"],
    },
  },
];

/** Partenaires mis en avant (accueil, popup). */
export const FEATURED_PARTNERS: Partner[] = PARTNERS.filter((partner) => partner.featured);

export const PARTNER_CATEGORY_LABELS: Record<
  PartnerCategory,
  { en: string; fr: string }
> = {
  signals: { en: "Trading signals", fr: "Signaux de trading" },
  compare: { en: "Comparators", fr: "Comparateurs" },
  tools: { en: "Utilities", fr: "Utilitaires" },
  learning: { en: "Learning", fr: "Apprentissage" },
};
