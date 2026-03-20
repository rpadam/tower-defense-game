# Path Shift TD Rewrite Plan

## Goal

Rebuild the game into a polished browser tower defense that feels closer to GemCraft in presentation and play quality.

This does **not** mean copying GemCraft art, lore, gem names, maps, or UI one-to-one.
It means matching the following qualities:

- Clean fantasy-themed UI with layered panels and readable information hierarchy
- Satisfying tower placement and combat feedback
- Strong wave pacing
- Meaningful upgrade choices
- Clear pre-wave planning and active combat phases
- Visual polish that looks like a real shipped game, not a prototype

## Current Assessment

Current repo state:

- Single-canvas prototype
- Very thin HTML shell
- Minimal CSS
- All major gameplay logic concentrated in [`src/game.js`](src/game.js)
- Static config in [`src/state.js`](src/state.js)

Current problems:

- UI feels like a prototype, not a game
- No real game shell, menu flow, or progression framing
- Combat readability is weak
- Towers and enemies do not feel distinct enough
- No satisfying upgrade loop
- No strong visual language
- Code structure is too monolithic for parallel agent work

## Rewrite Decision

Recommended approach: **rewrite most of the game** while preserving only these ideas if they still fit:

- `window.advanceTime(ms)`
- `window.render_game_to_text()`
- Vite project setup
- GitHub Pages deployment workflow

Everything else should be considered replaceable.

## Target Experience

## Player Loop

1. Enter a real title screen.
2. Start a map from a clean game menu.
3. Review mana, lives, wave state, and available towers from a clear HUD.
4. Place towers during build phase.
5. Start a wave from an obvious button, not only a keyboard shortcut.
6. Watch projectiles, impacts, enemy health, and special effects clearly.
7. Upgrade or sell towers through a proper side panel.
8. Progress through escalating waves with stronger enemies and richer tower decisions.

## Visual Direction

Reference qualities to emulate:

- Fantasy strategy UI
- Stone, parchment, gem, brass, rune, and mana motifs
- Layered panels with visible depth
- Brighter battlefield with strong contrast between terrain, path, towers, enemies, and projectiles
- Distinct silhouettes per enemy and tower type

Hard constraints:

- No placeholder-feeling UI
- No giant blocks of text on gameplay screen
- No flat prototype canvas with one-line instructions underneath

## Scope For V1 Rewrite

Include:

- One polished map
- Title screen
- Game HUD
- Build/start-wave controls
- 4 tower types
- 5 enemy types
- Tower upgrade paths
- Sell tower flow
- Wave preview
- Win/lose screens
- Basic sound hooks
- Proper hover, selection, and targeting feedback

Defer until after V1:

- Multiple maps
- Skill tree / meta progression
- Save system
- Endless mode
- Full audio pass
- Complex spell system

## Required Architecture

The rewrite should split responsibilities so multiple weaker agents can work independently.

Create or replace with this structure:

```text
index.html
src/main.js
src/styles.css
src/game/
  bootstrap.js
  constants.js
  state/
    initialState.js
    reducers.js
    selectors.js
  data/
    towers.js
    enemies.js
    waves.js
    map01.js
  systems/
    gameLoop.js
    inputSystem.js
    buildSystem.js
    combatSystem.js
    enemySystem.js
    projectileSystem.js
    waveSystem.js
    economySystem.js
    uiSystem.js
  render/
    renderFrame.js
    renderMap.js
    renderHUD.js
    renderPanels.js
    renderTowers.js
    renderEnemies.js
    renderProjectiles.js
    renderEffects.js
  ui/
    screenTitle.js
    screenGameOver.js
    screenVictory.js
    panelTowerDetails.js
    panelWaveInfo.js
    panelTopBar.js
  utils/
    math.js
    geometry.js
    colors.js
    timing.js
```

If the team wants fewer files, keep the same boundaries even if some are merged.

## File Ownership Rules

These rules exist so weaker agents do not step on each other.

- `index.html`: structure only, no gameplay logic
- `src/styles.css`: shell layout, panel look, typography, buttons, overlays
- `src/game/data/*`: pure data only
- `src/game/state/*`: pure state shape, selectors, reducers
- `src/game/systems/*`: update logic only
- `src/game/render/*`: drawing only
- `src/game/ui/*`: screen composition and panel content only
- `src/main.js`: bootstrapping only

Agents should not mix rendering, state mutation, and input handling in the same file unless explicitly assigned.

## Core Systems To Build

## 1. Screen Flow

Modes:

- `title`
- `build_phase`
- `wave_active`
- `paused`
- `victory`
- `defeat`

Requirements:

- Title screen with clear Play button
- Pause support
- Visible transition between build and wave phases
- Victory and defeat overlays with retry button

## 2. HUD

Must show:

- Lives
- Mana or gold
- Current wave
- Remaining enemies in wave
- Build/start-wave controls
- Selected tower and upgrade options

Must feel intentional:

- Top bar for global state
- Right-side panel for tower/build details
- Bottom or left build tray for tower selection

## 3. Towers

V1 tower roster:

- Bolt tower: fast single-target
- Beam tower: sustained damage, high cost
- Frost tower: slow and control
- Burst tower: area splash

Each tower needs:

- Cost
- Range
- Fire cadence
- Projectile or beam style
- Upgrade path with at least 2 upgrade tiers
- Sell value

## 4. Enemies

V1 enemy roster:

- Runner: fast, low health
- Drone or Wisp: evasive visual profile
- Brute: slow, durable
- Shielded: damage reduction or front-loaded shielding
- Boss-lite wave unit: higher spectacle and pressure

Each enemy needs:

- Speed
- Max HP
- Reward
- Distinct visual treatment
- Readable health display

## 5. Map and Pathing

Use one curated map for V1.

Requirements:

- Predefined build pads or clearly readable buildable terrain
- Path rendered as a real environment feature, not a plain line
- Path preview visible before wave start
- Spawn and core locations visually obvious

## 6. Combat Feedback

Must include:

- Projectile trails or beam effects
- Hit flashes
- Death pop effect
- Range preview on tower hover or selection
- Selection ring for active tower
- Hover highlight for valid / invalid placement

## 7. Upgrade Interaction

Selecting a tower should open a side panel showing:

- Tower name
- Level
- Damage / rate / range summary
- Upgrade buttons
- Sell button

No keyboard-only management for core actions.

## 8. Automation Hooks

The rewrite must keep:

- `window.advanceTime(ms)`
- `window.render_game_to_text()`

`render_game_to_text()` must include:

- Mode
- Currency
- Lives
- Wave state
- Selected tower type
- Selected tower id
- Active enemies
- Active towers
- Projectile count
- Buttons / panel state relevant to automation

## Art Direction Tasks

These can be done without new libraries.

Required look improvements:

- Replace flat background with hand-crafted layered battlefield render
- Add panel chrome in CSS for title and side panels
- Use a more decorative heading font only where appropriate
- Keep gameplay labels readable and minimal
- Use a restrained fantasy palette: stone, moss, ember, mana-blue, brass

Avoid:

- Neon arcade palette
- Plain rectangles with default borders
- All information dumped into one overlay

## Recommended Implementation Order

Do this in order. Do not skip ahead.

## Phase 0: Planning and Safety

Outcome:

- Clear rewrite scope
- Existing prototype preserved until replacement is ready

Tasks:

- Create branch `rewrite/gemcraft-inspired-v1`
- Move existing prototype files only if needed after replacement strategy is agreed
- Create new file map under `src/game/`
- Keep current deploy workflow and Vite config intact

Acceptance:

- Existing repo still builds
- New architecture folders exist

## Phase 1: Shell and UI Frame

Outcome:

- Real game shell exists before combat is rebuilt

Tasks:

- Replace [`index.html`](index.html) with a cleaner app shell
- Rework [`src/styles.css`](src/styles.css) for fantasy strategy UI
- Add title screen overlay
- Add top HUD bar
- Add right-side tower panel
- Add build tray

Files:

- [`index.html`](index.html)
- [`src/styles.css`](src/styles.css)
- `src/game/ui/*`

Acceptance:

- Page looks like a real game menu even before full gameplay exists
- Buttons are clickable and laid out for mouse users
- Mobile width still renders cleanly

## Phase 2: State and Data Rewrite

Outcome:

- State is structured enough for parallel development

Tasks:

- Replace [`src/state.js`](src/state.js) with modular data/state files
- Define canonical game state
- Add selectors for derived data
- Create tower, enemy, wave, and map data modules

Files:

- `src/game/state/*`
- `src/game/data/*`
- Remove or deprecate [`src/state.js`](src/state.js)

Acceptance:

- No rendering file contains hardcoded tower/enemy stats
- State shape is documented in code

## Phase 3: Map and Placement

Outcome:

- Build phase feels intentional and readable

Tasks:

- Build map renderer
- Add buildable cells or pads
- Show placement validity before click
- Show tower range preview
- Add tower selection tray

Files:

- `src/game/render/renderMap.js`
- `src/game/systems/inputSystem.js`
- `src/game/systems/buildSystem.js`
- `src/game/ui/panelTowerDetails.js`

Acceptance:

- User can clearly tell where towers may be placed
- Placement invalid states are visible before click

## Phase 4: Enemy, Wave, and Combat

Outcome:

- Core game loop feels satisfying

Tasks:

- Implement wave scheduler
- Implement enemy movement
- Implement tower targeting
- Implement projectile system
- Implement hit, death, and reward handling

Files:

- `src/game/systems/waveSystem.js`
- `src/game/systems/enemySystem.js`
- `src/game/systems/combatSystem.js`
- `src/game/systems/projectileSystem.js`
- `src/game/render/renderEnemies.js`
- `src/game/render/renderProjectiles.js`
- `src/game/render/renderEffects.js`

Acceptance:

- Wave start works through UI button
- Towers attack automatically
- Enemies die with visible feedback
- Currency increases correctly

## Phase 5: Upgrades and Selection Panel

Outcome:

- Towers feel like strategic investments, not placeholders

Tasks:

- Add tower selection state
- Add upgrade definitions
- Add sell action
- Add side panel stats and buttons

Files:

- `src/game/systems/uiSystem.js`
- `src/game/systems/economySystem.js`
- `src/game/ui/panelTowerDetails.js`
- `src/game/data/towers.js`

Acceptance:

- Clicking a tower opens details panel
- Upgrade changes stats and visuals
- Sell refunds correct amount

## Phase 6: Polish Pass

Outcome:

- Game looks shippable

Tasks:

- Add screen transitions
- Add ambient map details
- Improve fonts, spacing, and panel hierarchy
- Add sound effect hooks or placeholders
- Tune pacing and difficulty

Files:

- `src/styles.css`
- `src/game/render/*`
- `src/game/ui/*`

Acceptance:

- Screenshots look intentional
- UI readability is strong at a glance
- No prototype feel remains

## Task Format For AI Agents

Use this exact format when assigning work to weaker agents.

```text
Task ID: UI-01
Goal: Build the top HUD bar and right-side info panel.
Files to edit: index.html, src/styles.css, src/game/ui/panelTopBar.js, src/game/ui/panelTowerDetails.js
Do not edit: combat logic, wave logic, deploy workflow
Inputs: Existing Vite app shell, rewrite plan
Output: Clickable HUD and side panel with placeholder data
Acceptance:
- Top bar shows lives, mana, and wave label
- Right panel exists and collapses cleanly on narrow screens
- Layout works at 1440px and 390px widths
Verification:
- Run npm run build
- Capture screenshot
- Confirm no console errors
```

## Suggested Initial Agent Task List

### Agent Task UI-01

- Goal: Build the new shell layout
- Files: [`index.html`](index.html), [`src/styles.css`](src/styles.css)
- Do:
  - Create title overlay
  - Create HUD regions
  - Create side panel and build tray containers
  - Create responsive layout
- Do not:
  - Add combat logic
  - Change deployment config

### Agent Task DATA-01

- Goal: Replace monolithic state config with modular data files
- Files: `src/game/state/*`, `src/game/data/*`
- Do:
  - Define tower, enemy, map, and wave data modules
  - Define initial state factory
  - Define selectors
- Do not:
  - Render anything

### Agent Task MAP-01

- Goal: Implement battlefield and placement grid visuals
- Files: `src/game/render/renderMap.js`, `src/game/systems/buildSystem.js`
- Do:
  - Draw map
  - Mark buildable spaces
  - Show placement hover states
- Do not:
  - Add enemy combat logic

### Agent Task COMBAT-01

- Goal: Implement enemy movement and wave spawning
- Files: `src/game/systems/enemySystem.js`, `src/game/systems/waveSystem.js`
- Do:
  - Spawn enemies from wave data
  - Move enemies along path
  - Apply life loss on leak
- Do not:
  - Handle UI panels

### Agent Task COMBAT-02

- Goal: Implement towers, targeting, projectiles, and damage
- Files: `src/game/systems/combatSystem.js`, `src/game/systems/projectileSystem.js`
- Do:
  - Target enemies
  - Spawn projectiles or beams
  - Apply hit effects and rewards
- Do not:
  - Redesign map or title screen

### Agent Task UI-02

- Goal: Build tower selection and upgrade panel
- Files: `src/game/ui/panelTowerDetails.js`, `src/game/systems/uiSystem.js`
- Do:
  - Show selected tower stats
  - Add upgrade and sell buttons
  - Reflect changes in state
- Do not:
  - Change enemy movement logic

### Agent Task QA-01

- Goal: Restore deterministic automation flow
- Files: [`src/main.js`](src/main.js), `src/game/bootstrap.js`, relevant state selectors
- Do:
  - Ensure `window.advanceTime(ms)` works
  - Ensure `window.render_game_to_text()` returns current game state
  - Verify with Playwright client after meaningful features land
- Do not:
  - Redesign UI

## Acceptance Checklist For The Whole Rewrite

- The game opens to a real title screen
- Main gameplay screen has polished HUD and panels
- `Play` / `Start Wave` / `Upgrade` / `Sell` are mouse-accessible
- Tower placement feedback is readable before click
- Combat visuals are satisfying and legible
- At least 4 towers feel mechanically different
- At least 5 enemies feel mechanically different
- Upgrade loop is meaningful
- The project looks like a real game, not a prototype
- `npm run build` passes
- `window.advanceTime(ms)` works
- `window.render_game_to_text()` works
- Playwright screenshot review passes

## Notes For Agents

- Preserve the deployment workflow unless explicitly assigned to change it.
- Prefer replacing the current `src/game.js` logic with modular files instead of making it larger.
- Keep commits small and scoped to a single task ID.
- If a task touches both visuals and systems, split it into two tasks.
- If in doubt, optimize for clarity and polish over novelty.
