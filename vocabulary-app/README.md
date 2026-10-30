# Deutsch — daily practice

A small German vocabulary app. The header's mode picker switches between **Nouns**, **Verbs**, **Conjugations**, **Possessives**, **Cases**, and **Mixed**, each with its own saved daily session. The header and main card share the same width on desktop and mobile.

**Cases** has 36 tap-to-fill sentences covering **Akkusativ**, **Dativ**, and **both together**. Each full 15-question round contains five of each type, using masculine, feminine, neuter and plural nouns. Tap an article to fill the next gap, optionally tap an empty gap to select it, and tap a placed article to return it to the word bank. Identical article blocks are separate tokens. Check highlights incorrect gaps and leaves them editable; after correction, the sentence shows the dictionary and inflected noun forms. A mistake still counts toward the first-attempt score and includes that sentence in the retry round. Draft placements, mistakes, and bank order survive reloads and category switching. The sentence text stays compact, with no dragging or additional instructions. Data and interaction helpers live in `dist/cases.mjs`, and the UI lives in `dist/case-practice.mjs`.

All new full sessions contain 15 cards. Nouns rotate **Choose → Type → Article**. Verbs rotate **Choose → Type → Conjugate**, alternating typed and multiple-choice conjugations. Each asks for **one** present-indicative form. Choice cards show a German subject such as **ich ___**, a small English cue such as **I run**, and three distinct forms of the same verb. The dedicated **Conjugations** mode provides 15 of these choice cards, covering all six grammatical persons. Typed conjugations retain their infinitive prompt. Mixed sessions contain eight nouns and seven verbs. Both conjugation formats cover all six persons over time. Previously saved sessions keep their existing length and progress; retries contain only the missed words.

**Possessives** offers 144 sentence exercises for **mein, dein, sein, ihr, unser, euer, ihr (their), and Ihr (formal)**, including separate **his** and **its** cues for **sein**. Each 15-card round covers all nine owner meanings, all four cases (nominative, accusative, dative, genitive), and masculine, feminine, neuter and plural nouns. Alex chooses the missing possessive article in a short German sentence, using an English translation, an explicit owner cue and the noun's dictionary article. After answering, the complete sentence and an explanation show the stem, case and ending. Exercises include **euer → eure / euren / eurem / eurer / eures**, dative plural noun endings and genitive noun endings. Formal **Ihr** remains capitalized. This mode practices possessive articles before nouns; standalone forms such as **meins** are outside its scope. Its data lives in `dist/possessives.mjs`; the declension follows the [University of Wisconsin grammar table](https://wisc.pb.unizin.org/readinggerman/chapter/ein-words-possessive-pronouns/).

Each vocabulary card uses a different word; possessive cards use different owner/case/noun combinations. Translation distractors come from outside the session to avoid giving away later answers. Conjugation distractors come from the same verb, with duplicate forms removed so there is exactly one correct option. Missed cards repeat their original exercise at the end, preserving the exact pronoun on a missed conjugation and the exact sentence on a missed possessive.

The app includes a built-in list of 144 nouns and 113 regular and irregular verbs, narrowed to everyday vocabulary through A2 using Goethe-Institut's official A2 word list while retaining the original starter entries. See [vocabulary sources and conventions](VOCABULARY.md). Maintain and expand this list in `dist/deck.mjs`; there is no manual vocabulary editor in the app. Each verb includes all six present-indicative forms, in this order: ich, du, er/sie/es, wir, ihr, sie/Sie, plus six English cues in `englishForms`. Choice prompts normally use **er / He** for third-person singular and **sie / They** for third-person plural. Event and quantity senses restrict practice to **es / It** and **sie / They** using `practicePersons: [2, 5]` and `thirdPersonSubject: 'es'`. Separable prefixes and reflexive pronouns are part of the answer, such as **stellt her** and **freue mich**. Verb practice currently covers the present tense.

Progress and partially typed conjugations stay in this browser's local storage. Existing saves migrate automatically. The A2 revision removes retired vocabulary cards and replaces retired distractors, preserving answers and drafts for retained cards. If every card in a mode was retired, that mode starts a fresh session. Theme preferences and the other modes remain saved. There are light and dark themes and German character buttons. The mode picker uses the dropdown and ghost hover styling from `_designreference`. The small, fixed dedication footer reads “Made with love for Alex, the love of my life. <3”. There is no account, server database, cross-device sync, or hosted deployment.

Completing a session without a single mistake launches the blue confetti effect copied from the portfolio's 404 page. This also applies to a perfect retry session. Its particle constants, launch, physics, and drawing are preserved verbatim in `dist/confetti.mjs`, with a viewport overlay and app-specific frame scheduling. It pauses in hidden tabs, clears when practice resumes, and does not replay when reopening saved results.

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
