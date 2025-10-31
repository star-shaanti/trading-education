"use client";

import { useState, useEffect } from "react";

interface MarketHours {
  market: string;
  open: string;
  close: string;
  timezone: string;
}

const markets: MarketHours[] = [
  { market: "Forex (London)", open: "08:00", close: "17:00", timezone: "GMT" },
  { market: "Forex (New York)", open: "13:00", close: "22:00", timezone: "EST/EDT" },
  { market: "Forex (Tokyo)", open: "00:00", close: "09:00", timezone: "JST" },
  { market: "Forex (Sydney)", open: "22:00", close: "07:00", timezone: "AEDT" },
  { market: "US Stock Market", open: "09:30", close: "16:00", timezone: "EST/EDT" },
  { market: "European Stock Market", open: "08:00", close: "16:30", timezone: "CET/CEST" },
  { market: "Asian Stock Market", open: "09:00", close: "15:00", timezone: "Local" },
  { market: "Cryptocurrency", open: "00:00", close: "24:00", timezone: "UTC" },
];

function HorairesMarches() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState<string>("local");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getMarketStatus = (market: MarketHours, currentHour: number): "open" | "closed" => {
    if (market.market === "Cryptocurrency") return "open";

    const [openHour, openMin] = market.open.split(":").map(Number);
    const [closeHour, closeMin] = market.close.split(":").map(Number);

    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    const currentTimeMinutes = currentHour * 60 + currentTime.getMinutes();

    if (closeTime < openTime) {
      // Market spans midnight
      return currentTimeMinutes >= openTime || currentTimeMinutes < closeTime
        ? "open"
        : "closed";
    } else {
      return currentTimeMinutes >= openTime && currentTimeMinutes < closeTime ? "open" : "closed";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Market Hours
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          View trading hours for major financial markets worldwide. Times are displayed in your
          local timezone.
        </p>

        <div className="card p-8">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Current Time</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    Market
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    Open
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    Close
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    Timezone
                  </th>
                </tr>
              </thead>
              <tbody>
                {markets.map((market, index) => {
                  const status = getMarketStatus(
                    market,
                    currentTime.getHours()
                  );
                  return (
                    <tr
                      key={index}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-slate-900 dark:text-slate-100">
                        {market.market}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            status === "open"
                              ? "bg-brand-success/20 text-brand-success"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {status === "open" ? "● Open" : "○ Closed"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                        {market.open}
                      </td>
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                        {market.close}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">
                        {market.timezone}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="info-box mt-6">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Note:</strong> Market hours are displayed in approximate local times. Actual
              trading hours may vary based on daylight saving time and regional holidays. Always
              verify with your broker for exact trading hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HorairesMarches;

