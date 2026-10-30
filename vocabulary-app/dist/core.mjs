import { POSSESSIVE_OWNERS, POSSESSIVE_CASES, POSSESSIVE_GENDERS } from './possessives.mjs';

export const MODES = ['choose', 'type', 'article'];
export const APP_MODES = ['nouns', 'verbs', 'conjugations', 'possessives', 'mixed'];
export const PERSONS = ['ich', 'du', 'er / sie / es', 'wir', 'ihr', 'sie / Sie'];
export const CHOICE_PERSONS = ['ich', 'du', 'er', 'wir', 'ihr', 'sie'];
export const SESSION_LENGTH = 15;
export const STORAGE_KEY = 'german-daily.v1';
export const isVerb = word => word?.kind === 'verb';
export const isPossessive = word => word?.kind === 'possessive';
export const isConjugation = card => card?.mode === 'conjugate' || card?.mode === 'conjugate-choose';
export const practicePersons = word => word.practicePersons ?? PERSONS.map((_, index) => index);
export const conjugationSubject = (card, word) => card.person === 2 && word.thirdPersonSubject === 'es'
  ? 'es' : (card.mode === 'conjugate-choose' ? CHOICE_PERSONS : PERSONS)[card.person];
export const canChooseConjugation = word => isVerb(word) && Array.isArray(word.forms) && new Set(word.forms).size >= 3 &&
  Array.isArray(word.englishForms) && word.englishForms.length === PERSONS.length && word.englishForms.every(form => typeof form === 'string' && form.trim().length > 0 && form.length <= 160);
export const translation = word => isPossessive(word) ? word.prompt.replace('___', word.answer) : isVerb(word) ? word.infinitive : `${word.article} ${word.noun}`;
export const wordsForMode = (words, mode) => words.filter(word => mode === 'possessives' ? isPossessive(word) : !isPossessive(word) && (mode === 'conjugations' ? canChooseConjugation(word) : mode === 'mixed' || isVerb(word) === (mode === 'verbs')));
export const expectedAnswer = (card, word) => card.mode === 'possessive-choose' ? word.answer : isConjugation(card) ? word.forms[card.person] : card.mode === 'article' ? word.article : translation(word);
const conjugationPerson = (day, batch, index) => ((Math.floor(Date.parse(`${day}T12:00:00Z`) / 86400000) + batch) * 2 + index) % PERSONS.length;

export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function randomFromSeed(seed) {
  let value = 2166136261;
  for (const char of seed) value = Math.imul(value ^ char.charCodeAt(0), 16777619);
  return () => {
    value += 0x6D2B79F5;
    let t = Math.imul(value ^ value >>> 15, 1 | value);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function shuffled(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function makeSession(words, { day = localDay(), batch = 0, ids, modeOffset = 0, appMode = 'nouns', retryModes = {}, retryPersons = {} } = {}) {
  const random = randomFromSeed(`${day}:${batch}:${modeOffset}`);
  const eligible = wordsForMode(words, appMode);
  const pool = ids ? eligible.filter(word => ids.includes(word.id)) : eligible;
  const remaining = shuffled(pool, random);
  const length = Math.min(pool.length, ids ? pool.length : SESSION_LENGTH);
  const cards = [];
  let conjugationIndex = 0;
  for (let index = 0; index < length; index++) {
    const phase = (index + modeOffset) % MODES.length;
    const preferVerb = (Math.floor(index / MODES.length) + phase) % 2 === 1;
    let preferred = appMode === 'mixed' ? remaining.findIndex(word => isVerb(word) === preferVerb) : 0;
    if (appMode === 'possessives' && !ids) {
      const dayNumber = Math.floor(Date.parse(`${day}T12:00:00Z`) / 86400000);
      const owner = POSSESSIVE_OWNERS[(dayNumber + batch + index) % POSSESSIVE_OWNERS.length].id;
      const variant = (dayNumber + batch * SESSION_LENGTH + index) % (POSSESSIVE_CASES.length * POSSESSIVE_GENDERS.length);
      preferred = remaining.findIndex(word => word.owner === owner && word.variant === variant);
    }
    const [word] = remaining.splice(preferred < 0 ? 0 : preferred, 1);
    const choiceTurn = (Math.floor(Date.parse(`${day}T12:00:00Z`) / 86400000 / 3) + batch + conjugationIndex) % 2 === 0;
    const grammarMode = choiceTurn && canChooseConjugation(word) ? 'conjugate-choose' : 'conjugate';
    const mode = appMode === 'possessives' ? 'possessive-choose' : appMode === 'conjugations' ? 'conjugate-choose' : phase === 2 && isVerb(word) ? grammarMode : MODES[phase];
    const card = { wordId: word.id, mode: retryModes[word.id] ?? mode };
    if (isConjugation(card)) {
      const person = conjugationPerson(day, batch, conjugationIndex);
      const allowed = practicePersons(word);
      card.person = retryPersons[word.id] ?? (allowed.includes(person) ? person : allowed[Math.floor(person * allowed.length / PERSONS.length)]);
      conjugationIndex++;
    }
    cards.push(card);
  }
  const session = {
    day, batch,
    cards,
    index: 0,
    answers: [],
    draft: ''
  };
  for (const card of session.cards) {
    if (['choose', 'conjugate-choose', 'possessive-choose'].includes(card.mode)) card.choices = cardChoices(card, words, session);
  }
  return session;
}

export function cardChoices(card, words, session) {
  const word = words.find(item => item.id === card.wordId);
  if (!word) return [];
  if (card.mode === 'article') return ['der', 'die', 'das'];
  if (Array.isArray(card.choices)) return [...card.choices];
  const random = randomFromSeed(`${session.day}:${session.batch}:${word.id}:choices`);
  if (card.mode === 'possessive-choose') return shuffled(word.options, random);
  if (card.mode === 'conjugate-choose') {
    const answer = expectedAnswer(card, word);
    const alternatives = [...new Set(word.forms)].filter(form => form !== answer);
    return shuffled([answer, ...shuffled(alternatives, random).slice(0, 2)], random);
  }
  const answer = translation(word);
  const sessionIds = new Set(session.cards.map(item => item.wordId));
  const sameKind = words.filter(item => !isPossessive(item) && isVerb(item) === isVerb(word));
  const outsideSession = sameKind.filter(item => !sessionIds.has(item.id));
  const pool = outsideSession.length >= 2 ? outsideSession : sameKind.filter(item => item.id !== word.id);
  const alternatives = [...new Set(pool.map(translation))].filter(item => item !== answer);
  return shuffled([answer, ...shuffled(alternatives, random).slice(0, 2)], random);
}

const normalize = text => text.normalize('NFC').trim().replace(/\s+/g, ' ');
export function checkAnswer(card, word, rawAnswer) {
  const expected = expectedAnswer(card, word);
  const answer = normalize(rawAnswer);
  if (answer === expected) return { correct: true, note: '' };
  if (card.mode !== 'possessive-choose' && answer.toLocaleLowerCase('de') === expected.toLocaleLowerCase('de')) {
    return { correct: true, note: expected };
  }
  const subject = conjugationSubject(card, word);
  return { correct: false, note: isConjugation(card) ? `${subject} ${expected}` : translation(word) };
}

export function answerCard(session, words, rawAnswer) {
  const card = session.cards[session.index];
  if (!card || session.answers[session.index]) return session;
  const word = words.find(item => item.id === card.wordId);
  if (!word) return session;
  const result = checkAnswer(card, word, rawAnswer);
  return { ...session, draft: '', answers: [...session.answers, { ...result, wordId: word.id, given: normalize(rawAnswer) }] };
}

export function advanceCard(session) {
  if (session.index >= session.cards.length || !session.answers[session.index]) return session;
  return { ...session, index: session.index + 1, draft: '' };
}

export function missedWords(session) {
  return [...new Set(session.answers.filter(answer => !answer.correct).map(answer => answer.wordId))];
}

export function validWord(word) {
  if (!word || typeof word.id !== 'string' || !word.id.length || word.id.length > 100 ||
    typeof word.english !== 'string' || !word.english.trim().length || word.english.length > 80) return false;
  if (isPossessive(word)) return POSSESSIVE_OWNERS.some(owner => owner.id === word.owner) &&
    POSSESSIVE_CASES.includes(word.grammaticalCase) && POSSESSIVE_GENDERS.includes(word.gender) &&
    Number.isInteger(word.variant) && word.variant >= 0 && word.variant < 16 &&
    ['prompt', 'answer', 'cue', 'nounCue', 'explanation'].every(key => typeof word[key] === 'string' && word[key].length > 0 && word[key].length <= 160) &&
    word.prompt.split('___').length === 2 && Array.isArray(word.options) && word.options.length === 3 &&
    new Set(word.options).size === 3 && word.options.includes(word.answer) &&
    word.options.every(option => typeof option === 'string' && /^[A-Za-zäöüÄÖÜ]+$/u.test(option));
  if (isVerb(word)) return (word.practicePersons === undefined || Array.isArray(word.practicePersons) && word.practicePersons.length > 0 &&
    new Set(word.practicePersons).size === word.practicePersons.length && word.practicePersons.every(person => Number.isInteger(person) && person >= 0 && person < PERSONS.length)) &&
    (word.thirdPersonSubject === undefined || word.thirdPersonSubject === 'es') &&
    typeof word.infinitive === 'string' && /^[a-zäöü]/u.test(word.infinitive) && word.infinitive.length <= 80 &&
    Array.isArray(word.forms) && word.forms.length === PERSONS.length && word.forms.every(form => typeof form === 'string' && form.trim().length > 0 && form.length <= 80);
  return (word.kind === undefined || word.kind === 'noun') && typeof word.noun === 'string' && /^[A-ZÄÖÜ]/u.test(word.noun) && word.noun.length <= 80 && ['der', 'die', 'das'].includes(word.article);
}

function validSession(session, words) {
  if (!session || !/^\d{4}-\d{2}-\d{2}$/.test(session.day) || !Number.isInteger(session.batch) || session.batch < 0 ||
    !Array.isArray(session.cards) || !session.cards.length || session.cards.length > words.length ||
    !Number.isInteger(session.index) || session.index < 0 || session.index > session.cards.length ||
    !Array.isArray(session.answers) || ![session.index, Math.min(session.index + 1, session.cards.length)].includes(session.answers.length)) return false;
  const ids = new Set(words.map(word => word.id));
  const translations = new Set(words.map(translation));
  return session.cards.every(card => card && ids.has(card.wordId) && [...MODES, 'conjugate', 'conjugate-choose', 'possessive-choose'].includes(card.mode) &&
      (isPossessive(words.find(word => word.id === card.wordId)) === (card.mode === 'possessive-choose')) &&
      (card.mode !== 'article' || !isVerb(words.find(word => word.id === card.wordId))) &&
      (!isConjugation(card) || isVerb(words.find(word => word.id === card.wordId)) && Number.isInteger(card.person) && practicePersons(words.find(word => word.id === card.wordId)).includes(card.person)) &&
      (card.mode !== 'conjugate-choose' || canChooseConjugation(words.find(word => word.id === card.wordId)) && Array.isArray(card.choices)) &&
      (card.mode !== 'possessive-choose' || Array.isArray(card.choices)) &&
      (card.choices === undefined || Array.isArray(card.choices) && card.choices.length === 3 &&
        new Set(card.choices).size === 3 && card.choices.every(choice => card.mode === 'possessive-choose' ? words.find(word => word.id === card.wordId).options.includes(choice) : card.mode === 'conjugate-choose' ? words.find(word => word.id === card.wordId).forms.includes(choice) : translations.has(choice)) &&
        card.choices.includes(expectedAnswer(card, words.find(word => word.id === card.wordId))))) &&
    new Set(session.cards.map(card => card.wordId)).size === session.cards.length &&
    session.answers.every((answer, index) => {
      if (!answer || answer.wordId !== session.cards[index].wordId || typeof answer.correct !== 'boolean' || typeof answer.note !== 'string') return false;
      return typeof answer.given === 'string';
    });
}

function migrateConjugations(saved, words) {
  if (!saved || !Array.isArray(saved.cards) || !Array.isArray(saved.answers)) return saved;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(saved.day) || !Number.isFinite(Date.parse(`${saved.day}T12:00:00Z`)) || !Number.isInteger(saved.batch) || saved.batch < 0) return null;
  let conjugationIndex = 0;
  const cards = saved.cards.map(card => {
    if (card?.mode !== 'conjugate') return card;
    const person = conjugationPerson(saved.day, saved.batch, conjugationIndex++);
    return card.person === undefined ? { ...card, person } : card;
  });
  const answers = [];
  for (const [index, answer] of saved.answers.entries()) {
    const card = cards[index];
    if (card?.mode === 'conjugate' && Array.isArray(answer?.given)) {
      if (!Number.isInteger(card.person) || card.person < 0 || card.person >= PERSONS.length) return null;
      const word = words.find(word => word.id === card.wordId);
      if (!isVerb(word) || answer.given.length !== PERSONS.length || !answer.given.every(form => typeof form === 'string')) return null;
      const forms = PERSONS.map((_, i) => ({ correct: normalize(answer.given[i]).toLocaleLowerCase('de') === word.forms[i].toLocaleLowerCase('de'), expected: word.forms[i], given: normalize(answer.given[i]) }));
      if (!Array.isArray(answer.forms) || answer.forms.length !== PERSONS.length ||
        forms.some((form, i) => !answer.forms[i] || ['correct', 'expected', 'given'].some(key => form[key] !== answer.forms[i][key])) ||
        answer.correct !== forms.every(form => form.correct)) return null;
      const given = answer.given[card.person];
      answers.push({ ...checkAnswer(card, word, given), wordId: word.id, given });
    } else answers.push(answer);
  }
  const current = cards[saved.index];
  const draft = Array.isArray(saved.draft) && current?.mode === 'conjugate' ? saved.draft[current.person] ?? '' : saved.draft;
  return { ...saved, cards, answers, draft };
}

export function readState(raw, starterWords, day = localDay()) {
  let data;
  try { data = JSON.parse(raw); } catch { data = null; }
  const customWords = [];
  const usedIds = new Set(starterWords.map(word => word.id));
  if ([1, 2].includes(data?.version) && Array.isArray(data.customWords)) {
    for (const word of data.customWords.slice(0, 500)) {
      if (validWord(word) && !usedIds.has(word.id)) { customWords.push(word); usedIds.add(word.id); }
    }
  }
  const words = [...starterWords, ...customWords];
  const appMode = APP_MODES.includes(data?.appMode) ? data.appMode : 'nouns';
  const sessions = {};
  for (const mode of APP_MODES) {
    const pool = wordsForMode(words, mode);
    const saved = migrateConjugations(data?.version === 1 && mode === 'nouns' ? data.session : data?.sessions?.[mode], pool);
    const draft = typeof saved?.draft === 'string' ? saved.draft.slice(0, 160) : '';
    sessions[mode] = [1, 2].includes(data?.version) && saved?.day === day && validSession(saved, pool)
      ? { ...saved, draft } : makeSession(words, { day, appMode: mode });
  }
  const state = {
    version: 2, appMode, sessions,
    theme: ['light', 'dark', 'system'].includes(data?.theme) ? data.theme : 'system',
    customWords
  };
  // Preserve the UI's active-session interface; JSON stores each mode independently.
  Object.defineProperty(state, 'session', {
    get() { return this.sessions[this.appMode]; },
    set(session) { this.sessions[this.appMode] = session; }
  });
  return state;
}
