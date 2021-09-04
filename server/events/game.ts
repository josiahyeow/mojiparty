import * as Rooms from "../actions/rooms";
import * as Game from "../actions/game";
import * as Player from "../actions/player";
import * as Players from "../actions/players";
import { sendRoomUpdate, resetRoom } from "../utils/update-room";
import { chatCommands } from "../utils/chat-commands";
import { hintTimer } from "../utils/hint-timer";
import { GAME_MODE } from "../utils/constants";
import { Server, Socket } from "socket.io";

export function gameEvents(io: Server, socket: Socket) {
  socket.on("start-game", (roomName) => {
    try {
      Game.start(roomName, io);
      const room = Rooms.get(roomName);
      if (!room?.game) return;
      hintTimer(
        roomName,
        room.game.currentEmojiSet!.answer || "",
        io,
        Game.updateHint
      );
      sendRoomUpdate(io, roomName);
      io.to(roomName).emit("error-message", "");
    } catch (e) {
      console.error((e as Error).message);
      io.to(roomName).emit("error-message", (e as Error).message);
    }
  });

  socket.on("end-game", (roomName) => {
    try {
      Game.end(roomName);
      io.to(roomName).emit("game-ended");
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e as Error);
    }
  });

  socket.on("pass-emojiset", (roomName) => {
    try {
      const allPassed = Player.passEmojiSet(roomName, socket.id);
      const player = Players.get(roomName, socket.id);
      if (!player) return;
      io.to(roomName).emit("new-chat-message", {
        text: `${player.name} passed`,
        player: { ...player, emoji: "🙅" },
        correct: false,
        system: true,
      });
      if (allPassed) {
        Game.nextEmojiSet(roomName, io);
      }
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e as Error);
    }
  });

  socket.on("send-game-message", ({ roomName, guess }) => {
    try {
      const room = Rooms.get(roomName);
      if (!room) {
        return;
      }
      if (guess.charAt(0) === "/") {
        chatCommands(io, socket, roomName, guess, true);
      } else {
        const correct = Game.checkGuess(roomName, guess);
        if (correct) {
          if (room.players[socket.id].guessed) {
            socket.emit("new-chat-message", {
              text: `You've already guessed the answer`,
              player: { emoji: "🤫", name: "BOT" },
              correct: false,
              system: true,
            });
            return;
          }
          Player.addPoint(roomName, socket.id);
          if (room.settings.mode === "pictionary") {
            Game.nextDrawer(roomName);
          }
          if (room.settings.mode === GAME_MODE.CLASSIC) {
            Game.nextEmojiSet(roomName, io);
            sendRoomUpdate(io, roomName);
          }
          if (room.settings.mode === GAME_MODE.SKRIBBL) {
            if (
              Object.values(room.players).find(
                ({ guessed }) => guessed === false
              )
            ) {
              sendRoomUpdate(io, roomName);
            } else {
              Game.nextEmojiSet(roomName, io);
              sendRoomUpdate(io, roomName);
            }
          }
        }
        if (room.settings.mode === GAME_MODE.SKRIBBL) {
          if (correct) {
            socket.emit("new-chat-message", {
              text: guess,
              player: Players.get(roomName, socket.id),
              correct,
            });
            socket.to(roomName).emit("new-chat-message", {
              text: "guessed it",
              player: Players.get(roomName, socket.id),
              correct,
            });
          } else {
            if (room.settings.chat) {
              io.to(roomName).emit("new-chat-message", {
                text: guess,
                player: Players.get(roomName, socket.id),
                correct,
              });
            }
          }
        } else {
          if (room.settings.chat) {
            io.to(roomName).emit("new-chat-message", {
              text: guess,
              player: Players.get(roomName, socket.id),
              correct,
            });
          }
        }
      }
    } catch (e) {
      resetRoom(socket, e as Error);
    }
  });
}
