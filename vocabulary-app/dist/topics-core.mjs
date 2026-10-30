export const TOPICS_STORAGE_KEY = 'german-daily.topics.v1';
export const LESSON_LENGTH = 30;
export const LESSON_LIMIT = 12;
export const MAX_RECORDING_SECONDS = 120;
export const MAX_AUDIO_BYTES = 3_500_000;
export const MAX_TOPIC_LENGTH = 6000;

const string = { type: 'string' };
export const LESSON_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['title', 'summary', 'topics', 'questions'],
  properties: {
    title: string, summary: string,
    topics: { type: 'array', minItems: 1, maxItems: 6, items: string },
    questions: {
      type: 'array', minItems: LESSON_LENGTH, maxItems: LESSON_LENGTH,
      items: {
        type: 'object', additionalProperties: false,
        required: ['kind', 'topic', 'prompt', 'translation', 'answer', 'acceptedAnswers', 'options', 'explanation'],
        properties: {
          kind: { type: 'string', enum: ['choice', 'type'] },
          topic: string, prompt: string, translation: string, answer: string,
          acceptedAnswers: { type: 'array', maxItems: 4, items: string },
          options: { type: 'array', maxItems: 3, items: string }, explanation: string
        }
      }
    }
  }
};

const boundedText = (value, max, empty = false) => typeof value === 'string' &&
  value.length <= max && (empty || value.trim().length > 0);
export const normalizeTopicAnswer = value => value.normalize('NFC').trim().replace(/\s+/g, ' ').replace(/[.!?]+$/u, '').toLocaleLowerCase('de');

// Whitelist the complete payload before it enters the UI or local storage.
export function validateLesson(value) {
  if (!value || !boundedText(value.title, 100) || !boundedText(value.summary, 500) ||
      !Array.isArray(value.topics) || !value.topics.length || value.topics.length > 6 ||
      !value.topics.every(topic => boundedText(topic, 80)) ||
      !Array.isArray(value.questions) || value.questions.length !== LESSON_LENGTH) return null;
  const prompts = new Set();
  const questions = [];
  for (const question of value.questions) {
    if (!question || !['choice', 'type'].includes(question.kind) ||
        !boundedText(question.topic, 80) || !boundedText(question.prompt, 240) ||
        !boundedText(question.translation, 240, true) || !boundedText(question.answer, 160) ||
        !boundedText(question.explanation, 450) || !Array.isArray(question.acceptedAnswers) ||
        question.acceptedAnswers.length > 4 || !question.acceptedAnswers.every(answer => boundedText(answer, 160)) ||
        !Array.isArray(question.options) || !question.options.every(option => boundedText(option, 160))) return null;
    if (question.kind === 'choice' && (question.acceptedAnswers.length !== 0 || question.options.length !== 3 ||
        new Set(question.options.map(normalizeTopicAnswer)).size !== 3 || !question.options.includes(question.answer))) return null;
    if (question.kind === 'type' && question.options.length !== 0) return null;
    const signature = `${question.prompt.trim()}|${question.translation.trim()}`;
    if (prompts.has(signature)) return null;
    prompts.add(signature);
    questions.push(Object.fromEntries(['kind', 'topic', 'prompt', 'translation', 'answer', 'acceptedAnswers', 'options', 'explanation']
      .map(key => [key, Array.isArray(question[key]) ? [...question[key]] : question[key].trim()])));
  }
  return { title: value.title.trim(), summary: value.summary.trim(), topics: value.topics.map(topic => topic.trim()), questions };
}

export function newLessonSession(questions, order = questions.map((_, index) => index)) {
  return { order: [...order], index: 0, answers: [], draft: '' };
}

export function answerLesson(lesson, given) {
  const { session, questions } = lesson;
  if (session.index >= session.order.length || session.answers[session.index] || typeof given !== 'string' || !given.trim()) return lesson;
  const question = questions[session.order[session.index]];
  if (question.kind === 'choice' && !question.options.includes(given)) return lesson;
  const correct = [question.answer, ...question.acceptedAnswers].some(answer => normalizeTopicAnswer(answer) === normalizeTopicAnswer(given));
  return { ...lesson, session: { ...session, draft: '', answers: [...session.answers, { given: given.trim().slice(0, 160), correct }] } };
}

export function advanceLesson(lesson) {
  const { session } = lesson;
  return session.answers[session.index]
    ? { ...lesson, session: { ...session, index: session.index + 1, draft: '' } } : lesson;
}

export function readTopicLibrary(raw) {
  let data;
  try { data = JSON.parse(raw); } catch { return { lessons: [], activeId: null, open: false }; }
  const lessons = [];
  for (const saved of (Array.isArray(data?.lessons) ? data.lessons : []).slice(0, LESSON_LIMIT)) {
    const content = validateLesson(saved);
    if (!content || !boundedText(saved.id, 100) || lessons.some(lesson => lesson.id === saved.id) ||
        !boundedText(saved.transcript, MAX_TOPIC_LENGTH) || !Number.isFinite(Date.parse(saved.createdAt))) continue;
    let session = newLessonSession(content.questions);
    const candidate = saved.session;
    if (candidate && Array.isArray(candidate.order) && candidate.order.length > 0 && candidate.order.length <= LESSON_LENGTH &&
        new Set(candidate.order).size === candidate.order.length && candidate.order.every(index => Number.isInteger(index) && index >= 0 && index < LESSON_LENGTH) &&
        Number.isInteger(candidate.index) && candidate.index >= 0 && candidate.index <= candidate.order.length &&
        Array.isArray(candidate.answers) && [candidate.index, Math.min(candidate.index + 1, candidate.order.length)].includes(candidate.answers.length) &&
        candidate.answers.every(answer => answer && typeof answer.correct === 'boolean' && boundedText(answer.given, 160))) {
      session = { order: candidate.order, index: candidate.index, answers: candidate.answers.map((answer, index) => {
        const question = content.questions[candidate.order[index]];
        return { given: answer.given, correct: [question.answer, ...question.acceptedAnswers].some(value => normalizeTopicAnswer(value) === normalizeTopicAnswer(answer.given)) };
      }), draft: typeof candidate.draft === 'string' ? candidate.draft.slice(0, 160) : '' };
    }
    lessons.push({ ...content, id: saved.id, transcript: saved.transcript, createdAt: saved.createdAt, session });
  }
  const activeId = lessons.some(lesson => lesson.id === data?.activeId) ? data.activeId : null;
  return { lessons, activeId, open: Boolean(data?.open && activeId) };
}
