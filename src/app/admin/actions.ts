'use server'

import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'

function toBool(value: FormDataEntryValue | null) {
  return value === 'on'
}

function toNullableInt(value: FormDataEntryValue | null) {
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function createPlace(formData: FormData) {
  const name = toNullableText(formData.get('name'))
  const providedSlug = toNullableText(formData.get('slug'))

  if (!name) {
    throw new Error('Name is required')
  }

  const slug = providedSlug ? slugify(providedSlug) : slugify(name)

  const payload = {
    name,
    slug,
    town: toNullableText(formData.get('town')),
    category: toNullableText(formData.get('category')),
    subcategory: toNullableText(formData.get('subcategory')),
    age_min: toNullableInt(formData.get('age_min')),
    age_max: toNullableInt(formData.get('age_max')),
    indoor: toBool(formData.get('indoor')),
    outdoor: toBool(formData.get('outdoor')),
    free: toBool(formData.get('free')),
    scoot_friendly: toBool(formData.get('scoot_friendly')),
    bike_friendly: toBool(formData.get('bike_friendly')),
    buggy_friendly: toBool(formData.get('buggy_friendly')),
    parking_label: toNullableText(formData.get('parking_label')),
    coffee_label: toNullableText(formData.get('coffee_label')),
    price_label: toNullableText(formData.get('price_label')),
    short_blurb: toNullableText(formData.get('short_blurb')),
    distance_minutes: toNullableInt(formData.get('distance_minutes')),
    address: toNullableText(formData.get('address')),
    postcode: toNullableText(formData.get('postcode')),
    booking_required: toBool(formData.get('booking_required')),
    toilets: toBool(formData.get('toilets')),
    changing_facilities: toBool(formData.get('changing_facilities')),
    food_available: toBool(formData.get('food_available')),
    website_url: toNullableText(formData.get('website_url')),
    website_notes: toNullableText(formData.get('website_notes')),
    source_name: toNullableText(formData.get('source_name')) ?? 'Manual form',
    source_url: toNullableText(formData.get('source_url')),
  }

  const { error } = await supabaseAdmin.from('places').insert(payload)

  if (error) {
    throw new Error(error.message)
  }

  redirect('/admin')
}