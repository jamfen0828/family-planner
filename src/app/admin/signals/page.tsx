import Link from 'next/link'
import { redirect } from 'next/navigation'
import { hasAdminSession } from '@/lib/admin-auth'
import { supabase } from '@/lib/supabase'

type SignalRow = {
  place_id: number
  signal_type: string
  created_at: string
  places: {
    name: string
  }[] | null
}

export default async function AdminSignalsPage() {
  const isAuthed = await hasAdminSession()

  if (!isAuthed) {
    redirect('/admin/login')
  }

  const { data, error } = await supabase
    .from('place_signals')
    .select('place_id, signal_type, created_at, places(name)')
    .order('created_at', { ascending: false })
    .limit(100)

  const rows = (data ?? []) as SignalRow[]

  return (
    <main className="min-h-screen bg-neutral-50 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              User signals
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Lightweight structured feedback from users.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200"
          >
            Back to admin
          </Link>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl bg-white p-6 text-sm text-red-600 shadow-sm">
            Error: {error.message}
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-6 text-sm text-neutral-600 shadow-sm">
            No user signals yet.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {rows.map((row, index) => (
              <div
                key={`${row.place_id}-${row.signal_type}-${row.created_at}-${index}`}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >
                <p className="text-sm font-medium text-neutral-900">
                  {row.places?.[0]?.name ?? `Place ${row.place_id}`}
                </p>
                <p className="mt-1 text-sm text-neutral-700">
                  {row.signal_type}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {new Date(row.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}