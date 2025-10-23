/* =====================================
   games.js — Main Game Hub Logic
===================================== */

// Get current user
const username = localStorage.getItem("currentUser") || "Guest";
const userKey = "user_" + username;

// Load userData
let userData = JSON.parse(localStorage.getItem(userKey)) || {
  games: [],
  cbucks: 0,
  equippedItems: [],
  tradeInbox: [],
  giftInbox: []
};

// DOM Elements
const cbucksDisplay = document.getElementById("cbucks-corner");
const gameListContainer = document.getElementById("game-list");
const gamePreview = document.getElementById("game-preview");
const tradeInboxContainer = document.getElementById("trade-inbox");

// ======================
// User Data Helpers
// ======================
function saveUserData() {
  localStorage.setItem(userKey, JSON.stringify(userData));
}

function updateCbucks() {
  if(cbucksDisplay) cbucksDisplay.textContent = userData.cbucks;
}

// ======================
// Game Management
// ======================
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

window.playGame = function(index){
  const game = userData.games[index];
  if(gamePreview){
    gamePreview.innerHTML = `
      🎮 <strong>${game.name}</strong><br>
      ${game.desc}<br><br>
      <em>Launching clicker preview...</em>
    `;
    launchClickerGame();
  }
};

window.editGame = function(index){
  const game = userData.games[index];
  const newName = prompt("Edit game title:", game.name);
  const newDesc = prompt("Edit game description:", game.desc);

  if(newName && newDesc){
    userData.games[index] = { name: newName, desc: newDesc };
    saveUserData();
    renderGames();
    alert("✅ Game updated!");
  }
};

window.deleteGame = function(index){
  if(confirm("Are you sure you want to delete this game?")){
    userData.games.splice(index, 1);
    saveUserData();
    renderGames();
    alert("❌ Game deleted.");
  }
};

// ======================
// Clicker Game Logic
// ======================
let clickerScore = 0;
const canvas = document.getElementById("gamePreview");
const ctx = canvas ? canvas.getContext("2d") : null;

function launchClickerGame(){
  if(!canvas || !ctx) return;
  clickerScore = 0;

  canvas.onclick = () => {
    clickerScore++;
    userData.cbucks++;
    updateCbucks();
    saveUserData();
    drawClicker();
  };

  drawClicker();
}

function drawClicker(){
  if(!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00bfff";
  ctx.font = "24px Segoe UI";
  ctx.fillText("Click anywhere to earn Cbucks!", 220, 180);
  ctx.fillText("Clicks: " + clickerScore, 340, 220);
}

// ======================
// Blockly Setup
// ======================
const workspace = Blockly.inject('blocklyDiv', {
  toolbox: document.getElementById('toolbox'),
  theme: Blockly.Themes.Dark
});

// Blocks
Blockly.Blocks['spawn_avatar'] = {
  init: function(){
    this.appendDummyInput()
        .appendField("spawn avatar")
        .appendField(new Blockly.FieldTextInput("player1"), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
  }
};

Blockly.JavaScript['spawn_avatar'] = function(block){
  const name = block.getFieldValue("NAME");
  return `spawnAvatar("${name}");\n`;
};

Blockly.Blocks['move_avatar'] = {
  init: function(){
    this.appendDummyInput()
        .appendField("move avatar")
        .appendField(new Blockly.FieldDropdown([["up","UP"], ["down","DOWN"], ["left","LEFT"], ["right","RIGHT"]]), "DIRECTION");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
  }
};

Blockly.JavaScript['move_avatar'] = function(block){
  const direction = block.getFieldValue("DIRECTION");
  return `moveAvatar("${direction}");\n`;
};

Blockly.Blocks['change_score'] = {
  init: function(){
    this.appendDummyInput()
        .appendField("change score by")
        .appendField(new Blockly.FieldNumber(10), "AMOUNT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
  }
};

Blockly.JavaScript['change_score'] = function(block){
  const amount = block.getFieldValue("AMOUNT");
  return `changeScore(${amount});\n`;
};

window.runGameLogic = function(){
  const code = Blockly.JavaScript.workspaceToCode(workspace);
  if(!code.trim()){
    alert("No code to run. Add some blocks!");
    return;
  }
  try{
    eval(code);
    alert("✅ Game logic executed!");
  } catch(e){
    alert("Error in game logic: " + e.message);
  }
};

// ======================
// Avatar Canvas Logic
// ======================
let avatar = { x: 400, y: 200, name: "", score: 0 };

function drawAvatar(){
  if(!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00bfff";
  ctx.beginPath();
  ctx.arc(avatar.x, avatar.y, 20, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = "14px Segoe UI";
  ctx.fillText(avatar.name, avatar.x - 20, avatar.y - 30);
  ctx.fillText("⭐ " + avatar.score, avatar.x - 20, avatar.y + 35);
}

window.spawnAvatar = function(name){
  avatar = { x: 400, y: 200, name, score: 0 };
  drawAvatar();
};

window.moveAvatar = function(direction){
  const step = 20;
  if(direction==="UP") avatar.y -= step;
  if(direction==="DOWN") avatar.y += step;
  if(direction==="LEFT") avatar.x -= step;
  if(direction==="RIGHT") avatar.x += step;
  drawAvatar();
};

window.changeScore = function(amount){
  avatar.score += amount;
  drawAvatar();
};

document.addEventListener("keydown", e=>{
  if(!avatar.name) return;
  if(e.key==="ArrowUp") moveAvatar("UP");
  if(e.key==="ArrowDown") moveAvatar("DOWN");
  if(e.key==="ArrowLeft") moveAvatar("LEFT");
  if(e.key==="ArrowRight") moveAvatar("RIGHT");
});

// ======================
// Trade Center
// ======================
window.proposeTrade = function(){
  const recipient = document.getElementById("trade-recipient")?.value.trim();
  const myItems = document.getElementById("trade-my-items")?.value.split(",").map(i=>i.trim()).filter(Boolean);
  const theirItems = document.getElementById("trade-their-items")?.value.split(",").map(i=>i.trim()).filter(Boolean);
  const message = document.getElementById("trade-message")?.value.trim();

  if(!recipient || !myItems.length || !theirItems.length){
    alert("Please fill in all required fields.");
    return;
  }

  for(let item of myItems){
    if(!userData.equippedItems.includes(item)){
      alert("You don't own: "+item);
      return;
    }
  }

  const recipientKey = "user_" + recipient;
  const recipientData = JSON.parse(localStorage.getItem(recipientKey));
  if(!recipientData){
    alert("Recipient not found.");
    return;
  }

  recipientData.tradeInbox ||= [];
  recipientData.tradeInbox.push({ from: username, offer: myItems, request: theirItems, message, timestamp: Date.now() });
  localStorage.setItem(recipientKey, JSON.stringify(recipientData));
  alert(`🔁 Trade proposed to ${recipient}`);
};

window.viewTradeInbox = function(){
  if(!tradeInboxContainer) return;
  const inbox = userData.tradeInbox || [];
  if(!inbox.length){
    tradeInboxContainer.innerHTML = "No trade offers.";
    return;
  }

  tradeInboxContainer.innerHTML = inbox.map((t,i)=>{
    const age = Math.floor((Date.now()-t.timestamp)/60000);
    return `
      <div>
        🔁 Offer from <strong>${t.from}</strong><br>
        💬 ${t.message || "No message"}<br>
        🧳 Their offer: ${t.offer.join(", ")}<br>
        🎯 Requested: ${t.request.join(", ")}<br>
        ⏱️ ${age} minutes ago<br>
        <button onclick="acceptTrade(${i})">Accept</button>
        <button onclick="rejectTrade(${i})">Reject</button>
      </div>
    `;
  }).join("<hr>");
};

window.acceptTrade = function(index){
  const trade = userData.tradeInbox[index];
  const senderKey = "user_" + trade.from;
  const senderData = JSON.parse(localStorage.getItem(senderKey));

  for(let item of trade.request){
    if(!userData.equippedItems.includes(item)){
      alert("You no longer own: "+item);
      return;
    }
  }

  for(let item of trade.offer){
    if(!senderData || !senderData.equippedItems.includes(item)){
      alert("Sender no longer owns: "+item);
      return;
    }
  }

  trade.request.forEach(item => {
    userData.equippedItems = userData.equippedItems.filter(i=>i!==item);
    senderData.equippedItems.push(item);
  });

  trade.offer.forEach(item => {
    senderData.equippedItems = senderData.equippedItems.filter(i=>i!==item);
    userData.equippedItems.push(item);
  });

  userData.tradeInbox.splice(index, 1);
  saveUserData();
  localStorage.setItem(senderKey, JSON.stringify(senderData));
  alert("✅ Trade accepted!");
  viewTradeInbox();
};

window.rejectTrade = function(index){
  userData.tradeInbox.splice(index, 1);
  saveUserData();
  alert("❌ Trade rejected.");
  viewTradeInbox();
};

// ======================
// Initial Render
// ======================
updateCbucks();
renderGames();
viewTradeInbox();
