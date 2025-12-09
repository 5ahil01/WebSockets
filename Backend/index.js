const { randomUUID } = require("crypto");
const http = require("http");

const WebSocket = require("ws");

const httpServer = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === "GET" && req.url === "/users") {
    const userIds = Array.from(clients.keys());

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(userIds));
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
});

const wss = new WebSocket.Server({ server: httpServer });
const clients = new Map();

function sendMessage(destId, message) {
  console.log(clients);

  const destinationClient = clients.get(destId);
  console.log(destId, message);
  console.log("destinationClient", destinationClient, "\n");

  if (!destinationClient) return;

  try {
    destinationClient.socket.send(message);
    console.log("successfully send the message");
  } catch (error) {
    console.log(error.message);
  }
}

let count = 100;
wss.on("connection", (socket) => {
  socket.id = count;
  count++;
  clients.set(socket.id, {
    socket: socket,
  });

  console.log(`${socket.id} connected successfully`);

  socket.on("message", (data) => {
    let { id, message } = JSON.parse(data.toString());
    console.log(`id: ${id}, message: ${message}`);

    sendMessage(id, message);
  });

  socket.on("close", () => {
    clients.delete(socket.id);
    console.log("Disconnected:", socket.id);
  });
});

httpServer.listen(7500, () => console.log("Server running"));
