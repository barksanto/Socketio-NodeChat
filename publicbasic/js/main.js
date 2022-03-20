const chatForm = document.getElementById("chat-form");

const socket = io();

// since this is the client side, we'll catch the socket.emit here from server.js
socket.on("message", (message) => {
	console.log(message);
});

// Message Submit event
chatForm.addEventListener("submit", (e) => {
	e.preventDefault();

	//  getting the thing tht makes the event, check its elements, get the one with id 'msg'
	const msg = e.target.elements.msg.value;


	// emitting a message to the server
	socket.emit("chatMessage", msg);
});

// Socketio-NodeChat
