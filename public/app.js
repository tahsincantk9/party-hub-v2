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

  apiKey: "AIzaSyBZNpGv5Yk54JFB_5U6Qr6iNx2PaPrhIFo",
  authDomain:  "party-hub-90183.firebaseapp.com",
  databaseURL: "https://party-hub-90183-default-rtdb.europe-west1.firebasedatabase.app/" ,
  projectId: "party-hub-90183",
  storageBucket: "party-hub-90183.appspot.com",
  messagingSenderId:  "230836884321",
  appId: "1:230836884321:web:81b3eb36d650c18d0d6b20"

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

  window.selectGame = function(game){
    console.log("GAME SEÇİLDİ:", game);
} 
  
  /* PLAYER EKLE */

    push(
        ref(db, "rooms/" + roomId + "/players"),
        {
            name: name
        }
    );

  window.selectGame = function(game){

    set(
        ref(db, "rooms/" + roomId + "/game"),
        game
    );
}  
  
  onValue(
    ref(db, "rooms/" + roomId + "/game"),
    (snapshot) => {

        const game = snapshot.val();

        if(game){

            document.getElementById("turn").innerText =
                "🎮 Oyun: " + game;
        }
    }
);

window.selectGame = function(game){

    set(ref(db, "rooms/" + roomId + "/game"), game);
}
  
  onValue(ref(db, "rooms/" + roomId + "/game"), (snapshot) => {

    const game = snapshot.val();

    if(!game) return;

    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";

    document.getElementById("gameTitle").innerText = "🎮 " + game;
    document.getElementById("gameContent").innerText = "Oyun başladı!";
});
  
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
window.backLobby = function(){

    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("app").style.display = "block";

    set(ref(db, "rooms/" + roomId + "/game"), null);
}
window.backLobby = function(){

    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("app").style.display = "block";

    set(ref(db, "rooms/" + roomId + "/game"), null);
}
