# Vocabulary sources and conventions

The active vocabulary deck contains **144 nouns and 113 verbs** for everyday practice through **A2**. It retains the original 36 nouns and 18 verbs. The earlier expansion was narrowed by level rather than padded to reach 200 entries per word type.

## A2 selection

Additions are checked against the official [Goethe-Zertifikat A2 word list](https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_A2_Wortliste.pdf), accessed on 30 October 2026, edition identifier `A2_Wortliste_04_050526`. The document includes both alphabetical headwords and thematic groups for occupations, family, dates, months, currency and numbers. Normalized entries include **Fahrrad** from **(Fahr)Rad**, **fahren** from **(ab)fahren**, and **E-Mail** from **(E-)Mail**.

Every addition has a reviewed entry and a PDF page reference in `tests/fixtures/a2-admissions.json`. That file records only admission evidence for this app's selected words, rather than reproducing the source's sentences or complete word list. The original everyday starter words are retained; **Erdbeere** is the sole starter entry without a direct entry in this A2 reference and is retained as a familiar food word by editorial judgment. This is a selection of beginner vocabulary, not the complete A2 syllabus or an assertion that Alex has already encountered every entry.

The original frequency expansion used [Sketch Engine's German word lists](https://www.sketchengine.eu/german-word-list/) from German Web 2013. `frequencyRank`, where present, remains historical metadata. Frequency alone no longer qualifies an entry for practice. Examples removed by the A2 review include **Anspruch, Verfügung, Maßnahme, Zusammenhang, ermöglichen, veröffentlichen** and **durchführen**.

## Learning data

English translations, articles, present-tense forms and English cues are app-authored. A source-listed headword is used with a beginner-appropriate sense:

- **Bestehen** practices passing an exam, **schaffen** managing a task, **wählen** choosing or dialing, and **scheinen** shining.
- **Passieren** means happening and **kosten** costing; their previous passing-a-place and tasting cues were removed. These senses, **scheinen**, and **stattfinden** practice **es / It** and **sie / They**, avoiding personal subjects for events or prices.
- Reflexive senses use full infinitives and person-specific objects: **sich freuen**, **sich setzen**, **sich informieren**, **sich fühlen**, **sich erinnern**. Answers include phrases such as **freue mich**, **setzen uns**, and **erinnert euch**.
- Separable verbs retain their detached prefix: **biete an**, **stellt vor**, **stellen her**.
- Verbs store all six present-indicative forms in the order **ich, du, er/sie/es, wir, ihr, sie/Sie**, with explicit irregular forms and matching English cues.
- Nouns normally use the singular. **Eltern** and **Leute** use plural forms with **die**. **Der Jugendliche** uses the definite masculine adjectival form. Translations identify male personal nouns where useful.

Complete expected phrases are required. Capitalization differences are accepted; alternative synonyms and conjugation variants are not automatically accepted.

## Saved progress

Original IDs and original learning data remain intact. Removed vocabulary is absent from new sessions and distractors. `dist/retired-vocabulary.mjs` contains only identifiers and old German answers needed for save migration; it is not a practice deck.

An existing session loses retired cards, retains answers for the remaining cards, and moves its current position accordingly. A draft survives if its current card remains. Retired distractors and outdated conjugation choices are regenerated from eligible vocabulary. Revised event senses discard old conjugation cards with unsuitable personal subjects. A session with no remaining cards restarts; other modes and preferences stay saved. The independent possessive and case exercise decks are unchanged by this vocabulary revision.
