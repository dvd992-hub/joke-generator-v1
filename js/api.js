/**
 * api.js
 * Handles calls to JokeAPI v2.
 *
 * JokeAPI is free, requires no API key, and has no CORS
 * restrictions: it works directly from the browser with
 * no proxy server needed.
 * Docs: https://jokeapi.dev/
 */


/* ── Configuration ──────────────────────────────────────────── */

/** Base API URL */
const API_BASE = "https://v2.jokeapi.dev/joke";

/**
 * Flags to always exclude, to keep content appropriate.
 * Possible values: nsfw, religious, political, racist, sexist, explicit
 */
const BLACKLIST = "racist,sexist,explicit";


/* ── Main function ──────────────────────────────────────────── */

/**
 * Fetches a random joke from the given category.
 *
 * @param {string} category - JokeAPI category (e.g. "Any", "Programming", "Pun")
 * @returns {Promise<Object>} Joke object with at least: type, category
 *   - If type === "twopart": { setup, delivery }
 *   - If type === "single":  { joke }
 * @throws {Error} On network failure or invalid response
 *
 * @example
 * const joke = await getJoke("Programming");
 * // { type: "twopart", setup: "Why...", delivery: "Because...", ... }
 */
async function getJoke(category) {
  const url = `${API_BASE}/${category}?blacklistFlags=${BLACKLIST}`;

  const response = await fetch(url);

  /* Check the HTTP response succeeded */
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();

  /* JokeAPI reports errors in the response's "error" field */
  if (data.error) {
    throw new Error(data.message || "Unknown API error");
  }

  return data;
}
