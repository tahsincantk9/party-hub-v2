import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/* ---------------- FIREBASE ---------------- */

const firebaseConfig = {
  apiKey: "AIzaSyBZNpGv5Yk54JFB_5U6Qr6iNx2PaPrhIFo",
  authDomain:  "party-hub-90183.firebaseapp.com",
  databaseURL: "https://party-hub-90183-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "party-hub-90183",
  storageBucket:  "party-hub-90183.firebasestorage.app",
  messagingSenderId: "230836884321",
  appId: "1:230836884321:web:81b3eb36d650c18d0d6b20"
  
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* 🔥 TAKIM + SKOR */
let teamA = 0;
let teamB = 0;
let currentTeam = "A";


/* ---------------- STATE ---------------- */

let roomId = "";
let name = "";

/* 🔥 TABU HAFIZA */
const usedTabu = new Set();

/* ---------------- JOIN ROOM ---------------- */

window.joinRoom = function () {

  roomId = document.getElementById("roomId").value.trim();
  name = document.getElementById("name").value.trim();

  if (!roomId || !name) {
    alert("Eksik bilgi");
    return;
  }

  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";

  document.getElementById("roomText").innerText = "🏠 Oda: " + roomId;

  push(ref(db, "rooms/" + roomId + "/players"), {
    name: name
  });

  listenPlayers();
  listenGame();
  listenTurn();
};

/* ---------------- PLAYERS ---------------- */

function listenPlayers() {

  onValue(ref(db, "rooms/" + roomId + "/players"), (snapshot) => {

    const data = snapshot.val();
    const box = document.getElementById("players");

    box.innerHTML = "";

    if (!data) return;

    for (let id in data) {

      const div = document.createElement("div");
      div.innerText = "👤 " + data[id].name;

      box.appendChild(div);
    }
  });
}

/* ---------------- GAME SELECT ---------------- */

window.selectGame = function (game) {

  if (!roomId) return;

  set(ref(db, "rooms/" + roomId + "/game"), game);
};

/* ---------------- GAME LISTENER ---------------- */

function listenGame() {

  onValue(ref(db, "rooms/" + roomId + "/game"), (snapshot) => {

    const game = snapshot.val();

    if (!game) return;

    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";

    document.getElementById("gameTitle").innerText = "🎮 " + game;

    if (game === "tabu") {
      nextTabu();
    }
  });
}

let teamA = 0;
let teamB = 0;
let currentTeam = "A";

function correct() {

  if (currentTeam === "A") teamA++;
  else teamB++;

  nextTabu(); 
  function switchTeam() {
  currentTeam = currentTeam === "A" ? "B" : "A";

  document.getElementById("score").innerText =
    `A: ${teamA} | B: ${teamB} | Sıra: ${currentTeam}`;
}
}

function wrong() {
  nextTabu();
}

function skip() {
  nextTabu();
}

/* ---------------- BACK LOBBY ---------------- */

window.backLobby = function () {

  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("app").style.display = "block";

  set(ref(db, "rooms/" + roomId + "/game"), null);
};

/* ---------------- TABU DATA ---------------- */

const tabuWords = [
  { word:"Araba", taboo:["motor","teker","sürmek"] },
  { word:"Telefon", taboo:["arama","mesaj","ekran"] },
  { word:"Futbol", taboo:["top","gol","hakem"] },
  { word:"Pizza", taboo:["peynir","hamur","dilim"] },
  { word:"Kitap", taboo:["okumak","sayfa","yazar"] },
  { word:"Kedi", taboo:["miyav","pati","evcil"] },
  { word:"Köpek", taboo:["havlamak","tasma","evcil"] },
  { word:"Uçak", taboo:["pilot","kanat","uçmak"] }
];

/* ---------------- TABU ---------------- */

window.nextTabu = function () {

  // 🔥 TÜM KELİMELER BİTTİYSE RESET
  if (usedTabu.size === tabuWords.length) {
    usedTabu.clear();
  }

  let random;

  do {
    random = tabuWords[Math.floor(Math.random() * tabuWords.length)];
  } while (usedTabu.has(random.word));

  usedTabu.add(random.word);

  document.getElementById("gameContent").innerHTML = `
    <h2>${random.word}</h2>
    <p>❌ ${random.taboo.join(" • ")}</p>
  `;

  startTimer();
};

/* ---------------- TIMER ---------------- */

let timer;

function startTimer() {

  let time = 60;

  clearInterval(timer);

  document.getElementById("timer").innerText = time;

  timer = setInterval(() => {

    time--;

    document.getElementById("timer").innerText = time;

    if (time <= 0) {

      clearInterval(timer);
      alert("⏰ Süre Bitti!");
    }

  }, 1000);
}

/* ---------------- TURN SYSTEM ---------------- */

window.nextTurn = function () {

  const players = document.querySelectorAll("#players div");

  if (players.length === 0) return;

  const random = Math.floor(Math.random() * players.length);

  const selected = players[random].innerText;

  set(ref(db, "rooms/" + roomId + "/turn"), selected);
};

function listenTurn() {

  onValue(ref(db, "rooms/" + roomId + "/turn"), (snapshot) => {

    const turn = snapshot.val();

    if (!turn) return;

    const el = document.getElementById("turn");

    if (el) el.innerText = "🎯 Sıra: " + turn;
  });
}
