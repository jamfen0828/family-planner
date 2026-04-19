'use client'

import dynamic from 'next/dynamic'

const PlacesMap = dynamic(
  () => import('@/components/places-map').then((mod) => mod.PlacesMap),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-3xl bg-white p-6 text-sm text-neutral-600 shadow-sm">
        Loading map...
      </div>
    ),
  }
)

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
  free?: boolean | null
  coffee_label?: string | null
  age_min?: number | null
  age_max?: number | null
}

export function PlacesMapWrapper({ places }: { places: Place[] }) {
  return <PlacesMap places={places} />
}