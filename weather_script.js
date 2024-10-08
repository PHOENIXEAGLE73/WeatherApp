const userlocation = document.getElementById("userlocation"),
  converter = document.getElementById("converter"),
  converters = document.getElementsByClassName("converter"),
  weather = document.querySelector(".weather-icon"),
  temperature = document.querySelector(".temperature"),
  feelslike = document.querySelector(".feelslike"),
  description = document.querySelector(".description"),
  date = document.querySelector(".date"),
  city = document.querySelector(".city"),
  Hvalue = document.getElementById("Hvalue"),
  Wvalue = document.getElementById("Wvalue"),
  SRvalue = document.getElementById("SRvalue"),
  SSvalue = document.getElementById("SSvalue"),
  Cvalue = document.getElementById("Cvalue"),
  UVvalue = document.getElementById("UVvalue"),
  Pvalue = document.getElementById("Pvalue"),
  forecast = document.querySelector(".forecast");

WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=a5bb4718b30b6f58f58697997567fffa
&q=`;
WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/2.5/onecall?appid=a5bb4718b30b6f58f58697997567fffa&exclude-minutely&units=metric&`;


function finduserlocation() {
  forecast.innerHTML = '';

  fetch(WEATHER_API_ENDPOINT + userlocation.value)
    .then((Response) => Response.json())
    .then((data) => {
      if (data.cod != '' && data.cod != 200) {
        alert(data.message);
        return;

      }
      console.log(data);

      city.innerHTML = data.name + " , " + data.sys.country;
      weather.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;

      fetch(WEATHER_DATA_ENDPOINT + `lon=${data.coord.lon}&lat=${data.coord.lat}`)
        .then((Response) => Response.json())
        .then((data) => {

          console.log(data);

          temperature.innerHTML = TemConverter(data.current.temp);
          feelslike.innerHTML = "Feels like" + data.current.feels_like;
          description.innerHTML = `<i class="fa-brands fa-cloudversify"></i>&nbsp;` + data.current.weather[0].description;

          const options = {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }
          date.innerHTML = getLongFormatDateTime(data.current.dt, data.timezone_offset, options);

          Hvalue.innerHTML = Math.round(data.current.humidity) + "<span>%</span>";
          Wvalue.innerHTML = Math.round(data.current.wind_speed) + "<span>m/s</span>";
          const options1 = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };
          SRvalue.innerHTML = getLongFormatDateTime(data.current.sunrise, data.timezone_offset, options1);
          SSvalue.innerHTML = getLongFormatDateTime(data.current.sunset, data.timezone_offset, options1);
          Cvalue.innerHTML = data.current.clouds + "<span>%</span>";
          UVvalue.innerHTML = data.current.uvi;
          Pvalue.innerHTML = data.current.pressure + "<span>hPa</span>";


          // console.log(data.daily);
          data.daily.forEach((weather) => {
            let div = document.createElement("div");

            const options = {
              weekday: "long",
              month: "long",
              day: "numeric"
            };
            let daily = getLongFormatDateTime(weather.dt, 0, options).split(" at ");
            div.innerHTML = daily[0];
            div.innerHTML += `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" "">`;
            div.innerHTML += `<p class="forecast-discription">${weather.weather[0].description}</p>`;
            div.innerHTML += `<span><span>${TemConverter(weather.temp.min)}</span>&nbsp;&nbsp;<span>${TemConverter(weather.temp.max)}</span></span>`
            forecast.append(div);
          });


        });
    });
}

function formatUnixTime(dtValue, offset, options = {}) {
  const date = new Date((dtValue + offset) * 1000);
  return date.toLocaleTimeString([], { timezone: "UTC", ...options });

}

function getLongFormatDateTime(dtValue, offset, options) {
  return formatUnixTime(dtValue, offset, options);
}

function TemConverter(temp) {
  let tempValue = Math.round(temp);
  let message = "";
  if (converter.value == ".c") {
    message = tempValue + "<span>" + "\xB0C</span>";
  }
  else {
    let ctof = (tempValue * 9) / 5 + 32;
    message = tempValue + "<span>" + "\xB0F</span>";
  }
  return message;
}