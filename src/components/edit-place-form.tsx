'use client'

import { useState, useTransition } from 'react'
import { updatePlaceCoordinates } from '@/app/admin/place/actions'

export function EditPlaceForm({ place }: { place: any }) {
  const [lat, setLat] = useState(place.lat ?? '')
  const [lng, setLng] = useState(place.lng ?? '')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    setError(null)
    setSuccess(false)

    const formData = new FormData()
    formData.set('id', String(place.id))
    formData.set('lat', String(lat))
    formData.set('lng', String(lng))

    startTransition(async () => {
      const result = await updatePlaceCoordinates(formData)

      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error ?? 'Something went wrong.')
      }
    })
  }

  return (
    <div className="space-y-4 rounded-3xl bg-white p-4 shadow-sm">
      <div>
        <label className="text-xs font-medium text-neutral-600">
          Latitude
        </label>
        <input
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          placeholder="51.5716"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-neutral-600">
          Longitude
        </label>
        <input
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          placeholder="-0.7753"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="w-full rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isPending ? 'Saving...' : 'Save coordinates'}
      </button>

      {success && (
        <div className="space-y-2">
          <p className="text-sm text-green-600">Saved successfully</p>
          <a
            href="/admin"
            className="inline-flex text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
          >
            Back to admin
          </a>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}