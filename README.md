# Trading Education

A professional trading education and media platform built with Next.js 14, TypeScript, and TailwindCSS. This platform provides free educational content, trading tools, market analysis, downloadable reports and live webinars — with no paywall and no banking data.

## What's inside

| Area | Routes |
|---|---|
| Educational guides (existing) | `/guides`, `/guides/[id]` |
| Free trading tools (existing) | `/outils/*` |
| **Long-form analyses** | `/analyses`, `/analyses/[slug]` |
| **Weekly PDF reports** | `/rapports`, `/rapports/[slug]` |
| **Webinars + replays** | `/webinaires`, `/webinaires/[slug]` |
| **Accounts** | `/inscription`, `/connexion`, `/mot-de-passe-oublie`, `/reinitialiser-mot-de-passe` |
| **Member area** | `/espace-membre`, `/espace-membre/preferences` (downloads history, email preferences, GDPR export & deletion) |
| **Admin** | `/admin` (stats), `/admin/articles`, `/admin/rapports`, `/admin/webinaires`, `/admin/abonnes` (+ CSV export), `/admin/commentaires`, `/admin/emails` — rôles `ADMIN` (tout) et `EDITOR` (contenus + modération) |
| **Compliance** | `/confidentialite`, cookie consent banner |
| **SEO** | dynamic `/sitemap.xml` (index par langue), `/sitemaps/{lang}/sitemap.xml` (avec `hreflang`), `/robots.txt`, `/feed.xml`, `opengraph-image` générée, JSON-LD `Organization` / `WebSite` / `BreadcrumbList` / `Article` / `Event` |
| **Multilingual URLs** | public pages under `/{locale}/...` (fr, en, es, de, it, hi, ar, ru) with reciprocal `hreflang` + `x-default`; legacy URLs 308-redirect to the localized version; private/transactional paths stay un-prefixed |
| **8 UI languages** | fr, en, es, de, it, hi, ar (RTL), ru — selector in the header, `te_lang` cookie |

## Features

- 🎓 **Educational Guides**: Comprehensive trading guides covering RSI, Money Management, Leverage, Ichimoku, and more
- 🛠️ **Free Trading Tools**: 4 local calculators (Position Size, Risk/Reward, Pips Converter, Market Hours)
- 📊 **Real-time Widgets**: TradingView charts, screener, heatmap, economic calendar, and CoinMarketCap widgets
- 📰 **Articles & weekly PDF reports**: full CRUD from the admin, tracked downloads, email alerts
- 🎥 **Webinars**: free registration (Zoom / Google Meet link), automatic confirmation + 24 h reminder, replay links
- 👤 **Free memberships**: email + password accounts (NextAuth), user menu in the header (member area, email preferences, admin, sign out), show/hide password toggle on every password field, commenting, email preferences, GDPR export/deletion
- ✉️ **Transactional emails & newsletter**: welcome, newsletter double opt-in, webinar confirmation/reminder, new report, weekly digest, bulk campaigns
- 📈 **Analytics**: page views, downloads, signups and visitor→signup conversion (first-party, consent-based, salted IP hashes)
- 🌙 **Theme menu**: **light by default**, then Light / Dark / System (the System option follows the OS preference live) — a menu, so the theme only changes when you pick an option; stored in `localStorage`, applied before first paint (no flash)
- 🌍 **8 languages**: French, English, Spanish, German, Italian, Hindi, Arabic (RTL) and Russian — header selector, cookie-based, translated dictionaries in `lib/i18n/dict`
- 📱 **Responsive Design**: Mobile-first layout (1 → 2 → 3/4 column cards), single-line desktop header (brand left, navigation centered, account/language/theme right) with a compact menu below `lg`, scrollable tables, adaptive market widgets, `viewport`/`themeColor` metadata
- ♿ **Accessible**: ARIA labels, visible focus rings, keyboard navigation, zoom allowed, reduced-motion respected
- 🔍 **SEO Optimized**: Metadata per page, Open Graph, JSON-LD structured data, dynamic sitemap
- 💰 **AdSense Ready**: Pre-configured ad slots (scripts commented out)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL + Prisma 6
- **Auth**: NextAuth v4 (JWT) + Prisma adapter, bcryptjs
- **Emails**: Resend HTTP API (no SDK, dev-mode logging when no API key)
- **Validation**: Zod
- **Widgets**: TradingView & CoinMarketCap official embeds

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (local via `docker compose up -d`, service Coolify or Supabase)

### Installation

```bash
# 1. Install dependencies (runs `prisma generate`)
npm install

# 2. Start a local PostgreSQL (port 5433, identical to the Coolify service)
docker compose up -d

# 3. Environment variables
cp .env.example .env    # then fill DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY…

# 4. Database schema + initial data (admin account, categories, demo content)
npm run db:push         # or `npm run db:migrate -- --name init` during development
npm run db:seed

# 5. Import the historical guides into the database (idempotent)
npm run db:import-guides

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin account created by the
seed uses `ADMIN_EMAIL` / `ADMIN_PASSWORD` (defaults in `.env.example`).

### Useful scripts

| Script | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Next.js dev / production build / production server |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:migrate` / `db:deploy` | Create a migration (dev) / apply migrations (prod) |
| `npm run db:push` | Push the schema without migration history |
| `npm run db:seed` | Seed the admin, categories, tags and demo content |
| `npm run db:import-guides` | Import/update the 10 historical guides into the `Article` table (idempotent) |
| `npm run check:env` | Diagnostic d'environnement : variables obligatoires (dont `NEXTAUTH_SECRET`), connexion PostgreSQL, schéma, administrateur et contenus — en local ou sur une base distante via `DATABASE_URL` |
| `npm run db:studio` | Prisma Studio (visual data browser) |
| `npm run test:i18n -- http://localhost:3000` | E2E check of the 8 languages: `<html lang/dir>`, translated markers on `/`, `/analyses`, `/rapports`, `/webinaires`, `/inscription` |
| `npm run test:seo -- http://localhost:3000` | SEO technique : robots, flux RSS, JSON-LD (Organization/WebSite/Breadcrumb/Article), canonical, `noindex` des filtres, image Open Graph, sitemaps par langue |
| `npm run test:auth -- http://localhost:3000` | Connexion réelle (NextAuth) : bouton « afficher le mot de passe » sur connexion/inscription, menu utilisateur dans l'en-tête après connexion (et retrait du bouton « Connexion ») |
| `npm run test:account -- http://localhost:3000` | Cycle de vie du compte : suspension (`User.suspendedAt`, emails coupés), réactivation (manuelle et automatique à la reconnexion), suppression définitive via l'API |
| `npm run test:css -- --file .next/static/css/<hash>.css` | Checks the built CSS for breakpoints, logical (RTL) utilities and anti-overflow rules |

## Homepage architecture (card-based)

The homepage is composed of **homogeneous cards** (`components/home/FeatureCard.tsx`),
with consistent section headers (`components/home/SectionHeading.tsx`):

| # | Block | Source | Rendered by |
|---|---|---|---|
| 1 | Compact hero band (title + tagline only — no buttons, actions are in the cards) | — | `components/Hero.tsx` (client) |
| 2 | Counters (analyses, guides, reports, webinars, tools) | PostgreSQL | `components/home/HomeStats.tsx` (**server**) |
| 3 | Platform features — 8 cards (analysis, reports, webinars, guides, tools, recap, resources, member area) | — | `HomeClient` |
| 4 | Latest publications (3 analyses + last report + next webinar + guides) | PostgreSQL | `components/LatestContent.tsx` (**server**) |
| 5 | Live market (quote tape + chart, screener, heatmap cards + editorial text) | TradingView / CMC | `HomeClient` + `widgets/*` |
| 6 | Free tools (4 cards) | — | `HomeClient` |
| 7 | Popular guides (4 cards) | — | `HomeClient` |
| 8 | Partner platforms (5 cards, from `lib/partners.ts`) | — | `HomeClient` |
| 9 | Transparency cards (no paywall, no banking data, GDPR) + final CTA | — | `HomeClient` |

Server blocks are passed as slots from `app/page.tsx`:
`<HomeClient stats={<HomeStats />} editorial={<LatestContent />} />` — the HTML is
server-rendered (SEO + AdSense editorial content) while widgets stay interactive.
AdSense slots are preserved (banner + rectangle).

## Partner platforms

Partner sites (signals, broker & prop-firm comparator, converters, learning) are declared
in a **single source of truth**: [`lib/partners.ts`](lib/partners.ts).

They are rendered automatically on:
- `/ressources` (partner cards with bilingual descriptions and badges),
- the homepage (partner CTA block, server-passed into `HomeClient`),
- the promo popup (`components/PromoPopup.tsx`),
- `/recap` (partner cards).

To add, remove or edit a partner, change `lib/partners.ts` only — no component edit needed.
Crypto Signals X has been removed from the partner list.

## Documentation

- [`docs/PLAN-IMPLEMENTATION.md`](docs/PLAN-IMPLEMENTATION.md) — step-by-step plan, routes/API, UI components, roadmap
- [`docs/BASE-DE-DONNEES.md`](docs/BASE-DE-DONNEES.md) — database schema, enums, migrations, seeding, backups
- [`docs/EXPLOITATION.md`](docs/EXPLOITATION.md) — environment variables, daily operations, deployment, troubleshooting

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

