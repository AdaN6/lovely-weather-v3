let now = new Date();

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

let h5 = document.querySelector("h5#current-day-information");
h5.innerHTML = `${day}, ${date} ${month} ${hours}:${min}`;

// Fahrenheit button

function fahrenheitChange(event) {
  event.preventDefault();
  let temptElement = document.querySelector("#temperature");
  let temperature = temptElement.innerHTML;
  temperature = Number(temperature);
  temptElement.innerHTML = Math.round((temperature * 9) / 5 + 32);
  let realFeelElement = document.querySelector("#real-feel-tempt");
  let realFeelTemp = realFeelElement.innerHTML;
  realFeelTemp = Number(realFeelTemp);
  realFeelElement.innerHTML = Math.round((realFeelTemp * 9) / 5 + 32);
}

let fahrenheitButton = document.querySelector("#fahrenheit");
fahrenheitButton.addEventListener("click", fahrenheitChange);

// celsius button

function celsiusChange(event) {
  event.preventDefault();
  let temptElement = document.querySelector("#temperature");
  let temperature = temptElement.innerHTML;
  temperature = Number(temperature);
  temptElement.innerHTML = Math.round(((temperature - 32) * 5) / 9);
  let realFeelElement = document.querySelector("#real-feel-tempt");
  let realFeelTemp = realFeelElement.innerHTML;
  realFeelTemp = Number(realFeelTemp);
  realFeelElement.innerHTML = Math.round(((realFeelTemp - 32) * 5) / 9);
}

let celsiusButton = document.querySelector("#celsius");
celsiusButton.addEventListener("click", celsiusChange);

// home button

let apiKey = "6fc8ce6b2ba7060eef7f6f255898843a";
let apiEndpoint = "http://api.openweathermap.org/data/2.5/weather";
let units = "metric";

function currentCity(response) {
  let currentTemp = Math.round(response.data.main.temp);
  let cityTemp = document.querySelector("#temperature");
  cityTemp.innerHTML = currentTemp;
  let realFeelTemp = Math.round(response.data.main.feels_like);
  let realFeelElement = document.querySelector("#real-feel-tempt");
  realFeelElement.innerHTML = realFeelTemp;
  console.log(response);
  let currentCityName = document.querySelector("#city-name");
  currentCityName.innerHTML = response.data.name;
  let dayModeElement = document.querySelector("#day-mode");
  let dayMode = response.data.weather[0].description;
  dayModeElement.innerHTML = dayMode.charAt(0).toUpperCase() + dayMode.slice(1);
}

function currentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrlLat = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  console.log(position);

  axios.get(apiUrlLat).then(currentCity);
}

function homePosition() {
  navigator.geolocation.getCurrentPosition(currentPosition);
}

let homeLocation = document.querySelector("#home-button");
homeLocation.addEventListener("click", homePosition);

// search city

function searchCityElement(response) {
  let currentTemp = Math.round(response.data.main.temp);
  let cityTemp = document.querySelector("#temperature");
  cityTemp.innerHTML = currentTemp;
  let realFeelTemp = Math.round(response.data.main.feels_like);
  let realFeelElement = document.querySelector("#real-feel-tempt");
  realFeelElement.innerHTML = realFeelTemp;
  let dayModeElement = document.querySelector("#day-mode");
  let dayMode = response.data.weather[0].description;
  dayModeElement.innerHTML = dayMode.charAt(0).toUpperCase() + dayMode.slice(1);
  console.log(response);
}

function searchCity(event) {
  event.preventDefault();
  let newCity = document.querySelector("#search-city-input");
  let newCityName = newCity.value;
  let cityName = document.querySelector("#city-name");
  cityName.innerHTML =
    newCityName.charAt(0).toUpperCase() + newCityName.slice(1);
  newCity.value = "";
  let apiUrlCity = `${apiEndpoint}?q=${newCityName}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrlCity).then(searchCityElement);
}

let newCity = document.querySelector("#city-form");
newCity.addEventListener("submit", searchCity);
