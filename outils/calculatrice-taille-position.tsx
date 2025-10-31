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
      </div>
    </div>
  );
}

export default CalculatriceTaillePosition;

