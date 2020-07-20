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
  let fahrenheitTemperature = (celsiusTemp * 9) / 5 + 32;
  temptElement.innerHTML = Math.round(fahrenheitTemperature);
  let realFeelElement = document.querySelector("#real-feel-tempt");
  let realFeelTemperature = (celciusRealFeel * 9) / 5 + 32;
  realFeelElement.innerHTML = Math.round(realFeelTemperature);

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
}

let celsiusLinkButton = document.querySelector("#celsius");
celsiusLinkButton.addEventListener("click", celsiusChange);

let celsiusTemp = null;
let celciusRealFeel = null;

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
  celsiusTemp = response.data.main.temp;
  celciusRealFeel = response.data.main.feels_like;
  document.querySelector("#city-name").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(celsiusTemp);

  document.querySelector("#real-feel-tempt").innerHTML = Math.round(
    celciusRealFeel
  );

  let dayModeElement = document.querySelector("#day-mode");
  let dayMode = response.data.weather[0].description;
  dayModeElement.innerHTML = dayMode.charAt(0).toUpperCase() + dayMode.slice(1);
  console.log(response);
}

function searchCity(city) {
  let apiUrlCity = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrlCity).then(searchCityElement);
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
