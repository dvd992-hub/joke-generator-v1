# Joke Generator

A colorful, lighthearted random joke generator built with vanilla HTML, CSS, and JavaScript.
Pulls jokes from the free JokeAPI — no backend, no API key, no build step.

---

## Project structure

```
joke-generator/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── api.js        # JokeAPI calls
│   ├── storage.js     # Favorites persistence (localStorage)
│   └── script.js       # App state, UI rendering, event handlers
└── assets/
    └── favicon/
        ├── favicon.svg
        ├── favicon.ico
        └── generate_favicon.py
```

---

## Features

| Feature | Description |
|---|---|
| **Random jokes** | Pulled live from [JokeAPI](https://jokeapi.dev/) |
| **6 categories** | Any · Programming · Puns · Misc · Spooky · Christmas |
| **Two formats** | Setup + punchline, or single-text jokes |
| **Favorites** | Save jokes with a heart button; persisted across sessions |
| **Saved tab** | Browse and delete saved jokes |
| **Share** | Web Share API on mobile, clipboard copy on desktop |
| **Session counter** | Tracks how many jokes you've seen |
| **Responsive** | Adapts to mobile and desktop |
| **Content filtering** | Excludes racist, sexist, and explicit jokes by default |

---

## How it works

```
User clicks "Get a joke"
        │
        ▼
script.js → fetchJoke()
        │
        ▼
api.js → getJoke(category)
  │   Calls JokeAPI with the selected category
  │   Filters out inappropriate content
  │   Validates the response
        │
        ▼
script.js → renderJoke(joke)
  │   Renders setup + punchline, or single text
  │   Plays a fade-in animation
```

The three JavaScript files are independent and communicate only through
globally exposed functions — no bundler required.

---

## Running locally

No installation needed. Open `index.html` directly in any modern browser
(double-click, or right-click → Open with → your browser).

The app calls JokeAPI directly from the browser; since JokeAPI supports CORS,
there are no network restrictions to work around.

> If you're using a local dev server (e.g. VS Code's Live Server), that
> works too — it's entirely optional for this project.

---

## Customization

### Adding a category

1. **`index.html`** — add a button inside `.categories`:

```html
<button class="cat-btn" data-cat="CategoryName" onclick="selectCat(this)">
  🎯 Label
</button>
```

The `data-cat` value must match a [JokeAPI category](https://jokeapi.dev/#categories-endpoint):
`Any`, `Programming`, `Misc`, `Pun`, `Spooky`, `Christmas`.

### Changing the color theme

All colors live in `css/style.css` as direct hex values. The main gradient
(orange → pink → purple) is defined in `.title`, `.btn-generate`, and
`body`'s `background`.

### Regenerating the favicon

```bash
cd assets/favicon
python3 generate_favicon.py
```

Requires Pillow: `pip install Pillow`

---

## Browser compatibility

| Browser | Support |
|---|---|
| Chrome / Edge 90+ | Full |
| Firefox 88+ | Full |
| Safari 14+ | Full |
| Mobile (iOS/Android) | Full, including Web Share API |

---

## Roadmap

- Italian-language jokes (currently English-only via JokeAPI)
- Possible hybrid i18n (interface translation), pending the above

---

## License

Demo project. Uses the free [JokeAPI](https://jokeapi.dev/), which has no
authentication or usage key requirements.
