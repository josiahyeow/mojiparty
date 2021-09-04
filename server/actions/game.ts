import { shuffle } from "lodash";
import { get, update, getEmojis, Categories, EmojiSet } from "./rooms";
import { updateGameEvent } from "./event";
import * as Settings from "./settings";
import * as Players from "./players";

import { GAME_MODE } from "../utils/constants";
import { hintTimer } from "../utils/hint-timer";
import { roundTimer } from "../utils/round-timer";
import { Server } from "socket.io";

function filterEmojis(selectedCategories: Categories) {
  const emojis = getEmojis();
  let gameEmojiSets: any = [];
  let categories: string[] = [];
  Object.keys(selectedCategories).map((category) => {
    selectedCategories[category as keyof Categories].include &&
      categories.push(category as keyof Categories);
  });
  categories.map((category) => {
    gameEmojiSets = [
      ...gameEmojiSets,
      ...emojis.emojiSets[category as keyof Categories],
    ];
  });
  gameEmojiSets = shuffle(gameEmojiSets);
  return gameEmojiSets;
}

function start(roomName: string, io: Server) {
  try {
    const room = get(roomName);
    if (!room) return;
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
      currentEmojiSet: null,
      previousEmojiSet: null,
      timeLeft: -1,
      winners: null,
      drawer: "",
      drawers: [],
    };
    const mode = room.settings.mode;
    nextEmojiSet(roomName, io);
    if (mode === GAME_MODE.PICTIONARY) {
      initialiseDrawers(roomName);
      nextDrawer(roomName);
    }
    update(room);
    return room.game;
  } catch (e) {
    throw e;
  }
}

function end(roomName: string) {
  const room = get(roomName);
  if (!room) return;
  Players.resetPoints(roomName);
  Players.resetPass(roomName);
  if (Settings.getMode(roomName) === GAME_MODE.SKRIBBL) {
    Players.resetGuessed(roomName);
  }
  if (room.settings.mode === GAME_MODE.PICTIONARY) {
    Players.resetDrawer(roomName);
  }
  if (room) {
    room.game = null;
  }
  update(room);
}

function getWinners(roomName: string) {
  const room = get(roomName);
  if (!room?.game) return;
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

function updateTimer(roomName: string, timeLeft: number) {
  try {
    const room = get(roomName);
    if (!room?.game) return;

    if (room.game) {
      room.game.timeLeft = timeLeft;
      update(room);
      return timeLeft;
    }
  } catch (e) {
    throw e;
  }
}

function makeHint(emojiSet: EmojiSet) {
  if (!emojiSet.showLetters) {
    emojiSet.showLetters = [];
  }
  const answerLetters = Array.from(emojiSet.answer);
  const randomLetter = Math.floor(
    Math.random() * Math.floor(answerLetters.length)
  );
  !emojiSet.firstHint && emojiSet.showLetters.push(randomLetter);
  let hintLetters: string[] = [];
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

function updateHint(roomName: string) {
  try {
    const room = get(roomName);
    if (!room?.game) return;
    const emojiSet = room.game.currentEmojiSet;
    if (!emojiSet) return;
    const hint = makeHint(emojiSet).hint;
    update(room);
    return hint;
  } catch (e) {
    throw e;
  }
}

function nextEmojiSet(roomName: string, io: Server) {
  Players.resetPass(roomName);
  if (Settings.getMode(roomName) === GAME_MODE.SKRIBBL) {
    Players.resetGuessed(roomName);
  }
  const room = get(roomName);
  if (!room?.game) return;
  const randomEmojiSet = room.game.emojiSets.pop();
  if (!randomEmojiSet) return;
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
      showLetters: [],
      firstHint: false,
    };
  }
  if (Settings.getMode(roomName) === GAME_MODE.PICTIONARY) {
    emojiSet.emojiSet = "";
  }
  if (Settings.getMode(roomName) === GAME_MODE.SKRIBBL) {
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

function checkGuess(roomName: string, guess: string) {
  const ALPHA_NUM_REGEX = /[^a-zA-Z0-9]/g;
  try {
    let answer;
    let correct = false;
    const room = get(roomName);
    if (!room?.game || !room?.game.currentEmojiSet) return;
    answer = room.game.currentEmojiSet.answer;
    correct =
      guess.toLowerCase().replace(ALPHA_NUM_REGEX, "") ===
      answer.toLowerCase().replace(ALPHA_NUM_REGEX, "");
    return correct;
  } catch (e) {
    throw e;
  }
}

// PICTIONARY ACTIONS

function nextRound(roomName: string) {
  const room = get(roomName);
  if (!room?.game) return;
  room.game.round += 1;
  initialiseDrawers(roomName);
  nextDrawer(roomName);
  update(room);
}

function initialiseDrawers(roomName: string) {
  const room = get(roomName);
  if (!room?.game?.drawer) return;
  room.game.drawers = Object.keys(room.players);
  update(room);
}

function nextDrawer(roomName: string) {
  const room = get(roomName);
  if (!room?.game) return;
  const currentDrawer = room.game.drawer;
  if (currentDrawer) room.players[currentDrawer].drawer = false;
  const drawers = room.game.drawers;
  if (drawers.length > 0) {
    const nextDrawer = room.game.drawers.pop();
    if (!nextDrawer) return;
    room.game.drawer = nextDrawer;
    room.players[nextDrawer].drawer = true;
  } else {
    nextRound(roomName);
  }
  update(room);
}

function updateEmojiSet(roomName: string, emojiSet: any) {
  const room = get(roomName);
  if (!room?.game || !room?.game.currentEmojiSet) return;

  updateGameEvent(roomName, "updateEmojiSet");
  room.game.currentEmojiSet.emojiSet = emojiSet;
  update(room);
}

function skipWord(roomName: string, io: Server) {
  updateGameEvent(roomName, "skip word");
  nextEmojiSet(roomName, io);
}

export {
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
