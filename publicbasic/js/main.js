const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

const socket = io();

// Join Chatroom
socket.emit("joinRoom", { username, room });

// since this is the client side, we'll catch the socket.emit here from server.js
// Message from server
socket.on("message", (message) => {
	outputMessage(message);
	// console.log(message);
	// Scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message Submit event
chatForm.addEventListener("submit", (e) => {
	e.preventDefault();

	//  getting the thing tht makes the event, check its elements, get the one with id 'msg'
	const msg = e.target.elements.msg.value;

	// emitting a message to the server from client side
	socket.emit("chatMessage", msg);
	e.target.elements.msg.value = "";
	e.target.elements.msg.focus();
});

// Reset input area for next message
// function resetInput(){
//   document.getElementById("elementid").value = "";
// }

//  Output message to DOM
function outputMessage(message) {
	const div = document.createElement("div");
	div.classList.add("message"); // for styling
	div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
<p class="text">${message.text}</p>`;

	console.log(message, "from main.js");

	let messagesContainer = document.querySelector(".chat-messages");
	messagesContainer.appendChild(div);
}
