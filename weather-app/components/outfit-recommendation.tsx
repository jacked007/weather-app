import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shirt, Umbrella, Wind, Sun, Thermometer, Droplets, CloudSnow } from "lucide-react"
import Image from "next/image"

interface OutfitRecommendationProps {
  weatherData: any
}

export function OutfitRecommendation({ weatherData }: OutfitRecommendationProps) {
  const getClothingRecommendations = () => {
    const { temperature, condition, windSpeed, humidity } = weatherData
    const conditionLower = condition.toLowerCase()
    const isRaining =
      conditionLower.includes("rain") || conditionLower.includes("shower") || conditionLower.includes("drizzle")
    const isSnowing = conditionLower.includes("snow") || conditionLower.includes("flurries")
    const isWindy = windSpeed > 15
    const isHumid = humidity > 70
    const isSunny = conditionLower.includes("sunny") || conditionLower.includes("clear")

    // Base layers based on temperature
    let topLayer = ""
    let bottomLayer = ""
    const accessories = []
    let topImage = ""
    let bottomImage = ""
    const accessoryImages = []

    // Temperature-based recommendations
    if (temperature < 32) {
      topLayer = "Heavy winter coat, thermal shirt, sweater"
      bottomLayer = "Thermal underwear, heavy pants"
      accessories.push("Warm hat", "Gloves", "Scarf", "Insulated boots")
      topImage = "/placeholder.svg?height=150&width=150"
      bottomImage = "/placeholder.svg?height=150&width=150"
      accessoryImages.push(
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
        "/placeholder.svg?height=100&width=100",
      )
    } else if (temperature < 45) {
      topLayer = "Winter coat or heavy jacket, sweater"
      bottomLayer = "Jeans or warm pants"
      accessories.push("Light gloves", "Hat")
      topImage = "https://v0.blob.com/winter-coat.jpg"
      bottomImage = "https://v0.blob.com/jeans.jpg"
      accessoryImages.push("https://v0.blob.com/gloves.jpg", "https://v0.blob.com/beanie.jpg")
    } else if (temperature < 60) {
      topLayer = "Light jacket or heavy sweater"
      bottomLayer = "Pants or jeans"
      accessories.push("Light scarf (optional)")
      topImage = "https://v0.blob.com/light-jacket.jpg"
      bottomImage = "https://v0.blob.com/pants.jpg"
      accessoryImages.push("https://v0.blob.com/scarf.jpg")
    } else if (temperature < 75) {
      topLayer = "Long-sleeve shirt or light sweater"
      bottomLayer = "Pants, jeans, or skirt with leggings"
      topImage = "https://v0.blob.com/long-sleeve.jpg"
      bottomImage = "https://v0.blob.com/pants.jpg"
    } else if (temperature < 85) {
      topLayer = "T-shirt or short-sleeve shirt"
      bottomLayer = "Shorts, skirt, or light pants"
      topImage = "https://v0.blob.com/tshirt.jpg"
      bottomImage = "https://v0.blob.com/shorts.jpg"
    } else {
      topLayer = "Light, breathable t-shirt or tank top"
      bottomLayer = "Shorts or light skirt"
      accessories.push("Hat for sun protection")
      topImage = "https://v0.blob.com/tank-top.jpg"
      bottomImage = "https://v0.blob.com/shorts.jpg"
      accessoryImages.push("https://v0.blob.com/sun-hat.jpg")
    }

    // Weather condition adjustments
    if (isRaining) {
      accessories.push("Raincoat or waterproof jacket", "Umbrella", "Waterproof shoes")
      accessoryImages.push(
        "https://v0.blob.com/raincoat.jpg",
        "https://v0.blob.com/umbrella.jpg",
        "https://v0.blob.com/waterproof-shoes.jpg",
      )
    }

    if (isSnowing) {
      accessories.push("Waterproof boots", "Waterproof gloves")
      accessoryImages.push("https://v0.blob.com/snow-boots.jpg", "https://v0.blob.com/waterproof-gloves.jpg")
    }

    if (isWindy) {
      accessories.push("Windbreaker (if not already wearing a jacket)")
      accessoryImages.push("https://v0.blob.com/windbreaker.jpg")
    }

    if (isHumid && temperature > 70) {
      topLayer = "Light, breathable clothing"
      accessories.push("Consider moisture-wicking fabrics")
      topImage = "https://v0.blob.com/breathable-shirt.jpg"
    }

    return {
      topLayer,
      bottomLayer,
      accessories,
      topImage,
      bottomImage,
      accessoryImages,
    }
  }

  const getWeatherTips = () => {
    const { temperature, condition, windSpeed, humidity, uvIndex } = weatherData
    const conditionLower = condition.toLowerCase()
    const isRaining =
      conditionLower.includes("rain") || conditionLower.includes("shower") || conditionLower.includes("drizzle")
    const isSnowing = conditionLower.includes("snow") || conditionLower.includes("flurries")
    const isWindy = windSpeed > 15
    const isHumid = humidity > 70
    const isSunny = conditionLower.includes("sunny") || conditionLower.includes("clear")

    const tips = []

    // Temperature-based tips
    if (temperature < 32) {
      tips.push({
        icon: <Thermometer className="h-4 w-4 text-blue-600" />,
        text: "Extreme cold! Limit time outdoors and dress in multiple layers to trap heat.",
      })
    } else if (temperature < 45) {
      tips.push({
        icon: <Thermometer className="h-4 w-4 text-blue-500" />,
        text: "Dress in layers that you can remove as needed if you warm up during the day.",
      })
    } else if (temperature > 85) {
      tips.push({
        icon: <Thermometer className="h-4 w-4 text-red-500" />,
        text: "Stay hydrated and seek shade during peak sun hours (10am-4pm).",
      })
    }

    // Condition-based tips
    if (isRaining) {
      tips.push({
        icon: <Umbrella className="h-4 w-4 text-sky-600" />,
        text: "Don't forget your umbrella and consider waterproof footwear to keep your feet dry.",
      })
    }

    if (isSnowing) {
      tips.push({
        icon: <CloudSnow className="h-4 w-4 text-sky-300" />,
        text: "Wear waterproof boots with good traction to prevent slipping on snow and ice.",
      })
    }

    if (isWindy) {
      tips.push({
        icon: <Wind className="h-4 w-4 text-sky-600" />,
        text: "It's quite windy today. Secure loose items and wear close-fitting clothes to reduce wind chill.",
      })
    }

    if (isSunny && temperature > 70) {
      tips.push({
        icon: <Sun className="h-4 w-4 text-yellow-500" />,
        text: "Wear a hat and apply sunscreen to protect your skin from UV rays.",
      })
    }

    if (isHumid && temperature > 70) {
      tips.push({
        icon: <Droplets className="h-4 w-4 text-blue-500" />,
        text: "High humidity makes it feel hotter. Wear light, loose-fitting clothes that breathe well.",
      })
    }

    // If we have UV index data
    if (uvIndex !== undefined) {
      if (uvIndex >= 6) {
        tips.push({
          icon: <Sun className="h-4 w-4 text-orange-500" />,
          text: `High UV index (${uvIndex}). Wear sunscreen, sunglasses, and protective clothing.`,
        })
      } else if (uvIndex >= 3) {
        tips.push({
          icon: <Sun className="h-4 w-4 text-yellow-500" />,
          text: `Moderate UV index (${uvIndex}). Consider wearing sunscreen when outdoors.`,
        })
      }
    }

    // If no specific tips, provide a general one
    if (tips.length === 0) {
      tips.push({
        icon: <Shirt className="h-4 w-4 text-sky-600" />,
        text: "Dress in layers to adjust to changing temperatures throughout the day.",
      })
    }

    return tips.slice(0, 3) // Return up to 3 tips
  }

  const recommendations = getClothingRecommendations()
  const weatherTips = getWeatherTips()

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shirt className="h-5 w-5" />
          Outfit Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 flex-grow">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1">
            <h3 className="font-medium mb-1">Top</h3>
            <p className="text-gray-700">{recommendations.topLayer}</p>
          </div>
          {recommendations.topImage && (
            <div className="w-[150px] h-[150px] relative rounded-md overflow-hidden border border-gray-200">
              <Image
                src={recommendations.topImage || "/placeholder.svg"}
                alt="Recommended top"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1">
            <h3 className="font-medium mb-1">Bottom</h3>
            <p className="text-gray-700">{recommendations.bottomLayer}</p>
          </div>
          {recommendations.bottomImage && (
            <div className="w-[150px] h-[150px] relative rounded-md overflow-hidden border border-gray-200">
              <Image
                src={recommendations.bottomImage || "/placeholder.svg"}
                alt="Recommended bottom"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {recommendations.accessories.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Accessories & Additional Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations.accessories.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {recommendations.accessoryImages[index] && (
                    <div className="w-[60px] h-[60px] relative rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                      <Image
                        src={recommendations.accessoryImages[index] || "/placeholder.svg"}
                        alt={item}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto p-3 bg-sky-50 rounded-md border border-sky-100">
          <h3 className="font-medium text-sky-800 mb-2">Weather Tips</h3>
          <div className="space-y-2">
            {weatherTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="mt-0.5">{tip.icon}</div>
                <p className="text-sm text-gray-700">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

