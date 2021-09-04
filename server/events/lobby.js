const Rooms = require("../actions/rooms");
const Players = require("../actions/players");
const Settings = require("../actions/settings");
const chatCommands = require("../utils/chat-commands");
const { sendRoomUpdate, resetRoom } = require("../utils/update-room");

function lobbyEvents(io, socket) {
  socket.on("update-setting", (roomName, setting, value) => {
    try {
      if (setting === "scoreLimit") {
        Settings.updateScoreLimit(roomName, value);
      }
      if (setting === "categories") {
        Settings.updateCategories(roomName, value);
      }
      if (setting === "timer") {
        Settings.setTimer(roomName, value);
      }
      if (setting === "rounds") {
        Settings.setRounds(roomName, value);
      }
      if (setting === "mode") {
        Settings.setGameMode(roomName, value);
      }
      sendRoomUpdate(io, roomName, "settings");
    } catch (e) {
      resetRoom(socket, e);
    }
  });

  socket.on("send-chat-message", ({ roomName, message }) => {
    try {
      const room = Rooms.get(roomName);
      if (message.charAt(0) === "/") {
        chatCommands(io, socket, roomName, message, false);
      } else {
        if (room.settings.chat) {
          io.to(roomName).emit("new-chat-message", {
            text: message,
            player: Players.get(roomName, socket.id),
          });
        }
      }
    } catch (e) {
      resetRoom(socket, e);
    }
  });
}

module.exports = lobbyEvents;
