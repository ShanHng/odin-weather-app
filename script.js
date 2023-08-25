async function getWeatherForecastData (searchKey) {
  const url = `http://api.weatherapi.com/v1/forecast.json?key=aadb07c391574a3fbe4110959231408&q=${searchKey}&days=3&aqi=no&alerts=no`
  const response = await fetch(url)
  const data = await response.json()
  console.log(data)
  return data
}

async function processJSONData (jsonData) {
  const data = await jsonData
  const processedData = {
    location: {
      name: data.location.name,
      region: data.location.region,
      country: data.location.country
    },
    current: {
      feelslike: data.current.feelslike_c,
      temp: data.current.temp_c,
      wind: data.current.wind,
      humidity: data.current.humidity,
      condition: data.current.condition,
      last_updated: data.current.last_updated
    },
    forecast: data.forecast.forecastday.map(data => {
      return {
        date: data.date,
        avghumidity: data.day.avghumidity,
        avgtemp: data.day.avgtemp_c,
        chance_of_rain: data.day.daily_chance_of_rain,
        maxtemp: data.day.maxtemp_c,
        mintemp: data.day.mintemp_c,
        condition: data.day.condition
      }
    })
  }
  console.log(processedData)
  return processedData
}
