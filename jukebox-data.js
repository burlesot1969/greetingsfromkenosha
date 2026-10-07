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

export const JUKEBOX_ERAS = [
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
    subLabel: 'Depression Radio & Hits',
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

export const JUKEBOX_TRACKS = [
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
