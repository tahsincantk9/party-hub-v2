const socket = io();

let roomId = "";
let name = "";

function joinRoom(){

    roomId = document.getElementById("roomId").value;
    name = document.getElementById("name").value;

    if(!roomId || !name){
        alert("Eksik bilgi");
        return;
    }

    socket.emit("joinRoom", { roomId, name });

    document.getElementById("status").innerText =
        "Giriş yapıldı: " + roomId + " | " + name;
}
