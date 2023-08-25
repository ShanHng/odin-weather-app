const root = document.querySelector(':root')
const searchInput = document.querySelector('input#search-location')
const searchBtn = document.querySelector('.search-btn')
const searchResults = document.querySelector('.search-results')
const searchForm = document.querySelector('.search-bar-container')
const currentWeatherDisplay = document.querySelector('.current-weather-display')

async function getWeatherForecastData (searchKey) {
  const url = `http://api.weatherapi.com/v1/forecast.json?key=aadb07c391574a3fbe4110959231408&q=${searchKey}&days=3&aqi=no&alerts=no`
  const response = await fetch(url)
  const data = await response.json()
  console.log(data)
  return data
}

async function processJSONData (jsonData) {
  const data = await jsonData
  if (data.hasOwnProperty('error')) {
    throw new Error(data.error.message)
  }
  const processedData = {
    location: {
      name: data.location.name,
      region: data.location.region,
      country: data.location.country
    },
    current: {
      feelslike: data.current.feelslike_c,
      temp: data.current.temp_c,
      wind: data.current.wind_kph,
      uv: data.current.uv,
      precip: data.current.precip_mm,
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

async function displaySearchResults (dataAsync) {
  try {
    const data = await dataAsync
    const MESSAGE_FOUND = `${data.location.name} in ${data.location.country} is now: ${data.current.condition.text}`
    searchResults.textContent = MESSAGE_FOUND

    // to manipulate the pseudo-element
    root.style.setProperty(
      '--search-results-icon',
      `url(https:${data.current.condition.icon})`
    )
  } catch (err) {
    const MESSAGE_NOT_FOUND = `We cannot find any location with the name "${searchInput.value}". :<`
    console.log(err)
    searchResults.textContent = MESSAGE_NOT_FOUND
    root.style.setProperty('--search-results-icon', `url('')`)
  }
}

function createListItem (label, data) {
  const listItem = document.createElement('div')
  listItem.textContent = `${label} : ${data ?? 'Unavailable'}`
  return listItem
}

async function displayCurrentWeather (dataAsync) {
  try {
    const data = await dataAsync

    const nameOfPlace = createListItem('Name of Place', data.location.name)
    const region = createListItem('Region', data.location.region)
    const country = createListItem('Country', data.location.country)
    const feelsLike = createListItem('Feels like', data.current.feelslike)
    const temp = createListItem('Temperature (°C)', data.current.temp)
    const wind = createListItem('Wind speed (km per hour)', data.current.wind)
    const lastUpdate = createListItem('Last updated', data.current.last_updated)
    const precip = createListItem('Precipitation (mm)', data.current.precip)
    const uv = createListItem('UV Index', data.current.uv)

    currentWeatherDisplay.classList.add('visible')
    currentWeatherDisplay.append(
      nameOfPlace,
      region,
      country,
      feelsLike,
      temp,
      wind,
      precip,
      uv,
      lastUpdate
    )
  } catch (err) {}
}

function clearDisplay () {
  currentWeatherDisplay.innerHTML = ''
  currentWeatherDisplay.classList.remove('visible')
}

function handleSubmit_SearchForm (e) {
  e.preventDefault()
  clearDisplay()
  const searchKey = searchInput.value
  const data = getWeatherForecastData(searchKey)
  const processedData = processJSONData(data)
  displaySearchResults(processedData)
  displayCurrentWeather(processedData)
}

searchForm.addEventListener('submit', handleSubmit_SearchForm)
