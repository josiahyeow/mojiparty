const Rooms = require("../actions/rooms");

function helperEvents(io, socket) {
  socket.on("repair-room", (room) => {
    Rooms.add(room);
    io.to(room.name).emit("room-repaired");
  });

  socket.on("kill-rooms", () => {
    Rooms.killAll();
  });
}

module.exports = helperEvents;
