// Woordlys
const words = [
  "appel", "beker", "droom", "fiets", "groot", "huis", "jogga", "klomp",
  "ligga", "motor", "nagte", "oombl", "padda", "quilt", "roosk", "stoel",
  "trots", "urien", "vlieg", "wiele", "xenon", "yacht", "zebra"
];

// Bepaal woord vir die dag
function getWordForDay(date = new Date()) {
  const seed = new Date(date.toDateString()).getTime(); // Only use date part
  let shuffled = [...words];
  shuffled.sort((a, b) => {
    return (
      hashString(a + seed.toString()) - hashString(b + seed.toString())
    );
  });
  return shuffled[date.getDate() % shuffled.length];
}

// Eenvoudige hash funksie
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// ⚙️ Speletjie veranderlikes
const wordOfTheDay = getWordForDay();
let currentGuess = '';
let guessed = false;
let attempts = 0;

// ⚙️ Initsieer
document.addEventListener("DOMContentLoaded", () => {
  initBoard();
  document.querySelectorAll(".key").forEach(key => {
    key.addEventListener("click", () => handleKeyPress(key.innerText));
  });
});

function initBoard() {
  const board = document.getElementById("game-board");
  board.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    board.appendChild(tile);
  }
}

function handleKeyPress(key) {
  if (guessed) return;

  if (key === "⬅️") {
    currentGuess = currentGuess.slice(0, -1);
  } else if (key === "✔️") {
    submitGuess();
  } else if (/^[A-Z]$/i.test(key) && currentGuess.length < 5) {
    currentGuess += key.toLowerCase();
  }

  updateBoard();
}

function updateBoard() {
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach((tile, i) => {
    tile.textContent = currentGuess[i] || "";
    tile.className = "tile";
  });
}

function submitGuess() {
  if (currentGuess.length !== 5) return;

  if (!words.includes(currentGuess)) {
    markInvalid();
    return;
  }

  guessed = true;
  const tiles = document.querySelectorAll(".tile");

  for (let i = 0; i < 5; i++) {
    if (currentGuess[i] === wordOfTheDay[i]) {
      tiles[i].classList.add("correct");
    } else if (wordOfTheDay.includes(currentGuess[i])) {
      tiles[i].classList.add("present");
    } else {
      tiles[i].classList.add("absent");
    }
  }

  saveStat(true);
}

function markInvalid() {
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach(tile => tile.classList.add("invalid"));
}

function saveStat(won) {
  let stats = JSON.parse(localStorage.getItem("stats")) || {
    total: 0,
    won: 0,
    streak: 0,
    current: 0
  };
  stats.total++;
  if (won) {
    stats.won++;
    stats.current++;
    stats.streak = Math.max(stats.streak, stats.current);
  } else {
    stats.current = 0;
  }
  localStorage.setItem("stats", JSON.stringify(stats));
}

// 📊 Statistiek popup
function showStats() {
  const popup = document.getElementById("stats-popup");
  popup.classList.remove("hidden");

  const stats = JSON.parse(localStorage.getItem("stats")) || {
    total: 0,
    won: 0,
    streak: 0,
    current: 0
  };

  document.getElementById("success-rate").textContent =
    stats.total ? Math.round((stats.won / stats.total) * 100) + "%" : "0%";
  document.getElementById("games-played").textContent = stats.total;
  document.getElementById("current-streak").textContent = stats.current;
  document.getElementById("streak").textContent = stats.streak;
}

function closeStats() {
  document.getElementById("stats-popup").classList.add("hidden");
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

function shareAttempt() {
  alert("Poging gekopieer na knipbord!");
}

// Placeholder vir oefen
function openPractice() {
  alert("Oefenmodus kom binnekort!");
}

// Export/Import stats
function exportStats() {
  const stats = localStorage.getItem("stats");
  prompt("Kopieer hierdie kode en plak op jou ander toestel:", stats);
}

function importStats() {
  const input = prompt("Plak jou kode hier:");
  try {
    JSON.parse(input); // check if valid
    localStorage.setItem("stats", input);
    alert("Ingevoer suksesvol!");
  } catch {
    alert("Ongeldige kode!");
  }
}
