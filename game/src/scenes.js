// Scene painters for Twin Frames. Every scene is drawn twice — once per panel —
// from ONE description: paint(ctx, W, H, side) with side 'L' or 'R'. The base
// picture is identical for both sides; each listed difference branches on
// side === 'R' at exactly one spot, so the panels agree everywhere else.
// All art is canvas primitives. No images, no external assets.

import { DIFFS } from './differences.js';

function circle(ctx, x, y, r, fill) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
}
function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
}
function poly(ctx, pts, fill) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}
function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
}
function star(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4, rr = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath(); ctx.fill();
}
function gull(ctx, x, y, s, color) {
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, y); ctx.quadraticCurveTo(x - 5 * s, y - 8 * s, x, y);
  ctx.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 12 * s, y);
  ctx.strokeStyle = color; ctx.lineWidth = 2 * s; ctx.stroke();
}

// ---------------------------------------------------------------- harbour
function paintHarbour(ctx, W, H, side) {
  const R = side === 'R';
  // dusk sky
  const sky = ctx.createLinearGradient(0, 0, 0, 380);
  sky.addColorStop(0, '#2b2350'); sky.addColorStop(0.55, '#c65a7a'); sky.addColorStop(1, '#f2a65e');
  rect(ctx, 0, 0, W, 380, '#000');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, 380);
  // sun (diff: colour)
  circle(ctx, 300, 118, 46, R ? '#ffe98a' : '#ff7a3c');
  circle(ctx, 300, 118, 60, R ? 'rgba(255,233,138,0.25)' : 'rgba(255,122,60,0.25)');
  // clouds
  ctx.fillStyle = 'rgba(255,220,200,0.75)';
  ctx.beginPath(); ctx.ellipse(120, 70, 70, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(470, 55, 80, 16, 0, 0, Math.PI * 2); ctx.fill();
  // gulls (diff: one missing on the right)
  if (!R) gull(ctx, 178, 92, 1, '#2b2350');
  gull(ctx, 250, 70, 0.8, '#2b2350');
  gull(ctx, 420, 110, 0.9, '#2b2350');
  // distant hills
  poly(ctx, [[0, 380], [140, 300], [300, 380]], '#4a3560');
  poly(ctx, [[220, 380], [420, 290], [600, 380]], '#3c2b52');
  // sea
  const sea = ctx.createLinearGradient(0, 380, 0, H);
  sea.addColorStop(0, '#e08a5a'); sea.addColorStop(0.35, '#7a4a72'); sea.addColorStop(1, '#2c2a55');
  ctx.fillStyle = sea; ctx.fillRect(0, 380, W, H - 380);
  ctx.strokeStyle = 'rgba(255,200,160,0.35)'; ctx.lineWidth = 2;
  for (let i = 0; i < 7; i++) {
    const y = 410 + i * 30;
    ctx.beginPath(); ctx.moveTo(30 + (i % 3) * 40, y);
    ctx.lineTo(180 + (i % 3) * 60, y); ctx.stroke();
  }
  // pier
  rect(ctx, 60, 470, 200, 14, '#5a3a28');
  rect(ctx, 80, 484, 10, 60, '#4a2e1e'); rect(ctx, 230, 484, 10, 60, '#4a2e1e');
  // lighthouse (diff: lamp colour)
  rect(ctx, 500, 200, 34, 180, '#f2ead8');
  rect(ctx, 500, 230, 34, 12, '#c65a7a'); rect(ctx, 500, 280, 34, 12, '#c65a7a');
  poly(ctx, [[496, 200], [538, 200], [517, 172]], '#8a2f3c');
  circle(ctx, 517, 186, 9, R ? '#7dffb0' : '#fff6c9');
  line(ctx, 517, 186, 470, 168, 'rgba(255,246,201,0.35)', 3);
  line(ctx, 517, 186, 566, 168, 'rgba(255,246,201,0.35)', 3);
  // sailboat (diff: moved right)
  const bx = R ? 196 : 150, by = 432;
  poly(ctx, [[bx - 34, by], [bx + 34, by], [bx, by + 16]], '#6b2d2d');
  line(ctx, bx, by, bx, by - 52, '#e8dcc8', 3);
  poly(ctx, [[bx + 2, by - 50], [bx + 2, by - 6], [bx + 34, by - 6]], '#f2ead8');
  poly(ctx, [[bx - 2, by - 46], [bx - 2, by - 6], [bx - 26, by - 6]], '#e08a5a');
  // buoy (diff: extra on the right)
  circle(ctx, 400, 520, 12, '#d83a2e'); rect(ctx, 394, 500, 12, 10, '#d83a2e');
  if (R) { circle(ctx, 470, 520, 12, '#d83a2e'); rect(ctx, 464, 500, 12, 10, '#d83a2e'); }
  // foreground rocks
  poly(ctx, [[0, 640], [0, 590], [90, 610], [150, 640]], '#33284a');
  poly(ctx, [[600, 640], [600, 600], [520, 616], [470, 640]], '#33284a');
}

// ------------------------------------------------------------------- camp
function paintCamp(ctx, W, H, side) {
  const R = side === 'R';
  // night sky
  const sky = ctx.createLinearGradient(0, 0, 0, 420);
  sky.addColorStop(0, '#0d1530'); sky.addColorStop(1, '#274067');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, 420);
  // moon
  circle(ctx, 90, 80, 34, '#f5efc8');
  circle(ctx, 78, 72, 8, '#e0d6a0'); circle(ctx, 100, 92, 6, '#e0d6a0');
  // stars (diff: one missing on the right)
  const stars = [[180, 50], [260, 90], [340, 44], [430, 80], [522, 62], [560, 140], [150, 140], [380, 130], [470, 40]];
  for (const [x, y] of stars) {
    if (R && x === 522 && y === 62) continue;
    star(ctx, x, y, 4, '#fff8d0');
  }
  // pine trees
  function pine(x, base, s) {
    ctx.fillStyle = '#1d3320'; ctx.fillRect(x - 4 * s, base - 20 * s, 8 * s, 20 * s);
    poly(ctx, [[x - 42 * s, base - 10 * s], [x, base - 90 * s], [x + 42 * s, base - 10 * s]], '#22492a');
    poly(ctx, [[x - 34 * s, base - 55 * s], [x, base - 130 * s], [x + 34 * s, base - 55 * s]], '#2a5a34');
  }
  pine(60, 430, 1.1); pine(545, 430, 1.2); pine(500, 420, 0.8);
  // owl (diff: flipped — faces the other way)
  const ox = 482, oy = 148;
  ctx.fillStyle = '#5a4632';
  ctx.beginPath(); ctx.ellipse(ox, oy, 16, 20, 0, 0, Math.PI * 2); ctx.fill();
  circle(ctx, ox - 8, oy - 12, 5, '#7a6248'); circle(ctx, ox + 8, oy - 12, 5, '#7a6248');
  circle(ctx, ox + (R ? -8 : 8), oy - 12, 2.5, '#1a1208');
  poly(ctx, [[ox + (R ? -14 : 14), oy + 2], [ox + (R ? -22 : 22), oy + 6], [ox + (R ? -14 : 14), oy + 10]], '#f2a65e');
  line(ctx, ox, oy + 18, ox - 26, oy + 22, '#3a2c1e', 4);
  // ground
  rect(ctx, 0, 420, W, H - 420, '#2a3a22');
  rect(ctx, 0, 420, W, 8, '#3c5230');
  // tent (diff: colour)
  poly(ctx, [[230, 500], [300, 350], [370, 500]], R ? '#2a8a8a' : '#c0392b');
  poly(ctx, [[300, 350], [300, 500], [340, 500]], R ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.18)');
  poly(ctx, [[282, 500], [300, 440], [318, 500]], '#1d2b1d');
  line(ctx, 230, 500, 300, 350, '#7a1f16', 3); line(ctx, 370, 500, 300, 350, '#7a1f16', 3);
  // campfire (diff: flame height)
  circle(ctx, 300, 540, 34, '#3a2c1e');
  const fh = R ? 26 : 44;
  poly(ctx, [[282, 540], [300, 540 - fh], [318, 540]], '#f2a65e');
  poly(ctx, [[290, 540], [300, 540 - fh * 0.6], [310, 540]], '#e74c3c');
  line(ctx, 262, 528, 338, 544, '#5a3a28', 6); line(ctx, 338, 528, 262, 544, '#5a3a28', 6);
  // log + lantern (diff: lantern missing on the right)
  rect(ctx, 400, 490, 90, 16, '#5a3a28');
  circle(ctx, 405, 506, 5, '#3a2c1e'); circle(ctx, 485, 506, 5, '#3a2c1e');
  if (!R) {
    rect(ctx, 426, 442, 14, 26, '#2c2a55');
    circle(ctx, 433, 455, 6, '#ffe98a');
    line(ctx, 433, 442, 433, 436, '#888', 2);
  }
  // backpack (diff: moved right)
  const px = R ? 214 : 178, py = R ? 508 : 502;
  rect(ctx, px - 18, py - 26, 36, 34, '#7a5a2a');
  rect(ctx, px - 18, py - 26, 36, 10, '#5a421e');
  circle(ctx, px, py - 6, 7, '#f2ead8');
  // mushrooms (diff: extra on the right)
  function shroom(x, y, s) {
    ctx.fillStyle = '#e8dcc8'; ctx.fillRect(x - 3 * s, y, 6 * s, 10 * s);
    ctx.beginPath(); ctx.arc(x, y, 12 * s, Math.PI, 0); ctx.fillStyle = '#d83a2e'; ctx.fill();
    circle(ctx, x - 5 * s, y - 5 * s, 2, '#fff'); circle(ctx, x + 4 * s, y - 7 * s, 2, '#fff');
  }
  shroom(90, 570, 1); shroom(540, 580, 0.9);
  if (R) shroom(118, 560, 0.9);
  // grass tufts
  ctx.strokeStyle = '#4a6a3a'; ctx.lineWidth = 2;
  for (const [x, y] of [[40, 600], [200, 610], [360, 600], [480, 615], [560, 600]]) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y - 12); ctx.moveTo(x, y); ctx.lineTo(x + 6, y - 12); ctx.stroke();
  }
}

// ---------------------------------------------------------------- station
function paintStation(ctx, W, H, side) {
  const R = side === 'R';
  // space
  ctx.fillStyle = '#050814'; ctx.fillRect(0, 0, W, H);
  const stars = [[40, 60], [120, 180], [200, 40], [320, 90], [420, 50], [540, 130], [80, 300], [560, 260], [30, 420], [580, 420], [260, 160], [470, 340], [150, 430], [360, 470]];
  for (const [x, y] of stars) star(ctx, x, y, 3, '#dfe8ff');
  // star cluster (diff: missing on the right)
  if (!R) { star(ctx, 196, 66, 4, '#fff8d0'); star(ctx, 210, 78, 3, '#fff8d0'); star(ctx, 188, 82, 3, '#fff8d0'); }
  // planet (diff: colour)
  circle(ctx, 502, 82, 30, R ? '#e08a3c' : '#c0392b');
  ctx.beginPath(); ctx.ellipse(502, 82, 44, 10, -0.35, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(240,220,180,0.8)'; ctx.lineWidth = 3; ctx.stroke();
  circle(ctx, 494, 74, 6, 'rgba(0,0,0,0.25)');
  // Earth curve at the bottom
  ctx.beginPath(); ctx.arc(300, 900, 300, Math.PI, 0); ctx.fillStyle = '#2a6ab0'; ctx.fill();
  ctx.save(); ctx.clip();
  ctx.beginPath(); ctx.arc(300, 900, 300, Math.PI, 0);
  ctx.fillStyle = '#3a8a5a';
  ctx.beginPath(); ctx.ellipse(180, 640, 90, 40, 0.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(430, 630, 70, 30, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.beginPath(); ctx.arc(300, 900, 300, Math.PI, 0); ctx.strokeStyle = 'rgba(160,210,255,0.7)'; ctx.lineWidth = 4; ctx.stroke();
  // station spine
  rect(ctx, 240, 250, 130, 34, '#b8bcc8');
  rect(ctx, 240, 250, 130, 8, '#d8dce8');
  // module stripe (diff: colour)
  rect(ctx, 400, 322, 44, 10, R ? '#2a8a5a' : '#f2ead8');
  // module window (diff: lit vs dark)
  circle(ctx, 282, 262, 12, R ? '#1a2030' : '#ffe98a');
  circle(ctx, 282, 262, 16, '#5a6278'); ctx.beginPath(); ctx.arc(282, 262, 16, 0, Math.PI * 2); ctx.strokeStyle = '#5a6278'; ctx.lineWidth = 3; ctx.stroke();
  circle(ctx, 282, 262, 12, R ? '#1a2030' : '#ffe98a');
  // solar panels (diff: one panel's colour)
  function panel(x, y, w, h, color) {
    ctx.fillStyle = color; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) { line(ctx, x + (w / 4) * i, y, x + (w / 4) * i, y + h, 'rgba(255,255,255,0.5)', 2); }
    ctx.strokeStyle = '#5a6278'; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, h);
  }
  panel(60, 260, 120, 80, R ? '#7a4ac8' : '#2a4ac8');
  panel(420, 260, 120, 80, '#2a4ac8');
  line(ctx, 180, 300, 240, 292, '#8a90a0', 6); line(ctx, 370, 292, 420, 300, '#8a90a0', 6);
  // comm dish (diff: missing on the right)
  if (!R) {
    line(ctx, 482, 230, 482, 198, '#8a90a0', 5);
    ctx.beginPath(); ctx.arc(482, 190, 16, Math.PI * 1.15, Math.PI * 1.85); ctx.strokeStyle = '#d8dce8'; ctx.lineWidth = 4; ctx.stroke();
    circle(ctx, 482, 198, 4, '#d8dce8');
  }
  // astronaut (diff: moved) + tether (diff: flipped curve)
  const ax = R ? 384 : 352, ay = R ? 330 : 352;
  ctx.beginPath();
  ctx.moveTo(300, 300);
  if (R) ctx.quadraticCurveTo(360, 420, ax, ay + 10);
  else ctx.quadraticCurveTo(330, 400, ax, ay + 10);
  ctx.strokeStyle = '#c8ccd8'; ctx.lineWidth = 3; ctx.stroke();
  circle(ctx, ax, ay, 16, '#f2ead8'); // helmet
  circle(ctx, ax + 4, ay - 2, 10, '#1a2a4a'); // visor
  rect(ctx, ax - 12, ay + 12, 24, 26, '#e8e8f0'); // suit
  rect(ctx, ax - 20, ay + 14, 8, 18, '#c8ccd8'); rect(ctx, ax + 12, ay + 14, 8, 18, '#c8ccd8');
  rect(ctx, ax - 10, ay + 38, 8, 14, '#c8ccd8'); rect(ctx, ax + 2, ay + 38, 8, 14, '#c8ccd8');
  // satellite (diff: extra on the right)
  if (R) {
    rect(ctx, 78, 112, 28, 20, '#b8bcc8');
    rect(ctx, 58, 118, 18, 8, '#2a4ac8'); rect(ctx, 108, 118, 18, 8, '#2a4ac8');
    circle(ctx, 92, 108, 5, '#ffe98a');
  }
  // small satellite, always there
  rect(ctx, 520, 480, 24, 16, '#8a90a0');
  rect(ctx, 500, 484, 18, 7, '#2a4ac8'); rect(ctx, 546, 484, 18, 7, '#2a4ac8');
}

// ----------------------------------------------------------------- market
function paintMarket(ctx, W, H, side) {
  const R = side === 'R';
  // sky + sun
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#8ec8e8'); sky.addColorStop(1, '#e8f2d8');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, 300);
  circle(ctx, 80, 70, 30, '#ffe98a');
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath(); ctx.ellipse(300, 60, 60, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(450, 100, 50, 12, 0, 0, Math.PI * 2); ctx.fill();
  // buildings
  rect(ctx, 0, 140, 200, 260, '#e8b48a');
  rect(ctx, 200, 100, 200, 300, '#c8a8d8');
  rect(ctx, 400, 120, 200, 280, '#a8c8a8');
  // roofs
  poly(ctx, [[0, 140], [100, 100], [200, 140]], '#8a4a3a');
  poly(ctx, [[200, 100], [300, 60], [400, 100]], '#6a4a8a');
  poly(ctx, [[400, 120], [500, 80], [600, 120]], '#4a6a4a');
  // chimney + smoke (diff: one puff missing on the right)
  rect(ctx, 510, 44, 22, 40, '#8a4a3a');
  circle(ctx, 521, 36, 10, 'rgba(255,255,255,0.85)');
  circle(ctx, 530, 18, 8, 'rgba(255,255,255,0.7)');
  if (!R) circle(ctx, 512, 52, 7, 'rgba(255,255,255,0.8)');
  // windows + curtain (diff: curtain closed on the right)
  rect(ctx, 280, 160, 44, 44, '#2c3a55');
  if (R) { rect(ctx, 280, 160, 44, 44, '#f2a65e'); line(ctx, 302, 160, 302, 204, '#c87a3a', 2); }
  else { rect(ctx, 280, 160, 18, 44, '#f2a65e'); rect(ctx, 306, 160, 18, 44, '#f2a65e'); }
  rect(ctx, 440, 160, 44, 44, '#2c3a55');
  rect(ctx, 60, 200, 40, 40, '#2c3a55');
  // shop sign
  rect(ctx, 210, 210, 180, 30, '#3a2c22');
  ctx.fillStyle = '#ffe98a'; ctx.font = 'bold 20px system-ui, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('FRESH MARKET', 300, 231);
  // awning (diff: stripe colour)
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? (R ? '#2a6ac8' : '#d83a2e') : '#f2ead8';
    ctx.fillRect(210 + i * 30, 250, 30, 26);
  }
  line(ctx, 210, 276, 390, 276, '#3a2c22', 3);
  // fruit stall
  rect(ctx, 180, 470, 120, 30, '#7a5a2a');
  circle(ctx, 200, 462, 9, '#d83a2e'); circle(ctx, 220, 462, 9, '#e8a83c'); circle(ctx, 240, 462, 9, '#d83a2e');
  circle(ctx, 260, 462, 9, '#7ab83c'); circle(ctx, 280, 462, 9, '#e8a83c');
  if (R) circle(ctx, 202, 482, 9, '#d83a2e'); // extra apple
  // poster (diff: sun vs moon)
  rect(ctx, 458, 158, 48, 48, '#f2ead8');
  if (R) { circle(ctx, 482, 182, 12, '#f2d88a'); circle(ctx, 486, 180, 10, '#f2ead8'); }
  else { circle(ctx, 482, 182, 12, '#f2a65e'); for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3; line(ctx, 482 + Math.cos(a) * 15, 182 + Math.sin(a) * 15, 482 + Math.cos(a) * 19, 182 + Math.sin(a) * 19, '#f2a65e', 2); } }
  // street lamp (diff: lit vs unlit)
  line(ctx, 82, 340, 82, 280, '#3a3a3a', 5);
  circle(ctx, 82, 274, 12, R ? '#5a5a5a' : '#ffe98a');
  if (!R) circle(ctx, 82, 274, 22, 'rgba(255,233,138,0.3)');
  // wall + cat (diff: cat missing on the right)
  rect(ctx, 480, 400, 120, 60, '#b8a888');
  if (!R) {
    ctx.fillStyle = '#3a3a3a';
    ctx.beginPath(); ctx.ellipse(522, 412, 16, 10, 0, 0, Math.PI * 2); ctx.fill();
    circle(ctx, 536, 402, 8, '#3a3a3a');
    poly(ctx, [[532, 396], [534, 388], [538, 395]], '#3a3a3a');
    poly(ctx, [[540, 396], [542, 388], [544, 395]], '#3a3a3a');
  }
  // bicycle (diff: hub dot)
  circle(ctx, 340, 542, 22, '#3a3a3a'); circle(ctx, 340, 542, 18, '#e8e8e8');
  circle(ctx, 424, 542, 22, '#3a3a3a'); circle(ctx, 424, 542, 18, '#e8e8e8');
  if (!R) circle(ctx, 382, 542, 5, '#d83a2e');
  line(ctx, 340, 542, 382, 542, '#c0392b', 4); line(ctx, 382, 542, 424, 542, '#c0392b', 4);
  line(ctx, 382, 542, 366, 500, '#c0392b', 4); line(ctx, 366, 500, 340, 542, '#c0392b', 4);
  rect(ctx, 360, 494, 16, 6, '#3a2c22');
  // street
  rect(ctx, 0, 500, W, 140, '#8a8a8a');
  rect(ctx, 0, 500, W, 6, '#6a6a6a');
  ctx.fillStyle = '#f2ead8';
  for (let x = 20; x < W; x += 90) ctx.fillRect(x, 570, 40, 6);
  // puddle + reflection (diff: reflection missing on the right)
  ctx.beginPath(); ctx.ellipse(452, 582, 46, 12, 0, 0, Math.PI * 2); ctx.fillStyle = '#6a8ab0'; ctx.fill();
  if (!R) {
    ctx.beginPath(); ctx.ellipse(452, 580, 30, 6, 0, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fill();
  }
}

export const SCENE_PAINTERS = {
  harbour: paintHarbour,
  camp: paintCamp,
  station: paintStation,
  market: paintMarket,
};

export function paintScene(ctx, sceneId, W, H, side) {
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  SCENE_PAINTERS[sceneId](ctx, W, H, side);
  ctx.restore();
}

export { DIFFS };
