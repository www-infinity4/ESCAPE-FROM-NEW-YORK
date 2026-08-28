'use strict';

(() => {
  const tracks = [
    { title: 'The Joker', artist: 'Steve Miller Band' },
    { title: 'Have You Ever Seen the Rain', artist: 'Creedence Clearwater Revival' },
    { title: 'Joy to the World', artist: 'Three Dog Night' },
    { title: 'Breathe (In the Air)', artist: 'Pink Floyd' },
    { title: 'Smoke on the Water', artist: 'Deep Purple' },
    { title: 'Dear Mr. Fantasy', artist: 'Traffic' },
    { title: 'The Power of Love', artist: 'Huey Lewis and the News' },
    { title: 'Back in the High Life Again', artist: 'Steve Winwood' },
    { title: 'Another Day in Paradise', artist: 'Phil Collins' },
    { title: 'Sweet Emotion', artist: 'Aerosmith' }
  ];
  const configuredSources = window.SNAKES_REVENGE_AUDIO || {};
  const music = new Audio();
  const radio = new Audio();
  music.preload = 'metadata';
  radio.preload = 'metadata';
  music.volume = 0.38;
  radio.volume = 0.9;

  const title = document.getElementById('track-title');
  const artist = document.getElementById('track-artist');
  const label = document.getElementById('track-label');
  const toggle = document.getElementById('music-toggle');
  const status = document.getElementById('audio-status');
  let sceneIndex = -1;
  let enabled = false;

  function sourceFor(index) {
    const source = configuredSources[index + 1];
    return typeof source === 'string' ? source : source?.url;
  }

  function updateButton() {
    toggle.textContent = enabled ? 'ON' : 'OFF';
    toggle.setAttribute('aria-pressed', String(enabled));
  }

  async function playCurrent() {
    const source = sourceFor(sceneIndex);
    if (!enabled) return;
    if (!source) {
      status.textContent = 'Track identified; licensed audio source is not connected yet.';
      return;
    }
    if (music.src !== new URL(source, window.location.href).href) music.src = source;
    try {
      await music.play();
      status.textContent = 'Playing through Snake’s headset.';
    } catch (_error) {
      status.textContent = 'Tap ON to let this phone start the soundtrack.';
      enabled = false;
      updateButton();
    }
  }

  function setScene(index) {
    sceneIndex = index;
    const track = tracks[index];
    if (!track) return;
    music.pause();
    music.removeAttribute('src');
    music.load();
    label.textContent = `SNAKE'S HEADSET · SONG ${index + 1}`;
    title.textContent = track.title;
    artist.textContent = track.artist;
    status.textContent = sourceFor(index)
      ? 'Changing scenes changes the soundtrack automatically.'
      : 'Track identified; licensed audio source is not connected yet.';
    playCurrent();
  }

  toggle.addEventListener('click', () => {
    enabled = !enabled;
    updateButton();
    if (enabled) playCurrent();
    else {
      music.pause();
      status.textContent = 'Soundtrack paused. The game will continue normally.';
    }
  });

  radio.addEventListener('play', () => { music.volume = 0.12; });
  const restoreMusic = () => { music.volume = 0.38; };
  radio.addEventListener('ended', restoreMusic);
  radio.addEventListener('pause', restoreMusic);
  music.addEventListener('error', () => {
    status.textContent = 'That audio source is unavailable. The game is still ready to play.';
  });

  window.SNAKES_REVENGE_SOUNDTRACK = {
    tracks: tracks.map(track => ({ ...track })),
    setScene,
    enable() { enabled = true; updateButton(); return playCurrent(); },
    disable() { enabled = false; music.pause(); updateButton(); },
    async playRadioMessage(url) {
      if (!url) return;
      radio.src = url;
      try { await radio.play(); }
      catch (_error) { status.textContent = 'Tap the screen before playing a radio message.'; }
    }
  };
})();
