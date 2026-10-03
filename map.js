/**
 * Leaflet Map Controller for Greetings From Kenosha
 * 1930s WPA Poster Aesthetic, Custom Vintage Pins & Postcard Popups
 */

import { KENOSHA_BOUNDS, KENOSHA_PARKS_GEOJSON, KENOSHA_BOUNDING_LINES } from './kenosha-geo.js';

export const THEME_PROVIDERS = {
  'warm-wpa': {
    name: '1930s WPA Poster',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxZoom: 19,
      className: 'wpa-basemap-tiles',
      attribution: 'Tiles &copy; Esri &mdash; Sources: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, METI'
    }
  },
  'carto-voyager': {
    name: 'Voyager Clean',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxZoom: 19,
      className: 'wpa-basemap-tiles',
      attribution: 'Tiles &copy; Esri &mdash; Sources: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC'
    }
  },
  'osm-standard': {
    name: 'Classic Standard',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      maxZoom: 19,
      className: 'wpa-basemap-tiles',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
    }
  },
  'satellite': {
    name: 'Aerial Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxZoom: 19,
      className: 'wpa-basemap-tiles wpa-satellite-tiles',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, GIS Community'
    }
  }
};

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
    this.currentTheme = 'warm-wpa';
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

    // Add Tile Layers based on initial theme
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
      this.deactivatePinBeacons();
      if (this.isRepicking && typeof this.onRepickCoordinate === 'function') {
        this.onRepickCoordinate(e.latlng.lat, e.latlng.lng);
        return;
      }
      if (this.isSurveyorMode) {
        this.dropSurveyorPin(e.latlng.lat, e.latlng.lng, true);
      }
    });

    // Deactivate inviting beacon glow once user begins interacting with map
    this.map.on('movestart zoomstart', () => {
      this.deactivatePinBeacons();
    });

    return this;
  }

  setBaseTheme(theme) {
    const provider = THEME_PROVIDERS[theme] || THEME_PROVIDERS['warm-wpa'];
    this.currentTheme = THEME_PROVIDERS[theme] ? theme : 'warm-wpa';

    const mapElement = document.getElementById('kenosha-map');
    if (mapElement) {
      const allThemeClasses = Object.keys(THEME_PROVIDERS).map(t => `theme-${t}`);
      allThemeClasses.push('theme-wpa-poster', 'theme-wpa-litho', 'theme-wpa-sepia', 'theme-wpa-night');
      mapElement.classList.remove(...allThemeClasses);
      mapElement.classList.add(`theme-${this.currentTheme}`);
    }

    if (this.baseTileLayer) {
      this.map.removeLayer(this.baseTileLayer);
    }

    this.baseTileLayer = L.tileLayer(provider.url, provider.options).addTo(this.map);
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
      const isDesktop = window.innerWidth > 768;
      marker.bindPopup(popupContent, {
        className: 'wpa-postcard-popup',
        maxWidth: 295,
        minWidth: 240,
        autoPan: true,
        autoPanPaddingTopLeft: isDesktop ? [380, 85] : [20, 85],
        autoPanPaddingBottomRight: isDesktop ? [35, 35] : [20, 80],
        closeButton: true
      });

      marker.on('click', () => {
        this.activeMarkerId = markerData.id;
        this.highlightMarkerPin(markerData.id);
        if (typeof onSelectMarker === 'function') {
          onSelectMarker(markerData.id);
        }
      });

      marker.on('popupopen', () => {
        this.activeMarkerId = markerData.id;
        this.highlightMarkerPin(markerData.id);
        if (typeof onSelectMarker === 'function') {
          onSelectMarker(markerData.id);
        }
      });

      marker.on('mouseover', () => {
        if (window.__greetingsApp) {
          window.__greetingsApp.highlightTocCard(markerData.id, true);
        }
        marker.setZIndexOffset(1000);
      });

      marker.on('mouseout', () => {
        if (window.__greetingsApp) {
          window.__greetingsApp.highlightTocCard(markerData.id, false);
        }
        marker.setZIndexOffset(0);
      });

      marker.addTo(this.markersLayer);
      this.markerMap.set(markerData.id, marker);
    });
  }

  highlightMarker(id, isHighlighted) {
    const marker = this.markerMap.get(id) || this.plannedMap.get(id);
    if (!marker) return;
    const el = marker.getElement();
    if (el) {
      const pin = el.querySelector('.wpa-pin-wrapper') || el.querySelector('.wpa-pin-planned');
      if (pin) {
        pin.classList.toggle('wpa-pin-pulse-halo', isHighlighted);
      }
    }
    marker.setZIndexOffset(isHighlighted ? 1500 : 0);
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

  activatePinBeacons() {
    // Graceful no-op to prevent continuous animation loops
  }

  deactivatePinBeacons() {
    // Graceful no-op
  }

  createPostcardPopupHTML(data) {
    const edition = data.edition || 'No. 01';
    const title = data.title || 'Untitled Kenosha Postcard';
    const address = data.address || 'Kenosha, WI';
    const summary = data.summary || '';
    const link = data.link || '#';
    const isCurator = Boolean(window.__greetingsApp?.isCuratorMode);

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
            <div class="wpa-postcard-photo-frame wpa-lightbox-trigger" data-id="${data.id}" title="Click to view full screen postcard & flip back" role="button" tabindex="0">
              <img src="${data.imageUrl}" onerror="this.onerror=null;this.src=this.src.includes('assets/')?this.src.replace('assets/',''):'./assets/'+this.src.split('/').pop();" alt="${title}" class="wpa-postcard-img" loading="lazy" />
              <div class="wpa-postcard-photo-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                <span>Enlarge &amp; Flip ⟲</span>
              </div>
            </div>
          ` : ''}

          <div class="wpa-postcard-details">
            <h3 class="wpa-postcard-title">${title}</h3>
            
            <div class="wpa-postcard-geo-box">
              <div class="wpa-postcard-location" title="Landmark Address">
                <svg class="wpa-icon-pin" viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>${address}</span>
              </div>
              <div class="wpa-postcard-coords-badge" title="Survey Grid Coordinates">
                <svg class="wpa-coords-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="9"/>
                  <line x1="12" y1="3" x2="12" y2="7"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                  <line x1="3" y1="12" x2="7" y2="12"/>
                  <line x1="17" y1="12" x2="21" y2="12"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                </svg>
                <span class="wpa-coords-label">GRID:</span>
                <span class="wpa-coords-val">${data.lat.toFixed(5)}° N, ${Math.abs(data.lng).toFixed(5)}° W</span>
              </div>
            </div>
          </div>
        </div>

        <div class="wpa-postcard-footer">
          <a href="${link}" target="_blank" rel="noopener noreferrer" class="wpa-btn-readmore" id="postcard-link-${data.id}" title="Read story on Substack (Opens in new tab)">
            <span>Read on Substack</span>
            <svg class="wpa-arrow-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
          ${isCurator ? `
            <div class="wpa-postcard-curator-row">
              <button type="button" class="wpa-btn-repick-live-marker" data-id="${data.id}" data-edition="${edition}" data-title="${title}" title="Repick pin location on the map">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>Correct pin location</span>
              </button>
            </div>
          ` : ''}
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
      const isDesktop = window.innerWidth > 768;
      marker.bindPopup(popupContent, {
        className: 'wpa-field-note-popup',
        maxWidth: 320,
        minWidth: 260,
        autoPan: true,
        autoPanPaddingTopLeft: isDesktop ? [380, 85] : [20, 85],
        autoPanPaddingBottomRight: isDesktop ? [35, 35] : [20, 80],
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

      marker.on('mouseover', () => {
        if (window.__greetingsApp) {
          window.__greetingsApp.highlightTocCard(item.id, true);
        }
        marker.setZIndexOffset(1000);
      });

      marker.on('mouseout', () => {
        if (window.__greetingsApp) {
          window.__greetingsApp.highlightTocCard(item.id, false);
        }
        marker.setZIndexOffset(0);
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
    const imageUrl = item.imageUrl || '';
    const statusLower = status.toLowerCase();
    const statusClass = statusLower.includes('art')
      ? 'status-art'
      : statusLower.includes('writ')
        ? 'status-writing'
        : 'status-researching';

    return `
      <div class="wpa-field-note-card" role="region" aria-label="Curator Note: ${title}">
        ${imageUrl ? `
          <div class="wpa-postcard-photo-frame wpa-lightbox-trigger" data-id="${item.id}" title="Click to view full screen postcard & flip back" style="margin-bottom: 0.65rem; border-radius: var(--radius-sm); overflow: hidden; border: 2px solid var(--wpa-charcoal-road);">
            <img src="${imageUrl}" onerror="this.onerror=null;this.src=this.src.includes('assets/')?this.src.replace('assets/',''):'./assets/'+this.src.split('/').pop();" alt="${title}" class="wpa-postcard-img" loading="lazy" style="width: 100%; height: auto; max-height: 160px; object-fit: contain; display: block;" />
          </div>
        ` : ''}

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
          <span class="wpa-field-note-target">TARGET: ${edition}</span>
          <span class="wpa-field-note-coords-box" title="Survey Grid Coordinates">
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9"/>
              <line x1="12" y1="3" x2="12" y2="7"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
              <line x1="3" y1="12" x2="7" y2="12"/>
              <line x1="17" y1="12" x2="21" y2="12"/>
            </svg>
            ${item.lat.toFixed(5)}° N, ${Math.abs(item.lng).toFixed(5)}° W
          </span>
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
      const isMobile = window.innerWidth <= 768;
      const targetZoom = isMobile ? Math.min(zoomLevel, 15) : zoomLevel;

      // Calculate pixel offset for viewport framing (sidebar on desktop + top header bar)
      const targetPoint = this.map.project(latlng, targetZoom);
      const pixelOffsetX = isMobile ? 0 : -160;
      const pixelOffsetY = isMobile ? -65 : -75;
      const adjustedPoint = targetPoint.subtract([pixelOffsetX, pixelOffsetY]);
      const adjustedLatLng = this.map.unproject(adjustedPoint, targetZoom);

      this.map.flyTo(adjustedLatLng, targetZoom, {
        duration: 0.8,
        easeLinearity: 0.25
      });
      setTimeout(() => {
        marker.openPopup();
        this.highlightMarkerPin(id);
      }, 400);
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

    const isCurator = Boolean(window.__greetingsApp?.isCuratorMode);

    const popupHtml = `
      <div class="wpa-surveyor-card">
        <div class="wpa-surveyor-badge">SURVEYOR PIN</div>
        <div class="wpa-surveyor-coords">${latStr}, ${lngStr}</div>
        <div class="wpa-surveyor-status">✓ Copied to clipboard!</div>
        ${isCurator ? `
          <button type="button" id="btn-surveyor-create-pin" class="wpa-btn-surveyor-add" data-lat="${latStr}" data-lng="${lngStr}">
            <span>📝 Create Planned Pin Here</span>
          </button>
        ` : ''}
      </div>
    `;

    this.surveyorMarker.bindPopup(popupHtml, {
      className: 'wpa-surveyor-popup',
      closeButton: true,
      autoPan: false
    });

    const bindCreateButton = () => {
      const addBtn = document.getElementById('btn-surveyor-create-pin');
      if (addBtn) {
        addBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.surveyorMarker?.closePopup();
          if (window.__greetingsApp && typeof window.__greetingsApp.openPlannedModal === 'function') {
            window.__greetingsApp.openPlannedModal(lat, lng);
          }
        };
      }
    };

    this.surveyorMarker.on('popupopen', bindCreateButton);
    this.surveyorMarker.openPopup();
    setTimeout(bindCreateButton, 20);

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
