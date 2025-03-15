"use client"

import { useState } from "react"

interface GeolocationPosition {
  latitude: number
  longitude: number
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationPosition | null>(null)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setError("")
    setLoading(true)

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setLoading(false)
        },
        (error) => {
          let errorMessage = "An unknown error occurred"

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please allow location access in your browser settings."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable"
              break
            case error.TIMEOUT:
              errorMessage = "The request to get user location timed out"
              break
          }

          // Check for the specific iframe permissions policy error
          if (error.message && error.message.includes("permissions policy")) {
            errorMessage =
              "Geolocation is disabled in this environment. This may be because the app is running in a sandbox or iframe. Please enter your location manually."
          }

          setError(errorMessage)
          setLoading(false)
          console.error("Geolocation error:", error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } catch (e) {
      // Catch any unexpected errors
      setError("Unexpected error accessing geolocation. Please enter your location manually.")
      setLoading(false)
      console.error("Unexpected geolocation error:", e)
    }
  }

  return { location, error, loading, getLocation }
}

