import * as Rooms from "./rooms";
import { Room } from "./rooms";
import { updateGameEvent } from "./event";
import { Socket } from "socket.io";

function add(
  { roomName, roomPassword = "" }: { roomName: string; roomPassword?: string },
  playerId: string,
  { name, emoji }: { name: string; emoji: string }
) {
  try {
    const room = Rooms.get(roomName);
    if (room?.password !== roomPassword) {
      throw new Error("Password is incorrect.");
    }
    if (!room.players) {
      room.players = {};
    }
    const oldPlayer = Object.values(room.players).find(
      (player) => player.name === name
    );
    if (oldPlayer) {
      room.players[playerId] = { ...oldPlayer, id: playerId };
      remove(roomName, oldPlayer.id);
    } else {
      room.players[playerId] = {
        id: playerId,
        name,
        emoji,
        score: 0,
        pass: false,
        host: false,
        guessed: false,
        drawer: false,
      };
    }
    setHost(room);

    // Disable chat when over 50 players
    const lotsOfPlayers = Object.keys(room.players).length > 50;
    let chatChanged = false;
    if (room.settings.chat && lotsOfPlayers) {
      room.settings.chat = false;
      chatChanged = true;
    }
    if (!room.settings.chat && !lotsOfPlayers) {
      room.settings.chat = true;
      chatChanged = true;
    }

    updateGameEvent(roomName, "player-joined");
    Rooms.update(room);

    return {
      createdPlayer: get(roomName, playerId),
      chatChanged,
      chat: room.settings.chat,
    };
  } catch (e) {
    throw e;
  }
}

function get(roomName: string, playerId: string) {
  const room = Rooms.get(roomName);
  if (!room) return;
  return room.players[playerId];
}

function remove(roomName: string, playerId: string) {
  try {
    const room = Rooms.get(roomName);
    if (!room) return;
    const player = get(roomName, playerId);
    if (!player) return;
    delete room.players[playerId];
    if (player.host) setHost(room);

    // Disable chat when over 50 players
    const lotsOfPlayers = Object.keys(room.players).length > 50;
    let chatChanged = false;
    if (room.settings.chat && lotsOfPlayers) {
      room.settings.chat = false;
      chatChanged = true;
    }
    if (!room.settings.chat && !lotsOfPlayers) {
      room.settings.chat = true;
      chatChanged = true;
    }

    updateGameEvent(roomName, "player-left");
    Rooms.update(room);
    return { players: room.players, chatChanged, chat: room.settings.chat };
  } catch (e) {
    return;
  }
}

function kick(roomName: string, playerName: string) {
  try {
    const players = Rooms.get(roomName)?.players;
    if (!players) return;
    const playerId = Object.keys(players).find(
      (key) => players[key].name === playerName
    );
    if (playerId) {
      remove(roomName, playerId);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    throw e;
  }
}

const removeFromAllRooms = (socket: Socket) => {
  const rooms = Rooms.getAll();
  const getUserRooms = (socket: Socket) => {
    return Object.entries(rooms).reduce((names: string[], [name, room]) => {
      if (room.players[socket.id] != null) names.push(name);
      return names;
    }, []);
  };

  try {
    getUserRooms(socket).forEach((roomName) => {
      try {
        remove(roomName, socket.id);
      } finally {
        socket.to(roomName).emit("room-update", rooms[roomName]);
      }
    });
  } catch (e) {
    return true;
  }
};

function setHost(room: Room) {
  const hostExists = Object.values(room.players).find(
    (player) => player.host === true
  );
  const randomPlayerId = Object.keys(room.players).pop();
  if (!randomPlayerId) return;
  if (
    (!hostExists || Object.keys(room.players).length === 1) &&
    room.players[randomPlayerId] != null
  ) {
    room.players[randomPlayerId].host = true;
  }
  Rooms.update(room);
}

function resetPass(roomName: string) {
  const room = Rooms.get(roomName);
  if (!room) return;
  Object.values(room.players).forEach((player) => {
    player.pass = false;
  });
  Rooms.update(room);
}

function resetGuessed(roomName: string) {
  const room = Rooms.get(roomName);
  if (!room) return;

  Object.values(room.players).forEach((player) => {
    player.guessed = false;
  });
  Rooms.update(room);
}

function resetPoints(roomName: string) {
  const room = Rooms.get(roomName);
  if (!room) return;

  room &&
    Object.keys(room.players).forEach((playerId) => {
      room.players[playerId].score = 0;
    });
  Rooms.update(room);
}

function resetDrawer(roomName: string) {
  const room = Rooms.get(roomName);
  if (!room) return;

  Object.values(room.players).forEach((player) => {
    player.drawer = false;
  });
  Rooms.update(room);
}

export {
  add,
  get,
  remove,
  kick,
  removeFromAllRooms,
  setHost,
  resetPass,
  resetPoints,
  resetDrawer,
  resetGuessed,
};
