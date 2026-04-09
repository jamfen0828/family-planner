import { supabase } from '@/lib/supabase'

type Place = {
  id: number
  name: string
  town: string | null
  category: string | null
  price_label: string | null
}

export default async function Home() {
  const { data, error } = await supabase
    .from('places')
    .select('id, name, town, category, price_label')
    .order('id', { ascending: true })

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Family Planner</h1>
        <p className="mt-4 text-red-600">Error: {error.message}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold">Family Planner</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Day 1 test: pulling places from Supabase
        </p>

        <div className="mt-6 space-y-4">
          {data?.map((place: Place) => (
            <div key={place.id} className="rounded-2xl border p-4 shadow-sm">
              <h2 className="text-lg font-medium">{place.name}</h2>
              <p className="text-sm text-neutral-600">
                {place.town} · {place.category} · {place.price_label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}