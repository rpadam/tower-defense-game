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
