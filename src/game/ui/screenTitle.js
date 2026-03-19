export function createTitleScreen({ onPlay }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'title-card';
  wrapper.innerHTML = `
    <h2>Path Shift TD</h2>
    <p>
      Defend the core through shifting lanes and timed overdrive bursts.
      Build your first line, then launch the wave when ready.
    </p>
    <button class="play-btn" id="play-btn" type="button">Play</button>
    <p class="title-help">Controls still work: 1/2/3 towers, N wave, O overdrive, F fullscreen, R reset.</p>
  `;

  const playBtn = wrapper.querySelector('#play-btn');
  playBtn?.addEventListener('click', () => {
    onPlay();
  });

  return wrapper;
}
