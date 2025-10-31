# Trading Education

A professional trading education and media platform built with Next.js 14, TypeScript, and TailwindCSS. This platform provides free educational content, trading tools, and market analysis without relying on private APIs.

## Features

- 🎓 **Educational Guides**: Comprehensive trading guides covering RSI, Money Management, Leverage, Ichimoku, and more
- 🛠️ **Free Trading Tools**: 4 local calculators (Position Size, Risk/Reward, Pips Converter, Market Hours)
- 📊 **Real-time Widgets**: TradingView charts, screener, heatmap, economic calendar, and CoinMarketCap widgets
- 🌙 **Dark Mode**: Full dark mode support with persistent preferences
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- ♿ **Accessible**: WCAG AA compliant with proper ARIA labels and keyboard navigation
- 🔍 **SEO Optimized**: Meta tags, Open Graph, JSON-LD structured data
- 💰 **AdSense Ready**: Pre-configured ad slots (scripts commented out)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Widgets**: TradingView (official embeds), CoinMarketCap (official embeds)
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Trading-Education1
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /layout.tsx              # Root layout with SEO metadata
  /page.tsx                # Homepage
  /guides/page.tsx         # Trading guides
  /outils/page.tsx         # Tools overview
  /outils/*/page.tsx       # Individual tool pages
  /recap/page.tsx          # Signals recap
  /ressources/page.tsx     # Resources
  /a-propos/page.tsx       # About page
  /mentions-legales/page.tsx
  /politiques/page.tsx

/components
  /Header.tsx              # Sticky header with dark mode toggle
  /Footer.tsx              # Footer with links
  /Nav.tsx                 # Navigation component
  /AdSlot.tsx              # AdSense placeholder component
  /Card.tsx                # Reusable card component
  /Section.tsx             # Section wrapper with variants
  /Hero.tsx                # Hero section with gradient
  /FAQ.tsx                 # FAQ accordion component

/widgets
  /TradingViewChart.tsx
  /TradingViewTickerTape.tsx
  /TradingViewScreener.tsx
  /TradingViewHeatmap.tsx
  /TradingViewEconCalendar.tsx
  /CMCPriceWidget.tsx
  /CMCHeatmapWidget.tsx
  /CMCConverterWidget.tsx

/outils
  /calculatrice-taille-position.tsx
  /calculateur-risk-reward.tsx
  /convertisseur-pips.tsx
  /horaires-marches.tsx
```

## Widget Configuration

### TradingView Widgets

All TradingView widgets use official embed scripts and are lazy-loaded on component mount. You can customize symbols by passing props:

```tsx
<TradingViewChart symbol="BINANCE:BTCUSDT" interval="D" theme="dark" />
<TradingViewTickerTape symbols={[...]} />
```

### CoinMarketCap Widgets

CoinMarketCap widgets use official embed methods. Customize via props:

```tsx
<CMCPriceWidget symbols={["BTC", "ETH"]} currency="USD" />
```

## Customization

### Changing Default Symbols

Edit widget props in:
- `app/page.tsx` - Homepage widgets
- `app/recap/page.tsx` - Chart symbols in signals recap

### Theme Colors

Edit `tailwind.config.ts` to customize brand colors:

```ts
colors: {
  brand: {
    primary: "#4F46E5",
    secondary: "#06B6D4",
    // ...
  }
}
```

### AdSense Integration

To enable AdSense:

1. Get your AdSense Publisher ID
2. Edit `components/AdSlot.tsx`
3. Uncomment the script and ins tags
4. Replace `ca-pub-XXXXXXXXXXXXXXXX` with your Publisher ID
5. Replace `data-ad-slot="XXXXXXXXXX"` with your ad slot IDs

## Building for Production

```bash
pnpm build
pnpm start
```

## SEO & Metadata

- Default metadata in `app/layout.tsx`
- Page-specific metadata using Next.js Metadata API
- JSON-LD structured data for WebSite schema
- Open Graph tags for social sharing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is provided for educational purposes.

## Disclaimer

**Important**: This website provides educational content only. Trading involves substantial risk of loss. Always conduct your own research and consult with a financial advisor before making trading decisions.

## Contributing

Contributions are welcome! Please ensure:
- Code follows TypeScript best practices
- Components are accessible (WCAG AA)
- No API keys or private endpoints
- Widgets use official embeds only

---

Built with ❤️ by Trading Education

