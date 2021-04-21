let displayHour = document.getElementById("displayHour");
let displayMin = document.getElementById("displayMin");
let displaySec = document.getElementById("displaySec");

let start = document.getElementById("start");
let reset = document.getElementById("reset");
let mute = document.getElementById("mute");

let inputHeaders = document.querySelector(".inputHeaders");
let delayHeader = document.getElementById("delayHeader");

let hour = document.getElementById("inputHour");
let min = document.getElementById("inputMin");
let sec = document.getElementById("inputSec");

let delay = document.getElementById("delay");
let setTimer = document.getElementById("setTimer");

let saveHour = document.getElementById("saveHour");
let saveMin = document.getElementById("saveMin");
let saveSec = document.getElementById("saveSec");

let saveDelay = document.getElementById("saveDelay");
let saveTimer = document.getElementById("saveTimer");

function timer() {
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
    min.value = 60;
    sec.value = 59;
  } else {
    alert("An error occured. Please refresh the browser.");
    return;
  }
}

function addLeadingZero(strOfNum) {
  return +strOfNum < 10 ? `0${strOfNum}` : strOfNum;
}

let timerInterval;
function startTimer() {
  timerInterval = setInterval(() => {
    timer();
    displayHour.innerText = hour.value;
    displayMin.innerText = addLeadingZero(min.value);
    displaySec.innerText = addLeadingZero(sec.value);
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  hour.value = 0;
  min.value = 0;
  sec.value = 0;
  displayHour.innerText = "00";
  displayMin.innerText = "00";
  displaySec.innerText = "00";
}

function hideInputs() {
  inputHour.style.display = "none";
  inputMin.style.display = "none";
  inputSec.style.display = "none";
  inputHeaders.style.display = "none";
  delayHeader.style.display = "none";
  delay.style.display = "none";
  setTimer.style.display = "none";
}

function showInputs() {
  inputHour.style.display = "block";
  inputMin.style.display = "block";
  inputSec.style.display = "block";
  inputHeaders.style.display = "flex";
  delayHeader.style.display = "block";
  delay.style.display = "block";
  setTimer.style.display = "block";
}
start.addEventListener("click", () => {
  startTimer();
  hideInputs();
});

reset.addEventListener("click", () => {
  resetTimer();
  showInputs();
});
