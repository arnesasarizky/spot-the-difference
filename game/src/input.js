// Click / hit-testing for Twin Frames.
// Maps a canvas click to panel-local coordinates and tests it against the
// still-unfound differences of the current scene. A click counts on either
// panel: the hotspot is checked on the panel that was clicked.

import { PANEL_W, PANEL_H } from './differences.js';

export const PANEL_Y = 84;
export const PANEL_GAP = 40;
export const PANEL_X_LEFT = 20;
export const PANEL_X_RIGHT = PANEL_X_LEFT + PANEL_W + PANEL_GAP;

// Convert a client (page) point to canvas coordinates for a canvas that is
// CSS-scaled to fit its element box.
export function toCanvas(canvas, clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((clientX - r.left) / r.width) * canvas.width,
    y: ((clientY - r.top) / r.height) * canvas.height,
  };
}

// Which panel (if any) holds this canvas point? Returns 'L', 'R', or null,
// plus the point in panel-local coordinates.
export function panelAt(x, y) {
  if (y < PANEL_Y || y > PANEL_Y + PANEL_H) return null;
  const ly = y - PANEL_Y;
  if (x >= PANEL_X_LEFT && x <= PANEL_X_LEFT + PANEL_W) {
    return { side: 'L', lx: x - PANEL_X_LEFT, ly };
  }
  if (x >= PANEL_X_RIGHT && x <= PANEL_X_RIGHT + PANEL_W) {
    return { side: 'R', lx: x - PANEL_X_RIGHT, ly };
  }
  return null;
}

// Test a panel-local point against the unfound differences. A difference is
// found by clicking near its hotspot on EITHER panel (left hotspot on the
// left panel, right hotspot on the right panel).
export function hitTest(panel, diffs, foundIds) {
  let best = null;
  let bestD = Infinity;
  for (const d of diffs) {
    if (foundIds.has(d.id)) continue;
    const hx = panel.side === 'L' ? d.ax : d.bx;
    const hy = panel.side === 'L' ? d.ay : d.by;
    const dx = panel.lx - hx;
    const dy = panel.ly - hy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= d.r && dist < bestD) {
      best = d;
      bestD = dist;
    }
  }
  return best;
}

// Same test, but against differences already found (so re-clicking a ring
// can be ignored instead of punished as a miss).
export function hitTestFound(panel, diffs, foundIds) {
  for (const d of diffs) {
    if (!foundIds.has(d.id)) continue;
    const hx = panel.side === 'L' ? d.ax : d.bx;
    const hy = panel.side === 'L' ? d.ay : d.by;
    const dx = panel.lx - hx;
    const dy = panel.ly - hy;
    if (Math.sqrt(dx * dx + dy * dy) <= d.r + 6) return d;
  }
  return null;
}
