/* ==============================
⚙️ Creative Verse — Signup Script (Fixed)
============================== */

const signupBtn = document.getElementById("signup-btn");
const signupMsg = document.getElementById("signup-message");
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
  themeBtn.textContent = theme === "light" ? "🌙" : "☀️";
}

// ---------- SIGNUP FUNCTION ----------
signupBtn.addEventListener("click", () => {
  const username = document.getElementById("new-username").value.trim();
  const password = document.getElementById("new-password").value.trim();
  signupMsg.textContent = "";

  if (!username || !password) {
    showMessage("Please enter both username and password.", "#f0a500");
    return;
  }

  const usersRaw = localStorage.getItem(KEYS.USERS);
  const users = usersRaw ? JSON.parse(usersRaw) : {};

  if (users[username]) {
    showMessage("Username already exists!", "#f05252");
    return;
  }

  // Create new user
  users[username] = {
    password,
    cbucks: 100,
    equippedItems: [],
    games: [],
    streak: 0,
    lastClaimDate: null,
    friends: [],
    _claimedDates: []
  };

  localStorage.setItem(KEYS.USERS, JSON.stringify(users));

  showMessage("✅ Account created! Redirecting to login...", "#4ade80");

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
});

// ---------- HELPER ----------
function showMessage(text, color) {
  signupMsg.textContent = text;
  signupMsg.style.color = color;
}
