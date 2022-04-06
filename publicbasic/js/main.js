const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

const socket = io();

// Join Chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

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

	// Getting the thing tht makes the event, check its elements, get the one with id 'msg'
	const msg = e.target.elements.msg.value;

	// emitting a message to the server from client side
	socket.emit("chatMessage", msg);
	e.target.elements.msg.value = "";
	e.target.elements.msg.focus();
});

//  Output message to DOM
function outputMessage(message) {
	const div = document.createElement("div");
	div.classList.add("message"); // for styling
	div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
<p class="text">${message.text}</p>`;

	// console.log(message, "from main.js");

	let messagesContainer = document.querySelector(".chat-messages");
	messagesContainer.appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
	return (roomName.innerText = room);
}
// Add users to DOM
function outputUsers(users) {
	userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}

document.getElementById("leave-btn").addEventListener("click", () => {
	const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
	if (leaveRoom) {
		window.location = "../index.html";
	} else {
	}
});

let pingBtn = document.querySelector(".ping");
pingBtn.addEventListener("click", (e) => {
	e.preventDefault();
	socket.emit("ping");
	// socket.emit(console.log("pinged"));
	// let pingSound = new Audio("../../crack_the_whip.mp3");
	// console.log(pingSound);
	// pingSound.play();

});

// async function playAudio() {
// 	let audio = new Audio(
// 		"https://res.cloudinary.com/duj93wpnu/video/upload/v1649203934/crack_the_whip_ywmuha.mp3"
// 	);
// 	audio.type = "audio/wav";

// 	try {
// 		await audio.play();
// 		console.log("Playing...");
// 	} catch (err) {
// 		console.log("Failed to play..." + err);
// 	}
// }
