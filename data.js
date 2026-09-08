/**
 * Greetings From Kenosha - Postcard Editions Data Store
 * Default Postcards: No. 00, No. 01, No. 02
 */

const STORAGE_KEY = 'greetings_from_kenosha_markers_v5';

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
    imageUrl: './assets/card-00.jpg',
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
    lat: 42.58385,
    lng: -87.82485,
    edition: 'No. 01',
    editionNum: 1,
    imageUrl: './assets/card-01.jpg',
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
    lat: 42.58978,
    lng: -87.81878,
    edition: 'No. 02',
    editionNum: 2,
    imageUrl: './assets/card-02.jpg',
    summary: 'The Fish Shanty That Learned to Steam Milk. Situated along the north side of the harbor basin, this cozy lakeside café sits in a 1928 Milwaukee Cream City brick building steeped in maritime heritage, offering espresso and views across the water.',
    link: 'https://whereimaginationtakesflight.substack.com/p/field-journal-02?r=4abqy&utm_campaign=post-expanded-share&utm_medium=web',
    year: '1928',
    artist: 'Todd Burleson',
    tags: ['Harbor', 'Coffee Shop', 'Historic Building', 'Cream City Brick'],
    isDefault: true,
    dateAdded: '2026-09-08T01:00:00Z'
  }
];

class MarkerStore {
  constructor() {
    this.markers = this.loadMarkers();
    this.listeners = [];
  }

  loadMarkers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge any newly introduced default markers if missing
          const existingIds = new Set(parsed.map(m => m.id));
          const missingDefaults = DEFAULT_MARKERS.filter(d => !existingIds.has(d.id));
          if (missingDefaults.length > 0) {
            const combined = [...parsed, ...missingDefaults];
            return combined;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using default markers.', e);
    }
    return [...DEFAULT_MARKERS];
  }

  saveMarkers() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.markers));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    this.notify();
  }

  getAll() {
    return [...this.markers].sort((a, b) => {
      const numA = typeof a.editionNum === 'number' ? a.editionNum : 999;
      const numB = typeof b.editionNum === 'number' ? b.editionNum : 999;
      return numA - numB;
    });
  }

  getById(id) {
    return this.markers.find(m => m.id === id) || null;
  }

  addMarker(markerData) {
    const id = markerData.id || `kenosha-${Date.now()}`;
    const editionDigits = (markerData.edition || '').replace(/\D/g, '');
    const parsedNum = editionDigits !== '' ? parseInt(editionDigits, 10) : NaN;
    const editionNum = !isNaN(parsedNum) ? parsedNum : this.markers.length;
    const newMarker = {
      ...markerData,
      id,
      edition: markerData.edition || `No. ${String(editionNum).padStart(2, '0')}`,
      editionNum: editionNum,
      lat: parseFloat(markerData.lat),
      lng: parseFloat(markerData.lng),
      dateAdded: new Date().toISOString()
    };

    this.markers.push(newMarker);
    this.saveMarkers();
    return newMarker;
  }

  updateMarker(id, updatedData) {
    const idx = this.markers.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.markers[idx] = {
        ...this.markers[idx],
        ...updatedData,
        lat: parseFloat(updatedData.lat ?? this.markers[idx].lat),
        lng: parseFloat(updatedData.lng ?? this.markers[idx].lng)
      };
      this.saveMarkers();
      return this.markers[idx];
    }
    return null;
  }

  deleteMarker(id) {
    this.markers = this.markers.filter(m => m.id !== id);
    this.saveMarkers();
  }

  resetToDefaults() {
    this.markers = [...DEFAULT_MARKERS];
    this.saveMarkers();
  }

  exportJSON() {
    return JSON.stringify(this.markers, null, 2);
  }

  exportDataJS() {
    const dataList = JSON.stringify(this.getAll(), null, 2);
    return `/**\n * Greetings From Kenosha - Postcard Editions Data Store\n */\n\nconst STORAGE_KEY = 'greetings_from_kenosha_markers_v5';\n\nexport const DEFAULT_MARKERS = ${dataList};\n\n${this.getClassCode()}`;
  }

  getClassCode() {
    return MarkerStoreCode;
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) throw new Error('Invalid JSON format: expected an array');
      for (const item of parsed) {
        if (!item.title || !item.lat || !item.lng) {
          throw new Error('Each marker requires a title, lat, and lng.');
        }
      }
      this.markers = parsed;
      this.saveMarkers();
      return true;
    } catch (err) {
      throw err;
    }
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

const MarkerStoreCode = `class MarkerStore {
  constructor() {
    this.markers = this.loadMarkers();
    this.listeners = [];
  }

  loadMarkers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map(m => m.id));
          const missingDefaults = DEFAULT_MARKERS.filter(d => !existingIds.has(d.id));
          if (missingDefaults.length > 0) {
            return [...parsed, ...missingDefaults];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using default markers.', e);
    }
    return [...DEFAULT_MARKERS];
  }

  saveMarkers() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.markers));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    this.notify();
  }

  getAll() {
    return [...this.markers].sort((a, b) => {
      const numA = typeof a.editionNum === 'number' ? a.editionNum : 999;
      const numB = typeof b.editionNum === 'number' ? b.editionNum : 999;
      return numA - numB;
    });
  }

  getById(id) {
    return this.markers.find(m => m.id === id) || null;
  }

  addMarker(markerData) {
    const id = markerData.id || \`kenosha-\${Date.now()}\`;
    const editionDigits = (markerData.edition || '').replace(/\\D/g, '');
    const parsedNum = editionDigits !== '' ? parseInt(editionDigits, 10) : NaN;
    const editionNum = !isNaN(parsedNum) ? parsedNum : this.markers.length;
    const newMarker = {
      ...markerData,
      id,
      edition: markerData.edition || \`No. \${String(editionNum).padStart(2, '0')}\`,
      editionNum: editionNum,
      lat: parseFloat(markerData.lat),
      lng: parseFloat(markerData.lng),
      dateAdded: new Date().toISOString()
    };

    this.markers.push(newMarker);
    this.saveMarkers();
    return newMarker;
  }

  updateMarker(id, updatedData) {
    const idx = this.markers.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.markers[idx] = {
        ...this.markers[idx],
        ...updatedData,
        lat: parseFloat(updatedData.lat ?? this.markers[idx].lat),
        lng: parseFloat(updatedData.lng ?? this.markers[idx].lng)
      };
      this.saveMarkers();
      return this.markers[idx];
    }
    return null;
  }

  deleteMarker(id) {
    this.markers = this.markers.filter(m => m.id !== id);
    this.saveMarkers();
  }

  resetToDefaults() {
    this.markers = [...DEFAULT_MARKERS];
    this.saveMarkers();
  }

  exportJSON() {
    return JSON.stringify(this.markers, null, 2);
  }

  exportDataJS() {
    const dataList = JSON.stringify(this.getAll(), null, 2);
    return \`/**\\n * Greetings From Kenosha - Postcard Editions Data Store\\n */\\n\\nconst STORAGE_KEY = 'greetings_from_kenosha_markers_v5';\\n\\nexport const DEFAULT_MARKERS = \${dataList};\\n\\n\${this.getClassCode()}\`;
  }

  getClassCode() {
    return MarkerStoreCode;
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) throw new Error('Invalid JSON format: expected an array');
      for (const item of parsed) {
        if (!item.title || !item.lat || !item.lng) {
          throw new Error('Each marker requires a title, lat, and lng.');
        }
      }
      this.markers = parsed;
      this.saveMarkers();
      return true;
    } catch (err) {
      throw err;
    }
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
`;

export const markerStore = new MarkerStore();
