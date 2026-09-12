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
    this.currentLightboxId = null;
    this.isCuratorMode = false;
    this.hasLocalPlannedData = false;
    this.currentMobileView = 'map';
    this._preloadedImages = new Set();
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

    // 6. Setup Animated Project Intro Splash Screen / Welcome Curtain
    this.setupIntroCurtain();

    // 7. Set initial mobile view (default to map view on small screens so map is immediately visible)
    if (window.innerWidth <= 900) {
      this.setMobileView('map');
    }

    // 8. Subscribe to data changes
    markerStore.subscribe(() => {
      this.refreshMarkers();
      if (this.isCuratorMode) {
        this.updateCuratorModeState();
      }
    });

    // 9. Check URL Deep-Link (#00, #01, ?edition=01, etc.)
    setTimeout(() => {
      this.checkUrlDeepLink();
    }, 250);

    window.addEventListener('hashchange', () => {
      this.checkUrlDeepLink();
    });

    // Automatically highlight the first marker after initial load if no deep link
    setTimeout(() => {
      if (!this.currentLightboxId && !window.location.hash) {
        const markers = markerStore.getAll();
        if (markers.length > 0) {
          this.selectedMarkerId = markers[0].id;
          kenoshaMap.highlightMarkerPin(markers[0].id);
        }
      }
    }, 450);
  }

  setupIntroCurtain() {
    const curtain = document.getElementById('wpa-intro-curtain');
    const exploreBtn = document.getElementById('btn-intro-explore');
    const closeBtn = document.getElementById('btn-intro-close');
    const substackBtn = document.getElementById('btn-intro-substack');
    const replayBtn = document.getElementById('btn-replay-intro');
    if (!curtain) return;

    let isDismissed = false;

    const dismissCurtain = () => {
      if (isDismissed) return;
      isDismissed = true;
      curtain.classList.add('fade-out');

      // Activate glowing pin beacons on the map to invite interaction
      setTimeout(() => {
        kenoshaMap.activatePinBeacons();
      }, 350);

      // Settle beacons automatically after 14 seconds if untouched
      setTimeout(() => {
        kenoshaMap.deactivatePinBeacons();
      }, 14000);
    };

    const showCurtain = () => {
      isDismissed = false;
      curtain.classList.remove('fade-out');
    };

    // The welcome folio stays open until the reader chooses to enter (reader-paced welcome mat)

    // Clicking the dark backdrop outside the card dismisses immediately
    curtain.addEventListener('click', (e) => {
      if (e.target === curtain) {
        dismissCurtain();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissCurtain();
      });
    }

    if (exploreBtn) {
      exploreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissCurtain();
      });
    }

    if (substackBtn) {
      substackBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Allow user to open Substack in new tab
      });
    }

    // Keyboard dismiss on Escape / Enter / Space
    window.addEventListener('keydown', (e) => {
      if (!isDismissed && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) {
        dismissCurtain();
      }
    });

    // Replay welcome folio anytime by clicking the WPA Seal logo badge in the header
    if (replayBtn) {
      replayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showCurtain();
      });
    }
  }

  setMobileView(view) {
    this.currentMobileView = view;
    const navMapBtn = document.getElementById('btn-mobile-view-map');
    const navIndexBtn = document.getElementById('btn-mobile-view-index');
    const sidebar = document.getElementById('wpa-sidebar');
    const backdrop = document.getElementById('wpa-sidebar-backdrop');
    const sidebarToggleBtn = document.getElementById('btn-toggle-sidebar');

    if (view === 'index') {
      if (navMapBtn) {
        navMapBtn.classList.remove('active');
        navMapBtn.setAttribute('aria-pressed', 'false');
      }
      if (navIndexBtn) {
        navIndexBtn.classList.add('active');
        navIndexBtn.setAttribute('aria-pressed', 'true');
      }
      if (sidebar) {
        sidebar.classList.add('mobile-open');
        sidebar.classList.remove('collapsed');
      }
      if (backdrop) {
        backdrop.classList.add('active');
      }
      if (sidebarToggleBtn) {
        sidebarToggleBtn.setAttribute('aria-expanded', 'true');
      }
    } else {
      // Map view
      if (navMapBtn) {
        navMapBtn.classList.add('active');
        navMapBtn.setAttribute('aria-pressed', 'true');
      }
      if (navIndexBtn) {
        navIndexBtn.classList.remove('active');
        navIndexBtn.setAttribute('aria-pressed', 'false');
      }
      if (sidebar) {
        sidebar.classList.remove('mobile-open');
      }
      if (backdrop) {
        backdrop.classList.remove('active');
      }
      if (sidebarToggleBtn) {
        sidebarToggleBtn.setAttribute('aria-expanded', 'false');
      }
    }

    // Trigger Leaflet viewport recalculation
    setTimeout(() => {
      if (kenoshaMap && kenoshaMap.map) {
        kenoshaMap.map.invalidateSize();
      }
    }, 280);
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
      const substackUrl = item.link || 'https://whereimaginationtakesflight.substack.com/s/greetings-from-kenosha';

      return `
        <article 
          class="wpa-toc-card ${isSelected ? 'active' : ''}" 
          data-id="${item.id}"
          tabindex="0"
          aria-label="Postcard ${item.edition}: ${item.title}"
        >
          <div class="wpa-toc-card-main">
            <div class="wpa-toc-card-visual">
              ${item.imageUrl ? `
                <div class="wpa-toc-thumb-wrap wpa-lightbox-trigger" data-id="${item.id}" title="Click to view full postcard artwork" role="button" tabindex="0">
                  <img src="${item.imageUrl}" onerror="this.onerror=null;this.src=this.src.includes('assets/')?this.src.replace('assets/',''):'./assets/'+this.src.split('/').pop();" alt="${item.title}" class="wpa-toc-thumb" loading="lazy" />
                  <span class="wpa-toc-badge-overlay">#${numOnly}</span>
                  <div class="wpa-toc-thumb-zoom-badge" aria-hidden="true">🔍 Zoom</div>
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
                ${item.year ? `<span class="wpa-toc-tag">Est. ${item.year}</span>` : ''}
              </div>
              <h4 class="wpa-toc-card-title">${item.title}</h4>
              <p class="wpa-toc-card-addr">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <span>${item.address}</span>
              </p>
              <p class="wpa-toc-card-snippet">${this.truncate(item.summary, 90)}</p>
            </div>
          </div>

          <div class="wpa-toc-card-actions">
            <button type="button" class="wpa-btn-card-map btn-card-fly" data-id="${item.id}" title="View ${item.title} on interactive map">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <polygon points="12 2 19 21 12 17 5 21 12 2"/>
              </svg>
              <span>View on Map</span>
            </button>
            <a class="wpa-btn-card-story" href="${substackUrl}" target="_blank" rel="noopener noreferrer" title="Read story on Substack (Opens in new tab)">
              <span>Read Story</span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </a>
          </div>
        </article>
      `;
    }).join('');

    // Attach click and touch handlers to cards
    tocListContainer.querySelectorAll('.wpa-toc-card').forEach(card => {
      const id = card.dataset.id;
      
      // Stop propagation on the Substack link so clicking it doesn't trigger card selection
      const storyLink = card.querySelector('.wpa-btn-card-story');
      if (storyLink) {
        storyLink.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      // Thumbnail click opens lightbox
      const thumb = card.querySelector('.wpa-toc-thumb-wrap');
      if (thumb) {
        thumb.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openPostcardLightbox(id);
        });
        thumb.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            this.openPostcardLightbox(id);
          }
        });
      }

      // Fly to map button
      const mapBtn = card.querySelector('.wpa-btn-card-map');
      if (mapBtn) {
        mapBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectMarker(id, true);
        });
      }

      // Card body click
      card.addEventListener('click', () => {
        this.selectMarker(id, true);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectMarker(id, true);
        }
      });

      // Bi-directional hover synchronization & background image preloading
      card.addEventListener('mouseenter', () => {
        const item = markerStore.getById(id);
        if (item && item.imageUrl) {
          this.preloadImage(item.imageUrl);
        }
        if (kenoshaMap) {
          kenoshaMap.highlightMarker(id, true);
        }
      });

      card.addEventListener('mouseleave', () => {
        if (kenoshaMap) {
          kenoshaMap.highlightMarker(id, false);
        }
      });
    });
  }

  selectMarker(id, zoomOnMap = true) {
    this.selectedMarkerId = id;
    
    // Deactivate inviting beacon glow once a landmark is selected
    if (kenoshaMap) {
      kenoshaMap.deactivatePinBeacons();
    }
    
    // Update TOC active state
    const list = document.getElementById('toc-marker-list');
    const listRect = list ? list.getBoundingClientRect() : null;
    document.querySelectorAll('.wpa-toc-card').forEach(c => {
      if (c.dataset.id === id) {
        c.classList.add('active');
        if (listRect) {
          const cardRect = c.getBoundingClientRect();
          const isFullyVisible = (cardRect.top >= listRect.top && cardRect.bottom <= listRect.bottom);
          if (!isFullyVisible) {
            c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      } else {
        c.classList.remove('active');
      }
    });

    // If on mobile/tablet and focusing on map, close drawer and switch view to map
    if (window.innerWidth <= 900 && zoomOnMap) {
      this.setMobileView('map');
    }

    // Trigger map focus
    if (zoomOnMap) {
      kenoshaMap.focusMarker(id);
    } else {
      kenoshaMap.highlightMarkerPin(id);
    }
  }

  updateStats() {
    const all = markerStore.getAll();
    const countEl = document.getElementById('stat-total-cards');
    const mobileCountEl = document.getElementById('mobile-stat-total-cards');
    if (countEl) countEl.textContent = all.length;
    if (mobileCountEl) mobileCountEl.textContent = all.length;
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

    // Mobile View Switcher Buttons
    const btnMobileMap = document.getElementById('btn-mobile-view-map');
    const btnMobileIndex = document.getElementById('btn-mobile-view-index');
    const btnCloseMobileSidebar = document.getElementById('btn-close-sidebar-mobile');
    const sidebarBackdrop = document.getElementById('wpa-sidebar-backdrop');

    if (btnMobileMap) {
      btnMobileMap.addEventListener('click', () => {
        this.setMobileView('map');
      });
    }

    if (btnMobileIndex) {
      btnMobileIndex.addEventListener('click', () => {
        this.setMobileView('index');
      });
    }

    if (btnCloseMobileSidebar) {
      btnCloseMobileSidebar.addEventListener('click', () => {
        this.setMobileView('map');
      });
    }

    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', () => {
        this.setMobileView('map');
      });
    }

    // Sidebar Toggle
    const sidebarToggleBtn = document.getElementById('btn-toggle-sidebar');
    const sidebar = document.getElementById('wpa-sidebar');
    if (sidebarToggleBtn && sidebar) {
      sidebarToggleBtn.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          const isOpen = sidebar.classList.contains('mobile-open');
          this.setMobileView(isOpen ? 'map' : 'index');
        } else {
          sidebar.classList.toggle('collapsed');
          const isCollapsed = sidebar.classList.contains('collapsed');
          sidebarToggleBtn.setAttribute('aria-expanded', !isCollapsed);
          setTimeout(() => {
            kenoshaMap.map.invalidateSize();
          }, 300);
        }
      });
    }

    // Window Resize Handler to handle mobile/desktop layout transitions
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
        if (sidebar) sidebar.classList.remove('mobile-open');
      } else {
        // Synchronize mobile switcher buttons
        if (this.currentMobileView === 'index') {
          if (sidebar) sidebar.classList.add('mobile-open');
          if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
        } else {
          if (sidebar) sidebar.classList.remove('mobile-open');
          if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
        }
      }
      setTimeout(() => {
        if (kenoshaMap && kenoshaMap.map) {
          kenoshaMap.map.invalidateSize();
        }
      }, 250);
    });

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

    // Curator Drafts Backup & Export Modal Controls
    const openDraftsBtn = document.getElementById('btn-open-drafts-modal');
    const closeDraftsBtn = document.getElementById('btn-close-export-modal');
    const closeDraftsDoneBtn = document.getElementById('btn-close-export-done');
    const downloadPlannedBtn = document.getElementById('btn-download-planned-js');
    const copyDraftsBtn = document.getElementById('btn-copy-drafts-json');
    const importDraftsBtn = document.getElementById('btn-import-drafts');

    if (openDraftsBtn) {
      openDraftsBtn.addEventListener('click', () => this.openDraftsExportModal());
    }
    if (closeDraftsBtn) {
      closeDraftsBtn.addEventListener('click', () => this.closeDraftsExportModal());
    }
    if (closeDraftsDoneBtn) {
      closeDraftsDoneBtn.addEventListener('click', () => this.closeDraftsExportModal());
    }
    if (downloadPlannedBtn) {
      downloadPlannedBtn.addEventListener('click', () => this.downloadPlannedMarkersFile());
    }
    if (copyDraftsBtn) {
      copyDraftsBtn.addEventListener('click', () => this.copyDraftsToClipboard());
    }
    if (importDraftsBtn) {
      importDraftsBtn.addEventListener('click', () => this.importDraftsFromTextarea());
    }

    // Postcard Artwork Lightbox Controls
    const closeLightboxBtn = document.getElementById('btn-close-lightbox');
    const flipLightboxBtn = document.getElementById('btn-lightbox-flip');
    const lightboxModal = document.getElementById('modal-postcard-lightbox');
    const imgStage = document.getElementById('lightbox-image-stage');
    const lightboxImg = document.getElementById('lightbox-img');
    const zoomHint = document.getElementById('lightbox-zoom-hint');

    if (closeLightboxBtn) {
      closeLightboxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closePostcardLightbox();
      });
    }
    if (flipLightboxBtn) {
      flipLightboxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePostcardFlip();
      });
    }
    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('wpa-lightbox-container')) {
          this.closePostcardLightbox();
        }
      });
    }

    // Interactive Image Stage Zoom & Pan on desktop
    if (imgStage && lightboxImg) {
      imgStage.addEventListener('click', (e) => {
        e.stopPropagation();
        const flipper = document.getElementById('lightbox-postcard-flipper');
        if (flipper && flipper.classList.contains('is-flipped')) {
          // If back is showing, clicking stage flips back to front
          this.togglePostcardFlip();
          return;
        }

        const isInspecting = imgStage.classList.toggle('inspecting');
        if (zoomHint) {
          zoomHint.innerHTML = isInspecting
            ? `<span>Click to Zoom Out</span>`
            : `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z"/></svg><span>Click to Zoom Artwork</span>`;
        }
        if (!isInspecting) {
          lightboxImg.style.transformOrigin = 'center center';
        }
      });

      imgStage.addEventListener('mousemove', (e) => {
        if (imgStage.classList.contains('inspecting')) {
          const rect = imgStage.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          lightboxImg.style.transformOrigin = `${x}% ${y}%`;
        }
      });
    }

    // Global keyboard listener for Power Navigation (/, Esc, Left/Right, F, M, L, Shift+P)
    document.addEventListener('keydown', (e) => this.handleGlobalKeyDown(e));

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
        const imageUrl = document.getElementById('planned-input-image')?.value.trim() || '';
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
            imageUrl,
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
            imageUrl,
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
          this.showToast(`✏️ Updated Planned Pin: ${savedItem ? savedItem.plannedEdition : edition}: ${title}!`, 4000);
        } else {
          this.showToast(`📝 Placed Planned Pin: ${savedItem ? savedItem.plannedEdition : edition}: ${title}!`, 4000);
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
        const edition = repickLiveBtn.dataset.edition || 'Marker';
        if (id) {
          this.startRepickingLiveMarker(id, edition);
        }
      }

      // Postcard Photo Lightbox Inspection Trigger
      const lightboxTrigger = e.target.closest('.wpa-lightbox-trigger') || e.target.closest('.wpa-postcard-photo-frame');
      if (lightboxTrigger) {
        e.preventDefault();
        e.stopPropagation();
        const id = lightboxTrigger.dataset.id || this.selectedMarkerId || kenoshaMap.activeMarkerId;
        if (id) {
          this.openPostcardLightbox(id);
        }
      }
    });

    // Callback when any point is pinned or right-clicked
    kenoshaMap.onSurveyorCopied = (lat, lng) => {
      this.showToast(`📍 Copied coordinates: ${lat}, ${lng}`, 3500);
    };
  }

  startRepickingLiveMarker(id, edition) {
    const item = markerStore.getById(id);
    if (!item) return;

    kenoshaMap.markerMap.get(id)?.closePopup();

    const repickBanner = document.getElementById('repick-banner');
    const bannerText = repickBanner?.querySelector('span');
    if (bannerText) {
      bannerText.innerHTML = `<strong>Repositioning ${edition}:</strong> Click on map to place ${item.title} at new spot.`;
    }
    if (repickBanner) repickBanner.style.display = 'flex';

    kenoshaMap.isRepicking = true;
    const mapEl = document.getElementById('kenosha-map');
    if (mapEl) mapEl.classList.add('crosshair-mode');

    kenoshaMap.onRepickCoordinate = (lat, lng) => {
      kenoshaMap.isRepicking = false;
      if (mapEl) mapEl.classList.remove('crosshair-mode');
      if (repickBanner) repickBanner.style.display = 'none';

      markerStore.updateMarkerCoordinates(id, lat, lng);
      kenoshaMap.renderMarkers(markerStore.getAll(), (mid) => this.selectMarker(mid, true));

      setTimeout(() => {
        kenoshaMap.focusMarker(id, 16);
      }, 350);

      const latFormatted = lat.toFixed(7);
      const lngFormatted = lng.toFixed(7);

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(`${latFormatted}, ${lngFormatted}`).catch(() => {});
      }

      this.showToast(`✓ Repositioned ${edition} to ${latFormatted}, ${lngFormatted}! (Coordinates copied to clipboard)`, 5000);
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
    const imageInput = document.getElementById('planned-input-image');
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
    const formattedNum = String(nextNum).padStart(2, '0');
    if (editionInput) {
      editionInput.value = `No. ${formattedNum}`;
    }
    if (imageInput) {
      imageInput.value = `./card-${formattedNum}.jpg`;
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
    const imageInput = document.getElementById('planned-input-image');
    const notesInput = document.getElementById('planned-input-notes');

    if (!modal) return;

    if (idInput) idInput.value = item.id;
    if (modalTitle) modalTitle.textContent = `✏️ EDIT PLANNED PIN • ${item.plannedEdition || item.edition || ''}`;
    if (saveBtn) saveBtn.textContent = 'Update Planned Pin';

    if (editionInput) editionInput.value = item.plannedEdition || item.edition || '';
    if (statusSelect) statusSelect.value = item.status || 'Researching';
    if (titleInput) titleInput.value = item.title || '';
    if (addressInput) addressInput.value = item.address || '';
    if (imageInput) imageInput.value = item.imageUrl || '';
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

  openDraftsExportModal() {
    const modal = document.getElementById('modal-curator-export');
    const countEl = document.getElementById('curator-export-count');
    const textarea = document.getElementById('curator-drafts-textarea');
    if (!modal) return;

    const planned = markerStore.getPlanned();
    if (countEl) {
      countEl.textContent = `${planned.length} draft planned pin${planned.length === 1 ? '' : 's'}`;
    }
    if (textarea) {
      textarea.value = markerStore.exportPlannedMarkersFileContent();
    }

    modal.classList.add('open');
    modal.style.display = 'flex';
  }

  closeDraftsExportModal() {
    const modal = document.getElementById('modal-curator-export');
    if (modal) {
      modal.classList.remove('open');
      modal.style.display = 'none';
    }
  }

  downloadPlannedMarkersFile() {
    const fileContent = markerStore.exportPlannedMarkersFileContent();
    const blob = new Blob([fileContent], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'planned-markers.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.showToast('📥 Downloaded planned-markers.js! Replace your project file with this.', 4500);
  }

  copyDraftsToClipboard() {
    const fileContent = markerStore.exportPlannedMarkersFileContent();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fileContent)
        .then(() => {
          this.showToast('📋 Copied planned-markers.js code to clipboard!', 3500);
        })
        .catch(() => {
          this.showToast('Could not copy automatically. Select and copy from the text box.', 3500);
        });
    }
  }

  importDraftsFromTextarea() {
    const textarea = document.getElementById('curator-drafts-textarea');
    if (!textarea || !textarea.value.trim()) {
      alert('Please paste draft JSON or JS code into the text area.');
      return;
    }

    const res = markerStore.importPlannedMarkers(textarea.value.trim());
    if (res.success) {
      this.isCuratorMode = true;
      sessionStorage.setItem('wpa_curator_mode', 'true');
      this.updateCuratorModeState();
      this.closeDraftsExportModal();
      this.showToast(`✓ Successfully imported ${res.count} draft pins! Total now: ${res.total}`, 4500);
    } else {
      alert(`Import Failed: ${res.error || 'Please check data format.'}`);
    }
  }

  openPostcardLightbox(markerId) {
    const item = markerStore.getById(markerId);
    if (!item) return;

    const modal = document.getElementById('modal-postcard-lightbox');
    const img = document.getElementById('lightbox-img');
    const editionBadge = document.getElementById('lightbox-edition-badge');
    const statusBadge = document.getElementById('lightbox-status-badge');
    const titleEl = document.getElementById('lightbox-card-title');
    const addressEl = document.getElementById('lightbox-card-address');
    const coordsEl = document.getElementById('lightbox-coords');
    const substackLink = document.getElementById('lightbox-substack-link');

    // Postcard Back Elements
    const flipper = document.getElementById('lightbox-postcard-flipper');
    const flipBtnText = document.getElementById('lightbox-flip-btn-text');
    const backNotesEl = document.getElementById('lightbox-back-notes');
    const backTitleEl = document.getElementById('lightbox-back-title');
    const backAddressEl = document.getElementById('lightbox-back-address');
    const backCoordsEl = document.getElementById('lightbox-back-coords');
    const backArtistEl = document.getElementById('lightbox-back-artist');
    const backEraEl = document.getElementById('lightbox-back-era');
    const backSerialEl = document.getElementById('lightbox-back-serial');
    const backPostmarkDateEl = document.getElementById('lightbox-back-postmark-date');

    if (!modal) return;

    this.currentLightboxId = markerId;

    // Reset flipper to front side on new card load
    if (flipper) {
      flipper.classList.remove('is-flipped');
    }
    if (flipBtnText) {
      flipBtnText.textContent = 'Postcard Back ⟲';
    }

    const edition = item.edition || item.plannedEdition || 'Edition';
    const title = item.title || 'Untitled Kenosha Postcard';
    const address = item.address || 'Kenosha, WI';
    const notes = item.summary || item.notes || 'No notes or story recorded for this landmark yet.';
    const status = item.status || (item.isDefault ? 'Published Edition' : 'In Progress');
    const imageUrl = item.imageUrl || './card-00.jpg';

    // Populate Front Artwork
    if (img) {
      img.src = imageUrl;
      img.alt = `${edition}: ${title}`;
      img.style.transformOrigin = 'center center';
      img.onerror = () => {
        img.onerror = null;
        img.src = imageUrl.includes('assets/') ? imageUrl.replace('assets/', '') : `./assets/${imageUrl.split('/').pop()}`;
      };
    }

    const imgStage = document.getElementById('lightbox-image-stage');
    const zoomHint = document.getElementById('lightbox-zoom-hint');
    if (imgStage) {
      imgStage.classList.remove('inspecting');
    }
    if (zoomHint) {
      zoomHint.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z"/></svg><span>Click to Zoom Artwork</span>`;
    }

    if (editionBadge) editionBadge.textContent = edition;
    if (statusBadge) statusBadge.textContent = status;
    if (titleEl) titleEl.textContent = title;
    if (addressEl) addressEl.textContent = address;

    const formattedCoords = (typeof item.lat === 'number' && typeof item.lng === 'number')
      ? `${item.lat.toFixed(5)}, ${item.lng.toFixed(5)}`
      : '42.5841, -87.8188';

    if (coordsEl) {
      coordsEl.textContent = `📍 ${formattedCoords}`;
    }

    // Populate Back Linen Postcard Elements
    if (backNotesEl) backNotesEl.textContent = notes;
    if (backTitleEl) backTitleEl.textContent = title;
    if (backAddressEl) backAddressEl.textContent = address;
    if (backCoordsEl) backCoordsEl.textContent = `📍 ${formattedCoords}`;
    if (backArtistEl) backArtistEl.textContent = `Artist: ${item.artist || 'Todd Burleson'}`;
    if (backEraEl) backEraEl.textContent = item.year ? `Era: Est. ${item.year}` : 'Era: Historic Downtown';
    if (backSerialEl) backSerialEl.textContent = `SERIES 1930s • ${edition.toUpperCase()}`;
    if (backPostmarkDateEl) {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const now = new Date();
      backPostmarkDateEl.textContent = `${months[now.getMonth()]} ${now.getDate()}`;
    }

    if (substackLink) {
      if (item.link && item.link !== '#' && !item.link.startsWith('javascript')) {
        substackLink.href = item.link;
        substackLink.style.display = 'inline-flex';
      } else {
        substackLink.style.display = 'none';
      }
    }

    // Update Deep Link URL Hash without reload
    try {
      history.replaceState(null, null, '#' + item.id);
    } catch (e) {}

    // Preload adjacent images for zero-lag cycling
    this.preloadAdjacentPostcards(markerId);

    modal.classList.add('open');
    modal.style.display = 'flex';
  }

  closePostcardLightbox() {
    const modal = document.getElementById('modal-postcard-lightbox');
    const imgStage = document.getElementById('lightbox-image-stage');
    const img = document.getElementById('lightbox-img');
    const flipper = document.getElementById('lightbox-postcard-flipper');

    if (imgStage) {
      imgStage.classList.remove('inspecting');
    }
    if (img) {
      img.style.transformOrigin = 'center center';
    }
    if (flipper) {
      flipper.classList.remove('is-flipped');
    }
    if (modal) {
      modal.classList.remove('open');
      modal.style.display = 'none';
    }
    this.currentLightboxId = null;

    // Clean up hash if closed
    if (window.location.hash) {
      try {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      } catch (e) {}
    }
  }

  togglePostcardFlip() {
    const flipper = document.getElementById('lightbox-postcard-flipper');
    const flipBtnText = document.getElementById('lightbox-flip-btn-text');
    const imgStage = document.getElementById('lightbox-image-stage');
    if (!flipper) return;

    if (imgStage) {
      imgStage.classList.remove('inspecting');
    }

    const isFlipped = flipper.classList.toggle('is-flipped');
    if (flipBtnText) {
      flipBtnText.textContent = isFlipped ? 'View Artwork ⟳' : 'Postcard Back ⟲';
    }
  }

  copyCurrentPostcardLink() {
    if (!this.currentLightboxId) return;
    const item = markerStore.getById(this.currentLightboxId);
    if (!item) return;

    const url = `${window.location.origin}${window.location.pathname}#${item.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => {
          this.showToast(`✓ Postcard link copied to clipboard!`, 3500);
        })
        .catch(() => {
          prompt('Copy direct link to this postcard:', url);
        });
    } else {
      prompt('Copy direct link to this postcard:', url);
    }
  }

  navigateLightbox(direction) {
    if (!this.currentLightboxId) return;

    const allMarkers = markerStore.getAll(this.isCuratorMode);
    if (!allMarkers || allMarkers.length === 0) return;

    const currentIndex = allMarkers.findIndex(m => m.id === this.currentLightboxId);
    let nextIndex = 0;
    if (currentIndex !== -1) {
      nextIndex = (currentIndex + direction + allMarkers.length) % allMarkers.length;
    }

    const nextMarker = allMarkers[nextIndex];
    if (nextMarker) {
      this.openPostcardLightbox(nextMarker.id);
    }
  }

  checkUrlDeepLink() {
    const hash = window.location.hash.replace('#', '').trim();
    const params = new URLSearchParams(window.location.search);
    const cardParam = params.get('card') || params.get('edition') || params.get('id') || hash;
    if (!cardParam) return;

    const all = markerStore.getAll(true);
    const found = all.find(m => {
      if (m.id === cardParam) return true;
      const cleanParam = cardParam.replace(/\D/g, '');
      const mNum = String(m.editionNum || '').replace(/\D/g, '') || String(m.edition || '').replace(/\D/g, '');
      if (cleanParam && mNum && parseInt(cleanParam, 10) === parseInt(mNum, 10)) return true;
      return m.title && m.title.toLowerCase().includes(cardParam.toLowerCase());
    });

    if (found) {
      // Dismiss intro prologue curtain if open
      const curtain = document.getElementById('wpa-intro-curtain');
      if (curtain && !curtain.classList.contains('fade-out')) {
        curtain.classList.add('fade-out');
        setTimeout(() => { curtain.style.display = 'none'; }, 700);
      }
      this.selectMarker(found.id, true);
      setTimeout(() => {
        this.openPostcardLightbox(found.id);
      }, 350);
    }
  }

  highlightTocCard(id, isHovered) {
    const list = document.getElementById('toc-marker-list');
    if (!list) return;
    const listRect = list.getBoundingClientRect();
    const cards = list.querySelectorAll('.wpa-toc-card');
    cards.forEach(c => {
      if (c.dataset.id === id) {
        c.classList.toggle('wpa-card-marker-highlight', isHovered);
        if (isHovered) {
          const cardRect = c.getBoundingClientRect();
          const isFullyVisible = (cardRect.top >= listRect.top && cardRect.bottom <= listRect.bottom);
          if (!isFullyVisible) {
            c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      } else {
        c.classList.remove('wpa-card-marker-highlight');
      }
    });
  }

  preloadImage(url) {
    if (!url || this._preloadedImages.has(url)) return;
    const img = new Image();
    img.src = url;
    this._preloadedImages.add(url);
  }

  preloadAdjacentPostcards(currentId) {
    const allMarkers = markerStore.getAll(this.isCuratorMode);
    const idx = allMarkers.findIndex(m => m.id === currentId);
    if (idx === -1) return;
    const prevIdx = (idx - 1 + allMarkers.length) % allMarkers.length;
    const nextIdx = (idx + 1) % allMarkers.length;
    if (allMarkers[prevIdx]?.imageUrl) this.preloadImage(allMarkers[prevIdx].imageUrl);
    if (allMarkers[nextIdx]?.imageUrl) this.preloadImage(allMarkers[nextIdx].imageUrl);
  }

  handleGlobalKeyDown(e) {
    const activeTag = document.activeElement?.tagName;
    const isInputActive = ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag);

    // When lightbox is open
    if (this.currentLightboxId) {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closePostcardLightbox();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.navigateLightbox(-1);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.navigateLightbox(1);
        return;
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        this.togglePostcardFlip();
        return;
      }
      return;
    }

    if (isInputActive) {
      if (e.key === 'Escape') {
        document.activeElement.blur();
      }
      return;
    }

    // Global Shortcuts
    if (e.key === '/' || e.key === 's' || e.key === 'S') {
      e.preventDefault();
      const searchInput = document.getElementById('toc-search-input');
      const sidebar = document.getElementById('wpa-sidebar');
      if (sidebar && !sidebar.classList.contains('mobile-open') && window.innerWidth <= 900) {
        sidebar.classList.add('mobile-open');
      }
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
      return;
    }

    if (e.key === 'Escape') {
      const curtain = document.getElementById('wpa-intro-curtain');
      if (curtain && !curtain.classList.contains('fade-out')) {
        curtain.classList.add('fade-out');
        setTimeout(() => { curtain.style.display = 'none'; }, 700);
      }
      const sidebar = document.getElementById('wpa-sidebar');
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
      }
      return;
    }

    if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      const sidebar = document.getElementById('wpa-sidebar');
      if (sidebar && window.innerWidth <= 900) {
        sidebar.classList.toggle('mobile-open');
      }
      return;
    }

    if (e.key === 'l' || e.key === 'L') {
      e.preventDefault();
      const locateBtn = document.getElementById('btn-locate-me');
      if (locateBtn) locateBtn.click();
      return;
    }

    if (e.shiftKey && (e.key === 'P' || e.key === 'p' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      this.toggleCuratorMode();
    }
  }

  async checkCuratorMode() {
    this.hasLocalPlannedData = false;

    // 1. Load directly from browser localStorage
    const localStored = markerStore.loadLocalPlanned();
    if (localStored && localStored.length > 0) {
      this.hasLocalPlannedData = true;
      markerStore.setPlannedMarkers(localStored);
    }

    // 2. Try loading from planned-markers.js if present
    try {
      const module = await import('./planned-markers.js?t=' + Date.now());
      if (module && Array.isArray(module.PLANNED_MARKERS) && module.PLANNED_MARKERS.length > 0) {
        markerStore.setPlannedMarkers(module.PLANNED_MARKERS);
        this.hasLocalPlannedData = true;
      }
    } catch (e) {
      // Ignored if file not present or empty
    }

    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
    const params = new URLSearchParams(window.location.search);
    const curatorParam = params.get('curator') || params.get('plan') || params.get('planner') || params.get('drafts');
    const isParamActive = curatorParam && (curatorParam.toLowerCase() === 'true' || curatorParam === '1');
    const storedSession = sessionStorage.getItem('wpa_curator_mode');

    // If local draft pins exist, or on localhost, or parameter active:
    if (this.hasLocalPlannedData || isLocalHost || isParamActive) {
      // Default to ON unless explicitly toggled off in this session
      this.isCuratorMode = (storedSession !== 'false');
    } else {
      this.isCuratorMode = (storedSession === 'true');
    }
  }

  toggleCuratorMode() {
    this.isCuratorMode = !this.isCuratorMode;
    sessionStorage.setItem('wpa_curator_mode', this.isCuratorMode ? 'true' : 'false');
    this.updateCuratorModeState();

    if (this.isCuratorMode) {
      const count = markerStore.getPlanned().length;
      this.showToast(`🧭 Curator Layer Visible (${count} draft pins)`, 3500);
    } else {
      this.showToast('Curator Planning Layer Hidden', 3000);
    }
  }

  updateCuratorModeState() {
    const badge = document.getElementById('curator-mode-badge');
    const countEl = document.getElementById('curator-drafts-count');
    const backupBtn = document.getElementById('btn-open-drafts-modal');
    const plannedList = markerStore.getPlanned();

    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
    const shouldShowCuratorControls = this.isCuratorMode || this.hasLocalPlannedData || isLocalHost || (sessionStorage.getItem('wpa_curator_mode') !== null);

    if (badge) {
      badge.style.display = shouldShowCuratorControls ? 'inline-flex' : 'none';
      badge.classList.toggle('active', this.isCuratorMode);
      badge.classList.toggle('inactive', !this.isCuratorMode);
      if (countEl) {
        countEl.textContent = plannedList.length > 0 ? `(${plannedList.length})` : '';
      }
    }

    if (backupBtn) {
      backupBtn.style.display = (shouldShowCuratorControls && plannedList.length > 0) ? 'inline-flex' : 'none';
    }

    if (this.isCuratorMode) {
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
