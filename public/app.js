const socket = io();

let roomId = "";
let name = "";

/* GİRİŞ */
function joinRoom(){

    roomId = document.getElementById("roomId").value;
    name = document.getElementById("name").value;

    socket.emit("joinRoom", {roomId, name});

    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";

    document.getElementById("roomShow").innerText = roomId;
}

/* ODA GÜNCELLE */
socket.on("roomUpdate", (room) => {

    document.getElementById("players").innerHTML =
        room.players.map(p => `<div>👤 ${p}</div>`).join("");

});

/* SIRA GÜNCELLE */
socket.on("turnUpdate", (data) => {

    document.getElementById("turn").innerText =
        "🎯 Sıra: " + data.player;

});

/* SIRAYI İLERLET */
function nextTurn(){
    socket.emit("nextTurn", roomId);
}