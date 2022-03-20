const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// set static folder- now if we visit localhost:3000 this is what opens
app.use(express.static(path.join(__dirname, "publicbasic")));

// Run when a client connects
io.on("connect", (socket) => {
	// console.log("New WS Connection...");

	// Welcome user
	// we can call the first argument here anything, it's just a keyword/event the client side will listen to
	socket.emit("message", "Welcome to ChatCord!");

	//  .broadcast notifies everyone there's a new connection,
	// except the user that's connecting
	socket.broadcast.emit("message", "A user has joined the chat");

	// run when client disconnects
	socket.on("disconnect", () => {
		socket.emit("message", "A user has left the chat!");
	});

	// Listen for chat message
	socket.on("chatMessage", (msg) => {
		console.log(msg);
	});
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
