/**
 * Leaflet Map Controller for Greetings From Kenosha
 * 1930s WPA Poster Aesthetic, Custom Vintage Pins & Postcard Popups
 */

import { KENOSHA_BOUNDS, KENOSHA_PARKS_GEOJSON, KENOSHA_BOUNDING_LINES } from './kenosha-geo.js';

class KenoshaMap {
  constructor() {
    this.map = null;
    this.markersLayer = null;
    this.plannedPinsLayer = null;
    this.parksLayer = null;
    this.boundariesLayer = null;
    this.baseTileLayer = null;
    this.markerMap = new Map(); // id -> L.Marker
    this.plannedMap = new Map(); // id -> L.Marker
    this.activeMarkerId = null;
    this.isSurveyorMode = false;
    this.isRepicking = false;
    this.onRepickCoordinate = null;
    this.surveyorMarker = null;
    this.onSurveyorCopied = null;
    this.currentTheme = 'wpa-poster';
  }

  init(containerId = 'kenosha-map') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Leaflet map initialization with smooth half-step zoom controls
    this.map = L.map(containerId, {
      center: KENOSHA_BOUNDS.center,
      zoom: 14,
      minZoom: 12,
      maxZoom: 18,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 90,
      zoomControl: false,
      attributionControl: false
    });

    // Set initial bounding box strictly according to specifications
    const initialBounds = L.latLngBounds(KENOSHA_BOUNDS.getLeafletBounds());
    this.map.fitBounds(initialBounds, {
      padding: [40, 40],
      maxZoom: 15
    });

    // Soft max bounds to keep focus on Downtown Kenosha
    this.map.setMaxBounds(L.latLngBounds(KENOSHA_BOUNDS.getMaxBounds()));

    // Custom attribution control (WPA styled)
    L.control.attribution({
      position: 'bottomright',
      prefix: '<span class="wpa-attribution">Historic Kenosha WPA Atlas &copy; <a href="https://leafletjs.com/" target="_blank">Leaflet</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a></span>'
    }).addTo(this.map);

    // Custom WPA Zoom Controls
    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);

    // Add Tile Layers (OSM natural vector rendering with WPA color styling)
    this.setBaseTheme(this.currentTheme);

    // Marker Layer Group (Public Live Postcards)
    this.markersLayer = L.layerGroup().addTo(this.map);

    // Planned Pins Layer Group (Private Curator Layer)
    this.plannedPinsLayer = L.layerGroup();

    // Right-Click (or Long-Press) anywhere on map to drop surveyor pin & copy coordinates
    this.map.on('contextmenu', (e) => {
      this.dropSurveyorPin(e.latlng.lat, e.latlng.lng, true);
    });

    // Left-Click when in Repick Mode or Surveyor Mode
    this.map.on('click', (e) => {
      if (this.isRepicking && typeof this.onRepickCoordinate === 'function') {
        this.onRepickCoordinate(e.latlng.lat, e.latlng.lng);
        return;
      }
      if (this.isSurveyorMode) {
        this.dropSurveyorPin(e.latlng.lat, e.latlng.lng, true);
      }
    });

    return this;
  }

  setBaseTheme(theme) {
    this.currentTheme = theme;
    const mapElement = document.getElementById('kenosha-map');
    if (mapElement) {
      mapElement.classList.remove('theme-wpa-poster', 'theme-wpa-litho', 'theme-wpa-sepia', 'theme-wpa-night');
      mapElement.classList.add(`theme-${theme}`);
    }

    if (this.baseTileLayer) {
      this.map.removeLayer(this.baseTileLayer);
    }

    // 100% Open & Free Tile Layer (No API Key Required)
    const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    this.baseTileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      className: 'wpa-basemap-tiles'
    }).addTo(this.map);
  }

  resetBounds() {
    const initialBounds = L.latLngBounds(KENOSHA_BOUNDS.getLeafletBounds());
    this.map.fitBounds(initialBounds, {
      padding: [40, 40],
      duration: 1.2,
      easeLinearity: 0.25
    });
  }

  renderMarkers(markers, onSelectMarker = null) {
    this.markersLayer.clearLayers();
    this.markerMap.clear();

    markers.forEach((markerData) => {
      const customIcon = this.createCustomMarkerIcon(markerData);

      const marker = L.marker([markerData.lat, markerData.lng], {
        icon: customIcon,
        title: markerData.title,
        riseOnHover: true,
        alt: `${markerData.edition}: ${markerData.title}`
      });

      const popupContent = this.createPostcardPopupHTML(markerData);
      marker.bindPopup(popupContent, {
        className: 'wpa-postcard-popup',
        maxWidth: 295,
        minWidth: 240,
        autoPanPaddingTopLeft: [25, 95],
        autoPanPaddingBottomRight: [25, 30],
        closeButton: true
      });

      marker.on('click', () => {
        this.activeMarkerId = markerData.id;
        if (typeof onSelectMarker === 'function') {
          onSelectMarker(markerData.id);
        }
      });

      marker.addTo(this.markersLayer);
      this.markerMap.set(markerData.id, marker);
    });
  }

  createCustomMarkerIcon(markerData) {
    const edition = markerData.edition || 'No. 00';
    const digits = edition.replace(/\D/g, '');
    const numOnly = digits !== '' ? digits : '00';

    const iconHtml = `
      <div class="wpa-pin-wrapper" data-id="${markerData.id}">
        <div class="wpa-pin-head">
          <div class="wpa-pin-inner">
            <span class="wpa-pin-no">#</span>
            <span class="wpa-pin-edition">${numOnly}</span>
          </div>
        </div>
        <div class="wpa-pin-stem"></div>
        <div class="wpa-pin-shadow"></div>
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: 'wpa-custom-pin-container',
      iconSize: [40, 48],
      iconAnchor: [20, 48],
      popupAnchor: [0, -44]
    });
  }

  createPostcardPopupHTML(data) {
    const edition = data.edition || 'No. 01';
    const title = data.title || 'Untitled Kenosha Postcard';
    const address = data.address || 'Kenosha, WI';
    const summary = data.summary || '';
    const link = data.link || '#';
    const year = data.year ? `<span class="wpa-meta-pill">Est. ${data.year}</span>` : '';
    const artist = data.artist ? `<span class="wpa-meta-pill">Artist: ${data.artist}</span>` : '';

    return `
      <article class="wpa-postcard" role="region" aria-label="Postcard: ${title}">
        <!-- Airmail decorative edge -->
        <div class="wpa-postcard-airmail-border" aria-hidden="true"></div>
        
        <div class="wpa-postcard-header">
          <div class="wpa-postcard-brand">
            <span class="wpa-postmark-kicker">WPA POSTCARD SERIES</span>
            <span class="wpa-edition-badge">${edition}</span>
          </div>
          <div class="wpa-stamp-box" aria-hidden="true">
            <div class="wpa-stamp-inner">
              <span class="wpa-stamp-text">KENOSHA</span>
              <span class="wpa-stamp-price">3¢</span>
              <span class="wpa-stamp-state">WIS.</span>
            </div>
            <div class="wpa-postmark-stamp">
              <svg viewBox="0 0 100 100" class="wpa-postmark-svg">
                <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="4 2"/>
                <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" stroke-width="1"/>
                <path id="postmark-text-path-${data.id}" d="M 20,50 A 30,30 0 0,1 80,50" fill="none"/>
                <text font-size="8" font-weight="700" letter-spacing="1">
                  <textPath href="#postmark-text-path-${data.id}" startOffset="50%" text-anchor="middle">
                    KENOSHA, WI
                  </textPath>
                </text>
                <text x="50" y="54" font-size="7" font-weight="bold" text-anchor="middle">POSTMARK</text>
                <text x="50" y="64" font-size="6" text-anchor="middle">HISTORIC</text>
              </svg>
            </div>
          </div>
        </div>

        <div class="wpa-postcard-content">
          ${data.imageUrl ? `
            <div class="wpa-postcard-photo-frame">
              <img src="${data.imageUrl}" onerror="this.onerror=null;this.src=this.src.includes('assets/')?this.src.replace('assets/',''):'./assets/'+this.src.split('/').pop();" alt="${title}" class="wpa-postcard-img" loading="lazy" />
              <div class="wpa-postcard-photo-caption">Historic Kenosha Edition</div>
            </div>
          ` : ''}

          <h3 class="wpa-postcard-title">${title}</h3>
          
          <div class="wpa-postcard-location">
            <svg class="wpa-icon-pin" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>${address}</span>
          </div>

          ${(year || artist) ? `<div class="wpa-meta-pill">${year}${artist}</div>` : ''}

          <p class="wpa-postcard-summary">${summary}</p>
        </div>

        <div class="wpa-postcard-footer">
          <a href="${link}" target="_blank" rel="noopener noreferrer" class="wpa-btn-readmore" id="postcard-link-${data.id}">
            <span>Read More</span>
            <svg class="wpa-arrow-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
          <div class="wpa-postcard-coords" title="Geographic Coordinates">
            <span>${data.lat.toFixed(5)}° N, ${Math.abs(data.lng).toFixed(5)}° W</span>
          </div>
        </div>
      </article>
    `;
  }

  renderPlannedMarkers(plannedList) {
    this.plannedPinsLayer.clearLayers();
    this.plannedMap.clear();

    if (!Array.isArray(plannedList) || plannedList.length === 0) return;

    plannedList.forEach((item) => {
      const customIcon = this.createPlannedMarkerIcon(item);

      const marker = L.marker([item.lat, item.lng], {
        icon: customIcon,
        title: `Curator Draft: ${item.title}`,
        riseOnHover: true,
        alt: `${item.plannedEdition || 'Draft'}: ${item.title}`
      });

      const popupContent = this.createFieldNotePopupHTML(item);
      marker.bindPopup(popupContent, {
        className: 'wpa-field-note-popup',
        maxWidth: 320,
        minWidth: 260,
        autoPanPaddingTopLeft: [25, 95],
        autoPanPaddingBottomRight: [25, 30],
        closeButton: true
      });

      marker.on('popupopen', () => {
        const popupNode = marker.getPopup().getElement();
        if (!popupNode) return;

        const editBtn = popupNode.querySelector('.wpa-btn-field-edit');
        const deleteBtn = popupNode.querySelector('.wpa-btn-field-delete');

        if (editBtn) {
          editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            marker.closePopup();
            if (window.__greetingsApp && typeof window.__greetingsApp.openEditPlannedModal === 'function') {
              window.__greetingsApp.openEditPlannedModal(item.id);
            }
          });
        }

        if (deleteBtn) {
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.__greetingsApp && typeof window.__greetingsApp.deletePlannedPin === 'function') {
              window.__greetingsApp.deletePlannedPin(item.id);
            }
          });
        }
      });

      marker.addTo(this.plannedPinsLayer);
      this.plannedMap.set(item.id, marker);
    });
  }

  createPlannedMarkerIcon(item) {
    const edition = item.plannedEdition || 'Draft';
    const digits = edition.replace(/\D/g, '');
    const numOnly = digits !== '' ? digits : '??';

    const iconHtml = `
      <div class="wpa-pin-planned" data-id="${item.id}" title="Curator Planned Pin: ${item.title}">
        <div class="wpa-pin-head">
          <div class="wpa-pin-inner">
            <span class="wpa-pin-no">#</span>
            <span class="wpa-pin-edition">${numOnly}</span>
          </div>
        </div>
        <div class="wpa-pin-stem"></div>
        <div class="wpa-pin-shadow"></div>
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: 'wpa-planned-pin-container',
      iconSize: [40, 48],
      iconAnchor: [20, 48],
      popupAnchor: [0, -44]
    });
  }

  createFieldNotePopupHTML(item) {
    const title = item.title || 'Upcoming Postcard Landmark';
    const address = item.address || 'Kenosha, WI';
    const edition = item.plannedEdition || 'Planned';
    const status = item.status || 'In Research';
    const notes = item.notes || 'No curatorial field notes recorded yet.';
    const statusLower = status.toLowerCase();
    const statusClass = statusLower.includes('art')
      ? 'status-art'
      : statusLower.includes('writ')
        ? 'status-writing'
        : 'status-researching';

    return `
      <div class="wpa-field-note-card" role="region" aria-label="Curator Note: ${title}">
        <div class="wpa-field-note-header">
          <span class="wpa-field-note-badge">📝 CURATOR NOTE • ${edition}</span>
          <span class="wpa-status-pill ${statusClass}">${status}</span>
        </div>

        <h3 class="wpa-field-note-title">${title}</h3>

        <div class="wpa-field-note-addr">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span>${address}</span>
        </div>

        <div class="wpa-field-note-box">
          <div class="wpa-field-note-label">Curatorial &amp; Field Notes</div>
          <p class="wpa-field-note-text">${notes}</p>
        </div>

        <div class="wpa-field-note-footer">
          <span>Target: ${edition}</span>
          <span>${item.lat.toFixed(5)}, ${item.lng.toFixed(5)}</span>
        </div>

        <div class="wpa-field-note-actions">
          <button type="button" class="wpa-btn-field-edit" data-id="${item.id}" title="Edit Pin Details & Coordinates">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            <span>Edit Pin</span>
          </button>
          <button type="button" class="wpa-btn-field-delete" data-id="${item.id}" title="Delete this Draft Pin">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            <span>Delete Pin</span>
          </button>
        </div>
      </div>
    `;
  }

  setPlannedLayerVisibility(visible = true) {
    if (!this.map || !this.plannedPinsLayer) return;

    if (visible) {
      if (!this.map.hasLayer(this.plannedPinsLayer)) {
        this.plannedPinsLayer.addTo(this.map);
      }
    } else {
      if (this.map.hasLayer(this.plannedPinsLayer)) {
        this.map.removeLayer(this.plannedPinsLayer);
      }
    }
  }

  focusMarker(id, zoomLevel = 15) {
    const marker = this.markerMap.get(id);
    if (marker) {
      const latlng = marker.getLatLng();
      // Offset target center north so the upward-opening popup is comfortably centered below the header
      const targetLat = latlng.lat + 0.0045;
      this.map.flyTo([targetLat, latlng.lng], zoomLevel, {
        duration: 0.9,
        easeLinearity: 0.25
      });
      setTimeout(() => {
        marker.openPopup();
        this.highlightMarkerPin(id);
      }, 450);
      this.activeMarkerId = id;
    }
  }

  highlightMarkerPin(id) {
    document.querySelectorAll('.wpa-pin-wrapper').forEach(el => {
      el.classList.remove('active-pin');
      if (el.dataset.id === id) {
        el.classList.add('active-pin');
      }
    });
  }

  dropSurveyorPin(lat, lng, autoCopy = true) {
    if (this.surveyorMarker) {
      this.map.removeLayer(this.surveyorMarker);
      this.surveyorMarker = null;
    }

    const latStr = lat.toFixed(7);
    const lngStr = lng.toFixed(7);
    const coordText = `${latStr}, ${lngStr}`;

    if (autoCopy && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(coordText).catch(() => {});
    }

    const iconHtml = `
      <div class="wpa-surveyor-pin">
        <div class="wpa-surveyor-crosshair"></div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'wpa-surveyor-icon-container',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16]
    });

    this.surveyorMarker = L.marker([lat, lng], {
      icon: customIcon,
      zIndexOffset: 1000
    }).addTo(this.map);

    const isCurator = this.isSurveyorMode || window.__greetingsApp?.isCuratorMode || Boolean(sessionStorage.getItem('wpa_curator_mode') === 'true');

    const popupHtml = `
      <div class="wpa-surveyor-card">
        <div class="wpa-surveyor-badge">SURVEYOR PIN</div>
        <div class="wpa-surveyor-coords">${latStr}, ${lngStr}</div>
        <div class="wpa-surveyor-status">✓ Copied to clipboard!</div>
        ${isCurator ? `
          <button type="button" id="btn-surveyor-create-pin" class="wpa-btn-surveyor-add">
            <span>📝 Create Planned Pin Here</span>
          </button>
        ` : ''}
      </div>
    `;

    this.surveyorMarker.bindPopup(popupHtml, {
      className: 'wpa-surveyor-popup',
      closeButton: true,
      autoPan: false
    }).openPopup();

    this.surveyorMarker.on('popupopen', () => {
      const addBtn = document.getElementById('btn-surveyor-create-pin');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          this.surveyorMarker?.closePopup();
          if (window.__greetingsApp && typeof window.__greetingsApp.openPlannedModal === 'function') {
            window.__greetingsApp.openPlannedModal(lat, lng);
          }
        });
      }
    });

    if (typeof this.onSurveyorCopied === 'function') {
      this.onSurveyorCopied(latStr, lngStr);
    }
  }

  toggleSurveyorMode() {
    this.isSurveyorMode = !this.isSurveyorMode;
    const mapEl = document.getElementById('kenosha-map');
    const btn = document.getElementById('btn-toggle-surveyor');
    const banner = document.getElementById('surveyor-banner');

    if (this.isSurveyorMode) {
      if (mapEl) mapEl.classList.add('crosshair-mode');
      if (btn) btn.classList.add('active');
      if (banner) banner.style.display = 'flex';
    } else {
      if (mapEl) mapEl.classList.remove('crosshair-mode');
      if (btn) btn.classList.remove('active');
      if (banner) banner.style.display = 'none';
    }
    return this.isSurveyorMode;
  }
}

export const kenoshaMap = new KenoshaMap();
