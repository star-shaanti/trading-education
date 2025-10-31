import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5343389597650456"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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

