// Sons sintetizados com WebAudio
const Sound = (() => {
  let ctx;
  function tone(freq, dur, type = 'square', vol = 0.05) {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.connect(g).connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + dur);
    } catch (_) {}
  }
  return {
    paddle: () => tone(330, 0.05, 'square', 0.05),
    wall:   () => tone(200, 0.04, 'square', 0.03),
    brick:  (row) => tone(500 + row * 60, 0.06, 'triangle', 0.06),
    hard:   () => tone(150, 0.05, 'sawtooth', 0.05),
    power:  () => [660, 880, 1100].forEach((f, i) => setTimeout(() => tone(f, 0.1, 'triangle', 0.07), i * 60)),
    lose:   () => [300, 200, 120].forEach((f, i) => setTimeout(() => tone(f, 0.25, 'sawtooth', 0.06), i * 140)),
    level:  () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.18, 'square', 0.06), i * 100)),
    over:   () => [400, 300, 200, 100].forEach((f, i) => setTimeout(() => tone(f, 0.3, 'sawtooth', 0.07), i * 180)),
  };
})();
