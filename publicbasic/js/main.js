const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const socket = io();

// since this is the client side, we'll catch the socket.emit here from server.js
// Message from server
socket.on("message", (message) => {
	outputMessage(message);

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
});
console.log("test push for merge");
// Reset input area for next message
// function resetInput(){
//   document.getElementById("elementid").value = "";
// }

//  Output message to DOM
function outputMessage(message) {
	const div = document.createElement("div");
	div.classList.add("message");
	div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
<p class="text">${message}</p>`;
	// console.log(div);

	let messagesContainer = document.querySelector(".chat-messages");
	messagesContainer.appendChild(div);
	// resetInput();
}
//  added for test
