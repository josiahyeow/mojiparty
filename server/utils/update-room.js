const logRoom = require("./log-room");
const { db } = require("../firebase");

function sendRoomUpdate(io, roomName, item = "") {
  try {
    db.ref("rooms/" + roomName)
      .get()
      .then((doc) => {
        const data = doc.val();
        const room = { ...data, players: data.players || {} };
        logRoom(room);
        if (item === "settings") {
          io.to(roomName).emit("settings-update", room.settings);
        } else {
          io.to(roomName).emit("room-update", room);
        }
      });
  } catch (e) {
    console.error(e);
  }
}

function resetRoom(socket, error) {
  console.error(error);
  socket.emit("room-disconnected", { error: error.message });
}

module.exports = { sendRoomUpdate, resetRoom };
