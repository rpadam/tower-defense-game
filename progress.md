Original prompt: I want to host a little webgame on my website if that's possible. Help me plan that out in detail. I want it to be a tab on my personal website (the repo for which is located in this directory). I want this game to be a tower defense game with fun mechanics. Let's put the tower defense game in a new directory in /Users/raphaeladam/development that we're going to commit to github as its own repo.

## Completed
- Created standalone repo scaffold at `/Users/raphaeladam/development/tower-defense-game`.
- Added Vite config with `base: /tower-defense-game/` for GitHub Pages deployment.
- Implemented playable tower defense prototype with path shifts, overdrive, risk crates, and synergy bonus.
- Added deterministic testing hooks `window.advanceTime(ms)` and `window.render_game_to_text()`.
- Added `.github/workflows/deploy-pages.yml` for GitHub Pages auto-deploy.

## TODO
- Add tower upgrades and sell/remove mechanics.
- Add sound effects and improved visual feedback for hits.
- Add explicit Start Wave and Overdrive buttons for mobile-first control.
- Add Playwright test script and commit baseline screenshots.

## Verification notes
- `npm run build` passed in `tower-defense-game`.
- `window.advanceTime(ms)` and `window.render_game_to_text()` are implemented and exposed.
- Attempted to run `$WEB_GAME_CLIENT`, but the script failed with `ERR_MODULE_NOT_FOUND: playwright` from the skill script location.
- `npx -p playwright playwright --version` succeeded, so the environment can fetch package binaries, but direct ESM module resolution for the skill script still needs setup.

## Planning notes
- Added `REWRITE_PLAN.md` with a full rewrite plan aimed at a GemCraft-quality presentation and more structured gameplay.
- Recommended a near-full rewrite with modular state, systems, rendering, and UI boundaries so weaker agents can work in parallel safely.
- Added `AGENT_TASKS.md` with concrete task tickets and `AGENT_HANDOFF.md` with a Codex delegation workflow.
- Added `orchestration/tasks.json` and `orchestration/model-policy.json` so the project can be consumed by a reusable external orchestrator.

## UI-01 update (2026-03-19)
- Reworked the app shell in `index.html` into a real game layout with dedicated regions: title screen overlay, top HUD container, central battlefield canvas area, build tray, and right-side details panel.
- Replaced `src/styles.css` with a fantasy strategy visual system and responsive behavior for desktop and narrow/mobile widths.
- Added `src/game/bootstrap.js` and UI modules:
  - `src/game/ui/screenTitle.js`
  - `src/game/ui/panelTopBar.js`
  - `src/game/ui/panelBuildTray.js`
  - `src/game/ui/panelTowerDetails.js`
- Updated `src/main.js` to bootstrap the shell around the existing `TowerDefenseGame` without changing combat/wave internals.
- Added clickable `Play`, `Start Wave`, and `Overdrive` buttons through UI-to-key event wiring so mouse/mobile users are no longer blocked on keyboard-only controls.

## Verification notes (UI-01)
- `npm run build` passes after UI-01 changes.
- Installed `playwright` in the repo and in the skill script directory so `$WEB_GAME_CLIENT` can run.
- Installed Chromium for Playwright via `npx playwright install chromium`.
- Ran `$WEB_GAME_CLIENT` against `http://127.0.0.1:4173/tower-defense-game/` with `--click-selector "#play-btn"` and action payloads.
- Output artifacts created:
  - `output/web-game/shot-0.png`
  - `output/web-game/shot-1.png`
  - `output/web-game/state-0.json`
  - `output/web-game/state-1.json`
- No `errors-*.json` files were emitted by the Playwright client in this run.

## Next agent notes
- UI shell now exists and is responsive, but in-canvas HUD from `src/game.js` still draws at the top of the canvas and visually overlaps with the new shell concept. A later pass should move gameplay HUD rendering fully into shell panels.
- Build tray buttons currently map to keyboard actions (`1/2/3`, `N`, `O`) for compatibility with current game logic. UI-02 should replace this bridge with direct state/UI system actions.
