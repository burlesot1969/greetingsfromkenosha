/**
 * Greetings From Kenosha - Postcard Editions Data Store
 * Default Postcards: No. 00, No. 01, No. 02, No. 03
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
    lat: 42.58385,
    lng: -87.82485,
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
    lat: 42.58978,
    lng: -87.81878,
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
  }
];

class MarkerStore {
  constructor() {
    this.markers = [...DEFAULT_MARKERS];
    this.plannedMarkers = [];
    this.listeners = [];
  }

  setPlannedMarkers(list) {
    const localStored = this.loadLocalPlanned();
    const combined = Array.isArray(list) ? [...list] : [];
    
    // Merge any locally added planned pins that aren't yet in the file
    const existingIds = new Set(combined.map(m => m.id));
    for (const item of localStored) {
      if (!existingIds.has(item.id)) {
        combined.push(item);
        existingIds.add(item.id);
      }
    }

    this.plannedMarkers = combined;
    this.notify();
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

  saveLocalPlanned() {
    try {
      localStorage.setItem('wpa_local_planned_markers', JSON.stringify(this.plannedMarkers));
    } catch (e) {
      console.warn('Could not save planned markers to localStorage', e);
    }
  }

  loadLocalPlanned() {
    try {
      const stored = localStorage.getItem('wpa_local_planned_markers');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load planned markers from localStorage', e);
    }
    return [];
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

