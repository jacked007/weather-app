"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Loader2 } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

interface LocationSuggestion {
  text: string
  magicKey: string
  isCollection: boolean
}

interface LocationSearchProps {
  onSearch: (location: string) => void
  onUseCurrentLocation: () => void
  isGeolocating?: boolean
}

export function LocationSearch({ onSearch, onUseCurrentLocation, isGeolocating = false }: LocationSearchProps) {
  const [location, setLocation] = useState("")
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debouncedLocation = useDebounce(location, 300)

  useEffect(() => {
    if (debouncedLocation.length < 3) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/location-suggestions?query=${encodeURIComponent(debouncedLocation)}`)
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data.suggestions)
        }
      } catch (error) {
        console.error("Error fetching location suggestions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedLocation])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.trim()) {
      onSearch(location.trim())
      setShowSuggestions(false)
    }
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setLocation(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Enter city, state or zip code"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            className="pl-9"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
          )}
        </div>

        {/* Simple suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => handleSuggestionSelect(suggestion.text)}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {suggestion.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Button type="submit">Get Weather</Button>
      <Button type="button" variant="outline" onClick={onUseCurrentLocation} disabled={isGeolocating}>
        {isGeolocating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Locating...
          </>
        ) : (
          <>
            <MapPin className="mr-2 h-4 w-4" />
            Use My Location
          </>
        )}
      </Button>
    </form>
  )
}

