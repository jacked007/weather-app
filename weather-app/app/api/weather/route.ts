import { type NextRequest, NextResponse } from "next/server"

// Helper function to get grid points from lat/lon
async function getGridPoints(lat: number, lon: number) {
  try {
    const response = await fetch(`https://api.weather.gov/points/${lat},${lon}`, {
      headers: {
        "User-Agent": "WeatherOutfitRecommender/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get grid points: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching grid points:", error)
    throw error
  }
}

// Helper function to get location from search term
async function getLocationCoordinates(location: string) {
  try {
    // Using ArcGIS Geocoding API
    const response = await fetch(
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&singleLine=${encodeURIComponent(
        location,
      )}&outFields=Match_addr,Country&maxLocations=1`,
    )

    if (!response.ok) {
      throw new Error(`Failed to geocode location: ${response.status}`)
    }

    const data = await response.json()

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("Location not found")
    }

    const match = data.candidates[0]

    // Check if the location is in the US
    if (match.attributes.Country && match.attributes.Country !== "USA") {
      throw new Error("Only US locations are supported")
    }

    return {
      latitude: match.location.y,
      longitude: match.location.x,
      locationName: match.address,
    }
  } catch (error) {
    console.error("Error geocoding location:", error)
    throw error
  }
}

// Helper function to get forecast data
async function getForecast(forecastUrl: string) {
  try {
    const response = await fetch(forecastUrl, {
      headers: {
        "User-Agent": "WeatherOutfitRecommender/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get forecast: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching forecast:", error)
    throw error
  }
}

// Helper function to get hourly forecast data
async function getHourlyForecast(forecastHourlyUrl: string) {
  try {
    const response = await fetch(forecastHourlyUrl, {
      headers: {
        "User-Agent": "WeatherOutfitRecommender/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get hourly forecast: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching hourly forecast:", error)
    throw error
  }
}

// Main handler function
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const location = searchParams.get("location")

    let latitude: number
    let longitude: number
    let locationName: string

    // Get coordinates either from direct lat/lon or from location search
    if (lat && lon) {
      latitude = Number.parseFloat(lat)
      longitude = Number.parseFloat(lon)

      // For simplicity, we'll use the coordinates as the location name
      locationName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`

      // Check if coordinates are within US bounds (approximate)
      if (latitude < 24.5 || latitude > 49.5 || longitude < -125 || longitude > -66.5) {
        throw new Error("Only US locations are supported")
      }
    } else if (location) {
      const locationData = await getLocationCoordinates(location)
      latitude = locationData.latitude
      longitude = locationData.longitude
      locationName = locationData.locationName
    } else {
      return NextResponse.json({ error: "Either lat/lon or location must be provided" }, { status: 400 })
    }

    // Get grid points from weather.gov API
    const gridPointsData = await getGridPoints(latitude, longitude)

    // Get forecast data
    const forecastData = await getForecast(gridPointsData.properties.forecast)
    const hourlyForecastData = await getHourlyForecast(gridPointsData.properties.forecastHourly)

    // Extract current conditions from hourly forecast (first period)
    const currentConditions = hourlyForecastData.properties.periods[0]

    // Extract 3-day forecast (we'll use the day periods only)
    const threeDayForecast = forecastData.properties.periods
      .filter((period: any) => period.isDaytime)
      .slice(0, 3)
      .map((period: any) => ({
        day: period.name.split(" ")[0], // Get just the day name
        condition: period.shortForecast,
        high: period.temperature,
        low:
          forecastData.properties.periods[
            forecastData.properties.periods.findIndex((p: any) => p.number === period.number) + 1
          ]?.temperature || "N/A",
      }))

    // Construct response data
    const weatherData = {
      location: locationName,
      temperature: currentConditions.temperature,
      feelsLike: currentConditions.temperature, // Weather.gov doesn't provide feels-like temp directly
      condition: currentConditions.shortForecast,
      humidity: currentConditions.relativeHumidity?.value || 0,
      windSpeed: currentConditions.windSpeed.split(" ")[0], // Extract just the number
      forecast: threeDayForecast,
      units: "imperial", // Weather.gov uses imperial units
      // Estimate UV index based on conditions and time of day
      uvIndex: currentConditions.shortForecast.toLowerCase().includes("sunny")
        ? new Date().getHours() > 10 && new Date().getHours() < 16
          ? 7
          : 4
        : 2,
    }

    return NextResponse.json(weatherData)
  } catch (error: any) {
    console.error("API error:", error)

    // Provide more specific error messages based on the error
    let errorMessage = "Failed to fetch weather data"
    let statusCode = 500

    if (error.message === "Location not found") {
      errorMessage = "We couldn't find that location. Please try a different city, state, or zip code."
      statusCode = 404
    } else if (error.message.includes("Failed to get grid points")) {
      errorMessage =
        "This location is not supported by the weather.gov API. Please try a location within the United States."
      statusCode = 400
    } else if (error.message === "Only US locations are supported") {
      errorMessage = "This app currently only supports locations in the United States."
      statusCode = 400
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}

