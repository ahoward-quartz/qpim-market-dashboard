import { useMarketData } from "@/hooks/useMarketData"
import { Card } from "@/components/Card"
import { CategorySection } from "@/components/CategorySection"

function App() {
  const { categories, error, loading } = useMarketData()

  if (loading) return <p className="p-8 text-center">Loading market data...</p>
  if (error) {
    return (
      <p className="p-8 text-center text-red-600">
        Failed to load market data: {error.message}
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-300 px-4 py-8">
        <h2 className="mb-4 border-b pb-2 text-xl font-bold">Summary</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(({ key, subMetrics, ...summary }) => (
            <Card key={key} sectionId={key} {...summary} />
          ))}
        </div>

        {categories.map((category) => (
          <CategorySection
            key={category.key}
            id={category.key}
            label={category.title}
            subMetrics={category.subMetrics}
          />
        ))}
      </div>
    </div>
  )
}

export default App
