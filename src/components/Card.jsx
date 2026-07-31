import { Card as CardPrimitive } from "@/components/ui/card"
import { ScoreDonutChart } from "@/components/ScoreDonutChart"
import { TimeSeriesChart } from "@/components/TimeSeriesChart"
import { TrendIndicator } from "@/components/TrendIndicator"
import { getScoreBand } from "@/lib/scoreColor"

// The reusable Card from CLAUDE.md's component spec (title, score,
// hexColor, chartData), extended with subtitle/trend since the reference
// PDF shows both. Renders in one of two modes:
//   - chartData present -> a detail card: colored header bar, subtitle,
//     time-series chart, trend line (the 15 sub-metric cards).
//   - chartData absent -> a summary card: title, score donut gauge, band
//     label, trend line (the 5 category cards).
export function Card({ title, score, hexColor, chartData, subtitle, trend }) {
  const isDetailCard = Array.isArray(chartData) && chartData.length > 0

  if (isDetailCard) {
    return (
      <CardPrimitive className="gap-0 overflow-hidden py-0">
        <div className="px-4 py-2" style={{ backgroundColor: hexColor }}>
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <div className="flex flex-col gap-2 p-4">
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          <div className="h-40">
            <TimeSeriesChart chartData={chartData} />
          </div>
          <TrendIndicator trend={trend} />
        </div>
      </CardPrimitive>
    )
  }

  const band = getScoreBand(score)

  return (
    <CardPrimitive className="items-center gap-2 py-6 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ScoreDonutChart score={score} hexColor={hexColor} />
      <p className="font-medium" style={{ color: hexColor }}>
        {band.label}
      </p>
      <TrendIndicator trend={trend} />
    </CardPrimitive>
  )
}
