import test from 'node:test';
import assert from 'node:assert/strict';
import { starterNouns as starterWords, starterVerbs, starterWords as allWords } from '../dist/deck.mjs';
import { MODES, PERSONS, isVerb, validWord, translation, localDay, makeSession, cardChoices, checkAnswer, answerCard, advanceCard, missedWords, readState } from '../dist/core.mjs';

test('each session rotates the three formats without repeating or previewing its words', () => {
  const session = makeSession(starterWords, { day: '2026-10-30' });
  assert.equal(session.cards.length, 12);
  assert.deepEqual(session.cards.map(card => card.mode), Array.from({ length: 12 }, (_, i) => MODES[i % 3]));
  assert.equal(new Set(session.cards.map(card => card.wordId)).size, 12);
  const sessionTranslations = session.cards.map(card => translation(starterWords.find(word => word.id === card.wordId)));
  for (const card of session.cards.filter(card => card.mode === 'choose')) {
    const choices = cardChoices(card, starterWords, session);
    assert.equal(choices.length, 3);
    assert.equal(new Set(choices).size, 3);
    const expected = translation(starterWords.find(word => word.id === card.wordId));
    assert.ok(choices.includes(expected));
    assert.deepEqual(choices.filter(choice => sessionTranslations.includes(choice)), [expected]);
  }
  assert.deepEqual(makeSession(starterWords, { day: session.day }), session);
  assert.notDeepEqual(makeSession(starterWords, { day: session.day, batch: 1 }).cards, session.cards);
});

test('typing accepts whitespace and capital differences while preserving spelling and articles', () => {
  const card = { mode: 'type' };
  const word = starterWords.find(word => word.id === 'key');
  assert.deepEqual(checkAnswer(card, word, '  der   Schlüssel '), { correct: true, note: '' });
  assert.deepEqual(checkAnswer(card, word, 'der schlüssel'), { correct: true, note: 'der Schlüssel' });
  assert.equal(checkAnswer(card, word, 'die Schlüssel').correct, false);
  assert.equal(checkAnswer(card, word, 'der Schlussel').correct, false);
  assert.equal(checkAnswer(card, word, 'Schlüssel').correct, false);
  assert.equal(checkAnswer({ mode: 'article' }, word, 'der').correct, true);
  assert.equal(checkAnswer({ mode: 'article' }, word, 'das').correct, false);
});

test('adding vocabulary does not change the choices on existing cards', () => {
  const session = makeSession(starterWords, { day: '2026-10-30' });
  const moreWords = [...starterWords, { id: 'cloud', english: 'the cloud', noun: 'Wolke', article: 'die' }];
  for (const card of session.cards.filter(card => card.mode === 'choose')) {
    assert.deepEqual(cardChoices(card, moreWords, session), cardChoices(card, starterWords, session));
  }
});

test('answers are recorded once, advancement requires an answer, and retries contain only missed words', () => {
  let session = makeSession(starterWords, { day: '2026-10-30' });
  assert.equal(advanceCard(session), session);
  const missed = [];
  while (session.index < session.cards.length) {
    const card = session.cards[session.index];
    const word = starterWords.find(word => word.id === card.wordId);
    const fail = session.index % 4 === 0;
    if (fail) missed.push(word.id);
    session = answerCard(session, starterWords, fail ? 'wrong' : card.mode === 'article' ? word.article : translation(word));
    assert.equal(answerCard(session, starterWords, 'wrong'), session);
    session = advanceCard(session);
  }
  assert.equal(session.answers.length, 12);
  assert.equal(session.index, 12);
  assert.deepEqual(missedWords(session), missed);
  assert.equal(advanceCard(session), session);
  const retry = makeSession(starterWords, { day: session.day, batch: 1, ids: missed });
  assert.deepEqual(new Set(retry.cards.map(card => card.wordId)), new Set(missed));
});

test('refresh restores both answered cards and drafts; a new day resets only the practice session', () => {
  let state = readState(null, starterWords, '2026-10-30');
  const first = state.session.cards[0];
  const word = starterWords.find(word => word.id === first.wordId);
  state.session = advanceCard(answerCard(state.session, starterWords, translation(word)));
  state.session.draft = 'das F';
  state.theme = 'dark';
  state.customWords = [{ id: 'custom-1', english: 'the cloud', noun: 'Wolke', article: 'die' }];
  assert.deepEqual(readState(JSON.stringify(state), starterWords, '2026-10-30'), state);
  const tomorrow = readState(JSON.stringify(state), starterWords, '2026-10-31');
  assert.equal(tomorrow.session.index, 0);
  assert.equal(tomorrow.session.day, '2026-10-31');
  assert.equal(tomorrow.theme, 'dark');
  assert.deepEqual(tomorrow.customWords, state.customWords);
});

test('corrupt storage and invalid cards recover safely without losing valid custom words', () => {
  assert.equal(readState('{broken', starterWords, '2026-10-30').session.cards.length, 12);
  for (const value of [null, [], 'oops', 123, { version: 1, session: {} }]) {
    assert.equal(readState(JSON.stringify(value), starterWords, '2026-10-30').session.index, 0);
  }
  const state = readState(null, starterWords, '2026-10-30');
  state.customWords = [
    { id: 'custom-1', english: 'the cloud', noun: 'Wolke', article: 'die' },
    { id: 'custom-1', english: 'duplicate', noun: 'Wolke', article: 'die' },
    { id: 'window', english: 'override', noun: 'Wolke', article: 'die' },
    { id: 'invalid', english: '', noun: 'oops', article: 'banana' }
  ];
  state.session.cards[0].wordId = 'deleted';
  const result = readState(JSON.stringify(state), starterWords, '2026-10-30');
  assert.equal(result.customWords.length, 1);
  assert.equal(result.session.cards[0].wordId === 'deleted', false);
  assert.equal(result.session.index, 0);
});

test('daily rollover uses the device calendar, not a UTC date slice', () => {
  assert.equal(localDay(new Date(2026, 9, 30, 0, 1)), '2026-10-30');
  assert.equal(localDay(new Date(2026, 9, 30, 23, 59)), '2026-10-30');
});

test('verb mode uses only verbs, includes complete conjugations, and never reveals upcoming verbs in choices', () => {
  const session = makeSession(allWords, { day: '2026-10-30', appMode: 'verbs' });
  assert.equal(session.cards.length, 6);
  assert.deepEqual(session.cards.map(card => card.mode), ['choose', 'type', 'conjugate', 'choose', 'type', 'conjugate']);
  const ids = new Set(session.cards.map(card => card.wordId));
  for (const card of session.cards) {
    const word = allWords.find(word => word.id === card.wordId);
    assert.ok(isVerb(word));
    assert.ok(validWord(word));
    if (card.mode === 'choose') {
      const choices = cardChoices(card, allWords, session);
      assert.equal(choices.length, 3);
      assert.equal(new Set(choices).size, 3);
      assert.ok(choices.every(choice => starterVerbs.some(verb => verb.infinitive === choice)));
      assert.deepEqual(choices.filter(choice => starterVerbs.some(verb => ids.has(verb.id) && verb.infinitive === choice)), [word.infinitive]);
    }
  }
  assert.ok(starterVerbs.every(validWord));
});

test('mixed sessions balance nouns and verbs while assigning the right grammar task', () => {
  const session = makeSession(allWords, { day: '2026-10-30', appMode: 'mixed' });
  assert.equal(session.cards.length, 12);
  assert.equal(session.cards.filter(card => isVerb(allWords.find(word => word.id === card.wordId))).length, 6);
  assert.equal(session.cards.filter(card => card.mode === 'article').length, 2);
  assert.equal(session.cards.filter(card => card.mode === 'conjugate').length, 2);
  for (const card of session.cards) {
    const word = allWords.find(word => word.id === card.wordId);
    assert.ok(card.mode !== 'article' || !isVerb(word));
    assert.ok(card.mode !== 'conjugate' || isVerb(word));
  }
});

test('conjugation cards grade one requested form, including irregular forms and umlauts', () => {
  const word = starterVerbs.find(word => word.infinitive === 'fahren');
  const expected = ['fahre', 'fährst', 'fährt', 'fahren', 'fahrt', 'fahren'];
  PERSONS.forEach((_, person) => assert.equal(checkAnswer({ wordId: word.id, mode: 'conjugate', person }, word, expected[person]).correct, true));
  const card = { wordId: word.id, mode: 'conjugate', person: 1 };
  assert.deepEqual(checkAnswer(card, word, 'fahrst'), { correct: false, note: 'du fährst' });
  assert.equal(checkAnswer(card, word, 'fährt').correct, false);
  assert.equal(checkAnswer(card, word, '').correct, false);
  assert.equal(checkAnswer({ mode: 'type' }, word, 'fahren').correct, true);
  assert.equal(checkAnswer({ mode: 'type' }, word, 'fahre').correct, false);
});

test('mode progress and partial conjugations survive switching and refresh independently', () => {
  const state = readState(null, allWords, '2026-10-30');
  const nounCards = structuredClone(state.session.cards);
  state.session.draft = 'das F';
  state.appMode = 'verbs';
  while (state.session.cards[state.session.index].mode !== 'conjugate') {
    const card = state.session.cards[state.session.index];
    const word = allWords.find(word => word.id === card.wordId);
    state.session = advanceCard(answerCard(state.session, allWords, word.infinitive));
  }
  state.session.draft = 'a partial form';
  const restored = readState(JSON.stringify(state), allWords, '2026-10-30');
  assert.equal(restored.appMode, 'verbs');
  assert.deepEqual(restored.session.draft, state.session.draft);
  assert.deepEqual(restored.sessions.nouns.cards, nounCards);
  restored.appMode = 'nouns';
  assert.equal(restored.session.draft, 'das F');
  assert.equal(restored.session.index, 0);
  restored.appMode = 'verbs';
  assert.equal(restored.session.index, 2);
});

test('conjugation results restore safely and retries preserve the missed exercise', () => {
  const state = readState(null, allWords, '2026-10-30');
  state.appMode = 'verbs';
  while (state.session.index < state.session.cards.length) {
    const card = state.session.cards[state.session.index];
    const word = allWords.find(word => word.id === card.wordId);
    const answer = card.mode === 'conjugate' ? 'wrong' : word.infinitive;
    state.session = advanceCard(answerCard(state.session, allWords, answer));
  }
  assert.deepEqual(readState(JSON.stringify(state), allWords, '2026-10-30'), state);
  const retry = makeSession(allWords, {
    day: state.session.day, appMode: 'verbs', ids: missedWords(state.session),
    retryModes: Object.fromEntries(state.session.cards.map(card => [card.wordId, card.mode])),
    retryPersons: Object.fromEntries(state.session.cards.filter(card => card.mode === 'conjugate').map(card => [card.wordId, card.person]))
  });
  assert.equal(retry.cards.length, 2);
  assert.ok(retry.cards.every(card => card.mode === 'conjugate'));
  retry.cards.forEach(card => assert.equal(card.person, state.session.cards.find(previous => previous.wordId === card.wordId).person));
  const malformed = JSON.parse(JSON.stringify(state));
  malformed.sessions.verbs.cards[2].person = 99;
  assert.equal(readState(JSON.stringify(malformed), allWords, '2026-10-30').session.index, 0);
});

test('both verb and mixed modes cover all six pronouns across daily sessions and practice batches', () => {
  for (const appMode of ['verbs', 'mixed']) {
    const days = new Set();
    const batches = new Set();
    for (let index = 0; index < 3; index++) {
      makeSession(allWords, { day: `2026-10-${28 + index}`, appMode }).cards.filter(card => card.mode === 'conjugate').forEach(card => days.add(card.person));
      makeSession(allWords, { day: '2026-10-30', appMode, batch: index }).cards.filter(card => card.mode === 'conjugate').forEach(card => batches.add(card.person));
    }
    assert.deepEqual([...days].sort(), [0, 1, 2, 3, 4, 5]);
    assert.deepEqual([...batches].sort(), [0, 1, 2, 3, 4, 5]);
  }
});

test('older six-field conjugation saves migrate to a single question without losing other modes', () => {
  const state = readState(null, allWords, '2026-10-30');
  state.appMode = 'verbs';
  const session = state.session;
  for (const card of session.cards) delete card.person;
  session.index = 3;
  session.answers = session.cards.slice(0, 3).map(card => {
    const word = allWords.find(word => word.id === card.wordId);
    if (card.mode !== 'conjugate') return { wordId: word.id, correct: true, given: word.infinitive, note: '' };
    return { wordId: word.id, correct: true, given: word.forms, note: '', forms: word.forms.map(expected => ({ given: expected, expected, correct: true })) };
  });
  const nounSession = structuredClone(state.sessions.nouns);
  const migrated = readState(JSON.stringify(state), allWords, '2026-10-30');
  assert.equal(migrated.session.index, 3);
  assert.equal(typeof migrated.session.answers[2].given, 'string');
  assert.equal(migrated.session.answers[2].correct, true);
  assert.ok(Number.isInteger(migrated.session.cards[2].person));
  assert.deepEqual(migrated.sessions.nouns, nounSession);
  session.index = 2;
  session.answers = session.answers.slice(0, 2);
  session.draft = ['one', 'two', 'three', 'four', 'five', 'six'];
  const partial = readState(JSON.stringify(state), allWords, '2026-10-30');
  assert.equal(partial.session.draft, session.draft[partial.session.cards[2].person]);
});

test('the previous noun-only save migrates without losing its progress or custom vocabulary', () => {
  const original = {
    version: 1, theme: 'dark', customWords: [{ id: 'custom-1', english: 'the cloud', noun: 'Wolke', article: 'die' }],
    session: makeSession(starterWords, { day: '2026-10-30' })
  };
  original.session = advanceCard(answerCard(original.session, starterWords, 'wrong'));
  const state = readState(JSON.stringify(original), allWords, '2026-10-30');
  assert.equal(state.version, 2);
  assert.equal(state.appMode, 'nouns');
  assert.deepEqual(state.session, original.session);
  assert.deepEqual(state.customWords, original.customWords);
  assert.equal(state.theme, 'dark');
  assert.equal(state.sessions.verbs.cards.length, 6);
  assert.equal(state.sessions.mixed.cards.length, 12);
});

test('custom verbs require all six forms and are available only in the relevant modes', () => {
  const custom = { id: 'custom-verb', kind: 'verb', english: 'to play', infinitive: 'spielen', forms: ['spiele', 'spielst', 'spielt', 'spielen', 'spielt', 'spielen'] };
  assert.ok(validWord(custom));
  assert.equal(validWord({ ...custom, forms: ['spiele'] }), false);
  const state = readState(JSON.stringify({ version: 2, customWords: [custom] }), allWords, '2026-10-30');
  assert.deepEqual(state.customWords, [custom]);
  assert.deepEqual(makeSession([...allWords, custom], { appMode: 'nouns', ids: [custom.id] }).cards, []);
  assert.equal(makeSession([...allWords, custom], { appMode: 'verbs', ids: [custom.id] }).cards[0].wordId, custom.id);
});
