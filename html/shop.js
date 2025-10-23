// Theme Toggle (same pattern as other pages)
const themeBtn = document.getElementById("theme-btn");

function applyTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  themeBtn.textContent = theme === "light" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

themeBtn.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("light") ? "dark" : "light";
  applyTheme(newTheme);
});

// User and shop setup
const username = localStorage.getItem("currentUser");
if (!username || !localStorage.getItem("user_" + username)) {
  alert("Please log in to access the shop.");
  window.location.href = "login.html";
}

const userKey = "user_" + username;
const userData = JSON.parse(localStorage.getItem(userKey)) || { cbucks: 0, equippedItems: [], streak: 0, giftInbox: [] };

const items = [
  { name: "Golden Crown", cost: 100, rarity: "legendary", emoji: "👑" },
  { name: "Cyber Wings", cost: 150, rarity: "rare", emoji: "🦾" },
  { name: "Pixel Cap", cost: 60, rarity: "common", emoji: "🧢" },
  { name: "Streak Flame", cost: 0, rarity: "legendary", emoji: "🔥", locked: true },
  { name: "Neon Hoodie", cost: 80, rarity: "rare", emoji: "🕶️" },
  { name: "Mystic Orb", cost: 200, rarity: "legendary", emoji: "🔮" },
  { name: "Retro Shades", cost: 50, rarity: "common", emoji: "😎" },
  { name: "Dragon Helm", cost: 180, rarity: "legendary", emoji: "🐉" },
  { name: "Bubble Jetpack", cost: 120, rarity: "rare", emoji: "🫧" }
];

function updateCbucksDisplay() {
  const badge = document.getElementById("cbucks-corner");
  badge.textContent = userData.cbucks;
  const wrapper = document.querySelector(".cbucks-badge");
  wrapper.classList.add("pulse");
  setTimeout(() => wrapper.classList.remove("pulse"), 500);
}

function renderOwnedItems() {
  const owned = userData.equippedItems.length > 0 ? userData.equippedItems.join(", ") : "None";
  document.getElementById("owned-items").textContent = owned;
}

function renderShopItems() {
  const container = document.getElementById("shop-container");
  
  // Clear old items except the Owned Items header and section
  [...container.querySelectorAll(".shop-item")].forEach(el => el.remove());

  items.forEach(item => {
    const owned = userData.equippedItems.includes(item.name);
    const isUnlocked = !item.locked || userData.streak >= 3;

    const div = document.createElement("div");
    div.className = "shop-item";
    if (owned) div.classList.add("purchased");

    const rarityClass = item.rarity;
    div.innerHTML = `
      <p>${item.emoji} ${item.name} - ${item.cost} Cbucks <span class="rarity ${rarityClass}">${item.locked && !isUnlocked ? "Locked" : rarityClass}</span></p>
      <button ${owned || (item.locked && !isUnlocked) ? "disabled" : ""}>
        ${item.locked ? "Unlock" : "Buy"}
      </button>
    `;

    const btn = div.querySelector("button");
    btn.onclick = () => {
      if (item.locked) {
        unlockItem(item.name);
      } else {
        buyItem(item.name, item.cost);
      }
    };

    container.insertBefore(div, document.getElementById("owned-items"));
  });
}

function buyItem(itemName, cost) {
  if (userData.cbucks >= cost) {
    if (!userData.equippedItems.includes(itemName)) {
      userData.cbucks -= cost;
      userData.equippedItems.push(itemName);
      saveUserData();
      updateCbucksDisplay();
      renderOwnedItems();
      alert(`${itemName} purchased!`);
    } else {
      alert("You already own this item.");
    }
  } else {
    alert("Not enough Cbucks!");
  }
}

function unlockItem(itemName) {
  if (userData.streak >= 3) {
    if (!userData.equippedItems.includes(itemName)) {
      userData.equippedItems.push(itemName);
      saveUserData();
      renderOwnedItems();
      alert(`${itemName} unlocked via streak!`);
    } else {
      alert("You already own this item.");
    }
  } else {
    alert("Your streak isn't high enough to unlock this item.");
  }
}

function saveUserData() {
  localStorage.setItem(userKey, JSON.stringify(userData));
}

updateCbucksDisplay();
renderOwnedItems();
renderShopItems();
