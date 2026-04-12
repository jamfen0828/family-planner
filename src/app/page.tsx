import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PlaceCard } from '@/components/place-card'

type Place = {
  id: number
  name: string
  town: string | null
  category: string | null
  price_label: string | null
  short_blurb: string | null
  distance_minutes: number | null
  free: boolean | null
  parking_label: string | null
  coffee_label: string | null
  indoor: boolean | null
  outdoor: boolean | null
  scoot_friendly: boolean | null
}

type HomeProps = {
  searchParams: Promise<{
    filter?: string
  }>
}

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Indoor', value: 'indoor' },
  { label: 'Outdoor', value: 'outdoor' },
  { label: 'Scoot-friendly', value: 'scoot' },
]

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const activeFilter = params.filter ?? 'all'

  let query = supabase
    .from('places')
    .select(
      'id, name, town, category, price_label, short_blurb, distance_minutes, free, parking_label, coffee_label, indoor, outdoor, scoot_friendly'
    )
    .order('distance_minutes', { ascending: true, nullsFirst: false })

  if (activeFilter === 'free') {
    query = query.eq('free', true)
  }

  if (activeFilter === 'indoor') {
    query = query.eq('indoor', true)
  }

  if (activeFilter === 'outdoor') {
    query = query.eq('outdoor', true)
  }

  if (activeFilter === 'scoot') {
    query = query.eq('scoot_friendly', true)
  }

  const { data, error } = await query

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-50 p-4">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-semibold">Family Planner</h1>
          <p className="mt-4 text-red-600">Error: {error.message}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-50 p-4">
      <div className="mx-auto max-w-md">
        <header className="pt-2">
          <p className="text-sm font-medium text-neutral-500">
            Marlow family planner
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
            What can we do today?
          </h1>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Quick ideas for days out with kids, without the endless searching.
          </p>
        </header>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value

            return (
              <Link
                key={filter.value}
                href={filter.value === 'all' ? '/' : `/?filter=${filter.value}`}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-700 ring-1 ring-neutral-200'
                }`}
              >
                {filter.label}
              </Link>
            )
          })}
        </div>

        <div className="mt-6 space-y-4">
          {data && data.length > 0 ? (
            data.map((place: Place) => <PlaceCard key={place.id} place={place} />)
          ) : (
            <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-6 text-sm text-neutral-600">
              No places match this filter yet.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}