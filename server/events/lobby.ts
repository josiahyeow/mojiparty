import { Server, Socket } from "socket.io";

import * as Rooms from "../actions/rooms";
import * as Players from "../actions/players";
import * as Settings from "../actions/settings";
import { chatCommands } from "../utils/chat-commands";
import { sendRoomUpdate, resetRoom } from "../utils/update-room";

export function lobbyEvents(io: Server, socket: Socket) {
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
      resetRoom(socket, e as Error);
    }
  });

  socket.on("send-chat-message", ({ roomName, message }) => {
    try {
      const room = Rooms.get(roomName);
      if (!room) return;
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
      resetRoom(socket, e as Error);
    }
  });
}
