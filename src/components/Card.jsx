import { useState } from "react"
import { X } from "lucide-react"
import { Card as CardPrimitive } from "@/components/ui/card"
import { FlipCard } from "@/components/FlipCard"
import { ScoreDonutChart } from "@/components/ScoreDonutChart"
import { TimeSeriesChart } from "@/components/TimeSeriesChart"
import { TrendIcon, TrendIndicator } from "@/components/TrendIndicator"
import { getScoreBand, NEUTRAL_GRAY } from "@/lib/scoreColor"

const DARK_HEADER_COLOR = "#333"

// The reusable Card from CLAUDE.md's component spec (title, score,
// hexColor, chartData), extended with subtitle/trend since the reference
// PDF shows both. Renders in one of two modes:
//   - chartData present -> a detail card: colored header bar, subtitle,
//     time-series chart, trend line, and a flip-to-reveal "About" back
//     face with the chart's description/interpretation/source (the 15
//     sub-metric cards).
//   - chartData absent -> a summary card: dark header bar with the title,
//     score donut gauge, band label, trend line (the 5 category cards).
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
  description,
  interpretation,
  source,
  sectionId,
}) {
  const isDetailCard = Array.isArray(chartData) && chartData.length > 0
  const band = getScoreBand(score)
  const [flipped, setFlipped] = useState(false)

  if (isDetailCard) {
    const front = (
      <CardPrimitive className="gap-0 overflow-hidden py-0">
        <div
          className="flex items-center justify-between gap-2 px-4 py-2"
          style={{ backgroundColor: hexColor }}
        >
          <h3 className="font-bold text-white">{title}</h3>
          <TrendIcon trend={trend} />
        </div>
        <div className="flex flex-col gap-2 p-4">
          {latestValueLabel && latestDateLabel && (
            <div className="grid grid-cols-3 divide-x rounded-md border text-center">
              <div className="flex flex-col gap-1 px-2 py-1.5">
                <p className="text-xs font-bold text-[#333]">Current Score</p>
                <p className="text-xs text-[#333]">{band.label}</p>
              </div>
              <div className="flex flex-col gap-1 px-2 py-1.5">
                <p className="text-xs font-bold text-[#333]">Current Reading</p>
                <p className="text-xs text-[#333]">{latestValueLabel}</p>
              </div>
              <div className="flex flex-col gap-1 px-2 py-1.5">
                <p className="text-xs font-bold text-[#333]">As Of Date</p>
                <p className="text-xs text-[#333]">{latestDateLabel}</p>
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
          <div className="flex items-center justify-between">
            {dateRangeLabel ? (
              <p className="text-xs text-muted-foreground">{dateRangeLabel}</p>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={() => setFlipped(true)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              &gt; About
            </button>
          </div>
        </div>
      </CardPrimitive>
    )

    const back = (
      <CardPrimitive className="gap-0 overflow-hidden py-0">
        <div
          className="flex items-center justify-between gap-2 px-4 py-2"
          style={{ backgroundColor: DARK_HEADER_COLOR }}
        >
          <h3 className="font-bold text-white">{title}</h3>
          <button type="button" onClick={() => setFlipped(false)} title="Close" className="text-white">
            <X size={23} strokeWidth={2} />
          </button>
        </div>
        <div className="flex flex-col gap-3 p-4">
          {description && (
            <div>
              <p className="text-xs font-bold text-[#333]">Description</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          )}
          {interpretation && (
            <div>
              <p className="text-xs font-bold text-[#333]">Interpretation</p>
              <p className="text-sm text-muted-foreground">{interpretation}</p>
            </div>
          )}
          {source && (
            <div>
              <p className="text-xs font-bold text-[#333]">Source</p>
              <p className="text-sm text-muted-foreground">{source}</p>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              &gt; Close
            </button>
          </div>
        </div>
      </CardPrimitive>
    )

    return <FlipCard flipped={flipped} front={front} back={back} />
  }

  const summaryCard = (
    <CardPrimitive className="gap-0 overflow-hidden py-0">
      <div className="px-4 py-2" style={{ backgroundColor: NEUTRAL_GRAY }}>
        <h3 className="text-center font-bold text-[#333]">{title}</h3>
      </div>
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <ScoreDonutChart score={score} hexColor={hexColor} />
        <p className="font-normal" style={{ color: hexColor }}>
          {band.label}
        </p>
        <TrendIndicator trend={trend} />
      </div>
    </CardPrimitive>
  )

  if (!sectionId) return summaryCard

  return (
    <a href={`#${sectionId}`} title="See Score Details" className="block">
      {summaryCard}
    </a>
  )
}
