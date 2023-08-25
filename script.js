const root = document.querySelector(':root')
const searchInput = document.querySelector('input#search-location')
const searchBtn = document.querySelector('.search-btn')
const searchResults = document.querySelector('.search-results')
const searchForm = document.querySelector('.search-bar-container')
const currentWeatherDisplay = document.querySelector('.current-weather-display')
const weatherForecastContainer = document.querySelector(
  '.weather-forecast-container'
)
const weatherForecastDisplay = document.querySelector(
  '.weather-forecast-display'
)
const loader = document.querySelector('.loader')
const body = document.querySelector('body')

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

    currentWeatherDisplay.classList.remove('hidden')
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
  currentWeatherDisplay.classList.add('hidden')
  weatherForecastDisplay.innerHTML = ''
  weatherForecastContainer.classList.add('hidden')
}

function forecastDisplayItemFactory (data) {
  const icon = document.createElement('img')
  icon.className = 'forecast-item-icon'
  icon.src = `https:${data.condition.icon}`

  const item = document.createElement('div')
  item.className = 'forecast-item'

  const date = document.createElement('div')
  date.className = 'forecast-item-date'
  date.textContent = data.date

  const condition = document.createElement('div')
  condition.className = 'forecast-item-condition'
  condition.textContent = data.condition.text

  const maxTemp = createListItem('Maximum temp (°C)', data.maxtemp)
  const minTemp = createListItem('Minimum temp (°C)', data.mintemp)
  const avgTemp = createListItem('Average temp (°C)', data.avgtemp)
  const avgHumidity = createListItem('Average humidity', data.avghumidity)
  const chanceOfRain = createListItem(
    'Chance of rain',
    `${data.chance_of_rain}%`
  )

  item.append(
    icon,
    date,
    condition,
    maxTemp,
    minTemp,
    avgTemp,
    avgHumidity,
    chanceOfRain
  )

  return item
}

async function displayWeatherForecast (dataAsync) {
  try {
    const data = await dataAsync
    const forecastDisplayItems = data.forecast
      .map(forecastDisplayItemFactory)
      .forEach(item => weatherForecastDisplay.appendChild(item))
    weatherForecastContainer.classList.remove('hidden')
  } catch (error) {}
}

function handleSubmit_SearchForm (e) {
  e.preventDefault()
  clearDisplay()
  showLoader()
  const searchKey = searchInput.value
  const data = getWeatherForecastData(searchKey)
  const processedData = processJSONData(data)
  displaySearchResults(processedData)
  displayCurrentWeather(processedData)
  displayWeatherForecast(processedData)
  processedData.then(hideLoader).catch(hideLoader)
}

function showLoader () {
  loader.classList.remove('hidden')
}

function hideLoader () {
  loader.classList.add('hidden')
}

searchForm.addEventListener('submit', handleSubmit_SearchForm)
window.addEventListener('load', () => {
  console.log('load')
  loader.classList.add('hidden')
})
window.addEventListener('unload', () => {
  console.log('unload')
  loader.classList.remove('hidden')
})
