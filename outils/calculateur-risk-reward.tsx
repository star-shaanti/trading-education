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
      </div>
    </div>
  );
}

export default CalculateurRiskReward;

