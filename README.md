# Vocab

A minimal German vocabulary app made for Alex. Practice nouns, verbs, and possessives through multiple-choice, typing, articles, and one conjugation at a time.

- Nouns, Verbs, Conjugations, Possessives, Cases, and Mixed modes with separate saved sessions.
- Cases mixes Akkusativ, Dativ, and combined sentences. Tap articles into gaps; tap a placed block to undo.
- Possessives covers every owner and all four cases, with sentence cues and explanations of the endings.
- Conjugation choices pair a German pronoun with an English sentence and three forms of the same verb.
- 1,286 words and phrases across 24 A1–A2 everyday topics, with level filters and search.
- 144 additional sentence exercises across 12 grammar topics, including plurals, past tenses and word order.
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

The deck is assembled in `vocabulary-app/dist/deck.mjs` from the retained baseline, the authored topic vocabulary in `curriculum.mjs`, and sentence exercises in `grammar.mjs`. Nouns include articles; verbs include all six present-tense forms. The selector offers A1 essentials, A2 expansion, or both, with independent progress for each topic and level. See the [curriculum and coverage](vocabulary-app/CURRICULUM.md) and [vocabulary sources and conventions](vocabulary-app/VOCABULARY.md).

## Tests

With Node.js installed:

```sh
node --test vocabulary-app/tests/*.test.mjs
```

See [the app README](vocabulary-app/README.md) for implementation details.
