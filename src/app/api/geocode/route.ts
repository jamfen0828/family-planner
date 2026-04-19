import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const query = body?.query?.toString().trim()

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Missing address query.' },
        { status: 400 }
      )
    }

    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', query)
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('limit', '1')
    url.searchParams.set('countrycodes', 'gb')

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'family-planner/1.0 (admin geocoding)',
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Geocoding request failed.' },
        { status: 500 }
      )
    }

    const results = (await response.json()) as Array<{
      lat: string
      lon: string
      display_name: string
    }>

    if (!results.length) {
      return NextResponse.json({
        success: false,
        error: 'No matching location found.',
      })
    }

    return NextResponse.json({
      success: true,
      lat: Number(results[0].lat),
      lng: Number(results[0].lon),
      displayName: results[0].display_name,
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong.' },
      { status: 500 }
    )
  }
}