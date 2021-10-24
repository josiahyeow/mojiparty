import { isAfter, isBefore, sub } from "date-fns";
import { db } from "../firebase";

import {
  DEFAULT_SCORE_LIMIT,
  DEFAULT_SELECTED_CATEGORIES,
  DEFAULT_TIME_PER_ROUND,
  DEFAULT_ROUNDS,
  GAME_MODE,
} from "../utils/constants";
import type { GameEvent } from "./event";
import type { Game } from "./game";
import type { Player } from "./player";
import type { Settings } from "./settings";

export type Room = {
  name: string;
  password?: string;
  players: Record<string, Player>;
  settings: Settings;
  lastEvent: GameEvent;
  createdAt?: number;
  game: Game | null;
};

export type EmojiSet = {
  category: string;
  emojiSet: string;
  answer: string;
  showLetters: number[];
  firstHint: boolean;
  hint: string;
};

export type EmojiSets = {
  general: EmojiSet[];
  foods: EmojiSet[];
  movies: EmojiSet[];
  tv: EmojiSet[];
  music: EmojiSet[];
  places: EmojiSet[];
  brands: EmojiSet[];
  anime: EmojiSet[];
  koreaboo: EmojiSet[];
};

export type Emojis = {
  emojiSets: EmojiSets;
};

let emojis: Emojis = {
  emojiSets: {
    general: [],
    foods: [],
    movies: [],
    tv: [],
    music: [],
    places: [],
    brands: [],
    anime: [],
    koreaboo: [],
  },
};

let rooms: Record<string, Room> = {};

function setEmojis(fetchedEmojis: any) {
  emojis.emojiSets = fetchedEmojis;
}

// Room actions
function get(roomName: string) {
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

async function getFromDb(roomName: string) {
  const room = await db.ref("rooms/" + roomName).get();
  rooms[roomName] = room.val();
  return room.val();
}

async function create(roomName: string, roomPassword = "") {
  try {
    const room = await db.ref("rooms/" + roomName).get();
    if (room.exists()) {
      const existingRoom = room.val();
      const yesterday = sub(new Date(), { days: 1 });
      if (isBefore(yesterday, new Date(existingRoom.createdAt))) {
        throw new Error(`Room ${roomName} already exists.`);
      }
    }
    const newRoom: Room = {
      name: roomName,
      password: roomPassword,
      players: {},
      settings: {
        scoreLimit: DEFAULT_SCORE_LIMIT,
        selectedCategories: DEFAULT_SELECTED_CATEGORIES,
        mode: GAME_MODE.SKRIBBL,
        timer: DEFAULT_TIME_PER_ROUND,
        rounds: DEFAULT_ROUNDS,
        chat: true,
      },
      lastEvent: { type: "Room created" },
      createdAt: Date.now(),
      game: null,
    };
    update(newRoom);
    return rooms[roomName];
  } catch (e) {
    throw e;
  }
}

function update(updatedRoom: Room) {
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

function add(room: Room) {
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

export {
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
