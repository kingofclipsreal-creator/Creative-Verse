// Load user data and equipped avatars
const username = localStorage.getItem('currentUser');
if (!username) {
  alert("Please log in to create games.");
  window.location.href = "login.html";
}
const userKey = "user_" + username;
let userData = JSON.parse(localStorage.getItem(userKey)) || { equippedItems: [], cbucks: 0, games: [] };

const avatarSelectionDiv = document.getElementById('avatar-selection');
let selectedAvatar = null;

// Render avatars user owns
function renderAvatars() {
  avatarSelectionDiv.innerHTML = "";

  if (!userData.equippedItems || userData.equippedItems.length === 0) {
    avatarSelectionDiv.textContent = "You don't have any avatars equipped. Get some avatars first!";
    return;
  }

  userData.equippedItems.forEach((avatarName) => {
    const div = document.createElement('div');
    div.textContent = avatarName;
    div.classList.add('avatar-preview');
    div.addEventListener('click', () => {
      selectAvatar(div, avatarName);
    });
    avatarSelectionDiv.appendChild(div);
  });
}

// Select avatar and highlight it
function selectAvatar(div, avatarName) {
  document.querySelectorAll('.avatar-preview').forEach(e => e.classList.remove('selected'));
  div.classList.add('selected');
  selectedAvatar = avatarName;
  avatarPos = { x: 180, y: 150 };
  drawAvatarOnCanvas();
}

renderAvatars();
