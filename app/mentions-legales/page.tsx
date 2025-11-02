"use client";

import { Section } from "@/components/Section";
import BackButton from "@/components/BackButton";
import { useLang } from "@/components/LangContext";

export default function MentionsLegalesPage() {
  const { lang } = useLang();
  return (
    <Section title={lang === "fr" ? "Mentions légales" : "Legal Notice"} variant="default">
      <BackButton />
      <div className="max-w-3xl mx-auto prose-custom">
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{lang === "fr" ? "Informations du site" : "Website Information"}</h2>
          <p className="mb-2">
            <strong>{lang === "fr" ? "Nom du site:" : "Website Name:"}</strong>{" "}
            <span className="inline-block">
              <span className="block">Trading</span>
              <span className="block">Education</span>
            </span>
          </p>
          <p className="mb-2">
            <strong>{lang === "fr" ? "Objectif:" : "Purpose:"}</strong> {lang === "fr" ? "Plateforme éducative proposant guides, outils et informations de marché" : "Educational platform providing trading guides, tools, and market information"}
          </p>
        </div>

        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{lang === "fr" ? "Avertissement de responsabilité" : "Disclaimer of Liability"}</h2>
          <p className="mb-4">
            {lang === "fr" 
              ? <>Les informations de ce site sont fournies à titre éducatif et informatif. <span className="inline-block"><span className="block">Trading</span><span className="block">Education</span></span> ne fournit pas de conseils financiers, d&apos;investissement ou de trading.</>
              : <>The information on this website is provided for educational and informational purposes only. <span className="inline-block"><span className="block">Trading</span><span className="block">Education</span></span> does not provide financial, investment, or trading advice.</>}
          </p>
          <p className="mb-4">
            {lang === "fr"
              ? "Le trading comporte des risques: n'investissez jamais de l'argent que vous ne pouvez pas vous permettre de perdre. Les performances passées ne garantissent pas les résultats futurs."
              : "All trading involves risk, and you should never trade with money you cannot afford to lose. Past performance is not indicative of future results."}
          </p>
          <p className="mb-4">
            {lang === "fr" 
              ? <>Trading Education n&apos;est pas responsable des pertes ou dommages résultant de l&apos;utilisation des informations, outils ou contenus fournis sur ce site.</>
              : <>Trading Education is not responsible for any losses or damages resulting from the use of information, tools, or content provided on this website.</>}
          </p>
        </div>

        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{lang === "fr" ? "Contenus tiers" : "Third-Party Content"}</h2>
          <p className="mb-4">
            {lang === "fr"
              ? "Ce site peut inclure des contenus, widgets et liens vers des sites tiers. Nous ne sommes pas responsables de leur contenu, de leur politique de confidentialité ou de leurs conditions d'utilisation."
              : "This website may include content, widgets, and links to third-party websites. We are not responsible for the content, privacy practices, or terms of service of these external sites."}
          </p>
          <p className="mb-4">
            {lang === "fr"
              ? "Les widgets TradingView et CoinMarketCap sont utilisés conformément à leurs conditions d'utilisation."
              : "Widgets from TradingView and CoinMarketCap are used in accordance with their respective terms of service."}
          </p>
        </div>

        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">{lang === "fr" ? "Propriété intellectuelle" : "Intellectual Property"}</h2>
          <p className="mb-4">
            {lang === "fr" 
              ? <>Tout le contenu de ce site (textes, graphismes, logos, logiciels, etc.) est la propriété de <span className="inline-block"><span className="block">Trading</span><span className="block">Education</span></span> ou de ses fournisseurs de contenu et est protégé par le droit d&apos;auteur.</>
              : <>All content on this website, including text, graphics, logos, and software, is the property of <span className="inline-block"><span className="block">Trading</span><span className="block">Education</span></span> or its content suppliers and is protected by copyright laws.</>}
          </p>
          <p className="mb-4">
            {lang === "fr"
              ? "Toute reproduction ou distribution du contenu sans autorisation écrite préalable est interdite."
              : "You may not reproduce, distribute, or transmit any content from this website without prior written permission."}
          </p>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-4">{lang === "fr" ? "Contact" : "Contact"}</h2>
          <p className="mb-4">
            {lang === "fr" 
              ? "Pour toute demande de support, veuillez nous contacter :"
              : "For support requests, please contact us:"}
          </p>
          <p className="mb-4">
            <a 
              href="mailto:support@tradingeducationpro.com" 
              className="text-brand-primary hover:underline font-medium"
            >
              support@tradingeducationpro.com
            </a>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {lang === "fr" 
              ? "Pour les demandes légales spécifiques, consultez la page "
              : "For specific legal inquiries, please refer to the "}
            <a href="/politiques" className="text-brand-primary hover:underline">
              {lang === "fr" ? "Politique de confidentialité" : "Privacy Policy"}
            </a>
            {lang === "fr" ? "." : " page."}
          </p>
        </div>
      </div>
    </Section>
  );
}

