'use client'

import '@/components/leaflet-marker-fix'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

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

function RecenterMap({ center }: { center: [number, number] | null }) {
  const map = useMap()

  if (center) {
    map.setView(center, 13)
  }

  return null
}

const userLocationIcon = new L.DivIcon({
  className: '',
  html: `
    <div style="
      width: 16px;
      height: 16px;
      background: #111827;
      border: 3px solid white;
      border-radius: 9999px;
      box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.15);
    "></div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

export function PlacesMap({ places }: { places: Place[] }) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [locationStatus, setLocationStatus] = useState<
    'idle' | 'loading' | 'granted' | 'denied' | 'error'
  >('idle')

  const placesWithCoords = useMemo(
    () => places.filter((place) => place.lat !== null && place.lng !== null),
    [places]
  )

  const defaultCenter = useMemo(
    () =>
      (
        placesWithCoords.length > 0
          ? [placesWithCoords[0].lat!, placesWithCoords[0].lng!]
          : [51.5716, -0.7753]
      ) as [number, number],
    [placesWithCoords]
  )

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      return
    }

    setLocationStatus('loading')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([
          position.coords.latitude,
          position.coords.longitude,
        ])
        setLocationStatus('granted')
      },
      () => {
        setLocationStatus('denied')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="border-b border-neutral-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
          >
            {locationStatus === 'loading' ? 'Finding you...' : 'Use my location'}
          </button>

          {locationStatus === 'granted' ? (
            <p className="text-sm text-neutral-600">
              Map centered on your location.
            </p>
          ) : null}

          {locationStatus === 'denied' ? (
            <p className="text-sm text-red-600">
              Location access was denied.
            </p>
          ) : null}

          {locationStatus === 'error' ? (
            <p className="text-sm text-red-600">
              Your browser could not access location.
            </p>
          ) : null}
        </div>
      </div>

      <div className="h-[70vh] w-full">
        <MapContainer
          center={defaultCenter as [number, number]}
          zoom={12}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <RecenterMap center={userLocation} />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userLocation ? (
            <Marker position={userLocation} icon={userLocationIcon}>
              <Popup>
                <div className="text-sm font-medium text-neutral-900">
                  You are here
                </div>
              </Popup>
            </Marker>
          ) : null}

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