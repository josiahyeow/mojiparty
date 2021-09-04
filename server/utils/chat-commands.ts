import { Server, Socket } from "socket.io";

import * as Player from "../actions/player";
import * as Players from "../actions/players";
import * as Settings from "../actions/settings";
import { sendRoomUpdate } from "../utils/update-room";

export const chatCommands = (
  io: Server,
  socket: Socket,
  roomName: string,
  message: string,
  inGame: boolean
) => {
  if (Player.isHost(roomName, socket.id)) {
    const [command, ...value] = message.split(" ");
    if (command === "/mode" && !inGame) {
      const mode = value.join("");
      if (mode === "classic" || mode === "pictionary" || mode === "skribbl") {
        Settings.setGameMode(roomName, mode);
        io.to(roomName).emit("new-chat-message", {
          text: `Game mode set to ${mode}`,
          player: { emoji: "🕹", name: "BOT" },
          correct: false,
          system: true,
        });
      }
    } else if (command === "/kick") {
      const playerName = value.join(" ");
      if (playerName) {
        const kicked = Players.kick(roomName, playerName);
        if (kicked) {
          io.to(roomName).emit("new-chat-message", {
            text: `${playerName} was kicked`,
            player: { emoji: "🦵", name: "BOT" },
            correct: false,
            system: true,
          });
          sendRoomUpdate(io, roomName);
        } else {
          io.to(roomName).emit("new-chat-message", {
            text: `No player named ${playerName} to kick`,
            player: { emoji: "🦵", name: "BOT" },
            correct: false,
            system: true,
          });
        }
      } else {
        socket.emit("new-chat-message", {
          text: `Please include the name of the player you want to kick. E.g /kick blair`,
          player: { emoji: "🦵", name: "BOT" },
          correct: false,
          system: true,
        });
      }
    } else {
      socket.emit("new-chat-message", {
        text: `Available commands: /kick [player name]`,
        player: { emoji: "❓", name: "BOT" },
        correct: false,
        system: true,
      });
    }
  } else {
    socket.emit("new-chat-message", {
      text: `Only host can use / commands`,
      player: { emoji: "👑", name: "BOT" },
      correct: false,
      system: true,
    });
  }
};
