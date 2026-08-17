import { CircleArrowDown, CircleArrowRight, CircleArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

// Trend colors reuse the two most saturated ends of CLAUDE.md's score-band
// palette (Excellent green / Poor red) so trend and score use one palette.
const TREND_STYLES = {
  Improving: {
    hex: "#006D1E",
    Icon: CircleArrowUp,
    tooltipLabel: "Improving One Year Trend",
  },
  Weakening: {
    hex: "#BE0000",
    Icon: CircleArrowDown,
    tooltipLabel: "Weakening One Year Trend",
  },
  "No Change": {
    hex: undefined, // falls back to muted-foreground
    Icon: CircleArrowRight,
    tooltipLabel: "Flat One Year Trend",
  },
}

// Icon + text trend line used by the category summary cards.
export function TrendIndicator({ trend, className }) {
  if (!trend) return null
  const style = TREND_STYLES[trend] ?? TREND_STYLES["No Change"]
  const Icon = style.Icon

  return (
    <p
      className={cn(
        "flex items-center justify-center gap-1 text-sm font-normal",
        !style.hex && "text-muted-foreground",
        className
      )}
      style={style.hex ? { color: style.hex } : undefined}
    >
      <Icon size={16} strokeWidth={2} aria-hidden="true" />
      {trend}
    </p>
  )
}

// Icon-only trend indicator for the sub-metric detail cards' colored
// header — white to match the header's title text, with the trend label
// shown as a native tooltip on hover.
export function TrendIcon({ trend, className }) {
  if (!trend) return null
  const style = TREND_STYLES[trend] ?? TREND_STYLES["No Change"]
  const Icon = style.Icon

  return (
    <span
      title={style.tooltipLabel}
      className={cn("inline-flex shrink-0 text-white", className)}
    >
      <Icon size={23} strokeWidth={2} aria-hidden="true" />
    </span>
  )
}
