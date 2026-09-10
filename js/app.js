/**
 * Main Application Controller for Greetings From Kenosha
 * Coordinates TOC sidebar, Map interactions, Search & Surveyor Coordinate Tool
 */

import { markerStore } from './data.js';
import { kenoshaMap } from './map.js';

class GreetingsApp {
  constructor() {
    this.searchQuery = '';
    this.selectedMarkerId = null;
    this.isCuratorMode = false;
    this.hasLocalPlannedData = false;
  }

  async init() {
    // 1. Check Curator Planning Mode & load local-only draft file if present
    await this.checkCuratorMode();

    // 2. Initialize Leaflet Map
    kenoshaMap.init('kenosha-map');

    // 3. Render initial markers
    this.refreshMarkers();

    // 4. If in Curator Mode, render planned draft pins
    if (this.isCuratorMode) {
      this.updateCuratorModeState();
    }

    // 5. Setup event listeners & Surveyor Tool
    this.setupEventListeners();

    // 6. Subscribe to data changes
    markerStore.subscribe(() => {
      this.refreshMarkers();
      if (this.isCuratorMode) {
        this.updateCuratorModeState();
      }
    });

    // Automatically highlight the first marker after initial load
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
      card.addEventListener('click', () => {
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

    // Surveyor Coordinates Tool Toggle
    const btnToggleSurveyor = document.getElementById('btn-toggle-surveyor');
    const btnCloseSurveyor = document.getElementById('btn-close-surveyor');

    if (btnToggleSurveyor) {
      btnToggleSurveyor.addEventListener('click', () => {
        const isActive = kenoshaMap.toggleSurveyorMode();
        if (isActive) {
          this.showToast('📍 Surveyor Mode: Click anywhere on map to inspect coordinates!', 3500);
        }
      });
    }

    if (btnCloseSurveyor) {
      btnCloseSurveyor.addEventListener('click', () => {
        kenoshaMap.toggleSurveyorMode();
      });
    }

    // Curator Mode Badge Click / Keyboard Toggle
    const curatorBadge = document.getElementById('curator-mode-badge');
    if (curatorBadge) {
      curatorBadge.addEventListener('click', () => {
        this.toggleCuratorMode();
      });
      curatorBadge.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleCuratorMode();
        }
      });
    }

    // Keyboard shortcut to toggle Curator Mode: Shift + P (Planner)
    document.addEventListener('keydown', (e) => {
      if (e.shiftKey && (e.key === 'P' || e.key === 'p') && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        this.toggleCuratorMode();
      }
    });

    // Modal Planned Pin Controls
    const closePlannedBtn = document.getElementById('btn-close-planned-modal');
    const cancelPlannedBtn = document.getElementById('btn-cancel-planned');
    const formPlanned = document.getElementById('form-planned-pin');

    if (closePlannedBtn) {
      closePlannedBtn.addEventListener('click', () => this.closePlannedModal());
    }
    if (cancelPlannedBtn) {
      cancelPlannedBtn.addEventListener('click', () => this.closePlannedModal());
    }

    if (formPlanned) {
      formPlanned.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('planned-input-id')?.value.trim();
        const edition = document.getElementById('planned-input-edition')?.value.trim() || 'No. 04';
        const title = document.getElementById('planned-input-title')?.value.trim();
        const address = document.getElementById('planned-input-address')?.value.trim() || 'Kenosha, WI';
        const lat = parseFloat(document.getElementById('planned-input-lat')?.value);
        const lng = parseFloat(document.getElementById('planned-input-lng')?.value);
        const status = document.getElementById('planned-input-status')?.value || 'Researching';
        const notes = document.getElementById('planned-input-notes')?.value.trim() || '';

        if (!title || isNaN(lat) || isNaN(lng)) {
          alert('Please provide a landmark title and valid coordinates.');
          return;
        }

        let savedItem = null;
        if (id) {
          savedItem = markerStore.updatePlannedMarker(id, {
            title,
            address,
            lat,
            lng,
            plannedEdition: edition,
            status,
            notes
          });
        } else {
          savedItem = markerStore.addPlannedMarker({
            title,
            address,
            lat,
            lng,
            plannedEdition: edition,
            status,
            notes
          });
        }

        this.closePlannedModal();

        // Ensure curator mode is active so pin displays immediately
        if (!this.isCuratorMode) {
          this.isCuratorMode = true;
          sessionStorage.setItem('wpa_curator_mode', 'true');
        }

        this.updateCuratorModeState();
        
        if (id) {
          this.showToast(`✏️ Updated Planned Pin: ${savedItem ? savedItem.plannedEdition : edition} — ${title}!`, 4000);
        } else {
          this.showToast(`📝 Placed Planned Pin: ${savedItem ? savedItem.plannedEdition : edition} — ${title}!`, 4000);
        }
      });
    }

    // Repick Planned Coordinates from map
    const repickBtn = document.getElementById('btn-repick-planned-coords');
    const repickBanner = document.getElementById('repick-banner');
    const closeRepickBtn = document.getElementById('btn-close-repick');

    if (repickBtn) {
      repickBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-planned-pin');
        if (modal) {
          modal.classList.add('picking-mode');
        }

        if (repickBanner) {
          repickBanner.style.display = 'flex';
        }

        kenoshaMap.isRepicking = true;
        const mapEl = document.getElementById('kenosha-map');
        if (mapEl) mapEl.classList.add('crosshair-mode');

        kenoshaMap.onRepickCoordinate = (lat, lng) => {
          kenoshaMap.isRepicking = false;
          if (mapEl) mapEl.classList.remove('crosshair-mode');
          if (repickBanner) repickBanner.style.display = 'none';

          const latInput = document.getElementById('planned-input-lat');
          const lngInput = document.getElementById('planned-input-lng');
          if (latInput) latInput.value = parseFloat(lat).toFixed(7);
          if (lngInput) lngInput.value = parseFloat(lng).toFixed(7);

          // Drop surveyor pin to visually mark new spot
          kenoshaMap.dropSurveyorPin(lat, lng, false);

          if (modal) {
            modal.classList.remove('picking-mode');
          }

          this.showToast(`📍 Set coordinates to: ${lat.toFixed(5)}, ${lng.toFixed(5)}`, 3000);
        };
      });
    }

    if (closeRepickBtn) {
      closeRepickBtn.addEventListener('click', () => {
        kenoshaMap.isRepicking = false;
        kenoshaMap.onRepickCoordinate = null;
        const mapEl = document.getElementById('kenosha-map');
        if (mapEl) mapEl.classList.remove('crosshair-mode');
        if (repickBanner) repickBanner.style.display = 'none';

        const modal = document.getElementById('modal-planned-pin');
        if (modal) {
          modal.classList.remove('picking-mode');
        }
      });
    }

    // Global delegated click listener for on-map popup buttons
    document.addEventListener('click', (e) => {
      const createBtn = e.target.closest('#btn-surveyor-create-pin') || e.target.closest('.wpa-btn-surveyor-add');
      if (createBtn) {
        e.preventDefault();
        e.stopPropagation();
        kenoshaMap.surveyorMarker?.closePopup();
        const lat = parseFloat(createBtn.dataset.lat);
        const lng = parseFloat(createBtn.dataset.lng);
        if (!isNaN(lat) && !isNaN(lng)) {
          this.openPlannedModal(lat, lng);
        } else if (kenoshaMap.surveyorMarker) {
          const pos = kenoshaMap.surveyorMarker.getLatLng();
          this.openPlannedModal(pos.lat, pos.lng);
        }
      }

      const editBtn = e.target.closest('.wpa-btn-field-edit');
      if (editBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = editBtn.dataset.id;
        if (id) {
          this.openEditPlannedModal(id);
        }
      }

      const deleteBtn = e.target.closest('.wpa-btn-field-delete');
      if (deleteBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = deleteBtn.dataset.id;
        if (id) {
          this.deletePlannedPin(id);
        }
      }

      // Live Postcard Repositioning Button
      const repickLiveBtn = e.target.closest('.wpa-btn-repick-live-marker');
      if (repickLiveBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = repickLiveBtn.dataset.id;
        const title = repickLiveBtn.dataset.title || 'Postcard';
        const edition = repickLiveBtn.dataset.edition || 'Pin';

        kenoshaMap.map.closePopup();

        const repickBanner = document.getElementById('repick-banner');
        if (repickBanner) {
          const span = repickBanner.querySelector('span');
          if (span) {
            span.innerHTML = `<strong>Repositioning ${edition}:</strong> Click anywhere on the map to place this pin at the exact spot.`;
          }
          repickBanner.style.display = 'flex';
        }

        kenoshaMap.isRepicking = true;
        const mapEl = document.getElementById('kenosha-map');
        if (mapEl) mapEl.classList.add('crosshair-mode');

        kenoshaMap.onRepickCoordinate = (lat, lng) => {
          kenoshaMap.isRepicking = false;
          if (mapEl) mapEl.classList.remove('crosshair-mode');
          if (repickBanner) repickBanner.style.display = 'none';

          // Update marker in data store & localStorage
          markerStore.updateMarkerCoordinates(id, lat, lng);

          // Re-render and re-focus
          this.refreshMarkers();
          setTimeout(() => {
            kenoshaMap.focusMarker(id);
          }, 350);

          const latFormatted = lat.toFixed(7);
          const lngFormatted = lng.toFixed(7);

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(`${latFormatted}, ${lngFormatted}`).catch(() => {});
          }

          this.showToast(`✓ Repositioned ${edition} to ${latFormatted}, ${lngFormatted}! (Coordinates copied to clipboard)`, 5000);
        };
      }
    });

    // Callback when any point is pinned or right-clicked
    kenoshaMap.onSurveyorCopied = (lat, lng) => {
      this.showToast(`📍 Copied coordinates: ${lat}, ${lng}`, 3500);
    };
  }

  openPlannedModal(lat, lng) {
    const modal = document.getElementById('modal-planned-pin');
    const modalTitle = document.getElementById('modal-planned-title');
    const saveBtn = document.getElementById('btn-save-planned');
    const idInput = document.getElementById('planned-input-id');
    const latInput = document.getElementById('planned-input-lat');
    const lngInput = document.getElementById('planned-input-lng');
    const editionInput = document.getElementById('planned-input-edition');
    const titleInput = document.getElementById('planned-input-title');
    const addressInput = document.getElementById('planned-input-address');
    const statusSelect = document.getElementById('planned-input-status');
    const notesInput = document.getElementById('planned-input-notes');

    if (!modal) return;

    if (idInput) idInput.value = '';
    if (modalTitle) modalTitle.textContent = '📝 CREATE PLANNED PIN';
    if (saveBtn) saveBtn.textContent = 'Save Planned Pin';

    if (latInput) latInput.value = parseFloat(lat).toFixed(7);
    if (lngInput) lngInput.value = parseFloat(lng).toFixed(7);

    // Calculate next suggested edition number (highest edition + 1)
    const all = markerStore.getAll(true);
    let maxEditionNum = 0;
    all.forEach(m => {
      const num = typeof m.editionNum === 'number' ? m.editionNum : parseInt((m.edition || m.plannedEdition || '').replace(/\D/g, ''), 10);
      if (!isNaN(num) && num > maxEditionNum) {
        maxEditionNum = num;
      }
    });
    const nextNum = maxEditionNum + 1;
    if (editionInput) {
      editionInput.value = `No. ${String(nextNum).padStart(2, '0')}`;
    }
    if (titleInput) titleInput.value = '';
    if (addressInput) addressInput.value = '';
    if (statusSelect) statusSelect.value = 'Researching';
    if (notesInput) notesInput.value = '';

    modal.classList.remove('picking-mode');
    modal.classList.add('open');
    modal.style.display = 'flex';
    setTimeout(() => {
      if (titleInput) titleInput.focus();
    }, 150);
  }

  openEditPlannedModal(id) {
    const item = markerStore.getById(id);
    if (!item) {
      this.showToast('Could not find planned pin to edit');
      return;
    }

    const modal = document.getElementById('modal-planned-pin');
    const modalTitle = document.getElementById('modal-planned-title');
    const saveBtn = document.getElementById('btn-save-planned');
    const idInput = document.getElementById('planned-input-id');
    const latInput = document.getElementById('planned-input-lat');
    const lngInput = document.getElementById('planned-input-lng');
    const editionInput = document.getElementById('planned-input-edition');
    const titleInput = document.getElementById('planned-input-title');
    const addressInput = document.getElementById('planned-input-address');
    const statusSelect = document.getElementById('planned-input-status');
    const notesInput = document.getElementById('planned-input-notes');

    if (!modal) return;

    if (idInput) idInput.value = item.id;
    if (modalTitle) modalTitle.textContent = `✏️ EDIT PLANNED PIN • ${item.plannedEdition || item.edition || ''}`;
    if (saveBtn) saveBtn.textContent = 'Update Planned Pin';

    if (editionInput) editionInput.value = item.plannedEdition || item.edition || '';
    if (statusSelect) statusSelect.value = item.status || 'Researching';
    if (titleInput) titleInput.value = item.title || '';
    if (addressInput) addressInput.value = item.address || '';
    if (latInput) latInput.value = parseFloat(item.lat).toFixed(7);
    if (lngInput) lngInput.value = parseFloat(item.lng).toFixed(7);
    if (notesInput) notesInput.value = item.notes || '';

    modal.classList.remove('picking-mode');
    modal.classList.add('open');
    modal.style.display = 'flex';
    setTimeout(() => {
      if (titleInput) titleInput.focus();
    }, 150);
  }

  deletePlannedPin(id) {
    const item = markerStore.getById(id);
    const pinName = item ? `${item.plannedEdition || item.edition || 'Pin'}: ${item.title}` : 'this pin';
    
    const confirmed = window.confirm(`Are you sure you want to delete planned pin "${pinName}"?\n\nThis will remove it from your curator map layer.`);
    if (!confirmed) return;

    markerStore.deletePlannedMarker(id);
    this.updateCuratorModeState();
    this.showToast(`🗑️ Deleted Planned Pin: ${pinName}`, 3500);
  }

  closePlannedModal() {
    const modal = document.getElementById('modal-planned-pin');
    const form = document.getElementById('form-planned-pin');
    const repickBanner = document.getElementById('repick-banner');
    const mapEl = document.getElementById('kenosha-map');

    kenoshaMap.isRepicking = false;
    kenoshaMap.onRepickCoordinate = null;
    if (mapEl) mapEl.classList.remove('crosshair-mode');
    if (repickBanner) repickBanner.style.display = 'none';

    if (modal) {
      modal.classList.remove('open');
      modal.classList.remove('picking-mode');
      modal.style.display = 'none';
    }
    if (form) form.reset();
  }

  async checkCuratorMode() {
    this.hasLocalPlannedData = false;

    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
    if (isLocalHost) {
      this.hasLocalPlannedData = true;
    }

    // Check if the local git-ignored planned-markers.js file exists on this local computer
    try {
      const module = await import('./planned-markers.js');
      if (module && Array.isArray(module.PLANNED_MARKERS)) {
        markerStore.setPlannedMarkers(module.PLANNED_MARKERS);
        this.hasLocalPlannedData = true;
      }
    } catch (e) {
      // File does not exist on public GitHub Pages (100% inaccessible to public)
      if (!isLocalHost) {
        this.hasLocalPlannedData = false;
      }
    }

    // Also check if user has local draft markers stored in localStorage
    const localStored = markerStore.loadLocalPlanned();
    if (localStored.length > 0) {
      this.hasLocalPlannedData = true;
      markerStore.setPlannedMarkers([]); // will merge localStored
    }

    const params = new URLSearchParams(window.location.search);
    const curatorParam = params.get('curator') || params.get('plan') || params.get('planner') || params.get('drafts');
    const isParamActive = curatorParam && (curatorParam.toLowerCase() === 'true' || curatorParam === '1');
    const storedSession = sessionStorage.getItem('wpa_curator_mode');

    // On local machine where planned-markers.js exists or local draft markers exist, enable curator mode by default or per toggle
    this.isCuratorMode = this.hasLocalPlannedData && (isLocalHost || isParamActive || storedSession === 'true' || storedSession === null);
  }

  toggleCuratorMode() {
    if (!this.hasLocalPlannedData) {
      this.showToast('Public Mode: No local planning file found.', 3000);
      return;
    }

    this.isCuratorMode = !this.isCuratorMode;
    sessionStorage.setItem('wpa_curator_mode', this.isCuratorMode ? 'true' : 'false');
    this.updateCuratorModeState();

    if (this.isCuratorMode) {
      this.showToast('🧭 Curator Mode ON: Private Planning Layer visible', 3500);
    } else {
      this.showToast('Curator Planning Layer Hidden', 3000);
    }
  }

  updateCuratorModeState() {
    const badge = document.getElementById('curator-mode-badge');
    if (badge) {
      badge.style.display = this.isCuratorMode ? 'inline-flex' : 'none';
    }

    if (this.isCuratorMode) {
      const plannedList = markerStore.getPlanned();
      kenoshaMap.renderPlannedMarkers(plannedList);
      kenoshaMap.setPlannedLayerVisibility(true);
    } else {
      kenoshaMap.setPlannedLayerVisibility(false);
    }
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
