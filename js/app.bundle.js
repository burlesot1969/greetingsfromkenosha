/**
 * Greetings From Kenosha - Standalone Application Bundle
 * Compatible with BOTH file:// direct desktop opening and http:// web servers.
 * Auto-generated: 2026-10-06T15:03:10.727Z
 */
(function() {
  'use strict';

  // =========================================================================
  // MODULE: kenosha-geo.js
  // =========================================================================
/**
 * Kenosha Waterfront, Parks & WPA Landmark Boundaries (GeoJSON / Feature Layers)
 * Enhances the 1930s WPA Poster aesthetic with sage green parks and muted teal Lake Michigan waters.
 */

const KENOSHA_BOUNDS = {
  north: 42.6088, // 35th Street
  south: 42.5745, // 65th Street
  west: -87.8310, // Sheridan Road (Hwy 32)
  east: -87.8070, // Lake Michigan Shoreline
  center: [42.5858, -87.8191],
  getLeafletBounds: () => [
    [42.5745, -87.8310], // Southwest [lat, lng]
    [42.6088, -87.8070]  // Northeast [lat, lng]
  ],
  getMaxBounds: () => [
    [42.5600, -87.8500], // Southwest padding
    [42.6250, -87.7900]  // Northeast padding
  ]
};

// Key Kenosha Downtown Parks (Sage Green WPA Style)
const KENOSHA_PARKS_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Library Park", type: "park" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-87.8225, 42.5815],
          [-87.8202, 42.5815],
          [-87.8202, 42.5798],
          [-87.8225, 42.5798],
          [-87.8225, 42.5815]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "HarborPark & Celebration Place", type: "waterfront-park" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-87.8155, 42.5840],
          [-87.8130, 42.5840],
          [-87.8115, 42.5870],
          [-87.8140, 42.5885],
          [-87.8160, 42.5865],
          [-87.8155, 42.5840]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Simmons Island Beach & Lighthouse Park", type: "park" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-87.8145, 42.5895],
          [-87.8105, 42.5895],
          [-87.8090, 42.5975],
          [-87.8135, 42.5975],
          [-87.8145, 42.5895]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Pennoyer Park (South Section)", type: "park" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-87.8145, 42.5980],
          [-87.8095, 42.5980],
          [-87.8110, 42.6085],
          [-87.8155, 42.6085],
          [-87.8145, 42.5980]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Eichelman Park", type: "park" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-87.8175, 42.5775],
          [-87.8135, 42.5775],
          [-87.8130, 42.5745],
          [-87.8175, 42.5745],
          [-87.8175, 42.5775]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Civic Center Park", type: "park" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-87.8258, 42.5835],
          [-87.8238, 42.5835],
          [-87.8238, 42.5820],
          [-87.8258, 42.5820],
          [-87.8258, 42.5835]
        ]]
      }
    }
  ]
};

// Major Historical Grid Arterials for WPA Road overlay
const KENOSHA_BOUNDING_LINES = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "35th Street (North Boundary)", class: "boundary" },
      geometry: {
        type: "LineString",
        coordinates: [[-87.8350, 42.6088], [-87.8080, 42.6088]]
      }
    },
    {
      type: "Feature",
      properties: { name: "65th Street (South Boundary)", class: "boundary" },
      geometry: {
        type: "LineString",
        coordinates: [[-87.8350, 42.5745], [-87.8120, 42.5745]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Sheridan Road / Highway 32 (West Boundary)", class: "highway" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-87.8305, 42.5740],
          [-87.8308, 42.5850],
          [-87.8310, 42.5950],
          [-87.8312, 42.6095]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Historic Streetcar Route (Loop)", class: "streetcar" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-87.8200, 42.5840],
          [-87.8180, 42.5840],
          [-87.8180, 42.5875],
          [-87.8140, 42.5875],
          [-87.8140, 42.5850],
          [-87.8160, 42.5830],
          [-87.8200, 42.5830],
          [-87.8200, 42.5840]
        ]
      }
    }
  ]
};


  // =========================================================================
  // MODULE: data.js
  // =========================================================================
/**
 * Greetings From Kenosha - Postcard Editions Data Store
 * Default Postcards: No. 00, No. 01, No. 02, No. 03, No. 04, No. 05, No. 06, No. 07, No. 08, No. 09, No. 10
 */

const STORAGE_KEY = 'greetings_from_kenosha_markers_v9';

// Pre-populated default collection of Postcards
const DEFAULT_MARKERS = [
  {
    id: 'kenosha-00',
    title: 'Greetings from Kenosha Mural',
    address: '5500 Sixth Ave, Kenosha, WI',
    lat: 42.5858139,
    lng: -87.8191389,
    edition: 'No. 00',
    editionNum: 0,
    imageUrl: './assets/Todd Burleson - 00.jpeg',
    summary: 'Painted in 2018 by local artist Kelly Witte on the historic Jockey Factory Store building, this vibrant public art piece features hidden tributes to local history, including historic PCC streetcars and the Southport Light Station.',
    link: 'https://whereimaginationtakesflight.substack.com/p/kenosha-through-a-new-lens?r=4abqy&utm_campaign=post-expanded-share&utm_medium=web',
    year: '2018',
    artist: 'Kelly Witte',
    tags: ['Mural', 'Public Art', 'Downtown', 'Historic Jockey Building'],
    isDefault: true,
    dateAdded: '2026-09-07T17:30:00Z'
  },
  {
    id: 'kenosha-01',
    title: 'Dinosaur Discovery Museum',
    address: '5608 10th Avenue, Kenosha, WI',
    lat: 42.5839345,
    lng: -87.8234616,
    edition: 'No. 01',
    editionNum: 1,
    imageUrl: './assets/Todd Burleson - 01.jpeg',
    summary: 'The Stone Fortress That Walked Across the Square. Housed in a historic 1908 neoclassical federal post office building on Library Square, this unique institution explores the evolutionary link between meat-eating theropod dinosaurs and modern birds.',
    link: 'https://whereimaginationtakesflight.substack.com/p/field-journal?r=4abqy&utm_campaign=post-expanded-share&utm_medium=web',
    year: '1908',
    artist: 'Todd Burleson',
    tags: ['Museum', 'Civic Center', 'Historic Architecture', 'Paleontology'],
    isDefault: true,
    dateAdded: '2026-09-08T00:00:00Z'
  },
  {
    id: 'kenosha-02',
    title: "Anna's on the Lake",
    address: '5159 6th Avenue, Kenosha, WI',
    lat: 42.5883908,
    lng: -87.8192056,
    edition: 'No. 02',
    editionNum: 2,
    imageUrl: './assets/Todd Burleson - 02.jpeg',
    summary: 'The Fish Shanty That Learned to steam milk. Situated along the north side of the harbor basin, this cozy lakeside café sits in a 1928 Milwaukee Cream City brick building steeped in maritime heritage, offering espresso and views across the water.',
    link: 'https://whereimaginationtakesflight.substack.com/p/field-journal-02?r=4abqy&utm_campaign=post-expanded-share&utm_medium=web',
    year: '1928',
    artist: 'Todd Burleson',
    tags: ['Harbor', 'Coffee Shop', 'Historic Building', 'Cream City Brick'],
    isDefault: true,
    dateAdded: '2026-09-08T01:00:00Z'
  },
  {
    id: 'kenosha-03',
    title: 'Weiskopf-Mica Block (Olafson & Porter Vintage Goods)',
    address: '5000 7th Ave Kenosha WI 53140',
    lat: 42.5906507,
    lng: -87.8206569,
    edition: 'No. 03',
    editionNum: 3,
    imageUrl: './assets/Todd Burleson - 03.jpeg',
    summary: 'In the 1890s, the Weiskopf block was a disjointed row of three separate wood-frame storefronts. They housed a barbershop, Charles Skidd’s hardware store, and a plumbing shop. The local editors of the Kenosha News publicly shamed the corner as an architectural eyesore. It sure has changed today!',
    link: 'https://whereimaginationtakesflight.substack.com/p/field-journal-no-3?r=4abqy&utm_campaign=post-expanded-share&utm_medium=web',
    year: "1890s",
    artist: 'Todd Burleson',
    tags: ['Historic Building', 'Downtown', 'Weiskopf Block', 'Vintage Goods'],
    isDefault: true,
    dateAdded: '2026-09-09T16:40:06.768Z'
  },
  {
    id: 'kenosha-04',
    title: 'US Coast Guard Station Kenosha',
    address: '5036 4th Ave, Kenosha, WI 53140',
    lat: 42.5901200,
    lng: -87.8168100,
    edition: 'No. 04',
    editionNum: 4,
    imageUrl: './assets/Todd Burleson - 04.jpeg',
    summary: 'If you walk the Simmons Island harbor path on a clear, sunny afternoon, the contrast is impossible to miss. To your left lies the serene, open basin of the Southport Marina, where pleasure boats rock gently against their slips, and gulls drift lazily overhead. But to your right, bounded by a security fence and brick perimeter at 5036 Fourth Avenue, is a disciplined hive of active-duty military life.',
    link: 'https://whereimaginationtakesflight.substack.com/p/field-journal-no-04?r=4abqy&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true',
    year: '1879',
    artist: 'Todd Burleson',
    tags: ['Coast Guard', 'Simmons Island', 'Historic Landmark', 'Maritime', 'Southport Marina'],
    isDefault: true,
    dateAdded: '2026-09-12T20:15:00Z'
  },
  {
    id: 'kenosha-05',
    title: 'Southport Lighthouse',
    address: '5117 4th Ave, Kenosha, WI 53140',
    lat: 42.5894400,
    lng: -87.8158300,
    edition: 'No. 05',
    editionNum: 5,
    imageUrl: './assets/Todd Burleson - 05.jpeg',
    summary: 'The Sentinel on the Sands. Built in 1866 of Milwaukee Cream City brick, this 55-foot conical lighthouse stands as a timeless beacon on Simmons Island, preserving Kenosha\'s rich maritime heritage.',
    link: 'https://whereimaginationtakesflight.substack.com/p/field-journal-no-05?r=4abqy&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true',
    year: '1866',
    artist: 'Todd Burleson',
    tags: ['Lighthouse', 'Simmons Island', 'Cream City Brick', 'Historic Landmark', 'Lake Michigan'],
    isDefault: true,
    dateAdded: '2026-09-12T21:26:00Z'
  },
  {
    id: 'kenosha-06',
    title: 'Kenosha History Center',
    address: '220 51st Place, Kenosha, WI 53140',
    lat: 42.5889940,
    lng: -87.8154048,
    edition: 'No. 06',
    editionNum: 6,
    imageUrl: './assets/Todd Burleson - 06.jpeg',
    summary: 'I stood on the 50th Street harbor bridge this morning and felt the city grid give way to the open expanse of Lake Michigan. The air always shifts here. It turns sharp with freshwater wind. Follow 51st Place toward the water and look below the grassy hill holding the 1866 Southport Lighthouse. You will find a stout red-brick building at 220 51st Place. It features arched multipane windows, heavy limestone accents, and solid load-bearing masonry. It carries the mechanical gravity of a classic Great Lakes civic landmark.',
    link: 'https://whereimaginationtakesflight.substack.com/p/field-journal-no-06?r=4abqy&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true',
    year: '1899',
    artist: 'Todd Burleson',
    tags: ['Museum', 'Simmons Island', 'Historic Landmark', 'Great Lakes History', 'Maritime', 'Pump House'],
    isDefault: true,
    dateAdded: '2026-09-13T17:07:00Z'
  },
  {
    id: 'kenosha-07',
    title: 'Kenosha North Pier Lighthouse',
    address: 'North Pier, Simmons Island Park, Kenosha, WI 53140',
    lat: 42.5888000,
    lng: -87.8086000,
    edition: 'No. 07',
    editionNum: 7,
    imageUrl: './assets/Todd Burleson - 07.jpeg?v=20260925_h1',
    summary: 'The Walk Out to the Red Tower. Walk to the very end of 50th Street on Simmons Island. Past the white clapboard Coast Guard Station and the historic pump house of the Kenosha History Center, the paved road gives way to beach sand. The harbor’s edge sits on your right. From there, you step out onto wave-washed concrete and open water.',
    link: 'https://whereimaginationtakesflight.substack.com/p/field-journal-no-07?r=4abqy&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true',
    year: '1906',
    artist: 'Todd Burleson',
    tags: ['Lighthouse', 'Simmons Island', 'North Pier', 'Historic Landmark', 'Lake Michigan', 'Red Tower'],
    isDefault: true,
    dateAdded: '2026-09-13T14:38:00Z'
  },
  {
    id: 'kenosha-08',
    title: 'Simmons Island Beach House',
    address: '5001 Simmons Island Rd, Kenosha, WI 53140',
    lat: 42.5909800,
    lng: -87.8143600,
    edition: 'No. 08',
    editionNum: 8,
    imageUrl: './assets/Todd Burleson - 08.jpeg',
    summary: 'An English Manor on a Great Lakes Dune\n\nFollowing 50th Street past the marina and across the parkland of Simmons Island, the city grid falls away. The mechanical hum of downtown traffic yields to dune grass, gull cries, and the steady roll of Lake Michigan. Walking from my apartment in the early morning, I look for the exact moment the sunrise catches the shoreline. Cresting the slight rise near the sand reveals an architectural outlier. It looks like a heavy English manor dropped onto a Great Lakes dune. A steep slate roof caps dark-stained timber gables. Forged wrought-iron strap hinges anchor a rigid limestone entrance pavilion. Carved into the stone above the massive doors is a simple date: Anno Municipal Bathhouse 1934.',
    link: 'https://whereimaginationtakesflight.substack.com/p/field-journal-no-08?r=4abqy&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true',
    year: '1934',
    artist: 'Todd Burleson',
    tags: ['Beach House', 'Simmons Island', 'Municipal Bathhouse', 'Historic Landmark', 'Lake Michigan', 'WPA Era'],
    isDefault: true,
    dateAdded: '2026-09-13T20:04:00Z'
  },
  {
    id: 'kenosha-09',
    title: 'Pennoyer Park Bandshell',
    address: '3601 7th Ave (Kennedy Dr), Kenosha, WI 53140',
    lat: 42.6059400,
    lng: -87.8200300,
    edition: 'No. 09',
    editionNum: 9,
    imageUrl: './assets/Todd Burleson - 09.png',
    summary: 'The Shell on the Shore, Summer Brass, and Rainstorms at Pennoyer Park\n\nStanding on the Lake Michigan shoreline along Kennedy Drive, the Sesquicentennial Bandshell in Pennoyer Park has been Kenosha’s premier outdoor acoustic stage since 1988. Designed by Kenosha architect Robert M. Kueny to celebrate the city’s 150th anniversary, its soaring shell and vibrant youth mosaic murals provide a sun-drenched home for the Kenosha Pops Concert Band and summer evening music over the water.',
    link: 'https://whereimaginationtakesflight.substack.com/p/field-journal-no-09?r=4abqy&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true',
    year: '1988',
    artist: 'Todd Burleson',
    tags: ['Bandshell', 'Pennoyer Park', 'Historic Landmark', 'Lake Michigan', 'Summer Concerts', 'Kennedy Drive'],
    isDefault: true,
    dateAdded: '2026-09-16T11:38:00Z'
  },
  {
    id: 'kenosha-10',
    title: 'St. Elizabeth Catholic Church',
    address: '719 49th Street, Kenosha, WI 53140',
    lat: 42.5918500,
    lng: -87.8214000,
    edition: 'No. 10',
    editionNum: 10,
    imageUrl: './assets/Todd Burleson - 10.jpeg',
    summary: 'Echoes in Pale Yellow Brick: Survival, Sacrifice, and Secrets in Kenosha\n\nErected in 1875 of distinctive Cream City brick following a fire that claimed the original 1852 church, this Romanesque Revival landmark stands proudly in downtown Kenosha. Formed from the historic German congregation of St. George and later merged with St. Casimir to become St. Elizabeth, its soaring bell tower and warm pale brickwork preserve generations of neighborhood faith, sacrifice, and community heritage.',
    link: 'https://whereimaginationtakesflight.substack.com/p/field-journal-no-10?r=4abqy&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true',
    year: '1875',
    artist: 'Todd Burleson',
    tags: ['Historic Church', 'Cream City Brick', 'Downtown', 'Romanesque Revival', 'St. George', 'St. Elizabeth', '49th Street'],
    isDefault: true,
    dateAdded: '2026-10-05T23:25:00Z'
  }
];

class MarkerStore {
  constructor() {
    this.markers = [...DEFAULT_MARKERS];
    // Immediately load locally saved planned pins from localStorage
    this.plannedMarkers = this.loadLocalPlanned();
    this.listeners = [];
    try {
      localStorage.removeItem('wpa_custom_live_coordinates');
    } catch (e) {}
  }

  updateMarkerCoordinates(id, lat, lng) {
    const idx = this.markers.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.markers[idx] = {
        ...this.markers[idx],
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };
      this.notify();
      return this.markers[idx];
    }
    return null;
  }

  setPlannedMarkers(list) {
    const deletedIds = this.loadDeletedPlannedIds();
    const localStored = this.loadLocalPlanned();
    const localMap = new Map(localStored.map(item => [item.id, item]));
    
    // Published IDs / Editions to prevent duplicate draft pins if a planned marker is now published
    const publishedEditions = new Set(this.markers.map(m => (m.edition || '').toLowerCase().replace(/\s+/g, '')));
    const publishedIds = new Set(this.markers.map(m => m.id));

    const combined = [];
    const seenIds = new Set();

    if (Array.isArray(list)) {
      for (const item of list) {
        const itemEditionClean = (item.plannedEdition || item.edition || '').toLowerCase().replace(/\s+/g, '');
        const isAlreadyPublished = (itemEditionClean && publishedEditions.has(itemEditionClean)) || publishedIds.has(item.id);

        if (!deletedIds.has(item.id) && !isAlreadyPublished) {
          const localItem = localMap.get(item.id) || {};
          const toUse = {
            ...localItem,
            ...item,
            imageUrl: item.imageUrl || localItem.imageUrl || '',
            lat: parseFloat(localItem.lat ?? item.lat),
            lng: parseFloat(localItem.lng ?? item.lng)
          };
          combined.push(toUse);
          seenIds.add(item.id);
        }
      }
    }

    for (const item of localStored) {
      const itemEditionClean = (item.plannedEdition || item.edition || '').toLowerCase().replace(/\s+/g, '');
      const isAlreadyPublished = (itemEditionClean && publishedEditions.has(itemEditionClean)) || publishedIds.has(item.id);

      if (!seenIds.has(item.id) && !deletedIds.has(item.id) && !isAlreadyPublished) {
        combined.push(item);
        seenIds.add(item.id);
      }
    }

    this.plannedMarkers = combined;
    this.saveLocalPlanned();
    this.notify();
  }

  exportPlannedMarkersJSON() {
    return JSON.stringify(this.plannedMarkers, null, 2);
  }

  exportPlannedMarkersFileContent() {
    return `/**\n * PRIVATE LOCAL-ONLY CURATOR PLANNING LAYER\n * This file is git-ignored and NEVER pushed to GitHub.\n * Total Draft Pins: ${this.plannedMarkers.length}\n * Generated: ${new Date().toLocaleString()}\n */\n\nexport const PLANNED_MARKERS = ${JSON.stringify(this.plannedMarkers, null, 2)};\n`;
  }

  importPlannedMarkers(data) {
    let list = data;
    if (typeof data === 'string') {
      try {
        // Handle JS export syntax if pasted with 'export const PLANNED_MARKERS = ...'
        let clean = data.trim();
        if (clean.includes('=')) {
          clean = clean.split('=').slice(1).join('=').trim().replace(/;$/, '');
        }
        list = JSON.parse(clean);
      } catch (e) {
        return { success: false, error: 'Invalid JSON/Code format.' };
      }
    }

    if (!Array.isArray(list)) {
      return { success: false, error: 'Data must be an array of markers.' };
    }

    const current = this.loadLocalPlanned();
    const map = new Map(current.map(m => [m.id, m]));
    let importedCount = 0;

    list.forEach(m => {
      if (m && (m.id || m.title)) {
        const id = m.id || `plan-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        map.set(id, {
          ...m,
          id,
          lat: parseFloat(m.lat),
          lng: parseFloat(m.lng)
        });
        importedCount++;
      }
    });

    this.plannedMarkers = Array.from(map.values());
    this.saveLocalPlanned();
    this.notify();
    return { success: true, count: importedCount, total: this.plannedMarkers.length };
  }

  addPlannedMarker(plannedData) {
    const id = plannedData.id || `plan-${Date.now()}`;
    const newPlanned = {
      ...plannedData,
      id,
      plannedEdition: plannedData.plannedEdition || 'Draft',
      status: plannedData.status || 'Researching',
      lat: parseFloat(plannedData.lat),
      lng: parseFloat(plannedData.lng),
      dateAdded: new Date().toISOString()
    };

    this.plannedMarkers.push(newPlanned);
    this.saveLocalPlanned();
    this.notify();
    return newPlanned;
  }

  updatePlannedMarker(id, updatedData) {
    const idx = this.plannedMarkers.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.plannedMarkers[idx] = {
        ...this.plannedMarkers[idx],
        ...updatedData,
        lat: parseFloat(updatedData.lat ?? this.plannedMarkers[idx].lat),
        lng: parseFloat(updatedData.lng ?? this.plannedMarkers[idx].lng)
      };
      this.saveLocalPlanned();
      this.notify();
      return this.plannedMarkers[idx];
    }
    return null;
  }

  deletePlannedMarker(id) {
    const deletedIds = this.loadDeletedPlannedIds();
    deletedIds.add(id);
    this.saveDeletedPlannedIds(deletedIds);

    this.plannedMarkers = this.plannedMarkers.filter(m => m.id !== id);
    this.saveLocalPlanned();
    this.notify();
    return true;
  }

  saveLocalPlanned() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('wpa_local_planned_markers', JSON.stringify(this.plannedMarkers));
      }
    } catch (e) {
      console.warn('Could not save planned markers to localStorage', e);
    }
  }

  loadLocalPlanned() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('wpa_local_planned_markers');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Could not load planned markers from localStorage', e);
    }
    return [];
  }

  loadDeletedPlannedIds() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('wpa_deleted_planned_ids');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return new Set(parsed);
          }
        }
      }
    } catch (e) {}
    return new Set();
  }

  saveDeletedPlannedIds(setObj) {
    try {
      localStorage.setItem('wpa_deleted_planned_ids', JSON.stringify([...setObj]));
    } catch (e) {}
  }

  getAll(includePlanned = false) {
    const list = includePlanned ? [...this.markers, ...this.plannedMarkers] : [...this.markers];
    return list.sort((a, b) => {
      const numA = typeof a.editionNum === 'number' ? a.editionNum : 999;
      const numB = typeof b.editionNum === 'number' ? b.editionNum : 999;
      return numA - numB;
    });
  }

  getPublished() {
    return [...this.markers].sort((a, b) => (a.editionNum ?? 999) - (b.editionNum ?? 999));
  }

  getDefault() {
    return this.getPublished();
  }

  getPlanned() {
    return [...this.plannedMarkers];
  }

  getById(id) {
    return this.markers.find(m => m.id === id) || this.plannedMarkers.find(m => m.id === id) || null;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    const all = this.getAll();
    this.listeners.forEach(fn => fn(all));
  }
}

const markerStore = new MarkerStore();



  // =========================================================================
  // MODULE: map.js
  // =========================================================================
/**
 * Leaflet Map Controller for Greetings From Kenosha
 * 1930s WPA Poster Aesthetic, Custom Vintage Pins & Postcard Popups
 */


const THEME_PROVIDERS = {
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
    if (!this.markersLayer) {
      if (this.map && typeof L !== 'undefined') {
        this.markersLayer = L.layerGroup().addTo(this.map);
      } else {
        return;
      }
    }
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
    if (!this.plannedPinsLayer) {
      if (this.map && typeof L !== 'undefined') {
        this.plannedPinsLayer = L.layerGroup().addTo(this.map);
      } else {
        return;
      }
    }
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

const kenoshaMap = new KenoshaMap();


  // =========================================================================
  // MODULE: jukebox-data.js
  // =========================================================================
/**
 * Greetings From Kenosha - Era Jukebox Track Catalog
 * Curated vintage & public domain recordings in STRICT CHRONOLOGICAL ORDER.
 * 
 * Timeline:
 * 1. 1890s–1910s: Ragtime & Early Parlor
 * 2. 1920s: The Roaring Twenties & Hot Jazz
 * 3. 1930s: Great Depression Radio & Newsstand Hits
 * 4. 1930s–1940s: Big Band, Swing & WWII V-Discs
 * 5. Coastal Ambiance: Lake Michigan Harbor Soundscape
 */

const JUKEBOX_ERAS = [
  {
    id: 'era-ragtime',
    step: '1',
    label: '1890s–1910s Ragtime & Parlor',
    shortLabel: '1890s–1910s',
    subLabel: 'Ragtime & Parlor',
    decade: '1890–1919',
    icon: '🎹',
    tagline: 'Scott Joplin Piano Rolls, Turn-of-the-Century Brass Bands & Saloon Rags',
    color: '#2B6870',
    badge: '1890s–1910s'
  },
  {
    id: 'era-jazz-age',
    step: '2',
    label: '1920s The Roaring Twenties',
    shortLabel: '1920s',
    subLabel: 'Jazz Age & Charleston',
    decade: '1920–1929',
    icon: '🎷',
    tagline: 'Hot Jazz, Speakeasies, Charleston & Paul Whiteman Orchestra',
    color: '#DCA134',
    badge: '1920s JAZZ'
  },
  {
    id: 'era-hit-week',
    step: '3',
    label: '1930s Depression Radio Hits',
    shortLabel: '1930s',
    subLabel: 'Early Radio & Hits',
    decade: '1930–1935',
    icon: '📻',
    tagline: 'Cardboard "Hit of the Week" phonograph records & Fireside Radio days',
    color: '#1D2D44',
    badge: '1930s RADIO'
  },
  {
    id: 'era-wpa-swing',
    step: '4',
    label: '1930s–40s Big Band & Swing',
    shortLabel: '1930s–40s',
    subLabel: 'Big Band & Swing',
    decade: '1936–1945',
    icon: '🎺',
    tagline: 'WPA Era Ballrooms, Glenn Miller, Benny Goodman & WWII V-Discs',
    color: '#C45934',
    badge: 'WPA SWING'
  },
  {
    id: 'era-harbor-ambient',
    step: '5',
    label: 'Lake Michigan Harbor Ambiance',
    shortLabel: 'Lake Ambiance',
    subLabel: 'Harbor Waves & Bell',
    decade: 'Continuous',
    icon: '🌊',
    tagline: 'Generative Lake Michigan waves, distant lighthouse bell & phonograph warmth',
    color: '#41828B',
    badge: 'COASTAL',
    isProcedural: true
  }
];

const JUKEBOX_TRACKS = [
  // =========================================================================
  // ERA 1: 1890s–1910s Ragtime & Early Parlor (Chronological)
  // =========================================================================
  {
    id: 'track-rag-01',
    eraId: 'era-ragtime',
    title: 'Maple Leaf Rag',
    artist: 'Scott Joplin',
    year: '1899',
    duration: '3:10',
    url: 'https://archive.org/download/kzz003/03_-_scott_joplin_-_maple_leaf_rag.mp3',
    notes: 'The archetype of American ragtime that established Scott Joplin as the King of Ragtime.'
  },
  {
    id: 'track-rag-02',
    eraId: 'era-ragtime',
    title: 'The Entertainer',
    artist: 'Scott Joplin',
    year: '1902',
    duration: '3:50',
    url: 'https://archive.org/download/kzz003/04_-_scott_joplin_-_the_entertainer.mp3',
    notes: 'Classic parlor syncopation, celebrated throughout the 20th century.'
  },
  {
    id: 'track-rag-03',
    eraId: 'era-ragtime',
    title: 'Frog Legs Rag',
    artist: 'James Scott',
    year: '1906',
    duration: '3:15',
    url: 'https://archive.org/download/kzz003/01_-_james_scott_-_frog_legs_rag.mp3',
    notes: 'One of the defining piano masterpieces of early American ragtime.'
  },
  {
    id: 'track-rag-04',
    eraId: 'era-ragtime',
    title: 'The Smiler',
    artist: 'Percy Wenrich / Zonophone Band',
    year: '1907',
    duration: '2:40',
    url: 'https://archive.org/download/kzz003/02_-_percy_wenrich_-_the_smiler.mp3',
    notes: 'Jovial brass band ragtime popular in turn-of-the-century lakeside pavilions.'
  },
  {
    id: 'track-rag-05',
    eraId: 'era-ragtime',
    title: 'Pine Apple Rag',
    artist: 'Scott Joplin',
    year: '1908',
    duration: '3:25',
    url: 'https://archive.org/download/kzz003/08-_scott_joplin_-_pine-apple-rag.mp3',
    notes: 'Sunny, bouncy syncopated stride piano from Joplin’s New York era.'
  },

  // =========================================================================
  // ERA 2: 1920s The Roaring Twenties & Hot Jazz (Chronological)
  // =========================================================================
  {
    id: 'track-jazz-01',
    eraId: 'era-jazz-age',
    title: 'Hot Lips',
    artist: 'Paul Whiteman Orchestra',
    year: '1922',
    duration: '3:05',
    url: 'https://archive.org/download/PaulWhiteman1920-1935CompleteCollection/HotLipshesGotHotLipsWhenHePlaysJazz.mp3',
    notes: 'Early twenties hot jazz standard with fiery trumpet solos.'
  },
  {
    id: 'track-jazz-02',
    eraId: 'era-jazz-age',
    title: '12th Street Rag',
    artist: 'Ted Lewis & His Band',
    year: '1923',
    duration: '2:58',
    url: 'https://archive.org/download/TedLewisCollection1919-1934/12thStreetRag.mp3',
    notes: 'High-energy clarinet and brass showpiece of the Roaring Twenties.'
  },
  {
    id: 'track-jazz-03',
    eraId: 'era-jazz-age',
    title: 'Rhapsody in Blue',
    artist: 'Paul Whiteman feat. George Gershwin',
    year: '1924',
    duration: '8:50',
    url: 'https://archive.org/download/PaulWhiteman1920-1935CompleteCollection/RhapsodyInBlue.mp3',
    notes: 'Historic premiere recording blending classical symphonic form with American jazz.'
  },
  {
    id: 'track-jazz-04',
    eraId: 'era-jazz-age',
    title: 'Charleston',
    artist: 'Paul Whiteman & His Orchestra',
    year: '1925',
    duration: '2:45',
    url: 'https://archive.org/download/PaulWhiteman1920-1935CompleteCollection/Charleston.mp3',
    notes: 'The iconic rhythm that defined the flapper era and Roaring Twenties dance halls.'
  },
  {
    id: 'track-jazz-05',
    eraId: 'era-jazz-age',
    title: "Alexander's Ragtime Band",
    artist: 'Ted Lewis & His Orchestra',
    year: '1926',
    duration: '3:00',
    url: 'https://archive.org/download/TedLewisCollection1919-1934/AlexandersRagtimeBand.mp3',
    notes: 'Irving Berlin classic brought to life with Roaring Twenties exuberance.'
  },
  {
    id: 'track-jazz-06',
    eraId: 'era-jazz-age',
    title: 'Sweet Sue, Just You',
    artist: 'Paul Whiteman & His Orchestra',
    year: '1928',
    duration: '3:12',
    url: 'https://archive.org/download/PaulWhiteman1920-1935CompleteCollection/SweetSueJustYou.mp3',
    notes: 'Late-twenties sweet jazz arrangement with lush ensemble playing.'
  },

  // =========================================================================
  // ERA 3: 1930s Depression Radio Hits (Chronological)
  // =========================================================================
  {
    id: 'track-hit-01',
    eraId: 'era-hit-week',
    title: 'Tip-Toe Through the Tulips',
    artist: 'Don Voorhees & His Orchestra',
    year: '1929',
    duration: '2:40',
    url: 'https://archive.org/download/CompleteHitOfTheWeekRecordings1930-1932/1019DonVorhees-TipToeThruTheTulips.mp3',
    notes: 'Hit of the Week cardboard record sold on newsstands for 15¢ during the Great Depression.'
  },
  {
    id: 'track-hit-02',
    eraId: 'era-hit-week',
    title: 'Back in Your Own Back Yard',
    artist: 'Hit of the Week Orchestra',
    year: '1930',
    duration: '2:45',
    url: 'https://archive.org/download/CompleteHitOfTheWeekRecordings1930-1932/1018HitOfTheWeekOrchestra-BackInYourOwnBackYard.mp3',
    notes: 'Uplifting homefront melody broadcast over living room radios in 1930.'
  },
  {
    id: 'track-hit-03',
    eraId: 'era-hit-week',
    title: 'A Bench in the Park',
    artist: 'Paul Whiteman Orchestra',
    year: '1930',
    duration: '3:10',
    url: 'https://archive.org/download/PaulWhiteman1920-1935CompleteCollection/ABenchInThePark1930.mp3',
    notes: 'From the early sound motion picture King of Jazz (1930).'
  },

  // =========================================================================
  // ERA 4: 1930s–1940s Big Band, Swing & WWII V-Discs (Chronological)
  // =========================================================================
  {
    id: 'track-swing-01',
    eraId: 'era-wpa-swing',
    title: 'Sing, Sing, Sing (With a Swing)',
    artist: 'Benny Goodman & His Orchestra',
    year: '1937',
    duration: '5:02',
    url: 'https://archive.org/download/V-discs1-991943-1944/1943-10-xx-007-V-Disc-AB-Benny-Goodman-and-his-Orchestra---Sing-Sing-Sing-Pt-12.mp3',
    notes: 'The electrifying swing masterpiece featuring Gene Krupa’s legendary floor tom drums.'
  },
  {
    id: 'track-swing-02',
    eraId: 'era-wpa-swing',
    title: 'Moonlight Serenade',
    artist: 'Glenn Miller & His Orchestra',
    year: '1939',
    duration: '3:20',
    url: 'https://archive.org/download/V-discs1-991943-1944/1943-11-xx-039-V-Disc-A-Glenn-Miller---Moonlight-Serenade.mp3',
    notes: 'The signature big band ballad that defined the late 1930s and WWII homefront.'
  },
  {
    id: 'track-swing-03',
    eraId: 'era-wpa-swing',
    title: 'Blue Skies',
    artist: 'Tommy Dorsey & Frank Sinatra',
    year: '1943',
    duration: '3:10',
    url: 'https://archive.org/download/V-discs1-991943-1944/1943-10-xx-001-V-Disc-B-Tommy-Dorsey-and-his-Orchestra-with-Vocal-Refrain-by-Frank-Sinatra-and-Chorus---Blue-Skies.mp3',
    notes: 'Young Frank Sinatra’s smooth vocal harmonies with Tommy Dorsey’s orchestra.'
  },
  {
    id: 'track-swing-04',
    eraId: 'era-wpa-swing',
    title: "Don't Get Around Much Anymore",
    artist: 'Duke Ellington & His Orchestra',
    year: '1943',
    duration: '3:05',
    url: 'https://archive.org/download/V-discs1-991943-1944/1943-10-xx-010-V-Disc-A-Duke-Ellington-and-his-Orchestra---Dont-Get-Around-Much-Anymore.mp3',
    notes: 'Duke Ellington wartime standard recorded for overseas Armed Forces V-Discs.'
  },
  {
    id: 'track-swing-05',
    eraId: 'era-wpa-swing',
    title: 'G.I. Stomp',
    artist: 'Count Basie & His Orchestra',
    year: '1943',
    duration: '2:50',
    url: 'https://archive.org/download/V-discs1-991943-1944/1943-11-xx-034-V-Disc-A-Count-Basie-and-his-Orchestra---GI-Stomp.mp3',
    notes: 'Energetic Kansas City jump swing recorded for overseas troops.'
  },
  {
    id: 'track-swing-06',
    eraId: 'era-wpa-swing',
    title: 'Mood Indigo',
    artist: 'Duke Ellington & His Orchestra',
    year: '1943',
    duration: '3:15',
    url: 'https://archive.org/download/V-discs1-991943-1944/1943-12-xx-067-V-Disc-A-Duke-Ellington-And-His-Orchestra---Mood-Indigo.mp3',
    notes: 'Lush, intimate muted jazz harmonies by the Duke.'
  },
  {
    id: 'track-swing-07',
    eraId: 'era-wpa-swing',
    title: "Ain't Misbehaving",
    artist: 'Fats Waller',
    year: '1943',
    duration: '3:40',
    url: 'https://archive.org/download/V-discs1-991943-1944/1943-11-xx-032-V-Disc-A-Fats-Waller---Aint-Misbehaving--Two-Sleepy-People.mp3',
    notes: 'Stride piano genius and charismatic vocals from Thomas "Fats" Waller.'
  },

  // =========================================================================
  // ERA 5: Lake Michigan Coastal Ambiance (Generative / Procedural)
  // =========================================================================
  {
    id: 'track-ambient-01',
    eraId: 'era-harbor-ambient',
    title: 'Simmons Island Shore & Lake Swells',
    artist: 'Lake Michigan Coastal Soundscape',
    year: 'Continuous',
    duration: 'Live Ambient',
    url: null,
    isProcedural: true,
    notes: 'Live procedural audio synthesis of Lake Michigan surf, distant harbor bell buoy, and subtle 78 RPM phonograph warmth.'
  }
];


  // =========================================================================
  // MODULE: jukebox.js
  // =========================================================================
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

const eraJukebox = new EraJukebox();


  // =========================================================================
  // MODULE: app.js
  // =========================================================================
/**
 * Main Application Controller for Greetings From Kenosha
 * Coordinates TOC sidebar, Map interactions, Search & Surveyor Coordinate Tool
 */




class GreetingsApp {
  constructor() {
    this.searchQuery = '';
    this.selectedMarkerId = null;
    this.currentLightboxId = null;
    this.isCuratorMode = false;
    this.hasLocalPlannedData = false;
    this.currentMobileView = 'map';
    this._preloadedImages = new Set();
    this._audioCtx = null;
    try {
      this.isPlainTextMode = localStorage.getItem('wpa_plain_text_mode') === 'true';
    } catch (e) {
      this.isPlainTextMode = false;
    }
  }

  async init() {
    // 1. Setup Animated Project Intro Splash Screen / Welcome Curtain IMMEDIATELY
    this.setupIntroCurtain();

    // 2. Initialize Leaflet Map
    try {
      kenoshaMap.init('kenosha-map');
    } catch (e) {
      console.warn('Leaflet map init error:', e);
    }

    // 3. Initialize 1930s Era Radio Jukebox Engine & UI
    try {
      eraJukebox.init();
    } catch (e) {
      console.warn('Era Jukebox init deferred:', e);
    }

    // 4. Check Curator Planning Mode & load local-only draft file if present
    try {
      await this.checkCuratorMode();
    } catch (e) {
      console.warn('Check curator mode error:', e);
    }

    // 5. Render initial markers
    this.refreshMarkers();

    // 6. If in Curator Mode, render planned draft pins
    if (this.isCuratorMode) {
      this.updateCuratorModeState();
    }

    // 7. Setup event listeners & Surveyor Tool
    this.setupEventListeners();

    // 8. Set initial mobile view (default to map view on small screens <= 768px so map is immediately visible)
    if (window.innerWidth <= 768) {
      this.setMobileView('map');
    }

    // 9. Subscribe to data changes
    markerStore.subscribe(() => {
      this.refreshMarkers();
      if (this.isCuratorMode) {
        this.updateCuratorModeState();
      }
    });

    // 10. Check URL Deep-Link (#00, #01, ?edition=01, etc.)
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
          if (kenoshaMap && typeof kenoshaMap.highlightMarkerPin === 'function') {
            kenoshaMap.highlightMarkerPin(markers[0].id);
          }
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
      curtain.style.pointerEvents = 'none';

      setTimeout(() => {
        curtain.style.display = 'none';
      }, 750);

      // Activate glowing pin beacons on the map to invite interaction
      try {
        if (kenoshaMap && typeof kenoshaMap.activatePinBeacons === 'function') {
          setTimeout(() => {
            kenoshaMap.activatePinBeacons();
          }, 350);

          setTimeout(() => {
            kenoshaMap.deactivatePinBeacons();
          }, 14000);
        }
      } catch (err) {}
    };

    window.__dismissIntroCurtain = dismissCurtain;

    const showCurtain = () => {
      isDismissed = false;
      curtain.style.display = 'flex';
      curtain.style.pointerEvents = 'auto';
      void curtain.offsetWidth; // Force reflow
      curtain.classList.remove('fade-out');
    };

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
    const btnBottomPeek = document.getElementById('btn-bottom-sheet-peek');

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
      if (btnBottomPeek) {
        btnBottomPeek.classList.add('hidden');
        btnBottomPeek.setAttribute('aria-expanded', 'true');
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
      if (btnBottomPeek) {
        btnBottomPeek.classList.remove('hidden');
        btnBottomPeek.setAttribute('aria-expanded', 'false');
      }
    }

    // Trigger Leaflet viewport recalculation
    setTimeout(() => {
      if (kenoshaMap && kenoshaMap.map) {
        kenoshaMap.map.invalidateSize();
      }
    }, 300);
  }

  refreshMarkers() {
    const markers = markerStore.getAll();
    this.renderTOC();
    this.updateStats();
    try {
      if (kenoshaMap && typeof kenoshaMap.renderMarkers === 'function') {
        kenoshaMap.renderMarkers(markers, (id) => this.selectMarker(id, false));
      }
    } catch (e) {
      console.warn('Map marker rendering deferred:', e);
    }
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
                <div class="wpa-toc-thumb-wrap wpa-lightbox-trigger" data-id="${item.id}" title="Click to view full postcard & flip back" role="button" tabindex="0">
                  <img src="${item.imageUrl}" onerror="this.onerror=null;this.src=this.src.includes('assets/')?this.src.replace('assets/',''):'./assets/'+this.src.split('/').pop();" alt="${item.title}" class="wpa-toc-thumb" loading="lazy" />
                  <span class="wpa-toc-badge-overlay">${item.edition || `#${numOnly}`}</span>
                  <div class="wpa-toc-thumb-zoom-badge" aria-hidden="true">⟲ Flip</div>
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
            </div>
          </div>

          <div class="wpa-toc-card-actions">
            <button type="button" class="wpa-btn-card-map btn-card-fly" data-id="${item.id}" title="Locate ${item.title} on interactive map">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
              <span>View on Map</span>
            </button>
            <a class="wpa-btn-card-story" href="${substackUrl}" target="_blank" rel="noopener noreferrer" title="Read story on Substack (Opens in new tab)">
              <span>Substack Story</span>
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
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
    if (window.innerWidth <= 768 && zoomOnMap) {
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
    const peekCountEl = document.getElementById('peek-stat-total-cards');
    if (countEl) countEl.textContent = all.length;
    if (mobileCountEl) mobileCountEl.textContent = all.length;
    if (peekCountEl) peekCountEl.textContent = all.length;
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

    // Mobile View Switcher Buttons & Bottom Sheet Controls
    const btnMobileMap = document.getElementById('btn-mobile-view-map');
    const btnMobileIndex = document.getElementById('btn-mobile-view-index');
    const btnCloseMobileSidebar = document.getElementById('btn-close-sidebar-mobile');
    const sidebarBackdrop = document.getElementById('wpa-sidebar-backdrop');
    const btnBottomPeek = document.getElementById('btn-bottom-sheet-peek');
    const bottomSheetHandleBar = document.getElementById('wpa-bottom-sheet-handle-bar');

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

    if (btnBottomPeek) {
      btnBottomPeek.addEventListener('click', () => {
        this.setMobileView('index');
      });
    }

    if (bottomSheetHandleBar) {
      bottomSheetHandleBar.addEventListener('click', () => {
        this.setMobileView('map');
      });

      // Swipe down gesture detection on bottom sheet handle
      let touchStartY = 0;
      bottomSheetHandleBar.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      bottomSheetHandleBar.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        if (touchEndY - touchStartY > 35) {
          this.setMobileView('map');
        }
      }, { passive: true });
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
        if (window.innerWidth <= 768) {
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
      if (window.innerWidth > 768) {
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (btnBottomPeek) btnBottomPeek.classList.remove('hidden');
      } else {
        // Synchronize mobile switcher buttons
        if (this.currentMobileView === 'index') {
          if (sidebar) sidebar.classList.add('mobile-open');
          if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
          if (btnBottomPeek) btnBottomPeek.classList.add('hidden');
        } else {
          if (sidebar) sidebar.classList.remove('mobile-open');
          if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
          if (btnBottomPeek) btnBottomPeek.classList.remove('hidden');
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
    const plainTextToggleBtn = document.getElementById('btn-toggle-plain-text');
    const postcardBack = document.getElementById('lightbox-postcard-back');

    if (plainTextToggleBtn && postcardBack) {
      plainTextToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.isPlainTextMode = !this.isPlainTextMode;
        postcardBack.classList.toggle('plain-text-mode', this.isPlainTextMode);
        plainTextToggleBtn.classList.toggle('active', this.isPlainTextMode);
        plainTextToggleBtn.setAttribute('aria-pressed', this.isPlainTextMode ? 'true' : 'false');
        
        // If enabling plain text and currently viewing front artwork, flip to back so notes are visible
        if (this.isPlainTextMode) {
          const flipper = document.getElementById('lightbox-postcard-flipper');
          if (flipper && !flipper.classList.contains('is-flipped')) {
            this.togglePostcardFlip();
          }
        }

        try {
          localStorage.setItem('wpa_plain_text_mode', this.isPlainTextMode ? 'true' : 'false');
        } catch (err) {}
      });

      postcardBack.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

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
      flipper.classList.remove('is-portrait');
    }
    if (flipBtnText) {
      flipBtnText.textContent = 'Postcard Back ⟲';
    }

    const edition = item.edition || item.plannedEdition || 'Edition';
    const title = item.title || 'Untitled Kenosha Postcard';
    const address = item.address || 'Kenosha, WI';
    const notes = item.summary || item.notes || 'No notes or story recorded for this landmark yet.';
    const status = item.status || (item.isDefault ? 'Published Edition' : 'In Progress');
    const imageUrl = item.imageUrl || './assets/Todd Burleson - 00.jpeg';

    // Populate Front Artwork
    if (img) {
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight && img.naturalHeight > img.naturalWidth) {
          if (flipper) flipper.classList.add('is-portrait');
        } else {
          if (flipper) flipper.classList.remove('is-portrait');
        }
      };
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

    const backSubstackLink = document.getElementById('lightbox-back-substack');
    if (backSubstackLink) {
      if (item.link && item.link !== '#' && !item.link.startsWith('javascript')) {
        backSubstackLink.href = item.link;
        backSubstackLink.style.display = 'inline-flex';
      } else {
        backSubstackLink.style.display = 'none';
      }
    }

    // Update Deep Link URL Hash without reload
    try {
      history.replaceState(null, null, '#' + item.id);
    } catch (e) {}

    // Apply Plain Text Accessibility Mode if active
    const postcardBack = document.getElementById('lightbox-postcard-back');
    const plainTextToggleBtn = document.getElementById('btn-toggle-plain-text');
    if (postcardBack && plainTextToggleBtn) {
      postcardBack.classList.toggle('plain-text-mode', Boolean(this.isPlainTextMode));
      plainTextToggleBtn.classList.toggle('active', Boolean(this.isPlainTextMode));
      plainTextToggleBtn.setAttribute('aria-pressed', this.isPlainTextMode ? 'true' : 'false');
    }

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

    // Play subtle tactile card flip sound
    this.playCardFlipSound();
  }

  playCardFlipSound() {
    try {
      if (!this._flipAudio) {
        this._flipAudio = new Audio('assets/card-flip.mp3');
        this._flipAudio.volume = 0.5;
        this._flipAudio.preload = 'auto';
      }
      // Clone or reset to allow clean, responsive playback on fast repeated flips
      const sound = this._flipAudio.cloneNode();
      sound.volume = 0.5;
      const playPromise = sound.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this._flipAudio.currentTime = 0;
          this._flipAudio.play().catch(() => {});
        });
      }
    } catch (e) {
      // Audio playback fails gracefully if muted or unsupported
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
      if (sidebar && !sidebar.classList.contains('mobile-open') && window.innerWidth <= 768) {
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
      if (sidebar && window.innerWidth <= 768) {
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

    const params = new URLSearchParams(window.location.search);
    const curatorParam = params.get('curator') || params.get('plan') || params.get('planner') || params.get('drafts');
    const isParamActive = curatorParam && (curatorParam.toLowerCase() === 'true' || curatorParam === '1');
    const storedSession = sessionStorage.getItem('wpa_curator_mode');

    // Curator mode is strictly OFF by default for public safety.
    // It is ONLY active if explicitly requested via ?curator=true or already toggled ON in this session.
    if (isParamActive) {
      this.isCuratorMode = true;
      sessionStorage.setItem('wpa_curator_mode', 'true');
    } else if (storedSession === 'true') {
      this.isCuratorMode = true;
    } else {
      this.isCuratorMode = false;
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

    // Badge and backup button are ONLY visible when Curator Mode is actively ON
    if (badge) {
      badge.style.display = this.isCuratorMode ? 'inline-flex' : 'none';
      badge.classList.toggle('active', this.isCuratorMode);
      badge.classList.toggle('inactive', !this.isCuratorMode);
      if (countEl) {
        countEl.textContent = plannedList.length > 0 ? `(${plannedList.length})` : '';
      }
    }

    if (backupBtn) {
      backupBtn.style.display = (this.isCuratorMode && plannedList.length > 0) ? 'inline-flex' : 'none';
    }

    if (this.isCuratorMode) {
      kenoshaMap.renderPlannedMarkers(plannedList);
      kenoshaMap.setPlannedLayerVisibility(true);
    } else {
      kenoshaMap.setPlannedLayerVisibility(false);
    }
    kenoshaMap.renderMarkers(markerStore.getPublished(), (id) => this.selectMarker(id));
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


  // =========================================================================
  // BOOTSTRAP INITIALIZATION
  // =========================================================================
  function bootstrapApp() {
    try {
      if (!window.app) {
        window.app = new GreetingsApp();
        window.app.init();
      }
    } catch (e) {
      console.error('GreetingsApp bootstrap error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapApp);
  } else {
    bootstrapApp();
  }
})();
