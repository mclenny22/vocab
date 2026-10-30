// App-authored teaching groups, informed by the linked Goethe and VHS outlines.
// Level labels describe this app's learning sequence, not official word-by-word CEFR ratings.
export const vocabularyTopics = [
  ['introductions', 'Introductions & personal details', 'Greetings, identity, addresses and forms'],
  ['countries', 'Countries & languages', 'Origins, nationalities and speaking German'],
  ['family', 'Family & relationships', 'Relatives, friends, ages and life events'],
  ['home', 'Home & furniture', 'Rooms, furnishings, rent and moving home'],
  ['routine', 'Daily routine & household', 'Everyday actions, chores and appliances'],
  ['food', 'Food & drink', 'Groceries, ingredients, meals and cooking'],
  ['restaurant', 'Restaurants & cafés', 'Ordering, preferences, service and the bill'],
  ['shopping', 'Shopping & money', 'Shops, prices, quantities and payments'],
  ['clothes', 'Clothing & appearance', 'Clothes, sizes, colours and descriptions'],
  ['city', 'Town & directions', 'Places, buildings, locations and finding the way'],
  ['transport', 'Transport & journeys', 'Tickets, public transport, driving and delays'],
  ['travel', 'Travel & accommodation', 'Holidays, reservations, hotels and luggage'],
  ['work', 'Work & professions', 'Jobs, workplaces, applications and colleagues'],
  ['education', 'School & learning', 'Courses, subjects, classroom language and exams'],
  ['health', 'Body & health', 'Body parts, symptoms, doctors and medicines'],
  ['leisure', 'Leisure, sport & culture', 'Hobbies, entertainment, exercise and interests'],
  ['social', 'Plans, invitations & celebrations', 'Appointments, birthdays, wishes and arrangements'],
  ['media', 'Media & technology', 'Phones, messages, computers and the internet'],
  ['nature', 'Nature, animals & weather', 'Seasons, landscapes, animals and the environment'],
  ['time', 'Time, calendar & frequency', 'Clock times, dates, days, months and routines'],
  ['numbers', 'Numbers, amounts & measures', 'Counting, ordinals, weights and quantities'],
  ['feelings', 'Feelings & descriptions', 'Opinions, emotions, qualities and opposites'],
  ['services', 'Services, authorities & emergencies', 'Post, banking, documents, help and repairs'],
  ['connections', 'Questions & connecting words', 'Pronouns, question words, links and useful adverbs']
].map(([id, label, description]) => ({ id: `topic-${id}`, tag: id, label, description, group: 'Everyday topics' }));

export const grammarTopics = [
  ['articles', 'Articles & plurals', 'Der / die / das, ein / eine and common plural forms'],
  ['pronouns', 'Personal pronouns', 'Subjects and accusative/dative objects'],
  ['questions', 'Questions & negation', 'W-questions, nicht and kein'],
  ['prepositions', 'Prepositions', 'Time, place, movement and two-way prepositions'],
  ['modals', 'Modal & separable verbs', 'Ability, permission, obligation and detached prefixes'],
  ['perfect', 'Past tense · Perfekt', 'Haben/sein, participles and separable verbs'],
  ['past', 'Past tense · Präteritum', 'Sein, haben and modal verbs in the past'],
  ['comparisons', 'Comparisons', 'Comparative and superlative forms'],
  ['adjectives', 'Adjective endings', 'Common endings after der, ein and plural articles'],
  ['word-order', 'Word order & conjunctions', 'Verb position, weil, dass, wenn and deshalb'],
  ['relatives', 'Relative clauses & indirect questions', 'Simple relative pronouns and embedded questions'],
  ['requests', 'Requests, imperatives & reflexives', 'Polite requests, instructions and reflexive pronouns']
].map(([id, label, description]) => ({ id: `grammar-${id}`, tag: id, label, description, group: 'Grammar' }));

export const practiceModes = [
  { id: 'all-vocabulary', label: 'All vocabulary', description: 'Every word type across all everyday topics', group: 'Practice' },
  { id: 'nouns', label: 'Nouns', description: 'Translations, spelling and der / die / das', group: 'Practice' },
  { id: 'verbs', label: 'Verbs', description: 'Infinitives and present-tense forms', group: 'Practice' },
  { id: 'conjugations', label: 'Conjugations', description: 'One present-tense form at a time', group: 'Practice' },
  { id: 'adjectives', label: 'Adjectives & adverbs', description: 'Descriptions, opposites and everyday adverbs', group: 'Practice' },
  { id: 'phrases', label: 'Useful phrases', description: 'Greetings, questions and everyday expressions', group: 'Practice' },
  { id: 'mixed', label: 'Mixed', description: 'A balanced round of nouns and verbs', group: 'Practice' },
  { id: 'possessives', label: 'Possessives', description: 'Owners, cases and possessive endings · includes genitive review', group: 'Grammar' },
  { id: 'cases', label: 'Cases', description: 'Accusative, dative and sentences with both', group: 'Grammar' },
  ...grammarTopics, ...vocabularyTopics
];

export const modeInfo = id => practiceModes.find(mode => mode.id === id);
export const LEVELS = ['all', 'A1', 'A2'];
export const isLegacyGrammarMode = mode => ['possessives', 'cases'].includes(mode);
export const sessionKey = (mode, level = 'all') => level === 'all' || isLegacyGrammarMode(mode) ? mode : `${mode}:${level}`;
