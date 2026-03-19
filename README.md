# tower-defense-game

Standalone browser tower defense game for deployment at:
`https://rpadam.github.io/tower-defense-game/`

## Mechanics in this initial build

- Three tower classes: Bolt, Burst (AoE), Frost (slow)
- Three enemy classes: Scout, Brute, Tank
- Path shift every three waves
- Overdrive meter and timed fire-rate boost
- Risk crates that can be clicked for economy spikes
- Frost + Burst synergy bonus

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Testing hooks

The game exposes deterministic hooks for automation:

- `window.advanceTime(ms)`
- `window.render_game_to_text()`

These are intended for Playwright automation loops.
