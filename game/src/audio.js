// Sound for Twin Frames: everything synthesized with WebAudio, no audio files.
// A tiny synth: chime on a find, soft buzz on a miss, tick on a hint, a little
// arpeggio on a scene clear and a fanfare on the win.

let ctx = null;
let muted = false;

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

export function unlockAudio() {
  ac();
}

export function setMuted(m) {
  muted = m;
}

export function isMuted() {
  return muted;
}

function tone(freq, at, dur, type, vol) {
  const c = ac();
  if (!c || muted) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime + at);
  g.gain.linearRampToValueAtTime(vol, c.currentTime + at + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + at + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + at);
  o.stop(c.currentTime + at + dur + 0.05);
}

export function playFind() {
  tone(880, 0, 0.18, 'sine', 0.25);
  tone(1318.5, 0.09, 0.28, 'sine', 0.22);
}

export function playMiss() {
  tone(160, 0, 0.18, 'sawtooth', 0.08);
  tone(120, 0.08, 0.2, 'sawtooth', 0.07);
}

export function playHint() {
  tone(1046.5, 0, 0.12, 'triangle', 0.18);
  tone(1046.5, 0.14, 0.12, 'triangle', 0.14);
}

export function playClick() {
  tone(660, 0, 0.06, 'triangle', 0.12);
}

export function playClear() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.22, 'triangle', 0.2));
}

export function playWin() {
  [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568].forEach((f, i) => tone(f, i * 0.11, 0.35, 'triangle', 0.2));
}

export function playLose() {
  [392, 329.63, 261.63, 196].forEach((f, i) => tone(f, i * 0.16, 0.3, 'sine', 0.16));
}

export function playTick() {
  tone(1200, 0, 0.05, 'square', 0.05);
}
