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
  }

  init() {
    // 1. Initialize Leaflet Map
    kenoshaMap.init('kenosha-map');

    // 2. Render initial markers
    this.refreshMarkers();

    // 3. Setup event listeners & Surveyor Tool
    this.setupEventListeners();

    // 4. Subscribe to data changes
    markerStore.subscribe(() => {
      this.refreshMarkers();
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

    // Callback when any point is pinned or right-clicked
    kenoshaMap.onSurveyorCopied = (lat, lng) => {
      this.showToast(`📍 Copied coordinates: ${lat}, ${lng}`, 3500);
    };
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
