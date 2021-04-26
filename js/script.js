import { myApikey } from './myApiKey.js';
import { loadData, saveData } from './localStorage.js';

window.addEventListener('load', () => {
  fetchData();
  document.querySelector('form').addEventListener('submit', fetchData);
});
const fetchData = async (e) => {
  if (e) {
    e.preventDefault();
  }
  const myKey = myApikey;
  const url = 'https://api.openweathermap.org/data/2.5/weather';
  const input = document.querySelector('input');
  const search = input.value || loadData('location') || 'Delhi';
  const response = await fetch(
    `${url}?q=${search}&units=metric&appid=${myKey}`
  );
  const data = await response.json();
  if (data.cod === '404') {
    input.placeholder = 'sorry! location not found.';
    setInterval(() => {
      input.placeholder = 'Search location';
    }, 2000);
    input.value = '';
    return;
  }
  console.log(data);
  renderDom(data);
  input.value = '';
};

var renderDom = (data) => {
  const box = document.querySelector('.box');
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const location = document.getElementById('location');
  const date = document.getElementById('date');
  const getDates = new Date();
  const temperature = document.getElementById('temp');
  const desc_icon = document.getElementById('desc_icon');
  const desc = document.getElementById('desc');
  const windSpeed = document.getElementById('windSpeed');
  const humid = document.getElementById('humidity');
  const sun_rise = document.getElementById('sunrise');
  const sun_set = document.getElementById('sunset');
  const temp_min_max = document.getElementById('temp_min_max');

  // Extracting values from data
  const { name } = data;
  const { icon, description } = data.weather[0];
  const { temp, humidity, temp_max, temp_min } = data.main;
  const { speed } = data.wind;
  const { sunset, sunrise, country } = data.sys;

  saveData('location', name);

  location.innerHTML = `${name}, ${country}`;
  date.innerHTML = `${days[getDates.getDay()]},  ${getDates.getDate()} ${
    months[getDates.getMonth()]
  } ${getDates.getFullYear()}
  `;
  temperature.innerHTML = `${Math.round(temp)}°<span>C</span>`;
  desc_icon.innerHTML = `<img src='https://openweathermap.org/img/wn/${icon}@2x.png'/> `;
  desc.innerHTML = `${description}`;
  humid.innerHTML = `Humidity:  ${humidity}%`;
  sun_rise.innerHTML = `${timeConverter(sunrise)}`;
  sun_set.innerHTML = `${timeConverter(sunset)}`;
  temp_min_max.innerHTML = `Temperature:  ${temp_max}°<span>C</span> / ${temp_min}°<span>C</span>`;
  windSpeed.innerHTML = `Wind speed:  ${speed}km/h`;
};

const timeConverter = (unix_timeStamp) => {
  const date = new Date(unix_timeStamp * 1000);
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();

  hour = hour < 10 ? `0${hour}` : hour;
  min = min < 10 ? `0${min}` : min;
  sec = sec < 10 ? `0${sec}` : sec;

  const time = hour + ':' + min + ':' + sec;
  return time;
};
