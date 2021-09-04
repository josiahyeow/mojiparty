const DEFAULT_SCORE_LIMIT = 10;
const DEFAULT_SELECTED_CATEGORIES = {
  general: { name: "General", icon: "💬", include: true, weight: 0 },
  foods: { name: "Food", icon: "🍽", include: false, weight: 1 },
  movies: { name: "Movies", icon: "🍿", include: false, weight: 2 },
  tv: { name: "TV Shows", icon: "📺", include: false, weight: 3 },
  music: { name: "Music", icon: "🎵", include: false, weight: 4 },
  places: { name: "Places", icon: "🌏", include: false, weight: 5 },
  brands: { name: "Brands", icon: "🛍", include: false, weight: 6 },
  anime: { name: "Anime", icon: "🇯🇵", include: false, weight: 7 },
  koreaboo: { name: "Koreaboo", icon: "🇰🇷", include: false, weight: 8 },
};
const DEFAULT_TIME_PER_ROUND = 0;
const DEFAULT_ROUNDS = 10;

const GAME_MODES = {
  CLASSIC: "classic",
  SKRIBBL: "skribbl",
  PICTIONARY: "pictionary",
};

module.exports = {
  DEFAULT_SCORE_LIMIT,
  DEFAULT_SELECTED_CATEGORIES,
  DEFAULT_TIME_PER_ROUND,
  DEFAULT_ROUNDS,
  GAME_MODES,
};
