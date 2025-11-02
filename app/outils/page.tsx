"use client";

import Link from "next/link";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import BackButton from "@/components/BackButton";
import { useLang } from "@/components/LangContext";
import { AdSlot } from "@/components/AdSlot";

const tools = [
  {
    title: "Position Size Calculator",
    description:
      "Calculate the optimal position size based on your account capital, risk percentage, entry price, and stop loss.",
    href: "/outils/calculatrice-taille-position",
    icon: "📊",
  },
  {
    title: "Risk/Reward Calculator",
    description:
      "Calculate your trading expectancy and risk/reward ratio using your win rate and average win/loss amounts.",
    href: "/outils/calculateur-risk-reward",
    icon: "⚖️",
  },
  {
    title: "Pips Converter",
    description:
      "Convert between pips, points, and percentage values for accurate trading calculations.",
    href: "/outils/convertisseur-pips",
    icon: "🔄",
  },
  {
    title: "Market Hours",
    description:
      "View trading hours for Forex, Stock Markets, and Cryptocurrency exchanges worldwide.",
    href: "/outils/horaires-marches",
    icon: "⏰",
  },
];

export default function OutilsPage() {
  const { lang } = useLang();
  const list = tools.map((t) => {
    if (lang !== "fr") return t;
    if (t.href === "/outils/calculatrice-taille-position") {
      return {
        ...t,
        title: "Calculatrice de taille de position",
        description:
          "Calculez la taille de position optimale selon votre capital, votre risque %, le prix d'entrée et le stop.",
      };
    }
    if (t.href === "/outils/calculateur-risk-reward") {
      return {
        ...t,
        title: "Calculateur Risk/Reward",
        description:
          "Calculez l'espérance de votre stratégie et le ratio risque/rendement à partir du taux de gain et des montants moyens.",
      };
    }
    if (t.href === "/outils/convertisseur-pips") {
      return {
        ...t,
        title: "Convertisseur de pips",
        description:
          "Convertissez pips, points et pourcentage pour des calculs précis.",
      };
    }
    if (t.href === "/outils/horaires-marches") {
      return {
        ...t,
        title: "Horaires des marchés",
        description:
          "Consultez les horaires du Forex, des bourses actions et des plateformes crypto dans le monde.",
      };
    }
    return t;
  });
  return (
    <Section
      title={lang === "fr" ? "Outils de trading" : "Trading Tools"}
      subtitle={
        lang === "fr"
          ? "Calculatrices et utilitaires gratuits pour votre trading"
          : "Free calculators and utilities to enhance your trading"
      }
    >
      <BackButton />
      
      <div className="max-w-4xl mx-auto mb-8">
        <div className="card p-6 mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            {lang === "fr" ? "Outils essentiels pour traders" : "Essential Tools for Traders"}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            {lang === "fr"
              ? "Nos outils de trading sont conçus pour vous aider à prendre des décisions éclairées et à gérer vos risques efficacement. Chaque calculatrice utilise des formules professionnelles validées par des traders expérimentés, vous permettant de calculer précisément vos positions, vos risques et vos rendements potentiels."
              : "Our trading tools are designed to help you make informed decisions and manage your risks effectively. Each calculator uses professional formulas validated by experienced traders, allowing you to precisely calculate your positions, risks, and potential returns."}
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            {lang === "fr"
              ? "Ces outils sont gratuits et accessibles 24/7. Utilisez-les avant chaque trade pour vous assurer que vous respectez votre plan de gestion du risque et que vous tradez avec des tailles de position appropriées."
              : "These tools are free and accessible 24/7. Use them before each trade to ensure you're following your risk management plan and trading with appropriate position sizes."}
          </p>
        </div>
      </div>

      <AdSlot format="banner" className="mx-auto my-8 container px-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {list.map((tool, index) => (
          <Card key={index} title={tool.title} description={tool.description} href={tool.href}>
            <div className="mt-4 text-4xl">{tool.icon}</div>
          </Card>
        ))}
      </div>

      <AdSlot format="rectangle" className="mx-auto my-8 container px-4" />

      <div className="info-box">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <strong>{lang === "fr" ? "Note :" : "Note:"}</strong> {lang === "fr"
            ? "Ces outils sont fournis à des fins éducatives. Vérifiez toujours vos calculs et, si besoin, consultez un professionnel. Le trading comporte un risque de pertes."
            : "All tools are provided for educational purposes only. Always verify calculations and consider consulting a financial advisor. Trading involves risk of loss."}
        </p>
      </div>
    </Section>
  );
}

