/* =====================================================
   WAVE – app.js
   Sections: icons, state, library, views, playback,
   now-playing bar, waveform, startup
   ===================================================== */

// ---------- ICONS (drawn as SVG so they work offline and take any colour) ----------
const ICON_PATHS = {
  play: 'M8 5v14l11-7z',
  pause: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
  prev: 'M6 6h2v12H6zm3.5 6l8.5 6V6z',
  next: 'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z',
  shuffle: 'M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z',
  repeatone: 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z',
  volume: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
  mute: 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z',
  search: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  folder: 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z',
  addfiles: 'M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z',
  note: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
  back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'
};

function icon(name, size) {
  size = size || 24;
  return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size +
    '" fill="currentColor" aria-hidden="true"><path d="' + ICON_PATHS[name] + '"/></svg>';
}

// fill every element that has data-icon="..." in the HTML
document.querySelectorAll('[data-icon]').forEach(function (el) {
  el.innerHTML = icon(el.dataset.icon, el.dataset.size ? Number(el.dataset.size) : 24);
});

// ---------- SHORTCUTS TO PAGE ELEMENTS ----------
const $ = function (id) { return document.getElementById(id); };
const player = $('player');
const content = $('content');
const tabsEl = $('tabs');
const searchEl = $('search');
const filePicker = $('filePicker');
const folderPicker = $('folderPicker');
const progress = $('progress');
const volume = $('volume');

// ---------- STATE (what the app remembers while it's open) ----------
let library = [];          // every song we know about
const byId = new Map();    // quick lookup: id -> song
let nextId = 1;

let queue = [];            // ids of the songs in play order
let queuePos = -1;         // where we are in the queue
let currentId = null;      // the song playing now
let viewList = [];         // the songs shown on screen right now

let activeTab = 'songs';
let detail = null;         // { type: 'album' | 'folder', key: '...' } when drilled into one
let shuffleOn = false;

// ---------- SMALL HELPERS ----------
function esc(text) {
  return String(text).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function formatTime(seconds) {
  if (!isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ':' + String(s).padStart(2, '0');
}

function isAudio(file) {
  return file.type.startsWith('audio/') || /\.(mp3|m4a|wav|ogg|flac|aac|opus|wma)$/i.test(file.name);
}

function compareTitle(a, b) {
  return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
}

function sortedSongs(list) {
  return list.slice().sort(compareTitle);
}

function albumOf(song) { return song.album || 'Unknown album'; }
function lastSegment(path) { const p = path.split('/'); return p[p.length - 1]; }

// ---------- THE LIBRARY ----------
function addFiles(fileList) {
  const known = new Set(library.map(function (s) { return s.key; }));
  const fresh = [];

  Array.from(fileList).forEach(function (file) {
    if (!isAudio(file)) return;

    const path = file.webkitRelativePath || '';
    const key = path + '|' + file.name + '|' + file.size + '|' + file.lastModified;
    if (known.has(key)) return;   // already added
    known.add(key);

    const parts = path.split('/');
    const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : 'Loose files';

    const song = {
      id: nextId++,
      key: key,
      file: file,
      url: URL.createObjectURL(file),
      title: file.name.replace(/\.[^.]+$/, ''),   // file name without .mp3 until we read the tags
      artist: '',
      album: '',
      track: 0,
      folder: folder,
      artwork: null
    };
    library.push(song);
    byId.set(song.id, song);
    fresh.push(song);
  });

  if (fresh.length === 0) return;
  render();
  readTags(fresh);
}

// Reads title / artist / album / artwork hidden inside each file (4 at a time)
function readTags(songs) {
  if (typeof jsmediatags === 'undefined') return;
  let i = 0;

  function next() {
    if (i >= songs.length) return;
    const song = songs[i++];
    jsmediatags.read(song.file, {
      onSuccess: function (result) {
        try { applyTags(song, result.tags); } finally { next(); }
      },
      onError: function () { next(); }
    });
  }
  for (let w = 0; w < 4; w++) next();
}

function applyTags(song, tags) {
  if (tags.title) song.title = tags.title;
  if (tags.artist) song.artist = tags.artist;
  if (tags.album) song.album = tags.album;
  if (tags.track) song.track = parseInt(tags.track, 10) || 0;
  if (tags.picture) {
    const blob = new Blob([new Uint8Array(tags.picture.data)], { type: tags.picture.format });
    song.artwork = URL.createObjectURL(blob);
  }
  scheduleRender();
  if (song.id === currentId) showNowPlaying(song);
}

// Tags arrive one by one, so we redraw at most every 300ms instead of every time
let renderTimer = null;
function scheduleRender() {
  if (renderTimer) return;
  renderTimer = setTimeout(function () { renderTimer = null; render(); }, 300);
}

// ---------- VIEWS (build the HTML for each tab) ----------
function thumb(song) {
  const inner = song && song.artwork
    ? '<img src="' + song.artwork + '" alt="">'
    : icon('note', 24);
  return '<div class="thumb">' + inner + '</div>';
}

function emptyLibrary() {
  return '<div class="empty">' +
    '<div class="empty-icon">' + icon('note', 96) + '</div>' +
    '<p>Your library is empty</p>' +
    '<p class="hint">Add a folder of music to get started</p>' +
    '<button class="play-btn big" data-action="pick-folder" title="Add folder" aria-label="Add folder">' + icon('folder', 28) + '</button>' +
    '</div>';
}

function comingSoon(text) {
  return '<div class="empty"><div class="empty-icon">' + icon('note', 96) + '</div>' +
    '<p>' + text + '</p><p class="hint">Coming soon</p></div>';
}

function songsView(list) {
  if (library.length === 0) return emptyLibrary();
  if (list.length === 0) return '<div class="empty"><p>No songs found</p></div>';

  let html = '<div class="list-head">' +
    '<span class="count">' + list.length + (list.length === 1 ? ' song' : ' songs') + '</span>' +
    '<span class="spacer"></span>' +
    '<button class="icon-btn" data-action="shuffle-all" title="Shuffle" aria-label="Shuffle">' + icon('shuffle') + '</button>' +
    '<button class="play-btn" data-action="play-all" title="Play" aria-label="Play">' + icon('play', 28) + '</button>' +
    '</div>';

  list.forEach(function (s) {
    html += '<div class="row' + (s.id === currentId ? ' playing' : '') + '" data-action="play-song" data-id="' + s.id + '">' +
      thumb(s) +
      '<div><div class="row-title">' + esc(s.title) + '</div>' +
      '<div class="row-sub">' + esc(s.artist || 'Unknown artist') + '</div></div>' +
      '<div class="row-album">' + esc(s.album) + '</div>' +
      '</div>';
  });
  return html;
}

function albumsView() {
  if (library.length === 0) return emptyLibrary();
  const groups = new Map();
  library.forEach(function (s) {
    const name = albumOf(s);
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(s);
  });

  const names = Array.from(groups.keys()).sort(function (a, b) {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
  });

  let html = '<div class="grid">';
  names.forEach(function (name) {
    const songs = groups.get(name);
    const withArt = songs.find(function (s) { return s.artwork; }) || songs[0];
    const artists = new Set(songs.map(function (s) { return s.artist; }).filter(Boolean));
    const sub = artists.size === 1 ? Array.from(artists)[0] : (artists.size > 1 ? 'Various artists' : 'Unknown artist');
    html += '<div class="card" data-action="open-album" data-key="' + encodeURIComponent(name) + '">' +
      thumb(withArt) +
      '<div class="card-title">' + esc(name) + '</div>' +
      '<div class="card-sub">' + esc(sub) + '</div></div>';
  });
  return html + '</div>';
}

function foldersView() {
  if (library.length === 0) return emptyLibrary();
  const groups = new Map();
  library.forEach(function (s) {
    if (!groups.has(s.folder)) groups.set(s.folder, []);
    groups.get(s.folder).push(s);
  });

  const paths = Array.from(groups.keys()).sort(function (a, b) {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
  });

  let html = '';
  paths.forEach(function (path) {
    const n = groups.get(path).length;
    html += '<div class="folder-row" data-action="open-folder" data-key="' + encodeURIComponent(path) + '">' +
      '<div class="thumb">' + icon('folder', 26) + '</div>' +
      '<div><div class="row-title">' + esc(lastSegment(path)) + '</div>' +
      '<div class="row-sub">' + esc(path) + '</div></div>' +
      '<div class="folder-count">' + n + (n === 1 ? ' song' : ' songs') + '</div></div>';
  });
  return html;
}

function forYouView() {
  if (library.length === 0) return emptyLibrary();
  viewList = sortedSongs(library);
  return '<div class="empty"><div class="empty-icon">' + icon('note', 96) + '</div>' +
    '<p>Personal mixes are coming soon</p>' +
    '<p class="hint">For now, shuffle your whole library</p>' +
    '<button class="play-btn big" data-action="shuffle-all" title="Shuffle all" aria-label="Shuffle all">' + icon('shuffle', 28) + '</button></div>';
}

function detailView() {
  let list, name;
  if (detail.type === 'album') {
    name = detail.key;
    list = library.filter(function (s) { return albumOf(s) === name; });
    list.sort(function (a, b) { return ((a.track || 9999) - (b.track || 9999)) || compareTitle(a, b); });
  } else {
    name = lastSegment(detail.key);
    list = sortedSongs(library.filter(function (s) { return s.folder === detail.key; }));
  }
  viewList = list;
  return '<div class="detail-head">' +
    '<button class="icon-btn" data-action="back" title="Back" aria-label="Back">' + icon('back') + '</button>' +
    '<h2>' + esc(name) + '</h2></div>' + songsView(list);
}

// Draws whatever the current tab / search needs
function render() {
  const scroll = content.scrollTop;
  const q = searchEl.value.trim().toLowerCase();
  let html;
  viewList = [];

  if (q) {
    viewList = sortedSongs(library.filter(function (s) {
      return (s.title + ' ' + s.artist + ' ' + s.album).toLowerCase().includes(q);
    }));
    html = songsView(viewList);
  } else if (detail) {
    html = detailView();
  } else if (activeTab === 'songs') {
    viewList = sortedSongs(library);
    html = songsView(viewList);
  } else if (activeTab === 'albums') {
    html = albumsView();
  } else if (activeTab === 'folder') {
    html = foldersView();
  } else if (activeTab === 'foryou') {
    html = forYouView();
  } else {
    html = comingSoon('Playlists');
  }

  content.innerHTML = html;
  content.scrollTop = scroll;

  tabsEl.querySelectorAll('.tab').forEach(function (t) {
    t.classList.toggle('active', t.dataset.tab === activeTab);
  });
}

function goTo(tab) {
  activeTab = tab;
  detail = null;
  searchEl.value = '';
  content.scrollTop = 0;
  render();
}

// ---------- CLICKS ----------
tabsEl.addEventListener('click', function (e) {
  const tab = e.target.closest('.tab');
  if (tab) goTo(tab.dataset.tab);
});

content.addEventListener('click', function (e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  if (action === 'play-song') {
    startQueue(viewList, Number(el.dataset.id));
  } else if (action === 'play-all') {
    if (viewList.length) startQueue(viewList, viewList[0].id);
  } else if (action === 'shuffle-all') {
    if (viewList.length === 0) return;
    setShuffle(true);
    startQueue(viewList, viewList[Math.floor(Math.random() * viewList.length)].id);
  } else if (action === 'open-album' || action === 'open-folder') {
    detail = { type: action === 'open-album' ? 'album' : 'folder', key: decodeURIComponent(el.dataset.key) };
    content.scrollTop = 0;
    render();
  } else if (action === 'back') {
    detail = null;
    content.scrollTop = 0;
    render();
  } else if (action === 'pick-folder') {
    folderPicker.click();
  }
});

searchEl.addEventListener('input', function () { detail = null; render(); });

$('addFilesBtn').addEventListener('click', function () { filePicker.click(); });
$('addFolderBtn').addEventListener('click', function () { folderPicker.click(); });
filePicker.addEventListener('change', function () { addFiles(filePicker.files); filePicker.value = ''; });
folderPicker.addEventListener('change', function () { addFiles(folderPicker.files); folderPicker.value = ''; });

// ---------- PLAYBACK ----------
function startQueue(list, id) {
  queue = list.map(function (s) { return s.id; });
  queuePos = queue.indexOf(id);
  playCurrent();
}

function playCurrent() {
  const song = byId.get(queue[queuePos]);
  if (!song) return;
  currentId = song.id;
  player.src = song.url;
  player.play().catch(function () { /* happens if you skip very fast: safe to ignore */ });
  showNowPlaying(song);
  highlightPlayingRow();
}

function nextSong() {
  if (queue.length === 0) return;
  if (shuffleOn && queue.length > 1) {
    let n;
    do { n = Math.floor(Math.random() * queue.length); } while (n === queuePos);
    queuePos = n;
  } else {
    queuePos = (queuePos + 1) % queue.length;
  }
  playCurrent();
}

function prevSong() {
  if (queue.length === 0) return;
  if (player.currentTime > 3) { player.currentTime = 0; return; }   // like most players: restart first
  queuePos = (queuePos - 1 + queue.length) % queue.length;
  playCurrent();
}

function togglePlay() {
  if (currentId === null) {
    if (library.length === 0) return;
    const list = sortedSongs(library);
    startQueue(list, list[0].id);
    return;
  }
  if (player.paused) { player.play(); } else { player.pause(); }
}

function setShuffle(on) {
  shuffleOn = on;
  $('shuffleBtn').classList.toggle('active', on);
}

function highlightPlayingRow() {
  content.querySelectorAll('.row').forEach(function (r) {
    r.classList.toggle('playing', Number(r.dataset.id) === currentId);
  });
}

// ---------- NOW PLAYING BAR ----------
function showNowPlaying(song) {
  $('npTitle').textContent = song.title;
  $('npArtist').textContent = song.artist || 'Unknown artist';
  $('npArt').innerHTML = thumb(song);
  document.title = song.title + ' - Wave';

  // lets your keyboard media keys and the Windows media popup show the song
  if ('mediaSession' in navigator && typeof MediaMetadata !== 'undefined') {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: song.album,
      artwork: [{ src: song.artwork || new URL('icon-512.png', location.href).href, sizes: '512x512' }]
    });
  }
}

$('npArt').innerHTML = thumb(null);

$('playBtn').addEventListener('click', togglePlay);
$('nextBtn').addEventListener('click', nextSong);
$('prevBtn').addEventListener('click', prevSong);
$('shuffleBtn').addEventListener('click', function () { setShuffle(!shuffleOn); });
$('loopBtn').addEventListener('click', function () {
  player.loop = !player.loop;
  $('loopBtn').classList.toggle('active', player.loop);
});

player.addEventListener('play', function () { $('playBtn').innerHTML = icon('pause', 28); });
player.addEventListener('pause', function () { $('playBtn').innerHTML = icon('play', 28); });
player.addEventListener('ended', nextSong);

// progress bar + times
function updateTime() {
  $('timeNow').textContent = formatTime(player.currentTime);
  $('timeTotal').textContent = formatTime(player.duration);
}
player.addEventListener('timeupdate', function () {
  progress.value = player.duration ? (player.currentTime / player.duration) * 100 : 0;
  updateTime();
});
player.addEventListener('loadedmetadata', updateTime);
progress.addEventListener('input', function () {
  if (player.duration) player.currentTime = (progress.value / 100) * player.duration;
});

// volume
volume.addEventListener('input', function () {
  player.volume = Number(volume.value);
  player.muted = false;
});
$('muteBtn').addEventListener('click', function () { player.muted = !player.muted; });
player.addEventListener('volumechange', function () {
  const silent = player.muted || player.volume === 0;
  $('muteBtn').innerHTML = icon(silent ? 'mute' : 'volume');
});

// keyboard: space = play/pause
document.addEventListener('keydown', function (e) {
  if (e.code !== 'Space') return;
  const tag = e.target.tagName;
  if (tag === 'BUTTON' || (tag === 'INPUT' && e.target.type === 'search')) return;
  e.preventDefault();
  togglePlay();
});

// media keys / Windows media popup
if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', function () { player.play(); });
  navigator.mediaSession.setActionHandler('pause', function () { player.pause(); });
  navigator.mediaSession.setActionHandler('previoustrack', prevSong);
  navigator.mediaSession.setActionHandler('nexttrack', nextSong);
}

// ---------- LIVE WAVEFORM ----------
const canvas = $('viz');
const ctx = canvas.getContext('2d');
let audioCtx, analyser, dataArray;

function setupAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaElementSource(player);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 128;
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  dataArray = new Uint8Array(analyser.frequencyBinCount);
  draw();
}

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const bars = 16;
  const slot = canvas.width / bars;
  const barW = slot * 0.55;
  ctx.fillStyle = '#D55F45';

  for (let i = 0; i < bars; i++) {
    const value = dataArray[Math.floor(i * dataArray.length * 0.7 / bars)];
    const h = Math.max(8, (value / 255) * canvas.height);
    const x = i * slot + (slot - barW) / 2;
    const y = (canvas.height - h) / 2;
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(x, y, barW, h, barW / 2); } else { ctx.rect(x, y, barW, h); }
    ctx.fill();
  }
}

// browsers only allow audio processing after a click, so we start it on first play
player.addEventListener('play', function () {
  setupAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
});

// ---------- START ----------
render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
