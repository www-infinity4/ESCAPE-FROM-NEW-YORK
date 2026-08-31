'use strict';

(() => {
  // Artist / label uploads. Keep the full YouTube player and its controls visible.
  const tracks = [
    { title: 'The Joker', artist: 'Steve Miller Band', videoId: 'dV3AziKTBUo', alternate: 'q3mfENm6VJc' },
    { title: 'Have You Ever Seen the Rain', artist: 'Creedence Clearwater Revival', videoId: 'u1V8YRJnr4Q', alternate: 'JKES3yfnD9U' },
    { title: 'Joy to the World', artist: 'Three Dog Night', videoId: 'EVcpKjXYa5c', alternate: '7dMIMJqDq0s' },
    { title: 'Breathe (In the Air)', artist: 'Pink Floyd', videoId: 'jcz0YxYl6Ac', alternate: '_396y7Vk9NA' },
    { title: 'Smoke on the Water', artist: 'Deep Purple', videoId: 'Q2FzZSBD5LE', alternate: '3pVQj2v7tBI' },
    { title: 'Dear Mr. Fantasy', artist: 'Traffic', videoId: 'sS_eHdqcrM8' },
    { title: 'The Power of Love', artist: 'Huey Lewis and the News', videoId: 'wBl2QGAIx1s', alternate: 'wIiVp3poe2c' },
    { title: 'Back in the High Life Again', artist: 'Steve Winwood', videoId: 'Adw772km7PQ', alternate: 'ojcSy6kXciI' },
    { title: 'Another Day in Paradise', artist: 'Phil Collins', videoId: 'Qt2mbGP6vFI', alternate: 'qkDVozHVeM8' },
    { title: 'Sweet Emotion', artist: 'Aerosmith', videoId: '82cJgPXU-ik', alternate: '15aa3WIHk5M' },
    { title: 'Come As You Are', artist: 'Nirvana', videoId: 'vabnZ9-ex7o', alternate: 'W2QeQ9ZufAk' },
    { title: 'Alive', artist: 'Pearl Jam', videoId: 'qM0zINtulhM', alternate: '3MutXUvS37k' },
    { title: 'Black Hole Sun', artist: 'Soundgarden', videoId: '3mbBbFH9fAg', alternate: '9kIv6vVRKpw' },
    { title: 'Would?', artist: 'Alice In Chains', videoId: 'Nco_kh8xJDs', alternate: '4L56DPmFl8w' },
    { title: 'Interstate Love Song', artist: 'Stone Temple Pilots', videoId: 'yjJL9DGU7Gg', alternate: 'UjjyC8lmoQs' },
    { title: '1979', artist: 'The Smashing Pumpkins', videoId: '4aeETEoNfOg', alternate: 'A6M0yLxLCNA' },
    { title: "Say It Ain't So", artist: 'Weezer', videoId: 'ENXvZ9YRjbo', alternate: 'LQcMOI8dMas' },
    { title: 'High and Dry', artist: 'Radiohead', videoId: '7qFfFVSerQo', alternate: '7fv84nPfTH0' },
    { title: 'Shine', artist: 'Collective Soul', videoId: '_m0bI82Rz_k', alternate: 'iuB1A2VJ3-k' },
    { title: 'Learn to Fly', artist: 'Foo Fighters', videoId: '1VQ_3sBZEm0' }
  ];
  const $ = id => document.getElementById(id);
  const toggle = $('music-toggle'), status = $('audio-status');
  const radio = new Audio();
  radio.preload = 'metadata';
  radio.volume = 0.9;
  let player, ready = false, enabled = false, playing = false, sceneIndex = 0;
  let videoId = tracks[0].videoId, loadedId = '', loadTimer, playbackTimer;

  function updateButton() {
    toggle.textContent = playing ? 'PAUSE' : 'PLAY';
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? 'Pause soundtrack' : 'Play soundtrack');
  }
  function updateTrack() {
    const track = tracks[sceneIndex];
    $('track-label').textContent = `SNAKE'S HEADSET · LEVEL ${Math.floor(sceneIndex / 10) + 1} · SONG ${sceneIndex % 10 + 1}/10`;
    $('track-title').textContent = track.title;
    $('track-artist').textContent = track.artist;
    $('youtube-link').href = `https://www.youtube.com/watch?v=${videoId}`;
    $('youtube-search').href = `https://www.youtube.com/results?search_query=${encodeURIComponent(track.artist + ' ' + track.title + ' official')}`;
  }
  function playCurrent() {
    if (!enabled) return;
    if (!ready) {
      status.textContent = 'Loading YouTube. You can keep playing the game.';
      return;
    }
    status.textContent = 'Starting song. If it stays paused, tap Play in the YouTube player.';
    clearTimeout(playbackTimer);
    playbackTimer = setTimeout(() => {
      if (enabled && !playing) status.textContent = 'Playback has not started. Tap Play in the YouTube player, or use Open on YouTube if it remains unavailable.';
    }, 12000);
    if (loadedId !== videoId) {
      loadedId = videoId;
      player.loadVideoById(videoId);
    } else player.playVideo();
  }
  function setScene(index) {
    if (!Number.isInteger(index) || !tracks[index]) return;
    sceneIndex = index;
    videoId = tracks[index].videoId;
    playing = false;
    updateTrack();
    updateButton();
    if (ready) {
      if (enabled) playCurrent();
      else { loadedId = videoId; player.cueVideoById(videoId); }
    }
  }
  function enable() { enabled = true; playCurrent(); }
  function disable() {
    enabled = false;
    playing = false;
    clearTimeout(playbackTimer);
    if (ready) player.pauseVideo();
    updateButton();
    status.textContent = 'Soundtrack paused. The game continues normally.';
  }
  toggle.addEventListener('click', () => playing ? disable() : enable());

  function createPlayer() {
    if (player) return;
    player = new window.YT.Player('youtube-player', {
      width: '100%', height: '240', videoId,
      playerVars: { playsinline: 1, controls: 1, rel: 0, origin: window.location.origin },
      events: {
        onReady(event) {
          clearTimeout(loadTimer);
          ready = true;
          event.target.getIframe().title = 'Snake’s Revenge YouTube soundtrack';
          event.target.setVolume(38);
          // The scene may have changed while YouTube loaded.
          if (enabled) playCurrent();
          else { loadedId = videoId; event.target.cueVideoById(videoId); }
        },
        onStateChange(event) {
          playing = event.data === 1;
          if (playing) { clearTimeout(playbackTimer); enabled = true; status.textContent = 'Playing on YouTube. The next scene starts the next song.'; }
          else if (event.data === 2) status.textContent = 'Paused. Tap Play to resume the song.';
          else if (event.data === 0) status.textContent = 'Song finished. Tap Play to replay, or continue to the next scene.';
          updateButton();
        },
        onAutoplayBlocked() {
          playing = false;
          enabled = false;
          updateButton();
          status.textContent = 'Your browser needs a tap: press Play in the YouTube player below.';
        },
        onError(event) {
          const track = tracks[sceneIndex];
          if ([100, 101, 150].includes(event.data) && track.alternate && videoId !== track.alternate) {
            videoId = track.alternate;
            updateTrack();
            if (enabled) playCurrent();
            else { loadedId = videoId; player.cueVideoById(videoId); }
            return;
          }
          playing = false;
          enabled = false;
          loadedId = '';
          updateButton();
          status.textContent = `YouTube could not play this song here (code ${event.data}). Use Open on YouTube or Find song. The game still works.`;
        }
      }
    });
  }
  const previousReady = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => { previousReady?.(); createPlayer(); };
  if (window.YT?.Player) createPlayer();
  else {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => { status.textContent = 'YouTube could not load. Use Open on YouTube, or reload this page to retry.'; };
    document.head.appendChild(script);
  }
  loadTimer = setTimeout(() => {
    if (!ready) status.textContent = 'YouTube is taking longer to load. You can use Open on YouTube or keep playing.';
  }, 15000);
  radio.addEventListener('play', () => { if (ready) player.setVolume(12); });
  const restoreMusic = () => { if (ready) player.setVolume(38); };
  ['ended', 'pause', 'error'].forEach(event => radio.addEventListener(event, restoreMusic));
  window.SNAKES_REVENGE_SOUNDTRACK = {
    tracks: tracks.map(track => ({ ...track })), setScene, enable, disable,
    currentTrack: () => ({ ...tracks[sceneIndex], index: sceneIndex }),
    async playRadioMessage(url) {
      if (!url) return;
      radio.src = url;
      try { await radio.play(); }
      catch (_) { restoreMusic(); status.textContent = 'Tap the screen before playing a radio message.'; }
    }
  };
  updateTrack();
  updateButton();
})();
