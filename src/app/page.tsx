import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PlaceCard } from '@/components/place-card'

type Place = {
  id: number
  slug: string | null
  name: string
  town: string | null
  category: string | null
  subcategory: string | null
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
  searchParams?: Promise<{
    category?: string
    subcategory?: string
    coffee?: string
    free?: string
    indoor?: string
    outdoor?: string
  }>
}

const quickFilters = [
  { label: 'All', href: '/' },
  { label: 'Free', href: '/?free=true' },
  { label: 'Indoor', href: '/?indoor=true' },
  { label: 'Outdoor', href: '/?outdoor=true' },
  { label: 'Pub gardens', href: '/?subcategory=pub-with-garden' },
  { label: 'No coffee', href: '/?coffee=None' },
]

const categoryFilters = [
  { label: 'Parks', value: 'park' },
  { label: 'Pubs', value: 'pub' },
  { label: 'Soft play', value: 'soft play' },
  { label: 'Cafes', value: 'cafe' },
]

function normaliseSubcategoryForUrl(value: string | null) {
  if (!value) return null

  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
}

export default async function Home({ searchParams }: HomeProps) {
  const params = (await searchParams) ?? {}

  let query = supabase
    .from('places')
    .select(
      'id, slug, name, town, category, subcategory, price_label, short_blurb, distance_minutes, free, parking_label, coffee_label, indoor, outdoor, scoot_friendly'
    )
    .order('distance_minutes', { ascending: true, nullsFirst: false })

  if (params.category) {
    query = query.eq('category', params.category)
  }

  if (params.coffee) {
    query = query.eq('coffee_label', params.coffee)
  }

  if (params.free === 'true') {
    query = query.eq('free', true)
  }

  if (params.indoor === 'true') {
    query = query.eq('indoor', true)
  }

  if (params.outdoor === 'true') {
    query = query.eq('outdoor', true)
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

  let filteredData = data ?? []

  if (params.subcategory) {
    filteredData = filteredData.filter((place) => {
      return normaliseSubcategoryForUrl(place.subcategory) === params.subcategory
    })
  }

  const hasActiveFilters =
    !!params.category ||
    !!params.subcategory ||
    !!params.coffee ||
    params.free === 'true' ||
    params.indoor === 'true' ||
    params.outdoor === 'true'

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

          <div className="mt-4">
            <Link
              href="/admin"
              className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200"
            >
              Open admin review
            </Link>
          </div>
        </header>

        <section className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Quick filters
          </p>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickFilters.map((filter) => {
              const isActive =
                (filter.href === '/' && !hasActiveFilters) ||
                (filter.href.includes('free=true') && params.free === 'true') ||
                (filter.href.includes('indoor=true') && params.indoor === 'true') ||
                (filter.href.includes('outdoor=true') && params.outdoor === 'true') ||
                (filter.href.includes('subcategory=pub-with-garden') &&
                  params.subcategory === 'pub-with-garden') ||
                (filter.href.includes('coffee=None') && params.coffee === 'None')

              return (
                <Link
                  key={filter.href}
                  href={filter.href}
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
        </section>

        <section className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Categories
          </p>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Link
              href="/"
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                !params.category
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-700 ring-1 ring-neutral-200'
              }`}
            >
              All categories
            </Link>

            {categoryFilters.map((filter) => {
              const isActive = params.category === filter.value

              return (
                <Link
                  key={filter.value}
                  href={`/?category=${encodeURIComponent(filter.value)}`}
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
        </section>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            {filteredData.length} place{filteredData.length === 1 ? '' : 's'}
          </p>

          {hasActiveFilters ? (
            <Link
              href="/"
              className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
            >
              Clear filters
            </Link>
          ) : null}
        </div>

        <div className="mt-4 space-y-4">
          {filteredData.length > 0 ? (
            filteredData.map((place: Place) => (
              <PlaceCard key={place.id} place={place} />
            ))
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