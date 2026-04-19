'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'

export async function updatePlaceCoordinates(formData: FormData) {
  const id = formData.get('id')?.toString()
  const latRaw = formData.get('lat')?.toString()
  const lngRaw = formData.get('lng')?.toString()

  if (!id) {
    return { success: false, error: 'Missing place id.' }
  }

  const lat = latRaw ? Number(latRaw) : null
  const lng = lngRaw ? Number(lngRaw) : null

  const { error } = await supabaseAdmin
    .from('places')
    .update({
      lat,
      lng,
    })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}