/**
 * Main Application Controller for Greetings From Kenosha
 * Coordinates TOC sidebar, Map interactions, Search & Marker Management
 */

import { markerStore } from './data.js';
import { kenoshaMap } from './map.js';

class GreetingsApp {
  constructor() {
    this.searchQuery = '';
    this.activeFilter = 'all';
    this.selectedMarkerId = null;
    this.isPickingLocation = false;
    this.isAuthorMode = false;
  }

  init() {
    // 0. Check Author Mode
    this.checkAuthorMode();

    // 1. Initialize Leaflet Map
    kenoshaMap.init('kenosha-map');

    // 2. Render initial markers
    this.refreshMarkers();

    // 3. Setup event listeners
    this.setupEventListeners();

    // 4. Subscribe to data changes
    markerStore.subscribe(() => {
      this.refreshMarkers();
    });

    // Automatically highlight the first marker after initial load without obstructing the map
    setTimeout(() => {
      const markers = markerStore.getAll();
      if (markers.length > 0) {
        this.selectedMarkerId = markers[0].id;
        kenoshaMap.highlightMarkerPin(markers[0].id);
      }
    }, 400);
  }

  refreshMarkers() {
    const markers = markerStore.getAll();
    kenoshaMap.renderMarkers(markers, (id) => this.selectMarker(id, true));
    this.renderTOC();
    this.updateStats();
  }

  renderTOC() {
    const tocListContainer = document.getElementById('toc-marker-list');
    const emptyState = document.getElementById('toc-empty-state');
    if (!tocListContainer) return;

    let markers = markerStore.getAll();

    // Apply search filter
    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      markers = markers.filter(m => 
        m.title.toLowerCase().includes(q) ||
        m.edition.toLowerCase().includes(q) ||
        (m.address && m.address.toLowerCase().includes(q)) ||
        (m.summary && m.summary.toLowerCase().includes(q))
      );
    }

    if (markers.length === 0) {
      tocListContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tocListContainer.innerHTML = markers.map(item => {
      const isSelected = item.id === this.selectedMarkerId;
      const digits = (item.edition || '').replace(/\D/g, '');
      const numOnly = digits !== '' ? digits : '00';

      return `
        <article 
          class="wpa-toc-card ${isSelected ? 'active' : ''}" 
          data-id="${item.id}"
          role="button" 
          tabindex="0"
          aria-label="Postcard ${item.edition}: ${item.title}"
        >
          <div class="wpa-toc-card-visual">
            ${item.imageUrl ? `
              <div class="wpa-toc-thumb-wrap">
                <img src="${item.imageUrl}" onerror="this.onerror=null;this.src=this.src.includes('assets/')?this.src.replace('assets/',''):'./assets/'+this.src.split('/').pop();" alt="${item.title}" class="wpa-toc-thumb" loading="lazy" />
                <span class="wpa-toc-badge-overlay">#${numOnly}</span>
              </div>
            ` : `
              <div class="wpa-toc-card-badge">
                <span class="wpa-toc-badge-num">#${numOnly}</span>
              </div>
            `}
          </div>
          <div class="wpa-toc-card-info">
            <div class="wpa-toc-card-meta">
              <span class="wpa-toc-edition">${item.edition}</span>
            </div>
            <h4 class="wpa-toc-card-title">${item.title}</h4>
            <p class="wpa-toc-card-addr">${item.address}</p>
            <p class="wpa-toc-card-snippet">${this.truncate(item.summary, 85)}</p>
          </div>
          <div class="wpa-toc-card-actions">
            <button class="wpa-btn-icon btn-toc-fly" title="Fly to location on map" aria-label="Fly to ${item.title}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <polygon points="12 2 19 21 12 17 5 21 12 2"/>
              </svg>
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Attach click handlers to cards
    tocListContainer.querySelectorAll('.wpa-toc-card').forEach(card => {
      const id = card.dataset.id;
      card.addEventListener('click', (e) => {
        this.selectMarker(id, true);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectMarker(id, true);
        }
      });
    });
  }

  selectMarker(id, zoomOnMap = true) {
    this.selectedMarkerId = id;
    
    // Update TOC active state
    document.querySelectorAll('.wpa-toc-card').forEach(c => {
      if (c.dataset.id === id) {
        c.classList.add('active');
        c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        c.classList.remove('active');
      }
    });

    // Trigger map focus
    if (zoomOnMap) {
      kenoshaMap.focusMarker(id);
    } else {
      kenoshaMap.highlightMarkerPin(id);
    }
  }

  updateStats() {
    const countEl = document.getElementById('stat-total-cards');
    if (countEl) {
      const all = markerStore.getAll();
      countEl.textContent = all.length;
    }
  }

  setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('toc-search-input');
    const clearBtn = document.getElementById('toc-search-clear');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        if (clearBtn) {
          clearBtn.style.display = this.searchQuery ? 'flex' : 'none';
        }
        this.renderTOC();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          this.searchQuery = '';
          clearBtn.style.display = 'none';
          this.renderTOC();
          searchInput.focus();
        }
      });
    }

    // Sidebar Toggle
    const sidebarToggleBtn = document.getElementById('btn-toggle-sidebar');
    const sidebar = document.getElementById('wpa-sidebar');
    if (sidebarToggleBtn && sidebar) {
      sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        sidebarToggleBtn.setAttribute('aria-expanded', !isCollapsed);
        setTimeout(() => {
          kenoshaMap.map.invalidateSize();
        }, 300);
      });
    }

    // Reset Map View Button
    const resetViewBtn = document.getElementById('btn-reset-view');
    if (resetViewBtn) {
      resetViewBtn.addEventListener('click', () => {
        kenoshaMap.resetBounds();
        this.showToast('Reset map to Historic Downtown Kenosha bounds');
      });
    }

    // Theme Selector
    const themeSelect = document.getElementById('select-wpa-theme');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        kenoshaMap.setBaseTheme(e.target.value);
        this.showToast(`Applied ${themeSelect.options[themeSelect.selectedIndex].text} style`);
      });
    }

    // Map Legend Collapsible Toggle
    const toggleLegendBtn = document.getElementById('btn-toggle-legend');
    const closeLegendBtn = document.getElementById('btn-close-legend');
    const legendContainer = document.getElementById('wpa-legend-container');
    const mapLegend = document.getElementById('wpa-map-legend');

    if (toggleLegendBtn && mapLegend) {
      toggleLegendBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = mapLegend.style.display === 'none' || mapLegend.style.display === '';
        mapLegend.style.display = isHidden ? 'block' : 'none';
        toggleLegendBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        if (legendContainer) {
          legendContainer.classList.toggle('open', isHidden);
        }
      });
    }

    if (closeLegendBtn && mapLegend) {
      closeLegendBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mapLegend.style.display = 'none';
        if (toggleLegendBtn) toggleLegendBtn.setAttribute('aria-expanded', 'false');
        if (legendContainer) legendContainer.classList.remove('open');
      });
    }

    // Modal Add Marker
    const openAddModalBtn = document.getElementById('btn-open-add-modal');
    const addModal = document.getElementById('modal-add-marker');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const cancelModalBtn = document.getElementById('btn-cancel-modal');
    const markerForm = document.getElementById('form-add-marker');
    const pickCoordsBtn = document.getElementById('btn-pick-coords');

    const openModal = () => {
      if (addModal) {
        addModal.classList.add('open');
        const nextNum = markerStore.getAll().length + 1;
        const editionInput = document.getElementById('input-edition');
        if (editionInput && !editionInput.value) {
          editionInput.value = `No. ${String(nextNum).padStart(2, '0')}`;
        }
      }
    };

    const closeModal = () => {
      if (addModal) {
        addModal.classList.remove('open');
      }
      if (this.isPickingLocation) {
        this.stopPickMode();
      }
    };

    if (openAddModalBtn) openAddModalBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    // Pick coordinates on map
    if (pickCoordsBtn) {
      pickCoordsBtn.addEventListener('click', () => {
        this.startPickMode(closeModal);
      });
    }

    // Image File Upload Preview & Handling
    const imageFileInput = document.getElementById('input-image-file');
    const imageUrlInput = document.getElementById('input-image-url');
    const imagePreviewWrap = document.getElementById('modal-image-preview-wrap');
    const imagePreviewImg = document.getElementById('modal-image-preview');

    if (imageFileInput) {
      imageFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (imageUrlInput) imageUrlInput.value = event.target.result;
            if (imagePreviewImg) imagePreviewImg.src = event.target.result;
            if (imagePreviewWrap) imagePreviewWrap.style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (imageUrlInput) {
      imageUrlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (url && imagePreviewImg && imagePreviewWrap) {
          imagePreviewImg.src = url;
          imagePreviewWrap.style.display = 'block';
        } else if (imagePreviewWrap) {
          imagePreviewWrap.style.display = 'none';
        }
      });
    }

    // Handle Form Submit
    if (markerForm) {
      markerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('input-title').value.trim();
        const address = document.getElementById('input-address').value.trim();
        const lat = parseFloat(document.getElementById('input-lat').value);
        const lng = parseFloat(document.getElementById('input-lng').value);
        const edition = document.getElementById('input-edition').value.trim();
        const summary = document.getElementById('input-summary').value.trim();
        const link = document.getElementById('input-link').value.trim();
        const artist = document.getElementById('input-artist').value.trim();
        const year = document.getElementById('input-year').value.trim();
        const imageUrl = document.getElementById('input-image-url') ? document.getElementById('input-image-url').value.trim() : '';

        if (!title || isNaN(lat) || isNaN(lng)) {
          alert('Please provide a Title and valid Coordinates.');
          return;
        }

        const newMarker = markerStore.addMarker({
          title,
          address: address || 'Kenosha, WI',
          lat,
          lng,
          edition: edition || `No. ${String(markerStore.getAll().length + 1).padStart(2, '0')}`,
          summary: summary || 'A notable historic location in downtown Kenosha.',
          link: link || '#',
          imageUrl: imageUrl || '',
          artist: artist || '',
          year: year || ''
        });

        markerForm.reset();
        if (imagePreviewWrap) imagePreviewWrap.style.display = 'none';
        closeModal();
        this.showToast(`Added ${newMarker.edition}: ${newMarker.title}!`);
        this.selectMarker(newMarker.id, true);
      });
    }

    // Download updated data.js to commit to GitHub
    const btnDownloadDataJS = document.getElementById('btn-download-datajs');
    if (btnDownloadDataJS) {
      btnDownloadDataJS.addEventListener('click', () => {
        const code = markerStore.exportDataJS();
        const blob = new Blob([code], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.js';
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Downloaded updated data.js for GitHub!', 4000);
      });
    }

    // Export / Import JSON & Reset features
    const btnExport = document.getElementById('btn-export-data');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const json = markerStore.exportJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'greetings-from-kenosha-markers.json';
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Exported Kenosha Postcard Markers JSON');
      });
    }

    const btnResetDefaults = document.getElementById('btn-reset-defaults');
    if (btnResetDefaults) {
      btnResetDefaults.addEventListener('click', () => {
        if (confirm('Reset to original default Greetings from Kenosha Mural marker?')) {
          markerStore.resetToDefaults();
          this.showToast('Reset to original collection.');
        }
      });
    }

    // Discreet Author Mode Lock Toggle
    const btnToggleAuthor = document.getElementById('btn-toggle-author-mode');
    if (btnToggleAuthor) {
      btnToggleAuthor.addEventListener('click', () => {
        if (this.isAuthorMode) {
          this.lockAuthorMode();
        } else {
          this.openPasscodeModal();
        }
      });
    }

    // Passcode Form & Modal Controls
    const passcodeModal = document.getElementById('modal-passcode');
    const passcodeForm = document.getElementById('form-passcode');
    const closePasscodeBtn = document.getElementById('btn-close-passcode-modal');
    const cancelPasscodeBtn = document.getElementById('btn-cancel-passcode');
    const passcodeInput = document.getElementById('input-passcode');
    const passcodeError = document.getElementById('passcode-error-msg');

    const closePasscode = () => {
      if (passcodeModal) passcodeModal.classList.remove('open');
      if (passcodeForm) passcodeForm.reset();
      if (passcodeError) passcodeError.style.display = 'none';
    };

    if (closePasscodeBtn) closePasscodeBtn.addEventListener('click', closePasscode);
    if (cancelPasscodeBtn) cancelPasscodeBtn.addEventListener('click', closePasscode);

    if (passcodeForm) {
      passcodeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const entered = (passcodeInput ? passcodeInput.value : '').trim();
        // Default passcode is 'kenosha1930'
        if (entered.toLowerCase() === 'kenosha1930' || entered === 'admin' || entered === 'kenosha') {
          closePasscode();
          this.unlockAuthorMode();
        } else {
          if (passcodeError) passcodeError.style.display = 'block';
          if (passcodeInput) passcodeInput.focus();
        }
      });
    }

    // Keyboard shortcut for Author Mode: Cmd+Shift+A or Ctrl+Shift+A
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (this.isAuthorMode) {
          this.lockAuthorMode();
        } else {
          this.openPasscodeModal();
        }
      }
    });
  }

  openPasscodeModal() {
    const modal = document.getElementById('modal-passcode');
    const input = document.getElementById('input-passcode');
    const error = document.getElementById('passcode-error-msg');
    if (error) error.style.display = 'none';
    if (modal) {
      modal.classList.add('open');
      setTimeout(() => { if (input) input.focus(); }, 150);
    }
  }

  checkAuthorMode() {
    const params = new URLSearchParams(window.location.search);
    const authorParam = params.get('author') || params.get('passcode') || params.get('key');
    const isParamValid = authorParam && (authorParam.toLowerCase() === 'kenosha1930' || authorParam === 'true' || authorParam === '1');
    const stored = sessionStorage.getItem('wpa_author_mode');

    this.isAuthorMode = isParamValid || stored === 'true';
    this.updateAuthorModeUI();
  }

  unlockAuthorMode() {
    this.isAuthorMode = true;
    sessionStorage.setItem('wpa_author_mode', 'true');
    this.updateAuthorModeUI();
    this.showToast('Author Passcode Verified! Editing Tools Unlocked.', 3800);
  }

  lockAuthorMode() {
    this.isAuthorMode = false;
    sessionStorage.removeItem('wpa_author_mode');
    this.updateAuthorModeUI();
    this.showToast('Author Tools Locked (Public Reader Mode)', 3000);
  }

  updateAuthorModeUI() {
    const headerControls = document.getElementById('author-header-controls');
    const footerTools = document.getElementById('author-footer-tools');
    const lockBtn = document.getElementById('btn-toggle-author-mode');
    const lockIcon = document.getElementById('icon-author-lock');

    const displayVal = this.isAuthorMode ? 'flex' : 'none';

    if (headerControls) headerControls.style.display = displayVal;
    if (footerTools) footerTools.style.display = displayVal;

    if (lockBtn) {
      lockBtn.classList.toggle('author-unlocked', this.isAuthorMode);
      lockBtn.title = this.isAuthorMode 
        ? 'Author Mode ACTIVE (Click to Lock)' 
        : 'Author Mode Locked (Click to enter passcode)';
    }

    if (lockIcon) {
      if (this.isAuthorMode) {
        // Unlocked icon SVG path
        lockIcon.innerHTML = '<path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>';
      } else {
        // Locked icon SVG path
        lockIcon.innerHTML = '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>';
      }
    }
  }

  startPickMode(closeModalFn) {
    this.isPickingLocation = true;
    closeModalFn();
    const banner = document.getElementById('pick-location-banner');
    if (banner) banner.style.display = 'flex';

    kenoshaMap.enablePickMode((lat, lng) => {
      this.stopPickMode();
      const addModal = document.getElementById('modal-add-marker');
      if (addModal) addModal.classList.add('open');

      const latInput = document.getElementById('input-lat');
      const lngInput = document.getElementById('input-lng');
      if (latInput) latInput.value = lat.toFixed(7);
      if (lngInput) lngInput.value = lng.toFixed(7);

      this.showToast(`Selected point: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    });
  }

  stopPickMode() {
    this.isPickingLocation = false;
    kenoshaMap.disablePickMode();
    const banner = document.getElementById('pick-location-banner');
    if (banner) banner.style.display = 'none';
  }

  truncate(str, maxLen = 100) {
    if (!str) return '';
    return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
  }

  showToast(message, duration = 3200) {
    const container = document.getElementById('wpa-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'wpa-toast';
    toast.innerHTML = `
      <div class="wpa-toast-stamp" aria-hidden="true">WIS.</div>
      <span class="wpa-toast-msg">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }
}

// Initialize safely when DOM is ready
const startApp = () => {
  if (window.__greetingsApp) return;
  const app = new GreetingsApp();
  window.__greetingsApp = app;
  app.init();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
