"use client";

import { useParams } from "next/navigation";
import { Section } from "@/components/Section";
import BackButton from "@/components/BackButton";
import { useLang } from "@/components/LangContext";

// Base EN content
const guides = [
  { id: "rsi", title: "RSI Indicator Guide", description: "Learn how to use the Relative Strength Index (RSI) to identify overbought and oversold conditions in the market.", content: `
      <h2>Understanding the RSI Indicator</h2>
      <p>
        The Relative Strength Index (RSI) is a momentum oscillator that moves between 0 and 100 and
        compares the magnitude of recent gains to recent losses. It is one of the most studied tools in technical
        analysis because it captures the <em>speed</em> of price changes rather than price itself. Properly used, RSI
        helps you detect trend quality, exhaustion, hidden momentum shifts, and tactical pullbacks.
      </p>

      <h3>How it is calculated</h3>
      <p>
        RSI is derived from the ratio of average up-closes and average down-closes over the lookback period (14 bars
        by default). The formula produces a bounded series, enabling consistent thresholds across markets and
        timeframes. You do not need to compute it by hand, but understanding that it measures the <strong>balance of buying versus
        selling pressure</strong> will guide your interpretation.
      </p>

      <h3>Core concepts you must know</h3>
      <ul>
        <li><strong>Thresholds:</strong> 70/30 are classic. 80/20 for strong trends; 60/40 as trend filters.</li>
        <li><strong>Trend ranges:</strong> RSI tends to hold above 40 in uptrends and below 60 in downtrends. This is more powerful than raw 70/30 signals.</li>
        <li><strong>Midline (50):</strong> acts as momentum pivot. Crosses through 50 often confirm a shift.</li>
        <li><strong>Divergences:</strong> price makes a new extreme while RSI fails to confirm (regular) or RSI makes a new extreme while price does not (hidden).</li>
        <li><strong>Failure swings:</strong> RSI turns before reaching extreme levels and then breaks a previous swing—one of Wilder’s original setups.</li>
      </ul>

      <h3>Top‑down workflow</h3>
      <ol>
        <li>Define the higher‑timeframe (HTF) market regime (trending/ranging; key support/resistance).</li>
        <li>On your execution timeframe, apply RSI(14). Optionally add a moving average for context.</li>
        <li>Choose a signal type: <em>pullback to the 40/60 area, divergence into structure, failure swing,</em> or <em>breakout with RSI > 60 in an uptrend</em>.</li>
        <li>Confirm with price structure (swing highs/lows, demand/supply, liquidity). Avoid trading against obvious HTF flows.</li>
        <li>Place the stop beyond the most recent structural swing. Size the position via risk‑based position sizing.</li>
        <li>Use partial exits at 1R/2R and trail the remainder with structure or an ATR‑based stop.</li>
      </ol>

      <h3>Four practical RSI strategies</h3>
      <h4>1) Trend pullback (RSI 40/60)</h4>
      <p>
        In an uptrend, wait for RSI to retreat toward 40–50 as price pulls into a support zone. Look for bullish candles
        or a break of a minor swing to confirm continuation. The opposite applies in downtrends (RSI 50–60 area).
      </p>
      <h4>2) Regular divergence at key levels</h4>
      <p>
        When price prints a higher high at resistance but RSI makes a lower high, momentum is waning. Use a
        confirmation trigger (break of structure) rather than fading blindly. Divergences are stronger when they align with HTF levels.
      </p>
      <h4>3) Hidden divergence in trends</h4>
      <p>
        Hidden bullish divergence (price higher low / RSI lower low) suggests trend continuation after a deep pullback.
        Combine with support and volume contraction.
      </p>
      <h4>4) Failure swing breakout</h4>
      <p>
        RSI forms a swing high below 70, pulls back, then rallies and breaks that swing high while price breaks a local
        pivot—this often precedes acceleration.
      </p>

      <h3>Risk management and trade planning</h3>
      <ul>
        <li>Risk per trade 0.5–2% depending on volatility and expectancy.</li>
        <li>Position size from stop distance; never from conviction.</li>
        <li>Daily/weekly loss caps to avoid revenge trading.</li>
        <li>Journal screenshots of RSI context (HTF + LTF) to learn your best confluences.</li>
      </ul>

      <h3>Case study</h3>
      <p>
        On EURUSD H1 a strong uptrend holds RSI above 40 for days. Price revisits a prior demand zone while RSI dips to
        43 and prints a small hidden bullish divergence. Entry on break of a minor flag; stop under the demand swing; first
        target at 2R (recent high), runner to 4R with a trailing stop under higher lows. This simple structure‑plus‑RSI plan has
        a high probability during persistent trends.
      </p>

      <h3>Backtesting checklist</h3>
      <ol>
        <li>Define objective triggers (no discretionary lines).</li>
        <li>Tag regime (trend/range) and confluence (S/R, MA, volume).</li>
        <li>Log win rate, avg win/loss in R, expectancy, drawdown, and time‑in‑trade.</li>
        <li>Run at least 100 samples across different years/vol regimes; forward‑test 20 trades before going live.</li>
      </ol>

      <h3>FAQ</h3>
      <p><strong>Is 14 the best setting?</strong> Not universally. 7 is faster for scalping; 21 is smoother for swing trading. Retest your setups when you change it.</p>
      <p><strong>Does overbought always mean “sell”?</strong> No. In strong uptrends RSI can remain overbought for extended periods; treat it as strength, not a signal to fade.</p>

      <h3>Glossary</h3>
      <ul>
        <li><em>HTF:</em> higher‑timeframe; <em>LTF:</em> lower‑timeframe; <em>R:</em> risk unit (stop size in monetary terms).</li>
      </ul>

      <h3>Additional techniques and integrations</h3>
      <p>
        Combine RSI with moving averages (for trend bias), anchored VWAP (for value areas) and session timing. For instance,
        an RSI divergence that appears exactly at the London close is less trustworthy than one that forms during the
        New York morning impulse. Context beats any single indicator.
      </p>
      <ul>
        <li><strong>RSI + MA:</strong> trade only in the direction where price is above the 50/100‑MA and RSI holds above 40.</li>
        <li><strong>RSI + Structure:</strong> require confluence with supply/demand or prior swing highs/lows.</li>
        <li><strong>RSI + Volatility:</strong> during high ATR regimes prefer continuation (hidden divergences) over mean‑reversion.</li>
      </ul>

      <h3>Execution checklist (printable)</h3>
      <ul>
        <li>HTF trend defined? Key level identified?</li>
        <li>Chosen trigger (pullback/divergence/failure‑swing/breakout) and invalidation point?</li>
        <li>Risk per trade and size computed from stop distance?</li>
        <li>Entry candle/context acceptable (spread, session, news)?</li>
        <li>Targets and trailing method written before entry?</li>
      </ul>

      <h3>Common pitfalls</h3>
      <ul>
        <li>Shorting each overbought print in a strong uptrend.</li>
        <li>Forcing trend trades inside tight ranges or right into HTF levels.</li>
        <li>Ignoring liquidity sweeps: always look left for resting highs/lows.</li>
      </ul>

      <h3>Study plan</h3>
      <p>
        Pick one trigger (e.g., hidden divergence) and collect 100 screenshots across assets and regimes. Label entry,
        stop, targets and context (MA/VWAP/HTF level). Compute win rate and average R. Only after you gather a solid
        sample, consider adding a second trigger.
      </p>
    ` },
  { id: "money-management", title: "Money Management Basics", description: "Essential risk management principles to protect your capital and maximize long-term profitability.", content: `
      <h2>Why money management matters</h2>
      <p>
        A robust risk framework turns an edge into consistent equity growth and prevents a string of losses from
        crippling the account. The goal is not to avoid losses (impossible) but to <strong>predefine risk</strong>, size logically and
        keep drawdowns tolerable so you can execute the next trade objectively.
      </p>

      <h3>Risk per trade</h3>
      <ul>
        <li>Use 0.5–2% per trade depending on volatility, quality of setup and account size.</li>
        <li>Smaller risk gives more opportunities to compound and reduces emotional pressure.</li>
      </ul>

      <h3>Position sizing formula</h3>
      <ol>
        <li>Compute stop distance in the instrument’s units (pips, ticks, points, %).</li>
        <li>Monetary risk = Account × Risk%.</li>
        <li>Position size = Monetary risk ÷ (Stop distance × value per unit).</li>
        <li>Round to contract size; include fees and slippage buffers.</li>
      </ol>

      <h3>Portfolio and exposure rules</h3>
      <ul>
        <li>Avoid stacking correlated positions (e.g., several USD longs). Define a max basket risk.</li>
        <li>Set a daily and weekly loss cap (e.g., 3R/day, 6R/week). If breached, stop trading and review.</li>
        <li>During high‑impact events, halve risk or stand aside unless your plan explicitly covers news trades.</li>
      </ul>

      <h3>Trade management</h3>
      <ul>
        <li>Partial take‑profits at structure or fixed R multiples (1R/2R) smooth equity curves.</li>
        <li>Trail stops logically (swing structure or ATR). Avoid trailing too tight in early trend phases.</li>
        <li>Never widen a stop after entry; reduce size instead.</li>
      </ul>

      <h3>Compounding & drawdown control</h3>
      <p>
        Recalculate size periodically (weekly/monthly) rather than after every trade to reduce noise. If equity drops
        more than X% (your “max pain”), decrease risk until the account stabilizes. Protect <em>time in the market</em>—capital is
        your production machine.
      </p>

      <h3>Process & journaling</h3>
      <ol>
        <li>Document setups with screenshots and risk metrics.</li>
        <li>Track expectancy (win rate × avg win − loss rate × avg loss).</li>
        <li>Run weekly reviews; identify when risk should be dialed up or down.</li>
      </ol>

      <h3>Example</h3>
      <p>
        Account = $25,000; risk 1% = $250. Stop distance = 50 pips; pip value = $10/lot. Position size = 250 ÷ (50×10) = 0.5 lots.
        First target at 2R, trail remainder under higher lows. If three consecutive losing days occur or daily loss exceeds 3R,
        stop trading and review.
      </p>

      <h3>Checklist</h3>
      <ul>
        <li>Risk% defined? Position size computed from stop distance?</li>
        <li>Basket risk/correlation checked?</li>
        <li>Exit plan (partials, trail) written before entry?</li>
        <li>Daily/weekly caps enforced by platform or alerts?</li>
      </ul>
      <h3>Playbook templates</h3>
      <p>
        Create A/B/C setup templates with predefined risk (e.g., A=1%, B=0.7%, C=0.5%), default targets and management rules.
        This reduces hesitation and keeps behavior consistent across market regimes.
      </p>
      <h3>Scaling in/out</h3>
      <ul>
        <li>Pyramiding only when unrealized profit ≥ 1R and structure confirms continuation.</li>
        <li>De‑risk to break‑even after partial at 1R if statistics support it; otherwise keep initial stop.</li>
      </ul>
    ` },
  { id: "leverage", title: "Understanding Leverage", description: "Learn how leverage works in trading and how to use it responsibly to amplify your positions.", content: `
      <h2>What is Leverage?</h2>
      <p>Leverage multiplies position exposure relative to committed capital (margin). It accelerates both gains and losses and introduces specific risks: maintenance margin, liquidation thresholds and financing/funding costs.</p>
      <h3>Key mechanics</h3>
      <ul>
        <li>Notional = Price × Quantity. Margin = Notional / Leverage.</li>
        <li>Maintenance margin: if equity falls below this level, forced reduction/liquidation occurs.</li>
        <li>Funding/financing: periodic payments on perpetuals/CFDs; include them in expectancy.</li>
      </ul>
      <h3>Practical framework</h3>
      <ol>
        <li>Decide risk in money first, then compute size; do not "use" max leverage.</li>
        <li>Place hard stops; avoid averaging losers. Reduce size into high‑volatility events.</li>
        <li>Simulate liquidation price before entry to ensure it is beyond planned stop.</li>
      </ol>
      <h3>Real Example: Bitcoin Futures with Different Leverage Levels</h3>
      <p><strong>Scenario:</strong> BTC at $50,000, account $10,000, risk 1% = $100.</p>
      <h4>Option A: 10:1 Leverage (Conservative)</h4>
      <ul>
        <li>Want to risk $100 with stop at $49,000 (2% move = $1,000 per contract)</li>
        <li>Notional needed: $50,000 × 1 contract = $50,000</li>
        <li>Margin required: $50,000 / 10 = $5,000</li>
        <li><strong>Problem:</strong> Margin $5,000 &gt; Account $10,000 but you only need 0.1 contract to risk $100</li>
        <li>Size calculation: $100 ÷ $1,000 per contract = 0.1 contract</li>
        <li>Actual margin: $50,000 × 0.1 / 10 = $500 (5% of account)</li>
        <li><strong>Result:</strong> Safe, plenty of buffer</li>
      </ul>
      <h4>Option B: 50:1 Leverage (Moderate)</h4>
      <ul>
        <li>Same setup: 0.1 contract to risk $100</li>
        <li>Margin: $50,000 × 0.1 / 50 = $100 (1% of account)</li>
        <li><strong>Liquidation check:</strong> If BTC drops to $48,500, loss = $150, equity = $9,850 (still above margin)</li>
        <li><strong>Result:</strong> Acceptable with proper stop</li>
      </ul>
      <h4>Option C: 100:1 Leverage (Aggressive — NOT Recommended)</h4>
      <ul>
        <li>Same 0.1 contract</li>
        <li>Margin: $50,000 × 0.1 / 100 = $50 (0.5% of account)</li>
        <li><strong>Risk:</strong> Small adverse move could trigger liquidation before stop</li>
        <li><strong>Result:</strong> Too risky; avoid unless you have specific expertise</li>
      </ul>
      <h3>Liquidation Calculation Example</h3>
      <p><strong>Account:</strong> $20,000; <strong>Position:</strong> 1 BTC contract at $50,000; <strong>Leverage:</strong> 20:1</p>
      <ul>
        <li>Margin used: $50,000 / 20 = $2,500</li>
        <li>Free margin: $20,000 − $2,500 = $17,500</li>
        <li>Liquidation if equity falls to $2,000 (80% of margin = typical broker rule)</li>
        <li>Max loss before liquidation: $20,000 − $2,000 = $18,000</li>
        <li>Price drop that triggers liquidation: $50,000 − ($18,000 / contract value) = $32,000</li>
        <li><strong>Lesson:</strong> Always place stops well above liquidation price</li>
      </ul>
    ` },
  { id: "ichimoku", title: "Ichimoku Cloud Strategy", description: "Master the Ichimoku indicator - a comprehensive technical analysis system that provides support, resistance, and trend signals.", content: `
      <h2>Ichimoku Cloud Overview</h2>
      <p>Ichimoku Kinko Hyo is a full trend‑following system. Components: Tenkan (conversion), Kijun (base), Senkou A/B (cloud) and Chikou (lagging).</p>
      <h3>Signals</h3>
      <ul>
        <li>TK cross with price above the cloud (bullish) or below (bearish).</li>
        <li>Kumo breakouts with HTF cloud alignment.</li>
        <li>Pullbacks to Kijun within trend for continuation entries.</li>
      </ul>
      <h3>Plan</h3>
      <ol>
        <li>Read HTF cloud bias and only trade in its direction.</li>
        <li>Enter on TK cross + Kumo support/resistance or Kijun pullback.</li>
        <li>Stop beyond Kijun/cloud; scale out at prior swing and trail with Kijun.</li>
      </ol>
      <h3>Detailed Case Study: EURUSD H4 Ichimoku Trade</h3>
      <p><strong>Context:</strong> H4 chart shows uptrend with price above cloud (green). D1 also bullish cloud.</p>
      <ul>
        <li><strong>Entry:</strong> Price pulls to Kijun (1.0850) while Tenkan/Kijun cross bullish; entry at 1.0852 on break of prior candle high.</li>
        <li><strong>Stop:</strong> Below cloud support at 1.0820 (32 pips risk).</li>
        <li><strong>Target 1:</strong> Prior swing high 1.0900 (48 pips = 1.5R).</li>
        <li><strong>Target 2:</strong> Extension to 1.0950 (98 pips = 3R).</li>
        <li><strong>Size:</strong> Account $10,000, risk 1% = $100. Pip value $10/lot. Size = 100 ÷ (32 × 10) = 0.31 lots (round to 0.3).</li>
        <li><strong>Management:</strong> Close 50% at 1.0900 (+$144), move stop to break‑even, trail remainder with Kijun. Final exit at 1.0940 (+$264 on remainder). Total: +$408 (4.08R).</li>
      </ul>
      <h3>Example 2: Gold D1 Kumo Breakout</h3>
      <p><strong>Setup:</strong> Gold consolidates below cloud for weeks, then breaks above with Tenkan crossing Kijun.</p>
      <ul>
        <li><strong>Entry:</strong> $2,040 on close above cloud top.</li>
        <li><strong>Stop:</strong> $2,020 (below cloud bottom, 20 points).</li>
        <li><strong>Target:</strong> $2,100 (previous resistance, 60 points = 3R).</li>
        <li><strong>Size:</strong> Account $50,000, risk 1.5% = $750. Point value $100/oz. Size = 750 ÷ (20 × 100) = 0.375 oz (round to 0.4).</li>
        <li><strong>Result:</strong> Hit target; +$2,400 (3.2R).</li>
      </ul>
    ` },
  { id: "economic-calendar", title: "Economic Calendar Guide", description: "Understand how economic events impact markets and learn to trade around major announcements.", content: `
      <h2>Economic Calendar</h2>
      <p>Macro releases move expectations and liquidity. Your plan must adapt risk, timing and strategy.</p>
      <h3>Event tiers</h3>
      <ul>
        <li>High: central banks, CPI/PPI, NFP, GDP, PMIs.</li>
        <li>Medium: inventories, housing, confidence.</li>
        <li>Low: speeches/minor reports.</li>
      </ul>
      <h3>Checklist</h3>
      <ul>
        <li>Know exact times and forecasts; avoid opening positions minutes before high‑impact events unless that is your specific edge.</li>
        <li>After release: wait for spreads to normalize; trade only clear structure breaks.</li>
      </ul>
      <h3>Case Study: Trading Around NFP (Non-Farm Payrolls)</h3>
      <p><strong>Context:</strong> USD/JPY long position, entry 150.50, stop 150.00. NFP releases at 8:30 AM ET.</p>
      <h4>Pre-Release Action Plan</h4>
      <ul>
        <li><strong>30 minutes before:</strong> Close 50% of position to reduce risk to 0.5R</li>
        <li><strong>Reason:</strong> NFP can cause 80–150 pip moves in seconds</li>
        <li><strong>Forecast:</strong> +180k jobs (previous +250k)</li>
        <li><strong>Market expectation:</strong> Slightly bearish USD if miss</li>
      </ul>
      <h4>Post-Release Scenario A: Beat (+250k actual)</h4>
      <ul>
        <li>USD/JPY spikes to 151.20 within 2 minutes</li>
        <li>Spread widens to 8 pips (normal 2 pips)</li>
        <li><strong>Action:</strong> Wait 10 minutes for spread normalization</li>
        <li>Price consolidates at 151.00; close remaining 50% at +50 pips = +1R</li>
        <li><strong>Total result:</strong> +0.5R (first half) + 1R (second half) = +1.5R instead of potential −1R if stopped</li>
      </ul>
      <h4>Post-Release Scenario B: Miss (+120k actual)</h4>
      <ul>
        <li>USD/JPY drops to 149.80 within 1 minute</li>
        <li>Stop triggered at 150.00: loss 0.5R (only on 50% remaining)</li>
        <li><strong>Total result:</strong> +0.5R (first half closed pre‑news) − 0.5R (stop) = Break‑even</li>
        <li><strong>Without pre‑close:</strong> Would have lost full 1R</li>
      </ul>
      <h3>ECB Rate Decision Example</h3>
      <p><strong>Setup:</strong> EUR/USD short at 1.0950, stop 1.1000. ECB announcement 8:45 AM CET.</p>
      <ul>
        <li><strong>Pre‑announcement:</strong> Close 70% of position</li>
        <li><strong>After announcement:</strong> ECB hikes 0.25%, EUR spikes to 1.0980</li>
        <li><strong>Action:</strong> Wait 15 minutes; price reverses to 1.0930 on profit‑taking</li>
        <li><strong>Close remainder:</strong> +20 pips = +0.4R on 30% position</li>
        <li><strong>Total:</strong> Locked +0.7R before volatility, captured +0.12R after = +0.82R total</li>
      </ul>
    ` },
  { id: "risk-reward", title: "Risk/Reward Ratio Explained", description: "Learn how to calculate and use risk/reward ratios to build profitable trading strategies.", content: `
      <h2>Risk/Reward</h2>
      <p>R:R defines payoff structure. Combine with win rate to compute expectancy and ensure long‑term viability.</p>
      <h3>Formulas</h3>
      <ul>
        <li>R:R = Reward / Risk (both expressed in R).</li>
        <li>Expectancy = WinRate × AvgWin − (1 − WinRate) × AvgLoss.</li>
      </ul>
      <h3>Application</h3>
      <ol>
        <li>Choose targets from structure (swing, ADR, liquidity) not from hope.</li>
        <li>Record average R per setup; discontinue setups with negative expectancy.</li>
      </ol>
      <h3>Detailed Calculation Example</h3>
      <p><strong>Scenario:</strong> You risk $200 per trade (1R = $200).</p>
      <ul>
        <li><strong>Trade 1:</strong> Win +$400 (2R)</li>
        <li><strong>Trade 2:</strong> Loss −$200 (1R)</li>
        <li><strong>Trade 3:</strong> Win +$600 (3R)</li>
        <li><strong>Trade 4:</strong> Loss −$200 (1R)</li>
        <li><strong>Trade 5:</strong> Win +$400 (2R)</li>
      </ul>
      <p><strong>Step-by-step expectancy:</strong></p>
      <ol>
        <li>Win rate = 3 wins / 5 trades = 60%</li>
        <li>Avg win = (400 + 600 + 400) / 3 = $466.67 (2.33R)</li>
        <li>Avg loss = (200 + 200) / 2 = $200 (1R)</li>
        <li>Expectancy = 0.60 × 2.33R − 0.40 × 1R = 1.398R − 0.4R = <strong>+0.998R per trade</strong></li>
        <li>Over 100 trades: +99.8R = +$19,960 (with $200 risk per trade)</li>
      </ol>
      <h3>Case Study: Strategy A vs Strategy B</h3>
      <p><strong>Strategy A (High Win Rate, Low R:R):</strong></p>
      <ul>
        <li>Win rate: 70%, Avg win: 0.8R, Avg loss: 1R</li>
        <li>Expectancy = 0.70 × 0.8R − 0.30 × 1R = 0.56R − 0.30R = <strong>+0.26R per trade</strong></li>
      </ul>
      <p><strong>Strategy B (Lower Win Rate, Higher R:R):</strong></p>
      <ul>
        <li>Win rate: 45%, Avg win: 2.5R, Avg loss: 1R</li>
        <li>Expectancy = 0.45 × 2.5R − 0.55 × 1R = 1.125R − 0.55R = <strong>+0.575R per trade</strong></li>
      </ul>
      <p><strong>Conclusion:</strong> Strategy B generates 2.2× more expectancy per trade despite lower win rate, because R:R compensates.</p>
      <h3>Real Trade Example: GBPUSD Swing</h3>
      <ul>
        <li><strong>Entry:</strong> 1.2650</li>
        <li><strong>Stop:</strong> 1.2580 (70 pips = 1R = $700 on 1 lot)</li>
        <li><strong>Target 1:</strong> 1.2790 (140 pips = 2R) — close 50%</li>
        <li><strong>Target 2:</strong> 1.2930 (280 pips = 4R) — close remainder</li>
        <li><strong>Actual result:</strong> Hit T1 (+$700), T2 stopped at +3.5R (+$2,450)</li>
        <li><strong>Total:</strong> +$3,150 (4.5R average)</li>
      </ul>
      <h3>Break-Even Analysis</h3>
      <p>Minimum win rate needed for positive expectancy:</p>
      <ul>
        <li>If R:R = 1:2, need win rate &gt; 33.3%</li>
        <li>If R:R = 1:3, need win rate &gt; 25%</li>
        <li>If R:R = 1:1.5, need win rate &gt; 40%</li>
      </ul>
      <p>Formula: Min WinRate = 1 ÷ (1 + R:R)</p>
    ` },
  { id: "psychology", title: "Trading Psychology", description: "Master your emotions and develop the mental discipline needed for consistent trading success.", content: `
      <h2>Psychology</h2>
      <p>Build processes that reduce cognitive load and maintain discipline under uncertainty.</p>
      <h3>Routines</h3>
      <ul>
        <li>Pre‑market: plan scenarios, levels, risk for the session.</li>
        <li>During: checklist‑driven execution, no social media, fixed review times.</li>
        <li>Post: journaling, metrics, one improvement for tomorrow.</li>
      </ul>
      <h3>Protocol after losses</h3>
      <p>Hard stop after daily cap, short walk, review last trades, only resume if composure is restored.</p>
      <h3>Case Study: Revenge Trading Recovery</h3>
      <p><strong>Situation:</strong> Trader loses 3R in morning session (3 consecutive stops). Daily cap is 3R. Emotion: frustration + desire to "win back".</p>
      <h4>Wrong Response (Revenge Trading)</h4>
      <ul>
        <li>Ignores daily cap, doubles position size</li>
        <li>Takes marginal setup without waiting for quality</li>
        <li>Result: Loses additional 4R → Total −7R for day</li>
        <li>Account damage: $14,000 → $13,020 (7% drawdown)</li>
        <li>Next day: Fear sets in, over‑cautious, misses good setups</li>
      </ul>
      <h4>Correct Response (Discipline Protocol)</h4>
      <ul>
        <li><strong>Step 1:</strong> Close platform immediately (automatic alert at 3R loss)</li>
        <li><strong>Step 2:</strong> 15‑minute walk outside, no phone</li>
        <li><strong>Step 3:</strong> Review last 3 trades objectively — was execution correct?</li>
        <li><strong>Step 4:</strong> If yes (bad luck), accept it. If no (mistake), note lesson</li>
        <li><strong>Step 5:</strong> Resume only next day, same rules, no "make‑up" mentality</li>
        <li><strong>Result:</strong> Losses capped at 3R, account $13,700 (3% drawdown)</li>
        <li><strong>Next day:</strong> Fresh mindset, catches 2 good setups → +4R</li>
        <li><strong>Net result:</strong> −3R + +4R = +1R over 2 days vs −7R if revenge traded</li>
      </ul>
      <h3>Emotional State Management</h3>
      <h4>Pre‑Trade Checklist</h4>
      <ul>
        <li>Am I calm? (1–10 scale; if &lt; 7, skip)</li>
        <li>Did I sleep 7+ hours?</li>
        <li>Have I eaten? (low blood sugar = poor decisions)</li>
        <li>Is this setup from my plan or FOMO?</li>
        <li>Can I accept a full loss on this trade?</li>
      </ul>
      <h4>During Trade</h4>
      <ul>
        <li>Set alerts for targets/stops; avoid watching screen</li>
        <li>If feeling euphoric (big win), reduce next position size</li>
        <li>If feeling anxious (recent loss), check if fear is justified or emotional</li>
      </ul>
      <h3>Journal Template (Psychological Section)</h3>
      <ul>
        <li><strong>Emotion before entry:</strong> Calm / Anxious / Excited / Confident</li>
        <li><strong>Emotion during trade:</strong> Same scale + note changes</li>
        <li><strong>Emotion after:</strong> Relief / Disappointment / Pride / Regret</li>
        <li><strong>Did emotion affect execution?</strong> Yes/No + details</li>
        <li><strong>Action for next time:</strong> One specific improvement</li>
      </ul>
    ` },
  { id: "backtesting", title: "Backtesting Strategies", description: "Learn how to test your trading strategies on historical data to validate their effectiveness.", content: `
      <h2>Backtesting</h2>
      <p>Evaluate rules on historical data with realistic assumptions.</p>
      <h3>Process</h3>
      <ol>
        <li>Define precise entry/exit/filters and management rules.</li>
        <li>Use clean data; include fees/slippage; avoid peeking bias.</li>
        <li>Segment by regimes; compute win rate, avg R, max drawdown, Sharpe.</li>
        <li>Validate out‑of‑sample then forward‑test on paper before live.</li>
      </ol>
      <h3>Detailed Backtest Example: RSI Divergence Strategy</h3>
      <p><strong>Strategy rules:</strong></p>
      <ul>
        <li>Entry: Hidden bullish divergence on H1 when HTF (D1) is uptrend, RSI &lt; 45, price touches 20‑EMA</li>
        <li>Stop: 25 pips below entry (or below prior swing low)</li>
        <li>Target: 2R (50 pips) for 50%, trail remainder with 20‑EMA</li>
        <li>Filter: Only trade London/New York sessions, avoid 30 min before major news</li>
      </ul>
      <h4>Backtest Results (EURUSD, Jan 2023–Dec 2023)</h4>
      <ul>
        <li><strong>Total trades:</strong> 87</li>
        <li><strong>Wins:</strong> 48 (55.2%)</li>
        <li><strong>Losses:</strong> 39 (44.8%)</li>
        <li><strong>Avg win:</strong> +2.3R</li>
        <li><strong>Avg loss:</strong> −1R</li>
        <li><strong>Expectancy:</strong> (0.552 × 2.3R) − (0.448 × 1R) = 1.27R − 0.448R = <strong>+0.822R per trade</strong></li>
        <li><strong>Total return:</strong> +71.5R over 87 trades</li>
        <li><strong>Max drawdown:</strong> −8.5R (consecutive 11 losses)</li>
        <li><strong>Sharpe ratio:</strong> 1.42</li>
        <li><strong>Largest win:</strong> +5.2R</li>
        <li><strong>Largest loss:</strong> −1.2R (slippage)</li>
      </ul>
      <h4>Out‑of‑Sample Validation (Jan 2024–Jun 2024)</h4>
      <ul>
        <li><strong>Total trades:</strong> 42</li>
        <li><strong>Expectancy:</strong> +0.76R per trade (slightly lower but acceptable)</li>
        <li><strong>Win rate:</strong> 52.4% (similar to in‑sample)</li>
        <li><strong>Conclusion:</strong> Strategy is robust; proceed to forward testing</li>
      </ul>
      <h4>Forward Test (Paper Trading, Jul 2024–Sep 2024)</h4>
      <ul>
        <li><strong>Total trades:</strong> 28</li>
        <li><strong>Real expectancy:</strong> +0.68R (includes real slippage/spreads)</li>
        <li><strong>Note:</strong> Slippage reduced expectancy by ~0.1R (expected)</li>
        <li><strong>Decision:</strong> Go live with 0.5% risk per trade initially</li>
      </ul>
      <h3>Common Backtesting Mistakes</h3>
      <ul>
        <li><strong>Overfitting:</strong> Optimizing 10 parameters → 95% win rate (unrealistic)</li>
        <li><strong>Solution:</strong> Limit to 2–3 parameters, test on multiple pairs/timeframes</li>
        <li><strong>Ignoring fees:</strong> Backtest shows +100R, reality +85R after commissions</li>
        <li><strong>Solution:</strong> Add 0.1% commission + 1 pip slippage per trade</li>
        <li><strong>Survivorship bias:</strong> Testing only current liquid pairs</li>
        <li><strong>Solution:</strong> Include pairs that were delisted/merged</li>
      </ul>
    ` },
  { id: "dca-vs-swing", title: "DCA vs Swing Trading", description: "Compare Dollar Cost Averaging and Swing Trading strategies to find what works for you.", content: `
      <h2>DCA vs Swing</h2>
      <p>DCA suits long‑term accumulation with minimal decisions; Swing targets multi‑day moves with active risk control.</p>
      <h3>Decision matrix</h3>
      <ul>
        <li>Low time/experience → DCA; higher time/edge → Swing.</li>
        <li>Low volatility tolerance → DCA; higher tolerance → Swing with small risk.</li>
      </ul>
      <h3>Real-World Comparison: Bitcoin Investment (2022–2024)</h3>
      <p><strong>Starting capital:</strong> $10,000; <strong>Period:</strong> 24 months; <strong>BTC price range:</strong> $20k–$65k</p>
      <h4>Strategy A: DCA (Monthly $416.67)</h4>
      <ul>
        <li><strong>Method:</strong> Buy $416.67 worth of BTC on 1st of each month, regardless of price</li>
        <li><strong>Total invested:</strong> $10,000 over 24 months</li>
        <li><strong>Average entry:</strong> ~$35,000 (smoothing effect)</li>
        <li><strong>Final value (at $60k):</strong> ~$17,140</li>
        <li><strong>Return:</strong> +71.4%</li>
        <li><strong>Max drawdown:</strong> −45% during bear market</li>
        <li><strong>Time required:</strong> 5 minutes per month</li>
        <li><strong>Stress level:</strong> Low (automated, no decisions)</li>
      </ul>
      <h4>Strategy B: Swing Trading (Active)</h4>
      <ul>
        <li><strong>Method:</strong> Enter on pullbacks to support, exit at resistance or 2R targets</li>
        <li><strong>Risk per trade:</strong> 1% ($100)</li>
        <li><strong>Average trades/month:</strong> 3–4</li>
        <li><strong>Win rate:</strong> 55%, Avg R:R 1:2.5</li>
        <li><strong>Expectancy:</strong> +0.937R per trade</li>
        <li><strong>Total trades (24 months):</strong> 84</li>
        <li><strong>Final value:</strong> ~$17,870 (assuming compounding)</li>
        <li><strong>Return:</strong> +78.7%</li>
        <li><strong>Max drawdown:</strong> −12% (better risk control)</li>
        <li><strong>Time required:</strong> 2–3 hours per week</li>
        <li><strong>Stress level:</strong> Moderate (requires discipline and monitoring)</li>
      </ul>
      <h4>Hybrid Approach (Recommended for Many)</h4>
      <ul>
        <li><strong>Core:</strong> 70% DCA ($7,000) for steady accumulation</li>
        <li><strong>Active:</strong> 30% Swing ($3,000) for alpha</li>
        <li><strong>Final value:</strong> ~$17,400 (weighted average)</li>
        <li><strong>Benefits:</strong> Lower stress than 100% swing, better returns than 100% DCA</li>
        <li><strong>Best for:</strong> Intermediate traders with limited time</li>
      </ul>
      <h3>DCA Calculation Example</h3>
      <p><strong>Monthly DCA:</strong> $500; <strong>BTC prices over 6 months:</strong> $30k, $28k, $32k, $35k, $40k, $38k</p>
      <ul>
        <li>Month 1: $500 ÷ $30,000 = 0.01667 BTC</li>
        <li>Month 2: $500 ÷ $28,000 = 0.01786 BTC</li>
        <li>Month 3: $500 ÷ $32,000 = 0.01563 BTC</li>
        <li>Month 4: $500 ÷ $35,000 = 0.01429 BTC</li>
        <li>Month 5: $500 ÷ $40,000 = 0.01250 BTC</li>
        <li>Month 6: $500 ÷ $38,000 = 0.01316 BTC</li>
        <li><strong>Total:</strong> $3,000 invested, 0.09011 BTC acquired</li>
        <li><strong>Average price:</strong> $3,000 ÷ 0.09011 = $33,275</li>
        <li><strong>Simple average of prices:</strong> ($30k + $28k + $32k + $35k + $40k + $38k) ÷ 6 = $33,833</li>
        <li><strong>DCA advantage:</strong> Bought more at lower prices, less at higher prices</li>
      </ul>
    ` },
  { id: "timeframes", title: "Understanding Timeframes", description: "Learn how different timeframes affect trading decisions and how to choose the right one for your style.", content: `
      <h2>Timeframes</h2>
      <p>Use multi‑timeframe analysis: HTF defines bias and levels; MTF refines zones; LTF gives triggers with defined risk.</p>
      <h3>Mapping</h3>
      <ul>
        <li>Scalping: HTF H1, MTF M15, LTF M1–M5</li>
        <li>Day: HTF H4/D1, MTF H1, LTF M5–M15</li>
        <li>Swing: HTF D1/W1, MTF H4, LTF H1</li>
      </ul>
      <h3>Real Example: Multi-Timeframe EURUSD Trade</h3>
      <p><strong>Date:</strong> March 15, 2024; <strong>Style:</strong> Day Trading</p>
      <h4>Step 1: HTF Analysis (D1)</h4>
      <ul>
        <li>Trend: Strong uptrend since February</li>
        <li>Key levels: Support at 1.0850 (prior swing low), Resistance at 1.0950</li>
        <li>Bias: <strong>BULLISH</strong> — only look for long entries</li>
        <li>Entry zone: 1.0850–1.0870 (support area)</li>
      </ul>
      <h4>Step 2: MTF Analysis (H1)</h4>
      <ul>
        <li>Structure: Price retracing to 1.0860 area</li>
        <li>Indicators: RSI at 42 (approaching oversold in uptrend), 20‑EMA at 1.0865</li>
        <li>Zone: 1.0860–1.0870 is confluence (D1 support + H1 EMA)</li>
        <li>Wait for: Bullish candle reversal or break above minor resistance at 1.0875</li>
      </ul>
      <h4>Step 3: LTF Entry (M15)</h4>
      <ul>
        <li>Price reaches 1.0862</li>
        <li>Forms bullish engulfing candle at 09:15 GMT</li>
        <li>RSI on M15: 38 (oversold bounce forming)</li>
        <li><strong>Entry trigger:</strong> Long at 1.0865 (break of engulfing candle high)</li>
        <li><strong>Stop:</strong> 1.0850 (below D1 support, 15 pips risk)</li>
        <li><strong>Target 1:</strong> 1.0895 (prior H1 swing high, 30 pips = 2R)</li>
        <li><strong>Target 2:</strong> 1.0920 (D1 resistance area, 55 pips = 3.67R)</li>
      </ul>
      <h4>Trade Execution & Result</h4>
      <ul>
        <li><strong>Size:</strong> Account $20,000, risk 1% = $200. Pip value $10/lot. Size = 200 ÷ (15 × 10) = 1.33 lots (round to 1.3)</li>
        <li><strong>Entry:</strong> 1.0865</li>
        <li><strong>Price action:</strong> Rises steadily, hits T1 at 1.0895 → Close 50% (+$390)</li>
        <li><strong>Management:</strong> Move stop to 1.0875 (breakeven + 10 pips)</li>
        <li><strong>Final:</strong> T2 hit at 1.0920 → Close 50% (+$715)</li>
        <li><strong>Total profit:</strong> +$1,105 (5.53R)</li>
        <li><strong>Time in trade:</strong> 4 hours 20 minutes</li>
      </ul>
      <h3>Timeframe Selection Guide</h3>
      <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <tr style="background: #f3f4f6;">
          <th style="padding: 8px; border: 1px solid #ddd;">Style</th>
          <th style="padding: 8px; border: 1px solid #ddd;">HTF</th>
          <th style="padding: 8px; border: 1px solid #ddd;">MTF</th>
          <th style="padding: 8px; border: 1px solid #ddd;">LTF</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Avg Trade Duration</th>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Scalping</td>
          <td style="padding: 8px; border: 1px solid #ddd;">H1</td>
          <td style="padding: 8px; border: 1px solid #ddd;">M15</td>
          <td style="padding: 8px; border: 1px solid #ddd;">M1–M5</td>
          <td style="padding: 8px; border: 1px solid #ddd;">5–30 min</td>
        </tr>
        <tr style="background: #f9fafb;">
          <td style="padding: 8px; border: 1px solid #ddd;">Day Trading</td>
          <td style="padding: 8px; border: 1px solid #ddd;">H4/D1</td>
          <td style="padding: 8px; border: 1px solid #ddd;">H1</td>
          <td style="padding: 8px; border: 1px solid #ddd;">M5–M15</td>
          <td style="padding: 8px; border: 1px solid #ddd;">1–6 hours</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Swing</td>
          <td style="padding: 8px; border: 1px solid #ddd;">D1/W1</td>
          <td style="padding: 8px; border: 1px solid #ddd;">H4</td>
          <td style="padding: 8px; border: 1px solid #ddd;">H1</td>
          <td style="padding: 8px; border: 1px solid #ddd;">2–10 days</td>
        </tr>
      </table>
      <h3>Common Mistakes</h3>
      <ul>
        <li><strong>Trading LTF against HTF:</strong> Scalping shorts on M5 when D1 is clearly bullish → Low win rate</li>
        <li><strong>Solution:</strong> Always check HTF first; only trade in HTF direction</li>
        <li><strong>Entering on HTF without LTF confirmation:</strong> Buying D1 support immediately without waiting for M15/M5 reversal</li>
        <li><strong>Solution:</strong> HTF shows where, LTF shows when</li>
      </ul>
    ` },
];

// FR content (short but structured)
const guidesFr: Record<string, { title: string; description: string; content: string }> = {
  rsi: { title: "Guide de l'indicateur RSI", description: "Utiliser le RSI pour repérer surachat/survente et qualifier le momentum.", content: `
      <h2>Comprendre le RSI</h2>
      <p>Oscillateur borné 0–100 mesurant l'équilibre gains/pertes récents. Utile pour juger la qualité de tendance, l'épuisement et les pullbacks tactiques.</p>
      <h3>Sommaire</h3>
      <ol>
        <li>Calcul & intuition</li>
        <li>Principes clés</li>
        <li>Lecture en tendance / en range</li>
        <li>Réglages & cartographie des UT</li>
        <li>Méthode top‑down</li>
        <li>Stratégies pratiques</li>
        <li>Checklist d'exécution</li>
      </ol>
      <h3>Principes clés</h3>
      <ul>
        <li>Seuils 70/30 (classiques), 80/20 (tendances fortes), 60/40 (filtre de tendance).</li>
        <li>En tendance haussière, RSI maintient souvent > 40; en baissière, il reste < 60.</li>
        <li>Divergences (classiques et cachées), failure swing, pivot 50.</li>
      </ul>
      <h3>Méthode top‑down</h3>
      <ol>
        <li>Identifier la tendance en UT supérieure et les zones S/R.</li>
        <li>Choisir un type de signal: retour vers 40/60, divergence sur niveau, failure swing, breakout avec RSI > 60 en hausse.</li>
        <li>Confirmer par la structure; stop sous/au‑dessus du swing; taille calculée au risque.</li>
        <li>Sorties partielles 1R/2R puis suivi sur structure/ATR.</li>
      </ol>
      <h3>Checklist rapide</h3>
      <ul>
        <li>Contexte HTF clair ?</li>
        <li>Signal RSI + confluence (niveau, MA/VWAP) ?</li>
        <li>Risque défini et taille calculée ?</li>
        <li>Plan de sortie écrit (TP, trailing) ?</li>
      </ul>
      <h3>Erreurs à éviter</h3>
      <ul>
        <li>Vendre tout “surachat” dans une forte tendance.</li>
        <li>Oublier la confluence UT supérieure et les liquidités.</li>
      </ul>
      <h3>Backtest & journal</h3>
      <p>Définir des déclencheurs objectifs, taguer le régime (tendance/range), suivre win rate, R moyen, expectancy et drawdown; valider hors‑échantillon puis en paper‑trading.</p>
    ` },
  "money-management": { title: "Bases du money management", description: "Principes de gestion du risque pour protéger le capital.", content: `
      <h2>Principes et objectifs</h2>
      <p>Le but est de préserver le capital, lisser l’équité et permettre à l’avantage statistique de s’exprimer.</p>
      <h3>Risque par trade & taille</h3>
      <ul>
        <li>0,5–2% par trade selon la volatilité et la qualité du setup.</li>
        <li>Taille = (Compte × %Risque) ÷ (distance de stop × valeur/unité).</li>
      </ul>
      <h3>Volatilité et corrélation</h3>
      <p>Adapter la taille à la volatilité (ATR ou vol réalisée) et limiter l'exposition sur actifs corrélés via un risque « panier ».</p>
      <h3>Exposition & corrélation</h3>
      <p>Limiter le risque total sur actifs corrélés (panier USD, indices, etc.). Fixer des plafonds journaliers/hebdo (ex. 3R/6R) et faire une pause si dépassés.</p>
      <h3>Gestion de position</h3>
      <ul>
        <li>TP partiels sur niveaux/R multiples; trailing sur structure/ATR.</li>
        <li>Ne pas élargir le stop; réduire la taille si nécessaire.</li>
      </ul>
      <h3>Vol targeting & Kelly</h3>
      <p>Visez un risque « constant » via l’ATR; utilisez une fraction prudente de Kelly pour éviter les drawdowns profonds.</p>
      <h3>Revue & journal</h3>
      <p>Captures d’écran, métriques (expectancy), décisions d’augmentation/réduction du risque selon régimes.</p>
    ` },
  leverage: { title: "Comprendre l'effet de levier", description: "Fonctionnement et garde‑fous (marge, liquidation, coûts).", content: `
      <h2>Effet de levier</h2>
      <p>Le levier multiplie l'exposition par rapport au capital immobilisé (marge). Il accélère gains et pertes et introduit des risques spécifiques (marge de maintenance, liquidation, financement).</p>
      <h3>Mécanismes clés</h3>
      <ul>
        <li>Notionnel = Prix × Quantité; Marge = Notionnel / Levier.</li>
        <li>Liquidation si l'équité passe sous la marge de maintenance.</li>
        <li>Financement/funding périodique sur perpétuels/CFD.</li>
      </ul>
      <h3>Cadre pratique</h3>
      <ol>
        <li>Décider du risque en monnaie d'abord; la taille découle du stop, pas du levier.</li>
        <li>Stop dur; pas d'ajout sur pertes; réduire avant annonces.</li>
        <li>Vérifier le prix de liquidation projeté avant l'entrée.</li>
      </ol>
      <h3>Exemple réel: Bitcoin Futures avec différents niveaux de levier</h3>
      <p><strong>Scénario:</strong> BTC à 50 000 $, compte 10 000 $, risque 1% = 100 $.</p>
      <h4>Option A: Levier 10:1 (Conservateur)</h4>
      <ul>
        <li>Voulez risquer 100 $ avec stop à 49 000 $ (2% de mouvement = 1 000 $ par contrat)</li>
        <li>Notionnel: 50 000 $ × 1 contrat = 50 000 $</li>
        <li>Marge: 50 000 $ / 10 = 5 000 $</li>
        <li>Taille: 100 $ ÷ 1 000 $ par contrat = 0,1 contrat</li>
        <li>Marge réelle: 50 000 $ × 0,1 / 10 = 500 $ (5% du compte)</li>
        <li><strong>Résultat:</strong> Sécurisé, bonne marge</li>
      </ul>
      <h4>Option B: Levier 50:1 (Modéré)</h4>
      <ul>
        <li>Même setup: 0,1 contrat</li>
        <li>Marge: 50 000 $ × 0,1 / 50 = 100 $ (1% du compte)</li>
        <li><strong>Vérification liquidation:</strong> Si BTC chute à 48 500 $, perte = 150 $, équité = 9 850 $ (au‑dessus de la marge)</li>
        <li><strong>Résultat:</strong> Acceptable avec stop correct</li>
      </ul>
      <h4>Option C: Levier 100:1 (Agressif — NON recommandé)</h4>
      <ul>
        <li>Même 0,1 contrat</li>
        <li>Marge: 50 000 $ × 0,1 / 100 = 50 $ (0,5% du compte)</li>
        <li><strong>Risque:</strong> Petit mouvement défavorable peut déclencher liquidation avant le stop</li>
        <li><strong>Résultat:</strong> Trop risqué; éviter sauf expertise spécifique</li>
      </ul>
      <h3>Exemple de calcul de liquidation</h3>
      <p><strong>Compte:</strong> 20 000 $; <strong>Position:</strong> 1 contrat BTC à 50 000 $; <strong>Levier:</strong> 20:1</p>
      <ul>
        <li>Marge utilisée: 50 000 $ / 20 = 2 500 $</li>
        <li>Marge libre: 20 000 $ − 2 500 $ = 17 500 $</li>
        <li>Liquidation si équité tombe à 2 000 $ (80% de la marge = règle typique)</li>
        <li>Perte max avant liquidation: 20 000 $ − 2 000 $ = 18 000 $</li>
        <li>Baisse de prix déclenchant liquidation: 50 000 $ − (18 000 $ / valeur contrat) = 32 000 $</li>
        <li><strong>Leçon:</strong> Placer toujours les stops bien au‑dessus du prix de liquidation</li>
      </ul>` },
  ichimoku: { title: "Stratégie Ichimoku", description: "Tenkan/Kijun, nuage, Chikou.", content: `
      <h2>Vue d'ensemble</h2>
      <p>Système complet: Tenkan (conversion), Kijun (base), Senkou A/B (nuage), Chikou (retardé).</p>
      <h3>Signaux</h3>
      <ul>
        <li>Croisement TK au‑dessus du nuage (haussier) / au‑dessous (baissier).</li>
        <li>Cassure de Kumo avec alignement du nuage en UT supérieure.</li>
        <li>Retour sur Kijun dans la tendance pour reprise.</li>
      </ul>
      <h3>Plan</h3>
      <ol>
        <li>Suivre le biais du nuage HTF.</li>
        <li>Entrée sur TK cross + confluence ou pullback Kijun.</li>
        <li>Stop au‑delà de Kijun/nuage; prises partielles et suivi Kijun.</li>
      </ol>
      <h3>Étude de cas détaillée: EURUSD H4 Ichimoku</h3>
      <p><strong>Contexte:</strong> H4 en hausse, prix au‑dessus du nuage (vert). D1 aussi nuage haussier.</p>
      <ul>
        <li><strong>Entrée:</strong> Retour sur Kijun (1,0850) avec croisement TK haussier; entrée à 1,0852 sur cassure.</li>
        <li><strong>Stop:</strong> Sous support nuage 1,0820 (32 pips de risque).</li>
        <li><strong>Cible 1:</strong> Sommet précédent 1,0900 (48 pips = 1,5R).</li>
        <li><strong>Cible 2:</strong> Extension 1,0950 (98 pips = 3R).</li>
        <li><strong>Taille:</strong> Compte 10 000 $, risque 1% = 100 $. Valeur pip 10 $/lot. Taille = 100 ÷ (32 × 10) = 0,31 lots (arrondi 0,3).</li>
        <li><strong>Gestion:</strong> Fermeture 50% à 1,0900 (+144 $), stop à breakeven, suivi sur Kijun. Sortie finale à 1,0940 (+264 $). Total: +408 $ (4,08R).</li>
      </ul>
      <h3>Exemple 2: Or D1 Cassure Kumo</h3>
      <p><strong>Setup:</strong> Or consolide sous nuage, puis casse au‑dessus avec TK cross.</p>
      <ul>
        <li><strong>Entrée:</strong> 2 040 $ sur clôture au‑dessus du nuage.</li>
        <li><strong>Stop:</strong> 2 020 $ (20 points, sous nuage).</li>
        <li><strong>Cible:</strong> 2 100 $ (résistance précédente, 60 points = 3R).</li>
        <li><strong>Taille:</strong> Compte 50 000 $, risque 1,5% = 750 $. Valeur point 100 $/oz. Taille = 750 ÷ (20 × 100) = 0,375 oz (arrondi 0,4).</li>
        <li><strong>Résultat:</strong> Cible atteinte; +2 400 $ (3,2R).</li>
      </ul>` },
  "economic-calendar": { title: "Guide du calendrier économique", description: "Impact des annonces et plan de gestion du risque.", content: `
      <h2>Calendrier économique</h2>
      <p>Les annonces déplacent les anticipations et la liquidité. Adaptez risque, timing et stratégie.</p>
      <h3>Niveaux d'importance</h3>
      <ul>
        <li>Fort: banques centrales, CPI/PPI, NFP, PIB, PMI.</li>
        <li>Moyen: stocks, immobilier, confiance.</li>
        <li>Faible: discours/rapports mineurs.</li>
      </ul>
      <h3>Checklist</h3>
      <ul>
        <li>Connaître horaires et consensus; éviter nouvelles entrées juste avant annonces fortes.</li>
        <li>Après publication: attendre normalisation des spreads; ne trader que des cassures claires.</li>
      </ul>
      <h3>Étude de cas: Trader autour du NFP</h3>
      <p><strong>Contexte:</strong> Position long USD/JPY, entrée 150,50, stop 150,00. NFP publié à 8h30 EST.</p>
      <h4>Plan avant publication</h4>
      <ul>
        <li><strong>30 min avant:</strong> Fermer 50% de la position (risque réduit à 0,5R)</li>
        <li><strong>Raison:</strong> Le NFP peut causer des mouvements de 80–150 pips en secondes</li>
        <li><strong>Prévision:</strong> +180k emplois (précédent +250k)</li>
      </ul>
      <h4>Scénario A: Résultat au‑dessus (+250k réel)</h4>
      <ul>
        <li>USD/JPY bondit à 151,20 en 2 minutes</li>
        <li>Spread élargi à 8 pips (normal 2 pips)</li>
        <li><strong>Action:</strong> Attendre 10 min pour normalisation</li>
        <li>Prix consolide à 151,00; fermer 50% restant à +50 pips = +1R</li>
        <li><strong>Total:</strong> +0,5R + 1R = +1,5R au lieu de −1R si stop déclenché</li>
      </ul>
      <h4>Scénario B: Résultat sous (+120k réel)</h4>
      <ul>
        <li>USD/JPY chute à 149,80 en 1 minute</li>
        <li>Stop déclenché à 150,00: perte 0,5R (seulement sur 50% restant)</li>
        <li><strong>Total:</strong> +0,5R (fermé avant) − 0,5R (stop) = Breakeven</li>
        <li><strong>Sans fermeture préalable:</strong> Perte complète de 1R</li>
      </ul>` },
  "risk-reward": { title: "Ratio Risk/Reward expliqué", description: "Utiliser R:R et l'espérance.", content: `
      <h2>Risk/Reward</h2>
      <p>Le R:R décrit la structure de gain/perte. Combinez‑le au taux de réussite pour l'espérance.</p>
      <h3>Formules</h3>
      <ul>
        <li>R:R = Gain / Risque (en R).</li>
        <li>Espérance = WinRate × GainMoyen − (1 − WinRate) × PerteMoyenne.</li>
      </ul>
      <h3>Application</h3>
      <ol>
        <li>Objectifs depuis la structure (sommets/creux, ADR, liquidité).</li>
        <li>Suivre R moyen par setup; retirer ceux à espérance négative.</li>
      </ol>
      <h3>Exemple de calcul détaillé</h3>
      <p><strong>Scénario:</strong> Vous risquez 200 $ par trade (1R = 200 $).</p>
      <ul>
        <li><strong>Trade 1:</strong> Gain +400 $ (2R)</li>
        <li><strong>Trade 2:</strong> Perte −200 $ (1R)</li>
        <li><strong>Trade 3:</strong> Gain +600 $ (3R)</li>
        <li><strong>Trade 4:</strong> Perte −200 $ (1R)</li>
        <li><strong>Trade 5:</strong> Gain +400 $ (2R)</li>
      </ul>
      <p><strong>Calcul étape par étape:</strong></p>
      <ol>
        <li>Taux de gain = 3 gains / 5 trades = 60%</li>
        <li>Gain moyen = (400 + 600 + 400) / 3 = 466,67 $ (2,33R)</li>
        <li>Perte moyenne = (200 + 200) / 2 = 200 $ (1R)</li>
        <li>Espérance = 0,60 × 2,33R − 0,40 × 1R = 1,398R − 0,4R = <strong>+0,998R par trade</strong></li>
        <li>Sur 100 trades: +99,8R = +19 960 $ (avec 200 $ de risque par trade)</li>
      </ol>
      <h3>Comparaison: Stratégie A vs B</h3>
      <p><strong>Stratégie A (Taux élevé, R:R faible):</strong></p>
      <ul>
        <li>Taux: 70%, Gain moyen: 0,8R, Perte moyenne: 1R</li>
        <li>Espérance = 0,70 × 0,8R − 0,30 × 1R = 0,56R − 0,30R = <strong>+0,26R par trade</strong></li>
      </ul>
      <p><strong>Stratégie B (Taux plus bas, R:R élevé):</strong></p>
      <ul>
        <li>Taux: 45%, Gain moyen: 2,5R, Perte moyenne: 1R</li>
        <li>Espérance = 0,45 × 2,5R − 0,55 × 1R = 1,125R − 0,55R = <strong>+0,575R par trade</strong></li>
      </ul>
      <p><strong>Conclusion:</strong> La stratégie B génère 2,2× plus d'espérance malgré un taux plus faible, car le R:R compense.</p>
      <h3>Exemple réel: GBPUSD Swing</h3>
      <ul>
        <li><strong>Entrée:</strong> 1,2650</li>
        <li><strong>Stop:</strong> 1,2580 (70 pips = 1R = 700 $ sur 1 lot)</li>
        <li><strong>Cible 1:</strong> 1,2790 (140 pips = 2R) — fermer 50%</li>
        <li><strong>Cible 2:</strong> 1,2930 (280 pips = 4R) — fermer reste</li>
        <li><strong>Résultat réel:</strong> T1 atteint (+700 $), T2 arrêté à +3,5R (+2 450 $)</li>
        <li><strong>Total:</strong> +3 150 $ (4,5R moyen)</li>
      </ul>
      <h3>Analyse du seuil de rentabilité</h3>
      <p>Taux de gain minimum requis pour espérance positive:</p>
      <ul>
        <li>Si R:R = 1:2, besoin d'un taux > 33,3%</li>
        <li>Si R:R = 1:3, besoin d'un taux > 25%</li>
        <li>Si R:R = 1:1,5, besoin d'un taux > 40%</li>
      </ul>
      <p>Formule: TauxMin = 1 ÷ (1 + R:R)</p>` },
  psychology: { title: "Psychologie du trading", description: "Processus mentaux et routines.", content: `
      <h2>Psychologie</h2>
      <p>Mettre en place des processus pour réduire la charge cognitive et garder la discipline.</p>
      <h3>Routines</h3>
      <ul>
        <li>Pré‑marché: scénarios, niveaux, risque.</li>
        <li>Pendant: exécution par checklist, pas de distractions.</li>
        <li>Après: journal, métriques, amélioration unique.</li>
      </ul>
      <h3>Protocole après pertes</h3>
      <p>Arrêt après cap journalier, pause courte, revue factuelle, reprise seulement si calme retrouvé.</p>
      <h3>Étude de cas: Récupération après trading de revanche</h3>
      <p><strong>Situation:</strong> Trader perd 3R en matinée (3 stops consécutifs). Cap journalier 3R. Émotion: frustration + envie de « récupérer ».</p>
      <h4>Mauvaise réponse (Revenge Trading)</h4>
      <ul>
        <li>Ignore le cap, double la taille</li>
        <li>Prend un setup marginal sans attendre la qualité</li>
        <li>Résultat: Perd 4R supplémentaires → Total −7R</li>
        <li>Dégât: 14 000 $ → 13 020 $ (7% de drawdown)</li>
        <li>Jour suivant: Peur, sur‑prudence, rate de bons setups</li>
      </ul>
      <h4>Bonne réponse (Protocole discipline)</h4>
      <ul>
        <li><strong>Étape 1:</strong> Fermer la plateforme (alerte auto à 3R de perte)</li>
        <li><strong>Étape 2:</strong> Marche de 15 min, pas de téléphone</li>
        <li><strong>Étape 3:</strong> Revue objective des 3 derniers trades</li>
        <li><strong>Étape 4:</strong> Si exécution correcte (malchance), accepter. Si erreur, noter la leçon</li>
        <li><strong>Étape 5:</strong> Reprendre seulement le lendemain, même règles, pas de mentalité « rattrapage »</li>
        <li><strong>Résultat:</strong> Pertes plafonnées à 3R, compte 13 700 $ (3% drawdown)</li>
        <li><strong>Jour suivant:</strong> Esprit frais, attrape 2 bons setups → +4R</li>
        <li><strong>Net:</strong> −3R + +4R = +1R sur 2 jours vs −7R si revenge traded</li>
      </ul>
      <h3>Gestion de l'état émotionnel</h3>
      <h4>Checklist pré‑trade</h4>
      <ul>
        <li>Suis‑je calme ? (échelle 1–10; si < 7, skip)</li>
        <li>Ai‑je dormi 7+ heures ?</li>
        <li>Ai‑je mangé ? (faible glycémie = mauvaises décisions)</li>
        <li>Ce setup vient‑il de mon plan ou de la FOMO ?</li>
        <li>Puis‑je accepter une perte complète sur ce trade ?</li>
      </ul>
      <h3>Template de journal (section psychologique)</h3>
      <ul>
        <li><strong>Émotion avant entrée:</strong> Calme / Anxieux / Excité / Confiant</li>
        <li><strong>Émotion pendant:</strong> Même échelle + noter changements</li>
        <li><strong>Émotion après:</strong> Soulagement / Déception / Fierté / Regret</li>
        <li><strong>L'émotion a‑t‑elle affecté l'exécution ?</strong> Oui/Non + détails</li>
        <li><strong>Action pour la prochaine fois:</strong> Une amélioration spécifique</li>
      </ul>` },
  backtesting: { title: "Stratégies de backtesting", description: "Méthodologie, métriques, validation.", content: `
      <h2>Backtesting</h2>
      <p>Évaluer des règles sur données historiques avec hypothèses réalistes.</p>
      <h3>Processus</h3>
      <ol>
        <li>Règles d'entrée/sortie/gestion précises.</li>
        <li>Données propres; frais/slippage inclus; éviter le biais de regard.</li>
        <li>Segmentation par régimes; métriques: taux de gain, R moyen, DD max, Sharpe.</li>
        <li>Validation hors‑échantillon puis forward test.</li>
      </ol>
      <h3>Exemple détaillé: Stratégie divergence RSI</h3>
      <p><strong>Règles:</strong></p>
      <ul>
        <li>Entrée: Divergence cachée haussière sur H1 quand HTF (D1) hausse, RSI < 45, prix touche EMA 20</li>
        <li>Stop: 25 pips sous entrée (ou sous swing bas précédent)</li>
        <li>Cible: 2R (50 pips) pour 50%, suivi sur EMA 20</li>
        <li>Filtre: Trader seulement sessions Londres/NY, éviter 30 min avant news majeures</li>
      </ul>
      <h4>Résultats backtest (EURUSD, jan 2023–déc 2023)</h4>
      <ul>
        <li><strong>Total trades:</strong> 87</li>
        <li><strong>Gains:</strong> 48 (55,2%)</li>
        <li><strong>Pertes:</strong> 39 (44,8%)</li>
        <li><strong>Gain moyen:</strong> +2,3R</li>
        <li><strong>Perte moyenne:</strong> −1R</li>
        <li><strong>Espérance:</strong> (0,552 × 2,3R) − (0,448 × 1R) = 1,27R − 0,448R = <strong>+0,822R par trade</strong></li>
        <li><strong>Retour total:</strong> +71,5R sur 87 trades</li>
        <li><strong>Drawdown max:</strong> −8,5R (11 pertes consécutives)</li>
        <li><strong>Ratio Sharpe:</strong> 1,42</li>
      </ul>
      <h4>Validation hors‑échantillon (jan 2024–jun 2024)</h4>
      <ul>
        <li><strong>Total trades:</strong> 42</li>
        <li><strong>Espérance:</strong> +0,76R (légèrement inférieure mais acceptable)</li>
        <li><strong>Taux:</strong> 52,4% (similaire)</li>
        <li><strong>Conclusion:</strong> Stratégie robuste; procéder au forward test</li>
      </ul>
      <h3>Erreurs communes</h3>
      <ul>
        <li><strong>Sur‑ajustement:</strong> Optimiser 10 paramètres → 95% taux (irréaliste)</li>
        <li><strong>Solution:</strong> Limiter à 2–3 paramètres, tester sur plusieurs paires/UT</li>
        <li><strong>Ignorer les frais:</strong> Backtest montre +100R, réalité +85R après commissions</li>
        <li><strong>Solution:</strong> Ajouter 0,1% commission + 1 pip slippage par trade</li>
      </ul>` },
  "dca-vs-swing": { title: "DCA vs Swing Trading", description: "Choisir entre DCA (passif) et Swing (actif).", content: `
      <h2>DCA vs Swing</h2>
      <p>DCA pour accumulation passive; Swing pour mouvements multi‑jours avec gestion active du risque.</p>
      <h3>Matrice de décision</h3>
      <ul>
        <li>Peu de temps/expérience → DCA; plus de temps/avantage → Swing.</li>
        <li>Tolérance au risque faible → DCA; plus élevée → Swing avec faible risque.</li>
      </ul>
      <h3>Comparaison réelle: Investissement Bitcoin (2022–2024)</h3>
      <p><strong>Capital initial:</strong> 10 000 $; <strong>Période:</strong> 24 mois; <strong>Gamme prix BTC:</strong> 20k$–65k$</p>
      <h4>Stratégie A: DCA (416,67 $/mois)</h4>
      <ul>
        <li><strong>Méthode:</strong> Acheter 416,67 $ de BTC le 1er de chaque mois, peu importe le prix</li>
        <li><strong>Total investi:</strong> 10 000 $ sur 24 mois</li>
        <li><strong>Prix moyen:</strong> ~35 000 $ (effet lissage)</li>
        <li><strong>Valeur finale (à 60k$):</strong> ~17 140 $</li>
        <li><strong>Retour:</strong> +71,4%</li>
        <li><strong>Temps requis:</strong> 5 min/mois</li>
        <li><strong>Stress:</strong> Faible (automatisé)</li>
      </ul>
      <h4>Stratégie B: Swing Trading (Actif)</h4>
      <ul>
        <li><strong>Méthode:</strong> Entrer sur retours aux supports, sortir à résistances ou cibles 2R</li>
        <li><strong>Risque/trade:</strong> 1% (100 $)</li>
        <li><strong>Trades/mois:</strong> 3–4 en moyenne</li>
        <li><strong>Taux:</strong> 55%, R:R moyen 1:2,5</li>
        <li><strong>Espérance:</strong> +0,937R par trade</li>
        <li><strong>Total trades (24 mois):</strong> 84</li>
        <li><strong>Valeur finale:</strong> ~17 870 $ (avec compounding)</li>
        <li><strong>Retour:</strong> +78,7%</li>
        <li><strong>Drawdown max:</strong> −12% (meilleur contrôle risque)</li>
        <li><strong>Temps requis:</strong> 2–3 heures/semaine</li>
      </ul>
      <h3>Exemple calcul DCA</h3>
      <p><strong>DCA mensuel:</strong> 500 $; <strong>Prix BTC sur 6 mois:</strong> 30k$, 28k$, 32k$, 35k$, 40k$, 38k$</p>
      <ul>
        <li>Mois 1: 500 $ ÷ 30 000 $ = 0,01667 BTC</li>
        <li>Mois 2: 500 $ ÷ 28 000 $ = 0,01786 BTC</li>
        <li>Mois 3: 500 $ ÷ 32 000 $ = 0,01563 BTC</li>
        <li><strong>Total:</strong> 3 000 $ investis, 0,09011 BTC acquis</li>
        <li><strong>Prix moyen:</strong> 3 000 $ ÷ 0,09011 = 33 275 $</li>
        <li><strong>Avantage DCA:</strong> Acheté plus aux bas prix, moins aux hauts prix</li>
      </ul>` },
  timeframes: { title: "Comprendre les unités de temps", description: "Top‑down multi‑UT.", content: `
      <h2>Unités de temps</h2>
      <p>Analyse multi‑UT: l'UT supérieure donne le biais et les niveaux; l'UT intermédiaire affine; l'UT d'exécution déclenche avec risque défini.</p>
      <h3>Cartographie</h3>
      <ul>
        <li>Scalping: HTF H1, MTF M15, LTF M1–M5</li>
        <li>Day: HTF H4/D1, MTF H1, LTF M5–M15</li>
        <li>Swing: HTF D1/W1, MTF H4, LTF H1</li>
      </ul>
      <h3>Exemple réel: Trade multi‑UT EURUSD</h3>
      <p><strong>Date:</strong> 15 mars 2024; <strong>Style:</strong> Day Trading</p>
      <h4>Étape 1: Analyse HTF (D1)</h4>
      <ul>
        <li>Tendance: Forte hausse depuis février</li>
        <li>Niveaux clés: Support à 1,0850, Résistance à 1,0950</li>
        <li>Biais: <strong>HAUSSIER</strong> — chercher uniquement des longs</li>
        <li>Zone d'entrée: 1,0850–1,0870 (zone de support)</li>
      </ul>
      <h4>Étape 2: Analyse MTF (H1)</h4>
      <ul>
        <li>Structure: Prix en retracement vers zone 1,0860</li>
        <li>Indicateurs: RSI à 42, EMA 20 à 1,0865</li>
        <li>Zone: 1,0860–1,0870 est confluence (support D1 + EMA H1)</li>
      </ul>
      <h4>Étape 3: Entrée LTF (M15)</h4>
      <ul>
        <li>Prix atteint 1,0862</li>
        <li>Forme bougie englobante haussière à 09:15 GMT</li>
        <li><strong>Déclencheur:</strong> Long à 1,0865</li>
        <li><strong>Stop:</strong> 1,0850 (15 pips risque)</li>
        <li><strong>Cible 1:</strong> 1,0895 (30 pips = 2R)</li>
        <li><strong>Cible 2:</strong> 1,0920 (55 pips = 3,67R)</li>
      </ul>
      <h4>Exécution & Résultat</h4>
      <ul>
        <li><strong>Taille:</strong> Compte 20 000 $, risque 1% = 200 $. Valeur pip 10 $/lot. Taille = 200 ÷ (15 × 10) = 1,33 lots (arrondi 1,3)</li>
        <li><strong>Entrée:</strong> 1,0865</li>
        <li><strong>Action prix:</strong> Monte, atteint T1 à 1,0895 → Fermer 50% (+390 $)</li>
        <li><strong>Gestion:</strong> Stop à breakeven + 10 pips</li>
        <li><strong>Final:</strong> T2 atteint à 1,0920 → Fermer 50% (+715 $)</li>
        <li><strong>Profit total:</strong> +1 105 $ (5,53R)</li>
        <li><strong>Durée:</strong> 4h20</li>
      </ul>
      <h3>Guide sélection UT</h3>
      <ul>
        <li><strong>Scalping:</strong> HTF H1, MTF M15, LTF M1–M5, durée moyenne 5–30 min</li>
        <li><strong>Day Trading:</strong> HTF H4/D1, MTF H1, LTF M5–M15, durée 1–6h</li>
        <li><strong>Swing:</strong> HTF D1/W1, MTF H4, LTF H1, durée 2–10 jours</li>
      </ul>
      <h3>Erreurs communes</h3>
      <ul>
        <li><strong>Trader LTF contre HTF:</strong> Scalper shorts sur M5 quand D1 est clairement haussier → Taux faible</li>
        <li><strong>Solution:</strong> Toujours vérifier HTF d'abord; trader uniquement dans la direction HTF</li>
      </ul>` },
};

export default function GuidePage() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLang();
  const base = guides.find((g) => g.id === id);
  const local = guidesFr[id || ""];
  const title = lang === "fr" ? local?.title || base?.title : base?.title;
  const content = lang === "fr" ? local?.content || base?.content : base?.content;

  return (
    <Section title={title || "Guide"} subtitle={lang === "fr" ? "Contenu détaillé" : "Detailed content"}>
      <BackButton />
      <div className="prose-custom max-w-3xl mx-auto">
        <div dangerouslySetInnerHTML={{ __html: content || "" }} />
      </div>
    </Section>
  );
}


