# Moonim's portfolio

A static portfolio built with HTML, CSS, and JavaScript. No build step or package installation is required.

## Preview

Serve this directory with any static web server. For example, if Python is installed:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. An HTTP server is needed for the optional lyric files; the main page also works when opened directly.

## Edit

- `index.html`: content, links, and page structure.
- `assets/site.css`: colors, layouts, and responsive styles.
- `assets/site.js`: music selection, lyric synchronization, and the terminal demo.
- `assets/EASTER/`: existing music and lyric files. Audio loads only when played.

The page uses system fonts and local styling. Credly badge images are loaded from their existing external URLs. Core content remains visible without JavaScript; JavaScript enables track selection and the optional terminal.

## Deploy

Upload this directory to a static host such as Cloudflare Pages. No build command is needed; publish the repository root. Set absolute social-preview image URLs in `index.html` after choosing the production domain.

## Quick verification

```sh
node --check assets/site.js
```

Check narrow and desktop layouts, keyboard focus, music track switching, and terminal commands (`help`, `whoami`, `clear`, `exit`). Unknown commands should display an error, and typed HTML should appear as plain text.
