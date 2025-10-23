/* =====================================
   create.js — Game Creation Logic
===================================== */

// DOM Elements
const gameNameInput = document.getElementById("game-name");
const gameDescInput = document.getElementById("game-desc");
const publishBtn = document.getElementById("publish-game");
const gameListContainer = document.getElementById("game-list");
const cbucksDisplay = document.getElementById("cbucks-corner");

// Initialize userData.games if not present
userData.games ||= [];
userData.cbucks ||= 0;

// Save user data helper
function saveUserDataWrapper() {
  localStorage.setItem("user_" + username, JSON.stringify(userData));
}

// Update Cbucks display
function updateCbucks() {
  if(cbucksDisplay) cbucksDisplay.textContent = userData.cbucks;
}

// Render games list
function renderGames() {
  if(!gameListContainer) return;
  gameListContainer.innerHTML = "";

  userData.games.forEach((game, i) => {
    const gameCard = document.createElement("div");
    gameCard.className = "game-card";
    gameCard.innerHTML = `
      <strong>${game.name}</strong>
      <p>${game.desc}</p>
      <button onclick="playGame(${i})">Play</button>
      <button onclick="editGame(${i})">Edit</button>
      <button onclick="deleteGame(${i})">Delete</button>
    `;
    gameListContainer.appendChild(gameCard);
  });
}

// Create / publish game
if(publishBtn){
  publishBtn.addEventListener("click", () => {
    const name = gameNameInput.value.trim();
    const desc = gameDescInput.value.trim();

    if(!name || !desc){
      alert("Please enter both a game title and description.");
      return;
    }

    userData.games.push({ name, desc });
    userData.cbucks += 50; // Reward
    saveUserDataWrapper();
    updateCbucks();
    renderGames();

    alert(`✅ Game "${name}" published! You earned 50 Cbucks.`);
    gameNameInput.value = "";
    gameDescInput.value = "";
  });
}

// Edit game
window.editGame = function(index){
  const game = userData.games[index];
  const newName = prompt("Edit game title:", game.name);
  const newDesc = prompt("Edit game description:", game.desc);

  if(newName && newDesc){
    userData.games[index] = { name: newName, desc: newDesc };
    saveUserDataWrapper();
    renderGames();
    alert("✅ Game updated!");
  }
};

// Delete game
window.deleteGame = function(index){
  if(confirm("Are you sure you want to delete this game?")){
    userData.games.splice(index, 1);
    saveUserDataWrapper();
    renderGames();
    alert("❌ Game deleted.");
  }
};

// Play game (preview)
window.playGame = function(index){
  const game = userData.games[index];
  const preview = document.getElementById("game-preview");
  if(preview){
    preview.innerHTML = `
      🎮 <strong>${game.name}</strong><br>
      ${game.desc}<br><br>
      <em>Launching clicker preview...</em>
    `;
    launchClickerGame(); // optional: reuse games.html clicker logic
  }
};

// Initial render
updateCbucks();
renderGames();
