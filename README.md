# spot-the-difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/arnesarizky/spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/arnesarizky/spot-the-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Twin Frames — Spot the Difference: two near-identical pictures side by side, four original canvas-drawn scenes (Harbour at Dusk, Forest Camp, Space Station, Market Street) with 5 → 7 → 9 → 9 differences that get subtler as you go. Click a difference on either picture to ring it, hear the chime and bank +100; wrong clicks cost 5 seconds, hints (H) pulse an unfound difference for −50 points, and the countdown bar keeps the pressure on. Clear all four scenes for the win screen with your total score and time bonus. No external assets at all — every scene is drawn in code and every sound is synthesized with WebAudio.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — or open game/index.html in desktop Chrome. Play with mouse and keyboard: H hint, P pause, R restart, N next scene after a clear. Deterministic screenshot modes: `?shot=start&seed=1`, `?shot=play&seed=1`, `?shot=play&seed=2`, `?shot=end&seed=1`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=9m688dgh&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
