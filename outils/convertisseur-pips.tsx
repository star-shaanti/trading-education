"use client";

import { useState, useEffect } from "react";

function ConvertisseurPips() {
  const [pips, setPips] = useState<string>("10");
  const [points, setPoints] = useState<string>("100");
  const [percentage, setPercentage] = useState<string>("0.01");
  const [price, setPrice] = useState<string>("50000");
  const [pipValue, setPipValue] = useState<string>("1");

  const updateFromPips = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setPips(value);
    if (price && pipValue) {
      const priceNum = parseFloat(price);
      const pipValueNum = parseFloat(pipValue);
      const pointsValue = numValue * (pipValueNum / 10);
      const percentageValue = (numValue * pipValueNum) / priceNum;
      setPoints(pointsValue.toFixed(2));
      setPercentage((percentageValue * 100).toFixed(4));
    }
  };

  const updateFromPoints = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setPoints(value);
    if (price && pipValue) {
      const priceNum = parseFloat(price);
      const pipValueNum = parseFloat(pipValue);
      const pipsValue = (numValue * 10) / pipValueNum;
      const percentageValue = numValue / priceNum;
      setPips(pipsValue.toFixed(2));
      setPercentage((percentageValue * 100).toFixed(4));
    }
  };

  const updateFromPercentage = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setPercentage(value);
    if (price && pipValue) {
      const priceNum = parseFloat(price);
      const pipValueNum = parseFloat(pipValue);
      const pointsValue = (numValue / 100) * priceNum;
      const pipsValue = (pointsValue * 10) / pipValueNum;
      setPoints(pointsValue.toFixed(2));
      setPips(pipsValue.toFixed(2));
    }
  };

  useEffect(() => {
    if (price && pipValue) {
      const priceNum = parseFloat(price);
      const pipValueNum = parseFloat(pipValue);
      const pipsNum = parseFloat(pips) || 0;
      const pointsValue = pipsNum * (pipValueNum / 10);
      const percentageValue = (pipsNum * pipValueNum) / priceNum;
      setPoints(pointsValue.toFixed(2));
      setPercentage((percentageValue * 100).toFixed(4));
    }
  }, [price, pipValue]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Pips/Points/Percentage Converter
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Convert between pips, points, and percentage values for your trading calculations.
        </p>

        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Understanding Pips, Points, and Percentages in Trading
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            When trading financial instruments, you'll encounter different units of measurement: pips (used in Forex), points (used in stocks and indices), and percentages (universal). Understanding how to convert between these units is essential for accurate risk calculations and position sizing across different markets.
          </p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            What are Pips?
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            A pip (percentage in point) is the smallest price move that a currency exchange rate can make. For most currency pairs, one pip equals 0.0001, or 1/100 of 1%. For JPY pairs, one pip equals 0.01. Pips help traders quantify price movements and calculate profits or losses accurately in Forex trading.
          </p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            What are Points?
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Points are similar to pips but used primarily for stocks, indices, and commodities. For stocks, one point typically equals $1 per share. For indices like the S&P 500, one point equals one unit of the index value. Points provide a standardized way to measure price movements in these markets.
          </p>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            Using Percentages for Universal Comparisons
          </h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Percentage changes allow traders to compare price movements across different instruments regardless of their absolute price levels. A 2% move in a $50 stock and a $100 stock both represent the same percentage change, making it easier to assess relative volatility and risk across different markets.
          </p>
        </div>

        <div className="card p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Current Price
              </label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  updateFromPips(pips);
                }}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-visible:outline-2 focus-visible:outline-brand-primary"
              />
            </div>

            <div>
              <label
                htmlFor="pipValue"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Pip Value
              </label>
              <input
                id="pipValue"
                type="number"
                step="0.01"
                value={pipValue}
                onChange={(e) => {
                  setPipValue(e.target.value);
                  updateFromPips(pips);
                }}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-visible:outline-2 focus-visible:outline-brand-primary"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-6">
            <div>
              <label
                htmlFor="pips"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Pips
              </label>
              <input
                id="pips"
                type="number"
                step="0.01"
                value={pips}
                onChange={(e) => updateFromPips(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-visible:outline-2 focus-visible:outline-brand-primary"
              />
            </div>

            <div>
              <label
                htmlFor="points"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Points
              </label>
              <input
                id="points"
                type="number"
                step="0.01"
                value={points}
                onChange={(e) => updateFromPoints(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-visible:outline-2 focus-visible:outline-brand-primary"
              />
            </div>

            <div>
              <label
                htmlFor="percentage"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Percentage (%)
              </label>
              <input
                id="percentage"
                type="number"
                step="0.0001"
                value={percentage}
                onChange={(e) => updateFromPercentage(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus-visible:outline-2 focus-visible:outline-brand-primary"
              />
            </div>
          </div>

          <div className="info-box mt-6">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Note:</strong> All fields are synchronized. Changing any value will
              automatically update the others based on the current price and pip value.
            </p>
          </div>
        </div>

        <div className="card p-8 mt-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Practical Applications
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Converting between pips, points, and percentages is crucial when calculating position sizes, setting stop losses, or comparing volatility across different instruments. For example, if you're trading both Forex and stocks, you need to understand how a 50-pip stop loss in EUR/USD compares to a 50-point stop loss in a stock index.
          </p>
          <ul className="space-y-3 text-slate-700 dark:text-slate-300 mb-4">
            <li className="flex items-start">
              <span className="text-brand-primary mr-2">•</span>
              <span><strong>Risk consistency:</strong> Converting all risk to percentages ensures consistent risk management across different markets and instruments.</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-primary mr-2">•</span>
              <span><strong>Volatility assessment:</strong> Percentage moves help compare volatility between low-priced and high-priced instruments.</span>
            </li>
            <li className="flex items-start">
              <span className="text-brand-primary mr-2">•</span>
              <span><strong>Portfolio analysis:</strong> When trading multiple instruments, percentage conversions help balance risk across your portfolio.</span>
            </li>
          </ul>
          <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-4 mt-4 rounded">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Important:</strong> Pip values and point values vary by instrument and broker. Always verify calculations with your specific broker's specifications before placing trades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConvertisseurPips;

