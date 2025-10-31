"use client";

import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import BackButton from "@/components/BackButton";
import { useLang } from "@/components/LangContext";
import { useEffect, useState } from "react";

const guides = [
  {
    id: "rsi",
    title: "RSI Indicator Guide",
    description:
      "Learn how to use the Relative Strength Index (RSI) to identify overbought and oversold conditions in the market.",
    content: `
      <h2>Understanding the RSI Indicator</h2>
      <p>The Relative Strength Index (RSI) is a momentum oscillator (0–100) that compares recent gains and losses to gauge speed/force of moves.</p>

      <h3>Core Concepts</h3>
      <ul>
        <li><strong>Thresholds:</strong> 70/30 (classic), 80/20 (strong trends), 60/40 (trend filters).</li>
        <li><strong>Market State:</strong> RSI tends to hold above 40 in uptrends and below 60 in downtrends.</li>
        <li><strong>Price vs. RSI:</strong> Use divergences, swings and failure swings as signals.</li>
      </ul>

      <h3>Reading the RSI</h3>
      <ul>
        <li><strong>Overbought:</strong> RSI &gt; 70 – strength but potential exhaustion.</li>
        <li><strong>Oversold:</strong> RSI &lt; 30 – weakness but potential rebound.</li>
        <li><strong>Midline:</strong> 50 acts as momentum pivot.</li>
      </ul>

      <h3>Step‑by‑Step Plan</h3>
      <ol>
        <li>Identify higher‑timeframe trend (MA or market structure).</li>
        <li>Choose RSI settings (14 default; 7/21 for faster/slower).</li>
        <li>Define trigger: divergence, pullback to 40/60, or breakout of RSI swing.</li>
        <li>Confirm with price action/volume/structure.</li>
        <li>Place stop beyond recent swing, target via R:R or structure.</li>
      </ol>

      <h3>Checklist</h3>
      <ul>
        <li>Trend context clear?</li>
        <li>Signal type defined (divergence/failure swing/threshold)?</li>
        <li>Confluence present (S/R, MA, volume)?</li>
        <li>Risk defined and R:R ≥ 1:2?</li>
      </ul>

      <h3>Mistakes to Avoid</h3>
      <ul>
        <li>Fading strong trends just because RSI is overbought/oversold.</li>
        <li>Ignoring HTF context and liquidity.</li>
        <li>Using RSI alone without structure confirmation.</li>
      </ul>

      <h3>Backtesting Framework</h3>
      <ul>
        <li>Define precise entries/exits and session filters.</li>
        <li>Record metrics: win rate, avg R, expectancy, drawdown.</li>
        <li>Forward test on paper for 20–30 trades before going live.</li>
      </ul>
    `,
  },
  {
    id: "money-management",
    title: "Money Management Basics",
    description:
      "Essential risk management principles to protect your capital and maximize long-term profitability.",
    content: `
      <h2>Money Management Principles</h2>
      <p>Risk management preserves capital and allows statistical edge to play out.</p>

      <h3>Risk Policies</h3>
      <ul>
        <li>Risk <strong>0.5–2% per trade</strong> depending on edge and volatility.</li>
        <li>Daily loss cap (e.g., 3R or 4%) to stop trading after a bad day.</li>
        <li>Weekly drawdown cap and cool‑off rules.</li>
      </ul>

      <h3>Position Sizing</h3>
      <ol>
        <li>Define stop distance (in pips/points/%).</li>
        <li>Compute size = (Account × Risk%) ÷ Stop distance × value per unit.</li>
        <li>Adjust for slippage/fees; round to contract size.</li>
      </ol>

      <h3>Portfolio & Compounding</h3>
      <ul>
        <li>Use anti‑correlation to limit exposure to same driver.</li>
        <li>Compound monthly/quarterly; avoid over‑compounding during drawdown.</li>
      </ul>

      <h3>Playbook</h3>
      <ul>
        <li>Define A/B/C setups with preset risk and targets.</li>
        <li>Journal including emotions, context, lessons.</li>
      </ul>
    `,
  },
  {
    id: "leverage",
    title: "Understanding Leverage",
    description:
      "Learn how leverage works in trading and how to use it responsibly to amplify your positions.",
    content: `
      <h2>What is Leverage?</h2>
      <p>Leverage multiplies exposure relative to margin. It boosts both profits and losses.</p>

      <h3>Key Metrics</h3>
      <ul>
        <li>Notional = Price × Quantity; Margin = Notional / Leverage.</li>
        <li>Maintenance margin and liquidation thresholds.</li>
        <li>Funding/financing costs for perpetuals/CFDs.</li>
      </ul>

      <h3>Risk Controls</h3>
      <ul>
        <li>Use smaller size rather than higher leverage to reach target risk.</li>
        <li>Place hard stop; avoid adding to losers.</li>
        <li>Hedge or reduce before news/high vol events.</li>
      </ul>
    `,
  },
  {
    id: "ichimoku",
    title: "Ichimoku Cloud Strategy",
    description:
      "Master the Ichimoku indicator - a comprehensive technical analysis system that provides support, resistance, and trend signals.",
    content: `
      <h2>Ichimoku Cloud Overview</h2>
      <p>Ichimoku is a complete trend‑following system.</p>
      <h3>Components</h3>
      <ul>
        <li><strong>Tenkan:</strong> fast average; <strong>Kijun:</strong> baseline.</li>
        <li><strong>Cloud (Senkou A/B):</strong> forward support/resistance and trend bias.</li>
        <li><strong>Chikou:</strong> lagging confirmation.</li>
      </ul>
      <h3>Trading Plan</h3>
      <ul>
        <li>Trend bias from cloud color/position; trade pullbacks to Kijun.</li>
        <li>Signals: TK cross, Kumo break, Chikou breakout.</li>
        <li>Filters: HTF cloud alignment, volatility, session.</li>
      </ul>
    `,
  },
  {
    id: "economic-calendar",
    title: "Economic Calendar Guide",
    description:
      "Understand how economic events impact markets and learn to trade around major announcements.",
    content: `
      <h2>Economic Calendar Essentials</h2>
      <p>Events shift expectations and liquidity. Know when to stand aside or tighten risk.</p>
      <h3>Key Events</h3>
      <ul>
        <li>Central banks (rates, pressers), NFP/employment, CPI/PPI, GDP, PMI, inventories.</li>
        <li>Tier classification (high/medium/low impact).</li>
      </ul>
      <h3>Playbook</h3>
      <ul>
        <li>Note time, forecast vs. previous, market consensus.</li>
        <li>Avoid new trades minutes before; reduce size or use wider stops.</li>
        <li>Post‑release: wait for spread/volatility to normalize before entries.</li>
      </ul>
    `,
  },
  {
    id: "risk-reward",
    title: "Risk/Reward Ratio Explained",
    description:
      "Learn how to calculate and use risk/reward ratios to build profitable trading strategies.",
    content: `
      <h2>Risk/Reward Fundamentals</h2>
      <p>R:R describes payoff structure; combine with win rate to compute expectancy.</p>
      <h3>Formulae</h3>
      <ul>
        <li>R:R = Reward ÷ Risk (in the same units, e.g., R).</li>
        <li>Expectancy = WinRate × AvgWin − (1−WinRate) × AvgLoss.</li>
      </ul>
      <h3>Planning</h3>
      <ul>
        <li>Use structure‑based targets (swing highs/lows, ADR, partials).</li>
        <li>Ensure average R:R ≥ 1:2 for trend strategies; adjust with data.</li>
      </ul>
    `,
  },
  {
    id: "psychology",
    title: "Trading Psychology",
    description:
      "Master your emotions and develop the mental discipline needed for consistent trading success.",
    content: `
      <h2>Trading Psychology Basics</h2>
      <p>Design processes that reduce cognitive load and emotional noise.</p>
      <h3>Pillars</h3>
      <ul>
        <li>Rules and checklists; pre‑trade routine; objective journaling.</li>
        <li>Risk comfort: size small enough to execute plan.</li>
        <li>Recovery protocol after losses (walk, review, no revenge).</li>
      </ul>
    `,
  },
  {
    id: "backtesting",
    title: "Backtesting Strategies",
    description:
      "Learn how to test your trading strategies on historical data to validate their effectiveness.",
    content: `
      <h2>Backtesting Overview</h2>
      <p>Backtesting tests rules on historical data to estimate performance.</p>
      <h3>Process</h3>
      <ol>
        <li>Define objective and exact rules (entry/exit/filters/management).</li>
        <li>Collect clean data and simulate with realistic fees/slippage.</li>
        <li>Segment by regimes (trend/range, vol high/low).</li>
        <li>Compute metrics: CAGR, max DD, Sharpe, win rate, avg R, expectancy.</li>
        <li>Out‑of‑sample + forward test.</li>
      </ol>
    `,
  },
  {
    id: "dca-vs-swing",
    title: "DCA vs Swing Trading",
    description:
      "Compare Dollar Cost Averaging and Swing Trading strategies to find what works for you.",
    content: `
      <h2>DCA vs Swing Trading</h2>
      <p>Choose approach according to time availability, risk tolerance, and goals.</p>
      <h3>DCA</h3>
      <ul>
        <li>Periodic buys; smooths entry price; minimal timing risk.</li>
        <li>Great for long‑term accumulation; limited active decisions.</li>
      </ul>
      <h3>Swing</h3>
      <ul>
        <li>Active entries/exits around swings; requires plan and discipline.</li>
        <li>Use MA/structure/RSI to define setups; manage overnight risk.</li>
      </ul>
      <h3>Decision Matrix</h3>
      <ul>
        <li>Time commitment low → DCA; high → Swing.</li>
        <li>Volatility comfort low → DCA; higher → Swing with small risk.</li>
      </ul>
    `,
  },
  {
    id: "timeframes",
    title: "Understanding Timeframes",
    description:
      "Learn how different timeframes affect trading decisions and how to choose the right one for your style.",
    content: `
      <h2>Timeframe Analysis</h2>
      <p>Combine higher‑timeframe bias with lower‑timeframe execution.</p>
      <h3>Top‑down Framework</h3>
      <ol>
        <li>HTF trend and key S/R (weekly/daily).</li>
        <li>MTF structure (H4/H1) to find zones.</li>
        <li>LTF triggers (M15/M5) with clear risk.</li>
      </ol>
      <h3>Mapping Styles</h3>
      <ul>
        <li>Scalping: M1–M15; Day: M5–H1; Swing: H1–D1; Position: D1–W/M.</li>
      </ul>
    `,
  },
];

// French translations for descriptions and contents
const guidesFr: Record<string, { description: string; content: string }> = {
  rsi: {
    description:
      "Apprenez à utiliser le RSI pour repérer surachat/survente et qualifier le momentum.",
    content: `
      <h2>Comprendre l'indicateur RSI</h2>
      <p>Oscillateur de momentum (0–100) comparant gains et pertes récents.</p>
      <h3>Concepts clés</h3>
      <ul>
        <li>Seuils 70/30, 80/20, 60/40 (filtre de tendance).</li>
        <li>Au‑dessus de 40 en tendance haussière, sous 60 en tendance baissière.</li>
        <li>Divergences, swings et failure swings.</li>
      </ul>
      <h3>Plan d'action</h3>
      <ol>
        <li>Identifier la tendance sur UT supérieure.</li>
        <li>Choisir réglage RSI (14 par défaut).</li>
        <li>Définir déclencheur (divergence, retour 40/60, breakout RSI).</li>
        <li>Confirmer par la structure/volume.</li>
        <li>Stop au‑delà du swing, cible selon R:R/structure.</li>
      </ol>
      <h3>Erreurs à éviter</h3>
      <ul>
        <li>Contre‑tendance sur simple surachat/survente.</li>
        <li>Ignorer le contexte UT supérieure.</li>
      </ul>
    `,
  },
  "money-management": {
    description:
      "Principes de gestion du risque pour protéger le capital et laisser l'avantage statistique s'exprimer.",
    content: `
      <h2>Principes de money management</h2>
      <p>Définissez règles de risque et de taille pour chaque trade.</p>
      <h3>Politiques de risque</h3>
      <ul>
        <li>Risque 0,5–2% par trade; plafond de pertes journalier/hebdo.</li>
        <li>Pas de sur‑levier; suspendre après série de pertes.</li>
      </ul>
      <h3>Taille de position</h3>
      <ol>
        <li>Distance de stop</li>
        <li>Taille = (Compte × %Risque) ÷ Distance × valeur/pip</li>
      </ol>
    `,
  },
  leverage: {
    description:
      "Comprendre l'effet de levier et ses garde‑fous (marge, liquidation, coûts).",
    content: `
      <h2>Effet de levier</h2>
      <p>Exposition multipliée; risques de liquidation et de coûts.</p>
      <h3>Contrôles de risque</h3>
      <ul>
        <li>Stop dur; taille adéquate plutôt que levier excessif.</li>
        <li>Réduire avant annonces; tenir compte du financement.</li>
      </ul>
    `,
  },
  ichimoku: {
    description:
      "Système de suivi de tendance complet: Tenkan/Kijun, nuage, Chikou.",
    content: `
      <h2>Vue d'ensemble Ichimoku</h2>
      <p>Déterminez la tendance, les supports/résistances projetés et les signaux.</p>
      <h3>Plan</h3>
      <ul>
        <li>Biais du nuage (couleur/position)</li>
        <li>Signal: croisement TK, cassure Kumo, breakout Chikou</li>
        <li>Confluences UT supérieures</li>
      </ul>
    `,
  },
  "economic-calendar": {
    description:
      "Impact des annonces macroéconomiques et plan de gestion du risque.",
    content: `
      <h2>Calendrier économique</h2>
      <p>Classez les annonces (haut/moyen/bas) et adaptez la taille et le timing.</p>
      <ul>
        <li>Avant: éviter nouvelles entrées; pendant: spreads et volatilité; après: attendre normalisation.</li>
      </ul>
    `,
  },
  "risk-reward": {
    description:
      "Utiliser R:R et l'espérance pour dimensionner les objectifs.",
    content: `
      <h2>Ratio Risk/Reward</h2>
      <p>Planifiez cibles et stops pour maintenir un R:R moyen suffisant.</p>
    `,
  },
  psychology: {
    description:
      "Processus mentaux et routines pour exécuter le plan avec discipline.",
    content: `
      <h2>Psychologie du trading</h2>
      <ul>
        <li>Routines (pré, pendant, post‑marché)</li>
        <li>Journal et revues hebdo</li>
        <li>Protocoles anti‑revenge</li>
      </ul>
    `,
  },
  backtesting: {
    description:
      "Méthodologie de backtest: règles précises, métriques, validation.",
    content: `
      <h2>Backtesting</h2>
      <ol>
        <li>Règles exactes</li>
        <li>Données propres, frais, slippage</li>
        <li>OOS/Forward test</li>
      </ol>
    `,
  },
  "dca-vs-swing": {
    description:
      "Choisir entre DCA (passif) et Swing (actif) selon objectifs et temps.",
    content: `
      <h2>DCA vs Swing</h2>
      <ul>
        <li>DCA: simplicité, faible charge décisionnelle</li>
        <li>Swing: actif, nécessite plan et gestion du risque</li>
      </ul>
    `,
  },
  timeframes: {
    description:
      "Top‑down multi‑UT: biais HTF, zones MTF, déclencheur LTF.",
    content: `
      <h2>Unités de temps</h2>
      <ol>
        <li>Tendance et niveaux (HTF)</li>
        <li>Zone d'intérêt (MTF)</li>
        <li>Signal d'entrée (LTF)</li>
      </ol>
    `,
  },
};

export default function GuidesPage() {
  const { lang } = useLang();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const applyHash = () => {
      if (typeof window === "undefined") return;
      const h = window.location.hash?.replace("#", "");
      setSelectedId(h || null);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);
  const getTitle = (id: string, title: string) => {
    if (lang !== "fr") return title;
    const map: Record<string, string> = {
      rsi: "Guide de l'indicateur RSI",
      "money-management": "Bases du money management",
      leverage: "Comprendre l'effet de levier",
      ichimoku: "Stratégie Ichimoku",
      "economic-calendar": "Guide du calendrier économique",
      "risk-reward": "Ratio Risk/Reward expliqué",
      psychology: "Psychologie du trading",
      backtesting: "Stratégies de backtesting",
      "dca-vs-swing": "DCA vs Swing Trading",
      timeframes: "Comprendre les unités de temps",
    };
    return map[id] ?? title;
  };
  return (
    <Section
      title={lang === "fr" ? "Guides de trading" : "Trading Guides"}
      subtitle={
        lang === "fr"
          ? "Contenus pédagogiques pour tous les niveaux"
          : "Comprehensive educational content for traders of all levels"
      }
    >
      <BackButton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {guides.map((guide) => (
          <Card
            key={guide.id}
            title={getTitle(guide.id, guide.title)}
            description={lang === "fr" ? (guidesFr[guide.id]?.description ?? guide.description) : guide.description}
            href={`/guides/${guide.id}`}
          >
            <div className="mt-4">
              <span className="text-brand-primary dark:text-indigo-300 hover:text-brand-secondary dark:hover:text-cyan-400 hover:underline font-medium transition-colors">
                {lang === "fr" ? "Voir le guide →" : "Read Guide →"}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="prose-custom max-w-4xl mx-auto"></div>
    </Section>
  );
}

