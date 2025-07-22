// DOM element references
const timeDisplay = document.getElementById("timeDisplay");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

// Variables for timing logic
let startTime = null;        // When the stopwatch was started (timestamp)
let elapsedTime = 0;         // Total time elapsed (in ms)
let timerInterval = null;    // Stores the setInterval ID
let animationFrameId = null; // Used for requestAnimationFrame

// Format time into HH:MM:SS and update the UI
function updateDisplay() {
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Convert numbers to two-digit strings (e.g., 1 → "01")
    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");

    timeDisplay.textContent = `${h}:${m}:${s}`;
}


// ▶️ Start the stopwatch
function start() {
    if (timerInterval) return; // Prevent multiple intervals

    startTime = Date.now() - elapsedTime;

    timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay();}, 1000);

}

// ⏸ Stop the stopwatch
function stop() {
    clearInterval(timerInterval);
    timerInterval = null;

    elapsedTime = Date.now() - startTime;

}

// 🔁 Reset everything
function reset() {
    clearInterval(timerInterval);
    timerInterval = null;

    startTime = null;
    elapsedTime = 0;
    timeDisplay.textContent = "00:00:00";

}

// 🖱 Event listeners
startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stop);
resetBtn.addEventListener("click", reset);
