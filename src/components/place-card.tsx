import Link from 'next/link'
import { SaveButton } from '@/components/save-button'
import Image from 'next/image'

type PlaceCardProps = {
  place: {
    id: number
    name: string
    slug: string | null
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
    image_url: string | null
  }
}

export function PlaceCard({ place }: PlaceCardProps) {
  const href = place.slug ? `/places/${place.slug}` : '#'

  return (
    <Link
      href={href}
      className="block rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
    {place.image_url ? (
      <div className="mb-4 overflow-hidden rounded-2xl">
        <Image
          src={place.image_url}
          alt={place.name}
          width={800}
          height={500}
          className="h-44 w-full object-cover"
        />
      </div>
    ) : (
      <div className="mb-4 flex h-44 w-full items-center justify-center rounded-2xl bg-neutral-100 text-sm text-neutral-500">
        No image yet
      </div>
    )}  
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {place.subcategory ?? place.category ?? 'Place'}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-neutral-900">
            {place.name}
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            {place.town ?? 'Unknown town'}
            {place.distance_minutes ? ` · ${place.distance_minutes} mins away` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
            {place.free ? 'Free' : place.price_label ?? 'Paid'}
          </div>

          {place.slug ? <SaveButton slug={place.slug} /> : null}
        </div>
      </div>

      {place.short_blurb && (
        <p className="mt-3 text-sm leading-6 text-neutral-700">
          {place.short_blurb}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {place.indoor ? (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
            Indoor
          </span>
        ) : null}

        {place.outdoor ? (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
            Outdoor
          </span>
        ) : null}

        {place.scoot_friendly ? (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
            Scoot friendly
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-neutral-50 p-3">
        <div>
          <p className="text-xs text-neutral-500">Parking</p>
          <p className="mt-1 text-sm font-medium text-neutral-900">
            {place.parking_label ?? 'Unknown'}
          </p>
        </div>

        <div>
          <p className="text-xs text-neutral-500">Coffee</p>
          <p className="mt-1 text-sm font-medium text-neutral-900">
            {place.coffee_label ?? 'Unknown'}
          </p>
        </div>
      </div>
    </Link>
  )
}