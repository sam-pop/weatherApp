var lat; //latitude
var lon; //longtitude
var appID = "63d0718e6b526c3bb80f25a2d905695a"; //openweathermap APPID
var units = "metric"; //weather API units
var deg = "C"; //temp symbol
var weatherIconURL = "http://openweathermap.org/img/w/"; // + X.png
var temp = []; //temperature array. [0]-current temp, [1]-min temp, [2]-max temp
var weather = {
  main: "", //current condition
  desc: "", //condition description
  icon: "" //condition icon url
};
var count = 0;
var refreshRate = 5; //in minutes

var displayLocation = document.getElementById("loc");
var displayTemp = document.getElementById("temp");
var displayUnit = document.getElementById("displayUnit");
var displayMinMax = document.getElementById("minMax");
var displayCond = document.getElementById("desc");
var displayIcon = document.getElementById("icon");
var cBtn = document.getElementById("celciusBtn");
var fBtn = document.getElementById("fahrenheitBtn");

//refresh the page to get the latest weather every ~refreshRate~ minutes
setTimeout(function() { 
  location = "";
}, refreshRate * 60 * 1000);

$(document).ready(function() {
  //access current location
  var geo = navigator.geolocation.watchPosition(geo_success, geo_error);

  //if success, set variables
  function geo_success(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    //access weather API
    $.ajax({
      type: "GET",
      dataType: "json",
      async: "false",
      url:
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&APPID=" +
        appID +
        "&units=" +
        units,
      success: function(json) {
        runView(json);
        count++;
      }
    });
  }

  //if fails, get location from IP address
  function geo_error() {
    console.log("No accurate geolocation. Using IP for location.");
    $.ajax({
      url: "https://geoip-db.com/jsonp",
      jsonpCallback: "callback",
      dataType: "jsonp",
      success: function(location) {
        lat = location.latitude;
        lon = location.longitude;
        //access weather API
        $.ajax({
          type: "GET",
          dataType: "json",
          async: "false",
          url:
            "https://api.openweathermap.org/data/2.5/weather?lat=" +
            lat +
            "&lon=" +
            lon +
            "&APPID=" +
            appID +
            "&units=" +
            units,
          success: function(json) {
            runView(json);
            count++;
          }
        });
      }
    });
  }
}); //END OF document.ready

//builds the view
function runView(json) {
  if (count == 0) {
    //make sure runView only fires once
    displayLocation.innerHTML = json.name + ", " + json.sys.country;
    //retrieve temp for current locaiton in Celcius
    temp[0] = Math.round(json.main.temp); //current
    temp[1] = Math.round(json.main.temp_min); //min
    temp[2] = Math.round(json.main.temp_max); //max
    //DISPLAY temp
    showTemp(temp, deg);
    //retrieve weather condition inforamtion
    weather.main = json.weather[0].main; // condition
    weather.desc = json.weather[0].description; //desc
    weather.icon = json.weather[0].icon; //icon url
    //DISPLAY conditions
    displayCond.innerHTML = "// " + weather.main;
    displayIcon.innerHTML =
      "<img src='" + weatherIconURL + weather.icon + ".png'>";
  }
}

//converts the temp to Fahrenheit using the equation: °C x 9/5 + 32 = °F
function convertCtoF(tempInC) {
  if (deg === "C") {
    deg = "F";
    temp[0] = Math.round(tempInC[0] * (9 / 5) + 32);
    temp[1] = Math.round(tempInC[1] * (9 / 5) + 32);
    temp[2] = Math.round(tempInC[2] * (9 / 5) + 32);
    //DISPLAY temp
    showTemp(tempInC, deg);
  }
}

//converts the temp to Celcius using the equation: (°F - 32) x 5/9 = °C
function convertFtoC(tempInF) {
  if (deg === "F") {
    deg = "C";
    temp[0] = Math.round((tempInF[0] - 32) * (5 / 9));
    temp[1] = Math.round((tempInF[1] - 32) * (5 / 9));
    temp[2] = Math.round((tempInF[2] - 32) * (5 / 9));
    //DISPLAY temp
    showTemp(tempInF, deg);
  }
}

cBtn.addEventListener("click", function() {
  convertFtoC(temp, "C");
});

fBtn.addEventListener("click", function() {
  convertCtoF(temp, "F");
});

//DISPLAY the temperature and deg (C/F) 
function showTemp(tempArr, deg) {
  displayTemp.innerHTML =
    tempArr[0] + "<span style='font-size:1em;'>&deg</span>";
  displayUnit.innerHTML = deg;
  displayMinMax.innerHTML =
    "<i class='fas fa-long-arrow-alt-down'></i><span style='font-size:0.5em'>min</span>" +
    tempArr[1] +
    "&nbsp<i class='fas fa-long-arrow-alt-up'></i><span style='font-size:0.5em'>max</span>" +
    tempArr[2];
}