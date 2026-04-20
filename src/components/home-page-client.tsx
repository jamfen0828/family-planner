'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
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
  lat: number | null
  lng: number | null
  image_url: string | null
}

type HomePageClientProps = {
  places: Place[]
  params: {
    category?: string
    subcategory?: string
    coffee?: string
    free?: string
    indoor?: string
    outdoor?: string
    town?: string
    age?: string
  }
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

function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const toRad = (value: number) => (value * Math.PI) / 180
  const earthRadiusKm = 6371

  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

export function HomePageClient({ places, params }: HomePageClientProps) {
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  const [locationStatus, setLocationStatus] = useState<
    'idle' | 'loading' | 'granted' | 'denied' | 'error'
  >('idle')

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

  const hasActiveFilters = Object.values(params).some(Boolean)

  const filteredData = useMemo(() => {
    let result = [...places]

    if (params.subcategory) {
      result = result.filter((place) => {
        return normaliseSubcategoryForUrl(place.subcategory) === params.subcategory
      })
    }

    if (params.age) {
      result = result.filter((place) => matchesAgeFilter(place, params.age))
    }

    if (userLocation) {
      result = result
        .map((place) => {
          if (place.lat === null || place.lng === null) {
            return {
              ...place,
              userDistanceKm: null as number | null,
            }
          }

          return {
            ...place,
            userDistanceKm: haversineDistanceKm(
              userLocation.lat,
              userLocation.lng,
              place.lat,
              place.lng
            ),
          }
        })
        .sort((a, b) => {
          if (a.userDistanceKm === null && b.userDistanceKm === null) return 0
          if (a.userDistanceKm === null) return 1
          if (b.userDistanceKm === null) return -1
          return a.userDistanceKm - b.userDistanceKm
        })
        .map((place) => ({
          ...place,
          short_blurb:
            place.userDistanceKm !== null
              ? `${place.userDistanceKm.toFixed(1)} km away${place.short_blurb ? ` · ${place.short_blurb}` : ''}`
              : place.short_blurb,
        }))
    }

    return result
  }, [places, params, userLocation])

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      return
    }

    setLocationStatus('loading')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
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

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/saved"
              className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200"
            >
              Saved places
            </Link>

            <Link
              href="/map"
              className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200"
            >
              Map view
            </Link>

            <Link
              href="/admin"
              className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200"
            >
              Open admin review
            </Link>
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
            >
              {locationStatus === 'loading' ? 'Finding you...' : 'Use my location'}
            </button>

            {locationStatus === 'granted' ? (
              <p className="mt-2 text-xs text-neutral-600">
                Showing nearest places first.
              </p>
            ) : null}

            {locationStatus === 'denied' ? (
              <p className="mt-2 text-xs text-red-600">
                Location access was denied.
              </p>
            ) : null}

            {locationStatus === 'error' ? (
              <p className="mt-2 text-xs text-red-600">
                Your browser could not access location.
              </p>
            ) : null}
          </div>
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
            filteredData.map((place) => (
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