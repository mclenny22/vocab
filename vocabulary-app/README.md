# Deutsch — daily practice

A small German vocabulary app. The header's mode picker switches between **Nouns**, **Verbs**, and **Mixed**, each with its own saved daily session. The header and main card share the same width on desktop and mobile.

Nouns rotate **Choose → Type → Article** across 12 cards. Verbs rotate **Choose → Type → Conjugate** across 6 cards; each conjugation asks for **one** present-indicative form, such as **du ___** for **gehen**. The requested pronouns rotate through **ich, du, er/sie/es, wir, ihr, sie/Sie** across days and practice batches. Mixed sessions contain 12 cards, balanced between nouns and verbs. Every card uses a different word; multiple-choice distractors are of the same word type and come from outside the session to avoid giving away later answers. Missed cards repeat their original exercise at the end, preserving the exact pronoun on a missed conjugation.

The app includes a curated, built-in list of 36 nouns and 18 regular and irregular verbs. Maintain and expand this list in `dist/deck.mjs`; there is no manual vocabulary editor in the app. Each verb includes all six present-indicative forms, in this order: ich, du, er/sie/es, wir, ihr, sie/Sie. Verb practice currently covers the present tense.

Progress and partially typed conjugations stay in this browser's local storage. Existing saves migrate automatically, retaining progress and any legacy vocabulary. There are light and dark themes and German character buttons. The mode picker uses the dropdown and ghost hover styling from `_designreference`. The small, fixed dedication footer reads “Made with love for Alex, the love of my life. <3”. There is no account, server database, cross-device sync, or hosted deployment.

To self-host, serve the contents of `dist/` from any static web server. All assets are local, with no dependencies or build step.

## Run locally

From this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173 in Chrome. No installation or build step is needed.

## Tests

With Node.js available:

```sh
node --test tests/*.test.mjs
```

The pure session engine is in `dist/core.mjs`, vocabulary in `dist/deck.mjs`, and browser UI in `dist/app.mjs`. A new device-local day starts a fresh session while keeping theme preferences. Capitalization-only differences count as correct and show the canonical spelling. Missing articles and other spelling differences count as mistakes.

The UI uses the local `_designreference` neutral surfaces and lavender action styling, with larger touch targets and a focused card layout.
