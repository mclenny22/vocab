# Vocabulary sources and conventions

The active curriculum contains **1,286 words and phrases**: **687 nouns, 192 verbs, 127 adjectives, 60 adverbs, 89 phrases and 131 other terms**. There are **645 A1 essentials** and **641 A2 expansion entries**. A further **144 sentence exercises** cover 12 grammar topics, alongside the existing case and possessive decks. See [the curriculum](CURRICULUM.md) for sources, topic coverage and counts.

The topic expansion is independently authored and informed by Goethe vocabulary references and VHS course outlines. Its A1/A2 assignments are teaching decisions for this app, rather than an official certification or a claim to reproduce every Goethe exam headword. Translations, grammar sentences and explanations are authored for the app; source example sentences are not copied. The original 36 nouns and 18 verbs remain available with their IDs intact.

## Retained baseline: A2 selection

The retained baseline of 144 nouns and 113 verbs was checked against the official [Goethe-Zertifikat A2 word list](https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_A2_Wortliste.pdf), accessed on 30 October 2026, edition identifier `A2_Wortliste_04_050526`. The document includes both alphabetical headwords and thematic groups for occupations, family, dates, months, currency and numbers. Normalized entries include **Fahrrad** from **(Fahr)Rad**, **fahren** from **(ab)fahren**, and **E-Mail** from **(E-)Mail**.

Each baseline entry has reviewed admission evidence and a PDF page reference in `tests/fixtures/a2-admissions.json`. That file records only admission evidence for this app's selected words, rather than reproducing the source's sentences or complete word list. The original everyday starter words are retained; **Erdbeere** is the sole starter entry without a direct entry in this A2 reference and is retained as a familiar food word by editorial judgment. This is a selection of beginner vocabulary, not the complete A2 syllabus or an assertion that Alex has already encountered every entry.

The original frequency expansion used [Sketch Engine's German word lists](https://www.sketchengine.eu/german-word-list/) from German Web 2013. `frequencyRank`, where present, remains historical metadata. Frequency alone no longer qualifies an entry for practice. Examples removed by the A2 review include **Anspruch, Verfügung, Maßnahme, Zusammenhang, ermöglichen, veröffentlichen** and **durchführen**.

## Learning data

English translations, articles, present-tense forms and English cues are app-authored. A source-listed headword is used with a beginner-appropriate sense:

- **Bestehen** practices passing an exam, **schaffen** managing a task, **wählen** choosing or dialing, and **scheinen** shining.
- **Passieren** means happening and **kosten** costing; their previous passing-a-place and tasting cues were removed. These senses, **scheinen**, and **stattfinden** practice **es / It** and **sie / They**, avoiding personal subjects for events or prices.
- Reflexive senses use full infinitives and person-specific objects: **sich freuen**, **sich setzen**, **sich informieren**, **sich fühlen**, **sich erinnern**. Answers include phrases such as **freue mich**, **setzen uns**, and **erinnert euch**.
- Separable verbs retain their detached prefix: **biete an**, **stellt vor**, **stellen her**.
- Verbs store all six present-indicative forms in the order **ich, du, er/sie/es, wir, ihr, sie/Sie**, with explicit irregular forms and matching English cues.
- Nouns normally use the singular. **Eltern** and **Leute** use plural forms with **die**. **Der Jugendliche** uses the definite masculine adjectival form. Translations identify male personal nouns where useful.

Typed phrases accept omitted or changed final punctuation, optional commas/semicolons/colons between words, surrounding double quotation marks, and straight or curly apostrophes. Extra whitespace and capitalization differences are usually accepted. Punctuation within numbers, spelling, articles, word order and verb forms remain meaningful. Formal pronouns (**Sie/Ihnen**) and their informal counterparts require the meaningful capital or lowercase spelling. Sentence-choice exercises require the exact option. Alternative synonyms and conjugation variants are not automatically accepted. Previously saved typed-phrase mistakes that now qualify as correct are updated on reload, including their score and retry eligibility.

Some nouns are plural-only or commonly learned in the plural, such as **Eltern**, **Geschwister**, **Möbel** and **Ferien**. Plural formation is also practised explicitly in the Articles & plurals sentence deck. New verbs include explicit separable and reflexive forms, for example **lädst ein**, **bewirbst dich** and **zieht euch an**. **Rezept** is one shared headword with both recipe and prescription senses, tagged for food and health.

## Retained baseline language accuracy review — 31 October 2026

Reviewed the 144 noun entries, 113 present-tense verb paradigms and English cues, 128 possessive exercises, and 36 case sentences. The review covered articles, subject/pronoun agreement, reflexive objects, separable prefixes, case endings, and consistency between the English meaning and the German answer. No additional clear article, pronoun or declension errors were found after the possessive correction.

Six verb entries now use clearer English: **stellen** cues include “something” as the object; **schaffen** specifies accomplishing a task; **fehlen** uses personal cues about being absent; **fragen** specifies asking a question; **bitten** specifies asking for something; and **nennen** specifies calling by a name. German answers and word IDs are unchanged, so existing progress remains valid.

Ambiguous senses were checked against Duden's entries for [stellen](https://www.duden.de/rechtschreibung/stellen), [schaffen](https://www.duden.de/rechtschreibung/schaffen), [fehlen](https://www.duden.de/rechtschreibung/fehlen), [fragen](https://www.duden.de/rechtschreibung/fragen), [bitten](https://www.duden.de/rechtschreibung/bitten), and [nennen](https://www.duden.de/rechtschreibung/nennen). Possessive endings were cross-checked with the [University of Michigan grammar chart](https://sites.lsa.umich.edu/german-resources/grammatik/basic-chart/). **Sein** can mean either “his” or “its” depending on the referent; this app's family sentences use the intended human meaning, “his.” A noun's grammatical gender does not determine its owner's English pronoun.

## Saved progress

Original IDs and original learning data remain intact. Removed vocabulary is absent from new sessions and distractors. `dist/retired-vocabulary.mjs` contains only identifiers and old German answers needed for save migration; it is not a practice deck.

An existing session loses retired cards, retains answers for the remaining cards, and moves its current position accordingly. A draft survives if its current card remains. Retired distractors and outdated conjugation choices are regenerated from eligible vocabulary. Revised event senses discard old conjugation cards with unsuitable personal subjects. A session with no remaining cards restarts; other modes and preferences stay saved. The independent possessive and case exercise decks are unchanged by this vocabulary revision.


## Topic and level sessions

Everyday topics and the new grammar groups use independent sessions per level: `all`, `A1`, or `A2`. Existing unfiltered sessions keep their keys, answers, choices and drafts. A2 expansion is additional material, so combined A1–A2 remains the appropriate option for cumulative review. Legacy Cases and Possessives stay available as grammar review across filters; Possessives includes genitive material beyond the main A1–A2 sequence. Empty topic/level combinations offer a return to A1–A2. New rounds have at most 15 unique cards, capped by the pool size. A topic with too few alternatives for a word type uses typing rather than a one-answer choice.
