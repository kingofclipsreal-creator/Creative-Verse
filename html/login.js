/* ==============================
⚙️ Creative Verse — Login Script (Complete Rewrite)
============================== */

const loginBtn = document.getElementById("login-btn");
const message = document.getElementById("login-message");
const themeBtn = document.getElementById("theme-btn");

// Storage keys (match index.js)
const KEYS = {
  USERS: "creativeverse_users",
  CURRENT: "creativeverse_currentUser",
  THEME: "creativeverse_theme"
};

// ---------- THEME ----------
const savedTheme = localStorage.getItem(KEYS.THEME) || "dark";
applyTheme(savedTheme);

themeBtn.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("light") ? "dark" : "light";
  applyTheme(newTheme);
  localStorage.setItem(KEYS.THEME, newTheme);
});

function applyTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  themeBtn.textContent = theme === "light" ? "☀️" : "🌙";
}

// ---------- LOGIN FUNCTION ----------
loginBtn.addEventListener("click", () => {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    showMessage("Please enter both username and password.", true);
    return;
  }

  const usersRaw = localStorage.getItem(KEYS.USERS);
  const users = usersRaw ? JSON.parse(usersRaw) : {};

  if (!users[username]) {
    showMessage("User not found. Try signing up.", true);
    return;
  }

  if (users[username].password !== password) {
    showMessage("Incorrect password.", true);
    return;
  }

  // Successful login: save current user
  localStorage.setItem(KEYS.CURRENT, username);

  showMessage("✅ Login successful! Redirecting...");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
});

// ---------- HELPER ----------
function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#ff6666" : "#00ff99";
}