const Player = require("../actions/player");
const Players = require("../actions/players");
const Settings = require("../actions/settings");
const { sendRoomUpdate } = require("../utils/update-room");

const chatCommands = (io, socket, roomName, message, inGame) => {
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
    } else if (command === "/timer") {
      Settings.setTimer(roomName, value);
    } else if (command === "/rounds") {
      Settings.setRounds(roomName, value);
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

module.exports = chatCommands;
