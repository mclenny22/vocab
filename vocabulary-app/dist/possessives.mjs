// Possessive articles before a noun. The owner determines the stem;
// the noun's gender, number and case determine the ending.
export const POSSESSIVE_OWNERS = [
  { id: 'ich', stem: 'mein', english: 'my', cue: 'my' },
  { id: 'du', stem: 'dein', english: 'your', cue: 'your · one person, informal' },
  { id: 'er', stem: 'sein', english: 'his', cue: 'his' },
  { id: 'sie', stem: 'ihr', english: 'her', cue: 'her' },
  { id: 'es', stem: 'sein', english: 'its', cue: 'its' },
  { id: 'wir', stem: 'unser', english: 'our', cue: 'our' },
  { id: 'ihr', stem: 'euer', english: 'your', cue: 'your · several people, informal' },
  { id: 'sie-plural', stem: 'ihr', english: 'their', cue: 'their' },
  { id: 'Sie', stem: 'Ihr', english: 'your', cue: 'your · formal' }
];

export const POSSESSIVE_CASES = ['nominative', 'accusative', 'dative', 'genitive'];
export const POSSESSIVE_GENDERS = ['masculine', 'feminine', 'neuter', 'plural'];
const caseNames = ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'];
const endings = [
  ['', 'e', '', 'e'],
  ['en', 'e', '', 'e'],
  ['em', 'er', 'em', 'en'],
  ['es', 'er', 'es', 'er']
];
const nouns = [
  { article: 'der Vater', forms: ['Vater', 'Vater', 'Vater', 'Vaters'], english: 'father', possessive: "father’s" },
  { article: 'die Mutter', forms: ['Mutter', 'Mutter', 'Mutter', 'Mutter'], english: 'mother', possessive: "mother’s" },
  { article: 'das Kind', forms: ['Kind', 'Kind', 'Kind', 'Kindes'], english: 'child', possessive: "child’s" },
  { article: 'die Freunde', forms: ['Freunde', 'Freunde', 'Freunden', 'Freunde'], english: 'friends', possessive: "friends’" }
];

export function possessiveForm(stem, ending) {
  return `${stem === 'euer' && ending ? 'eur' : stem}${ending}`;
}

export const possessiveWords = POSSESSIVE_OWNERS.flatMap(owner =>
  POSSESSIVE_CASES.flatMap((grammaticalCase, caseIndex) =>
    nouns.map((noun, genderIndex) => {
      const ending = endings[caseIndex][genderIndex];
      const nounForm = noun.forms[caseIndex];
      const answer = possessiveForm(owner.stem, ending);
      const prompt = [
        `Hier ${genderIndex === 3 ? 'sind' : 'ist'} ___ ${nounForm}.`,
        `Ich sehe ___ ${nounForm}.`,
        `Ich spreche mit ___ ${nounForm}.`,
        `Das ist das Auto ___ ${nounForm}.`
      ][caseIndex];
      const english = [
        `Here ${genderIndex === 3 ? 'are' : 'is'} ${owner.english} ${noun.english}.`,
        `I see ${owner.english} ${noun.english}.`,
        `I am speaking with ${owner.english} ${noun.english}.`,
        `This is ${owner.english} ${noun.possessive} car.`
      ][caseIndex];
      // One wrong ending and one wrong owner; never offer two synonymous answers.
      const wrongEnding = possessiveForm(owner.stem, ending === '' ? 'e' : '');
      const otherStem = owner.stem.toLowerCase() === 'mein' ? 'dein' : 'mein';
      return {
        id: `possessive-${owner.id}-${grammaticalCase}-${genderIndex}`,
        kind: 'possessive', owner: owner.id, grammaticalCase,
        gender: POSSESSIVE_GENDERS[genderIndex], variant: caseIndex * nouns.length + genderIndex,
        english, prompt, answer, cue: owner.cue, nounCue: noun.article,
        explanation: `${owner.cue} → ${owner.stem} · ${POSSESSIVE_GENDERS[genderIndex]} · ${caseNames[caseIndex]}${ending ? ` · ending -${ending}` : ' · no ending'}`,
        options: [answer, wrongEnding, possessiveForm(otherStem, ending)]
      };
    })
  )
);
