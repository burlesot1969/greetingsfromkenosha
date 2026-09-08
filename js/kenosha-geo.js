/**
 * Kenosha Waterfront, Parks & WPA Landmark Boundaries (GeoJSON / Feature Layers)
 * Enhances the 1930s WPA Poster aesthetic with sage green parks and muted teal Lake Michigan waters.
 */

export const KENOSHA_BOUNDS = {
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
export const KENOSHA_PARKS_GEOJSON = {
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
export const KENOSHA_BOUNDING_LINES = {
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
