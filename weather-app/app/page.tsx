"use client"

import { useState, useEffect } from "react"
import { useGeolocation } from "@/hooks/use-geolocation"
import { WeatherDisplay } from "@/components/weather-display"
import { OutfitRecommendation } from "@/components/outfit-recommendation"
import { LocationSearch } from "@/components/location-search"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"

export default function Home() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { location, error: geoError, loading: geoLoading, getLocation } = useGeolocation()

  const fetchWeatherByCoordinates = async (lat: number, lon: number) => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch weather data")
      }

      const data = await response.json()
      setWeatherData(data)
    } catch (err: any) {
      setError(err.message || "Error fetching weather data. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchWeatherByLocation = async (location: string) => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch weather data")
      }

      const data = await response.json()
      setWeatherData(data)
    } catch (err: any) {
      setError(err.message || "Error fetching weather data. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (location) {
      fetchWeatherByCoordinates(location.latitude, location.longitude)
    }
  }, [location])

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-sky-100 to-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-sky-800">Weather Outfit Recommender</h1>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full">
            <LocationSearch
              onSearch={fetchWeatherByLocation}
              onUseCurrentLocation={getLocation}
              isGeolocating={geoLoading}
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {geoError && (
          <Alert variant={geoError.includes("sandbox") || geoError.includes("iframe") ? "default" : "destructive"}>
            <Info className="h-4 w-4" />
            <AlertTitle>Location Notice</AlertTitle>
            <AlertDescription>{geoError}</AlertDescription>
          </Alert>
        )}

        {loading || geoLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : weatherData ? (
          <div className="grid gap-8 md:grid-cols-2">
            <WeatherDisplay data={weatherData} />
            <OutfitRecommendation weatherData={weatherData} />
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Enter your location or use your current location to get weather and outfit recommendations</p>
            <p className="mt-2 text-sm text-gray-400">
              Note: This app currently only supports locations in the United States.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

