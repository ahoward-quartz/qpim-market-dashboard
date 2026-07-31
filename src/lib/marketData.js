import Papa from "papaparse"
import { getScoreColor } from "@/lib/scoreColor"

// Top-level category display order (explicit, per project owner).
export const CATEGORY_ORDER = [
  "technical",
  "credit",
  "valuation",
  "economy",
  "behavioral",
]

// Each category's 3 sub-metric keys, in display order. Keys match the
// "chart_<key>" / "info_<key>" dataset prefixes in market-data.csv.
export const CATEGORY_SUBMETRICS = {
  technical: ["momentum", "breadth", "volatility"],
  credit: ["highyield", "fincond", "monsupply"],
  valuation: ["ev", "ps", "pe"],
  economy: ["gdp", "inflation", "activity"],
  behavioral: ["barometer", "preference", "aeo"],
}

const CSV_URL = "/market-data.csv"

// Fetches and parses market-data.csv, then groups its rows by their
// "dataset" value (e.g. all "chart_volatility" rows together, all
// "info_volatility" rows together). Every other helper in this file reads
// from that grouped map rather than re-parsing the CSV.
async function loadDatasetMap() {
  const response = await fetch(CSV_URL)
  const csvText = await response.text()
  const { data: rows } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  })

  const datasetMap = new Map()
  for (const row of rows) {
    const list = datasetMap.get(row.dataset) ?? []
    list.push(row)
    datasetMap.set(row.dataset, list)
  }
  return datasetMap
}

// "info_<key>" rows are laid out as one row per field (label = field name,
// value = field value). This turns that list of rows into a plain object,
// e.g. { ChartLabel: "Volatility", CurrentScore: "42", ... }.
function parseInfoRows(rows = []) {
  const info = {}
  for (const row of rows) {
    info[row.label] = row.value
  }
  return info
}

// "chart_<key>" rows are one row per date/value point. This turns them into
// a sorted array of { date, value } ready for a chart.
function parseChartRows(rows = []) {
  return rows
    .map((row) => ({ date: new Date(row.label), value: Number(row.value) }))
    .sort((a, b) => a.date - b.date)
}

// The generic "pass a key like volatility" filter: looks up "info_<key>"
// and "chart_<key>" in the dataset map and returns a normalized object
// ready for the Card component.
function buildSubMetric(key, datasetMap) {
  const info = parseInfoRows(datasetMap.get(`info_${key}`))
  const score = Number(info.CurrentScore)
  return {
    key,
    title: info.ChartLabel,
    subtitle: info.ChartMetric,
    score,
    hexColor: getScoreColor(score),
    trend: info.OneYearTrend,
    asOfDate: info.AsOfDate,
    currentValue: Number(info.CurrentValue),
    chartData: parseChartRows(datasetMap.get(`chart_${key}`)),
  }
}

// Category summary rows (category="summary" in the CSV) only ever have
// "info_<categoryKey>" rows — there's no matching chart, just an overall
// score — so this has no chartData/subtitle/currentValue.
function buildCategorySummary(categoryKey, datasetMap) {
  const info = parseInfoRows(datasetMap.get(`info_${categoryKey}`))
  const score = Number(info.CurrentScore)
  return {
    key: categoryKey,
    title: info.ChartLabel,
    score,
    hexColor: getScoreColor(score),
    trend: info.OneYearTrend,
    asOfDate: info.AsOfDate,
  }
}

// Loads market-data.csv and assembles it into the full shape the dashboard
// renders from: one summary + 3 sub-metrics per category, in display order.
export async function loadMarketData() {
  const datasetMap = await loadDatasetMap()

  return CATEGORY_ORDER.map((categoryKey) => ({
    ...buildCategorySummary(categoryKey, datasetMap),
    subMetrics: CATEGORY_SUBMETRICS[categoryKey].map((subMetricKey) =>
      buildSubMetric(subMetricKey, datasetMap)
    ),
  }))
}
