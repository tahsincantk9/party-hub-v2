import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue,
  set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/* FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "XXX",
  databaseURL: "https://YOUR-PROJECT-default-rtdb.firebaseio.com/",
  projectId: "XXX",
  storageBucket: "XXX",
  messagingSenderId: "XXX",
  appId: "XXX"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* STATE */
let roomId = "";
let name = "";

/* ---------------- JOIN ---------------- */

window.joinRoom = function () {

  roomId = document.getElementById("roomId").value;
  name = document.getElementById("name").value;

  if (!roomId || !name) {
    alert("Eksik bilgi");
    return;
  }

  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";

  document.getElementById("roomText").innerText = "🏠 Oda: " + roomId;

  /* PLAYER EKLE */
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

  set(ref(db, "rooms/" + roomId + "/game"), game);
};

/* ---------------- GAME LISTENER ---------------- */

function listenGame() {

  onValue(ref(db, "rooms/" + roomId + "/game"), (snapshot) => {

    const game = snapshot.val();

    if (!game) return;

    document.getElementById("gameTitle").innerText = "🎮 " + game;

    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";

  });
}

/* ---------------- BACK ---------------- */

window.backLobby = function () {

  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("app").style.display = "block";

  set(ref(db, "rooms/" + roomId + "/game"), null);
};

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
