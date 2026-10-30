import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { starterNouns, starterVerbs, starterWords } from '../dist/deck.mjs';
import { APP_MODES, validWord, practicePersons, conjugationSubject, makeSession, readState, expectedAnswer, answerCard, advanceCard, cardChoices, checkAnswer } from '../dist/core.mjs';

const frequency = JSON.parse(readFileSync(new URL('./fixtures/frequency-lemmas.json', import.meta.url), 'utf8'));
const original = JSON.parse(readFileSync(new URL('./fixtures/original-deck.json', import.meta.url), 'utf8'));
const excludedNouns = ['Deutschland', 'Berlin', 'Dr', 'Europa', 'Google', 'GmbH', 'München', 'Schweiz', 'Hamburg'];

test('the deck covers the source top 200 verbs and all common nouns in its top 200', () => {
  assert.equal(frequency.nouns.length, 200);
  assert.equal(frequency.verbs.length, 200);
  for (const [index, lemma] of frequency.nouns.entries()) {
    if (excludedNouns.includes(lemma)) continue;
    const word = starterNouns.find(word => word.noun === lemma);
    assert.ok(word, lemma);
    assert.equal(word.frequencyRank, index + 1, lemma);
  }
  for (const [index, lemma] of frequency.verbs.entries()) {
    const word = starterVerbs.find(word => word.infinitive.replace(/^sich /, '') === lemma);
    assert.ok(word, lemma);
    assert.equal(word.frequencyRank, index + 1, lemma);
  }
  assert.equal(starterNouns.length, 222);
  assert.equal(starterVerbs.length, 204);
  assert.equal(new Set(starterWords.map(word => word.id)).size, starterWords.length);
  assert.equal(new Set(starterNouns.map(word => word.noun)).size, starterNouns.length);
  assert.equal(new Set(starterVerbs.map(word => word.infinitive)).size, starterVerbs.length);
  assert.ok(starterWords.every(validWord));
});

test('all original word IDs, translations, articles, forms and cues remain intact', () => {
  for (const old of [...original.nouns, ...original.verbs]) {
    const current = starterWords.find(word => word.id === old.id);
    assert.ok(current, old.id);
    const { frequencyRank, ...withoutRank } = current;
    assert.deepEqual(withoutRank, old, old.id);
  }
});

test('a save from the original deck keeps progress, drafts and exact choices in every mode', () => {
  const legacyWords = [...original.nouns, ...original.verbs];
  const oldState = readState(null, legacyWords, '2026-10-30');
  oldState.theme = 'dark';
  for (const mode of APP_MODES.filter(mode => mode !== 'possessives')) {
    oldState.appMode = mode;
    const card = oldState.session.cards[0];
    const word = legacyWords.find(word => word.id === card.wordId);
    oldState.session = advanceCard(answerCard(oldState.session, legacyWords, expectedAnswer(card, word)));
    oldState.session.draft = 'partly typed';
  }
  const restored = readState(JSON.stringify(oldState), starterWords, '2026-10-30');
  for (const mode of APP_MODES.filter(mode => mode !== 'possessives')) {
    assert.deepEqual(restored.sessions[mode], oldState.sessions[mode]);
  }
  assert.equal(restored.theme, oldState.theme);
  assert.equal(restored.appMode, oldState.appMode);
  assert.deepEqual(restored.customWords, oldState.customWords);
  assert.equal(restored.sessions.possessives.cards.length, 15);
  assert.equal(restored.sessions.nouns.cards.length, 15);
});

test('separable and reflexive verbs require their complete phrase', () => {
  for (const [infinitive, person, expected, partial] of [
    ['anbieten', 1, 'bietest an', 'bietest'],
    ['aufnehmen', 2, 'nimmt auf', 'nimmt'],
    ['sich freuen', 0, 'freue mich', 'freue'],
    ['sich befinden', 3, 'befinden uns', 'befinden'],
    ['sich eignen', 4, 'eignet euch', 'eignet']
  ]) {
    const word = starterVerbs.find(word => word.infinitive === infinitive);
    const card = { wordId: word.id, mode: 'conjugate', person };
    assert.equal(expectedAnswer(card, word), expected);
    assert.equal(checkAnswer(card, word, expected).correct, true);
    assert.equal(checkAnswer(card, word, partial).correct, false);
  }
});

test('event and quantity senses practice es/sie, with matching cues, feedback and stable retries', () => {
  for (const word of starterVerbs.filter(word => word.practicePersons)) {
    assert.deepEqual(practicePersons(word), [2, 5]);
    assert.ok(word.englishForms[2].startsWith('It '));
    assert.ok(word.englishForms[5].startsWith('They '));
    const seen = new Set();
    for (let batch = 0; batch < 6; batch++) {
      for (const appMode of ['verbs', 'conjugations']) {
        const session = makeSession(starterWords, { day: '2026-10-30', batch, appMode, ids: [word.id], modeOffset: 2 });
        const card = session.cards[0];
        assert.ok([2, 5].includes(card.person), word.infinitive);
        seen.add(card.person);
        assert.equal(conjugationSubject(card, word), card.person === 2 ? 'es' : appMode === 'conjugations' || card.mode === 'conjugate-choose' ? 'sie' : 'sie / Sie');
        assert.equal(checkAnswer(card, word, 'wrong').note, `${conjugationSubject(card, word)} ${word.forms[card.person]}`);
        if (card.mode === 'conjugate-choose') assert.equal(cardChoices(card, starterWords, session).length, 3);
        const retry = makeSession(starterWords, {
          day: session.day, batch: batch + 1, appMode, ids: [word.id],
          retryModes: { [word.id]: card.mode }, retryPersons: { [word.id]: card.person }
        });
        assert.equal(retry.cards[0].person, card.person);
        assert.equal(retry.cards[0].mode, card.mode);
      }
    }
    assert.deepEqual([...seen].sort(), [2, 5]);
  }
});

test('invalid person restrictions cannot enter the saved vocabulary', () => {
  const word = starterVerbs.find(word => word.infinitive === 'geschehen');
  for (const practicePersons of [[], [6], [-1], [2, 2], ['2'], 'third']) {
    assert.equal(validWord({ ...word, practicePersons }), false);
  }
  const state = readState(null, starterWords, '2026-10-30');
  state.appMode = 'conjugations';
  state.session.cards[0] = { wordId: word.id, mode: 'conjugate-choose', person: 0, choices: word.forms.slice(0, 3) };
  const restored = readState(JSON.stringify(state), starterWords, '2026-10-30');
  assert.notDeepEqual(restored.session.cards, state.session.cards);
});
