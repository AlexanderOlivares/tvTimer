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

// vars below for save custom timer feature (coming soon)
// let saveHour = document.getElementById("saveHour");
// let saveMin = document.getElementById("saveMin");
// let saveSec = document.getElementById("saveSec");

// let saveDelay = document.getElementById("saveDelay");
// let saveTimer = document.getElementById("saveTimer");

const timesToSpeak = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 30];

let isMuted = false;
let onDelay = true;

let delayLength;
let timerInterval;

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

  // handles user input with multiple leading zeros like 0003 minutes
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

const hideInputs = () => {
  if (!!delayLength) delayIndicator.style.display = "flex";
  inputHour.style.display = "none";
  inputMin.style.display = "none";
  inputSec.style.display = "none";
  inputHeaders.style.display = "none";
  delayHeader.style.display = "none";
  delay.style.display = "none";
};

const showInputs = () => {
  delayIndicator.style.display = "none";
  inputHour.style.display = "block";
  inputMin.style.display = "block";
  inputSec.style.display = "block";
  inputHeaders.style.display = "flex";
  delayHeader.style.display = "flex";
  delay.style.display = "block";
};
