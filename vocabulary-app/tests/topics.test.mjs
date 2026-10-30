import test from 'node:test';
import assert from 'node:assert/strict';
import { starterWords, vocabularyWords } from '../dist/deck.mjs';
import { grammarWords } from '../dist/grammar.mjs';
import { vocabularyTopics, grammarTopics, practiceModes, sessionKey } from '../dist/topics.mjs';
import { validWord, isNoun, isVerb, isGrammar, wordsForMode, makeSession, expectedAnswer, checkAnswer, answerCard, advanceCard, missedWords, readState, cardChoices, isConjugation } from '../dist/core.mjs';

test('every curriculum entry has a valid type, unique ID, level and teaching topic', () => {
  assert.ok(vocabularyWords.length >= 1200);
  assert.ok(grammarWords.length >= 140);
  assert.equal(new Set(starterWords.map(word => word.id)).size, starterWords.length);
  assert.ok(starterWords.every(validWord));
  const tags = new Set(vocabularyTopics.map(topic => topic.tag));
  for (const word of vocabularyWords) {
    assert.ok(['A1', 'A2'].includes(word.level), word.id);
    assert.ok(word.topics.length && word.topics.every(tag => tags.has(tag)), word.id);
    if (isVerb(word)) {
      assert.equal(word.forms.length, 6);
      assert.equal(word.englishForms.length, 6);
      assert.ok(word.englishForms.every(cue => !cue.includes('undefined')));
    }
  }
  const translations = vocabularyWords.map(word => isNoun(word) ? `${word.article} ${word.noun}` : isVerb(word) ? word.infinitive : word.german);
  assert.ok(!translations.some(text => /undefined|\|/.test(text)));
});

test('all topic and level combinations generate usable cards of the correct kind and restore progress', () => {
  for (const info of practiceModes) for (const level of ['all', 'A1', 'A2']) {
    const pool = wordsForMode(starterWords, info.id, level);
    const session = makeSession(starterWords, { day: '2026-10-31', appMode: info.id, level });
    assert.equal(session.cards.length, Math.min(15, pool.length), `${info.id}:${level}`);
    const eligible = new Set(pool.map(word => word.id));
    for (const card of session.cards) {
      assert.ok(eligible.has(card.wordId));
      const word = pool.find(word => word.id === card.wordId);
      if (card.mode === 'article') assert.ok(isNoun(word));
      if (isConjugation(card)) assert.ok(isVerb(word));
      if (isGrammar(word)) assert.equal(card.mode, 'grammar-choose');
      assert.ok(checkAnswer(card, word, expectedAnswer(card, word)).correct);
      const choices = cardChoices(card, pool, session);
      if (['choose', 'grammar-choose', 'conjugate-choose'].includes(card.mode)) {
        assert.ok(choices.length >= 2 && choices.length <= 3, `${info.id}:${level}:${word.id}`);
        assert.equal(choices.filter(choice => choice === expectedAnswer(card, word)).length, 1);
      }
    }
    if (!pool.length) continue;
    const state = readState(null, starterWords, session.day);
    state.appMode = info.id; state.level = level;
    state.session = session;
    const card = session.cards[0];
    const word = pool.find(word => word.id === card.wordId);
    if (card.mode !== 'case-complete') {
      state.session = advanceCard(answerCard(session, starterWords, expectedAnswer(card, word)));
      state.session.draft = 'draft text';
    }
    const restored = readState(JSON.stringify(state), starterWords, session.day);
    assert.equal(restored.level, level);
    assert.equal(restored.appMode, info.id);
    assert.deepEqual(restored.session, state.session, `${info.id}:${level}`);
  }
});

test('every everyday domain has both A1 foundations and A2 extensions', () => {
  for (const topic of vocabularyTopics) {
    assert.ok(wordsForMode(starterWords, topic.id, 'A1').length >= 5, topic.id);
    assert.ok(wordsForMode(starterWords, topic.id, 'A2').length >= 5, topic.id);
    assert.equal(wordsForMode(starterWords, topic.id).length,
      wordsForMode(starterWords, topic.id, 'A1').length + wordsForMode(starterWords, topic.id, 'A2').length);
  }
  for (const topic of grammarTopics) assert.ok(wordsForMode(starterWords, topic.id).every(isGrammar));
});

test('topic and level sessions preserve independent drafts and reset on the device day', () => {
  const state = readState(null, starterWords, '2026-10-31');
  const expected = {};
  for (const [mode, level] of [['topic-food', 'all'], ['topic-food', 'A1'], ['topic-food', 'A2'], ['grammar-perfect', 'A2']]) {
    state.appMode = mode; state.level = level;
    state.session.draft = `draft for ${mode}:${level}`;
    expected[sessionKey(mode, level)] = structuredClone(state.session);
  }
  const restored = readState(JSON.stringify(state), starterWords, '2026-10-31');
  for (const [key, session] of Object.entries(expected)) assert.deepEqual(restored.sessions[key], session);
  const tomorrow = readState(JSON.stringify(state), starterWords, '2026-11-01');
  assert.equal(tomorrow.session.day, '2026-11-01');
  assert.equal(tomorrow.session.draft, '');
  assert.equal(tomorrow.level, 'A2');
  assert.equal(tomorrow.appMode, 'grammar-perfect');
});

test('missed grammar cards retry the exact sentence and reveal an authored explanation', () => {
  const pool = wordsForMode(starterWords, 'grammar-perfect', 'A2');
  let session = makeSession(starterWords, { day: '2026-10-31', appMode: 'grammar-perfect', level: 'A2' });
  const missed = session.cards[0];
  const word = pool.find(word => word.id === missed.wordId);
  assert.ok(word.explanation.length > 20);
  session = advanceCard(answerCard(session, starterWords, missed.choices.find(choice => choice !== word.answer)));
  const retry = makeSession(starterWords, { appMode: 'grammar-perfect', level: 'A2', ids: missedWords(session), retryModes: { [word.id]: missed.mode } });
  assert.equal(retry.cards.length, 1);
  assert.equal(retry.cards[0].wordId, word.id);
  assert.equal(retry.cards[0].mode, missed.mode);
});

test('non-nouns never receive article exercises; formal pronouns retain meaningful capitals', () => {
  for (const mode of ['all-vocabulary', 'adjectives', 'phrases', 'topic-connections', 'topic-numbers']) {
    for (let batch = 0; batch < 8; batch++) {
      for (const card of makeSession(starterWords, { appMode: mode, batch }).cards) {
        const word = starterWords.find(word => word.id === card.wordId);
        if (!isNoun(word) && !isVerb(word)) assert.ok(['choose', 'type'].includes(card.mode));
      }
    }
  }
  for (const german of ['Sie', 'Ihnen']) {
    const word = vocabularyWords.find(word => word.german === german);
    assert.ok(checkAnswer({ mode: 'type' }, word, german).correct);
    assert.ok(!checkAnswer({ mode: 'type' }, word, german.toLowerCase()).correct);
  }
});

test('essential irregular, separable and reflexive verbs retain explicit complete forms', () => {
  for (const [infinitive, person, expected] of [
    ['aufstehen', 0, 'stehe auf'], ['einladen', 1, 'lädst ein'], ['anfangen', 2, 'fängt an'],
    ['braten', 2, 'brät'], ['sich bewerben', 1, 'bewirbst dich'], ['sich anziehen', 4, 'zieht euch an'],
    ['herunterladen', 2, 'lädt herunter'], ['abgeben', 1, 'gibst ab']
  ]) assert.equal(vocabularyWords.find(word => word.infinitive === infinitive).forms[person], expected);
});
