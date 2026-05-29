const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let rooms = {};

function createRoom(roomId){
    rooms[roomId] = {
        players: [],
        turnIndex: 0
    };
}

io.on("connection", (socket) => {

    socket.on("joinRoom", ({roomId, name}) => {

        if(!rooms[roomId]){
            createRoom(roomId);
        }

        socket.roomId = roomId;
        socket.name = name;

        rooms[roomId].players.push(name);

        socket.join(roomId);

        io.to(roomId).emit("roomUpdate", rooms[roomId]);
    });

    socket.on("nextTurn", (roomId) => {

        let room = rooms[roomId];

        if(!room || room.players.length === 0) return;

        room.turnIndex = (room.turnIndex + 1) % room.players.length;

        io.to(roomId).emit("turnUpdate", {
            player: room.players[room.turnIndex]
        });

    });

    socket.on("disconnect", () => {

        for(let r in rooms){
            rooms[r].players = rooms[r].players.filter(p => p !== socket.name);
        }

    });

});

server.listen(3000, () => {
    console.log("http://localhost:3000");
});