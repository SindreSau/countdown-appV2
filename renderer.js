let audioBrake = new Audio('assets/brake-time.mp3');
let audioWork = new Audio('assets/start-working.mp3');

const root = document.getElementById("app");
const playButton = document.getElementById("play-button");
const FULL_DASH_ARRAY = 283;
const sound1 = null;
const sound2 = null;
const workTime = 45 * 60;
const brakeTime = 15 * 60;

playButton.addEventListener("click", () => {
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
    this.totalTimeInSeconds = 0;
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
    const totalMinutes = Math.floor(this.totalTimeInSeconds / 60)
    const totalHours = Math.floor(totalMinutes / 60)

    this.el.totalHours.textContent = totalHours.toString().padStart(2, "0")
    this.el.totalMinutes.textContent = totalMinutes.toString().padStart(2, "0")
    this.el.totalSeconds.textContent = totalSeconds.toString().padStart(2, "0")
  }

  start() {
    this.interval = setInterval(() => {
      this.remainingSeconds--;
      this.totalTimeInSeconds++;
      this.updateInterfaceTime();
      this.setCircleDashArray();
      if (this.remainingSeconds === 0) {
        console.log("stopped");
        if (this.counter % 2 == 0) {
          this.isBrake = true;
        } else {
          this.isBrake = false;
        }
        this.counter++;
        if (this.isBrake) {
          this.startingSeconds = brakeTime;
          this.remainingSeconds = brakeTIme;
          this.el.progress.classList.add("red")
          audioBrake.play()
        } else {
          this.startingSeconds = workTime;
          this.remainingSeconds = workTime;
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