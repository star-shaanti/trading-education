"use client";

import { Section } from "@/components/Section";
import BackButton from "@/components/BackButton";
import { useLang } from "@/components/LangContext";

export default function PolitiquesPage() {
  const { lang } = useLang();
  return (
    <Section title={lang === "fr" ? "Confidentialité & Cookies" : "Privacy Policy & Cookies"} variant="default">
      <BackButton />
      <div className="max-w-3xl mx-auto prose-custom">
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{lang === "fr" ? "Politique de confidentialité" : "Privacy Policy"}</h2>
          <p className="mb-4">
            {lang === "fr"
              ? "Trading Education s'engage à protéger votre vie privée. Cette politique explique comment nous collectons, utilisons et protégeons vos informations lorsque vous visitez notre site."
              : "Trading Education is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you visit our website."}
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">{lang === "fr" ? "Informations collectées" : "Information We Collect"}</h3>
          <p className="mb-4">
            {lang === "fr"
              ? "Nous pouvons collecter les informations que vous fournissez directement (ex: utilisation des outils). Ces données restent stockées localement dans votre navigateur et ne sont pas transmises à nos serveurs."
              : "We may collect information that you provide directly to us, such as when you use our tools or calculators. This information is stored locally in your browser and is not transmitted to our servers."}
          </p>

          {null}

          <h3 className="text-xl font-semibold mt-6 mb-3">{lang === "fr" ? "Sécurité des données" : "Data Security"}</h3>
          <p className="mb-4">
            {lang === "fr"
              ? "Nous mettons en œuvre des mesures de sécurité appropriées. Toutefois, aucune méthode de transmission via Internet n'est sûre à 100%."
              : "We implement appropriate security measures to protect your information. However, no method of transmission over the internet is 100% secure."}
          </p>
        </div>

        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{lang === "fr" ? "Politique de cookies" : "Cookie Policy"}</h2>
          <p className="mb-4">
            {lang === "fr" ? "Notre site utilise des cookies et technologies similaires pour améliorer votre expérience." : "Our website uses cookies and similar technologies to enhance your browsing experience."}
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">{lang === "fr" ? "Types de cookies" : "Types of Cookies"}</h3>
          <ul className="space-y-2 mb-4">
            <li>
              <strong>{lang === "fr" ? "Essentiels :" : "Essential Cookies:"}</strong> {lang === "fr" ? "Nécessaires au bon fonctionnement du site (ex : préférence de thème)" : "Required for the website to function properly (e.g., dark mode preference)"}
            </li>
            <li>
              <strong>{lang === "fr" ? "Analytiques :" : "Analytics Cookies:"}</strong> {lang === "fr" ? "Aident à comprendre l'utilisation du site" : "Help us understand how visitors interact with our website"}
            </li>
            <li>
              <strong>{lang === "fr" ? "Tiers :" : "Third-Party Cookies:"}</strong> {lang === "fr" ? "Définis par des services externes (TradingView, CoinMarketCap, réseaux publicitaires)" : "Set by external services (TradingView, CoinMarketCap, advertising networks)"}
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">{lang === "fr" ? "Gestion des cookies" : "Managing Cookies"}</h3>
          <p className="mb-4">
            {lang === "fr"
              ? "Vous pouvez contrôler les cookies via les paramètres de votre navigateur. La désactivation de certains cookies peut affecter le fonctionnement du site."
              : "You can control cookies through your browser settings. However, disabling certain cookies may affect website functionality."}
          </p>
        </div>

        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{lang === "fr" ? "Google AdSense" : "Google AdSense"}</h2>
          <p className="mb-4">
            {lang === "fr"
              ? "Ce site peut afficher des publicités fournies par Google AdSense. AdSense utilise des cookies pour diffuser des annonces basées sur vos visites."
              : "This website may display advertisements provided by Google AdSense. AdSense uses cookies to serve ads based on your prior visits to our website or other websites."}
          </p>
          <p className="mb-4">
            {lang === "fr" ? "Vous pouvez désactiver la publicité personnalisée via " : "You can opt out of personalized advertising by visiting "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline"
            >
              {lang === "fr" ? "Paramètres Google Ads" : "Google Ads Settings"}
            </a>
            .
          </p>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-4">{lang === "fr" ? "Mises à jour" : "Updates to This Policy"}</h2>
          <p className="mb-4">
            {lang === "fr"
              ? "Nous pouvons mettre à jour cette politique. Les changements seront publiés sur cette page avec une date de révision."
              : "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date."}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {lang === "fr" ? "Dernière mise à jour : " : "Last updated: "}
            {new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>
    </Section>
  );
}

