import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { LangProvider } from "@/components/LangContext";

const Header = dynamic(() => import("@/components/Header").then((mod) => ({ default: mod.Header })), {
  ssr: false,
});
const Footer = dynamic(() => import("@/components/Footer").then((mod) => ({ default: mod.Footer })), {
  ssr: false,
});
const PromoPopup = dynamic(() => import("@/components/PromoPopup"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Trading Education | Educational Trading & Media Platform",
    template: "%s | Trading Education",
  },
  description:
    "Learn trading with free educational resources, tools, and market analysis. Trading Education provides guides, calculators, and market insights for beginners and intermediate traders.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
    ],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.json",
  other: {
    "google-adsense-account": "ca-pub-5343389597650456",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
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
        <LangProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <PromoPopup />
        </LangProvider>
      </body>
    </html>
  );
}

