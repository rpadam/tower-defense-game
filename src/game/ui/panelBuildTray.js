const TOWER_BUTTONS = [
  { id: 'bolt', key: '1', label: 'Bolt Tower', cost: 60 },
  { id: 'burst', key: '2', label: 'Burst Tower', cost: 90 },
  { id: 'frost', key: '3', label: 'Frost Tower', cost: 80 }
];

export function renderBuildTray(element, state, handlers) {
  const towerButtons = TOWER_BUTTONS.map((tower) => {
    const activeClass = state.selectedTowerType === tower.id ? ' active' : '';
    return `
      <button type="button" class="build-btn${activeClass}" data-tower="${tower.id}" data-key="${tower.key}">
        ${tower.label}
        <small>${tower.cost}g • key ${tower.key}</small>
      </button>
    `;
  }).join('');

  element.innerHTML = `
    ${towerButtons}
    <button type="button" class="action-btn" data-action="wave">Start Wave (N)</button>
    <button type="button" class="action-btn" data-action="overdrive">Overdrive (O)</button>
  `;

  element.querySelectorAll('[data-tower]').forEach((button) => {
    button.addEventListener('click', () => {
      handlers.selectTower(button.dataset.key || '1');
    });
  });

  const waveBtn = element.querySelector('[data-action="wave"]');
  waveBtn?.addEventListener('click', () => handlers.startWave());
  const overdriveBtn = element.querySelector('[data-action="overdrive"]');
  overdriveBtn?.addEventListener('click', () => handlers.overdrive());
}
