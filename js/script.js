/**
 * script.js
 * Core logic for the Joke Generator.
 * Coordinates API calls, storage, and UI updates.
 */


/* ── State ──────────────────────────────────────────────────── */

let currentJoke = null;    // currently displayed joke
let favs        = [];      // favorites array
let count       = 0;       // jokes seen in this session
let selectedCat = "Any";   // selected category


/* ── Initialization ─────────────────────────────────────────── */

/** Loads favorites from localStorage on page load */
function init() {
  favs = loadFavs();
  updateFavBadge();
}


/* ── Category selection ─────────────────────────────────────── */

/**
 * Updates the selected category and pill styling.
 * @param {HTMLElement} el - The clicked category button
 */
function selectCat(el) {
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
  selectedCat = el.dataset.cat;
}


/* ── Tab navigation ─────────────────────────────────────────── */

/**
 * Shows the given panel and hides the other.
 * @param {"gen"|"fav"} tab - Tab to activate
 */
function switchTab(tab) {
  const isGen = tab === "gen";
  document.getElementById("view-gen").style.display = isGen ? "block" : "none";
  document.getElementById("view-fav").style.display = isGen ? "none"  : "block";
  document.getElementById("tab-gen").classList.toggle("active",  isGen);
  document.getElementById("tab-fav").classList.toggle("active", !isGen);
  if (!isGen) renderFavList();
}


/* ── Generate joke ──────────────────────────────────────────── */

/** Called when the user presses "Get a joke" */
async function fetchJoke() {
  /* Loading state */
  const btn = document.getElementById("btn-gen");
  btn.textContent = "Loading...";
  btn.disabled    = true;

  /* Hide action buttons while loading */
  document.getElementById("btn-save").style.display  = "none";
  document.getElementById("btn-share").style.display = "none";

  try {
    /* Call the API module (js/api.js) */
    const joke = await getJoke(selectedCat);

    /* Update state */
    currentJoke = joke;
    count++;

    /* Update the UI */
    renderJoke(joke);
    updateCounter();
    updateSaveBtn();

    /* Show action buttons */
    document.getElementById("btn-save").style.display  = "inline-block";
    document.getElementById("btn-share").style.display = "inline-block";

  } catch (err) {
    /* Show an error message inside the card */
    document.getElementById("joke-box").innerHTML =
      `<p class="placeholder">Oops, couldn't load a joke. Try again!</p>`;
  }

  /* Reset the button */
  btn.textContent = "Get another joke";
  btn.disabled    = false;
}


/* ── Joke rendering ─────────────────────────────────────────── */

/**
 * Inserts the joke into the card with a fade-in animation.
 * @param {Object} joke - Object returned by JokeAPI
 */
function renderJoke(joke) {
  const box = document.getElementById("joke-box");

  /* Remove and re-add the class to restart the CSS animation */
  box.className = "joke-box";
  void box.offsetWidth; /* force reflow */
  box.className = "joke-box fade-in";

  if (joke.type === "twopart") {
    /* Two-part joke: setup + punchline */
    box.innerHTML = `
      <p class="setup">${esc(joke.setup)}</p>
      <p class="punchline">${esc(joke.delivery)}</p>
    `;
  } else {
    /* Single-text joke */
    box.innerHTML = `<p class="single">${esc(joke.joke)}</p>`;
  }
}


/* ── Counter ────────────────────────────────────────────────── */

/** Updates the session joke counter text */
function updateCounter() {
  document.getElementById("counter").textContent =
    `${count} joke${count === 1 ? "" : "s"} read this session`;
}


/* ── Favorites badge ────────────────────────────────────────── */

/** Updates the count shown in the "Saved" tab */
function updateFavBadge() {
  document.getElementById("fav-count").textContent =
    favs.length > 0 ? `(${favs.length})` : "";
}


/* ── Save button ────────────────────────────────────────────── */

/** Updates the button's appearance based on saved state */
function updateSaveBtn() {
  const btn   = document.getElementById("btn-save");
  const saved = isFav(favs, currentJoke);
  btn.textContent = saved ? "❤️ Saved" : "🤍 Save";
  btn.classList.toggle("saved", saved);
}

/** Adds or removes the current joke from favorites */
function toggleSave() {
  if (!currentJoke) return;

  if (isFav(favs, currentJoke)) {
    favs = removeFav(favs, favs.findIndex(f => getKey(f) === getKey(currentJoke)));
  } else {
    favs = addFav(favs, currentJoke);
  }

  saveFavs(favs);
  updateFavBadge();
  updateSaveBtn();
}


/* ── Share ──────────────────────────────────────────────────── */

/** Shares the joke via the Web Share API or copies it to the clipboard */
async function shareJoke() {
  if (!currentJoke) return;

  const text = currentJoke.type === "twopart"
    ? `${currentJoke.setup}\n\n${currentJoke.delivery}`
    : currentJoke.joke;

  if (navigator.share) {
    /* Native share API (mostly mobile) */
    try { await navigator.share({ text }); } catch { /* cancelled */ }
  } else {
    /* Fallback: copy to clipboard */
    try {
      await navigator.clipboard.writeText(text);
      const btn = document.getElementById("btn-share");
      btn.textContent = "✅ Copied!";
      setTimeout(() => { btn.textContent = "📤 Share"; }, 2000);
    } catch {
      alert("Couldn't copy to clipboard.");
    }
  }
}


/* ── Favorites: list ────────────────────────────────────────── */

/** Renders the favorites list in the "Saved" panel */
function renderFavList() {
  const list  = document.getElementById("fav-list");
  const empty = document.getElementById("fav-empty");

  if (favs.length === 0) {
    list.innerHTML      = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  list.innerHTML = favs.map((j, i) => {
    const text = j.type === "twopart"
      ? `<strong>${esc(j.setup)}</strong><br><em>${esc(j.delivery)}</em>`
      : esc(j.joke);
    return `
      <div class="fav-item">
        <div class="fav-text">${text}</div>
        <button class="fav-del" onclick="deleteFromFavs(${i})" aria-label="Remove">✕</button>
      </div>`;
  }).join("");
}

/**
 * Removes a favorite by index and refreshes the list.
 * @param {number} i - Index in the favs array
 */
function deleteFromFavs(i) {
  favs = removeFav(favs, i);
  saveFavs(favs);
  updateFavBadge();
  renderFavList();
}


/* ── Utility ────────────────────────────────────────────────── */

/**
 * Escapes special HTML characters to prevent XSS.
 * Used whenever external text is inserted into the DOM.
 *
 * @param {string} s - String to escape
 * @returns {string}
 */
function esc(s) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


/* ── Startup ────────────────────────────────────────────────── */

init();
