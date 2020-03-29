//  **  Declarations

//  For current weather conditions
const _OPENWEATHER_CURRENT_APICALL = "api.openweathermap.org/data/2.5/weather";

//  For the 5-day forecast
const _OPENWEATHER_5DAY_APICALL = "api.openweathermap.org/data/2.5/forecast";

//  API key
const _OPENWEATHER_APIKEY = "&appid=e986f4791a0ed4a43eb9ec657994cadf";
const _GOOGLECLOUD_APIKEY = "&key=AIzaSyDi4oH60AbRlXQ_8dxOXMErKrg4Vs1nED8";

//  For forecast by city
const _OPENWEATHER_CITY_QUERY = "?q=%CITY%";                         //  where %CITY% is the city name
const _OPENWEATHER_CITYSTATE_QUERY = "?q=%CITY%,%STATE%";           //  where %CITY% is the city name and %STATE% is the name of the state.

//  You can also call by city ID or geographic coordinates
const _OPENWEATHER_LATLON_QUERY = "?lat=%LAT%&lon=%LON%";            //  where %LAT% is latitude and %LON% is longitude.

//  or by ZIP Code
const _OPENWEATHER_ZIP_QUERY = "?zip=%ZIP%,us";                 //   where %ZIP% is the code





//  **  Functions


// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history


//  What if I also showed the city on a map?

// map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: -34.397, lng: 150.644},           //  lat/lon go here
//     zoom: 8                         //  Slightly larger than a city
// });

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index


// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe


// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity


// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city




//  **  Events




//  **  Logic


