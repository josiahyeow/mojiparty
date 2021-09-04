const { get, update } = require("../actions/rooms");
const { GAME_MODES } = require("../utils/constants");
const { updateGameEvent } = require("./event");

function getMode(roomName) {
  const room = get(roomName);
  return room.settings.mode;
}

function setGameMode(roomName, mode) {
  const room = get(roomName);
  room.settings.mode = mode;
  if (mode === GAME_MODES.CLASSIC) {
    room.settings.timer = 0;
    room.settings.rounds = 0;
  }
  if (mode === GAME_MODES.SKRIBBL) {
    if (room.settings.rounds === 0) {
      room.settings.rounds = 10;
    }
    if (room.settings.timer === 0) {
      room.settings.timer = 60;
    }
  }
  update(room);
}

function getTimer(roomName) {
  const room = get(roomName);
  return room.settings.timer;
}

function setTimer(roomName, time) {
  const room = get(roomName);
  room.settings.timer = time;
  update(room);
}

function getRounds(roomName) {
  const room = get(roomName);
  return room.settings.rounds;
}

function setRounds(roomName, rounds) {
  const room = get(roomName);
  room.settings.rounds = rounds;
  update(room);
}

const updateScoreLimit = (roomName, newScoreLimit) => {
  const room = get(roomName);
  room.settings.scoreLimit = Number(newScoreLimit);
  updateGameEvent(roomName, "score-limit-updated");
  update(room);
};

const updateCategories = (roomName, updatedCategories) => {
  const room = get(roomName);
  room.settings.selectedCategories = updatedCategories;
  updateGameEvent(roomName, "categories-updated");
  update(room);
};

module.exports = {
  getMode,
  setGameMode,
  updateScoreLimit,
  updateCategories,
  getTimer,
  setTimer,
  getRounds,
  setRounds,
};
