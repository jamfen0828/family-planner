import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { SaveButton } from '@/components/save-button'
import { PlaceSignals } from '@/components/place-signals'

function formatAgeRange(ageMin: number | null, ageMax: number | null) {
  if (ageMin === null && ageMax === null) return 'All ages'

  if (ageMin !== null && ageMax !== null) {
    if (ageMax <= 4) return '4 and under'
    if (ageMin >= 5) return `${ageMin}+`
    return `Ages ${ageMin}–${ageMax}`
  }

  if (ageMax !== null) {
    return `${ageMax} and under`
  }

  if (ageMin !== null) {
    return `${ageMin}+`
  }

  return 'All ages'
}

type PlacePageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params

  const { data: place, error } = await supabase
    .from('places')
    .select(`
      id,
      name,
      slug,
      town,
      category,
      short_blurb,
      distance_minutes,
      free,
      price_label,
      parking_label,
      coffee_label,
      indoor,
      outdoor,
      scoot_friendly,
      bike_friendly,
      buggy_friendly,
      age_min,
      age_max,
      address,
      postcode,
      booking_required,
      toilets,
      changing_facilities,
      food_available,
      website_url,
      website_notes,
      subcategory,
      source_name,
      source_url
    `)
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-50 p-4">
        <div className="mx-auto max-w-md">
          <p className="text-sm text-red-600">Error: {error.message}</p>
        </div>
      </main>
    )
  }

  if (!place) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-neutral-50 p-4">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200"
          >
            ← Back
          </Link>

          {place.slug ? <SaveButton slug={place.slug} variant="detail" /> : null}
        </div>

        <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
          <div>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
              {place.subcategory ?? place.category ?? 'Place'}
            </span>
          </div>

          <div className="mt-2 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
                {place.name}
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                {place.town ?? 'Unknown town'}
                {place.distance_minutes ? ` · ${place.distance_minutes} mins away` : ''}
              </p>
            </div>

            <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
              {place.free
                ? 'Free'
                : place.price_label ?? 'Price not specified'}
            </div>
          </div>

          {place.short_blurb ? (
            <p className="mt-4 text-sm leading-6 text-neutral-700">
              {place.short_blurb}
            </p>
          ) : null}
        </section>

        <section className="mt-4 flex flex-wrap gap-2">
          {place.free && (
            <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
              Free
            </span>
          )}

          {place.outdoor && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-800">
              Outdoor
            </span>
          )}

          {place.indoor && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-800">
              Indoor
            </span>
          )}

          {place.scoot_friendly && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-800">
              Scoot friendly
            </span>
          )}
        </section>

        <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">At a glance</h2>

          <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-neutral-50 p-3">
            <div>
              <p className="text-xs text-neutral-500">Parking</p>
              <p className="mt-1 text-sm font-medium text-neutral-900">
                {place.parking_label === 'Easy' && 'Easy parking'}
                {place.parking_label === 'Limited' && 'Limited parking'}
                {place.parking_label === 'Tricky' && 'Tricky parking'}
                {place.parking_label === 'None' && 'No parking'}
                {!place.parking_label && 'Unknown'}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-500">Coffee</p>
              <p className="mt-1 text-sm font-medium text-neutral-900">
                {place.coffee_label === 'Good' && 'Good coffee'}
                {place.coffee_label === 'Basic' && 'Basic coffee'}
                {place.coffee_label === 'None' && 'No coffee'}
                {!place.coffee_label && 'Unknown'}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-500">Toilets</p>
              <p className="mt-1 text-sm font-medium text-neutral-900">
                {place.toilets ? 'Yes' : 'No'}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-500">Changing</p>
              <p className="mt-1 text-sm font-medium text-neutral-900">
                {place.changing_facilities ? 'Yes' : 'No'}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-500">Food</p>
              <p className="mt-1 text-sm font-medium text-neutral-900">
                {place.food_available ? 'Yes' : 'No'}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-500">Ages</p>
              <p className="mt-1 text-sm font-medium text-neutral-900">
                {formatAgeRange(place.age_min, place.age_max)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">Location</h2>

          <div className="mt-4 space-y-3 text-sm text-neutral-700">
            <p>{place.address ?? 'Address not added yet'}</p>
            <p>{place.postcode ?? 'Postcode not added yet'}</p>

            {place.website_url ? (
              <a
                href={place.website_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
              >
                Visit website
              </a>
            ) : null}
          </div>
        </section>

        {place.website_notes ? (
          <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">
              Why parents like it
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-800">
              {place.website_notes}
            </p>
          </section>
        ) : null}

        <PlaceSignals placeId={place.id} />
      </div>
    </main>
  )
}