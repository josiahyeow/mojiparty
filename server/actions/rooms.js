const { db } = require("../firebase");

const {
  DEFAULT_SCORE_LIMIT,
  DEFAULT_SELECTED_CATEGORIES,
  DEFAULT_TIME_PER_ROUND,
  DEFAULT_ROUNDS,
  GAME_MODES,
} = require("../utils/constants");

let emojis = {};
let rooms = {};

function setEmojis(fetchedEmojis) {
  emojis.emojiSets = fetchedEmojis;
}

// Room actions
function get(roomName) {
  try {
    const room = rooms[roomName];
    if (room) {
      return room;
    } else {
      getFromDb(roomName);
    }
  } catch (e) {
    throw e;
  }
}

async function getFromDb(roomName) {
  const room = await db.ref("rooms/" + roomName).get();
  rooms[roomName] = room.val();
  return room.val();
}

async function create(roomName, roomPassword = "") {
  try {
    const room = await db.ref("rooms/" + roomName).get();
    if (room.exists()) {
      throw new Error(`Room ${roomName} already exists.`);
    } else {
      const newRoom = {
        name: roomName,
        password: roomPassword,
        players: {},
        settings: {
          scoreLimit: DEFAULT_SCORE_LIMIT,
          selectedCategories: DEFAULT_SELECTED_CATEGORIES,
          mode: GAME_MODES.CLASSIC,
          timer: DEFAULT_TIME_PER_ROUND,
          rounds: DEFAULT_ROUNDS,
        },
        lastEvent: { type: "Room created" },
        createdAt: Date.now(),
      };
      update(newRoom);
      return rooms[roomName];
    }
  } catch (e) {
    throw e;
  }
}

function update(updatedRoom) {
  try {
    db.ref("rooms/" + updatedRoom.name).set(updatedRoom);
  } catch (e) {
    console.error(e);
  } finally {
    try {
      rooms[updatedRoom.name] = updatedRoom;
      return rooms[updatedRoom.name];
    } catch (e) {
      throw e;
    }
  }
}

function add(room) {
  rooms = { ...rooms, [room.name]: room };
}

const cleanRooms = () => {
  // Object.keys(rooms).forEach((key) => {
  //   if (Object.keys(rooms[key].players).length === 0) delete rooms[key];
  // });
  // console.log("Rooms left: ", rooms);
  return true;
};

function getAll() {
  return rooms;
}

function killAll() {
  rooms = {};
}

function getEmojis() {
  return emojis;
}

module.exports = {
  setEmojis,
  get,
  getFromDb,
  create,
  update,
  add,
  cleanRooms,
  getAll,
  getEmojis,
  killAll,
};
