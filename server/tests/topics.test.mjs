import test from 'node:test';
import assert from 'node:assert/strict';
import { createTopicsHandler } from '../topics.mjs';
import { validateLesson, readTopicLibrary, newLessonSession, answerLesson, advanceLesson } from '../../vocabulary-app/dist/topics-core.mjs';

function fixture() {
  return {
    title: 'Dative practice', summary: 'Practise dative articles.', topics: ['Dative'],
    questions: Array.from({ length: 30 }, (_, index) => ({
      kind: index % 3 === 0 ? 'type' : 'choice', topic: 'Dative',
      prompt: `Complete sentence ${index + 1}: Ich fahre mit ___ Bus.`, translation: 'I travel by bus.',
      answer: 'dem', acceptedAnswers: [], options: index % 3 === 0 ? [] : ['den', 'dem', 'der'],
      explanation: 'Mit takes the dative; der Bus becomes dem Bus.'
    }))
  };
}
const env = { OPENAI_API_KEY: 'test-only-secret', VERCEL: '1', TOPICS_PASSPHRASE: 'private-practice' };
const request = (data = { text: 'Dative prepositions and shopping' }, headers = {}) => new Request('https://vocab.example/api/topics', {
  method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Vocab-Request': 'topics', 'X-Topics-Passphrase': env.TOPICS_PASSPHRASE, Origin: 'https://vocab.example', ...headers }, body: JSON.stringify(data)
});
const response = lesson => Response.json({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(lesson) }] }] });

test('production generation requires a configured secret and passphrase, with same-origin requests', async () => {
  let calls = 0;
  const handle = createTopicsHandler({ env, fetchImpl: async () => { calls++; return response(fixture()); } });
  assert.equal((await handle(request({}, { 'X-Topics-Passphrase': '' }))).status, 401);
  assert.equal((await handle(request({}, { Origin: 'https://other.example' }))).status, 403);
  assert.equal((await handle(request({}, { 'X-Vocab-Request': '' }))).status, 403);
  assert.equal(calls, 0);
  assert.equal((await createTopicsHandler({ env: { OPENAI_API_KEY: env.OPENAI_API_KEY, VERCEL: '1' } })(request())).status, 503);
  assert.equal((await createTopicsHandler({ env: {} })(request())).status, 503);
  const config = await (await handle(new Request('https://vocab.example/api/topics'))).json();
  assert.deepEqual(config, { configured: true, requiresPassphrase: true });
  assert.ok(!JSON.stringify(config).includes(env.OPENAI_API_KEY));
});

test('a lesson uses structured output, keeps provider storage disabled, and carries earlier prompts for regeneration', async () => {
  let payload;
  const handle = createTopicsHandler({ env, fetchImpl: async (url, options) => {
    assert.equal(url, 'https://api.openai.com/v1/responses');
    assert.equal(options.headers.Authorization, `Bearer ${env.OPENAI_API_KEY}`);
    payload = JSON.parse(options.body);
    return response(fixture());
  } });
  const result = await handle(request({ text: 'Dative prepositions', previousPrompts: ['An earlier prompt'] }));
  assert.equal(result.status, 200);
  const data = await result.json();
  assert.equal(data.lesson.questions.length, 30);
  assert.equal(data.transcript, 'Dative prepositions');
  assert.equal(payload.store, false);
  assert.equal(payload.model, 'gpt-6-luna');
  assert.equal(payload.reasoning.effort, 'none');
  assert.equal(payload.text.format.strict, true);
  assert.equal(payload.text.format.schema.properties.questions.minItems, 30);
  assert.match(payload.input, /An earlier prompt/);
});

test('audio uploads are forwarded with a recognized filename, never saved to disk, and return a transcript', async () => {
  const handle = createTopicsHandler({ env, fetchImpl: async (url, options) => {
    assert.equal(url, 'https://api.openai.com/v1/audio/transcriptions');
    assert.equal(options.body.get('file').name, 'topics.webm');
    assert.equal(options.body.get('model'), 'gpt-4o-mini-transcribe');
    return Response.json({ text: '  Heute haben wir Dativ gelernt.  ' });
  } });
  const form = new FormData();
  form.set('audio', new Blob([new Uint8Array(256)], { type: 'audio/webm;codecs=opus' }), 'topics');
  const result = await handle(new Request('https://vocab.example/api/topics', { method: 'POST', headers: { 'X-Vocab-Request': 'topics', 'X-Topics-Passphrase': env.TOPICS_PASSPHRASE }, body: form }));
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { transcript: 'Heute haben wir Dativ gelernt.' });
});

test('invalid topic text and oversized bodies never call the provider', async () => {
  const handle = createTopicsHandler({ env, fetchImpl: () => { throw new Error('must not call provider'); } });
  for (const text of ['', 'a', 42, 'x'.repeat(6001)]) assert.equal((await handle(request({ text }))).status, 400);
  assert.equal((await handle(request({}, { 'Content-Length': '4000000' }))).status, 413);
});

test('bad questions, partial output and refusals cannot become a practice session', async () => {
  for (const mutate of [
    lesson => lesson.questions.pop(),
    lesson => { lesson.questions[1].options = ['dem', 'dem', 'den']; },
    lesson => { lesson.questions[1].options = ['den', 'der', 'das']; },
    lesson => { lesson.questions[1].prompt = lesson.questions[0].prompt; }
  ]) {
    const lesson = fixture(); mutate(lesson);
    assert.equal(validateLesson(lesson), null);
    const handle = createTopicsHandler({ env, fetchImpl: async () => response(lesson) });
    assert.equal((await handle(request())).status, 502);
  }
  const incomplete = createTopicsHandler({ env, fetchImpl: async () => Response.json({ status: 'incomplete', output: [] }) });
  assert.equal((await incomplete(request())).status, 502);
  const refusal = createTopicsHandler({ env, fetchImpl: async () => Response.json({ output: [{ type: 'message', content: [{ type: 'refusal', refusal: 'No' }] }] }) });
  assert.equal((await refusal(request())).status, 400);
});

test('upstream credential details never appear in client errors', async () => {
  const handle = createTopicsHandler({ env, fetchImpl: async () => Response.json({ error: `Invalid API key ${env.OPENAI_API_KEY}` }, { status: 401 }) });
  const result = await handle(request());
  assert.equal(result.status, 503);
  assert.ok(!(await result.text()).includes(env.OPENAI_API_KEY));
});

test('an invalid lesson is repaired once with validation feedback, while preserving the topic scope and deadline', async () => {
  const malformed = fixture();
  malformed.questions[2].prompt = malformed.questions[1].prompt;
  let calls = 0;
  let firstSignal;
  const handle = createTopicsHandler({ env, fetchImpl: async (url, options) => {
    calls++;
    const payload = JSON.parse(options.body);
    if (calls === 1) {
      assert.equal(payload.reasoning.effort, 'none');
      firstSignal = options.signal;
      return response(malformed);
    }
    assert.equal(options.signal, firstSignal);
    assert.equal(payload.reasoning.effort, 'low');
    assert.match(payload.input[0].content, /Dative prepositions and shopping/);
    assert.match(payload.input[2].content, /Question 3 repeats an earlier prompt/);
    assert.equal(payload.store, false);
    return response(fixture());
  } });
  const result = await handle(request());
  assert.equal(result.status, 200);
  assert.equal(calls, 2);
  assert.equal((await result.json()).lesson.questions.length, 30);
});

test('an in-flight request blocks duplicate generation and the guard releases after failure', async () => {
  let release;
  let calls = 0;
  const handle = createTopicsHandler({ env, fetchImpl: async () => { calls++; if (calls === 1) return new Promise(resolve => { release = resolve; }); return response(fixture()); } });
  const pending = handle(request());
  while (!release) await new Promise(resolve => setImmediate(resolve));
  assert.equal((await handle(request())).status, 429);
  release(Response.json({}, { status: 500 }));
  assert.equal((await pending).status, 502);
  assert.equal((await handle(request())).status, 200);
});

test('30-step grading survives reload, wrong answers count once, and damaged saves recover', () => {
  let lesson = { ...fixture(), id: 'test-lesson', transcript: 'Dative prepositions', createdAt: '2026-10-30T15:00:00Z' };
  lesson.session = newLessonSession(lesson.questions);
  assert.equal(advanceLesson(lesson), lesson);
  lesson = answerLesson(lesson, 'DEM');
  assert.equal(lesson.session.answers[0].correct, true);
  assert.equal(answerLesson(lesson, 'den'), lesson);
  lesson = advanceLesson(lesson);
  lesson = answerLesson(lesson, 'den');
  assert.equal(lesson.session.answers[1].correct, false);
  const raw = JSON.stringify({ lessons: [lesson], activeId: lesson.id, open: true });
  const restored = readTopicLibrary(raw);
  assert.deepEqual(restored.lessons[0], lesson);
  assert.equal(restored.open, true);
  lesson = advanceLesson(lesson);
  while (lesson.session.index < 30) lesson = advanceLesson(answerLesson(lesson, 'dem'));
  assert.equal(lesson.session.answers.filter(answer => answer.correct).length, 29);
  assert.equal(lesson.session.index, 30);
  lesson.session.order = [999];
  assert.equal(readTopicLibrary(JSON.stringify({ lessons: [lesson] })).lessons[0].session.index, 0);
  assert.deepEqual(readTopicLibrary('{broken'), { lessons: [], activeId: null, open: false });
});
