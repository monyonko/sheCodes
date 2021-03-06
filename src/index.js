const form = document.querySelector('form');
let limit = 1;
let search = document.querySelector("#search-input");
let lat;
let lon;
let apiUrl;
let apiKey = "08c521f87119714e709b4af5654ffa5c"
const openStreet = document.querySelector('.open-street')
const celsius = document.querySelector("#celsius")
const fahreinheit = document.querySelector("#fahreinheit")
let metric = "metric"
celsius.style.color = "blue"
fahreinheit.style.color = "black"
const right = document.getElementsByClassName('right')
const place = document.querySelector("#place");
const geoLoc = document.querySelector("#long");
const date = document.querySelector("#date");
const time = document.querySelector("#time");
const weatherIcon = document.querySelector(".icon");
const description = document.querySelector("#description");
const humidity = document.querySelector("#humidity");
const temp = document.querySelector("#temp");
const wind = document.querySelector("#wind");
const pressure = document.querySelector("#pressure");
const getLocation = document.querySelector("#get-location");
let today = new Date();
const dateNumber = today.getDate();
const dayNumber = today.getDay();
const month = today.getMonth();
const year = today.getFullYear();
let hrs = today.getHours();
let min = today.getMinutes();
let sec = today.getSeconds();
let f = 0
if (hrs < 10) {
  hrs = `${f}${hrs}`;
}
if (min < 10) {
  min = `${f}${min}`;
}
if (sec < 10) {
  sec = `${f}${sec}`;
}

let currentTime = hrs + ":" + min + ":" + sec;
time.innerHTML = currentTime;

let daysOfTheWeek = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
};
let actualDay = daysOfTheWeek[dayNumber];
let actualMonth = month + 1;
const actualDate = dateNumber + "/" + actualMonth + "/" + year;
if (actualDay < 10) {
  actualDay = `${f}${actualDay}`;
}
if (actualMonth < 10) {
  actualMonth = `${f}${actualMonth}`;
}

date.innerHTML = actualDay + "  " + actualDate;
const img = document.createElement("img")
function showApects(response) {
    console.log(response);
    const icon = response.data.weather[0].icon
    const a = response.data.main.temp;
    const b = response.data.main.humidity
    const c = response.data.wind.speed
    const d = response.data.main.pressure
    
    img.src = `https://openweathermap.org/img/w/${icon}.png`
    weatherIcon.appendChild(img);
    description.innerHTML = response.data.weather[0].description;
    temp.innerHTML = a
    humidity.innerHTML = `Humidity: ${b}`;
    wind.innerHTML = `Wind speed: ${c} `;
    pressure.innerHTML = `Pressure: ${d} `;
}


function populatingForecasts(input, response){
  let a = 0
  let i;
  for(i in right){
    const fDate = document.getElementsByClassName("f-date-one")[a]
    const fDescription = document.getElementsByClassName("f-description-one")[a]
    const fTemp = document.getElementsByClassName("f-temp-one")[a]
    const forecastIconDiv = document.getElementsByClassName('f-icon')[a]
    let forecastDate; let forecastedIcon; let forecastTemp; let forecastDescription;
    function forecastedValues(response, input){
      forecastDate = ((response.data.list[input].dt_txt).split(" "))[0];
      console.log(forecastDate)
      forecastedIcon = response.data.list[input].weather[0].icon
      console.log(forecastedIcon)
      forecastTemp = response.data.list[input].main.temp
      console.log(forecastTemp)
      forecastDescription = response.data.list[input].weather[0].description
      console.log(forecastDescription)
      if( forecastIconDiv.length !== 0){
        forecastIconDiv.replaceChildren()
      }
      let forecastIcon = document.createElement("img")
      forecastIcon.src = `https://openweathermap.org/img/w/${forecastedIcon}.png`
      forecastIconDiv.appendChild(forecastIcon)
      console.log(forecastIconDiv)
    }
    
    if (input > 39){
      input--
      let tempInput = input;
      forecastedValues(response, tempInput)
      forecastDate = ((response.data.list[input].dt_txt).split(" "))[0];
      console.log(forecastDate)     
    }else {
      forecastedValues(response, input)
      input+=8  
      }
      
  fDate.innerHTML = forecastDate;
  fDescription.innerHTML = forecastDescription
  fTemp.innerHTML = `${forecastTemp}&degC`
  a++
}
}
function populateForecasts(response){
  console.log(response)
  console.log(response.data.list[6].dt_txt)
  const h = 8
  if ("00:00:00" <= currentTime <= "03:00:00"){
    populatingForecasts(h,response)
  }
  else if ("03:00:01" <= currentTime <= "06:00:00"){
    populatingForecasts(h, response)
  }
  else if ("06:00:01" <= currentTime <= "09:00:00"){
    populatingForecasts(h, response)  
  }
  else if ("09:00:01" <= currentTime <= "12:00:00"){
    populatingForecasts(h,response)  
  }
  else if ("12:00:01" <= currentTime <= "15:00:00"){
    populatingForecasts(h, response)  
  }
  else if ("15:00:01" <= currentTime <= "18:00:00"){  
    populatingForecasts(h, response)
  }
  else if ("18:00:01" <= currentTime <= "21:00:00"){
    populatingForecasts(h,response)  
  }
  else {
    populatingForecasts(h, response)    
  }

}
function fiveDayWeatherForecast(lat, long){
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${metric}&appid=${apiKey}`;
  axios.get(apiUrl).then(populateForecasts)
}

function showGeoLocation(response) {
  lat = response.data[0].lat;
  lon = response.data[0].lon;
  const country = response.data[0].country;
  const popName = response.data[0].name;
  place.innerHTML = `Locale     : ${popName}, ${country}`;
  geoLoc.innerHTML = `${lat}, ${lon}`;
  //5 day weatherForecast
  fiveDayWeatherForecast(lat, long)
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${metric}&appid=${apiKey}`;
  axios.get(apiUrl).then(showApects);
  mapDetails(lat,lon)
}
//using lat and long
function getInput(event) {
  event.preventDefault();
  const defaultLocation = "Juja"
  const inputLocation = search.value.trim();
  console.log(inputLocation)
  if (inputLocation !== ""){
      geoCode(inputLocation)
  }else{
    geoCode(defaultLocation)
  }
  function geoCode(input){
    let geoCodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=${limit}&appid=${apiKey}`;
    console.log(input);
    axios.get(geoCodeUrl).then(showGeoLocation);
    search.value="";
  } 
}

function showLocation() { 
  navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    mapDetails(lat,lon)
    let reverseGeoCodeUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${apiKey}`;
    axios.get(reverseGeoCodeUrl).then((response)=>{
        console.log(response)
        const popName = response.data[0].name;
        const country = response.data[0].country;
        place.innerHTML = `${popName}, ${country}`;
        geoLoc.innerHTML = `${lat}, ${lon}`;
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${metric}&appid=${apiKey}`;
        axios.get(apiUrl).then(showApects);

    });
});
  
}
function mapDetails(lat, lon){
  let info = `https://www.openstreetmap.org/#map=13/${lat}/${lon}`
  openStreet.href = info;
}
let fahreinheitClicked = false;
celsius.style.color = "blue"
fahreinheit.style.color = "black"
function fahreinheitConverter(){
    event.preventDefault()
    let current = temp.innerHTML
    let degreeToFahreinheit = (current * 1.8).toFixed(2)
    temp.innerHTML = degreeToFahreinheit;
    celsius.style.color = "black"
    fahreinheit.style.color = "blue"
    fahreinheitClicked = true;
}
function celsiusConverter(){
    let current = temp.innerHTML
      console.log(current)
      let fahreinheitToDegree = (current/1.8).toFixed(2)
      temp.innerHTML = fahreinheitToDegree;
      celsius.style.color = "blue"
      fahreinheit.style.color = "black"
      fahreinheitClicked = false;
}
function unitCelsiusConversion(){
  fahreinheitClicked ? celsiusConverter() : void(0)
}
function unitFahreinheitConversion(){
  !fahreinheitClicked ? fahreinheitConverter() : void(0)
}


window.addEventListener("load", getInput)
search.addEventListener("click", () =>{
  event.preventDefault()
  getInput});
form.addEventListener("submit", getInput);
getLocation.addEventListener("click", showLocation);
fahreinheit.addEventListener("click", ()=> {
  event.preventDefault()
  unitFahreinheitConversion() 
  
})

celsius.addEventListener("click", ()=>{
    event.preventDefault()
    unitCelsiusConversion()    
    })

