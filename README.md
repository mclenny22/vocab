# Vocab

A minimal German vocabulary app made for Alex. Practice nouns, verbs, and possessives through multiple-choice, typing, articles, and one conjugation at a time.

- Nouns, Verbs, Conjugations, Possessives, Cases, and Mixed modes with separate saved sessions.
- Cases mixes Akkusativ, Dativ, and combined sentences. Tap articles into gaps; tap a placed block to undo.
- Possessives covers every owner and all four cases, with sentence cues and explanations of the endings.
- Conjugation choices pair a German pronoun with an English sentence and three forms of the same verb.
- 144 nouns and 113 verbs, limited to everyday vocabulary through A2.
- Pronouns rotate through all six present-tense forms over time.
- Missed questions repeat with the same exercise and pronoun.
- Light and dark themes, mobile layouts, and progress saved in the browser.
- **My topics**: record a recap of up to two minutes (or type it) to prepare a personal 20-step German lesson.
- Recent topics keep the latest lesson and unfinished progress on this device. Practising a topic set again creates new questions and replaces its previous test.

## Run locally

With Node.js 22.9 or newer, add your OpenAI key to the root `.env` file (already ignored by Git):

```env
OPENAI_API_KEY=your-key-here
```

From the repository root, run:

```sh
npm start
```

Open [localhost:4173](http://127.0.0.1:4173/). No package installation or frontend build is required. Restart the server after changing `.env`.

## Self-host

The built-in practice modes still work from any static web server serving `vocabulary-app/dist/`. **My topics requires the backend**, which keeps the OpenAI key on the server. `npm start` serves both locally; for a self-managed server, run it behind an HTTPS reverse proxy (the Node server binds to `127.0.0.1`, port `4173`, or `PORT`). Browsers require HTTPS or localhost for microphone access.

For Vercel, use this repository root as the project root, Framework Preset **Other**, and the included `vercel.json`. Add `OPENAI_API_KEY` and a private `TOPICS_PASSPHRASE` as **Secret** environment variables in Vercel, then deploy. Alex enters the practice passphrase once per tab session. The local `.env` is not uploaded to GitHub and does not configure Vercel automatically. Production/preview deployments refuse generation until both variables are configured. If self-hosting publicly, set `TOPICS_PASSPHRASE` there too.

Optional server settings are listed in `.env.example`: `OPENAI_LESSON_MODEL` defaults to `gpt-6-luna`, and `OPENAI_TRANSCRIPTION_MODEL` to `gpt-4o-mini-transcribe`. Use model IDs available to your API project. The API limits recording/body size, input/output length and concurrent requests, with a per-instance burst guard; this guard is not a distributed quota or a hard billing cap.

Only the topic description, generated questions, and progress are kept in browser local storage. Audio is held in memory while composing and discarded when leaving or starting the lesson. Sending a recording uploads it to OpenAI for transcription; the transcript is then used to generate questions. Text generation uses `store: false`. OpenAI's own API data retention policies still apply. The recent-topics list holds at most 12 topic sets and has individual delete controls; there is no account or cross-device sync.

## Vocabulary

The built-in list lives in `vocabulary-app/dist/deck.mjs`. Each noun has an English translation, German noun, and article. Each verb includes its infinitive and all six present-tense forms. The expansion is filtered against Goethe-Institut's A2 word list, retaining the original everyday starter words. See [vocabulary sources and conventions](vocabulary-app/VOCABULARY.md). The app has no manual word editor.

## Tests

With Node.js installed:

```sh
npm test
```

See [the app README](vocabulary-app/README.md) for implementation details.
