// Boot for Twin Frames: canvas setup, input wiring, the frame loop, and the
// deterministic ?shot= modes used for screenshots:
//   ?shot=start&seed=1  title / how-to screen
//   ?shot=play&seed=1   mid-game, scene 1, 3 of 5 found
//   ?shot=play&seed=2   mid-game, scene 3, 4 of 9 found
//   ?shot=end&seed=1    win screen with a final score
// The seed only picks which differences are pre-found, so every shot is a
// fixed, reproducible render of the real game.

import { newGame, startGame, startScene, nextScene, registerFind, registerMiss, useHint, pauseGame, tick, currentDiffs } from './game.js';
import { render, W, H } from './render.js';
import { toCanvas, panelAt, hitTest, hitTestFound } from './input.js';
import { unlockAudio } from './audio.js';
import { DIFFS, SCENE_ORDER } from './differences.js';

const canvas = document.getElementById('game');
const statusEl = document.getElementById('status');
const ctx = canvas.getContext('2d');
canvas.width = W;
canvas.height = H;

const g = newGame();
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seed = Number(params.get('seed') || '1');

function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
}

function applyShot() {
  if (!shot) return;
  if (shot === 'start') {
    g.screen = 'title';
    setStatus('Twin Frames — spot the difference. Title screen.');
    return;
  }
  if (shot === 'play') {
    startGame(g);
    const sceneIndex = seed === 2 ? 2 : 0;
    startScene(g, sceneIndex);
    // pre-find a fixed set of differences so the shot shows rings + a
    // counter mid-count (deterministic per seed).
    const diffs = currentDiffs(g);
    const preCount = seed === 2 ? 4 : 3;
    for (let i = 0; i < preCount && i < diffs.length; i++) {
      g.found.add(diffs[i].id);
      g.totalFound += 1;
      g.score += 100;
    }
    g.timeLeft = seed === 2 ? 63 : 74;
    g.screen = 'playing';
    g.lastTick = Date.now();
    setStatus(`Twin Frames — mid-game, scene ${sceneIndex + 1}, ${g.found.size} of ${diffs.length} found.`);
    return;
  }
  if (shot === 'end') {
    startGame(g);
    // play through all four scenes as found, then win.
    let score = 0;
    let lastBonus = 0;
    for (let s = 0; s < SCENE_ORDER.length; s++) {
      startScene(g, s);
      for (const d of currentDiffs(g)) {
        g.found.add(d.id);
        g.totalFound += 1;
        score += 100;
      }
      g.timeLeft = 42 + s * 3;
      const bonus = Math.round(g.timeLeft) * 5;
      lastBonus = bonus;
      g.sceneScores.push({ scene: SCENE_ORDER[s], score: bonus, timeLeft: Math.round(g.timeLeft) });
      score += bonus;
    }
    g.score = score;
    g.timeBonus = lastBonus;
    g.screen = 'won';
    g.endedAt = Date.now();
    setStatus(`Twin Frames — you found them all. Final score ${g.score}.`);
  }
}

function onPointer(clientX, clientY) {
  unlockAudio();
  if (g.screen === 'title') {
    startGame(g);
    setStatus('Game started. Find the differences.');
    return;
  }
  if (g.screen === 'sceneClear') {
    nextScene(g);
    return;
  }
  if (g.screen === 'won' || g.screen === 'lost') {
    startGame(g);
    return;
  }
  if (g.screen !== 'playing') return;
  const p = toCanvas(canvas, clientX, clientY);
  const panel = panelAt(p.x, p.y);
  if (!panel) return;
  const already = hitTestFound(panel, currentDiffs(g), g.found);
  if (already) {
    setStatus(`Already found: ${already.label}.`);
    return;
  }
  const hit = hitTest(panel, currentDiffs(g), g.found);
  if (hit) {
    const hx = panel.side === 'L' ? hit.ax : hit.bx;
    const hy = panel.side === 'L' ? hit.ay : hit.by;
    const px = (panel.side === 'L' ? 20 : 660) + hx;
    registerFind(g, hit, px, 84 + hy);
    setStatus(`Found: ${hit.label}. ${g.found.size} of ${currentDiffs(g).length} found.`);
  } else {
    registerMiss(g, p.x, p.y);
    setStatus(`Not a difference. ${Math.ceil(g.timeLeft)} seconds left.`);
  }
}

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  onPointer(e.clientX, e.clientY);
});

window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'enter' && g.screen === 'title') {
    startGame(g);
    return;
  }
  if (key === 'r') {
    startGame(g);
    setStatus('Game restarted.');
    return;
  }
  if (key === 'p') {
    pauseGame(g);
    return;
  }
  if (key === 'h') {
    useHint(g, Date.now());
    return;
  }
  if (key === 'n' && g.screen === 'sceneClear') {
    nextScene(g);
    return;
  }
  if (key === 'm') {
    import('./audio.js').then((a) => a.setMuted(!a.isMuted()));
  }
});

applyShot();

let lastStatus = '';
function frame(now) {
  tick(g, now);
  render(ctx, g);
  const s = `${g.screen} · scene ${g.sceneIndex + 1} · ${g.found.size}/${currentDiffs(g).length} found · score ${g.score} · ${Math.ceil(g.timeLeft)}s left`;
  if (s !== lastStatus && g.screen === 'playing') {
    lastStatus = s;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
