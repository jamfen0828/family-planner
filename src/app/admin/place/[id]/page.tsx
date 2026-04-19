import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound, redirect } from 'next/navigation'
import { hasAdminSession } from '@/lib/admin-auth'
import { EditPlaceForm } from '@/components/edit-place-form'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function EditPlacePage({ params }: Props) {
  const isAuthed = await hasAdminSession()

  if (!isAuthed) {
    redirect('/admin/login')
  }

  const { id } = await params

  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-neutral-50 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              Edit place
            </h1>
            <p className="text-sm text-neutral-600">{data.name}</p>
          </div>

          <Link
            href="/admin"
            className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-200"
          >
            Back to admin
          </Link>
        </div>

        <div className="mt-6">
          <EditPlaceForm place={data} />
        </div>
      </div>
    </main>
  )
}