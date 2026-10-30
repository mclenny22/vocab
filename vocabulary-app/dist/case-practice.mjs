import { caseSentence, readCaseDraft, placeCaseToken, removeCaseToken } from './cases.mjs';

const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const button = (text, className, onClick) => {
  const node = element('button', className, text);
  node.type = 'button';
  node.addEventListener('click', onClick);
  return node;
};

export function renderCasePractice({ word, card, session, face, prompt, controls, onDraft, onCheck, onNext }) {
  const choices = card.choices;
  const draft = readCaseDraft(session.draft, word, choices);
  const completed = !!session.answers[session.index];
  const values = completed ? word.slots.map(slot => slot.answer) : draft.tokens.map(token => token === null ? null : choices[token]);
  face.classList.add('case-prompt-area');
  prompt.classList.add('case-sentence');
  prompt.lang = 'de';
  const parts = word.prompt.split('___');
  prompt.append(document.createTextNode(parts[0]));
  word.slots.forEach((slot, index) => {
    const filled = values[index] !== null;
    const correct = values[index] === slot.answer;
    const className = `case-slot${filled ? ' filled' : draft.active === index ? ' active' : ''}${completed || draft.checked ? correct ? ' correct' : ' incorrect' : ''}`;
    const control = button(filled ? values[index] : '…', className, () => {
      if (filled) onDraft(removeCaseToken(draft, index), `[data-case-token="${draft.tokens[index]}"]`);
      else onDraft({ ...draft, active: index }, `[data-case-slot="${index}"]`);
    });
    control.dataset.caseSlot = index;
    control.disabled = completed;
    control.setAttribute('aria-label', filled ? `${values[index]}, remove from gap ${index + 1}` : `Gap ${index + 1}, select`);
    const following = parts[index + 1];
    const nounEnd = following.indexOf(slot.nounForm) + slot.nounForm.length;
    const suffix = following.slice(nounEnd);
    const punctuation = suffix.match(/^[.,!?;:]+/)?.[0] ?? '';
    const unit = element('span', 'case-unit');
    unit.append(control, document.createTextNode(following.slice(0, nounEnd) + punctuation));
    prompt.append(unit, document.createTextNode(suffix.slice(punctuation.length)));
  });
  face.append(element('p', 'translation', word.english));

  if (!completed) {
    const bank = element('div', 'case-bank');
    bank.lang = 'de';
    bank.setAttribute('role', 'group');
    bank.setAttribute('aria-label', 'Word bank; tap an article to place it');
    choices.forEach((choice, token) => {
      const placed = draft.tokens.includes(token);
      const control = button(choice, `case-tile${placed ? ' placed' : ''}`, () => {
        const updated = placeCaseToken(draft, token, choices);
        const target = updated.tokens.indexOf(token);
        onDraft(updated, `[data-case-slot="${target}"]`);
      });
      control.dataset.caseToken = token;
      control.disabled = placed;
      bank.append(control);
    });
    controls.append(bank);
  }

  if (completed || draft.checked) {
    const feedback = element('div', 'case-feedback');
    const status = element('p', `answer-feedback ${completed ? 'success' : 'error'}`, completed ? '✓ Correct' : 'Try again.');
    status.setAttribute('role', completed ? 'status' : 'alert');
    feedback.append(status);
    if (completed) {
      const changes = element('p', 'case-changes');
      changes.lang = 'de';
      word.slots.forEach(slot => changes.append(element('span', '', `${slot.base} → ${slot.answer} ${slot.nounForm}`)));
      feedback.append(changes);
    }
    controls.append(feedback);
  }

  const action = button(completed ? 'Next' : 'Check', `primary ${completed ? 'next-action' : 'case-check'}`, completed ? onNext : () => onCheck(caseSentence(word, values)));
  action.disabled = !completed && values.some(value => value === null);
  controls.append(action);
  controls.classList.add('case-controls');
}
