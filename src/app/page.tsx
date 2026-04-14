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
  age_min: number | null
  age_max: number | null
}

type HomeProps = {
  searchParams?: Promise<{
    category?: string
    subcategory?: string
    coffee?: string
    free?: string
    indoor?: string
    outdoor?: string
    town?: string
    age?: string
  }>
}

const quickFilters = [
  { label: 'Free', key: 'free', value: 'true' },
  { label: 'Indoor', key: 'indoor', value: 'true' },
  { label: 'Outdoor', key: 'outdoor', value: 'true' },
  { label: 'Pub gardens', key: 'subcategory', value: 'pub-with-garden' },
  { label: 'No coffee', key: 'coffee', value: 'None' },
  { label: 'Toddlers', key: 'age', value: '2-4' },
]

const categoryFilters = [
  { label: 'Parks', value: 'park' },
  { label: 'Pubs', value: 'pub' },
  { label: 'Soft play', value: 'soft play' },
  { label: 'Cafes', value: 'cafe' },
]

const townFilters = ['Marlow', 'Bourne End', 'West Wycombe']

function normaliseSubcategoryForUrl(value: string | null) {
  if (!value) return null

  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
}

function buildHref(
  params: Record<string, string | undefined>,
  updates: Record<string, string | undefined>
) {
  const merged = { ...params, ...updates }
  const search = new URLSearchParams()

  Object.entries(merged).forEach(([key, value]) => {
    if (value) {
      search.set(key, value)
    }
  })

  const queryString = search.toString()
  return queryString ? `/?${queryString}` : '/'
}

function matchesAgeFilter(place: Place, ageFilter: string | undefined) {
  if (!ageFilter) return true
  if (place.age_min === null || place.age_max === null) return false

  if (ageFilter === '2-4') {
    return place.age_min <= 4 && place.age_max >= 2
  }

  if (ageFilter === '5-7') {
    return place.age_min <= 7 && place.age_max >= 5
  }

  return true
}

function ActiveFilterTag({
  label,
  href,
}: {
  label: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white"
    >
      {label} ×
    </Link>
  )
}

export default async function Home({ searchParams }: HomeProps) {
  const params = (await searchParams) ?? {}

  let query = supabase
    .from('places')
    .select(
      'id, slug, name, town, category, subcategory, price_label, short_blurb, distance_minutes, free, parking_label, coffee_label, indoor, outdoor, scoot_friendly, age_min, age_max'
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

  if (params.town) {
    query = query.eq('town', params.town)
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

  if (params.age) {
    filteredData = filteredData.filter((place) => matchesAgeFilter(place, params.age))
  }

  const hasActiveFilters = Object.values(params).some(Boolean)

  const currentParams: Record<string, string | undefined> = {
    category: params.category,
    subcategory: params.subcategory,
    coffee: params.coffee,
    free: params.free,
    indoor: params.indoor,
    outdoor: params.outdoor,
    town: params.town,
    age: params.age,
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

        <section className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Quick filters
            </p>

            {hasActiveFilters ? (
              <Link
                href="/"
                className="text-xs font-medium text-neutral-700 underline-offset-4 hover:underline"
              >
                Clear all
              </Link>
            ) : null}
          </div>

          <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
            <Link
              href="/"
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                !hasActiveFilters
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-700 ring-1 ring-neutral-200'
              }`}
            >
              All
            </Link>

            {quickFilters.map((filter) => {
              const isActive = currentParams[filter.key] === filter.value

              return (
                <Link
                  key={`${filter.key}-${filter.value}`}
                  href={buildHref(currentParams, {
                    [filter.key]: isActive ? undefined : filter.value,
                  })}
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
            {categoryFilters.map((filter) => {
              const isActive = params.category === filter.value

              return (
                <Link
                  key={filter.value}
                  href={buildHref(currentParams, {
                    category: isActive ? undefined : filter.value,
                  })}
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
            Towns
          </p>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {townFilters.map((town) => {
              const isActive = params.town === town

              return (
                <Link
                  key={town}
                  href={buildHref(currentParams, {
                    town: isActive ? undefined : town,
                  })}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-neutral-700 ring-1 ring-neutral-200'
                  }`}
                >
                  {town}
                </Link>
              )
            })}
          </div>
        </section>

        {hasActiveFilters ? (
          <section className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Active filters
            </p>

            <div className="flex flex-wrap gap-2">
              {params.category ? (
                <ActiveFilterTag
                  label={`Category: ${params.category}`}
                  href={buildHref(currentParams, { category: undefined })}
                />
              ) : null}

              {params.subcategory ? (
                <ActiveFilterTag
                  label={`Type: ${params.subcategory.replace(/-/g, ' ')}`}
                  href={buildHref(currentParams, { subcategory: undefined })}
                />
              ) : null}

              {params.coffee ? (
                <ActiveFilterTag
                  label={`Coffee: ${params.coffee}`}
                  href={buildHref(currentParams, { coffee: undefined })}
                />
              ) : null}

              {params.free === 'true' ? (
                <ActiveFilterTag
                  label="Free"
                  href={buildHref(currentParams, { free: undefined })}
                />
              ) : null}

              {params.indoor === 'true' ? (
                <ActiveFilterTag
                  label="Indoor"
                  href={buildHref(currentParams, { indoor: undefined })}
                />
              ) : null}

              {params.outdoor === 'true' ? (
                <ActiveFilterTag
                  label="Outdoor"
                  href={buildHref(currentParams, { outdoor: undefined })}
                />
              ) : null}

              {params.town ? (
                <ActiveFilterTag
                  label={`Town: ${params.town}`}
                  href={buildHref(currentParams, { town: undefined })}
                />
              ) : null}

              {params.age ? (
                <ActiveFilterTag
                  label={`Age: ${params.age}`}
                  href={buildHref(currentParams, { age: undefined })}
                />
              ) : null}
            </div>
          </section>
        ) : null}

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            {filteredData.length} place{filteredData.length === 1 ? '' : 's'}
          </p>
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