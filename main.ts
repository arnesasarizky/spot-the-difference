// Twin Frames — Spot the Difference: the hand-in program (Node 22, stdlib only).
// It copies game/ and screenshots/ from beside this file into /output and writes
// /output/dossier.json with buildDossier from the vendored make.fun library.
// The output is deterministic: run it twice and the two /output trees are
// byte-identical. Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps: at most 4 screenshots of 256 KiB each, at most 993
// files / 48 MiB under game/, paths at most 1000 bytes, and the dossier text
// itself capped at 163840 bytes. game/ + screenshots/ + dossier.json share the
// platform's 1000-entry / 64 MiB /output cap, so the entry stays well inside.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
