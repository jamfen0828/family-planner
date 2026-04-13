import Link from 'next/link'
import { createPlace } from '../actions'

export default function NewPlacePage() {
  return (
    <main className="min-h-screen bg-neutral-50 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-neutral-500">Internal admin</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-950">
              Add a new place
            </h1>
          </div>

          <Link
            href="/admin"
            className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200"
          >
            Back to admin
          </Link>
        </div>

        <form action={createPlace} className="mt-6 space-y-6">
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Basics</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Name *</span>
                <input
                  name="name"
                  required
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none ring-0"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Slug</span>
                <input
                  name="slug"
                  placeholder="leave blank to auto-generate"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm outline-none ring-0"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Town</span>
                <input
                  name="town"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Category</span>
                <input
                  name="category"
                  placeholder="park, pub, soft play, cafe"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-neutral-700">Subcategory</span>
                <input
                  name="subcategory"
                  placeholder="pub with garden, cafe with play area"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Parent summary</h2>

            <div className="mt-4 grid gap-4">
              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Short blurb</span>
                <textarea
                  name="short_blurb"
                  rows={3}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Parent note</span>
                <textarea
                  name="website_notes"
                  rows={3}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Practical details</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Age min</span>
                <input
                  name="age_min"
                  type="number"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Age max</span>
                <input
                  name="age_max"
                  type="number"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Distance (mins)</span>
                <input
                  name="distance_minutes"
                  type="number"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Price label</span>
                <input
                  name="price_label"
                  placeholder="Free, Paid, £, ££"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Parking label</span>
                <input
                  name="parking_label"
                  placeholder="Easy, Okay, Tricky"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Coffee label</span>
                <input
                  name="coffee_label"
                  placeholder="Good, Decent, Bad, None"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ['indoor', 'Indoor'],
                ['outdoor', 'Outdoor'],
                ['free', 'Free'],
                ['scoot_friendly', 'Scoot friendly'],
                ['bike_friendly', 'Bike friendly'],
                ['buggy_friendly', 'Buggy friendly'],
                ['booking_required', 'Booking required'],
                ['toilets', 'Toilets'],
                ['changing_facilities', 'Changing facilities'],
                ['food_available', 'Food available'],
              ].map(([name, label]) => (
                <label
                  key={name}
                  className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3"
                >
                  <input type="checkbox" name={name} className="h-4 w-4" />
                  <span className="text-sm text-neutral-800">{label}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Location and source</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-neutral-700">Address</span>
                <input
                  name="address"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Postcode</span>
                <input
                  name="postcode"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Website URL</span>
                <input
                  name="website_url"
                  type="url"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-neutral-700">Source name</span>
                <input
                  name="source_name"
                  placeholder="Manual form, Google Maps"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-neutral-700">Source URL</span>
                <input
                  name="source_url"
                  type="url"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
                />
              </label>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 pb-8">
            <Link
              href="/admin"
              className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white"
            >
              Save place
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}