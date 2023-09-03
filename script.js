const apiKey = "ea561c893289169492835eaa1eea7004";

document.addEventListener("DOMContentLoaded", init);

document.body.onload = () => {
    console.log("body onload");
}

function init() {
    getweatherData();
}


function getweatherData() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    var lat = document.getElementById("lat");
    var long = document.getElementById("long");
    var lattitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    lat.innerHTML = "Lat: " + position.coords.latitude;
    long.innerHTML = "Long: " + position.coords.longitude;

    document.getElementById("view-map").setAttribute("src",
        "https://maps.google.com/maps?q=" + position.coords.latitude + ", "
        + position.coords.longitude + "&z=15&output=embed");

    fetchWeather(lattitude, longitude);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }

    window.open("index.html", "_self");
}

function fetchWeather(lattitude, longitude) {
    var lat = document.getElementById("lat");
    var long = document.getElementById("long");

    var location = document.getElementById("location");
    var wind_speed = document.getElementById("wind-speed");
    var humidity = document.getElementById("humidity");
    var time_zone = document.getElementById("time-zone");
    var pressure = document.getElementById("pressure");
    var wind_direction = document.getElementById("wind-direction");
    var uv_index = document.getElementById("uv-index");
    var feels_like = document.getElementById("feels-like");

    var url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lattitude + '&lon=' + longitude + '&appid=' + apiKey;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            location.innerHTML = "Location : " + data["name"];
            wind_speed.innerHTML = "Wind Speed :  " + (parseFloat((data["wind"]["speed"] * 3.6).toFixed(3))) + "kmph";
            humidity.innerHTML = "Humidity : " + data["main"]["humidity"];
            time_zone.innerHTML = "Time Zone : " + secondsToTimeZoneString(data["timezone"]);
            pressure.innerHTML = "Pressure : " + parseFloat((data["main"]["pressure"] / 1013.25)).toFixed(3) + "atm";
            wind_direction.innerHTML = "Wind Direction : " + degreesToWindDirection(data["wind"]["deg"]);
            uv_index.innerHTML = "UV Index : 500";
            feels_like.innerHTML = "Feels like : " + data["main"]["feels_like"];
        })
        .catch(error => {
            window.open("index.html", "_self");
            alert("Unable to Fetch API! " + error);
        })
}

function secondsToTimeZoneString(timeZone) {
    const hours = Math.floor(timeZone / 3600);
    const minutes = Math.floor((timeZone % 3600) / 60);
    const sign = timeZone < 0 ? '-' : '+';
    const formattedTime = `${sign} ${Math.abs(hours).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return `UTC ${formattedTime}`;
}

function degreesToWindDirection(degree) {
    const directions = ["North", "North-Northeast", "Northeast", "East-Northeast", "East", "East-Southeast", "Southeast", "South-Southeast", "South", "South-Southwest", "Southwest", "West-Southwest", "West", "West-Northwest", "Northwest", "North-Northwest"];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index];
}