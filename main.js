let displayHour = document.getElementById("displayHour");
let displayMin = document.getElementById("displayMin");
let displaySec = document.getElementById("displaySec");

let start = document.getElementById("start");
let reset = document.getElementById("reset");
let mute = document.getElementById("mute");

let inputHeaders = document.querySelector(".inputHeaders");
let delayHeader = document.getElementById("delayHeader");
let delayIndicator = document.getElementById("delayIndicator");

let hour = document.getElementById("inputHour");
let min = document.getElementById("inputMin");
let sec = document.getElementById("inputSec");

let delay = document.getElementById("delay");
let info = document.getElementById("info");

let saveHour = document.getElementById("saveHour");
let saveMin = document.getElementById("saveMin");
let saveSec = document.getElementById("saveSec");

let saveDelay = document.getElementById("saveDelay");
let saveTimer = document.getElementById("saveTimer");
let tableBody = document.getElementById("tableBody");

let savedTitle = document.getElementById("savedTitle");
let tableContainer = document.getElementById("tableContainer");
let saveNewTimerButton = document.getElementById("saveNewTimerButton");

// grab saved timers from local stoarage and assign key
let savedTimers = Object.keys(localStorage);
let timerID = savedTimers.length ? Math.max(...savedTimers.map(Number)) + 1 : 1;

const timesToSpeak = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 30];

let isMuted = false;

let delayLength;
let timerInterval;

hour.onchange = () => {
  displayHour.innerText = addLeadingZero(hour.value);
};

min.onchange = () => {
  displayMin.innerText = addLeadingZero(min.value);
};

sec.onchange = () => {
  displaySec.innerText = addLeadingZero(sec.value);
};

const isValidTime = (...arguments) => {
  let times = [...arguments];
  let reg = /^\d{1,2}$/;
  return times.every(time => reg.test(time) && time <= 60);
};

start.addEventListener("click", () => {
  delayLength = +delay.value;
  if (isValidTime(+hour.value, +min.value, +sec.value, delayLength)) {
    delayIndicator.innerText = `Delay: ${delayLength} seconds`;
    startTimer(delayLength);
    hideInputs();
    start.disabled = true;
  } else {
    alert(
      "Invalid time. Please use format 00:00:00 and only enter positive numbers less than or equal to 60."
    );
  }
});

const startTimer = delayLength => {
  if (isValidTime(+hour.value, +min.value, +sec.value, delayLength)) {
    timerInterval = setInterval(() => {
      timer(delayLength);
      displayHour.innerText = addLeadingZero(hour.value);
      displayMin.innerText = addLeadingZero(min.value);
      displaySec.innerText = addLeadingZero(sec.value);
    }, 1000);
  } else {
    alert("An error occured. Please refresh the browser.");
  }
};

const timer = delayLength => {
  if (hour.value == 0 && min.value == 0 && sec.value == 0) {
    hour.value = 00;
    min.value = 00;
    sec.value = 00;
  } else if (sec.value != 0) {
    sec.value--;
  } else if (min.value != 0 && sec.value == 0) {
    sec.value = 59;
    min.value--;
  } else if (hour.value != 0 && min.value == 0) {
    hour.value--;
    min.value = 59;
    sec.value = 59;
  } else {
    alert("An error occured. Please refresh the browser.");
  }

  flashRedUnderTenSecs(hour.value, min.value, displaySec.innerText);

  if (!isMuted) {
    voicedCountdown(delayLength);
  }
};

const flashRedUnderTenSecs = (hour, min, secs) => {
  if (+hour > 0) return;
  if (+min > 0) return;
  if (secs <= 10 && secs > 0) {
    displaySec.classList.toggle("btn-danger");
  }
};

const voicedCountdown = delayLength => {
  speakSecondsLeft(hour.value, min.value, `${sec.value - delayLength}`);
  speakMinutesLeft(hour.value, min.value, `${sec.value - delayLength}`);
  speakTimeExpired(hour.value, min.value, sec.value);
};

const speakSecondsLeft = (hour, min, sec) => {
  if (+hour > 0) return;
  if (+min > 0) return;

  const secondsInNumbers = Number(sec);

  if (timesToSpeak.includes(secondsInNumbers)) {
    if (+sec === 15 || +sec === 30) {
      sec += " seconds";
    }
    responsiveVoice.speak(sec);
  }
};

const speakMinutesLeft = (hour, min, sec) => {
  if (+hour > 0) return;

  if (+min === 2 && +sec === 0) {
    responsiveVoice.speak("two minutes");
  }

  if (+min === 1 && +sec === 30) {
    responsiveVoice.speak("one minute and thirty seconds");
  }

  if (+min === 1 && +sec === 0) {
    responsiveVoice.speak("one minute");
  }
};

const speakTimeExpired = (hour, min, sec) => {
  if (+hour === 0 && +min === 0 && +sec === 0) {
    responsiveVoice.speak("time expired");
    clearInterval(timerInterval);
    resetTimer();
    showInputs();
  }
};

// formats the display time as 00:00:00
const addLeadingZero = strOfNum => {
  let num = +strOfNum;

  // allows for edge case of user input with multiple leading zeros like 0003 minutes
  if (strOfNum.length > 2 && num < 10) {
    strOfNum = strOfNum.slice(-1);
  } else {
    strOfNum = strOfNum.slice(-2);
  }

  if (strOfNum === "00") {
    return "00";
  }

  return +strOfNum < 10 ? `0${strOfNum}` : strOfNum;
};

reset.addEventListener("click", () => {
  clearInterval(timerInterval);
  resetTimer();
  showInputs();
});

const resetTimer = () => {
  clearInterval(timerInterval);
  hour.value = 0;
  min.value = 0;
  sec.value = 0;
  displayHour.innerText = "00";
  displayMin.innerText = "00";
  displaySec.innerText = "00";
  start.disabled = false;
  displaySec.classList.remove("btn-danger");
};

mute.addEventListener("click", () => {
  isMuted = !isMuted;
  mute.innerText = isMuted ? "unmute" : "mute";
  mute.classList.toggle("btn-danger");
});

const displayNone = id => {
  id.style.display = "none";
};

const displayBlock = id => {
  id.style.display = "block";
};

const displayFlex = id => {
  id.style.display = "flex";
};

const hideInputs = () => {
  if (!!delayLength) delayIndicator.style.display = "flex";
  let inputSettingsIds = [
    inputHour,
    inputMin,
    inputSec,
    inputHeaders,
    delayHeader,
    delay,
    savedTitle,
    tableContainer,
    saveNewTimerButton,
  ];
  inputSettingsIds.forEach(id => displayNone(id));
};

const showInputs = () => {
  displayNone(delayIndicator);

  let block = [inputHour, inputMin, inputSec, delay];
  block.forEach(id => displayBlock(id));

  let flex = [
    inputHeaders,
    delayHeader,
    savedTitle,
    tableContainer,
    saveNewTimerButton,
  ];

  flex.forEach(id => displayFlex(id));
};

////////////////////////////////// saved timer code below

saveTimer.addEventListener("click", () => {
  console.log(timerID);
  savedTimers.push(timerID);
  const time = `${saveHour.value}:${saveMin.value}:${saveSec.value}:${saveDelay.value}`;
  localStorage.setItem(
    `${timerID}`,
    `${saveHour.value}:${saveMin.value}:${saveSec.value}:${saveDelay.value}`
  );
  timerID++;
  console.log(timerID);
  appendTime(formatSavedTimes(timerID, time));
});

const formatSavedTimes = (timerID, time) => {
  let splitHyphen = time.split(":");
  let hourMinSec = splitHyphen
    .slice(0, 3)
    .map(e => (e.length === 1 ? `0${e}` : e));
  let delay = splitHyphen.slice(-1).map(e => (e.length === 1 ? `0${e}` : e));
  return [timerID, `${hourMinSec.join(" : ")} | delay: ${delay} seconds`];
};

const appendTime = timeArr => {
  console.log(timeArr);
  let targetId = timeArr[0];
  let hourMinSec = timeArr[1].split("|")[0];
  let delay = timeArr[1].split("|")[1].match(/\d/g).join("");
  let [hour, min, sec] = hourMinSec.split(":").map(e => e.trim());
  let row = document.createElement("tr");
  let style = `style="backdrop-filter: blur(20px) brightness(40%) opacity(70%);"`;

  // creates a row for saved shot
  let html =
    `<th scope="row">` +
    `<td ${style}>` +
    `<button class="btn-primary" onclick="setTimerFromSaved(${hour}, ${min}, ${sec}, ${delay})">Set Time</button>` +
    "</td>" +
    `<td ${style}>` +
    `${hourMinSec}` +
    "</td>" +
    `<td ${style}>` +
    `delay: ${delay}` +
    "</td>" +
    `<td ${style}>` +
    `<button class="btn-danger" onclick="deleteTimer(${targetId})">Delete</button>` +
    "</td>" +
    "</th>";

  row.innerHTML = html;
  row.setAttribute("id", targetId);
  tableBody.appendChild(row);
};

const setTimerFromSaved = (h, m, s, d) => {
  hour.value = h;
  hour.innerText = h;
  min.value = m;
  sec.value = s;
  delay.value = d;
  displayHour.innerText = addLeadingZero(String(h));
  displayMin.innerText = addLeadingZero(String(m));
  displaySec.innerText = addLeadingZero(String(s));
};

const loadSavedTimersFromLocalStorage = () => {
  let savedVals = Object.values(localStorage);
  let savedKeys = Object.keys(localStorage);

  savedVals.forEach((time, index) =>
    appendTime(formatSavedTimes(savedKeys[index], time))
  );
};

loadSavedTimersFromLocalStorage();

const removeAllChildNodes = parent => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const deleteTimer = targetId => {
  let timerToDelete = document.getElementById(targetId);
  localStorage.removeItem(targetId);
  removeAllChildNodes(timerToDelete);
};
