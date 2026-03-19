import { createTitleScreen } from './ui/screenTitle.js';
import { renderTopBar } from './ui/panelTopBar.js';
import { renderBuildTray } from './ui/panelBuildTray.js';
import { renderTowerDetails } from './ui/panelTowerDetails.js';

const DEFAULT_VIEW_STATE = {
  mode: 'menu',
  lives: 20,
  gold: 140,
  wave: 0,
  maxWaves: 12,
  overdrive: 0,
  enemyCount: 0,
  queueCount: 0,
  selectedTowerType: 'bolt',
  selectedTowerLabel: 'Bolt Tower',
  infoMessage: 'Set your opening defense and press Play.'
};

const TOWER_LABELS = {
  bolt: 'Bolt Tower',
  burst: 'Burst Tower',
  frost: 'Frost Tower'
};

function keyPress(key) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key }));
}

function readViewState() {
  if (typeof window.render_game_to_text !== 'function') {
    return DEFAULT_VIEW_STATE;
  }

  try {
    const parsed = JSON.parse(window.render_game_to_text());
    return {
      mode: parsed.mode ?? 'playing',
      lives: parsed.resources?.lives ?? 0,
      gold: parsed.resources?.gold ?? 0,
      wave: parsed.wave?.current ?? 0,
      maxWaves: parsed.wave?.max ?? 0,
      overdrive: Math.round(parsed.resources?.overdriveCharge ?? 0),
      enemyCount: parsed.enemies?.length ?? 0,
      queueCount: parsed.wave?.enemiesWaiting ?? 0,
      selectedTowerType: parsed.selectedTowerType ?? 'bolt',
      selectedTowerLabel: TOWER_LABELS[parsed.selectedTowerType] ?? 'Unknown Tower',
      infoMessage: parsed.mode === 'menu' ? 'Press Play to enter the battlefield.' : ''
    };
  } catch {
    return DEFAULT_VIEW_STATE;
  }
}

export function bootstrapGameShell({ game, canvas }) {
  const titleScreen = document.querySelector('#title-screen');
  const topBar = document.querySelector('#top-bar');
  const buildTray = document.querySelector('#build-tray');
  const towerDetails = document.querySelector('#tower-details');

  if (!titleScreen || !topBar || !buildTray || !towerDetails) {
    throw new Error('Game shell elements are missing');
  }

  game.start();

  const refreshPanels = () => {
    const viewState = readViewState();
    renderTopBar(topBar, viewState);
    renderBuildTray(buildTray, viewState, {
      selectTower: (key) => keyPress(key),
      startWave: () => keyPress('n'),
      overdrive: () => keyPress('o')
    });
    renderTowerDetails(towerDetails, viewState);
  };

  const title = createTitleScreen({
    onPlay: () => {
      titleScreen.classList.add('is-hidden');
      canvas.focus();
      const rect = canvas.getBoundingClientRect();
      canvas.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2
        })
      );
    }
  });
  titleScreen.append(title);

  refreshPanels();
  window.setInterval(refreshPanels, 200);
}
