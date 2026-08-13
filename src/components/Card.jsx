import { Card as CardPrimitive } from "@/components/ui/card"
import { ScoreDonutChart } from "@/components/ScoreDonutChart"
import { TimeSeriesChart } from "@/components/TimeSeriesChart"
import { TrendIcon, TrendIndicator } from "@/components/TrendIndicator"
import { getScoreBand } from "@/lib/scoreColor"

// The reusable Card from CLAUDE.md's component spec (title, score,
// hexColor, chartData), extended with subtitle/trend since the reference
// PDF shows both. Renders in one of two modes:
//   - chartData present -> a detail card: colored header bar, subtitle,
//     time-series chart, trend line (the 15 sub-metric cards).
//   - chartData absent -> a summary card: title, score donut gauge, band
//     label, trend line (the 5 category cards).
export function Card({
  title,
  score,
  hexColor,
  chartData,
  subtitle,
  trend,
  dateRangeLabel,
  latestValueLabel,
  latestDateLabel,
  sectionId,
}) {
  const isDetailCard = Array.isArray(chartData) && chartData.length > 0

  if (isDetailCard) {
    return (
      <CardPrimitive className="gap-0 overflow-hidden py-0">
        <div
          className="flex items-center justify-between gap-2 px-4 py-2"
          style={{ backgroundColor: hexColor }}
        >
          <h3 className="font-semibold text-white">{title}</h3>
          <TrendIcon trend={trend} />
        </div>
        <div className="flex flex-col gap-2 p-4">
          {latestValueLabel && latestDateLabel && (
            <div className="grid grid-cols-3 divide-x rounded-md border text-center">
              <div className="px-2 py-1.5">
                <p className="text-xs text-foreground">Current Reading</p>
              </div>
              <div className="px-2 py-1.5">
                <p className="text-xs text-foreground">{latestValueLabel}</p>
              </div>
              <div className="px-2 py-1.5">
                <p className="text-xs text-foreground">{latestDateLabel}</p>
              </div>
            </div>
          )}
          {subtitle && (
            <p className="py-1.25 text-sm font-bold text-muted-foreground">
              {subtitle}
            </p>
          )}
          <div className="h-40">
            <TimeSeriesChart chartData={chartData} />
          </div>
          {dateRangeLabel && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{dateRangeLabel}</p>
            </div>
          )}
        </div>
      </CardPrimitive>
    )
  }

  const band = getScoreBand(score)

  const summaryCard = (
    <CardPrimitive className="items-center gap-2 py-6 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ScoreDonutChart score={score} hexColor={hexColor} />
      <p className="font-medium" style={{ color: hexColor }}>
        {band.label}
      </p>
      <TrendIndicator trend={trend} />
    </CardPrimitive>
  )

  if (!sectionId) return summaryCard

  return (
    <a href={`#${sectionId}`} title="See Score Details" className="block">
      {summaryCard}
    </a>
  )
}
