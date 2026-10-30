// Confetti constants, helpers, launch, physics, and drawing copied verbatim from
// _Website2026_Main/1_PUBLIC_WEB_ROOT/404-game.js. Only the canvas lifecycle
// and frame scheduling below are specific to the vocabulary app.
export function createConfetti(confettiCanvas) {
  const confettiContext = confettiCanvas?.getContext("2d");
  if (!confettiContext) return { launch() {}, clear() {} };

  const BLUE = [0, 119, 255];
  const LIGHT_BLUE = [84, 164, 255];
  const CONFETTI_DENSITY = 0.75;
  const CONFETTI_SIZE = 1;
  const CONFETTI_FORCE = 22;
  const CONFETTI_DRAG = 0.98;
  const CONFETTI_FRAME_DURATION = 1000 / 60;
  let width = 1;
  let height = 1;
  let confetti = [];
  let frameId = null;
  let lastTime = 0;

  function lerp(start, end, progress) {
    return start + (end - start) * progress;
  }

  function randomBetween(start, end) {
    return start + Math.random() * (end - start);
  }

  function launchConfetti() {
    const densityProgress = Math.pow(CONFETTI_DENSITY, 1.5);
    const desktopCount = lerp(20, 140, densityProgress);
    const pieceCount = Math.floor(width < 480
      ? Math.max(Math.sqrt(desktopCount / 30) * 30, 10)
      : desktopCount);
    const delayStep = lerp(35, 10, Math.pow(CONFETTI_DENSITY, 0.2));
    const mobileScale = width < 480 ? 0.7 : 1;
    const minimumWidth = lerp(10, 7, Math.pow(CONFETTI_SIZE, 1.2));
    const maximumWidth = lerp(5, 18, Math.pow(CONFETTI_SIZE, 1.2));
    const minimumHeight = lerp(5, 7, Math.pow(CONFETTI_SIZE, 1.2));
    const maximumHeight = lerp(5, 7, Math.pow(CONFETTI_SIZE, 1.2));
    const emitters = [
      { x: width, y: 0, angle: 120, spread: 100 },
      { x: 0, y: 0, angle: 30, spread: 100 },
    ];

    confetti = emitters.flatMap((emitter) => (
      Array.from({ length: pieceCount }, (_, index) => {
        const launchAngle = randomBetween(
          emitter.angle - emitter.spread / 2,
          emitter.angle + emitter.spread / 2,
        ) * Math.PI / 180;
        return {
          x: emitter.x,
          y: emitter.y,
          vx: Math.cos(launchAngle) * randomBetween(5, CONFETTI_FORCE),
          vy: Math.sin(launchAngle) * randomBetween(5, CONFETTI_FORCE),
          width: randomBetween(minimumWidth, maximumWidth) * mobileScale,
          height: randomBetween(minimumHeight, maximumHeight) * mobileScale,
          rotation: randomBetween(0, Math.PI * 2),
          rotationSpeed: randomBetween(-Math.PI * 2, Math.PI * 2),
          gravity: randomBetween(2, 4.5),
          waveFrequency: randomBetween(1, 6),
          delay: index * delayStep,
          age: 0,
          color: Math.random() < 0.5 ? BLUE : LIGHT_BLUE,
        };
      })
    ));
  }

  function updateConfetti(elapsed) {
    confetti = confetti.filter((piece) => {
      piece.age += elapsed;
      if (piece.age < piece.delay) return true;

      const activeElapsed = Math.min(elapsed, piece.age - piece.delay);
      const activeSeconds = activeElapsed / 1000;
      const activeAge = (piece.age - piece.delay) / 1000;
      const frameScale = activeElapsed / CONFETTI_FRAME_DURATION;
      piece.rotation += piece.rotationSpeed * activeSeconds;
      piece.vy += piece.gravity * activeSeconds * 2;
      piece.vx += randomBetween(2, 4)
        * Math.sin(activeAge * piece.waveFrequency)
        * activeSeconds;
      const drag = Math.pow(CONFETTI_DRAG, frameScale);
      piece.vx *= drag;
      piece.vy *= drag;
      piece.x += piece.vx * frameScale;
      piece.y += piece.vy * frameScale;

      return piece.x >= -20 && piece.x <= width + 20 && piece.y <= height + 20;
    });
  }

  function drawConfetti() {
    confetti.forEach((piece) => {
      if (piece.age < piece.delay) return;

      confettiContext.save();
      confettiContext.globalAlpha = 1;
      confettiContext.fillStyle = `rgb(${piece.color.join(" ")})`;
      confettiContext.translate(piece.x, piece.y);
      confettiContext.rotate(piece.rotation);
      confettiContext.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
      confettiContext.restore();
    });
  }

  function syncCanvasSize() {
    width = Math.max(Math.round(window.innerWidth), 1);
    height = Math.max(Math.round(window.innerHeight), 1);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    confettiCanvas.width = Math.round(width * pixelRatio);
    confettiCanvas.height = Math.round(height * pixelRatio);
    confettiCanvas.style.width = `${width}px`;
    confettiCanvas.style.height = `${height}px`;
    confettiContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function render(now) {
    frameId = null;
    const elapsed = Math.min(Math.max(now - lastTime, 0), 34);
    lastTime = now;
    confettiContext.clearRect(0, 0, width, height);
    drawConfetti();
    updateConfetti(elapsed);
    if (confetti.length) start();
    else confettiContext.clearRect(0, 0, width, height);
  }

  function start() {
    if (frameId !== null || document.hidden || !confetti.length) return;
    frameId = requestAnimationFrame(render);
  }

  function pause() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
  }

  function clear() {
    pause();
    confetti = [];
    confettiContext.clearRect(0, 0, width, height);
  }

  window.addEventListener("resize", () => {
    if (confetti.length) syncCanvasSize();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
    else {
      lastTime = performance.now();
      start();
    }
  });

  return {
    launch() {
      clear();
      syncCanvasSize();
      launchConfetti();
      lastTime = performance.now();
      start();
    },
    clear,
  };
}
