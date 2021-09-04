import { getAll, update } from "../actions/rooms";
import {
  DEFAULT_SCORE_LIMIT,
  DEFAULT_SELECTED_CATEGORIES,
  GAME_MODE,
  DEFAULT_TIME_PER_ROUND,
} from "../utils/constants";

const create = (roomName: string) => {
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
          mode: GAME_MODE.SKRIBBL,
          timer: DEFAULT_TIME_PER_ROUND,
          chat: true,
          rounds: 10,
        },
        game: null,
        lastEvent: { type: "Room created" },
      };
      update(newRoom);
      return rooms[roomName];
    }
  } catch (e) {
    throw e;
  }
};

module.exports = { create };
