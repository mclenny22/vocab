import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { starterNouns, starterVerbs, starterWords } from '../dist/deck.mjs';
import { APP_MODES, validWord, practicePersons, conjugationSubject, makeSession, readState, expectedAnswer, answerCard, advanceCard, cardChoices, checkAnswer } from '../dist/core.mjs';

const frequency = JSON.parse(readFileSync(new URL('./fixtures/frequency-lemmas.json', import.meta.url), 'utf8'));
const original = JSON.parse(readFileSync(new URL('./fixtures/original-deck.json', import.meta.url), 'utf8'));
const admissions = JSON.parse(readFileSync(new URL('./fixtures/a2-admissions.json', import.meta.url), 'utf8'));

test('the retained baseline has reviewed A2 admission evidence and excludes advanced frequency words', () => {
  const vocabulary = [...starterNouns, ...starterVerbs];
  assert.equal(starterNouns.length, 144);
  assert.equal(starterVerbs.length, 113);
  assert.equal(Object.keys(admissions.words).length, vocabulary.length);
  for (const word of vocabulary) {
    const evidence = admissions.words[word.id];
    assert.equal(evidence.lemma, word.noun ?? word.infinitive, word.id);
    if (!original.nouns.some(old => old.id === word.id) && !original.verbs.some(old => old.id === word.id)) {
      assert.ok(Number.isInteger(evidence.page) && evidence.page >= 5 && evidence.page <= 31, word.id);
    }
    if (word.frequencyRank) {
      const lemma = word.noun ?? word.infinitive.replace(/^sich /, '');
      assert.equal(frequency[word.noun ? 'nouns' : 'verbs'][word.frequencyRank - 1], lemma);
    }
  }
  for (const lemma of ['Anspruch', 'Verfügung', 'Maßnahme', 'Zusammenhang']) assert.ok(!starterNouns.some(word => word.noun === lemma));
  for (const lemma of ['ermöglichen', 'veröffentlichen', 'durchführen', 'sich eignen']) assert.ok(!starterVerbs.some(word => word.infinitive === lemma));
  assert.equal(new Set(starterWords.map(word => word.id)).size, starterWords.length);
  assert.equal(new Set(starterNouns.map(word => word.noun)).size, starterNouns.length);
  assert.equal(new Set(starterVerbs.map(word => word.infinitive)).size, starterVerbs.length);
  assert.ok(starterWords.every(validWord));
});

test('all original word IDs, translations, articles, forms and cues remain intact', () => {
  for (const old of [...original.nouns, ...original.verbs]) {
    const current = starterWords.find(word => word.id === old.id);
    assert.ok(current, old.id);
    const { frequencyRank, topics, level, ...withoutRank } = current;
    assert.deepEqual(withoutRank, old, old.id);
  }
});

test('a save from the original deck keeps progress, drafts and exact choices in every mode', () => {
  const legacyWords = [...original.nouns, ...original.verbs];
  const oldState = readState(null, legacyWords, '2026-10-30');
  oldState.theme = 'dark';
  const legacyModes = ['nouns', 'verbs', 'conjugations', 'mixed'];
  for (const mode of legacyModes) {
    oldState.appMode = mode;
    const card = oldState.session.cards[0];
    const word = legacyWords.find(word => word.id === card.wordId);
    oldState.session = advanceCard(answerCard(oldState.session, legacyWords, expectedAnswer(card, word)));
    oldState.session.draft = 'partly typed';
  }
  const restored = readState(JSON.stringify(oldState), starterWords, '2026-10-30');
  for (const mode of legacyModes) {
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
    ['herstellen', 2, 'stellt her', 'stellt'],
    ['sich freuen', 0, 'freue mich', 'freue'],
    ['sich fühlen', 3, 'fühlen uns', 'fühlen'],
    ['sich erinnern', 4, 'erinnert euch', 'erinnert']
  ]) {
    const word = starterVerbs.find(word => word.infinitive === infinitive);
    const card = { wordId: word.id, mode: 'conjugate', person };
    assert.equal(expectedAnswer(card, word), expected);
    assert.equal(checkAnswer(card, word, expected).correct, true);
    assert.equal(checkAnswer(card, word, partial).correct, false);
  }
});

test('event, weather and quantity senses practice es/sie, with matching cues, feedback and stable retries', () => {
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
  const word = starterVerbs.find(word => word.infinitive === 'stattfinden');
  for (const practicePersons of [[], [6], [-1], [2, 2], ['2'], 'third']) {
    assert.equal(validWord({ ...word, practicePersons }), false);
  }
  const state = readState(null, starterWords, '2026-10-30');
  state.appMode = 'conjugations';
  state.session.cards[0] = { wordId: word.id, mode: 'conjugate-choose', person: 0, choices: word.forms.slice(0, 3) };
  const restored = readState(JSON.stringify(state), starterWords, '2026-10-30');
  assert.notDeepEqual(restored.session.cards, state.session.cards);
});

test('narrowing to A2 removes retired cards and distractors while preserving retained progress', () => {
  const retired = [
    { id: 'noun-anspruch', english: 'the claim', noun: 'Anspruch', article: 'der' },
    { id: 'noun-verfügung', english: 'the decree', noun: 'Verfügung', article: 'die' }
  ];
  const state = readState(null, [...starterWords, ...retired], '2026-10-30');
  state.theme = 'dark';
  state.sessions.nouns = {
    day: '2026-10-30', batch: 2, index: 3, draft: 'old draft',
    cards: [
      { wordId: 'key', mode: 'choose', choices: ['der Schlüssel', 'die Verfügung', 'das Fenster'] },
      { wordId: 'noun-anspruch', mode: 'type' },
      { wordId: 'window', mode: 'type' },
      { wordId: 'noun-verfügung', mode: 'article' },
      { wordId: 'door', mode: 'type' }
    ],
    answers: [
      { wordId: 'key', given: 'der Schlüssel', correct: true, note: '' },
      { wordId: 'noun-anspruch', given: 'wrong', correct: false, note: 'der Anspruch' },
      { wordId: 'window', given: 'das Fenster', correct: true, note: '' }
    ]
  };
  const restored = readState(JSON.stringify(state), starterWords, '2026-10-30');
  assert.deepEqual(restored.sessions.nouns.cards.map(card => card.wordId), ['key', 'window', 'door']);
  assert.equal(restored.sessions.nouns.index, 2);
  assert.equal(restored.sessions.nouns.batch, 2);
  assert.equal(restored.sessions.nouns.draft, '');
  assert.deepEqual(restored.sessions.nouns.answers, [state.sessions.nouns.answers[0], state.sessions.nouns.answers[2]]);
  assert.ok(!restored.sessions.nouns.cards[0].choices.includes('die Verfügung'));
  assert.equal(restored.sessions.nouns.cards[0].choices.length, 3);
  assert.equal(restored.theme, 'dark');
  assert.deepEqual(restored.sessions.possessives, state.sessions.possessives);
  assert.deepEqual(restored.sessions.cases, state.sessions.cases);
  assert.deepEqual(readState(JSON.stringify(restored), starterWords, '2026-10-30'), restored);
  state.sessions.nouns.index = 2;
  state.sessions.nouns.answers = state.sessions.nouns.answers.slice(0, 2);
  state.sessions.nouns.draft = 'das Fen';
  const drafting = readState(JSON.stringify(state), starterWords, '2026-10-30');
  assert.equal(drafting.sessions.nouns.index, 1);
  assert.equal(drafting.sessions.nouns.draft, 'das Fen');
});

test('revised beginner senses replace outdated choices and avoid personal prompts for events', () => {
  const state = readState(null, starterWords, '2026-10-30');
  state.appMode = 'verbs';
  state.session = {
    day: '2026-10-30', batch: 0, index: 0, draft: '', answers: [],
    cards: [
      { wordId: 'verb-fühlen', mode: 'conjugate-choose', person: 0, choices: ['fühle', 'fühlst', 'fühlt'] },
      { wordId: 'verb-passieren', mode: 'conjugate', person: 0 },
      { wordId: 'verb-gehen', mode: 'choose', choices: ['gehen', 'setzen', 'schreiben'] }
    ]
  };
  const restored = readState(JSON.stringify(state), starterWords, '2026-10-30');
  assert.deepEqual(restored.session.cards.map(card => card.wordId), ['verb-fühlen', 'verb-gehen']);
  assert.ok(restored.session.cards[0].choices.includes('fühle mich'));
  assert.ok(!restored.session.cards[1].choices.includes('setzen'));
  assert.equal(starterVerbs.find(word => word.id === 'verb-passieren').english, 'to happen');
  assert.equal(starterVerbs.find(word => word.id === 'verb-kosten').english, 'to cost');
  assert.equal(starterVerbs.find(word => word.id === 'verb-erinnern').infinitive, 'sich erinnern');
});
