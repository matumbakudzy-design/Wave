/* =====================================================
   WAVE – app.js
   Sections: icons, state, library, saved song info (cache),
   views, playlists, queue, playback, now-playing bar,
   waveform, remembering folders, startup
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
  back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  refresh: 'M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
  close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  trash: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  more: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  queue: 'M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z',
  up: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z',
  down: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z'
};

const ROUNDED_ICON_PATHS = {
  prev: '<path d="M6.5 5.5v13M18 6.5 8.5 12l9.5 5.5z"/>',
  next: '<path d="M17.5 5.5v13M6 6.5l9.5 5.5L6 17.5z"/>',
  shuffle: '<path d="M4 7h2.2c4.7 0 6.9 10 11.6 10H20m-3-3 3 3-3 3M4 17h2.2c1.7 0 3-1.6 4.2-3.5M14 8.5C15.1 7.5 16.2 7 17.8 7H20m-3-3 3 3-3 3"/>',
  repeatone: '<path d="M7 7h11l-2.5-2.5M18 7l-2.5 2.5M17 17H6l2.5 2.5M6 17l2.5-2.5M12 10v4m-1.5-3 1.5-1 1.5 1"/>',
  volume: '<path d="M4 10v4h3l4 3V7l-4 3H4zm10-1a4 4 0 0 1 0 6m2-9a7 7 0 0 1 0 12"/>',
  mute: '<path d="M4 10v4h3l4 3V7l-4 3H4zm10 1 5 5m0-5-5 5"/>',
  queue: '<path d="M4 6h11M4 11h11M4 16h7m5-1v5l5-2.5z"/>',
  down: '<path d="m5 9 7 7 7-7"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m15.5 15.5 4 4"/>',
  heart: '<path d="M12 20.2s-7.2-4.5-7.2-10.1A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.2 2.5c0 5.6-7.2 10.1-7.2 10.1z"/>',
  video: '<rect x="3.5" y="6.5" width="12" height="11" rx="2.6"/><path d="m15.5 10.8 5-3v8.4l-5-3"/>'
};
function icon(name, size) {
  size = size || 24;
  if (name === 'play') return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><path fill="currentColor" d="M8.2 5.8c0-.9 1-1.4 1.8-.9l9 6.2a1.1 1.1 0 0 1 0 1.8l-9 6.2c-.8.5-1.8 0-1.8-.9V5.8z"/></svg>';
  if (name === 'pause') return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1.8" fill="currentColor"/><rect x="13.5" y="5" width="4" height="14" rx="1.8" fill="currentColor"/></svg>';
  if (name === 'heartfill') return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.2s-7.2-4.5-7.2-10.1A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.2 2.5c0 5.6-7.2 10.1-7.2 10.1z"/></svg>';
  if (ROUNDED_ICON_PATHS[name]) return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ROUNDED_ICON_PATHS[name] + '</svg>';
  return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="currentColor" aria-hidden="true"><path d="' + ICON_PATHS[name] + '"/></svg>';
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
const appEl = document.querySelector('.app');
const menuEl = $('menu');
const toastEl = $('toast');
const queuePanel = $('queuePanel');

// ---------- STATE (what the app remembers while it's open) ----------
let library = [];          // every song we know about
const byId = new Map();    // quick lookup: id -> song
const byKey = new Map();   // quick lookup: key -> song (keys survive restarts, ids don't)
let nextId = 1;

let queue = [];            // ids of the songs in play order
let baseQueue = [];        // the original order, so turning shuffle off can restore it
let queuePos = -1;         // where we are in the queue
let currentId = null;      // the song playing now
let viewList = [];         // the songs shown on screen right now

let activeTab = 'songs';
let detail = null;         // { type: 'album' | 'folder' | 'playlist', key: '...' } when drilled in
let shuffleOn = false;

let savedFolders = [];     // folders Wave remembers
let pending = [];          // remembered folders waiting for you to allow access
let scanning = 0;          // how many folders are being scanned right now
let playlists = [];        // { id, name, keys: [song keys], created }
let favourites = new Set();   // keys of the songs you have hearted

let appMode = 'music';     // 'music' or 'video'
try { if (localStorage.getItem('wave-mode') === 'video') appMode = 'video'; } catch (e) {}
let videos = [];           // every video we know about
const videoById = new Map();
let nextVideoId = 1;
let videoViewList = [];    // the videos shown on screen right now
let vQueue = [];           // video ids, in the order of the list you started from
let vPos = -1;

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

function isVideoFile(file) {
  if (file.type.startsWith('audio/')) return false;
  return file.type.startsWith('video/') || /\.(mp4|mkv|webm|mov|m4v|avi|wmv|ogv)$/i.test(file.name);
}

function compareTitle(a, b) {
  return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
}

function sortedSongs(list) { return list.slice().sort(compareTitle); }
function albumOf(song) { return song.album || 'Unknown album'; }
function lastSegment(path) { const p = path.split('/'); return p[p.length - 1]; }
function uid(prefix) { return prefix + Date.now() + Math.floor(Math.random() * 1000); }

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

let toastTimer = null;
function toast(text) {
  toastEl.textContent = text;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
}

// ---------- THE LIBRARY ----------
// An "entry" is { file, path } where path looks like "Music/Afrobeats/song.mp3"
function addEntries(entries, source) {
  const known = new Set(library.map(function (s) { return s.key; }).concat(videos.map(function (v) { return v.key; })));
  const fresh = [];
  const toRead = [];
  const freshVideos = [];

  entries.forEach(function (entry) {
    const file = entry.file;
    if (isVideoFile(file)) {
      const video = addVideoEntry(file, entry.path || '', source, known);
      if (video) freshVideos.push(video);
      return;
    }
    if (!isAudio(file)) return;

    const path = entry.path || '';
    const key = path + '|' + file.name + '|' + file.size + '|' + file.lastModified;
    if (known.has(key)) return;   // already added
    known.add(key);

    const parts = path.split('/');
    const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : 'Loose files';

    const song = {
      id: nextId++,
      key: key,
      source: source || null,    // which remembered folder this song came from
      file: file,
      url: URL.createObjectURL(file),
      title: file.name.replace(/\.[^.]+$/, ''),   // file name without .mp3 until we know the real title
      artist: '',
      album: '',
      track: 0,
      folder: folder,
      artwork: null,
      lyrics: '',
      syncedLyrics: [],
      lyricsSource: 'embedded'
    };
    library.push(song);
    byId.set(song.id, song);
    byKey.set(song.key, song);
    fresh.push(song);

    // have we read this file before? then use the saved info and skip reading it again
    const cached = metaCache.get(key);
    if (cached) { applyCached(song, cached); if (cached.v !== 2) toRead.push(song); } else { toRead.push(song); }   // v2 = saved with lyrics support
  });

  if (fresh.length === 0 && freshVideos.length === 0) return;
  render();
  readTags(toRead);
  makeThumbs(freshVideos.filter(function (v) { return !v.thumb && !metaCache.has(v.key); }));
}

// files from the normal pickers (these can't be remembered between visits)
function addFiles(fileList) {
  const entries = Array.from(fileList).map(function (f) {
    return { file: f, path: f.webkitRelativePath || '' };
  });
  metaReady.then(function () { addEntries(entries, null); });
}

// ---------- SAVED SONG INFO (so Wave opens instantly) ----------
const metaCache = new Map();   // key -> { key, title, artist, album, track, art, lyrics, syncedLyrics }
let metaWrites = [];
let metaTimer = null;

async function loadMeta() {
  try {
    const all = await dbRun('meta', 'readonly', function (store) { return store.getAll(); });
    all.forEach(function (rec) { metaCache.set(rec.key, rec); });
  } catch (err) {
    console.error('Could not load saved song info', err);
  }
}

function applyCached(song, rec) {
  song.title = rec.title || song.title;
  song.artist = rec.artist || '';
  song.album = rec.album || '';
  song.track = rec.track || 0;
  song.lyrics = rec.lyrics || '';
  song.syncedLyrics = Array.isArray(rec.syncedLyrics) ? rec.syncedLyrics : [];
  song.lyricsSource = rec.lyricsSource || 'embedded';
  if (rec.art) song.artwork = URL.createObjectURL(rec.art);
}

function saveMeta(song, artBlob) {
  const previous = metaCache.get(song.key);
  const rec = { key: song.key, title: song.title, artist: song.artist, album: song.album, track: song.track, art: artBlob || (previous && previous.art) || null, lyrics: song.lyrics || '', syncedLyrics: song.syncedLyrics || [], lyricsSource: song.lyricsSource || 'embedded', v: 2 };
  metaCache.set(song.key, rec);
  metaWrites.push(rec);
  if (metaTimer) return;
  metaTimer = setTimeout(function () {
    const batch = metaWrites;
    metaWrites = [];
    metaTimer = null;
    dbRun('meta', 'readwrite', function (store) {
      batch.forEach(function (r) { store.put(r); });
    }).catch(function (err) { console.error('Could not save song info', err); });
  }, 1000);
}

// Album covers can be huge, so we shrink them to 600px before keeping them
async function shrinkArt(blob) {
  try {
    const bmp = await createImageBitmap(blob);
    const scale = Math.min(1, 600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(bmp.width * scale));
    c.height = Math.max(1, Math.round(bmp.height * scale));
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    if (bmp.close) bmp.close();
    return await new Promise(function (resolve) {
      c.toBlob(function (b) { resolve(b || blob); }, 'image/jpeg', 0.85);
    });
  } catch (err) {
    return blob;
  }
}

// Reads title / artist / album / artwork hidden inside each file (4 at a time)
function readTags(songs) {
  if (songs.length === 0) return;
  if (typeof jsmediatags === 'undefined') return;
  let i = 0;

  function next() {
    if (i >= songs.length) return;
    const song = songs[i++];
    jsmediatags.read(song.file, {
      onSuccess: function (result) {
        applyTags(song, result.tags).catch(function () {}).then(next);
      },
      onError: function () {
        saveMeta(song, null);   // remember that there was nothing to read, so we don't try again
        next();
      }
    });
  }
  for (let w = 0; w < 4; w++) next();
}

// LRC timestamps are used by both embedded lyric tags and LRCLIB.
function parseLrc(text) {
  if (!text) return [];
  const lines = [];
  String(text).split(/\r?\n/).forEach(function (line) {
    const re = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
    let match, stamps = [];
    while ((match = re.exec(line))) {
      const fraction = match[3] ? Number('0.' + match[3]) : 0;
      stamps.push(Number(match[1]) * 60 + Number(match[2]) + fraction);
    }
    const lyric = line.replace(/\[[^\]]*\]/g, '').trim();
    stamps.forEach(function (time) { if (lyric) lines.push({ time: time, text: lyric }); });
  });
  return lines.sort(function (a, b) { return a.time - b.time; });
}

function lyricText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value.lyrics === 'string') return value.lyrics;
  if (typeof value.text === 'string') return value.text;
  return '';
}

// jsmediatags exposes ordinary USLT lyrics, but not ID3 SYLT timed frames.
// Read SYLT directly so timestamps embedded in MP3 files are retained.
async function readEmbeddedSylt(file) {
  try {
    const head = new Uint8Array(await file.slice(0, 10).arrayBuffer());
    if (head.length < 10 || String.fromCharCode(head[0], head[1], head[2]) !== 'ID3') return [];
    const wanted = 10 + (((head[6] & 127) << 21) | ((head[7] & 127) << 14) | ((head[8] & 127) << 7) | (head[9] & 127));
    const b = new Uint8Array(await file.slice(0, Math.min(file.size, wanted)).arrayBuffer());
    const major = b[3];
    if (major < 3 || major > 4) return [];
    const tagSize = ((b[6] & 127) << 21) | ((b[7] & 127) << 14) | ((b[8] & 127) << 7) | (b[9] & 127);
    let pos = 10;
    if (b[5] & 0x40) {
      if (major === 3) pos += 4 + ((b[pos] << 24) | (b[pos+1] << 16) | (b[pos+2] << 8) | b[pos+3]);
      else pos += 4 + (((b[pos] & 127) << 21) | ((b[pos+1] & 127) << 14) | ((b[pos+2] & 127) << 7) | (b[pos+3] & 127));
    }
    const end = Math.min(b.length, 10 + tagSize);
    while (pos + 10 <= end) {
      const id = String.fromCharCode(b[pos], b[pos+1], b[pos+2], b[pos+3]);
      if (!id.trim() || id.charCodeAt(0) === 0) break;
      let size = major === 4
        ? ((b[pos+4] & 127) << 21) | ((b[pos+5] & 127) << 14) | ((b[pos+6] & 127) << 7) | (b[pos+7] & 127)
        : (b[pos+4] * 0x1000000 + (b[pos+5] << 16) + (b[pos+6] << 8) + b[pos+7]);
      const flags = (b[pos+8] << 8) | b[pos+9];
      pos += 10;
      if (size <= 0 || pos + size > end) break;
      if (id === 'SYLT') {
        // Compressed/encrypted frames cannot be decoded without extra codecs.
        if (flags & (major === 4 ? 0x000c : 0x00c0)) return [];
        const frame = b.subarray(pos, pos + size);
        const enc = frame[0];
        const decoderName = enc === 0 ? 'windows-1252' : enc === 1 ? 'utf-16' : enc === 2 ? 'utf-16be' : 'utf-8';
        const decoder = new TextDecoder(decoderName);
        const width = enc === 1 || enc === 2 ? 2 : 1;
        let q = 6; // encoding, language, timestamp format, content type
        function readTerminated() {
          const start = q;
          while (q + width <= frame.length && (width === 1 ? frame[q] !== 0 : !(frame[q] === 0 && frame[q+1] === 0))) q += width;
          const part = frame.subarray(start, q);
          q += width;
          return decoder.decode(part).replace(/^\uFEFF/, '');
        }
        readTerminated(); // descriptor
        const out = [];
        while (q + 5 <= frame.length) {
          const text = readTerminated();
          if (q + 4 > frame.length) break;
          const stamp = (frame[q] * 0x1000000 + (frame[q+1] << 16) + (frame[q+2] << 8) + frame[q+3]);
          q += 4;
          if (text.trim()) out.push({ time: frame[4] === 2 ? stamp / 1000 : stamp / 75, text: text.trim() });
        }
        return out.sort(function (a, c) { return a.time - c.time; });
      }
      pos += size;
    }
  } catch (err) { console.warn('Could not read embedded SYLT lyrics', err); }
  return [];
}

async function applyTags(song, tags) {
  if (tags.title) song.title = tags.title;
  if (tags.artist) song.artist = tags.artist;
  if (tags.album) song.album = tags.album;
  if (tags.track) song.track = parseInt(tags.track, 10) || 0;

  const embeddedText = lyricText(tags.lyrics);
  if (embeddedText) song.lyrics = embeddedText;
  const fromLrc = parseLrc(embeddedText);
  if (fromLrc.length) song.syncedLyrics = fromLrc;
  if (!song.syncedLyrics.length) {
    const sylt = await readEmbeddedSylt(song.file);
    if (sylt.length) song.syncedLyrics = sylt;
  }
  song.lyricsSource = 'embedded';

  let art = null;
  if (tags.picture) {
    const raw = new Blob([new Uint8Array(tags.picture.data)], { type: tags.picture.format });
    art = await shrinkArt(raw);
    song.artwork = URL.createObjectURL(art);
  }
  saveMeta(song, art);
  scheduleRender();
  if (song.id === currentId) { showNowPlaying(song); renderLyrics(song); }
}

// Info arrives one song at a time, so we redraw at most every 300ms
let renderTimer = null;
function scheduleRender() {
  if (renderTimer) return;
  renderTimer = setTimeout(function () { renderTimer = null; render(); }, 300);
}

// ---------- VIEWS (build the HTML for each tab) ----------
function thumb(song, fallbackIcon) {
  const inner = song && song.artwork
    ? '<img src="' + song.artwork + '" alt="">'
    : icon(fallbackIcon || 'note', 24);
  return '<div class="thumb">' + inner + '</div>';
}

function bigEmpty(title, hint, buttonHtml) {
  return '<div class="empty"><div class="empty-icon">' + icon('note', 96) + '</div>' +
    '<p>' + title + '</p>' + (hint ? '<p class="hint">' + hint + '</p>' : '') + (buttonHtml || '') + '</div>';
}

function emptyLibrary() {
  if (scanning > 0) return bigEmpty('Scanning your music...', 'This can take a moment for big folders');
  if (pending.length > 0) {
    return bigEmpty('Welcome back', 'Allow Wave to open your music folder again',
      '<button class="play-btn big" data-action="reconnect" title="Reconnect" aria-label="Reconnect">' + icon('folder', 28) + '</button>');
  }
  return bigEmpty('Your library is empty', 'Add a folder of music to get started',
    '<button class="play-btn big" data-action="pick-folder" title="Add folder" aria-label="Add folder">' + icon('folder', 28) + '</button>');
}

function pendingBanner() {
  if ((appMode === 'video' ? videos.length : library.length) === 0 || pending.length === 0) return '';
  return '<div class="banner"><p>Some of your folders need permission again</p>' +
    '<button class="play-btn" data-action="reconnect" title="Reconnect" aria-label="Reconnect">' + icon('folder', 24) + '</button></div>';
}

function inPlaylistView() { return detail && detail.type === 'playlist'; }
function inCustomList() { return detail && (detail.type === 'playlist' || detail.type === 'favourites'); }

function songsView(list) {
  if (library.length === 0 && !inCustomList()) return emptyLibrary();
  if (list.length === 0) {
    if (detail && detail.type === 'favourites') return bigEmpty('No favourites yet', 'Tap the heart on any song to add it here');
    if (inPlaylistView()) return bigEmpty('This playlist is empty', 'Add songs from the three-dot menu on any song');
    return '<div class="empty"><p>No songs found</p></div>';
  }

  let html = '<div class="list-head">' +
    '<span class="count">' + list.length + (list.length === 1 ? ' song' : ' songs') + '</span>' +
    '<span class="spacer"></span>' +
    '<button class="icon-btn" data-action="add-files" title="Add music files" aria-label="Add music files">' + icon('add', 22) + '</button>' +
    '<button class="icon-btn" data-action="pick-folder" title="Add music folder" aria-label="Add music folder">' + icon('folder', 21) + '</button>' +
    '<button class="icon-btn" data-action="shuffle-all" title="Shuffle" aria-label="Shuffle">' + icon('shuffle') + '</button>' +
    '<button class="play-btn" data-action="play-all" title="Play" aria-label="Play">' + icon('play', 28) + '</button>' +
    '</div>';

  list.forEach(function (s) {
    html += '<div class="row' + (s.id === currentId ? ' playing' : '') + '" data-action="play-song" data-id="' + s.id + '">' +
      thumb(s) +
      '<div><div class="row-title">' + esc(s.title) + '</div>' +
      '<div class="row-sub">' + esc(s.artist || 'Unknown artist') + '</div></div>' +
      '<div class="row-album">' + esc(s.album) + '</div>' +
      '<div class="row-actions">' + heartButton(s) +
      '<button class="icon-btn" data-action="row-menu" data-id="' + s.id + '" title="More" aria-label="More options">' + icon('more', 22) + '</button></div>' +
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

function savedFoldersSection() {
  if (savedFolders.length === 0) return '';
  let html = '<div class="list-head"><span class="count">Library folders</span><span class="spacer"></span>' +
    '<button class="icon-btn" data-action="rescan" title="Rescan for new music" aria-label="Rescan">' + icon('refresh') + '</button></div>';
  savedFolders.forEach(function (rec) {
    const n = library.filter(function (s) { return s.source === rec.id; }).length;
    const nv = videos.filter(function (v) { return v.source === rec.id; }).length;
    const waiting = pending.indexOf(rec) !== -1;
    html += '<div class="folder-row saved">' +
      '<div class="thumb">' + icon('folder', 26) + '</div>' +
      '<div><div class="row-title">' + esc(rec.name) + '</div>' +
      '<div class="row-sub">' + (waiting ? 'Needs permission' : n + (n === 1 ? ' song' : ' songs') + (nv ? ' · ' + nv + (nv === 1 ? ' video' : ' videos') : '')) + '</div></div>' +
      '<button class="icon-btn" data-action="remove-folder" data-id="' + esc(rec.id) + '" title="Remove from Wave" aria-label="Remove folder">' + icon('close', 22) + '</button>' +
      '</div>';
  });
  return html;
}

function foldersView() {
  if (library.length === 0 && savedFolders.length === 0) return emptyLibrary();
  const groups = new Map();
  library.forEach(function (s) {
    if (!groups.has(s.folder)) groups.set(s.folder, []);
    groups.get(s.folder).push(s);
  });

  const paths = Array.from(groups.keys()).sort(function (a, b) {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
  });

  let html = savedFoldersSection();
  if (paths.length) html += '<div class="list-head"><span class="count">Browse by folder</span></div>';
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
  return bigEmpty('Personal mixes are coming soon', 'For now, shuffle your whole library',
    '<button class="play-btn big" data-action="shuffle-all" title="Shuffle all" aria-label="Shuffle all">' + icon('shuffle', 28) + '</button>');
}

function playlistsView() {
  let html = '<div class="list-head"><span class="count">' + playlists.length + (playlists.length === 1 ? ' playlist' : ' playlists') + '</span>' +
    '<span class="spacer"></span>' +
    '<button class="play-btn" data-action="new-playlist" title="New playlist" aria-label="New playlist">' + icon('add', 28) + '</button></div>';
  html += '<div class="grid">';
  html += '<div class="card" data-action="open-favourites">' +
    '<div class="thumb fav">' + icon('heartfill', 56) + '</div>' +
    '<div class="card-title">Favourites</div>' +
    '<div class="card-sub">' + favourites.size + (favourites.size === 1 ? ' song' : ' songs') + '</div></div>';
  playlists.forEach(function (pl) {
    const first = songsOfPlaylist(pl).find(function (s) { return s.artwork; });
    html += '<div class="card" data-action="open-playlist" data-key="' + esc(pl.id) + '">' +
      thumb(first, 'queue') +
      '<div class="card-title">' + esc(pl.name) + '</div>' +
      '<div class="card-sub">' + pl.keys.length + (pl.keys.length === 1 ? ' song' : ' songs') + '</div></div>';
  });
  html += '</div>';
  if (playlists.length === 0) html += '<p class="hint-line" style="margin-top:18px">Make a playlist with the + button, then add songs from the three-dot menu on any song.</p>';
  return html;
}

function detailView() {
  let list, name, extra = '';

  if (detail.type === 'favourites') {
    list = favouriteSongs();
    viewList = list;
    const missing = favourites.size - list.length;
    return headHtml('Favourites', '') +
      (missing > 0 ? '<p class="hint-line">' + missing + (missing === 1 ? ' favourite is' : ' favourites are') + ' not available right now (is its folder connected?)</p>' : '') +
      songsView(list);
  }

  if (detail.type === 'playlist') {
    const pl = playlists.find(function (p) { return p.id === detail.key; });
    if (!pl) { detail = null; return playlistsView(); }
    name = pl.name;
    list = songsOfPlaylist(pl);
    extra = '<span class="spacer"></span>' +
      '<button class="icon-btn" data-action="rename-playlist" data-id="' + esc(pl.id) + '" title="Rename" aria-label="Rename playlist">' + icon('edit') + '</button>' +
      '<button class="icon-btn" data-action="delete-playlist" data-id="' + esc(pl.id) + '" title="Delete playlist" aria-label="Delete playlist">' + icon('trash') + '</button>';
    const missing = pl.keys.length - list.length;
    if (missing > 0) {
      extra += '';
      viewList = list;
      return headHtml(name, extra) +
        '<p class="hint-line">' + missing + (missing === 1 ? ' song is' : ' songs are') + ' not available right now (is its folder connected?)</p>' +
        songsView(list);
    }
  } else if (detail.type === 'album') {
    name = detail.key;
    list = library.filter(function (s) { return albumOf(s) === name; });
    list.sort(function (a, b) { return ((a.track || 9999) - (b.track || 9999)) || compareTitle(a, b); });
  } else {
    name = lastSegment(detail.key);
    list = sortedSongs(library.filter(function (s) { return s.folder === detail.key; }));
  }
  viewList = list;
  return headHtml(name, extra) + songsView(list);
}

function headHtml(name, extra) {
  return '<div class="detail-head">' +
    '<button class="icon-btn" data-action="back" title="Back" aria-label="Back">' + icon('back') + '</button>' +
    '<h2>' + esc(name) + '</h2>' + (extra || '') + '</div>';
}

// Draws whatever the current tab / search needs
function render() {
  const scroll = content.scrollTop;
  const q = searchEl.value.trim().toLowerCase();
  let html;
  viewList = [];

  if (appMode === 'video') {
    content.innerHTML = pendingBanner() + videoView(q);
    content.scrollTop = scroll;
    markTabs();
    return;
  }

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
    html = playlistsView();
  }

  content.innerHTML = pendingBanner() + html;
  content.scrollTop = scroll;

  markTabs();
  renderQueue();
}

function markTabs() {
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

// ---------- PLAYLISTS ----------
function songsOfPlaylist(pl) {
  return pl.keys.map(function (k) { return byKey.get(k); }).filter(Boolean);
}

function savePlaylist(pl) {
  return dbRun('playlists', 'readwrite', function (store) { return store.put(pl); })
    .catch(function (err) { console.error('Could not save playlist', err); });
}

async function loadPlaylists() {
  try {
    playlists = await dbRun('playlists', 'readonly', function (store) { return store.getAll(); });
    playlists.sort(function (a, b) { return a.created - b.created; });
  } catch (err) {
    playlists = [];
  }
}

function newPlaylist(firstSong) {
  const name = (prompt('Name your playlist') || '').trim();
  if (!name) return;
  const pl = { id: uid('p'), name: name, keys: firstSong ? [firstSong.key] : [], created: Date.now() };
  playlists.push(pl);
  savePlaylist(pl);
  render();
  toast(firstSong ? 'Added to ' + name : 'Playlist created');
}

function addToPlaylist(id, song) {
  const pl = playlists.find(function (p) { return p.id === id; });
  if (!pl) return;
  if (pl.keys.indexOf(song.key) !== -1) { toast('Already in ' + pl.name); return; }
  pl.keys.push(song.key);
  savePlaylist(pl);
  render();
  toast('Added to ' + pl.name);
}

function removeFromPlaylist(id, song) {
  const pl = playlists.find(function (p) { return p.id === id; });
  if (!pl) return;
  pl.keys = pl.keys.filter(function (k) { return k !== song.key; });
  savePlaylist(pl);
  render();
}

function renamePlaylist(id) {
  const pl = playlists.find(function (p) { return p.id === id; });
  if (!pl) return;
  const name = (prompt('Rename playlist', pl.name) || '').trim();
  if (!name) return;
  pl.name = name;
  savePlaylist(pl);
  render();
}

function deletePlaylist(id) {
  const pl = playlists.find(function (p) { return p.id === id; });
  if (!pl || !confirm('Delete the playlist "' + pl.name + '"? Your songs are not deleted.')) return;
  dbRun('playlists', 'readwrite', function (store) { return store.delete(id); }).catch(function () {});
  playlists = playlists.filter(function (p) { return p.id !== id; });
  detail = null;
  render();
}

// ---------- THE SONG MENU (three dots) ----------
let menuSongId = null;

function openMenu(btn, songId) {
  if (menuEl.classList.contains('open') && menuSongId === songId) { closeMenu(); return; }
  menuSongId = songId;

  let html = '<button class="menu-item" data-m="next">Play next</button>' +
    '<button class="menu-item" data-m="queue">Add to queue</button>' +
    '<div class="menu-sep"></div><div class="menu-label">Add to playlist</div>';
  playlists.forEach(function (pl) {
    html += '<button class="menu-item" data-m="pl" data-pl="' + esc(pl.id) + '">' + esc(pl.name) + '</button>';
  });
  html += '<button class="menu-item" data-m="newpl">New playlist...</button>';
  if (inPlaylistView() && !searchEl.value.trim()) {
    html += '<div class="menu-sep"></div><button class="menu-item" data-m="remove">Remove from this playlist</button>';
  }
  menuEl.innerHTML = html;

  menuEl.classList.add('open');
  const r = btn.getBoundingClientRect();
  const w = menuEl.offsetWidth, h = menuEl.offsetHeight;
  const left = Math.min(window.innerWidth - w - 8, Math.max(8, r.right - w));
  let top = r.bottom + 4;
  if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 4);
  menuEl.style.left = left + 'px';
  menuEl.style.top = top + 'px';
}

function closeMenu() {
  menuEl.classList.remove('open');
  menuSongId = null;
}

menuEl.addEventListener('click', function (e) {
  const item = e.target.closest('[data-m]');
  if (!item) return;
  const song = byId.get(menuSongId);
  closeMenu();
  if (!song) return;

  const what = item.dataset.m;
  if (what === 'next') { playNext(song.id); toast('Playing next'); }
  else if (what === 'queue') { addToQueue(song.id); toast('Added to queue'); }
  else if (what === 'pl') { addToPlaylist(item.dataset.pl, song); }
  else if (what === 'newpl') { newPlaylist(song); }
  else if (what === 'remove' && inPlaylistView()) { removeFromPlaylist(detail.key, song); }
});

document.addEventListener('click', function (e) {
  if (menuEl.classList.contains('open') && !menuEl.contains(e.target) && !e.target.closest('[data-action="row-menu"]')) {
    closeMenu();
  }
});
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
content.addEventListener('scroll', closeMenu);

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
  } else if (action === 'row-menu') {
    openMenu(el, Number(el.dataset.id));
  } else if (action === 'play-all') {
    if (viewList.length) startQueue(viewList, viewList[0].id);
  } else if (action === 'shuffle-all') {
    if (viewList.length) startQueue(viewList, null, true);
  } else if (action === 'open-album' || action === 'open-folder' || action === 'open-playlist') {
    const type = action === 'open-album' ? 'album' : (action === 'open-folder' ? 'folder' : 'playlist');
    detail = { type: type, key: decodeURIComponent(el.dataset.key) };
    content.scrollTop = 0;
    render();
  } else if (action === 'back') {
    detail = null;
    content.scrollTop = 0;
    render();
  } else if (action === 'add-files') {
    filePicker.accept = appMode === 'video' ? 'video/*' : 'audio/*';
    filePicker.click();
  } else if (action === 'pick-folder') {
    pickFolder();
  } else if (action === 'reconnect' || action === 'rescan') {
    syncAll(true);
  } else if (action === 'remove-folder') {
    removeFolder(el.dataset.id);
  } else if (action === 'heart') {
    toggleFavourite(byId.get(Number(el.dataset.id)));
  } else if (action === 'open-favourites') {
    detail = { type: 'favourites', key: 'favourites' };
    content.scrollTop = 0;
    render();
  } else if (action === 'play-video') {
    playVideo(videoViewList, Number(el.dataset.id));
  } else if (action === 'open-vfolder') {
    detail = { type: 'vfolder', key: decodeURIComponent(el.dataset.key) };
    content.scrollTop = 0;
    render();
  } else if (action === 'new-playlist') {
    newPlaylist(null);
  } else if (action === 'rename-playlist') {
    renamePlaylist(el.dataset.id);
  } else if (action === 'delete-playlist') {
    deletePlaylist(el.dataset.id);
  }
});

searchEl.addEventListener('input', function () { detail = null; render(); });

filePicker.addEventListener('change', function () { addFiles(filePicker.files); filePicker.value = ''; });
folderPicker.addEventListener('change', function () { addFiles(folderPicker.files); folderPicker.value = ''; });

// ---------- THE QUEUE ----------
function startQueue(list, id, shuffleAll) {
  baseQueue = list.map(function (s) { return s.id; });

  if (shuffleAll) {
    queue = shuffleArray(baseQueue.slice());
    queuePos = 0;
    markShuffle(true);
  } else if (shuffleOn) {
    const others = baseQueue.filter(function (x) { return x !== id; });
    queue = [id].concat(shuffleArray(others));   // the song you clicked first, the rest in random order
    queuePos = 0;
  } else {
    queue = baseQueue.slice();
    queuePos = queue.indexOf(id);
  }
  playCurrent();
}

function playNext(id) {
  if (currentId === null) { startQueue([byId.get(id)], id); return; }
  queue.splice(queuePos + 1, 0, id);
  renderQueue();
}

function addToQueue(id) {
  if (currentId === null) { startQueue([byId.get(id)], id); return; }
  queue.push(id);
  renderQueue();
}

function queueMove(i, dir) {
  const j = i + dir;
  if (i <= queuePos || j <= queuePos || j >= queue.length) return;
  const t = queue[i]; queue[i] = queue[j]; queue[j] = t;
  renderQueue();
}

function queueRemove(i) {
  if (i <= queuePos) return;
  queue.splice(i, 1);
  renderQueue();
}

function queueClear() {
  if (queuePos < 0) return;
  queue.length = queuePos + 1;
  renderQueue();
}

function qItem(song, i, upcoming) {
  return '<div class="q-item' + (upcoming ? '' : ' current') + '" data-action="q-play" data-i="' + i + '">' +
    thumb(song) +
    '<div><div class="row-title">' + esc(song.title) + '</div>' +
    '<div class="row-sub">' + esc(song.artist || 'Unknown artist') + '</div></div>' +
    (upcoming
      ? '<div class="q-btns">' +
        '<button class="icon-btn" data-action="q-up" data-i="' + i + '" title="Move up" aria-label="Move up">' + icon('up', 20) + '</button>' +
        '<button class="icon-btn" data-action="q-down" data-i="' + i + '" title="Move down" aria-label="Move down">' + icon('down', 20) + '</button>' +
        '<button class="icon-btn" data-action="q-remove" data-i="' + i + '" title="Remove" aria-label="Remove from queue">' + icon('close', 20) + '</button>' +
        '</div>'
      : '<div></div>') +
    '</div>';
}

function renderQueue() {
  if (!appEl.classList.contains('queue-open')) return;
  const scroll = queuePanel.scrollTop;

  let html = '<div class="q-head"><h3>Queue</h3><span class="spacer"></span>' +
    '<button class="icon-btn" data-action="q-clear" title="Clear what is next" aria-label="Clear queue">' + icon('trash', 22) + '</button>' +
    '<button class="icon-btn" data-action="q-close" title="Close" aria-label="Close queue">' + icon('close', 22) + '</button></div>';

  const cur = queuePos >= 0 ? byId.get(queue[queuePos]) : null;
  if (!cur) {
    html += '<div class="q-empty">Nothing is playing yet. Play a song, or use "Add to queue" from the three-dot menu.</div>';
  } else {
    html += '<div class="q-label">Now playing</div>' + qItem(cur, queuePos, false);
    const count = queue.length - queuePos - 1;
    html += '<div class="q-label">Next up (' + count + ')</div>';
    if (count === 0) html += '<div class="q-empty">Nothing next. Use "Play next" or "Add to queue" from a song\'s menu.</div>';
    for (let i = queuePos + 1; i < queue.length; i++) {
      const s = byId.get(queue[i]);
      if (s) html += qItem(s, i, true);
    }
  }
  queuePanel.innerHTML = html;
  queuePanel.scrollTop = scroll;
}

function toggleQueue() {
  const open = appEl.classList.toggle('queue-open');
  $('queueBtn').classList.toggle('active', open);
  renderQueue();
}

queuePanel.addEventListener('click', function (e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  const i = Number(el.dataset.i);

  if (action === 'q-play') { queuePos = i; playCurrent(); }
  else if (action === 'q-up') { queueMove(i, -1); }
  else if (action === 'q-down') { queueMove(i, 1); }
  else if (action === 'q-remove') { queueRemove(i); }
  else if (action === 'q-clear') { queueClear(); }
  else if (action === 'q-close') { toggleQueue(); }
});
$('queueBtn').addEventListener('click', toggleQueue);

// ---------- PLAYBACK ----------
function playCurrent() {
  const song = byId.get(queue[queuePos]);
  if (!song) return;
  currentId = song.id;
  activeLyricIndex = -1;
  player.src = song.url;
  player.play().catch(function () { /* happens if you skip very fast: safe to ignore */ });
  showNowPlaying(song);
  highlightPlayingRow();
  renderQueue();
}

function nextSong() {
  if (queue.length === 0) return;
  if (queuePos + 1 >= queue.length) {
    queuePos = 0;   // end of the queue: start again
    if (shuffleOn && queue.length > 2) {
      queue = [queue[0]].concat(shuffleArray(queue.slice(1)));
    }
  } else {
    queuePos++;
  }
  playCurrent();
}

function prevSong() {
  if (queue.length === 0) return;
  if (player.currentTime > 3 || queuePos === 0) { player.currentTime = 0; return; }   // like most players: restart first
  queuePos--;
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

function markShuffle(on) {
  shuffleOn = on;
  $('shuffleBtn').classList.toggle('active', on);
}

function setShuffle(on) {
  if (on === shuffleOn) return;
  markShuffle(on);
  if (queuePos < 0) return;

  const head = queue.slice(0, queuePos + 1);
  let tail = queue.slice(queuePos + 1);
  if (on) {
    tail = shuffleArray(tail);
  } else {
    // put the upcoming songs back in their original order
    const order = new Map(baseQueue.map(function (id, i) { return [id, i]; }));
    tail.sort(function (a, b) {
      return (order.has(a) ? order.get(a) : -1) - (order.has(b) ? order.get(b) : -1);
    });
  }
  queue = head.concat(tail);
  renderQueue();
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
  $('npLargeArt').innerHTML = thumb(song);
  $('npLargeTitle').textContent = song.title;
  $('npLargeArtist').textContent = song.artist || 'Unknown artist';
  $('npAlbumName').textContent = song.album || '';
  $('lyricsSongTitle').textContent = song.title + (song.artist ? ' · ' + song.artist : '');
  document.title = song.title + ' - Wave';
  updateHearts();
  renderLyrics(song);
  if (lyricsViewOpen()) fetchOnlineLyrics(song);

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

// ---------- FULL-SCREEN NOW PLAYING + LYRICS ----------
let activeLyricIndex = -1;
function setPlayerMode(mode) {
  const lyrics = mode === 'lyrics';
  $('npSongView').hidden = lyrics;
  $('npLyricsView').hidden = !lyrics;
  $('songModeBtn').classList.toggle('active', !lyrics);
  $('lyricsModeBtn').classList.toggle('active', lyrics);
  $('songModeBtn').setAttribute('aria-selected', String(!lyrics));
  $('lyricsModeBtn').setAttribute('aria-selected', String(lyrics));
  if (lyrics) fetchOnlineLyrics(byId.get(currentId));
}
function lyricsViewOpen() {
  return $('nowPlayingScreen').classList.contains('open') && !$('npLyricsView').hidden;
}
function openNowPlaying(mode) {
  if (currentId === null) return;
  $('nowPlayingScreen').classList.add('open');
  $('nowPlayingScreen').setAttribute('aria-hidden', 'false');
  document.body.classList.add('now-playing-open');
  setPlayerMode(mode || 'songs');
  syncFullPlayer();
}
function closeNowPlaying() {
  $('nowPlayingScreen').classList.remove('open');
  $('nowPlayingScreen').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('now-playing-open');
}
function renderLyrics(song) {
  if (!song) return;
  const host = $('lyricsContent');
  const timed = song.syncedLyrics || [];
  if (timed.length) {
    host.classList.add('timed-lyrics');
    host.innerHTML = timed.map(function (line, i) {
      return '<div class="lyric-line" data-lyric-index="' + i + '" data-time="' + line.time + '">' + esc(line.text) + '</div>';
    }).join('');
    updateActiveLyric(true);
  } else if (song.lyrics) {
    host.classList.remove('timed-lyrics');
    host.textContent = song.lyrics;
  } else {
    host.classList.remove('timed-lyrics');
    host.textContent = song.lyricsLoading ? 'Searching for lyrics on lrclib.net…' : 'No lyrics found for this song.';
  }
}
function updateActiveLyric(force) {
  const song = byId.get(currentId);
  if (!song || !song.syncedLyrics || !song.syncedLyrics.length) return;
  let idx = -1;
  for (let i = 0; i < song.syncedLyrics.length; i++) {
    if (song.syncedLyrics[i].time <= player.currentTime + 0.12) idx = i;
    else break;
  }
  if (idx === activeLyricIndex && !force) return;
  activeLyricIndex = idx;
  const host = $('lyricsContent');
  host.querySelectorAll('.lyric-line').forEach(function (el, i) {
    el.classList.toggle('active', i === idx);
    el.classList.toggle('past', i < idx);
  });
  const active = host.querySelector('.lyric-line.active');
  if (active) active.scrollIntoView({ behavior: force ? 'auto' : 'smooth', block: 'center' });
}
async function fetchOnlineLyrics(song) {
  if (!song || song.syncedLyrics.length || song.lyricsLoading || song.lyricsLookupDone) return;
  song.lyricsLoading = true;
  if (currentId === song.id) renderLyrics(song);
  try {
    // LRCLIB uses the song length to avoid picking the wrong version, so wait briefly for it
    let duration = Number(song.duration) || (player.src === song.url ? player.duration : 0);
    if (!duration && player.src === song.url) {
      await Promise.race([
        new Promise(function (resolve) { player.addEventListener('loadedmetadata', resolve, { once: true }); }),
        new Promise(function (resolve) { setTimeout(resolve, 1800); })
      ]);
      duration = player.duration;
    }
    const params = new URLSearchParams({ track_name: song.title, artist_name: song.artist || 'Unknown artist' });
    if (song.album) params.set('album_name', song.album);
    if (Number.isFinite(duration) && duration > 0) params.set('duration', String(Math.round(duration)));

    const response = await fetch('https://lrclib.net/api/get?' + params.toString(), { headers: { 'Lrclib-Client': 'Wave/1.1' } });
    if (response.status === 404) { song.lyricsLookupDone = true; return; }   // not found: don't ask again this session
    if (!response.ok) return;                                                // service trouble: try again next time

    const record = await response.json();
    const synced = parseLrc(record.syncedLyrics || '');
    if (synced.length) song.syncedLyrics = synced;
    song.lyrics = record.plainLyrics || song.lyrics || (synced.length ? synced.map(function (l) { return l.text; }).join('\n') : '');
    song.lyricsSource = 'LRCLIB';
    song.lyricsLookupDone = true;
    saveMeta(song, null);
  } catch (err) {
    /* offline or blocked: the lyrics view just says none were found, and we try again next time */
  } finally {
    song.lyricsLoading = false;
    if (currentId === song.id) renderLyrics(song);
  }
}
let fullPlayShown = null;
function syncFullPlayer() {
  const duration = player.duration || 0;
  const pct = duration ? player.currentTime / duration * 100 : 0;
  $('fullProgress').value = pct;
  setFill($('fullProgress'));
  $('fullTimeNow').textContent = formatTime(player.currentTime);
  $('fullTimeTotal').textContent = formatTime(duration);
  const shown = player.paused ? 'play' : 'pause';
  if (shown !== fullPlayShown) { $('fullPlayBtn').innerHTML = icon(shown, 32); fullPlayShown = shown; }
  $('fullShuffleBtn').classList.toggle('active', shuffleOn);
  $('fullLoopBtn').classList.toggle('active', player.loop);
}
$('npArt').addEventListener('click', function () { openNowPlaying(); });
$('npTitle').addEventListener('click', function () { openNowPlaying(); });
$('npArtist').addEventListener('click', function () { openNowPlaying(); });
$('npArt').style.cursor = $('npTitle').style.cursor = $('npArtist').style.cursor = 'pointer';
$('closeNowPlaying').addEventListener('click', closeNowPlaying);
$('songModeBtn').addEventListener('click', function () { setPlayerMode('songs'); });
$('lyricsModeBtn').addEventListener('click', function () { setPlayerMode('lyrics'); });
$('fullPlayBtn').addEventListener('click', togglePlay);
$('fullPrevBtn').addEventListener('click', prevSong);
$('fullNextBtn').addEventListener('click', nextSong);
$('fullShuffleBtn').addEventListener('click', function () { setShuffle(!shuffleOn); });
$('fullLoopBtn').addEventListener('click', function () { player.loop = !player.loop; $('loopBtn').classList.toggle('active', player.loop); syncFullPlayer(); });
$('fullProgress').addEventListener('input', function () { if (player.duration) player.currentTime = Number(this.value) / 100 * player.duration; setFill(this); });
player.addEventListener('timeupdate', function () { syncFullPlayer(); updateActiveLyric(false); });
player.addEventListener('play', syncFullPlayer);
player.addEventListener('pause', syncFullPlayer);
player.addEventListener('loadedmetadata', syncFullPlayer);
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $('nowPlayingScreen').classList.contains('open')) closeNowPlaying(); });

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
// colours the left part of a slider so it shows how far along it is
function setFill(el) {
  const min = Number(el.min || 0), max = Number(el.max || 100);
  el.style.setProperty('--fill', ((Number(el.value) - min) / (max - min)) * 100 + '%');
}

player.addEventListener('timeupdate', function () {
  progress.value = player.duration ? (player.currentTime / player.duration) * 100 : 0;
  setFill(progress);
  updateTime();
});
player.addEventListener('loadedmetadata', updateTime);
progress.addEventListener('input', function () {
  if (player.duration) player.currentTime = (progress.value / 100) * player.duration;
  setFill(progress);
});

// volume
volume.addEventListener('input', function () {
  player.volume = Number(volume.value);
  player.muted = false;
  setFill(volume);
});
setFill(volume);
setFill(progress);
$('muteBtn').addEventListener('click', function () { player.muted = !player.muted; });
player.addEventListener('volumechange', function () {
  const silent = player.muted || player.volume === 0;
  $('muteBtn').innerHTML = icon(silent ? 'mute' : 'volume');
});

// keyboard: space = play/pause
document.addEventListener('keydown', function (e) {
  if (e.code !== 'Space') return;
  if ($('videoScreen').classList.contains('open')) {   // a video is open: space controls the video
    e.preventDefault();
    if ($('videoPlayer').paused) { $('videoPlayer').play(); } else { $('videoPlayer').pause(); }
    return;
  }
  if (appMode === 'video') return;
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

// the queue panel needs to know how tall the bottom bar is
function measurePlayerBar() {
  document.documentElement.style.setProperty('--player-h', document.querySelector('.player').offsetHeight + 'px');
}
window.addEventListener('resize', measurePlayerBar);
measurePlayerBar();

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

// ---------- FAVOURITES (the heart) ----------
function isFav(song) { return !!song && favourites.has(song.key); }
function heartIcon(on, size) { return icon(on ? 'heartfill' : 'heart', size || 22); }

function heartButton(song) {
  const on = isFav(song);
  const label = on ? 'Remove from Favourites' : 'Add to Favourites';
  return '<button class="icon-btn heart-btn' + (on ? ' liked' : '') + '" data-action="heart" data-id="' + song.id +
    '" title="' + label + '" aria-label="' + label + '" aria-pressed="' + on + '">' + heartIcon(on, 22) + '</button>';
}

function favouriteSongs() {
  return sortedSongs(library.filter(function (s) { return favourites.has(s.key); }));
}

async function loadFavourites() {
  try {
    const all = await dbRun('favourites', 'readonly', function (store) { return store.getAll(); });
    favourites = new Set(all.map(function (r) { return r.key; }));
  } catch (err) {
    favourites = new Set();
  }
}

function toggleFavourite(song) {
  if (!song) return;
  if (favourites.has(song.key)) {
    favourites.delete(song.key);
    dbRun('favourites', 'readwrite', function (store) { return store.delete(song.key); }).catch(function () {});
    toast('Removed from Favourites');
  } else {
    favourites.add(song.key);
    dbRun('favourites', 'readwrite', function (store) { return store.put({ key: song.key, added: Date.now() }); }).catch(function () {});
    toast('Added to Favourites');
  }
  updateHearts();
  render();
}

// the hearts in the bottom bar and the full-screen player follow the current song
function updateHearts() {
  const song = byId.get(currentId);
  const on = isFav(song);
  ['npHeart', 'fullHeart'].forEach(function (id) {
    const b = $(id);
    const label = on ? 'Remove from Favourites' : 'Add to Favourites';
    b.innerHTML = heartIcon(on, id === 'fullHeart' ? 28 : 22);
    b.title = label;
    b.setAttribute('aria-label', label);
    b.setAttribute('aria-pressed', String(on));
    b.classList.toggle('liked', on);
    b.disabled = !song;
  });
}
$('npHeart').addEventListener('click', function () { toggleFavourite(byId.get(currentId)); });
$('fullHeart').addEventListener('click', function () { toggleFavourite(byId.get(currentId)); });

// ---------- MUSIC / VIDEO SWITCH ----------
const TABS = {
  music: [['foryou', 'For You'], ['songs', 'Songs'], ['playlists', 'Playlists'], ['folder', 'Folder'], ['albums', 'Albums']],
  video: [['videos', 'Videos'], ['vfolders', 'Folders']]
};
const tabByMode = { music: 'songs', video: 'videos' };   // remembers the tab you were on in each mode

function renderTabs() {
  tabsEl.innerHTML = TABS[appMode].map(function (t) {
    return '<button class="tab' + (t[0] === activeTab ? ' active' : '') + '" data-tab="' + t[0] + '">' + t[1] + '</button>';
  }).join('');
}

function setMode(mode, initial) {
  if (!initial) tabByMode[appMode] = activeTab;
  appMode = mode;
  try { localStorage.setItem('wave-mode', mode); } catch (e) {}
  const video = mode === 'video';

  appEl.classList.toggle('video-mode', video);
  $('musicModeBtn').classList.toggle('active', !video);
  $('musicModeBtn').setAttribute('aria-selected', String(!video));
  $('videoModeBtn').classList.toggle('active', video);
  $('videoModeBtn').setAttribute('aria-selected', String(video));
  searchEl.placeholder = video ? 'Search videos' : 'Search songs, artists, albums';
  searchEl.value = '';
  filePicker.accept = video ? 'video/*' : 'audio/*';
  detail = null;
  activeTab = tabByMode[mode];
  content.scrollTop = 0;

  if (video && !initial) {
    if (!player.paused) player.pause();   // music stops when you switch to video
    if (appEl.classList.contains('queue-open')) toggleQueue();
    closeNowPlaying();
  }
  renderTabs();
  if (!initial) render();
}
$('musicModeBtn').addEventListener('click', function () { if (appMode !== 'music') setMode('music'); });
$('videoModeBtn').addEventListener('click', function () { if (appMode !== 'video') setMode('video'); });

// ---------- VIDEOS ----------
function sortedVideos(list) { return list.slice().sort(compareTitle); }

function addVideoEntry(file, path, source, known) {
  const key = path + '|' + file.name + '|' + file.size + '|' + file.lastModified;
  if (known.has(key)) return null;
  known.add(key);

  const parts = path.split('/');
  const video = {
    id: nextVideoId++,
    key: key,
    source: source || null,
    file: file,
    url: URL.createObjectURL(file),
    title: file.name.replace(/\.[^.]+$/, ''),
    artist: '', album: '', track: 0, lyrics: '', syncedLyrics: [],
    folder: parts.length > 1 ? parts.slice(0, -1).join('/') : 'Loose files',
    thumb: null
  };
  videos.push(video);
  videoById.set(video.id, video);

  const cached = metaCache.get(key);
  if (cached && cached.art) video.thumb = URL.createObjectURL(cached.art);
  return video;
}

function emptyVideos() {
  if (scanning > 0) return bigEmpty('Scanning your folders...', 'This can take a moment for big folders');
  if (pending.length > 0) {
    return bigEmpty('Welcome back', 'Allow Wave to open your folders again',
      '<button class="play-btn big" data-action="reconnect" title="Reconnect" aria-label="Reconnect">' + icon('folder', 28) + '</button>');
  }
  return bigEmpty('No videos yet', 'Add a folder that contains videos (mp4, webm, mkv and more)',
    '<button class="play-btn big" data-action="pick-folder" title="Add folder" aria-label="Add folder">' + icon('folder', 28) + '</button>');
}

function videoCard(v) {
  const inner = v.thumb ? '<img src="' + v.thumb + '" alt="">' : icon('video', 40);
  return '<div class="card" data-action="play-video" data-id="' + v.id + '">' +
    '<div class="thumb wide">' + inner + '</div>' +
    '<div class="card-title">' + esc(v.title) + '</div>' +
    '<div class="card-sub">' + esc(lastSegment(v.folder)) + '</div></div>';
}

function videosGrid(list) {
  videoViewList = list;
  if (videos.length === 0) return emptyVideos();
  if (list.length === 0) return '<div class="empty"><p>No videos found</p></div>';
  let html = '<div class="list-head"><span class="count">' + list.length + (list.length === 1 ? ' video' : ' videos') + '</span>' +
    '<span class="spacer"></span>' +
    '<button class="icon-btn" data-action="add-files" title="Add video files" aria-label="Add video files">' + icon('add', 22) + '</button>' +
    '<button class="icon-btn" data-action="pick-folder" title="Add folder" aria-label="Add folder">' + icon('folder', 21) + '</button>' +
    '</div><div class="grid videos">';
  list.forEach(function (v) { html += videoCard(v); });
  return html + '</div>';
}

function videoFoldersView() {
  videoViewList = [];
  if (videos.length === 0 && savedFolders.length === 0) return emptyVideos();
  const groups = new Map();
  videos.forEach(function (v) {
    if (!groups.has(v.folder)) groups.set(v.folder, []);
    groups.get(v.folder).push(v);
  });
  const paths = Array.from(groups.keys()).sort(function (a, b) { return a.localeCompare(b, undefined, { sensitivity: 'base' }); });

  let html = savedFoldersSection();
  if (paths.length) html += '<div class="list-head"><span class="count">Browse by folder</span></div>';
  paths.forEach(function (path) {
    const n = groups.get(path).length;
    html += '<div class="folder-row" data-action="open-vfolder" data-key="' + encodeURIComponent(path) + '">' +
      '<div class="thumb">' + icon('folder', 26) + '</div>' +
      '<div><div class="row-title">' + esc(lastSegment(path)) + '</div>' +
      '<div class="row-sub">' + esc(path) + '</div></div>' +
      '<div class="folder-count">' + n + (n === 1 ? ' video' : ' videos') + '</div></div>';
  });
  return html;
}

function videoView(q) {
  if (q) {
    return videosGrid(sortedVideos(videos.filter(function (v) { return (v.title + ' ' + v.folder).toLowerCase().includes(q); })));
  }
  if (detail && detail.type === 'vfolder') {
    return headHtml(lastSegment(detail.key), '') + videosGrid(sortedVideos(videos.filter(function (v) { return v.folder === detail.key; })));
  }
  if (activeTab === 'vfolders') return videoFoldersView();
  return videosGrid(sortedVideos(videos));
}

// ---------- VIDEO PLAYER (full screen) ----------
const videoScreen = $('videoScreen');
const videoPlayer = $('videoPlayer');

function playVideo(list, id) {
  vQueue = list.map(function (v) { return v.id; });
  vPos = vQueue.indexOf(id);
  openVideo();
}

function openVideo() {
  const v = videoById.get(vQueue[vPos]);
  if (!v) return;
  if (!player.paused) player.pause();
  videoPlayer.src = v.url;
  $('videoTitle').textContent = v.title;
  $('videoPrev').disabled = vPos <= 0;
  $('videoNext').disabled = vPos >= vQueue.length - 1;
  videoScreen.classList.add('open');
  videoScreen.setAttribute('aria-hidden', 'false');
  videoPlayer.play().catch(function () { /* some formats can't play in the browser: the player shows an error */ });
}

function closeVideo() {
  videoPlayer.pause();
  videoPlayer.removeAttribute('src');
  videoPlayer.load();
  videoScreen.classList.remove('open');
  videoScreen.setAttribute('aria-hidden', 'true');
}

function stepVideo(dir) {
  const next = vPos + dir;
  if (next < 0 || next >= vQueue.length) return;
  vPos = next;
  openVideo();
}

$('closeVideo').addEventListener('click', closeVideo);
$('videoPrev').addEventListener('click', function () { stepVideo(-1); });
$('videoNext').addEventListener('click', function () { stepVideo(1); });
videoPlayer.addEventListener('ended', function () { stepVideo(1); });
videoPlayer.addEventListener('error', function () {
  if (videoScreen.classList.contains('open')) toast('This video format can\u2019t be played in the browser');
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && videoScreen.classList.contains('open')) closeVideo();
});

// ---------- VIDEO THUMBNAILS (a still picture from each video) ----------
const thumbQueue = [];
let thumbBusy = 0;

function makeThumbs(list) {
  list.forEach(function (v) { thumbQueue.push(v); });
  pumpThumbs();
}

function pumpThumbs() {
  while (thumbBusy < 2 && thumbQueue.length) {
    const v = thumbQueue.shift();
    thumbBusy++;
    captureFrame(v).then(function (blob) {
      if (blob) { v.thumb = URL.createObjectURL(blob); scheduleRender(); }
      saveMeta(v, blob);   // saved even when it failed, so we don't keep retrying a video that can't play here
    }).catch(function () {}).then(function () {
      thumbBusy--;
      pumpThumbs();
    });
  }
}

function captureFrame(v) {
  return new Promise(function (resolve) {
    const vid = document.createElement('video');
    vid.muted = true;
    vid.preload = 'metadata';
    let finished = false;
    const timer = setTimeout(function () { done(null); }, 8000);

    function done(blob) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      vid.removeAttribute('src');
      vid.load();
      resolve(blob);
    }

    vid.addEventListener('error', function () { done(null); });
    vid.addEventListener('loadedmetadata', function () {
      const t = isFinite(vid.duration) && vid.duration > 0 ? Math.min(vid.duration * 0.1, 30) : 0;
      vid.currentTime = t;
    });
    vid.addEventListener('seeked', function () {
      try {
        const c = document.createElement('canvas');
        c.width = 480; c.height = 270;
        const scale = Math.max(c.width / vid.videoWidth, c.height / vid.videoHeight);
        const w = vid.videoWidth * scale, h = vid.videoHeight * scale;
        c.getContext('2d').drawImage(vid, (c.width - w) / 2, (c.height - h) / 2, w, h);
        c.toBlob(function (b) { done(b); }, 'image/jpeg', 0.8);
      } catch (err) { done(null); }
    });
    vid.src = v.url;
  });
}

// ---------- THE BROWSER'S DATABASE ----------
// "folders" = remembered folders, "meta" = saved song info, "playlists" = your playlists, "favourites" = hearted songs
function dbRun(storeName, mode, work) {
  return new Promise(function (resolve, reject) {
    const open = indexedDB.open('wave-db', 3);
    open.onupgradeneeded = function () {
      const db = open.result;
      if (!db.objectStoreNames.contains('folders')) db.createObjectStore('folders', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
      if (!db.objectStoreNames.contains('playlists')) db.createObjectStore('playlists', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('favourites')) db.createObjectStore('favourites', { keyPath: 'key' });
    };
    open.onerror = function () { reject(open.error); };
    open.onsuccess = function () {
      const db = open.result;
      const tx = db.transaction(storeName, mode);
      const req = work(tx.objectStore(storeName));
      tx.oncomplete = function () { db.close(); resolve(req ? req.result : undefined); };
      tx.onerror = function () { db.close(); reject(tx.error); };
    };
  });
}

const metaReady = loadMeta();   // starts loading the saved song info right away

// ---------- REMEMBERING YOUR FOLDERS ----------
// Chrome and Edge let a page keep a "handle" to a folder. We store those handles in the
// database so next time we can open the folder again.
const CAN_REMEMBER = 'showDirectoryPicker' in window && 'indexedDB' in window;

// walks through a folder and every folder inside it, collecting the music and video files
async function walk(dirHandle, path, out) {
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      if (/\.(mp3|m4a|wav|ogg|flac|aac|opus|wma|mp4|mkv|webm|mov|m4v|avi|wmv|ogv)$/i.test(entry.name)) {
        out.push({ file: await entry.getFile(), path: path + '/' + entry.name });
      }
    } else {
      await walk(entry, path + '/' + entry.name, out);
    }
  }
}

async function hasAccess(rec, ask) {
  let state = await rec.handle.queryPermission({ mode: 'read' });
  if (state !== 'granted' && ask) state = await rec.handle.requestPermission({ mode: 'read' });
  return state === 'granted';
}

// loads one remembered folder (ask = true when you just clicked, so the browser may ask permission)
async function syncFolder(rec, ask) {
  let counted = false;
  try {
    await metaReady;   // make sure the saved song info is loaded first
    if (!(await hasAccess(rec, ask))) {
      if (pending.indexOf(rec) === -1) pending.push(rec);
      return;
    }
    pending = pending.filter(function (p) { return p !== rec; });
    scanning++;
    counted = true;
    render();
    const entries = [];
    await walk(rec.handle, rec.handle.name, entries);
    addEntries(entries, rec.id);
  } catch (err) {
    console.error('Could not read folder', rec.name, err);
  } finally {
    if (counted) scanning--;
    render();
  }
}

async function syncAll(ask) {
  for (const rec of savedFolders.slice()) {
    await syncFolder(rec, ask);
  }
}

async function pickFolder() {
  if (!CAN_REMEMBER) { folderPicker.click(); return; }   // other browsers: works, but can't remember
  try {
    const handle = await window.showDirectoryPicker({ mode: 'read' });
    for (const rec of savedFolders) {
      if (await rec.handle.isSameEntry(handle)) { await syncFolder(rec, true); return; }
    }
    const rec = { id: uid('f'), name: handle.name, handle: handle };
    await dbRun('folders', 'readwrite', function (store) { return store.put(rec); });
    savedFolders.push(rec);
    await syncFolder(rec, true);
  } catch (err) {
    if (err.name !== 'AbortError') console.error(err);   // AbortError = you closed the picker
  }
}

async function removeFolder(id) {
  if (!confirm('Remove this folder from Wave? Your files are not deleted.')) return;
  await dbRun('folders', 'readwrite', function (store) { return store.delete(id); });
  savedFolders = savedFolders.filter(function (r) { return r.id !== id; });
  pending = pending.filter(function (r) { return r.id !== id; });
  library.filter(function (s) { return s.source === id; }).forEach(function (s) { byKey.delete(s.key); });
  library = library.filter(function (s) { return s.source !== id; });
  videos = videos.filter(function (v) { return v.source !== id; });
  render();
}

async function restoreFolders() {
  if (!CAN_REMEMBER) return;
  try {
    savedFolders = await dbRun('folders', 'readonly', function (store) { return store.getAll(); });
    await syncAll(false);   // loads every folder that is already allowed; the rest wait for a click
  } catch (err) {
    console.error('Could not restore folders', err);
  }
  scanning--;   // done checking for remembered folders
  render();
}

// ---------- START ----------
async function start() {
  setMode(appMode, true);
  if (CAN_REMEMBER) scanning++;   // shows "Scanning..." instead of "empty" while we check
  render();
  await Promise.all([metaReady, loadPlaylists(), loadFavourites()]);
  updateHearts();
  render();
  await restoreFolders();
}
start();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
