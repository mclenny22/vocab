# Vocab

A minimal German vocabulary app made for Alex. Practice nouns and verbs through multiple-choice, typing, articles, and one conjugation at a time.

- Nouns, Verbs, and Mixed modes with separate saved sessions.
- A curated vocabulary list with regular and irregular verbs.
- Pronouns rotate through all six present-tense forms over time.
- Missed questions repeat with the same exercise and pronoun.
- Light and dark themes, mobile layouts, and progress saved in the browser.

## Run locally

No installation or build step is needed. From the repository root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory vocabulary-app/dist
```

Open [localhost:4173](http://127.0.0.1:4173/).

## Self-host

Serve the contents of `vocabulary-app/dist/` using any static web server. The app has no backend or external dependencies. Learning progress stays on each device.

## Vocabulary

The built-in list lives in `vocabulary-app/dist/deck.mjs`. Each noun has an English translation, German noun, and article. Each verb includes its infinitive and all six present-tense forms. The app has no manual word editor.

## Tests

With Node.js installed:

```sh
node --test vocabulary-app/tests/core.test.mjs
```

See [the app README](vocabulary-app/README.md) for implementation details.
