window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lon = position.coords.longitude
      let lat = position.coords.latitude

      const API_KEY = '884c167c7f4515c88d3c087286cf16b4'
      const URL_Geo = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`

      const navbarData = async () => {
        try {
          const res = await fetch(URL_Geo)
          const data = await res.json()

          renderGeoData(data)
        } catch (error) {
          console.log(error)
        }
      }
      navbarData()
      // function

      const renderGeoData = (data) => {
        document.querySelector('.icon').innerHTML += `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon" />
        `

        document.querySelector('.location-Name').innerHTML += `
        <h2>${data.name}</h2>
        `

        document.querySelector('.desc-temp').innerHTML += `
        <p>${Math.round(data.main.temp)}°C </p>
            <p>${data.weather[0].description}</p>
        `
      }
    })
  }
})

const homePage = {
  init: () => {
    const homeBtn = document.getElementById('home')
    homeBtn.addEventListener('click', () => {
      homePage.mainPage()
    })
  },
  mainPage: () => {
    const mainEl = document.querySelector('#main')
    const form = document.getElementById('locationInput')
    mainEl.innerHTML = ''
    mainEl.classList.remove('mainAboutMe')
    form.classList.remove('on-off')
  },
}

const searchedData = {
  init: () => {
    const search = document.getElementById('search')
    const btn = document.getElementById('search-Btn')
    search.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchedData.renderSearchData(search)
        search.value = ''
      }
    })
    btn.addEventListener('click', () => {
      searchedData.renderSearchData(search)
      search.value = ''
    })
  },
  renderSearchData: async (search) => {
    const api_current =
      'https://api.openweathermap.org/data/2.5/weather?q=' +
      search.value +
      '&units=metric&appid=884c167c7f4515c88d3c087286cf16b4'
    const api_Forecast_hour = `https://api.openweathermap.org/data/2.5/forecast?q=${search.value}&units=metric&appid=884c167c7f4515c88d3c087286cf16b4`
    const api_Forecast_daily = `https://api.weatherapi.com/v1/forecast.json?key=598826decd244495ad3132455230502&q=${search.value}&days=6&aqi=no&alerts=no`
    try {
      const [res1, res2, res3] = await Promise.all([
        fetch(api_current),
        fetch(api_Forecast_hour),
        fetch(api_Forecast_daily),
      ])
      const data1 = await res1.json()
      const data2 = await res2.json()
      const data3 = await res3.json()

      searchedData.mainElcontent(data1, data2, data3.forecast)
    } catch (error) {
      console.log(error)
    }
  },

  mainElcontent: (data1, data2, data3) => {
    const mainEl = document.querySelector('#main')
    mainEl.innerHTML = ''

    const firstRow = document.createElement('div')
    firstRow.classList.add('container-row1')
    mainEl.appendChild(firstRow)

    // ==========CURREN WEATHER CARD===================
    const currentWeatherEl = document.createElement('div')
    currentWeatherEl.classList.add('current-container')
    firstRow.appendChild(currentWeatherEl)
    currentWeatherEl.innerHTML += `
    <div class="current-card">
            <h3>${data1.name}</h3>
            <div class="current-data-header">
              <p>${new Date(data1.dt * 1000).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              })}</p>
              <img src="https://openweathermap.org/img/wn/${
                data1.weather[0].icon
              }@2x.png"   alt="icon" />
              <p>${data1.weather[0].description}</p>
            </div>
            <div class="current-data-main">
              <p>Temp:${Math.round(data1.main.temp)}°C</p>
              <p>feels like:${Math.round(data1.main.feels_like)}°C</p>
            </div>
            <div class="current-data-footer">
              <p>Wind Speed:${Math.round(data1.wind.speed)}km/h</p>
              <p>Humidity:${data1.main.humidity}%</p>
            </div>
          </div>
    `

    const upcomingForecastEl = document.createElement('div')
    upcomingForecastEl.classList.add('upcoming-Forecast-Container')
    firstRow.appendChild(upcomingForecastEl)
    const tittleForecast = document.createElement('h5')
    upcomingForecastEl.appendChild(
      tittleForecast
    ).innerHTML += `<h5>Upcoming Forecast</h5> `

    const hourWeather = data2.list.slice(0, 4)

    hourWeather.forEach((hour) => {
      upcomingForecastEl.innerHTML += `
          <div class="upcoming-card">
            <div class="upcoming-date-temp">
              <p>${new Date(hour.dt * 1000).toLocaleTimeString('en-US', {
                timeStyle: 'short',
              })}</p>
              <p>Min:${Math.round(
                hour.main.temp_min
              )}°C / <span>Max:${Math.round(hour.main.temp_max)}°C</span></p>
            </div>
            <div class="upcoming-data-desc">
              <p>${hour.weather[0].description}</p>
            </div>
          </div>
    `
    })

    const astroEl = document.createElement('div')
    astroEl.classList.add('astro-container')
    firstRow.appendChild(astroEl)
    astroEl.innerHTML += `
    <div class="sun-container">
            <div class="sunrise-data">
              <p>Sunrise</p>
              <p>${new Date(data2.city.sunrise * 1000).toLocaleTimeString(
                'en-US',
                {
                  timeStyle: 'short',
                }
              )}</p>
              <img src="./Assets/sunrise.png" alt="icon" />
            </div>
        

            <div class="sunset-data">
              <p>Sunset</p>
              <p>${new Date(data2.city.sunset * 1000).toLocaleTimeString(
                'en-US',
                {
                  timeStyle: 'short',
                }
              )}</p>
              <img src="./Assets/sunset.png" alt="icon" />
            </div>
          </div>
                 
    `
    // =============MAYBE===========================
    // <div class="moon-container">
    //       <div class="moonrise-data">
    //         <p>moonrise</p>
    //         <p>${data3.forecastday[0].astro.moonrise}</p>
    //         <img src="./Assets/moonrise.png" alt="icon" />
    //       </div>
    //       <div class="moonset-data">
    //         <p>moonset</p>
    //         <p>${data3.forecastday[0].astro.moonset}</p>
    //         <img src="./Assets/moonset.png" alt="icon" />
    //       </div>
    //     </div>
    // ==============================================

    const secondRow = document.createElement('div')
    secondRow.classList.add('container-row2')
    mainEl.appendChild(secondRow)
    const secondRowTittle = document.createElement('h5')
    secondRow.appendChild(secondRowTittle).innerHTML += `
    <h5>Next couple of days Forecast</h5>
    `
    const dailyDataContainer = document.createElement('div')
    dailyDataContainer.classList.add('daily-container')
    secondRow.appendChild(dailyDataContainer)

    data3.forecastday.forEach((day) => {
      dailyDataContainer.innerHTML += `
          <div class="daily-card">
            <p>${new Date(day.date_epoch * 1000).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            })}</p>
            <img src="${day.day.condition.icon}" alt="icon" />
            <p>${day.day.condition.text}</p>
            <p>Min:${Math.round(day.day.mintemp_c)}°C / <span>Max:${Math.round(
        day.day.maxtemp_c
      )}°C</span></p>
            <p>Humidity:${day.day.avghumidity}%</p>
          </div>
`
    })
  },
}

const aboutMePage = {
  init: () => {
    const aboutMeBtn = document.getElementById('aboutMe')
    aboutMeBtn.addEventListener('click', () => {
      aboutMePage.aboutMePageData()
    })
  },
  aboutMePageData: () => {
    const mainEl = document.querySelector('#main')
    const form = document.getElementById('locationInput')
    mainEl.classList.add('mainAboutMe')
    form.classList.add('on-off')
    mainEl.innerHTML = ''

    mainEl.innerHTML += `
    <div class='container'>
     <div class="contanct_Me_Container">
          <div class="contact-links">
            <a href="https://github.com/Saveski-Petar" class="btn">
              <i class="fab fa-github"></i>
            </a>
            <a href="#" class="btn">
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.instagram.com/saveski.petar/" class="btn">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="btn">
              <i class="fab fa-twitter"></i>
            </a>
          </div>
        </div>
        <div class="main_Content_Container">
          <div class="about_Me_Container">
            <h2>Name</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti
              eius nesciunt ipsum, in, aliquid magni vitae, nulla cupiditate
              corrupti labore autem debitis facilis inventore similique! Debitis
              alias facilis in dolores.
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti
              eius nesciunt ipsum, in, aliquid magni vitae, nulla cupiditate
              corrupti labore autem debitis facilis inventore similique! Debitis
              alias facilis in dolores.
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti
              eius nesciunt ipsum, in, aliquid magni vitae, nulla cupiditate
              corrupti labore autem debitis facilis inventore similique! Debitis
              alias facilis in dolores.
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti
              eius nesciunt ipsum, in, aliquid magni vitae, nulla cupiditate
              corrupti labore autem debitis facilis inventore similique! Debitis
              alias facilis in dolores.
            </p>
          </div>
          <div class="image_of_me">
            <img src="./Assets/01.jpg" alt="" />
          </div>
        </div>
      </div>  
    `
  },
}

// FUNCTIONS
homePage.init()
searchedData.init()
aboutMePage.init()
