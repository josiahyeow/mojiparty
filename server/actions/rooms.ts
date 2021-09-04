import { db } from "../firebase";

import {
  DEFAULT_SCORE_LIMIT,
  DEFAULT_SELECTED_CATEGORIES,
  DEFAULT_TIME_PER_ROUND,
  DEFAULT_ROUNDS,
  GAME_MODE,
} from "../utils/constants";

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

export type Category = {
  name: string;
  icon: string;
  include: boolean;
  weight: number;
};

export type Categories = {
  general: Category;
  foods: Category;
  movies: Category;
  tv: Category;
  music: Category;
  places: Category;
  brands: Category;
  anime: Category;
  koreaboo: Category;
};

export type Settings = {
  scoreLimit: number;
  selectedCategories: Categories;
  mode: GAME_MODE;
  timer: number;
  rounds: number;
  chat: boolean;
};

export type Event = {
  type: string;
};

export type Game = {
  emojiSets: EmojiSet[];
  currentEmojiSet: EmojiSet | null;
  previousEmojiSet: EmojiSet | null;
  scoreLimit: number;
  lastEvent: Event;
  round: number;
  top5: Player[];
  chat: boolean;
  winners: Player[] | null;
  timeLeft: number;
  drawer: string;
  drawers: string[];
};

export type Room = {
  name: string;
  password?: string;
  players: Record<string, Player>;
  settings: Settings;
  lastEvent: Event;
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
      throw new Error(`Room ${roomName} already exists.`);
    } else {
      const newRoom: Room = {
        name: roomName,
        password: roomPassword,
        players: {},
        settings: {
          scoreLimit: DEFAULT_SCORE_LIMIT,
          selectedCategories: DEFAULT_SELECTED_CATEGORIES,
          mode: GAME_MODE.CLASSIC,
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
    }
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
