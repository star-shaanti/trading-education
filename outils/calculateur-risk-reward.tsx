"use client";

import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  winRate: z.number().min(0).max(100, "Win rate must be between 0% and 100%"),
  avgWin: z.number().positive("Average win must be positive"),
  avgLoss: z.number().positive("Average loss must be positive"),
});

type FormData = z.infer<typeof schema>;

function CalculateurRiskReward() {
  const [formData, setFormData] = useState<FormData>({
    winRate: 60,
    avgWin: 200,
    avgLoss: 100,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [results, setResults] = useState<{
    expectancy: number;
    riskReward: number;
    expectedValue: number;
  } | null>(null);

  const handleChange = (field: keyof FormData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => ({ ...prev, [field]: numValue }));
    setErrors({});
  };

  const calculate = () => {
    try {
      const validated = schema.parse(formData);
      const winRateDecimal = validated.winRate / 100;
      const lossRateDecimal = 1 - winRateDecimal;
      const riskReward = validated.avgWin / validated.avgLoss;
      const expectancy =
        winRateDecimal * validated.avgWin - lossRateDecimal * validated.avgLoss;
      const expectedValue = expectancy * 100; // Expected value per 100 trades

      setResults({
        expectancy: Math.round(expectancy * 100) / 100,
        riskReward: Math.round(riskReward * 100) / 100,
        expectedValue: Math.round(expectedValue * 100) / 100,
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
          Risk/Reward & Expectancy Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Calculate your trading expectancy and risk/reward ratio based on your win rate and
          average wins/losses.
        </p>

        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Understanding Risk/Reward Ratio and Trading Expectancy
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The risk/reward ratio and trading expectancy are two of the most important metrics for evaluating a trading strategy's long-term profitability. While the risk/reward ratio tells you how much you stand to gain versus how much you risk on each trade, expectancy tells you the average profit or loss you can expect per trade over many trades.
          </p>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            A positive expectancy doesn't guarantee you'll win every trade, but it means that over a large sample of trades, your strategy should be profitable. This is why professional traders focus on expectancy over win rate—you can have a lower win rate but still be highly profitable if your average wins significantly exceed your average losses.
          </p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            How to Calculate Risk/Reward Ratio
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            The risk/reward ratio is calculated by dividing your potential profit by your potential loss. For example, if you risk $100 to make $300, your risk/reward ratio is 1:3. Most professional traders aim for a minimum risk/reward ratio of 1:2, meaning they stand to make at least twice as much as they risk.
          </p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            Understanding Trading Expectancy
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Trading expectancy combines your win rate with your average win and average loss to determine the expected value per trade. It's calculated using the formula: Expectancy = (Win Rate × Average Win) - (Loss Rate × Average Loss). A positive expectancy means your strategy is profitable over time, while a negative expectancy indicates you'll lose money in the long run.
          </p>
        </div>

        <div className="card p-8 space-y-6">
          <div>
            <label
              htmlFor="winRate"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Win Rate (%)
            </label>
            <input
              id="winRate"
              type="number"
              step="0.1"
              value={formData.winRate}
              onChange={(e) => handleChange("winRate", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-visible:outline-2 focus-visible:outline-brand-primary"
            />
            {errors.winRate && (
              <p className="mt-1 text-sm text-brand-danger">{errors.winRate}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="avgWin"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Average Win ($)
            </label>
            <input
              id="avgWin"
              type="number"
              value={formData.avgWin}
              onChange={(e) => handleChange("avgWin", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-visible:outline-2 focus-visible:outline-brand-primary"
            />
            {errors.avgWin && (
              <p className="mt-1 text-sm text-brand-danger">{errors.avgWin}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="avgLoss"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Average Loss ($)
            </label>
            <input
              id="avgLoss"
              type="number"
              value={formData.avgLoss}
              onChange={(e) => handleChange("avgLoss", e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-visible:outline-2 focus-visible:outline-brand-primary"
            />
            {errors.avgLoss && (
              <p className="mt-1 text-sm text-brand-danger">{errors.avgLoss}</p>
            )}
          </div>

          <button onClick={calculate} className="w-full btn-primary">
            Calculate Expectancy
          </button>

          {results && (
            <div className="mt-8 p-6 bg-indigo-50 dark:bg-slate-800 rounded-xl border-l-4 border-brand-primary">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Results
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Risk/Reward Ratio:
                  </span>
                  <span className="ml-2 text-lg font-bold text-brand-primary">
                    1:{results.riskReward}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Expectancy per Trade:
                  </span>
                  <span
                    className={`ml-2 text-lg font-bold ${
                      results.expectancy >= 0 ? "text-brand-success" : "text-brand-danger"
                    }`}
                  >
                    ${results.expectancy}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Expected Value (100 trades):
                  </span>
                  <span
                    className={`ml-2 text-lg font-bold ${
                      results.expectedValue >= 0 ? "text-brand-success" : "text-brand-danger"
                    }`}
                  >
                    ${results.expectedValue}
                  </span>
                </div>
                {results.expectancy >= 0 && (
                  <div className="mt-4 p-4 bg-brand-success/10 rounded-lg border border-brand-success/20">
                    <p className="text-sm text-brand-success font-medium">
                      ✓ Positive expectancy strategy. Your strategy is profitable over time.
                    </p>
                  </div>
                )}
                {results.expectancy < 0 && (
                  <div className="mt-4 p-4 bg-brand-danger/10 rounded-lg border border-brand-danger/20">
                    <p className="text-sm text-brand-danger font-medium">
                      ⚠ Negative expectancy strategy. Review your strategy parameters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="card p-8 mt-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Improving Your Risk/Reward and Expectancy
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            There are several ways to improve your trading expectancy: increase your win rate through better entry timing, improve your risk/reward ratio by targeting better profit targets, or reduce your average loss by managing trades more effectively. The best strategies often combine all three approaches.
          </p>
          <ul className="space-y-3 text-slate-700 dark:text-slate-300 mb-4">
            <li className="flex items-start">
              <span className="text-brand-primary mr-2">•</span>
              <span><strong>Better entry timing:</strong> Wait for higher-probability setups to improve your win rate without sacrificing risk/reward.</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-primary mr-2">•</span>
              <span><strong>Strategic targets:</strong> Use structure-based targets (support/resistance, swing highs/lows) rather than arbitrary profit goals.</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-primary mr-2">•</span>
              <span><strong>Trade management:</strong> Use partial exits and trailing stops to maximize winners while minimizing losers.</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-primary mr-2">•</span>
              <span><strong>Reality check:</strong> If your expectancy is negative, review your strategy rather than hoping for different results.</span>
            </li>
          </ul>
          <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-4 mt-4 rounded">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Important:</strong> Past performance is not indicative of future results. This calculator is for educational purposes only. Always conduct thorough backtesting and forward testing before risking real capital.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalculateurRiskReward;

