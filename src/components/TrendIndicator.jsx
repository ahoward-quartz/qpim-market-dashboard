import { cn } from "@/lib/utils"

// Trend colors reuse the two most saturated ends of CLAUDE.md's score-band
// palette (Excellent green / Poor red) so trend and score use one palette.
const TREND_STYLES = {
  Improving: { arrow: "↑", hex: "#006D1E" },
  Weakening: { arrow: "↓", hex: "#BE0000" },
  "No Change": { arrow: "↔", hex: undefined }, // falls back to muted-foreground
}

export function TrendIndicator({ trend, className }) {
  if (!trend) return null
  const style = TREND_STYLES[trend] ?? TREND_STYLES["No Change"]

  return (
    <p
      className={cn(
        "text-sm font-medium",
        !style.hex && "text-muted-foreground",
        className
      )}
      style={style.hex ? { color: style.hex } : undefined}
    >
      {style.arrow} {trend}
    </p>
  )
}
