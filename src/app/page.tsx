import { supabase } from '@/lib/supabase'
import { HomePageClient } from '@/components/home-page-client'

type HomeProps = {
  searchParams?: Promise<{
    category?: string
    subcategory?: string
    coffee?: string
    free?: string
    indoor?: string
    outdoor?: string
    town?: string
    age?: string
  }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = (await searchParams) ?? {}

  let query = supabase
    .from('places')
    .select(
      'id, slug, name, town, category, subcategory, price_label, short_blurb, distance_minutes, free, parking_label, coffee_label, indoor, outdoor, scoot_friendly, age_min, age_max, lat, lng, image_url'
    )
    .order('distance_minutes', { ascending: true, nullsFirst: false })

  if (params.category) {
    query = query.eq('category', params.category)
  }

  if (params.coffee) {
    query = query.eq('coffee_label', params.coffee)
  }

  if (params.free === 'true') {
    query = query.eq('free', true)
  }

  if (params.indoor === 'true') {
    query = query.eq('indoor', true)
  }

  if (params.outdoor === 'true') {
    query = query.eq('outdoor', true)
  }

  if (params.town) {
    query = query.eq('town', params.town)
  }

  const { data, error } = await query

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-50 p-4">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-semibold">Family Planner</h1>
          <p className="mt-4 text-red-600">Error: {error.message}</p>
        </div>
      </main>
    )
  }

  return <HomePageClient places={data ?? []} params={params} />
}