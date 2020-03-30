//  **  Declarations

const _QTYPE_CURRENT_WEATHER = 1;
const _QTYPE_FORECAST_WEATHER = 2;

//  API Constants
const _OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5";

//  For current weather conditions
const _OPENWEATHER_CURRENT_APICALL = "/weather";

//  For the 5-day forecast
const _OPENWEATHER_5DAY_APICALL = "/forecast";

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

var _cityName = "";
var _currentWeather = [];
var _forecastWeather = [];
var _searchIndex = -1;

//  **  Functions

/**
 * Run OpenWeather API Query for current and 5-day forecast
 * @param {*} searchTerm Specific Search Term to query in call
 */
function queryOpenweather(searchTerm) {

// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

getOpenWeather(searchTerm, _QTYPE_CURRENT_WEATHER);
getOpenWeather(searchTerm, _QTYPE_FORECAST_WEATHER);
_searchIndex++;

};

/**
 * Given Search Term and the base API call, parses term into search query and execute search
 * @param {*} searchTerm Term to call for search
 * @param {*} queryType 1 - Current Weather, 2 - 5-Day Forecast
 */
function getOpenWeather(searchTerm, queryType) {
    var apiCall = "";
    switch (queryType) {
        case _QTYPE_CURRENT_WEATHER:
            apiCall = _OPENWEATHER_CURRENT_APICALL;
            break;
        case _QTYPE_FORECAST_WEATHER:
            apiCall = _OPENWEATHER_5DAY_APICALL;
            break;
        default:
    };

    var apiKey = _OPENWEATHER_APIKEY;
    var searchString = "";
    var commaIndex = searchTerm.indexOf(",");
    var queryString = "";
    var term1 = searchTerm;
    var term2 = "";

    if (commaIndex > -1) {
        term1 = searchTerm.substring(0, commaIndex).trim();
        term2 = searchTerm.substring(commaIndex + 1).trim();
    };

    if (isNaN(term1)) {
        if (term2 != "") {
            searchString = _OPENWEATHER_CITYSTATE_QUERY.replace("%CITY%", term1);
            searchString = searchString.replace("%STATE%", term2);
        } else {
            searchString = _OPENWEATHER_CITY_QUERY.replace("%CITY%", term1);
        };

    } else {
        if (term2 != "") {
            searchString = _OPENWEATHER_LATLON_QUERY.replace("%LAT%", term1);
            searchString = searchString.replace("%LON%", term2);
        } else {
            searchString = _OPENWEATHER_ZIP_QUERY.replace("%ZIP%", term1);
        };
    };

    queryString = _OPENWEATHER_BASE + apiCall + searchString + apiKey;
    runAjaxQuery(queryString, queryType);
    console.log(queryString);
};

/**
 * Execute API call
 * @param {*} queryString URL to query
 * @param {*} queryType 1 - Current Weather, 2 - 5-Day Forecast
 */
function runAjaxQuery(queryString, queryType) {
    $.ajax({
        url: queryString,
        method: "GET"
    }).then(function(response) {
        switch (queryType) {
            case _QTYPE_CURRENT_WEATHER:
                _currentWeather.push(response);
                break;
            case _QTYPE_FORECAST_WEATHER:
                _forecastWeather.push(response);
                break;
            default:
        };
        renderWeather(queryType);
    })
};

/**
 * Commit results to screen
 * @param {*} queryType 1 - Current Weather, 2 - 5-Day Forecast
 */
function renderWeather(queryType) {
    switch (queryType) {
        case _QTYPE_CURRENT_WEATHER:
            console.log(_currentWeather[_searchIndex]);
            break;
        case _QTYPE_FORECAST_WEATHER:
            console.log(_forecastWeather[_searchIndex]);
            break;
        default:
    }


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


};

//  **  Events

/**
 * Click event handler for Search button in the nav bar
 */
$("#search-city-btn").on("click", function() {
    searchTerm = $("#search-city").val();
    queryOpenweather(searchTerm);
})


//  **  Logic


