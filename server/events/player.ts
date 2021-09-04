import { Server, Socket } from "socket.io";
import * as Players from "../actions/players";
import { sendRoomUpdate, resetRoom } from "../utils/update-room";

function playerEvents(io: Server, socket: Socket) {
  socket.on("player-joined", ({ room, player }) => {
    const roomName = room.name;
    const roomPassword = room.password || "";
    try {
      socket.join(roomName);
      const { createdPlayer, chatChanged, chat } = Players.add(
        { roomName, roomPassword },
        socket.id,
        player
      );
      socket.emit("joined-room", createdPlayer);
      if (chat) {
        io.to(roomName).emit("new-chat-message", {
          text: `${player && player.name} joined, say hello`,
          player: { emoji: "👋", name: "BOT" },
          correct: false,
          system: true,
        });
      }
      if (chatChanged) {
        sendRoomUpdate(io, roomName, "settings");
      }
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e as Error);
    }
  });

  socket.on("player-left", ({ roomName, player }) => {
    try {
      const result = Players.remove(roomName, socket.id);
      if (!result) {
        return;
      }
      const { chatChanged, chat } = result;
      socket.leave(roomName);
      if (chat) {
        io.to(roomName).emit("new-chat-message", {
          text: `${player.name} left, adios`,
          player: { emoji: "🏃‍♂️", name: "BOT" },
          correct: false,
          system: true,
        });
      }

      if (chatChanged) {
        sendRoomUpdate(io, roomName, "settings");
      }
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e as Error);
    }
  });

  socket.on("disconnect", () => {
    try {
      Players.removeFromAllRooms(socket);
    } catch (e) {
      resetRoom(socket, e as Error);
    }
  });
}

export { playerEvents };
