import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { safeServerSession } from "@/lib/auth";
import { AuthProvider } from "@/components/AuthProvider";
import { LangProvider } from "@/components/LangContext";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, dirOf, getLang } from "@/lib/i18n";
import { SITE_NAME, siteJsonLd } from "@/lib/seo";

/**
 * En-tête et pied de page sont rendus **côté serveur** : les liens de
 * navigation internes (et le maillage du pied de page) sont ainsi présents dans
 * le HTML initial — crawlables et sans décalage visuel à l'hydratation.
 * La langue vient de l'URL (segment `[locale]`) : rendu serveur == rendu client.
 */
const Header = dynamic(() => import("@/components/Header").then((mod) => ({ default: mod.Header })));
const Footer = dynamic(() => import("@/components/Footer").then((mod) => ({ default: mod.Footer })));
const PromoPopup = dynamic(() => import("@/components/PromoPopup"), {
  ssr: false,
});
const CookieConsent = dynamic(
  () => import("@/components/CookieConsent").then((mod) => ({ default: mod.CookieConsent })),
  { ssr: false }
);
const AnalyticsTracker = dynamic(
  () => import("@/components/AnalyticsTracker").then((mod) => ({ default: mod.AnalyticsTracker })),
  { ssr: false }
);
const TimezoneSync = dynamic(
  () => import("@/components/TimezoneSync").then((mod) => ({ default: mod.TimezoneSync })),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Trading Education | Educational Trading & Media Platform",
    template: "%s | Trading Education",
  },
  description:
    "Analyses de marché, rapports hebdomadaires PDF et webinaires gratuits. Contenu éducatif ouvert à tous, sans paywall et sans données bancaires.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
    ],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.json",
  applicationName: SITE_NAME,
  other: {
    "google-adsense-account": "ca-pub-5343389597650456",
  },
  // Le flux RSS est déclaré dans <head> (voir plus bas) : `alternates.types` est
  // écrasé par le `canonical` défini page par page.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "fr_FR",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
  /**
   * Directives d'indexation : aperçus larges (Discover / SERP enrichis) et
   * snippets complets. Les pages privées posent leur propre `robots`.
   */
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  // Vérifications moteurs (renseigner les variables d'environnement en prod).
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      ...(process.env.BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
        : {}),
      ...(process.env.YANDEX_SITE_VERIFICATION
        ? { "yandex-verification": process.env.YANDEX_SITE_VERIFICATION }
        : {}),
    },
  },
};

/**
 * Viewport mobile : largeur de l'appareil, zoom autorisé (accessibilité) et
 * couleur de la barre du navigateur sur mobile.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0B132B" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Langue = celle de l'URL (segment [locale]) sinon cookie puis défaut.
  const lang = getLang();
  const dir = dirOf(lang);
  // Session côté serveur : l'en-tête est rendu avec le bon état de connexion.
  // `safeServerSession` dégrade en « visiteur » au lieu de planter le rendu si
  // la configuration NextAuth est incomplète (NEXTAUTH_SECRET manquant).
  const session = await safeServerSession();

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* Flux RSS (lecteurs + agrégateurs) */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Trading Education — flux RSS"
          href="/feed.xml"
        />
        {/*
          Thème appliqué avant le premier rendu (aucun « flash » clair → sombre) :
          thème clair par défaut, sauf si l'utilisateur a choisi « Sombre »
          (ou « Système » avec un OS en mode sombre), ou l'ancienne clé darkMode.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var k=localStorage.getItem("theme");var l=localStorage.getItem("darkMode");var dark=k==="dark"||(k==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches)||(!k&&l==="true");document.documentElement.classList.toggle("dark",dark);}catch(e){}})();',
          }}
        />
        {/*
          Code AdSense rendu dans le HTML brut (et non via next/script + afterInteractive,
          qui ne l'injecte que côté navigateur en JavaScript) afin que le robot
          d'exploration d'AdSense le détecte sans exécuter de JS.
        */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5343389597650456"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Données structurées de site : Organization + WebSite (+ recherche) */}
        <JsonLd data={siteJsonLd()} />
        <LangProvider initialLang={lang}>
          {/* Session NextAuth (fournie par le serveur, mise à jour côté client) */}
          <AuthProvider session={session}>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <PromoPopup />
            <CookieConsent lang={lang} />
            <AnalyticsTracker />
            <TimezoneSync />
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}

