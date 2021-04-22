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

const timesToSpeak = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 30];

let isMuted = false;
let onDelay = true;

let delayLength;
let timerInterval;

start.addEventListener("click", () => {
  delayLength = +delay.value;
  startTimer(delayLength);
  hideInputs();
});

const startTimer = delayLength => {
  timerInterval = setInterval(() => {
    timer(delayLength);
    start.disabled = true;
    displayHour.innerText = addLeadingZero(hour.value);
    displayMin.innerText = addLeadingZero(min.value);
    displaySec.innerText = addLeadingZero(sec.value);
  }, 1000);
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

  if (hour.value == 0 && min.value == 0 && sec.value <= 10) {
    displaySec.style.backgroundColor = "red";
  }

  if (!isMuted) {
    if (onDelay) {
      voiceCountdownOnDelay(delayLength);
    } else {
      voiceCountdown();
    }
  }
};

const voiceCountdownOnDelay = delayLength => {
  speakSecondsLeft(hour.value, min.value, `${sec.value - delayLength}`);
  speakMinutesLeft(hour.value, min.value, `${sec.value - delayLength}`);
  timeExpired(hour.value, min.value, sec.value);
};

const voiceCountdown = () => {
  speakSecondsLeft(hour.value, min.value, sec.value);
  speakMinutesLeft(hour.value, min.value, sec.value);
  timeExpired(hour.value, min.value, sec.value);
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

const timeExpired = (hour, min, sec) => {
  if (+hour === 0 && +min === 0 && +sec === 0) {
    responsiveVoice.speak("time expired");
    clearInterval(timerInterval);
    showInputs();
  }
};

const addLeadingZero = strOfNum => {
  if (strOfNum === "00") {
    return "00";
  }
  return +strOfNum < 10 ? `0${strOfNum}` : strOfNum;
};

reset.addEventListener("click", () => {
  resetTimer();
  showInputs();
});

const resetTimer = () => {
  clearInterval(timerInterval);
  start.disabled = false;
  hour.value = 0;
  min.value = 0;
  sec.value = 0;
  displayHour.innerText = "00";
  displayMin.innerText = "00";
  displaySec.innerText = "00";
};

mute.addEventListener("click", () => {
  isMuted = !isMuted;
  mute.classList.toggle("btn-danger");
});

const hideInputs = () => {
  inputHour.style.display = "none";
  inputMin.style.display = "none";
  inputSec.style.display = "none";
  inputHeaders.style.display = "none";
  delayHeader.style.display = "none";
  delay.style.display = "none";
  setTimer.style.display = "none";
};

const showInputs = () => {
  inputHour.style.display = "block";
  inputMin.style.display = "block";
  inputSec.style.display = "block";
  inputHeaders.style.display = "flex";
  delayHeader.style.display = "block";
  delay.style.display = "block";
  setTimer.style.display = "block";
};
