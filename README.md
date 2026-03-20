# tower-defense-game

Standalone browser tower defense game for deployment at:
`https://rpadam.github.io/tower-defense-game/`

## Current status

The current implementation is a prototype. The active plan is a structured rewrite toward a polished, production-looking game.

Primary planning docs:

- [REWRITE_PLAN.md](./REWRITE_PLAN.md)
- [AGENT_TASKS.md](./AGENT_TASKS.md)
- [AGENT_HANDOFF.md](./AGENT_HANDOFF.md)
- [progress.md](./progress.md)

Orchestration config:

- `orchestration/tasks.json`
- `orchestration/model-policy.json`
- `orchestration/adapters.json` (local adapter definitions)

Local prompt files:

- `.agent-prompts/*.txt` (gitignored)

Execution policy:

- default is sequential (one task at a time)
- parallel execution requires explicit user consent
- recommended model tier per task should remain unchanged in sequential and parallel modes
- each completed task should record model used and token usage fields when available

## Prototype mechanics (legacy baseline)

- Three towers: Bolt, Burst, Frost
- Three enemy types: Scout, Brute, Tank
- Path shift every three waves
- Overdrive meter and timed fire-rate boost
- Risk crate click bonus
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
