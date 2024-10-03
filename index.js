"use strict";

/**
 * данные по заметка {obj}
 *
 */
let tasks = [];

const LocalElementNots = "nots";
const LocalElementGeo = "geo";

//при загрузке окна загружаются данные с локала
window.addEventListener("load", () => {
  startOfRendering();
});

//при завершении сеанса загружаются данные в локал
window.onbeforeunload = function () {
  endOfWork();
};

/**
 * вызов содержащих функций каждую секунду
 */
function callingСontainingEverySecond() {
  setElementHHMMSS();
  setElementDDMonthDaysWeek();
  setBackgroundImage();
}

setInterval(callingСontainingEverySecond, 1000);

//создание заметки при нажатии на enter
document.addEventListener("keyup", (event) => {
  if (event.code === "Enter") {
    creatTaskByRules();
  }
});

/**
 * вызов содержащих функций каждые 5 минут
 */
function callingСontainingEvery5Minuts() {
  setValueTemperature();
  setStatusWeather();
}

setInterval(callingСontainingEvery5Minuts, 300000);

/**
 * 1) удаление заметки по нажатию на кнопку
 * 2) загрузка в локал изменения статуса чекбокса
 * 3) открытие/закрытие заметки по нажатию на заголовок
 */
document.addEventListener("click", (e) => {
  if (e.target.classList.value === "nots__header-button") {
    removeTask(e.target.id);
  } else if (e.target.classList.value === "nots__header-checked") {
    loadsStatusCheckboxChange(e.target.id.substring(5), e.target.checked);
  } else if (e.target.classList.value === "nots__header-h3") {
    changesVisibilityElement(e.target.id.substring(2));
  }
});

//удаление активных чекбоксов
const btnDeleteActivCheckBox = document.getElementById("btnDeleteChexbox");
btnDeleteActivCheckBox.addEventListener("click", function () {
  deleteNotesOnActiveCheckboxes();
});

//перезагрузка геолокации при нажатии на город
const elementCity = document.getElementById("elementCity");
elementCity.addEventListener("click", function () {
  localStorage.removeItem(LocalElementGeo);
  rebootingInterfacesAtNewCoordinates();
});

/**
 * меняет видимость блока
 * @param {string} id
 */
function changesVisibilityElement(id) {
  let element2 = document.querySelector(`.p${id}`);
  element2.style.display = element2.style.display === "none" ? "block" : "none";
}

/**
 * загружает текущие данные массива заметок в localStorage
 */
async function endOfWork() {
  localStorage.setItem(LocalElementNots, JSON.stringify(tasks));
}

/**
 * загружает данные заметок с localStorage(nots) в массив,
 * также загружает данные по геолокации,
 * запускает функции рендеринга элеметов,требующие геологации,
 * запускает рендер заметок с массива
 */
async function startOfRendering() {
  await getCoordinate();
  setCity();
  setValueTemperature();
  setStatusWeather();
  const defaultValue = [];
  let tasksFromStore = await JSON.parse(localStorage.getItem(LocalElementNots));
  if (tasksFromStore !== defaultValue && tasksFromStore !== null) {
    tasks = tasksFromStore;
    setValueSumNotsInHTML();
  }
}

/**
 * генерирует случайный id для заметок c отметкой полной даты
 * @returns {string} случайный id
 */
function getRandomIdNots() {
  return Math.random().toString(36).substring(2, 9) + new Date().getTime();
}

/**
 * получает значение инпута
 * @returns {string} возвращает строковое значение
 */
function getValueInput() {
  const element = document.getElementById("inputGetNots");
  const value = element.value;
  return value.toString();
}

/**
 * получает значение тектовой ареи
 * @returns {string} возвращает строковое значение
 */
function getValueTextArea() {
  const element = document.getElementById("AreaNots");
  const value = element.value;
  return value;
}

/**
 * очищает поле инпута
 */
function clearInput() {
  let element = document.getElementById("inputGetNots");
  element.value = "";
}

/**
 * очищает поле текст ареи
 */
function clearTeatArea() {
  let element = document.getElementById("AreaNots");
  element.value = "";
}

/**
 * пушит данные по заметке в массив,
 * каллбеком запускает функцию рендера заметок
 */
async function creatTask(valueArea, valueInput) {
  const randomId = getRandomIdNots();
  const checked = false;
  tasks.push({
    id: randomId,
    head: valueInput,
    main: valueArea,
    checked: checked,
  });
  setValueSumNotsInHTML();
}

/**
 * создает сумму тел заметок заметок для внедрения в DOM HTML
 * @returns {string}
 */
function getValueSumNots() {
  let resultSetInDOM = "";
  for (let element in tasks) {
    const oneNot = creatorNots(
      tasks[element].id,
      tasks[element].checked
    );
    resultSetInDOM += oneNot;
  }
  return resultSetInDOM;
}

/**
 * устанавливает значение заметок в HTML
 */
async function setValueSumNotsInHTML() {
  let resultSetInDOM = getValueSumNots();
  let elementPlaceNots = document.getElementById("placeRenderNots");
  elementPlaceNots.innerHTML = resultSetInDOM;
  setValueInNots();
}

/**
 * устанавливает текстовые значения заголовка и параграфа
 */
function setValueInNots() {
  for (let element in tasks) {
    let id = tasks[element].id;
    let head = tasks[element].head;
    let main = tasks[element].main;

    let elementHead = document.getElementById(`h3${id}`);
    elementHead.innerText = head;

    let elemP = document.getElementById(`p${id}`);
    elemP.innerText = main;
  }
}

/**
 * создает тело заметки со всеми данными для HTML
 * @param {string} ids
 * @param {string} titles
 * @param {string} paragrafis
 * @param {boolean} checked
 * @returns {string}
 */
function creatorNots(
  ids,

  checked
) {
  let check;
  if (checked === true) {
    check = "checked";
  } else {
    check = "";
  }
  const resultNots = `<div class="mainNote" id="mainNote${ids}"> 
      <div class="nots__header" id="divNotId${ids}" >
        <input type="checkbox" class="nots__header-checked" id='check${ids}' ${check} >
        <button class="nots__header-button"  id ="${ids}">☓</button>
        <h3 class ="nots__header-h3" id="h3${ids}" ></h3>
      </div>
      <div style="display: none;"class="boxISMainNots p${ids} nots__footer" id="iddiv${ids}">
       <p class="notsP" id="p${ids}"></p>
      </div>
  </div>`;
  return resultNots;
}

/**
 * удаляет данные заметки по id в массиве, вызывается функция удаления из DOM HTML
 * @param {string} valueBTN
 */
function removeTask(valueBTN) {
  for (let i = 0; i < tasks.length; i++) {
    if (String(tasks[i].id) == valueBTN) {
      tasks.splice(i, 1);
      removeItemHtml(valueBTN);
    }
  }
}

/**
 * загружает в массив изменение статуса чекбокса
 * @param {string} idCheckBox
 * @param {boolean} check
 */
function loadsStatusCheckboxChange(idCheckBox, check) {
  for (let i = 0; i < tasks.length; i++) {
    if (String(tasks[i].id) == idCheckBox) {
      tasks[i].checked = check;
    }
  }
}

/**
 * удаляет тело заметки из HTML по ID
 * @param {string} currentId
 */
function removeItemHtml(currentId) {
  const element = document.getElementById(`divNotId${currentId}`);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  element.remove();

  const elementP = document.getElementById(`p${currentId}`);
  elementP.remove();

  const element2 = document.getElementById(`iddiv${currentId}`);
  element2.remove();

  const mainNote = document.getElementById(`mainNote${currentId}`);
  mainNote.remove();
}

/**
 * проверяет чтобы строки ареи и инпута были не пустые, если удачно то запускает создание заметки
 */
async function creatTaskByRules() {
  const valArea = await getValueTextArea();
  const valInput = await getValueInput();
  if (valArea.trim() !== "" && valInput.trim() !== "") {
    creatTask(valArea, valInput);
    clearInput();
    clearTeatArea();
  } else {
    alert("кажется какое-то поле пустое...");
  }
}

/**
 * удаление заметки по активным чекбоксам
 */
function deleteNotesOnActiveCheckboxes() {
  let elementsActiveCheckBox = document.querySelectorAll(
    "input[type='checkbox']:checked"
  );
  for (let i = 0; i < elementsActiveCheckBox.length; i++) {
    removeTask(elementsActiveCheckBox[i].id.substring(5));
  }
}

/**
 * получает значение текущего часа
 * @returns {number} час
 */
function getHour() {
  const time = new Date();
  const hours = time.getHours();
  return hours;
}

/**
 * создает координаты по местоположению
 * @returns {object} возвращает координаты найденные по геопозиции
 */
async function getCurrentCoordinate() {
  const { latitude: lat, longitude: lon } = await new Promise((res) =>
    navigator.geolocation.getCurrentPosition((position) => res(position.coords))
  );
  return { lat, lon };
}

/**
 * возвращает координаты в зависисмости от состояния localStorage и confirm(a)
 * отправляет либо сохраненые координаты с LocalStorage либо предлогает город по умолчанию
 * по отказу города по умолчанию возвращает текущую геопозицию
 * так же сохраняет координаты сразу в локалку
 * @returns {object} координаты
 * @param {number} lat
 * @param {number} lon
 */
async function getCoordinate() {
  let coord = await JSON.parse(localStorage.getItem(LocalElementGeo));
  if (coord) {
    const lat = coord.lat;
    const lon = coord.lon;
    return { lat, lon };
  } else {
    const confirmValue = confirm("Ваш город Краснодар?");
    if (confirmValue === true) {
      const lat = 45.0220237;
      const lon = 39.0311905;
      localStorage.setItem(LocalElementGeo, JSON.stringify({ lat, lon }));
      return { lat, lon };
    } else {
      const { lat, lon } = await getCurrentCoordinate();
      localStorage.setItem(LocalElementGeo, JSON.stringify({ lat, lon }));
      return { lat, lon };
    }
  }
}

/**
 * для получения города по полученым координатам
 * @param {object}
 * @returns {string} город
 */
async function getCityByCoordinate({ lat, lon }) {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ru`
  );
  const { city } = await res.json();
  return city;
}

/**
 * получение города
 * @returns {string} город
 */
async function getCurrentCity() {
  const coordinate = await getCoordinate();
  const city = await getCityByCoordinate(coordinate);
  return city;
}

/**
 * устанавливает значение города в DOM HTML
 */
async function setCity() {
  const city = await getCurrentCity();
  const elementCity = document.getElementById("elementCity");
  elementCity.innerHTML = city;
}

/**
 * получает новые координаты и перезагружает значение полей где используется геолокация
 */
async function rebootingInterfacesAtNewCoordinates() {
  await getCoordinate();
  setValueTemperature();
  setStatusWeather();
  setCity();
}

/**
 *  получает пакет данных с апи погоды по полученым координатам
 * @param
 * @returns {object} weather
 */
async function getWeatherByCoordinate({ lat, lon }) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&daily=weather_code&timezone=Europe%2FMoscow&forecast_days=1`
  );
  const weather = await res.json();
  return weather;
}

/**
 * получает пакет погоды
 * @returns {object} пакет погоды
 */
async function getWeather() {
  const coordinate = await getCoordinate();
  const weather = await getWeatherByCoordinate(coordinate);
  return weather;
}

/**
 * получает значение температуры на текущий час
 * @returns {number} температура в градусах цельсия
 */
async function unpackWeatherDoObj() {
  const weather = await getWeather();
  const hour = getHour();
  const result = await weather.hourly.temperature_2m[hour];
  return result;
}

/**
 * устанавливает значение температуры в виде "88.8 ℃" в HTML
 */
async function setValueTemperature() {
  const element = document.getElementById("valueTemperature");
  let result = await unpackWeatherDoObj();
  result += " ℃";
  element.innerHTML = result;
}

/**
 * ключи-значения статуса погоды
 */
const keyWeather = {
  0: "Ясное небо",
  1: "Преимущественно ясно",
  2: "Переменная облачность",
  3: "Пасмурно",
  45: "Туман",
  48: "Изморозь",
  51: "Морось: слабая",
  53: "Морось: умеренная",
  55: "Морось: интенсивная",
  56: "Замерзающая морось: слабая",
  57: "Замерзающая морось: итенсиивная",
  61: "Дождь: слабый",
  63: "Дождь: умеренный",
  65: "Дождь: сильный",
  66: "Замерзающий дождь: слабой интенсивности",
  67: "Замерзающий дождь: сильной интенсивнсти",
  71: "Снегопад: слабый",
  73: "Снегопад: умеренный",
  75: "Снегопад: сильный",
  77: "Снежные зерна",
  80: "Ливневые дожди: слабые",
  81: "Ливневые дожди: умеренный",
  82: "Ливневые дожди: сильные",
  85: "Снежные ливни слабые",
  86: "Снежные ливни сильные",
  95: "Гроза: слабая или умеренная",
  96: "Гроза с небольшим градом",
  99: "Гроза с  сильным градом",
};

/**
 * получает статус погоды(например: "пасмурно")
 * @returns {string} статус погоды
 */
async function getWeatherStatus() {
  const weather = await getWeather();
  const weatherStatusNumber = weather.daily.weather_code[0];
  return keyWeather[weatherStatusNumber];
}

/**
 * устанавливает статус погоды в HTML
 */
async function setStatusWeather() {
  const element = document.getElementById("weatherStatus");
  const status = await getWeatherStatus();
  element.innerHTML = status;
}

/**
 * Для получения времени формата HH MM SS
 * @returns {string} возвращает значение HHMMSS
 */
function getDataHHMMSS() {
  const data = new Date();
  return data.toLocaleTimeString("it-IT");
}

/**
 * Для получения времени формата DD Mounth DayWeek
 * @returns {string} возвращает значение DDMounthDayWeek
 */
function getDataDDMonthDaysWeek() {
  const data = new Date();
  const time = data
    .toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      weekday: "long",
    })
    .split(",")
    .reverse()
    .join(", ");
  return time;
}

/**
 * Для поиска подходящего изображения от текущего часа
 * @returns {string} возвращает URL изображения
 */
function checkingTimeForImg() {
  const time = new Date();
  const checkHour = time.toLocaleTimeString("it-IT");
  if (checkHour >= "00:00:00" && checkHour <= "06:00:00")
    return "url(./imgFon/night.jpg)";
  else if (checkHour > "06:00:00" && checkHour <= "12:00:00")
    return "url(./imgFon/morning.jpg)";
  else if (checkHour > "12:00:00" && checkHour <= "18:00:00")
    return "url(./imgFon/day.jpg)";
  else if (checkHour > "18:00:00" && checkHour <= "23:59:59")
    return "url(./imgFon/evening.jpg)";  
}

/**
 * устанавливает полученное значение HHMMSS в DOM HTML
 */
function setElementHHMMSS() {
  const time = getDataHHMMSS();
  const element = document.getElementById("elemHourMinutScond");
  element.innerHTML = time;
}

/**
 * устанавливает полученное значение DDMonthDaysWeek в DOM HTML
 */
function setElementDDMonthDaysWeek() {
  const time = getDataDDMonthDaysWeek();
  const element = document.getElementById("elemDayMounthDayWeek");
  element.innerHTML = time;
}

/**
 *  устанавливает подходящее изображение по текущему часу
 * @param {string} UrlImage
 */
function setBackgroundImage() {
  const UrlImage = checkingTimeForImg();
  const element = document.getElementById("slice");
  
  switch(UrlImage){
    case "url(./imgFon/night.jpg)": element.style.color = 'white';
    break;
    case "url(./imgFon/morning.jpg)": element.style.color = 'dark';
    break;
    case "url(./imgFon/day.jpg)": element.style.color = 'dark';
    break;
    case "url(./imgFon/evening.jpg)": element.style.color = 'white';
    break;
  }
  element.style.backgroundImage = UrlImage;
}

// устанавливаем триггер для модального окна (название можно изменить)
const modalTrigger = document.getElementsByClassName("trigger")[0];

// получаем ширину отображенного содержимого и толщину ползунка прокрутки
const windowInnerWidth = document.documentElement.clientWidth;
const scrollbarWidth = parseInt(window.innerWidth) - parseInt(document.documentElement.clientWidth);

// привязываем необходимые элементы
const bodyElementHTML = document.getElementsByTagName("body")[0];
const modalBackground = document.getElementsByClassName("modalBackground")[0];
const modalClose = document.getElementsByClassName("modalClose")[0];
const modalActive = document.getElementsByClassName("modalActive")[0];
// функция для корректировки положения body при появлении ползунка прокрутки
function bodyMargin() {
  bodyElementHTML.style.marginRight = "-" + scrollbarWidth + "px";
}

// при длинной странице - корректируем сразу
bodyMargin();

// событие нажатия на триггер открытия модального окна
modalTrigger.addEventListener("click", function () {
  // делаем модальное окно видимым
  modalBackground.style.display = "block";

  // если размер экрана больше 1366 пикселей (т.е. на мониторе может появиться ползунок)
  if (windowInnerWidth >= 1366) {
      bodyMargin();
  }

  // позиционируем наше окно по середине, где 175 - половина ширины модального окна
  modalActive.style.left = "calc(50% - " + (175 - scrollbarWidth / 2) + "px)";
});

// нажатие на крестик закрытия модального окна
modalClose.addEventListener("click", function () {
  modalBackground.style.display = "none";
  if (windowInnerWidth >= 1366) {
      bodyMargin();
  }
});

// закрытие модального окна на зону вне окна, т.е. на фон
modalBackground.addEventListener("click", function (event) {
  if (event.target === modalBackground) {
      modalBackground.style.display = "none";
      if (windowInnerWidth >= 1366) {
          bodyMargin();
      }
  }
});