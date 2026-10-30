import { starterWords } from './deck.mjs';
import { createConfetti } from './confetti.mjs';
import { CASE_LABELS } from './cases.mjs';
import { renderCasePractice } from './case-practice.mjs';
import { practiceModes, modeInfo } from './topics.mjs';
import { MODES, STORAGE_KEY, isVerb, isNoun, isGrammar, isConjugation, conjugationSubject, translation, expectedAnswer, localDay, makeSession, cardChoices, answerCard, advanceCard, missedWords, readState, wordsForMode } from './core.mjs';

const practice = document.getElementById('practice');
const confetti = createConfetti(document.getElementById('session-confetti'));
const storageError = document.getElementById('storage-error');
const themeToggle = document.getElementById('theme-toggle');
const modeTrigger = document.getElementById('app-mode');
const modeMenu = document.getElementById('mode-menu');
const modeOptions = document.getElementById('mode-options');
const topicSearch = document.getElementById('topic-search');
const levelItems = [...modeMenu.querySelectorAll('[data-level]')];
let raw = null;
try { raw = localStorage.getItem(STORAGE_KEY); } catch { storageError.hidden = false; }
let state = readState(raw, starterWords);
const words = () => [...starterWords, ...state.customWords];
const element = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
};
const button = (label, className, onClick) => {
  const el = element('button', className, label);
  el.type = 'button';
  el.addEventListener('click', onClick);
  return el;
};
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageError.hidden = true; }
  catch { storageError.hidden = false; }
}
function applyTheme() {
  if (state.theme === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = state.theme;
  const dark = state.theme === 'dark' || state.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches;
  themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  document.querySelector('meta[name="theme-color"]').content = dark ? '#151619' : '#fafaf9';
}
themeToggle.addEventListener('click', () => {
  const dark = getComputedStyle(document.documentElement).colorScheme === 'dark';
  state.theme = dark ? 'light' : 'dark';
  applyTheme(); save();
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

function ensureToday() {
  if (state.session.day === localDay()) return true;
  state.session = makeSession(words(), { appMode: state.appMode, level: state.level });
  save(); render();
  return false;
}
function submit(value) {
  if (!ensureToday() || !value.trim()) return;
  state.session = answerCard(state.session, words(), value);
  save(); render();
  (practice.querySelector('.next-action') || practice.querySelector('.case-slot.incorrect'))?.focus({ preventScroll: true });
}
function next() {
  if (!ensureToday()) return;
  const previousIndex = state.session.index;
  state.session = advanceCard(state.session);
  save(); render();
  if (previousIndex < state.session.cards.length && state.session.index === state.session.cards.length &&
      state.session.answers.every(answer => answer.correct)) confetti.launch();
  const target = practice.querySelector('.answer-input') || practice.querySelector('.prompt');
  target?.focus({ preventScroll: true });
}
function startSession(retryOnly = false) {
  const previous = state.session;
  state.session = makeSession(words(), {
    day: localDay(), batch: previous.batch + 1,
    appMode: state.appMode,
    level: state.level,
    ids: retryOnly ? missedWords(previous) : undefined,
    retryModes: retryOnly ? Object.fromEntries(previous.cards.map(card => [card.wordId, card.mode])) : {},
    retryPersons: retryOnly ? Object.fromEntries(previous.cards.filter(isConjugation).map(card => [card.wordId, card.person])) : {},
    modeOffset: ((isConjugation(previous.cards.at(-1)) ? 2 : MODES.indexOf(previous.cards.at(-1)?.mode)) + 1) % MODES.length
  });
  save(); render();
  practice.querySelector('.prompt')?.focus({ preventScroll: true });
}
function render() {
  const info = modeInfo(state.appMode);
  const modeLabel = info.label;
  modeTrigger.querySelector('.filter-label').textContent = modeLabel;
  modeTrigger.setAttribute('aria-label', `Topic: ${modeLabel}`);
  renderModeOptions();
  const session = state.session;
  const card = session.cards[session.index];
  const word = card ? words().find(item => item.id === card.wordId) : null;
  if (card) confetti.clear();
  practice.replaceChildren();
  practice.classList.toggle('completion', !card);
  if (!session.cards.length) {
    practice.append(element('h1', 'prompt', 'No exercises at this level.'), button('Use A1–A2', 'primary', () => { state.level = 'all'; ensureToday(); save(); render(); }));
    return;
  }
  const top = element('div', 'study-top');
  top.append(element('span', '', card?.mode === 'case-complete' ? CASE_LABELS[word.grammaticalCase] : card ? { choose: 'Choose', type: 'Type', article: 'Article', conjugate: 'Conjugate', 'conjugate-choose': 'Conjugate', 'possessive-choose': 'Possessive', 'grammar-choose': 'Complete' }[card.mode] : 'Today'));
  const counter = element('span', 'counter', `${Math.min(session.index + 1, session.cards.length)} / ${session.cards.length}`);
  counter.setAttribute('aria-label', card ? `Card ${session.index + 1} of ${session.cards.length}` : `${session.cards.length} cards completed`);
  top.append(counter);
  const track = element('div', 'progress-track');
  track.setAttribute('aria-hidden', 'true');
  const fill = element('div', 'progress-fill');
  fill.style.width = `${session.index / session.cards.length * 100}%`;
  track.append(fill);
  practice.append(top, track);
  const face = element('div', 'prompt-area');
  const prompt = element('h1', 'prompt');
  prompt.tabIndex = -1;
  face.append(prompt);
  const controls = element('div', 'controls');
  practice.append(face, controls);
  if (!card) {
    prompt.textContent = 'Done for today.';
    const correct = session.answers.filter(answer => answer.correct).length;
    face.append(element('p', 'translation', `${correct} of ${session.cards.length} correct`));
    const missed = missedWords(session);
    if (missed.length) controls.append(button(`Practice ${missed.length} again`, 'primary', () => startSession(true)));
    controls.append(button('More practice', missed.length ? 'secondary' : 'primary', () => startSession()));
    return;
  }
  const answer = session.answers[session.index];
  if (card.mode === 'case-complete') {
    renderCasePractice({ word, card, session, face, prompt, controls, onCheck: submit, onNext: next,
      onDraft(draft, focusSelector) {
        if (!ensureToday()) return;
        state.session = { ...state.session, draft: JSON.stringify(draft) };
        save(); render();
        practice.querySelector(focusSelector)?.focus({ preventScroll: true });
      }
    });
    return;
  }
  prompt.textContent = isConjugation(card) ? `${conjugationSubject(card, word)} ___` : card.mode === 'article' ? answer ? translation(word) : `___ ${word.noun}` : word.english;
  if (card.mode === 'article') {
    prompt.lang = 'de';
    face.append(element('p', 'translation', word.english));
  }
  if (isConjugation(card)) {
    prompt.lang = 'de';
    face.append(element('p', 'translation', card.mode === 'conjugate-choose' ? word.englishForms[card.person] : `${word.infinitive} · present`));
  }
  if (card.mode === 'possessive-choose' || isGrammar(word)) {
    prompt.lang = 'de';
    prompt.classList.add('sentence-prompt');
    prompt.textContent = answer ? translation(word) : word.prompt;
    face.append(element('p', 'translation', word.english));
    if (card.mode === 'possessive-choose') face.append(element('p', 'grammar-cue', `${word.cue} · ${word.nounCue}`));
  }
  if (['choose', 'article', 'conjugate-choose', 'possessive-choose', 'grammar-choose'].includes(card.mode)) {
    controls.classList.toggle('article-options', card.mode === 'article');
    const expected = expectedAnswer(card, word);
    for (const choice of cardChoices(card, words(), session)) {
      const control = button(choice, 'choice', () => submit(choice));
      control.lang = 'de';
      if (answer) {
        control.disabled = true;
        if (choice === expected) {
          control.classList.add('correct');
          control.append(element('span', '', '✓'));
          control.setAttribute('aria-label', `${choice}, correct answer`);
        } else if (choice === answer.given) {
          control.classList.add('incorrect');
          control.append(element('span', '', '×'));
          control.setAttribute('aria-label', `${choice}, incorrect answer`);
        } else control.classList.add('muted');
      }
      controls.append(control);
    }
  } else {
    const form = element('form', 'controls');
    const input = element('input', 'answer-input');
    input.type = 'text'; input.name = 'answer'; input.lang = 'de'; input.maxLength = 160;
    input.placeholder = card.mode === 'conjugate' ? 'Verb form' : isVerb(word) ? 'German verb' : isNoun(word) ? 'German + article' : word.kind === 'phrase' ? 'German phrase' : 'German word'; input.autocomplete = 'off'; input.autocapitalize = 'off'; input.spellcheck = false;
    input.setAttribute('aria-label', card.mode === 'conjugate' ? `${conjugationSubject(card, word)} — ${word.infinitive}` : isNoun(word) ? 'German word with article' : input.placeholder);
    input.required = true;
    input.value = answer ? answer.given : session.draft;
    input.addEventListener('input', () => { state.session.draft = input.value; save(); });
    form.addEventListener('submit', event => { event.preventDefault(); submit(input.value); });
    form.append(input);
    if (!answer) {
      const characters = element('div', 'characters');
      for (const char of ['ä', 'ö', 'ü', 'ß']) {
        const key = button(char, 'character', () => {
          const start = input.selectionStart ?? input.value.length;
          const end = input.selectionEnd ?? start;
          input.setRangeText(char, start, end, 'end');
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.focus({ preventScroll: true });
        });
        key.setAttribute('aria-label', `Insert ${char}`);
        characters.append(key);
      }
      const check = element('button', 'primary', 'Check');
      check.type = 'submit';
      form.append(characters, check);
    } else {
      input.disabled = true;
      input.classList.add(answer.correct ? 'correct' : 'incorrect');
      const result = element('p', `answer-feedback ${answer.correct ? 'success' : 'error'}`);
      result.setAttribute('role', 'status');
      result.textContent = answer.correct ? `✓ Correct${answer.note ? ` · ${answer.note}` : ''}` : `✕ Not quite · ${answer.note}`;
      result.setAttribute('aria-label', answer.correct ? answer.note ? `Correct. Spelling: ${answer.note}` : 'Correct' : `Correct answer: ${answer.note}`);
      form.append(result);
    }
    controls.append(form);
  }
  if (answer) {
    if (card.mode === 'possessive-choose' || isGrammar(word)) {
      const feedback = element('p', 'grammar-feedback', word.explanation);
      feedback.setAttribute('role', 'status');
      practice.append(feedback);
    }
    if (card.mode !== 'type' && card.mode !== 'conjugate') {
      const status = element('span', 'sr-only', answer.correct ? 'Correct' : `Correct answer: ${expectedAnswer(card, word)}`);
      status.setAttribute('role', 'status');
      practice.append(status);
    }
    practice.append(button('Next', 'primary next-action', next));
  }
}

function renderModeOptions() {
  const query = topicSearch.value.trim().toLocaleLowerCase();
  const matches = practiceModes.filter(info => `${info.label} ${info.description}`.toLocaleLowerCase().includes(query));
  modeOptions.replaceChildren();
  for (const levelButton of levelItems) levelButton.setAttribute('aria-pressed', String(levelButton.dataset.level === state.level));
  const groups = ['Practice', 'Everyday topics', 'Grammar'];
  for (const group of groups) {
    const items = matches.filter(info => info.group === group);
    if (!items.length) continue;
    const section = element('div', 'picker-group');
    section.setAttribute('role', 'group');
    section.setAttribute('aria-label', group);
    const heading = element('p', 'picker-heading', group === 'Everyday topics' ? 'Topics' : group);
    heading.setAttribute('aria-hidden', 'true');
    section.append(heading);
    for (const info of items) {
      const count = wordsForMode(words(), info.id, state.level).length;
      const item = button('', 'topic-option', () => {
        state.appMode = info.id;
        closeModeMenu(true); ensureToday(); save(); render();
      });
      item.setAttribute('role', 'menuitemradio');
      item.setAttribute('aria-checked', String(info.id === state.appMode));
      item.setAttribute('aria-label', `${info.label}, ${count} ${group === 'Grammar' ? 'exercises' : 'words and phrases'}`);
      item.dataset.appMode = info.id;
      item.tabIndex = -1;
      item.append(element('span', 'topic-option-title', info.label));
      const total = element('span', 'topic-count', String(count));
      total.setAttribute('aria-hidden', 'true');
      item.append(total);
      const check = element('span', 'picker-check', '✓');
      check.setAttribute('aria-hidden', 'true');
      check.style.visibility = info.id === state.appMode ? 'visible' : 'hidden';
      item.append(check);
      section.append(item);
    }
    modeOptions.append(section);
  }
  if (!matches.length) {
    const empty = element('p', 'picker-empty', 'No topics found.');
    empty.setAttribute('role', 'status');
    modeOptions.append(empty);
  }
}
function closeModeMenu(restoreFocus = false) {
  modeMenu.hidden = true;
  modeTrigger.setAttribute('aria-expanded', 'false');
  if (restoreFocus) modeTrigger.focus({ preventScroll: true });
}
function openModeMenu(position = 'search') {
  topicSearch.value = '';
  renderModeOptions();
  modeMenu.hidden = false;
  modeTrigger.setAttribute('aria-expanded', 'true');
  const items = [...modeOptions.querySelectorAll('button')];
  (position === 'first' ? items[0] : position === 'last' ? items.at(-1) : topicSearch)?.focus();
}
topicSearch.addEventListener('input', renderModeOptions);
for (const item of levelItems) item.addEventListener('click', () => {
  state.level = item.dataset.level;
  ensureToday(); save(); render();
});
modeTrigger.addEventListener('click', () => modeMenu.hidden ? openModeMenu() : closeModeMenu(true));
modeTrigger.addEventListener('keydown', event => {
  if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
  event.preventDefault(); openModeMenu(event.key === 'ArrowDown' ? 'first' : 'last');
});
modeMenu.addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeModeMenu(true); return; }
  if (event.target.closest('.level-picker')) return;
  if (event.target === topicSearch && !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const items = [...modeOptions.querySelectorAll('button')];
  const current = items.indexOf(document.activeElement);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
  items[next]?.focus();
});
modeMenu.addEventListener('focusout', event => {
  if (event.relatedTarget && !modeMenu.contains(event.relatedTarget) && event.relatedTarget !== modeTrigger) closeModeMenu();
});
document.addEventListener('click', event => {
  if (!modeMenu.hidden && !event.target.closest('.mode-picker')) closeModeMenu();
});
document.addEventListener('visibilitychange', () => { if (!document.hidden) ensureToday(); });
window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY) return;
  state = readState(event.newValue, starterWords);
  applyTheme(); render();
});
applyTheme(); render(); save();
