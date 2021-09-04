import { Server, Socket } from "socket.io";
import * as Game from "../actions/game";
import { resetRoom, sendRoomUpdate } from "../utils/update-room";

export function pictionaryEvents(io: Server, socket: Socket) {
  socket.on("send-game-emoji", (roomName, emojiSet) => {
    try {
      Game.updateEmojiSet(roomName, emojiSet);
      io.to(roomName).emit("new-game-emoji", emojiSet);
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e as Error);
    }
  });

  socket.on("skip-word", (roomName) => {
    Game.skipWord(roomName, io);
    sendRoomUpdate(io, roomName);
  });
}
