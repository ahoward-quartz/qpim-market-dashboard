# Markets Dashboard

A React dashboard displaying scored market data across 5 categories
(Technical, Credit, Valuation, Economy, Behavioral), each with an overall
0-100 score and 3 sub-metric charts. Data is driven entirely by
`public/market-data.csv`.

See [CLAUDE.md](./CLAUDE.md) for the full project spec.

## Tech stack

- Vite + React (JavaScript)
- Tailwind CSS + shadcn/ui
- Recharts for charts
- PapaParse for CSV parsing

## Running locally

```
npm install
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

## Updating the data

Edit `public/market-data.csv` and reload the page — no rebuild needed in
dev. See CLAUDE.md's Data Model section for the CSV's `dataset`/`label`/
`value`/`category` schema.
