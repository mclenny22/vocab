import { TOPICS_STORAGE_KEY, LESSON_LIMIT, MAX_RECORDING_SECONDS, MAX_AUDIO_BYTES, MAX_TOPIC_LENGTH,
  validateLesson, newLessonSession, answerLesson, advanceLesson, readTopicLibrary } from './topics-core.mjs';

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const button = (text, className, action) => {
  const node = el('button', className, text);
  node.type = 'button';
  node.addEventListener('click', action);
  return node;
};
const timeLabel = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export function createTopicPractice({ practice, trigger, onClose, onOpen, onPerfect }) {
  let library;
  let storageFailed = false;
  try { library = readTopicLibrary(localStorage.getItem(TOPICS_STORAGE_KEY)); }
  catch { library = readTopicLibrary(null); storageFailed = true; }
  let open = library.open;
  let view = open ? 'lesson' : 'compose';
  let phase = 'idle';
  let error = '';
  let note = '';
  let text = '';
  let typed = false;
  let seconds = 0;
  let blob = null;
  let audioURL = null;
  let recorder = null;
  let stream = null;
  let audioContext = null;
  let analyser = null;
  let frame = 0;
  let timer = 0;
  let recordingStarted = 0;
  let operation = 0;
  let requestController = null;
  let config = null;
  let sourceLesson = null;
  let passphrase = '';
  try { passphrase = sessionStorage.getItem('german-daily.topics-passphrase') || ''; } catch { /* Keep it in memory. */ }
  const selectedLesson = () => library.lessons.find(lesson => lesson.id === library.activeId);

  function save() {
    library.open = open && view === 'lesson';
    try { localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(library)); storageFailed = false; }
    catch { storageFailed = true; }
    const warning = practice.querySelector('.topics-storage-warning');
    if (warning) warning.hidden = !storageFailed;
  }

  function releaseMicrophone() {
    clearInterval(timer);
    cancelAnimationFrame(frame);
    stream?.getTracks().forEach(track => track.stop());
    stream = null;
    analyser = null;
    if (audioContext) audioContext.close().catch(() => {});
    audioContext = null;
  }

  function discardRecording() {
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    recorder = null;
    releaseMicrophone();
    blob = null;
    if (audioURL) URL.revokeObjectURL(audioURL);
    audioURL = null;
    seconds = 0;
  }

  function close() {
    operation++;
    requestController?.abort();
    requestController = null;
    discardRecording();
    open = false;
    phase = 'idle';
    trigger.setAttribute('aria-expanded', 'false');
    save();
    onClose();
  }

  function showComposer() {
    view = 'compose';
    phase = 'idle';
    error = '';
    note = '';
    sourceLesson = null;
    save(); render();
  }

  async function show() {
    if (open) { close(); return; }
    open = true;
    view = 'compose';
    phase = 'idle';
    error = '';
    note = '';
    sourceLesson = null;
    trigger.setAttribute('aria-expanded', 'true');
    onOpen(); render();
    practice.querySelector('h1')?.focus({ preventScroll: true });
    const current = operation;
    try {
      const result = await fetch('/api/topics', { cache: 'no-store' });
      if (!result.ok || !result.headers.get('content-type')?.includes('application/json')) throw new Error('unavailable');
      const next = await result.json();
      if (current !== operation || !open) return;
      config = next;
      if (!next.configured) error = 'Topic practice isn’t configured on this server yet. Your saved lessons are still available below.';
      if (view === 'compose' && phase === 'idle') render();
    } catch {
      if (current !== operation || !open) return;
      error = 'The lesson service isn’t available. Please open the app with its backend running. Saved lessons still work.';
      if (view === 'compose' && phase === 'idle') render();
    }
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || !globalThis.MediaRecorder || !globalThis.isSecureContext) {
      typed = true;
      error = 'Voice recording needs microphone access in a secure browser. You can type your topics below.';
      render(); return;
    }
    const current = ++operation;
    discardRecording();
    phase = 'permission'; error = ''; note = ''; render();
    let acquired;
    try {
      acquired = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false });
      if (!open || current !== operation) { acquired.getTracks().forEach(track => track.stop()); return; }
      stream = acquired;
      const mimeType = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus'].find(type => MediaRecorder.isTypeSupported(type));
      recorder = new MediaRecorder(stream, { ...(mimeType ? { mimeType } : {}), audioBitsPerSecond: 64000 });
      const chunks = [];
      let bytes = 0;
      const currentRecorder = recorder;
      currentRecorder.addEventListener('dataavailable', event => {
        if (event.data.size) { chunks.push(event.data); bytes += event.data.size; }
        if (bytes >= MAX_AUDIO_BYTES - 100_000 && currentRecorder.state === 'recording') {
          note = 'Your recording reached the size limit and is ready to send.';
          currentRecorder.stop();
        }
      });
      currentRecorder.addEventListener('stop', () => {
        releaseMicrophone();
        if (!open || current !== operation) return;
        blob = new Blob(chunks, { type: currentRecorder.mimeType || chunks[0]?.type || 'audio/webm' });
        recorder = null;
        if (!blob.size || blob.size > MAX_AUDIO_BYTES) {
          blob = null; phase = 'idle'; error = 'That recording couldn’t be saved. Please try a shorter one.';
        } else {
          audioURL = URL.createObjectURL(blob);
          phase = 'recorded';
        }
        render();
      });
      currentRecorder.addEventListener('error', () => {
        if (current !== operation) return;
        operation++;
        discardRecording(); phase = 'idle'; error = 'Recording was interrupted. Please try again or type your topics.'; render();
      });
      const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (AudioContext) {
        try {
          audioContext = new AudioContext();
          await audioContext.resume();
          if (current !== operation || !open) { releaseMicrophone(); return; }
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 128;
          analyser.smoothingTimeConstant = .75;
          audioContext.createMediaStreamSource(stream).connect(analyser);
        } catch { /* Recording still works without a visual analyser. */ }
      }
      recordingStarted = performance.now();
      phase = 'recording';
      currentRecorder.start(250);
      stream.getAudioTracks()[0]?.addEventListener('ended', stopRecording);
      timer = setInterval(() => {
        seconds = Math.min(MAX_RECORDING_SECONDS, Math.floor((performance.now() - recordingStarted) / 1000));
        const counter = practice.querySelector('.recording-time');
        if (counter) counter.textContent = timeLabel(seconds);
        if (seconds >= MAX_RECORDING_SECONDS) stopRecording();
      }, 200);
      render(); animateWave();
    } catch (failure) {
      acquired?.getTracks().forEach(track => track.stop());
      if (current !== operation || !open) return;
      discardRecording(); phase = 'idle'; typed = true;
      error = failure?.name === 'NotAllowedError' ? 'Microphone access was declined. Allow it in your browser, or type your topics below.' : 'The microphone couldn’t start. Please try again, or type your topics below.';
      render();
    }
  }

  function stopRecording() {
    if (recorder?.state !== 'recording') return;
    seconds = Math.min(MAX_RECORDING_SECONDS, Math.floor((performance.now() - recordingStarted) / 1000));
    phase = 'stopping';
    recorder.stop();
    releaseMicrophone();
    render();
  }

  function animateWave() {
    if (phase !== 'recording' || !open) return;
    const bars = practice.querySelectorAll('.voice-bar');
    const values = new Uint8Array(analyser?.frequencyBinCount || 64);
    analyser?.getByteFrequencyData(values);
    bars.forEach((bar, index) => {
      const envelope = Math.sin(Math.PI * (index + 1) / (bars.length + 1));
      const magnitude = values[Math.floor(index * values.length / bars.length)] / 255;
      bar.style.height = `${6 + (magnitude || 0) * 82 * envelope}px`;
    });
    frame = requestAnimationFrame(animateWave);
  }

  async function api(body, isAudio = false) {
    const result = await fetch('/api/topics', {
      method: 'POST', signal: requestController.signal,
      headers: { 'X-Vocab-Request': 'topics', ...(passphrase ? { 'X-Topics-Passphrase': passphrase } : {}), ...(!isAudio ? { 'Content-Type': 'application/json' } : {}) },
      body: isAudio ? body : JSON.stringify(body)
    });
    let data;
    try { data = await result.json(); } catch { throw new Error('The lesson service couldn’t be reached. Please check that the app’s backend is running.'); }
    if (!result.ok) {
      if (result.status === 401) {
        config = { ...config, requiresPassphrase: true };
        passphrase = '';
        try { sessionStorage.removeItem('german-daily.topics-passphrase'); } catch { /* Optional storage. */ }
      }
      throw new Error(typeof data.error === 'string' ? data.error : 'The lesson couldn’t be prepared. Please try again.');
    }
    return data;
  }

  async function prepare({ audio = false, source = null } = {}) {
    if (['preparing', 'transcribing'].includes(phase)) return;
    if (config?.requiresPassphrase && !passphrase.trim()) { error = 'Enter the practice passphrase below first.'; render(); practice.querySelector('.topics-passphrase')?.focus(); return; }
    if (!audio && text.trim().length < 3 && !source) { error = 'Tell me a little about the topics you want to practise.'; render(); return; }
    sourceLesson = source;
    const previousText = text;
    const current = ++operation;
    requestController = new AbortController();
    phase = audio ? 'transcribing' : 'preparing';
    error = ''; note = ''; view = 'compose'; render();
    try {
      let transcript = source?.transcript || text.trim();
      if (audio) {
        const form = new FormData();
        form.set('audio', blob, 'topics');
        const result = await api(form, true);
        if (current !== operation) return;
        transcript = result.transcript;
        text = transcript; // Keep a usable transcript if generation fails or is cancelled.
        phase = 'preparing'; render();
      }
      const result = await api({ text: transcript, previousPrompts: source?.questions.map(question => question.prompt) || [] });
      if (!open || current !== operation) return;
      const content = validateLesson(result.lesson);
      if (!content) throw new Error('The lesson couldn’t be checked. Please try again.');
      const questions = content.questions.map(question => ({ ...question, options: shuffle(question.options) }));
      const lesson = { ...content, questions, transcript, id: source?.id || crypto.randomUUID(), createdAt: new Date().toISOString(), session: newLessonSession(questions) };
      library.lessons = [lesson, ...library.lessons.filter(item => item.id !== lesson.id)].slice(0, LESSON_LIMIT);
      library.activeId = lesson.id;
      phase = 'idle'; view = 'lesson'; typed = false; text = ''; sourceLesson = null;
      discardRecording(); save(); render();
      practice.querySelector('h1')?.focus({ preventScroll: true });
    } catch (failure) {
      if (current !== operation || !open) return;
      phase = blob ? 'recorded' : 'idle';
      error = failure?.name === 'AbortError' ? 'Preparation cancelled. Your topics are still here.' : failure.message;
      if (text && text !== previousText) typed = true;
      render();
    } finally {
      if (current === operation) requestController = null;
    }
  }

  function cancelPreparation() {
    operation++;
    requestController?.abort(); requestController = null;
    phase = blob ? 'recorded' : 'idle';
    note = 'Cancelled.';
    if (text) typed = true;
    render();
  }

  function shuffle(values) {
    const items = [...values];
    for (let index = items.length - 1; index > 0; index--) {
      const next = Math.floor(Math.random() * (index + 1));
      [items[index], items[next]] = [items[next], items[index]];
    }
    return items;
  }

  function updateLesson(lesson) {
    library.lessons = library.lessons.map(item => item.id === lesson.id ? lesson : item);
    save();
  }

  function submit(given) {
    const lesson = selectedLesson();
    if (!lesson) return;
    const updated = answerLesson(lesson, given);
    if (updated === lesson) return;
    updateLesson(updated); render();
    practice.querySelector('.next-action')?.focus({ preventScroll: true });
  }

  function nextQuestion() {
    const lesson = selectedLesson();
    const updated = advanceLesson(lesson);
    if (updated === lesson) return;
    updateLesson(updated); render();
    if (updated.session.index === updated.session.order.length && updated.session.answers.every(answer => answer.correct)) onPerfect();
    (practice.querySelector('.answer-input') || practice.querySelector('h1'))?.focus({ preventScroll: true });
  }

  function openSaved(lesson) {
    if (lesson.session.index === lesson.session.order.length) {
      text = lesson.transcript;
      prepare({ source: lesson });
      return;
    }
    library.activeId = lesson.id;
    view = 'lesson'; error = ''; save(); render();
    practice.querySelector('h1')?.focus({ preventScroll: true });
  }

  function base(label, actionLabel, action) {
    practice.replaceChildren();
    practice.classList.remove('completion');
    practice.classList.add('topics-card');
    const top = el('div', 'study-top');
    top.append(el('span', '', label), button(actionLabel, 'topic-text-button', action));
    practice.append(top);
    const warning = el('p', 'storage-error topics-storage-warning', 'This browser couldn’t save your lesson. Keep this tab open to continue.');
    warning.setAttribute('role', 'status'); warning.hidden = !storageFailed;
    practice.append(warning);
  }

  function render() {
    if (!open) return;
    trigger.setAttribute('aria-expanded', 'true');
    if (view === 'lesson' && selectedLesson()) { renderLesson(selectedLesson()); return; }
    base('My topics', 'Back', close);
    if (phase === 'preparing' || phase === 'transcribing') { renderPreparing(); return; }
    const face = el('div', 'topics-intro');
    const headline = el('h1', 'prompt topics-headline', 'What would you like to practise?');
    headline.tabIndex = -1;
    face.append(headline);
    const visual = el('div', `voice-visual ${phase === 'recording' ? 'is-recording' : ''}`);
    visual.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < 37; index++) {
      const bar = el('span', 'voice-bar');
      bar.style.height = `${6 + Math.pow(Math.sin(Math.PI * (index + 1) / 38), 1.8) * (15 + 28 * Math.abs(Math.sin(index * 1.7)))}px`;
      visual.append(bar);
    }
    const timerText = el('p', 'recording-time', timeLabel(seconds));
    timerText.title = 'Up to 2 minutes';
    const status = el('p', 'sr-only', { idle: 'Ready to record', permission: 'Waiting for microphone access', recording: 'Recording', stopping: 'Finishing recording', recorded: 'Ready to send' }[phase]);
    status.setAttribute('role', 'status');
    face.append(visual, timerText, status);
    if (typed) { visual.hidden = true; timerText.hidden = true; }
    practice.append(face);
    if (blob && audioURL && !typed) {
      const audio = el('audio', 'recording-preview');
      audio.controls = true; audio.src = audioURL; audio.preload = 'metadata';
      audio.setAttribute('aria-label', 'Listen to your recording');
      practice.append(audio);
    }
    const controls = el('div', 'controls');
    if (phase === 'recording') controls.append(button('Stop', 'primary stop-recording', stopRecording));
    else if (phase === 'permission' || phase === 'stopping') {
      const pending = button(phase === 'permission' ? 'Opening microphone…' : 'Finishing…', 'primary', () => {});
      pending.disabled = true; controls.append(pending);
      if (phase === 'permission') controls.append(button('Cancel', 'secondary', () => { operation++; discardRecording(); phase = 'idle'; render(); }));
    } else if (blob) {
      controls.append(button('Send', 'primary send-recording', () => prepare({ audio: true })), button('Record again', 'secondary', startRecording));
    } else controls.append(button('Record', 'primary start-recording', startRecording));
    controls.hidden = typed;
    practice.append(controls);
    if (!['recording', 'permission', 'stopping'].includes(phase)) {
      const writeToggle = button(typed ? 'Use voice' : 'Type instead', 'topic-text-button type-toggle', () => { typed = !typed; render(); if (typed) practice.querySelector('textarea')?.focus(); });
      writeToggle.setAttribute('aria-expanded', String(typed));
      if (!typed) practice.append(writeToggle);
      if (typed) {
        const form = el('form', 'controls topic-writing');
        const label = el('label', 'sr-only', 'What would you like to practise?');
        label.htmlFor = 'written-topics';
        const input = el('textarea', 'topic-input');
        input.id = 'written-topics'; input.name = 'topics'; input.rows = 4; input.maxLength = MAX_TOPIC_LENGTH;
        input.placeholder = 'Dative, shopping vocabulary…';
        input.value = text; input.required = true; input.minLength = 3;
        input.addEventListener('input', () => { text = input.value; });
        const send = el('button', 'primary', 'Prepare lesson'); send.type = 'submit';
        form.append(label, input, send);
        form.addEventListener('submit', event => { event.preventDefault(); prepare(); });
        practice.append(form, writeToggle);
      }
      if (config?.requiresPassphrase && !passphrase) {
        const label = el('label', 'passphrase-label', 'Practice passphrase');
        label.htmlFor = 'topics-passphrase';
        const input = el('input', 'answer-input topics-passphrase');
        input.id = 'topics-passphrase'; input.type = 'password'; input.autocomplete = 'current-password'; input.value = passphrase; input.maxLength = 200;
        input.addEventListener('input', () => {
          passphrase = input.value;
          try { sessionStorage.setItem('german-daily.topics-passphrase', passphrase); } catch { /* Optional storage. */ }
        });
        practice.append(label, input);
      }
    }
    if (error) {
      const message = el('p', 'storage-error topic-error', error); message.setAttribute('role', 'alert'); practice.append(message);
      if (sourceLesson) practice.append(button('Try these topics again', 'secondary topic-retry', () => prepare({ source: sourceLesson })));
    }
    if (note) { const message = el('p', 'topic-note', note); message.setAttribute('role', 'status'); practice.append(message); }
    practice.append(el('p', 'topics-privacy', 'Sent to OpenAI · Saved on this device'));
    if (!['recording', 'permission', 'stopping'].includes(phase)) renderRecent();
  }

  function renderPreparing() {
    const face = el('div', 'topics-preparing');
    face.setAttribute('role', 'status'); face.setAttribute('aria-live', 'polite');
    const animation = el('div', 'lesson-orbit'); animation.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < 3; index++) animation.append(el('span', ''));
    const title = el('h1', 'prompt topics-headline', phase === 'transcribing' ? 'Listening back…' : 'Preparing your lesson…');
    title.tabIndex = -1;
    face.append(animation, title);
    practice.append(face, button('Cancel', 'secondary', cancelPreparation));
  }

  function renderRecent() {
    if (!library.lessons.length) return;
    const details = el('details', 'recent-topics');
    const summary = el('summary', '', `Recent topics · ${library.lessons.length}`);
    details.append(summary);
    for (const lesson of library.lessons) {
      const row = el('div', 'recent-topic');
      const complete = lesson.session.index === lesson.session.order.length;
      const action = button('', 'recent-topic-open', () => openSaved(lesson));
      action.append(el('span', 'recent-topic-title', lesson.title), el('span', 'recent-topic-meta', complete ? 'New lesson ↗' : `Continue · ${lesson.session.index}/${lesson.session.order.length} →`));
      const remove = button('×', 'recent-topic-delete', () => {
        library.lessons = library.lessons.filter(item => item.id !== lesson.id);
        if (library.activeId === lesson.id) library.activeId = null;
        save(); render();
        const recent = practice.querySelector('.recent-topics');
        if (recent) recent.open = true;
      });
      remove.setAttribute('aria-label', `Delete saved topics: ${lesson.title}`);
      row.append(action, remove); details.append(row);
    }
    practice.append(details);
  }

  function renderLesson(lesson) {
    const { session } = lesson;
    const question = lesson.questions[session.order[session.index]];
    base('My topics', 'Topics', showComposer);
    if (!question) {
      practice.classList.add('completion');
      const face = el('div', 'prompt-area');
      const headline = el('h1', 'prompt', 'Lesson complete.'); headline.tabIndex = -1;
      const correct = session.answers.filter(answer => answer.correct).length;
      face.append(headline, el('p', 'translation', `${correct} of ${session.order.length} correct`), el('p', 'topic-lesson-title', lesson.title));
      practice.append(face, button('New lesson', 'primary', () => { text = lesson.transcript; prepare({ source: lesson }); }));
      const saved = el('details', 'topic-lesson-details');
      saved.append(el('summary', '', 'Your topics'), el('p', '', lesson.summary), el('p', 'saved-transcript', lesson.transcript));
      practice.append(saved);
      return;
    }
    const progress = el('div', 'study-top topic-lesson-progress');
    progress.append(el('span', '', question.topic), el('span', 'counter', `${session.index + 1} / ${session.order.length}`));
    const track = el('div', 'progress-track'); track.setAttribute('aria-hidden', 'true');
    const fill = el('div', 'progress-fill'); fill.style.width = `${session.index / session.order.length * 100}%`; track.append(fill);
    const face = el('div', 'prompt-area topic-question-area');
    const prompt = el('h1', 'prompt sentence-prompt', question.prompt); prompt.tabIndex = -1;
    face.append(prompt);
    if (question.translation) face.append(el('p', 'translation', question.translation));
    const controls = el('div', 'controls');
    practice.append(progress, track, face, controls);
    const answer = session.answers[session.index];
    if (question.kind === 'choice') {
      for (const option of question.options) {
        const choice = button(option, 'choice', () => submit(option)); choice.lang = 'de';
        if (answer) {
          choice.disabled = true;
          if (option === question.answer) { choice.classList.add('correct'); choice.append(el('span', '', '✓')); }
          else if (option === answer.given) { choice.classList.add('incorrect'); choice.append(el('span', '', '×')); }
          else choice.classList.add('muted');
        }
        controls.append(choice);
      }
    } else {
      const form = el('form', 'controls');
      const input = el('input', 'answer-input');
      input.type = 'text'; input.maxLength = 160; input.autocomplete = 'off'; input.autocapitalize = 'off'; input.spellcheck = false; input.lang = 'de';
      input.name = 'answer'; input.required = true; input.placeholder = 'Your answer in German'; input.setAttribute('aria-label', 'Your answer in German');
      input.value = answer ? answer.given : session.draft;
      input.addEventListener('input', () => { lesson.session.draft = input.value; updateLesson(lesson); });
      form.addEventListener('submit', event => { event.preventDefault(); submit(input.value); });
      form.append(input);
      if (answer) { input.disabled = true; input.classList.add(answer.correct ? 'correct' : 'incorrect'); }
      else {
        const characters = el('div', 'characters');
        for (const char of ['ä', 'ö', 'ü', 'ß']) characters.append(button(char, 'character', () => {
          input.setRangeText(char, input.selectionStart ?? input.value.length, input.selectionEnd ?? input.value.length, 'end');
          input.dispatchEvent(new Event('input')); input.focus({ preventScroll: true });
        }));
        const check = el('button', 'primary', 'Check'); check.type = 'submit';
        form.append(characters, check);
      }
      controls.append(form);
    }
    if (answer) {
      const feedback = el('p', `answer-feedback ${answer.correct ? 'success' : 'error'}`, answer.correct ? '✓ Correct' : `Not quite · ${question.answer}`);
      feedback.setAttribute('role', 'status');
      const explanation = el('details', 'topic-explanation');
      explanation.append(el('summary', '', 'Why?'), el('p', 'grammar-feedback', question.explanation));
      practice.append(feedback, explanation, button(session.index === session.order.length - 1 ? 'Finish' : 'Next', 'primary next-action', nextQuestion));
    }
  }

  trigger.addEventListener('click', show);
  document.addEventListener('visibilitychange', () => { if (document.hidden && phase === 'recording') stopRecording(); });
  window.addEventListener('pagehide', () => { operation++; requestController?.abort(); discardRecording(); });
  window.addEventListener('storage', event => {
    if (event.key !== TOPICS_STORAGE_KEY || ['recording', 'permission', 'preparing', 'transcribing'].includes(phase)) return;
    library = readTopicLibrary(event.newValue);
    if (open) render();
  });
  if (open) { onOpen(); render(); }
  return { get isOpen() { return open; }, close };
}
