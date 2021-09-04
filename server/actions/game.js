var _ = require("lodash");
const { get, update, getEmojis } = require("./rooms");
const { updateGameEvent } = require("./event");
const Settings = require("./settings");
const Players = require("./players");

const { GAME_MODES } = require("../utils/constants");
const hintTimer = require("../utils/hint-timer");
const roundTimer = require("../utils/round-timer");

function filterEmojis(selectedCategories) {
  const emojis = getEmojis();
  let gameEmojiSets = [];
  let categories = [];
  Object.keys(selectedCategories).map((category) => {
    selectedCategories[category].include && categories.push(category);
  });
  categories.map((category) => {
    gameEmojiSets = [...gameEmojiSets, ...emojis.emojiSets[category]];
  });
  gameEmojiSets = _.shuffle(gameEmojiSets);
  return gameEmojiSets;
}

function start(roomName, io) {
  try {
    const room = get(roomName);
    const categorySelected = Object.values(
      room.settings.selectedCategories
    ).find((category) => category.include === true);
    if (!categorySelected) {
      throw new Error("Please include at least 1 category to start the game.");
    }
    const gameEmojiSets = filterEmojis(room.settings.selectedCategories);
    room.game = {
      emojiSets: gameEmojiSets,
      scoreLimit: room.settings.scoreLimit,
      lastEvent: { type: "start" },
      round: 0,
      top5: Object.values(room.players).slice(0, 5),
      chat: true,
    };
    const mode = room.settings.mode;
    nextEmojiSet(roomName, io);
    if (mode === GAME_MODES.PICTIONARY) {
      initialiseDrawers(roomName);
      nextDrawer(roomName);
    }
    update(room);
    return room.game;
  } catch (e) {
    throw e;
  }
}

function end(roomName) {
  const room = get(roomName);
  Players.resetPoints(roomName);
  Players.resetPass(roomName);
  if (Settings.getMode(roomName) === GAME_MODES.SKRIBBL) {
    Players.resetGuessed(roomName);
  }
  if (room.settings.mode === GAME_MODES.PICTIONARY) {
    Players.resetDrawer(roomName);
  }
  if (room) {
    room.game = null;
  }
  update(room);
}

function getWinners(roomName) {
  const room = get(roomName);
  const winners = Object.values(room.players)
    .sort((a, b) => {
      if (a.score > b.score) return -1;
      if (b.score > a.score) return 1;
      return 0;
    })
    .slice(0, 4);
  room.game.winners = winners;
  update(room);
  return winners;
}

function updateTimer(roomName, timeLeft) {
  try {
    const room = get(roomName);
    if (room.game) {
      room.game.timeLeft = timeLeft;
      update(room);
      return timeLeft;
    }
  } catch (e) {
    throw e;
  }
}

function makeHint(emojiSet) {
  if (!emojiSet.showLetters) {
    emojiSet.showLetters = [];
  }
  const answerLetters = Array.from(emojiSet.answer);
  const randomLetter = Math.floor(
    Math.random() * Math.floor(answerLetters.length)
  );
  !emojiSet.firstHint && emojiSet.showLetters.push(randomLetter);
  let hintLetters = [];
  answerLetters.map((letter, index) => {
    if (
      (emojiSet.showLetters.includes(index) && !emojiSet.firstHint) ||
      !/[a-z0-9]/gi.test(letter)
    ) {
      hintLetters.push(letter);
    } else {
      hintLetters.push("_");
    }
  });
  emojiSet.firstHint = false;
  emojiSet.hint = hintLetters.join("");
  return emojiSet;
}

function updateHint(roomName) {
  try {
    const room = get(roomName);
    if (room.game) {
      const emojiSet = room.game.currentEmojiSet;
      const hint = makeHint(emojiSet).hint;
      update(room);
      return hint;
    }
  } catch (e) {
    throw e;
  }
}

function nextEmojiSet(roomName, io) {
  Players.resetPass(roomName);
  if (Settings.getMode(roomName) === GAME_MODES.SKRIBBL) {
    Players.resetGuessed(roomName);
  }
  const room = get(roomName);
  const randomEmojiSet = room.game.emojiSets.pop();
  randomEmojiSet.firstHint = true;
  const emojiSet = makeHint(randomEmojiSet);

  if (room.game.currentEmojiSet) {
    room.game.previousEmojiSet = room.game.currentEmojiSet;
  } else {
    room.game.previousEmojiSet = {
      emojiSet: "",
      answer: "",
      hint: "",
      category: "",
    };
  }
  if (Settings.getMode(roomName) === GAME_MODES.PICTIONARY) {
    emojiSet.emojiSet = "";
  }
  if (Settings.getMode(roomName) === GAME_MODES.SKRIBBL) {
    room.game.round += 1;
    const leadingPlayer = Object.values(room.players).reduce((leader, player) =>
      leader.score > player.score ? leader : player
    );
    if (room.game.round > 1) {
      room.game.lastEvent = {
        ...leadingPlayer,
        type: "round-end",
      };
    }
    if (room.game.round > room.settings.rounds) {
      getWinners(roomName);
    }
  }
  room.game.currentEmojiSet = emojiSet;
  room.game &&
    roundTimer(roomName, emojiSet.answer, io, nextEmojiSet, updateTimer);
  room.game &&
    hintTimer(roomName, room.game.currentEmojiSet.answer, io, updateHint);
  update(room);
  return emojiSet;
}

function checkGuess(roomName, guess) {
  const ALPHA_NUM_REGEX = /[^a-zA-Z0-9]/g;
  try {
    let answer;
    let correct = false;
    const room = get(roomName);
    if (room.game) {
      answer = room.game.currentEmojiSet.answer;
      correct =
        guess.toLowerCase().replace(ALPHA_NUM_REGEX, "") ===
        answer.toLowerCase().replace(ALPHA_NUM_REGEX, "");
    }
    return correct;
  } catch (e) {
    throw e;
  }
}

// PICTIONARY ACTIONS

function nextRound(roomName) {
  const room = get(roomName);
  room.game.round += 1;
  initialiseDrawers(roomName);
  nextDrawer(roomName);
  update(room);
}

function initialiseDrawers(roomName) {
  const room = get(roomName);
  room.game.drawers = Object.keys(room.players);
  update(room);
}

function nextDrawer(roomName) {
  const room = get(roomName);
  const currentDrawer = room.game.drawer;
  if (currentDrawer) room.players[currentDrawer].drawer = false;
  const drawers = room.game.drawers;
  if (drawers.length > 0) {
    const nextDrawer = room.game.drawers.pop();
    room.game.drawer = nextDrawer;
    room.players[nextDrawer].drawer = true;
  } else {
    nextRound(roomName);
  }
  update(room);
}

function updateEmojiSet(roomName, emojiSet) {
  const room = get(roomName);
  updateGameEvent(roomName, "updateEmojiSet");
  room.game.currentEmojiSet.emojiSet = emojiSet;
  update(room);
}

function skipWord(roomName) {
  updateGameEvent(roomName, "skip word");
  nextEmojiSet(roomName);
}

module.exports = {
  start,
  end,
  nextEmojiSet,
  getWinners,
  updateHint,
  checkGuess,
  updateEmojiSet,
  nextDrawer,
  skipWord,
  updateTimer,
};
