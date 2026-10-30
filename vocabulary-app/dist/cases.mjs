export const CASE_GROUPS = ['accusative', 'dative', 'both'];
export const CASE_LABELS = { accusative: 'Akkusativ', dative: 'Dativ', both: 'Akkusativ + Dativ' };
export const CASE_ARTICLES = ['der', 'die', 'das', 'den', 'dem'];
const dictionaryArticles = { masculine: 'der', feminine: 'die', neuter: 'das', plural: 'die' };
const articles = {
  accusative: { masculine: 'den', feminine: 'die', neuter: 'das', plural: 'die' },
  dative: { masculine: 'dem', feminine: 'der', neuter: 'dem', plural: 'den' }
};

function exercise(id, english, prompt, ...nouns) {
  const slots = nouns.map(([gender, noun, grammaticalCase, nounForm = noun]) => ({
    gender, noun, nounForm, grammaticalCase, answer: articles[grammaticalCase][gender],
    base: `${dictionaryArticles[gender]} ${noun}`
  }));
  return { id: `case-${id}`, kind: 'case', english, prompt, slots,
    grammaticalCase: new Set(slots.map(slot => slot.grammaticalCase)).size === 2 ? 'both' : slots[0].grammaticalCase };
}

export const caseWords = [
  exercise('see-dog', 'I see the dog.', 'Ich sehe ___ Hund.', ['masculine', 'Hund', 'accusative']),
  exercise('buy-book', 'She buys the book.', 'Sie kauft ___ Buch.', ['neuter', 'Buch', 'accusative']),
  exercise('open-door', 'We open the door.', 'Wir öffnen ___ Tür.', ['feminine', 'Tür', 'accusative']),
  exercise('find-key', 'He finds the key.', 'Er findet ___ Schlüssel.', ['masculine', 'Schlüssel', 'accusative']),
  exercise('visit-parents', 'I visit the parents.', 'Ich besuche ___ Eltern.', ['plural', 'Eltern', 'accusative']),
  exercise('drink-coffee', 'You drink the coffee.', 'Du trinkst ___ Kaffee.', ['masculine', 'Kaffee', 'accusative']),
  exercise('read-newspaper', 'He reads the newspaper.', 'Er liest ___ Zeitung.', ['feminine', 'Zeitung', 'accusative']),
  exercise('need-car', 'We need the car.', 'Wir brauchen ___ Auto.', ['neuter', 'Auto', 'accusative']),
  exercise('eat-apple', 'She eats the apple.', 'Sie isst ___ Apfel.', ['masculine', 'Apfel', 'accusative']),
  exercise('see-children', 'You see the children.', 'Du siehst ___ Kinder.', ['plural', 'Kinder', 'accusative']),
  exercise('see-dog-bird', 'I see the dog and the bird.', 'Ich sehe ___ Hund und ___ Vogel.', ['masculine', 'Hund', 'accusative'], ['masculine', 'Vogel', 'accusative']),
  exercise('close-window', 'I close the window.', 'Ich schließe ___ Fenster.', ['neuter', 'Fenster', 'accusative']),

  exercise('help-child', 'I help the child.', 'Ich helfe ___ Kind.', ['neuter', 'Kind', 'dative']),
  exercise('thank-woman', 'He thanks the woman.', 'Er dankt ___ Frau.', ['feminine', 'Frau', 'dative']),
  exercise('follow-man', 'We follow the man.', 'Wir folgen ___ Mann.', ['masculine', 'Mann', 'dative']),
  exercise('speak-children', 'She talks with the children.', 'Sie spricht mit ___ Kindern.', ['plural', 'Kinder', 'dative', 'Kindern']),
  exercise('travel-friend', 'I travel with the friend.', 'Ich reise mit ___ Freund.', ['masculine', 'Freund', 'dative']),
  exercise('from-school', 'He comes from the school.', 'Er kommt aus ___ Schule.', ['feminine', 'Schule', 'dative']),
  exercise('with-car', 'We travel by car.', 'Wir fahren mit ___ Auto.', ['neuter', 'Auto', 'dative']),
  exercise('help-parents', 'You help the parents.', 'Du hilfst ___ Eltern.', ['plural', 'Eltern', 'dative']),
  exercise('at-doctor', 'She is at the doctor’s.', 'Sie ist bei ___ Arzt.', ['masculine', 'Arzt', 'dative']),
  exercise('after-work', 'I cook after work.', 'Ich koche nach ___ Arbeit.', ['feminine', 'Arbeit', 'dative']),
  exercise('with-friends', 'He plays with the friends.', 'Er spielt mit ___ Freunden.', ['plural', 'Freunde', 'dative', 'Freunden']),
  exercise('help-man-child', 'We help the man and the child.', 'Wir helfen ___ Mann und ___ Kind.', ['masculine', 'Mann', 'dative'], ['neuter', 'Kind', 'dative']),

  exercise('give-man-ball', 'I give the man the ball.', 'Ich gebe ___ Mann ___ Ball.', ['masculine', 'Mann', 'dative'], ['masculine', 'Ball', 'accusative']),
  exercise('show-woman-garden', 'She shows the woman the garden.', 'Sie zeigt ___ Frau ___ Garten.', ['feminine', 'Frau', 'dative'], ['masculine', 'Garten', 'accusative']),
  exercise('give-child-book', 'We give the child the book.', 'Wir geben ___ Kind ___ Buch.', ['neuter', 'Kind', 'dative'], ['neuter', 'Buch', 'accusative']),
  exercise('bring-children-ball', 'He brings the children the ball.', 'Er bringt ___ Kindern ___ Ball.', ['plural', 'Kinder', 'dative', 'Kindern'], ['masculine', 'Ball', 'accusative']),
  exercise('show-friend-photo', 'You show the friend the photo.', 'Du zeigst ___ Freund ___ Foto.', ['masculine', 'Freund', 'dative'], ['neuter', 'Foto', 'accusative']),
  exercise('bring-woman-bag', 'I bring the woman the bag.', 'Ich bringe ___ Frau ___ Tasche.', ['feminine', 'Frau', 'dative'], ['feminine', 'Tasche', 'accusative']),
  exercise('give-parents-flowers', 'She gives the parents the flowers.', 'Sie gibt ___ Eltern ___ Blumen.', ['plural', 'Eltern', 'dative'], ['plural', 'Blumen', 'accusative']),
  exercise('show-child-dog', 'He shows the child the dog.', 'Er zeigt ___ Kind ___ Hund.', ['neuter', 'Kind', 'dative'], ['masculine', 'Hund', 'accusative']),
  exercise('bring-man-coffee', 'We bring the man the coffee.', 'Wir bringen ___ Mann ___ Kaffee.', ['masculine', 'Mann', 'dative'], ['masculine', 'Kaffee', 'accusative']),
  exercise('send-friend-letter', 'I send the friend the letter.', 'Ich schicke ___ Freund ___ Brief.', ['masculine', 'Freund', 'dative'], ['masculine', 'Brief', 'accusative']),
  exercise('show-children-house', 'You show the children the house.', 'Du zeigst ___ Kindern ___ Haus.', ['plural', 'Kinder', 'dative', 'Kindern'], ['neuter', 'Haus', 'accusative']),
  exercise('give-child-apple', 'She gives the child the apple.', 'Sie gibt ___ Kind ___ Apfel.', ['neuter', 'Kind', 'dative'], ['masculine', 'Apfel', 'accusative'])
];

export const caseSentence = (word, values = word.slots.map(slot => slot.answer)) => {
  let index = 0;
  return word.prompt.replace(/___/g, () => values[index++] ?? '___');
};

export function validCaseWord(word) {
  return typeof word.prompt === 'string' && word.prompt.length <= 160 && Array.isArray(word.slots) &&
    word.slots.length >= 1 && word.slots.length <= 2 && word.prompt.split('___').length === word.slots.length + 1 &&
    word.slots.every(slot => slot && Object.hasOwn(dictionaryArticles, slot.gender) &&
      ['accusative', 'dative'].includes(slot.grammaticalCase) && slot.answer === articles[slot.grammaticalCase][slot.gender] &&
      ['noun', 'nounForm', 'base'].every(key => typeof slot[key] === 'string' && slot[key].length > 0 && slot[key].length <= 80) &&
      slot.base === `${dictionaryArticles[slot.gender]} ${slot.noun}`) &&
    word.grammaticalCase === (new Set(word.slots.map(slot => slot.grammaticalCase)).size === 2 ? 'both' : word.slots[0].grammaticalCase);
}

// Token indices distinguish two identical article blocks in the same sentence.
export function readCaseDraft(raw, word, choices) {
  const empty = { tokens: word.slots.map(() => null), active: 0, checked: false, mistaken: false };
  let data;
  try { data = JSON.parse(raw); } catch { return empty; }
  if (!data || !Array.isArray(data.tokens) || data.tokens.length !== word.slots.length ||
    data.tokens.some(token => token !== null && (!Number.isInteger(token) || token < 0 || token >= choices.length)) ||
    new Set(data.tokens.filter(token => token !== null)).size !== data.tokens.filter(token => token !== null).length) return empty;
  return { tokens: data.tokens, active: Number.isInteger(data.active) && data.active >= 0 && data.active < word.slots.length ? data.active : 0,
    checked: data.checked === true && data.tokens.every(token => token !== null), mistaken: data.mistaken === true || data.checked === true };
}

export function placeCaseToken(draft, token, choices) {
  if (!Number.isInteger(token) || token < 0 || token >= choices.length || draft.tokens.includes(token)) return draft;
  const target = draft.tokens[draft.active] === null ? draft.active : draft.tokens.indexOf(null);
  if (target < 0) return draft;
  const tokens = [...draft.tokens];
  tokens[target] = token;
  return { ...draft, tokens, checked: false, active: Math.max(0, tokens.indexOf(null)) };
}

export function removeCaseToken(draft, slot) {
  if (!Number.isInteger(slot) || slot < 0 || slot >= draft.tokens.length || draft.tokens[slot] === null) return draft;
  const tokens = [...draft.tokens];
  tokens[slot] = null;
  return { ...draft, tokens, active: slot, checked: false };
}
