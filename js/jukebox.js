/**
 * Greetings From Kenosha - Era Jukebox Audio Engine & UI Controller
 * 
 * Strict Chronological Timeline:
 * Step 1: 1890s–1910s: Ragtime & Early Parlor (Scott Joplin, etc.)
 * Step 2: 1920s: The Roaring Twenties & Hot Jazz Age
 * Step 3: 1930s: Great Depression Radio & Newsstand Hits
 * Step 4: 1930s–1940s: Big Band, Swing & WWII V-Discs
 * Step 5: Lake Michigan Coastal Ambiance (Live Procedural Soundscape)
 * 
 * Features:
 * - Stepped Chronological Timeline Bar with Prev/Next Era Navigation
 * - Illuminated 1930s Art Deco Receiver Screen with Year Badges & Curator Notes
 * - Master Bakelite Transport Controls & Procedural 78 RPM / AM Filter Deck
 * - Structured Track Ledger Table with Time Readouts
 * - Mobile-first Bottom Sheet Drawer with swipeable Timeline & 48px+ thumb ergonomics
 * - Web Audio API Procedural Synthesis & MediaSession OS lock-screen integration
 */

import { JUKEBOX_ERAS, JUKEBOX_TRACKS } from './jukebox-data.js?v=20261006_v55';

class EraJukebox {
  constructor() {
    this.eras = Array.isArray(JUKEBOX_ERAS) ? JUKEBOX_ERAS : [];
    this.tracks = Array.isArray(JUKEBOX_TRACKS) ? JUKEBOX_TRACKS : [];

    // Playback state - defaults to first chronological era (1890s Ragtime)
    this.currentEraId = this.eras.length > 0 ? this.eras[0].id : 'era-ragtime';
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.volume = 0.7;
    this.isMuted = false;
    this.isVinylCrackleOn = true;
    this.isVintageFilterOn = false;
    this.isShuffle = false;
    this.isPanelOpen = false;

    // Audio elements & Web Audio API
    this.audioEl = null;
    this.audioCtx = null;
    this.mediaSourceNode = null;
    this.masterGainNode = null;
    this.vintageFilterNode = null;
    this.vinylGainNode = null;
    this.ambientGainNode = null;
    this.ambientInterval = null;
    this.isProceduralAmbientRunning = false;

    // Touch gesture state for mobile drawer
    this.touchStartY = 0;
    this.touchCurrentY = 0;

    // DOM Elements cache
    this.dom = {};

    // Load saved preferences safely
    try {
      const savedVol = localStorage.getItem('wpa_jukebox_volume');
      if (savedVol !== null) this.volume = parseFloat(savedVol);
      const savedVinyl = localStorage.getItem('wpa_jukebox_vinyl');
      if (savedVinyl !== null) this.isVinylCrackleOn = savedVinyl === 'true';
      const savedEra = localStorage.getItem('wpa_jukebox_era');
      if (savedEra && this.eras.some(e => e.id === savedEra)) {
        this.currentEraId = savedEra;
      }
    } catch (e) {}

    // Initialize HTML5 Audio safely
    try {
      if (typeof Audio !== 'undefined') {
        this.audioEl = new Audio();
        this.audioEl.crossOrigin = 'anonymous';
        this.audioEl.preload = 'metadata';
      }
    } catch (e) {
      console.warn('Audio element initialization deferred:', e);
    }
  }

  /**
   * Helper to check if audio is actively playing in any form
   */
  get isCurrentlyPlaying() {
    if (this.isProceduralAmbientRunning) return true;
    if (this.audioEl && !this.audioEl.paused && this.audioEl.currentTime > 0) return true;
    return this.isPlaying;
  }

  /**
   * Initialize the Jukebox UI and listeners
   */
  init() {
    try {
      this.renderUI();
      this.cacheDom();
      this.setupEventListeners();
      this.setupMediaSession();
      this.updateUI();

      const eraTracks = this.getTracksForCurrentEra();
      if (eraTracks.length > 0) {
        this.currentTrackIndex = 0;
      }
    } catch (err) {
      console.warn('Jukebox init error (non-fatal):', err);
    }
  }

  /**
   * Ensure Web Audio Context is initialized on user gesture
   */
  initAudioContext() {
    if (this.audioCtx) {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();

      // Master gain
      this.masterGainNode = this.audioCtx.createGain();
      this.masterGainNode.gain.value = this.isMuted ? 0 : this.volume;
      this.masterGainNode.connect(this.audioCtx.destination);

      // Vintage AM / 78 RPM Filter (Bandpass + warm resonance)
      this.vintageFilterNode = this.audioCtx.createBiquadFilter();
      this.vintageFilterNode.type = 'allpass';

      // Hook HTML5 Audio through Web Audio API
      if (this.audioEl) {
        try {
          this.mediaSourceNode = this.audioCtx.createMediaElementSource(this.audioEl);
          this.mediaSourceNode.connect(this.vintageFilterNode);
          this.vintageFilterNode.connect(this.masterGainNode);
        } catch (e) {
          // Fallback: regular audio element output
        }
      }

      // Initialize Vinyl Crackle Generator
      this.initVinylCrackleGenerator();

      // Initialize Harbor Ambient Generator
      this.initAmbientGenerator();
    } catch (err) {
      console.warn('Web Audio initialization error:', err);
    }
  }

  /**
   * Procedural Vinyl 78 RPM Crackle & Surface Noise Generator
   */
  initVinylCrackleGenerator() {
    if (!this.audioCtx) return;

    try {
      this.vinylGainNode = this.audioCtx.createGain();
      // Only produce sound if currently playing
      this.vinylGainNode.gain.value = (this.isPlaying && this.isVinylCrackleOn) ? 0.15 : 0;
      this.vinylGainNode.connect(this.masterGainNode);

      const bufferSize = this.audioCtx.sampleRate * 5;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0555179;
        b1 = 0.96300 * b1 + white * 0.0750759;
        b2 = 0.57000 * b2 + white * 0.1538520;
        let pink = b0 + b1 + b2 + white * 0.5362;
        pink *= 0.11;

        if (Math.random() < 0.0018) {
          const pop = (Math.random() * 2 - 1) * (Math.random() > 0.9 ? 0.8 : 0.35);
          pink += pop;
        }
        output[i] = pink;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const bandpass = this.audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1400;
      bandpass.Q.value = 0.8;

      whiteNoise.connect(bandpass);
      bandpass.connect(this.vinylGainNode);
      whiteNoise.start(0);
    } catch (e) {
      console.warn('Vinyl generator init skipped:', e);
    }
  }

  /**
   * Update Vinyl crackle gain according to play state and user setting
   */
  updateVinylCrackleGain() {
    if (!this.vinylGainNode || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      this.vinylGainNode.gain.cancelScheduledValues(now);
      if (this.isPlaying && this.isVinylCrackleOn) {
        this.vinylGainNode.gain.linearRampToValueAtTime(0.15, now + 0.15);
      } else {
        this.vinylGainNode.gain.linearRampToValueAtTime(0.0001, now + 0.08);
      }
    } catch (e) {
      if (this.vinylGainNode) {
        this.vinylGainNode.gain.value = (this.isPlaying && this.isVinylCrackleOn) ? 0.15 : 0;
      }
    }
  }

  /**
   * Procedural Lake Michigan Harbor Waves & Foghorn Generator
   */
  initAmbientGenerator() {
    if (!this.audioCtx) return;

    try {
      this.ambientGainNode = this.audioCtx.createGain();
      this.ambientGainNode.gain.value = 0;
      this.ambientGainNode.connect(this.masterGainNode);

      const waveBufferSize = this.audioCtx.sampleRate * 10;
      const waveBuffer = this.audioCtx.createBuffer(1, waveBufferSize, this.audioCtx.sampleRate);
      const waveData = waveBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < waveBufferSize; i++) {
        const white = Math.random() * 2 - 1;
        waveData[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = waveData[i];
        waveData[i] *= 3.5;
      }

      const waveSource = this.audioCtx.createBufferSource();
      waveSource.buffer = waveBuffer;
      waveSource.loop = true;

      const waveFilter = this.audioCtx.createBiquadFilter();
      waveFilter.type = 'lowpass';
      waveFilter.frequency.value = 320;
      waveFilter.Q.value = 2.0;

      const lfo = this.audioCtx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.value = 250;

      lfo.connect(lfoGain);
      lfoGain.connect(waveFilter.frequency);
      lfo.start(0);

      waveSource.connect(waveFilter);
      waveFilter.connect(this.ambientGainNode);
      waveSource.start(0);
    } catch (e) {
      console.warn('Ambient generator init skipped:', e);
    }
  }

  playHarborChime() {
    if (!this.audioCtx || !this.isProceduralAmbientRunning) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      const pitches = [587.33, 659.25, 880.00, 987.77];
      const pitch = pitches[Math.floor(Math.random() * pitches.length)];
      osc.frequency.setValueAtTime(pitch, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gain);
      gain.connect(this.ambientGainNode);

      osc.start(now);
      osc.stop(now + 3.5);
    } catch (e) {}
  }

  setProceduralAmbientActive(active) {
    this.isProceduralAmbientRunning = active;
    if (!this.ambientGainNode || !this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      if (active) {
        this.ambientGainNode.gain.cancelScheduledValues(now);
        this.ambientGainNode.gain.linearRampToValueAtTime(0.45, now + 0.8);

        if (!this.ambientInterval) {
          this.ambientInterval = setInterval(() => {
            if (this.isProceduralAmbientRunning && Math.random() > 0.4) {
              this.playHarborChime();
            }
          }, 5000);
        }
      } else {
        this.ambientGainNode.gain.cancelScheduledValues(now);
        this.ambientGainNode.gain.setValueAtTime(0, now);
        if (this.ambientInterval) {
          clearInterval(this.ambientInterval);
          this.ambientInterval = null;
        }
      }
    } catch (e) {}
  }

  setVintageFilter(enabled) {
    this.isVintageFilterOn = enabled;
    if (!this.vintageFilterNode || !this.audioCtx) return;

    try {
      if (enabled) {
        this.vintageFilterNode.type = 'bandpass';
        this.vintageFilterNode.frequency.value = 1800;
        this.vintageFilterNode.Q.value = 1.2;
      } else {
        this.vintageFilterNode.type = 'allpass';
      }
    } catch (e) {}
  }

  getTracksForCurrentEra() {
    return this.tracks.filter(t => t.eraId === this.currentEraId);
  }

  getCurrentTrack() {
    const eraTracks = this.getTracksForCurrentEra();
    if (eraTracks.length === 0) return null;
    return eraTracks[this.currentTrackIndex % eraTracks.length];
  }

  getCurrentEraIndex() {
    return this.eras.findIndex(e => e.id === this.currentEraId);
  }

  selectEra(eraId, autoPlay = true) {
    if (!this.eras.some(e => e.id === eraId)) return;
    this.currentEraId = eraId;
    this.currentTrackIndex = 0;

    try {
      localStorage.setItem('wpa_jukebox_era', eraId);
    } catch (e) {}

    const track = this.getCurrentTrack();
    if (track) {
      if (autoPlay || this.isPlaying) {
        this.playTrack(track);
      } else {
        this.loadTrack(track);
      }
    }
    this.updateUI();
  }

  nextEra() {
    const currentIdx = this.getCurrentEraIndex();
    const nextIdx = (currentIdx + 1) % this.eras.length;
    this.selectEra(this.eras[nextIdx].id, true);
  }

  prevEra() {
    const currentIdx = this.getCurrentEraIndex();
    const prevIdx = (currentIdx - 1 + this.eras.length) % this.eras.length;
    this.selectEra(this.eras[prevIdx].id, true);
  }

  loadTrack(track) {
    if (!track) return;

    if (track.isProcedural) {
      if (this.audioEl) {
        this.audioEl.pause();
        this.audioEl.src = '';
      }
    } else if (track.url && this.audioEl) {
      this.audioEl.src = track.url;
      this.audioEl.load();
    }
    this.updateMediaSession(track);
    this.updateUI();
  }

  async playTrack(track) {
    this.initAudioContext();
    if (!track) track = this.getCurrentTrack();
    if (!track) return;

    if (track.isProcedural) {
      if (this.audioEl) {
        this.audioEl.pause();
        this.audioEl.src = '';
      }
      this.setProceduralAmbientActive(true);
      this.isPlaying = true;
    } else {
      this.setProceduralAmbientActive(false);
      if (this.audioEl) {
        if (!this.audioEl.src.includes(encodeURI(track.url)) && this.audioEl.src !== track.url) {
          this.audioEl.src = track.url;
        }
        try {
          await this.audioEl.play();
          this.isPlaying = true;
        } catch (err) {
          console.warn('Playback error / Autoplay blocked:', err);
          this.isPlaying = false;
        }
      }
    }

    this.updateVinylCrackleGain();
    this.updateMediaSession(track);
    this.updateUI();
  }

  togglePlay() {
    this.initAudioContext();
    const track = this.getCurrentTrack();
    if (!track) return;

    // Check if anything is currently playing
    const isActuallyPlaying = this.isPlaying || (this.audioEl && !this.audioEl.paused) || this.isProceduralAmbientRunning;

    if (isActuallyPlaying) {
      this.pause();
    } else {
      this.playTrack(track);
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.audioEl) {
      this.audioEl.pause();
    }
    this.setProceduralAmbientActive(false);
    this.updateVinylCrackleGain();
    this.updateMediaSession(this.getCurrentTrack());
    this.updateUI();
  }

  nextTrack() {
    const eraTracks = this.getTracksForCurrentEra();
    if (eraTracks.length === 0) return;

    if (this.isShuffle && eraTracks.length > 1) {
      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * eraTracks.length);
      } while (nextIdx === this.currentTrackIndex);
      this.currentTrackIndex = nextIdx;
    } else {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % eraTracks.length;
    }

    const track = this.getCurrentTrack();
    this.playTrack(track);
  }

  prevTrack() {
    const eraTracks = this.getTracksForCurrentEra();
    if (eraTracks.length === 0) return;

    if (this.audioEl && this.audioEl.currentTime > 3) {
      this.audioEl.currentTime = 0;
      return;
    }

    this.currentTrackIndex = (this.currentTrackIndex - 1 + eraTracks.length) % eraTracks.length;
    const track = this.getCurrentTrack();
    this.playTrack(track);
  }

  selectTrackIndex(index) {
    const eraTracks = this.getTracksForCurrentEra();
    if (index >= 0 && index < eraTracks.length) {
      this.currentTrackIndex = index;
      this.playTrack(eraTracks[index]);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGainNode) {
      this.masterGainNode.gain.value = this.isMuted ? 0 : this.volume;
    }
    if (this.audioEl) {
      this.audioEl.volume = this.isMuted ? 0 : this.volume;
    }
    try {
      localStorage.setItem('wpa_jukebox_volume', this.volume.toString());
    } catch (e) {}
    this.updateUI();
  }

  toggleVinylCrackle() {
    this.initAudioContext();
    this.isVinylCrackleOn = !this.isVinylCrackleOn;
    this.updateVinylCrackleGain();
    try {
      localStorage.setItem('wpa_jukebox_vinyl', this.isVinylCrackleOn.toString());
    } catch (e) {}
    this.updateUI();
  }

  togglePanel(open) {
    this.isPanelOpen = typeof open === 'boolean' ? open : !this.isPanelOpen;
    if (this.dom.jukeboxModal) {
      this.dom.jukeboxModal.style.display = this.isPanelOpen ? 'flex' : 'none';
      if (this.isPanelOpen) {
        this.initAudioContext();
        this.dom.jukeboxModal.classList.add('active');
        document.body.classList.add('wpa-modal-open');
      } else {
        this.dom.jukeboxModal.classList.remove('active');
        document.body.classList.remove('wpa-modal-open');
      }
    }
    this.updateUI();
  }

  setupMediaSession() {
    if (!('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.setActionHandler('play', () => this.togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('stop', () => this.pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => this.prevTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.nextTrack());
    } catch (e) {}
  }

  updateMediaSession(track) {
    if (!('mediaSession' in navigator) || !track) return;
    try {
      const era = this.eras.find(e => e.id === track.eraId);
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: `Greetings from Kenosha: ${era ? era.shortLabel : 'Era Jukebox'}`,
        artwork: [
          { src: './assets/logo-profile-web.png', sizes: '512x512', type: 'image/png' }
        ]
      });
      navigator.mediaSession.playbackState = this.isPlaying ? 'playing' : 'paused';
    } catch (e) {}
  }

  renderUI() {
    // 1. Header Button in Top Control Bar
    const headerControls = document.querySelector('.wpa-header-controls');
    if (headerControls && !document.getElementById('btn-toggle-jukebox')) {
      const jukeBtn = document.createElement('button');
      jukeBtn.id = 'btn-toggle-jukebox';
      jukeBtn.className = 'wpa-btn wpa-btn-jukebox';
      jukeBtn.type = 'button';
      jukeBtn.title = 'Open 1930s Era Radio Jukebox (Curated Historic Music & Lake Ambiance)';
      jukeBtn.setAttribute('aria-label', 'Open Era Jukebox');
      jukeBtn.innerHTML = `
        <span class="wpa-juke-icon" aria-hidden="true">📻</span>
        <span class="wpa-juke-label">Era Jukebox</span>
        <div class="wpa-juke-eq-bars" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </div>
      `;
      headerControls.insertBefore(jukeBtn, headerControls.firstChild);
    }

    // 2. Floating Mini-Player Pill (Shows when minimized while playing)
    if (!document.getElementById('wpa-jukebox-pill')) {
      const pill = document.createElement('div');
      pill.id = 'wpa-jukebox-pill';
      pill.className = 'wpa-jukebox-pill';
      pill.style.display = 'none';
      pill.innerHTML = `
        <button id="wpa-pill-expand-btn" class="wpa-pill-body" type="button" title="Open Full Jukebox Controls">
          <span class="wpa-pill-vinyl-disc" aria-hidden="true">
            <span class="wpa-vinyl-center"></span>
          </span>
          <div class="wpa-pill-info">
            <span id="wpa-pill-title" class="wpa-pill-title">Maple Leaf Rag</span>
            <span id="wpa-pill-artist" class="wpa-pill-artist">Scott Joplin • 1899</span>
          </div>
        </button>
        <button id="wpa-pill-play-btn" class="wpa-pill-play-btn" type="button" title="Play / Pause" aria-label="Play or Pause Jukebox">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" id="wpa-pill-play-icon">
            <polygon points="6 4 19 12 6 20 6 4"/>
          </svg>
        </button>
        <button id="wpa-pill-next-btn" class="wpa-pill-next-btn" type="button" title="Next Track" aria-label="Next Track">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <polygon points="5 4 15 12 5 20 5 4"/>
            <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </button>
      `;
      document.body.appendChild(pill);
    }

    // 3. Vintage Art Deco Radio Jukebox Modal / Mobile Bottom Sheet
    if (!document.getElementById('modal-era-jukebox')) {
      const modal = document.createElement('div');
      modal.id = 'modal-era-jukebox';
      modal.className = 'wpa-modal-overlay wpa-jukebox-overlay';
      modal.role = 'dialog';
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'wpa-juke-header-title');
      modal.style.display = 'none';

      modal.innerHTML = `
        <div class="wpa-jukebox-cabinet" id="wpa-jukebox-cabinet">
          <!-- Mobile Pull Handle -->
          <div class="wpa-juke-drag-handle-bar" id="wpa-juke-drag-handle" aria-hidden="true">
            <span class="wpa-juke-drag-pill"></span>
          </div>

          <!-- Top Wood & Brass Decorative Arch -->
          <div class="wpa-juke-cabinet-top">
            <div class="wpa-juke-brand-plate">
              <span class="wpa-juke-deco-wing">◆</span>
              <div class="wpa-juke-header-text">
                <h3 id="wpa-juke-header-title" class="wpa-juke-title">ERA JUKEBOX</h3>
                <span class="wpa-juke-subtitle">HISTORIC SOUNDS OF KENOSHA • 1890s–1940s</span>
              </div>
              <span class="wpa-juke-deco-wing">◆</span>
            </div>
            <button id="btn-close-jukebox" class="wpa-juke-close-btn" type="button" aria-label="Close Jukebox Panel" title="Close / Minimize Jukebox">&times;</button>
          </div>

          <!-- SECTION 1: CHRONOLOGICAL STEPPED TIMELINE RIBBON (The Visual Anchor) -->
          <div class="wpa-juke-timeline-container">
            <div class="wpa-juke-timeline-header">
              <span class="wpa-juke-timeline-title">CHRONOLOGICAL ERA TIMELINE:</span>
              <div class="wpa-juke-timeline-nav">
                <button id="btn-juke-prev-era" class="wpa-juke-era-nav-btn" type="button" title="Previous Historic Era">
                  ◀ Earlier Era
                </button>
                <button id="btn-juke-next-era" class="wpa-juke-era-nav-btn" type="button" title="Next Historic Era">
                  Later Era ▶
                </button>
              </div>
            </div>

            <!-- 5 Stepped Chronological Stations -->
            <div class="wpa-juke-stepped-timeline" id="wpa-juke-era-buttons" role="radiogroup" aria-label="Historic Eras in Chronological Order">
              ${this.eras.map((era, idx) => `
                <button 
                  type="button" 
                  class="wpa-timeline-station-btn ${era.id === this.currentEraId ? 'active' : ''}" 
                  data-era-id="${era.id}"
                  role="radio"
                  aria-checked="${era.id === this.currentEraId}"
                  title="${era.label}: ${era.tagline}"
                >
                  <div class="wpa-station-step-badge">
                    <span class="wpa-step-num">${idx + 1}</span>
                    <span class="wpa-step-icon">${era.icon}</span>
                  </div>
                  <div class="wpa-station-details">
                    <span class="wpa-station-decade">${era.shortLabel}</span>
                    <span class="wpa-station-sub">${era.subLabel || era.decade}</span>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="wpa-juke-body">
            <!-- SECTION 2: ILLUMINATED RECEIVER SCREEN (Visual Display Anchor) -->
            <div class="wpa-juke-tuner-glass">
              <div class="wpa-juke-tuner-grid" aria-hidden="true"></div>
              
              <div class="wpa-juke-display-header">
                <div class="wpa-juke-status-tag">
                  <span id="wpa-juke-step-indicator" class="wpa-juke-step-tag">ERA 1 OF 5</span>
                  <span id="wpa-juke-era-badge" class="wpa-juke-badge">1890s–1910s</span>
                </div>
                <span id="wpa-juke-freq-display" class="wpa-juke-freq font-typewriter">78 RPM SHELLAC • MONO</span>
                <div class="wpa-juke-vacuum-tube" title="Vacuum Tube Glow" aria-hidden="true">
                  <span class="wpa-tube-filament"></span>
                </div>
              </div>

              <!-- Track Meta Display -->
              <div class="wpa-juke-track-meta">
                <div class="wpa-juke-title-row">
                  <h4 id="wpa-juke-track-title" class="wpa-juke-track-title">Maple Leaf Rag</h4>
                  <span id="wpa-juke-track-year" class="wpa-juke-year-pill">1899</span>
                </div>
                <p id="wpa-juke-track-artist" class="wpa-juke-track-artist">Scott Joplin</p>
                <div class="wpa-juke-notes-card">
                  <span class="wpa-notes-quote-mark">“</span>
                  <p id="wpa-juke-track-notes" class="wpa-juke-track-notes">The archetype of American ragtime that established Scott Joplin as the King of Ragtime.</p>
                </div>
              </div>

              <!-- Animated Equalizer VU Bars -->
              <div class="wpa-juke-vu-meter" aria-hidden="true">
                <span class="vu-bar b1"></span>
                <span class="vu-bar b2"></span>
                <span class="vu-bar b3"></span>
                <span class="vu-bar b4"></span>
                <span class="vu-bar b5"></span>
                <span class="vu-bar b6"></span>
                <span class="vu-bar b7"></span>
                <span class="vu-bar b8"></span>
                <span class="vu-bar b9"></span>
                <span class="vu-bar b10"></span>
              </div>

              <!-- Scrubber / Progress Bar -->
              <div class="wpa-juke-progress-wrap">
                <span id="wpa-juke-time-current" class="wpa-juke-time font-typewriter">0:00</span>
                <div class="wpa-juke-progress-track" id="wpa-juke-progress-track" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                  <div class="wpa-juke-progress-bar" id="wpa-juke-progress-fill"></div>
                </div>
                <span id="wpa-juke-time-total" class="wpa-juke-time font-typewriter">3:10</span>
              </div>
            </div>

            <!-- SECTION 3: MASTER TRANSPORT KNOBS & VINTAGE TEXTURE DECK -->
            <div class="wpa-juke-controls-panel">
              <div class="wpa-juke-transport-row">
                <button id="btn-juke-prev" class="wpa-juke-ctrl-btn" type="button" title="Previous Track (or restart)" aria-label="Previous Track">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <polygon points="19 20 9 12 19 4 19 20"/>
                    <line x1="5" y1="4" x2="5" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                  </svg>
                </button>

                <button id="btn-juke-play" class="wpa-juke-main-dial" type="button" title="Play / Pause Jukebox" aria-label="Play or Pause Jukebox">
                  <div class="wpa-dial-inner">
                    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" id="wpa-juke-main-play-icon">
                      <polygon points="6 4 19 12 6 20 6 4"/>
                    </svg>
                  </div>
                </button>

                <button id="btn-juke-next" class="wpa-juke-ctrl-btn" type="button" title="Next Track" aria-label="Next Track">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <polygon points="5 4 15 12 5 20 5 4"/>
                    <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>

              <!-- Secondary Vintage Toggles & Volume -->
              <div class="wpa-juke-toggles-row">
                <!-- Volume Slider -->
                <div class="wpa-juke-volume-group">
                  <button id="btn-juke-mute" class="wpa-juke-mini-btn" type="button" title="Mute / Unmute" aria-label="Mute / Unmute">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" id="wpa-juke-vol-icon">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  </button>
                  <input type="range" id="juke-volume-slider" class="wpa-juke-slider" min="0" max="1" step="0.05" value="${this.volume}" aria-label="Volume Slider">
                </div>

                <!-- 78 RPM Vinyl Crackle Toggle -->
                <button id="btn-juke-toggle-vinyl" class="wpa-juke-toggle-switch ${this.isVinylCrackleOn ? 'active' : ''}" type="button" title="Toggle 78 RPM Vinyl Surface Noise &amp; Phonograph Warmth" aria-pressed="${this.isVinylCrackleOn}">
                  <span class="wpa-toggle-dot"></span>
                  <span>78 RPM Vinyl Warmth</span>
                </button>

                <!-- AM Radio Filter Toggle -->
                <button id="btn-juke-toggle-filter" class="wpa-juke-toggle-switch ${this.isVintageFilterOn ? 'active' : ''}" type="button" title="Toggle Antique AM Horn Radio Filter" aria-pressed="${this.isVintageFilterOn}">
                  <span class="wpa-toggle-dot"></span>
                  <span>AM Horn Filter</span>
                </button>
              </div>
            </div>

            <!-- SECTION 4: ERA TRACK LEDGER (Structured Chronological Catalog Table) -->
            <div class="wpa-juke-catalog-section">
              <div class="wpa-juke-catalog-header">
                <div class="wpa-juke-catalog-label-group">
                  <span class="wpa-juke-section-label">ERA RECORDINGS LEDGER</span>
                  <span id="wpa-juke-era-tagline" class="wpa-juke-era-tagline">Scott Joplin Piano Rolls &amp; Saloon Rags</span>
                </div>
                <span id="wpa-juke-track-count" class="wpa-juke-count-badge">5 Tracks</span>
              </div>

              <!-- Table Headers -->
              <div class="wpa-juke-ledger-thead" aria-hidden="true">
                <span class="col-idx">#</span>
                <span class="col-year">YEAR</span>
                <span class="col-title">RECORDING TITLE &amp; ARTIST</span>
                <span class="col-dur">TIME</span>
              </div>

              <div class="wpa-juke-tracklist" id="wpa-juke-tracklist" role="list">
                <!-- Dynamically populated track rows -->
              </div>
            </div>
          </div>

          <!-- Bottom Decorative Footer -->
          <div class="wpa-juke-cabinet-footer">
            <span class="wpa-footer-lamp">●</span>
            <span>Plays continuously across all Kenosha articles &amp; interactive map exploration</span>
            <span class="wpa-footer-lamp">●</span>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
  }

  cacheDom() {
    this.dom.headerToggleBtn = document.getElementById('btn-toggle-jukebox');
    this.dom.jukeboxModal = document.getElementById('modal-era-jukebox');
    this.dom.cabinet = document.getElementById('wpa-jukebox-cabinet');
    this.dom.dragHandle = document.getElementById('wpa-juke-drag-handle');
    this.dom.closeBtn = document.getElementById('btn-close-jukebox');

    this.dom.btnPrevEra = document.getElementById('btn-juke-prev-era');
    this.dom.btnNextEra = document.getElementById('btn-juke-next-era');

    this.dom.pill = document.getElementById('wpa-jukebox-pill');
    this.dom.pillExpandBtn = document.getElementById('wpa-pill-expand-btn');
    this.dom.pillPlayBtn = document.getElementById('wpa-pill-play-btn');
    this.dom.pillNextBtn = document.getElementById('wpa-pill-next-btn');
    this.dom.pillTitle = document.getElementById('wpa-pill-title');
    this.dom.pillArtist = document.getElementById('wpa-pill-artist');
    this.dom.pillPlayIcon = document.getElementById('wpa-pill-play-icon');

    this.dom.playBtn = document.getElementById('btn-juke-play');
    this.dom.prevBtn = document.getElementById('btn-juke-prev');
    this.dom.nextBtn = document.getElementById('btn-juke-next');
    this.dom.muteBtn = document.getElementById('btn-juke-mute');
    this.dom.volumeSlider = document.getElementById('juke-volume-slider');
    this.dom.vinylToggle = document.getElementById('btn-juke-toggle-vinyl');
    this.dom.filterToggle = document.getElementById('btn-juke-toggle-filter');

    this.dom.stepIndicator = document.getElementById('wpa-juke-step-indicator');
    this.dom.eraBadge = document.getElementById('wpa-juke-era-badge');
    this.dom.freqDisplay = document.getElementById('wpa-juke-freq-display');
    this.dom.trackTitle = document.getElementById('wpa-juke-track-title');
    this.dom.trackYear = document.getElementById('wpa-juke-track-year');
    this.dom.trackArtist = document.getElementById('wpa-juke-track-artist');
    this.dom.trackNotes = document.getElementById('wpa-juke-track-notes');
    this.dom.eraTagline = document.getElementById('wpa-juke-era-tagline');

    this.dom.timeCurrent = document.getElementById('wpa-juke-time-current');
    this.dom.timeTotal = document.getElementById('wpa-juke-time-total');
    this.dom.progressFill = document.getElementById('wpa-juke-progress-fill');
    this.dom.progressTrack = document.getElementById('wpa-juke-progress-track');
    this.dom.trackList = document.getElementById('wpa-juke-tracklist');
    this.dom.trackCount = document.getElementById('wpa-juke-track-count');
    this.dom.eraButtons = document.getElementById('wpa-juke-era-buttons');
  }

  setupEventListeners() {
    if (this.dom.headerToggleBtn) {
      this.dom.headerToggleBtn.addEventListener('click', () => {
        this.togglePanel(true);
      });
    }

    if (this.dom.closeBtn) {
      this.dom.closeBtn.addEventListener('click', () => {
        this.togglePanel(false);
      });
    }

    if (this.dom.jukeboxModal) {
      this.dom.jukeboxModal.addEventListener('click', (e) => {
        if (e.target === this.dom.jukeboxModal) {
          this.togglePanel(false);
        }
      });
    }

    // Touch swipe down on drag handle to dismiss bottom sheet
    if (this.dom.dragHandle) {
      this.dom.dragHandle.addEventListener('click', () => {
        this.togglePanel(false);
      });

      this.dom.dragHandle.addEventListener('touchstart', (e) => {
        this.touchStartY = e.touches[0].clientY;
      }, { passive: true });

      this.dom.dragHandle.addEventListener('touchmove', (e) => {
        this.touchCurrentY = e.touches[0].clientY;
        const diff = this.touchCurrentY - this.touchStartY;
        if (diff > 0 && this.dom.cabinet) {
          this.dom.cabinet.style.transform = `translateY(${diff}px)`;
        }
      }, { passive: true });

      this.dom.dragHandle.addEventListener('touchend', () => {
        const diff = this.touchCurrentY - this.touchStartY;
        if (this.dom.cabinet) {
          this.dom.cabinet.style.transform = '';
        }
        if (diff > 80) {
          this.togglePanel(false);
        }
        this.touchStartY = 0;
        this.touchCurrentY = 0;
      });
    }

    // Prev / Next Era buttons
    if (this.dom.btnPrevEra) {
      this.dom.btnPrevEra.addEventListener('click', () => this.prevEra());
    }
    if (this.dom.btnNextEra) {
      this.dom.btnNextEra.addEventListener('click', () => this.nextEra());
    }

    // Mini pill controls
    if (this.dom.pillExpandBtn) {
      this.dom.pillExpandBtn.addEventListener('click', () => {
        this.togglePanel(true);
      });
    }
    if (this.dom.pillPlayBtn) {
      this.dom.pillPlayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.togglePlay();
      });
    }
    if (this.dom.pillNextBtn) {
      this.dom.pillNextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.nextTrack();
      });
    }

    // Master transport buttons
    if (this.dom.playBtn) {
      this.dom.playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.togglePlay();
      });
    }
    if (this.dom.prevBtn) {
      this.dom.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.prevTrack();
      });
    }
    if (this.dom.nextBtn) {
      this.dom.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.nextTrack();
      });
    }

    // Volume & switches
    if (this.dom.volumeSlider) {
      this.dom.volumeSlider.addEventListener('input', (e) => {
        this.setVolume(parseFloat(e.target.value));
      });
    }
    if (this.dom.muteBtn) {
      this.dom.muteBtn.addEventListener('click', () => {
        this.isMuted = !this.isMuted;
        this.setVolume(this.volume);
      });
    }
    if (this.dom.vinylToggle) {
      this.dom.vinylToggle.addEventListener('click', () => {
        this.toggleVinylCrackle();
      });
    }
    if (this.dom.filterToggle) {
      this.dom.filterToggle.addEventListener('click', () => {
        this.setVintageFilter(!this.isVintageFilterOn);
        this.updateUI();
      });
    }

    // Era stations click
    if (this.dom.eraButtons) {
      this.dom.eraButtons.addEventListener('click', (e) => {
        const btn = e.target.closest('.wpa-timeline-station-btn');
        if (btn && btn.dataset.eraId) {
          this.selectEra(btn.dataset.eraId, true);
        }
      });
    }

    // Scrubber click
    if (this.dom.progressTrack) {
      this.dom.progressTrack.addEventListener('click', (e) => {
        if (!this.audioEl || !this.audioEl.duration || isNaN(this.audioEl.duration)) return;
        const rect = this.dom.progressTrack.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.audioEl.currentTime = percent * this.audioEl.duration;
      });
    }

    // HTML5 Audio events
    if (this.audioEl) {
      this.audioEl.addEventListener('timeupdate', () => this.onTimeUpdate());
      this.audioEl.addEventListener('ended', () => this.nextTrack());
      this.audioEl.addEventListener('play', () => {
        this.isPlaying = true;
        this.updateVinylCrackleGain();
        this.updateUI();
      });
      this.audioEl.addEventListener('pause', () => {
        if (!this.isProceduralAmbientRunning) {
          this.isPlaying = false;
        }
        this.updateVinylCrackleGain();
        this.updateUI();
      });
      this.audioEl.addEventListener('error', () => {
        setTimeout(() => this.nextTrack(), 1500);
      });
    }

    // Global keyboard shortcuts (Space to Play/Pause, Escape to Close)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isPanelOpen) {
        this.togglePanel(false);
      } else if (e.code === 'Space' && this.isPanelOpen && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        this.togglePlay();
      }
    });
  }

  onTimeUpdate() {
    if (!this.audioEl || !this.audioEl.duration || isNaN(this.audioEl.duration)) return;

    const cur = this.audioEl.currentTime;
    const dur = this.audioEl.duration;
    const pct = (cur / dur) * 100;

    if (this.dom.progressFill) {
      this.dom.progressFill.style.width = `${pct}%`;
    }
    if (this.dom.timeCurrent) {
      this.dom.timeCurrent.textContent = this.formatTime(cur);
    }
    if (this.dom.timeTotal) {
      this.dom.timeTotal.textContent = this.formatTime(dur);
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  updateUI() {
    const track = this.getCurrentTrack();
    const eraIdx = this.getCurrentEraIndex();
    const era = this.eras[eraIdx] || this.eras[0];
    const eraTracks = this.getTracksForCurrentEra();

    // Top Header Button
    if (this.dom.headerToggleBtn) {
      if (this.isPlaying) {
        this.dom.headerToggleBtn.classList.add('playing');
        this.dom.headerToggleBtn.title = `Now Playing: ${track ? track.title : 'Era Jukebox'} (Click for controls)`;
      } else {
        this.dom.headerToggleBtn.classList.remove('playing');
        this.dom.headerToggleBtn.title = 'Open 1930s Era Radio Jukebox';
      }
    }

    // Mini Pill
    if (this.dom.pill) {
      if (this.isPlaying && !this.isPanelOpen) {
        this.dom.pill.style.display = 'flex';
        this.dom.pill.classList.add('active');
      } else {
        this.dom.pill.style.display = 'none';
        this.dom.pill.classList.remove('active');
      }

      if (track) {
        if (this.dom.pillTitle) this.dom.pillTitle.textContent = track.title;
        if (this.dom.pillArtist) this.dom.pillArtist.textContent = `${track.artist} • ${track.year}`;
      }

      if (this.dom.pillPlayIcon) {
        if (this.isPlaying) {
          this.dom.pillPlayIcon.innerHTML = `<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>`;
          if (this.dom.pillPlayBtn) this.dom.pillPlayBtn.title = 'Pause Playback';
        } else {
          this.dom.pillPlayIcon.innerHTML = `<polygon points="6 4 19 12 6 20 6 4" fill="currentColor"/>`;
          if (this.dom.pillPlayBtn) this.dom.pillPlayBtn.title = 'Play';
        }
      }
    }

    // Receiver Screen Metadata
    if (track) {
      if (this.dom.stepIndicator) this.dom.stepIndicator.textContent = `ERA ${eraIdx + 1} OF ${this.eras.length}`;
      if (this.dom.eraBadge && era) this.dom.eraBadge.textContent = era.badge || era.shortLabel;
      if (this.dom.trackTitle) this.dom.trackTitle.textContent = track.title;
      if (this.dom.trackYear) this.dom.trackYear.textContent = track.year;
      if (this.dom.trackArtist) this.dom.trackArtist.textContent = track.artist;
      if (this.dom.trackNotes) this.dom.trackNotes.textContent = track.notes || '';
      if (this.dom.eraTagline && era) this.dom.eraTagline.textContent = era.tagline || '';

      if (this.dom.freqDisplay && era) {
        this.dom.freqDisplay.textContent = track.isProcedural ? 'LAKE MICHIGAN 88.5 FM • AMBIENT' : `BROADCAST ${era.decade} • 78 RPM`;
      }
      if (track.isProcedural) {
        if (this.dom.timeCurrent) this.dom.timeCurrent.textContent = 'LIVE';
        if (this.dom.timeTotal) this.dom.timeTotal.textContent = '∞';
        if (this.dom.progressFill) this.dom.progressFill.style.width = '100%';
      }
    }

    // Main Play Dial Icon
    const playIcon = document.getElementById('wpa-juke-main-play-icon');
    if (playIcon) {
      if (this.isPlaying) {
        playIcon.innerHTML = `<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>`;
        if (this.dom.playBtn) {
          this.dom.playBtn.classList.add('playing');
          this.dom.playBtn.title = 'Pause Jukebox Playback (Spacebar)';
          this.dom.playBtn.setAttribute('aria-label', 'Pause Jukebox');
        }
      } else {
        playIcon.innerHTML = `<polygon points="6 4 19 12 6 20 6 4" fill="currentColor"/>`;
        if (this.dom.playBtn) {
          this.dom.playBtn.classList.remove('playing');
          this.dom.playBtn.title = 'Play Recording (Spacebar)';
          this.dom.playBtn.setAttribute('aria-label', 'Play Jukebox');
        }
      }
    }

    // Playing state on Cabinet
    if (this.dom.cabinet) {
      if (this.isPlaying) {
        this.dom.cabinet.classList.add('is-playing');
      } else {
        this.dom.cabinet.classList.remove('is-playing');
      }
    }

    // Stepped Timeline Stations
    if (this.dom.eraButtons) {
      const btns = this.dom.eraButtons.querySelectorAll('.wpa-timeline-station-btn');
      btns.forEach(btn => {
        if (btn.dataset.eraId === this.currentEraId) {
          btn.classList.add('active');
          btn.setAttribute('aria-checked', 'true');
          try {
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          } catch (e) {}
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-checked', 'false');
        }
      });
    }

    // Toggles
    if (this.dom.vinylToggle) {
      if (this.isVinylCrackleOn) {
        this.dom.vinylToggle.classList.add('active');
        this.dom.vinylToggle.setAttribute('aria-pressed', 'true');
      } else {
        this.dom.vinylToggle.classList.remove('active');
        this.dom.vinylToggle.setAttribute('aria-pressed', 'false');
      }
    }
    if (this.dom.filterToggle) {
      if (this.isVintageFilterOn) {
        this.dom.filterToggle.classList.add('active');
        this.dom.filterToggle.setAttribute('aria-pressed', 'true');
      } else {
        this.dom.filterToggle.classList.remove('active');
        this.dom.filterToggle.setAttribute('aria-pressed', 'false');
      }
    }

    // Track Ledger Table Rows
    if (this.dom.trackList) {
      if (this.dom.trackCount) {
        this.dom.trackCount.textContent = `${eraTracks.length} ${eraTracks.length === 1 ? 'Recording' : 'Recordings'}`;
      }

      this.dom.trackList.innerHTML = eraTracks.map((t, idx) => {
        const isCurrent = idx === this.currentTrackIndex;
        return `
          <button 
            type="button" 
            class="wpa-juke-track-row ${isCurrent ? 'active' : ''} ${isCurrent && this.isPlaying ? 'playing' : ''}" 
            data-track-index="${idx}"
            title="${t.notes || t.title}"
            aria-selected="${isCurrent}"
          >
            <div class="wpa-juke-row-idx">
              ${isCurrent && this.isPlaying ? `
                <span class="wpa-mini-eq"><span></span><span></span><span></span></span>
              ` : `
                <span>${idx + 1}</span>
              `}
            </div>
            <span class="wpa-juke-row-year font-typewriter">${t.year}</span>
            <div class="wpa-juke-row-info">
              <span class="wpa-juke-row-title">${t.title}</span>
              <span class="wpa-juke-row-artist">${t.artist}</span>
            </div>
            <span class="wpa-juke-row-dur font-typewriter">${t.duration}</span>
          </button>
        `;
      }).join('');

      const rows = this.dom.trackList.querySelectorAll('.wpa-juke-track-row');
      rows.forEach(row => {
        row.addEventListener('click', () => {
          const idx = parseInt(row.dataset.trackIndex, 10);
          this.selectTrackIndex(idx);
        });
      });
    }
  }
}

export const eraJukebox = new EraJukebox();
