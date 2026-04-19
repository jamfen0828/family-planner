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
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Edit place
        </h1>

        <p className="mt-2 text-sm text-neutral-600">{data.name}</p>

        <div className="mt-6">
          <EditPlaceForm place={data} />
        </div>
      </div>
    </main>
  )
}