import { POSSESSIVE_OWNERS, POSSESSIVE_CASES, POSSESSIVE_GENDERS } from './possessives.mjs';
import { CASE_GROUPS, CASE_ARTICLES, caseSentence, validCaseWord, readCaseDraft } from './cases.mjs';
import { retiredVocabulary, revisedVocabularyIds, previousTranslations } from './retired-vocabulary.mjs';
import { practiceModes, modeInfo, LEVELS, sessionKey, isLegacyGrammarMode } from './topics.mjs';

export const MODES = ['choose', 'type', 'article'];
export const APP_MODES = practiceModes.map(mode => mode.id);
export const PERSONS = ['ich', 'du', 'er / sie / es', 'wir', 'ihr', 'sie / Sie'];
export const CHOICE_PERSONS = ['ich', 'du', 'er', 'wir', 'ihr', 'sie'];
export const SESSION_LENGTH = 15;
export const STORAGE_KEY = 'german-daily.v1';
export const isVerb = word => word?.kind === 'verb';
export const isNoun = word => word?.kind === undefined || word?.kind === 'noun';
export const isGrammar = word => word?.kind === 'grammar';
export const isPossessive = word => word?.kind === 'possessive';
export const isCase = word => word?.kind === 'case';
export const isConjugation = card => card?.mode === 'conjugate' || card?.mode === 'conjugate-choose';
export const practicePersons = word => word.practicePersons ?? PERSONS.map((_, index) => index);
export const conjugationSubject = (card, word) => card.person === 2 && word.thirdPersonSubject === 'es'
  ? 'es' : (card.mode === 'conjugate-choose' ? CHOICE_PERSONS : PERSONS)[card.person];
export const canChooseConjugation = word => isVerb(word) && Array.isArray(word.forms) && new Set(word.forms).size >= 3 &&
  Array.isArray(word.englishForms) && word.englishForms.length === PERSONS.length && word.englishForms.every(form => typeof form === 'string' && form.trim().length > 0 && form.length <= 160);
export const translation = word => isCase(word) ? caseSentence(word) : isPossessive(word) || isGrammar(word) ? word.prompt.replace('___', word.answer) : isVerb(word) ? word.infinitive : isNoun(word) ? `${word.article} ${word.noun}` : word.german;
export function wordsForMode(words, mode, level = 'all') {
  const info = modeInfo(mode);
  return words.filter(word => {
    if (mode === 'cases') return isCase(word);
    if (mode === 'possessives') return isPossessive(word);
    if (level !== 'all' && word.level !== level) return false;
    if (info?.id.startsWith('grammar-')) return isGrammar(word) && word.topic === info.tag;
    if (isPossessive(word) || isCase(word) || isGrammar(word)) return false;
    if (info?.id.startsWith('topic-')) return word.topics?.includes(info.tag);
    if (mode === 'conjugations') return canChooseConjugation(word);
    if (mode === 'nouns') return isNoun(word);
    if (mode === 'verbs') return isVerb(word);
    if (mode === 'adjectives') return ['adjective', 'adverb'].includes(word.kind);
    if (mode === 'phrases') return word.kind === 'phrase';
    if (mode === 'mixed') return isNoun(word) || isVerb(word);
    return mode === 'all-vocabulary';
  });
}
export const expectedAnswer = (card, word) => ['possessive-choose', 'grammar-choose'].includes(card.mode) ? word.answer : isConjugation(card) ? word.forms[card.person] : card.mode === 'article' ? word.article : translation(word);
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

export function makeSession(words, { day = localDay(), batch = 0, ids, modeOffset = 0, appMode = 'nouns', level = 'all', retryModes = {}, retryPersons = {} } = {}) {
  const random = randomFromSeed(`${day}:${batch}:${modeOffset}`);
  const eligible = wordsForMode(words, appMode, level);
  const pool = ids ? eligible.filter(word => ids.includes(word.id)) : eligible;
  const remaining = shuffled(pool, random);
  const length = Math.min(pool.length, ids ? pool.length : SESSION_LENGTH);
  const cards = [];
  let conjugationIndex = 0;
  for (let index = 0; index < length; index++) {
    const phase = (index + modeOffset) % MODES.length;
    const preferVerb = (Math.floor(index / MODES.length) + phase) % 2 === 1;
    let preferred = appMode === 'mixed' ? remaining.findIndex(word => isVerb(word) === preferVerb) : 0;
    if (appMode === 'cases' && !ids) preferred = remaining.findIndex(word => word.grammaticalCase === CASE_GROUPS[index % CASE_GROUPS.length]);
    if (appMode === 'possessives' && !ids) {
      const dayNumber = Math.floor(Date.parse(`${day}T12:00:00Z`) / 86400000);
      const owner = POSSESSIVE_OWNERS[(dayNumber + batch + index) % POSSESSIVE_OWNERS.length].id;
      const variant = (dayNumber + Math.floor(batch / POSSESSIVE_OWNERS.length) * SESSION_LENGTH + index) % (POSSESSIVE_CASES.length * POSSESSIVE_GENDERS.length);
      preferred = remaining.findIndex(word => word.owner === owner && word.variant === variant);
    }
    const [word] = remaining.splice(preferred < 0 ? 0 : preferred, 1);
    const choiceTurn = (Math.floor(Date.parse(`${day}T12:00:00Z`) / 86400000 / 3) + batch + conjugationIndex) % 2 === 0;
    const grammarMode = choiceTurn && canChooseConjugation(word) ? 'conjugate-choose' : 'conjugate';
    const mode = isGrammar(word) ? 'grammar-choose' : appMode === 'cases' ? 'case-complete' : appMode === 'possessives' ? 'possessive-choose' : appMode === 'conjugations' ? 'conjugate-choose' : phase === 2 && isVerb(word) ? grammarMode : phase === 2 && !isNoun(word) ? 'type' : MODES[phase];
    const card = { wordId: word.id, mode: retryModes[word.id] ?? mode };
    // A small topic may have only one phrase or adjective. Ask for typing rather
    // than offering a choice that contains only the answer.
    if (!retryModes[word.id] && card.mode === 'choose' && eligible.filter(item => (item.kind ?? 'noun') === (word.kind ?? 'noun')).length < 3) card.mode = 'type';
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
    if (['choose', 'conjugate-choose', 'possessive-choose', 'grammar-choose', 'case-complete'].includes(card.mode)) card.choices = cardChoices(card, eligible, session);
  }
  return session;
}

export function cardChoices(card, words, session) {
  const word = words.find(item => item.id === card.wordId);
  if (!word) return [];
  if (card.mode === 'article') return ['der', 'die', 'das'];
  if (Array.isArray(card.choices)) return [...card.choices];
  const random = randomFromSeed(`${session.day}:${session.batch}:${word.id}:choices`);
  if (card.mode === 'case-complete') {
    const answers = word.slots.map(slot => slot.answer);
    const alternatives = shuffled(CASE_ARTICLES.filter(article => !answers.includes(article)), random);
    return shuffled([...answers, ...alternatives.slice(0, 4 - answers.length)], random);
  }
  if (['possessive-choose', 'grammar-choose'].includes(card.mode)) return shuffled(word.options, random);
  if (card.mode === 'conjugate-choose') {
    const answer = expectedAnswer(card, word);
    const alternatives = [...new Set(word.forms)].filter(form => form !== answer);
    return shuffled([answer, ...shuffled(alternatives, random).slice(0, 2)], random);
  }
  const answer = translation(word);
  const sessionIds = new Set(session.cards.map(item => item.wordId));
  const sameKind = words.filter(item => (item.kind ?? 'noun') === (word.kind ?? 'noun'));
  const outsideSession = sameKind.filter(item => !sessionIds.has(item.id));
  const pool = outsideSession.length >= 2 ? outsideSession : sameKind.filter(item => item.id !== word.id);
  const alternatives = [...new Set(pool.map(translation))].filter(item => item !== answer);
  return shuffled([answer, ...shuffled(alternatives, random).slice(0, 2)], random);
}

const normalize = text => text.normalize('NFC').trim().replace(/\s+/g, ' ');
// Phrase practice checks the words, not sentence punctuation. Preserve punctuation
// within numbers and apostrophes within words so meaningful differences remain.
const normalizePhrase = text => normalize(text)
  .replace(/^["„“«]+|["“”»]+$/gu, '')
  .replace(/[‘’ʼ]/gu, "'")
  .replace(/[,;:]/gu, (mark, index, source) => /\d/u.test(source[index - 1] ?? '') && /\d/u.test(source[index + 1] ?? '') ? mark : ' ')
  .trim()
  .replace(/[.!?…]+$/gu, '')
  .trim().replace(/\s+/g, ' ');
export function checkAnswer(card, word, rawAnswer) {
  const expected = expectedAnswer(card, word);
  const compare = card.mode === 'type' && word.kind === 'phrase' ? normalizePhrase : normalize;
  const answer = compare(rawAnswer);
  const canonical = compare(expected);
  if (answer === canonical) return { correct: true, note: '' };
  if (!['possessive-choose', 'grammar-choose'].includes(card.mode) && !word.caseSensitive && answer.toLocaleLowerCase('de') === canonical.toLocaleLowerCase('de')) {
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
  if (card.mode === 'case-complete') {
    const draft = readCaseDraft(session.draft, word, cardChoices(card, words, session));
    if (!result.correct) return { ...session, draft: JSON.stringify({ ...draft, checked: true, mistaken: true }) };
    // Keep the first-attempt score so corrected sentences still appear in retries.
    result.correct = !draft.mistaken;
  }
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
  if (isCase(word)) return validCaseWord(word);
  if (isGrammar(word)) return Boolean(modeInfo(`grammar-${word.topic}`)) && ['A1', 'A2'].includes(word.level) &&
    ['prompt', 'answer', 'explanation'].every(key => typeof word[key] === 'string' && word[key].trim().length && word[key].length <= 240) &&
    word.prompt.split('___').length === 2 && Array.isArray(word.options) && word.options.length === 3 &&
    new Set(word.options).size === 3 && word.options.includes(word.answer) &&
    word.options.every(option => typeof option === 'string' && option.trim().length && option.length <= 80);
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
  if (['adjective', 'adverb', 'phrase', 'term'].includes(word.kind)) return typeof word.german === 'string' && word.german.trim().length > 0 && word.german.length <= 160;
  return isNoun(word) && typeof word.noun === 'string' && /^[A-ZÄÖÜ]/u.test(word.noun) && word.noun.length <= 80 && ['der', 'die', 'das'].includes(word.article);
}

function validSession(session, words) {
  if (!session || !/^\d{4}-\d{2}-\d{2}$/.test(session.day) || !Number.isInteger(session.batch) || session.batch < 0 ||
    !Array.isArray(session.cards) || !session.cards.length || session.cards.length > words.length ||
    !Number.isInteger(session.index) || session.index < 0 || session.index > session.cards.length ||
    !Array.isArray(session.answers) || ![session.index, Math.min(session.index + 1, session.cards.length)].includes(session.answers.length)) return false;
  const ids = new Set(words.map(word => word.id));
  const translations = new Set(words.map(translation));
  return session.cards.every(card => {
      if (!card || !ids.has(card.wordId) || ![...MODES, 'conjugate', 'conjugate-choose', 'possessive-choose', 'grammar-choose', 'case-complete'].includes(card.mode)) return false;
      const word = words.find(word => word.id === card.wordId);
      if (isCase(word) || card.mode === 'case-complete') {
        if (!isCase(word) || card.mode !== 'case-complete' || !Array.isArray(card.choices) || card.choices.length !== 4) return false;
        const answers = word.slots.map(slot => slot.answer);
        return card.choices.every(choice => CASE_ARTICLES.includes(choice) &&
          card.choices.filter(value => value === choice).length === Math.max(1, answers.filter(value => value === choice).length)) &&
          answers.every(choice => card.choices.includes(choice));
      }
      return isPossessive(word) === (card.mode === 'possessive-choose') && isGrammar(word) === (card.mode === 'grammar-choose') &&
        (card.mode !== 'article' || isNoun(word)) &&
        (!isConjugation(card) || isVerb(word) && Number.isInteger(card.person) && practicePersons(word).includes(card.person)) &&
        (card.mode !== 'conjugate-choose' || canChooseConjugation(word) && Array.isArray(card.choices)) &&
        (!['possessive-choose', 'grammar-choose'].includes(card.mode) || Array.isArray(card.choices)) &&
        (card.choices === undefined || Array.isArray(card.choices) && card.choices.length >= (card.mode === 'choose' ? 1 : 3) && card.choices.length <= 3 &&
          new Set(card.choices).size === card.choices.length && card.choices.every(choice => ['possessive-choose', 'grammar-choose'].includes(card.mode) ? word.options.includes(choice) : card.mode === 'conjugate-choose' ? word.forms.includes(choice) : translations.has(choice)) &&
          card.choices.includes(expectedAnswer(card, word)));
    }) &&
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

function migrateVocabularySession(saved, words) {
  if (!Array.isArray(saved?.cards) || !Array.isArray(saved.answers) || !Number.isInteger(saved.index) || saved.index < 0 || saved.index > saved.cards.length ||
      ![saved.index, Math.min(saved.index + 1, saved.cards.length)].includes(saved.answers.length)) return saved;
  const byId = new Map(words.map(word => [word.id, word]));
  const removedIds = new Set(retiredVocabulary.map(word => word.id));
  const oldTranslations = new Set([...retiredVocabulary.map(word => word.translation), ...previousTranslations]);
  const currentTranslations = new Set(words.map(translation));
  const kept = saved.cards.map((card, index) => ({ card, index })).filter(({ card }) => {
    const word = byId.get(card?.wordId);
    if (!word && removedIds.has(card?.wordId)) return false;
    return !word || !revisedVocabularyIds.includes(word.id) || !isConjugation(card) || practicePersons(word).includes(card.person);
  });
  const migrated = {
    ...saved,
    cards: kept.map(({ card }) => card),
    answers: kept.filter(({ index }) => index < saved.answers.length).map(({ card, index }) => {
      const answer = saved.answers[index];
      const word = byId.get(card?.wordId);
      if (answer?.correct === false && typeof answer.given === 'string' && card.mode === 'type' && word?.kind === 'phrase') {
        const result = checkAnswer(card, word, answer.given);
        if (result.correct) return { ...answer, ...result };
      }
      return answer;
    }),
    index: kept.filter(({ index }) => index < saved.index).length,
    draft: kept.some(({ index }) => index === saved.index) ? saved.draft : ''
  };
  migrated.cards = migrated.cards.map(card => {
    const word = byId.get(card?.wordId);
    if (!word || !Array.isArray(card.choices)) return card;
    const staleTranslation = card.mode === 'choose' && card.choices.some(choice => oldTranslations.has(choice) && !currentTranslations.has(choice));
    const staleConjugation = card.mode === 'conjugate-choose' && revisedVocabularyIds.includes(word.id) && card.choices.some(choice => !word.forms.includes(choice));
    if (!staleTranslation && !staleConjugation) return card;
    const { choices, ...updated } = card;
    return { ...updated, choices: cardChoices(updated, words, migrated) };
  });
  return migrated;
}

function migratePossessiveSession(saved) {
  if (!Array.isArray(saved?.cards) || !Array.isArray(saved.answers) || !Number.isInteger(saved.index) ||
      saved.index < 0 || saved.index > saved.cards.length ||
      ![saved.index, Math.min(saved.index + 1, saved.cards.length)].includes(saved.answers.length)) return saved;
  const cards = saved.cards.map(card => typeof card?.wordId === 'string' && card.wordId.startsWith('possessive-es-')
    ? { ...card, wordId: card.wordId.replace('possessive-es-', 'possessive-er-') } : card);
  if (cards.every((card, index) => card === saved.cards[index])) return saved;
  // Keep the current question when the old "its" and "his" cards now coincide.
  const indices = new Map();
  cards.forEach((card, index) => {
    if (!indices.has(card?.wordId) || index === saved.index) indices.set(card?.wordId, index);
  });
  const kept = cards.map((card, index) => ({ card, index })).filter(({ card, index }) => indices.get(card?.wordId) === index);
  return {
    ...saved,
    cards: kept.map(({ card }) => card),
    index: kept.filter(({ index }) => index < saved.index).length,
    answers: kept.filter(({ index }) => index < saved.answers.length).map(({ card, index }) => ({ ...saved.answers[index], wordId: card.wordId }))
  };
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
  const level = LEVELS.includes(data?.level) ? data.level : 'all';
  const sessions = {};
  const keys = new Set([...APP_MODES, sessionKey(appMode, level), ...Object.keys(data?.sessions ?? {}).filter(key => {
    const [mode, savedLevel, ...extra] = key.split(':');
    return !extra.length && APP_MODES.includes(mode) && (!savedLevel || ['A1', 'A2'].includes(savedLevel));
  })]);
  for (const key of keys) {
    const [mode, savedLevel = 'all'] = key.split(':');
    const pool = wordsForMode(words, mode, savedLevel);
    const previous = data?.version === 1 && key === 'nouns' ? data.session : data?.sessions?.[key];
    const saved = migrateVocabularySession(migrateConjugations(mode === 'possessives' ? migratePossessiveSession(previous) : previous, pool), pool);
    const draft = typeof saved?.draft === 'string' ? saved.draft.slice(0, 160) : '';
    sessions[key] = [1, 2].includes(data?.version) && saved?.day === day && validSession(saved, pool)
      ? { ...saved, draft } : makeSession(words, { day, appMode: mode, level: savedLevel });
    const current = sessions[key].cards[sessions[key].index];
    if (current?.mode === 'case-complete' && sessions[key].draft) {
      sessions[key].draft = JSON.stringify(readCaseDraft(sessions[key].draft, pool.find(word => word.id === current.wordId), current.choices));
    }
  }
  const state = {
    version: 2, appMode, level, sessions,
    theme: ['light', 'dark', 'system'].includes(data?.theme) ? data.theme : 'system',
    customWords
  };
  // Preserve the UI's active-session interface; JSON stores each mode independently.
  Object.defineProperty(state, 'session', {
    get() {
      const key = sessionKey(this.appMode, this.level);
      return this.sessions[key] ??= makeSession(words, { day, appMode: this.appMode, level: isLegacyGrammarMode(this.appMode) ? 'all' : this.level });
    },
    set(session) { this.sessions[sessionKey(this.appMode, this.level)] = session; }
  });
  return state;
}
