"use client";

import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  capital: z.number().positive("Capital must be positive"),
  riskPercent: z.number().min(0.1).max(100, "Risk should be between 0.1% and 100%"),
  entryPrice: z.number().positive("Entry price must be positive"),
  stopLoss: z.number().positive("Stop loss must be positive"),
  pipValue: z.number().positive("Pip value must be positive"),
});

type FormData = z.infer<typeof schema>;

function CalculatriceTaillePosition() {
  const [formData, setFormData] = useState<FormData>({
    capital: 10000,
    riskPercent: 2,
    entryPrice: 50000,
    stopLoss: 49000,
    pipValue: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [results, setResults] = useState<{
    positionSize: number;
    riskAmount: number;
    distancePips: number;
  } | null>(null);

  const handleChange = (field: keyof FormData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, [field]: numValue }));
    setErrors({});
  };

  const calculate = () => {
    try {
      const validated = schema.parse(formData);
      const riskAmount = (validated.capital * validated.riskPercent) / 100;
      const priceDiff = Math.abs(validated.entryPrice - validated.stopLoss);
      const distancePips = priceDiff / validated.pipValue;
      const positionSize = riskAmount / (distancePips * validated.pipValue);

      setResults({
        positionSize: Math.round(positionSize * 100) / 100,
        riskAmount: Math.round(riskAmount * 100) / 100,
        distancePips: Math.round(distancePips * 100) / 100,
      });
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Position Size Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Calculate the optimal position size based on your risk management parameters.
        </p>

        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Understanding Position Sizing in Trading
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Position sizing is one of the most critical aspects of risk management in trading. It determines how much capital you risk on each trade relative to your total account size. Proper position sizing protects your account from significant drawdowns while allowing your trading edge to compound over time.
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The fundamental principle is simple: risk a fixed percentage of your account on each trade, typically between 0.5% and 2% depending on your risk tolerance, account size, and trading strategy. This approach ensures that a string of losses won't wipe out your account, while a series of wins can grow it steadily.
          </p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            How Position Sizing Works
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Position size is calculated based on three key factors: your account capital, the percentage you're willing to risk, and the distance to your stop loss. The formula ensures that if your stop loss is hit, you lose exactly the predetermined percentage of your account, no more, no less.
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            For example, if you have a $10,000 account and want to risk 2% ($200) on a trade, and your stop loss is 50 pips away, the position size calculator will determine exactly how many lots or units you should trade to ensure a 50-pip move against you results in a $200 loss.
          </p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            Why Position Sizing Matters
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Without proper position sizing, even a profitable trading strategy can fail. Trading too large can lead to emotional decision-making, revenge trading, and account blowouts. Trading too small can limit your growth potential. The calculator below helps you find the perfect balance for your trading style and risk tolerance.
          </p>
        </div>

        <div className="card p-8 space-y-6">
          <div>
            <label
              htmlFor="capital"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Account Capital ($)
            </label>
            <input
              id="capital"
              type="number"
              value={formData.capital}
              onChange={(e) => handleChange("capital", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-visible:outline-2 focus-visible:outline-brand-primary"
            />
            {errors.capital && (
              <p className="mt-1 text-sm text-brand-danger">{errors.capital}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="riskPercent"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Risk Percentage (%)
            </label>
            <input
              id="riskPercent"
              type="number"
              step="0.1"
              value={formData.riskPercent}
              onChange={(e) => handleChange("riskPercent", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-visible:outline-2 focus-visible:outline-brand-primary"
            />
            {errors.riskPercent && (
              <p className="mt-1 text-sm text-brand-danger">{errors.riskPercent}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="entryPrice"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Entry Price
            </label>
            <input
              id="entryPrice"
              type="number"
              value={formData.entryPrice}
              onChange={(e) => handleChange("entryPrice", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-visible:outline-2 focus-visible:outline-brand-primary"
            />
            {errors.entryPrice && (
              <p className="mt-1 text-sm text-brand-danger">{errors.entryPrice}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="stopLoss"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Stop Loss Price
            </label>
            <input
              id="stopLoss"
              type="number"
              value={formData.stopLoss}
              onChange={(e) => handleChange("stopLoss", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-visible:outline-2 focus-visible:outline-brand-primary"
            />
            {errors.stopLoss && (
              <p className="mt-1 text-sm text-brand-danger">{errors.stopLoss}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="pipValue"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Pip/Tick Value
            </label>
            <input
              id="pipValue"
              type="number"
              step="0.01"
              value={formData.pipValue}
              onChange={(e) => handleChange("pipValue", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-visible:outline-2 focus-visible:outline-brand-primary"
            />
            {errors.pipValue && (
              <p className="mt-1 text-sm text-brand-danger">{errors.pipValue}</p>
            )}
          </div>

          <button
            onClick={calculate}
            className="w-full btn-primary"
          >
            Calculate Position Size
          </button>

          {results && (
            <div className="mt-8 p-6 bg-indigo-50 dark:bg-slate-800 rounded-xl border-l-4 border-brand-primary">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Results
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Position Size:
                  </span>
                  <span className="ml-2 text-lg font-bold text-brand-primary">
                    {results.positionSize}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Risk Amount:
                  </span>
                  <span className="ml-2 text-lg font-bold text-brand-danger">
                    ${results.riskAmount}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Distance (Pips):
                  </span>
                  <span className="ml-2 text-lg font-bold text-slate-900 dark:text-slate-100">
                    {results.distancePips}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card p-8 mt-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Best Practices for Position Sizing
          </h2>
          <ul className="space-y-3 text-slate-700 dark:text-slate-300 mb-4">
            <li className="flex items-start">
              <span className="text-brand-primary mr-2">•</span>
              <span><strong>Consistency is key:</strong> Use the same risk percentage for similar setups to maintain consistency in your trading approach.</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-primary mr-2">•</span>
              <span><strong>Adjust for volatility:</strong> Consider reducing position size during high volatility periods or before major news events.</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-primary mr-2">•</span>
              <span><strong>Account for slippage:</strong> In volatile markets, actual fills may differ from expected prices, so factor in a small buffer for slippage.</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-primary mr-2">•</span>
              <span><strong>Correlation awareness:</strong> If you're trading multiple correlated pairs simultaneously, reduce individual position sizes to maintain overall risk limits.</span>
            </li>
          </ul>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Remember, position sizing is not about maximizing profits on individual trades—it's about surviving to trade another day and allowing your edge to play out over hundreds of trades. Professional traders understand that preserving capital is the foundation of long-term success.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-4 mt-4 rounded">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Important:</strong> This calculator is provided for educational purposes only. Always verify your calculations with your broker, and remember that trading involves substantial risk of loss. Never risk more than you can afford to lose.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalculatriceTaillePosition;

