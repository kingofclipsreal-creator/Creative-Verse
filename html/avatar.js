/* =====================================
   avatar.js — Avatar Page Logic
===================================== */

// DOM Elements
const avatarNameInput = document.getElementById("avatar-name");
const avatarLevelInput = document.getElementById("avatar-level");
const saveAvatarBtn = document.getElementById("save-avatar");
const avatarPreview = document.getElementById("avatar-preview");
const avatarCanvas = document.getElementById("avatar-canvas");
const ctx = avatarCanvas ? avatarCanvas.getContext("2d") : null;

// Initialize user avatar data if not present
userData.avatar ||= {
  name: "Player",
  level: 1,
  items: []
};

// Populate inputs with current data
if (avatarNameInput) avatarNameInput.value = userData.avatar.name;
if (avatarLevelInput) avatarLevelInput.value = userData.avatar.level;

// Draw avatar preview on canvas
function drawAvatar(){
  if (!ctx) return;
  ctx.clearRect(0,0,avatarCanvas.width, avatarCanvas.height);
  
  // Avatar circle
  ctx.fillStyle = "#00bfff";
  ctx.beginPath();
  ctx.arc(avatarCanvas.width/2, avatarCanvas.height/2, 50, 0, Math.PI*2);
  ctx.fill();

  // Name & Level
  ctx.fillStyle = "#fff";
  ctx.font = "20px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(userData.avatar.name, avatarCanvas.width/2, avatarCanvas.height/2 - 70);
  ctx.fillText("Level " + userData.avatar.level, avatarCanvas.width/2, avatarCanvas.height/2 + 80);
}

// Save avatar changes
if (saveAvatarBtn){
  saveAvatarBtn.addEventListener("click", () => {
    const newName = avatarNameInput.value.trim();
    const newLevel = parseInt(avatarLevelInput.value);

    if(newName) userData.avatar.name = newName;
    if(!isNaN(newLevel) && newLevel > 0) userData.avatar.level = newLevel;

    saveUserData();
    drawAvatar();
    alert("✅ Avatar updated!");
  });
}

// Optional: keyboard arrow movement for fun
document.addEventListener("keydown", e => {
  if(!ctx) return;
  const step = 10;
  switch(e.key){
    case "ArrowUp": avatarCanvas.height -= step; break;
    case "ArrowDown": avatarCanvas.height += step; break;
    case "ArrowLeft": avatarCanvas.width -= step; break;
    case "ArrowRight": avatarCanvas.width += step; break;
  }
  drawAvatar();
});

// Initial render
drawAvatar();
