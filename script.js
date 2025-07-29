// DOM element references
const timeDisplay = document.getElementById("timeDisplay");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const settingBtn = document.getElementById("settingBtn");
const settingsPanel = document.getElementById("settingsPanel");
const applyBtn = document.getElementById("applySettingsBtn");
const pomodoroBtn = document.getElementById("pomodoroModeBtn");
const pomodoroPlusBtn = document.getElementById("pomodorPlusModeBtn");
const stopwatchBtn = document.getElementById("stopwatchModeBtn");
const modeButtons = document.querySelectorAll(".mode-btn");

const clickSoundSelect = document.getElementById("clickSoundSelect");
const endSoundSelect = document.getElementById("endSoundSelect");

const previewClick = document.getElementById("previewClick");
const previewEnd = document.getElementById("previewEnd");


const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");


let selectedThumb = null;       // What user clicked
let appliedImageUrl = "Images/fogy_forest.jpg";       // Currently applied background
let currentMode = "pomodor"; // Default mode
let stopwatchStartTime = null;

//dom for audio
let selectedClickSoundURL = clickSoundSelect.value;
let selectedEndSoundURL = endSoundSelect.value;

let clickSound = new Audio(selectedClickSoundURL);
let endSound = new Audio(selectedEndSoundURL);


// Select all thumbnail elements
const wallpaperThumbs = document.querySelectorAll(".wallpaper-thumb");

// Variables for timing logic
let startTime = null;        // When the stopwatch was started (timestamp)
let remainingTime = 25 * 60 * 1000;
let timerInterval = null;
let initialTime = remainingTime;

function switchMode(newMode) {
    stop(); //stop any running timere
    currentMode = newMode;

    //update UI active state
    modeButtons.forEach(btn => btn.classList.remove("active"));
    document.getElementById(`${newMode}ModeBtn`).classList.add("active");

    //update initial time per mode
    if(newMode === "pomodoro") {
        remainingTime = 25 * 60 * 1000;
        initialTime = remainingTime;
        updateDisplay();
    } else if (newMode === "pomodorPlus") {
        remainingTime = 50 * 60 * 1000;
        initialTime = remainingTime;
        updateDisplay();
    } else if (newMode === "stopwatch") {
        remainingTime = 0;
        initialTime = 0;
        updateDisplay();
    }
}


// Format time into HH:MM:SS and update the UI
function updateDisplay() {
    const totalSeconds = Math.floor(remainingTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Convert numbers to two-digit strings (e.g., 1 → "01")
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");
    if (hours > 0) {
        const h = String(hours).padStart(2, "0");
        timeDisplay.textContent = `${h}:${m}:${s}`;
    }
    else {
        timeDisplay.textContent = `${m}:${s}`;
    }
    
}


// ▶️ Start the stopwatch
function start() {

    if (timerInterval) return; // Prevent multiple intervals
    if (remainingTime <= 0) return; // Timer has ended, doon't start again

    // play click sound
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.warn("Click sound failed:", e));

    // checks for stopwatch mode
    if (currentMode === "stopwatch") {
        stopwatchStartTime = Date.now() - remainingTime;
        timerInterval = setInterval(() => {
            remainingTime = Date.now() - stopwatchStartTime;
            updateDisplay();
        }, 1000);
    } else {
    const endTime = Date.now() + remainingTime;

    timerInterval = setInterval(() => {
        remainingTime = endTime - Date.now();
        updateDisplay();

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            remainingTime = 0;
            updateDisplay();

            // play end sound
            endSound.currentTime = 0;
             endSound.play().catch(e => console.warn("End sound failed:", e));
        }
    }, 1000);
}
}


// ⏸ Stop the stopwatch
function stop() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// 🔁 Reset everything
function reset() {
    clearInterval(timerInterval);
    timerInterval = null;
    if (currentMode === "stopwatch") {
        remainingTime = 0;
    }
    else {
    remainingTime = initialTime;
    updateDisplay();
}
}

// opens setting menu
function toggleSettings() {
    settingsPanel.style.display = settingsPanel.style.display === "block" ? "none":"block";
}

//apply settings
function applySettings() {
    const hours = parseInt(hoursInput.value, 10) || 0;
    const minutes = parseInt(minutesInput.value, 10) || 0;
    const seconds = parseInt(secondsInput.value, 10) || 0;

    // checks if the mode is in stopwatch or not    
    if (currentMode != "stopwatch") {
    remainingTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
    initialTime = remainingTime;
    }
    // Change wallpaper if selected
    if (selectedThumb) {
        const imageUrl = selectedThumb.getAttribute("data-image");
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        appliedImageUrl = imageUrl;
    }
    // change sound if selected
    clickSound = new Audio(selectedClickSoundURL);
    endSound = new Audio(selectedEndSoundURL);


    highlightAppliedThumb();
    updateDisplay();
    toggleSettings(); // Close panel
}


// Highlight the applied wallpaper thumbnail
function highlightAppliedThumb() {
    document.querySelectorAll(".wallpaper-thumb").forEach(thumb => {
        const thumbUrl = thumb.getAttribute("data-image");
        if (thumbUrl === appliedImageUrl) {
            thumb.classList.add("applied");
        } else {
            thumb.classList.remove("applied");
        }
    });
}


// 🖱 Event listeners
startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stop);
resetBtn.addEventListener("click", reset);
settingBtn.addEventListener("click", toggleSettings);
applyBtn.addEventListener("click", applySettings);


// Preview buttons
let previewAudio = null;

previewClick.addEventListener("click", () => {
  // Stop and reset previous preview if it's still playing
  if (previewAudio && !previewAudio.paused) {
    previewAudio.pause();
    previewAudio.currentTime = 0;
  }

  // Create and play the new preview
  previewAudio = new Audio(selectedClickSoundURL);
  previewAudio.play();
});


previewEnd.addEventListener("click", () => {
  // stop and reset previous preview if it's still playing
  if(previewAudio && !previewAudio.paused) {
    previewAudio.pause90;
    previewAudio.currentTime = 0;
  }
  const preview = new Audio(selectedEndSoundURL);

  preview.play();
});

clickSoundSelect.addEventListener("change", () => {
  selectedClickSoundURL = clickSoundSelect.value;
});

endSoundSelect.addEventListener("change", () => {
  selectedEndSoundURL = endSoundSelect.value;
});


pomodoroBtn.addEventListener("click", () => switchMode("pomodoro"));
pomodoroPlusBtn.addEventListener("click", () => switchMode("pomodorPlus"));
stopwatchBtn.addEventListener("click", () => switchMode("stopwatch"));

// When user clicks a thumbnail (just preview/select)
document.querySelectorAll(".wallpaper-thumb").forEach(thumb => {
  thumb.addEventListener("click", () => {
    // Store the selected image URL
    selectedThumb = thumb;
    
    // Remove previous selection highlight
    document.querySelectorAll(".wallpaper-thumb").forEach(img =>
      img.classList.remove("selected")
    );

    // Add highlight to current selection
    selectedThumb.classList.add("selected");
  });
});

// Initial display
updateDisplay();
highlightAppliedThumb();


