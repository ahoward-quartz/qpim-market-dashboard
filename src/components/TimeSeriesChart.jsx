import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// Matches the reference PDF's compact gray area charts — the fill isn't
// score-colored, only the card header/trend text is.
const AREA_COLOR = "#9CA3AF"

const formatMonthYear = (ms) =>
  new Date(ms).toLocaleDateString("en-US", { month: "short", year: "numeric" })

export function TimeSeriesChart({ chartData }) {
  const data = chartData.map((point) => ({
    date: point.date.getTime(),
    value: point.value,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="date"
          type="number"
          domain={["dataMin", "dataMax"]}
          tickFormatter={formatMonthYear}
          tick={{ fontSize: 9 }}
        />
        <YAxis tick={{ fontSize: 9 }} width={32} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={AREA_COLOR}
          strokeWidth={1.5}
          fill={AREA_COLOR}
          fillOpacity={0.35}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
