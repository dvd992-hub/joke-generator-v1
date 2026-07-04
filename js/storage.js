/**
 * storage.js
 * Handles saving favorites to localStorage.
 * Favorites persist across different sessions.
 */


/* ── Constants ──────────────────────────────────────────────── */

/** Key used in localStorage */
const STORAGE_KEY = "joke_favs";


/* ── Load / Save ────────────────────────────────────────────── */

/**
 * Loads favorites from localStorage.
 * Returns an empty array on error or corrupted data.
 *
 * @returns {Array} Array of joke objects
 */
function loadFavs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

/**
 * Saves favorites to localStorage.
 *
 * @param {Array} favs - Array of joke objects
 */
function saveFavs(favs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}


/* ── Favorites operations ───────────────────────────────────── */

/**
 * Checks whether a joke is already in favorites.
 * Comparison uses the joke's main text as a unique key.
 *
 * @param {Array}  favs - Current favorites array
 * @param {Object} joke - Joke to look up
 * @returns {boolean}
 */
function isFav(favs, joke) {
  const key = getKey(joke);
  return favs.some(f => getKey(f) === key);
}

/**
 * Adds a joke to favorites (if not already present).
 *
 * @param {Array}  favs - Current array
 * @param {Object} joke - Joke to add
 * @returns {Array} Updated array
 */
function addFav(favs, joke) {
  if (isFav(favs, joke)) return favs;
  return [...favs, { ...joke }];
}

/**
 * Removes a joke from favorites by index.
 *
 * @param {Array}  favs  - Current array
 * @param {number} index - Index to remove
 * @returns {Array} Updated array
 */
function removeFav(favs, index) {
  return favs.filter((_, i) => i !== index);
}


/* ── Utility ────────────────────────────────────────────────── */

/**
 * Extracts a joke's main text as a unique key.
 *
 * @param {Object} joke
 * @returns {string}
 */
function getKey(joke) {
  return joke.type === "twopart" ? joke.setup : joke.joke;
}
