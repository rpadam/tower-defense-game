# Agent Task Queue

Use these tasks as the first wave of work for Codex agents.

Rules for all agents:

- Work only inside `/Users/raphaeladam/development/tower-defense-game`
- Read [`REWRITE_PLAN.md`](/Users/raphaeladam/development/tower-defense-game/REWRITE_PLAN.md) first
- Read [`progress.md`](/Users/raphaeladam/development/tower-defense-game/progress.md) before editing
- Keep changes scoped to the assigned task
- Do not rewrite unrelated files
- Run `npm run build` before finishing
- Update [`progress.md`](/Users/raphaeladam/development/tower-defense-game/progress.md) with what changed, what still blocks, and what the next agent should know

## Task UI-01

Task ID: `UI-01`

Goal: Build a real game shell so the app looks like a game before combat polish starts.

Files to edit:

- [`index.html`](/Users/raphaeladam/development/tower-defense-game/index.html)
- [`src/styles.css`](/Users/raphaeladam/development/tower-defense-game/src/styles.css)
- [`src/main.js`](/Users/raphaeladam/development/tower-defense-game/src/main.js)

Files allowed to create:

- `src/game/bootstrap.js`
- `src/game/ui/screenTitle.js`
- `src/game/ui/panelTopBar.js`
- `src/game/ui/panelBuildTray.js`
- `src/game/ui/panelTowerDetails.js`

Do this:

- Replace the thin shell with a proper game layout
- Add a title screen overlay with a visible `Play` button
- Add top HUD, build tray, and right-side details panel containers
- Make layout usable on desktop and narrow screens
- Keep the visual language fantasy strategy, not generic dashboard

Do not do this:

- Do not implement combat logic
- Do not change wave logic
- Do not touch deploy workflow

Acceptance:

- The page looks intentional before gameplay starts
- `Play` button is visible and clickable
- HUD regions exist even with placeholder data
- Layout works at desktop and mobile widths
- `npm run build` passes

Verification:

- Run `npm run build`
- Capture at least one screenshot
- Confirm no console errors

## Task DATA-01

Task ID: `DATA-01`

Goal: Replace the current monolithic config with modular game data and state files.

Files to edit:

- [`src/state.js`](/Users/raphaeladam/development/tower-defense-game/src/state.js)

Files allowed to create:

- `src/game/constants.js`
- `src/game/state/initialState.js`
- `src/game/state/reducers.js`
- `src/game/state/selectors.js`
- `src/game/data/towers.js`
- `src/game/data/enemies.js`
- `src/game/data/waves.js`
- `src/game/data/map01.js`
- `src/game/utils/math.js`
- `src/game/utils/geometry.js`

Do this:

- Define canonical state shape for all game modes
- Move tower, enemy, wave, and map data into separate files
- Create selectors for derived state
- Keep data pure and easy to tune

Do not do this:

- Do not render UI
- Do not implement combat
- Do not add CSS

Acceptance:

- No hardcoded tower or enemy stats remain inside main loop code
- Initial state creation is modular
- Data modules are readable and easy to extend
- `npm run build` passes

Verification:

- Run `npm run build`
- List new files created in `progress.md`

## Task MAP-01

Task ID: `MAP-01`

Goal: Build a polished battlefield and placement feedback system.

Files allowed to create:

- `src/game/render/renderMap.js`
- `src/game/systems/buildSystem.js`
- `src/game/render/renderPlacementPreview.js`

Files likely to edit:

- `src/game/bootstrap.js`
- `src/game/constants.js`
- `src/game/state/selectors.js`

Do this:

- Render one curated battlefield map
- Make path, spawn, and core visually obvious
- Add buildable spaces or valid terrain logic
- Add valid/invalid placement preview
- Add tower range preview on hover/selection

Do not do this:

- Do not implement enemy combat
- Do not redesign title screen

Acceptance:

- User can clearly tell where towers can be placed
- Placement preview changes color for valid vs invalid
- Map looks like a game battlefield, not a debug grid
- `npm run build` passes

Verification:

- Run `npm run build`
- Capture screenshot of map and placement preview

## Task COMBAT-01

Task ID: `COMBAT-01`

Goal: Implement wave spawning and enemy movement.

Files allowed to create:

- `src/game/systems/waveSystem.js`
- `src/game/systems/enemySystem.js`

Files likely to edit:

- `src/game/bootstrap.js`
- `src/game/state/reducers.js`
- `src/game/data/waves.js`
- `src/game/data/enemies.js`
- `src/game/data/map01.js`

Do this:

- Add build phase and active wave transitions
- Spawn enemies from wave definitions
- Move enemies along path data
- Apply life loss when enemies leak

Do not do this:

- Do not add upgrade UI
- Do not style the page

Acceptance:

- Starting a wave creates enemies
- Enemies move correctly from spawn to core
- Life loss works
- Build and wave states are distinct
- `npm run build` passes

Verification:

- Run `npm run build`
- Update `render_game_to_text()` if needed so enemy and wave state are visible

## Task COMBAT-02

Task ID: `COMBAT-02`

Goal: Implement towers, targeting, projectiles, and damage.

Files allowed to create:

- `src/game/systems/combatSystem.js`
- `src/game/systems/projectileSystem.js`
- `src/game/render/renderTowers.js`
- `src/game/render/renderEnemies.js`
- `src/game/render/renderProjectiles.js`
- `src/game/render/renderEffects.js`

Files likely to edit:

- `src/game/bootstrap.js`
- `src/game/data/towers.js`
- `src/game/state/reducers.js`

Do this:

- Towers acquire targets automatically
- Towers fire projectiles or beams
- Damage enemies
- Kill enemies and award currency
- Add readable impact feedback

Do not do this:

- Do not redesign shell layout
- Do not build upgrade side panel

Acceptance:

- Towers attack during active waves
- Enemies lose health and die
- Currency updates on enemy death
- Combat is visually readable
- `npm run build` passes

Verification:

- Run `npm run build`
- Capture screenshot during active combat

## Task UI-02

Task ID: `UI-02`

Goal: Build tower selection, upgrade, and sell interaction.

Files allowed to create:

- `src/game/systems/uiSystem.js`
- `src/game/ui/panelTowerDetails.js`
- `src/game/ui/panelWaveInfo.js`

Files likely to edit:

- `src/game/data/towers.js`
- `src/game/state/reducers.js`
- `src/game/state/selectors.js`
- `src/styles.css`

Do this:

- Selecting a tower opens details panel
- Show tower stats
- Add upgrade buttons
- Add sell button
- Reflect state changes in panel and battlefield

Do not do this:

- Do not alter enemy pathing
- Do not touch deploy workflow

Acceptance:

- Clicking a tower selects it
- Upgrading changes stats and cost state
- Selling refunds currency and removes tower
- Panel remains readable and clean
- `npm run build` passes

Verification:

- Run `npm run build`
- Capture screenshot with selected tower and visible buttons

## Task QA-01

Task ID: `QA-01`

Goal: Restore deterministic automation and test hooks for the rewritten game.

Files likely to edit:

- [`src/main.js`](/Users/raphaeladam/development/tower-defense-game/src/main.js)
- `src/game/bootstrap.js`
- `src/game/state/selectors.js`

Do this:

- Ensure `window.advanceTime(ms)` works
- Ensure `window.render_game_to_text()` returns current actionable state
- Keep payload concise but complete enough for automated play
- Document any Playwright blocker in `progress.md`

Do not do this:

- Do not redesign gameplay UI
- Do not change balance values unless necessary for determinism

Acceptance:

- Hooks are exposed globally
- Text state reflects visible game state
- `npm run build` passes

Verification:

- Run `npm run build`
- If Playwright is available, run the configured loop
- Record blockers if Playwright still cannot run

## Task POLISH-01

Task ID: `POLISH-01`

Goal: Add the final layer of visual feedback that makes the game feel shipped.

Files likely to edit:

- `src/styles.css`
- `src/game/render/renderEffects.js`
- `src/game/render/renderHUD.js`
- `src/game/render/renderPanels.js`

Do this:

- Improve hierarchy and spacing
- Add hit flashes, death pops, and subtle transitions
- Improve panel depth and button states
- Tune battlefield readability

Do not do this:

- Do not rewrite core combat logic unless blocked by missing hooks

Acceptance:

- Screenshots look intentional and polished
- UI is readable at a glance
- Combat feedback is satisfying
- `npm run build` passes

Verification:

- Run `npm run build`
- Capture before/after screenshots

