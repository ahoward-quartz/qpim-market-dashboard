// Score color bands from CLAUDE.md, applied to every score (top-level and sub-chart).
const SCORE_BANDS = [
  { max: 20, label: "Poor", hex: "#BE0000" },
  { max: 40, label: "Caution", hex: "#CC3800" },
  { max: 60, label: "Normal", hex: "#CDA600" },
  { max: 80, label: "Positive", hex: "#50AE10" },
  { max: 100, label: "Excellent", hex: "#006D1E" },
]

export function getScoreBand(score) {
  return SCORE_BANDS.find((band) => score <= band.max) ?? SCORE_BANDS[SCORE_BANDS.length - 1]
}

export function getScoreColor(score) {
  return getScoreBand(score).hex
}

// The neutral gray used for the donut chart's "remaining" track, reused
// elsewhere (e.g. the summary card header) so both stay a single shade.
export const NEUTRAL_GRAY = "#E5E4E7"
