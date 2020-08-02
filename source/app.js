function formatDateTIme(timestamp) {
  let now = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let date = now.getDate();

  return `${day}, ${date} ${month} ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let now = new Date(timestamp);
  let hours = now.getHours();
  let min = now.getMinutes();

  if (min < 10) {
    min = `0` + min;
  } else {
    min = min + ``;
  }

  if (hours < 10) {
    hours = `0` + hours;
  } else {
    hours = hours + "";
  }

  return `${hours}:${min}`;
}

// Fahrenheit button

function fahrenheitChange(event) {
  event.preventDefault();
  let temptElement = document.querySelector("#temperature");
  let fahrenheitTemperature = (celsiusTemp * 9) / 5 + 32;
  temptElement.innerHTML = Math.round(fahrenheitTemperature);
  let realFeelElement = document.querySelector("#real-feel-tempt");
  let realFeelTemperature = (celciusRealFeel * 9) / 5 + 32;
  realFeelElement.innerHTML = Math.round(realFeelTemperature);

  let forecastItems = document.querySelectorAll(".other-temperature");

  forecastItems.forEach(function (item, index) {
    item.innerHTML = `${Math.round((otherCelsiusTemp[index] * 9) / 5 + 32)}˚`;
  });

  fahrenheitLinkButton.classList.add("active");
  celsiusLinkButton.classList.remove("active");
}

let fahrenheitLinkButton = document.querySelector("#fahrenheit");
fahrenheitLinkButton.addEventListener("click", fahrenheitChange);

// celsius button

function celsiusChange(event) {
  event.preventDefault();
  celsiusLinkButton.classList.add("active");
  fahrenheitLinkButton.classList.remove("active");
  let temptElement = document.querySelector("#temperature");
  temptElement.innerHTML = Math.round(celsiusTemp);

  let realFeelElement = document.querySelector("#real-feel-tempt");
  realFeelElement.innerHTML = Math.round(celciusRealFeel);

  let forecastItems = document.querySelectorAll(".other-temperature");

  forecastItems.forEach(function (item, index) {
    item.innerHTML = `${Math.round(otherCelsiusTemp[index])}˚`;
  });
}

let celsiusLinkButton = document.querySelector("#celsius");
celsiusLinkButton.addEventListener("click", celsiusChange);

let celsiusTemp = null;
let celciusRealFeel = null;
let otherCelsiusTemp = [];

// api data

let apiKey = "6fc8ce6b2ba7060eef7f6f255898843a";
let apiEndpoint = "https://api.openweathermap.org/data/2.5/";
let units = "metric";

// html changes for city

function searchCityElement(response) {
  celsiusTemp = response.data.main.temp;
  celciusRealFeel = response.data.main.feels_like;

  document.querySelector("#city-name").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(celsiusTemp);

  document.querySelector("#real-feel-tempt").innerHTML = Math.round(
    celciusRealFeel
  );
  document.querySelector(
    "h5#current-day-information"
  ).innerHTML = formatDateTIme(response.data.dt * 1000);
  let dayModeElement = document.querySelector("#day-mode");
  let dayMode = response.data.weather[0].description;
  dayModeElement.innerHTML = dayMode.charAt(0).toUpperCase() + dayMode.slice(1);
  console.log(response);
  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

// current location
function currentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrlLat = `${apiEndpoint}weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  console.log(position);

  axios.get(apiUrlLat).then(searchCityElement);

  apiUrlLat = `${apiEndpoint}forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  console.log(position);
  axios.get(apiUrlLat).then(displayForecast);
}

function homePosition() {
  navigator.geolocation.getCurrentPosition(currentPosition);
}

let homeLocation = document.querySelector("#home-button");
homeLocation.addEventListener("click", homePosition);

// display Forecast

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  console.log(response);
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index];
    otherCelsiusTemp[index] = forecast.main.temp;
    forecastElement.innerHTML += `
    <div class="col columns">
              <p class="other-time">
                ${formatHours(forecast.dt * 1000)}
              </p>

             
                <img src="http://openweathermap.org/img/wn/${
                  forecast.weather[0].icon
                }@2x.png" class="small-weather-icon"> </img>
             

              <p class="other-temperature" id="other-temperature">
                ${Math.round(forecast.main.temp)}˚
              </p>
            </div>`;
  }
}

// search city

function searchCity(city) {
  let apiUrlCity = `${apiEndpoint}weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrlCity).then(searchCityElement);

  apiUrlCity = `${apiEndpoint}forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrlCity).then(displayForecast);
}

function submitCity(event) {
  event.preventDefault();
  let newCity = document.querySelector("#search-city-input");
  searchCity(newCity.value);
  newCity.value = "";
}

let newCity = document.querySelector("#city-form");
newCity.addEventListener("submit", submitCity);

searchCity("Hamburg");
