
## Call current weather data for one location

### By city name
> Description:
You can call by city name or city name, state and country code. API responds with a list of results that match a searching word.

> API call:
api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
api.openweathermap.org/data/2.5/weather?q={city name},{state}&appid={your api key}
api.openweathermap.org/data/2.5/weather?q={city name},{state},{country code}&appid={your api key}

> Parameters:
q city name, state and country code divided by comma, use ISO 3166 country codes. You can specify the parameter not only in English. In this case, the API response should be returned in the same language as the language of requested location name if the location is in our predefined list of more than 200,000 locations.

> Examples of API calls:
api.openweathermap.org/data/2.5/weather?q=London
api.openweathermap.org/data/2.5/weather?q=London,uk

Searching by states available only for the USA locations. 
There is a possibility to receive a central district of the city/town with its own parameters (geographic coordinates/id/name) in API response. Example

### By city ID
> Description:
You can call by city ID. API responds with exact result. 
We recommend to call API by city ID to get unambiguous result for your city.

List of city ID city.list.json.gz can be downloaded here http://bulk.openweathermap.org/sample/

> API call:
api.openweathermap.org/data/2.5/weather?id={city id}&appid={your api key}

> Parameters:
id City ID

> Examples of API calls:
api.openweathermap.org/data/2.5/weather?id=2172797

### By geographic coordinates
> API call:
api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={your api key}

> Parameters:
lat, lon coordinates of the location of your interest

> Examples of API calls:
api.openweathermap.org/data/2.5/weather?lat=35&lon=139

### By ZIP code
> Description:
Please note if country is not specified then the search works for USA as a default.

> API call:
api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={your api key}

> Examples of API calls:
api.openweathermap.org/data/2.5/weather?zip=94040,us

> Parameters:
zip zip code


## Call current weather for multiple cities

### Cities within a rectangle zone
> Description:
JSON returns the data from cities within the defined rectangle specified by the geographic coordinates.

> Parameters:
bbox bounding box [lon-left,lat-bottom,lon-right,lat-top,zoom]
callback javascript functionName
cluster use server clustering of points. Possible values ​​are [yes, no]
lang language [ru, en ... ]

> Examples of API calls:
http://api.openweathermap.org/data/2.5/box/city?bbox=12,32,15,37,10
There is a limit of 25 square degrees for Free and Startup plans.

### Cities in cycle
> Description:
JSON returns data from cities laid within definite circle that is specified by center point ('lat', 'lon') and expected number of cities ('cnt') around this point. The default number of cities is 10, the maximum is 50.

> Parameters:
lat latitude
lon longitude
callback functionName for JSONP callback.
cluster use server clustering of points. Possible values ​​are [yes, no]
lang language [en , ru ... ]
cnt number of cities around the point that should be returned

> Examples of API calls:
http://api.openweathermap.org/data/2.5/find?lat=55.5&lon=37.5&cnt=10

### Call for several city IDs
> Parameters:
id City ID

> Examples of API calls:
http://api.openweathermap.org/data/2.5/group?id=524901,703448,2643743&units=metric

    The limit of locations is 20. 
    If you request weather data for several ID, then you will get the response only in JSON format (XML and HTML formats are not available for this case). 
    NOTE: A single ID counts as a one API call! So, the above example is treated as a 3 API calls.


## Parameters:
- coord
    - coord.lon City geo location, longitude
    - coord.lat City geo location, latitude
- weather (more info Weather condition codes)
    - weather.id Weather condition id
    - weather.main Group of weather parameters (Rain, Snow, Extreme etc.)
    - weather.description Weather condition within the group. You can get the output in your language. Learn more
    - weather.icon Weather icon id
- base Internal parameter
- main
    - main.temp Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
    - main.feels_like Temperature. This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
    - main.pressure Atmospheric pressure (on the sea level, if there is no sea_level or grnd_level data), hPa
    - main.humidity Humidity, %
    - main.temp_min Minimum temperature at the moment. This is deviation from current temp that is possible for large cities and megalopolises geographically expanded (use these parameter optionally). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
    - main.temp_max Maximum temperature at the moment. This is deviation from current temp that is possible for large cities and megalopolises geographically expanded (use these parameter optionally). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
    - main.sea_level Atmospheric pressure on the sea level, hPa
    - main.grnd_level Atmospheric pressure on the ground level, hPa
- wind
    - wind.speed Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
    - wind.deg Wind direction, degrees (meteorological)
- clouds
    - clouds.all Cloudiness, %
- rain
    - rain.1h Rain volume for the last 1 hour, mm
    - rain.3h Rain volume for the last 3 hours, mm
- snow
    - snow.1h Snow volume for the last 1 hour, mm
    - snow.3h Snow volume for the last 3 hours, mm
- dt Time of data calculation, unix, UTC
- sys
    - sys.type Internal parameter
    - sys.id Internal parameter
    - sys.message Internal parameter
    - sys.country Country code (GB, JP etc.)
    - sys.sunrise Sunrise time, unix, UTC
    - sys.sunset Sunset time, unix, UTC
- timezone Shift in seconds from UTC
- id City ID
- name City name
- cod Internal parameter

## JSON
> Example of API response:

{
  "coord": {
    "lon": -122.08,
    "lat": 37.39
  },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 282.55,
    "feels_like": 281.86,
    "temp_min": 280.37,
    "temp_max": 284.26,
    "pressure": 1023,
    "humidity": 100
  },
  "visibility": 16093,
  "wind": {
    "speed": 1.5,
    "deg": 350
  },
  "clouds": {
    "all": 1
  },
  "dt": 1560350645,
  "sys": {
    "type": 1,
    "id": 5122,
    "message": 0.0139,
    "country": "US",
    "sunrise": 1560343627,
    "sunset": 1560396563
  },
  "timezone": -25200,
  "id": 420006353,
  "name": "Mountain View",
  "cod": 200
}