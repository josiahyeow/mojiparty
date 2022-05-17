import { get, update } from "../actions/rooms";
import { GAME_MODE } from "../utils/constants";
import { updateGameEvent } from "./event";

export type Category = {
  name: string;
  icon: string;
  include: boolean;
  weight: number;
  community: boolean;
  author: string | null;
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
  hariRaya: Category;
};

export type Settings = {
  scoreLimit: number;
  selectedCategories: Categories;
  mode: GAME_MODE;
  timer: number;
  rounds: number;
  chat: boolean;
};

function getMode(roomName: string) {
  const room = get(roomName);
  if (!room) {
    return;
  }
  return room.settings.mode;
}

function setGameMode(roomName: string, mode: string) {
  const room = get(roomName);
  if (!room) {
    return;
  }
  room.settings.mode = mode as GAME_MODE;
  if (mode === GAME_MODE.CLASSIC) {
    room.settings.timer = 0;
    room.settings.rounds = 0;
  }
  if (mode === GAME_MODE.SKRIBBL) {
    if (room.settings.rounds === 0) {
      room.settings.rounds = 10;
    }
    if (room.settings.timer === 0) {
      room.settings.timer = 60;
    }
  }
  update(room);
}

function getTimer(roomName: string) {
  const room = get(roomName);
  if (!room) {
    return;
  }
  return room.settings.timer;
}

function setTimer(roomName: string, time: number) {
  const room = get(roomName);
  if (!room) {
    return;
  }
  room.settings.timer = time;
  update(room);
}

function getRounds(roomName: string) {
  const room = get(roomName);
  if (!room) {
    return;
  }
  return room.settings.rounds;
}

function setRounds(roomName: string, rounds: number) {
  const room = get(roomName);
  if (!room) {
    return;
  }
  room.settings.rounds = rounds;
  update(room);
}

const updateScoreLimit = (roomName: string, newScoreLimit: string) => {
  const room = get(roomName);
  if (!room) {
    return;
  }
  room.settings.scoreLimit = Number(newScoreLimit);
  updateGameEvent(roomName, "score-limit-updated");
  update(room);
};

const updateCategories = (roomName: string, updatedCategories: any) => {
  const room = get(roomName);
  if (!room) {
    return;
  }
  room.settings.selectedCategories = updatedCategories;
  console.log(room.settings.selectedCategories);
  updateGameEvent(roomName, "categories-updated");
  update(room);
};

export {
  getMode,
  setGameMode,
  updateScoreLimit,
  updateCategories,
  getTimer,
  setTimer,
  getRounds,
  setRounds,
};
