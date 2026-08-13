import { Cell, Pie, PieChart } from "recharts"

const REMAINING_TRACK_COLOR = "#E5E4E7"

// The donut chart (2 slices: "Score" filled with the band color, and
// "Remaining" as a light gray track for 100 - score) plus the score number
// overlaid in its center. Used by the category summary cards.
export function ScoreDonutChart({ score, hexColor, size = 112 }) {
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ]
  const outerRadius = size / 2
  const innerRadius = outerRadius * 0.78

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/*
        Recharts sets an inline `cursor: default` on its wrapper div, which
        beats the `cursor: pointer` inherited from the summary card's <a>
        ancestor — the `!` forces this cursor-pointer utility to
        !important so it wins over that inline style.
      */}
      <PieChart width={size} height={size} className="cursor-pointer!">
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          // Start at 12 o'clock and sweep clockwise through a full circle.
          startAngle={90}
          endAngle={-270}
          stroke="none"
        >
          <Cell fill={hexColor} />
          <Cell fill={REMAINING_TRACK_COLOR} />
        </Pie>
      </PieChart>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-3xl font-bold">
        {score}
      </div>
    </div>
  )
}
