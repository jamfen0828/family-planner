'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { updatePlace } from '@/app/admin/place/actions'

export function EditPlaceForm({ place }: { place: any }) {
  const [name, setName] = useState(place.name ?? '')
  const [town, setTown] = useState(place.town ?? '')
  const [category, setCategory] = useState(place.category ?? '')
  const [subcategory, setSubcategory] = useState(place.subcategory ?? '')
  const [address, setAddress] = useState(place.address ?? '')
  const [postcode, setPostcode] = useState(place.postcode ?? '')
  const [ageMin, setAgeMin] = useState(place.age_min ?? '')
  const [ageMax, setAgeMax] = useState(place.age_max ?? '')
  const [parkingLabel, setParkingLabel] = useState(place.parking_label ?? '')
  const [coffeeLabel, setCoffeeLabel] = useState(place.coffee_label ?? '')
  const [shortBlurb, setShortBlurb] = useState(place.short_blurb ?? '')
  const [websiteNotes, setWebsiteNotes] = useState(place.website_notes ?? '')
  const [sourceName, setSourceName] = useState(place.source_name ?? '')
  const [sourceUrl, setSourceUrl] = useState(place.source_url ?? '')
  const [lat, setLat] = useState(place.lat ?? '')
  const [lng, setLng] = useState(place.lng ?? '')

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [geocodeMessage, setGeocodeMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isGeocoding, setIsGeocoding] = useState(false)

  async function handleGeocode() {
    setError(null)
    setGeocodeMessage(null)
    setSuccess(false)

    const query = [address, postcode, town, 'United Kingdom']
      .filter(Boolean)
      .join(', ')

    if (!query) {
      setError('No location details available for this place.')
      return
    }

    setIsGeocoding(true)

    try {
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.error ?? 'Could not find coordinates.')
        setIsGeocoding(false)
        return
      }

      setLat(String(result.lat))
      setLng(String(result.lng))
      setGeocodeMessage('Coordinates found. Save to apply them.')
    } catch {
      setError('Geocoding failed.')
    } finally {
      setIsGeocoding(false)
    }
  }

  function handleSave() {
    setError(null)
    setSuccess(false)
    setGeocodeMessage(null)

    const formData = new FormData()
    formData.set('id', String(place.id))
    formData.set('name', String(name))
    formData.set('town', String(town))
    formData.set('category', String(category))
    formData.set('subcategory', String(subcategory))
    formData.set('address', String(address))
    formData.set('postcode', String(postcode))
    formData.set('age_min', String(ageMin))
    formData.set('age_max', String(ageMax))
    formData.set('parking_label', String(parkingLabel))
    formData.set('coffee_label', String(coffeeLabel))
    formData.set('short_blurb', String(shortBlurb))
    formData.set('website_notes', String(websiteNotes))
    formData.set('source_name', String(sourceName))
    formData.set('source_url', String(sourceUrl))
    formData.set('lat', String(lat))
    formData.set('lng', String(lng))

    startTransition(async () => {
      const result = await updatePlace(formData)

      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error ?? 'Something went wrong.')
      }
    })
  }

  return (
    <div className="space-y-6 rounded-3xl bg-white p-4 shadow-sm">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Basics
        </h2>

        <div>
          <label className="text-xs font-medium text-neutral-600">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-600">Town</label>
          <input
            value={town}
            onChange={(e) => setTown(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-600">Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
            placeholder="park, pub, soft play, cafe"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-600">Subcategory</label>
          <input
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
            placeholder="pub with garden"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Parent-facing content
        </h2>

        <div>
          <label className="text-xs font-medium text-neutral-600">Short blurb</label>
          <textarea
            value={shortBlurb}
            onChange={(e) => setShortBlurb(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-600">Why parents like it</label>
          <textarea
            value={websiteNotes}
            onChange={(e) => setWebsiteNotes(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Practical details
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-neutral-600">Age min</label>
            <input
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-600">Age max</label>
            <input
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-600">Parking label</label>
          <input
            value={parkingLabel}
            onChange={(e) => setParkingLabel(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
            placeholder="Easy, Limited, Tricky, None"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-600">Coffee label</label>
          <input
            value={coffeeLabel}
            onChange={(e) => setCoffeeLabel(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
            placeholder="Good, Basic, None"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Location
        </h2>

        <div>
          <label className="text-xs font-medium text-neutral-600">Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-600">Postcode</label>
          <input
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </div>

        <div className="rounded-2xl bg-neutral-50 p-4">
          <p className="text-xs font-medium text-neutral-500">Location used for lookup</p>
          <p className="mt-2 text-sm text-neutral-800">
            {[address, postcode, town].filter(Boolean).join(', ') || 'No location available'}
          </p>

          <button
            type="button"
            onClick={handleGeocode}
            disabled={isGeocoding}
            className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200 disabled:opacity-60"
          >
            {isGeocoding ? 'Finding coordinates...' : 'Get coordinates from address'}
          </button>
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-600">Latitude</label>
          <input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
            placeholder="51.5716"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-600">Longitude</label>
          <input
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
            placeholder="-0.7753"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Source
        </h2>

        <div>
          <label className="text-xs font-medium text-neutral-600">Source name</label>
          <input
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-600">Source URL</label>
          <input
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </div>
      </section>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="w-full rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isPending ? 'Saving...' : 'Save place'}
        </button>

        {geocodeMessage && (
          <p className="text-sm text-neutral-700">{geocodeMessage}</p>
        )}

        {success && (
          <p className="text-sm text-green-600">Saved successfully</p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <Link
            href="/admin"
            className="inline-flex text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
          >
            Back to admin
          </Link>

          {place.slug ? (
            <Link
              href={`/places/${place.slug}`}
              className="inline-flex text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
            >
              View live page
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  )
}