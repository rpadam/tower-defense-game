function resource(label, value, className = '') {
  const safeClass = className ? ` ${className}` : '';
  return `<span class="resource-pill${safeClass}">${label}: <strong>${value}</strong></span>`;
}

export function renderTopBar(element, viewState) {
  element.innerHTML = `
    <div>
      <h1>Aether Bastion Defense</h1>
      <p>Build phase control panel</p>
    </div>
    <div class="resource-list">
      ${resource('Lives', viewState.lives, 'leaf')}
      ${resource('Gold', viewState.gold, 'ember')}
      ${resource('Wave', `${viewState.wave}/${viewState.maxWaves}`)}
      ${resource('Overdrive', `${viewState.overdrive}%`, 'mana')}
    </div>
  `;
}
