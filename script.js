const cardGrid = document.getElementById("card-grid");
const restartBtn = document.getElementById("restart");
const winMessage = document.getElementById("win-message");
const playAgainBtn = document.getElementById("play-again");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const bestTimeDisplay = document.getElementById("best-time");
const themeToggle = document.getElementById("theme-toggle");

// Emoji list set to use as card content — 6 unique emojis, duplicated for matching
const emojis = ["🐶", "🍕", "🎧", "🌵", "🚀", "🍩"];
let cards = [...emojis, ...emojis]; // 12 total cards
// Sets up game state variables: flipped cards, matched pairs, move counter
let flippedCards = [];
let matched = 0;
let moves = 0;
let timer = null;
let seconds = 0;

// Shuffle function to randomise emoji/card order
function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

// Creating and displaying cards on the grid, storing their emoji value in data-emoji
// Adding an event listener to each card for flipping later
function createCards() {
  cardGrid.innerHTML = ""; // Clear any previous cards
  shuffle(cards).forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.innerText = ""; // Face down at start
    card.addEventListener("click", flipCard);
    cardGrid.appendChild(card);
  });
}

function flipCard(e) {
  const card = e.currentTarget;

  // Prevent flipping more than 2 cards at a time or reflipping matched cards
  if (
    flippedCards.length === 2 ||
    card.classList.contains("matched") ||
    flippedCards.includes(card)
  )
    return;

  // Reveal emoji
  card.innerText = card.dataset.emoji;
  flippedCards.push(card); // adds the card to a list of flipped cards

  // Check for match when 2 cards are flipped
  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.innerText = moves;
    checkMatch(); // calls it when 2 cards are flipped
  }
}

function checkMatch() {
  // Destructuring the two flipped cards from the array
  const [first, second] = flippedCards;

  // If the emojis match
  if (first.dataset.emoji === second.dataset.emoji) {
    // Add "matched" class to both cards
    first.classList.add("matched");
    second.classList.add("matched");
    matched += 2;

    // Check if all cards are matched - game is won
    if (matched === cards.length) {
      clearInterval(timer);
      winMessage.classList.remove("hidden");

      // Format current time as MM:SS
      const currentTime = `${String(Math.floor(seconds / 60)).padStart(
        2,
        "0"
      )}:${String(seconds % 60).padStart(2, "0")}`;

      // Check and update best time in localStorage
      const stored = localStorage.getItem("bestTime");

      if (!stored || seconds < convertToSeconds(stored)) {
        localStorage.setItem("bestTime", currentTime);
        bestTimeDisplay.innerText = currentTime;
      }
    }
  } else {
    // If cards don't match, flip them back after a delay
    setTimeout(() => {
      first.innerText = "";
      second.innerText = "";
    }, 1000);
  }

  // Reset flipped cards array for the next turn
  flippedCards = [];
}

// Starts the game timer from 00:00 and updates every second
function startTimer() {
  clearInterval(timer);
  seconds = 0;
  timerDisplay.innerText = "00:00";

  // Start a new interval to update timer every second
  timer = setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    timerDisplay.innerText = `${mins}:${secs}`;
  }, 1000);
}

// Loads the best time from localStorage and displays it
function loadBestTime() {
  const storedTime = localStorage.getItem("bestTime");
  if (storedTime) {
    bestTimeDisplay.innerText = storedTime;
  } else {
    bestTimeDisplay.innerText = "--:--";
  }
}

// Resets the game state, board, timer, and UI
function resetGame() {
  matched = 0;
  moves = 0;
  flippedCards = []; // Clear flipped cards
  movesDisplay.innerText = "0";
  winMessage.classList.add("hidden");
  clearInterval(timer);
  startTimer();
  createCards();
}

// Event listeners
restartBtn.addEventListener("click", resetGame);
playAgainBtn.addEventListener("click", resetGame);
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  // Change emoji on the button based on theme
  if (document.body.classList.contains("light-theme")) {
    themeToggle.innerText = "☀️ Theme";
  } else {
    themeToggle.innerText = "🌙 Theme";
  }
});

startTimer();
createCards();
loadBestTime();
