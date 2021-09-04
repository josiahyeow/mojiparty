const Game = require("../actions/game");
const { resetRoom, sendRoomUpdate } = require("../utils/update-room");

function pictionaryEvents(io, socket) {
  socket.on("send-game-emoji", (roomName, emojiSet) => {
    try {
      Game.updateEmojiSet(roomName, emojiSet);
      io.to(roomName).emit("new-game-emoji", emojiSet);
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e);
    }
  });

  socket.on("skip-word", (roomName) => {
    Game.skipWord(roomName);
    sendRoomUpdate(io, roomName);
  });
}

module.exports = pictionaryEvents;
