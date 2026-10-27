document.addEventListener("DOMContentLoaded", () => {
  const MAX_LIVES = 3;
  const MIN_VAL = 10;
  const MAX_VAL = 100;

  let lives = MAX_LIVES;
  let streak = 0;
  let bestStreak = 0;
  let currentItem = Math.floor(Math.random() * (MAX_VAL - MIN_VAL + 1)) + MIN_VAL;
  let nextItem = Math.floor(Math.random() * (MAX_VAL - MIN_VAL + 1)) + MIN_VAL;

  const currentValEl = document.getElementById("current-val");
  const livesEl = document.getElementById("lives-count");
  const streakEl = document.getElementById("streak-count");
  const bestStreakEl = document.getElementById("best-streak");
  const messageEl = document.getElementById("game-message");
  const btnHigher = document.getElementById("btn-higher");
  const btnLower = document.getElementById("btn-lower");
  const btnRestart = document.getElementById("btn-restart");

  function updateUI() {
    if (currentValEl) currentValEl.textContent = currentItem;
    if (livesEl) livesEl.textContent = lives;
    if (streakEl) streakEl.textContent = streak;
    if (bestStreakEl) bestStreakEl.textContent = bestStreak;
  }

  function makeGuess(userChoice) {
    if (lives <= 0) return;

    let isCorrect = false;
    if (userChoice === "higher" && nextItem >= currentItem) {
      isCorrect = true;
    } else if (userChoice === "lower" && nextItem <= currentItem) {
      isCorrect = true;
    }

    if (isCorrect) {
      streak++;
      if (streak > bestStreak) bestStreak = streak;
      if (messageEl) {
        messageEl.textContent = `Correct! Next value was ${nextItem}.`;
        messageEl.className = "text-success fw-bold mt-2";
      }
    } else {
      lives--;
      streak = 0;
      if (messageEl) {
        messageEl.textContent = `Wrong! Next value was ${nextItem}. Lives left: ${lives}`;
        messageEl.className = "text-danger fw-bold mt-2";
      }
    }

    currentItem = nextItem;
    nextItem = Math.floor(Math.random() * (MAX_VAL - MIN_VAL + 1)) + MIN_VAL;
    updateUI();

    if (lives === 0) {
      if (messageEl) messageEl.textContent = `Game Over! Your best streak: ${bestStreak}.`;
      if (btnHigher) btnHigher.disabled = true;
      if (btnLower) btnLower.disabled = true;
      if (btnRestart) btnRestart.style.display = "inline-block";
    }
  }

  function restartGame() {
    lives = MAX_LIVES;
    streak = 0;
    currentItem = Math.floor(Math.random() * (MAX_VAL - MIN_VAL + 1)) + MIN_VAL;
    nextItem = Math.floor(Math.random() * (MAX_VAL - MIN_VAL + 1)) + MIN_VAL;
    if (messageEl) {
      messageEl.textContent = "Game restarted. Good luck!";
      messageEl.className = "text-muted mt-2";
    }
    if (btnHigher) btnHigher.disabled = false;
    if (btnLower) btnLower.disabled = false;
    if (btnRestart) btnRestart.style.display = "none";
    updateUI();
  }

  if (btnHigher && btnLower) {
    btnHigher.addEventListener("click", () => makeGuess("higher"));
    btnLower.addEventListener("click", () => makeGuess("lower"));
    if (btnRestart) btnRestart.addEventListener("click", restartGame);
    updateUI();
  }
});