const DEFAULT_SCORE_LIMIT = 10;
const DEFAULT_SELECTED_CATEGORIES = {
  general: {
    name: "General",
    icon: "💬",
    include: true,
    weight: 0,
    community: false,
    author: null,
  },
  foods: {
    name: "Food",
    icon: "🍽",
    include: false,
    weight: 1,
    community: false,
    author: null,
  },
  movies: {
    name: "Movies",
    icon: "🍿",
    include: false,
    weight: 2,
    community: false,
    author: null,
  },
  tv: {
    name: "TV Shows",
    icon: "📺",
    include: false,
    weight: 3,
    community: false,
    author: null,
  },
  music: {
    name: "Music",
    icon: "🎵",
    include: false,
    weight: 4,
    community: false,
    author: null,
  },
  places: {
    name: "Places",
    icon: "🌏",
    include: false,
    weight: 5,
    community: false,
    author: null,
  },
  brands: {
    name: "Brands",
    icon: "🛍",
    include: false,
    weight: 6,
    community: false,
    author: null,
  },
  anime: {
    name: "Anime",
    icon: "🇯🇵",
    include: false,
    weight: 7,
    community: false,
    author: null,
  },
  koreaboo: {
    name: "Koreaboo",
    icon: "🇰🇷",
    include: false,
    weight: 8,
    community: false,
    author: null,
  },
  hariRaya: {
    name: "Kuih Hari Raya",
    icon: "🍪🕌",
    include: false,
    weight: 0,
    community: true,
    author: "AD",
  },
};
const DEFAULT_TIME_PER_ROUND = 0;
const DEFAULT_ROUNDS = 10;

enum GAME_MODE {
  CLASSIC = "classic",
  SKRIBBL = "skribbl",
  PICTIONARY = "pictionary",
}

const GAME_MODES = {
  CLASSIC: "classic",
  SKRIBBL: "skribbl",
  PICTIONARY: "pictionary",
};

export {
  DEFAULT_SCORE_LIMIT,
  DEFAULT_SELECTED_CATEGORIES,
  DEFAULT_TIME_PER_ROUND,
  DEFAULT_ROUNDS,
  GAME_MODE,
  GAME_MODES,
};
