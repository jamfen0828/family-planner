import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PlacesMapWrapper } from '@/components/places-map-wrapper'
import { MapLegend } from '@/components/map-legend'

type Place = {
  id: number
  slug: string | null
  name: string
  town: string | null
  category: string | null
  subcategory: string | null
  short_blurb: string | null
  lat: number | null
  lng: number | null
  free: boolean | null
  coffee_label: string | null
  age_min: number | null
  age_max: number | null
}

type MapPageProps = {
  searchParams?: Promise<{
    category?: string
    subcategory?: string
    free?: string
    coffee?: string
    age?: string
  }>
}

function normaliseSubcategoryForUrl(value: string | null) {
  if (!value) return null
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
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
  return queryString ? `/map?${queryString}` : '/map'
}

const quickFilters = [
  { label: 'Free', key: 'free', value: 'true' },
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

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = (await searchParams) ?? {}

  let query = supabase
    .from('places')
    .select(
      'id, slug, name, town, category, subcategory, short_blurb, lat, lng, free, coffee_label, age_min, age_max'
    )
    .not('lat', 'is', null)
    .not('lng', 'is', null)
    .order('name', { ascending: true })

  if (params.category) {
    query = query.eq('category', params.category)
  }

  if (params.free === 'true') {
    query = query.eq('free', true)
  }

  if (params.coffee) {
    query = query.eq('coffee_label', params.coffee)
  }

  const { data, error } = await query

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-50 p-4">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-red-600">Error: {error.message}</p>
        </div>
      </main>
    )
  }

  let places = (data ?? []) as Place[]

  if (params.subcategory) {
    places = places.filter(
      (place) => normaliseSubcategoryForUrl(place.subcategory) === params.subcategory
    )
  }

  if (params.age) {
    places = places.filter((place) => matchesAgeFilter(place, params.age))
  }

  const currentParams: Record<string, string | undefined> = {
    category: params.category,
    subcategory: params.subcategory,
    free: params.free,
    coffee: params.coffee,
    age: params.age,
  }

  const hasActiveFilters = Object.values(currentParams).some(Boolean)

  return (
    <main className="min-h-screen bg-neutral-50 p-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-neutral-500">Map view</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
                Explore places on the map
              </h1>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Filter the map to find the best nearby options faster.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200"
            >
              Back
            </Link>
          </div>

          <section>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Quick filters
              </p>

              {hasActiveFilters ? (
                <Link
                  href="/map"
                  className="text-xs font-medium text-neutral-700 underline-offset-4 hover:underline"
                >
                  Clear all
                </Link>
              ) : null}
            </div>

            <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
              <Link
                href="/map"
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

          <section>
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

          {hasActiveFilters ? (
            <section>
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

                {params.free === 'true' ? (
                  <ActiveFilterTag
                    label="Free"
                    href={buildHref(currentParams, { free: undefined })}
                  />
                ) : null}

                {params.coffee ? (
                  <ActiveFilterTag
                    label={`Coffee: ${params.coffee}`}
                    href={buildHref(currentParams, { coffee: undefined })}
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

          <div className="text-sm text-neutral-600">
            {places.length} place{places.length === 1 ? '' : 's'} on map
          </div>
        </div>

        {places.length > 0 ? (
          <div className="space-y-4">
            <MapLegend />
            <PlacesMapWrapper places={places} />
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-6 text-sm text-neutral-600 shadow-sm">
            No places match these map filters yet.
          </div>
        )}
      </div>
    </main>
  )
}