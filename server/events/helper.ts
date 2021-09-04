import { Server, Socket } from "socket.io";
import * as Rooms from "../actions/rooms";

export function helperEvents(io: Server, socket: Socket) {
  socket.on("repair-room", (room) => {
    Rooms.add(room);
    io.to(room.name).emit("room-repaired");
  });

  socket.on("kill-rooms", () => {
    Rooms.killAll();
  });
}
