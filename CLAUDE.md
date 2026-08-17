# Markets Dashboard Project

## Overview
A React dashboard app that displays scored market data across 5 categories, each with an overall 0-100 score and 3 sub-charts. Data is driven entirely by a single CSV file. Deployed standalone (Vercel/Netlify) and embedded into a WordPress site via iframe.

## Tech Stack
- Vite + React (JavaScript, not TypeScript)
- Tailwind CSS
- shadcn/ui for components (https://ui.shadcn.com/docs/components)
- Recharts for charts (https://recharts.org/) — npm-installed. (Originally
  AnyChart v8 via CDN script tag, but AnyChart requires a paid license to
  remove its trial watermark, so we switched to the free, npm-native
  Recharts — a natural fit since shadcn/ui's own chart components are
  built on it too.)
- PapaParse for CSV parsing

## Data Model
All data comes from a single CSV file in the project directory. It must
supply, per category:
- Overall category score (0-100)
- Three sub-metrics, each with its own score (0-100), title, and time
  series data for its chart

Five categories, in this display order (explicit order + sub-metric labels
per project owner; the CSV's `ChartLabel` field is the source of truth —
these mirror it):
1. **Technical** — Momentum, Breadth, Volatility
2. **Credit** — High-Yield Spread, Financial Conditions, Money Supply
3. **Valuation** — Enterprise Valuation, Revenue Valuation, Earnings Valuation
4. **Economy** — GDP Growth, Inflation, Activity
5. **Behavioral** — Market Barometer, Preference, Market Type

Category → sub-metric key mapping and ordering is defined in
`CATEGORY_ORDER` / `CATEGORY_SUBMETRICS` in `src/lib/marketData.js`.

## Score Color Bands (apply to every score, top-level and sub-chart)
| Band      | Range   | Hex       |
|-----------|---------|-----------|
| Poor      | 0-20    | #BE0000   |
| Caution   | 21-40   | #CC3800   |
| Normal    | 41-60   | #CDA600   |
| Positive  | 61-80   | #50AE10   |
| Excellent | 81-100  | #006D1E   |

## Typography
Lato everywhere (app UI and chart text), self-hosted via `@fontsource/lato`
(https://fonts.google.com/specimen/Lato) — imported in `main.jsx`, set as
`--font-sans` in `index.css`. Only Regular (400) and Bold (700) are
loaded, since that's all the app uses and Lato has no 500/600 cut:
`font-medium`/`font-semibold` utilities render at their nearest loaded
weight anyway (500→400, 600→700 per the browser's font-matching), so use
`font-normal`/`font-bold` directly instead for clarity.

## Component Requirements
- A reusable Card component wrapping each chart, accepting props: title, score, hexColor, chartData
- Top section: 5 summary score cards (one per category)
- Below: 5 category sections, each containing 3 chart cards
- Fully responsive: max-width 1200px on desktop, stacks to single column on smaller screens

## Deployment Target
Standalone app hosted on Vercel or Netlify, embedded into WordPress via iframe (not a native WP plugin/shortcode integration).

## Conventions
- Prefer function components with hooks
- Keep chart config logic separate from layout/presentation components
- Author is comfortable with JS but new to React fundamentals, shadcn/ui, and Recharts specifically — favor clear, well-commented setup code for those two integrations

## shadcn/ui: adding components manually
This environment's npm blocks the `--allow-scripts` flag that `npx shadcn add
<component>` relies on internally, so the CLI's install step always fails
here — even though none of shadcn's dependencies actually need install
scripts. Add components by hand instead:

1. Fetch the component's registry JSON directly (style is pinned to
   `new-york`, the classic Radix-based style — not the newer `nova`/Base UI
   preset):
   `curl https://ui.shadcn.com/r/styles/new-york-v4/<component>.json`
2. Port the returned `.tsx` content to plain `.jsx`: drop TypeScript-only
   syntax (interfaces, `type` imports, generic type params like
   `VariantProps<...>`, typed `React.forwardRef<...>`, `React.ComponentProps<"button">`
   annotations) but keep the logic and Tailwind classes as-is.
3. Save under the path implied by `components.json`'s aliases (e.g. UI
   primitives go in `src/components/ui/`, matching `@/components/ui`).
4. If the registry JSON lists new npm `dependencies`, install them with a
   plain `npm install <pkg>` (no CLI) — manual installs work fine, only the
   shadcn CLI's own flag is blocked.

`src/components/ui/button.jsx` is a worked example of this pattern.