'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useFavorites } from '@/components/favorites-provider'
import { supabase } from '@/lib/supabase'
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
  image_url: string | null
}

export function SavedPlacesClient() {
  const { favorites } = useFavorites()
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPlaces() {
      if (favorites.length === 0) {
        setPlaces([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('places')
        .select(
          'id, slug, name, town, category, subcategory, price_label, short_blurb, distance_minutes, free, parking_label, coffee_label, indoor, outdoor, scoot_friendly, image_url'
        )
        .in('slug', favorites)

      if (!error && data) {
        const sorted = [...data].sort((a, b) => {
          const aIndex = favorites.indexOf(a.slug ?? '')
          const bIndex = favorites.indexOf(b.slug ?? '')
          return aIndex - bIndex
        })

        setPlaces(sorted)
      }

      setLoading(false)
    }

    loadPlaces()
  }, [favorites])

  return (
    <main className="min-h-screen bg-neutral-50 p-4">
      <div className="mx-auto max-w-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-neutral-500">
              Saved places
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
              Your shortlist
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Keep the best options in one place for easy weekend planning.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200"
          >
            Back
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 rounded-3xl bg-white p-6 text-sm text-neutral-600 shadow-sm">
            Loading saved places...
          </div>
        ) : favorites.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-white p-6 text-sm leading-6 text-neutral-600 shadow-sm">
            You haven’t saved any places yet. Start building a shortlist for your next day out.
          </div>
        ) : (
          <>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-neutral-600">
                {places.length} saved place{places.length === 1 ? '' : 's'}
              </p>
            </div>

            <div className="mt-4 space-y-4">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}