# Vocabulary sources and conventions

The deck contains **222 nouns and 204 verbs**. It combines the original 36 nouns and 18 verbs with frequency-based additions. All original IDs, translations, articles, conjugations and English cues are preserved so existing saved sessions remain valid.

## Frequency source

Selection uses [Sketch Engine's German word lists](https://www.sketchengine.eu/german-word-list/), downloaded on 30 October 2026:

- [Top 200 noun lemmas](https://www.sketchengine.eu/wp-content/uploads/word-list/german/german-word-list-nouns.csv)
- [Top 200 verb lemmas](https://www.sketchengine.eu/wp-content/uploads/word-list/german/german-word-list-verbs.csv)

The files identify their corpus as **German Web 2013** (deTenTen13). These are lemmatized lists: inflected forms contribute to the frequency of a single dictionary headword. This is a ranking from a web-text corpus, not a universal ranking of spoken German. Different corpora produce different orders.

All 200 verb lemmas are represented. The noun additions include 191 of the source's top 200 entries. The nine excluded proper names or abbreviations are **Deutschland, Berlin, Dr, Europa, Google, GmbH, München, Schweiz, Hamburg**. Most do not fit article practice for common nouns. Keeping the original everyday vocabulary brings the totals above 200 in each category.

`frequencyRank` records the original rank within the noun or verb list. Original words outside the top 200 have no rank. Entries retain their original order and append additions in source order; sessions continue to shuffle eligible words. The source lemmas are preserved in `tests/fixtures/frequency-lemmas.json` for coverage checks.

## Learning data

The frequency lists supply selection and rank. English translations, noun articles, present-tense forms and English conjugation cues were added for this app. They represent a selected common sense, rather than every meaning or valid spelling variant.

- Nouns normally use the singular. **Eltern, Kosten, Leute** use their usual plural forms and the plural article **die**. **Der Jugendliche** is an adjectival noun in its definite masculine form. Translations identify male personal nouns where useful.
- Verbs store all six present-indicative forms in the order **ich, du, er/sie/es, wir, ihr, sie/Sie**. Stem changes, umlauts, inserted **e**, and modal irregularities are explicit.
- Separable verbs include the detached prefix in the answer: **ich biete an**, **du nimmst auf**, **er stellt her**.
- Reflexive senses use the full infinitive **sich freuen**, **sich befinden**, **sich eignen**, and person-specific reflexive objects in their answers: **freue mich**, **befindest dich**, **eignen uns**.
- The selected senses of **gelten, erfolgen, gelingen, betragen, geschehen, stattfinden** practice only third-person singular and plural. Their singular subject is **es**, paired with **It**, so prompts refer to rules, events or quantities. Other verbs continue to rotate through all six persons.
- Reference checks for less familiar forms and usage include [Duden: geschehen](https://www.duden.de/rechtschreibung/geschehen), [PONS: gelten](https://de.pons.com/%C3%BCbersetzung/deutsche-rechtschreibung/gelten), and [PONS: Teil](https://de.pons.com/%C3%BCbersetzung/deutsche-rechtschreibung/Teil).

The app's existing spelling rules still apply: complete expected phrases are required, capitalization differences are accepted, and alternative synonyms or conjugation variants are not automatically accepted.
