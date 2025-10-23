// ============================================
// 🎮 CREATIVE VERSE — index.js (Complete Rewrite w/ Login Fix)
// ============================================

const KEYS = {
  USERS: "creativeverse_users",
  CURRENT: "creativeverse_currentUser",
  THEME: "creativeverse_theme"
};

// ====== ELEMENTS ======
const els = {
  cbucksBadge: document.getElementById("cbucks-badge"),
  cbucksAmount: document.getElementById("cbucks-amount"),
  currentUser: document.getElementById("current-user"),
  leaderboardList: document.getElementById("leaderboard-list"),
  leaderSearch: document.getElementById("leaderboard-search"),
  friendsList: document.getElementById("friends-list"),
  friendSearch: document.getElementById("friend-search"),
  friendNameIn: document.getElementById("friend-name"),
  friendAddBtn: document.getElementById("friend-add"),

  riddleQuestion: document.getElementById("riddle-question"),
  riddleAnswerIn: document.getElementById("riddle-answer"),
  riddleSubmitBtn: document.getElementById("riddle-submit"),
  riddleRefreshBtn: document.getElementById("riddle-refresh"),
  riddleFeedback: document.getElementById("riddle-feedback"),

  claimDailyBtn: document.getElementById("claim-daily"),
  dailyNote: document.getElementById("daily-note"),

  adminTools: document.getElementById("admin-tools"),
  adminGiveBtn: document.getElementById("admin-give"),
  adminTakeBtn: document.getElementById("admin-take"),
  adminUsernameIn: document.getElementById("admin-username"),
  adminAmountIn: document.getElementById("admin-amount"),

  logoutBtn: document.getElementById("logout-btn"),
  switchBtn: document.getElementById("switch-btn"),
  themeBtn: document.getElementById("theme-btn"),
  heroCta: document.getElementById("hero-cta")
};

// ====== RIDDLES ======
const RIDDLES = [
  { q: "I speak without a mouth and hear without ears. What am I?", a: "echo" },
  { q: "What has keys but can’t open locks?", a: "piano" },
  { q: "The more of this you take, the more you leave behind. What is it?", a: "footsteps" },
  { q: "I have cities, but no houses, forests but no trees, and water but no fish. What am I?", a: "map" },
  { q: "What goes up but never comes down?", a: "age" }
];

// ====== INITIALIZATION ======
document.addEventListener("DOMContentLoaded", () => {
  ensureDefaults();
  applyThemeFromStorage();
  attachHandlers();
  refreshAll();
});

// ====== STORAGE HELPERS ======
function getUsers() {
  const raw = localStorage.getItem(KEYS.USERS);
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

function saveUsers(users) { localStorage.setItem(KEYS.USERS, JSON.stringify(users)); }

function getCurrentUsername() { return localStorage.getItem(KEYS.CURRENT) || "Guest"; }

function setCurrentUsername(name) { localStorage.setItem(KEYS.CURRENT, name); }

// ====== DEFAULT USERS ======
function ensureDefaults() {
  const users = getUsers();
  if(Object.keys(users).length === 0){
    users.ownercreative = { password:"admin123", cbucks:9999999, friends:[], _claimedDates:[] };
    users.alice = { password:"alice123", cbucks:1500, friends:[], _claimedDates:[] };
    users.bob = { password:"bob123", cbucks:800, friends:[], _claimedDates:[] };
    saveUsers(users);
  }
  if(!localStorage.getItem(KEYS.CURRENT)) setCurrentUsername("Guest");
}

// ====== LOGIN ======
function login(username, password){
  const users = getUsers();
  if(!users[username]) return {success:false,message:"User not found."};
  if(users[username].password !== password) return {success:false,message:"Wrong password."};

  setCurrentUsername(username);  // ✅ fixes login issue
  refreshAll();
  return {success:true,message:`Welcome, ${username}!`};
}

// ====== UI REFRESH ======
function refreshAll(){
  refreshUserDisplay();
  refreshCBucks();
  refreshLeaderboard();
  refreshFriends();
  loadTodayRiddle();
  refreshDailyNote();
}

function refreshUserDisplay(){
  const username = getCurrentUsername();
  if(els.currentUser) els.currentUser.textContent = username;

  const navLogin = document.getElementById("nav-login");
  const navSignup = document.getElementById("nav-signup");

  if(username !== "Guest"){
    if(navLogin) navLogin.style.display = "none";
    if(navSignup) navSignup.style.display = "none";
    if(els.adminTools) els.adminTools.style.display = username==="ownercreative"?"block":"none";
  }else{
    if(navLogin) navLogin.style.display = "";
    if(navSignup) navSignup.style.display = "";
    if(els.adminTools) els.adminTools.style.display = "none";
  }
}

function refreshCBucks(){
  const username = getCurrentUsername();
  const users = getUsers();
  const cb = (users[username] && users[username].cbucks) || 0;
  if(els.cbucksBadge) els.cbucksBadge.textContent = `💰 ${formatCBucks(cb)} C-Bucks`;
  if(els.cbucksAmount) els.cbucksAmount.textContent = formatCBucks(cb);
}

function refreshLeaderboard(filter=""){
  const users = getUsers();
  let arr = Object.entries(users)
    .map(([name,data])=>({name,cbucks:data.cbucks||0}))
    .sort((a,b)=>b.cbucks-a.cbucks)
    .slice(0,10);

  if(!els.leaderboardList) return;
  els.leaderboardList.innerHTML = arr
    .filter(u=>u.name.toLowerCase().includes(filter.toLowerCase()))
    .map((u,i)=>`<div class="list-item"><span>#${i+1}</span><span>${u.name}</span><span>${formatCBucks(u.cbucks)}</span></div>`).join("")
    || "<div class='muted small'>No players yet.</div>";
}

function refreshFriends(filter=""){
  const username = getCurrentUsername();
  const users = getUsers();
  const me = users[username]||{friends:[]};
  const results = Object.keys(users)
    .filter(n=>n!==username && n.toLowerCase().includes(filter.toLowerCase()))
    .map(n=>({name:n,isFriend:me.friends.includes(n)}));

  if(!els.friendsList) return;
  if(!results.length){
    els.friendsList.innerHTML = "<div class='muted small'>No users found.</div>";
    return;
  }
  els.friendsList.innerHTML = results.map(r=>`
    <div class="list-item">
      <span>${r.name}</span>
      <div>
        <button class="btn-small" data-name="${r.name}" data-action="${r.isFriend?'remove':'add'}">
          ${r.isFriend?'Remove':'Add'}
        </button>
      </div>
    </div>
  `).join("");
}

// ====== FORMATTERS ======
function formatCBucks(n){
  n=Number(n||0);
  if(n>=1e9) return (n/1e9).toFixed(1)+"B";
  if(n>=1e6) return (n/1e6).toFixed(1)+"M";
  if(n>=1e3) return (n/1e3).toFixed(1)+"K";
  return n.toString();
}

// ====== RIDDLES ======
function todayKey(){ return new Date().toISOString().split("T")[0]; }

function getTodaysIndex(){
  return todayKey().split("").reduce((sum,c)=>sum+c.charCodeAt(0),0)%RIDDLES.length;
}

function loadTodayRiddle(){
  const r = RIDDLES[getTodaysIndex()];
  if(els.riddleQuestion) els.riddleQuestion.textContent = r.q;
  if(els.riddleFeedback) els.riddleFeedback.textContent="";
  if(els.riddleAnswerIn) els.riddleAnswerIn.value="";
}

function submitRiddleAnswer(){
  const username = getCurrentUsername();
  if(username==="Guest") return alert("Log in to answer the riddle.");
  const users = getUsers();
  const me = users[username]||(users[username]={password:"",cbucks:0,friends:[],_claimedDates:[]});

  const idx = getTodaysIndex();
  const correct = RIDDLES[idx].a.toLowerCase().trim();
  const val = (els.riddleAnswerIn && els.riddleAnswerIn.value.trim().toLowerCase())||"";
  if(!val){ if(els.riddleFeedback) els.riddleFeedback.textContent="Please type an answer."; return; }

  const today = todayKey();
  if(me._claimedDates.includes(`riddle_${today}`)){ 
    if(els.riddleFeedback) els.riddleFeedback.textContent="You already answered today's riddle."; 
    return; 
  }

  if(val===correct){
    me.cbucks=(me.cbucks||0)+100;
    me._claimedDates.push(`riddle_${today}`);
    users[username]=me;
    saveUsers(users);
    refreshAll();
    if(els.riddleFeedback) els.riddleFeedback.textContent="🎉 Correct! +100 C-Bucks awarded.";
  }else{
    if(els.riddleFeedback) els.riddleFeedback.textContent="❌ Wrong answer. Try again!";
  }
}

function refreshRiddle(){ loadTodayRiddle(); if(els.riddleFeedback) els.riddleFeedback.textContent="Riddle refreshed (same for today)."; }

// ====== DAILY REWARD ======
function claimDailyReward(){
  const username = getCurrentUsername();
  if(username==="Guest") return alert("Log in to claim daily reward.");
  const users = getUsers();
  const me = users[username]||(users[username]={password:"",cbucks:0,friends:[],_claimedDates:[]});

  const today = todayKey();
  if(me._claimedDates.includes(`daily_${today}`)) return alert("Already claimed today.");
  const reward=50;
  me.cbucks=(me.cbucks||0)+reward;
  me._claimedDates.push(`daily_${today}`);
  users[username]=me;
  saveUsers(users);
  refreshAll();
  alert(`✅ Daily reward claimed: ${reward} C-Bucks`);
}

function refreshDailyNote(){
  const username=getCurrentUsername();
  if(!els.dailyNote) return;
  if(username==="Guest"){ els.dailyNote.textContent="Log in to claim daily rewards and answer the riddle."; return; }

  const users = getUsers();
  const me=users[username]||{_claimedDates:[]};
  const today=todayKey();
  const claimed=me._claimedDates.includes(`daily_${today}`);
  const rAnswered=me._claimedDates.includes(`riddle_${today}`);
  const parts=[];
  if(claimed) parts.push("Daily reward claimed");
  if(rAnswered) parts.push("Riddle answered");
  els.dailyNote.textContent=parts.length?parts.join(" • "):"You can claim today's reward and answer the riddle.";
}

// ====== FRIENDS ======
function addFriendByName(name){
  const username = getCurrentUsername();
  if(username === "Guest") return alert("Log in to add friends.");
  name = name.trim();
  if(!name) return alert("Enter a username to add.");
  const users = getUsers();
  if(!users[name]) return alert("User not found.");
  if(name === username) return alert("You cannot add yourself.");

  const me = users[username] || { password:"", cbucks:0, friends:[], _claimedDates:[] };
  me.friends = me.friends || [];
  if(me.friends.includes(name)) return alert("Already friends.");

  me.friends.push(name);
  users[username] = me;
  saveUsers(users);
  refreshFriends();
}

function removeFriendByName(name){
  const username = getCurrentUsername();
  if(username === "Guest") return alert("Log in to remove friends.");
  const users = getUsers();
  const me = users[username] || { friends:[] };
  me.friends = (me.friends || []).filter(f => f !== name);
  users[username] = me;
  saveUsers(users);
  refreshFriends();
}

// ====== FRIEND BUTTON EVENT DELEGATION ======
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-name]");
  if(!btn) return;
  const name = btn.getAttribute("data-name");
  const action = btn.getAttribute("data-action");
  if(action === "add") addFriendByName(name);
  if(action === "remove") removeFriendByName(name);
});

// ====== ADMIN ======
function adminGive(username, amount){
  const users = getUsers();
  if(!users[username]) return alert("User not found.");
  users[username].cbucks = (users[username].cbucks || 0) + Number(amount);
  saveUsers(users);
  refreshAll();
  alert(`✅ Gave ${formatCBucks(amount)} to ${username}`);
}

function adminTake(username, amount){
  const users = getUsers();
  if(!users[username]) return alert("User not found.");
  users[username].cbucks = Math.max(0, (users[username].cbucks || 0) - Number(amount));
  saveUsers(users);
  refreshAll();
  alert(`⚠️ Took ${formatCBucks(amount)} from ${username}`);
}

// ====== THEME ======
function applyThemeFromStorage(){
  const t = localStorage.getItem(KEYS.THEME) || "dark";
  document.body.classList.toggle("light", t==="light");
  if(els.themeBtn) els.themeBtn.textContent = t==="light"?"🌞":"🌙";
}

function toggleTheme(){
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem(KEYS.THEME, isLight?"light":"dark");
  if(els.themeBtn) els.themeBtn.textContent = isLight?"🌞":"🌙";
}

// ====== ATTACH HANDLERS ======
function attachHandlers(){
  if(els.themeBtn) els.themeBtn.addEventListener("click", toggleTheme);

  if(els.logoutBtn) els.logoutBtn.addEventListener("click", ()=>{
    setCurrentUsername("Guest");
    refreshAll();
  });

  if(els.switchBtn) els.switchBtn.addEventListener("click", ()=>{
    alert("To switch accounts, log out and log in with a different user.");
  });

  if(els.claimDailyBtn) els.claimDailyBtn.addEventListener("click", claimDailyReward);
  if(els.riddleSubmitBtn) els.riddleSubmitBtn.addEventListener("click", submitRiddleAnswer);
  if(els.riddleRefreshBtn) els.riddleRefreshBtn.addEventListener("click", refreshRiddle);

  if(els.friendAddBtn){
    els.friendAddBtn.addEventListener("click", ()=>{
      addFriendByName(els.friendNameIn.value);
      els.friendNameIn.value = "";
    });
  }

  if(els.friendSearch){
    els.friendSearch.addEventListener("input", e => refreshFriends(e.target.value.trim()));
  }

  if(els.leaderSearch){
    els.leaderSearch.addEventListener("input", e => refreshLeaderboard(e.target.value.trim()));
  }

  if(els.adminGiveBtn){
    els.adminGiveBtn.addEventListener("click", ()=>{
      const user = els.adminUsernameIn.value.trim();
      const amt = Number(els.adminAmountIn.value);
      if(!user || !amt) return alert("Enter username and amount.");
      adminGive(user, amt);
    });
  }

  if(els.adminTakeBtn){
    els.adminTakeBtn.addEventListener("click", ()=>{
      const user = els.adminUsernameIn.value.trim();
      const amt = Number(els.adminAmountIn.value);
      if(!user || !amt) return alert("Enter username and amount.");
      adminTake(user, amt);
    });
  }
}

// ====== EXPOSE FUNCTIONS ======
window.addFriendByName = addFriendByName;
window.removeFriendByName = removeFriendByName;
window.adminGive = adminGive;
window.adminTake = adminTake;
window.formatCBucks = formatCBucks;
window.login = login;  // ✅ login exposed for external forms
