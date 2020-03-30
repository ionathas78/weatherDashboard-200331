//  **  Declarations

const _QTYPE_CURRENT_WEATHER = 1;
const _QTYPE_FORECAST_WEATHER = 2;
const _QTYPE_PLACE = 3;

const _GOOGLECLOUD_APIKEY = "&key=AIzaSyDi4oH60AbRlXQ_8dxOXMErKrg4Vs1nED8";

//  OpenWeather API
const _OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5";           
const _OPENWEATHER_CURRENT_APICALL = "/weather";                                //  For current weather conditions
const _OPENWEATHER_5DAY_APICALL = "/forecast";                                  //  For the 5-day forecast    
const _OPENWEATHER_APIKEY = "&appid=e986f4791a0ed4a43eb9ec657994cadf";          //  API key

//  For forecast by city
const _OPENWEATHER_CITY_QUERY = "?q=%CITY%";                                    //  where %CITY% is the city name
const _OPENWEATHER_CITYSTATE_QUERY = "?q=%CITY%,%STATE%";                       //  where %CITY% is the city name and %STATE% is the name of the state.
//  You can also call by city ID or geographic coordinates
const _OPENWEATHER_LATLON_QUERY = "?lat=%LAT%&lon=%LON%";                       //  where %LAT% is latitude and %LON% is longitude.
//  or by ZIP Code
const _OPENWEATHER_ZIP_QUERY = "?zip=%ZIP%,us";                                 //   where %ZIP% is the code

//  MapQuest API
// const _MAPQUEST_BASE = "http://www.mapquestapi.com/search/v4";                 
// const _MAPQUEST_PLACE_APICALL = "/place";                                       //  For the location
// const _MAPQUEST_LATLON = "?location=%LON%%2C%20%LAT%";                             //  where %LAT% is latitude and %LON% is longitude.
// const _MAPQUEST_SORT = "&sort=relevance";                                       //  By relevance or by distance
// const _MAPQUEST_FEEDBACK = "&feedback=false";                                   //  ?
// const _MAPQUEST_APIKEY = "&key=s57L9cRQk0CZGiyqnipytbVrVQw9j2Dn";               //  API Key
// const _MAPQUEST_CITY_QUERY = "&q=%CITY%";                                       //  where %CITY% is the city name
// const _MAPQUEST_CITYSTATE_QUERY = "&q=%CITY%%2C%STATE%";                        //  where %CITY% is the city name and %STATE% is the name of the state.

const _MAPQUEST_BASE = "http://open.mapquestapi.com/geocoding/v1";                 
const _MAPQUEST_PLACE_APICALL = "/reverse";                                       //  For the location
const _MAPQUEST_LATLON = "?location=%LAT%,%LON%";                             //  where %LAT% is latitude and %LON% is longitude.
const _MAPQUEST_APIKEY = "&key=s57L9cRQk0CZGiyqnipytbVrVQw9j2Dn";               //  API Key


var _cityName = "";
var _currentDate = moment().format("dddd, MMMM Do YYYY");
var _currentWeather = [];
var _forecastWeather = [];
var _placeData = [];
var _searchIndex = -1;

//  **  Functions

/**
 * Run OpenWeather API Query for current and 5-day forecast
 * @param {*} searchTerm Specific Search Term to query in call
 */
function queryOpenweather(searchTerm) {

// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

queryWeather(searchTerm, _QTYPE_CURRENT_WEATHER);
queryWeather(searchTerm, _QTYPE_FORECAST_WEATHER);
_searchIndex++;

};

/**
 * Given Search Term and the base API call, parses term into search query and execute search
 * @param {*} searchTerm Term to call for search
 * @param {*} queryType 1 - Current Weather, 2 - 5-Day Forecast
 */
function queryWeather(searchTerm, queryType) {
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
            term2 = stateFullName(term2);                   //  OpenWeather doesn't work with state abbreviations
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
 * Given Search Term and the base API call, parses term into search query and execute search
 * @param {*} currentWeatherResponse Term to call for search
 */
function queryPlace(currentWeatherResponse) {
    var apiCall = _MAPQUEST_BASE;

    var apiKey = _MAPQUEST_APIKEY;
    var latlonString = _MAPQUEST_LATLON.replace("%LAT%", currentWeatherResponse.coord.lat);
    latlonString = latlonString.replace("%LON%", currentWeatherResponse.coord.lon);

    queryString = apiCall + _MAPQUEST_PLACE_APICALL + latlonString + apiKey;

    runAjaxQuery(queryString, _QTYPE_PLACE);
}

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
                queryPlace(response);
                break;
            case _QTYPE_FORECAST_WEATHER:
                _forecastWeather.push(response);
                break;
            case _QTYPE_PLACE:
                let cityName = response.results[0].locations[0].adminArea5;
                let stateName = response.results[0].locations[0].adminArea3;
                let countryName = response.results[0].locations[0].adminArea1;
                let msgResponse = "";

                if (countryName == "US") {
                    msgResponse = cityName + ", " + stateName;                    
                } else {
                    msgResponse = cityName + ", " + countryName;
                }

                //  Add this to the Search Dropdown

                _cityName = msgResponse

                // console.log(response);
                // console.log(msgResponse);
                break;
            default:
        };
        renderResult(queryType);
    })
};

/**
 * Commit results to screen
 * @param {*} queryType 1 - Current Weather, 2 - 5-Day Forecast
 */
function renderResult(queryType) {
    switch (queryType) {
        case _QTYPE_CURRENT_WEATHER:
            console.log(_currentWeather[_searchIndex]);
            //  output result to weather pane.
            break;
        case _QTYPE_FORECAST_WEATHER:
            console.log(_forecastWeather[_searchIndex]);
            //  output result to forecast pane.
            break;
        case _QTYPE_PLACE:
            $("#city-name").text(_cityName);
            $("#current-date").text(_currentDate);
            break;
        default:
    }

    // cityName = _currentWeather[_searchIndex].name;

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

/**
 * Given state abbreviation, return full name
 * @param {*} stateAbbreviation Abbreviation of state
 */
function stateFullName(stateAbbreviation) {
    var returnString = "";
    stateAbbreviation = stateAbbreviation.replace(/./g, "");
    stateAbbreviation = stateAbbreviation.replace(/ /g, "");

    switch (stateAbbreviation.toUpperCase()) {
        case "AL", "ALA", "ALABAMA":
            returnString = "Alabama";
        case "AK", "ALASKA":
            returnString = "Alaska";
        case "AS", "AMERICANSAMOA":
            returnString = "American Samoa";
        case "AZ", "ARIZ", "ARIZONA":
            returnString = "Arizona";
        case "AR", "ARK", "ARKANSAS":
            returnString = "Arkansas";
        case "CA", "CALIF", "CALIFORNIA":
            returnString = "California";
        case "CO", "COLO", "COLORADO":
            returnString = "Colorado";
        case "CT", "CONN", "CONNECTICUT":
            returnString = "Connecticut";
        case "DE", "DEL", "DELAWARE":
            returnString = "Delaware";
        case "DC", "WASHINGTONDC", "DISTRICTOFCOLUMBIA":
            returnString = "District of Columbia";
        case "FL", "FLA", "FLORIDA":
            returnString = "Florida";
        case "GA", "GEORGIA":
            returnString = "Georgia";
        case "GU", "GUAM":
            returnString = "Guam";
        case "HI", "HAWAII":
            returnString = "Hawaii";
        case "ID", "IDAHO":
            returnString = "Idaho";
        case "IL", "ILL", "ILLINOIS":
            returnString = "Illinois";
        case "IN", "IND", "INDIANA":
            returnString = "Indiana";
        case "IA", "IOWA":
            returnString = "Iowa";
        case "KS", "KANS", "KANSAS":
            returnString = "Kansas";
        case "KY", "KENTUCKY":
            returnString = "Kentucky";
        case "LA", "LOUISIANA":
            returnString = "Louisiana";
        case "ME", "MAINE":
            returnString = "Maine";
        case "MD", "MARYLAND":
            returnString = "Maryland";
        case "MH", "MARSHALLISLANDS":
            returnString = "Marshall Islands";
        case "MA", "MASS", "MASSACHUSETTS":
            returnString = "Massachusetts";
        case "MI", "MICH", "MICHIGAN":
            returnString = "Michigan";
        case "FM", "MICRONESIA":
            returnString = "Micronesia";
        case "MN", "MINN", "MINNESOTA":
            returnString = "Minnesota";
        case "MS", "MISS", "MISSISSIPPI":
            returnString = "Mississippi";
        case "MO", "MISSOURI":
            returnString = "Missouri";
        case "MT", "MONT", "MONTANA":
            returnString = "Montana";
        case "NE", "NEBR", "NEBRASKA":
            returnString = "Nebraska";
        case "NV", "NEV", "NEVADA":
            returnString = "Nevada";
        case "NH", "NEWHAMPSHIRE":
            returnString = "New Hampshire";
        case "NJ", "NEWJERSEY":
            returnString = "New Jersey";
        case "NM", "NEWMEXICO":
            returnString = "New Mexico";
        case "NY", "NEWYORK":
            returnString = "New York";
        case "NC", "NORTHCAROLINA":
            returnString = "North Carolina";
        case "ND", "NORTHDAKOTA":
            returnString = "North Dakota";
        case "MP", "NORTHERNMARIANAS":
            returnString = "Northern Marianas";
        case "OH", "OHIO":
            returnString = "Ohio";
        case "OK", "OKLA", "OKLAHOMA":
            returnString = "Oklahoma";
        case "OR", "ORE", "OREGON":
            returnString = "Oregon";
        case "PW", "PALAU":
            returnString = "Palau";
        case "PA", "PENNSYLVANIA":
            returnString = "Pennsylvania";
        case "PR", "PUERTORICO":
            returnString = "Puerto Rico";
        case "RI", "RHODEISLAND":
            returnString = "Rhode Island";
        case "SC", "SOUTHCAROLINA":
            returnString = "South Carolina";
        case "SD", "SOUTHDAKOTA":
            returnString = "South Dakota";
        case "TN", "TENN", "TENNESSEE":
            returnString = "Tennessee";
        case "TX", "TEX", "TEXAS":
            returnString = "Texas";
        case "UT", "UTAH":
            returnString = "Utah";
        case "VT", "VERMONT":
            returnString = "Vermont";
        case "VA", "VIRGINIA":
            returnString = "Virginia";
        case "VI", "VIRGINISLANDS":
            returnString = "Virgin Islands";
        case "WA", "WASH", "WASHINGTON":
            returnString = "Washington";
        case "WV", "WVA", "WESTVIRGINIA":
            returnString = "West Virginia";
        case "WI", "WIS", "WISCONSIN":
            returnString = "Wisconsin";
        case "WY", "WYO", "WYOMING":
            returnString = "Wyoming";
        default:    
    };
    return returnString;
}

//  **  Events

/**
 * Click event handler for Search button in the nav bar
 */
$("#search-city-btn").on("click", function() {
    searchTerm = $("#search-city").val();
    queryOpenweather(searchTerm);
})


//  **  Logic


