# OG-MooMoo.io

Mod stuck in 2026-05, by wealthydev and blisma.

A custom MooMoo.io client with a small backend attached.

The frontend is a modded game client (bundled from `bundle/src/js`) served as a static
sandbox page. The backend is a Bun server that adds a few extras on top of the game:

- an AI chat bot (Groq / Ollama) that replies in game chat
- a `/play` music command with YouTube lookup and synced lyrics
- a shared chat + private messaging relay between connected clients
- a neural-net movement AI (`ai.ts`) trained from logged gameplay frames (`train.ts`) (AI WAS NOT IMPLEMENTED)

## Requirements

- [Bun](https://bun.sh)
- API keys in a `.env` file:

```
GROQ_API_KEY=...
YOUTUBE_KEY=...
YOUTUBE_KEY_2=...
OLLAMA_API_KEY=...
GEMINI_API_KEY=...
```

## Setup

```bash
bun install
```

## Running

```bash
bun run build     # bundle the client into public/bundle.js
bun run index.ts  # start the server
```

Or in one go, with auto-rebuild on changes:

```bash
bun run start
```

Then open **http://localhost:3030/sandbox**.

## Training the AI

Gameplay frames are logged to `data/`. To retrain the model:

```bash
bun run train.ts
```

This writes a new `model.json`, which the server picks up for the `/ai` endpoint.
If no model is present, the bot falls back to built-in heuristics.

## License

[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) — see [LICENSE](LICENSE).
Free to use, share and modify for non-commercial purposes, with attribution.
