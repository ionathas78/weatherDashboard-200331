# 06 Server-Side APIs: Weather Dash

> This web app takes a city the user enters, displays weather information about it, and keeps the city in a short
> list on the page to let the user refer back to it as necessary.

The idea of this app was to provide an interface that allowed the user to check weather conditions based on hir input:
ze enters a city, and the app calls the API to retrieve the necessary data for display. Pretty basic. I wanted to include
a map of the area, as well, but the Google API proved flaky and I didn't have time to get the MapQuest API fully integrated
in the website. I also would've liked to use a dropdown in the input box to give the user another history list ze could
use to populate the fields. It also would've been nice if the user could click on a day in the forecast panel to bring up
more details about it in the center pane. Those'll be projects for another time.


## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Design Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

## Usage
https://ionathas78.github.io/weatherDashboard-200331/

To use the page, simply type in the name of the city in the input box at the top right of the screen. It works more
reliably if you enter the state or country with the city, but it's not required. After you have a few results, you
can click or tap on a city in the history list at the bottom to display it.

## Screenshots
![Main Page](./Assets/WeatherDash_Main.png)
![Main Page, Filled](./Assets/WeatherDash_Filled.png)
