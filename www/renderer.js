const audioBrake = new Audio('assets/brake-time.mp3');
const audioWork = new Audio('assets/start-working.mp3');

const root = document.getElementById("app");
const inputField = document.getElementById("input-time");
const playButton = document.getElementById("play-button");
const removeMe = document.querySelectorAll('.remove-me');
const FULL_DASH_ARRAY = 283;
/* const notificationTitle = 'Hey';
const notificationBodyWork = 'It´s time to start working!';
const notificationBodyBrake = 'It´s time to take a brake and make Sindre some coffee!'; */
let workTime = 45 * 60;
const brakeTime = 15 * 60;

inputField.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    playButton.click();
  }
})
inputField.addEventListener('submit', (e) => {
  e.preventDefault();
  playButton.click();
})

playButton.addEventListener("click", () => {
  if(inputField.value != "") {
    let minutesSeconds = inputField.value;
    let minutes = parseInt(minutesSeconds.split(":")[0]);
    let seconds = parseInt(minutesSeconds.split(":")[1]);
    let totalSeconds = seconds + (minutes * 60);
    workTime = totalSeconds;
  }
  removeMe.forEach(item => {
    item.remove();
  })
  const timer = new Timer(root);
})

class Timer {
  constructor(root) {
    root.innerHTML = Timer.getHTML();

    this.el = {
      minutes: root.querySelector('.timer-part-minutes'),
      seconds: root.querySelector('.timer-part-seconds'),
      progress: root.querySelector('#base-timer-path-remaining'),
      totalHours: root.querySelector('.timer-part-totalHours'),
      totalMinutes: root.querySelector('.timer-part-totalMinutes'),
      totalSeconds: root.querySelector('.timer-part-totalSeconds'),
    }

    this.interval = null;
    this.startingSeconds = workTime;
    this.remainingSeconds = this.startingSeconds;
    this.totalTimeInSeconds = (60 * 59) + (60 * 59) + 2;
    this.counter = 0;
    this.isBrake = false;
    this.updateInterfaceTime();
    this.start();
  }

  updateInterfaceTime() {
    const minutes = Math.floor(this.remainingSeconds / 60)
    const seconds = this.remainingSeconds % 60;

    this.el.minutes.textContent = minutes.toString().padStart(2, "0");
    this.el.seconds.textContent = seconds.toString().padStart(2, "0");

    const totalSeconds = this.totalTimeInSeconds % 60;
    let totalMinutes = Math.floor(this.totalTimeInSeconds / 60);
    let outMinutes = totalMinutes % 60;
    let totalHours = Math.floor(totalMinutes / 60);

    this.el.totalHours.textContent = totalHours.toString().padStart(2, "0")
    this.el.totalMinutes.textContent = outMinutes.toString().padStart(2, "0")
    this.el.totalSeconds.textContent = totalSeconds.toString().padStart(2, "0")
  }

  start() {
    this.interval = setInterval(() => {
      this.remainingSeconds--;
      this.totalTimeInSeconds++;
      this.updateInterfaceTime();
      this.setCircleDashArray();
      if (this.remainingSeconds === 0) {
        if (this.counter % 2 == 0) {
          this.isBrake = true;
        } else {
          this.isBrake = false;
        }
        this.counter++;
        if (this.isBrake) {
          this.startingSeconds = brakeTime;
          this.remainingSeconds = brakeTime;
          this.el.progress.classList.add("red")
          audioBrake.play()
        } else {
          this.startingSeconds = 45 * 60;
          this.remainingSeconds = 45 * 60;
          this.el.progress.classList.remove("red")
          audioWork.play()
        }
      }
    }, 1000)
  }

  calculateTimeFraction() {
    return this.remainingSeconds / this.startingSeconds;
  }

  setCircleDashArray() {
    const circleDasharray = `${(
      this.calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
  }

  // Display timer and progress
  static getHTML(color) {
    return `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span id="time-left">
        <!-- Remaining time label -->
          <span class="timer-part timer-part-minutes">00</span>
          <span class="timer-part">:</span>
          <span class="timer-part timer-part-seconds">00</span>
      </span>
    </div>
    <div id="total-time">
      <label>Total time:</label>
      <div class="total-time-output">
        <span class="timer-part timer-part-totalHours">00</span>
        <span class="timer-part">:</span>
        <span class="timer-part timer-part-totalMinutes">00</span>
        <span class="timer-part">:</span>
        <span class="timer-part timer-part-totalSeconds">00</span>
      </div>
    </div>
    `;
  }
}