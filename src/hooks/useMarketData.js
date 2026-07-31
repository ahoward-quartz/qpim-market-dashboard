import { useEffect, useState } from "react"
import { loadMarketData } from "@/lib/marketData"

// Loads and parses market-data.csv once on mount. Returns the 5 categories
// (each with its summary + 3 sub-metrics) once ready.
export function useMarketData() {
  const [categories, setCategories] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    loadMarketData()
      .then((data) => {
        if (!cancelled) setCategories(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { categories, error, loading: !categories && !error }
}
