const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder- now if we visit localhost:3000 this is what opens
app.use(express.static(path.join(__dirname, "publicbasic")));

const botName = "ChatCord Bot";

// Run when a client connects
io.on("connect", (socket) => {
	socket.on("joinRoom", ({ username, room }) => {
		// destructures arguments from userJoin fn and stores them in user
		const user = userJoin(socket.id, username, room);

		socket.join(user.room);

		// Welcome user
		// we can call the first argument here anything, it's just a keyword/event the client side will listen to
		socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

		//  .broadcast notifies everyone there's a new connection,
		// except the user that's connecting - emit to specific room
		socket.broadcast
			.to(user.room)
			.emit(
				"message",
				formatMessage(botName, `${user.username} has joined the chat`)
			);
	});

	// Listen for chat message
	socket.on("chatMessage", (msg) => {
		const user = getCurrentUser(socket.id);
		// we captured the input on client
		// receiving here in the server
		// pushing it to other clients now
		io.to(user.room).emit("message", formatMessage(user.username, msg));
		// console.log(user);
	});

	// run when client disconnects
	socket.on("disconnect", () => {
		io.emit("message", formatMessage(botName, "A user has left the chat!"));
	});
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
