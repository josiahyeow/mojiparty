const DEFAULT_SCORE_LIMIT = 10;
const DEFAULT_SELECTED_CATEGORIES = {
  general: { name: "General", icon: "💬", include: true },
  foods: { name: "Food", icon: "🍽", include: false },
  movies: { name: "Movies", icon: "🍿", include: false },
  tv: { name: "TV Shows", icon: "📺", include: false },
  songs: { name: "Music", icon: "🎵", include: false },
  places: { name: "Places", icon: "🌏", include: false },
  brands: { name: "Brands", icon: "🛍", include: false },
  anime: { name: "Anime", icon: "🇯🇵", include: false },
  koreaboo: { name: "Koreaboo", icon: "🇰🇷", include: false },
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
