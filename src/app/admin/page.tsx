import Link from 'next/link'
import { supabase } from '@/lib/supabase'

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
}

function getMissingFields(place: Place) {
  const missing: string[] = []

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

  return missing
}

function getStatus(missingCount: number) {
  if (missingCount === 0) return 'Complete'
  if (missingCount <= 3) return 'Almost there'
  return 'Needs enrichment'
}

export default async function AdminPage() {
  const { data, error } = await supabase
    .from('places')
    .select(
      'id, slug, name, town, category, subcategory, short_blurb, address, postcode, parking_label, coffee_label, website_url, website_notes, source_name, source_url, distance_minutes'
    )
    .order('name', { ascending: true })

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-50 p-4">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="mt-4 text-red-600">Error: {error.message}</p>
        </div>
      </main>
    )
  }

  const places = (data ?? []).sort(
    (a, b) => getMissingFields(b).length - getMissingFields(a).length
  )

  const completeCount = places.filter(
    (place) => getMissingFields(place).length === 0
  ).length

  const almostThereCount = places.filter((place) => {
    const missingCount = getMissingFields(place).length
    return missingCount > 0 && missingCount <= 3
  }).length

  const needsEnrichmentCount = places.filter(
    (place) => getMissingFields(place).length > 3
  ).length

  return (
    <main className="min-h-screen bg-neutral-50 p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="text-sm font-medium text-neutral-500">Internal admin</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
                Place review board
                </h1>
                <p className="mt-2 text-sm text-neutral-600">
                Use this to spot missing data before you publish more listings.
                </p>
            </div>

            <Link
                href="/admin/new"
                className="inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
            >
                Add new place
            </Link>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-sm text-neutral-500">Complete</p>
                <p className="mt-2 text-2xl font-semibold text-neutral-950">
                {completeCount}
                </p>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-sm text-neutral-500">Almost there</p>
                <p className="mt-2 text-2xl font-semibold text-neutral-950">
                {almostThereCount}
                </p>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-sm text-neutral-500">Needs enrichment</p>
                <p className="mt-2 text-2xl font-semibold text-neutral-950">
                {needsEnrichmentCount}
                </p>
            </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="hidden grid-cols-6 gap-4 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 md:grid">
            <div>Place</div>
            <div>Type</div>
            <div>Town</div>
            <div>Status</div>
            <div>Missing fields</div>
            <div>Links</div>
          </div>

          <div className="divide-y divide-neutral-200">
            {places.map((place: Place) => {
              const missing = getMissingFields(place)
              const status = getStatus(missing.length)

              return (
                <div
                  key={place.id}
                  className="grid gap-4 px-4 py-4 md:grid-cols-6 md:items-start"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-950">
                      {place.name}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {place.slug ?? 'No slug'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-800">
                      {place.subcategory ?? place.category ?? 'Uncategorised'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-800">
                      {place.town ?? 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        status === 'Complete'
                          ? 'bg-green-100 text-green-800'
                          : status === 'Almost there'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div>
                    {missing.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {missing.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-500">None</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {place.slug ? (
                      <Link
                        href={`/places/${place.slug}`}
                        className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white"
                      >
                        View
                      </Link>
                    ) : null}

                    {place.website_url ? (
                      <a
                        href={place.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-800"
                      >
                        Website
                      </a>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}