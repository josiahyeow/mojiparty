const { getAll, update } = require("../actions/rooms");
const {
  DEFAULT_SCORE_LIMIT,
  DEFAULT_SELECTED_CATEGORIES,
  GAME_MODES,
  DEFAULT_TIME_PER_ROUND,
} = require("../utils/constants");

const create = (roomName) => {
  try {
    const rooms = getAll();
    if (roomName in rooms) {
      throw new Error(`Room ${roomName} already exists.`);
    } else {
      const newRoom = {
        name: roomName,
        players: {},
        settings: {
          scoreLimit: DEFAULT_SCORE_LIMIT,
          selectedCategories: DEFAULT_SELECTED_CATEGORIES,
          mode: GAME_MODES.SKRIBBL,
          timer: DEFAULT_TIME_PER_ROUND,
        },
        lastEvent: { type: "Room created" },
      };
      update(roomName, newRoom);
      return rooms[roomName];
    }
  } catch (e) {
    throw e;
  }
};

module.exports = { create };
