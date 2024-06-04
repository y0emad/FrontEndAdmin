import io from "socket.io-client";

const socket = io("http://localhost:4000");

function connect(userId) {
  socket.connect();
  socket.emit("register", userId);
}

function disconnect() {
  socket.disconnect();
}

function sendMessage(message) {
  socket.emit("message", message);
}

function subscribeToMessages(callback) {
  socket.on("message", (message) => {
    callback(message);
  });
}

export { connect, disconnect, sendMessage, subscribeToMessages };
