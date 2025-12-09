const socket = new WebSocket("ws://localhost:7500");

const logs = document.querySelector(".logs");

socket.onopen = () => {
  console.log("Connected to the server");
};

socket.onmessage = (event) => {
  logs.innerText += `${event.data}\n`;
  console.log(event.data);
};

function handleOnClick() {
  const message = "Hey bro";
  socket.send(message);
}
