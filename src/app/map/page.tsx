import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PlacesMap } from '@/components/places-map'

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
}

export default async function MapPage() {
  const { data, error } = await supabase
    .from('places')
    .select('id, slug, name, town, category, subcategory, short_blurb, lat, lng')
    .not('lat', 'is', null)
    .not('lng', 'is', null)
    .order('name', { ascending: true })

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-50 p-4">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-red-600">Error: {error.message}</p>
        </div>
      </main>
    )
  }

  const places = (data ?? []) as Place[]

  return (
    <main className="min-h-screen bg-neutral-50 p-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-neutral-500">Map view</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
              Explore places on the map
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              See what’s nearby, center the map on you, and jump straight into place details.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200"
          >
            Back
          </Link>
        </div>

        {places.length > 0 ? (
          <PlacesMap places={places} />
        ) : (
          <div className="rounded-3xl bg-white p-6 text-sm text-neutral-600 shadow-sm">
            No places have map coordinates yet. Add lat/lng values in Supabase to
            show them here.
          </div>
        )}
      </div>
    </main>
  )
}