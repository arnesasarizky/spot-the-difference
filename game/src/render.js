// Rendering for Twin Frames: HUD, the two panels, found rings, hint pulse,
// score pops, and the title / scene-clear / win / lose / pause overlays.
// Canvas is a fixed 1280 x 800; CSS scales it to the window.

import { PANEL_W, PANEL_H, SCENE_META, diffsFor } from './differences.js';
import { PANEL_Y, PANEL_X_LEFT, PANEL_X_RIGHT } from './input.js';
import { paintScene } from './scenes.js';
import { currentSceneId, currentDiffs, foundCount, remainingCount } from './game.js';

export const W = 1280;
export const H = 800;

const FONT_TITLE = 'bold 44px system-ui, -apple-system, "Segoe UI", sans-serif';
const FONT_BIG = 'bold 26px system-ui, -apple-system, "Segoe UI", sans-serif';
const FONT_MED = 'bold 18px system-ui, -apple-system, "Segoe UI", sans-serif';
const FONT_SMALL = '15px system-ui, -apple-system, "Segoe UI", sans-serif';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawPanel(ctx, g, side, px) {
  ctx.save();
  // frame
  rr(ctx, px - 4, PANEL_Y - 4, PANEL_W + 8, PANEL_H + 8, 14);
  ctx.fillStyle = '#1c2438';
  ctx.fill();
  ctx.save();
  ctx.translate(px, PANEL_Y);
  paintScene(ctx, currentSceneId(g), PANEL_W, PANEL_H, side);
  ctx.restore();
  // found rings on this panel
  const now = Date.now();
  for (const d of currentDiffs(g)) {
    if (!g.found.has(d.id)) continue;
    const hx = px + (side === 'L' ? d.ax : d.bx);
    const hy = PANEL_Y + (side === 'L' ? d.ay : d.by);
    ctx.beginPath(); ctx.arc(hx, hy, d.r + 6, 0, Math.PI * 2);
    ctx.strokeStyle = '#ff3b30'; ctx.lineWidth = 5; ctx.stroke();
    ctx.beginPath(); ctx.arc(hx, hy, d.r + 11, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#ff3b30';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('✓', hx, hy);
  }
  // hint pulse on this panel
  if (g.hintPulse) {
    const d = currentDiffs(g).find((x) => x.id === g.hintPulse.diffId);
    if (d) {
      const age = (now - g.hintPulse.born) / 1000;
      const pulse = (Math.sin(age * 5) + 1) / 2;
      const hx = px + (side === 'L' ? d.ax : d.bx);
      const hy = PANEL_Y + (side === 'L' ? d.ay : d.by);
      ctx.beginPath(); ctx.arc(hx, hy, d.r + 6 + pulse * 10, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,217,74,${0.95 - pulse * 0.4})`;
      ctx.lineWidth = 4; ctx.stroke();
    }
  }
  // panel tag
  ctx.fillStyle = 'rgba(10,14,26,0.85)';
  rr(ctx, px + 10, PANEL_Y + 10, 34, 30, 8); ctx.fill();
  ctx.fillStyle = '#ffd94a'; ctx.font = FONT_MED; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(side === 'L' ? 'A' : 'B', px + 27, PANEL_Y + 26);
  ctx.restore();
}

function drawHUD(ctx, g) {
  const meta = SCENE_META[currentSceneId(g)];
  const total = currentDiffs(g).length;
  const found = foundCount(g);
  const left = remainingCount(g);
  // bar background
  ctx.fillStyle = '#121828';
  ctx.fillRect(0, 0, W, 64);
  ctx.fillStyle = '#ffd94a';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillText('TWIN FRAMES', 20, 24);
  ctx.fillStyle = '#9fb2d8';
  ctx.font = FONT_SMALL;
  ctx.fillText('Spot the Difference', 20, 46);
  // scene name
  ctx.fillStyle = '#ffffff';
  ctx.font = FONT_MED;
  ctx.textAlign = 'center';
  ctx.fillText(meta.name, W / 2, 22);
  ctx.fillStyle = '#9fb2d8';
  ctx.font = FONT_SMALL;
  ctx.fillText(meta.sub, W / 2, 44);
  // counter — the unmissable line
  ctx.fillStyle = '#ffd94a';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${found} of ${total} found — ${left} to go`, W - 240, 24);
  ctx.fillStyle = '#ffffff';
  ctx.font = FONT_MED;
  ctx.fillText(`Score ${g.score}`, W - 240, 46);
  // lives + hints, far right
  ctx.textAlign = 'left';
  let lx = W - 210;
  ctx.font = '20px system-ui, sans-serif';
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < g.lives ? '#ff5a5a' : '#3a4358';
    ctx.fillText('♥', lx + i * 26, 32);
  }
  ctx.fillStyle = '#ffd94a';
  ctx.fillText(`💡 ${g.hints}`, lx, 52);
  // timer bar
  const frac = Math.max(0, g.timeLeft / meta.time);
  ctx.fillStyle = '#2a3348';
  ctx.fillRect(0, 64, W, 10);
  ctx.fillStyle = frac > 0.33 ? '#37c978' : frac > 0.15 ? '#f2a65e' : '#ff5a5a';
  ctx.fillRect(0, 64, W * frac, 10);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`${Math.ceil(g.timeLeft)}s left`, 12, 69);
  // footer hint line
  ctx.fillStyle = '#8fa0bf';
  ctx.font = FONT_SMALL;
  ctx.textAlign = 'center';
  ctx.fillText('Click a difference on either picture  ·  H hint (−50)  ·  P pause  ·  R restart  ·  N next scene', W / 2, 768);
  // transient message
  const now = Date.now();
  if (g.message && now < g.messageUntil) {
    ctx.fillStyle = 'rgba(10,14,26,0.9)';
    const tw = ctx.measureText(g.message).width;
    rr(ctx, W / 2 - tw / 2 - 16, 700, tw + 32, 34, 10); ctx.fill();
    ctx.fillStyle = '#ffd94a';
    ctx.font = FONT_MED;
    ctx.fillText(g.message, W / 2, 718);
  }
  // score pops
  for (const p of g.pops) {
    const age = (now - p.born) / 1200;
    if (age > 1) continue;
    ctx.globalAlpha = 1 - age;
    ctx.fillStyle = p.color;
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.text, p.x, p.y - age * 40);
    ctx.globalAlpha = 1;
  }
}

function overlay(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(8,11,22,0.82)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = accent;
  ctx.font = FONT_TITLE;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(title, W / 2, 250);
  ctx.fillStyle = '#ffffff';
  ctx.font = FONT_BIG;
  let y = 330;
  for (const ln of lines) {
    ctx.fillText(ln, W / 2, y);
    y += 44;
  }
}

function drawTitle(ctx, g) {
  // backdrop: harbour scene, dimmed, both panels
  ctx.fillStyle = '#121828';
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.translate(PANEL_X_LEFT, PANEL_Y);
  paintScene(ctx, 'harbour', PANEL_W, PANEL_H, 'L');
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.translate(PANEL_X_RIGHT, PANEL_Y);
  paintScene(ctx, 'harbour', PANEL_W, PANEL_H, 'R');
  ctx.restore();
  ctx.fillStyle = 'rgba(8,11,22,0.72)';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ffd94a';
  ctx.font = 'bold 64px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('TWIN FRAMES', W / 2, 180);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.fillText('Spot the Difference', W / 2, 236);
  ctx.font = FONT_BIG;
  ctx.fillStyle = '#c8d4ec';
  const lines = [
    'Two pictures. Almost the same. Find every difference.',
    '4 scenes · 5 → 7 → 9 differences · 3 lives · 3 hints',
    'Click a difference on either picture — rings mark your finds.',
    'Wrong clicks cost 5 seconds. Beat the clock, keep your lives.',
  ];
  let y = 320;
  for (const ln of lines) {
    ctx.fillText(ln, W / 2, y);
    y += 40;
  }
  ctx.fillStyle = '#ffd94a';
  ctx.font = 'bold 28px system-ui, sans-serif';
  ctx.fillText('Click or press Enter to start', W / 2, 540);
  ctx.fillStyle = '#8fa0bf';
  ctx.font = FONT_SMALL;
  ctx.fillText('H hint (−50 pts) · P pause · R restart · N next scene after a clear', W / 2, 600);
}

export function render(ctx, g) {
  const now = Date.now();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0b0f1c';
  ctx.fillRect(0, 0, W, H);
  // shake on a recent miss
  ctx.save();
  if (g.shake && now - g.shake < 250) {
    const s = (now - g.shake) / 250;
    ctx.translate((Math.random() - 0.5) * 10 * (1 - s), (Math.random() - 0.5) * 10 * (1 - s));
  }
  if (g.screen === 'title') {
    drawTitle(ctx, g);
  } else if (g.screen === 'won') {
    drawHUD(ctx, g);
    drawPanel(ctx, g, 'L', PANEL_X_LEFT);
    drawPanel(ctx, g, 'R', PANEL_X_RIGHT);
    overlay(ctx, 'YOU FOUND THEM ALL!', [
      `Total score: ${g.score}  (includes +${g.timeBonus} time bonus)`,
      `${g.totalFound} of ${diffsFor('harbour').length + diffsFor('camp').length + diffsFor('station').length + diffsFor('market').length} differences found · ${g.misses} wrong clicks`,
      'Press R to play again',
    ], '#37c978');
  } else if (g.screen === 'lost') {
    drawHUD(ctx, g);
    drawPanel(ctx, g, 'L', PANEL_X_LEFT);
    drawPanel(ctx, g, 'R', PANEL_X_RIGHT);
    overlay(ctx, 'GAME OVER', [
      g.loseReason || 'Out of lives.',
      `Score: ${g.score} · ${g.totalFound} differences found`,
      'Press R to try again',
    ], '#ff5a5a');
  } else if (g.screen === 'sceneClear') {
    drawHUD(ctx, g);
    drawPanel(ctx, g, 'L', PANEL_X_LEFT);
    drawPanel(ctx, g, 'R', PANEL_X_RIGHT);
    const last = g.sceneScores[g.sceneScores.length - 1];
    overlay(ctx, 'SCENE CLEAR!', [
      `${SCENE_META[currentSceneId(g)].name} — all ${currentDiffs(g).length} differences found`,
      `Time bonus: +${last ? last.score : 0}  ·  Score: ${g.score}`,
      g.sceneIndex + 1 < 4 ? 'Press N for the next scene' : 'Press N for your final score',
    ], '#ffd94a');
  } else {
    // playing or paused
    drawHUD(ctx, g);
    drawPanel(ctx, g, 'L', PANEL_X_LEFT);
    drawPanel(ctx, g, 'R', PANEL_X_RIGHT);
    if (g.screen === 'paused') {
      overlay(ctx, 'PAUSED', ['Press P to resume', `Score: ${g.score}`], '#9fb2d8');
    }
  }
  // red flash on a recent miss
  if (g.flash && now - g.flash < 300) {
    ctx.fillStyle = `rgba(255,60,50,${0.18 * (1 - (now - g.flash) / 300)})`;
    ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
}
