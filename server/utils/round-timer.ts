import { Server } from "socket.io";
import * as Rooms from "../actions/rooms";
import { sendRoomUpdate } from "./update-room";

export function roundTimer(
  roomName: string,
  answer: string,
  io: Server,
  nextEmojiSet: any,
  updateTimer: any
) {
  try {
    const room = Rooms.get(roomName);
    if (!room) {
      return;
    }
    const gameOver = room.game?.winners;
    const time = room.settings.timer;
    if (time < 1) {
      return;
    }
    let timeLeft = time;
    const timer = setInterval(() => {
      const room = Rooms.get(roomName);
      if (!room) {
        return;
      }
      let currentEmojiSet;
      if (room.game?.currentEmojiSet) {
        currentEmojiSet = room.game.currentEmojiSet.answer;
      }
      if (timeLeft < 0) {
        clearInterval(timer);
        nextEmojiSet(roomName, io);
        sendRoomUpdate(io, roomName);
      }
      if (currentEmojiSet !== answer || !room.game || gameOver) {
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
