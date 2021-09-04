const Rooms = require("../actions/rooms");
const Game = require("../actions/game");
const Player = require("../actions/player");
const Players = require("../actions/players");
const { sendRoomUpdate, resetRoom } = require("../utils/update-room");
const chatCommands = require("../utils/chat-commands");
const hintTimer = require("../utils/hint-timer");
const { GAME_MODES } = require("../utils/constants");

function gameEvents(io, socket) {
  socket.on("start-game", (roomName) => {
    try {
      Game.start(roomName, io);
      hintTimer(
        roomName,
        Rooms.get(roomName).game.currentEmojiSet.answer,
        io,
        Game.updateHint
      );
      sendRoomUpdate(io, roomName);
      io.to(roomName).emit("error-message", "");
    } catch (e) {
      console.error(e.message);
      io.to(roomName).emit("error-message", e.message);
    }
  });

  socket.on("end-game", (roomName) => {
    try {
      Game.end(roomName);
      io.to(roomName).emit("game-ended");
      sendRoomUpdate(io, roomName);
    } catch (e) {
      resetRoom(socket, e);
    }
  });

  socket.on("pass-emojiset", (roomName) => {
    try {
      const allPassed = Player.passEmojiSet(roomName, socket.id);
      const player = Players.get(roomName, socket.id);
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
      resetRoom(socket, e);
    }
  });

  socket.on("send-game-message", ({ roomName, guess }) => {
    try {
      const room = Rooms.get(roomName);
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
          if (room.settings.mode === GAME_MODES.CLASSIC) {
            Game.nextEmojiSet(roomName, io);
            sendRoomUpdate(io, roomName);
          }
          if (room.settings.mode === GAME_MODES.SKRIBBL) {
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
        if (room.settings.mode === GAME_MODES.SKRIBBL) {
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
      resetRoom(socket, e);
    }
  });
}

module.exports = gameEvents;
