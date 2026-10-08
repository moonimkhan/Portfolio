(() => {
  'use strict';

  document.getElementById('year').textContent = new Date().getFullYear();

  const player = document.getElementById('music-player');
  const tracks = [...document.querySelectorAll('.track-button')];
  const nowPlaying = document.getElementById('now-playing');
  const musicStatus = document.getElementById('music-status');
  const lyricLine = document.getElementById('lyric-line');
  const lyricsCache = new Map();
  let selectedTrack = tracks.find((track) => track.getAttribute('aria-pressed') === 'true') || tracks[0];
  let selectionVersion = 0;
  let currentLyrics = [];

  function updateLyrics() {
    let line = '';
    for (const lyric of currentLyrics) {
      if (lyric.time > player.currentTime) break;
      line = lyric.text;
    }
    if (lyricLine.textContent !== line) lyricLine.textContent = line;
  }

  function loadLyrics(path) {
    if (!lyricsCache.has(path)) {
      const request = fetch(path)
        .then((response) => {
          if (!response.ok) throw new Error('Lyrics unavailable');
          return response.text();
        })
        .then((text) => {
          const lyrics = [];
          for (const line of text.split(/\r?\n/)) {
            const timestamps = [...line.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];
            const words = line.replace(/\[[^\]]*\]/g, '').trim();
            for (const timestamp of timestamps) {
              lyrics.push({ time: Number(timestamp[1]) * 60 + Number(timestamp[2]), text: words });
            }
          }
          return lyrics.sort((a, b) => a.time - b.time);
        })
        .catch(() => []);
      lyricsCache.set(path, request);
    }
    return lyricsCache.get(path);
  }

  function updateTrackSelection() {
    for (const track of tracks) {
      track.setAttribute('aria-pressed', String(track === selectedTrack));
    }
    nowPlaying.textContent = `${selectedTrack.dataset.title} — ${selectedTrack.dataset.artist}`;
  }

  for (const track of tracks) {
    track.disabled = false;
    track.addEventListener('click', async () => {
      musicStatus.textContent = '';
      if (track !== selectedTrack) {
        selectedTrack = track;
        selectionVersion += 1;
        currentLyrics = [];
        lyricLine.textContent = '';
        player.src = track.dataset.src;
        player.load();
        updateTrackSelection();
      }
      const version = selectionVersion;
      try {
        await player.play();
      } catch (error) {
        if (version === selectionVersion && error.name !== 'AbortError') {
          musicStatus.textContent = 'Playback could not start. Try the audio controls or choose another track.';
        }
      }
    });
  }

  player.addEventListener('play', async () => {
    musicStatus.textContent = '';
    const version = selectionVersion;
    const lyrics = await loadLyrics(selectedTrack.dataset.lyrics);
    if (version !== selectionVersion) return;
    currentLyrics = lyrics;
    if (!player.ended) updateLyrics();
  });
  player.addEventListener('timeupdate', updateLyrics);
  player.addEventListener('seeked', updateLyrics);
  player.addEventListener('ended', () => { lyricLine.textContent = ''; });
  player.addEventListener('error', () => {
    lyricLine.textContent = '';
    musicStatus.textContent = 'This track could not be loaded. Please try another track.';
  });
  updateTrackSelection();

  const dialog = document.getElementById('terminal-dialog');
  const openButton = document.getElementById('terminal-open');
  const closeButton = document.getElementById('terminal-close');
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const responses = {
    help: 'Available commands:\n  help      Show available commands\n  whoami    About me\n  neofetch  Portfolio profile\n  clear     Clear the terminal\n  exit      Close the terminal\n  sudo      About this terminal',
    whoami: 'Muhammad Mubtasim Moonim Khan\nTech enthusiast, cybersecurity aspirant, and system tinkerer.\nLocation: Bangladesh',
    neofetch: 'mubtasim@portfolio\n------------------\nLocation: Bangladesh\nInterests: Cybersecurity, systems, and technology\nHobbies: Formula 1, music, and the MCU\nStatus: Always learning',
    sudo: 'This is an interactive portfolio demo. It cannot run system commands or change your device.'
  };

  openButton.addEventListener('click', () => {
    dialog.showModal();
    input.focus();
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => openButton.focus());
  openButton.hidden = false;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const command = input.value.trim();
    input.value = '';
    if (!command) return;

    output.append(document.createTextNode(`\n$ ${command}\n`));
    const name = command.split(/\s+/)[0].toLowerCase();
    if (name === 'clear') {
      output.textContent = '';
    } else if (name === 'exit') {
      dialog.close();
    } else {
      const response = Object.prototype.hasOwnProperty.call(responses, name)
        ? responses[name]
        : `Unknown command: ${name}. Type "help" to see available commands.`;
      output.append(document.createTextNode(`${response}\n`));
    }
    output.scrollTop = output.scrollHeight;
  });
})();
