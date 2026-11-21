// Difference catalogue for Twin Frames.
// One entry per difference. Coordinates are in panel-local space (600 x 640).
// ax,ay = hotspot on the LEFT panel; bx,by = hotspot on the RIGHT panel
// (identical unless the difference moves the object). r = click radius.
// kind: recolor | missing | moved | extra | flipped
// The painters in scenes.js branch on side === 'R' at exactly these spots,
// so the two panels are pixel-identical everywhere else.

export const PANEL_W = 600;
export const PANEL_H = 640;

export const DIFFS = {
  harbour: [
    { id: 'sun', kind: 'recolor', label: 'Sun colour', ax: 300, ay: 118, bx: 300, by: 118, r: 30 },
    { id: 'gull', kind: 'missing', label: 'Seagull', ax: 178, ay: 92, bx: 178, by: 92, r: 22 },
    { id: 'buoy', kind: 'extra', label: 'Extra buoy', ax: 470, ay: 520, bx: 470, by: 520, r: 24 },
    { id: 'lamp', kind: 'recolor', label: 'Lighthouse lamp', ax: 516, ay: 176, bx: 516, by: 176, r: 22 },
    { id: 'boat', kind: 'moved', label: 'Sailboat position', ax: 150, ay: 432, bx: 196, by: 432, r: 32 },
  ],
  camp: [
    { id: 'tent', kind: 'recolor', label: 'Tent colour', ax: 300, ay: 430, bx: 300, by: 430, r: 42 },
    { id: 'flame', kind: 'recolor', label: 'Campfire flame', ax: 300, ay: 516, bx: 300, by: 516, r: 30 },
    { id: 'lantern', kind: 'missing', label: 'Lantern', ax: 432, ay: 468, bx: 432, by: 468, r: 24 },
    { id: 'shroom', kind: 'extra', label: 'Extra mushroom', ax: 118, ay: 560, bx: 118, by: 560, r: 22 },
    { id: 'owl', kind: 'flipped', label: 'Owl facing', ax: 482, ay: 148, bx: 482, by: 148, r: 26 },
    { id: 'star', kind: 'missing', label: 'Star', ax: 522, ay: 62, bx: 522, by: 62, r: 18 },
    { id: 'pack', kind: 'moved', label: 'Backpack position', ax: 178, ay: 502, bx: 214, by: 508, r: 28 },
  ],
  station: [
    { id: 'panel', kind: 'recolor', label: 'Solar panel colour', ax: 122, ay: 300, bx: 122, by: 300, r: 36 },
    { id: 'dish', kind: 'missing', label: 'Comms dish', ax: 482, ay: 198, bx: 482, by: 198, r: 26 },
    { id: 'astro', kind: 'moved', label: 'Astronaut position', ax: 352, ay: 352, bx: 384, by: 330, r: 28 },
    { id: 'planet', kind: 'recolor', label: 'Planet colour', ax: 502, ay: 82, bx: 502, by: 82, r: 26 },
    { id: 'window', kind: 'recolor', label: 'Module window', ax: 282, ay: 262, bx: 282, by: 262, r: 20 },
    { id: 'sat', kind: 'extra', label: 'Extra satellite', ax: 92, ay: 122, bx: 92, by: 122, r: 24 },
    { id: 'cluster', kind: 'missing', label: 'Star cluster', ax: 202, ay: 72, bx: 202, by: 72, r: 22 },
    { id: 'tether', kind: 'flipped', label: 'Tether curve', ax: 372, ay: 384, bx: 372, by: 384, r: 24 },
    { id: 'stripe', kind: 'recolor', label: 'Module stripe', ax: 422, ay: 322, bx: 422, by: 322, r: 22 },
  ],
  market: [
    { id: 'awning', kind: 'recolor', label: 'Awning stripes', ax: 150, ay: 202, bx: 150, by: 202, r: 30 },
    { id: 'poster', kind: 'recolor', label: 'Poster sun/moon', ax: 482, ay: 182, bx: 482, by: 182, r: 24 },
    { id: 'cat', kind: 'missing', label: 'Cat on the wall', ax: 522, ay: 422, bx: 522, by: 422, r: 22 },
    { id: 'apple', kind: 'extra', label: 'Extra apple', ax: 202, ay: 482, bx: 202, by: 482, r: 18 },
    { id: 'wheel', kind: 'recolor', label: 'Bicycle wheel hub', ax: 382, ay: 542, bx: 382, by: 542, r: 26 },
    { id: 'curtain', kind: 'recolor', label: 'Curtain', ax: 302, ay: 182, bx: 302, by: 182, r: 24 },
    { id: 'lamp', kind: 'recolor', label: 'Street lamp', ax: 82, ay: 302, bx: 82, by: 302, r: 22 },
    { id: 'puddle', kind: 'missing', label: 'Puddle reflection', ax: 452, ay: 582, bx: 452, by: 582, r: 26 },
    { id: 'smoke', kind: 'missing', label: 'Chimney smoke puff', ax: 514, ay: 44, bx: 514, by: 44, r: 22 },
  ],
};

export const SCENE_ORDER = ['harbour', 'camp', 'station', 'market'];

export const SCENE_META = {
  harbour: { name: 'Harbour at Dusk', sub: 'Scene 1 of 4 · 5 differences', time: 120 },
  camp: { name: 'Forest Camp', sub: 'Scene 2 of 4 · 7 differences', time: 110 },
  station: { name: 'Space Station', sub: 'Scene 3 of 4 · 9 differences', time: 100 },
  market: { name: 'Market Street', sub: 'Scene 4 of 4 · 9 differences', time: 90 },
};

export function diffsFor(sceneId) {
  return DIFFS[sceneId] || [];
}

export function totalDiffs() {
  return SCENE_ORDER.reduce((n, id) => n + DIFFS[id].length, 0);
}
