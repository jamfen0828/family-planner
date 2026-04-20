'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { updatePlace } from '@/app/admin/place/actions'

const CATEGORY_OPTIONS = [
  'park',
  'pub',
  'soft play',
  'cafe',
  'farm',
  'farm shop',
  'garden centre',
  'museum',
]

const PARKING_OPTIONS = ['Easy', 'Limited', 'Tricky', 'None']

const COFFEE_OPTIONS = ['Good', 'Basic', 'None']

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
  const [imageUrl, setImageUrl] = useState(place.image_url ?? '')

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

        const ageMinNumber =
      ageMin === '' ? null : Number(ageMin)

    const ageMaxNumber =
      ageMax === '' ? null : Number(ageMax)

    if (ageMin !== '' && Number.isNaN(ageMinNumber)) {
      setError('Age min must be a number.')
      return
    }

    if (ageMax !== '' && Number.isNaN(ageMaxNumber)) {
      setError('Age max must be a number.')
      return
    }

    if (
      ageMinNumber !== null &&
      ageMaxNumber !== null &&
      ageMinNumber > ageMaxNumber
    ) {
      setError('Age min cannot be greater than age max.')
      return
    }

    if (
      parkingLabel &&
      !PARKING_OPTIONS.includes(parkingLabel)
    ) {
      setError('Choose a valid parking label.')
      return
    }

    if (
      coffeeLabel &&
      !COFFEE_OPTIONS.includes(coffeeLabel)
    ) {
      setError('Choose a valid coffee label.')
      return
    }

    if (
      category &&
      !CATEGORY_OPTIONS.includes(category)
    ) {
      setError('Choose a valid category.')
      return
    }

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
    formData.set('image_url', String(imageUrl))

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
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
            >
                <option value="">Select category</option>
                {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
                ))}
            </select>
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
        <p className="mt-1 text-xs text-neutral-500">
            Example: pub with garden, cafe with play area
        </p>
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
          Image
        </h2>

        <div>
          <label className="text-xs font-medium text-neutral-600">Image URL</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
            placeholder="https://..."
          />
          <p className="mt-1 text-xs text-neutral-500">
            Paste a public image URL for now.
          </p>
        </div>

        {imageUrl ? (
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
            <img
              src={imageUrl}
              alt="Preview"
              className="h-48 w-full object-cover"
            />
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Practical details
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-neutral-600">Age min</label>
                <input
                type="number"
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value)}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
                />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-600">Age max</label>
                <input
                type="number"
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value)}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
                />
          </div>
        </div>

        <div>
        <label className="text-xs font-medium text-neutral-600">Parking label</label>
        <select
            value={parkingLabel}
            onChange={(e) => setParkingLabel(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
        >
            <option value="">Select parking label</option>
            {PARKING_OPTIONS.map((option) => (
            <option key={option} value={option}>
                {option}
            </option>
            ))}
        </select>
        </div>

        <div>
        <label className="text-xs font-medium text-neutral-600">Coffee label</label>
        <select
            value={coffeeLabel}
            onChange={(e) => setCoffeeLabel(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
        >
            <option value="">Select coffee label</option>
            {COFFEE_OPTIONS.map((option) => (
            <option key={option} value={option}>
                {option}
            </option>
            ))}
        </select>
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
            href="/"
            className="inline-flex text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
            >
            Back to app
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