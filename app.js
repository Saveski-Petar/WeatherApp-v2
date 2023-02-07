window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lon = position.coords.longitude;
      let lat = position.coords.latitude;

      const API_KEY = "884c167c7f4515c88d3c087286cf16b4";
      const URL_Geo = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

      const navbarData = async () => {
        try {
          const res = await fetch(URL_Geo);
          const data = await res.json();

          renderGeoData(data);
        } catch (error) {
          console.log(error);
        }
      };
      navbarData();
      // function

      const renderGeoData = (data) => {
        document.querySelector(".icon").innerHTML += `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon" />
        `;

        document.querySelector(".location-Name").innerHTML += `
        <h2>${data.name}</h2>
        `;

        document.querySelector(".desc-temp").innerHTML += `
        <p>${Math.round(data.main.temp)}°C </p>
            <p>${data.weather[0].description}</p>
        `;
      };
    });
  } else if (!navigator.geolocation) {
    console.log("12312");
  }
});

const homePage = {
  init: () => {
    const homeBtn = document.getElementById("home");
    homeBtn.addEventListener("click", () => {
      homePage.mainPage();
    });
  },
  mainPage: () => {
    const mainEl = document.querySelector("#main");
    const form = document.getElementById("locationInput");
    mainEl.innerHTML = "";
    mainEl.classList.remove("mainAboutMe");
    form.classList.remove("on-off");
  },
};

const searchedData = {
  init: () => {
    const search = document.getElementById("search");
    const btn = document.getElementById("search-Btn");
    search.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchedData.renderSearchData(search);
        search.value = "";
      }
    });
    btn.addEventListener("click", () => {
      searchedData.renderSearchData(search);
      search.value = "";
    });
  },
  renderSearchData: async (search) => {
    const geolocation_url = `http://api.openweathermap.org/geo/1.0/direct?q=${search.value}&limit=1&appid=884c167c7f4515c88d3c087286cf16b4`;

    try {
      const getLatLong = await fetch(geolocation_url);
      const data = await getLatLong.json();

      let lon = data[0].lon;
      let lat = data[0].lat;

      const fetchCityData = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=83cf676a48739fd57b023a3d32f2ef8b`
      );
      const cityData = await fetchCityData.json();
      searchedData.mainElcontent(cityData, data[0]);
      console.log(cityData);
    } catch (error) {
      console.log(error);
    }
  },

  mainElcontent: (data, dataName) => {
    const mainEl = document.querySelector("#main");
    mainEl.innerHTML = "";

    const firstRow = document.createElement("div");
    firstRow.classList.add("container-row1");
    mainEl.appendChild(firstRow);

    // ==========CURREN WEATHER CARD===================
    const currentWeatherEl = document.createElement("div");
    currentWeatherEl.classList.add("current-container");
    firstRow.appendChild(currentWeatherEl);
    currentWeatherEl.innerHTML += `
    <div class="current-card">
            <h3>${dataName.name}</h3>
            <div class="current-data-header">
              <p>${new Date(data.current.dt * 1000).toLocaleDateString(
                "en-US",
                {
                  weekday: "short",
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                }
              )}</p>
              <img src="https://openweathermap.org/img/wn/${
                data.current.weather[0].icon
              }@2x.png"   alt="icon" />
              <p>${data.current.weather[0].description}</p>
            </div>
            <div class="current-data-main">
              <p>Temp:${Math.round(data.current.temp)}°C</p>
              <p>feels like:${Math.round(data.current.feels_like)}°C</p>
            </div>
            <div class="current-data-footer">
              <p>Wind Speed:${Math.round(data.current.wind_speed)}km/h</p>
              <p>Humidity:${data.current.humidity}%</p>
            </div>
          </div>
    `;

    const upcomingForecastEl = document.createElement("div");
    upcomingForecastEl.classList.add("upcoming-Forecast-Container");
    firstRow.appendChild(upcomingForecastEl);
    const tittleForecast = document.createElement("h5");
    upcomingForecastEl.appendChild(
      tittleForecast
    ).innerHTML += `<h5>Upcoming Forecast</h5> `;

    const hourWeather = data.hourly.slice(0, 4);

    hourWeather.forEach((hour) => {
      upcomingForecastEl.innerHTML += `
          <div class="upcoming-card">
            <div class="upcoming-date-temp">
              <p>${new Date(hour.dt * 1000).toLocaleTimeString("en-US", {
                timeStyle: "short",
              })}</p>
              <p>Min:${Math.round(hour.temp.min)}°C / <span>Max:${Math.round(
        hour.temp.max
      )}°C</span></p>
            </div>
            <div class="upcoming-data-desc">
              <p>${hour.weather[0].description}</p>
            </div>
          </div>
    `;
    });

    const astroEl = document.createElement("div");
    astroEl.classList.add("astro-container");
    firstRow.appendChild(astroEl);
    astroEl.innerHTML += `
    <div class="sun-container">
            <div class="sunrise-data">
              <p>Sunrise</p>
              <p>${new Date(data.current.sunrise * 1000).toLocaleTimeString(
                "en-US",
                {
                  timeStyle: "short",
                }
              )}</p>
              <img src="./Assets/sunrise.png" alt="icon" />
            </div>
        

            <div class="sunset-data">
              <p>Sunset</p>
              <p>${new Date(data.current.sunset * 1000).toLocaleTimeString(
                "en-US",
                {
                  timeStyle: "short",
                }
              )}</p>
              <img src="./Assets/sunset.png" alt="icon" />
            </div>
          </div>
                 
    `;
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

    const secondRow = document.createElement("div");
    secondRow.classList.add("container-row2");
    mainEl.appendChild(secondRow);
    const secondRowTittle = document.createElement("h5");
    secondRow.appendChild(secondRowTittle).innerHTML += `
    <h5>Next couple of days Forecast</h5>
    `;
    const dailyDataContainer = document.createElement("div");
    dailyDataContainer.classList.add("daily-container");
    secondRow.appendChild(dailyDataContainer);

    const dailyDataArr = data.daily.slice(0, 6);

    dailyDataArr.forEach((day) => {
      dailyDataContainer.innerHTML += `
          <div class="daily-card">
            <p>${new Date(day.dt * 1000).toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}</p>
            <img src="http://openweathermap.org/img/wn/${
              day.weather[0].icon
            }@2x.png" alt="icon" />
            <p>${day.weather[0].description}</p>
            <p>Min:${Math.round(day.temp.min)}°C / <span>Max:${Math.round(
        day.temp.max
      )}°C</span></p>
            <p>Humidity:${day.humidity}%</p>
          </div>
`;
    });
  },
};

const aboutMePage = {
  init: () => {
    const aboutMeBtn = document.getElementById("aboutMe");
    aboutMeBtn.addEventListener("click", () => {
      aboutMePage.aboutMePageData();
    });
  },
  aboutMePageData: () => {
    const mainEl = document.querySelector("#main");
    const form = document.getElementById("locationInput");
    mainEl.classList.add("mainAboutMe");
    form.classList.add("on-off");
    mainEl.innerHTML = "";

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
    `;
  },
};

// Calling FUNCTIONS
homePage.init();
searchedData.init();
aboutMePage.init();
