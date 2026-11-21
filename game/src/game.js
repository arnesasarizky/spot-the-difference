// Game state for Twin Frames: screens, score, lives, timer, hints, levels.
// Pure state + rules; render.js draws it, main.js wires input to it.

import { DIFFS, SCENE_ORDER, SCENE_META, diffsFor } from './differences.js';
import { playFind, playMiss, playHint, playClick, playClear, playWin, playLose } from './audio.js';

export const FIND_POINTS = 100;
export const HINT_COST = 50;
export const MISS_TIME_COST = 5;
export const START_LIVES = 3;
export const START_HINTS = 3;

export function newGame() {
  return {
    screen: 'title', // title | playing | sceneClear | paused | won | lost
    sceneIndex: 0,
    found: new Set(),
    score: 0,
    lives: START_LIVES,
    hints: START_HINTS,
    misses: 0,
    timeLeft: SCENE_META[SCENE_ORDER[0]].time,
    timeBonus: 0,
    totalFound: 0,
    sceneScores: [],
    pops: [], // {x, y, text, color, born}
    hintPulse: null, // {diffId, born}
    flash: 0, // red flash timestamp (ms) after a miss
    shake: 0, // shake timestamp (ms) after a miss
    message: '',
    messageUntil: 0,
    startedAt: 0,
    endedAt: 0,
    lastTick: 0,
  };
}

export function currentSceneId(g) {
  return SCENE_ORDER[g.sceneIndex];
}

export function currentDiffs(g) {
  return diffsFor(currentSceneId(g));
}

export function foundCount(g) {
  return g.found.size;
}

export function remainingCount(g) {
  return currentDiffs(g).length - g.found.size;
}

export function startGame(g) {
  const fresh = newGame();
  Object.assign(g, fresh, { screen: 'playing', startedAt: Date.now(), lastTick: Date.now() });
  playClick();
}

export function startScene(g, index) {
  g.sceneIndex = index;
  g.found = new Set();
  g.timeLeft = SCENE_META[SCENE_ORDER[index]].time;
  g.hintPulse = null;
  g.pops = [];
  g.screen = 'playing';
  g.lastTick = Date.now();
}

export function nextScene(g) {
  if (g.sceneIndex + 1 >= SCENE_ORDER.length) {
    finishWin(g);
    return;
  }
  startScene(g, g.sceneIndex + 1);
  playClick();
}

function finishWin(g) {
  g.screen = 'won';
  g.endedAt = Date.now();
  const bonus = Math.round(g.timeLeft) * 5;
  g.timeBonus = bonus;
  g.score += bonus;
  playWin();
}

function finishLose(g, reason) {
  g.screen = 'lost';
  g.endedAt = Date.now();
  g.loseReason = reason;
  playLose();
}

// One found difference: ring, chime, score pop. Returns the diff found.
export function registerFind(g, diff, panelX, panelY) {
  g.found.add(diff.id);
  g.totalFound += 1;
  g.score += FIND_POINTS;
  g.pops.push({ x: panelX, y: panelY, text: `+${FIND_POINTS}`, color: '#ffd94a', born: Date.now() });
  playFind();
  if (g.found.size === currentDiffs(g).length) {
    const bonus = Math.round(g.timeLeft) * 5;
    g.sceneScores.push({ scene: currentSceneId(g), score: bonus, timeLeft: Math.round(g.timeLeft) });
    g.score += bonus;
    g.screen = 'sceneClear';
    playClear();
  }
  return diff;
}

export function registerMiss(g, panelX, panelY) {
  g.misses += 1;
  g.timeLeft = Math.max(0, g.timeLeft - MISS_TIME_COST);
  g.score = Math.max(0, g.score - 25);
  g.flash = Date.now();
  g.shake = Date.now();
  g.pops.push({ x: panelX, y: panelY, text: `-${MISS_TIME_COST}s`, color: '#ff6a5e', born: Date.now() });
  playMiss();
}

export function useHint(g, now) {
  if (g.screen !== 'playing') return false;
  if (g.hints <= 0) {
    g.message = 'No hints left!';
    g.messageUntil = now + 1500;
    return false;
  }
  const unfound = currentDiffs(g).filter((d) => !g.found.has(d.id));
  if (unfound.length === 0) return false;
  const pick = unfound[Math.floor(Math.random() * unfound.length)];
  g.hints -= 1;
  g.score = Math.max(0, g.score - HINT_COST);
  g.hintPulse = { diffId: pick.id, born: now };
  g.message = `Hint: look near the ${pick.label.toLowerCase()} (−${HINT_COST} pts)`;
  g.messageUntil = now + 2500;
  playHint();
  return true;
}

// Advance the countdown. Call every frame with now (ms).
export function tick(g, now) {
  if (g.screen !== 'playing') {
    g.lastTick = now;
    return;
  }
  const dt = Math.max(0, (now - g.lastTick) / 1000);
  g.lastTick = now;
  g.timeLeft -= dt;
  if (g.timeLeft <= 0) {
    g.timeLeft = 0;
    g.lives -= 1;
    if (g.lives <= 0) {
      finishLose(g, 'Time ran out on ' + SCENE_META[currentSceneId(g)].name + '.');
    } else {
      g.message = `Time up! A life is lost — ${g.lives} left. The scene restarts.`;
      g.messageUntil = now + 2500;
      startScene(g, g.sceneIndex);
      playMiss();
    }
  }
  // age out pops
  g.pops = g.pops.filter((p) => now - p.born < 1200);
  if (g.hintPulse && now - g.hintPulse.born > 2600) g.hintPulse = null;
}

export function pauseGame(g) {
  if (g.screen === 'playing') {
    g.screen = 'paused';
    playClick();
  } else if (g.screen === 'paused') {
    g.screen = 'playing';
    g.lastTick = Date.now();
    playClick();
  }
}

export function totalDiffsAll() {
  return SCENE_ORDER.reduce((n, id) => n + DIFFS[id].length, 0);
}
