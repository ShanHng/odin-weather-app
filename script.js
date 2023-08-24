async function getWeatherForecastData (searchKey) {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=aadb07c391574a3fbe4110959231408&q=${searchKey}&days=3&aqi=no&alerts=no`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
}

