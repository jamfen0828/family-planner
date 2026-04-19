import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { hasAdminSession } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'

type AdminPageProps = {
  searchParams?: Promise<{
    filter?: string
  }>
}

type Place = {
  id: number
  slug: string | null
  name: string
  town: string | null
  category: string | null
  subcategory: string | null
  short_blurb: string | null
  address: string | null
  postcode: string | null
  parking_label: string | null
  coffee_label: string | null
  website_url: string | null
  website_notes: string | null
  source_name: string | null
  source_url: string | null
  distance_minutes: number | null
  age_min: number | null
  age_max: number | null
  lat: number | null
  lng: number | null
}

function getMissingFields(place: Place) {
  const missing: string[] = []

  if (!place.category) missing.push('category')
  if (!place.short_blurb) missing.push('blurb')
  if (!place.address) missing.push('address')
  if (!place.postcode) missing.push('postcode')
  if (!place.parking_label) missing.push('parking')
  if (!place.coffee_label) missing.push('coffee')
  if (!place.website_url) missing.push('website')
  if (!place.website_notes) missing.push('parent note')
  if (!place.source_name) missing.push('source name')
  if (!place.source_url) missing.push('source url')
  if (place.distance_minutes === null) missing.push('distance')
  if (place.age_min === null) missing.push('age min')
  if (place.age_max === null) missing.push('age max')
  if (place.lat === null) missing.push('lat')
  if (place.lng === null) missing.push('lng')

  return missing
}

function getStatus(missingCount: number) {
  if (missingCount === 0) return 'Complete'
  if (missingCount <= 3) return 'Almost there'
  return 'Needs enrichment'
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const isAuthed = await hasAdminSession()

  if (!isAuthed) {
    redirect('/admin/login')
  }

  const params = (await searchParams) ?? {}
  const activeFilter = params.filter ?? 'all'

  const { data } = await supabase
    .from('places')
    .select(
      'id, slug, name, town, category, subcategory, short_blurb, address, postcode, parking_label, coffee_label, website_url, website_notes, source_name, source_url, distance_minutes, lat, lng, age_min, age_max'
    )

  let places = (data ?? []) as Place[]

  // sort by most missing first
  places = places.sort(
    (a, b) => getMissingFields(b).length - getMissingFields(a).length
  )

  // filters
  if (activeFilter === 'coords') {
    places = places.filter((p) => p.lat === null || p.lng === null)
  }

  if (activeFilter === 'age') {
    places = places.filter(
      (p) => p.age_min === null || p.age_max === null
    )
  }

  if (activeFilter === 'category') {
    places = places.filter((p) => !p.category)
  }

  if (activeFilter === 'source') {
    places = places.filter(
      (p) => !p.source_name || !p.source_url
    )
  }

  return (
    <main className="min-h-screen bg-neutral-50 p-4">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-2xl font-semibold text-neutral-900">
          Place review board
        </h1>

        <Link
          href="/admin"
          className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200"
        >
          Back to admin
        </Link>

        {/* FILTER CHIPS */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { label: 'All', value: 'all' },
            { label: 'Missing coords', value: 'coords' },
            { label: 'Missing age', value: 'age' },
            { label: 'Missing category', value: 'category' },
            { label: 'Missing source', value: 'source' },
          ].map((filter) => {
            const isActive = activeFilter === filter.value

            return (
              <Link
                key={filter.value}
                href={
                  filter.value === 'all'
                    ? '/admin'
                    : `/admin?filter=${filter.value}`
                }
                className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${
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

        <p className="mt-3 text-sm text-neutral-600">
          Showing {places.length} place{places.length === 1 ? '' : 's'} to review.
        </p>

        {/* TABLE */}
        <div className="mt-6 space-y-4">

          {places.length > 0 ? (
            places.map((place) => {
              const missing = getMissingFields(place)
              const status = getStatus(missing.length)

              return (
                <div
                  key={place.id}
                  className="rounded-2xl bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {place.name}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {place.town ?? 'Unknown'}
                      </p>
                    </div>

                    <Link
                      href={`/admin/place/${place.id}`}
                      className="inline-flex rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Edit
                    </Link>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {missing.map((m) => (
                      <span
                        key={m}
                        className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-neutral-500">
                    {status}
                  </p>
                </div>
              )
            })
          ) : (
            <div className="rounded-2xl bg-white p-6 text-sm text-neutral-600">
              No places match this admin filter.
            </div>
          )}

        </div>
      </div>
    </main>
  )
}