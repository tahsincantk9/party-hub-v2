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

  apiKey: "BURAYA",
  authDomain: "BURAYA",
  databaseURL: "BURAYA",
  projectId: "BURAYA",
  storageBucket: "BURAYA",
  messagingSenderId: "BURAYA",
  appId: "BURAYA"

};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* VARIABLES */

let roomId = "";
let name = "";

/* JOIN */

window.joinRoom = function(){

    roomId =
        document.getElementById("roomId").value;

    name =
        document.getElementById("name").value;

    if(!roomId || !name){
        alert("Eksik bilgi");
        return;
    }

    document.getElementById("login").style.display = "none";

    document.getElementById("app").style.display = "block";

    document.getElementById("roomText").innerText =
        "🏠 Oda: " + roomId;

    /* PLAYER EKLE */

    push(
        ref(db, "rooms/" + roomId + "/players"),
        {
            name: name
        }
    );

    /* OYUNCULARI DİNLE */

    onValue(
        ref(db, "rooms/" + roomId + "/players"),
        (snapshot) => {

            const data = snapshot.val();

            document.getElementById("players").innerHTML = "";

            for(let id in data){

                const div =
                    document.createElement("div");

                div.innerText =
                    "👤 " + data[id].name;

                document.getElementById("players")
                    .appendChild(div);
            }
        }
    );
}

/* TURN */

window.nextTurn = function(){

    const players =
        document.querySelectorAll("#players div");

    if(players.length === 0) return;

    const random =
        Math.floor(Math.random() * players.length);

    const selected =
        players[random].innerText;

    set(
        ref(db, "rooms/" + roomId + "/turn"),
        selected
    );
}

/* TURN LISTENER */

onValue(
    ref(db, "rooms"),
    (snapshot) => {

        if(!roomId) return;

        const data =
            snapshot.val();

        if(!data[roomId]) return;

        if(data[roomId].turn){

            document.getElementById("turn")
                .innerText =
                "🎯 Sıra: " + data[roomId].turn;
        }
    }
);
