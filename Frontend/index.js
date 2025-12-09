const socket = new WebSocket("ws://localhost:7500");

let users = [];
let currentClientId = null;
const chatSection = document.getElementById("chatSection");
console.log("currentClientId: ", currentClientId);

function seedUsers(userList) {
  const domUser = document.querySelector(".users");

  userList.map((userId) => {
    let newElement = document.createElement("button");
    newElement.innerText = userId;

    newElement.addEventListener("click", () => {
      currentClientId = userId;
      chatSection.style = "";
    });

    domUser.appendChild(newElement);
  });
}

async function fetchUsers() {
  const response = await fetch("http://localhost:7500/users");
  const users = await response.json();

  seedUsers(users);
}

const input = document.querySelector("#input");
const chatLogs = document.querySelector("#chats");

function addChat(message) {
  const chat = document.createElement("div");
  chat.innerText = message;
  chatLogs.appendChild(chat);
}

function sendMessage() {
  let message = input.value;
  data = { id: currentClientId, message };
  console.log("SendMessage", data);

  const chat = document.createElement("div");
  chat.innerText = message;
  chat.style = "margin-left: 20px;";
  chatLogs.appendChild(chat);
  socket.send(JSON.stringify(data));
}

socket.onmessage = (event) => {
  console.log(event.data);

  addChat(event.data);
};
