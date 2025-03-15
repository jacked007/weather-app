import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")

  if (!query || query.length < 3) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    // Using the ArcGIS Geocoding API for suggestions
    const response = await fetch(
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=${encodeURIComponent(
        query,
      )}&maxSuggestions=5&countryCode=USA`,
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch suggestions: ${response.status}`)
    }

    const data = await response.json()

    // Format the suggestions
    const suggestions = data.suggestions || []

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Error fetching location suggestions:", error)
    return NextResponse.json({ suggestions: [] })
  }
}

