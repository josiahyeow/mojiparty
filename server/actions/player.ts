import { GAME_MODE } from "../utils/constants";
import { updateGameEvent } from "./event";
import * as Game from "./game";
import * as Players from "./players";
import * as Rooms from "./rooms";

export type Player = {
  id: string;
  name: string;
  score: number;
  emoji: string;
  pass: boolean;
  guessed: boolean;
  drawer: boolean;
  host: boolean;
};

function passEmojiSet(roomName: string, playerId: string) {
  try {
    const room = Rooms.get(roomName);
    if (!room) return;
    room.players[playerId].pass = true;
    let pass = false;
    let passedPlayers = 0;
    Object.values(room.players).forEach((player) => {
      if (player.pass) {
        passedPlayers += 1;
      }
    });
    if (
      passedPlayers >= Math.round((Object.keys(room.players).length - 1) * 0.75)
    ) {
      pass = true;
    }
    if (pass) {
      Players.resetPass(roomName);
      updateGameEvent(roomName, "pass");
    } else {
      updateGameEvent(roomName, "pass-request");
    }
    Rooms.update(room);
    return pass;
  } catch (e) {
    console.error(e);
    throw new Error("Could not pass emoji set");
  }
}

function addPoint(roomName: string, playerId: string) {
  try {
    const room = Rooms.get(roomName);
    if (!room || !room.game) return;

    if (room.settings.mode === GAME_MODE.CLASSIC) {
      room.players[playerId].score += 1;
      if (room.players[playerId].score === room.settings.scoreLimit) {
        Game.getWinners(roomName);
      }
      room.game.lastEvent = {
        ...room.players[playerId],
        type: "correct",
      };
    }
    if (room.settings.mode === GAME_MODE.SKRIBBL) {
      const points = Math.abs(room.game.timeLeft * 0.3 * 100);
      room.players[playerId].guessed = true;
      room.players[playerId].score += points;
      room.game.lastEvent = {
        ...room.players[playerId],
        type: "guessed",
      };
    }
    if (room.settings.mode === GAME_MODE.PICTIONARY) {
      const drawer = room.game.drawer;
      room.players[drawer].score += 2;
      room.game.lastEvent = {
        ...room.players[playerId],
        type: "correct",
      };
    }
    room.game.top5 = Object.values(room.players)
      .sort((a, b) => {
        if (a.score > b.score) return -1;
        if (b.score > a.score) return 1;
        return 0;
      })
      .slice(0, 5);
    Rooms.update(room);
  } catch (e) {
    console.log(e);
    throw new Error("Could not add point");
  }
}

function isHost(roomName: string, playerId: string) {
  try {
    return Rooms.get(roomName)?.players[playerId].host;
  } catch (e) {
    throw e;
  }
}

export { passEmojiSet, addPoint, isHost };
