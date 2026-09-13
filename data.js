/**
 * Greetings From Kenosha - Postcard Editions Data Store
 * Default Postcards: No. 00, No. 01, No. 02, No. 03, No. 04, No. 05
 */

const STORAGE_KEY = 'greetings_from_kenosha_markers_v6';

// Pre-populated default collection of Postcards
export const DEFAULT_MARKERS = [
  {
    id: 'kenosha-00',
    title: 'Greetings from Kenosha Mural',
    address: '5500 Sixth Ave, Kenosha, WI',
    lat: 42.5858139,
    lng: -87.8191389,
    edition: 'No. 00',
    editionNum: 0,
    imageUrl: './card-00.jpg',
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
    imageUrl: './card-01.jpg',
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
    imageUrl: './card-02.jpg',
    summary: 'The Fish Shanty That Learned to Steam Milk. Situated along the north side of the harbor basin, this cozy lakeside café sits in a 1928 Milwaukee Cream City brick building steeped in maritime heritage, offering espresso and views across the water.',
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
    imageUrl: './card-03.jpg',
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
    imageUrl: './card-04.jpg',
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
    imageUrl: './card-05.jpg',
    summary: 'The Sentinel on the Sands. Built in 1866 of Milwaukee Cream City brick, this 55-foot conical lighthouse stands as a timeless beacon on Simmons Island, preserving Kenosha\'s rich maritime heritage.',
    link: 'https://whereimaginationtakesflight.substack.com/p/field-journal-no-05?r=4abqy&utm_campaign=post&utm_medium=web&showWelcomeOnShare=true',
    year: '1866',
    artist: 'Todd Burleson',
    tags: ['Lighthouse', 'Simmons Island', 'Cream City Brick', 'Historic Landmark', 'Lake Michigan'],
    isDefault: true,
    dateAdded: '2026-09-12T21:26:00Z'
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
    
    const combined = [];
    const seenIds = new Set();

    if (Array.isArray(list)) {
      for (const item of list) {
        if (!deletedIds.has(item.id)) {
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
      if (!seenIds.has(item.id) && !deletedIds.has(item.id)) {
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

export const markerStore = new MarkerStore();

