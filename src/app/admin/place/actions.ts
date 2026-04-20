'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'

function toNullableNumber(value: FormDataEntryValue | null) {
  if (value === null) return null
  const trimmed = value.toString().trim()
  if (!trimmed) return null

  const parsed = Number(trimmed)
  return Number.isNaN(parsed) ? null : parsed
}

function toNullableText(value: FormDataEntryValue | null) {
  if (value === null) return null
  const trimmed = value.toString().trim()
  return trimmed === '' ? null : trimmed
}

export async function updatePlace(formData: FormData) {
  const id = formData.get('id')?.toString()

  if (!id) {
    return { success: false, error: 'Missing place id.' }
  }

  const payload = {
    name: toNullableText(formData.get('name')),
    town: toNullableText(formData.get('town')),
    category: toNullableText(formData.get('category')),
    subcategory: toNullableText(formData.get('subcategory')),
    address: toNullableText(formData.get('address')),
    postcode: toNullableText(formData.get('postcode')),
    age_min: toNullableNumber(formData.get('age_min')),
    age_max: toNullableNumber(formData.get('age_max')),
    parking_label: toNullableText(formData.get('parking_label')),
    coffee_label: toNullableText(formData.get('coffee_label')),
    short_blurb: toNullableText(formData.get('short_blurb')),
    website_notes: toNullableText(formData.get('website_notes')),
    source_name: toNullableText(formData.get('source_name')),
    source_url: toNullableText(formData.get('source_url')),
    image_url: toNullableText(formData.get('image_url')),
    lat: toNullableNumber(formData.get('lat')),
    lng: toNullableNumber(formData.get('lng')),
  }

  const { error } = await supabaseAdmin
    .from('places')
    .update(payload)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}