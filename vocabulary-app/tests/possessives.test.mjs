import test from 'node:test';
import assert from 'node:assert/strict';
import { starterWords, possessiveWords } from '../dist/deck.mjs';
import { POSSESSIVE_OWNERS, POSSESSIVE_CASES, POSSESSIVE_GENDERS } from '../dist/possessives.mjs';
import { APP_MODES, isPossessive, validWord, wordsForMode, translation, expectedAnswer, makeSession, cardChoices, checkAnswer, answerCard, advanceCard, missedWords, readState } from '../dist/core.mjs';

test('all owners have the complete possessive article declension, including euer and formal Ihr', () => {
  // Independent reference table: columns are masculine, feminine, neuter, plural.
  const forms = {
    mein: [['mein', 'meine', 'mein', 'meine'], ['meinen', 'meine', 'mein', 'meine'], ['meinem', 'meiner', 'meinem', 'meinen'], ['meines', 'meiner', 'meines', 'meiner']],
    dein: [['dein', 'deine', 'dein', 'deine'], ['deinen', 'deine', 'dein', 'deine'], ['deinem', 'deiner', 'deinem', 'deinen'], ['deines', 'deiner', 'deines', 'deiner']],
    sein: [['sein', 'seine', 'sein', 'seine'], ['seinen', 'seine', 'sein', 'seine'], ['seinem', 'seiner', 'seinem', 'seinen'], ['seines', 'seiner', 'seines', 'seiner']],
    ihr: [['ihr', 'ihre', 'ihr', 'ihre'], ['ihren', 'ihre', 'ihr', 'ihre'], ['ihrem', 'ihrer', 'ihrem', 'ihren'], ['ihres', 'ihrer', 'ihres', 'ihrer']],
    unser: [['unser', 'unsere', 'unser', 'unsere'], ['unseren', 'unsere', 'unser', 'unsere'], ['unserem', 'unserer', 'unserem', 'unseren'], ['unseres', 'unserer', 'unseres', 'unserer']],
    euer: [['euer', 'eure', 'euer', 'eure'], ['euren', 'eure', 'euer', 'eure'], ['eurem', 'eurer', 'eurem', 'euren'], ['eures', 'eurer', 'eures', 'eurer']],
    Ihr: [['Ihr', 'Ihre', 'Ihr', 'Ihre'], ['Ihren', 'Ihre', 'Ihr', 'Ihre'], ['Ihrem', 'Ihrer', 'Ihrem', 'Ihren'], ['Ihres', 'Ihrer', 'Ihres', 'Ihrer']]
  };
  assert.deepEqual(POSSESSIVE_OWNERS.map(owner => owner.id), ['ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie-plural', 'Sie']);
  assert.equal(possessiveWords.length, 144);
  assert.equal(new Set(possessiveWords.map(word => word.id)).size, 144);
  for (const owner of POSSESSIVE_OWNERS) {
    for (const [caseIndex, grammaticalCase] of POSSESSIVE_CASES.entries()) {
      for (const [genderIndex, gender] of POSSESSIVE_GENDERS.entries()) {
        const word = possessiveWords.find(word => word.owner === owner.id && word.grammaticalCase === grammaticalCase && word.gender === gender);
        assert.ok(validWord(word), word?.id);
        assert.equal(word.answer, forms[owner.stem][caseIndex][genderIndex], word.id);
        const card = { wordId: word.id, mode: 'possessive-choose' };
        const choices = cardChoices(card, starterWords, { day: '2026-10-30', batch: 0 });
        assert.equal(new Set(choices).size, 3);
        assert.equal(choices.filter(choice => checkAnswer(card, word, choice).correct).length, 1);
        assert.equal(expectedAnswer(card, word), word.answer);
        assert.equal(checkAnswer(card, word, 'wrong').note, translation(word));
      }
    }
  }
  assert.equal(possessiveWords.find(word => word.owner === 'ich' && word.grammaticalCase === 'dative' && word.gender === 'plural').prompt, 'Ich spreche mit ___ Freunden.');
  assert.equal(possessiveWords.find(word => word.owner === 'wir' && word.grammaticalCase === 'genitive' && word.gender === 'neuter').prompt, 'Das ist das Auto ___ Kindes.');
});

test('every full possessive session covers all owners, cases and noun categories without repeating a question', () => {
  const seen = new Set();
  for (let batch = 0; batch < 144; batch++) {
    const session = makeSession(starterWords, { day: '2026-10-30', batch, appMode: 'possessives' });
    assert.equal(session.cards.length, 15);
    assert.equal(new Set(session.cards.map(card => card.wordId)).size, 15);
    const words = session.cards.map(card => starterWords.find(word => word.id === card.wordId));
    assert.equal(new Set(words.map(word => word.owner)).size, 9);
    assert.equal(new Set(words.map(word => word.grammaticalCase)).size, 4);
    assert.equal(new Set(words.map(word => word.gender)).size, 4);
    for (const card of session.cards) {
      assert.equal(card.mode, 'possessive-choose');
      assert.equal(card.choices.length, 3);
      seen.add(card.wordId);
    }
  }
  assert.equal(seen.size, possessiveWords.length);
});

test('possessive exercises stay out of vocabulary modes and their distractors', () => {
  assert.equal(wordsForMode(starterWords, 'possessives').length, 144);
  const possessiveAnswers = new Set(possessiveWords.map(word => word.answer));
  for (const mode of APP_MODES.filter(mode => mode !== 'possessives')) {
    assert.ok(wordsForMode(starterWords, mode).every(word => !isPossessive(word)));
    const session = makeSession(starterWords, { day: '2026-10-30', appMode: mode });
    assert.ok(session.cards.every(card => card.mode !== 'possessive-choose'));
    for (const card of session.cards.filter(card => card.mode === 'choose')) {
      assert.ok(card.choices.every(choice => !possessiveAnswers.has(choice)));
    }
  }
});

test('possessive progress, options and exact missed sentences survive switching, refresh and retry', () => {
  const state = readState(null, starterWords, '2026-10-30');
  const nouns = structuredClone(state.session);
  state.appMode = 'possessives';
  const firstChoices = [...state.session.cards[0].choices];
  while (state.session.index < state.session.cards.length) {
    const card = state.session.cards[state.session.index];
    const word = starterWords.find(word => word.id === card.wordId);
    state.session = answerCard(state.session, starterWords, state.session.index % 3 === 0 ? card.choices.find(choice => choice !== word.answer) : word.answer);
    const restored = readState(JSON.stringify(state), starterWords, '2026-10-30');
    assert.deepEqual(restored.session, state.session);
    state.session = advanceCard(state.session);
  }
  assert.deepEqual(state.session.cards[0].choices, firstChoices);
  assert.deepEqual(state.sessions.nouns, nouns);
  const retry = makeSession(starterWords, { day: state.session.day, batch: 1, appMode: 'possessives', ids: missedWords(state.session) });
  assert.equal(retry.cards.length, 5);
  assert.deepEqual(new Set(retry.cards.map(card => card.wordId)), new Set(missedWords(state.session)));
  for (const card of retry.cards) {
    const word = starterWords.find(word => word.id === card.wordId);
    assert.equal(checkAnswer(card, word, word.answer).correct, true);
  }
  const tomorrow = readState(JSON.stringify(state), starterWords, '2026-10-31');
  assert.equal(tomorrow.appMode, 'possessives');
  assert.equal(tomorrow.session.index, 0);
  assert.equal(tomorrow.session.cards.length, 15);
});

test('old saves gain possessives without losing other sessions; corrupt possessive choices recover safely', () => {
  const state = readState(null, starterWords, '2026-10-30');
  const nouns = structuredClone(state.session);
  delete state.sessions.possessives;
  const restored = readState(JSON.stringify(state), starterWords, '2026-10-30');
  assert.deepEqual(restored.sessions.nouns, nouns);
  assert.equal(restored.sessions.possessives.cards.length, 15);
  restored.appMode = 'possessives';
  const card = restored.session.cards[0];
  const word = starterWords.find(word => word.id === card.wordId);
  restored.session = answerCard(restored.session, starterWords, word.answer);
  restored.session.cards[0].choices = ['bogus', word.answer, 'broken'];
  const recovered = readState(JSON.stringify(restored), starterWords, '2026-10-30');
  assert.equal(recovered.session.answers.length, 0);
  assert.deepEqual(recovered.sessions.nouns, nouns);
  const formal = possessiveWords.find(word => word.owner === 'Sie');
  assert.equal(checkAnswer({ mode: 'possessive-choose' }, formal, formal.answer.toLowerCase()).correct, false);
});
