import test from 'node:test';
import assert from 'node:assert/strict';
import { starterWords, caseWords } from '../dist/deck.mjs';
import { CASE_GROUPS, caseSentence, readCaseDraft, placeCaseToken, removeCaseToken } from '../dist/cases.mjs';
import { APP_MODES, isCase, validWord, wordsForMode, translation, makeSession, answerCard, advanceCard, missedWords, readState } from '../dist/core.mjs';

const day = '2026-10-30';
const wordFor = card => caseWords.find(word => word.id === card.wordId);
function filledDraft(word, choices) {
  let draft = readCaseDraft('', word, choices);
  for (const slot of word.slots) draft = placeCaseToken(draft, choices.findIndex((choice, index) => choice === slot.answer && !draft.tokens.includes(index)), choices);
  return draft;
}

test('Cases covers both cases, all genders, and plural noun changes with correct declensions', () => {
  const reference = { accusative: { masculine: 'den', feminine: 'die', neuter: 'das', plural: 'die' }, dative: { masculine: 'dem', feminine: 'der', neuter: 'dem', plural: 'den' } };
  assert.equal(caseWords.length, 36);
  assert.ok(caseWords.every(validWord));
  for (const group of CASE_GROUPS) assert.equal(caseWords.filter(word => word.grammaticalCase === group).length, 12);
  for (const grammaticalCase of ['accusative', 'dative']) {
    const slots = caseWords.flatMap(word => word.slots).filter(slot => slot.grammaticalCase === grammaticalCase);
    assert.deepEqual(new Set(slots.map(slot => slot.gender)), new Set(Object.keys(reference[grammaticalCase])));
    for (const slot of slots) assert.equal(slot.answer, reference[grammaticalCase][slot.gender]);
  }
  assert.equal(translation(caseWords.find(word => word.id === 'case-give-man-ball')), 'Ich gebe dem Mann den Ball.');
  assert.equal(translation(caseWords.find(word => word.id === 'case-speak-children')), 'Sie spricht mit den Kindern.');
  assert.equal(translation(caseWords.find(word => word.id === 'case-help-parents')), 'Du hilfst den Eltern.');
  assert.equal(validWord({ ...caseWords[0], slots: [{ ...caseWords[0].slots[0], answer: 'der' }] }), false);
});

test('Cases stays separate from other modes; 15-card rounds contain five of each case group', () => {
  const seen = new Set();
  for (let batch = 0; batch < 24; batch++) {
    const session = makeSession(starterWords, { day, batch, appMode: 'cases' });
    assert.equal(session.cards.length, 15);
    assert.equal(new Set(session.cards.map(card => card.wordId)).size, 15);
    for (const group of CASE_GROUPS) assert.equal(session.cards.filter(card => wordFor(card).grammaticalCase === group).length, 5);
    for (const card of session.cards) {
      seen.add(card.wordId);
      assert.equal(card.mode, 'case-complete');
      assert.equal(card.choices.length, 4);
      const word = wordFor(card), draft = filledDraft(word, card.choices);
      assert.ok(draft.tokens.every(token => token !== null));
      assert.equal(caseSentence(word, draft.tokens.map(token => card.choices[token])), translation(word));
    }
  }
  assert.equal(seen.size, caseWords.length);
  for (const mode of APP_MODES.filter(mode => mode !== 'cases')) {
    assert.ok(wordsForMode(starterWords, mode).every(word => !isCase(word)));
    assert.ok(makeSession(starterWords, { day, appMode: mode }).cards.every(card => card.mode !== 'case-complete'));
  }
});

test('two identical blocks can fill two gaps independently; tapping one returns only that token', () => {
  for (const id of ['case-see-dog-bird', 'case-help-man-child']) {
    const word = caseWords.find(word => word.id === id);
    const session = makeSession(starterWords, { day, appMode: 'cases', ids: [id] });
    const choices = session.cards[0].choices, draft = filledDraft(word, choices);
    assert.equal(choices.filter(choice => choice === word.slots[0].answer).length, 2);
    assert.notEqual(draft.tokens[0], draft.tokens[1]);
    assert.equal(placeCaseToken(draft, draft.tokens[0], choices), draft);
    const undone = removeCaseToken(draft, 0);
    assert.deepEqual(undone.tokens, [null, draft.tokens[1]]);
    assert.equal(undone.active, 0);
    assert.deepEqual(placeCaseToken(undone, draft.tokens[0], choices).tokens, draft.tokens);
  }
});

test('wrong checks remain editable after reload; corrections count once and retain the exact sentence for retry', () => {
  const state = readState(null, starterWords, day), nouns = structuredClone(state.session);
  state.appMode = 'cases';
  state.session = makeSession(starterWords, { day, appMode: 'cases', ids: ['case-give-man-ball'] });
  const card = state.session.cards[0], word = wordFor(card);
  let draft = readCaseDraft('', word, card.choices);
  draft = placeCaseToken(draft, card.choices.indexOf('den'), card.choices);
  draft = placeCaseToken(draft, card.choices.indexOf('dem'), card.choices);
  state.session.draft = JSON.stringify(draft);
  state.session = answerCard(state.session, starterWords, caseSentence(word, draft.tokens.map(token => card.choices[token])));
  assert.equal(state.session.answers.length, 0);
  assert.equal(advanceCard(state.session), state.session);
  const restored = readState(JSON.stringify(state), starterWords, day);
  assert.deepEqual(restored.session, state.session);
  draft = readCaseDraft(restored.session.draft, word, card.choices);
  assert.equal(draft.checked, true);
  assert.equal(draft.mistaken, true);
  draft = removeCaseToken(removeCaseToken(draft, 0), 1);
  for (const slot of word.slots) draft = placeCaseToken(draft, card.choices.indexOf(slot.answer), card.choices);
  restored.session.draft = JSON.stringify(draft);
  restored.session = answerCard(restored.session, starterWords, translation(word));
  assert.equal(restored.session.answers.length, 1);
  assert.equal(restored.session.answers[0].correct, false);
  assert.equal(answerCard(restored.session, starterWords, translation(word)), restored.session);
  restored.session = advanceCard(restored.session);
  assert.equal(restored.session.index, 1);
  assert.deepEqual(missedWords(restored.session), [word.id]);
  assert.deepEqual(restored.sessions.nouns, nouns);
  assert.deepEqual(readState(JSON.stringify(restored), starterWords, day).session, restored.session);
  const retry = makeSession(starterWords, { day, batch: 1, appMode: 'cases', ids: missedWords(restored.session) });
  assert.equal(retry.cards.length, 1);
  assert.equal(retry.cards[0].wordId, word.id);
  assert.equal(answerCard(retry, starterWords, translation(word)).answers[0].correct, true);
});

test('old saves gain Cases; partial placements and bank order survive switching and reload, with daily reset', () => {
  const state = readState(null, starterWords, day);
  delete state.sessions.cases;
  const nouns = structuredClone(state.session), restored = readState(JSON.stringify(state), starterWords, day);
  assert.deepEqual(restored.session, nouns);
  assert.equal(restored.sessions.cases.cards.length, 15);
  restored.appMode = 'cases';
  const card = restored.session.cards[0], word = wordFor(card);
  restored.session.draft = JSON.stringify(placeCaseToken(readCaseDraft('', word, card.choices), 0, card.choices));
  const reloaded = readState(JSON.stringify(restored), starterWords, day);
  assert.deepEqual(reloaded.session, restored.session);
  reloaded.appMode = 'nouns';
  assert.deepEqual(reloaded.session, nouns);
  reloaded.appMode = 'cases';
  assert.deepEqual(reloaded.session, restored.session);
  const tomorrow = readState(JSON.stringify(reloaded), starterWords, '2026-10-31');
  assert.equal(tomorrow.appMode, 'cases');
  assert.equal(tomorrow.session.index, 0);
  assert.equal(tomorrow.session.draft, '');
});

test('corrupt choices recover only Cases; draft tokens cannot reuse or invent blocks', () => {
  const state = readState(null, starterWords, day), nouns = structuredClone(state.session);
  state.appMode = 'cases';
  const card = state.session.cards[0], word = wordFor(card);
  for (const tokens of [[-1], [99], ['0'], [0, 0]]) {
    assert.deepEqual(readCaseDraft(JSON.stringify({ tokens }), word, card.choices).tokens, word.slots.map(() => null));
  }
  state.session.draft = '{broken';
  const restored = readState(JSON.stringify(state), starterWords, day);
  assert.ok(readCaseDraft(restored.session.draft, word, card.choices).tokens.every(token => token === null));
  state.session.cards[0].choices = ['bogus', 'bogus', 'bogus', 'bogus'];
  const recovered = readState(JSON.stringify(state), starterWords, day);
  assert.deepEqual(recovered.sessions.nouns, nouns);
  assert.ok(recovered.session.cards[0].choices.every(choice => choice !== 'bogus'));
});

test('a full round restores each answer, finishes with the first-attempt score, and retries only missed sentences', () => {
  let state = readState(null, starterWords, day);
  state.appMode = 'cases';
  const missed = [];
  while (state.session.index < state.session.cards.length) {
    const card = state.session.cards[state.session.index], word = wordFor(card);
    if (state.session.index % 4 === 0) {
      missed.push(word.id);
      state.session = answerCard(state.session, starterWords, 'wrong');
    }
    state.session = answerCard(state.session, starterWords, translation(word));
    state = readState(JSON.stringify(state), starterWords, day);
    state.session = advanceCard(state.session);
  }
  assert.equal(state.session.answers.length, 15);
  assert.equal(state.session.answers.filter(answer => answer.correct).length, 11);
  assert.deepEqual(missedWords(state.session), missed);
  const restored = readState(JSON.stringify(state), starterWords, day);
  assert.deepEqual(restored.session, state.session);
  const retry = makeSession(starterWords, { day, appMode: 'cases', batch: 1, ids: missedWords(restored.session) });
  assert.equal(retry.cards.length, 4);
  assert.deepEqual(new Set(retry.cards.map(card => card.wordId)), new Set(missed));
});
