export function renderTowerDetails(element, state) {
  const message = state.infoMessage || 'Place towers on safe ground. Avoid lane lines.';
  element.innerHTML = `
    <h2>Tower Details</h2>
    <p>${message}</p>
    <div class="detail-card">
      <h3>Selected Tower</h3>
      <p class="value">${state.selectedTowerLabel}</p>
    </div>
    <div class="detail-card">
      <h3>Battle State</h3>
      <p>Mode: <span class="value">${state.mode}</span></p>
      <p>Enemies Active: <span class="value">${state.enemyCount}</span></p>
      <p>Queued Spawn: <span class="value">${state.queueCount}</span></p>
    </div>
    <div class="detail-card">
      <h3>Hints</h3>
      <p>Tap tower buttons for mobile-friendly build selection.</p>
      <p>Use the wave button when your setup is ready.</p>
    </div>
  `;
}
