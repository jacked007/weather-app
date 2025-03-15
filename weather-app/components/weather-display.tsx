import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, CloudRain, CloudSnow, Droplets, Sun, Wind, CloudFog, CloudLightning, CloudDrizzle } from "lucide-react"

interface WeatherDisplayProps {
  data: any
}

export function WeatherDisplay({ data }: WeatherDisplayProps) {
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase()

    if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
      return <Sun className="h-12 w-12 text-yellow-500" />
    } else if (conditionLower.includes("rain") || conditionLower.includes("shower")) {
      return <CloudRain className="h-12 w-12 text-blue-500" />
    } else if (conditionLower.includes("snow") || conditionLower.includes("flurries")) {
      return <CloudSnow className="h-12 w-12 text-sky-200" />
    } else if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
      return <Cloud className="h-12 w-12 text-gray-400" />
    } else if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
      return <CloudFog className="h-12 w-12 text-gray-400" />
    } else if (conditionLower.includes("thunder") || conditionLower.includes("lightning")) {
      return <CloudLightning className="h-12 w-12 text-purple-500" />
    } else if (conditionLower.includes("drizzle")) {
      return <CloudDrizzle className="h-12 w-12 text-blue-400" />
    } else {
      return <Sun className="h-12 w-12 text-yellow-500" />
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Current Weather</span>
          <Badge variant="outline">{data.location}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 flex-grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(data.condition)}
            <div>
              <p className="text-3xl font-bold">{data.temperature}°F</p>
              <p className="text-gray-500">{data.condition}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Feels like</p>
            <p className="font-medium">{data.feelsLike}°F</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Humidity</p>
              <p className="font-medium">{data.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Wind</p>
              <p className="font-medium">{data.windSpeed} mph</p>
            </div>
          </div>
        </div>

        {data.uvIndex && (
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">UV Index</p>
              <p className="font-medium">
                {data.uvIndex < 3 ? "Low" : data.uvIndex < 6 ? "Moderate" : data.uvIndex < 8 ? "High" : "Very High"}
                {data.uvIndex && ` (${data.uvIndex})`}
              </p>
            </div>
          </div>
        )}

        <div className="mt-auto">
          <h3 className="font-medium mb-2">Forecast</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            {data.forecast.map((day: any, index: number) => (
              <div key={index} className="p-2 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-500">{day.day}</p>
                <div className="flex justify-center my-1">{getWeatherIcon(day.condition)}</div>
                <p className="text-sm font-medium">
                  {day.high}° / {day.low}°
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

