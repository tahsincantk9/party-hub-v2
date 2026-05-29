const socket = io();

let roomId = "";
let name = "";

function joinRoom(){

    roomId = document.getElementById("roomId").value;
    name = document.getElementById("name").value;

    if(!roomId || !name){
        alert("Bilgileri doldur");
        return;
    }

    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";

    document.getElementById("roomText").innerText =
        "🏠 Oda: " + roomId;

    addPlayer(name);
}

function addPlayer(player){

    const div = document.createElement("div");

    div.innerText = "👤 " + player;

    document.getElementById("players").appendChild(div);
}

function nextTurn(){

    const players =
        document.querySelectorAll("#players div");

    if(players.length === 0) return;

    const random =
        Math.floor(Math.random() * players.length);

    document.getElementById("turn").innerText =
        "🎯 Sıra: " + players[random].innerText;
}
