import { Card } from "@/components/Card"

export function CategorySection({ label, subMetrics }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 border-b pb-2 text-xl font-semibold">{label}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {subMetrics.map(({ key, ...subMetric }) => (
          <Card key={key} {...subMetric} />
        ))}
      </div>
    </section>
  )
}
