const Rooms = require("../actions/rooms");
const { sendRoomUpdate } = require("./update-room");

function roundTimer(roomName, answer, io, nextEmojiSet, updateTimer) {
  try {
    const time = Rooms.get(roomName).settings.timer;
    if (time < 1) {
      return;
    }
    let timeLeft = time;
    const timer = setInterval(() => {
      const room = Rooms.get(roomName);
      let currentEmojiSet;
      if (room.game) {
        currentEmojiSet = room.game.currentEmojiSet.answer;
      }
      if (timeLeft < 0) {
        clearInterval(timer);
        nextEmojiSet(roomName, io);
        sendRoomUpdate(io, roomName);
      }
      if (currentEmojiSet !== answer || !room.game) {
        clearInterval(timer);
      } else {
        updateTimer(roomName, timeLeft);
        io.to(roomName).emit("time-update", timeLeft);
      }

      timeLeft -= 1;
    }, 1e3);
    return timer;
  } catch (e) {
    console.error(e);
  }
}

module.exports = roundTimer;
