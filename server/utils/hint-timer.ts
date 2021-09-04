import { Server } from "socket.io";
import * as Rooms from "../actions/rooms";

export function hintTimer(
  roomName: string,
  answer: string,
  io: Server,
  updateHint: any
) {
  try {
    let maxHints = answer.length - Math.floor(answer.length / 2);
    let hintsLeft = maxHints;
    const timer = setInterval(() => {
      const room = Rooms.get(roomName);
      if (!room?.game) {
        return;
      }
      let currentEmojiSet;
      if (room.game.currentEmojiSet) {
        currentEmojiSet = room.game.currentEmojiSet.answer;
      }
      if (hintsLeft <= 0 || currentEmojiSet !== answer || !room.game) {
        clearInterval(timer);
      } else if (hintsLeft < maxHints) {
        const hint = updateHint(roomName);
        io.to(roomName).emit("hint-update", hint);
      }
      hintsLeft -= 1;
    }, 10000);
    return timer;
  } catch (e) {
    console.error(e);
  }
}
