import { Server, Socket } from "socket.io";
import { logRoom } from "./log-room";
import { db } from "../firebase";

function sendRoomUpdate(io: Server, roomName: string, item = "") {
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

function resetRoom(socket: Socket, error: Error) {
  console.error(error);
  socket.emit("room-disconnected", { error: error.message });
}

export { sendRoomUpdate, resetRoom };
