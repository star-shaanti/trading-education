"use client";

import { Section } from "@/components/Section";
import { useLang } from "@/components/LangContext";

export default function AProposPage() {
  const { lang } = useLang();
  return (
    <Section title={lang === "fr" ? "À propos de Trading Education" : "About Trading Education"} variant="default">
      <div className="max-w-3xl mx-auto prose-custom">
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{lang === "fr" ? "Notre mission" : "Our Mission"}</h2>
          <p className="mb-4">
            {lang === "fr"
              ? "Trading Education propose des contenus pédagogiques de qualité et des outils pour aider les traders à progresser et à prendre des décisions éclairées."
              : "Trading Education is dedicated to providing high-quality educational content and tools to help traders of all levels improve their skills and make informed trading decisions."}
          </p>
          <p className="mb-4">
            {lang === "fr"
              ? "Nous pensons que l'éducation est la base d'un trading réussi. Guides, calculateurs et outils d'analyse sont là pour mieux comprendre les marchés."
              : "We believe that education is the foundation of successful trading. Our platform offers free guides, calculators, and market analysis tools designed to help you understand the markets better."}
          </p>
        </div>

        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{lang === "fr" ? "Ce que nous offrons" : "What We Offer"}</h2>
          <ul className="space-y-2">
            <li>
              <strong>{lang === "fr" ? "Guides pédagogiques :" : "Educational Guides:"}</strong> {lang === "fr" ? "Articles complets sur les stratégies, les indicateurs techniques et l'analyse des marchés" : "Comprehensive articles covering trading strategies, technical indicators, and market analysis"}
            </li>
            <li>
              <strong>{lang === "fr" ? "Outils gratuits :" : "Free Tools:"}</strong> {lang === "fr" ? "Calculatrices (taille de position, risk/reward, conversions)" : "Calculators for position sizing, risk/reward analysis, and market conversions"}
            </li>
            <li>
              <strong>{lang === "fr" ? "Analyses :" : "Market Insights:"}</strong> {lang === "fr" ? "Graphiques en temps réel et données de sources fiables" : "Real-time charts and market data from trusted sources"}
            </li>
            <li>
              <strong>{lang === "fr" ? "Ressources :" : "Resource Library:"}</strong> {lang === "fr" ? "Sélection de plateformes et contenus utiles" : "Curated list of useful trading platforms and educational materials"}
            </li>
          </ul>
        </div>

        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{lang === "fr" ? "Avertissement" : "Disclaimer"}</h2>
          <p className="mb-4">
            {lang === "fr"
              ? "Tout le contenu de Trading Education est à but éducatif. Il ne constitue pas un conseil financier."
              : "All content on Trading Education is provided for educational purposes only. We do not provide financial advice, and our content should not be considered as such."}
          </p>
          <p className="mb-4">
            {lang === "fr"
              ? "Le trading comporte des risques de pertes importants. Les performances passées ne préjugent pas des performances futures. Faites vos propres recherches et, si besoin, consultez un professionnel."
              : "Trading involves substantial risk of loss and is not suitable for everyone. Past performance is not indicative of future results. Always conduct your own research and consider consulting with a financial advisor before making trading decisions."}
          </p>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-4">{lang === "fr" ? "Contact" : "Contact"}</h2>
          <p>
            {lang === "fr" ? "Pour toute question, consultez la page " : "For questions or feedback, please refer to our "}
            <a href="/mentions-legales" className="text-brand-primary hover:underline">
              {lang === "fr" ? "Mentions légales" : "Legal Notice"}
            </a>{" "}
            {lang === "fr" ? "." : "page."}
          </p>
        </div>
      </div>
    </Section>
  );
}

