//  **  Declarations

//  This is a Heroku server I launched running Rob Wu's excellent cors-anywhere code from 
//  https://github.com/Rob--W/cors-anywhere. It was for the static map API, so I didn't wind up using it, 
//  but it wasn't because the CORS headers weren't working.
const _CORS_SERVER = "https://polar-bayou-73801.herokuapp.com/";

const _QTYPE_CURRENT_WEATHER = 1;
const _QTYPE_FORECAST_WEATHER = 2;
const _QTYPE_UVINDEX = 3;
const _QTYPE_PLACE = 4;
const _QTYPE_MAP = 5;

// const _GOOGLECLOUD_APIKEY = "&key=AIzaSyDi4oH60AbRlXQ_8dxOXMErKrg4Vs1nED8";

//  OpenWeather API
const _OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5";           
const _OPENWEATHER_CURRENT_APICALL = "/weather";                                //  For current weather conditions
const _OPENWEATHER_5DAY_APICALL = "/forecast";                                  //  For the 5-day forecast    
const _OPENWEATHER_UV_APICALL = "/uvi";                                         //  For the UV Index
const _OPENWEATHER_APIKEY = "&appid=e986f4791a0ed4a43eb9ec657994cadf";          //  API key

//  For forecast by city
const _OPENWEATHER_CITY_QUERY = "?q=%CITY%";                                    //  where %CITY% is the city name
const _OPENWEATHER_CITYSTATE_QUERY = "?q=%CITY%,%STATE%";                       //  where %CITY% is the city name and %STATE% is the name of the state.
//  You can also call by city ID or geographic coordinates
const _OPENWEATHER_LATLON_QUERY = "?lat=%LAT%&lon=%LON%";                       //  where %LAT% is latitude and %LON% is longitude.
//  or by ZIP Code
const _OPENWEATHER_ZIP_QUERY = "?zip=%ZIP%,us";                                 //   where %ZIP% is the code

//  MapQuest API
const _MAPQUEST_GEOCODE_BASE = "http://open.mapquestapi.com/geocoding/v1";   
const _MAPQUEST_MAP_BASE = "https://open.mapquestapi.com/staticmap/v5";

const _MAPQUEST_PLACE_APICALL = "/reverse";                                       //  For the location
const _MAPQUEST_MAP_APICALL = "/map";

const _MAPQUEST_LATLON = "?location=%LAT%,%LON%";                             //  where %LAT% is latitude and %LON% is longitude.
const _MAPQUEST_CENTER = "?center=%CITY%,%STATE%";
const _MAPQUEST_SIZE = "&size=@%SCALE%x";

const _MAPQUEST_APIKEY = "&key=s57L9cRQk0CZGiyqnipytbVrVQw9j2Dn";               //  API Key


var _cityName = "";
var _currentDate = moment().format("dddd, MMMM Do YYYY");
var _currentWeather = [];
var _forecastWeather = [];
var _uvIndex = [];
var _placeData = [];
var _cityHistory = [];
var _searchIndex = -1;
var _histIndex = -1;

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
 * Parses given weather object to retrieve location data for detailed location data
 * @param {*} currentWeatherResponse Response from Current Weather query
 */
function queryPlace(currentWeatherResponse) {
    var apiCall = _MAPQUEST_GEOCODE_BASE;
    var queryString = "";

    var apiKey = _MAPQUEST_APIKEY;
    var latlonString = _MAPQUEST_LATLON.replace("%LAT%", currentWeatherResponse.coord.lat);
    latlonString = latlonString.replace("%LON%", currentWeatherResponse.coord.lon);

    queryString = apiCall + _MAPQUEST_PLACE_APICALL + latlonString + apiKey;

    runAjaxQuery(queryString, _QTYPE_PLACE);
}

/**
 * Parses given weather object to retrieve location data for UV query
 * @param {*} currentWeatherResponse Response from Current Weather query
 */
function queryUVIndex(currentWeatherResponse) {
    var apiCall = _OPENWEATHER_BASE;
    var queryString = "";

    var apiKey = _OPENWEATHER_APIKEY;
    var latLonString = _OPENWEATHER_LATLON_QUERY.replace("%LAT%", currentWeatherResponse.coord.lat);
    latLonString = latLonString.replace("%LON%", currentWeatherResponse.coord.lon);

    queryString = apiCall + _OPENWEATHER_UV_APICALL + latLonString + apiKey;

    runAjaxQuery(queryString, _QTYPE_UVINDEX);
}

function queryMap(cityName, stateName) {
    var apiCall = _MAPQUEST_MAP_BASE + _MAPQUEST_MAP_APICALL;
    var mapCenter = _MAPQUEST_CENTER.replace("%CITY%", cityName);
    mapCenter = mapCenter.replace("%STATE%", stateName);
    var apiKey = _MAPQUEST_APIKEY;

    let queryString = apiCall + mapCenter + apiKey;

    sendAjax_CORS(queryString);
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
                queryUVIndex(response);

                renderCurrent();
                break;

            case _QTYPE_FORECAST_WEATHER:
                _forecastWeather.push(response);
                renderFiveDay();
                break;

            case _QTYPE_UVINDEX:
                _uvIndex.push(response);
                renderUVIndex(response.value);
                break;

            case _QTYPE_PLACE:
                let cityName = response.results[0].locations[0].adminArea5;
                let stateName = response.results[0].locations[0].adminArea3;
                let countryName = response.results[0].locations[0].adminArea1;
                let regionName = "";
                let latitude = response.results[0].locations[0].latLng.lat;
                let longitude = response.results[0].locations[0].latLng.lng;
                let msgResponse = "";

                if (countryName == "US") {
                    msgResponse = cityName + ", " + stateName;                    
                    regionName = stateName;
                } else {
                    msgResponse = cityName + ", " + countryName;
                    regionName = countryName;
                }

                //  Add this to the Search Dropdown

                _cityName = msgResponse
                $("#city-name").text(_cityName);
                $("#current-date").text(_currentDate);

                var searchDropdown = $("#search-dropdown");
                if (searchDropdown.children("#dropdown-" + cityName).length < 1) {
                    searchDropdown.append($('<a id="dropdown-' + cityName + '" class="dropdown-item" href="#">' + _cityName + '</a>'));
                }

                let historyItem = new CityHistory(_searchIndex, cityName, regionName, latitude, longitude);
                
                if (!cityHistoryContains(cityName, regionName)) {
                    _cityHistory.push(historyItem);
                }
                if (_cityHistory.length > 5) {
                    _cityHistory.shift();
                }

                renderHistory(historyItem);

                // queryMap(cityName, regionName);

                break;

            case _QTYPE_MAP:
                console.log(response);
                // $("#map").append(response);
                break;

            default:
        };
        renderResult(queryType);
    })
};

/**
 * Commit five-day forecast to screen
 */
function renderFiveDay() {
    // WHEN I view future weather conditions for that city
    // THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, 
    //          the temperature, and the humidity

    let fiveDay = _forecastWeather[_searchIndex];
    
    let forecastList = $("[id^='forecast-item']");
    for (var i = 0; i < forecastList.length; i++) {
        childI = $("#forecast-item" + i);
        let idx = i * 8 + 4;            //  The 5-day forecast is arranged into 40 3-hour blocks, so we have to offset.
        let dayName = moment(fiveDay.list[idx].dt_txt).format("ddd");
        let weatherDescription = fiveDay.list[idx].weather[0].description;
        let weatherTemperature = kelvinToFahrenheit(fiveDay.list[idx].main.temp).toFixed(1);
        let weatherHumidity = fiveDay.list[idx].main.humidity;

        let backgroundImage = getWeatherIconURL(fiveDay.list[idx].weather[0].icon);
        
        childI.children(".forecast-day").text(dayName);
        childI.find(".forecast-description").text(weatherDescription);
        childI.find(".forecast-temperature").text(weatherTemperature);
        childI.find(".forecast-humidity").text(weatherHumidity);

        let imageSize = "100%";
        if (window.screen.availWidth < 450) {
            imageSize = "66%";
        }

        let styleCSS = "background-image: url(" + backgroundImage + "); " +
                    "background-position: top; background-repeat: no-repeat;" +
                    "background-size: " + imageSize + ";";
        
        childI.attr("style", styleCSS);
    };
};

/**
 * Commit current weather to screen
 */
function renderCurrent() {

    // WHEN I view current weather conditions for that city
    // THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

    // WHEN I view the UV index
    // THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
    
    let currentWeather = _currentWeather[_searchIndex];

    let weatherContent = $("#weather-content");
    let weatherDescription = currentWeather.weather[0].description;
    let weatherTemperature = kelvinToFahrenheit(currentWeather.main.temp).toFixed(1);
    let weatherHumidity = currentWeather.main.humidity;
    let weatherWindSpeed = metersPerSecondToMilesPerHour(currentWeather.wind.speed).toFixed(1);
    let backgroundImage = getWeatherIconURL(currentWeather.weather[0].icon);
    let imageSize = "33%";
    let styleCSS = "background-image: url(" + backgroundImage + "); " +
                "background-position: right; background-repeat: no-repeat;" +
                "background-size: " + imageSize + ";";


    populateCurrentPanel("Current Weather", weatherDescription, weatherTemperature, weatherHumidity,
                weatherWindSpeed)

    weatherContent.attr("style", styleCSS);
};

/**
 * Fill data into the Current Panel and render the UV block
 * @param {text} headerText Title Header text
 * @param {text} weatherDescription Verbose description of weather
 * @param {number} currentTemperature Temperature in Fahrenheit
 * @param {number} currentHumidity Relative Humidity
 * @param {number} currentWindSpeed Wind Speed in MPH
 */
function populateCurrentPanel (headerText, weatherDescription, currentTemperature, currentHumidity, currentWindSpeed) {
    let hHeader = $("#current-header");
    let pDescription = $("#current-description");
    let pTemperature = $("#current-temperature");
    let pHumidity = $("#current-humidity");
    let pWindSpeed = $("#current-wind-speed");

    hHeader.text(headerText);
    pDescription.text(weatherDescription);
    pTemperature.text(currentTemperature);
    pHumidity.text(currentHumidity);
    pWindSpeed.text(currentWindSpeed);
};

/**
 * Fill in the UV Index section and colors it
 * @param {*} currentUVIndex 
 */
function renderUVIndex (currentUVIndex) {
    pUVIndex = $("#current-uv-index");
    dUVSection = $(".uv-panel")
    pUVIndex.text(currentUVIndex);

    let backgroundColorIndex = "";
    let colorIndex = "";

    switch (Math.floor(currentUVIndex)) {
        case 0:
            backgroundColorIndex = "#0f0";
            colorIndex = "#eee";
            break;
        case 1:
            backgroundColorIndex = "#0b0";
            colorIndex = "#eee";
            break;
        case 2:
            backgroundColorIndex = "#080";
            colorIndex = "#eee";
            break;
        case 3:
            backgroundColorIndex = "#ee0";
            colorIndex = "#000";
            break;
        case 4:
            backgroundColorIndex = "#cc0";
            colorIndex = "#000";
            break;
        case 5:
            backgroundColorIndex = "#aa0";
            colorIndex = "#000";
            break;
        case 6:
            backgroundColorIndex = "#c70";
            colorIndex = "#eee";
            break;
        case 7:
            backgroundColorIndex = "#c40";
            colorIndex = "#eee";
            break;
        case 8:
            backgroundColorIndex = "#c00";
            colorIndex = "#eee";
            break;
        case 9:
            backgroundColorIndex = "#a00";
            colorIndex = "#eee";
            break;
        case 10:
            backgroundColorIndex = "#800";
            colorIndex = "#eee";
            break;
        default:
            backgroundColorIndex = "#80e";
            colorIndex = "#eee";
    }

    dUVSection.attr("style", "background-color: " + backgroundColorIndex + "; color: " + colorIndex + ";");
}

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
            break;
        default:
    }
};

/**
 * Commit search history to the screen
 * @param {object} historyItem 
 */
function renderHistory() {

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

    for (var i = 0; i < _cityHistory.length; i++) {
        childI = $("#history-item" + i);

        let historicalWeather = _currentWeather[_cityHistory[i].index];

        let cityName = _cityHistory[i].name 
        if (cityName.length < 11) {
            cityName += ", " + _cityHistory[i].state;
        }   
        let weatherDescription = historicalWeather.weather[0].description;
        let weatherTemperature = kelvinToFahrenheit(historicalWeather.main.temp).toFixed(1) + "\xB0F";
        let weatherHumidity = historicalWeather.main.humidity + "%";

        let backgroundImage = getWeatherIconURL(historicalWeather.weather[0].icon);
        
        childI.find(".history-city").text(cityName);
        childI.find(".history-description").text(weatherDescription);
        childI.find(".history-temperature").text(weatherTemperature);
        childI.find(".history-humidity").text(weatherHumidity);

        let imageSize = "80%";
        if (window.screen.availWidth < 450) {
            imageSize = "50%";
        }

        let styleCSS = "background-image: url(" + backgroundImage + "); " +
                    "background-position: top; background-repeat: no-repeat;" +
                    "background-size: " + imageSize + ";";
        
        childI.attr("style", styleCSS);
    };

}


/**
 * Convert Kelvin temperatures to Fahrenheit
 * @param {*} degreesKelvin Temperature in Kelvin
 */
function kelvinToFahrenheit(degreesKelvin) {
    return (degreesKelvin - 273.15) * 9/5 + 32;
}

/**
 * Convert M/S measurements to MPH
 * @param {*} metersPerSecond Meters per second
 */
function metersPerSecondToMilesPerHour(metersPerSecond) {
    return (metersPerSecond * 2.2369);
}

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
};

/**
 * Get URL for weather icon PNG
 * @param {*} weatherCode OpenWeatherMap weather code
 * @param {*} sizeScale 2x is standard (?)
 */
function getWeatherIconURL(iconName) {
    const iconURL = "http://openweathermap.org/img/wn/";
    const urlScale = "@2x.png";

    // var iconName = weatherIcon(weatherCode);

    return iconURL + iconName + urlScale;
}

/**
 * Return appropriate icon for weather code
 * @param {*} weatherCode OpenWeatherMap weather code
 */
function weatherIcon(weatherCode) {
    var iconCode = "";

    if (weatherCode >= 801) {
        //  Group 80x: Clouds
        if (weatherCode => 803) {
            //  Broken or overcast clouds
            iconCode = "04";
        } else if (weatherCode == 802) {
            //  Scattered clouds
            iconCode = "03";
        } else if (weatherCode == 801) {
            //  Few clouds
            iconCode = "02";
        } else if (weatherCode == 800) {
            //  Group 800: Clear
            iconCode = "01";
        }
        if (((moment().hour > 5) && (moment().hour < 17))) {
            //  Is Daytime
            iconCode += "d";
        } else {
            iconCode += "n";
        }

    } else if (weatherCode >= 701) {
        //  Group 7xx: Atmosphere
        iconCode = "50d";
    } else if (weatherCode >= 600) {
        //  Group 6xx: Snow
        iconCode = "13d";
    } else if (weatherCode >= 500) {
        //  Group 5xx: Rain
        if (weatherCode >= 520) {
            //  Shower Rain
            iconCode = "09d";
        } else if (weatherCode == 511) {
            //  Freezing Rain
            iconCode = "13d";
        } else {
            //  Rain
            iconCode = "10d";
        }

    } else if (weatherCode >= 400) {
        //  There's no Group 200...
    } else if (weatherCode >= 300) {
        //  Group 3xx: Drizzle
        iconCode = "09d";
    } else if (weatherCode >= 200) {
        //  Group 2xx: Thunderstorm
        iconCode = "11d";
    }
    return iconCode;
};

/**
 * Use with the NEW keyword to create a History object
 * @param {*} arrayIndex Index of entry in arrays
 * @param {*} cityName Name of city
 * @param {*} cityState Name of state or country
 * @param {*} cityLatitude Latitude of location
 * @param {*} cityLongitude Longitude of location
 */
function CityHistory(arrayIndex, cityName, cityState, cityLatitude, cityLongitude) {
    return {
        index: arrayIndex,
        name: cityName,
        state: cityState,
        lat: cityLatitude,
        lon: cityLongitude
    }
}

/**
 * Checks to see if the city already exists in the history
 * @param {*} cityName Name of city
 * @param {*} cityState State or Country of city
 */
function cityHistoryContains(cityName, cityState) {
    var returnValue = false;

    if (!cityName || !cityState) {
        return false;
    }

    cityName = cityName.toUpperCase();
    cityState = cityState.toUpperCase();

    for (var i = 0; i < _cityHistory.length; i++) {
        var city = _cityHistory[i].name.toUpperCase();
        var state = _cityHistory[i].state.toUpperCase();
        if ((cityName == city) && (cityState == state)) {
            returnValue = true;
            break;
        }
    }

    return returnValue;
}

/**
 * Send specified Ajax query with CORS issues.
 * @param {*} queryString Full API Call, including http(s)://
 */
function sendAjax_CORS(queryString) {
    queryString = _CORS_SERVER + queryString;

    $.ajax({
        method: "GET",
        url: queryString
    }).then(function (response) {
        // console.log(response);
        $("#map").append($('<img src="' + response + '" type="jpg">'));
    });
};



//  **  Events

/**
 * Click event handler for Search button in the nav bar
 */
$("#search-city-btn").on("click", function() {
    event.preventDefault();

    searchTerm = $("#search-city").val();
    queryOpenweather(searchTerm);
});

$(".history-item").on("click", function() {
    var itemIndex = this.id.substring(this.id.length - 1);

    if (itemIndex < _cityHistory.length) {
        var cityName = _cityHistory[itemIndex].name;
        var stateName = _cityHistory[itemIndex].state;
        var searchTerm = cityName + ", " + stateName;
        queryOpenweather(searchTerm);
    };
});

// $(".dropdown-item").on("click", function() {
//     var searchTerm = this.textContent;
//     queryOpenweather(searchTerm);
// });

//  **  Logic


