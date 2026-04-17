'use client'

import '@/components/leaflet-marker-fix'
import Link from 'next/link'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

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

export function PlacesMap({ places }: { places: Place[] }) {
  const placesWithCoords = places.filter(
    (place) => place.lat !== null && place.lng !== null
  )

    const defaultCenter = (
    placesWithCoords.length > 0
        ? [placesWithCoords[0].lat!, placesWithCoords[0].lng!]
        : [51.5716, -0.7753]
    ) as [number, number]
    placesWithCoords.length > 0
      ? [placesWithCoords[0].lat as number, placesWithCoords[0].lng as number]
      : [51.5716, -0.7753]

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="h-[70vh] w-full">
        <MapContainer
            center={defaultCenter as [number, number]}
            zoom={12}
            scrollWheelZoom={true}
            className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {placesWithCoords.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat!, place.lng!] as [number, number]}
            >
              <Popup>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {place.name}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {place.subcategory ?? place.category ?? 'Place'}
                      {place.town ? ` · ${place.town}` : ''}
                    </p>
                  </div>

                  {place.short_blurb ? (
                    <p className="text-xs leading-5 text-neutral-700">
                      {place.short_blurb}
                    </p>
                  ) : null}

                  {place.slug ? (
                    <Link
                      href={`/places/${place.slug}`}
                      className="inline-flex rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white"
                    >
                      View place
                    </Link>
                  ) : null}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}