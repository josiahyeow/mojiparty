const { get, update } = require("../actions/rooms");

function updateGameEvent(roomName, event) {
  const room = get(roomName);
  if (room.game) {
    room.game.lastEvent = { type: event };
  } else {
    room.lastEvent = { type: event };
  }
  update(room);
}

module.exports = {
  updateGameEvent,
};
